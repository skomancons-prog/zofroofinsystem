/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { AdminDashboard } from "./components/AdminDashboard";
import { ConsultationForm } from "./components/ConsultationForm";
import { ContactForm } from "./components/ContactForm";
import { MaterialCalculator } from "./components/MaterialCalculator";
import { SixReasons } from "./components/SixReasons";
import { ColorVisualizer } from "./components/ColorVisualizer";
import { Showcase } from "./components/Showcase";
import { ChatBot } from "./components/ChatBot";
import { ExpandedServices } from "./components/ExpandedServices";
import { EliteFeatures } from "./components/EliteFeatures";
import { AccraWeatherRadar } from "./components/AccraWeatherRadar";
import { MATERIAL_PROFILES, TESTIMONIALS } from "./data";
import { RoofType, EstimateInput, EstimateResult } from "./types";
import { useLanguage } from "./context/LanguageContext";
import zofLogo from "./assets/images/zof_bright_logo_2026.svg";
import selflockImg from "./assets/images/beautiful_selflock_sheeting_1782230951805.jpg";
import {
  Shield,
  Award,
  ArrowRight,
  ChevronRight,
  MessageSquare,
  MessageCircle,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Phone,
  Timer,
  Scale,
  Bot,
  Facebook,
  Youtube,
  Send,
  RefreshCw
} from "lucide-react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MarketHubAdmin from "./components/MarketHubAdmin";

function Tiktok({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

function Storefront() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProfileId, setSelectedProfileId] = useState<RoofType>(RoofType.SELFLOCK);
  const [estimateInput, setEstimateInput] = useState<EstimateInput | null>(null);
  const [estimateResult, setEstimateResult] = useState<EstimateResult | null>(null);
  const [floatingChatOpen, setFloatingChatOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const { t, language } = useLanguage();

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState<string | null>(null);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);
  const [consultationNotes, setConsultationNotes] = useState<string>("");

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      setNewsletterError("Please provide a valid email address.");
      return;
    }

    setNewsletterLoading(true);
    setNewsletterSuccess(null);
    setNewsletterError(null);

    try {
      const response = await fetch("/api/newsletter/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        setNewsletterSuccess(data.message || "Thank you for subscribing!");
        setNewsletterEmail("");
      } else {
        setNewsletterError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setNewsletterError("Network error. Please check your connection.");
    } finally {
      setNewsletterLoading(false);
    }
  };

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const activeMaterialProfile = MATERIAL_PROFILES.find((p) => p.id === selectedProfileId)!;

  const handleDocumentAttached = (details: any) => {
    setEstimateInput({
      roofType: details.title + " (Ref: " + details.docId + ")",
      areaSqFt: details.items[0]?.quantity || 1,
    });
    setEstimateResult({
      totalEstimatedMin: details.total,
      totalEstimatedMax: details.total,
    });
  };

  return (
    <div className={`min-h-screen bg-[#F3E5C8] text-stone-850 font-sans selection:bg-blue-600 selection:text-white transition-all duration-300 ${sidebarOpen ? "lg:pl-64" : "pl-0"}`}>
      
      {/* Left Vertical Navigation Sidebar (Relocated from crowded top bar) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        onScrollTo={scrollToSection}
        onOpenEstimator={() => setAdminDashboardOpen(true)}
        onOpenAds={() => setAdminDashboardOpen(true)}
      />

      {/* Visual Navigation Header */}
      <Header
        onScrollTo={scrollToSection}
        onOpenEstimator={() => setAdminDashboardOpen(true)}
        onOpenAdmin={() => setAdminDashboardOpen(true)}
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      {/* Hero Section */}
      <section
        id="hero-section"
        className="relative pt-32 pb-24 sm:pb-32 bg-[#F3E5C8] border-b border-stone-200/80 overflow-hidden text-left"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
        
        {/* Soft floating background colors */}
        <div className="absolute top-12 left-1/4 h-80 w-80 rounded-full bg-blue-400/5 blur-3xl" />
        <div className="absolute top-24 right-1/4 h-80 w-80 rounded-full bg-amber-200/5 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Content */}
            <div className="lg:col-span-7 space-y-7">
              
              {/* Top award tag */}
              <div className="inline-flex items-center space-x-2.5 bg-blue-50 border border-blue-200/60 rounded-full px-4 py-1.5 text-xs text-blue-700 select-none font-semibold">
                <Shield className="h-4.5 w-4.5 text-blue-600 fill-blue-600/10" />
                <span className="font-mono uppercase tracking-wider">
                  {t.hero.badge}
                </span>
              </div>

              {/* Main title display */}
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-stone-900 tracking-tight leading-none">
                {t.hero.titleMain} <br />
                <span className="text-blue-600 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-850 bg-clip-text text-transparent">
                  {t.hero.titleHighlight}
                </span>
              </h1>

              {/* Descriptive tagline */}
              <p className="text-stone-600 text-base sm:text-lg max-w-2xl leading-relaxed">
                {t.hero.subtitle}
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => scrollToSection("estimator")}
                  className="font-sans text-sm font-black text-slate-950 bg-amber-500 hover:bg-amber-600 active:scale-95 px-7 py-4 rounded-xl shadow-xl shadow-amber-500/15 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>{t.hero.getEstimateBtn}</span>
                  <ArrowRight className="h-4.5 w-4.5 text-slate-950" />
                </button>
                <button
                  onClick={() => scrollToSection("materials")}
                  className="font-sans text-sm font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-stone-200 px-7 py-4 rounded-xl shadow-sm transition-all cursor-pointer text-center"
                >
                  {t.hero.exploreProfilesBtn}
                </button>
              </div>

              {/* Visual trust stats footer */}
              <div className="pt-6 border-t border-stone-200 grid grid-cols-3 gap-6 text-left">
                <div>
                  <p className="font-display font-black text-2xl sm:text-3xl text-stone-900">450+</p>
                  <p className="font-sans text-xs text-stone-550 mt-1 leading-tight font-medium">{t.hero.quickStats.projectsDone}</p>
                </div>
                <div>
                  <p className="font-display font-black text-2xl sm:text-3xl text-stone-900">15-Yr</p>
                  <p className="font-sans text-xs text-stone-550 mt-1 leading-tight font-medium">{t.hero.quickStats.yearsWarranty}</p>
                </div>
                <div>
                  <p className="font-display font-black text-2xl sm:text-3xl text-stone-900">16/16</p>
                  <p className="font-sans text-xs text-stone-550 mt-1 leading-tight font-medium">{t.hero.quickStats.regionsCovered}</p>
                </div>
              </div>

            </div>

            {/* Right Column visual card banner */}
            <div className="lg:col-span-5 bg-white border border-stone-200 p-6 rounded-3xl shadow-lg relative overflow-hidden group">
              
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none select-none">
                <img src={zofLogo} className="h-56 w-56 object-contain" alt="" referrerPolicy="no-referrer" />
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                <div className="flex items-center space-x-2">
                  <div className="h-7 w-7 bg-stone-50 border border-stone-200 rounded-full overflow-hidden p-0.5 flex items-center justify-center shrink-0">
                    <img src={zofLogo} className="h-full w-full object-cover rounded-full" alt="ZOF Logo" referrerPolicy="no-referrer" />
                  </div>
                  <p className="font-mono text-[10px] text-blue-600 uppercase tracking-widest leading-none font-bold">Authorized Contractor</p>
                </div>
                <span className="text-[10px] bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded font-bold">
                  Elite Master Level
                </span>
              </div>

              {/* Feature highlight */}
              <div className="py-6 space-y-4 text-left">
                <div className="h-40 rounded-xl overflow-hidden mb-4 select-none bg-stone-100 border border-stone-200">
                  <img
                    src={selflockImg}
                    alt="Zof Custom Metal Sheeting and Woodwork Carpentry"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                </div>
                <div>
                  <h4 className="font-sans font-black text-base text-stone-900">ZOF Selflock® Sheeting</h4>
                  <p className="text-xs text-stone-605 mt-1 leading-relaxed text-stone-600">
                    Concealed fastener panels that click directly together, avoiding exposed screws or nail holes. Perfectly adapted for heavy rain seasons and extreme sea-side humidity in Accra and Tema.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-150 bg-stone-50/65 -mx-6 -mb-6 p-6 rounded-b-3xl text-left flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-mono text-stone-500 font-bold">Call Accra HQ</p>
                  <a href="tel:0242866658" className="text-base font-bold text-stone-900 hover:text-blue-600 font-mono">0242 866 658</a>
                </div>
                <button
                  onClick={() => scrollToSection("materials")}
                  className="p-2 border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-blue-650 text-blue-600 rounded-lg flex items-center justify-center cursor-pointer font-bold text-xs transition-colors"
                >
                  Explore Systems &rarr;
                </button>
              </div>

            </div>

          </div>

          {/* Real-time Accra Weather Status & Dynamic Rainy Season Defense Radar */}
          <div className="mt-12">
            <AccraWeatherRadar
              onOpenConsultation={(notes) => {
                if (notes) {
                  setConsultationNotes(notes);
                }
                scrollToSection("consultation");
              }}
              onOpenEstimator={() => scrollToSection("estimator")}
            />
          </div>

        </div>
      </section>

      {/* Specialty Materials interactive block */}
      <section id="materials" className="py-20 bg-[#F3E5C8] border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section title */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-xs text-blue-700 mb-4 select-none font-semibold">
              <Award className="h-4 w-4 text-blue-600" />
              <span className="font-mono uppercase tracking-wider text-blue-700">Specialized Materials Array</span>
            </div>
            <h2 className="font-sans font-black text-3xl sm:text-4xl text-stone-900 tracking-tight mb-4">
              Our High-Performance Systems
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              We engineer with premium-treated wood timber and high-gauge aluzinc structures. Select a profile below to review structural benchmarks, marine defenses, and life metrics.
            </p>
          </div>

          {/* Sourcing card deck row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Swapping material selectors */}
            <div className="lg:col-span-4 space-y-3 flex flex-col justify-start">
              {MATERIAL_PROFILES.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => setSelectedProfileId(mat.id)}
                  className={`p-4 text-left rounded-xl border transition-all cursor-pointer ${
                    selectedProfileId === mat.id
                      ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500/15"
                      : "bg-white border-stone-200/80 hover:border-stone-300 hover:bg-stone-50 text-stone-800"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-sans font-bold text-sm ${selectedProfileId === mat.id ? "text-blue-700" : "text-stone-700"}`}>
                      {mat.name}
                    </span>
                    <ChevronRight className={`h-4 w-4 transition-transform ${selectedProfileId === mat.id ? "rotate-90 text-blue-600" : "text-stone-400"}`} />
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-1">{mat.longName}</p>
                </button>
              ))}
            </div>

            {/* Profile Detail display card */}
            <div className="lg:col-span-8 bg-white border border-stone-200/80 p-6 sm:p-8 rounded-2xl text-left grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full shadow-lg">
              
              {/* Profile Copy details */}
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-mono text-blue-700 font-bold uppercase tracking-widest bg-blue-50 p-1.5 py-0.5 rounded border border-blue-200">
                    {activeMaterialProfile.category === "commercial" ? "Commercial Only" : activeMaterialProfile.category === "residential" ? "Residential Standard" : "Commercial & Residential"}
                  </span>
                  <h3 className="font-sans font-black text-2xl text-stone-900 mt-3 leading-snug">
                    {activeMaterialProfile.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-1 font-mono">{activeMaterialProfile.longName}</p>
                </div>

                <p className="text-sm text-stone-600 leading-relaxed font-sans">
                  {activeMaterialProfile.description}
                </p>

                {/* Sub-benefits list */}
                <div className="space-y-2.5">
                  <p className="font-mono text-[10px] uppercase text-stone-500 font-bold tracking-wider">Advantage benchmarks:</p>
                  {activeMaterialProfile.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-stone-700 leading-tight font-medium">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications panel and graphic */}
              <div className="space-y-6">
                
                {/* Simulated Materials picture rendering with referrers */}
                <div className="h-44 sm:h-48 rounded-xl overflow-hidden select-none border border-stone-200">
                  <img
                    src={activeMaterialProfile.imageUrl}
                    alt={activeMaterialProfile.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover shadow-xs"
                  />
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#F3E5C8] p-4 border border-stone-200 rounded-xl font-mono text-xs">
                  <div>
                    <span className="text-stone-500 block">Wind Rating Limits</span>
                    <span className="text-stone-900 font-bold block mt-0.5">{activeMaterialProfile.maxWindSpeed}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Performance Lifetime</span>
                    <span className="text-stone-900 font-bold block mt-0.5">{activeMaterialProfile.durabilityRating}</span>
                  </div>
                  <div className="sm:col-span-2 border-t border-stone-200 pt-3">
                    <span className="text-stone-500 block">Environmental Profile</span>
                    <span className="text-blue-600 font-bold block mt-0.5">{activeMaterialProfile.ecoFactor}</span>
                  </div>
                </div>

                <button
                  onClick={() => scrollToSection("estimator")}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-xs rounded-xl flex items-center justify-center space-x-1 uppercase tracking-wider cursor-pointer select-none transition-colors"
                >
                  <span>Open in Scope Builder</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Six Reasons to choose Nils */}
      <SixReasons />

      {/* Color Configurator and Material Visualizer */}
      <ColorVisualizer />

      {/* Specialty Supplementary Services, Combo Model & High-Resolution Project Photo Gallery */}
      <ExpandedServices
        onSelectProjectForEstimate={(profile) => {
          setAdminDashboardOpen(true);
        }}
        onScrollToConsultation={() => scrollToSection("consultation")}
      />

      {/* Elite Engineering, safety standards & Golden Shield Warranties */}
      <EliteFeatures />

      {/* Portfolio Showcase grid */}
      <Showcase />

      {/* AI helper desk Chatbot persistent block */}
      <ChatBot />

      {/* Consultation Intake */}
      <ConsultationForm
        currentEstimateInput={estimateInput}
        currentEstimateResult={estimateResult}
        initialNotes={consultationNotes}
      />

      {/* Quick Netlify Inquiry Form */}
      <ContactForm />

      {/* Testimonials section */}
      <section className="py-20 bg-[#F3E5C8] border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-blue-700 bg-blue-50 border border-blue-150 px-3 py-1 rounded-full">
              Verified Client Logs
            </span>
            <h2 className="font-sans font-black text-3xl sm:text-4xl text-stone-900 tracking-tight mt-4">
              Real Reports from Real Clients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 flex flex-col justify-between text-left relative overflow-hidden hover:border-blue-400 transition-colors duration-300 shadow-md hover:shadow-xl"
              >
                {/* Floating Quotation glyph */}
                <div className="absolute top-0 right-0 p-4 font-serif text-8xl text-stone-100/60 leading-none select-none">
                  “
                </div>

                <p className="text-sm text-stone-750 text-stone-700 leading-relaxed italic relative z-10">
                  "{t.quote}"
                </p>

                <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <p className="font-sans font-bold text-sm text-stone-900">{t.author}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">{t.role}, {t.company}</p>
                  </div>
                  <div className="flex text-blue-600 font-mono text-sm tracking-tight" aria-hidden="true">
                    {"★".repeat(t.stars)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map grounding and safety credentials banner */}
      <section className="bg-[#F3E5C8] border-t border-stone-200 py-12 text-center text-xs text-stone-600 select-none">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-wrap justify-center gap-6 sm:gap-10">
          <div className="flex items-center space-x-2 font-semibold text-stone-800">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Ghana General Construction & Structural Carpentry Registration</span>
          </div>
          <div className="flex items-center space-x-2 font-semibold text-stone-800">
            <Timer className="h-5 w-5 text-blue-600" />
            <span>Certified ZOF Woodwork & Steel Truss Expert Status verified</span>
          </div>
          <div className="flex items-center space-x-2 font-semibold text-stone-800">
            <Scale className="h-5 w-5 text-blue-600" />
            <span>Fully customized liability scopes & secure diaspora warranties</span>
          </div>
        </div>
      </section>

      {/* Bottom Footer Section */}
      <footer className="bg-[#F3E5C8] border-t border-stone-200 py-16 text-stone-600 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Rainy Season Newsletter Banner */}
          <div className="bg-white/85 border border-amber-500/15 rounded-2xl p-6 sm:p-8 mb-12 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs text-left">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center space-x-1.5 bg-amber-500/10 text-amber-800 border border-amber-500/20 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                🌧️ Rainy Season Defense Guide
              </span>
              <h3 className="font-sans font-black text-lg text-stone-900 uppercase tracking-wide">
                Get Weekly Roof Maintenance Tips & Avoid Sudden Leaks
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                Subscribe to ZOF Group’s safety newsletter to receive expert checklists, local weather alerts, and aluzinc maintenance techniques straight to your inbox. Keep your home safe during severe downpours.
              </p>
            </div>
            
            <div className="w-full lg:w-auto shrink-0 min-w-0 sm:min-w-[380px]">
              <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full pl-3.5 pr-3 py-3 bg-white border border-stone-250 text-stone-900 rounded-xl text-xs placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={newsletterLoading}
                  className="px-5 py-3 bg-stone-900 hover:bg-stone-850 text-amber-400 hover:text-amber-300 font-sans font-bold text-xs uppercase tracking-wide rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {newsletterLoading ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  <span>Subscribe Guide</span>
                </button>
              </form>
              
              {newsletterSuccess && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-2.5 flex items-center space-x-1">
                  <span>✓ {newsletterSuccess}</span>
                </p>
              )}
              {newsletterError && (
                <p className="text-[11px] text-red-600 font-semibold mt-2.5 flex items-center space-x-1">
                  <span>✕ {newsletterError}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-left mb-12">
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => scrollToSection("hero-section")}>
                <div className="h-9 w-9 bg-white p-0.5 rounded-full overflow-hidden shrink-0 border border-stone-200">
                  <img
                    src={zofLogo}
                    alt="Zof logo badge"
                    className="h-full w-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-1">
                    <span className="font-sans font-black text-lg text-stone-900 group-hover:text-blue-600 transition-colors">ZOF</span>
                    <span className="font-sans font-bold text-lg text-blue-600">GROUP</span>
                  </div>
                  <span className="font-sans text-[9px] text-stone-500 font-bold tracking-wider leading-none mt-0.5 uppercase">
                    Zof Roofing System
                  </span>
                </div>
              </div>
              <p className="text-xs text-stone-550 leading-relaxed text-stone-500">
                Zof Group constructs premium timber woodwork, structurally certified steel trusses, Mediterranean step tiles, and leak-proof Selflock® systems for local and diaspora clients.
              </p>
              <div className="pt-2 text-left">
                <p className="text-[10px] uppercase font-mono text-stone-400 font-bold tracking-wider mb-2">Connect with Us:</p>
                <div className="flex items-center space-x-3">
                  <a
                    href="https://www.facebook.com/profile.php?id=100063647438270&mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white border border-stone-250 text-stone-500 hover:text-blue-600 hover:border-blue-500/30 transition-all flex items-center justify-center shadow-xs"
                    aria-label="Facebook Profile"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.youtube.com/@zofroofingsystem"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white border border-stone-250 text-stone-500 hover:text-red-650 hover:border-red-500/30 transition-all flex items-center justify-center shadow-xs"
                    aria-label="YouTube Channel"
                  >
                    <Youtube className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@zof.roofing.syste"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white border border-stone-250 text-stone-500 hover:text-stone-900 hover:border-stone-400/30 transition-all flex items-center justify-center shadow-xs"
                    aria-label="TikTok Account"
                    title="TikTok Account"
                  >
                    <Tiktok className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-sans font-black text-xs text-stone-900 uppercase tracking-wider mb-4">Our Systems</h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button onClick={() => { setSelectedProfileId(RoofType.SELFLOCK); scrollToSection("materials"); }} className="hover:text-blue-600 transition-colors cursor-pointer text-left font-bold text-stone-700">
                    Concealed Selflock® Panels
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedProfileId(RoofType.IBR); scrollToSection("materials"); }} className="hover:text-blue-600 transition-colors cursor-pointer text-left font-bold text-stone-700">
                    Premium IBR Angular Sheets
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedProfileId(RoofType.STEP_TILES); scrollToSection("materials"); }} className="hover:text-blue-600 transition-colors cursor-pointer text-left font-bold text-stone-700">
                    Mediterranean Step Tiles
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedProfileId(RoofType.ALUMINIUM_PLAIN); scrollToSection("materials"); }} className="hover:text-blue-600 transition-colors cursor-pointer text-left font-bold text-stone-700">
                    Marine-Grade Plain Aluminium
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-sans font-black text-xs text-stone-900 uppercase tracking-wider mb-4">Helpful Links</h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button onClick={() => scrollToSection("reasons")} className="hover:text-blue-600 transition-colors cursor-pointer text-left font-bold text-stone-700">
                    Why Choose Us
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("showcase")} className="hover:text-blue-600 transition-colors cursor-pointer text-left font-bold text-stone-700">
                    Success Projects
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("estimator")} className="hover:text-blue-600 transition-colors cursor-pointer text-left font-bold text-stone-700">
                    Cost Estimations
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("consultant")} className="hover:text-blue-600 transition-colors cursor-pointer text-left font-bold text-stone-700">
                    Speak with ZOF AI
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-sans font-black text-xs text-stone-900 uppercase tracking-wider">Office Hours</h4>
              <p className="text-xs leading-relaxed text-stone-500">
                <strong>Mon - Fri:</strong> 7:00 AM - 5:00 PM <br />
                <strong>Saturday:</strong> 8:00 AM - 12:00 PM <br />
                <strong>Sunday:</strong> Emergency Inspections ONLY
              </p>
              <div className="pt-2 space-y-2">
                <p className="text-[10px] uppercase font-mono text-stone-500 font-bold">Inquiries & WhatsApp Support:</p>
                <div className="flex flex-col gap-1.5 text-left">
                  <a 
                    href="https://wa.me/233546331603?text=Hello%20Zof%20Group!%20I%20am%20interested%20in%20a%20roofing%20consultation." 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-250 hover:bg-emerald-100 font-sans text-xs font-black text-emerald-800 px-3.5 py-2 rounded-lg transition-colors w-max"
                  >
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>💬 WhatsApp: +233 (0) 54 633 1603</span>
                  </a>
                  <a href="tel:0242866658" className="inline-flex items-center space-x-1.5 bg-blue-50 border border-blue-250 hover:bg-blue-100 font-mono text-xs font-bold text-blue-750 px-3.5 py-2 rounded-lg transition-colors w-max">
                    <span>📞 HQ Support: 0242 866 658</span>
                  </a>
                  <a href="tel:0577961611" className="inline-flex items-center space-x-1.5 bg-blue-50 border border-blue-250 hover:bg-blue-100 font-mono text-xs font-bold text-blue-750 px-3.5 py-2 rounded-lg transition-colors w-max">
                    <span>📞 Sourcing: 0577 961 611</span>
                  </a>
                  <a href="tel:0546331603" className="inline-flex items-center space-x-1.5 bg-blue-50 border border-blue-250 hover:bg-blue-100 font-mono text-xs font-bold text-blue-750 px-3.5 py-2 rounded-lg transition-colors w-max">
                    <span>📞 Coordinator: 0546 331 603</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div className="border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500 gap-4">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} Zof Group. | ZOF GROUP. All rights reserved.
            </p>
            <p className="text-center md:text-right font-semibold">
              Licensed in Accra, Kumasi & Tema Regions, Ghana
            </p>
          </div>

        </div>
      </footer>

      {/* Floating WhatsApp Support Trigger bottom left */}
      <div className={`fixed bottom-6 z-40 select-none transition-all duration-300 ${sidebarOpen ? "left-6 lg:left-70" : "left-6"}`}>
        <a
          href="https://wa.me/233546331603?text=Hello%20Zof%20Group!%20I%20am%20interested%20in%20a%20roofing%2520consultation%2520pricing%2520or%2520estimate."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white p-4 rounded-full shadow-2xl cursor-pointer transition-all group font-sans font-bold text-sm tracking-tight"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-5 w-5 fill-white/10 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">WhatsApp Chat</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
        </a>
      </div>

      {/* Floating Nils AI Shortcut Trigger bottom right */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        {floatingChatOpen ? (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden w-[350px] sm:w-[380px] h-[480px] flex flex-col justify-between mb-3 animate-fade-in">
            {/* Header */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <div className="h-6 w-6 bg-white p-0.5 rounded-full overflow-hidden shrink-0 border border-slate-750">
                  <img
                    src={zofLogo}
                    alt="Zof Mini logo"
                    className="h-full w-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-xs font-sans font-bold text-white">ZOF AI Mini-Helper</span>
              </div>
              <button
                type="button"
                onClick={() => setFloatingChatOpen(false)}
                className="text-xs text-slate-500 hover:text-white"
                aria-label="Close assistant panel"
              >
                ✕
              </button>
            </div>
            
            {/* IFrame-like chat component view */}
            <div className="flex-1 bg-slate-950 p-4 overflow-y-auto">
              {/* Nils AI welcome card */}
              <div className="flex space-x-2 items-start text-xs text-left mb-4">
                <div className="h-7 w-7 bg-slate-900 rounded-full flex items-center justify-center text-blue-400 shrink-0">
                  ⚡
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl leading-relaxed text-slate-205 text-slate-200">
                  Need a fast overview? Ask me about interlocking Selflock® sheets, structural frameworks, carpentry woodwork, or remote monitoring. Or scroll down to use our persistent chatbot console.
                </div>
              </div>
            </div>

            {/* Direct query form link */}
            <div className="p-3 bg-slate-900/60 border-t border-slate-800 flex justify-between items-center px-4">
              <span className="text-[10px] text-slate-500 font-mono">Chatbot console linked below</span>
              <button
                onClick={() => {
                  setFloatingChatOpen(false);
                  scrollToSection("consultant");
                }}
                className="text-[11px] font-sans font-bold text-blue-400 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center space-x-1"
              >
                <span>Full Console &rarr;</span>
              </button>
            </div>
          </div>
        ) : null}

        <button
          onClick={() => {
            const chatSec = document.getElementById("consultant");
            chatSec?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex items-center space-x-2.5 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-2xl cursor-pointer select-none transition-transform active:scale-95 group font-sans font-bold text-sm tracking-tight"
          aria-label="Open AI Roofing Consultant"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="hidden sm:inline">Ask ZOF AI Consultant</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
        </button>
      </div>

      {/* Administration Dashboard Modal / Portal */}
      <AdminDashboard
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
        onAttachToForm={handleDocumentAttached}
        onScrollToForm={() => scrollToSection("consultation")}
      />

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<MarketHubAdmin />} />
        <Route path="/*" element={<Storefront />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
