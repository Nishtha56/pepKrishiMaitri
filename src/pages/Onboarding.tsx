import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { authAPI, profileAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Sprout, User, Phone, MapPin, Hash, Layers, Crop, ChevronRight } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Onboarding = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [pincode, setPincode] = useState("");
  const [soilType, setSoilType] = useState("");
  const [landSize, setLandSize] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const token = localStorage.getItem('digikheti_token');
      if (!token) {
        navigate("/auth");
        return;
      }

      const { profile } = await profileAPI.get();
      if (profile) {
        navigate("/dashboard");
      }
    } catch (error: any) {
      if (error.message === "Profile not found") {
        return;
      }
      navigate("/auth");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await profileAPI.create({
        name,
        phone,
        location,
        pincode,
        soilType,
        landSize: landSize ? parseFloat(landSize) : undefined,
      });

      toast({ title: t("onboarding.profileCreated") });
      navigate("/dashboard");
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

  const soilTypes = [
    { value: "sandy", label: t("onboarding.soilTypes.sandy") },
    { value: "loamy", label: t("onboarding.soilTypes.loamy") },
    { value: "clay", label: t("onboarding.soilTypes.clay") },
    { value: "silt", label: t("onboarding.soilTypes.silt") },
    { value: "peat", label: t("onboarding.soilTypes.peat") },
    { value: "chalk", label: t("onboarding.soilTypes.chalk") },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Language Switcher */}
      <div className="absolute top-8 right-8 z-50">
        <LanguageSwitcher />
      </div>

      {/* Onboarding Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl mx-4 my-6 relative z-10"
      >
        <div className="bg-black/40 backdrop-blur-3xl border border-white/10 border-t-white/20 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                <Sprout className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tighter">
              {t("onboarding.completeProfile")}
            </h1>
            <p className="text-emerald-500 font-black tracking-[0.3em] uppercase text-[10px]">
              {t("onboarding.helpUs")}
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name & Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-2"
              >
                <label className="text-zinc-400 font-medium text-xs uppercase tracking-wider flex items-center gap-2">
                  <User className="w-3 h-3" />
                  {t("onboarding.fullName")} *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-light text-sm"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="space-y-2"
              >
                <label className="text-zinc-400 font-medium text-xs uppercase tracking-wider flex items-center gap-2">
                  <Phone className="w-3 h-3" />
                  {t("onboarding.phoneNumber")}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-light text-sm"
                />
              </motion.div>
            </div>

            {/* Location & Pincode Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-2"
              >
                <label className="text-zinc-400 font-medium text-xs uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  {t("onboarding.location")} *
                </label>
                <input
                  type="text"
                  placeholder={t("onboarding.locationPlaceholder")}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-light text-sm"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="space-y-2"
              >
                <label className="text-zinc-400 font-medium text-xs uppercase tracking-wider flex items-center gap-2">
                  <Hash className="w-3 h-3" />
                  {t("onboarding.pincode")}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-light text-sm"
                />
              </motion.div>
            </div>

            {/* Soil Type & Land Size Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-2"
              >
                <label className="text-zinc-400 font-medium text-xs uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-3 h-3" />
                  {t("onboarding.soilType")} *
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-light text-sm appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2310b981'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.25rem',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="" className="bg-black text-zinc-500">
                    {t("onboarding.selectSoilType")}
                  </option>
                  {soilTypes.map((soil) => (
                    <option key={soil.value} value={soil.value} className="bg-black text-white">
                      {soil.label}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="space-y-2"
              >
                <label className="text-zinc-400 font-medium text-xs uppercase tracking-wider flex items-center gap-2">
                  <Crop className="w-3 h-3" />
                  {t("onboarding.landSize")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-light text-sm"
                />
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                  />
                  {t("onboarding.creatingProfile")}
                </span>
              ) : (
                <>
                  {t("onboarding.completeSetup")}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Decorative Line */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-zinc-600 text-center text-[10px] uppercase tracking-[0.2em] font-bold">
              Autonomous Agriculture Platform
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;