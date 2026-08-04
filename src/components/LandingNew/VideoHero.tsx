import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowDown, Sparkles, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Typewriter from 'typewriter-effect';
import { cn } from '@/lib/utils';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const videos = [
    '/farm.mp4',
    '/green.mp4',
    '/flower.mp4'
];

const VideoHero = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [currentVideo, setCurrentVideo] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentVideo((prev) => (prev + 1) % videos.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="home" className="relative h-screen w-full overflow-hidden bg-black">
            {/* Background Videos with Smooth Transitions */}
            <AnimatePresence mode="wait">
                <motion.video
                    key={currentVideo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                >
                    <source src={videos[currentVideo]} type="video/mp4" />
                </motion.video>
            </AnimatePresence>

            {/* Cinematic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-10" />

            {/* Top Right: Language Switcher & Sign In */}
            <div className="absolute top-8 right-8 z-30 flex items-center gap-3">
                <LanguageSwitcher />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/auth')}
                    className="flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
                >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('landing.signIn')}</span>
                </motion.button>
            </div>

            {/* Content Container */}
            <div className="relative z-20 h-full container mx-auto px-6 flex items-center">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 uppercase tracking-tighter leading-none">
                            <Typewriter
                                options={{
                                    strings: ['KRISHI MAITRI'],
                                    autoStart: true,
                                    loop: true,
                                    cursor: '_',
                                    delay: 80,
                                    deleteSpeed: 50
                                }}
                            />
                        </h1>
                        <p className="text-emerald-500 font-black tracking-[0.4em] uppercase text-[10px] md:text-xs mb-10">
                            The Future of Autonomous Agriculture
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="bg-black/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] w-full max-w-[420px] aspect-square flex flex-col justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] border-t-white/20"
                    >
                        <div className="space-y-6">
                            <div className="w-12 h-1 bg-emerald-500 rounded-full" />
                            <p className="text-white/80 text-lg md:text-xl leading-relaxed font-light">
                                {t('landing.tagline')}
                            </p>
                            <div className="flex flex-col gap-4 pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/auth')}
                                    className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-between group"
                                >
                                    {t('landing.getStarted')}
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="border border-white/10 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all backdrop-blur-md flex items-center justify-between"
                                >
                                    {t('landing.exploreFeatures')}
                                    <Sparkles className="w-4 h-4 text-emerald-400" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Video Navigation Indicators */}
            <div className="absolute right-12 bottom-12 z-30 flex flex-col gap-4">
                {videos.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentVideo(index)}
                        className="relative group p-2"
                    >
                        <div className={cn(
                            "w-1 h-8 transition-all duration-500 rounded-full bg-white/20 group-hover:bg-white/40",
                            currentVideo === index && "h-16 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        )} />
                    </button>
                ))}
            </div>

            {/* Down Indicator */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: 'reverse' }}
                className="absolute left-1/2 bottom-12 z-30 -translate-x-1/2 text-white/20"
            >
                <ArrowDown size={32} />
            </motion.div>
        </section>
    );
};

export default VideoHero;
