import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { schemesAPI } from "@/lib/api";
import { ArrowLeft, ExternalLink, Loader2, Sparkles, AlertCircle, Filter, MapPin, ChevronDown, FileText, CheckCircle, Users, Target, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Scheme {
  schemeId: string;
  name: string;
  level: string;
  states: string[];
  category: string;
  description: string;
  officialUrl: string;
  documentUrl: string;
  categoryInfo: {
    name: string;
    emoji: string;
  };
}

interface SchemeSummary {
  overview: string;
  keyBenefits: string[];
  whoCanBenefit: string[];
  generalEligibility: string[];
  opportunities: string[];
  limitations: string[];
  whyThisSchemeMatters: string[];
}

interface Category {
  id: string;
  name: string;
  emoji: string;
}

// Category colors for visual variety with purple base
const getCategoryColor = (categoryId: string): string => {
  const colors: Record<string, string> = {
    'income_support': 'from-emerald-500 to-green-600',
    'crop_insurance': 'from-blue-500 to-cyan-600',
    'soil_health': 'from-amber-500 to-yellow-600',
    'credit_loans': 'from-purple-500 to-violet-600',
    'irrigation': 'from-cyan-500 to-blue-600',
    'market_access': 'from-pink-500 to-rose-600',
    'organic_farming': 'from-lime-500 to-green-600',
    'technology': 'from-violet-500 to-purple-600',
  };
  return colors[categoryId] || 'from-gray-500 to-zinc-600';
};

const Schemes = () => {
  const { t } = useTranslation();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<string | null>(null);
  const [schemeSummaries, setSchemeSummaries] = useState<Record<string, SchemeSummary>>({});
  const [loadingSummary, setLoadingSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const navigate = useNavigate();
  const { toast } = useToast();

  const states = [
    "ALL", "Punjab", "Haryana", "Maharashtra", "Uttar Pradesh", "Madhya Pradesh",
    "Rajasthan", "Gujarat", "Karnataka", "Tamil Nadu", "Andhra Pradesh"
  ];

  useEffect(() => {
    loadData();
  }, [stateFilter, categoryFilter]);

  const loadData = async () => {
    const token = localStorage.getItem('digikheti_token');
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);
      
      const state = stateFilter === "ALL" ? null : stateFilter;
      const category = categoryFilter === "ALL" ? null : categoryFilter;
      const schemesData = await schemesAPI.list(state, category);
      setSchemes(schemesData.schemes || []);

      if (categories.length === 0) {
        const categoriesData = await schemesAPI.getCategories();
        setCategories(categoriesData.categories || []);
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

  const loadSchemeSummary = async (schemeId: string) => {
    if (schemeSummaries[schemeId]) return;

    setLoadingSummary(schemeId);
    try {
      const data = await schemesAPI.getSummary(schemeId);
      if (data.summary) {
        setSchemeSummaries(prev => ({
          ...prev,
          [schemeId]: data.summary
        }));
      }
    } catch (error: any) {
      toast({
        title: "Could not load summary",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingSummary(null);
    }
  };

  const handleSchemeClick = (schemeId: string) => {
    if (selectedScheme === schemeId) {
      setSelectedScheme(null);
    } else {
      setSelectedScheme(schemeId);
      loadSchemeSummary(schemeId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-purple-500 mb-4" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p className="text-purple-400 font-semibold">Loading schemes...</p>
          <p className="text-sm text-zinc-500 mt-1">Fetching government benefits</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Glow Effects - Purple theme */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[600px] h-[600px] bg-violet-500/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header - Purple Glassmorphism */}
      <motion.header 
        className="bg-gradient-to-r from-purple-900/30 via-violet-900/25 to-purple-800/30 backdrop-blur-3xl border-b border-purple-500/30 text-white py-4 px-4 shadow-[0_4px_30px_rgba(168,85,247,0.15)] sticky top-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, rotate: -90 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="w-11 h-11 rounded-[1.2rem] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 flex items-center justify-center transition-all shadow-lg"
          >
            <ArrowLeft className="h-5 w-5 text-purple-400" />
          </motion.button>
          <motion.div
            className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <FileText className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-base font-black uppercase tracking-tight">{t("schemes.title")}</h1>
            <p className="text-[11px] text-purple-400/80 font-medium">Explore government benefits for farmers</p>
          </div>
          <motion.div 
            className="ml-auto"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="h-6 w-6 text-purple-400" />
          </motion.div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-6 space-y-6 relative z-10">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-900/40 via-violet-900/30 to-purple-800/40 backdrop-blur-xl border border-purple-500/20 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(168,85,247,0.1)]"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {/* State Filter */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <MapPin className="h-5 w-5 text-purple-400" />
                </div>
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="appearance-none bg-white/10 backdrop-blur-xl rounded-[1.2rem] pl-12 pr-10 py-3 border border-purple-500/30 text-white text-sm font-bold outline-none cursor-pointer hover:bg-white/15 hover:border-purple-500/50 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-lg min-w-[180px]"
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a78bfa' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {states.map(state => (
                    <option key={state} value={state} style={{ backgroundColor: '#18181b', color: 'white', padding: '8px' }}>
                      {state === "ALL" ? "All States" : state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <Filter className="h-5 w-5 text-purple-400" />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none bg-white/10 backdrop-blur-xl rounded-[1.2rem] pl-12 pr-10 py-3 border border-purple-500/30 text-white text-sm font-bold outline-none cursor-pointer hover:bg-white/15 hover:border-purple-500/50 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-lg min-w-[200px]"
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a78bfa' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <option value="ALL" style={{ backgroundColor: '#18181b', color: 'white', padding: '8px' }}>All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} style={{ backgroundColor: '#18181b', color: 'white', padding: '8px' }}>
                      {cat.emoji} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-full text-sm font-bold">
                {schemes.length} scheme{schemes.length !== 1 ? 's' : ''}
              </span>
              {stateFilter !== "ALL" && (
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-full text-sm">
                  📍 {stateFilter}
                </span>
              )}
              {categoryFilter !== "ALL" && (
                <span className="bg-violet-500/20 text-violet-300 border border-violet-500/30 px-3 py-1.5 rounded-full text-sm">
                  {categories.find(c => c.id === categoryFilter)?.emoji} {categories.find(c => c.id === categoryFilter)?.name}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Schemes List */}
        {schemes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-slate-900/40 via-zinc-900/30 to-slate-800/40 backdrop-blur-xl border border-purple-500/20 rounded-[2.5rem] shadow-[0_0_50px_rgba(168,85,247,0.1)]"
          >
            <div className="py-16 text-center px-6">
              <motion.div 
                className="h-20 w-20 mx-auto mb-6 rounded-[1.5rem] bg-purple-500/20 flex items-center justify-center border border-purple-500/30"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertCircle className="h-10 w-10 text-purple-400" />
              </motion.div>
              <p className="text-lg font-semibold text-white mb-2">No schemes found</p>
              <p className="text-sm text-zinc-400 mb-6">Try adjusting your filters</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setStateFilter("ALL"); setCategoryFilter("ALL"); }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 rounded-[1.2rem] font-bold shadow-lg shadow-purple-500/30 text-white"
              >
                Clear Filters
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {schemes.map((scheme, idx) => (
              <motion.div
                key={scheme.schemeId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`bg-white/5 backdrop-blur-xl border rounded-[2.5rem] overflow-hidden transition-all shadow-lg ${
                  selectedScheme === scheme.schemeId 
                    ? "border-purple-500/50 bg-purple-500/10 ring-2 ring-purple-500/30" 
                    : "border-white/10 hover:border-purple-500/30 hover:bg-white/10"
                }`}
              >
                {/* Header */}
                <div 
                  className="cursor-pointer p-6 transition-colors"
                  onClick={() => handleSchemeClick(scheme.schemeId)}
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${getCategoryColor(scheme.category)} flex items-center justify-center text-3xl shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {scheme.categoryInfo?.emoji || '📋'}
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">{scheme.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <span className="text-xs bg-white/10 text-zinc-300 border border-white/20 rounded-full px-3 py-1 font-medium">
                          {scheme.categoryInfo?.name || scheme.category}
                        </span>
                        <span className={`text-xs border-0 rounded-full px-3 py-1 font-bold ${
                          scheme.level === 'central' 
                            ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white' 
                            : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                        }`}>
                          {scheme.level === 'central' ? '🇮🇳 Central' : '🏛️ State'}
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm">{scheme.description}</p>
                      {scheme.states[0] !== "ALL" && (
                        <p className="text-xs text-purple-400 mt-2 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                         {scheme.states.slice(0, 3).join(", ")}{scheme.states.length > 3 && ` +${scheme.states.length - 3} more`}
                        </p>
                      )}
                    </div>
                    <motion.div
                      animate={{ rotate: selectedScheme === scheme.schemeId ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-purple-400"
                    >
                      <ChevronDown className="h-6 w-6" />
                    </motion.div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {selectedScheme === scheme.schemeId && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="border-t border-white/10 p-6 space-y-5">
                        {/* AI Summary Section */}
                        <div className="bg-gradient-to-br from-amber-900/40 via-yellow-900/30 to-amber-800/40 backdrop-blur-xl rounded-[1.5rem] p-5 border border-amber-500/20">
                          <div className="flex items-center gap-2 mb-4">
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                              <Sparkles className="h-5 w-5 text-amber-400" />
                            </motion.div>
                            <span className="font-black text-white tracking-tight uppercase text-sm">AI-Powered Summary</span>
                            <span className="bg-amber-500/20 text-amber-300 border-0 text-xs px-2 py-1 rounded-full font-bold">Beta</span>
                          </div>
                          
                          {loadingSummary === scheme.schemeId ? (
                            <div className="flex items-center gap-3 text-zinc-300">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Loader2 className="h-5 w-5" />
                              </motion.div>
                              <span>Generating summary...</span>
                            </div>
                          ) : schemeSummaries[scheme.schemeId] ? (
                            <div className="space-y-4">
                              <p className="text-zinc-200 leading-relaxed text-sm">{schemeSummaries[scheme.schemeId].overview}</p>

                              <div className="grid md:grid-cols-2 gap-3">
                                {/* Key Benefits */}
                                <motion.div 
                                  className="bg-white/5 backdrop-blur-sm rounded-[1.2rem] p-4 border border-emerald-500/20"
                                  whileHover={{ scale: 1.01 }}
                                >
                                  <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <CheckCircle className="h-4 w-4" />
                                    Key Benefits
                                  </h4>
                                  <ul className="text-xs space-y-2">
                                    {schemeSummaries[scheme.schemeId].keyBenefits?.slice(0, 4).map((benefit, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-zinc-300">
                                        <span className="text-emerald-400 mt-1">•</span>
                                        {benefit}
                                      </li>
                                    ))}
                                  </ul>
                                </motion.div>

                                {/* Who Can Benefit */}
                                <motion.div 
                                  className="bg-white/5 backdrop-blur-sm rounded-[1.2rem] p-4 border border-blue-500/20"
                                  whileHover={{ scale: 1.01 }}
                                >
                                  <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <Users className="h-4 w-4" />
                                    Who Can Benefit
                                  </h4>
                                  <ul className="text-xs space-y-2">
                                    {schemeSummaries[scheme.schemeId].whoCanBenefit?.slice(0, 4).map((who, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-zinc-300">
                                        <span className="text-blue-400 mt-1">•</span>
                                        {who}
                                      </li>
                                    ))}
                                  </ul>
                                </motion.div>

                                {/* Eligibility */}
                                <motion.div 
                                  className="bg-white/5 backdrop-blur-sm rounded-[1.2rem] p-4 border border-purple-500/20"
                                  whileHover={{ scale: 1.01 }}
                                >
                                  <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <Target className="h-4 w-4" />
                                    General Eligibility
                                  </h4>
                                  <ul className="text-xs space-y-2">
                                    {schemeSummaries[scheme.schemeId].generalEligibility?.slice(0, 4).map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-zinc-300">
                                        <span className="text-purple-400 mt-1">•</span>
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </motion.div>

                                {/* Opportunities */}
                                <motion.div 
                                  className="bg-white/5 backdrop-blur-sm rounded-[1.2rem] p-4 border border-orange-500/20"
                                  whileHover={{ scale: 1.01 }}
                                >
                                  <h4 className="font-bold text-orange-400 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <Lightbulb className="h-4 w-4" />
                                    Opportunities
                                  </h4>
                                  <ul className="text-xs space-y-2">
                                    {schemeSummaries[scheme.schemeId].opportunities?.slice(0, 4).map((opp, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-zinc-300">
                                        <span className="text-orange-400 mt-1">•</span>
                                        {opp}
                                      </li>
                                    ))}
                                  </ul>
                                </motion.div>
                              </div>

                              <p className="text-xs text-zinc-500 text-center pt-2">
                                ⚠️ AI-generated summary. Please verify from official sources.
                              </p>
                            </div>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => loadSchemeSummary(scheme.schemeId)}
                              className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white rounded-[1.2rem] px-4 py-2.5 font-bold shadow-lg shadow-amber-500/30 text-sm flex items-center gap-2"
                            >
                              <Sparkles className="h-4 w-4" />
                              Generate AI Summary
                            </motion.button>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-white rounded-[1.2rem] px-4 py-3 font-bold shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                            onClick={() => window.open(scheme.officialUrl, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4" />
                            Visit Official Website
                          </motion.button>
                          {scheme.documentUrl && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-white/5 hover:bg-white/10 border border-purple-500/30 text-purple-300 rounded-[1.2rem] px-4 py-3 font-bold"
                              onClick={() => window.open(scheme.documentUrl, "_blank")}
                            >
                              📄 Guidelines
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {/* Data Source */}
        <motion.div 
          className="text-center py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl rounded-full px-4 py-2 border border-white/10">
            <FileText className="h-4 w-4 text-purple-400" />
            <p className="text-xs text-zinc-400">
              Data sourced from official government portals
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Schemes;