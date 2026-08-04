import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { cropsAPI, profileAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sprout, Droplets, FlaskConical, Thermometer, TrendingUp, Loader2, MapPin, RefreshCw, Sparkles } from "lucide-react";

interface Crop {
  name: string;
  description: string;
  season: string;
  waterRequirement: string;
  fertilizer: string;
  expectedYield: string;
  idealTemperature: string;
}

// Season badge styling with gradients
const getSeasonStyles = (season: string) => {
  switch (season?.toLowerCase()) {
    case "kharif": 
      return {
        badge: "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-sm shadow-emerald-500/30",
        icon: "🌿",
        dot: "bg-emerald-500"
      };
    case "rabi": 
      return {
        badge: "bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0 shadow-sm shadow-amber-500/30",
        icon: "🌾",
        dot: "bg-amber-500"
      };
    case "zaid": 
      return {
        badge: "bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-sm shadow-orange-500/30",
        icon: "☀️",
        dot: "bg-orange-500"
      };
    case "all-season": 
      return {
        badge: "bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-sm shadow-blue-500/30",
        icon: "🌍",
        dot: "bg-blue-500"
      };
    default: 
      return {
        badge: "bg-gradient-to-r from-gray-500 to-zinc-600 text-white border-0 shadow-sm",
        icon: "🌱",
        dot: "bg-gray-500"
      };
  }
};

const formatSeason = (season: string) => {
  if (!season) return 'Kharif';
  return season.charAt(0).toUpperCase() + season.slice(1).replace('-', ' ');
};

const Crops = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('digikheti_token');
      if (!token) {
        navigate("/auth");
        return;
      }

      const { profile: profileData } = await profileAPI.get();
      setProfile(profileData);

      if (profileData) {
        await fetchCropSuggestions(profileData);
      }
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const fetchCropSuggestions = async (profileData: any) => {
    setAiLoading(true);
    try {
      const { crops: suggestedCrops } = await cropsAPI.getSuggestions(
        profileData.soilType,
        profileData.village || profileData.location,
        profileData.state,
        profileData.district
      );
      setCrops(suggestedCrops || []);
    } catch (error: any) {
      console.error('Error fetching crop suggestions:', error);
      toast({
        title: "Could not load AI suggestions",
        description: "Showing default recommendations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-orange-500 mb-4" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p className="text-orange-400 font-semibold">Analyzing your soil & location...</p>
          <p className="text-sm text-zinc-500 mt-1">Getting AI-powered recommendations</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Glow Effects - Orange/Amber theme */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[600px] h-[600px] bg-amber-500/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header - Orange/Amber Glassmorphism */}
      <motion.header 
        className="bg-gradient-to-r from-orange-900/30 via-amber-900/25 to-orange-800/30 backdrop-blur-3xl border-b border-orange-500/30 text-white py-4 px-4 shadow-[0_4px_30px_rgba(249,115,22,0.15)] sticky top-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, rotate: -90 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="w-11 h-11 rounded-[1.2rem] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/50 flex items-center justify-center transition-all shadow-lg"
          >
            <ArrowLeft className="h-5 w-5 text-orange-400" />
          </motion.button>
          <motion.div
            className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/30"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Sprout className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-base font-black tracking-tight uppercase">Crop Suggestions</h1>
            <p className="text-[11px] text-orange-400/80 font-medium">AI-powered recommendations</p>
          </div>
          <motion.div 
            className="ml-auto"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="h-6 w-6 text-amber-400" />
          </motion.div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-6 space-y-6 relative z-10">
        {/* Soil & Location Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-900/40 via-green-900/30 to-emerald-800/40 backdrop-blur-xl border border-emerald-500/20 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <motion.div 
                className="h-16 w-16 rounded-[1.5rem] bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Sprout className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-tight">
                  Your Soil: <span className="text-emerald-400 capitalize">{profile?.soilType || 'Not set'}</span>
                </h2>
                <p className="text-zinc-300 text-sm flex items-center gap-1.5 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                  {profile?.village || profile?.location || 'Location not set'}
                  {profile?.district && `, ${profile.district}`}
                  {profile?.state && `, ${profile.state}`}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchCropSuggestions(profile)}
              disabled={aiLoading}
              className="bg-white/10 hover:bg-white/15 border border-emerald-500/30 text-emerald-300 rounded-[1.2rem] px-5 py-3 font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              {aiLoading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Loader2 className="h-5 w-5" />
                </motion.div>
              ) : (
                <RefreshCw className="h-5 w-5" />
              )}
              Refresh
            </motion.button>
          </div>
        </motion.div>

        {/* Crop Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence>
            {crops.map((crop, index) => {
              const seasonStyles = getSeasonStyles(crop.season);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="bg-white/5 backdrop-blur-xl border border-orange-500/20 rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-[0_0_50px_rgba(249,115,22,0.15)] transition-all"
                >
                  <div className="p-5">
                    {/* Header with name and season badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="w-14 h-14 rounded-[1.2rem] bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center border border-orange-500/30 shadow-lg"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="text-2xl">{seasonStyles.icon}</span>
                        </motion.div>
                        <div>
                          <h3 className="font-black text-lg text-white tracking-tight uppercase">{crop.name}</h3>
                          <p className="text-sm text-zinc-400">{crop.description}</p>
                        </div>
                      </div>
                      <span className={`${seasonStyles.badge} rounded-full px-3 py-1.5 text-xs font-bold`}>
                        {formatSeason(crop.season)}
                      </span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Water Requirement */}
                      <motion.div 
                        className="p-3 rounded-[1.2rem] bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/20 backdrop-blur-sm"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Droplets className="h-4 w-4 text-blue-400" />
                          <p className="text-xs font-bold text-blue-300 uppercase tracking-wider">Water</p>
                        </div>
                        <p className="text-sm text-white font-medium">{crop.waterRequirement}</p>
                      </motion.div>

                      {/* Fertilizer */}
                      <motion.div 
                        className="p-3 rounded-[1.2rem] bg-gradient-to-br from-purple-900/40 to-violet-900/40 border border-purple-500/20 backdrop-blur-sm"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <FlaskConical className="h-4 w-4 text-purple-400" />
                          <p className="text-xs font-bold text-purple-300 uppercase tracking-wider">Fertilizer</p>
                        </div>
                        <p className="text-sm text-white font-medium">{crop.fertilizer}</p>
                      </motion.div>

                      {/* Expected Yield */}
                      <motion.div 
                        className="p-3 rounded-[1.2rem] bg-gradient-to-br from-emerald-900/40 to-green-900/40 border border-emerald-500/20 backdrop-blur-sm"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="h-4 w-4 text-emerald-400" />
                          <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Yield</p>
                        </div>
                        <p className="text-sm text-white font-medium">{crop.expectedYield}</p>
                      </motion.div>

                      {/* Ideal Temperature */}
                      <motion.div 
                        className="p-3 rounded-[1.2rem] bg-gradient-to-br from-orange-900/40 to-amber-900/40 border border-orange-500/20 backdrop-blur-sm"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Thermometer className="h-4 w-4 text-orange-400" />
                          <p className="text-xs font-bold text-orange-300 uppercase tracking-wider">Temperature</p>
                        </div>
                        <p className="text-sm text-white font-medium">{crop.idealTemperature}</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* No Crops Message */}
        {crops.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-slate-900/40 via-zinc-900/30 to-slate-800/40 backdrop-blur-xl border border-orange-500/20 rounded-[2.5rem] shadow-[0_0_50px_rgba(249,115,22,0.1)]"
          >
            <div className="py-16 text-center px-6">
              <motion.div 
                className="h-20 w-20 mx-auto mb-6 rounded-[1.5rem] bg-orange-500/20 flex items-center justify-center border border-orange-500/30"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              >
                <Sprout className="h-10 w-10 text-orange-400" />
              </motion.div>
              <p className="text-lg font-semibold text-white mb-2">
                No crop suggestions available
              </p>
              <p className="text-sm text-zinc-400 mb-6">
                Please update your profile with soil type and location
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/profile")}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white rounded-[1.2rem] px-6 py-3 font-bold shadow-lg shadow-orange-500/30"
              >
                Update Profile
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* AI Disclaimer */}
        <motion.div 
          className="text-center py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 shadow-sm backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <p className="text-xs text-zinc-400">
              AI-powered recommendations based on your soil & location. Consult local experts for best results.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Crops;