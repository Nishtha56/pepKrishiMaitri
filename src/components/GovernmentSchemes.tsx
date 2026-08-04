import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { schemesAPI } from "@/lib/api";
import { Loader2, Sparkles, ChevronRight } from "lucide-react";

interface Scheme {
  schemeId: string;
  name: string;
  category: string;
  categoryInfo: {
    name: string;
    emoji: string;
  };
}

const GovernmentSchemes = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    try {
      const data = await schemesAPI.list(null, null);
      setSchemes((data.schemes || []).slice(0, 4));
    } catch (error) {
      console.error("Error loading schemes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/60 via-violet-900/50 to-indigo-900/60 backdrop-blur-xl border border-purple-500/20 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(168,85,247,0.1)] h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="h-5 w-5 text-purple-400" />
          </motion.div>
          <h3 className="font-black text-lg tracking-tight text-white uppercase">{t("schemes.title")}</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/schemes")}
          className="text-purple-300 hover:text-purple-200 text-sm font-medium flex items-center gap-1"
        >
          {t("common.viewAll")} <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-6 w-6 text-purple-400" />
            </motion.div>
          </div>
        ) : (
          <div className="space-y-2">
            {schemes.map((scheme, index) => (
              <motion.div
                key={scheme.schemeId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="group"
              >
                <div
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer border border-purple-500/20 hover:border-purple-400/40 transition-all"
                  onClick={() => navigate("/schemes")}
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-xl border border-purple-500/30">
                    {scheme.categoryInfo?.emoji || '📋'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-white truncate tracking-tight">
                      {scheme.name}
                    </p>
                    <p className="text-xs text-purple-300/80">
                      {scheme.categoryInfo?.name || scheme.category}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-purple-400/60 group-hover:text-purple-300 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tip Box */}
        <motion.div 
          className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20 mt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-purple-100 leading-relaxed">
            <span className="font-bold text-purple-300">💡 Tip:</span>{" "}
            Click on any scheme to get AI-powered summaries explaining benefits, eligibility, and how to apply.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default GovernmentSchemes;