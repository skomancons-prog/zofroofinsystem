/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShowcaseProject, RoofType } from "./types";
import selflockImg from "./assets/images/beautiful_selflock_sheeting_1782230951805.jpg";
import ibrImg from "./assets/images/zof_ibr_sheets_profile_1780103574960.png";
import idtImg from "./assets/images/zof_idt_profile_spec_1780103899923.png";
import stepTilesImg from "./assets/images/zof_steptiles_premium_1780104332914.png";
import aluminumPlainImg from "./assets/images/zof_plain_aluminum_spec_1780104679543.png";
import galvanizedImg from "./assets/images/zof_galvanized_spec_1780105125474.png";
import polycarbonateImg from "./assets/images/zof_polycarbonate_spec_1780105422566.png";
import aluzincPlainImg from "./assets/images/zof_aluzinc_plain_spec_1780105676211.png";

export interface MaterialProfile {
  id: RoofType;
  name: string;
  category: "commercial" | "residential" | "both";
  longName: string;
  description: string;
  benefits: string[];
  maxWindSpeed: string;
  durabilityRating: string;
  ecoFactor: string;
  imageUrl: string;
}

export const MATERIAL_PROFILES: MaterialProfile[] = [
  {
    id: RoofType.SELFLOCK,
    name: "Selflock Roofing System",
    category: "both",
    longName: "Concealed Fastener Anti-Leak Lock System",
    description: "An advanced, modern interlocking panel profile that completely hides all nail fixings. By eliminating exposed screws or penetrations where leaks usually start, Selflock delivers absolute watertight protection under intense tropical rainfall. Outstanding for both luxury residential homes and industrial storage hubs.",
    benefits: [
      "Concealed nail & screw fasteners to prevent oxidation",
      "100% leak-proof snap-locking panel design",
      "Sleek, pristine architectural finish",
      "Highly resistant to thermal buckling under sub-tropical sun"
    ],
    maxWindSpeed: "160+ MPH",
    durabilityRating: "Elite System (50+ Years Lifetime)",
    ecoFactor: "Optimal heat-reflective properties to lower building cooling load",
    imageUrl: selflockImg,
  },
  {
    id: RoofType.IBR,
    name: "IBR Sheeting (Inverted Box Rib)",
    category: "both",
    longName: "Classic High-Spanning Trapezoidal Profile",
    description: "An incredibly popular angular trapezoidal fluted roofing design. Engineered with high-strength rib components that allow wider truss spans and deliver superior rain-shedding volume capacity. Perfect for both residential houses and factory structural projects.",
    benefits: [
      "Exceptional rainwater drainage runoff volume",
      "Strong profile rigidity allows for wider purlin spacing",
      "Cost-effective with high architectural durability",
      "Available in multiple colors (Deep Ocean, Headland Red, etc.)"
    ],
    maxWindSpeed: "150 MPH",
    durabilityRating: "Excellent (40+ Years Lifetime)",
    ecoFactor: "Excellent food-grade safe runoff for domestic rainwater harvesting",
    imageUrl: ibrImg,
  },
  {
    id: RoofType.IDT,
    name: "IDT Profile Sheets",
    category: "both",
    longName: "Industrial Deep Trough Heavy Roofing Sheeting",
    description: "Features custom deep trough valleys specifically crafted to divert massive volumes of water during torrential seasonal storms. Highly recommended for buildings with flatter structural pitches or wide, expansive surface planes.",
    benefits: [
      "Extra deep troughs prevent water build-up and overflow",
      "Heavy load bearing panels that protect under high windstorms",
      "Stays highly secure and watertight at slopes as low as 5 degrees",
      "Perfect paint adhesion with premium color stability"
    ],
    maxWindSpeed: "150 MPH",
    durabilityRating: "Exceptional Integrity (45+ Years)",
    ecoFactor: "Reduces heat transmission to help passive thermal insulation",
    imageUrl: idtImg,
  },
  {
    id: RoofType.STEP_TILES,
    name: "Step Tiles Profile",
    category: "residential",
    longName: "Premium Mediterranean Coated Step Tile Metal",
    description: "Replicates the elegant styling of classical Mediterranean clay tiles while relying on the lightweight strength, durability, and leak-proof nature of advanced alloy sheets. The ultimate visual standard for high-end villas and family estates.",
    benefits: [
      "Sublime elegant curbside styling & prestige architecture",
      "Lightweight alloy profile significantly reduces timber load on trusses",
      "Superior wind lift resistance and structural reinforcement",
      "Glaze coatings repel algae growth and dirt accumulation"
    ],
    maxWindSpeed: "140 MPH",
    durabilityRating: "Elite Architectural Grade (50+ Years)",
    ecoFactor: "100% lead-free anti-corrosion protective paint formulations",
    imageUrl: stepTilesImg,
  },
  {
    id: RoofType.ALUMINIUM_PLAIN,
    name: "Aluminium Plain Sheets",
    category: "both",
    longName: "Marine-Grade Plain Solid Aluminium Roofing",
    description: "Crafted strictly of raw, premium marine-grade solid aluminium alloy. Since plain aluminium never rusts, it acts as the supreme protective shield for commercial, industrial, or residential facilities located within coastal breeze zones.",
    benefits: [
      "100% lifetime protection against rust and salt-spray corrosion",
      "Extremely light weight, reducing build timber cost",
      "Highest raw solar heat reflection metrics",
      "Requires virtually zero chemical repairs or maintenance"
    ],
    maxWindSpeed: "145 MPH",
    durabilityRating: "Superior Class (60+ Years Lifecycle)",
    ecoFactor: "Highly sustainable raw alloy content that can be fully re-melted",
    imageUrl: aluminumPlainImg,
  },
  {
    id: RoofType.GALVANIZE,
    name: "Galvanized Sheets",
    category: "both",
    longName: "Passivated Zinc-Coated Heavy Structural Steel",
    description: "Zinc-passivated high-tensile structural steel roof sheets displaying excellent physical strength. Combines physical point-puncture resistance and structural rigidity with highly affordable long-term pricing.",
    benefits: [
      "Excellent defense against falling trees or construction impacts",
      "Heavy duty zinc barrier defends steel base core from moisture",
      "High cost-to-performance efficiency with reliable lifespans",
      "Tough classical corrugated look and solid profile"
    ],
    maxWindSpeed: "140 MPH",
    durabilityRating: "Very High Strength (35+ Years Lifetime)",
    ecoFactor: "Solid local steel composition with durable mineral coating",
    imageUrl: galvanizedImg,
  },
  {
    id: RoofType.TRANSPARENT_SHEETS,
    name: "Transparent Polycarbonate Sheets",
    category: "both",
    longName: "High-Clarity Daylight Harvesting Polycarbonate",
    description: "Surgical-grade high-clarity polycarbonate profiling sheets designed to let natural daylight filter into building structures. Highly prized for patio designs, industrial workshops, and plant greenhouses.",
    benefits: [
      "Maximized daylighting reduces morning electricity costs",
      "Injected UV protective layer prevents solar yellowing/brittleness",
      "Remarkable impact strength compared to standard glass",
      "Fitted to couple seamlessly with steel profiles (IBR/IDT/Selflock)"
    ],
    maxWindSpeed: "130 MPH",
    durabilityRating: "High Performance (20+ Years)",
    ecoFactor: "Reduces carbon footprints by converting natural daylight to illumination",
    imageUrl: polycarbonateImg,
  },
  {
    id: RoofType.ALUZINC_PLAIN,
    name: "Aluzinc Plain Sheets",
    category: "both",
    longName: "Aluminium-Zinc Dual Alloy Plain Panels",
    description: "Engineered by coat-plating standard high-grade steel with an optimum blend of 55% raw aluminium and 43.4% pure zinc. Delivers up to 4x the corrosive lifespan of traditional galvanizing under high coastal humidity.",
    benefits: [
      "Advanced alloy skin halts oxidative spreading inside metals",
      "Outstanding thermal stability blocks excessive heat transfer",
      "Excellent surface aesthetic layout and formability",
      "High resistance to weathering and acid rain exposures"
    ],
    maxWindSpeed: "150 MPH",
    durabilityRating: "Elite Structural Lifespan (55+ Years)",
    ecoFactor: "Prevents indoor heat buildup through superb solar reflecting limits",
    imageUrl: aluzincPlainImg,
  }
];

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: "proj_1",
    title: "Airport Residential Office Complex",
    category: "Selflock & PVC" as any, // fallback to avoid enum type errors if categories map dynamically
    location: "Airport Residential Area, Accra",
    description: "Designed and roll-formed 0.50mm Premium Deep Ocean Blue profile sheets with custom structural steel trusses. Handled via fully remote project updates and visual client coordination with absolute satisfaction.",
    roofArea: "8,500 sq ft",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
    duration: "6 Days (Fully Remote Supervision)",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-sunbeams-shining-through-modern-building-windows-34533-large.mp4"
  },
  {
    id: "proj_2",
    title: "Vibrant Manor Red Step Tiles Villa",
    category: "Step Tiles & Shingles" as any,
    location: "East Legon, Accra",
    description: "Complete design and roofing layout of an elegant residential estate. Deployed premium Manor Red Step Tiles with comprehensive timber woodworking, structural support, and full insulation backing.",
    roofArea: "4,600 sq ft",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop",
    duration: "4 Days",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-luxury-suburban-houses-43011-large.mp4"
  },
  {
    id: "proj_3",
    title: "Tema Port Logistics Warehouse Hub",
    category: "Metal & Aluminium" as any,
    location: "Tema Industrial Area, Ghana",
    description: "Engineered high-flow trapezoidal IBR panels integrated with surgical Daylight Harvesting polycarbonate panels to allow natural lighting. Features extra anti-corrosive rust-defending compounds suitable for sea environments.",
    roofArea: "22,400 sq ft",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop",
    duration: "9 Days",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-dramatic-aerial-view-of-a-dockside-warehouse-area-40277-large.mp4"
  },
  {
    id: "proj_4",
    title: "Kumasi Commercial Plaza Sheeting",
    category: "Gutters & Polycarbonate" as any,
    location: "Kumasi, Ghana",
    description: "Outfitted a massive market space with Cottage Green IDT Profiles and precision steel truss systems. Features roll-formed seamless custom gutter systems to manage heavy monsoon water collection.",
    roofArea: "15,200 sq ft",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
    duration: "7 Days",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-construction-site-viewed-from-above-41584-large.mp4"
  },
  {
    id: "proj_5",
    title: "West Hills Residential Estate Layout",
    category: "Selflock & PVC" as any,
    location: "West Hills, Accra",
    description: "Installed premium Charcoal Woodland Gray Selflock roofing sheets for a stunning modern look. Project completed under diligent woodwork, carpentry, and remote camera-guided project management.",
    roofArea: "6,400 sq ft",
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop",
    duration: "5 Days",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-residential-neighborhood-with-houses-43093-large.mp4"
  },
  {
    id: "proj_6",
    title: "Daylight Harvesting Patio Installation",
    category: "Metal & Aluminium" as any,
    location: "Koforidua, Ghana",
    description: "Constructed premium polycarbonate daylight harvesting panel arrays paired with Aluzinc Plain trims for a residential greenhouse patio space. Completely immune to extreme elements and solar degradation.",
    roofArea: "2,500 sq ft",
    imageUrl: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=600&auto=format&fit=crop",
    duration: "2 Days",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-suburban-house-during-the-golden-hour-43012-large.mp4"
  }
];

export const TESTIMONIALS = [
  {
    quote: "I live in the UK and was very anxious about building my new home in East Legon. Zof Group was recommended to me, and they made the entire process stress-free! They coordinated the woodwork and selflock installations remotely, and kept me updated with pictures and videos of site supervision daily. Unbelievable professionalism!",
    author: "Kwame Mensah",
    role: "Homeowner",
    company: "UK Diaspora client",
    stars: 5,
  },
  {
    quote: "Their specialized consultancy and material selection service saved our business thousands of Cedis. They accurately analyzed the environment of our harbor warehouse and recommended RAW Aluminium Plain Sheets to completely combat salt-air corrosion. The precision steel trusses fit perfectly.",
    author: "Ing. Abigail Boateng",
    role: "Structural Engineer",
    company: "Tema Port Logistics Hub",
    stars: 5,
  },
  {
    quote: "Very reliable and honest. The woodwork carpentry and step tiles installations were performed with extreme precision. Transacting remotely was seamless, and their prices were transparent without any hidden surprises. Best premium roofing brand in Ghana!",
    author: "Emmanuel Nartey",
    role: "Project Developer",
    company: "Nartey Properties, Accra",
    stars: 5,
  }
];
