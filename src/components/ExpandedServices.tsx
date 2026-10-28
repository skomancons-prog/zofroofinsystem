import React, { useState } from "react";
import renovationImg from "../assets/images/beautiful_renovation_extension_1782231175276.jpg";
import metalFabImg from "../assets/images/zof_metal_fab_accessories_1782225925551.jpg";
import solarFarmImg from "../assets/images/zof_solar_farm_integration_1782227056149.jpg";
import waterproofingImg from "../assets/images/premium_waterproofing_1782227491989.jpg";
import paintingImg from "../assets/images/premium_exterior_painting_1782227719269.jpg";
import { Gallery } from "./Gallery";
import { MaintenanceTutorialVideoSection } from "./MaintenanceTutorialVideoSection";
import { 
  Home, 
  Wrench, 
  Layers, 
  Sun, 
  Hammer, 
  Paintbrush, 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Package,
  Cpu,
  BadgeAlert
} from "lucide-react";

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  imageUrl: string;
  services: string[];
  smartBenefit: string;
  hotMarket?: boolean;
}

const EXPANDED_SERVICES: ServiceItem[] = [
  {
    id: "ceiling",
    title: "Ceiling & Interior Finishing",
    shortDesc: "Every premium roofing client needs premium interior ceilings.",
    longDesc: "Instead of dealing with separate sub-contractors, we handle your project end-to-end. We design and install high-grade plasterboards, POP work, and durable moisture-proof PVC paneling for complete ceiling systems that match your new roof's structural layout.",
    imageUrl: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=600&auto=format&fit=crop",
    services: [
      "Plaster of Paris (POP) Artistry Ceilings",
      "Gypsum Board Architectural Inlays",
      "Anti-Sag PVC Ceilings & Lighting Channels"
    ],
    smartBenefit: "Ensures no interior molding or warping should extreme humidity changes occur, while establishing flawless light-pocket design."
  },
  {
    id: "waterproofing",
    title: "Waterproofing & Leak Repair",
    shortDesc: "Comprehensive damp-proofing and leak blocking for existing roofs.",
    longDesc: "High torrential monsoon storms in Accra, Kumasi, and Tema cause masonry rot. Our specialized team handles surgical repairs, seals micro-fissures in flat concrete decks, and installs high-build elastomeric protection layers.",
    imageUrl: waterproofingImg,
    services: [
      "Seamless Elastomeric Flat Concrete Sealing",
      "High-build Anti-Damp Wall Barrier Spraying",
      "Emergency Pitch Leak & Loose Fastener Renovation"
    ],
    smartBenefit: "Saves structural trusses from rot. Provides fast, highly cost-effective maintenance instead of complete rebuilding."
  },
  {
    id: "metal-fab",
    title: "Metal Fabrication & Accessories",
    shortDesc: "Custom built-in drainage channels roll-formed strictly on-site.",
    longDesc: "We do not buy cheap pre-made drainage channels that sag and leak. We fabricate heavy-gauge downpipes, customized valley flashings, and seamless rainwater gutters to match your specific roof profile perfectly on-site.",
    imageUrl: metalFabImg,
    services: [
      "Roll-formed Seamless Aluminium Gutters",
      "Heavy-Gauge Custom Angle Flashings & Ridges",
      "Weather-sealed Downpipe Outlets"
    ],
    smartBenefit: "Saves budget by bypassing retail markups. Tailor-fit accessories guarantee a 100% rust-free drainage system."
  },
  {
    id: "solar",
    title: "Solar Panel Installation Integration",
    shortDesc: "Harness the rich West African sun directly on your roof lines.",
    longDesc: "As direct roofing contractors, we are uniquely structured to install solar arrays. We preserve your roof's warranty and lock down bracket sealants perfectly to avoid leaks. We package solar configurations solving Ghanaian power grid challenges.",
    imageUrl: solarFarmImg,
    services: [
      "Bracket Mount Penetration-free Fastening",
      "Off-grid and Hybrid Power Prep Packages",
      "Preloaded Dual Roof & Solar Combined Warranties"
    ],
    smartBenefit: "Saves thousands of Cedis in electricity bills and limits grid dependence during structural maintenance cycles.",
    hotMarket: true
  },
  {
    id: "materials",
    title: "Premium Materials Supply Division",
    shortDesc: "Direct factory pricing on first-class roofing sheets and timber.",
    longDesc: "We supply our high-quality selflock profiles, aluzinc sheets, cured woodwork, insulation layers, and hardware directly to builders. Buy directly from our Accra inventory to secure builder rates for all regional hardware sites.",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop",
    services: [
      "Direct-sale Aluzinc, Plain Aluminium & Selflock sheeting",
      "Anti-termite Treated Structural Sawn Timber Logs",
      "High-density Solar-Reflective Thermal Insulation Rolls"
    ],
    smartBenefit: "Guarantees genuine factory gauge thickness (never undersized) and eliminates retail middleman inflation."
  },
  {
    id: "painting",
    title: "Painting & Exterior UV Coatings",
    shortDesc: "Protect your outer walls from heavy elements and salt air.",
    longDesc: "Our high-durability acrylic exterior systems resist blistering, torrential moisture, and ultraviolet rays. We color-coordinate walls to complement your Manor Red or Deep Ocean Blue roofing sheets for pristine architectural beauty.",
    imageUrl: paintingImg,
    services: [
      "Pro-Coat Roof Spray Re-conditioning",
      "Coastal Weather-shield Painting Solutions",
      "Decorative Architectural Moulding Colorants"
    ],
    smartBenefit: "Combats coastal salt-spray erosion beautifully and maintains pristine curb appeal year after year."
  },
  {
    id: "renovation",
    title: "Small Renovations & Building Extensions",
    shortDesc: "From custom terrace layouts to master bedroom expansions.",
    longDesc: "Have a home that needs vertical elevation or an annex added? Since we already coordinate with master masons and carpenters, we seamlessly construct building extensions and structural renovations without disrupting your home setup.",
    imageUrl: renovationImg,
    services: [
      "Terrace Layout & Porch Extensions",
      "Vertical Structural Elevation Frameworks",
      "Complete Room Additions & Storey Repairs"
    ],
    smartBenefit: "Eliminates the complexity of hiring multiple unvetted contractors with unpredictable structural coordination issues."
  }
];

interface ExpandedServicesProps {
  onSelectProjectForEstimate?: (projectTitle: string) => void;
  onScrollToConsultation?: () => void;
}

export function ExpandedServices({ onSelectProjectForEstimate, onScrollToConsultation }: ExpandedServicesProps = {}) {
  const [activeService, setActiveService] = useState<string>("ceiling");
  const [selectedComboServices, setSelectedComboServices] = useState<string[]>(["roofing", "ceiling", "waterproofing", "painting"]);

  const currentServiceDetails = EXPANDED_SERVICES.find(s => s.id === activeService) || EXPANDED_SERVICES[0];

  const toggleComboService = (svc: string) => {
    if (selectedComboServices.includes(svc)) {
      if (selectedComboServices.length > 1) {
        setSelectedComboServices(selectedComboServices.filter(s => s !== svc));
      }
    } else {
      setSelectedComboServices([...selectedComboServices, svc]);
    }
  };

  // Dynamic estimate benefits for combos
  const getComboPackageMetrics = () => {
    const counts = selectedComboServices.length;
    let savings = "0%";
    let duration = "No Package Selected";
    let warranty = "10 Years Standard";
    let label = "Basic Scope";

    if (counts === 4) {
      savings = "15% Full Bundle Discount";
      duration = "Unified 8-12 Day Schedule";
      warranty = "50-Year Combined Integrity Guarantee";
      label = "🔥 ZOF Smart Combo Model (Highly Recommended)";
    } else if (counts === 3) {
      savings = "10% Trio Discount";
      duration = "6-9 Day Coordinated Work";
      warranty = "35-Year Comprehensive Warranty";
      label = "Premium Triple Pack";
    } else if (counts === 2) {
      savings = "5% Duo Discount";
      duration = "4-7 Day Combined Work";
      warranty = "25-Year Protection Scope";
      label = "Coordinated Duo";
    } else {
      savings = "0% (Standard Rates apply)";
      duration = "Varies by individual schedule";
      warranty = "Standard Product Warranty";
      label = "A-La-Carte Select";
    }

    return { savings, duration, warranty, label };
  };

  const comboMetrics = getComboPackageMetrics();

  return (
    <>
      <section id="specialty-services" className="py-24 bg-[#F3E5C8] border-b border-stone-200 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-left max-w-3xl mb-16">
          <div className="inline-flex items-center space-x-2.5 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-xs text-blue-700 select-none font-semibold mb-4">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="font-mono uppercase tracking-wider text-blue-700">Beyond Standard Roofing Services</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-stone-900 tracking-tight leading-none mb-4">
            Full Top-to-Interior <br className="hidden sm:inline" />
            <span className="text-blue-605 bg-gradient-to-r from-blue-700 to-blue-605 bg-clip-text text-transparent">Finishing Contractor</span>
          </h2>
          <p className="text-stone-605 text-stone-600 text-sm sm:text-base leading-relaxed">
            Why coordinate with multiple unverified local vendors when ZOF combines master roofing, architectural timber carpentry, POP interior ceiling design, rustproofing, and weather-defending paint into one seamless, stress-free delivery package?
          </p>
        </div>

        {/* 7 Services Tabs + Interactive Spotlight Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-24">
          
          {/* Navigation Sidebar List */}
          <div className="lg:col-span-4 space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold mb-3 pl-2">
              Available Supplementary Services:
            </p>
            <div className="flex overflow-x-auto lg:flex-col pb-4 lg:pb-0 gap-1.5 scrollbar-thin">
              {EXPANDED_SERVICES.map((svc) => {
                const isActive = svc.id === activeService;
                return (
                  <button
                    key={svc.id}
                    onClick={() => setActiveService(svc.id)}
                    className={`flex items-center space-x-3 text-left w-full px-4 py-3.5 rounded-xl border transition-all shrink-0 cursor-pointer ${
                      isActive 
                        ? "bg-blue-50 border-blue-500 text-stone-900 shadow-md"
                        : "bg-white hover:bg-stone-50 border-stone-200 text-stone-700"
                    }`}
                  >
                    {/* Unique service icons */}
                    <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? "bg-blue-600 text-white" : "bg-stone-50 border border-stone-200 text-stone-500"}`}>
                      {svc.id === "ceiling" && <Layers className="h-4 w-4" />}
                      {svc.id === "waterproofing" && <Wrench className="h-4 w-4" />}
                      {svc.id === "metal-fab" && <Hammer className="h-4 w-4" />}
                      {svc.id === "solar" && <Sun className="h-4 w-4" />}
                      {svc.id === "materials" && <Package className="h-4 w-4" />}
                      {svc.id === "painting" && <Paintbrush className="h-4 w-4" />}
                      {svc.id === "renovation" && <Home className="h-4 w-4" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-sans font-bold text-xs sm:text-sm tracking-tight truncate leading-none">
                          {svc.title}
                        </span>
                        {svc.hotMarket && (
                          <span className="text-[8px] bg-red-500 font-bold text-white px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse shrink-0">
                            HOT ⚡
                          </span>
                        )}
                      </div>
                      <p className={`text-[10px] mt-0.5 truncate ${isActive ? "text-stone-600" : "text-stone-500"}`}>
                        {svc.shortDesc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-150 rounded-xl text-left hidden lg:block">
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-stone-900 font-sans">Complete Interior Transition</h4>
                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                    By partnering with ZOF, your ceiling frames are engineered in perfect vertical alignment with the roof trusses, eliminating moisture build-up and sagging forever.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Spotlight Content Frame */}
          <div className="lg:col-span-8 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-stretch justify-between relative overflow-hidden text-left shadow-lg">
            
            {/* Visual Photo Block */}
            <div className="w-full md:w-[42%] flex flex-col relative shrink-0">
              <div className="relative flex-1 rounded-2xl overflow-hidden aspect-video md:aspect-auto border border-stone-150 shadow-xs">
                <img 
                  src={currentServiceDetails.imageUrl} 
                  alt={currentServiceDetails.title}
                  className="w-full h-full object-cover select-none opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/20 via-transparent to-transparent" />
              </div>
              <div className="mt-3 text-stone-500 flex items-center space-x-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                <span className="font-sans text-[10px] font-bold uppercase tracking-wider">Accra Region Verified Service</span>
              </div>
            </div>

            {/* Content Specifications list */}
            <div className="flex-1 flex flex-col justify-between space-y-6">
              
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-blue-700 font-extrabold bg-blue-50 border border-blue-150 px-2.5 py-1 rounded-md">
                  Active Highlight Scope
                </span>
                <h3 className="font-sans font-black text-xl sm:text-2xl text-stone-900 tracking-tight mt-3">
                  {currentServiceDetails.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  {currentServiceDetails.longDesc}
                </p>
              </div>

              {/* Sub Services bullet loops */}
              <div className="space-y-2.5 bg-stone-50 p-4 rounded-xl border border-stone-150">
                <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest leading-none font-bold">
                  What we execute:
                </p>
                <div className="space-y-1.5">
                  {currentServiceDetails.services.map((subItem, sIdx) => (
                    <div key={sIdx} className="flex items-center space-x-2 text-stone-850">
                      <div className="h-1.5 w-1.5 bg-blue-600 rounded-full shrink-0" />
                      <span className="font-sans text-xs font-semibold tracking-tight text-stone-800">{subItem}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Smart Benefit bottom banner */}
              <div className="pt-4 border-t border-stone-200">
                <div className="flex items-start space-x-2.5">
                  <div className="h-5 w-5 rounded-full bg-emerald-50 border border-emerald-250 flex items-center justify-center p-0.5 shrink-0">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <h5 className="font-sans font-extrabold text-xs text-stone-900 uppercase tracking-wide">Integrated Advantage:</h5>
                    <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                      {currentServiceDetails.smartBenefit}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Dynamic Interactive Smart Combo Section Card */}
        <div id="smart-combo-section" className="bg-gradient-to-br from-[#F3E5C8] to-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-lg relative overflow-hidden text-left text-stone-850">
          
          {/* Glowing particle shadows */}
          <div className="absolute -top-12 -left-12 h-44 w-44 rounded-full bg-blue-400/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-amber-400/5 blur-3xl pointer-events-none" />

          {/* Strategic content wrapper */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Combo Explanation Copy */}
            <div className="lg:col-span-6 space-y-5">
              
              <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-700 font-mono text-[9px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full animate-bounce">
                🔑 Smart Combo Business Model
              </div>

              <h3 className="font-sans font-black text-2xl sm:text-3xl text-stone-900 tracking-tight leading-tight">
                Don't Buy Services Separately.<br />
                <span className="text-amber-650 text-amber-600">Combine & Protect Your Build!</span>
              </h3>

              <p className="text-stone-650 text-stone-600 text-xs sm:text-sm leading-relaxed font-sans">
                By integrating your <strong>Roofing, Ceiling, Waterproofing, and Painting</strong> under Zof, we coordinate structural wood moisture boundaries, seal outer brick blockworks, spray elastic protective coat layers, and map aesthetic interiors concurrently. No scheduling lag, zero vendor overlap mistakes, and extreme budget control.
              </p>

              {/* Four pillars checklist loop */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-50 p-1 rounded-lg border border-blue-200 text-blue-600">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-sans text-xs font-bold text-stone-800">1. Premium Roofing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-amber-50 p-1 rounded-lg border border-amber-250 text-amber-600">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-sans text-xs font-bold text-stone-800">2. Master POP Ceiling</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-emerald-50 p-1 rounded-lg border border-emerald-250 text-emerald-600">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-sans text-xs font-bold text-stone-800">3. Waterproofing Specialist</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-pink-50 p-1 rounded-lg border border-pink-250 text-pink-650 text-pink-600">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-sans text-xs font-bold text-stone-800">4. UV Weather painting</span>
                </div>
              </div>

            </div>

            {/* Smart Interactive Selector Planner */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-md">
              
              <h4 className="font-sans font-black text-sm text-stone-900 tracking-tight mb-4 flex items-center justify-between">
                <span>Interactive Combo Planner</span>
                <span className="text-[10px] font-mono text-stone-500 font-bold">Pick any combination</span>
              </h4>

              {/* Dynamic checklist interface */}
              <div className="space-y-3">
                
                {/* 1. Roofing (locked/recommended) */}
                <button
                  type="button"
                  onClick={() => toggleComboService("roofing")}
                  className={`flex items-center justify-between w-full p-3 rounded-xl border text-left transition-all ${
                    selectedComboServices.includes("roofing")
                      ? "bg-blue-50/50 border-blue-300 text-stone-900 shadow-xs"
                      : "bg-stone-50/40 border-stone-200 text-stone-500"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${selectedComboServices.includes("roofing") ? "bg-blue-600 border-blue-600 text-white" : "border-stone-300"}`}>
                      {selectedComboServices.includes("roofing") && <span className="text-[9px] font-bold">✓</span>}
                    </div>
                    <div>
                      <p className="font-sans text-xs font-extrabold leading-tight text-stone-905 text-stone-900">01. Heavy Slopes Sheeting & Woodwork</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Classic step tiles, IBR or Selflock layout</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-amber-700 font-bold tracking-tight whitespace-nowrap">Baseline Core</span>
                </button>

                {/* 2. Ceiling */}
                <button
                  type="button"
                  onClick={() => toggleComboService("ceiling")}
                  className={`flex items-center justify-between w-full p-3 rounded-xl border text-left transition-all ${
                    selectedComboServices.includes("ceiling")
                      ? "bg-blue-50/50 border-blue-300 text-stone-900 shadow-xs"
                      : "bg-stone-50/40 border-stone-200 text-stone-500"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${selectedComboServices.includes("ceiling") ? "bg-blue-600 border-blue-600 text-white" : "border-stone-300"}`}>
                      {selectedComboServices.includes("ceiling") && <span className="text-[9px] font-bold">✓</span>}
                    </div>
                    <div>
                      <p className="font-sans text-xs font-extrabold leading-tight text-stone-900">02. Ceiling & Interior Board Gypsum</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Moisture barrier, custom lighting pockets</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-blue-600 shrink-0">+ Add-on</span>
                </button>

                {/* 3. Waterproofing */}
                <button
                  type="button"
                  onClick={() => toggleComboService("waterproofing")}
                  className={`flex items-center justify-between w-full p-3 rounded-xl border text-left transition-all ${
                    selectedComboServices.includes("waterproofing")
                      ? "bg-blue-50/50 border-blue-300 text-stone-900 shadow-xs"
                      : "bg-stone-50/40 border-stone-200 text-stone-500"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${selectedComboServices.includes("waterproofing") ? "bg-blue-600 border-blue-600 text-white" : "border-stone-300"}`}>
                      {selectedComboServices.includes("waterproofing") && <span className="text-[9px] font-bold">✓</span>}
                    </div>
                    <div>
                      <p className="font-sans text-xs font-extrabold leading-tight text-stone-900 font-bold">03. Waterproofing & Damp-Proof Specialist</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Flat deck resin, sealing structural joint edges & leaks</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-blue-600 shrink-0">+ Add-on</span>
                </button>

                {/* 4. Painting */}
                <button
                  type="button"
                  onClick={() => toggleComboService("painting")}
                  className={`flex items-center justify-between w-full p-3 rounded-xl border text-left transition-all ${
                    selectedComboServices.includes("painting")
                      ? "bg-blue-50/50 border-blue-300 text-stone-900 shadow-xs"
                      : "bg-stone-50/40 border-stone-200 text-stone-500"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${selectedComboServices.includes("painting") ? "bg-blue-600 border-blue-600 text-white" : "border-stone-300"}`}>
                      {selectedComboServices.includes("painting") && <span className="text-[9px] font-bold">✓</span>}
                    </div>
                    <div>
                      <p className="font-sans text-xs font-extrabold leading-tight text-stone-900">04. Coating & Painting Weather Protection</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Salt air defense, decorative acrylic styling matches</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-blue-600 shrink-0">+ Add-on</span>
                </button>

              </div>

              {/* Combo Metrics Dynamic Panel */}
              <div className="mt-6 pt-5 border-t border-stone-200 space-y-4">
                
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between shadow-xs">
                  <div>
                    <p className="text-[9px] font-mono text-stone-500 uppercase tracking-wider font-bold">
                      Combo Configuration level
                    </p>
                    <p className="font-sans text-xs font-extrabold text-stone-900 mt-1">
                      {comboMetrics.label}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-mono text-amber-700 font-black uppercase tracking-wide">
                      Total Savings
                    </p>
                    <p className="font-sans text-sm font-black text-amber-600">
                      {comboMetrics.savings}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                    <p className="text-[8px] font-mono text-stone-500 uppercase tracking-widest font-bold">Coordinated Duration:</p>
                    <p className="font-sans text-[11px] font-bold text-stone-850 text-stone-700 mt-0.5">{comboMetrics.duration}</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                    <p className="text-[8px] font-mono text-stone-500 uppercase tracking-widest font-bold">Warranties Integration:</p>
                    <p className="font-sans text-[11px] font-bold text-stone-850 text-stone-700 mt-0.5">{comboMetrics.warranty}</p>
                  </div>
                </div>

                <a 
                  href="#consultation"
                  className="block w-full py-3 hover:bg-amber-600 bg-amber-500 text-slate-950 font-sans text-xs font-bold rounded-xl text-center transition-all cursor-pointer select-none border border-transparent shadow-lg shadow-amber-500/10"
                >
                  Confirm Choice in Free Inspection Request
                </a>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>

    {/* Gemini-Powered Maintenance Tutorial Video Section for Aluzinc Care */}
    <MaintenanceTutorialVideoSection />

    {/* High-Resolution Project Photo Gallery nested under Specialty Services */}
    <Gallery
      onSelectProjectForEstimate={onSelectProjectForEstimate}
      onScrollToConsultation={onScrollToConsultation}
    />
  </>
);
}
