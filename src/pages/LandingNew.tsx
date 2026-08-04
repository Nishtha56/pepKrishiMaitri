import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SideNav from '@/components/LandingNew/SideNav';
import VideoHero from '@/components/LandingNew/VideoHero';
import Features from '@/components/LandingNew/Features';
import Mission from '@/components/LandingNew/Mission';
import Developers from '@/components/LandingNew/Developers';
import Footer from '@/components/LandingNew/Footer';
import { useTranslation } from 'react-i18next';

const LandingNew = () => {
    const { t } = useTranslation();
    const aboutRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: aboutRef,
        offset: ["start end", "end start"]
    });

    const imgY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
    const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);

    return (
        <div className="bg-black min-h-screen font-sans selection:bg-emerald-500/30 selection:text-emerald-400">
            <SideNav />
            <main>
                <VideoHero />

                {/* About Section */}
                <section ref={aboutRef} id="about" className="py-32 bg-black relative overflow-hidden text-white">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                            <motion.div
                                style={{ y: imgY }}
                                className="relative"
                            >
                                <div className="absolute -inset-8 bg-emerald-500/20 blur-[100px] rounded-full animate-pulse" />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1 }}
                                    className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=800&auto=format&fit=crop"
                                        alt="About Us"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                </motion.div>
                            </motion.div>

                            <motion.div style={{ y: textY }}>
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <h3 className="text-emerald-500 font-black tracking-[0.3em] uppercase text-sm mb-6">{t('landing.about.ourPhilosophy')}</h3>
                                    <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight uppercase tracking-tighter">{t('landing.about.growingWithPurpose').split(' ')[0]} <br /> {t('landing.about.growingWithPurpose').split(' ').slice(1).join(' ')}</h2>
                                    <p className="text-zinc-400 text-xl leading-relaxed mb-10 font-light">
                                        {t('landing.about.description')}
                                    </p>
                                    <div className="grid grid-cols-2 gap-12">
                                        <div>
                                            <motion.h4
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                className="text-4xl font-black text-white mb-2"
                                            >
                                                10K+
                                            </motion.h4>
                                            <p className="text-emerald-500 text-xs font-bold tracking-widest uppercase">{t('landing.about.globalFarmersLabel')}</p>
                                        </div>
                                        <div>
                                            <motion.h4
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className="text-4xl font-black text-white mb-2"
                                            >
                                                95%
                                            </motion.h4>
                                            <p className="text-emerald-500 text-xs font-bold tracking-widest uppercase">{t('landing.about.yieldPredictabilityLabel')}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <Features />
                <Mission />
                <Developers />
                <div id="contact">
                    <Footer />
                </div>
            </main>
        </div>
    );
};

export default LandingNew;
