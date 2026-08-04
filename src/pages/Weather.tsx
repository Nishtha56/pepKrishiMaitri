import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { weatherAPI, profileAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, Cloud, Droplets, Wind, 
  Sun, CloudRain, CloudSnow, CloudLightning, CloudFog,
  Sunrise, Sunset, Eye, Gauge, RefreshCw, Loader2,
  Umbrella, Leaf, Sparkles, ChevronRight, MapPin
} from "lucide-react";

// Weather icon component based on condition
const WeatherIcon = ({ icon, className = "h-8 w-8" }: { icon: string; className?: string }) => {
  switch (icon) {
    case 'sun':
      return <Sun className={`${className} text-yellow-400`} />;
    case 'rain':
      return <CloudRain className={`${className} text-blue-300`} />;
    case 'storm':
      return <CloudLightning className={`${className} text-purple-400`} />;
    case 'snow':
      return <CloudSnow className={`${className} text-blue-200`} />;
    case 'fog':
      return <CloudFog className={`${className} text-gray-300`} />;
    default:
      return <Cloud className={`${className} text-white/80`} />;
  }
};

const Weather = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    const token = localStorage.getItem('digikheti_token');
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      const { profile: profileData } = await profileAPI.get();
      setProfile(profileData);
      const userLocation = profileData?.village || profileData?.location || "Delhi";

      const data = await weatherAPI.get(userLocation, profileData?.pincode || "");
      setWeather(data);
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadWeather();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-blue-500 mb-4" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p className="text-blue-400 font-semibold">Loading weather data...</p>
          <p className="text-sm text-zinc-500 mt-1">Fetching real-time forecast</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Glow Effects - Blue theme */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[600px] h-[600px] bg-cyan-500/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header - Glassmorphism */}
      <motion.header 
        className="bg-gradient-to-r from-blue-900/30 via-blue-800/25 to-cyan-900/30 backdrop-blur-3xl border-b border-blue-500/30 text-white py-4 px-4 shadow-[0_4px_30px_rgba(59,130,246,0.15)] sticky top-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05, rotate: -90 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="w-11 h-11 rounded-[1.2rem] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 flex items-center justify-center transition-all shadow-lg"
            >
              <ArrowLeft className="h-5 w-5 text-blue-400" />
            </motion.button>
            <motion.div
              className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Cloud className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-base font-black tracking-tight uppercase">Weather Forecast</h1>
              <p className="text-[11px] text-blue-400/80 font-medium">7-day forecast & farming advice</p>
            </div>
          </div>
          <motion.button
            whileHover={{ rotate: 180, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-11 h-11 rounded-[1.2rem] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 flex items-center justify-center transition-all shadow-lg disabled:opacity-50"
          >
            <motion.div
              animate={refreshing ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw className="h-5 w-5 text-blue-400" />
            </motion.div>
          </motion.button>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-6 space-y-6 relative z-10">
        {weather ? (
          <>
            {/* Current Weather Card - Blue Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-cyan-900/40 backdrop-blur-xl border border-blue-500/20 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(59,130,246,0.1)]"
            >
              {/* Location */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <h2 className="text-xl font-black tracking-tight text-white uppercase">{weather.location}</h2>
                </div>
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <WeatherIcon icon={weather.current.icon} className="h-20 w-20" />
                </motion.div>
              </div>

              {/* Temperature */}
              <motion.div 
                className="flex items-end gap-4 mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-7xl font-black tracking-tighter text-white">{weather.current.temp}°</span>
                <div className="mb-3">
                  <p className="text-lg capitalize font-bold text-blue-200">{weather.current.description}</p>
                  <p className="text-sm text-blue-300/70">Feels like {weather.current.feelsLike}°C</p>
                </div>
              </motion.div>

              {/* Weather Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div 
                  className="bg-white/5 backdrop-blur-xl rounded-[1.5rem] p-4 border border-cyan-500/20 shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 mb-3 rounded-[1rem] bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Droplets className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-xs text-blue-300/70 font-medium uppercase tracking-wider">Humidity</p>
                  <p className="font-black text-2xl text-white">{weather.current.humidity}%</p>
                </motion.div>

                <motion.div 
                  className="bg-white/5 backdrop-blur-xl rounded-[1.5rem] p-4 border border-emerald-500/20 shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 mb-3 rounded-[1rem] bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Wind className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-xs text-blue-300/70 font-medium uppercase tracking-wider">Wind</p>
                  <p className="font-black text-2xl text-white">{weather.current.windSpeed} km/h</p>
                </motion.div>

                <motion.div 
                  className="bg-white/5 backdrop-blur-xl rounded-[1.5rem] p-4 border border-amber-500/20 shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 mb-3 rounded-[1rem] bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Sunrise className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-xs text-blue-300/70 font-medium uppercase tracking-wider">Sunrise</p>
                  <p className="font-black text-xl text-white">{weather.current.sunrise}</p>
                </motion.div>

                <motion.div 
                  className="bg-white/5 backdrop-blur-xl rounded-[1.5rem] p-4 border border-orange-500/20 shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 mb-3 rounded-[1rem] bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <Sunset className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-xs text-blue-300/70 font-medium uppercase tracking-wider">Sunset</p>
                  <p className="font-black text-xl text-white">{weather.current.sunset}</p>
                </motion.div>
              </div>

              {/* Additional Stats */}
              {(weather.current.visibility || weather.current.pressure) && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {weather.current.visibility && (
                    <motion.div 
                      className="bg-white/5 backdrop-blur-xl rounded-[1.5rem] p-4 border border-violet-500/20 shadow-lg"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-12 h-12 mb-3 rounded-[1rem] bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-xs text-blue-300/70 font-medium uppercase tracking-wider">Visibility</p>
                      <p className="font-black text-2xl text-white">{weather.current.visibility} km</p>
                    </motion.div>
                  )}
                  {weather.current.pressure && (
                    <motion.div 
                      className="bg-white/5 backdrop-blur-xl rounded-[1.5rem] p-4 border border-pink-500/20 shadow-lg"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-12 h-12 mb-3 rounded-[1rem] bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
                        <Gauge className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-xs text-blue-300/70 font-medium uppercase tracking-wider">Pressure</p>
                      <p className="font-black text-2xl text-white">{weather.current.pressure} hPa</p>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>

            {/* AI Farming Advice */}
            {weather.advice && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-amber-900/40 via-yellow-900/30 to-amber-800/40 backdrop-blur-xl border border-amber-500/20 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.1)]"
              >
                <div className="px-6 py-5 border-b border-amber-500/20 flex items-center justify-between">
                  <h3 className="font-black text-white text-lg flex items-center gap-2 tracking-tight uppercase">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Leaf className="h-6 w-6 text-amber-400" />
                    </motion.div>
                    🌾 Farming Advice
                  </h3>
                  <Sparkles className="h-5 w-5 text-amber-400" />
                </div>
                <div className="p-6">
                  {Array.isArray(weather.advice) ? (
                    <div className="space-y-3">
                      {weather.advice.map((tip: string, idx: number) => (
                        <motion.div 
                          key={idx}
                          className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-[1.5rem] border border-amber-500/10 shadow-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                          whileHover={{ x: 4, scale: 1.01 }}
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
                            <span className="text-white text-sm font-bold">{idx + 1}</span>
                          </div>
                          <p className="text-zinc-200 text-sm leading-relaxed">{tip}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-200 leading-relaxed">{weather.advice}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* 7-Day Forecast */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-slate-900/40 via-zinc-900/30 to-slate-800/40 backdrop-blur-xl border border-blue-500/20 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.1)]"
            >
              <div className="px-6 py-5 border-b border-blue-500/20 flex items-center gap-2">
                <div className="w-10 h-10 rounded-[1rem] bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Cloud className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-black text-white text-lg tracking-tight uppercase">7-Day Forecast</h3>
              </div>
              <div className="p-6 space-y-3">
                {weather.forecast.map((day: any, idx: number) => (
                  <motion.div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-[1.5rem] transition-all ${
                      idx === 0 
                        ? 'bg-blue-500/20 border border-blue-500/30' 
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.05 }}
                    whileHover={{ x: 4, scale: 1.01 }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <WeatherIcon icon={day.icon} className="h-12 w-12" />
                      </motion.div>
                      <div>
                        <p className="font-bold text-white">
                          {idx === 0 ? 'Today' : day.date}
                        </p>
                        <p className="text-sm text-blue-300/80 capitalize">{day.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {day.rainChance > 0 && (
                        <div className="flex items-center gap-1 text-blue-400 bg-blue-500/20 px-3 py-1.5 rounded-full border border-blue-500/30">
                          <Umbrella className="h-4 w-4" />
                          <span className="text-sm font-medium">{day.rainChance}%</span>
                        </div>
                      )}
                      <div className="text-right">
                        <p className="font-black text-white text-lg">
                          {day.tempMax}° / {day.tempMin}°
                        </p>
                        <div className="flex items-center gap-1 text-blue-300/70 text-sm">
                          <Droplets className="h-3 w-3" />
                          {day.humidity}%
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-white/40" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-slate-900/40 via-zinc-900/30 to-slate-800/40 backdrop-blur-xl border border-blue-500/20 rounded-[2.5rem] shadow-[0_0_50px_rgba(59,130,246,0.1)]"
          >
            <div className="py-16 text-center px-6">
              <motion.div 
                className="h-20 w-20 mx-auto mb-6 rounded-[1.5rem] bg-blue-500/20 flex items-center justify-center border border-blue-500/30"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Cloud className="h-10 w-10 text-blue-400" />
              </motion.div>
              <p className="text-lg font-semibold text-white mb-2">
                No weather data available
              </p>
              <p className="text-sm text-zinc-400 mb-6">
                Please check your internet connection
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 rounded-[1.2rem] font-bold shadow-lg shadow-blue-500/30 text-white"
              >
                Try Again
              </motion.button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Weather;