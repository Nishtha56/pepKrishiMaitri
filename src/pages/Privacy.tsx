import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-black min-h-screen relative overflow-hidden">
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
                            <ShieldCheck className="h-6 w-6 text-white" />
                        </motion.div>
                        <div>
                            <h1 className="text-base font-black tracking-tight uppercase">{t('privacy.title')}</h1>
                            <p className="text-[11px] text-emerald-400/80 font-medium">{t('privacy.subtitle')}</p>
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

            <div className="container mx-auto px-4 md:px-6 py-12 relative z-10">
                <motion.div 
                    className="max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter">
                            {t('privacy.privacyFirst').split(' ')[0]} <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">{t('privacy.privacyFirst').split(' ')[1]}</span>
                        </h2>
                        <p className="text-zinc-400 text-lg">
                            {t('privacy.description')}
                        </p>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 rounded-[2.5rem] p-8 shadow-lg"
                        >
                            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
                                <span className="text-emerald-400">1.</span> {t('privacy.dataCollection')}
                            </h2>
                            <p className="text-zinc-400 leading-relaxed">
                                {t('privacy.dataCollectionDesc')}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 rounded-[2.5rem] p-8 shadow-lg"
                        >
                            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
                                <span className="text-emerald-400">2.</span> {t('privacy.howWeUse')}
                            </h2>
                            <p className="text-zinc-400 leading-relaxed">
                                {t('privacy.howWeUseDesc')}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 rounded-[2.5rem] p-8 shadow-lg"
                        >
                            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
                                <span className="text-emerald-400">3.</span> {t('privacy.dataSecurity')}
                            </h2>
                            <p className="text-zinc-400 leading-relaxed">
                                {t('privacy.dataSecurityDesc')}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 rounded-[2.5rem] p-8 shadow-lg"
                        >
                            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
                                <span className="text-emerald-400">4.</span> {t('privacy.transparencyChoice')}
                            </h2>
                            <p className="text-zinc-400 leading-relaxed">
                                {t('privacy.transparencyChoiceDesc')}
                            </p>
                        </motion.div>
                    </div>

                    {/* Last Updated */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-center mt-12 text-zinc-500 text-sm"
                    >
                        {t('privacy.lastUpdated')}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPage;
