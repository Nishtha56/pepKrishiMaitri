import React from 'react';
import { Linkedin, Github, Instagram, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const developers = [
    {
        name: "SHREY RAI",
        role: "Frontend Developer",
        image: "https://i.pinimg.com/1200x/a7/ff/3f/a7ff3f9d1acd77d2a90a143f543a1885.jpg",
        bio: "Building clean and responsive UI for smooth user experience.",

        socials: { linkedin: "#", github: "#", insta: "#" }
    },
    {
        name: "KRITI RAI",
        role: "Backend Developer",
        image: "https://i.pinimg.com/1200x/fb/83/bb/fb83bb07eb875316a820e9fd7361069f.jpg",
        bio: "Architecting robust backend apis for real-time agricultural data.",
        socials: { linkedin: "#", github: "#", insta: "#" }
    },
    {
        name: "PULKIT GULERIA",
        role: "UI UX",
        image: "https://i.pinimg.com/1200x/e6/a9/8a/e6a98a257565d829009a1c1735ee1589.jpg",
        bio: "Designing cinematic UI and intuitive design for smooth user experience",
        socials: { linkedin: "#", github: "#", insta: "#" }
    }
];

const Developers = () => {
    const { t } = useTranslation();
    return (
        <section id="developers" className="py-32 bg-black relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter"
                    >
                        {t('landing.team.title').split(' ')[0]} <span className="text-emerald-500">{t('landing.team.title').split(' ')[2]}</span>
                    </motion.h2>
                    <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
                    {developers.map((dev, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.8 }}
                            whileHover={{ y: -15 }}
                            className="group relative"
                        >
                            {/* Card with Glow Effect */}
                            <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900/50 border border-white/10 p-8 transition-all duration-500 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]">

                                <div className="relative mb-8 w-32 h-32 mx-auto">
                                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-10 group-hover:opacity-40 transition-opacity" />
                                    <img
                                        src={dev.image}
                                        alt={dev.name}
                                        className="relative w-full h-full object-cover rounded-full border-4 border-zinc-800 group-hover:border-emerald-500 transition-colors duration-500"
                                    />
                                </div>

                                <div className="text-center mb-8">
                                    <h4 className="text-2xl font-black text-white mb-1 transition-colors group-hover:text-emerald-400">{dev.name}</h4>
                                    <p className="text-emerald-500 text-xs font-black uppercase tracking-[0.2em] mb-4">{dev.role}</p>
                                    <p className="text-zinc-500 text-sm leading-relaxed font-light">
                                        {dev.bio}
                                    </p>
                                </div>

                                <div className="flex justify-center gap-6 pt-6 border-t border-white/5">
                                    <a href={dev.socials.linkedin} className="text-zinc-500 hover:text-emerald-400 transition-colors transform hover:scale-110"><Linkedin size={20} /></a>
                                    <a href={dev.socials.github} className="text-zinc-500 hover:text-emerald-400 transition-colors transform hover:scale-110"><Github size={20} /></a>
                                    <a href={dev.socials.insta} className="text-zinc-500 hover:text-emerald-400 transition-colors transform hover:scale-110"><Instagram size={20} /></a>
                                </div>

                                <ExternalLink className="absolute top-8 right-8 text-white/5 group-hover:text-emerald-500/30 transition-colors" size={24} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Developers;
