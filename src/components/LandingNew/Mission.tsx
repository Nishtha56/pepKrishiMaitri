import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Rocket, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';



const Mission = () => {
    const { t } = useTranslation();
    
    const missionData = [
        {
            id: 1,
            title: t('landing.mission.empireOfSoil'),
            description: t('landing.mission.empireDesc'),
            icon: <Target className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1611843467160-25afb8df1074?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 2,
            title: t('landing.mission.sustainableFuture'),
            description: t('landing.mission.sustainableDesc'),
            icon: <Eye className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=800&auto=format&fit=crop"
        },
        {
            id: 3,
            title: t('landing.mission.aiSynthesis'),
            description: t('landing.mission.aiSynthesisDesc'),
            icon: <Rocket className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop"
        },
        {
            id: 4,
            title: t('landing.mission.farmerFirst'),
            description: t('landing.mission.farmerFirstDesc'),
            icon: <Heart className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop"
        }
    ];
    
    return (
        <section id="mission" className="py-32 bg-black relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter"
                    >
                        {t('landing.mission.title').split(' ')[0]} <span className="text-emerald-500">{t('landing.mission.title').split(' ')[1]}</span>
                    </motion.h2>
                    <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {missionData.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.8,
                                delay: index * 0.2,
                                type: "spring",
                                damping: 15
                            }}
                            viewport={{ once: true }}
                            className="bg-zinc-900/50 border border-white/10 rounded-[2.5rem] overflow-hidden group relative min-h-[400px] flex flex-col justify-end p-10"
                        >
                            <img
                                src={item.image}
                                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 group-hover:opacity-50 transition-all duration-1000"
                                alt={item.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-emerald-500/20">
                                    {item.icon}
                                </div>
                                <h4 className="text-3xl font-black text-white mb-4">
                                    {item.title}
                                </h4>
                                <p className="text-zinc-400 text-lg leading-relaxed font-light">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Mission;
