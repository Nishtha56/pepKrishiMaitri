import React from 'react';
import { motion } from 'framer-motion';
import {
    Bot,
    TrendingUp,
    CloudRain,
    Lightbulb,
    Gavel,
    ArrowUpRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';



const Features = () => {
    const { t } = useTranslation();
    
    const features = [
        {
            title: t('landing.features.mspTracker'),
            description: t('landing.features.mspTrackerDesc'),
            icon: <TrendingUp className="w-10 h-10" />,
            color: "from-emerald-600/20 to-teal-600/20",
            borderColor: "border-emerald-500/20",
            textColor: "text-emerald-400",
            size: "md:col-span-2 md:row-span-2"
        },
        {
            title: t('landing.features.aiAssistant'),
            description: t('landing.features.aiAssistantDesc'),
            icon: <Bot className="w-7 h-7" />,
            color: "from-blue-600/10 to-indigo-600/10",
            borderColor: "border-blue-500/10",
            textColor: "text-blue-400",
            size: "md:col-span-1 md:row-span-1"
        },
        {
            title: t('landing.features.weatherAI'),
            description: t('landing.features.weatherAIDesc'),
            icon: <CloudRain className="w-7 h-7" />,
            color: "from-amber-600/10 to-orange-600/10",
            borderColor: "border-amber-500/10",
            textColor: "text-amber-400",
            size: "md:col-span-1 md:row-span-1"
        },
        {
            title: t('landing.features.govtSchemes'),
            description: t('landing.features.govtSchemesDesc'),
            icon: <Gavel className="w-8 h-8" />,
            color: "from-rose-600/20 to-red-600/20",
            borderColor: "border-rose-500/20",
            textColor: "text-rose-400",
            size: "md:col-span-2 md:row-span-1"
        },
        {
            title: t('landing.features.cropIntelligence'),
            description: t('landing.features.cropIntelligenceDesc'),
            icon: <Lightbulb className="w-7 h-7" />,
            color: "from-purple-600/10 to-pink-600/10",
            borderColor: "border-purple-500/10",
            textColor: "text-purple-400",
            size: "md:col-span-1 md:row-span-1"
        }
    ];
    
    return (
        <section id="features" className="py-32 bg-black relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-20 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter"
                    >
                        {t('landing.features.title').split(' ')[0]} <span className="text-emerald-500">{t('landing.features.title').split(' ')[1]}</span>
                    </motion.h2>
                    <div className="w-24 h-1 bg-emerald-500" />
                    <p className="text-zinc-500 max-w-xl text-xl font-light">
                        {t('landing.features.subtitle')}
                    </p>
                </div>

                {/* Grid with MSP dominance */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                ease: ([0.23, 1, 0.32, 1] as any)
                            }}
                            viewport={{ once: true }}
                            className={`${feature.size} flex flex-col p-10 rounded-[2.5rem] border ${feature.borderColor} bg-white/[0.03] backdrop-blur-3xl group relative overflow-hidden transition-all duration-500 hover:bg-white/[0.06]`}
                        >
                            <div className="absolute top-8 right-8 text-white/5 group-hover:text-emerald-500/50 group-hover:rotate-45 transition-all duration-500">
                                <ArrowUpRight className="w-8 h-8" />
                            </div>

                            <div className={`mb-auto w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center ${feature.textColor} group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-xl shadow-black/50`}>
                                {feature.icon}
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-3xl font-black text-white mb-3 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-zinc-400 leading-relaxed font-light text-base md:text-lg">
                                    {feature.description}
                                </p>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-transparent group-hover:from-emerald-500/[0.03] transition-colors duration-700 pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
