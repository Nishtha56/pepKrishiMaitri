import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, TrendingUp, TrendingDown, X, Sparkles, ChevronUp, ChevronDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Cell } from "recharts";

// =========== MSP DATA ===========
const mspData = {
  kharif: [
    { crop: "Paddy", emoji: "🌾", category: "Grains", color: "#22c55e", "2020-21": 1868, "2021-22": 1940, "2022-23": 2040, "2023-24": 2183, "2024-25": 2300 },
    { crop: "Jowar", emoji: "🌿", category: "Grains", color: "#84cc16", "2020-21": 2620, "2021-22": 2738, "2022-23": 2970, "2023-24": 3180, "2024-25": 3371 },
    { crop: "Bajra", emoji: "🌾", category: "Grains", color: "#eab308", "2020-21": 2150, "2021-22": 2250, "2022-23": 2350, "2023-24": 2500, "2024-25": 2625 },
    { crop: "Maize", emoji: "🌽", category: "Grains", color: "#f97316", "2020-21": 1850, "2021-22": 1870, "2022-23": 1962, "2023-24": 2090, "2024-25": 2225 },
    { crop: "Groundnut", emoji: "🥜", category: "Oilseeds", color: "#d97706", "2020-21": 5275, "2021-22": 5550, "2022-23": 5850, "2023-24": 6377, "2024-25": 6783 },
    { crop: "Soybean", emoji: "🫘", category: "Oilseeds", color: "#14b8a6", "2020-21": 3880, "2021-22": 3950, "2022-23": 4300, "2023-24": 4600, "2024-25": 4892 },
    { crop: "Cotton", emoji: "🧵", category: "Oilseeds", color: "#6366f1", "2020-21": 5515, "2021-22": 5726, "2022-23": 6080, "2023-24": 6620, "2024-25": 7121 },
    { crop: "Sunflower", emoji: "🌻", category: "Oilseeds", color: "#facc15", "2020-21": 5885, "2021-22": 6015, "2022-23": 6400, "2023-24": 6760, "2024-25": 7280 },
    { crop: "Tur", emoji: "🫛", category: "Pulses", color: "#ef4444", "2020-21": 6000, "2021-22": 6300, "2022-23": 6600, "2023-24": 7000, "2024-25": 7550 },
    { crop: "Moong", emoji: "🌱", category: "Pulses", color: "#10b981", "2020-21": 7196, "2021-22": 7275, "2022-23": 7755, "2023-24": 8558, "2024-25": 8682 },
    { crop: "Urad", emoji: "🫘", category: "Pulses", color: "#374151", "2020-21": 6000, "2021-22": 6300, "2022-23": 6600, "2023-24": 6950, "2024-25": 7400 },
  ],
  rabi: [
    { crop: "Wheat", emoji: "🌾", category: "Grains", color: "#f59e0b", "2020-21": 1975, "2021-22": 2015, "2022-23": 2125, "2023-24": 2275, "2024-25": 2425 },
    { crop: "Barley", emoji: "🌿", category: "Grains", color: "#84cc16", "2020-21": 1600, "2021-22": 1635, "2022-23": 1735, "2023-24": 1850, "2024-25": 1980 },
    { crop: "Gram", emoji: "🫛", category: "Pulses", color: "#f97316", "2020-21": 5100, "2021-22": 5230, "2022-23": 5335, "2023-24": 5440, "2024-25": 5650 },
    { crop: "Masur", emoji: "🫘", category: "Pulses", color: "#dc2626", "2020-21": 5100, "2021-22": 5500, "2022-23": 6000, "2023-24": 6425, "2024-25": 6700 },
    { crop: "Mustard", emoji: "🌼", category: "Oilseeds", color: "#a3e635", "2020-21": 4650, "2021-22": 5050, "2022-23": 5450, "2023-24": 5650, "2024-25": 5950 },
    { crop: "Safflower", emoji: "🌸", category: "Oilseeds", color: "#ec4899", "2020-21": 5327, "2021-22": 5441, "2022-23": 5650, "2023-24": 5800, "2024-25": 6100 },
  ],
};

const years = ["2020-21", "2021-22", "2022-23", "2023-24", "2024-25"] as const;

// =========== SEASON SWITCH COMPONENT ===========
const SeasonSwitch = ({ 
  season, 
  onChange 
}: { 
  season: "kharif" | "rabi"; 
  onChange: (s: "kharif" | "rabi") => void;
}) => {
  return (
    <div className="w-full bg-white/5 backdrop-blur-xl rounded-[2rem] p-2 border border-amber-500/20">
      <div className="flex gap-2">
        <motion.button
          className={`flex-1 py-2.5 rounded-[1.5rem] text-sm font-black flex items-center justify-center gap-2 transition-all uppercase tracking-wider ${
            season === "kharif" 
              ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/30" 
              : "text-amber-300 hover:bg-white/5"
          }`}
          onClick={() => onChange("kharif")}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: season === "kharif" ? 1 : 1.02 }}
        >
          <span>🌾</span> Kharif
        </motion.button>
        <motion.button
          className={`flex-1 py-2.5 rounded-[1.5rem] text-sm font-black flex items-center justify-center gap-2 transition-all uppercase tracking-wider ${
            season === "rabi" 
              ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/30" 
              : "text-amber-300 hover:bg-white/5"
          }`}
          onClick={() => onChange("rabi")}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: season === "rabi" ? 1 : 1.02 }}
        >
          <span>🌿</span> Rabi
        </motion.button>
      </div>
    </div>
  );
};

// =========== HERO CAROUSEL COMPONENT ===========
const HeroMSPCarousel = ({ 
  crops, 
  season 
}: { 
  crops: typeof mspData.kharif; 
  season: "kharif" | "rabi";
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const categories = ["Grains", "Pulses", "Oilseeds"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [season]);

  const currentCategory = categories[activeIndex];
  const filteredCrops = crops.filter(c => c.category === currentCategory);
  
  const categoryColors: Record<string, string> = {
    "Grains": "from-green-600 to-emerald-700",
    "Pulses": "from-orange-600 to-red-600",
    "Oilseeds": "from-yellow-600 to-amber-700",
  };

  return (
    <div className="space-y-4">
      {/* Category indicators */}
      <div className="flex justify-center gap-2">
        {categories.map((cat, idx) => (
          <motion.button
            key={cat}
            className={`px-4 py-2 rounded-[1rem] text-xs font-black transition-all uppercase tracking-wider ${
              idx === activeIndex 
                ? `bg-gradient-to-r ${categoryColors[cat]} text-white shadow-lg` 
                : "bg-white/5 text-amber-300/60 border border-white/10"
            }`}
            onClick={() => setActiveIndex(idx)}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            {cat}
          </motion.button>
        ))}
      </div>
      
      {/* Carousel cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCategory}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {filteredCrops.slice(0, 4).map((crop, idx) => (
            <motion.div
              key={crop.crop}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className={`bg-gradient-to-br ${categoryColors[crop.category]} backdrop-blur-xl rounded-[1.5rem] p-4 shadow-lg border border-white/20`}
            >
              <div className="text-white">
                <div className="text-4xl mb-2">{crop.emoji}</div>
                <h3 className="font-black text-base">{crop.crop}</h3>
                <p className="text-xs text-white/70 mb-2">2024-25</p>
                <p className="text-2xl font-black">₹{crop["2024-25"].toLocaleString()}</p>
                <p className="text-xs text-white/70">per quintal</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// =========== TOP CROPS BAR CHART ===========
const TopCropsBarChart = ({ 
  crops,
  onCropSelect 
}: { 
  crops: typeof mspData.kharif;
  onCropSelect: (crop: typeof mspData.kharif[0]) => void;
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  
  const topCrops = [...crops]
    .sort((a, b) => b["2024-25"] - a["2024-25"])
    .slice(0, 6)
    .map(c => ({
      name: c.crop,
      price: c["2024-25"],
      color: c.color,
      emoji: c.emoji,
      fullData: c,
    }));

  return (
    <div className="bg-gradient-to-br from-yellow-900/40 via-amber-900/30 to-yellow-800/40 backdrop-blur-xl border border-amber-500/20 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(245,158,11,0.1)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-white text-lg uppercase tracking-wider">Top MSP Crops</h3>
        <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-full border border-amber-500/30 font-bold">2024-25</span>
      </div>
      
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={topCrops} 
            layout="vertical"
            margin={{ left: 0, right: 10 }}
            onClick={(data) => {
              if (data?.activePayload?.[0]?.payload?.fullData) {
                onCropSelect(data.activePayload[0].payload.fullData);
              }
            }}
          >
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={70}
              tick={{ fontSize: 12, fill: '#fde047', fontWeight: 'bold' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload?.[0]) {
                  return (
                    <div className="bg-gradient-to-br from-yellow-900/95 via-amber-900/95 to-yellow-800/95 backdrop-blur-xl shadow-lg rounded-xl p-3 border border-amber-500/30">
                      <p className="font-bold text-white">{payload[0].payload.emoji} {payload[0].payload.name}</p>
                      <p className="text-amber-300 font-bold">₹{payload[0].value?.toLocaleString()}/qtl</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="price" 
              radius={[0, 12, 12, 0]}
              onMouseEnter={(_, idx) => setFocusedIndex(idx)}
              onMouseLeave={() => setFocusedIndex(null)}
            >
              {topCrops.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  opacity={focusedIndex === null || focusedIndex === index ? 1 : 0.4}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-xs text-amber-300/60 text-center mt-3 font-medium">
        Tap a bar to view trend • Longer bar = higher MSP
      </p>
    </div>
  );
};

// =========== CROP LIST ===========
const CropList = ({ 
  crops, 
  onCropSelect,
  selectedCrop 
}: { 
  crops: typeof mspData.kharif;
  onCropSelect: (crop: typeof mspData.kharif[0]) => void;
  selectedCrop: typeof mspData.kharif[0] | null;
}) => {
  const getYoYChange = (crop: typeof crops[0]) => {
    const current = crop["2024-25"];
    const previous = crop["2023-24"];
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-white text-lg uppercase tracking-wider">All Crops</h3>
        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-full text-sm font-bold">{crops.length} crops</span>
      </div>
      
      <div className="space-y-3">
        {crops.map((crop, idx) => {
          const yoyChange = parseFloat(getYoYChange(crop));
          const isPositive = yoyChange > 0;
          const isSelected = selectedCrop?.crop === crop.crop;
          
          return (
            <motion.div
              key={crop.crop}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCropSelect(crop)}
              className={`bg-white/5 backdrop-blur-xl border rounded-[1.5rem] cursor-pointer transition-all p-4 shadow-lg ${
                isSelected ? "border-amber-500/50 bg-amber-500/10 ring-2 ring-amber-500/30" : "border-white/10 hover:border-amber-500/30 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="h-14 w-14 rounded-[1rem] flex items-center justify-center text-3xl border shadow-lg"
                  style={{ 
                    backgroundColor: crop.color + "30",
                    borderColor: crop.color + "50"
                  }}
                >
                  {crop.emoji}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-white text-base">{crop.crop}</h4>
                  <div className="flex items-center gap-2 text-xs text-amber-300/70 font-medium">
                    <span>{crop.category}</span>
                    <span>•</span>
                    <span>2024-25</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-black text-white text-lg">₹{crop["2024-25"].toLocaleString()}</p>
                  <span 
                    className={`text-xs border px-2 py-1 rounded-full font-bold inline-flex items-center gap-1 ${
                      isPositive 
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }`}
                  >
                    {isPositive ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    {Math.abs(yoyChange)}%
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// =========== CROP TREND DRAWER ===========
const CropTrendDrawer = ({ 
  crop, 
  onClose 
}: { 
  crop: typeof mspData.kharif[0] | null;
  onClose: () => void;
}) => {
  if (!crop) return null;

  const chartData = years.map(year => ({
    year: year.split("-")[0],
    price: crop[year],
  }));

  const currentPrice = crop["2024-25"];
  const previousPrice = crop["2023-24"];
  const yoyChange = ((currentPrice - previousPrice) / previousPrice * 100).toFixed(1);
  const minPrice = Math.min(...years.map(y => crop[y]));
  const maxPrice = Math.max(...years.map(y => crop[y]));
  const isPositive = parseFloat(yoyChange) > 0;

  return (
    <AnimatePresence>
      {crop && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-zinc-900 to-black rounded-t-[2.5rem] shadow-2xl z-50 max-h-[85vh] overflow-y-auto border-t border-amber-500/20"
          >
            {/* Handle */}
            <div className="flex justify-center pt-4 pb-3">
              <div className="w-12 h-1.5 bg-amber-500/30 rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-5 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div 
                  className="h-16 w-16 rounded-[1.5rem] flex items-center justify-center text-4xl border shadow-lg"
                  style={{ 
                    backgroundColor: crop.color + "30",
                    borderColor: crop.color + "50"
                  }}
                >
                  {crop.emoji}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">{crop.crop}</h2>
                  <p className="text-sm text-amber-300/80 font-medium">{crop.category} • MSP Price Trend</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center"
              >
                <X className="h-5 w-5 text-amber-400" />
              </motion.button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 p-6">
              <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/40 backdrop-blur-xl rounded-[1.5rem] p-4 text-center border border-emerald-500/20">
                <p className="text-xs text-emerald-300/70 mb-1 font-medium uppercase tracking-wider">Current Price</p>
                <p className="text-xl font-black text-emerald-400">₹{currentPrice.toLocaleString()}</p>
                <p className="text-[10px] text-emerald-300/50 uppercase tracking-wide">per quintal</p>
              </div>
              <div className={`bg-gradient-to-br backdrop-blur-xl rounded-[1.5rem] p-4 text-center border ${
                isPositive ? "from-emerald-900/40 to-green-900/40 border-emerald-500/20" : "from-red-900/40 to-orange-900/40 border-red-500/20"
              }`}>
                <p className={`text-xs mb-1 font-medium uppercase tracking-wider ${isPositive ? "text-emerald-300/70" : "text-red-300/70"}`}>YoY Change</p>
                <p className={`text-xl font-black flex items-center justify-center gap-1 ${
                  isPositive ? "text-emerald-400" : "text-red-400"
                }`}>
                  {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  {yoyChange}%
                </p>
                <p className={`text-[10px] uppercase tracking-wide ${isPositive ? "text-emerald-300/50" : "text-red-300/50"}`}>vs 2023-24</p>
              </div>
              <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-xl rounded-[1.5rem] p-4 text-center border border-blue-500/20">
                <p className="text-xs text-blue-300/70 mb-1 font-medium uppercase tracking-wider">Price Range</p>
                <p className="text-xl font-black text-blue-400">₹{minPrice.toLocaleString()}</p>
                <p className="text-[10px] text-blue-300/50 uppercase tracking-wide">to ₹{maxPrice.toLocaleString()}</p>
              </div>
            </div>
            
            {/* Chart */}
            <div className="px-6 pb-8">
              <h3 className="font-black text-white mb-4 uppercase tracking-wider text-sm">5-Year MSP Trend</h3>
              <div className="h-[220px] bg-white/5 backdrop-blur-xl rounded-[1.5rem] p-4 border border-white/10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 12, fill: '#fde047', fontWeight: 'bold' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#fde047', fontWeight: 'bold' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `₹${(v/1000).toFixed(1)}k`}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload?.[0]) {
                          return (
                            <div className="bg-black/90 backdrop-blur-xl shadow-lg rounded-xl p-3 border border-amber-500/30">
                              <p className="text-amber-300 text-sm">{payload[0].payload.year}</p>
                              <p className="font-black text-white">₹{payload[0].value?.toLocaleString()}/qtl</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke={crop.color}
                      strokeWidth={4}
                      dot={{ fill: crop.color, strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 10, fill: crop.color, stroke: "#fff", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// =========== MAIN MSP PAGE ===========
const MSP = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState<"kharif" | "rabi">("kharif");
  const [selectedCrop, setSelectedCrop] = useState<typeof mspData.kharif[0] | null>(null);

  const currentData = mspData[selectedSeason];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Glow Effects - Yellow/Amber theme */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[600px] h-[600px] bg-yellow-500/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header - Glassmorphism */}
      <motion.header 
        className="bg-gradient-to-r from-amber-900/30 via-yellow-900/25 to-amber-800/30 backdrop-blur-3xl border-b border-amber-500/30 text-white py-4 px-4 shadow-[0_4px_30px_rgba(245,158,11,0.15)] sticky top-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, rotate: -90 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="w-11 h-11 rounded-[1.2rem] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/50 flex items-center justify-center transition-all shadow-lg"
          >
            <ArrowLeft className="h-5 w-5 text-amber-400" />
          </motion.button>
          <motion.div
            className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <TrendingUp className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-base font-black tracking-tight uppercase">{t("msp.title")}</h1>
            <p className="text-[11px] text-amber-400/80 font-medium">{t("msp.subtitle")}</p>
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

      <main className="container mx-auto px-4 py-6 space-y-6 pb-8 relative z-10">
        {/* Season Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SeasonSwitch 
            season={selectedSeason} 
            onChange={(s) => { setSelectedSeason(s); setSelectedCrop(null); }} 
          />
        </motion.div>

        {/* Hero Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <HeroMSPCarousel crops={currentData} season={selectedSeason} />
        </motion.div>

        {/* Top Crops Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TopCropsBarChart 
            crops={currentData} 
            onCropSelect={setSelectedCrop}
          />
        </motion.div>

        {/* Crop List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CropList 
            crops={currentData} 
            onCropSelect={setSelectedCrop}
            selectedCrop={selectedCrop}
          />
        </motion.div>
      </main>

      {/* Trend Drawer */}
      <CropTrendDrawer 
        crop={selectedCrop} 
        onClose={() => setSelectedCrop(null)} 
      />
    </div>
  );
};

export default MSP;