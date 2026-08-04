import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { journalAPI, chatAPI } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, Plus, Sparkles, Loader2, X, BookOpen, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type EntryType = 'sowing' | 'irrigation' | 'fertilizer' | 'pest' | 'harvest';

interface JournalEntry {
  _id: string;
  entryType: EntryType;
  entryDate: string;
  cropName: string | null;
  notes: string | null;
  quantity: string | null;
  createdAt: string;
}

const entryIcons: Record<EntryType, string> = {
  sowing: "🌱",
  irrigation: "💧",
  fertilizer: "🧪",
  pest: "🐛",
  harvest: "🌾"
};

const entryColors: Record<EntryType, string> = {
  sowing: "from-emerald-500 to-green-600",
  irrigation: "from-blue-500 to-cyan-600",
  fertilizer: "from-purple-500 to-violet-600",
  pest: "from-red-500 to-rose-600",
  harvest: "from-amber-500 to-yellow-600"
};

const entryDotColors: Record<EntryType, string> = {
  sowing: "bg-emerald-500 shadow-emerald-500/50",
  irrigation: "bg-blue-500 shadow-blue-500/50",
  fertilizer: "bg-purple-500 shadow-purple-500/50",
  pest: "bg-red-500 shadow-red-500/50",
  harvest: "bg-amber-500 shadow-amber-500/50"
};

export default function Journal() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [aiTips, setAiTips] = useState<string>("");
  const [loadingTips, setLoadingTips] = useState(false);
  
  const [entryType, setEntryType] = useState<EntryType>("sowing");
  const [entryDate, setEntryDate] = useState<Date>(new Date());
  const [cropName, setCropName] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem('digikheti_token');
      if (!token) {
        navigate("/auth");
        return;
      }

      const { entries: data } = await journalAPI.getAll();
      setEntries((data || []) as JournalEntry[]);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await journalAPI.create({
        entryType,
        entryDate: format(entryDate, "yyyy-MM-dd"),
        cropName: cropName || null,
        notes: notes || null,
        quantity: quantity || null
      });

      toast({ title: t("journal.entryAdded"), description: t("journal.entryAddedDesc") });
      setShowForm(false);
      resetForm();
      fetchEntries();
    } catch (error) {
      console.error("Error adding entry:", error);
      toast({ title: t("common.error"), description: "Failed to add entry.", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setEntryType("sowing");
    setEntryDate(new Date());
    setCropName("");
    setNotes("");
    setQuantity("");
  };

  const getAiTips = async () => {
    if (entries.length === 0) {
      toast({ title: t("journal.noEntriesForTips") });
      return;
    }

    setLoadingTips(true);
    try {
      const entrySummary = entries.slice(0, 10).map(e => 
        `${e.entryDate}: ${entryIcons[e.entryType]} ${e.entryType} - ${e.cropName || 'General'} ${e.notes ? `(${e.notes})` : ''}`
      ).join('\n');

      const message = `Based on this farmer's journal history, provide 3-4 brief, actionable predictions and tips for their upcoming farming activities. Be specific and practical.\n\nJournal History:\n${entrySummary}`;
      
      const data = await chatAPI.send(message);
      setAiTips(data.response);
    } catch (error) {
      console.error("Error getting AI tips:", error);
      toast({ title: t("common.error"), description: "Failed to get AI predictions.", variant: "destructive" });
    } finally {
      setLoadingTips(false);
    }
  };

  const groupedEntries = entries.reduce((acc, entry) => {
    const month = format(new Date(entry.entryDate), "MMMM yyyy");
    if (!acc[month]) acc[month] = [];
    acc[month].push(entry);
    return acc;
  }, {} as Record<string, JournalEntry[]>);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-emerald-500 mb-4" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p className="text-emerald-400 font-semibold">Loading journal...</p>
          <p className="text-sm text-zinc-500 mt-1">Fetching your farm activities</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Glow Effects - Green theme */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[600px] h-[600px] bg-green-500/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header - Green Glassmorphism */}
      <motion.header 
        className="bg-gradient-to-r from-emerald-900/30 via-green-900/25 to-emerald-800/30 backdrop-blur-3xl border-b border-emerald-500/30 text-white py-4 px-4 shadow-[0_4px_30px_rgba(16,185,129,0.15)] sticky top-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, rotate: -90 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="w-11 h-11 rounded-[1.2rem] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 flex items-center justify-center transition-all shadow-lg"
          >
            <ArrowLeft className="h-5 w-5 text-emerald-400" />
          </motion.button>
          <motion.div
            className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <BookOpen className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-base font-black tracking-tight uppercase">{t("journal.title")}</h1>
            <p className="text-[11px] text-emerald-400/80 font-medium">Track your farm activities</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full text-sm font-bold">
              {entries.length} entries
            </span>
          </div>
        </div>
      </motion.header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 relative z-10">
        {/* Action Buttons */}
        <motion.div 
          className="flex gap-3 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white rounded-[1.2rem] px-5 py-3 font-bold shadow-lg shadow-emerald-500/30 flex items-center"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Close" : t("journal.addEntry")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={getAiTips}
            disabled={loadingTips}
            className="gap-2 bg-white/5 hover:bg-white/10 border border-amber-500/30 text-amber-300 rounded-[1.2rem] px-5 py-3 font-bold flex items-center disabled:opacity-50"
          >
            {loadingTips ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Loader2 className="h-4 w-4" />
              </motion.div>
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {t("journal.getAiTips")}
          </motion.button>
        </motion.div>

        {/* Add Entry Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-emerald-900/40 via-green-900/30 to-emerald-800/40 backdrop-blur-xl border border-emerald-500/20 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="h-10 w-10 rounded-[1rem] bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <Plus className="h-5 w-5 text-emerald-400" />
                </div>
                <h2 className="text-lg font-black text-white uppercase tracking-tight">{t("journal.newEntry")}</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-emerald-300 uppercase tracking-wider">{t("journal.entryType")}</Label>
                    <Select value={entryType} onValueChange={(v) => setEntryType(v as EntryType)}>
                      <SelectTrigger className="rounded-[1rem] bg-white/5 border-emerald-500/30 text-white hover:bg-white/10 transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl bg-zinc-900 border-emerald-500/30">
                        <SelectItem value="sowing" className="text-white focus:bg-white/10">🌱 {t("journal.types.sowing")}</SelectItem>
                        <SelectItem value="irrigation" className="text-white focus:bg-white/10">💧 {t("journal.types.irrigation")}</SelectItem>
                        <SelectItem value="fertilizer" className="text-white focus:bg-white/10">🧪 {t("journal.types.fertilizer")}</SelectItem>
                        <SelectItem value="pest" className="text-white focus:bg-white/10">🐛 {t("journal.types.pest")}</SelectItem>
                        <SelectItem value="harvest" className="text-white focus:bg-white/10">🌾 {t("journal.types.harvest")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-emerald-300 uppercase tracking-wider">{t("journal.date")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className={cn("w-full justify-start text-left font-normal rounded-[1rem] bg-white/5 border-emerald-500/30 text-white hover:bg-white/10")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-emerald-400" />
                          {format(entryDate, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-xl bg-zinc-900 border-emerald-500/30" align="start">
                        <Calendar
                          mode="single"
                          selected={entryDate}
                          onSelect={(d) => d && setEntryDate(d)}
                          initialFocus
                          className="pointer-events-auto rounded-xl"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-emerald-300 uppercase tracking-wider">{t("journal.cropName")}</Label>
                    <Input 
                      value={cropName} 
                      onChange={(e) => setCropName(e.target.value)} 
                      placeholder={t("journal.cropPlaceholder")} 
                      className="rounded-[1rem] bg-white/5 border-emerald-500/30 text-white placeholder:text-zinc-500 hover:bg-white/10 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-emerald-300 uppercase tracking-wider">{t("journal.quantity")}</Label>
                    <Input 
                      value={quantity} 
                      onChange={(e) => setQuantity(e.target.value)} 
                      placeholder={t("journal.quantityPlaceholder")} 
                      className="rounded-[1rem] bg-white/5 border-emerald-500/30 text-white placeholder:text-zinc-500 hover:bg-white/10 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-emerald-300 uppercase tracking-wider">{t("journal.notes")}</Label>
                  <Textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder={t("journal.notesPlaceholder")} 
                    rows={3} 
                    className="rounded-[1rem] bg-white/5 border-emerald-500/30 text-white placeholder:text-zinc-500 hover:bg-white/10 transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white rounded-[1.2rem] px-6 py-3 font-bold shadow-lg shadow-emerald-500/30"
                  >
                    {t("journal.saveEntry")}
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(false)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-[1.2rem] px-6 py-3 font-bold"
                  >
                    {t("common.cancel")}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Tips */}
        <AnimatePresence>
          {aiTips && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-amber-900/40 via-yellow-900/30 to-amber-800/40 backdrop-blur-xl border border-amber-500/20 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(245,158,11,0.1)]"
            >
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="h-6 w-6 text-amber-400" />
                </motion.div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">{t("journal.aiPredictions")}</h3>
                <span className="ml-2 bg-amber-500/20 text-amber-300 border-0 text-xs px-2 py-1 rounded-full font-bold">
                  AI Powered
                </span>
              </div>

              <div className="text-sm prose prose-sm max-w-none text-zinc-200">
                <ReactMarkdown
                  components={{
                    strong: ({children}) => <strong className="font-bold text-amber-300">{children}</strong>,
                    ul: ({children}) => <ul className="list-disc ml-4 my-2 space-y-1">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal ml-4 my-2 space-y-1">{children}</ol>,
                    li: ({children}) => <li className="my-0.5 leading-relaxed">{children}</li>,
                    p: ({children}) => <p className="my-2 leading-relaxed">{children}</p>,
                    h1: ({children}) => <h1 className="text-lg font-bold my-3 text-amber-300">{children}</h1>,
                    h2: ({children}) => <h2 className="text-base font-bold my-2 text-amber-300">{children}</h2>,
                    h3: ({children}) => <h3 className="text-sm font-bold my-2 text-amber-300">{children}</h3>,
                  }}
                >
                  {aiTips}
                </ReactMarkdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-emerald-900/40 via-green-900/30 to-emerald-800/40 backdrop-blur-xl border border-emerald-500/20 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
        >
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/10">
            <div className="h-10 w-10 rounded-[1rem] bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <span className="text-2xl">📅</span>
            </div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">{t("journal.activityTimeline")}</h2>
            {entries.length > 0 && (
              <span className="ml-2 bg-white/10 text-zinc-300 border-0 text-xs px-2 py-1 rounded-full font-bold">
                {entries.length} activities
              </span>
            )}
          </div>

          {entries.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="h-20 w-20 mx-auto mb-4 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/10">
                <BookOpen className="h-10 w-10 text-emerald-400" />
              </div>
              <p className="text-white font-medium">{t("journal.noEntries")}</p>
              <p className="text-zinc-400 text-sm mt-1">Start by adding your first farm activity</p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedEntries).map(([month, monthEntries]) => (
                <div key={month}>
                  <h3 className="font-semibold text-sm text-emerald-400 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {month}
                  </h3>
                  <div className="space-y-3 border-l-2 border-emerald-500/20 pl-6 ml-2">
                    {monthEntries.map((entry, idx) => (
                      <motion.div 
                        key={entry._id} 
                        className="relative"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ x: 4 }}
                      >
                        <div className={cn(
                          "absolute -left-[29px] w-4 h-4 rounded-full border-2 border-black shadow-lg",
                          entryDotColors[entry.entryType]
                        )} />
                        <motion.div 
                          className={cn(
                            "p-4 rounded-[1.2rem] bg-gradient-to-r border shadow-lg",
                            `${entryColors[entry.entryType]} border-white/10`
                          )}
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-2xl">{entryIcons[entry.entryType]}</span>
                            <span className="text-xs font-bold bg-white/20 text-white border-0 rounded-full px-3 py-1 backdrop-blur-sm">
                              {t(`journal.types.${entry.entryType}`)}
                            </span>
                            <span className="text-xs text-white/70 font-medium">
                              {format(new Date(entry.entryDate), "MMM d, yyyy")}
                            </span>
                            {entry.cropName && (
                              <span className="text-sm font-bold text-white">• {entry.cropName}</span>
                            )}
                          </div>
                          {(entry.notes || entry.quantity) && (
                            <p className="text-sm text-white/80 mt-2">
                              {entry.quantity && <span className="font-semibold">{entry.quantity}</span>}
                              {entry.quantity && entry.notes && " — "}
                              {entry.notes}
                            </p>
                          )}
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}