import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sprout, Target, Heart, Zap, 
  Globe, Shield, Menu, X, ChevronRight
} from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useState } from "react";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
};

// Team members
const team = [
  {
    name: "Dr. Anil Kumar",
    role: "Founder & CEO",
    description: "Former agricultural scientist with 20+ years of experience in sustainable farming practices.",
    avatar: "AK"
  },
  {
    name: "Priya Sharma",
    role: "Head of AI",
    description: "Machine learning expert specializing in agricultural data analysis and prediction models.",
    avatar: "PS"
  },
  {
    name: "Rajesh Singh",
    role: "Head of Operations",
    description: "Connects with farming communities across India to understand real ground-level challenges.",
    avatar: "RS"
  }
];

// Values with new color gradients
const values = [
  {
    icon: Heart,
    title: "Farmer First",
    description: "Every feature we build is designed with farmers' real needs in mind. We listen, learn, and improve.",
    gradient: "from-terracotta-400 to-terracotta-600"
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Available in multiple languages and designed for users with varying levels of tech literacy.",
    gradient: "from-oceanBlue-400 to-oceanBlue-600"
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "We provide accurate, verified information backed by government data and expert research.",
    gradient: "from-forestGreen-400 to-forestGreen-600"
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Leveraging cutting-edge AI to bring smart farming solutions to every farmer in India.",
    gradient: "from-mutedAmber-400 to-mutedAmber-600"
  }
];

// Navigation links
const navLinks = [
  { label: "Features", path: "/#features", isScroll: true },
  { label: "How it Works", path: "/#how-it-works", isScroll: true },
  { label: "Testimonials", path: "/#testimonials", isScroll: true },
  { label: "About", path: "/about", isScroll: false },
  { label: "Contact", path: "/contact", isScroll: false },
];

const About = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.isScroll) {
      navigate("/");
      setTimeout(() => {
        const id = link.path.replace("/#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(link.path);
    }
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path.startsWith("/#")) return false;
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Consistent Navbar */}
      <header className="sticky top-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-forestGreen-700 via-forestGreen-800 to-forestGreen-900">
          <div 
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>
        <nav className="container mx-auto px-4 py-4 relative z-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/" className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-mutedAmber-300 to-mutedAmber-500 flex items-center justify-center shadow-lg">
                  <Sprout className="h-5 w-5 text-forestGreen-900" />
                </div>
                <span className="text-xl font-bold text-white">{t("common.appName")}</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <motion.button
                  key={link.path}
                  onClick={() => handleNavClick(link)}
                  className={`font-medium transition-all relative ${
                    isActive(link.path) 
                      ? 'text-mutedAmber-300' 
                      : 'text-white/80 hover:text-mutedAmber-300'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-mutedAmber-400 rounded-full"
                      layoutId="activeIndicator"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher />
              <Button 
                variant="ghost" 
                onClick={() => navigate("/auth")}
                className="text-white/90 hover:text-white hover:bg-white/10 border border-white/20"
              >
                Login
              </Button>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button 
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-mutedAmber-400 to-mutedAmber-500 hover:from-mutedAmber-500 hover:to-mutedAmber-600 text-forestGreen-900 font-semibold shadow-lg rounded-xl px-6"
                >
                  Register
                </Button>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <motion.button 
              className="md:hidden p-2 text-white" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                className="md:hidden mt-4 pb-4 border-t border-white/10"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col gap-4 pt-4">
                  {navLinks.map((link) => (
                    <button 
                      key={link.path}
                      onClick={() => handleNavClick(link)} 
                      className={`font-medium text-left ${
                        isActive(link.path) ? 'text-mutedAmber-300' : 'text-white/80'
                      }`}
                    >
                      {isActive(link.path) && "● "}{link.label}
                    </button>
                  ))}
                  <div className="flex gap-3 pt-2">
                    <LanguageSwitcher />
                    <Button variant="outline" onClick={() => navigate("/auth")} className="border-white/30 text-white">Login</Button>
                    <Button onClick={() => navigate("/auth")} className="bg-mutedAmber-400 text-forestGreen-900">Register</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-offwhite-200/80 via-offwhite to-offwhite" />
        <motion.div 
          className="absolute top-20 left-10 w-80 h-80 bg-forestGreen-300/20 rounded-full blur-3xl"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-96 h-96 bg-mutedAmber-300/15 rounded-full blur-3xl"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            >
              About <span className="bg-gradient-to-r from-forestGreen-600 to-forestGreen-500 bg-clip-text text-transparent">{t("common.appName")}</span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-600 leading-relaxed"
            >
              We're on a mission to empower every farmer in India with AI-driven insights 
              for smarter, more sustainable, and profitable agriculture.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-mutedAmber-100 to-mutedAmber-200/80 text-mutedAmber-700 text-sm font-semibold border border-mutedAmber-300/40 mb-4">
                <Target className="h-4 w-4" />
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 tracking-tight">
                Making Smart Farming Accessible to All
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Agriculture is the backbone of India, supporting over 50% of our population. 
                Yet many farmers lack access to critical information about weather, crop prices, 
                government schemes, and modern farming techniques.
              </p>
              <p className="text-gray-600 leading-relaxed">
                {t("common.appName")} bridges this gap by providing AI-powered insights in 
                multiple languages, helping farmers make informed decisions that improve their 
                yields and livelihoods.
              </p>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card className="border-0 shadow-xl bg-gradient-to-br from-forestGreen-600 to-forestGreen-700 text-white rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-1">10,000+</div>
                      <div className="text-white/80 text-sm">Farmers Helped</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-1">15+</div>
                      <div className="text-white/80 text-sm">States Covered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-1">50+</div>
                      <div className="text-white/80 text-sm">Crop Types</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-1">24/7</div>
                      <div className="text-white/80 text-sm">AI Support</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-offwhite via-mutedAmber-50/30 to-offwhite" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at {t("common.appName")}
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                variants={scaleIn}
                whileHover={{ y: -6 }}
              >
                <Card className="h-full border-0 shadow-soft-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <motion.div 
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                      whileHover={{ scale: 1.1 }}
                    >
                      <value.icon className="h-7 w-7 text-white" />
                    </motion.div>
                    <h3 className="text-lg font-bold mb-2 text-gray-800">{value.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Passionate individuals dedicated to transforming Indian agriculture
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-7 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {team.map((member, index) => (
              <motion.div 
                key={index} 
                variants={scaleIn}
                whileHover={{ y: -6 }}
              >
                <Card className="h-full border-0 shadow-soft-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden text-center">
                  <CardContent className="p-7">
                    <motion.div 
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-forestGreen-400 to-forestGreen-600 flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      {member.avatar}
                    </motion.div>
                    <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
                    <p className="text-forestGreen-600 text-sm font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="relative rounded-3xl p-12 md:p-16 text-center text-white overflow-hidden max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleIn}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-forestGreen-700 via-forestGreen-600 to-forestGreen-700" />
            <div 
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Join Our Mission</h2>
              <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
                Start your journey towards smarter farming today. It's free to get started!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button 
                    size="lg"
                    onClick={() => navigate("/auth")}
                    className="bg-white text-forestGreen-700 hover:bg-offwhite-100 shadow-lg rounded-xl px-8 font-semibold"
                  >
                    Get Started Free
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button 
                    size="lg"
                    onClick={() => navigate("/contact")}
                    className="bg-mutedAmber-400 hover:bg-mutedAmber-500 text-forestGreen-900 border-0 rounded-xl px-8 font-semibold shadow-lg"
                  >
                    Contact Us
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-offwhite-200 border-t border-mutedAmber-200/50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © 2024 {t("common.appName")}. Empowering farmers with AI-driven agricultural guidance.
        </div>
      </footer>
    </div>
  );
};

export default About;
