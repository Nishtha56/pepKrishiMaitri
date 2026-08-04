import React from 'react';
import { motion } from 'framer-motion';
import {
    Mail, Phone, Sprout, Send,
    ChevronRight, ArrowUpRight, Github, Linkedin,
    Facebook, Twitter, Instagram
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="bg-[#050505] text-white pt-32 pb-12 border-t border-white/5 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-2xl shadow-emerald-500/20">
                                <Sprout className="text-white w-7 h-7" />
                            </div>
                            <span className="text-3xl font-black tracking-tighter uppercase">KRISHI <span className="text-emerald-500">MAITRI</span></span>
                        </div>
                        <p className="text-zinc-500 leading-relaxed font-light text-lg">
                            {t('landing.footer.tagline')}
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, href: "#" },
                                { Icon: Twitter, href: "#" },
                                { Icon: Instagram, href: "#" },
                                { Icon: Github, href: "#" },
                                { Icon: Linkedin, href: "#" }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-emerald-500 hover:text-white transition-all transform hover:-translate-y-2 border border-white/5"
                                >
                                    <social.Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-12">
                        <div>
                            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-10 text-emerald-500">{t('landing.footer.platform')}</h4>
                            <ul className="space-y-5 text-zinc-500 font-medium">
                                <li><a href="#home" className="hover:text-white flex items-center gap-2 group transition-colors"><ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> {t('landing.footer.hero')}</a></li>
                                <li><a href="#about" className="hover:text-white flex items-center gap-2 group transition-colors"><ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> {t('landing.footer.about')}</a></li>
                                <li><a href="#features" className="hover:text-white flex items-center gap-2 group transition-colors"><ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> {t('landing.footer.features')}</a></li>
                                <li><a href="#mission" className="hover:text-white flex items-center gap-2 group transition-colors"><ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> {t('landing.footer.mission')}</a></li>
                                <li><a href="#developers" className="hover:text-white flex items-center gap-2 group transition-colors"><ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> {t('landing.footer.ourTeam')}</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-10 text-emerald-500">{t('landing.footer.resources')}</h4>
                            <ul className="space-y-5 text-zinc-500 font-medium">
                                <li><Link to="/contact" className="hover:text-white flex items-center gap-2 group transition-colors"><ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> {t('landing.footer.support')}</Link></li>
                                <li><Link to="/privacy" className="hover:text-white flex items-center gap-2 group transition-colors"><ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> {t('landing.footer.privacy')}</Link></li>
                                <li><Link to="/terms" className="hover:text-white flex items-center gap-2 group transition-colors"><ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> {t('landing.footer.terms')}</Link></li>
                                <li><a href="#" className="hover:text-white flex items-center gap-2 group transition-colors"><ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> {t('landing.footer.mediaKit')}</a></li>
                                <li><a href="#" className="hover:text-white flex items-center gap-2 group transition-colors"><ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> {t('landing.footer.apiDocs')}</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter & Contact Section */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4">
                                <ArrowUpRight className="text-white/10 group-hover:text-emerald-500 transition-colors" size={32} />
                            </div>
                            <h4 className="text-white font-bold text-xl mb-4">{t('landing.footer.stayPlanted')}</h4>
                            <p className="text-zinc-500 text-sm mb-6 leading-relaxed">{t('landing.footer.newsletterDesc')}</p>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder={t('landing.footer.emailPlaceholder')}
                                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-light"
                                />
                                <button className="absolute right-2 top-2 bottom-2 bg-emerald-500 hover:bg-emerald-400 text-white px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 px-4">
                            <div className="flex items-center gap-4 text-zinc-500">
                                <Mail size={18} className="text-emerald-500" />
                                <span className="text-sm">hello@krishimaitri.tech</span>
                            </div>
                            <div className="flex items-center gap-4 text-zinc-500">
                                <Phone size={18} className="text-emerald-500" />
                                <span className="text-sm">+91 1800-KM-FARM</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-600 text-xs font-bold tracking-widest uppercase">
                    <p>© {new Date().getFullYear()} {t('landing.footer.copyright')}</p>
                    <div className="flex gap-10">
                        <Link to="/privacy" className="hover:text-emerald-500 transition-colors">{t('landing.footer.dataProtocol')}</Link>
                        <Link to="/terms" className="hover:text-emerald-500 transition-colors">{t('landing.footer.legalFramework')}</Link>
                        <a href="#" className="hover:text-emerald-500 transition-colors">{t('landing.footer.cookies')}</a>
                    </div>
                    <p className="flex items-center gap-2">
                        {t('landing.footer.systemStatus')} <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {t('landing.footer.operational')}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
