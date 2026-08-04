import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { authAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Sprout, ChevronRight, Mail, Lock, KeyRound, ArrowLeft } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await authAPI.login(email, password);
        toast({ title: t("auth.welcomeBack") });
        navigate("/dashboard");
      } else if (mode === 'register') {
        await authAPI.register(email, password);
        toast({ title: t("auth.accountCreated") });
        navigate("/onboarding");
      }
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);
      
      // Show reset code in prominent alert
      const resetCode = response.resetToken;
      
      // Use window.alert for maximum visibility
      alert(`Password Reset Code\n\n` +
            `Your 6-digit reset code is:\n\n` +
            `${resetCode}\n\n` +
            `Please copy this code. It's valid for 15 minutes.\n\n` +
            `Click OK to go to the reset password page.`);

      // Navigate to reset password page
      navigate(`/reset-password?token=${resetCode}`);
      
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Language Switcher */}
      <div className="absolute top-8 right-8 z-50">
        <LanguageSwitcher />
      </div>

      {/* Main Auth Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg mx-4 my-6 relative z-10"
      >
        <div className="bg-black/40 backdrop-blur-3xl border border-white/10 border-t-white/20 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Logo & Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-6"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                <Sprout className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tighter whitespace-nowrap">
              {t("common.appName")}
            </h1>
            <p className="text-emerald-500 font-black tracking-[0.3em] uppercase text-[10px]">
              {mode === 'forgot' ? 'Reset Password' : mode === 'login' ? t("auth.welcomeBack") : t("auth.createAccount")}
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={mode === 'forgot' ? handleForgotPassword : handleAuth} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-2"
            >
              <label
                htmlFor="email"
                className="text-zinc-400 font-medium text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <Mail className="w-3 h-3" />
                {t("auth.email")}
              </label>
              <input
                id="email"
                type="email"
                placeholder="farmer@krishimaitri.tech"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-light"
              />
            </motion.div>

            {mode !== 'forgot' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-2"
              >
                <label
                  htmlFor="password"
                  className="text-zinc-400 font-medium text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  <Lock className="w-3 h-3" />
                  {t("auth.password")}
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-light"
                />
              </motion.div>
            )}

            {/* Forgot Password Link - Only show on login */}
            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  Forgot password?
                </button>
              </div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                  />
                  {t("auth.pleaseWait")}
                </span>
              ) : (
                <>
                  {mode === 'forgot' ? 'Send Reset Code' : mode === 'login' ? t("auth.signIn") : t("auth.signUp")}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Toggle Login/Register/Back */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6 text-center space-y-2"
          >
            {mode === 'forgot' ? (
              <button
                onClick={() => setMode('login')}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors group relative flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </button>
            ) : (
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors group relative"
              >
                {mode === 'login' ? t("auth.needAccount") : t("auth.haveAccount")}
                <motion.div
                  className="absolute -bottom-1 left-0 h-[1px] bg-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </button>
            )}
          </motion.div>

          {/* Decorative Line */}
          <div className="mt-6 pt-4 border-t border-white/5">
            <p className="text-zinc-600 text-center text-[10px] uppercase tracking-[0.2em] font-bold">
              Autonomous Agriculture Platform
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;