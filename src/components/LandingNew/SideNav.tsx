import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';



const SideNav = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const isLandingPage = location.pathname === '/landing-new';

    const navItems = [
        { name: t('landing.footer.hero'), href: '#home' },
        { name: t('landing.footer.about'), href: '#about' },
        { name: t('landing.footer.features'), href: '#features' },
        { name: t('landing.footer.mission'), href: '#mission' },
        { name: t('landing.footer.ourTeam'), href: '#developers' },
        { name: t('landing.footer.contact'), href: '#contact' }
    ];

    const handleNav = (item: typeof navItems[0]) => {
        // Special handling for Contact - navigate to dedicated page
        if (item.href === '#contact') {
            navigate('/contact');
            return;
        }

        if (isLandingPage) {
            const element = document.getElementById(item.href.replace('#', ''));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate('/landing-new' + item.href);
        }
    };

    return (
        <div 
            className="fixed right-8 md:right-12 z-[100] hidden lg:block"
            style={{
                top: '50%',
                transform: 'translateY(-50%)'
            }}
        >
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="flex flex-col gap-6 items-end">
                    {navItems.map((item, index) => (
                        <motion.button
                            key={item.name}
                            onClick={() => handleNav(item)}
                            whileHover={{ x: -10 }}
                            className="group relative"
                        >
                            <span className="text-white/40 group-hover:text-emerald-500 font-black text-xs uppercase tracking-[0.4em] transition-all duration-300">
                                {item.name}
                            </span>
                            <motion.div
                                className="absolute -bottom-1 right-0 h-[2px] bg-emerald-500 rounded-full"
                                initial={{ width: 0 }}
                                whileHover={{ width: '100%' }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.button>
                    ))}
                </div>

                {/* Minimal scroll indicator text */}
                <div className="absolute top-[120%] right-full whitespace-nowrap -rotate-90 origin-right mr-4 opacity-10 font-bold tracking-[1em] uppercase text-[10px] text-white">
                    Navigation
                </div>
            </motion.div>
        </div>
    );
};

export default SideNav;
