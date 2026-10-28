/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Camera,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ArrowRight,
  Sparkles,
  Layers,
  Award,
  Check,
  Info,
  Clock,
  Users,
  Wrench,
  Timer,
  CheckSquare,
  TrendingUp,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  LayoutGrid,
  Image as ImageIcon,
  FileText,
  SlidersHorizontal,
  Sun,
  Eye,
  Building2,
  ExternalLink
} from "lucide-react";

import { ProjectCounterWidget } from "./ProjectCounterWidget";

// Local image imports
import selflockImg from "../assets/images/beautiful_selflock_sheeting_1782230951805.jpg";
import selflockFinishedImg from "../assets/images/zof_selflock_finished_1779857860154.png";
import stepTilesImg from "../assets/images/zof_steptiles_premium_1780104332914.png";
import ibrImg from "../assets/images/zof_ibr_sheets_profile_1780103574960.png";
import idtImg from "../assets/images/zof_idt_profile_spec_1780103899923.png";
import plainAluminumImg from "../assets/images/zof_plain_aluminum_spec_1780104679543.png";
import renovationImg from "../assets/images/zof_renovation_1782145271395.jpg";
import beautifulExtensionImg from "../assets/images/beautiful_renovation_extension_1782231175276.jpg";
import paintingImg from "../assets/images/premium_exterior_painting_1782227719269.jpg";
import waterproofingImg from "../assets/images/premium_waterproofing_1782227491989.jpg";
import metalAccessoriesImg from "../assets/images/zof_metal_fab_accessories_1782225925551.jpg";
import solarIntegrationImg from "../assets/images/zof_solar_farm_integration_1782227056149.jpg";
import polycarbonateImg from "../assets/images/zof_polycarbonate_spec_1780105422566.png";

export interface GalleryItem {
  id: string;
  title: string;
  category: "selflock" | "steptiles" | "ibr_idt" | "waterproofing" | "renovation" | "solar";
  categoryLabel: string;
  location: string;
  area: string;
  completionDate: string;
  profileUsed: string;
  warranty: string;
  imageUrl: string;
  aspectRatio: "aspect-[4/3]" | "aspect-[3/4]" | "aspect-square" | "aspect-[16/9]";
  description: string;
  highlights: string[];
}

export interface ExecutionPhase {
  phase: string;
  days: string;
  detail: string;
}

export interface ProjectTimelineData {
  totalDays: string;
  scaleCategory: string;
  crewCount: string;
  dailyRate: string;
  phases: ExecutionPhase[];
}

/**
 * Calculates estimated project completion timeline metrics & milestone phases based on project scale
 */
export function getProjectTimeline(item: GalleryItem): ProjectTimelineData {
  const areaNum = parseInt(item.area.replace(/,/g, ""), 10) || 4000;

  if (item.category === "waterproofing") {
    return {
      totalDays: "4 Days",
      scaleCategory: "Precision Waterproofing Deck",
      crewCount: "4 Certified Specialists",
      dailyRate: "850 sq ft / day",
      phases: [
        { phase: "Surface Blast & Primer Seal", days: "Day 1", detail: "Pressure clean, crack repair & epoxy primer" },
        { phase: "Elastomeric Base & Mesh", days: "Day 2", detail: "Polyurethane liquid membrane + geotextile layer" },
        { phase: "Secondary Coat & UV Shield", days: "Day 3", detail: "White solar heat reflective topcoat" },
        { phase: "Ponding Water Leak Test", days: "Day 4", detail: "24-hour flood audit & leak-proof certificate" }
      ]
    };
  }

  if (item.category === "renovation") {
    return {
      totalDays: "5 Days",
      scaleCategory: "Structural Roof Overhaul",
      crewCount: "6 Master Carpenters",
      dailyRate: "900 sq ft / day",
      phases: [
        { phase: "Tear-Off & Termite Seal", days: "Day 1", detail: "Strip old sheets & borate treatment on timber" },
        { phase: "Truss Leveling & Purlins", days: "Day 2-3", detail: "Replace decayed woodwork & align pitch line" },
        { phase: "Metal Sheeting Cladding", days: "Day 4", detail: "Fasten high-tensile metal profile panels" },
        { phase: "Fascia & Soffit Trim", days: "Day 5", detail: "Complete trim molding & site cleanup" }
      ]
    };
  }

  if (item.category === "solar") {
    return {
      totalDays: "3 Days",
      scaleCategory: "Specialist Solar Mounting",
      crewCount: "4 Solar Engineers",
      dailyRate: "System Fit",
      phases: [
        { phase: "Seam Survey & Mapping", days: "Day 1", detail: "Layout non-penetrating standing seam clamps" },
        { phase: "Rail & Panel Rack Mount", days: "Day 2", detail: "Torque-tightened mounting brackets" },
        { phase: "Grounding & Weather Audit", days: "Day 3", detail: "Structural vibration & zero-penetration audit" }
      ]
    };
  }

  // Scale tiers based on square footage for roof sheeting
  if (areaNum >= 15000) {
    return {
      totalDays: "14 Days",
      scaleCategory: `Industrial Hub Scale (${item.area})`,
      crewCount: "12 Master Technicians",
      dailyRate: "1,800 sq ft / day",
      phases: [
        { phase: "Heavy Truss & Purlins", days: "Day 1-3", detail: "Steel framework alignment & safety netting" },
        { phase: "High-Span Panel Cladding", days: "Day 4-8", detail: "Continuous roll-formed profile installation" },
        { phase: "Skylights & Ridge Caps", days: "Day 9-11", detail: "Polycarbonate daylight inserts & ridge caps" },
        { phase: "Gutters & Handover Audit", days: "Day 12-14", detail: "High-discharge guttering & rain flood test" }
      ]
    };
  } else if (areaNum >= 6500) {
    return {
      totalDays: "7 Days",
      scaleCategory: `Large Villa Scale (${item.area})`,
      crewCount: "8 Master Roofers",
      dailyRate: "1,000 sq ft / day",
      phases: [
        { phase: "Timber Truss Framing", days: "Day 1-2", detail: "Precision carpentry & vapor barrier membrane" },
        { phase: "On-Site Roll-Forming", days: "Day 3-4", detail: "Concealed fastener panel interlocking" },
        { phase: "Flashings & Aprons", days: "Day 5-6", detail: "Valleys, wall aprons & barge board fitting" },
        { phase: "Water Hose Test & QC", days: "Day 7", detail: "Torrential rain simulator hose test" }
      ]
    };
  } else {
    return {
      totalDays: "5 Days",
      scaleCategory: `Residential Scale (${item.area})`,
      crewCount: "5 Roof Specialists",
      dailyRate: "1,000 sq ft / day",
      phases: [
        { phase: "Framework Prep & Membrane", days: "Day 1", detail: "Purlin spacing check & vapor membrane" },
        { phase: "Sheet Profile Laying", days: "Day 2-3", detail: "Precision aligned metal panel installation" },
        { phase: "Ridge Caps & Edges", days: "Day 4", detail: "Ridge caps, hip caps & valley flashings" },
        { phase: "Quality Signoff & Clean", days: "Day 5", detail: "Fastener seal check & site cleanup" }
      ]
    };
  }
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Selflock® Concealed Fastener Villa",
    category: "selflock",
    categoryLabel: "Selflock® System",
    location: "East Legon, Accra",
    area: "6,800 sq ft",
    completionDate: "January 2026",
    profileUsed: "0.50mm Aluzinc Selflock® Charcoal",
    warranty: "50-Year Watertight Guarantee",
    imageUrl: selflockImg,
    aspectRatio: "aspect-[4/3]",
    description: "An architectural masterpiece in East Legon featuring complete timber truss carpentry and interlocking Selflock® panels. Zero exposed nails eliminate potential points of leakage, ensuring long-term resilience against torrential rain.",
    highlights: [
      "100% concealed fasteners prevent nail rust",
      "Engineered high-wind uplift resistance",
      "Integrated seamless aluminium gutters",
      "Remote diaspora project camera verification"
    ]
  },
  {
    id: "gal-2",
    title: "Mediterranean Step Tiles Luxury Residence",
    category: "steptiles",
    categoryLabel: "Step Tiles Villa",
    location: "Airport Hills, Accra",
    area: "5,200 sq ft",
    completionDate: "December 2025",
    profileUsed: "Step Tiles Woodland Gray Coated Alloy",
    warranty: "50-Year Architectural Rating",
    imageUrl: stepTilesImg,
    aspectRatio: "aspect-[3/4]",
    description: "Elegant step tile metal profile crafted to replicate classic clay tile Aesthetics while providing modern lightweight steel strength and thermal performance under intense tropical sunshine.",
    highlights: [
      "Sublime curbside appeal with deep step profiles",
      "Lightweight structure reduces timber load",
      "Anti-algae protective glaze coating",
      "Seamless ridge cap and valley fitting"
    ]
  },
  {
    id: "gal-3",
    title: "Tema Port Logistics Industrial Hub",
    category: "ibr_idt",
    categoryLabel: "IBR & Industrial Rib",
    location: "Tema Heavy Industrial Area",
    area: "24,000 sq ft",
    completionDate: "November 2025",
    profileUsed: "IBR High-Spanning 0.55mm Marine Grade",
    warranty: "40-Year Industrial Warranty",
    imageUrl: ibrImg,
    aspectRatio: "aspect-[16/9]",
    description: "High-spanning trapezoidal IBR panels deployed over a sea-breeze industrial corridor. Specifically engineered to withstand severe marine salt spray and handle high water discharge volumes.",
    highlights: [
      "High rainwater discharge velocity",
      "Wide purlin spans cut steel framework cost",
      "Daylight harvesting translucent skylight inserts",
      "Anti-corrosive marine barrier coat"
    ]
  },
  {
    id: "gal-4",
    title: "Watertight Flat Concrete Deck Sealing",
    category: "waterproofing",
    categoryLabel: "Waterproofing & Sealing",
    location: "Cantonments, Accra",
    area: "3,400 sq ft",
    completionDate: "February 2026",
    profileUsed: "Multi-layer Polyurethane Waterproof Membrane",
    warranty: "15-Year Leak-Proof Certificate",
    imageUrl: waterproofingImg,
    aspectRatio: "aspect-square",
    description: "Comprehensive flat roof concrete sealing preventing internal ceiling dampness and mold ingress. Applied high-tensile elastic elastomeric liquid membrane paired with geotextile mesh.",
    highlights: [
      "Seamless torchless application",
      "UV heat reflective white topcoat",
      "Completely seals expansion joint cracks",
      "100% standing water resistant"
    ]
  },
  {
    id: "gal-5",
    title: "Completed Selflock® Standing Seam Mansion",
    category: "selflock",
    categoryLabel: "Selflock® System",
    location: "Trassaco Valley, Accra",
    area: "8,500 sq ft",
    completionDate: "October 2025",
    profileUsed: "Selflock® Deep Ocean Blue Aluzinc",
    warranty: "50-Year Watertight Guarantee",
    imageUrl: selflockFinishedImg,
    aspectRatio: "aspect-[4/3]",
    description: "A prestigious residential estate featuring a sprawling multi-pitched roof clad in Deep Ocean Blue Selflock® panels. Custom timber hips, valleys, and wall flashings finished to perfection.",
    highlights: [
      "Custom roll-formed to exact lengths on site",
      "Zero thermal expansion noise",
      "Custom hip and ridge caps with hidden clips",
      "Durable high-gloss weather-defending finish"
    ]
  },
  {
    id: "gal-6",
    title: "Roof Extension & Modern Structure Renovation",
    category: "renovation",
    categoryLabel: "Renovation & Restoration",
    location: "Ahodwo, Kumasi",
    area: "4,100 sq ft",
    completionDate: "January 2026",
    profileUsed: "IDT Deep Trough + Timber Truss Alignment",
    warranty: "30-Year Restoration Certificate",
    imageUrl: beautifulExtensionImg,
    aspectRatio: "aspect-[3/4]",
    description: "Structural renovation of a vintage residential property. Replaced rotten timber trusses with seasoned, anti-termite treated woodwork and overlaid high-capacity IDT deep trough sheeting.",
    highlights: [
      "Structural timber alignment and sagging fix",
      "Anti-termite borate timber treatment",
      "Deep water troughs prevent overflow backflow",
      "Integrated fascia boards and PVC soffits"
    ]
  },
  {
    id: "gal-7",
    title: "Solar Roof Integration & Solar Panel Frame",
    category: "solar",
    categoryLabel: "Solar & Accessories",
    location: "Spintex Road, Accra",
    area: "12,000 sq ft",
    completionDate: "February 2026",
    profileUsed: "IDT Sheeting with Non-Penetrating Solar Clamps",
    warranty: "25-Year Solar Mounting Warranty",
    imageUrl: solarIntegrationImg,
    aspectRatio: "aspect-[16/9]",
    description: "Precision engineered standing seam solar clamp integration on a commercial rooftop. Clean installation without drilling a single hole into the waterproof roof surface.",
    highlights: [
      "Non-penetrating seam clamp technology",
      "Zero roof leak risk post solar setup",
      "High wind vibration resistance",
      "Maximized solar exposure tilt angles"
    ]
  },
  {
    id: "gal-8",
    title: "High-Clarity Daylight Polycarbonate Skylights",
    category: "ibr_idt",
    categoryLabel: "IBR & Industrial Rib",
    location: "Koforidua Industrial Estate",
    area: "1,800 sq ft",
    completionDate: "November 2025",
    profileUsed: "UV-Protected Polycarbonate Profile Match",
    warranty: "20-Year Non-Yellowing Guarantee",
    imageUrl: polycarbonateImg,
    aspectRatio: "aspect-square",
    description: "Daylight harvesting polycarbonate sheets embedded within IBR industrial roofing panels to reduce artificial lighting requirements by up to 65% during daylight hours.",
    highlights: [
      "Co-extruded UV solar protective layer",
      "Matches metal IBR profile geometry exactly",
      "High impact shatterproof poly-resin",
      "Cuts daylight commercial electric costs"
    ]
  },
  {
    id: "gal-9",
    title: "Weather-Shield Exterior Coating Restoration",
    category: "renovation",
    categoryLabel: "Renovation & Restoration",
    location: "Dzorwulu, Accra",
    area: "3,800 sq ft",
    completionDate: "December 2025",
    profileUsed: "Infrared Reflective Roof Acrylic Coating",
    warranty: "15-Year Weather-Shield Guarantee",
    imageUrl: paintingImg,
    aspectRatio: "aspect-[4/3]",
    description: "Complete roof cleaning, rust neutralization, and airless spray application of UV-reflective weather shield coating. Restored faded roof color to showroom condition while lowering attic temperatures.",
    highlights: [
      "High pressure water blast & moss removal",
      "Infrared solar heat reflection coating",
      "Corrosion-inhibiting primer layer",
      "Extends existing roof life by 15+ years"
    ]
  },
  {
    id: "gal-10",
    title: "Full Home Structural Roof Overhaul",
    category: "renovation",
    categoryLabel: "Renovation & Restoration",
    location: "Abenase, Koforidua",
    area: "4,500 sq ft",
    completionDate: "January 2026",
    profileUsed: "Complete Timber Carpentry & Step Tiles",
    warranty: "40-Year Comprehensive Certificate",
    imageUrl: renovationImg,
    aspectRatio: "aspect-[3/4]",
    description: "Complete tear-off of aged leaking iron sheets, structural rebuilding of purlins and rafters, and installation of new step tiles with insulated vapor barriers.",
    highlights: [
      "Complete removal of old rusty roofing",
      "Leveling of uneven ceiling pitch lines",
      "Underlayment breathable water barrier",
      "Rapid 5-day installation turnaround"
    ]
  },
  {
    id: "gal-11",
    title: "Aluminium Plain Corrosion Defense Estate",
    category: "selflock",
    categoryLabel: "Selflock® System",
    location: "Sakumono Coastal Zone, Accra",
    area: "7,100 sq ft",
    completionDate: "February 2026",
    profileUsed: "0.60mm Raw Marine Aluminium Plain Sheeting",
    warranty: "60-Year Rustproof Guarantee",
    imageUrl: plainAluminumImg,
    aspectRatio: "aspect-[16/9]",
    description: "Built within 500 meters of the Atlantic ocean, this seaside villa utilizes 100% solid marine aluminium plain panels that can never rust, giving the client permanent peace of mind.",
    highlights: [
      "100% rustproof under ocean salt air",
      "High thermal reflectivity reduces AC load",
      "Solid alloy strength with zero flaking",
      "Ideal for aggressive coastal micro-climates"
    ]
  },
  {
    id: "gal-12",
    title: "Custom Roll-Formed Metal Accessories & Flashing",
    category: "solar",
    categoryLabel: "Solar & Accessories",
    location: "ZOF Central Workshop, Accra",
    area: "Custom Fabrications",
    completionDate: "Ongoing Fabrication",
    profileUsed: "Precision CNC Bent Flashing & Ridge Caps",
    warranty: "Precision Engineering Fit",
    imageUrl: metalAccessoriesImg,
    aspectRatio: "aspect-square",
    description: "Custom precision bending and roll-forming of valley gutters, wall aprons, barge boards, and drip caps engineered to pair seamlessly with ZOF roofing profiles.",
    highlights: [
      "Custom 3m length bending capacity",
      "Seamless watertight corner joints",
      "Color-matched to panel production lots",
      "Heavy gauge Aluzinc & Aluminium stock"
    ]
  }
];

const CATEGORIES = [
  { id: "all", label: "All Works" },
  { id: "selflock", label: "Selflock® Systems" },
  { id: "steptiles", label: "Step Tiles Villa" },
  { id: "ibr_idt", label: "IBR & Industrial" },
  { id: "waterproofing", label: "Waterproofing" },
  { id: "renovation", label: "Renovations" },
  { id: "solar", label: "Solar & Accessories" },
];

interface GalleryProps {
  onSelectProjectForEstimate?: (projectTitle: string) => void;
  onScrollToConsultation?: () => void;
}

export function Gallery({ onSelectProjectForEstimate, onScrollToConsultation }: GalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Display preference states for crystal clear viewing
  const [viewMode, setViewMode] = useState<"grid" | "showcase" | "detailed">("grid");
  const [clarityEnhanced, setClarityEnhanced] = useState<boolean>(true);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);
  const [purePhotoMode, setPurePhotoMode] = useState<boolean>(false);

  // Filter items based on category and search query
  const filteredItems = GALLERY_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.profileUsed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const activeItem = selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null;

  // Reset zoom when opening/closing or switching photo in Lightbox
  useEffect(() => {
    setLightboxZoom(1);
  }, [selectedItemIndex]);

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedItemIndex === null) return;

      if (e.key === "Escape") {
        setSelectedItemIndex(null);
      } else if (e.key === "ArrowLeft") {
        setSelectedItemIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedItemIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === "+" || e.key === "=") {
        setLightboxZoom((z) => Math.min(3, z + 0.25));
      } else if (e.key === "-") {
        setLightboxZoom((z) => Math.max(1, z - 0.25));
      }
    },
    [selectedItemIndex, filteredItems.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock scroll when lightbox is open
  useEffect(() => {
    if (selectedItemIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedItemIndex]);

  const handleNext = () => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex((selectedItemIndex + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex((selectedItemIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleShare = (id: string, title: string) => {
    const text = `Check out this roofing project by ZOF Group: ${title}`;
    navigator.clipboard.writeText(`${window.location.origin}#gallery-${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="gallery" className="py-20 bg-stone-900 text-stone-100 scroll-mt-20 overflow-hidden relative">
      {/* Background ambient lighting accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider mb-4 font-mono shadow-sm">
            <Camera className="h-4 w-4 text-amber-400" />
            <span>Master Workmanship Showcase</span>
          </div>
          <h2 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight mb-4 drop-shadow-md">
            High-Resolution Project Gallery
          </h2>
          <p className="text-stone-200 text-base sm:text-lg leading-relaxed font-sans max-w-2xl mx-auto">
            Inspect crystal-clear, authentic photographs of completed luxury residences, commercial warehouses, and waterproofing projects executed across Ghana and West Africa.
          </p>
        </div>

        {/* Live Project Registry Counter Widget with Flip Digits */}
        <ProjectCounterWidget
          activeCategory={selectedCategory}
          activeCategoryLabel={CATEGORIES.find((c) => c.id === selectedCategory)?.label || "All Works"}
          filteredCount={filteredItems.length}
        />

        {/* Filter, Search & View Controls Bar */}
        <div className="bg-stone-950/90 border-2 border-stone-700 rounded-3xl p-4 sm:p-5 mb-8 shadow-2xl flex flex-col gap-4">
          
          {/* Top Row: Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 scrollbar-none">
            <Filter className="h-4 w-4 text-amber-400 shrink-0 ml-1 mr-1 hidden sm:block" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedItemIndex(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-amber-400 text-slate-950 shadow-lg font-black ring-2 ring-amber-300"
                    : "bg-stone-850 text-stone-100 hover:bg-stone-700 hover:text-white border border-stone-600 font-semibold"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Bottom Row: Search Box & View Mode / Clarity Switchers */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-stone-800">
            
            {/* Search Input Box */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-amber-400" />
              <input
                type="text"
                placeholder="Search location, profile, villa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-stone-900 border-2 border-stone-700 focus:border-amber-400 text-white placeholder-stone-400 rounded-xl text-xs sm:text-sm font-sans font-medium focus:outline-none transition-colors shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-3 text-stone-300 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* View Mode & Clarity Booster Controls */}
            <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
              
              {/* Clarity Enhancer Button */}
              <button
                type="button"
                onClick={() => setClarityEnhanced(!clarityEnhanced)}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all border cursor-pointer ${
                  clarityEnhanced
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-xs"
                    : "bg-stone-800 text-stone-300 border-stone-700 hover:text-white"
                }`}
                title="Toggle enhanced HD contrast and sharpness"
              >
                <Sun className={`h-3.5 w-3.5 ${clarityEnhanced ? "text-amber-400 fill-amber-400/20" : "text-stone-400"}`} />
                <span>HD Clarity {clarityEnhanced ? "ON" : "OFF"}</span>
              </button>

              {/* View Layout Switcher */}
              <div className="bg-stone-900 border border-stone-700 p-1 rounded-xl flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-amber-400 text-slate-950 font-black shadow-xs"
                      : "text-stone-300 hover:text-white"
                  }`}
                  title="Photo Grid View"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Photo Grid</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("showcase")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    viewMode === "showcase"
                      ? "bg-amber-400 text-slate-950 font-black shadow-xs"
                      : "text-stone-300 hover:text-white"
                  }`}
                  title="Large Showcase Mode"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Showcase</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("detailed")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    viewMode === "detailed"
                      ? "bg-amber-400 text-slate-950 font-black shadow-xs"
                      : "text-stone-300 hover:text-white"
                  }`}
                  title="Detailed Specs & Timelines"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Tech Specs</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Counter & Instruction Badge */}
        <div className="flex justify-between items-center mb-6 text-xs sm:text-sm text-stone-200 font-mono px-2">
          <span>Showing <strong className="text-amber-400 font-bold">{filteredItems.length}</strong> project photo{filteredItems.length !== 1 ? 's' : ''}</span>
          <span className="flex items-center space-x-1 text-amber-300 font-semibold">
            <Eye className="h-4 w-4" />
            <span>Click any photo to open HD full-screen zoom inspection</span>
          </span>
        </div>

        {/* GALLERY ITEMS DISPLAY */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-stone-900 border-2 border-dashed border-stone-700 rounded-3xl p-8">
            <Info className="h-12 w-12 text-amber-400 mx-auto mb-3" />
            <p className="text-white font-bold text-lg">No project photos match your criteria</p>
            <p className="text-stone-300 text-sm mt-1 mb-5 font-sans">Try clearing your search query or changing the category filter.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-black rounded-xl transition-colors cursor-pointer shadow-md"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === "showcase" ? (
          /* SHOWCASE VIEW: Large Unobstructed Photos with High-Contrast Glass Badges */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredItems.map((item, idx) => {
              const timeline = getProjectTimeline(item);
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemIndex(idx)}
                  className="group relative bg-stone-950 border-2 border-stone-700 hover:border-amber-400 rounded-3xl overflow-hidden cursor-pointer shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 text-left flex flex-col"
                >
                  {/* Photo Container - Completely Unmasked & Sharp */}
                  <div className="relative overflow-hidden aspect-[16/10] bg-stone-950">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${
                        clarityEnhanced ? "contrast-[1.06] brightness-[1.03] saturate-[1.05]" : ""
                      }`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />

                    {/* Top Floating Badges */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10 pointer-events-none">
                      <span className="bg-slate-950/90 text-amber-300 border-2 border-amber-500/50 px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-lg">
                        {item.categoryLabel}
                      </span>
                      <span className="bg-amber-400 text-slate-950 font-mono font-black text-xs px-2.5 py-1 rounded-xl shadow-lg flex items-center space-x-1">
                        <Maximize2 className="h-3.5 w-3.5" />
                        <span>Inspect HD</span>
                      </span>
                    </div>

                    {/* Subtle bottom shadow to anchor title card */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-stone-950/80 to-transparent pointer-events-none" />
                  </div>

                  {/* High-Contrast Information Body below Photo */}
                  <div className="p-6 bg-stone-900 flex-1 flex flex-col justify-between border-t-2 border-stone-800">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="flex items-center space-x-1.5 text-xs font-mono font-bold text-amber-300">
                          <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                          <span>{item.location}</span>
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg">
                          {item.warranty.split(" ")[0]} Guarantee
                        </span>
                      </div>

                      <h3 className="font-sans font-black text-xl text-white group-hover:text-amber-300 transition-colors leading-tight mb-2">
                        {item.title}
                      </h3>

                      <p className="text-sm text-stone-200 font-sans leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Specs Tag Row */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-stone-950 text-stone-200 border border-stone-700 px-3 py-1 rounded-lg text-xs font-mono font-semibold">
                          Profile: <strong className="text-white">{item.profileUsed}</strong>
                        </span>
                        <span className="bg-stone-950 text-stone-200 border border-stone-700 px-3 py-1 rounded-lg text-xs font-mono font-semibold">
                          Roof Scale: <strong className="text-amber-300">{item.area}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Footer Button */}
                    <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                      <span className="flex items-center space-x-1 text-xs font-mono text-stone-300 font-semibold">
                        <Clock className="h-4 w-4 text-amber-400" />
                        <span>Timeline: {timeline.totalDays}</span>
                      </span>
                      <button
                        type="button"
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-sans font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1.5 shadow-md cursor-pointer"
                      >
                        <span>View High-Res Photo</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : viewMode === "detailed" ? (
          /* DETAILED TECHNICAL VIEW: Side-by-Side Photo & 4-Phase Schedule */
          <div className="space-y-6">
            {filteredItems.map((item, idx) => {
              const timeline = getProjectTimeline(item);
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemIndex(idx)}
                  className="group bg-stone-950 border-2 border-stone-700 hover:border-amber-400 rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 text-left"
                >
                  {/* Photo Column */}
                  <div className="lg:col-span-5 relative bg-stone-950 min-h-[260px] sm:min-h-[320px]">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${
                        clarityEnhanced ? "contrast-[1.06] brightness-[1.03] saturate-[1.05]" : ""
                      }`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/90 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase">
                      {item.categoryLabel}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-amber-400 text-slate-950 text-xs font-mono font-black px-3 py-1.5 rounded-xl shadow-lg flex items-center space-x-1">
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>Zoom HD</span>
                    </div>
                  </div>

                  {/* Details & Specs Column */}
                  <div className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-between bg-stone-900">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="flex items-center space-x-1.5 text-xs font-mono font-bold text-amber-300">
                          <MapPin className="h-4 w-4 text-amber-400" />
                          <span>{item.location}</span>
                        </span>
                        <span className="text-xs font-mono text-stone-300 bg-stone-950 border border-stone-700 px-2.5 py-1 rounded-lg">
                          Completed: <strong className="text-white">{item.completionDate}</strong>
                        </span>
                      </div>

                      <h3 className="font-sans font-black text-xl sm:text-2xl text-white group-hover:text-amber-300 transition-colors leading-tight mb-3">
                        {item.title}
                      </h3>

                      <p className="text-sm text-stone-200 font-sans leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Technical Specs Strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4 text-xs font-mono bg-stone-950 border border-stone-700 p-3 rounded-2xl">
                        <div>
                          <span className="text-stone-400 text-[10px] uppercase font-bold block">Roof Area</span>
                          <span className="text-amber-300 font-bold text-sm">{item.area}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 text-[10px] uppercase font-bold block">Warranty</span>
                          <span className="text-emerald-400 font-bold text-sm">{item.warranty.split(" ")[0]}</span>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <span className="text-stone-400 text-[10px] uppercase font-bold block">Assigned Crew</span>
                          <span className="text-white font-bold">{timeline.crewCount}</span>
                        </div>
                      </div>

                      {/* 4-Phase Timeline Preview */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono text-amber-300 font-bold">
                          <span className="flex items-center space-x-1.5">
                            <Clock className="h-3.5 w-3.5 text-amber-400" />
                            <span>Execution Timeline: {timeline.totalDays} Total</span>
                          </span>
                          <span className="text-emerald-400">{timeline.dailyRate}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                          {timeline.phases.map((ph, pIdx) => (
                            <div key={pIdx} className="bg-stone-950 border border-stone-800 p-2 rounded-xl">
                              <span className="text-[10px] font-mono font-bold text-amber-400 block">{ph.days}</span>
                              <span className="text-[11px] font-sans font-medium text-stone-200 line-clamp-1">{ph.phase}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-800 flex justify-end mt-4">
                      <button
                        type="button"
                        className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-sans font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center space-x-2"
                      >
                        <span>Open High-Resolution Inspection</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* STANDARD GRID VIEW: Clean Unobstructed Photos with Crisp High-Contrast Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => {
              const timeline = getProjectTimeline(item);
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemIndex(idx)}
                  className="group bg-stone-950 border-2 border-stone-700 hover:border-amber-400 rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 text-left flex flex-col"
                >
                  {/* Photo Canvas - Completely Clear & Sharp */}
                  <div className="relative overflow-hidden aspect-[4/3] bg-stone-950">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${
                        clarityEnhanced ? "contrast-[1.06] brightness-[1.03] saturate-[1.05]" : ""
                      }`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10 pointer-events-none">
                      <span className="bg-slate-950/90 text-amber-300 border-2 border-amber-500/50 px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-lg">
                        {item.categoryLabel}
                      </span>
                      <span className="bg-amber-400 text-slate-950 font-mono font-black text-[11px] px-2.5 py-1 rounded-xl shadow-lg flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="h-3 w-3" />
                        <span>Inspect HD</span>
                      </span>
                    </div>

                    {/* Quick Location Glass Tag */}
                    <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
                      <span className="bg-slate-950/85 backdrop-blur-md text-stone-200 border border-stone-700 px-3 py-1 rounded-lg text-xs font-mono font-semibold flex items-center space-x-1 shadow-md">
                        <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span>{item.location}</span>
                      </span>
                    </div>
                  </div>

                  {/* High-Contrast Card Body */}
                  <div className="p-5 bg-stone-900 flex-1 flex flex-col justify-between border-t-2 border-stone-800">
                    <div>
                      <h3 className="font-sans font-black text-lg text-white group-hover:text-amber-300 transition-colors leading-snug mb-2">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-stone-200 font-sans leading-relaxed mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Specs Pill List */}
                      <div className="space-y-1.5 mb-4 text-xs font-mono">
                        <div className="bg-stone-950 border border-stone-700/80 px-3 py-1.5 rounded-xl flex items-center justify-between text-stone-200">
                          <span className="text-stone-400 text-[10px] uppercase font-bold">Profile:</span>
                          <span className="text-white font-semibold truncate max-w-[190px]">{item.profileUsed}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="bg-stone-950 border border-stone-700/80 px-2.5 py-1.5 rounded-xl text-center">
                            <span className="text-stone-400 text-[10px] uppercase font-bold block">Scale</span>
                            <span className="text-amber-300 font-bold">{item.area}</span>
                          </div>
                          <div className="bg-stone-950 border border-stone-700/80 px-2.5 py-1.5 rounded-xl text-center">
                            <span className="text-stone-400 text-[10px] uppercase font-bold block">Warranty</span>
                            <span className="text-emerald-400 font-bold">{item.warranty.split(" ")[0]}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs font-mono">
                      <span className="text-stone-300 font-semibold flex items-center space-x-1">
                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                        <span>{timeline.totalDays}</span>
                      </span>
                      <span className="text-amber-400 font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                        <span>Inspect Full Photo</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* FULL-SCREEN HIGH-RESOLUTION LIGHTBOX MODAL */}
      {activeItem && selectedItemIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/95 backdrop-blur-2xl animate-fadeIn select-none"
          onClick={() => setSelectedItemIndex(null)}
        >
          {/* Modal Container */}
          <div 
            className={`bg-stone-900 border-2 border-stone-700 rounded-3xl w-full max-h-[95vh] overflow-hidden shadow-2xl flex flex-col lg:flex-row relative z-10 text-left my-auto transition-all ${
              purePhotoMode ? "max-w-6xl" : "max-w-7xl"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Modal Controls Header */}
            <div className="absolute top-3 right-3 z-30 flex items-center space-x-2">
              {/* Pure Photo Mode Toggle */}
              <button
                type="button"
                onClick={() => setPurePhotoMode(!purePhotoMode)}
                className={`p-2 rounded-full border transition-colors cursor-pointer ${
                  purePhotoMode
                    ? "bg-amber-400 text-slate-950 border-amber-300 font-bold"
                    : "bg-stone-950/80 hover:bg-stone-800 text-stone-200 border-stone-700"
                }`}
                title={purePhotoMode ? "Show project details" : "Maximize photo (Hide details panel)"}
              >
                <Eye className="h-4 w-4" />
              </button>

              {/* Close Modal Button */}
              <button
                type="button"
                onClick={() => setSelectedItemIndex(null)}
                className="p-2 bg-stone-950/90 hover:bg-stone-800 text-stone-200 hover:text-white rounded-full transition-colors border border-stone-700 cursor-pointer shadow-lg"
                title="Close modal (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* LEFT / TOP PORTION: Image Canvas with Interactive Zoom */}
            <div className={`${purePhotoMode ? "lg:w-full" : "lg:w-7/12"} bg-black relative flex items-center justify-center min-h-[320px] sm:min-h-[460px] lg:min-h-[640px] overflow-hidden`}>
              
              {/* The High-Resolution Image with Interactive Scaling */}
              <div 
                className="w-full h-full flex items-center justify-center p-2 overflow-auto"
                style={{ cursor: lightboxZoom > 1 ? "grab" : "default" }}
              >
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  style={{ transform: `scale(${lightboxZoom})`, transition: "transform 0.2s ease-out" }}
                  className={`max-h-[60vh] lg:max-h-[85vh] w-auto max-w-full object-contain rounded-xl ${
                    clarityEnhanced ? "contrast-[1.06] brightness-[1.03] saturate-[1.05]" : ""
                  }`}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Zoom Controls Bar at Bottom Center */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-stone-950/90 border border-stone-700 px-3 py-1.5 rounded-full flex items-center space-x-2 text-white shadow-2xl z-20">
                <button
                  type="button"
                  onClick={() => setLightboxZoom((z) => Math.max(1, z - 0.25))}
                  disabled={lightboxZoom <= 1}
                  className="p-1 hover:text-amber-400 disabled:opacity-40 cursor-pointer"
                  title="Zoom Out (-)"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-xs font-mono font-bold text-amber-300 w-12 text-center">
                  {Math.round(lightboxZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxZoom((z) => Math.min(3, z + 0.25))}
                  disabled={lightboxZoom >= 3}
                  className="p-1 hover:text-amber-400 disabled:opacity-40 cursor-pointer"
                  title="Zoom In (+)"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <div className="h-4 w-[1px] bg-stone-700" />
                <button
                  type="button"
                  onClick={() => setLightboxZoom(1)}
                  className="p-1 hover:text-amber-400 cursor-pointer text-stone-300"
                  title="Reset Zoom"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-3 bg-stone-950/80 hover:bg-amber-400 text-white hover:text-slate-950 rounded-full border border-stone-700 transition-all cursor-pointer shadow-2xl z-20"
                title="Previous photo (Left Arrow)"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-stone-950/80 hover:bg-amber-400 text-white hover:text-slate-950 rounded-full border border-stone-700 transition-all cursor-pointer shadow-2xl z-20"
                title="Next photo (Right Arrow)"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Image Counter & Pure Photo Hint */}
              <div className="absolute top-4 left-4 bg-stone-950/90 border border-stone-700 text-stone-200 px-3 py-1.5 rounded-full text-xs font-mono font-bold shadow-lg">
                Photo {selectedItemIndex + 1} of {filteredItems.length}
              </div>

            </div>

            {/* RIGHT / BOTTOM PORTION: High-Contrast Details Sidebar (Hidden when purePhotoMode is active) */}
            {!purePhotoMode && (
              <div className="lg:w-5/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] lg:max-h-[85vh] bg-stone-900 text-white border-t lg:border-t-0 lg:border-l-2 border-stone-700">
                
                <div className="space-y-5">
                  
                  {/* Category & Share Row */}
                  <div className="flex justify-between items-center pr-10">
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase tracking-wider">
                      {activeItem.categoryLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleShare(activeItem.id, activeItem.title)}
                      className="text-stone-300 hover:text-amber-400 flex items-center space-x-1.5 text-xs font-mono font-bold transition-colors cursor-pointer bg-stone-950 border border-stone-700 px-3 py-1 rounded-lg"
                      title="Copy direct project link"
                    >
                      {copiedId === activeItem.id ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="h-4 w-4" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Title and Location */}
                  <div>
                    <h3 className="font-sans font-black text-2xl sm:text-3xl text-white leading-tight mb-2">
                      {activeItem.title}
                    </h3>
                    <div className="flex items-center space-x-3 text-xs sm:text-sm font-mono text-stone-300 font-semibold">
                      <span className="flex items-center space-x-1 text-amber-400">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>{activeItem.location}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1 text-stone-300">
                        <Calendar className="h-4 w-4 shrink-0 text-stone-400" />
                        <span>{activeItem.completionDate}</span>
                      </span>
                    </div>
                  </div>

                  {/* Specifications High-Contrast Card */}
                  <div className="grid grid-cols-2 gap-3 bg-stone-950 p-4 rounded-2xl border-2 border-stone-800 text-xs font-mono">
                    <div>
                      <span className="text-stone-400 block text-[11px] uppercase font-bold">Roof Scale</span>
                      <span className="text-amber-300 font-black text-base">{activeItem.area}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[11px] uppercase font-bold">Watertight Warranty</span>
                      <span className="text-emerald-400 font-black text-base">{activeItem.warranty.split(" ")[0]} Guarantee</span>
                    </div>
                    <div className="col-span-2 border-t border-stone-800 pt-2 mt-1">
                      <span className="text-stone-400 block text-[11px] uppercase font-bold">Profile Specification</span>
                      <span className="text-white font-sans font-bold text-sm">{activeItem.profileUsed}</span>
                    </div>
                  </div>

                  {/* Overview Description */}
                  <div>
                    <h4 className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider mb-1.5 flex items-center space-x-1.5">
                      <Building2 className="h-4 w-4" />
                      <span>Project Overview & Engineering</span>
                    </h4>
                    <p className="text-stone-100 text-sm sm:text-base leading-relaxed font-sans font-normal">
                      {activeItem.description}
                    </p>
                  </div>

                  {/* Workmanship Highlights Checklist */}
                  <div>
                    <h4 className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider mb-2 flex items-center space-x-1.5">
                      <Award className="h-4 w-4" />
                      <span>Key Workmanship Highlights</span>
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-stone-100 font-sans">
                      {activeItem.highlights.map((hl, i) => (
                        <li key={i} className="flex items-start space-x-2.5 bg-stone-950/60 p-2 rounded-xl border border-stone-800">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="font-medium">{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Execution Timeline Milestones Card inside Modal */}
                  {(() => {
                    const activeTimeline = getProjectTimeline(activeItem);
                    return (
                      <div className="bg-stone-950 border-2 border-stone-800 rounded-2xl p-4 space-y-3 text-left">
                        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                            <Clock className="h-4 w-4 text-amber-400" />
                            <span>Execution Timeline Schedule</span>
                          </div>
                          <span className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-lg text-xs font-mono font-black shadow-xs">
                            {activeTimeline.totalDays} Total
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          <div>
                            <span className="text-stone-400 text-[10px] uppercase block font-bold">Project Scale</span>
                            <span className="text-amber-300 font-semibold">{activeTimeline.scaleCategory}</span>
                          </div>
                          <div>
                            <span className="text-stone-400 text-[10px] uppercase block font-bold">Assigned Crew</span>
                            <span className="text-white font-semibold">{activeTimeline.crewCount}</span>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-stone-800">
                          <span className="text-[10px] font-mono uppercase text-stone-300 font-bold tracking-wider block">
                            Phase Completion Breakdown
                          </span>
                          <div className="space-y-1.5">
                            {activeTimeline.phases.map((p, pIdx) => (
                              <div key={pIdx} className="bg-stone-900 border border-stone-700/80 rounded-xl p-2.5 flex items-start space-x-2.5">
                                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[11px] font-mono font-bold shrink-0 mt-0.5">
                                  {p.days}
                                </span>
                                <div className="text-left">
                                  <p className="text-xs sm:text-sm font-bold text-white leading-tight">{p.phase}</p>
                                  <p className="text-xs text-stone-300 font-sans mt-0.5 leading-snug">{p.detail}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                </div>

                {/* Call to Action Footer */}
                <div className="pt-6 border-t-2 border-stone-800 mt-6 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectProjectForEstimate) {
                        onSelectProjectForEstimate(activeItem.profileUsed);
                      }
                      if (onScrollToConsultation) {
                        onScrollToConsultation();
                      }
                      setSelectedItemIndex(null);
                    }}
                    className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-sans font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-xl flex items-center justify-center space-x-2 cursor-pointer hover:shadow-amber-500/20 hover:scale-[1.01]"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>Request Quote for Similar Roof</span>
                  </button>
                  <p className="text-xs font-mono text-center text-stone-400">
                    Free on-site inspection available in Accra, Kumasi, Tema & nationwide
                  </p>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
