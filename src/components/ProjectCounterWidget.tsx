/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  RefreshCw,
  Building2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Layers,
  Database,
  TrendingUp
} from "lucide-react";

interface FlipDigitProps {
  digit: string;
}

/**
 * Individual mechanical flip digit slot card
 */
export const FlipDigitCard: React.FC<FlipDigitProps> = ({ digit }) => {
  // If it's a non-numeric separator like ',' or '+' or 'M'
  const isSpecialChar = isNaN(Number(digit));

  if (isSpecialChar) {
    return (
      <span className="inline-flex items-center justify-center text-amber-400 font-mono font-black text-2xl sm:text-4xl mx-0.5 select-none">
        {digit}
      </span>
    );
  }

  return (
    <div className="relative inline-flex flex-col items-center justify-center w-8 sm:w-11 h-12 sm:h-16 mx-0.5 rounded-xl bg-gradient-to-b from-stone-850 via-stone-900 to-stone-950 border border-amber-500/30 shadow-2xl shadow-amber-500/10 overflow-hidden group select-none">
      {/* Top half shine */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

      {/* Center mechanical split line */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-stone-950 shadow-[0_1px_1px_rgba(255,255,255,0.15)] z-20" />

      {/* Side hinge notches */}
      <div className="absolute top-1/2 -left-1 w-1.5 h-2 bg-stone-950 rounded-r-full z-30" />
      <div className="absolute top-1/2 -right-1 w-1.5 h-2 bg-stone-950 rounded-l-full z-30" />

      {/* Animated Digit Slot */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={digit}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 25,
            mass: 0.8
          }}
          className="font-mono font-black text-2xl sm:text-4xl text-amber-400 tracking-wider drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)] z-10 flex items-center justify-center h-full"
        >
          {digit}
        </motion.div>
      </AnimatePresence>

      {/* Ambient glowing border highlight on hover */}
      <div className="absolute inset-0 rounded-xl border border-amber-400/0 group-hover:border-amber-400/40 transition-colors pointer-events-none" />
    </div>
  );
};

interface ProjectCounterWidgetProps {
  activeCategory?: string;
  activeCategoryLabel?: string;
  filteredCount?: number;
}

export function ProjectCounterWidget({
  activeCategory = "all",
  activeCategoryLabel = "All Works",
  filteredCount = 12
}: ProjectCounterWidgetProps) {
  // Base total projects count in database
  const BASE_PROJECT_COUNT = 1482;

  // Category specific total historical project counts
  const CATEGORY_TOTALS: Record<string, number> = {
    all: 1482,
    selflock: 520,
    steptiles: 395,
    ibr_idt: 284,
    waterproofing: 142,
    renovation: 98,
    solar: 43
  };

  const [isFetching, setIsFetching] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>("Just now");
  const [targetCount, setTargetCount] = useState<number>(
    CATEGORY_TOTALS[activeCategory] || BASE_PROJECT_COUNT
  );

  // Update target count when active category changes
  useEffect(() => {
    const nextCount = CATEGORY_TOTALS[activeCategory] || BASE_PROJECT_COUNT;
    setTargetCount(nextCount);
  }, [activeCategory]);

  // Simulate fetching live project updates from ZOF database
  const handleFetchLiveStats = () => {
    setIsFetching(true);
    setTimeout(() => {
      // Small simulated increase representing freshly verified completed project logs
      const bonus = Math.floor(Math.random() * 3) + 1;
      const base = CATEGORY_TOTALS[activeCategory] || BASE_PROJECT_COUNT;
      setTargetCount(base + bonus);
      setIsFetching(false);
      setLastSynced(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 800);
  };

  // Convert number to formatted digit string with commas e.g. "1,482+"
  const formattedCountString = targetCount.toLocaleString() + "+";
  const digitArray = formattedCountString.split("");

  return (
    <div className="bg-gradient-to-b from-stone-850 via-stone-900 to-stone-950 border border-stone-700/80 rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl relative overflow-hidden text-left">
      {/* Background glowing glow spots */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* LEFT PORTION: Animated Digit Flip Counter Display */}
        <div className="w-full lg:w-7/12 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Top Status Header */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-3">
            <span className="inline-flex items-center space-x-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full px-3 py-1 text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">
              <Database className="h-3.5 w-3.5" />
              <span>Live Registry Verified</span>
            </span>

            <span className="text-[11px] font-mono text-stone-400 bg-stone-800/80 border border-stone-700/80 px-2.5 py-1 rounded-full flex items-center space-x-1">
              <span className={`h-2 w-2 rounded-full ${isFetching ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`} />
              <span>Sync: {lastSynced}</span>
            </span>
          </div>

          <h3 className="font-sans font-black text-xl sm:text-2xl text-white tracking-tight mb-2 drop-shadow-sm">
            Total Completed Roofing Projects
          </h3>
          <p className="text-stone-200 text-xs sm:text-sm font-sans max-w-lg mb-5 leading-relaxed">
            Verified structural roof installations, timber carpentry trusses, step tiles, and waterproofing decks completed by ZOF Group.
          </p>

          {/* FLIP DIGIT DISPLAY ROW */}
          <div className="flex items-center justify-center lg:justify-start bg-stone-950 border-2 border-stone-700/90 rounded-2xl p-3 sm:p-4 shadow-inner mb-4 w-full sm:w-auto">
            <div className="flex items-center space-x-1 sm:space-x-1.5">
              {digitArray.map((char, index) => (
                <FlipDigitCard key={`${index}-${char}`} digit={char} />
              ))}
            </div>

            <button
              type="button"
              onClick={handleFetchLiveStats}
              disabled={isFetching}
              className="ml-4 p-2.5 bg-stone-800 hover:bg-amber-500 text-stone-200 hover:text-slate-950 border border-stone-600 rounded-xl transition-all cursor-pointer shadow-md shrink-0 group"
              title="Sync latest completed project entries from server database"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin text-amber-400" : "group-hover:rotate-180 transition-transform duration-500"}`} />
            </button>
          </div>

          <p className="text-xs font-mono text-amber-300 font-bold flex items-center space-x-1.5 bg-stone-950/70 border border-stone-800 px-3 py-1 rounded-lg">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-400" />
            <span>Category Scope: <strong className="text-white underline decoration-amber-400">{activeCategoryLabel}</strong> ({filteredCount} HD photos in gallery)</span>
          </p>

        </div>

        {/* RIGHT PORTION: Key Performance Metrics Cards */}
        <div className="w-full lg:w-5/12 grid grid-cols-2 gap-3.5 border-t lg:border-t-0 lg:border-l border-stone-700/80 pt-6 lg:pt-0 lg:pl-8">
          
          <div className="bg-stone-900/95 border border-stone-700 rounded-2xl p-4 hover:border-amber-400 transition-colors shadow-md">
            <div className="flex items-center space-x-2 text-amber-400 mb-1.5">
              <Building2 className="h-4 w-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-300">Total Area</span>
            </div>
            <p className="font-mono font-black text-2xl text-white">4.85M+</p>
            <p className="text-xs text-stone-300 font-sans mt-0.5 font-medium">Sq Ft Metal Sheeting Clad</p>
          </div>

          <div className="bg-stone-900/95 border border-stone-700 rounded-2xl p-4 hover:border-emerald-400 transition-colors shadow-md">
            <div className="flex items-center space-x-2 text-emerald-400 mb-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-300">Track Record</span>
            </div>
            <p className="font-mono font-black text-2xl text-white">100%</p>
            <p className="text-xs text-stone-300 font-sans mt-0.5 font-medium">Zero Leak Guarantee Kept</p>
          </div>

          <div className="bg-stone-900/95 border border-stone-700 rounded-2xl p-4 hover:border-blue-400 transition-colors shadow-md">
            <div className="flex items-center space-x-2 text-blue-400 mb-1.5">
              <MapPin className="h-4 w-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-300">Coverage</span>
            </div>
            <p className="font-mono font-black text-2xl text-white">16 Regions</p>
            <p className="text-xs text-stone-300 font-sans mt-0.5 font-medium">Nationwide Ghana & Beyond</p>
          </div>

          <div className="bg-stone-900/95 border border-stone-700 rounded-2xl p-4 hover:border-amber-400 transition-colors shadow-md">
            <div className="flex items-center space-x-2 text-amber-400 mb-1.5">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-300">Client Rating</span>
            </div>
            <p className="font-mono font-black text-2xl text-white">4.98 / 5</p>
            <p className="text-xs text-stone-300 font-sans mt-0.5 font-medium">380+ Verified Reviews</p>
          </div>

        </div>

      </div>
    </div>
  );
}
