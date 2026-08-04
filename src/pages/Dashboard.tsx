import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { authAPI, alertsAPI, mspAPI, weatherAPI, profileAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, Cloud, Sprout, AlertTriangle, LogOut, User, TrendingUp, 
  MapPin, ChevronDown, ChevronUp, ChevronRight, Sun, Droplets, Sparkles
} from "lucide-react";
import GovernmentSchemes from "@/components/GovernmentSchemes";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Dashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [mspData, setMspData] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mapVisible, setMapVisible] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem('digikheti_token');
      if (!token) {
        navigate("/auth");
        return;
      }

      const { profile: profileData } = await authAPI.me();
      if (!profileData) {
        navigate("/onboarding");
        return;
      }
      setProfile(profileData);

      // Load MSP data
      try {
        const msp = await mspAPI.getWidget();
        setMspData((msp.data || []).slice(0, 4));
      } catch (e) {
        console.log("MSP data not available");
      }

      // Get alerts
      const { alerts: alertsData } = await alertsAPI.getAll(false);
      setAlerts(alertsData || []);

      // Load weather data
      try {
        const userLocation = profileData?.village || profileData?.location || "Delhi";
        const weatherData = await weatherAPI.get(userLocation, profileData?.pincode || "");
        setWeather(weatherData);
      } catch (e) {
        console.log("Weather data not available");
      }
    } catch (error: any) {
      toast({
        title: "Error loading dashboard",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authAPI.logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sprout className="h-10 w-10 text-emerald-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-emerald-500/3 blur-[120px] rounded-full pointer-events-none" />

      {/* Header - Glassmorphism */}
      <motion.header 
        className="bg-black/40 backdrop-blur-2xl border-b border-white/10 text-white shadow-2xl relative z-50 sticky top-0"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20"
            >
              <Sprout className="h-6 w-6 text-white" />
            </motion.div>
            <h1 className="text-xl font-black tracking-tighter uppercase">{t("common.appName")}</h1>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/profile")}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t("nav.profile")}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-4 py-2 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t("nav.logout")}</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-6 space-y-6 relative z-10">
        {/* Profile/Welcome Card - Light Green */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-br from-emerald-900/40 via-emerald-800/30 to-green-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight leading-tight uppercase">
                  {t("common.welcomeBack")}, <span className="text-emerald-400">{profile?.name?.toUpperCase()}</span> 👨‍🌾
                </h2>
                <p className="text-zinc-400 mt-2 text-sm font-light">
                  {t("dashboard.personalDashboard")}
                </p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMapVisible(!mapVisible)}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 rounded-xl text-sm transition-all flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  {mapVisible ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/profile")}
                  className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl text-sm font-medium transition-all text-emerald-300"
                >
                  {t("common.editProfile")}
                </motion.button>
              </div>
            </div>

            {/* Farm Info Pills */}
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-200">{profile?.village || profile?.location}, {profile?.state}</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
                <Sprout className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-200 capitalize">{profile?.soilType || t("dashboard.na")} {t("common.soil")}</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-200">{profile?.landSize || 0} {t("dashboard.acres")}</span>
              </div>
            </div>

            {/* Map */}
            <AnimatePresence>
              {mapVisible && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-6"
                >
                  <div className="rounded-2xl overflow-hidden border border-white/10">
                    <iframe
                      width="100%"
                      height="250"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                        `${profile?.village || profile?.location || ''}, ${profile?.district || ''}, ${profile?.state || ''}, India`
                      )}&zoom=12`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Row 2: AI Assistant + Weather */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* AI Assistant - Dark Green */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/chatbot")}
            className="cursor-pointer"
          >
            <div className="bg-gradient-to-br from-green-900/60 via-emerald-900/50 to-green-800/60 backdrop-blur-xl border border-green-500/20 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(34,197,94,0.1)] h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Bot className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-black text-lg tracking-tight text-white uppercase">{t("dashboard.aiAssistant")}</h3>
                  <p className="text-xs text-emerald-300/80">{t("dashboard.askKrishi")}</p>
                </div>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {t("dashboard.aiAssistantDesc")}
              </p>
            </div>
          </motion.div>

          {/* Weather Widget - Blue */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/weather")}
          >
            <div className="cursor-pointer bg-gradient-to-br from-blue-900/60 via-blue-800/50 to-cyan-900/60 backdrop-blur-xl border border-blue-500/20 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(59,130,246,0.1)] h-full">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Cloud className="h-5 w-5 text-blue-300" />
                    <span className="font-bold text-white uppercase tracking-wide text-sm">{t("dashboard.weatherForecast")}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <Sun className="h-14 w-14 text-yellow-300" />
                      <span className="text-4xl font-black tracking-tight text-white">
                        {weather?.current?.temp ? `${weather.current.temp}°C` : '--°C'}
                      </span>
                    </div>
                    <div className="text-sm text-blue-100">
                      <p className="font-medium capitalize">
                        {weather?.current?.description || t("dashboard.clickToView")}
                      </p>
                      <p className="text-blue-200/80">{weather?.location || t("dashboard.farmingAdvice")}</p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-4">
                  <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                    <Droplets className="h-5 w-5 mx-auto mb-1 text-blue-200" />
                    <p className="text-xs text-blue-200/80">{t("dashboard.humidity")}</p>
                    <p className="text-sm font-bold text-white">
                      {weather?.current?.humidity ? `${weather.current.humidity}%` : '--%'}
                    </p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-white/40" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Row 3: MSP + Schemes + Journal + Crop Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* MSP Card - Yellow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate("/msp")}
              className="cursor-pointer"
            >
              <div className="bg-gradient-to-br from-yellow-900/60 via-amber-900/50 to-orange-900/60 backdrop-blur-xl border border-yellow-500/20 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(234,179,8,0.1)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-yellow-400" />
                    <h3 className="font-black text-lg tracking-tight text-white uppercase">{t("dashboard.msp")}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-300 text-sm font-medium">
                    {t("dashboard.viewTrends")} <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-sm text-zinc-400 mb-4">
                  {t("dashboard.mspDesc")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {mspData.length > 0 ? mspData.map((item: any, idx: number) => (
                    <span 
                      key={idx} 
                      className="text-xs bg-yellow-500/20 border border-yellow-500/30 text-yellow-200 px-3 py-1.5 rounded-full font-medium"
                    >
                      🌾 {item.displayName?.split(' ')[0]} ₹{item.msp}
                    </span>
                  )) : (
                    <>
                      <span className="text-xs bg-yellow-500/20 border border-yellow-500/30 text-yellow-200 px-3 py-1.5 rounded-full font-medium">🌾 Masur ₹6700</span>
                      <span className="text-xs bg-amber-500/20 border border-amber-500/30 text-amber-200 px-3 py-1.5 rounded-full font-medium">🌻 Safflower ₹5940</span>
                      <span className="text-xs bg-orange-500/20 border border-orange-500/30 text-orange-200 px-3 py-1.5 rounded-full font-medium">🌿 Barley ₹1980</span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Government Schemes - Purple */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex-1"
            >
              <GovernmentSchemes />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Farmer Journal - Dark Green */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/journal")}
              className="cursor-pointer"
            >
              <div className="bg-gradient-to-br from-green-900/60 via-emerald-900/50 to-green-800/60 backdrop-blur-xl border border-green-500/20 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(34,197,94,0.1)] h-[220px] flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl">
                    📓
                  </div>
                  <div>
                    <h3 className="font-black tracking-tight text-white uppercase">{t("dashboard.farmerJournal")}</h3>
                    <p className="text-xs text-emerald-300/80">{t("dashboard.trackActivities")}</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-300 mb-4 leading-relaxed flex-1">
                  {t("dashboard.journalDesc")}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg font-medium text-emerald-200">🌱 {t("dashboard.sowing")}</span>
                  <span className="text-xs bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg font-medium text-emerald-200">💧 {t("dashboard.irrigation")}</span>
                  <span className="text-xs bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg font-medium text-emerald-200">🌾 {t("dashboard.harvest")}</span>
                </div>
              </div>
            </motion.div>

            {/* Crop & Fertilizer Tips - Orange */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex-1"
            >
              <div className="bg-gradient-to-br from-orange-900/60 via-orange-800/50 to-red-900/60 backdrop-blur-xl border border-orange-500/20 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(249,115,22,0.1)] h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Sprout className="h-6 w-6 text-orange-300" />
                  </div>
                  <div>
                    <h3 className="font-black tracking-tight text-white uppercase">{t("dashboard.cropTips")}</h3>
                    <p className="text-xs text-orange-300/80">{t("dashboard.cropTipsSubtitle")}</p>
                  </div>
                </div>
                
                <div className="flex-1 space-y-2 mb-4">
                  <motion.div 
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/crops")}
                    className="bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl p-3 cursor-pointer border border-orange-500/20 hover:border-orange-400/40 transition-all group"
                  >
                    <p className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                      🌱 {t("dashboard.bestCrops")}
                      <ChevronRight className="h-4 w-4 text-orange-400/60 group-hover:text-orange-300 ml-auto transition-colors" />
                    </p>
                    <p className="text-xs text-orange-200/80">Based on {profile?.soilType || 'your'} soil type</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/crops")}
                    className="bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl p-3 cursor-pointer border border-orange-500/20 hover:border-orange-400/40 transition-all group"
                  >
                    <p className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                      🧪 {t("dashboard.fertilizerTips")}
                      <ChevronRight className="h-4 w-4 text-orange-400/60 group-hover:text-orange-300 ml-auto transition-colors" />
                    </p>
                    <p className="text-xs text-orange-200/80">Seasonal NPK suggestions</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/crops")}
                    className="bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl p-3 cursor-pointer border border-orange-500/20 hover:border-orange-400/40 transition-all group"
                  >
                    <p className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                      🌾 Seasonal guidance
                      <ChevronRight className="h-4 w-4 text-orange-400/60 group-hover:text-orange-300 ml-auto transition-colors" />
                    </p>
                    <p className="text-xs text-orange-200/80">Optimal planting calendar</p>
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/crops")}
                  className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2"
                >
                  Get Recommendations <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-gradient-to-br from-red-900/40 via-pink-900/30 to-red-800/40 backdrop-blur-xl border border-red-500/20 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <h3 className="font-black text-lg tracking-tight text-white uppercase">Recent Alerts</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate("/alerts")}
                  className="text-red-300 hover:text-red-200 text-sm font-medium"
                >
                  View All
                </motion.button>
              </div>
              <div className="space-y-3">
                {alerts.slice(0, 3).map((alert) => (
                  <motion.div 
                    key={alert.id} 
                    className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                    whileHover={{ scale: 1.01, backgroundColor: "rgba(239, 68, 68, 0.15)" }}
                  >
                    <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-white tracking-tight">{alert.title}</p>
                      <p className="text-xs text-zinc-400 mt-1">{alert.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;