/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "tw";

export interface Translations {
  header: {
    guaranteedSeal: string;
    systemsMaterials: string;
    photoGallery: string;
    specialtyServices: string;
    eliteStandards: string;
    whyChooseUs: string;
    successShowcase: string;
    scopeBuilder: string;
    aiConsultant: string;
    callOffice: string;
    whatsappSupport: string;
    inspectionsEstimations: string;
    languageToggleLabel: string;
    twiActive: string;
    englishActive: string;
  };
  hero: {
    badge: string;
    titleMain: string;
    titleHighlight: string;
    subtitle: string;
    getEstimateBtn: string;
    exploreProfilesBtn: string;
    warrantyBadge: string;
    fabricationBadge: string;
    freeInspectionBadge: string;
    quickStats: {
      projectsDone: string;
      yearsWarranty: string;
      regionsCovered: string;
      zeroLeakRecord: string;
    };
  };
  materials: {
    tag: string;
    title: string;
    subtitle: string;
    selectProfile: string;
    specifications: string;
    advantages: string;
    idealFor: string;
    estimateForThis: string;
  };
  gallery: {
    tag: string;
    title: string;
    subtitle: string;
    allWorks: string;
  };
  counter: {
    title: string;
    subtitle: string;
    syncBtn: string;
  };
  proposals: {
    tag: string;
    title: string;
  };
  consultation: {
    tag: string;
    title: string;
  };
  chatbot: {
    title: string;
    subtitle: string;
  };
  footer: {
    tagline: string;
    rights: string;
  };
}

export const dictionary: Record<Language, Translations> = {
  en: {
    header: {
      guaranteedSeal: "Guaranteed Seal",
      systemsMaterials: "Systems & Materials",
      photoGallery: "Photo Gallery",
      specialtyServices: "Specialty Services",
      eliteStandards: "Elite Standards",
      whyChooseUs: "Why Choose Us",
      successShowcase: "Success Showcase",
      scopeBuilder: "Scope Builder",
      aiConsultant: "AI Consultant",
      callOffice: "Call Zof Office",
      whatsappSupport: "WhatsApp Support",
      inspectionsEstimations: "Inspections & Estimations",
      languageToggleLabel: "Language",
      twiActive: "🇬🇭 Twi",
      englishActive: "🇬BH EN",
    },
    hero: {
      badge: "Ghana's Premier Roofing Systems & Timber Trusses",
      titleMain: "Selflock® Zero-Leak Roofing &",
      titleHighlight: "Master Timber Carpentry",
      subtitle:
        "Engineered for West Africa's tropical monsoons. Concealed fasteners, certified high-tensile steel, timber trusses, and 15+ year leak-proof guarantee.",
      getEstimateBtn: "Get Instant Roof Estimate",
      exploreProfilesBtn: "Explore Roof Profiles",
      warrantyBadge: "15-Year Leak Warranty",
      fabricationBadge: "100% On-Site Fabrication",
      freeInspectionBadge: "Free Site Inspection",
      quickStats: {
        projectsDone: "Completed Roofs",
        yearsWarranty: "Zero-Leak Warranty",
        regionsCovered: "Ghana Regions",
        zeroLeakRecord: "Client Rating",
      },
    },
    materials: {
      tag: "Architectural Grade Roofing",
      title: "Engineering Excellence In Metal & Timber",
      subtitle:
        "Explore our precision-milled Selflock®, Step Tiles, IBR profiles, and treated timber trusses built to endure tropical coastal conditions.",
      selectProfile: "Select System Profile",
      specifications: "Technical Specifications",
      advantages: "Key Structural Advantages",
      idealFor: "Ideal Architectural Applications",
      estimateForThis: "Calculate Estimate For This Profile",
    },
    gallery: {
      tag: "Master Workmanship Showcase",
      title: "Verified Completed Projects In Ghana",
      subtitle:
        "Browse our HD portfolio of residential villas, commercial complexes, and industrial warehouses across all 16 regions of Ghana.",
      allWorks: "All Works",
    },
    counter: {
      title: "Total Completed Roofing Projects",
      subtitle:
        "Verified structural roof installations, timber carpentry trusses, step tiles, and waterproofing decks completed by ZOF Group.",
      syncBtn: "Sync Live Registry",
    },
    proposals: {
      tag: "Cost Calculation & Formal Invoicing",
      title: "Official Scope Proposal & Receipt Builder",
    },
    consultation: {
      tag: "Ghanaian Engineering Experts",
      title: "Book Free On-Site Inspection & Quote",
    },
    chatbot: {
      title: "ZOF AI Roofing Assistant",
      subtitle: "Ask any question about sheet gauges, timber treatment, or cost estimates in English or Twi.",
    },
    footer: {
      tagline: "Ghana's most trusted name in premium roofing sheets, timber trusses, and leak-proof waterproofing.",
      rights: "ZOF Roofing System. All rights reserved.",
    },
  },
  tw: {
    header: {
      guaranteedSeal: "Bɔ Bɔne Ma Wo",
      systemsMaterials: "Adan Siesie & Nneɛma",
      photoGallery: "Mfonini Mfididano",
      specialtyServices: "Som Titiriw",
      eliteStandards: "Nkyerɛkyerɛmu Mu Bɔne",
      whyChooseUs: "Adagya a Ɛyɛ Yɛn",
      successShowcase: "Nkunimdi Kyerɛ",
      scopeBuilder: "Siesie Bɔ Kodu",
      aiConsultant: "AI Afotufo",
      callOffice: "Frɛ Zof Bɛɛmae",
      whatsappSupport: "WhatsApp Mmoa",
      inspectionsEstimations: "Inspɛkyin & Boɔ Bɔ",
      languageToggleLabel: "Kasa",
      twiActive: "🇬🇭 Twi",
      englishActive: "🇬🇧 EN",
    },
    hero: {
      badge: "Ghana Dan Dan Siesie & Nsɛm Mfididano Kunini",
      titleMain: "Selflock® Nsuo Nse-Ase Dan Dan Siesie &",
      titleHighlight: "Nsɛm Mfididano Pa",
      subtitle:
        "W'asiesie ama West Africa nsuo ne mframa den. Nsɛm a ɛnsɛe, dadi a ɛyɛ den, mfeɛ 15+ nsuo nse-ase bɔhyɛ ma wo dan.",
      getEstimateBtn: "Nnya Wo Dan Boɔ Seesei",
      exploreProfilesBtn: "Hwɛ Dan Nneɛma Ahodoɔ",
      warrantyBadge: "Mfeɛ 15 Nsuo Nse-Ase Bɔhyɛ",
      fabricationBadge: "100% W'asiesie Wɔ Hɔ Ara",
      freeInspectionBadge: "Inspɛkyin Kwa Wɔ Dan Mu",
      quickStats: {
        projectsDone: "Dan a Yie Wiei",
        yearsWarranty: "Nsuo Nse-Ase Mfeɛ",
        regionsCovered: "Ghana Mantam",
        zeroLeakRecord: "Gyidi Nkasa",
      },
    },
    materials: {
      tag: "Dan Dan Nneɛma Pa",
      title: "Mfididano Pa Wɔ Dadi & Nsɛm Mu",
      subtitle:
        "Hwɛ Selflock®, Step Tiles, IBR ne Nsɛm Mfididano a y'asiesie ama Ghana wim mu tebea.",
      selectProfile: "Paw Dan Profile",
      specifications: "Mfididano Nkyerɛkyerɛmu",
      advantages: "Mmoa Titiriw",
      idealFor: "Fata Ma Dan Ahodoɔ",
      estimateForThis: "Bɔ Boɔ Ma Dan Profile Yi",
    },
    gallery: {
      tag: "Yɛn Nsa Ano Adwuma Mfonini",
      title: "Dan a Ya-Wie Wɔ Ghana Mantam Mu",
      subtitle:
        "Hwɛ yɛn mfonini pa a ɛkyerɛ afie, dwumadibea, ne adan akeseɛ a ya-siesie wɔ Ghana amansan mu.",
      allWorks: "Nneɛma Nyinaa",
    },
    counter: {
      title: "Nneɛma a Ya-Wie Dan Dan Siesie Nyinaa",
      subtitle:
        "ZOF Group wiesie adan mu siesie, nsɛm mfididano, step tiles, ne nsuo banbɔ adwuma nyinaa.",
      syncBtn: "Kyerɛ Nneɛma Foforɔ",
    },
    proposals: {
      tag: "Boɔ Bɔ & Nkrataa Pa",
      title: "Nkrataa Pa & Boɔ Krataa Siesie",
    },
    consultation: {
      tag: "Ghana Mfididano Mpanimfoɔ",
      title: "Frɛ Yɛn Ama Inspɛkyin Kwa Wɔ Wo Dan Mu",
    },
    chatbot: {
      title: "ZOF AI Mfididano Mmoafoɔ",
      subtitle: "Bisa biribiara fa dadi den, nsɛm siesie, anaa boɔ bɔ ho wɔ English anaa Twi mu.",
    },
    footer: {
      tagline: "Ghana adan dan siesie, nsɛm mfididano ne nsuo banbɔ kunini a ahotosoɔ wo mu.",
      rights: "ZOF Roofing System. Hwee nni hɔ a emudwo.",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "tw" : "en"));
  };

  const t = dictionary[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
