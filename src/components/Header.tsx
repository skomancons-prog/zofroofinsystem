/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Phone, Sparkles, PanelLeft, Menu, X } from "lucide-react";
import zofLogo from "../assets/images/zof_bright_logo_2026.svg";
import { useLanguage } from "../context/LanguageContext";

interface HeaderProps {
  onScrollTo: (elementId: string) => void;
  onOpenEstimator: () => void;
  onOpenAdmin?: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function Header({
  onScrollTo,
  onOpenEstimator,
  onOpenAdmin,
  isSidebarOpen = true,
  onToggleSidebar
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      id="main-navigation-header"
      className={`fixed top-0 right-0 z-45 transition-all duration-300 ${
        isSidebarOpen ? "left-0 lg:left-64" : "left-0"
      } ${
        isScrolled
          ? "bg-[#F3E5C8]/95 backdrop-blur-md shadow-md border-b border-stone-250 py-3"
          : "bg-[#F3E5C8]/90 backdrop-blur-xs border-b border-stone-200/60 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Left: Sidebar Toggle Button + Brand Identity */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Sidebar Toggle Button (Opens/Closes the left sidebar) */}
            <button
              type="button"
              onClick={onToggleSidebar}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs ${
                isSidebarOpen
                  ? "bg-stone-900 text-amber-400 border-stone-800 hover:bg-stone-800"
                  : "bg-white hover:bg-stone-50 text-stone-800 border-stone-250 hover:border-blue-400"
              }`}
              title={isSidebarOpen ? "Collapse Navigation Sidebar" : "Open Navigation Sidebar"}
              aria-label="Toggle navigation sidebar"
            >
              <PanelLeft className="h-5 w-5" />
              <span className="font-sans text-xs font-black uppercase tracking-wider hidden sm:inline">
                {isSidebarOpen ? "Sidebar" : "Menu"}
              </span>
            </button>

            {/* Brand Identity Branding */}
            <div
              id="nav-logo"
              className="flex items-center space-x-2.5 cursor-pointer select-none group"
              onClick={() => onScrollTo("hero-section")}
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
                  <span className="font-sans font-black text-lg tracking-wider text-stone-900">
                    ZOF
                  </span>
                  <span className="font-sans font-black text-lg tracking-wider text-blue-600">
                    GROUP
                  </span>
                  <span className="text-[9px] bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded ml-2 border border-blue-200/60 hidden md:inline-block uppercase tracking-wider">
                    Guaranteed Seal
                  </span>
                </div>
                <p className="font-sans text-[8.5px] text-stone-500 font-bold tracking-widest leading-none mt-0.5 uppercase">
                  Zof Roofing System
                </p>
              </div>
            </div>
          </div>

          {/* Center Subtle Tagline (visible on medium & large screens) */}
          <div className="hidden lg:flex items-center space-x-2 text-stone-600 text-xs font-mono font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ghana's Certified Trusses, Interlocking & Timber Roofing</span>
          </div>

          {/* Right Header Controls (Clean & focused) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Call Office Button */}
            <a
              id="phone-cta-link"
              href="tel:0242866658"
              className="flex items-center space-x-2 bg-white hover:bg-stone-50 px-3 sm:px-3.5 py-2 rounded-xl border border-stone-200 hover:border-stone-300 transition-all text-stone-900 shadow-xs"
              title="Call Accra HQ Office"
            >
              <Phone className="h-4 w-4 text-blue-600 fill-blue-600/10 animate-pulse shrink-0" />
              <div className="text-left hidden sm:block">
                <p className="text-[9px] text-stone-500 font-bold tracking-tight uppercase leading-none">
                  {t.header.callOffice}
                </p>
                <p className="font-mono text-[11px] font-bold text-stone-800 leading-none mt-1">
                  0242 866 658
                </p>
              </div>
              <span className="sm:hidden font-mono text-xs font-bold text-stone-800">
                Call
              </span>
            </a>

            {/* Get Free Quote CTA */}
            <button
              type="button"
              id="header-quote-btn"
              onClick={() => onScrollTo("consultation")}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-3 sm:px-4 py-2 rounded-xl shadow-xs text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300 shrink-0" />
              <span>Get Free Quote</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
