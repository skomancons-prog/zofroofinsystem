import React, { useState } from "react";
import waterproofingImg from "../assets/images/premium_waterproofing_1782227491989.jpg";
import { 
  ShieldCheck, 
  Sparkles, 
  Wind, 
  Sun, 
  ArrowRight, 
  CloudLightning, 
  Award, 
  HelpCircle, 
  CheckCircle, 
  Layers,
  ThermometerSnowflake,
  Flame,
  Wrench
} from "lucide-react";

interface EliteFeatureItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: "shield" | "sparkles" | "wind" | "sun" | "layers" | "storm" | "warranty";
  imageUrl: string;
  localRelevance: string;
  specs: string[];
}

const ELITE_FEATURES: EliteFeatureItem[] = [
  {
    id: "lock-neat",
    badge: "Compound Defense",
    title: 'The "Spotless Compound" Guarantee',
    subtitle: "Zero nails, metal clippings, or wood splinter debris left behind.",
    description: "Inspired by global 'No-Mess' roofing benchmarks, we utilize customized high-reaching debris catchments and roofline-to-bin chutes. We ensure your gorgeous garden, premium courtyard pavers, and driveways are 100% protected and clean during tear-down and carpentry.",
    iconName: "sparkles",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop",
    localRelevance: "Critical for Ghanaian homes with pristine landscaped lawns, children's play yards, or expensive imported tile compound floors.",
    specs: [
      "Magnetic magnetic bar sweeps to clear stray nails",
      "Surgical roofline debris-collection chutes",
      "Full shrub and flowerbed canopy protective shields"
    ]
  },
  {
    id: "tpo-flat",
    badge: "Concrete Proofing",
    title: "Advanced Low-Slope TPO Membranes",
    subtitle: "Absolute water barrier seals for concrete roofs and overhead balconies.",
    description: "Flat solar slabs and concrete roof decks are notorious for leakage paths in tropical storms. We bring extreme weather-grade heat-welded Thermoplastic Polyolefin (TPO) single-ply membranes. This commercial-grade material resists pooling water, root puncture, and blistering solar UV heat.",
    iconName: "layers",
    imageUrl: waterproofingImg,
    localRelevance: "Eliminates constant patching and room moisture rot beneath exterior balconies and flat top-floor deck lines common in sleek Accra builds.",
    specs: [
      "Ultra-thick heat-fused seam joints",
      "UV-reflective cool-surface properties",
      "Resistant to tropical stagnant storm waters"
    ]
  },
  {
    id: "attic",
    badge: "Thermal Control",
    title: "Attic Heat Barriers & Ventilation",
    subtitle: "Transform your roof from an oven to a cooling structural envelope.",
    description: "Standard West African roof designs trap hot air in attic crawlspaces, radiating heat downward and driving up air conditioning power consumption. We engineer advanced radiant foil sheets, dual ridge-vent exhausts, and silent crawlspace solar-fans.",
    iconName: "wind",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
    localRelevance: "Cuts bedroom indoor heat index significantly and saves up to 35% on monthly electricity and central cooling bills.",
    specs: [
      "Heavy-duty double-sided radiant barrier foils",
      "Automated solar-powered exhaust louvers",
      "Venting systems pre-fitted inside woodwork soffits"
    ]
  },
  {
    id: "skylight",
    badge: "Daylighting",
    title: "Leak-Free Custom Skylights",
    subtitle: "Pristine natural daylighting channeled deep into interior living grids.",
    description: "Instantly visually elevate your master lounge, lobby, or custom kitchen. We install architectural impact-resistant polycarbonate skylights and natural light tunnels. Every single fit is paired with robust multi-layer flashing and high-elastic butyl seal barriers.",
    iconName: "sun",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop",
    localRelevance: "Reduces dependence on local light fixtures during daily daylight hours, creating stunning visual luxury and spatial depth.",
    specs: [
      "High-velocity wind and timber impact rating",
      "Double-sealed water diverter saddle collars",
      "Thermal UV coating blocking 99% of sun fade"
    ]
  },
  {
    id: "storm",
    badge: "Emergency Care",
    title: "Storm Action Triage & Urgent Repair",
    subtitle: "Fast-response tarping and emergency restoration after tropical wind damages.",
    description: "Ghana's seasonal change storms bring high wind velocity, falling tree branches, and heavy sheet displacements. Our rapid emergency response crew deploys within hours to execute quick tarping, prevent structural rot, and secure your belongings before raw rain does.",
    iconName: "storm",
    imageUrl: waterproofingImg,
    localRelevance: "A supportive lifeline for diaspora owners who need immediate action to preserve their unattended building investments in Ghana.",
    specs: [
      "24/7 Priority Emergency phone hotline",
      "Immediate non-destructive heavy canvas tarping",
      "Structural safety evaluations with video logs"
    ]
  },
  {
    id: "warranty",
    badge: "Ultimate Assurance",
    title: "Golden Shield Lifetime Warranty",
    subtitle: "Non-prorated, fully transferable coverage backed by Zof factory certification.",
    description: "We don't play word games. While local stores offer limited warranties on materials only (leaving you to pay for expensive labor when issues spark), our Golden Shield covers 100% of sheets, structural wood trusses, joint hardware AND manual carpentry labor.",
    iconName: "warranty",
    imageUrl: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=600&auto=format&fit=crop",
    localRelevance: "Fully transferable to future buyers if you sell the property, increasing your overall real estate equity and resale value.",
    specs: [
      "Full coverage for both materials and labor costs",
      "Non-prorated (value never declines over time)",
      "Registered written warranty certificate issued"
    ]
  }
];

export function EliteFeatures() {
  const [selectedFeature, setSelectedFeature] = useState<string>("lock-neat");

  const currentFeature = ELITE_FEATURES.find(f => f.id === selectedFeature) || ELITE_FEATURES[0];

  return (
    <section id="elite-standards" className="py-24 bg-[#F3E5C8] text-stone-850 border-t border-stone-200/80 scroll-mt-24 relative overflow-hidden">
      {/* Structural ambient details */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div className="text-left max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 text-blue-700 font-mono text-[9px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full mb-4">
              <ShieldCheck className="h-4.5 w-4.5 text-blue-600" />
              <span>Arry's Inspired Premium Benchmarks</span>
            </div>
            
            <h2 className="font-sans font-black text-3xl sm:text-4xl lg:text-5xl text-stone-900 tracking-tight leading-none">
              Elite Engineering. <br />
              <span className="text-blue-600 bg-gradient-to-r from-blue-700 to-blue-550 bg-clip-text text-transparent">Golden Craft Standards.</span>
            </h2>
            
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mt-4 max-w-2xl">
              Borrowing the finest installation security guidelines, compound armor protection, and non-prorated warranties from legendary American systems to redefine structural roofing in West Africa.
            </p>
          </div>
          
          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-white border border-stone-200/80 rounded-xl p-4 text-left shadow-xs hidden sm:block">
              <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-wider block">
                ZOF FACTORY STATUS
              </span>
              <span className="font-sans font-black text-xl text-stone-900 leading-none mt-1 block">
                Top Tier Certified
              </span>
              <p className="text-[10px] text-stone-500 mt-1 max-w-[200px] leading-snug">
                Fully trained crew matching international building protocols.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Grid Spotlight Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Menu Selection (Left Column) */}
          <div className="lg:col-span-5 space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold mb-2 pl-1 text-left">
              Advanced Engineering Portfolios:
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              {ELITE_FEATURES.map((feat) => {
                const isActive = feat.id === selectedFeature;
                return (
                  <button
                    key={feat.id}
                    onClick={() => setSelectedFeature(feat.id)}
                    className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                      isActive 
                        ? "bg-blue-50/70 border-blue-500 text-stone-900 shadow-md translate-x-1" 
                        : "bg-white border-stone-200 hover:bg-stone-50 text-stone-700"
                    }`}
                  >
                    {/* Visual Icon Box */}
                    <div className={`p-2 rounded-lg shrink-0 ${isActive ? "bg-blue-600 text-white" : "bg-stone-50 border border-stone-205 text-stone-500"}`}>
                      {feat.iconName === "sparkles" && <Sparkles className="h-4.5 w-4.5" />}
                      {feat.iconName === "layers" && <Layers className="h-4.5 w-4.5" />}
                      {feat.iconName === "wind" && <Wind className="h-4.5 w-4.5" />}
                      {feat.iconName === "sun" && <Sun className="h-4.5 w-4.5" />}
                      {feat.iconName === "storm" && <CloudLightning className="h-4.5 w-4.5" />}
                      {feat.iconName === "warranty" && <Award className="h-4.5 w-4.5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-sans font-bold text-sm tracking-tight text-stone-900 leading-none">
                          {feat.title}
                        </h3>
                        <span className={`text-[8px] font-mono uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                          isActive 
                            ? "bg-blue-100/60 text-blue-800 border border-blue-200/50 font-bold" 
                            : "bg-stone-50 text-stone-500 border border-stone-150"
                        }`}>
                          {feat.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1 lines-clamp-1 truncate">
                        {feat.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Large Screen Spotlight Display (Right Column) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 flex flex-col justify-between space-y-6 text-left relative overflow-hidden shadow-lg">
            
            {/* Visual Header Detail */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-stretch">
              
              {/* Feature Image Frame */}
              <div className="w-full sm:w-[38%] rounded-xl overflow-hidden aspect-video sm:aspect-auto relative border border-stone-150 shadow-xs shrink-0">
                <img 
                  src={currentFeature.imageUrl} 
                  alt={currentFeature.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/20 to-transparent" />
              </div>

              {/* Dynamic explanations */}
              <div className="flex-1 space-y-3.5">
                <span className="font-mono text-[9px] uppercase tracking-widest text-amber-700 font-extrabold bg-amber-55 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                  Spotlight Element
                </span>
                
                <h3 className="font-sans font-black text-xl sm:text-2xl text-stone-900 tracking-tight leading-tight">
                  {currentFeature.title}
                </h3>
                
                <p className="text-xs text-stone-500 leading-relaxed font-sans italic">
                  "{currentFeature.subtitle}"
                </p>
                
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {currentFeature.description}
                </p>
              </div>

            </div>

            {/* Checklist of Specs in White style with extreme luxury colors */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-stretch bg-stone-50 p-4 rounded-xl border border-stone-200">
              
              <div className="sm:col-span-7 space-y-2.5">
                <p className="text-[9px] font-mono text-stone-500 uppercase tracking-widest leading-none font-bold">
                  Certified Standards we employ:
                </p>
                <div className="space-y-1.5">
                  {currentFeature.specs.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-stone-800">
                      <div className="h-1 py-1 rounded-full bg-blue-600 shrink-0 w-2" />
                      <span className="font-sans text-xs font-bold tracking-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-5 bg-blue-50 border border-blue-100 p-3 rounded-lg flex flex-col justify-center">
                <p className="text-[8px] font-mono text-blue-700 font-black uppercase tracking-wider">
                  🤝 Ghanaian Environmental Relevance:
                </p>
                <p className="text-[10px] text-stone-600 mt-1 leading-relaxed">
                  {currentFeature.localRelevance}
                </p>
              </div>

            </div>

            {/* Interaction Action triggers */}
            <div className="pt-4 border-t border-stone-205 border-stone-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="h-5 w-5 text-emerald-605 text-emerald-600 shrink-0" />
                <span className="font-sans text-[11px] font-bold text-stone-500">
                  Matches Arry's Florida Premium Shield safety codes.
                </span>
              </div>

              <a
                href="#consultation"
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-sans text-xs font-bold rounded-lg transition-all text-center flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Request Certified Consultation</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
