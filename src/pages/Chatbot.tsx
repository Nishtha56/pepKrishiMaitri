import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { chatAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, Send, ArrowLeft, Sparkles, Sprout, CloudRain, Bug, TrendingUp, Loader2, Mic, MicOff,
  Menu, PlusCircle, Trash2, X, MessageSquare
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatConversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Utility functions for localStorage
const STORAGE_KEY = 'krishi_chat_conversations';
const ACTIVE_CHAT_KEY = 'krishi_active_chat_id';

const saveConversations = (conversations: ChatConversation[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error('Failed to save conversations:', error);
  }
};

const loadConversations = (): ChatConversation[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const conversations = JSON.parse(data);
    // Convert date strings back to Date objects
    return conversations.map((conv: any) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      messages: conv.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  } catch (error) {
    console.error('Failed to load conversations:', error);
    return [];
  }
};

const saveActiveId = (id: string) => {
  localStorage.setItem(ACTIVE_CHAT_KEY, id);
};

const loadActiveId = (): string | null => {
  return localStorage.getItem(ACTIVE_CHAT_KEY);
};

// Generate conversation title from first user message
const generateTitle = (message: string): string => {
  const cleaned = message.trim().substring(0, 50);
  return cleaned.length < message.length ? `${cleaned}...` : cleaned;
};

// Format relative time
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

// Format AI response with markdown-like formatting
const formatMessage = (text: string) => {
  const lines = text.split('\n');
  
  const applyBoldFormatting = (content: string, lineIndex: number) => {
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    const boldPattern = /\*\*(.+?)\*\*/g;
    let match;
    
    while ((match = boldPattern.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={`bold-${lineIndex}-${match.index}`} className="font-bold text-emerald-300">
          {match[1]}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : content;
  };
  
  return lines.map((line, index) => {
    const trimmedLine = line.trim();
    
    const numberMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
    if (numberMatch) {
      const content = numberMatch[2];
      return (
        <div key={index} className="flex gap-2 ml-2 my-1">
          <span className="text-emerald-400 font-semibold shrink-0">{numberMatch[1]}.</span>
          <span>{applyBoldFormatting(content, index)}</span>
        </div>
      );
    }

    const bulletMatch = trimmedLine.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      const content = bulletMatch[1];
      return (
        <div key={index} className="flex gap-2 ml-2 my-1">
          <span className="text-emerald-400 mt-1 shrink-0">•</span>
          <span>{applyBoldFormatting(content, index)}</span>
        </div>
      );
    }

    return trimmedLine ? (
      <p key={index} className="my-1">{applyBoldFormatting(line, index)}</p>
    ) : (
      <br key={index} />
    );
  });
};

const Chatbot = () => {
  const welcomeMessage: Message = {
    id: "welcome",
    role: "assistant",
    content: "Namaste! I am **Krishi Saathi**, your AI farming assistant. How can I help you today?",
    timestamp: new Date(),
  };

  // Chat history state
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Current chat state
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Initialize conversations on mount
  useEffect(() => {
    const savedConversations = loadConversations();
    const savedActiveId = loadActiveId();

    if (savedConversations.length === 0) {
      // Create first conversation
      createNewChat();
    } else {
      setConversations(savedConversations);
      const activeId = savedActiveId && savedConversations.find(c => c.id === savedActiveId)
        ? savedActiveId
        : savedConversations[0].id;
      setActiveConversationId(activeId);
      const activeConv = savedConversations.find(c => c.id === activeId);
      if (activeConv) {
        setMessages(activeConv.messages);
      }
    }
  }, []);

  // Save current conversation whenever messages change
  useEffect(() => {
    if (activeConversationId && messages.length > 0) {
      saveCurrentConversation();
    }
  }, [messages]);

  const createNewChat = () => {
    const newConversation: ChatConversation = {
      id: `chat_${Date.now()}`,
      title: "New Chat",
      messages: [welcomeMessage],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedConversations = [newConversation, ...conversations];
    setConversations(updatedConversations);
    setActiveConversationId(newConversation.id);
    setMessages([welcomeMessage]);
    saveConversations(updatedConversations);
    saveActiveId(newConversation.id);
    setSidebarOpen(false);
  };

  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (conversations.length === 1) {
      // If deleting last chat, create new one
      createNewChat();
      return;
    }

    const updatedConversations = conversations.filter(c => c.id !== id);
    setConversations(updatedConversations);
    saveConversations(updatedConversations);

    if (id === activeConversationId) {
      // Switch to most recent conversation
      const newActive = updatedConversations[0];
      setActiveConversationId(newActive.id);
      setMessages(newActive.messages);
      saveActiveId(newActive.id);
    }

    toast({ title: "Chat deleted" });
  };

  const switchChat = (id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setActiveConversationId(id);
      setMessages(conversation.messages);
      saveActiveId(id);
      setSidebarOpen(false);
    }
  };

  const saveCurrentConversation = () => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversationId) {
        // Update title from first user message if still "New Chat"
        let title = conv.title;
        if (title === "New Chat" && messages.length > 1) {
          const firstUserMessage = messages.find(m => m.role === "user");
          if (firstUserMessage) {
            title = generateTitle(firstUserMessage.content);
          }
        }

        return {
          ...conv,
          title,
          messages,
          updatedAt: new Date()
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    saveConversations(updatedConversations);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    { label: "Crop advice", icon: <Sprout className="w-4 h-4" />, prompt: "What crops should I grow this season?", color: "emerald" },
    { label: "Weather updates", icon: <CloudRain className="w-4 h-4" />, prompt: "What's the weather forecast for farming this week?", color: "emerald" },
    { label: "Pest control", icon: <Bug className="w-4 h-4" />, prompt: "How do I control pests in my rice field?", color: "green" },
    { label: "MSP prices", icon: <TrendingUp className="w-4 h-4" />, prompt: "What are the current MSP prices for wheat?", color: "green" },
  ];

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({
        title: "Error",
        description: "Could not capture voice. Please try again.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await chatAPI.send(text);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.reply || response.response || "I'm sorry, I couldn't process your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-black flex relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-green-500/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop overlay - works on all screen sizes */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            
            {/* Sidebar content */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed w-[280px] h-full bg-gradient-to-b from-green-900/30 via-emerald-900/25 to-green-800/30 backdrop-blur-3xl border-r border-emerald-500/30 z-50 flex flex-col"
            >
              {/* Sidebar header */}
              <div className="p-4 border-b border-emerald-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-black text-sm uppercase tracking-wider">Chat History</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
                
                {/* New Chat button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={createNewChat}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 rounded-[1.2rem] px-4 py-3 flex items-center justify-center gap-2 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  New Chat
                </motion.button>
              </div>

              {/* Conversations list */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {conversations.length === 0 ? (
                  <div className="text-center text-zinc-500 text-sm py-8">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <motion.div
                      key={conv.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02, x: 2 }}
                      onClick={() => switchChat(conv.id)}
                      className={`group relative p-3 rounded-[1.2rem] cursor-pointer transition-all ${
                        conv.id === activeConversationId
                          ? 'bg-emerald-500/10 border-l-4 border-emerald-500'
                          : 'bg-white/5 hover:bg-white/10 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm truncate">
                            {conv.title}
                          </h3>
                          <p className="text-zinc-500 text-xs mt-1">
                            {formatRelativeTime(conv.updatedAt)}
                          </p>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => deleteChat(conv.id, e)}
                          className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-gradient-to-r from-green-900/30 via-emerald-900/25 to-green-800/30 backdrop-blur-3xl border-b border-emerald-500/30 text-white py-4 px-4 relative z-30 shadow-[0_4px_30px_rgba(16,185,129,0.15)] shrink-0"
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Sidebar toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-11 h-11 rounded-[1.2rem] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 flex items-center justify-center transition-all shadow-lg"
              >
                <Menu className="w-5 h-5 text-emerald-400" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, rotate: -90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => navigate("/dashboard")}
                className="w-11 h-11 rounded-[1.2rem] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 flex items-center justify-center transition-all shadow-lg"
              >
                <ArrowLeft className="w-5 h-5 text-emerald-400" />
              </motion.button>
              
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Bot className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-base font-black tracking-tight uppercase">Krishi Saathi</h1>
                  <p className="text-[11px] text-emerald-400/80 font-medium">AI-powered farming assistant</p>
                </div>
              </motion.div>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </motion.div>
          </div>
        </motion.header>

        {/* Messages Area */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6 relative z-10">
          <div className="container mx-auto max-w-4xl">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.22, 1, 0.36, 1],
                    delay: index * 0.05 
                  }}
                  className="mb-6"
                >
                  {message.role === "assistant" ? (
                    <motion.div 
                      className="flex gap-3 items-start"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div 
                        className="w-10 h-10 rounded-[1rem] bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Bot className="w-5 h-5 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <motion.div 
                          className="bg-gradient-to-br from-green-900/40 via-emerald-900/30 to-green-800/40 backdrop-blur-xl border border-emerald-500/20 rounded-[2rem] rounded-tl-lg px-5 py-4 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="text-sm text-zinc-100 leading-relaxed">
                            {formatMessage(message.content)}
                          </div>
                          <p className="text-[10px] text-emerald-500/60 mt-2 font-medium">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="flex justify-end"
                      whileHover={{ x: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div 
                        className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-[2rem] rounded-br-lg px-5 py-3.5 max-w-[80%] shadow-lg shadow-emerald-500/20"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-sm text-white leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
                        <p className="text-[10px] text-emerald-100/60 mt-1.5 text-right font-medium">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3 items-start mb-6"
              >
                <div className="w-10 h-10 rounded-[1rem] bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gradient-to-br from-green-900/40 via-emerald-900/30 to-green-800/40 backdrop-blur-xl border border-emerald-500/20 rounded-[2rem] rounded-tl-lg px-5 py-4 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                  <motion.div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-4 h-4 text-emerald-400" />
                    </motion.div>
                    <motion.span 
                      className="text-sm text-zinc-300"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Thinking...
                    </motion.span>
                  </motion.div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <motion.div 
          className="bg-black/60 backdrop-blur-2xl border-t border-emerald-500/20 px-4 py-3 relative z-20 shadow-[0_-10px_30px_rgba(16,185,129,0.1)] shrink-0"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="container mx-auto max-w-4xl space-y-3">
            <div className="flex gap-3 items-center">
              <motion.input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder={isListening ? "Listening..." : "Ask about crops, weather, pests..."}
                disabled={loading || isListening}
                whileFocus={{ scale: 1.01 }}
                className="flex-1 bg-white/5 backdrop-blur-xl border border-emerald-500/20 rounded-[2rem] px-6 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50 text-sm shadow-lg"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startListening}
                disabled={loading || isListening}
                className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all disabled:cursor-not-allowed shadow-lg ${
                  isListening 
                    ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30' 
                    : 'bg-white/10 hover:bg-white/15 border border-emerald-500/20 hover:border-emerald-500/40'
                }`}
              >
                {isListening ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <MicOff className="w-5 h-5 text-white" />
                  </motion.div>
                ) : (
                  <Mic className="w-5 h-5 text-emerald-400" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSend()}
                disabled={loading || !input.trim() || isListening}
                className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 disabled:from-zinc-700 disabled:to-zinc-600 flex items-center justify-center transition-all disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30"
              >
                <Send className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 justify-center">
              {quickPrompts.map((prompt, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend(prompt.prompt)}
                  disabled={loading || isListening}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 rounded-[1.5rem] text-sm text-zinc-300 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <motion.span 
                    className="text-emerald-400"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {prompt.icon}
                  </motion.span>
                  {prompt.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chatbot;
