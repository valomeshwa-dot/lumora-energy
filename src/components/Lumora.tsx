import { motion, AnimatePresence } from "motion/react";
import { Sun, Shield, Zap, ArrowRight, Menu, X, Phone, Mail, MapPin, Calculator, CheckCircle2, ChevronDown, ChevronUp, Info, Star } from "lucide-react";
import { supabase } from "../lib/supabase";
import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import aboutImage from "../assets/lumoraabout.jpg";
import commercialServiceImage from "../assets/commercialservice.jpeg";
import residentialServiceImage from "../assets/residentialservice.jpg";
import project1 from "../assets/project1.jpg";
import project2 from "../assets/project2.jpeg";
import project3 from "../assets/project3.jpeg";
import project4 from "../assets/project4.jpeg";
import project5 from "../assets/project5.jpeg";
import project6 from "../assets/project6.jpeg";
import client1 from "../assets/clients/client1.png";
import client2 from "../assets/clients/client2.png";
import client3 from "../assets/clients/client3.png";
import client4 from "../assets/clients/client4.png";
import client5 from "../assets/clients/client5.png";
import client6 from "../assets/clients/client6.png";
import maintenanceImage from "../assets/maintenance.jpeg";

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Solar Savings", path: "/savings" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  const isTransparent = !isScrolled && isHome;
  const navBgClass = isTransparent ? "bg-transparent py-6" : "bg-white py-4 shadow-sm";
  const lumoraColor = isTransparent ? "text-solar-gold" : "text-charcoal";
  const energyColor = isTransparent ? "text-gray-400" : "text-charcoal";
  const linkColor = isTransparent ? "text-white" : "text-charcoal";

  return (
    <nav
      className={`navbar fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${navBgClass}`}
    >
      <div className="navbar-container flex items-center max-w-[1240px] mx-auto px-8 w-full">
        <Link to="/" className="flex flex-col items-start group">
          <span className={`font-extrabold text-2xl tracking-tighter leading-none transition-colors duration-300 ${lumoraColor}`}>LUMORA</span>
          <span className={`text-[10px] tracking-[0.3em] font-light mt-1 transition-colors duration-300 ${energyColor}`}>ENERGY</span>
        </Link>

        {/* Desktop Nav Menu */}
        <div className="nav-menu hidden md:flex items-center gap-9 ml-auto">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:text-solar-gold ${location.pathname === link.path ? "text-solar-gold" : linkColor
                }`}
            >
              {link.name.toUpperCase()}
            </Link>
          ))}
          <Link to="/contact" className="btn-primary px-8 text-sm h-12 flex items-center justify-center">
            GET A QUOTE
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-500 font-bold hover:text-red-600 transition-colors uppercase text-sm ml-4"
          >
            LOG OUT
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden ml-auto transition-colors duration-300 ${linkColor}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-white border-t border-gray-100 p-6 md:hidden shadow-xl"
        >
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-charcoal text-lg font-medium hover:text-solar-gold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="btn-primary text-center py-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              GET A QUOTE
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="mt-4 text-red-500 font-bold uppercase text-lg"
            >
              LOG OUT
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-charcoal text-white pt-20 pb-10">
      <div className="max-container grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex flex-col items-start mb-6">
            <span className="text-solar-gold font-extrabold text-3xl tracking-tighter leading-none">LUMORA</span>
            <span className="text-white text-xs tracking-[0.3em] font-light mt-1">ENERGY</span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            Pioneering the transition to sustainable energy in India with premium rooftop solar solutions for homes and businesses.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><Link to="/about" className="hover:text-solar-gold transition-colors">About Us</Link></li>
            <li><Link to="/services" className="hover:text-solar-gold transition-colors">Our Services</Link></li>
            <li><Link to="/projects" className="hover:text-solar-gold transition-colors">Recent Projects</Link></li>
            <li><Link to="/savings" className="hover:text-solar-gold transition-colors">Solar Savings</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Contact Us</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex items-center space-x-3">
              <MapPin size={18} className="text-solar-gold" />
              <span>Cyber Hub, Gurgaon, Haryana, India</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={18} className="text-solar-gold" />
              <span>+91 124 456 7890</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={18} className="text-solar-gold" />
              <span>info@lumoraenergy.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Newsletter</h4>
          <p className="text-gray-400 text-sm mb-4">Stay updated with the latest in solar technology.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="bg-white/5 border border-white/10 px-4 py-2 rounded-l-lg w-full focus:outline-none focus:border-solar-gold transition-colors"
            />
            <button className="bg-solar-gold text-charcoal px-4 py-2 rounded-r-lg font-bold">
              GO
            </button>
          </div>
        </div>
      </div>

      <div className="max-container border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
        <p>© 2026 Lumora Energy. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

// --- Pages ---

const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 z-0 bg-charcoal">
          {/* Refined warm sunset gradient simulation */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,#F4C430_0%,transparent_50%)] opacity-[0.15]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-charcoal to-transparent opacity-40"></div>
        </div>

        <div className="relative z-10 w-full max-w-[1240px] px-6 md:px-12 lg:px-24 ml-0 mr-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            <span className="text-solar-gold font-bold uppercase tracking-[0.2em] text-sm mb-[20px] block leading-none">
              Premium Rooftop Solar Solutions for India
            </span>
            <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-[1.05] mb-[28px] tracking-tight max-w-[900px]">
              Engineered for <br />
              Intelligent Solar Living
            </h1>
            <p className="text-gray-200 text-xl md:text-2xl font-light mb-[64px] leading-[1.6] max-w-[680px]">
              High-performance rooftop solar systems built for long-term savings and uncompromising quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link to="/savings" className="btn-primary flex items-center justify-center gap-2 px-10 h-14">
                <Calculator size={20} />
                Calculate Your Savings
              </Link>
              <Link to="/contact" className="bg-transparent border border-white/40 text-white hover:bg-white hover:text-charcoal font-semibold px-10 py-4 rounded-lg transition-all duration-300 shadow-sm hover:shadow-lg active:scale-95 flex items-center justify-center h-14">
                Book Free Solar Assessment
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 1 — TRUST INDICATORS STRIP */}
      <section className="relative z-20 mt-[120px]">
        <div className="max-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "25-Year Performance Warranty",
                icon: <Shield size={24} />,
              },
              {
                title: "MNRE Certified & Government Approved",
                icon: <CheckCircle2 size={24} />,
              },
              {
                title: "Net Metering Assistance Included",
                icon: <Zap size={24} />,
              },
              {
                title: "Smart Monitoring & Performance Tracking",
                icon: <Sun size={24} />,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-xl card-shadow flex flex-col items-start gap-4"
              >
                <div className="text-charcoal">{item.icon}</div>
                <h3 className="text-charcoal font-bold text-sm uppercase tracking-wider leading-tight">
                  {item.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — SOCIAL PROOF STATISTICS */}
      <section className="section-padding bg-white">
        <div className="max-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { value: "5000+", label: "Installations Completed" },
              { value: "10+", label: "Years Industry Experience" },
              { value: "100 MW+", label: "Installed Capacity" },
              { value: "1M+", label: "Tons CO₂ Emissions Offset" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-charcoal font-extrabold text-5xl md:text-6xl mb-3">
                  {stat.value}
                </div>
                <div className="text-steel-grey font-medium uppercase tracking-widest text-xs">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — MINI CREDIBILITY CTA */}
      <section className="py-20 bg-main-bg border-y border-gray-100">
        <div className="max-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-10 max-w-2xl mx-auto">
              Trusted by Thousands of Homeowners and Businesses Across India
            </h2>
            <Link to="/contact" className="btn-primary inline-block">
              Book Free Solar Assessment
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding bg-main-bg">
        <div className="max-container">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">TAILORED SOLUTIONS</h2>
            <div className="w-20 h-1.5 bg-solar-gold mx-auto mb-8"></div>
            <p className="text-steel-grey text-lg max-w-2xl mx-auto">
              We provide end-to-end solar engineering for every rooftop, from luxury residences to industrial complexes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Residential Solar",
                desc: "Premium rooftop installations designed to blend seamlessly with your home's architecture.",
                icon: <Sun size={32} />,
                img: residentialServiceImage
              },
              {
                title: "Commercial Solar",
                desc: "High-yield solar systems for businesses to reduce operational costs and carbon footprint.",
                icon: <Zap size={32} />,
                img: commercialServiceImage
              },
              {
                title: "Maintenance & Support",
                desc: "Comprehensive monitoring and maintenance to ensure your system performs at peak efficiency.",
                icon: <Shield size={32} />,
                img: maintenanceImage
              }
            ].map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl overflow-hidden card-shadow group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8">
                  <div className="text-solar-gold mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-steel-grey mb-6 leading-relaxed">{service.desc}</p>
                  <Link to="/services" className="text-charcoal font-bold flex items-center gap-2 hover:text-solar-gold transition-colors">
                    LEARN MORE <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-charcoal py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-solar-gold/5 skew-x-12 transform translate-x-1/2"></div>
        <div className="max-container relative z-10 text-center">
          <h2 className="text-white text-4xl md:text-6xl font-extrabold mb-8">READY FOR SOLAR ENERGY?</h2>
          <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto">
            Join thousands of Indian families and businesses making the switch to clean, affordable power.
          </p>
          <Link to="/contact" className="btn-primary text-lg px-12">
            BOOK YOUR FREE SOLAR ASSESSMENT
          </Link>
          <p className="text-gray-500 mt-6 text-sm italic">Limited slots available daily.</p>
        </div>
      </section>
    </main>
  );
};

const About = () => (
  <main className="pt-32">
    <section className="section-padding">
      <div className="max-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8">PIONEERING INDIA'S <br /><span className="text-solar-gold">SOLAR REVOLUTION</span></h2>
            <p className="text-steel-grey text-lg mb-6 leading-relaxed">
              Founded with a vision to make India energy-independent, Lumora Energy has grown into a premier provider of high-end rooftop solar solutions.
            </p>
            <p className="text-steel-grey text-lg mb-8 leading-relaxed">
              We combine world-class engineering with local expertise to deliver systems that aren't just functional, but are assets for your property. Our commitment to quality is reflected in our choice of components and our meticulous installation process.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-3xl font-extrabold text-solar-gold mb-2">500+</h4>
                <p className="text-sm font-bold uppercase tracking-wider">Projects Completed</p>
              </div>
              <div>
                <h4 className="text-3xl font-extrabold text-solar-gold mb-2">15MW+</h4>
                <p className="text-sm font-bold uppercase tracking-wider">Installed Capacity</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src={aboutImage}
              alt="Solar Components"
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute -bottom-8 -left-8 bg-solar-gold p-8 rounded-xl hidden md:block">
              <p className="text-charcoal font-black text-4xl">10+</p>
              <p className="text-charcoal font-bold text-sm uppercase">Years of Excellence</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  </main>
);

const Services = () => (
  <main className="pt-32">
    <section className="section-padding bg-white">
      <div className="max-container">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 uppercase">Our Premium Services</h2>
          <div className="w-20 h-1.5 bg-solar-gold mx-auto"></div>
        </div>

        <div className="space-y-24">
          {[
            {
              title: "Residential Solar Systems",
              desc: "We design solar solutions that complement the aesthetic of your home while providing maximum energy output. Our residential systems are built with high-efficiency monocrystalline panels and smart inverters.",
              features: ["Custom Architectural Integration", "Smart Home Monitoring", "Battery Storage Ready", "Net Metering Assistance"],
              img: residentialServiceImage,
              reverse: false
            },
            {
              title: "Commercial & Industrial",
              desc: "Scale your business sustainably. Our commercial solutions are engineered for high durability and maximum ROI. We handle everything from large-scale factory roofs to office complexes.",
              features: ["High-Yield Industrial Panels", "Remote Fleet Monitoring", "Tax Benefit Consulting", "Zero-Down Financing Options"],
              img: commercialServiceImage,
              reverse: true
            }
          ].map((service, idx) => (
            <div key={idx} className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${service.reverse ? 'md:flex-row-reverse' : ''}`}>
              <div className={service.reverse ? 'md:order-2' : ''}>
                <h3 className="text-3xl font-bold mb-6">{service.title}</h3>
                <p className="text-steel-grey text-lg mb-8 leading-relaxed">{service.desc}</p>
                <ul className="space-y-4">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 font-medium">
                      <CheckCircle2 className="text-solar-gold" size={20} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={service.reverse ? 'md:order-1' : ''}>
                <img src={service.img} alt={service.title} className="rounded-xl shadow-xl w-full" referrerPolicy="no-referrer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

const SolarSavings = () => {
  const [city, setCity] = useState("Mumbai");
  const [billAmount, setBillAmount] = useState<number | "">("");
  const [roofType, setRoofType] = useState("Flat");
  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cityData: Record<string, number> = {
    Mumbai: 4.5,
    Delhi: 4.8,
    Bangalore: 4.7,
    Chennai: 5.0,
    Hyderabad: 5.2,
    Kolkata: 4.3,
  };

  const calculateSavings = async () => {
    if (typeof billAmount !== 'number' || billAmount < 500 || billAmount > 50000) {
      setErrors({ billAmount: "Bill must be between ₹500 and ₹50,000" });
      return;
    }
    setErrors({});
    setIsCalculating(true);

    // SECTION 2 — INTERNAL BILL TO UNIT ESTIMATION
    let avgTariff = 6;
    if (billAmount > 10000) avgTariff = 11;
    else if (billAmount > 5000) avgTariff = 9.5;
    else if (billAmount > 2000) avgTariff = 8;

    const estimatedUnits = billAmount / avgTariff;

    // SECTION 3 — CITY DATA MODEL
    const performanceRatio = 0.95;
    const monthlyGenerationPerKW = cityData[city] * 30 * performanceRatio;

    // SECTION 4 — SYSTEM SIZING
    let size = estimatedUnits / monthlyGenerationPerKW;
    let systemSize = Math.ceil(size * 2) / 2; // Round UP to nearest 0.5 kW

    // Constraints
    const isOversized = systemSize > (size * 1.2);
    systemSize = Math.max(1, Math.min(10, systemSize));

    // SECTION 5 — COST MODEL
    const basePrice = 55000;
    const adjustedCostPerKW = roofType === "Sloped" ? basePrice * 1.10 : basePrice;
    const installationCost = systemSize * adjustedCostPerKW;

    // SECTION 6 — MNRE SUBSIDY MODEL
    let subsidy = 0;
    if (systemSize <= 2) {
      subsidy = 30000 * systemSize;
    } else if (systemSize <= 3) {
      subsidy = (30000 * 2) + (18000 * (systemSize - 2));
    } else {
      subsidy = (30000 * 2) + (18000 * 1); // Capped at 3kW slab value (78000)
    }

    const finalCost = installationCost - subsidy;

    // SECTION 7 — SAVINGS CALCULATION
    const monthlyGeneration = systemSize * monthlyGenerationPerKW;
    const potentialSavings = monthlyGeneration * avgTariff;
    const monthlySavings = Math.min(potentialSavings, billAmount);
    const annualSavings = monthlySavings * 12;

    // SECTION 8 — 25 YEAR PROJECTION
    let cumulativeSavings = 0;
    let currentTariff = avgTariff;
    let currentGeneration = monthlyGeneration;
    const yearlyData = [];

    for (let year = 1; year <= 25; year++) {
      // 3% annual tariff inflation, 0.7% panel degradation
      const yearlySavings = Math.min(currentGeneration * currentTariff * 12, (billAmount * 12) * Math.pow(1.03, year - 1));
      cumulativeSavings += yearlySavings;

      yearlyData.push({
        year,
        cumulative: Math.round(cumulativeSavings),
        yearly: Math.round(yearlySavings)
      });

      currentTariff *= 1.03;
      currentGeneration *= 0.993;
    }

    const netSavings25 = cumulativeSavings - finalCost;

    // SECTION 9 — PAYBACK
    const payback = parseFloat((finalCost / annualSavings).toFixed(1));

    // Log to Supabase
    const saveCalculatorLog = async (
      city: string,
      monthlyBill: number,
      estimatedUnits: number,
      systemSize: number,
      annualSavings: number,
      payback: number
    ) => {
      const { error } = await supabase
        .from("calculator_logs")
        .insert([
          {
            city,
            monthly_bill: monthlyBill,
            estimated_units: estimatedUnits,
            system_size: systemSize,
            annual_savings: annualSavings,
            payback
          }
        ]);

      if (error) {
        console.error("Error saving calculator log:", error);
      }
    };

    // Simulate calculation delay for premium feel
    setTimeout(async () => {
      setResults({
        systemSize,
        installationCost,
        subsidy,
        finalCost,
        monthlySavings,
        annualSavings,
        payback,
        netSavings25,
        yearlyData,
        billAmount,
        newBill: Math.max(0, billAmount - monthlySavings),
        isOversized,
        avgTariff
      });

      setIsCalculating(false);

      // Call Supabase log
      await saveCalculatorLog(
        city,
        billAmount,
        estimatedUnits,
        systemSize,
        annualSavings,
        payback
      );

      // Scroll to results
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 800);
  };

  const getInvestmentBadge = (payback: number) => {
    if (payback < 3) return { label: "Excellent Investment Potential", color: "bg-emerald-100 text-emerald-700" };
    if (payback <= 5) return { label: "Strong Long-Term Savings", color: "bg-blue-100 text-blue-700" };
    return { label: "Best for Long-Term Ownership", color: "bg-gray-100 text-gray-600" };
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const isInvalid = typeof billAmount !== 'number' || billAmount < 500 || billAmount > 50000;

  return (
    <main className="pt-32 bg-main-bg min-h-screen pb-20">
      <section className="section-padding">
        <div className="max-container">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">SOLAR SAVINGS CALCULATOR</h1>
            <p className="text-steel-grey text-lg max-w-2xl mx-auto">
              Get a precise financial projection for your rooftop solar investment based on real-world data.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Input Form */}
            <div className="lg:col-span-5 bg-white p-8 md:p-10 rounded-2xl card-shadow">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Info className="text-solar-gold" size={24} />
                System Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-steel-grey">Select Your City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-main-bg border-none p-4 rounded-lg focus:ring-2 focus:ring-solar-gold outline-none font-medium h-14"
                  >
                    {Object.keys(cityData).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-steel-grey">Current Monthly Electricity Bill (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                    <input
                      type="number"
                      value={billAmount}
                      onChange={(e) => {
                        const val = e.target.value === "" ? "" : parseInt(e.target.value);
                        setBillAmount(val);
                      }}
                      className={`w-full bg-main-bg border-none p-4 pl-8 rounded-lg focus:ring-2 focus:ring-solar-gold outline-none font-medium h-14 ${errors.billAmount ? 'ring-2 ring-red-400' : ''}`}
                      placeholder="e.g. 2500"
                    />
                  </div>
                  {errors.billAmount && <p className="text-red-500 text-xs mt-1">{errors.billAmount}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-steel-grey">Roof Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Flat", "Sloped"].map(type => (
                      <button
                        key={type}
                        onClick={() => setRoofType(type)}
                        className={`p-4 rounded-lg font-bold transition-all h-14 ${roofType === type ? 'bg-solar-gold text-charcoal' : 'bg-main-bg text-steel-grey hover:bg-gray-200'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={calculateSavings}
                  disabled={isInvalid || isCalculating}
                  className={`btn-primary w-full py-5 text-lg flex items-center justify-center gap-3 h-16 ${isInvalid || isCalculating ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                >
                  {isCalculating ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Zap size={24} />
                    </motion.div>
                  ) : <Calculator size={24} />}
                  {isCalculating ? "CALCULATING..." : "CALCULATE SAVINGS"}
                </button>
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-7" id="results-section">
              <AnimatePresence mode="wait">
                {!results ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-200 rounded-2xl"
                  >
                    <Sun size={64} className="text-gray-200 mb-6" />
                    <h3 className="text-2xl font-bold text-gray-400">Enter your details to see <br />your solar potential</h3>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    {/* Main Result Card */}
                    <div className="bg-white p-8 md:p-10 rounded-2xl card-shadow">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-widest text-steel-grey mb-1">Recommended System</h3>
                          <p className="text-4xl font-black text-charcoal">{results.systemSize} kW Solar Plant</p>
                          {results.isOversized && (
                            <p className="text-xs text-solar-gold font-bold mt-2">Slightly oversized to ensure seasonal reliability.</p>
                          )}
                        </div>
                        <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${getInvestmentBadge(results.payback).color}`}>
                          {getInvestmentBadge(results.payback).label}
                        </div>
                      </div>

                      {/* Financial Summary Layout */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        {/* Left Column - Operational Savings */}
                        <div className="space-y-6 p-8 bg-main-bg rounded-xl border-l-4 border-gray-200">
                          <div>
                            <p className="text-xs font-bold uppercase text-steel-grey mb-1">Monthly Savings</p>
                            <p className="text-2xl font-bold text-charcoal">{formatCurrency(results.monthlySavings)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase text-steel-grey mb-1">Annual Savings</p>
                            <p className="text-2xl font-bold text-charcoal">{formatCurrency(results.annualSavings)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase text-steel-grey mb-1">Payback Period</p>
                            <p className="text-2xl font-bold text-charcoal">{results.payback} Years</p>
                          </div>
                        </div>

                        {/* Right Column - Investment Summary */}
                        <div className="space-y-6 p-8 bg-solar-gold/5 rounded-xl border-l-4 border-solar-gold">
                          <div>
                            <p className="text-xs font-bold uppercase text-charcoal/60 mb-1">Installation Cost</p>
                            <p className="text-xl font-bold text-charcoal opacity-60">{formatCurrency(results.installationCost)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase text-charcoal/60 mb-1">Government Subsidy</p>
                            <p className="text-xl font-bold text-emerald-600">-{formatCurrency(results.subsidy)}</p>
                          </div>
                          <div className="pt-4 border-t border-solar-gold/20">
                            <p className="text-xs font-bold uppercase text-charcoal/60 mb-1">Final System Cost</p>
                            <p className="text-4xl font-black text-charcoal">{formatCurrency(results.finalCost)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Large Highlighted Savings Statement */}
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-8 text-center mb-0">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 mb-2">25-Year Net Savings</p>
                        <p className="text-5xl font-black text-emerald-600 mb-2">
                          {formatCurrency(results.netSavings25)}
                        </p>
                        <p className="text-sm text-emerald-700/70 font-medium">
                          Estimated cumulative savings over 25 years after system cost.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Transparency Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl card-shadow overflow-hidden">
              <button
                onClick={() => setOpenAccordion(!openAccordion)}
                className="w-full flex justify-between items-center p-8 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <Shield className="text-solar-gold" size={24} />
                  How We Calculate
                </h3>
                {openAccordion ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>

              <AnimatePresence>
                {openAccordion && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-8 pt-0 border-t border-gray-100 space-y-6 text-steel-grey leading-relaxed">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-bold text-charcoal mb-2">Bill to Unit Conversion</h4>
                          <p className="text-sm">We convert your monthly bill to estimated units using blended average tariff bands (₹6 to ₹11) based on consumption levels.</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-charcoal mb-2">Irradiation & Generation</h4>
                          <p className="text-sm">We use city-level solar irradiation data with a conservative 95% performance ratio to account for real-world system losses.</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-charcoal mb-2">MNRE Subsidy Structure</h4>
                          <p className="text-sm">Calculations follow the latest MNRE guidelines: ₹30,000/kW for first 2kW, ₹18,000 for the 3rd kW, capped at 3kW slab value.</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-charcoal mb-2">Financial Assumptions</h4>
                          <p className="text-sm">Our 25-year projection assumes a 3% annual electricity tariff inflation and a 0.7% annual panel degradation rate.</p>
                        </div>
                      </div>
                      <div className="pt-6 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">Disclaimer</p>
                        <p className="text-xs text-gray-400 italic">
                          All values shown are indicative projections based on estimated unit conversion from monthly electricity bill and current MNRE residential subsidy structure. Actual system performance, DISCOM regulations, tariff slabs, and site conditions may impact final savings.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="mt-8 text-center text-xs text-gray-400 italic">
              All results shown are indicative financial projections based on MNRE residential rooftop subsidy guidelines and city-level irradiation data. Actual system performance, DISCOM approvals, tariff revisions, and site conditions may affect final savings.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

const Projects = () => {
  const projects = [
    {
      title: "3kW Residential Solar",
      location: "Mumbai",
      savings: "₹55,000/year",
      client: "Rajesh Sharma",
      review: "“The installation was smooth and our electricity bill has reduced drastically. Very professional team.”",
      img: project1,
      clientImg: client1,
    },
    {
      title: "5kW Residential Solar",
      location: "Pune",
      savings: "₹85,000/year",
      client: "Priya Mehta",
      review: "“Lumora handled everything from subsidy to installation. Highly recommended.”",
      img: project2,
      clientImg: client2,
    },
    {
      title: "10kW Commercial Installation",
      location: "Bangalore",
      savings: "₹1.8L/year",
      client: "Arvind Enterprises",
      review: "“Excellent ROI and seamless execution. The team was punctual and efficient.”",
      img: project3,
      clientImg: client3,
    },
    {
      title: "20kW Commercial Rooftop",
      location: "Ahmedabad",
      savings: "₹3.5L/year",
      client: "Patel Industries",
      review: "“Professional engineering and clean installation. Great support even after completion.”",
      img: project4,
      clientImg: client4,
    },
    {
      title: "50kW Industrial Plant",
      location: "Surat",
      savings: "₹9L/year",
      client: "Kiran Textiles",
      review: "“Massive savings and quick payback period. Highly satisfied with Lumora.”",
      img: project5,
      clientImg: client5,
    },
    {
      title: "100kW Factory Installation",
      location: "Delhi NCR",
      savings: "₹18L/year",
      client: "Mahadev Manufacturing",
      review: "“Top quality components and flawless execution. Would definitely work with them again.”",
      img: project6,
      clientImg: client6,
    },
  ];

  return (
    <main className="pt-32 bg-main-bg min-h-screen pb-20">
      <section className="section-padding">
        <div className="max-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 uppercase tracking-tight">Our Portfolio</h2>
            <p className="text-solar-gold font-bold text-lg md:text-xl mb-6">Recent Rooftop Solar Installations Across India</p>
            <div className="w-24 h-1.5 bg-solar-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -12 }}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col group h-full"
              >
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-solar-gold text-charcoal text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                    {project.location}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-charcoal mb-2 leading-tight">{project.title}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={16} className="text-solar-gold fill-solar-gold" />
                    <span className="text-charcoal font-black text-sm uppercase tracking-wider underline decoration-solar-gold decoration-4 underline-offset-4">
                      Savings: {project.savings}
                    </span>
                  </div>

                  {/* Client & Review */}
                  <div className="mt-4 pt-6 border-t border-gray-100 flex-grow">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="text-solar-gold fill-solar-gold" />
                      ))}
                    </div>
                    <p className="text-steel-grey italic text-sm leading-relaxed mb-6 font-medium">
                      {project.review}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-main-bg border-2 border-solar-gold/20 overflow-hidden">
                        <img src={project.clientImg} alt={project.client} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-charcoal font-bold text-sm leading-none">{project.client}</p>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter mt-1">Verified Client</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    city: "Mumbai",
    monthly_bill: "",
    roof_type: "Flat",
    property_type: "Residential",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting lead...");

    try {
      const { data, error } = await supabase
        .from("leads")
        .insert([{
          ...formData,
          monthly_bill: Number(formData.monthly_bill)
        }])
        .select();

      console.log("Insert response:", data);
      console.log("Insert error:", error);

      if (error) {
        alert("Submission failed: " + error.message + (error.details ? "\nDetails: " + error.details : "") + (error.hint ? "\nHint: " + error.hint : ""));
      } else {
        alert("Quote request submitted successfully");
        setFormData({
          full_name: "",
          phone: "",
          email: "",
          city: "Mumbai",
          monthly_bill: "",
          roof_type: "Flat",
          property_type: "Residential",
          message: ""
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <main className="pt-32">
      <section className="section-padding">
        <div className="max-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-8">LET'S POWER <br /><span className="text-solar-gold">YOUR FUTURE</span></h2>
              <p className="text-steel-grey text-lg mb-12">
                Fill out the form below and our solar experts will get back to you within 24 hours for a free site assessment and quote.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="bg-solar-gold p-4 rounded-lg text-charcoal">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Call Us</h4>
                    <p className="text-steel-grey">+91 124 456 7890</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="bg-solar-gold p-4 rounded-lg text-charcoal">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Email Us</h4>
                    <p className="text-steel-grey">consult@lumoraenergy.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="bg-solar-gold p-4 rounded-lg text-charcoal">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Visit Us</h4>
                    <p className="text-steel-grey">Level 4, Building 10C, DLF Cyber City, Gurgaon</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-2xl card-shadow">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      className="w-full bg-main-bg border-none p-4 rounded-lg focus:ring-2 focus:ring-solar-gold outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-main-bg border-none p-4 rounded-lg focus:ring-2 focus:ring-solar-gold outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-main-bg border-none p-4 rounded-lg focus:ring-2 focus:ring-solar-gold outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-2">City</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-main-bg border-none p-4 rounded-lg focus:ring-2 focus:ring-solar-gold outline-none"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Kolkata">Kolkata</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2">Monthly Bill (₹)</label>
                    <input
                      type="number"
                      name="monthly_bill"
                      value={formData.monthly_bill}
                      onChange={handleChange}
                      required
                      className="w-full bg-main-bg border-none p-4 rounded-lg focus:ring-2 focus:ring-solar-gold outline-none"
                      placeholder="₹ 5000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2">Roof Type</label>
                    <select
                      name="roof_type"
                      value={formData.roof_type}
                      onChange={handleChange}
                      className="w-full bg-main-bg border-none p-4 rounded-lg focus:ring-2 focus:ring-solar-gold outline-none"
                    >
                      <option value="Flat">Flat</option>
                      <option value="Sloped">Sloped</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-2">Property Type</label>
                  <select
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleChange}
                    className="w-full bg-main-bg border-none p-4 rounded-lg focus:ring-2 focus:ring-solar-gold outline-none"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-main-bg border-none p-4 rounded-lg focus:ring-2 focus:ring-solar-gold outline-none"
                    placeholder="Tell us about your rooftop..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-5 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "SENDING..." : "SEND REQUEST"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export { Navbar, Footer, Home, About, Services, SolarSavings, Projects, Contact };
