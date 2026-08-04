import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, Mail, Phone, MapPin, Send, Loader2, 
  MessageCircle, Building2, Globe, Twitter, Facebook, 
  Instagram, Linkedin, Sparkles
} from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(t('contact.messageSent'));
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const contactInfo = [
    {
      icon: Mail,
      title: t('contact.emailUs'),
      value: t('contact.emailValue'),
      description: t('contact.emailDesc'),
      gradient: "from-blue-500 to-cyan-600",
      borderColor: "border-blue-500/20"
    },
    {
      icon: Phone,
      title: t('contact.callUs'),
      value: t('contact.callValue'),
      description: t('contact.callDesc'),
      gradient: "from-emerald-500 to-green-600",
      borderColor: "border-emerald-500/20"
    },
    {
      icon: MapPin,
      title: t('contact.visitUs'),
      value: t('contact.visitValue'),
      description: t('contact.visitDesc'),
      gradient: "from-purple-500 to-violet-600",
      borderColor: "border-purple-500/20"
    }
  ];

  const socialLinks = [
    { icon: Twitter, label: "Twitter", href: "#", color: "hover:text-blue-400" },
    { icon: Facebook, label: "Facebook", href: "#", color: "hover:text-blue-600" },
    { icon: Instagram, label: "Instagram", href: "#", color: "hover:text-pink-500" },
    { icon: Linkedin, label: "LinkedIn", href: "#", color: "hover:text-blue-700" }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Glow Effects - Emerald theme */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[600px] h-[600px] bg-green-500/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-emerald-500/6 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <motion.header 
        className="bg-gradient-to-r from-emerald-900/30 via-green-900/25 to-emerald-800/30 backdrop-blur-3xl border-b border-emerald-500/30 text-white py-4 px-4 shadow-[0_4px_30px_rgba(16,185,129,0.15)] sticky top-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05, rotate: -90 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="w-11 h-11 rounded-[1.2rem] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 flex items-center justify-center transition-all shadow-lg"
            >
              <ArrowLeft className="h-5 w-5 text-emerald-400" />
            </motion.button>
            <motion.div
              className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <MessageCircle className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-base font-black tracking-tight uppercase">{t('contact.title')}</h1>
              <p className="text-[11px] text-emerald-400/80 font-medium">{t('contact.subtitle')}</p>
            </div>
          </div>
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="h-6 w-6 text-emerald-400" />
          </motion.div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter">
            {t('contact.letsConnect').split(' ')[0]} <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">{t('contact.letsConnect').split(' ')[1]}</span>
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
            {t('contact.description')}
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`bg-white/5 backdrop-blur-xl border ${info.borderColor} rounded-[2rem] p-6 shadow-lg hover:shadow-[0_0_50px_rgba(16,185,129,0.15)] transition-all`}
            >
              <motion.div
                className={`w-14 h-14 rounded-[1.2rem] bg-gradient-to-br ${info.gradient} flex items-center justify-center mb-4 shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <info.icon className="h-7 w-7 text-white" />
              </motion.div>
              <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">{info.title}</h3>
              <p className="text-emerald-300 font-medium mb-1">{info.value}</p>
              <p className="text-zinc-500 text-sm">{info.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-emerald-900/40 via-green-900/30 to-emerald-800/40 backdrop-blur-xl border border-emerald-500/20 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                <Send className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">{t('contact.sendMessage')}</h3>
                <p className="text-zinc-400 text-sm">{t('contact.formDesc')}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <motion.div whileHover={{ scale: 1.01 }} className="space-y-2">
                  <label className="text-emerald-300 font-bold uppercase tracking-wider text-sm">{t('contact.yourName')}</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="rounded-[1.2rem] bg-white/5 border-emerald-500/30 text-white placeholder:text-zinc-500 hover:bg-white/10 transition-all"
                    placeholder={t('contact.namePlaceholder')}
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.01 }} className="space-y-2">
                  <label className="text-emerald-300 font-bold uppercase tracking-wider text-sm">{t('contact.emailAddress')}</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="rounded-[1.2rem] bg-white/5 border-emerald-500/30 text-white placeholder:text-zinc-500 hover:bg-white/10 transition-all"
                    placeholder={t('contact.emailPlaceholder')}
                  />
                </motion.div>
              </div>

              <motion.div whileHover={{ scale: 1.01 }} className="space-y-2">
                <label className="text-emerald-300 font-bold uppercase tracking-wider text-sm">{t('contact.subject')}</label>
                <Input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="rounded-[1.2rem] bg-white/5 border-emerald-500/30 text-white placeholder:text-zinc-500 hover:bg-white/10 transition-all"
                  placeholder={t('contact.subjectPlaceholder')}
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.01 }} className="space-y-2">
                <label className="text-emerald-300 font-bold uppercase tracking-wider text-sm">{t('contact.message')}</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="rounded-[1.2rem] bg-white/5 border-emerald-500/30 text-white placeholder:text-zinc-500 hover:bg-white/10 transition-all resize-none"
                  placeholder={t('contact.messagePlaceholder')}
                />
              </motion.div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white rounded-[1.5rem] px-8 py-4 font-black uppercase tracking-wide shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t('contact.sending')}
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    {t('contact.send')}
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Map & Office Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Map */}
            <div className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 rounded-[2.5rem] p-2 shadow-lg overflow-hidden">
              <div className="w-full h-[400px] rounded-[2rem] overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.89797400157!2d77.04417035!3d28.527554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale contrast-125 opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                ></iframe>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 rounded-[2rem] p-6">
              <h4 className="text-white font-black uppercase tracking-tight mb-4">{t('contact.followUs')}</h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-[1rem] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 ${social.color} transition-all`}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Visual Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-emerald-900/40 via-green-900/30 to-teal-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-[2.5rem] p-8 text-center shadow-lg"
        >
          <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tight">{t('contact.needHelp')}</h3>
          <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
            {t('contact.chatbotDesc')}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/chatbot")}
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white rounded-[1.5rem] px-8 py-4 font-black uppercase tracking-wide shadow-lg shadow-emerald-500/30"
          >
            {t('contact.chatWithKrishi')}
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
};

export default Contact;
