/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  Paintbrush,
  ShieldCheck,
  Check,
  Hammer,
  Network,
  Sun,
  Sunset,
  CloudRain,
  Sparkles,
  Sparkle
} from "lucide-react";

export interface ColorOption {
  name: string;
  className: string;
  hex: string;
  desc: string;
  accentClass: string;
  vibe: string;
  isLight?: boolean;
}

export interface FinishOption {
  id: "matte" | "gloss" | "textured";
  name: string;
  shortLabel: string;
  badge: string;
  desc: string;
  specularOpacity: number;
  glossiness: string;
  reflectivityIndex: string;
  thermalRating: string;
  scratchRating: string;
}

export interface DaylightOption {
  id: "noon" | "sunset" | "overcast" | "coastal";
  name: string;
  icon: typeof Sun;
  timeLabel: string;
  skyBg: string;
  lightOverlay: string;
  panelHighlightTint: string;
  description: string;
}

export function ColorVisualizer() {
  const colors: ColorOption[] = [
    {
      name: "Classic Cream",
      className: "bg-[#F3EFE0]",
      hex: "#F3EFE0",
      desc: "Warm off-white sand cream. Reflects maximum tropical sunlight protecting internal attics.",
      accentClass: "text-[#DCD6C0]",
      vibe: "Bright luxury tropical look; highly effective at heat deflection in sunny climates.",
      isLight: true,
    },
    {
      name: "Deep Ocean",
      className: "bg-[#1e2f42]",
      hex: "#1E2F42",
      desc: "Deep, wealthy marine navy color. Optimal for coastal prestige.",
      accentClass: "text-[#1e2f42]",
      vibe: "Elegant & cooling; highly popular aesthetic for modern villas.",
    },
    {
      name: "Cottage Green",
      className: "bg-[#183a2b]",
      hex: "#183A2B",
      desc: "Rich tropical organic pine green. Blends beautifully with nature.",
      accentClass: "text-[#183a2b]",
      vibe: "Soothing natural tone that looks incredible amidst landscaped gardens.",
    },
    {
      name: "Headland Red",
      className: "bg-[#7c281e]",
      hex: "#7C281E",
      desc: "Traditional terra-cotta earth tone red. Bold and extremely prestigious.",
      accentClass: "text-[#7c281e]",
      vibe: "Mediterranean luxury. Classic, high-impact visibility that never goes out of style.",
    },
    {
      name: "Woodland Gray",
      className: "bg-[#333d45]",
      hex: "#333D45",
      desc: "Sleek, high-end dark charcoal. Minimalist architectural choice.",
      accentClass: "text-[#333d45]",
      vibe: "Elite contemporary look. The absolute favorite choice for premium real estate developers.",
    },
  ];

  const finishes: FinishOption[] = [
    {
      id: "matte",
      name: "Matte Architectural",
      shortLabel: "Matte Finish",
      badge: "Anti-Glare Soft",
      desc: "Low-reflectivity smooth coating. Softly diffuses tropical sunlight with zero harsh glare.",
      specularOpacity: 0.1,
      glossiness: "Low / Anti-Reflective",
      reflectivityIndex: "12% Specular Reflection",
      thermalRating: "Max Solar Heat Deflection",
      scratchRating: "Standard Architectural Resistance",
    },
    {
      id: "gloss",
      name: "Gloss High-Luster",
      shortLabel: "Gloss Sheen",
      badge: "Vivid Reflective",
      desc: "Ultra-sleek glossy finish with striking specular highlights and deep color contrast under sunlight.",
      specularOpacity: 0.65,
      glossiness: "High / Reflective Sheen",
      reflectivityIndex: "85% Specular Shine",
      thermalRating: "High UV Defense Barrier",
      scratchRating: "High-Gloss Hardcoat Protection",
    },
    {
      id: "textured",
      name: "Textured Wrinkle Grain",
      shortLabel: "Textured Stucco",
      badge: "Tactile Scuff-Proof",
      desc: "Tactile micro-embossed texture. Adds rich organic depth, masks minor installation scuffs, and grips under foot.",
      specularOpacity: 0.25,
      glossiness: "Satin Micro-Grain",
      reflectivityIndex: "35% Diffused Satin",
      thermalRating: "Enhanced Air Gap Thermal Barrier",
      scratchRating: "Superior Scratch & Debris Resilience",
    },
  ];

  const daylights: DaylightOption[] = [
    {
      id: "noon",
      name: "Noon Overhead Sun",
      icon: Sun,
      timeLabel: "12:00 PM Direct Sunlight",
      skyBg: "from-amber-100/80 via-sky-100/50 to-stone-100",
      lightOverlay: "bg-gradient-to-b from-yellow-100/30 via-white/10 to-stone-900/20",
      panelHighlightTint: "rgba(255, 255, 240, 0.4)",
      description: "Direct overhead tropical sunlight highlighting raw color warmth and UV stability.",
    },
    {
      id: "sunset",
      name: "Golden Hour Sunset",
      icon: Sunset,
      timeLabel: "5:45 PM Warm Ambience",
      skyBg: "from-amber-200/90 via-orange-100/60 to-rose-100/40",
      lightOverlay: "bg-gradient-to-tr from-amber-500/30 via-orange-300/15 to-indigo-950/40",
      panelHighlightTint: "rgba(255, 185, 120, 0.55)",
      description: "Warm golden glow revealing architectural step depths and subtle surface luster.",
    },
    {
      id: "overcast",
      name: "Monsoon Overcast",
      icon: CloudRain,
      timeLabel: "3:15 PM Diffused Rain Sky",
      skyBg: "from-slate-200/90 via-blue-100/50 to-stone-200",
      lightOverlay: "bg-gradient-to-b from-slate-400/25 via-transparent to-slate-900/35",
      panelHighlightTint: "rgba(210, 230, 250, 0.3)",
      description: "Soft, uniform diffused sky showcasing true color undertones with zero glare.",
    },
    {
      id: "coastal",
      name: "Coastal Atlantic Glare",
      icon: Sparkles,
      timeLabel: "2:00 PM Atlantic Beachside",
      skyBg: "from-cyan-100/90 via-sky-100/60 to-amber-100/40",
      lightOverlay: "bg-gradient-to-tr from-cyan-400/25 via-white/40 to-blue-900/30",
      panelHighlightTint: "rgba(255, 255, 255, 0.75)",
      description: "High-contrast coastal brightness testing glare dispersion along oceanfront winds.",
    },
  ];

  const profiles = [
    {
      id: "selflock",
      name: "ZOF Selflock® Profiles",
      type: "Premium Profile",
      desc: "Advanced snap-on locking metal with zero exposed penetrations. Keeps rain out entirely.",
      feat: "Concealed Fastening System (100% Leak Proof)",
    },
    {
      id: "steptiles",
      name: "Mediterranean Step Tiles",
      type: "Vibrant Tile Profile",
      desc: "Classic lightweight step-downs recreating European luxury clay tiles.",
      feat: "High Prestige Curbside Presentation",
    },
    {
      id: "ibr",
      name: "Inverted Box Rib (IBR)",
      type: "Structural High-Drain Sheeting",
      desc: "Deep angular flutes engineered to drain massive monsoon rainwater runoffs safely.",
      feat: "Supreme Rainwater Channels",
    },
  ];

  const frameworks = [
    {
      id: "carpentry",
      name: "Timber Woodwork frame support",
      icon: Hammer,
      badge: "Cured & Anti-Insect Treated Wood",
      desc: "Master carpenters build fully braced, anti-rot treated hardwood frames ensuring long-term truss straightness.",
    },
    {
      id: "trusses",
      name: "Precision Steel Truss Systems",
      icon: Network,
      badge: "Termite & Fireproof Structure",
      desc: "Engineered high-tensile structural steel truss components. Completely immune to termite damage and rotting.",
    },
  ];

  const [activeColor, setActiveColor] = useState<ColorOption>(colors[0]);
  const [activeFinish, setActiveFinish] = useState<FinishOption>(finishes[0]);
  const [activeDaylight, setActiveDaylight] = useState<DaylightOption>(daylights[0]);
  const [activeProfile, setActiveProfile] = useState(profiles[0]);
  const [activeFramework, setActiveFramework] = useState(frameworks[1]);

  const textColorClass = activeColor.isLight ? "text-stone-900" : "text-white";
  const labelBgClass = activeColor.isLight
    ? "bg-stone-900/10 text-stone-800 border-stone-900/15"
    : "bg-white/10 text-white border-white/20";

  return (
    <section id="color-visualizer" className="py-20 bg-[#F3E5C8] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Module Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-3.5 py-1 text-xs text-blue-700 mb-4 select-none font-semibold">
            <Paintbrush className="h-4 w-4 text-blue-600" />
            <span className="font-mono text-xs uppercase tracking-wider text-blue-750">
              Custom Material & Daylight Studio
            </span>
          </div>
          <h2 className="font-sans font-black text-3xl sm:text-4xl text-stone-900 tracking-tight mb-4">
            Interactive Color, Finish & Lighting Visualizer
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Test how ZOF roof sheeting color coatings and panel finishes (Matte, Gloss, Textured) react under simulated tropical daylight environments — from overhead noon sun to golden hour sunsets.
          </p>
        </div>

        {/* Visualizer Workbench Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT / TOP: Interactive Preview Canvas */}
          <div className="lg:col-span-7 bg-white border border-stone-200/80 rounded-3xl p-5 sm:p-7 flex flex-col justify-between shadow-lg relative overflow-hidden text-left">
            
            {/* Top Toolbar: Daylight Simulation Selector Bar */}
            <div className="mb-6 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-stone-150">
                <div className="text-left">
                  <span className="text-[10px] font-mono select-none px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-bold uppercase tracking-wider">
                    Daylight Simulator
                  </span>
                  <h4 className="font-sans font-extrabold text-stone-900 mt-1 text-sm sm:text-base flex items-center space-x-2">
                    <span>Lighting: {activeDaylight.name}</span>
                  </h4>
                </div>

                <div className="flex items-center space-x-1.5 text-[11px] font-mono text-stone-500 font-semibold bg-stone-100 px-2.5 py-1 rounded-lg">
                  <span className="h-2 w-2 rounded-full animate-pulse bg-amber-500" />
                  <span>{activeDaylight.timeLabel}</span>
                </div>
              </div>

              {/* Daylight Environment Quick Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {daylights.map((dl) => {
                  const isSelected = activeDaylight.id === dl.id;
                  const Icon = dl.icon;
                  return (
                    <button
                      key={dl.id}
                      type="button"
                      onClick={() => setActiveDaylight(dl)}
                      className={`px-2.5 py-2 rounded-xl text-xs font-sans font-bold transition-all flex items-center space-x-2 cursor-pointer border ${
                        isSelected
                          ? "bg-slate-900 text-amber-300 border-slate-900 shadow-sm"
                          : "bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200"
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-amber-400" : "text-stone-500"}`} />
                      <span className="truncate text-[11px]">{dl.name.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SIMULATED CANVAS BOX */}
            <div
              className={`py-12 px-4 rounded-2xl flex flex-col items-center justify-center relative min-h-[340px] overflow-hidden transition-all duration-700 bg-gradient-to-b ${activeDaylight.skyBg} border border-stone-200/80 shadow-inner`}
            >
              {/* Daylight Lighting Ambient Overlay Layer */}
              <div className={`absolute inset-0 pointer-events-none transition-all duration-700 ${activeDaylight.lightOverlay}`} />

              {/* Background Truss Structure Representation */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.22] text-slate-800">
                <svg className="w-full h-full max-w-[420px] max-h-[280px]" viewBox="0 0 100 60" fill="none" stroke="currentColor">
                  <path d="M 10,50 L 50,10 L 90,50 Z" strokeWidth={activeFramework.id === "trusses" ? "1.5" : "1.0"} />
                  <path d="M 50,10 L 50,50" strokeWidth="1" />
                  <path d="M 30,30 L 50,50 L 70,30" strokeWidth="1" />
                  <path d="M 30,30 L 30,50 M 70,30 L 70,50" strokeWidth="1" />
                  <path d="M 10,50 L 90,50" strokeWidth="2" />
                  {activeFramework.id === "trusses" && (
                    <>
                      <path d="M 10,50 L 50,30 L 90,50" strokeWidth="1" />
                      <circle cx="50" cy="10" r="1.5" fill="currentColor" />
                      <circle cx="30" cy="30" r="1.5" fill="currentColor" />
                      <circle cx="70" cy="30" r="1.5" fill="currentColor" />
                      <circle cx="50" cy="50" r="1.5" fill="currentColor" />
                    </>
                  )}
                </svg>
              </div>

              {/* ROOFING PANEL MOCKUP CANVAS */}
              <div
                className="w-full max-w-[300px] p-6 rounded-2xl shadow-2xl relative transition-all duration-500 border border-stone-900/20 flex flex-col items-stretch space-y-4 overflow-hidden"
                style={{ backgroundColor: activeColor.hex }}
              >
                {/* 1. Base Panel Corrugation Profiles */}
                <div className="absolute inset-0 flex h-full w-full opacity-25 pointer-events-none rounded-2xl overflow-hidden">
                  <div className="w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.2)_0%,rgba(0,0,0,0.3)_25%,rgba(255,255,255,0.2)_50%,rgba(0,0,0,0.3)_75%,rgba(255,255,255,0.2)_100%)] bg-[size:32px_100%]" />
                </div>

                {/* 2. FINISH LAYER: Textured Wrinkle Grain Overlay */}
                {activeFinish.id === "textured" && (
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay rounded-2xl"
                    style={{
                      backgroundImage: `radial-gradient(#000 1px, transparent 1px), radial-gradient(#fff 1px, transparent 1px)`,
                      backgroundSize: `6px 6px`,
                      backgroundPosition: `0 0, 3px 3px`,
                    }}
                  />
                )}

                {/* 3. FINISH LAYER: High Gloss Specular Reflective Highlight Streaks */}
                {activeFinish.id === "gloss" && (
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl transition-all duration-500"
                    style={{
                      background: `linear-gradient(135deg, transparent 0%, transparent 35%, ${activeDaylight.panelHighlightTint} 48%, rgba(255,255,255,0.85) 50%, ${activeDaylight.panelHighlightTint} 52%, transparent 65%, transparent 100%)`,
                      opacity: activeFinish.specularOpacity,
                    }}
                  />
                )}

                {/* 4. FINISH LAYER: Matte Muted Diffused Lighting Overlay */}
                {activeFinish.id === "matte" && (
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl transition-all duration-500 bg-stone-950/10 mix-blend-soft-light"
                    style={{ opacity: 0.3 }}
                  />
                )}

                {/* Daylight Dynamic Specular Ray Filter */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl transition-all duration-700"
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${activeDaylight.panelHighlightTint} 0%, transparent 70%)`,
                    opacity: activeFinish.specularOpacity,
                  }}
                />

                {/* Brand watermark on sample panel */}
                <div className={`flex justify-between items-center opacity-85 z-10 ${textColorClass}`}>
                  <span className="text-[10px] font-mono tracking-widest font-black">ZOF METAL</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-[9px] font-mono uppercase bg-black/20 backdrop-blur-xs px-1.5 py-0.5 rounded text-white font-bold">
                      {activeFinish.id}
                    </span>
                    <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
                  </div>
                </div>

                {/* Profile Rib Geometry simulation lines */}
                {activeProfile.id === "steptiles" ? (
                  <div className={`space-y-3 py-1 flex flex-col justify-around opacity-80 z-10 ${activeColor.isLight ? "text-stone-800/50" : "text-white/50"}`}>
                    <div className="h-1.5 border-b-2 border-current" />
                    <div className="h-1.5 border-b-2 border-current" />
                    <div className="h-1.5 border-b-2 border-current" />
                    <div className="h-1.5 border-b-2 border-current" />
                  </div>
                ) : activeProfile.id === "selflock" ? (
                  <div className={`space-y-4 py-2 flex flex-col justify-around opacity-75 z-10 ${activeColor.isLight ? "text-stone-800/30" : "text-white/30"}`}>
                    <div className="h-1 border-b-2 border-current" />
                    <div className="h-1 border-b-2 border-current" />
                  </div>
                ) : (
                  <div className={`space-y-2 py-1 flex flex-col justify-around opacity-60 z-10 ${activeColor.isLight ? "text-stone-800/20" : "text-white/20"}`}>
                    <div className="h-px border-b border-current" />
                    <div className="h-px border-b border-current" />
                    <div className="h-px border-b border-current" />
                    <div className="h-px border-b border-current" />
                  </div>
                )}

                {/* Dynamic Label Content */}
                <div className={`pt-6 text-center z-10 ${textColorClass}`}>
                  <p className="font-display font-black text-xl tracking-tight uppercase select-none leading-none">
                    {activeColor.name}
                  </p>
                  <div className="flex justify-center items-center gap-1.5 mt-3 flex-wrap">
                    <span className={`text-[10px] font-mono rounded-full px-2.5 py-0.5 inline-block border ${labelBgClass}`}>
                      {activeProfile.type}
                    </span>
                    <span className={`text-[10px] font-mono rounded-full px-2.5 py-0.5 inline-block border ${labelBgClass}`}>
                      {activeFinish.badge}
                    </span>
                  </div>
                </div>
              </div>

              {/* Support Frame Badge */}
              <div className="mt-6 bg-white/90 backdrop-blur-md border border-stone-200/80 px-4 py-1.5 rounded-full text-center max-w-sm z-10 shadow-sm">
                <p className="text-[11px] font-medium text-stone-600">
                  Sub-Structure: <strong className="text-stone-900 font-extrabold">{activeFramework.name}</strong>
                </p>
              </div>

            </div>

            {/* Active Simulation Summary Footer */}
            <div className="mt-5 bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[10px] font-mono text-stone-500 uppercase font-semibold">Finish Reflection Behavior</p>
                <p className="text-stone-800 font-bold mt-0.5 flex items-center space-x-1">
                  <Sparkle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>{activeFinish.reflectivityIndex}</span>
                </p>
                <p className="text-[11px] text-stone-500 mt-1 leading-normal">{activeFinish.desc}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-stone-500 uppercase font-semibold">Daylight Environment Note</p>
                <p className="text-stone-800 font-bold mt-0.5 flex items-center space-x-1">
                  <Sun className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>{activeDaylight.timeLabel}</span>
                </p>
                <p className="text-[11px] text-stone-500 mt-1 leading-normal">{activeDaylight.description}</p>
              </div>
            </div>

          </div>

          {/* RIGHT / BOTTOM: Configuration Controls Panel */}
          <div className="lg:col-span-5 flex flex-col space-y-5 text-left">
            
            {/* STEP 1: Color Selector */}
            <div className="bg-white border border-stone-200 rounded-3xl p-5 text-left shadow-lg">
              <h3 className="font-sans font-extrabold text-stone-900 text-sm sm:text-base mb-1 flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                <span>1. Select Color Coating</span>
              </h3>
              <p className="text-xs text-stone-500 mb-3">
                Select tropical-grade baked alloy palette:
              </p>

              {/* Color Circles */}
              <div className="grid grid-cols-2 gap-2.5">
                {colors.map((c) => {
                  const isSelected = activeColor.name === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setActiveColor(c)}
                      className={`text-left p-2.5 rounded-xl border flex items-center space-x-2.5 cursor-pointer select-none transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20"
                          : "border-stone-150 hover:border-stone-300 bg-white text-stone-800"
                      }`}
                    >
                      <span
                        className={`h-7 w-7 rounded-lg shrink-0 ${c.className} shadow-inner border border-stone-300 flex items-center justify-center`}
                      >
                        {isSelected && <Check className={`h-3.5 w-3.5 ${c.isLight ? "text-stone-850" : "text-white"}`} />}
                      </span>
                      <div className="text-left min-w-0">
                        <p className={`text-xs font-bold truncate ${isSelected ? "text-blue-800" : "text-stone-800"}`}>
                          {c.name}
                        </p>
                        <p className="text-[9px] text-stone-400 font-mono truncate">
                          {c.hex}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Panel Finish Swatch Picker */}
            <div className="bg-white border border-stone-200 rounded-3xl p-5 text-left shadow-lg">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-sans font-extrabold text-stone-900 text-sm sm:text-base flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>2. Panel Finish Swatch Picker</span>
                </h3>
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md uppercase">
                  Tactile Swatch
                </span>
              </div>
              <p className="text-xs text-stone-500 mb-3">
                Choose the surface texture & light reflection profile:
              </p>

              {/* Swatch Picker Grid */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {finishes.map((f) => {
                  const isSelected = activeFinish.id === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActiveFinish(f)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center text-center cursor-pointer select-none transition-all ${
                        isSelected
                          ? "border-amber-500 bg-amber-500/10 text-slate-950 font-extrabold ring-2 ring-amber-500/30 shadow-xs"
                          : "border-stone-200 hover:border-stone-300 bg-stone-50/80 text-stone-700"
                      }`}
                    >
                      {/* Visual Swatch Preview Circle */}
                      <div
                        className="h-9 w-full rounded-lg mb-2 relative overflow-hidden border border-stone-300/80 shadow-xs flex items-center justify-center"
                        style={{ backgroundColor: activeColor.hex }}
                      >
                        {/* Swatch Gloss Sheen */}
                        {f.id === "gloss" && (
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/80 to-transparent" />
                        )}
                        {/* Swatch Wrinkle Grain */}
                        {f.id === "textured" && (
                          <div
                            className="absolute inset-0 opacity-50 mix-blend-overlay"
                            style={{
                              backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                              backgroundSize: `4px 4px`,
                            }}
                          />
                        )}
                        {/* Swatch Matte */}
                        {f.id === "matte" && (
                          <div className="absolute inset-0 bg-stone-950/15 mix-blend-soft-light" />
                        )}

                        {isSelected && (
                          <div className="bg-slate-950/80 rounded-full p-0.5 text-amber-400 z-10">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>

                      <span className="text-[11px] font-bold leading-tight">{f.shortLabel}</span>
                      <span className="text-[9px] font-mono text-stone-500 mt-0.5">{f.badge}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Swatch Metric Details Card */}
              <div className="p-3 bg-stone-50 border border-stone-200/90 rounded-xl space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-stone-500 uppercase border-b border-stone-200 pb-1">
                  <span>Selected Swatch Properties</span>
                  <span className="text-amber-700">{activeFinish.name}</span>
                </div>
                <p className="text-[11px] leading-snug">{activeFinish.desc}</p>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] font-mono">
                  <div>
                    <span className="text-stone-400 block">Thermal Grade</span>
                    <span className="font-bold text-stone-800">{activeFinish.thermalRating.split(" ")[0]} Rating</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Scratch Resistance</span>
                    <span className="font-bold text-emerald-700">{activeFinish.scratchRating.split(" ")[0]} Grade</span>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3: Profile Architecture */}
            <div className="bg-white border border-stone-200 rounded-3xl p-5 text-left shadow-lg">
              <h3 className="font-sans font-extrabold text-stone-900 text-sm sm:text-base mb-1 flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                <span>3. Select Profile Architecture</span>
              </h3>
              <p className="text-xs text-stone-500 mb-2.5">
                Toggle profile geometry from the mill:
              </p>

              <div className="space-y-2">
                {profiles.map((p) => {
                  const isSelected = activeProfile.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveProfile(p)}
                      className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between cursor-pointer select-none transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/70 text-blue-800 font-bold shadow-xs"
                          : "border-stone-150 hover:border-stone-300 bg-white text-stone-700"
                      }`}
                    >
                      <div className="text-left pr-2">
                        <p className={`text-xs font-bold ${isSelected ? "text-blue-800" : "text-stone-800"}`}>
                          {p.name}
                        </p>
                        <p className="text-[10px] text-stone-500 font-medium leading-normal mt-0.5 truncate max-w-[260px]">
                          {p.desc}
                        </p>
                      </div>
                      <span
                        className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "border-blue-500 bg-blue-600" : "border-stone-300 bg-white"
                        }`}
                      >
                        {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 4: Framework Sub-Structure */}
            <div className="bg-white border border-stone-200 rounded-3xl p-5 text-left shadow-lg">
              <h3 className="font-sans font-extrabold text-stone-900 text-sm sm:text-base mb-1 flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                <span>4. Structural Framework</span>
              </h3>

              <div className="grid grid-cols-2 gap-2.5 mt-2">
                {frameworks.map((f) => {
                  const isSelected = activeFramework.id === f.id;
                  const Icon = f.icon;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActiveFramework(f)}
                      className={`text-left p-3 rounded-xl border flex flex-col justify-between cursor-pointer select-none transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/70 text-blue-800 shadow-xs"
                          : "border-stone-150 hover:border-stone-300 bg-white text-stone-700"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isSelected ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-stone-50 text-stone-500 border border-stone-200"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <p className={`text-xs font-bold leading-tight ${isSelected ? "text-blue-800 font-black" : "text-stone-850"}`}>
                          {f.id === "carpentry" ? "Timber Woodwork" : "Steel Trusses"}
                        </p>
                      </div>

                      <span className="inline-block mt-2 text-[9px] bg-stone-50 border border-stone-200 text-stone-600 px-1.5 py-0.5 rounded leading-none font-bold truncate">
                        {f.badge.split(" ")[0]} Grade
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Informational Consultation Prompt */}
        <div className="mt-12 bg-blue-50 p-6 rounded-2xl border border-blue-200 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
          <div>
            <p className="font-sans font-bold text-sm text-stone-900">Want physical panel swatches delivered or on-site color matching?</p>
            <p className="text-xs text-stone-600 mt-1">
              Visit our Accra Central Warehouse or schedule an engineer to bring physical sample metal swatches directly to your site.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("consultation");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-5 py-3 hover:bg-blue-700 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer select-none shrink-0"
          >
            Schedule Free Inspection
          </button>
        </div>

      </div>
    </section>
  );
}
