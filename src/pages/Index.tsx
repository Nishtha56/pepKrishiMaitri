import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sprout, Cloud, Bot, TrendingUp, ChevronRight, 
  Leaf, Shield, Menu, X, ArrowRight, Sparkles, BookOpen
} from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// Enhanced animation variants with smooth easing
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
  }
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
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const slideInFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7 } }
};

const floatAnimation = {
  animate: {
    y: [0, -8, 0],
    transition: { repeat: Infinity, duration: 4, ease: "easeInOut" }
  }
};

// Features data with new muted color gradients
const features = [
  {
    icon: Bot,
    title: "AI Chatbot",
    description: "Get instant answers to your farming questions from our AI-powered Krishi Saathi assistant.",
    gradient: "from-plumViolet-400 to-plumViolet-600",
    bgGlow: "bg-plumViolet-400/20"
  },
  {
    icon: TrendingUp,
    title: "MSP Prices",
    description: "Track government-announced minimum support prices with year-wise trends and alerts.",
    gradient: "from-mutedAmber-400 to-mutedAmber-600",
    bgGlow: "bg-mutedAmber-400/20"
  },
  {
    icon: Cloud,
    title: "Weather Forecast",
    description: "7-day weather predictions with AI-powered farming advice tailored to your location.",
    gradient: "from-oceanBlue-400 to-oceanBlue-600",
    bgGlow: "bg-oceanBlue-400/20"
  },
  {
    icon: Leaf,
    title: "Crop Suggestions",
    description: "Personalized crop recommendations based on your soil type, location, and season.",
    gradient: "from-forestGreen-400 to-forestGreen-600",
    bgGlow: "bg-forestGreen-400/20"
  },
  {
    icon: BookOpen,
    title: "Farmer Journal",
    description: "Track sowing, irrigation, fertilizer, and harvest activities with AI predictions.",
    gradient: "from-plumViolet-300 to-plumViolet-500",
    bgGlow: "bg-plumViolet-300/20"
  },
  {
    icon: Shield,
    title: "Government Schemes",
    description: "Discover eligible schemes with AI-generated summaries and direct application links.",
    gradient: "from-terracotta-400 to-terracotta-600",
    bgGlow: "bg-terracotta-400/20"
  }
];

// How it works steps
const steps = [
  {
    number: "1",
    title: "Create Account",
    description: "Sign up with your email and complete your farm profile with location and soil details."
  },
  {
    number: "2",
    title: "Get Personalized Insights",
    description: "Our AI analyzes your data to provide tailored crop suggestions and farming advice."
  },
  {
    number: "3",
    title: "Track & Manage",
    description: "Use the journal, weather forecasts, and MSP tracking to optimize your farming."
  },
  {
    number: "4",
    title: "Grow Successfully",
    description: "Make informed decisions, maximize yields, and access government benefits easily."
  }
];

// Testimonials data
const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "Punjab, India",
    quote: "Krishi Saathi helped me identify the best crops for my soil. My wheat yield increased by 25% this season!",
    role: "Wheat Farmer",
    avatar: "R"
  },
  {
    name: "Priya Sharma",
    location: "Maharashtra, India",
    quote: "The MSP tracking feature is invaluable. I always know the right time to sell my produce at the best prices.",
    role: "Cotton Farmer",
    avatar: "P"
  },
  {
    name: "Suresh Patel",
    location: "Gujarat, India",
    quote: "Weather forecasts with farming advice saved my crops during an unexpected storm. Highly recommended!",
    role: "Vegetable Farmer",
    avatar: "S"
  }
];

// Stats data
const stats = [
  { value: "10,000+", label: "Farmers Helped" },
  { value: "50+", label: "Crop Types" },
  { value: "24/7", label: "AI Support" },
  { value: "15+", label: "States Covered" }
];

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  // Navbar scroll effects
  const navbarBg = useTransform(scrollY, [0, 80], [0, 1]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('digikheti_token');
    if (token) {
      navigate("/dashboard");
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-offwhite overflow-x-hidden">
      {/* Dark Green Navbar with Pattern */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Navbar Background with Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-forestGreen-700 via-forestGreen-800 to-forestGreen-900">
          {/* SVG Pattern Overlay */}
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
            <motion.div 
              className="flex items-center gap-2.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-mutedAmber-300 to-mutedAmber-500 flex items-center justify-center shadow-lg">
                <Sprout className="h-5 w-5 text-forestGreen-900" />
              </div>
              <span className="text-xl font-bold text-white">{t("common.appName")}</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {['features', 'how-it-works', 'testimonials'].map((section) => (
                <motion.button 
                  key={section}
                  onClick={() => scrollToSection(section)} 
                  className="text-white/80 hover:text-mutedAmber-300 font-medium transition-colors capitalize"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {section.replace('-', ' ')}
                </motion.button>
              ))}
              <Link to="/about" className="text-white/80 hover:text-mutedAmber-300 font-medium transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-white/80 hover:text-mutedAmber-300 font-medium transition-colors">
                Contact
              </Link>
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
                  {['features', 'how-it-works', 'testimonials'].map((section) => (
                    <button 
                      key={section}
                      onClick={() => scrollToSection(section)} 
                      className="text-white/80 hover:text-mutedAmber-300 font-medium text-left capitalize"
                    >
                      {section.replace('-', ' ')}
                    </button>
                  ))}
                  <Link to="/about" className="text-white/80 hover:text-mutedAmber-300 font-medium">About</Link>
                  <Link to="/contact" className="text-white/80 hover:text-mutedAmber-300 font-medium">Contact</Link>
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
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 relative overflow-hidden">
        {/* Beautiful background decorations */}
        <div className="absolute inset-0 bg-gradient-to-b from-offwhite-200/80 via-offwhite to-offwhite" />
        <motion.div 
          className="absolute top-20 left-10 w-80 h-80 bg-forestGreen-300/20 rounded-full blur-3xl"
          {...floatAnimation}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-96 h-96 bg-mutedAmber-300/15 rounded-full blur-3xl"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-oceanBlue-200/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-8">
              <motion.span 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-mutedAmber-100 to-mutedAmber-200/80 text-mutedAmber-700 text-sm font-semibold border border-mutedAmber-300/40 shadow-sm"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Sparkles className="h-4 w-4" />
                AI-Powered Agricultural Assistant
              </motion.span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight"
            >
              Grow Smarter with{" "}
              <span className="bg-gradient-to-r from-forestGreen-600 via-forestGreen-500 to-forestGreen-400 bg-clip-text text-transparent">
                Smart Farming
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Get AI-powered crop recommendations, track MSP prices, access weather forecasts, 
              and manage your farm activities—all in one place. Your intelligent partner in sustainable agriculture.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center mb-14">
              <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}>
                <Button 
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-forestGreen-500 to-forestGreen-600 hover:from-forestGreen-600 hover:to-forestGreen-700 text-white shadow-xl hover:shadow-2xl rounded-2xl px-10 py-7 text-lg gap-3 transition-all duration-300"
                >
                  <Leaf className="h-5 w-5" />
                  Start Free Today
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/auth")}
                  className="border-2 border-forestGreen-300 text-forestGreen-700 hover:border-forestGreen-400 hover:bg-forestGreen-50 rounded-2xl px-10 py-7 text-lg gap-3 transition-all duration-300"
                >
                  Login to Dashboard
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-8 md:gap-14"
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-2.5"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-forestGreen-400 to-forestGreen-500" />
                  <span className="font-bold text-forestGreen-800">{stat.value}</span>
                  <span className="text-gray-500">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        {/* Section background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-offwhite via-mutedAmber-50/30 to-offwhite" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight">
              Everything You Need for{" "}
              <span className="bg-gradient-to-r from-forestGreen-600 to-forestGreen-500 bg-clip-text text-transparent">Smart Farming</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From AI assistance to government schemes, we provide comprehensive tools for modern, sustainable farming.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={scaleIn}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Card className="h-full border-0 shadow-soft-lg hover:shadow-xl transition-all duration-400 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden group">
                  <CardContent className="p-7">
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight">
              How <span className="bg-gradient-to-r from-mutedAmber-500 to-mutedAmber-600 bg-clip-text text-transparent">{t("common.appName")}</span> Works
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get started in four simple steps and transform your farming experience
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="relative"
                whileHover={{ y: -6 }}
              >
                <Card className="h-full border-0 shadow-soft-lg hover:shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden text-center p-7 transition-all duration-300">
                  <motion.div 
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-mutedAmber-400 to-mutedAmber-500 flex items-center justify-center mx-auto mb-5 text-forestGreen-900 text-2xl font-bold shadow-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    {step.number}
                  </motion.div>
                  <h3 className="text-lg font-bold mb-3 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ChevronRight className="h-6 w-6 text-mutedAmber-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 relative">
        {/* Section background */}
        <div className="absolute inset-0 bg-gradient-to-b from-offwhite via-forestGreen-50/20 to-offwhite" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight">
              Trusted by <span className="bg-gradient-to-r from-forestGreen-600 to-forestGreen-500 bg-clip-text text-transparent">Farmers</span> Across India
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              See how we're helping farmers protect their crops and increase yields
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index} 
                variants={scaleIn}
                whileHover={{ y: -6 }}
              >
                <Card className="h-full border-0 shadow-soft-lg hover:shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-300">
                  <CardContent className="p-7">
                    <div className="flex items-center gap-4 mb-5">
                      <motion.div 
                        className="w-14 h-14 rounded-full bg-gradient-to-br from-forestGreen-400 to-forestGreen-600 flex items-center justify-center text-white font-bold text-xl shadow-lg"
                        whileHover={{ scale: 1.1 }}
                      >
                        {testimonial.avatar}
                      </motion.div>
                      <div>
                        <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic mb-5 leading-relaxed">"{testimonial.quote}"</p>
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-forestGreen-100 text-forestGreen-700 text-sm font-medium">
                      <Leaf className="h-3.5 w-3.5" />
                      {testimonial.role}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="relative rounded-3xl p-12 md:p-20 text-center text-white overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleIn}
          >
            {/* CTA Background with Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-forestGreen-700 via-forestGreen-600 to-forestGreen-700" />
            <div 
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />
            
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10">
              <motion.h2 
                className="text-3xl md:text-5xl font-bold mb-6 tracking-tight"
                variants={fadeInUp}
              >
                Ready to Transform Your Farming?
              </motion.h2>
              <motion.p 
                className="text-xl text-white/90 mb-10 max-w-xl mx-auto"
                variants={fadeInUp}
              >
                Join thousands of farmers who are already using {t("common.appName")} for smarter, more sustainable agriculture.
              </motion.p>
              <motion.div 
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -3 }} 
                whileTap={{ scale: 0.97 }}
              >
                <Button 
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="bg-white text-forestGreen-700 hover:bg-offwhite-100 shadow-xl rounded-2xl px-10 py-7 text-lg font-semibold gap-3"
                >
                  Get Started for Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-offwhite-200 border-t border-mutedAmber-200/50 py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-forestGreen-600 to-forestGreen-700 flex items-center justify-center shadow-lg">
                  <Sprout className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-forestGreen-800">{t("common.appName")}</span>
              </div>
              <p className="text-gray-600 max-w-sm leading-relaxed">
                Empowering farmers with AI-driven insights for smarter, more sustainable agriculture.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-gray-800 mb-5">Quick Links</h4>
              <div className="flex flex-col gap-3">
                <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-forestGreen-600 text-left transition-colors">Features</button>
                <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-forestGreen-600 text-left transition-colors">How it Works</button>
                <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-forestGreen-600 text-left transition-colors">Testimonials</button>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-gray-800 mb-5">Company</h4>
              <div className="flex flex-col gap-3">
                <Link to="/about" className="text-gray-600 hover:text-forestGreen-600 transition-colors">About Us</Link>
                <Link to="/contact" className="text-gray-600 hover:text-forestGreen-600 transition-colors">Contact</Link>
                <a href="#" className="text-gray-600 hover:text-forestGreen-600 transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-600 hover:text-forestGreen-600 transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>

          <div className="border-t border-mutedAmber-200/50 pt-8 text-center text-gray-500 text-sm">
            © 2024 {t("common.appName")}. Empowering farmers with AI-driven agricultural guidance.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;