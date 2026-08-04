import React, { useState, useEffect } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('Home');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Features', href: '#features' },
        { name: 'Mission', href: '#mission' },
        { name: 'Developers', href: '#developers' },
    ];

    return (
        <nav
            className={cn(
                'fixed top-0 w-full z-[100] transition-all duration-500 px-6 py-4 md:px-12',
                isScrolled ? 'top-4' : 'top-0'
            )}
        >
            <div
                className={cn(
                    'mx-auto max-w-7xl flex items-center justify-between transition-all duration-500 rounded-full px-8',
                    isScrolled
                        ? 'bg-black/60 backdrop-blur-2xl border border-white/10 py-3 shadow-2xl'
                        : 'bg-transparent py-6 border-transparent'
                )}
            >
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 group cursor-pointer"
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                        <span className="text-white font-black text-xl">KM</span>
                    </div>
                    <span className="text-white font-black text-xl tracking-tighter uppercase hidden sm:block">
                        KRISHI <span className="text-emerald-500">MAITRI</span>
                    </span>
                </motion.div>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center gap-2 bg-white/5 rounded-full p-1 border border-white/5">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setActiveLink(link.name)}
                            className={cn(
                                "relative px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300",
                                activeLink === link.name ? "text-white" : "text-white/40 hover:text-white"
                            )}
                        >
                            {activeLink === link.name && (
                                <motion.div
                                    layoutId="nav-bg"
                                    className="absolute inset-0 bg-emerald-500 rounded-full -z-10 shadow-lg shadow-emerald-500/20"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6">
                    <button className="hidden md:flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-black tracking-widest">
                        <Globe size={16} className="text-emerald-500" />
                        <span>EN</span>
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2.5 rounded-full shadow-lg shadow-emerald-500/20 text-xs font-black tracking-[0.15em] uppercase"
                    >
                        Sign In
                    </motion.button>

                    {/* Mobile Toggle */}
                    <button
                        className="lg:hidden text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-24 left-6 right-6 bg-zinc-900/95 backdrop-blur-2xl rounded-[2rem] border border-white/10 p-8 lg:hidden z-50"
                    >
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-2xl font-black text-white hover:text-emerald-500 transition-colors uppercase tracking-tight"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
