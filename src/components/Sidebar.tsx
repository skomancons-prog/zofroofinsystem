/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Layers,
  Image,
  Wrench,
  Video,
  Award,
  Star,
  Trophy,
  Bot,
  Phone,
  MessageCircle,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Globe,
  ExternalLink,
  ShieldCheck,
  PanelLeftClose,
  PanelLeft,
  Store
} from "lucide-react";
import { Link } from "react-router-dom";
import zofLogo from "../assets/images/zof_bright_logo_2026.svg";
import { useLanguage } from "../context/LanguageContext";
import { AccraWeatherRadar } from "./AccraWeatherRadar";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  onScrollTo: (elementId: string) => void;
  onOpenEstimator?: () => void;
  onOpenAds?: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  onToggle,
  onScrollTo,
  onOpenEstimator,
  onOpenAds
}: SidebarProps) {
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    {
      label: t.header.systemsMaterials,
      id: "materials",
      icon: Layers,
      subtext: "Selflock, IBR, Step Tiles"
    },
    {
      label: t.header.photoGallery,
      id: "gallery",
      icon: Image,
      subtext: "Recent Site Projects"
    },
    {
      label: t.header.specialtyServices,
      id: "specialty-services",
      icon: Wrench,
      subtext: "POP, Waterproofing, Paint"
    },
    {
      label: "Video Tutorials",
      id: "maintenance-tutorials",
      icon: Video,
      subtext: "Aluzinc Care & Tips"
    },
    {
      label: t.header.eliteStandards,
      id: "elite-standards",
      icon: Award,
      subtext: "15-Yr Warranty & Safety"
    },
    {
      label: t.header.whyChooseUs,
      id: "reasons",
      icon: Star,
      subtext: "6 Master Distinctions"
    },
    {
      label: t.header.successShowcase,
      id: "showcase",
      icon: Trophy,
      subtext: "Verified Installations"
    },
    {
      label: t.header.aiConsultant,
      id: "consultant",
      icon: Bot,
      subtext: "24/7 Smart Roof Advisor"
    }
  ];

  const handleNavClick = (id: string) => {
    // On small screens, close sidebar when clicking a nav item
    if (window.innerWidth < 1024) {
      onClose();
    }
    onScrollTo(id);
  };

  const handleOpenAds = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
    if (onOpenAds) {
      onOpenAds();
    } else if (onOpenEstimator) {
      onOpenEstimator();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay (only on < lg when open) */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-55 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Vertical Left Sidebar Container */}
      <aside
        id="zof-left-sidebar"
        aria-label="Site Navigation Sidebar"
        className={`fixed top-0 bottom-0 left-0 z-60 w-72 sm:w-80 lg:w-64 bg-[#F3E5C8] border-r border-stone-300/90 shadow-2xl lg:shadow-md flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:-translate-x-full"
        }`}
      >
        {/* Top Header & Branding */}
        <div className="p-4 sm:p-5 border-b border-stone-300/80 bg-[#EBDBC0]/60 shrink-0">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center space-x-2.5 cursor-pointer select-none group"
              onClick={() => handleNavClick("hero-section")}
              title="Go to Top"
            >
              <div className="relative h-10 w-10 bg-white border border-stone-200 rounded-full flex items-center justify-center p-0.5 shadow-xs overflow-hidden group-hover:scale-105 transition-transform shrink-0">
                <img
                  src={zofLogo}
                  alt="Zof Group Logo"
                  className="h-full w-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-sans font-black text-base tracking-wider text-stone-900">
                    ZOF
                  </span>
                  <span className="font-sans font-black text-base tracking-wider text-blue-600">
                    GROUP
                  </span>
                </div>
                <p className="font-sans text-[8.5px] text-stone-600 font-bold tracking-widest leading-none uppercase">
                  Roofing System
                </p>
              </div>
            </div>

            {/* Close / Collapse Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-300/50 transition-colors cursor-pointer"
              aria-label="Close sidebar"
              title="Hide sidebar"
            >
              <X className="h-5 w-5 lg:hidden" />
              <PanelLeftClose className="h-5 w-5 hidden lg:block text-stone-600 hover:text-stone-900" />
            </button>
          </div>

          {/* Guaranteed Seal Chip & Tagline */}
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center space-x-1 text-[9px] bg-blue-100/70 text-blue-800 font-black px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wider">
                <ShieldCheck className="h-3 w-3 text-blue-600" />
                <span>Guaranteed Seal</span>
              </span>
              <span className="text-[10px] font-mono text-stone-600 font-bold">
                Est. Ghana
              </span>
            </div>
            <p className="text-[9px] font-mono text-stone-700 font-bold leading-tight flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>Ghana's Certified Trusses, Interlocking & Timber Roofing</span>
            </p>
          </div>
        </div>

        {/* Scrollable Center Content */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4 scrollbar-thin">
          {/* 1. Language Toggle Pill (Moved from top header) */}
          <div className="bg-white/80 p-2.5 rounded-xl border border-stone-300/70 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono font-bold text-stone-600 uppercase tracking-wider flex items-center space-x-1">
                <Globe className="h-3 w-3 text-blue-600" />
                <span>Language / Kasa:</span>
              </span>
              <span className="text-[10px] font-mono font-semibold text-stone-500">
                {language === "en" ? "English" : "Twi"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 bg-stone-900 p-1 rounded-lg text-xs font-mono select-none">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`flex items-center justify-center space-x-1.5 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-amber-500 text-slate-950 shadow-xs font-black"
                    : "text-stone-400 hover:text-stone-200"
                }`}
                title="Switch site to English"
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage("tw")}
                className={`flex items-center justify-center space-x-1.5 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                  language === "tw"
                    ? "bg-amber-500 text-slate-950 shadow-xs font-black"
                    : "text-stone-400 hover:text-stone-200"
                }`}
                title="Sesa kɔ Asante Twi mu (Switch to Twi)"
              >
                <span>🇬🇭</span>
                <span>Twi</span>
              </button>
            </div>
          </div>

          {/* 2. Real-time Accra Weather Widget (Moved from top header) */}
          <div className="bg-white/80 p-2.5 rounded-xl border border-stone-300/70 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono font-bold text-stone-600 uppercase tracking-wider">
                Accra Climate Live
              </span>
              <span className="text-[9px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                Radar Link
              </span>
            </div>
            <div className="w-full">
              <AccraWeatherRadar variant="header-chip" />
            </div>
          </div>

          {/* 3. Navigation Links (The 8 main destinations moved from horizontal top bar) */}
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold px-2 py-1">
              Main Menu
            </p>
            <nav className="space-y-1" aria-label="Sidebar Sections">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-left font-sans text-xs font-bold text-stone-800 hover:text-blue-700 hover:bg-white/90 border border-transparent hover:border-stone-300/80 transition-all cursor-pointer shadow-none hover:shadow-xs"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="p-1.5 rounded-lg bg-stone-200/70 group-hover:bg-blue-50 text-stone-700 group-hover:text-blue-600 transition-colors shrink-0">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 truncate">
                        <span className="block truncate text-xs font-extrabold text-stone-800 group-hover:text-blue-600">
                          {item.label}
                        </span>
                        <span className="block text-[9.5px] font-mono font-medium text-stone-500 truncate">
                          {item.subtext}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-stone-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                  </button>
                );
              })}

              {/* Ad (In Menu Only - Smaller with Icon as <a> tag) */}
              <a
                href="#featured-promotions"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenAds();
                }}
                className="w-full group flex items-center justify-between px-3 py-2 rounded-xl text-left font-sans text-xs font-bold text-stone-800 hover:text-amber-900 hover:bg-amber-400/20 bg-amber-400/10 border border-amber-500/30 hover:border-amber-500/50 transition-all cursor-pointer shadow-none hover:shadow-xs no-underline"
                title="Ghana's Certified Trusses, Interlocking & Timber Roofing Promotion"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-amber-400/30 text-amber-800 group-hover:bg-amber-400/50 transition-colors shrink-0">
                    <ShieldCheck className="h-4 w-4 text-amber-700" />
                  </div>
                  <div className="min-w-0 truncate">
                    <div className="flex items-center space-x-1.5">
                      <span className="block truncate text-xs font-black text-stone-900 group-hover:text-amber-900">
                        Ad
                      </span>
                      <span className="text-[8px] font-mono font-black px-1.5 py-0.2 bg-amber-400 text-stone-950 rounded border border-amber-500/40 leading-none">
                        15% OFF
                      </span>
                    </div>
                    <span className="block text-[9.5px] font-mono font-medium text-amber-800 truncate">
                      Trusses, Interlocking & Timber
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-amber-600 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Quick Contact & Action Buttons */}
        <div className="p-3.5 sm:p-4 border-t border-stone-300/80 bg-[#EBDBC0]/70 shrink-0 space-y-2">
          {/* Quick Quote Button */}
          <button
            type="button"
            onClick={() => handleNavClick("consultation")}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer active:scale-98"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Request Free Quote</span>
          </button>

          {/* Direct Phone & WhatsApp links */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <a
              href="tel:0242866658"
              className="flex items-center justify-center space-x-1.5 py-2 px-2 bg-white hover:bg-stone-50 border border-stone-300/80 rounded-lg text-stone-800 text-[11px] font-mono font-bold shadow-xs transition-colors"
              title="Call Office: 0242 866 658"
            >
              <Phone className="h-3.5 w-3.5 text-blue-600" />
              <span>Call ZOF</span>
            </a>
            <a
              href="https://wa.me/233546331603?text=Hello%20Zof%20Group!%20I%20am%20interested%20in%20a%20roofing%20consultation."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-1.5 py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-mono font-bold shadow-xs transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="h-3.5 w-3.5 text-white" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Direct Link to MarketHub Admin Console */}
          <Link
            to="/admin"
            className="w-full flex items-center justify-center space-x-1.5 py-2 px-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10.5px] font-mono font-bold transition-all shadow-xs border border-slate-700"
            title="Open MarketHub Admin Control Center"
          >
            <Store className="h-3.5 w-3.5 text-blue-400" />
            <span>MarketHub Admin &rarr;</span>
          </Link>

          {/* Office Hours */}
          <div className="pt-2 border-t border-stone-300/60 text-center">
            <p className="text-[9.5px] font-mono text-stone-500 font-bold uppercase">
              Mon - Fri 7AM - 5PM GMT • Greater Accra, Ghana
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
