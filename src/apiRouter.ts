import express from "express";
import { GoogleGenAI } from "@google/genai";
import { RoofType, RoofPitch, EstimateInput, EstimateResult } from "./types.js";
import { 
  generateSequentialInvoiceNumber, 
  isSequentialInvoiceId, 
  generateSequentialProformaRef,
  formatProformaRef,
  isProformaRef
} from "./utils/invoiceUtils.js";

const router = express.Router();

// Lazy-loaded Gemini initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined. Please add it via the Settings > Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Local in-memory store for consultation submissions with seeded entries
const consultations: any[] = [
  {
    id: "ROOF-782910",
    fullName: "Mr. Emmanuel Kwasi Osei",
    email: "emmanuel.osei@yahoo.com",
    phone: "+233 24 286 6658",
    city: "Accra",
    preferredDate: "2026-08-18",
    roofCondition: "leaking",
    undertakings: ["Free Estimate", "Woodwork", "Project Supervision"],
    notes: "Requires complete timber truss inspection and 0.50mm Selflock interlocking installation for 2,400 sq ft deck in East Legon.",
    timestamp: "2026-08-12T14:30:00.000Z",
    status: "pending",
    estimateDetails: {
      propertyType: "residential",
      roofType: "selflock",
      areaSqFt: 2400,
      pitch: "standard",
      tearOffLayers: 1,
      includeGutters: true,
      includeGutterGuards: false,
      premiumInsulation: true,
      totalEstimatedMin: 48200,
      totalEstimatedMax: 53900,
      baseMaterialCost: 288000,
      laborCost: 124200,
      tearOffCost: 36000,
      addOnCost: 19600
    }
  },
  {
    id: "ROOF-451928",
    fullName: "Dr. Abena Mensah",
    email: "abena.mensah@gmail.com",
    phone: "+233 50 123 9876",
    city: "Kumasi",
    preferredDate: "2026-08-22",
    roofCondition: "storm_damage",
    undertakings: ["Free Estimate", "Consultancy"],
    notes: "Storm damage on Airport Residential property. Interested in Step Tiles profile with Mediterranean aesthetic and treated timber trusses.",
    timestamp: "2026-08-11T09:15:00.000Z",
    status: "reviewed",
    estimateDetails: {
      propertyType: "residential",
      roofType: "step_tiles",
      areaSqFt: 3100,
      pitch: "standard",
      tearOffLayers: 0,
      includeGutters: true,
      includeGutterGuards: true,
      premiumInsulation: true,
      totalEstimatedMin: 65400,
      totalEstimatedMax: 73200,
      baseMaterialCost: 356500,
      laborCost: 150000,
      tearOffCost: 0,
      addOnCost: 22000
    }
  },
  {
    id: "ROOF-992301",
    fullName: "Kofi Owusu Holdings",
    email: "kofi.owusu@holdings.com.gh",
    phone: "+233 27 889 0012",
    city: "Tema",
    preferredDate: "2026-08-25",
    roofCondition: "old_aged",
    undertakings: ["Free Estimate", "Woodwork", "Consultancy", "Project Supervision"],
    notes: "Commercial industrial warehouse complex roof renovation. Wants heavy duty IBR 0.55mm longspan corrugated sheeting with coastal anti-saline coating.",
    timestamp: "2026-08-10T16:45:00.000Z",
    status: "pending",
    estimateDetails: {
      propertyType: "commercial",
      roofType: "ibr",
      areaSqFt: 5200,
      pitch: "flat",
      tearOffLayers: 1,
      includeGutters: true,
      includeGutterGuards: false,
      premiumInsulation: false,
      totalEstimatedMin: 112000,
      totalEstimatedMax: 125000,
      baseMaterialCost: 494000,
      laborCost: 182000,
      tearOffCost: 78000,
      addOnCost: 18000
    }
  }
];

// Expert Roofing Estimation Logic API
router.post("/estimate", (req, res) => {
  try {
    const input: EstimateInput = req.body;
    const {
      propertyType,
      roofType,
      areaSqFt,
      pitch,
      tearOffLayers,
      includeGutters,
      includeGutterGuards,
      premiumInsulation,
    } = input;

    if (!areaSqFt || areaSqFt < 5) {
      return res.status(400).json({ error: "Invalid area. Area must be at least 5 square feet." });
    }

    // Baseline Costs per Sq Ft in GHC
    let baseMaterialRate = 0;
    let baseLaborRate = 0;
    let warrantyPeriodYears = 15;
    let efficiencyRating = "Standard Thermal Defense";

    switch (roofType) {
      case RoofType.SELFLOCK:
        baseMaterialRate = 120.00;
        baseLaborRate = 45.00;
        warrantyPeriodYears = 50;
        efficiencyRating = "Concealed fastener, zero-nails exposed 100% leak-proof lock panel";
        break;
      case RoofType.IBR:
        baseMaterialRate = 95.00;
        baseLaborRate = 35.00;
        warrantyPeriodYears = 40;
        efficiencyRating = "Inverted Box Rib high-spanning, optimized storm drainage profile";
        break;
      case RoofType.IDT:
        baseMaterialRate = 100.00;
        baseLaborRate = 38.00;
        warrantyPeriodYears = 45;
        efficiencyRating = "Industrial deep trough valleys constructed for extreme downpours";
        break;
      case RoofType.STEP_TILES:
        baseMaterialRate = 115.00;
        baseLaborRate = 42.00;
        warrantyPeriodYears = 50;
        efficiencyRating = "Premium lightweight Mediterranean architectural profile tiles";
        break;
      case RoofType.ALUMINIUM_PLAIN:
        baseMaterialRate = 145.00;
        baseLaborRate = 50.00;
        warrantyPeriodYears = 60;
        efficiencyRating = "Raw marine-grade solid pure plain aluminium, 100% corrosion-free";
        break;
      case RoofType.GALVANIZE:
        baseMaterialRate = 75.00;
        baseLaborRate = 30.00;
        warrantyPeriodYears = 35;
        efficiencyRating = "Passivated zinc-coated high-tensile structural steel sheeting";
        break;
      case RoofType.TRANSPARENT_SHEETS:
        baseMaterialRate = 65.00;
        baseLaborRate = 25.00;
        warrantyPeriodYears = 20;
        efficiencyRating = "UV-stabilized surgical polycarbonate natural light harvesting sheets";
        break;
      case RoofType.ALUZINC_PLAIN:
        baseMaterialRate = 110.00;
        baseLaborRate = 40.00;
        warrantyPeriodYears = 55;
        efficiencyRating = "Aluminium-Zinc double coat coastal-resistant plain alloy";
        break;
    }

    // Pitch modifier (steeper roofs require advanced safety and rigging)
    let pitchMod = 1.0;
    if (pitch === RoofPitch.STANDARD) {
      pitchMod = 1.15;
    } else if (pitch === RoofPitch.STEEP) {
      pitchMod = 1.45;
    }

    // Material Subtotal
    const baseMaterialCost = areaSqFt * baseMaterialRate;
    // Labor Subtotal modified by roof pitch
    const laborCost = areaSqFt * baseLaborRate * pitchMod;

    // Tear-off or land-prep costs (15.00 GHC per layer per sq ft)
    const tearOffCost = areaSqFt * 15.00 * tearOffLayers;

    // Side attachments (linear footage approximated dynamically from square-root dimension of rectangular footprint)
    const perimeterLinearFt = Math.round(4 * Math.sqrt(areaSqFt) * 0.95);
    let addOnCost = 0;

    if (includeGutters) {
      addOnCost += perimeterLinearFt * 85.00; // 85.00 GHC per linear foot seamless aluminum gutter systems
    }
    if (includeGutterGuards) {
      addOnCost += perimeterLinearFt * 40.00; // 40.00 GHC per linear foot filter protection
    }
    if (premiumInsulation) {
      addOnCost += areaSqFt * 25.00; // heat defense layers
    }

    // Range formulation with strict clamps between GHC 100 and GHC 1,000
    const rawTotalMin = baseMaterialCost + laborCost + tearOffCost + addOnCost;
    const totalEstimatedMin = Math.round(Math.max(100, Math.min(1000, rawTotalMin)));
    const totalEstimatedMax = Math.round(Math.max(100, Math.min(1000, totalEstimatedMin * 1.12)));

    // Installation duration estimates
    let estimatedDurationDays = "2-3 Days";
    if (areaSqFt > 5000) {
      estimatedDurationDays = "5-8 Days";
    } else if (areaSqFt > 3000) {
      estimatedDurationDays = "3-5 Days";
    } else if (roofType === RoofType.SELFLOCK) {
      estimatedDurationDays = "2-4 Days (Lock panel interlocking installation window)";
    }

    const result: EstimateResult = {
      baseMaterialCost,
      laborCost,
      tearOffCost,
      addOnCost,
      totalEstimatedMin,
      totalEstimatedMax,
      efficiencyRating,
      warrantyPeriodYears,
      estimatedDurationDays,
    };

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Consultation Booking Form submit API
router.post("/consultation", (req, res) => {
  try {
    const booking = req.body;
    if (!booking.fullName || !booking.email || !booking.phone) {
      return res.status(400).json({ error: "Missing required contact details." });
    }

    const newBooking = {
      ...booking,
      id: "ROOF-" + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    consultations.push(newBooking);

    // Send positive simulated success response with detailed scheduling next steps
    res.json({
      success: true,
      booking: newBooking,
      message: `Thank you, ${booking.fullName}! Your free roof inspection and consultation request has been logged successfully. A premium representative from Zof Group will contact you at ${booking.phone} within 24 business hours to finalize setup. We support nationwide delivery and remote coordination! Booking reference: ${newBooking.id}`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get active consultation lists
router.get("/consultation/list", (req, res) => {
  // Ensure every consultation has an isArchived property
  const normalized = consultations.map(c => ({
    ...c,
    isArchived: c.isArchived ?? false
  }));
  res.json(normalized);
});

// Archive multiple consultations in bulk
router.post("/consultation/archive-batch", (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ error: "Invalid request payload. Array of IDs required." });
  }

  let archivedCount = 0;
  ids.forEach(id => {
    const consultation = consultations.find(c => c.id === id);
    if (consultation) {
      consultation.isArchived = true;
      archivedCount++;
    }
  });

  res.json({ success: true, archivedCount });
});

// Restore multiple consultations in bulk
router.post("/consultation/restore-batch", (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ error: "Invalid request payload. Array of IDs required." });
  }

  let restoredCount = 0;
  ids.forEach(id => {
    const consultation = consultations.find(c => c.id === id);
    if (consultation) {
      consultation.isArchived = false;
      restoredCount++;
    }
  });

  res.json({ success: true, restoredCount });
});

// Delete a single consultation
router.delete("/consultation/:id", (req, res) => {
  const { id } = req.params;
  const index = consultations.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Consultation not found" });
  }
  consultations.splice(index, 1);
  res.json({ success: true, id });
});

// Delete multiple consultations in bulk
router.post("/consultation/delete-batch", (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ error: "Invalid request payload. Array of IDs required." });
  }
  
  let deletedCount = 0;
  ids.forEach(id => {
    const idx = consultations.findIndex(c => c.id === id);
    if (idx > -1) {
      consultations.splice(idx, 1);
      deletedCount++;
    }
  });

  res.json({ success: true, deletedCount });
});

// AI Roofing Expert Chat Assistant using Gemini
router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request payload. Array of messages is required." });
    }

    // System prompt introducing Accra-based Zof Group.
    const systemPrompt = `You are "ZOF AI", the helpful, friendly, and expert roofing virtual consultant for Zof Group.
Your headquarters office is located at 45 Industrial Close, Accra, Ghana.
You serve clients in Accra, Kumasi, Tema, Koforidua, Takoradi, Cape Coast, and across all regions of Ghana. You also coordinate with diaspora clients (living abroad in the UK, USA, Europe) who are building projects back home in Ghana (e.g., East Legon).

Key insights about Zof Group:
1. Slogans: "EXPERTISE YOU CAN TRUST" and "PROUDLY LOCAL. GLOBALLY COMPETENT."
2. Core & Expansion Services:
   - Woodwork & Carpentry / Heavy Structural Steel Trusses
   - Expert Consultancy & Material Selection
   - Project Management & Remote Supervision for Diaspora Clients
   - Ceiling & Interior Finishing: Premium POP ceilings, Gypsum boards, PVC ceilings (acting as a full "top-to-interior finishing contractor")
   - Waterproofing & Leak Repair Specialist: Roof leak repair, wall damp-proofing, concrete roof sealing (ideal for resolving moisture rot and tropical rain issues in Ghana)
   - Metal Fabrication: Seamless custom-fitted gutters, downpipes, ridges, flashings built directly on-site for optimal margins and lifetime alignment
   - Solar Panel Installation: Safe bracket mount preps on metal sheets preserving anti-leak warranties
   - Building Materials Supply: Direct-to-client factory-priced raw material sheeting and logs
   - Painting & Exterior Finishing: UV reflective roof spray, weather-shield painting, wall protective coat alignment
   - Small Construction & Renovation: Home vertical expansions, adding rooms or terrasse setups
3. 🔥 Smart Combo Business Model: Encourage clients to bundle Roofing + Ceiling + Waterproofing + Painting. Pitch this combo hard because it provides a 15% bundle discount, coordinates all schedules concurrently under one premium overseer, eliminates unverified sub-contractor overlapping mistakes, and unlocks our Unified 50-Year combined warranty!
4. Roofing Profiles we provide:
   - SELFLOCK: Concealed fastener lock system (completely nail-free exterior, preventing oxidation and water leak entries entirely).
   - IBR: Classic high-spanning Inverted Box Rib sheets, highly efficient for rapid rainwater drainage and long spans.
   - IDT: Industrial deep trough sheets suited for flatter pitches and handling immense monsoon rainwater discharge.
   - STEP TILES: Premium Mediterranean-style step tile metal profiling, emulating the look of classic clay tiles with lightweight alloy integrity.
   - ALUMINIUM PLAIN: Raw marine-grade plain solid aluminium sheets that never rust—superb for coastal environments.
   - GALVANIZE: Zinc-passivated high-tensile corrugated steel sheets offering excellent economic impact rating.
   - TRANSPARENT SHEETS: UV-stabilized surgical polycarbonate sheets for natural day-lighting corridors, greenhouse portals, and patios.
   - ALUZINC PLAIN: Advanced aluminium-zinc dual alloy coating, lasting up to 4 times longer than secondary galvanized metals under high coastal humidity.
4. Colors: Deep Ocean, Cottage Green, Headland Red, Woodland Gray, Manor Red, Loft, Jasper, Vibrant Red.
5. Location knowledge: Accra/Ghana. The environment features high tropical sun, sea moisture/salt spray (especially around Accra/Tema), and torrential seasonal rains. Promoting rust-proof plain aluminium or lock systems is highly persuasive.
6. Communication guidelines: Be polite, concise, structured, and helpful. Always encourage the customer to schedule a free inspection & remote coordination setup by filling out the form, calling 0242 866 658, or messaging us instantly on WhatsApp at +233 (0) 54 633 1603 (https://wa.me/233546331603). Make sure to highlight that we are ready to assist them from anywhere in the world! Encourage them to try our interactive Scope & Receipt Builder on this page.`;

    const chatHistory = messages.map((m: any) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    // Inject system instruction in historical representation or in prompt context
    // Our @google/genai SDK requires compiling model prompts.
    let client;
    try {
      client = getGeminiClient();
    } catch (err: any) {
      // Return a very friendly mock helper with direct notification if API key is not yet configured,
      // so the dev server starts and serves client experience, avoiding full page failures.
      return res.json({
        text: "Hi there! I am ZOF AI, your roofing expert helper. It looks like the `GEMINI_API_KEY` is not yet loaded in this environment's secrets panel, but I am happy to assist you in demo mode!\n\nWhether you need help choosing between our advanced Selflock concealed-fastener profile, classic high-drainage IBR trapezoidal sheeting, Mediterranean Step Tiles, or rust-resistant raw Aluminium Plain sheets, I can guide you. Kindly try my interactive Scope & Receipt Builder below!",
      });
    }

    // Format chat contents according to Chats creation interface
    const chat = client.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      history: chatHistory.slice(0, -1), // use preceding chats as historical background
    });

    const lastMessage = messages[messages.length - 1];
    const response = await chat.sendMessage({
      message: lastMessage.text,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Local in-memory store for invoices with pre-seeded data for branch audit and restore
const invoices: any[] = [
  {
    id: "ZOF-PRO-2026-001",
    proformaRef: "nzinv0001/01/26",
    branch: "Accra Head Office",
    docMode: "proforma",
    customerName: "Kojo Afriyie Enterprises",
    customerPhone: "+233 24 456 7890",
    customerLocation: "Dzorwulu, Accra",
    items: [
      { id: "1", name: "0.50mm Selflock Aluzinc Roofing Sheet", description: "Wine Red profile, interlocking, concealed lock", quantity: 180, unitPrice: 125.00, lengthMeters: "6m" },
      { id: "2", name: "Treated Mahogany Timber Trusses", description: "2x4 and 2x6 high-strength structural roof support", quantity: 90, unitPrice: 85.00 }
    ],
    subtotal: 30150,
    discountPercent: 5,
    installationCost: 4500,
    transportCost: 1500,
    applyTax: true,
    totalAmount: 41496,
    timestamp: "2026-08-11T16:20:00.000Z",
    status: "pending_approval",
    preparedBy: "Samson K.",
    approvedBy: "F. O. Dugbazah MD"
  },
  {
    id: "ZOF-REC-2026-002",
    proformaRef: "nzinv0002/01/26",
    branch: "Kumasi Branch",
    docMode: "receipt",
    customerName: "Madam Faustina Osei",
    customerPhone: "+233 20 811 2233",
    customerLocation: "Ahodwo, Kumasi",
    items: [
      { id: "1", name: "0.50mm Step Tiles Charcoal Grey Sheeting", description: "Lightweight Mediterranean alloy style", quantity: 120, unitPrice: 115.00 }
    ],
    subtotal: 13800,
    discountPercent: 0,
    installationCost: 2800,
    transportCost: 800,
    applyTax: false,
    totalAmount: 17400,
    timestamp: "2026-08-12T11:45:00.000Z",
    status: "approved",
    preparedBy: "Prince A.",
    approvedBy: "F. O. Dugbazah MD"
  },
  {
    id: "ZOF-PRO-2026-003",
    branch: "Tema Coastal Hub",
    docMode: "proposal",
    customerName: "Dr. Arthur Kennedy",
    customerPhone: "+233 55 900 1122",
    customerLocation: "Community 12, Tema",
    items: [
      { id: "1", name: "0.55mm Marine Aluminium Plain Sheets", description: "High-saline coastal anti-rust warranty, Mill Finish", quantity: 210, unitPrice: 145.00 }
    ],
    subtotal: 30450,
    discountPercent: 10,
    installationCost: 5000,
    transportCost: 1200,
    applyTax: true,
    totalAmount: 40995,
    timestamp: "2026-08-13T09:10:00.000Z",
    status: "pending_approval",
    preparedBy: "Esther M.",
    approvedBy: "F. O. Dugbazah MD"
  },
  // Historical Approved Invoices for 2026 dynamic chart display
  {
    id: "ZOF-REC-2026-010",
    branch: "Accra Head Office",
    docMode: "receipt",
    customerName: "Akwasi Boakye Res.",
    customerPhone: "+233 24 999 1111",
    customerLocation: "East Legon, Accra",
    items: [{ id: "1", name: "0.50mm Selflock Wine Red Sheets", description: "Concealed fastener panels", quantity: 300, unitPrice: 125.00 }],
    subtotal: 37500,
    totalAmount: 45000,
    timestamp: "2026-01-15T10:00:00.000Z",
    status: "approved",
    preparedBy: "Samson K.",
    approvedBy: "F. O. Dugbazah MD"
  },
  {
    id: "ZOF-REC-2026-020",
    branch: "Kumasi Branch",
    docMode: "receipt",
    customerName: "Osei Kyeremeh Plaza",
    customerPhone: "+233 20 777 2222",
    customerLocation: "Adum, Kumasi",
    items: [{ id: "1", name: "0.55mm IBR Industrial Sheeting", description: "Longspan high-spanning box rib", quantity: 400, unitPrice: 95.00 }],
    subtotal: 38000,
    totalAmount: 52000,
    timestamp: "2026-02-20T14:30:00.000Z",
    status: "approved",
    preparedBy: "Prince A.",
    approvedBy: "F. O. Dugbazah MD"
  },
  {
    id: "ZOF-REC-2026-030",
    branch: "Tema Coastal Hub",
    docMode: "receipt",
    customerName: "Naa Shormey Cold Store",
    customerPhone: "+233 55 555 3333",
    customerLocation: "Harbour Area, Tema",
    items: [{ id: "1", name: "0.55mm Marine Aluminium Plain Sheets", description: "Rust-proof coastal alloy", quantity: 400, unitPrice: 145.00 }],
    subtotal: 58000,
    totalAmount: 68000,
    timestamp: "2026-03-22T11:15:00.000Z",
    status: "approved",
    preparedBy: "Esther M.",
    approvedBy: "F. O. Dugbazah MD"
  },
  {
    id: "ZOF-REC-2026-040",
    branch: "Accra Head Office",
    docMode: "receipt",
    customerName: "Pastor Mensa Otabil Villa",
    customerPhone: "+233 24 111 4444",
    customerLocation: "Trassaco, Accra",
    items: [{ id: "1", name: "Premium Step Tiles Aluzinc", description: "Woodland Grey premium texture", quantity: 500, unitPrice: 115.00 }],
    subtotal: 57500,
    totalAmount: 85000,
    timestamp: "2026-04-18T16:00:00.000Z",
    status: "approved",
    preparedBy: "Samson K.",
    approvedBy: "F. O. Dugbazah MD"
  },
  {
    id: "ZOF-REC-2026-050",
    branch: "Diaspora Remote Desk",
    docMode: "receipt",
    customerName: "Ing. Charles Appiah (UK)",
    customerPhone: "+44 7911 123456",
    customerLocation: "Koforidua Hills",
    items: [{ id: "1", name: "0.50mm Selflock Interlocking Sheets", description: "Concealed lock panels", quantity: 600, unitPrice: 125.00 }],
    subtotal: 75000,
    totalAmount: 92000,
    timestamp: "2026-05-25T09:00:00.000Z",
    status: "approved",
    preparedBy: "Esther M.",
    approvedBy: "F. O. Dugbazah MD"
  },
  {
    id: "ZOF-REC-2026-060",
    branch: "Accra Head Office",
    docMode: "receipt",
    customerName: "Dr. Kwabena Duffour Estate",
    customerPhone: "+233 24 222 5555",
    customerLocation: "Airport Residential, Accra",
    items: [{ id: "1", name: "0.55mm Marine Aluminium Plain Sheets", description: "Mill Finish premium rust-free panels", quantity: 600, unitPrice: 145.00 }],
    subtotal: 87000,
    totalAmount: 110000,
    timestamp: "2026-06-14T10:30:00.000Z",
    status: "approved",
    preparedBy: "Samson K.",
    approvedBy: "F. O. Dugbazah MD"
  },
  {
    id: "ZOF-REC-2026-070",
    branch: "Kumasi Branch",
    docMode: "receipt",
    customerName: "Otumfuo Heritage Pavilion",
    customerPhone: "+233 20 333 6666",
    customerLocation: "Manhyia Palace, Kumasi",
    items: [{ id: "1", name: "0.50mm Step Tiles Charcoal Grey", description: "Lightweight Mediterranean alloy style", quantity: 700, unitPrice: 115.00 }],
    subtotal: 80500,
    totalAmount: 125000,
    timestamp: "2026-07-09T15:20:00.000Z",
    status: "approved",
    preparedBy: "Prince A.",
    approvedBy: "F. O. Dugbazah MD"
  }
];

// Local in-memory audit log store
const auditLogs: any[] = [
  {
    id: "LOG-001",
    action: "system_initialized",
    invoiceId: "SYSTEM",
    details: "ZOF Roofing Systems Corporate Portal and Security Engine Initialized.",
    timestamp: "2026-08-10T10:00:00.000Z",
    operator: "System Core"
  },
  {
    id: "LOG-002",
    action: "status_change",
    invoiceId: "ZOF-REC-2026-010",
    details: "Invoice ZOF-REC-2026-010 approved automatically on initial ledger load.",
    timestamp: "2026-08-12T11:45:00.000Z",
    operator: "F. O. Dugbazah MD"
  }
];

// List all generated invoices
router.get("/invoices", (req, res) => {
  res.json(invoices);
});

// GET all audit logs
router.get("/audit-logs", (req, res) => {
  res.json(auditLogs);
});

// GET next sequential proforma reference (nzinv0001/MM/YY, nzinv0002/MM/YY, nzinv0003/MM/YY, etc.)
router.get("/invoices/next-proforma-ref", (req, res) => {
  try {
    const targetDate = req.query.date ? String(req.query.date) : new Date().toISOString();
    const nextRef = generateSequentialProformaRef(invoices, targetDate);
    res.json({ success: true, nextRef });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Save or generate a new invoice
router.post("/invoices", (req, res) => {
  try {
    const doc = req.body;
    if (!doc.customerName) {
      return res.status(400).json({ error: "Customer name is required to log invoice." });
    }

    // Determine if the incoming ID is a non-sequential draft ID
    const needsSequentialId = !doc.id || !isSequentialInvoiceId(doc.id);
    const finalId = needsSequentialId
      ? generateSequentialInvoiceNumber(invoices, doc.docMode)
      : doc.id;

    // Automatic or preserved proforma reference
    let proformaRef = doc.proformaRef;
    if (doc.docMode === "proforma") {
      if (!proformaRef || !isProformaRef(proformaRef)) {
        proformaRef = generateSequentialProformaRef(invoices, doc.timestamp || new Date());
      }
    }

    const newInvoice = {
      ...doc,
      id: finalId,
      proformaRef: proformaRef || doc.proformaRef,
      timestamp: doc.timestamp || new Date().toISOString(),
      status: doc.status || "pending_approval",
      printStatus: doc.printStatus || "not_printed"
    };

    // Remove duplicates if same ID exists (update or save)
    const existingIdx = invoices.findIndex(inv => inv.id === newInvoice.id);
    let logMessage = "";
    if (existingIdx > -1) {
      invoices[existingIdx] = newInvoice;
      logMessage = `Updated invoice details for ${newInvoice.customerName} (${newInvoice.id}${newInvoice.proformaRef ? ` / Ref: ${newInvoice.proformaRef}` : ""}).`;
    } else {
      invoices.unshift(newInvoice);
      logMessage = `Created new draft invoice for ${newInvoice.customerName} (${newInvoice.id}${newInvoice.proformaRef ? ` / Ref: ${newInvoice.proformaRef}` : ""}).`;
    }

    // Add audit log
    auditLogs.unshift({
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      action: existingIdx > -1 ? "invoice_updated" : "invoice_created",
      invoiceId: newInvoice.id,
      details: logMessage,
      timestamp: new Date().toISOString(),
      operator: doc.preparedBy || "Staff Member"
    });

    res.json({ success: true, invoice: newInvoice });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Approve invoice for payment
router.post("/invoices/:id/approve", (req, res) => {
  const { id } = req.params;
  const invoice = invoices.find(inv => inv.id === id);
  if (!invoice) {
    return res.status(404).json({ error: "Invoice not found" });
  }

  const oldId = invoice.id;
  // If the invoice does not already have a sequential ID, generate one on approval
  if (!isSequentialInvoiceId(oldId)) {
    const sequentialId = generateSequentialInvoiceNumber(invoices, invoice.docMode);
    invoice.id = sequentialId;

    // Log the re-sequencing action in audit logs
    auditLogs.unshift({
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      action: "invoice_reassigned",
      invoiceId: sequentialId,
      details: `Reassigned draft estimate ID ${oldId} to sequential invoice number ${sequentialId} on approval.`,
      timestamp: new Date().toISOString(),
      operator: "F. O. Dugbazah MD"
    });
  }

  invoice.status = "approved";

  // Add approval audit log
  auditLogs.unshift({
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    action: "invoice_approved",
    invoiceId: invoice.id,
    details: `Invoice for ${invoice.customerName} (${invoice.id}) officially approved for payment clearance.`,
    timestamp: new Date().toISOString(),
    operator: "F. O. Dugbazah MD"
  });

  res.json({ success: true, invoice });
});

// Reject/Flag invoice
router.post("/invoices/:id/reject", (req, res) => {
  const { id } = req.params;
  const invoice = invoices.find(inv => inv.id === id);
  if (!invoice) {
    return res.status(404).json({ error: "Invoice not found" });
  }
  invoice.status = "rejected";

  // Add audit log
  auditLogs.unshift({
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    action: "invoice_rejected",
    invoiceId: id,
    details: `Invoice for ${invoice.customerName} (${id}) rejected and flagged back to draft.`,
    timestamp: new Date().toISOString(),
    operator: "F. O. Dugbazah MD"
  });

  res.json({ success: true, invoice });
});

// Mark invoice as printed in registry
router.post("/invoices/:id/print", (req, res) => {
  const { id } = req.params;
  const invoice = invoices.find(inv => inv.id === id);
  if (!invoice) {
    return res.status(404).json({ error: "Invoice not found" });
  }

  invoice.printStatus = "printed";

  // Add audit log
  auditLogs.unshift({
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    action: "invoice_printed",
    invoiceId: invoice.id,
    details: `Invoice/Receipt for ${invoice.customerName} (${invoice.id}) sent to printer / PDF export layout prepared.`,
    timestamp: new Date().toISOString(),
    operator: invoice.preparedBy || "Staff Member"
  });

  res.json({ success: true, invoice });
});

// Delete or void an invoice
router.delete("/invoices/:id", (req, res) => {
  const { id } = req.params;
  const index = invoices.findIndex(inv => inv.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Invoice not found" });
  }
  const deletedInvoice = invoices[index];
  invoices.splice(index, 1);

  // Add audit log
  auditLogs.unshift({
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    action: "invoice_deleted",
    invoiceId: id,
    details: `Invoice for ${deletedInvoice.customerName} (${id}) permanently deleted/voided from system registry.`,
    timestamp: new Date().toISOString(),
    operator: "F. O. Dugbazah MD"
  });

  res.json({ success: true, id });
});

// Local in-memory newsletter store
const newsletterSignups: any[] = [
  {
    email: "kwame.mensah@gmail.com",
    timestamp: "2026-08-28T09:12:00.000Z",
    source: "Rainy Season Roof Maintenance Tips"
  },
  {
    email: "efua.boateng@outlook.com",
    timestamp: "2026-08-30T15:45:00.000Z",
    source: "Rainy Season Roof Maintenance Tips"
  }
];

// Newsletter sign up route
router.post("/newsletter/signup", (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  const normalized = email.trim().toLowerCase();
  const exists = newsletterSignups.some(s => s.email === normalized);
  if (!exists) {
    newsletterSignups.unshift({
      email: normalized,
      timestamp: new Date().toISOString(),
      source: "Rainy Season Roof Maintenance Tips"
    });
  }

  res.json({ 
    success: true, 
    message: "Thank you! You have successfully subscribed to ZOF Group's Rainy Season Roof Maintenance Tips newsletter." 
  });
});

// Get newsletter signups
router.get("/newsletter/list", (req, res) => {
  res.json(newsletterSignups);
});

// Helper for WMO weather codes
function getConditionFromCode(code: number): { condition: string; isRaining: boolean; isThunderstorm: boolean } {
  if (code === 0) return { condition: "Clear Sky", isRaining: false, isThunderstorm: false };
  if (code === 1 || code === 2) return { condition: "Partly Cloudy", isRaining: false, isThunderstorm: false };
  if (code === 3) return { condition: "Overcast & Humid", isRaining: false, isThunderstorm: false };
  if (code === 45 || code === 48) return { condition: "Coastal Mist & Fog", isRaining: false, isThunderstorm: false };
  if (code >= 51 && code <= 55) return { condition: "Light to Moderate Drizzle", isRaining: true, isThunderstorm: false };
  if (code >= 61 && code <= 65) return { condition: "Tropical Rain Showers", isRaining: true, isThunderstorm: false };
  if (code === 66 || code === 67) return { condition: "Heavy Coastal Downpour", isRaining: true, isThunderstorm: false };
  if (code >= 80 && code <= 82) return { condition: "Sudden Torrential Downpour", isRaining: true, isThunderstorm: false };
  if (code >= 95) return { condition: "Severe Tropical Thunderstorm", isRaining: true, isThunderstorm: true };
  return { condition: "Cloudy & Humid", isRaining: code > 50, isThunderstorm: code >= 95 };
}

// Generate dynamic rainy season defense tips based on live/simulated Accra climate
function generateRainySeasonDefense(params: {
  temp: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  condition: string;
}) {
  const { temp, humidity, precipitation, weatherCode, condition } = params;
  const isRaining = weatherCode >= 51 || precipitation > 0.2;
  const isHighHumidity = humidity >= 72;
  const isThunderstorm = weatherCode >= 95;

  let alertLevel: "critical_rain" | "rain_alert" | "high_humidity" | "favorable" = "favorable";
  let alertTitle = "Optimal Dry Window — Ideal for Preventive Roof Maintenance";
  let alertSummary = "Favorable weather across Greater Accra. The perfect time to inspect gutters, clear debris, and reinforce flashings before storm surges.";

  if (isThunderstorm || (isRaining && precipitation >= 3)) {
    alertLevel = "critical_rain";
    alertTitle = "⚠️ Active Storm & Downpour in Greater Accra";
    alertSummary = `Heavy rain detected (${precipitation.toFixed(1)}mm/h). Immediate attention recommended for valley flashings, concealed clip integrity, and downpipe discharge points.`;
  } else if (isRaining) {
    alertLevel = "rain_alert";
    alertTitle = "🌧️ Active Rainfall Alert in Accra";
    alertSummary = `Current rain precipitation (${precipitation.toFixed(1)}mm). Protect eaves and ceiling boards against seepage around old screw points.`;
  } else if (isHighHumidity) {
    alertLevel = "high_humidity";
    alertTitle = "💧 High Coastal Humidity Alert (Accra & Tema Zone)";
    alertSummary = `Relative humidity is elevated at ${humidity}%. Guard against attic condensation, mold buildup, and timber truss rot with proper ventilation and Aluzinc AZ150 protective coatings.`;
  }

  const tips = [];

  if (isRaining || isThunderstorm) {
    tips.push({
      id: "tip-gutter-surge",
      title: "Clear Downpipe Discharge & Prevent Eaves Overflow",
      description: "During tropical Accra downpours, clogged box gutters back up under roof sheets, causing rapid ceiling rot. Ensure downpipe strainers are clear of debris.",
      icon: "droplets",
      urgency: "high" as const,
      recommendedProfile: "ZOF Seamless Box & Valley Gutters"
    });
    tips.push({
      id: "tip-selflock-defense",
      title: "Concealed Selflock® Fastener Advantage",
      description: "Standard corrugated sheets with exposed nails develop leak points as washers perish. ZOF Selflock panels snap together with hidden clips, creating an impenetrable water barrier.",
      icon: "shield",
      urgency: "high" as const,
      recommendedProfile: "ZOF 0.50mm Selflock Interlocking"
    });
    tips.push({
      id: "tip-valley-seal",
      title: "Inspect Valley Gutters & Wall Flashing Joints",
      description: "Over 70% of Ghanaian roof leaks occur at roof junctions and valleys. Check that sealant adhesives and zinc aprons are securely bonded against masonry.",
      icon: "wrench",
      urgency: "medium" as const
    });
  } else if (isHighHumidity) {
    tips.push({
      id: "tip-humidity-condensation",
      title: "Prevent Attic Condensation & Timber Truss Rot",
      description: `With Accra's coastal humidity at ${humidity}%, warm indoor air condensates beneath metal roof sheets. Ensure continuous ridge and soffit airflow to keep timber trusses dry.`,
      icon: "wind",
      urgency: "medium" as const,
      recommendedProfile: "Treated Hardwood Truss Framework"
    });
    tips.push({
      id: "tip-aluzinc-az150",
      title: "Deploy AZ150 Anti-Corrosion Aluzinc Sheeting",
      description: "High humidity mixed with sea-salt mist in Accra accelerates rust on substandard galvanized sheets. ZOF 55% Aluminium-Zinc alloy provides 4x longer rust resistance.",
      icon: "shield-check",
      urgency: "high" as const,
      recommendedProfile: "ZOF Aluzinc 0.50mm (AZ150 Standard)"
    });
    tips.push({
      id: "tip-mold-prevention",
      title: "Inspect Ceiling Joists for Early Moisture Patches",
      description: "Humid coastal weather creates ideal conditions for damp mold spores behind ceiling plasterboards. Early detection saves costly woodwork reconstruction.",
      icon: "eye",
      urgency: "preventative" as const
    });
  } else {
    tips.push({
      id: "tip-dry-prep",
      title: "Pre-Rainy Season Full Roof Health Audit",
      description: "Dry weather provides safe access to inspect carpentry trusses, re-tighten loose bracket fastenings, and reseal all perimeter barge flashings.",
      icon: "clipboard-check",
      urgency: "preventative" as const
    });
    tips.push({
      id: "tip-gutter-maintenance",
      title: "Pre-Clean All Valley and Eaves Gutters",
      description: "Remove accumulated dust, leaves, and construction gravel from roof valleys to prevent damming when the sudden rainy season storm hits.",
      icon: "sparkles",
      urgency: "preventative" as const,
      recommendedProfile: "Aluminum Valley Flashing Systems"
    });
  }

  return { alertLevel, alertTitle, alertSummary, tips };
}

// In-memory weather cache for Accra to prevent redundant external API hits and timeout errors
let cachedAccraWeatherData: any = null;
let lastWeatherCacheTimestamp = 0;
const WEATHER_CACHE_DURATION_MS = 15 * 60 * 1000; // 15-minute cache

// Live Accra Weather Status with Dynamic Rainy Season Defense Tips
router.get("/weather/accra", async (req, res) => {
  const mode = req.query.mode as string;

  // Simulator test modes for instant testing of all weather defense states
  if (mode === "rain") {
    const defense = generateRainySeasonDefense({
      temp: 26.2,
      humidity: 89,
      precipitation: 4.8,
      weatherCode: 65,
      condition: "Heavy Tropical Downpour"
    });
    return res.json({
      location: "Accra",
      country: "Ghana",
      latitude: 5.6037,
      longitude: -0.1870,
      temperature: 26.2,
      apparentTemperature: 29.5,
      humidity: 89,
      precipitation: 4.8,
      rain: 4.8,
      windSpeed: 18.5,
      weatherCode: 65,
      condition: "Heavy Tropical Downpour",
      isDay: true,
      isRaining: true,
      isHighHumidity: true,
      alertLevel: defense.alertLevel,
      alertTitle: defense.alertTitle,
      alertSummary: defense.alertSummary,
      defenseTips: defense.tips,
      lastUpdated: new Date().toISOString(),
      dataSource: "simulation"
    });
  }

  if (mode === "humidity") {
    const defense = generateRainySeasonDefense({
      temp: 29.8,
      humidity: 86,
      precipitation: 0.0,
      weatherCode: 3,
      condition: "Overcast & High Coastal Humidity"
    });
    return res.json({
      location: "Accra",
      country: "Ghana",
      latitude: 5.6037,
      longitude: -0.1870,
      temperature: 29.8,
      apparentTemperature: 35.2,
      humidity: 86,
      precipitation: 0.0,
      rain: 0.0,
      windSpeed: 12.0,
      weatherCode: 3,
      condition: "Overcast & High Coastal Humidity",
      isDay: true,
      isRaining: false,
      isHighHumidity: true,
      alertLevel: defense.alertLevel,
      alertTitle: defense.alertTitle,
      alertSummary: defense.alertSummary,
      defenseTips: defense.tips,
      lastUpdated: new Date().toISOString(),
      dataSource: "simulation"
    });
  }

  if (mode === "clear") {
    const defense = generateRainySeasonDefense({
      temp: 31.0,
      humidity: 58,
      precipitation: 0.0,
      weatherCode: 0,
      condition: "Clear & Sunny"
    });
    return res.json({
      location: "Accra",
      country: "Ghana",
      latitude: 5.6037,
      longitude: -0.1870,
      temperature: 31.0,
      apparentTemperature: 34.0,
      humidity: 58,
      precipitation: 0.0,
      rain: 0.0,
      windSpeed: 9.5,
      weatherCode: 0,
      condition: "Clear & Sunny",
      isDay: true,
      isRaining: false,
      isHighHumidity: false,
      alertLevel: defense.alertLevel,
      alertTitle: defense.alertTitle,
      alertSummary: defense.alertSummary,
      defenseTips: defense.tips,
      lastUpdated: new Date().toISOString(),
      dataSource: "simulation"
    });
  }

  // Return fresh in-memory cache if available
  const now = Date.now();
  if (cachedAccraWeatherData && (now - lastWeatherCacheTimestamp < WEATHER_CACHE_DURATION_MS)) {
    return res.json(cachedAccraWeatherData);
  }

  // Attempt live Open-Meteo real-time weather query for Accra (Lat: 5.6037, Lon: -0.1870)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      try {
        controller.abort();
      } catch {
        // ignore
      }
    }, 2000);

    const weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=5.6037&longitude=-0.1870&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&timezone=Africa%2FAccra";
    
    try {
      const response = await fetch(weatherUrl, {
        signal: controller.signal,
        headers: { "User-Agent": "ZofRoofing-Weather-Agent/1.0" }
      });
      clearTimeout(timeoutId);

      if (response && response.ok) {
        const data = await response.json();
        const current = data.current || {};
        const temp = current.temperature_2m ?? 28.5;
        const humidity = current.relative_humidity_2m ?? 78;
        const apparentTemp = current.apparent_temperature ?? (temp + 2);
        const precipitation = current.precipitation ?? current.rain ?? 0;
        const windSpeed = current.wind_speed_10m ?? 14;
        const weatherCode = current.weather_code ?? 3;
        const isDay = current.is_day === 1;

        const codeInfo = getConditionFromCode(weatherCode);
        const defense = generateRainySeasonDefense({
          temp,
          humidity,
          precipitation,
          weatherCode,
          condition: codeInfo.condition
        });

        const livePayload = {
          location: "Accra",
          country: "Ghana",
          latitude: 5.6037,
          longitude: -0.1870,
          temperature: Math.round(temp * 10) / 10,
          apparentTemperature: Math.round(apparentTemp * 10) / 10,
          humidity: Math.round(humidity),
          precipitation: Math.round(precipitation * 10) / 10,
          rain: Math.round(precipitation * 10) / 10,
          windSpeed: Math.round(windSpeed * 10) / 10,
          weatherCode,
          condition: codeInfo.condition,
          isDay,
          isRaining: codeInfo.isRaining || precipitation > 0.2,
          isHighHumidity: humidity >= 72,
          alertLevel: defense.alertLevel,
          alertTitle: defense.alertTitle,
          alertSummary: defense.alertSummary,
          defenseTips: defense.tips,
          lastUpdated: new Date().toISOString(),
          dataSource: "live"
        };

        cachedAccraWeatherData = livePayload;
        lastWeatherCacheTimestamp = now;
        return res.json(livePayload);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  } catch {
    // Graceful silent fallback to regional Accra climate baseline without emitting unhandled abort warnings
  }

  // Graceful fallback baseline for Accra coastal climate
  const baselineDefense = generateRainySeasonDefense({
    temp: 28.4,
    humidity: 79,
    precipitation: 0.0,
    weatherCode: 3,
    condition: "Partly Cloudy & Humid (Accra Coastal)"
  });

  const fallbackPayload = {
    location: "Accra",
    country: "Ghana",
    latitude: 5.6037,
    longitude: -0.1870,
    temperature: 28.4,
    apparentTemperature: 31.8,
    humidity: 79,
    precipitation: 0.0,
    rain: 0.0,
    windSpeed: 14.2,
    weatherCode: 3,
    condition: "Partly Cloudy & Humid (Accra Coastal)",
    isDay: true,
    isRaining: false,
    isHighHumidity: true,
    alertLevel: baselineDefense.alertLevel,
    alertTitle: baselineDefense.alertTitle,
    alertSummary: baselineDefense.alertSummary,
    defenseTips: baselineDefense.tips,
    lastUpdated: new Date().toISOString(),
    dataSource: "cached"
  };

  cachedAccraWeatherData = fallbackPayload;
  lastWeatherCacheTimestamp = now;

  res.json(fallbackPayload);
});

// ==========================================
// GOLDEN SHIELD DIGITAL WARRANTY API ROUTES
// ==========================================

const warrantyCertificates: any[] = [
  {
    id: "ZOF-GSW-2026-78412",
    consultationId: "ROOF-782910",
    propertyOwner: "Mr. Emmanuel Kwasi Osei",
    ownerPhone: "+233 24 286 6658",
    ownerEmail: "emmanuel.osei@yahoo.com",
    siteLocation: "East Legon, Accra",
    digitalAddress: "GA-492-1109",
    buildingType: "residential",
    roofProfile: "ZOF 0.50mm Selflock® Concealed Interlocking Aluzinc",
    warrantyTier: "golden_shield_master",
    coverageDurationYears: 50,
    issueDate: "2026-08-15",
    expiryDate: "2076-08-15",
    authorizedBy: "Mr. Francis O. Dugbazah (Managing Director, ZOF Group)",
    installerCertification: "Certified ZOF Master Roofing Crew (Level 1 A-Rated)",
    verificationHash: "GSW-SEC-99F4A28B1E",
    status: "verified",
    protectionClauses: [
      "100% Anti-Perforation & Corrosion Resistance (AZ150 Tropical Aluzinc)",
      "Zero-Nail Selflock Concealed Fastener Clamping Guarantee (Zero Leaks)",
      "Pressure-Treated Mahogany Timber Framework Structural Defense",
      "5-Year Workmanship & Joint Adjustment Warranty",
      "Complimentary Biannual Pre-Rainy Season Drone Inspection"
    ]
  },
  {
    id: "ZOF-GSW-2026-51920",
    consultationId: "ROOF-992301",
    propertyOwner: "Kofi Owusu Holdings",
    ownerPhone: "+233 27 889 0012",
    ownerEmail: "kofi.owusu@holdings.com.gh",
    siteLocation: "Heavy Industrial Area, Tema",
    digitalAddress: "TT-082-9014",
    buildingType: "commercial",
    roofProfile: "ZOF 0.55mm Marine IBR Longspan Corrugated Panels",
    warrantyTier: "platinum_coastal_fortress",
    coverageDurationYears: 50,
    issueDate: "2026-08-20",
    expiryDate: "2076-08-20",
    authorizedBy: "Mr. Francis O. Dugbazah (Managing Director, ZOF Group)",
    installerCertification: "Certified ZOF Industrial Structural Division",
    verificationHash: "GSW-SEC-33A89C04D2",
    status: "verified",
    protectionClauses: [
      "Heavy Industrial & Saline Ocean-Spray Corrosion Protection",
      "AZ150 Marine Alloy Perforation Immunity (50 Years)",
      "Heavy Tropical Monsoon & Storm Gutter Overflow Armor",
      "Priority Rapid Response Emergency Dispatch Guarantee"
    ]
  }
];

// Register and activate a Golden Shield Warranty Certificate
router.post("/warranty/activate", (req, res) => {
  try {
    const {
      consultationId,
      propertyOwner,
      ownerPhone,
      ownerEmail,
      siteLocation,
      digitalAddress,
      buildingType = "residential",
      roofProfile = "ZOF 0.50mm Selflock® Concealed Interlocking Aluzinc",
      warrantyTier = "golden_shield_master",
      installerCertification = "Certified ZOF Master Roofing Crew (Accra Central)"
    } = req.body;

    if (!propertyOwner || !ownerPhone) {
      return res.status(400).json({ error: "Property owner name and telephone number are required for warranty activation." });
    }

    const durationYears = warrantyTier === "platinum_coastal_fortress" ? 50 : warrantyTier === "golden_shield_master" ? 50 : 25;
    const now = new Date();
    const issueDate = now.toISOString().split("T")[0];
    
    const expiryDateObj = new Date(now);
    expiryDateObj.setFullYear(expiryDateObj.getFullYear() + durationYears);
    const expiryDate = expiryDateObj.toISOString().split("T")[0];

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const certificateId = `ZOF-GSW-2026-${randomSuffix}`;
    const hash = `GSW-SEC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const clauses = [
      "100% Anti-Perforation & Corrosion Resistance Guarantee (AZ150 Aluzinc Standard)",
      "Zero-Nail Fastener Lock Clamping Guarantee: Eliminates puncture water ingress",
      "Structural Truss & Framework Stability: Protected against severe coastal tropical gales",
      "Workmanship & Joinery Coverage: Free remedial realignment and flashing adjustments",
      "Free Biannual Pre-Rainy Season Drone & Flashing Health Checks by ZOF Inspectors"
    ];

    if (warrantyTier === "platinum_coastal_fortress") {
      clauses.push("Marine Saline Anti-Rust Shield: Certified for coastal areas within 5km of the Atlantic Ocean");
    }

    const newCert = {
      id: certificateId,
      consultationId: consultationId || `ROOF-${Math.floor(100000 + Math.random() * 900000)}`,
      propertyOwner,
      ownerPhone,
      ownerEmail: ownerEmail || "client@property.gh",
      siteLocation: siteLocation || "Greater Accra Region, Ghana",
      digitalAddress: digitalAddress || `GA-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      buildingType,
      roofProfile,
      warrantyTier,
      coverageDurationYears: durationYears,
      issueDate,
      expiryDate,
      authorizedBy: "Mr. Francis O. Dugbazah (Managing Director, ZOF Group)",
      installerCertification,
      verificationHash: hash,
      status: "verified",
      protectionClauses: clauses,
      createdAt: now.toISOString()
    };

    warrantyCertificates.unshift(newCert);

    res.status(201).json({
      success: true,
      message: `Golden Shield Warranty Certificate successfully activated for ${propertyOwner}!`,
      certificate: newCert
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to activate warranty certificate." });
  }
});

// Retrieve a warranty certificate by ID
router.get("/warranty/certificate/:id", (req, res) => {
  const { id } = req.params;
  const cert = warrantyCertificates.find(c => c.id.toUpperCase() === id.toUpperCase());
  if (!cert) {
    return res.status(404).json({ error: `Certificate with ID ${id} not found in ZOF registry.` });
  }
  res.json({ success: true, certificate: cert });
});

// Retrieve all warranty certificates
router.get("/warranty/list", (req, res) => {
  res.json({ success: true, certificates: warrantyCertificates });
});

// ==========================================
// ALUZINC CARE MAINTENANCE TUTORIALS API
// ==========================================

export interface TutorialScene {
  sceneNumber: number;
  title: string;
  durationSeconds: number;
  visualDescription: string;
  narration: string;
  actionTip: string;
  doNotDo: string;
  graphicType: "wash_spray" | "gutter_clear" | "screw_check" | "corrosion_inspect" | "solar_mount" | "scratch_touchup";
}

export interface AluzincTutorial {
  id: string;
  title: string;
  category: string;
  duration: string;
  difficulty: "DIY Safe" | "Intermediate" | "Professional Crew";
  frequency: string;
  summary: string;
  safetyGear: string[];
  toolsRequired: string[];
  scenes: TutorialScene[];
  proTips: string[];
  aiGenerated?: boolean;
}

// Built-in curated video tutorial library on Aluzinc care
const curatedAluzincTutorials: AluzincTutorial[] = [
  {
    id: "aluzinc-clean-01",
    title: "Biannual Soft-Wash & Salt Deposit Removal",
    category: "Surface Wash & Preservation",
    duration: "45 Seconds",
    difficulty: "DIY Safe",
    frequency: "Twice a Year (April & October)",
    summary: "Learn how to safely wash AZ150 Aluzinc sheets to neutralize Atlantic sea-salt buildup and red dust without scratching the protective sacrificial zinc-aluminium alloy film.",
    safetyGear: [
      "Rubber-soled non-slip work boots (soft tread)",
      "OSHA-compliant fall arrest harness and roof lanyard",
      "UV-protective safety glasses",
      "Chemical-resistant neoprene gloves"
    ],
    toolsRequired: [
      "Standard garden hose with adjustable fan nozzle",
      "Soft-bristle nylon car-wash broom with telescopic pole",
      "Neutral pH detergent (pH 6.5 - 7.5, e.g., car shampoo or mild dish soap)",
      "Clean 20-litre plastic wash bucket"
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: "Perimeter Safety Check & Dry Debris Removal",
        durationSeconds: 10,
        visualDescription: "Technician in high-visibility gear securely ties ladder to fascia board. Walks along purlin fastener lines, gently sweeping dry bougainvillea leaves and dust with a soft nylon broom.",
        narration: "Always step directly on timber purlin fastener lines, never in unsupported valley spans. Start by gently brushing away dry leaves, branches, and windblown grit.",
        actionTip: "Step only on purlin lines directly above fixing screws to prevent panel deformation.",
        doNotDo: "Never use stiff wire brushes, steel scrapers, or abrasive scouring pads on Aluzinc.",
        graphicType: "wash_spray"
      },
      {
        sceneNumber: 2,
        title: "Low-Pressure Freshwater Pre-Rinse",
        durationSeconds: 11,
        visualDescription: "Wide fan-spray freshwater stream soaking the roof from ridge cap downwards towards the gutters, loosening coastal salt crystals.",
        narration: "Rinse the roof with a wide fan spray from ridge to eaves. This dissolves surface salt deposits and prevents micro-scratches during brushing.",
        actionTip: "Keep water pressure under 1000 PSI; high-pressure washers can force water underneath overlap seams.",
        doNotDo: "Do not blast water directly upwards into lap seams or ridge cap flashings.",
        graphicType: "wash_spray"
      },
      {
        sceneNumber: 3,
        title: "Neutral Foam Application & Gentle Brooming",
        durationSeconds: 12,
        visualDescription: "Foaming soap suds spread across the corrugated profile. Soft broom moves in unidirectional strokes following the natural rib channels.",
        narration: "Apply diluted neutral pH detergent. Use your soft-bristle broom in long, smooth strokes following the rib channels to lift marine airborne oils and grime.",
        actionTip: "Work in 3-meter sections to prevent the cleaning solution from drying under the hot Ghanaian sun.",
        doNotDo: "Avoid harsh alkaline cleaners, caustic soda, bleach, or muriatic acid — they dissolve the zinc layer.",
        graphicType: "wash_spray"
      },
      {
        sceneNumber: 4,
        title: "Final Pure Flush & Gutter Clearance Audit",
        durationSeconds: 12,
        visualDescription: "Crystal-clear water washing away all suds into clean gutters. Final glistening reflection of pristine Aluzinc surface under morning sunlight.",
        narration: "Give a final thorough rinse with clean water until zero suds remain. Confirm all water drains freely into your box gutters without pooling.",
        actionTip: "Inspect valley gutters immediately after rinsing to ensure displaced dirt hasn't clogged the outlets.",
        doNotDo: "Do not leave soap residues to bake in the afternoon tropical heat.",
        graphicType: "wash_spray"
      }
    ],
    proTips: [
      "Wash roofs early in the morning (6:30 AM - 9:00 AM) or late afternoon to prevent premature soap drying and water spots.",
      "ZOF's AZ150 Aluzinc has an aluminium-zinc oxide film that self-heals minor scratches; never apply chemical rust converters.",
      "If living within 2km of the coast (Tema, Osu, Sakumono), rinse your roof quarterly to prevent marine salt crusting."
    ]
  },
  {
    id: "aluzinc-gutter-02",
    title: "Box Gutter & Valley Flashing Storm Prep",
    category: "Drainage & Overflow Prevention",
    duration: "40 Seconds",
    difficulty: "DIY Safe",
    frequency: "Monthly during Rainy Season (May - July & Sept - Nov)",
    summary: "Clear accumulated silt and foliage from concealed valley gutters to prevent torrential stormwater damming and internal ceiling overflow in Accra homes.",
    safetyGear: [
      "Heavy-duty waterproof leather/rubber gloves",
      "Slip-resistant work footwear",
      "Ladder stabilizer stand-off bracket"
    ],
    toolsRequired: [
      "Plastic gutter scoop or rubber spatula",
      "Heavy-duty biodegradable collection bucket",
      "Garden hose with jet stream nozzle",
      "Downpipe leaf strainer mesh guards"
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: "Valley Junction & Debris Inspection",
        durationSeconds: 9,
        visualDescription: "Camera pans over a valley gutter junction where leaves, mango tree twigs, and construction dust have created a 2-inch silt barrier.",
        narration: "Over 70% of Ghanaian roof leaks are not sheet holes, but clogged valley gutters backing water under the flashing aprons.",
        actionTip: "Inspect valleys after heavy windstorms or when nearby trees drop seasonal foliage.",
        doNotDo: "Do not leave silt to decompose; organic acids from decaying leaves accelerate metal pitting.",
        graphicType: "gutter_clear"
      },
      {
        sceneNumber: 2,
        title: "Manual Debris Scoop & Downpipe Barrier",
        durationSeconds: 11,
        visualDescription: "Hands in rubber gloves scooping damp mulch into a collection bucket. A temporary mesh plug is placed over the downpipe to avoid clogging.",
        narration: "First, place a temporary mesh plug over your downpipe opening. Scoop out heavy debris into a bucket, moving from top of the valley downward.",
        actionTip: "Always scoop away from the downpipe entrance so loose twigs do not slide down inside the wall cavity.",
        doNotDo: "Never wash large clumps of mud directly down the downpipe without catching debris first.",
        graphicType: "gutter_clear"
      },
      {
        sceneNumber: 3,
        title: "High-Discharge Flush & Flow Test",
        durationSeconds: 10,
        visualDescription: "Hose flushes remaining silt smoothly down the gutter. Water discharges rapidly from the downpipe elbow onto the ground drain.",
        narration: "Remove the temporary plug and flush the valley with a strong stream of water. Verify that water discharges freely from the ground outlet.",
        actionTip: "Check that the water stream drains completely with zero standing water pockets in the valley trough.",
        doNotDo: "Do not ignore standing water puddles; stagnant water indicates sagging timber woodwork below.",
        graphicType: "gutter_clear"
      },
      {
        sceneNumber: 4,
        title: "Flashing Apron Seal & Fastener Check",
        durationSeconds: 10,
        visualDescription: "Technician inspects the overlap where the Aluzinc sheet meets the valley apron, verifying clean silicone seal and tight pop-rivets.",
        narration: "Examine the flashing overlap joints. Ensure sealant beads along masonry walls are intact and no sheet edges have lifted.",
        actionTip: "Re-seal any cracked silicone joints using neutral-cure roofing silicone (acetic silicone corrodes Aluzinc!).",
        doNotDo: "Never use cheap acidic bathroom silicone on Aluzinc; the vinegar acid attacks the zinc coating.",
        graphicType: "gutter_clear"
      }
    ],
    proTips: [
      "Install ZOF stainless steel mesh gutter guards to prevent birds and bats from nesting in box gutters.",
      "Trim tree branches overhanging your roof by at least 2 meters to limit bird droppings and leaf drop.",
      "Inspect box gutters after the first May storm each year to verify rapid water discharge capacity."
    ]
  },
  {
    id: "aluzinc-corrosion-03",
    title: "Preventing Galvanic Corrosion (Dissimilar Metal Contact)",
    category: "Chemical Metallurgy & Protection",
    duration: "50 Seconds",
    difficulty: "Intermediate",
    frequency: "Crucial during AC, Solar, or Aerial Installations",
    summary: "Discover why copper air-conditioner drain pipes, bare steel wire, and graphite pencil marks create rapid galvanic attack on Aluzinc, and how to safely isolate them.",
    safetyGear: [
      "Safety goggles",
      "Work gloves",
      "Non-conductive electrical safety footwear"
    ],
    toolsRequired: [
      "EPDM rubber isolating gaskets / neoprene sheets",
      "UPVC drainage pipe extensions",
      "Stainless steel (Grade 304/316) or coated Aluzinc fasteners",
      "Wax marker or chalk (NEVER graphite pencil)"
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: "Identifying Dissimilar Metal Hazard Points",
        durationSeconds: 12,
        visualDescription: "Diagram showing galvanic potential scale: Copper, Brass, and Lead above Aluzinc. Close-up of copper AC drain pipe dripping onto roofing sheet.",
        narration: "Aluzinc is an active alloy. When water flows over noble metals like copper pipes or lead flashings onto Aluzinc, it causes rapid galvanic pitting.",
        actionTip: "Ensure air conditioner copper condensate drain pipes discharge into PVC pipes, never directly onto metal sheets.",
        doNotDo: "Never use lead flashings or copper lightning protection rods in direct contact with Aluzinc.",
        graphicType: "corrosion_inspect"
      },
      {
        sceneNumber: 2,
        title: "The Danger of Graphite Carpenter Pencils",
        durationSeconds: 12,
        visualDescription: "Magnified view of a black pencil line drawn across an Aluzinc sheet. Under moisture, the graphite line pits deeply into the metal within weeks.",
        narration: "A common mistake by local carpenters is marking Aluzinc sheets with standard graphite pencils. Graphite acts as an intensive cathode and eats through the sheet in humid weather.",
        actionTip: "Always use wax crayons, chalk, or water-based felt-tip markers to mark cut lines on Aluzinc.",
        doNotDo: "Never mark Aluzinc sheets with a lead or graphite pencil under any circumstances.",
        graphicType: "corrosion_inspect"
      },
      {
        sceneNumber: 3,
        title: "Installing Neoprene / EPDM Isolation Barriers",
        durationSeconds: 13,
        visualDescription: "Technician places a black EPDM rubber isolation pad between a steel TV antenna bracket and the Aluzinc ridge cap before tightening.",
        narration: "Whenever mounting satellite dishes, solar frames, or TV antennas, place an EPDM rubber pad between the steel mount and the Aluzinc sheet.",
        actionTip: "Use only Class 4 or 304 Stainless Steel fasteners with bonded EPDM washers to match the 50-year lifespan.",
        doNotDo: "Do not use ungalvanized black iron bolts or copper rivets to secure brackets.",
        graphicType: "corrosion_inspect"
      },
      {
        sceneNumber: 4,
        title: "Timber Preservative Separation Barrier",
        durationSeconds: 13,
        visualDescription: "View of breathable underlayment foil membrane isolating copper-treated sawn mahogany purlins from direct contact with the underside of the Aluzinc sheet.",
        narration: "Timber treated with copper-based preservatives must be separated from Aluzinc using ZOF heavy-duty vapour-barrier foil underlayment.",
        actionTip: "Install radiant barrier underlayment between wood purlins and sheets for dual thermal insulation and wood-chemical isolation.",
        doNotDo: "Never lay Aluzinc directly over wet, freshly CCA-treated timber without an underlayment membrane.",
        graphicType: "corrosion_inspect"
      }
    ],
    proTips: [
      "Clean off metal drill swarf (shavings) immediately with a soft brush after drilling; loose shavings rust and stain the surface.",
      "Never install green timber; use kiln-dried or seasoned mahogany purlins with moisture content under 18%.",
      "ZOF Selflock panels feature concealed clips made of matching coated Aluzinc alloy to prevent galvanic incompatibility."
    ]
  },
  {
    id: "aluzinc-fastener-04",
    title: "EPDM Fastener Washer Audit & Seal Rejuvenation",
    category: "Watertight Fastener Engineering",
    duration: "35 Seconds",
    difficulty: "Intermediate",
    frequency: "Annual Pre-Storm Health Check",
    summary: "How to identify perished rubber neoprene washers on exposed roofing screws, torque them correctly, and eliminate pinpoint water ingress points.",
    safetyGear: [
      "Safety harness and lanyard",
      "Cut-resistant gloves",
      "Knee pads with rubber caps"
    ],
    toolsRequired: [
      "Cordless impact driver with adjustable clutch depth stop",
      "8mm hex roofing socket bit",
      "Replacement Class 4 self-drilling screws with EPDM washers",
      "Neutral-cure silicone sealant"
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: "Identifying Washer Degradation Symptoms",
        durationSeconds: 9,
        visualDescription: "Close-up of three screws: one over-tightened with extruded cracked rubber, one under-tightened with a loose gap, and one perfectly seated.",
        narration: "Over time, intense tropical UV sunshine can bake inferior rubber washers, causing them to crack, shrink, and let rain seep down screw threads.",
        actionTip: "Check for washers that have perished, flattened completely, or cracked under UV radiation.",
        doNotDo: "Do not over-tighten screws until the EPDM washer splits and bulges out.",
        graphicType: "screw_check"
      },
      {
        sceneNumber: 2,
        title: "The Perfect Torque Alignment Standard",
        durationSeconds: 9,
        visualDescription: "Driver bit spinning screw into purlin. Screw stops with the rubber washer slightly compressed, with just 1mm of black neoprene visible around the metal collar.",
        narration: "A correctly installed roofing screw has the EPDM washer compressed evenly, visible by about 1 millimetre around the metal cap edge.",
        actionTip: "Set your cordless drill's clutch so it stops turning as soon as the washer creates an even seal.",
        doNotDo: "Do not install screws at an angle; crooked screws will never seal watertight.",
        graphicType: "screw_check"
      },
      {
        sceneNumber: 3,
        title: "Replacing Corroded or Stripped Screws",
        durationSeconds: 9,
        visualDescription: "Technician backs out a rusty non-certified screw, applies a drop of neutral silicone to the hole, and drives a new oversized Class 4 coated screw into the purlin.",
        narration: "If a screw has stripped wood or rusted, replace it with a slightly larger gauge Class 4 screw with fresh virgin EPDM.",
        actionTip: "If the screw hole is loose, insert a small treated wood peg before driving the replacement screw.",
        doNotDo: "Never use cheap zinc-plated drywall screws on exterior roofing sheets.",
        graphicType: "screw_check"
      },
      {
        sceneNumber: 4,
        title: "The Selflock® Concealed Fastener Superiority",
        durationSeconds: 8,
        visualDescription: "Comparison showing standard screw-fastened roof with hundreds of exposed washers vs ZOF Selflock with zero exposed screws and hidden locking clips.",
        narration: "With ZOF Selflock concealed fastener profiles, all clips are hidden inside the seams — completely eliminating screw washer maintenance!",
        actionTip: "Consider upgrading to ZOF Selflock on your next build for a 100% screw-leak-free lifetime warranty.",
        doNotDo: "Never drill external screws through the face of a Selflock panel.",
        graphicType: "screw_check"
      }
    ],
    proTips: [
      "Always use genuine Class 4 fasteners with UV-stabilized virgin EPDM rubber (not cheap PVC or reclaimed rubber).",
      "On corrugated sheets, always fasten through the crest of the rib, not the bottom trough where rainwater flows.",
      "Check screw tightness after major tropical storms with wind gusts exceeding 60 km/h."
    ]
  }
];

// GET: Return curated Aluzinc care tutorial video library
router.get("/tutorials/curated", (req, res) => {
  res.json({
    success: true,
    tutorials: curatedAluzincTutorials
  });
});

// POST: Generate a custom Aluzinc Care Tutorial using Gemini
router.post("/tutorials/generate", async (req, res) => {
  try {
    const { topic, focusArea, environmentContext = "Accra coastal Ghana" } = req.body;
    const queryTopic = (topic || focusArea || "Aluzinc roofing care & maintenance in coastal Ghana").trim();

    let client: GoogleGenAI | null = null;
    try {
      client = getGeminiClient();
    } catch {
      // Gracefully fall back to rich domain generator without printing error traces
    }

    if (!client) {
      // Graceful fallback when Gemini key is not configured
      const fallbackTutorial: AluzincTutorial = {
        id: `ai-gen-${Date.now()}`,
        title: `Custom Care Guide: ${queryTopic.slice(0, 45)}`,
        category: "AI Maintenance Studio",
        duration: "45 Seconds",
        difficulty: "DIY Safe",
        frequency: "Seasonal (Twice Annually)",
        summary: `Practical step-by-step instructional tutorial engineered for "${queryTopic}" under Ghana's coastal sun and humidity.`,
        safetyGear: [
          "Rubber-soled non-slip roofing shoes",
          "Safety harness and secure lanyard anchor",
          "Protective eyewear and work gloves"
        ],
        toolsRequired: [
          "Garden hose with adjustable spray fan nozzle",
          "Soft-bristle nylon broom with extension pole",
          "Neutral pH car wash shampoo (pH 6.5 - 7.5)",
          "Clean plastic bucket"
        ],
        scenes: [
          {
            sceneNumber: 1,
            title: "Pre-Inspection & Fastener Path Layout",
            durationSeconds: 10,
            visualDescription: "Technician inspects roof condition, planning footstep path strictly along purlin screw lines.",
            narration: "Before beginning maintenance, map your footsteps along the timber purlins to prevent panel deflection.",
            actionTip: "Step only on timber purlins directly above screws.",
            doNotDo: "Never step into the center of unsupported valleys.",
            graphicType: "wash_spray"
          },
          {
            sceneNumber: 2,
            title: "Soft Wash Foam Application",
            durationSeconds: 12,
            visualDescription: "Gentle soap foam applied with soft broom following rib direction from ridge to eaves.",
            narration: "Apply neutral pH foam and sweep gently along rib lines to dissolve salt deposits and red dust.",
            actionTip: "Work in small sections so soap doesn't dry in the sun.",
            doNotDo: "Never use wire brushes, bleach, or acidic cleaning agents.",
            graphicType: "wash_spray"
          },
          {
            sceneNumber: 3,
            title: "Rinse & Gutter Flush",
            durationSeconds: 11,
            visualDescription: "Freshwater rinse clearing all suds into clean gutters with rapid downpipe discharge.",
            narration: "Rinse thoroughly with clean water, ensuring all runoff drains smoothly through gutters.",
            actionTip: "Clear gutter strainers after washing.",
            doNotDo: "Do not blast high pressure water into lap seams.",
            graphicType: "gutter_clear"
          },
          {
            sceneNumber: 4,
            title: "Passivation Patina Signoff",
            durationSeconds: 12,
            visualDescription: "Clean, dry Aluzinc surface reflecting healthy metallic sheen with zero scratches.",
            narration: "Inspect the dry surface. The Aluzinc AZ150 sacrificial zinc-aluminium barrier is now refreshed and protected.",
            actionTip: "Repeat every six months for 50-year longevity.",
            doNotDo: "Do not walk on wet soapy panels without safety ropes.",
            graphicType: "corrosion_inspect"
          }
        ],
        proTips: [
          "Clean early in the morning before the roof heats up.",
          "Keep copper and untreated wood from touching Aluzinc sheets.",
          "Contact ZOF Group for complimentary biannual drone inspections."
        ],
        aiGenerated: true
      };

      return res.json({ success: true, tutorial: fallbackTutorial, source: "domain_engine" });
    }

    // Call Gemini 3.8 Flash to generate structured, accurate tutorial
    const prompt = `You are ZOF Group's senior Aluzinc metallurgical and roofing installation engineer based in Accra, Ghana.
Generate a structured, practical, brief instructional video tutorial for homeowners and caretakers on Aluzinc roofing care.
The user is asking for guidance on: "${queryTopic}".
Environmental context: ${environmentContext} (high tropical heat, coastal Atlantic sea-spray, Harmattan dust, and seasonal torrential monsoon rains).

Rules for Aluzinc care in Ghana:
1. Aluzinc (55% Aluminium, 43.4% Zinc, 1.6% Silicon - AZ150) has a protective sacrificial alloy layer. NEVER use wire brushes, steel wool, abrasive cleaners, caustic soda, bleach, or hydrochloric acid.
2. Cleaning must use freshwater, neutral pH detergent (6.5-7.5), and soft bristle brooms or microfiber cloths.
3. Keep water pressure below 1000 PSI to avoid forcing water under overlap seams.
4. Prevent galvanic corrosion: NO copper pipes, lead flashing, or raw steel wire in contact with Aluzinc.
5. NEVER mark Aluzinc with graphite carpenter pencils (graphite creates intense galvanic corrosion cells). Use chalk or wax crayon.
6. Step only on timber purlins directly above screws to prevent oil-canning and denting.

Generate a JSON object with this exact structure:
{
  "title": "Short catchy title (under 50 chars)",
  "category": "e.g. Surface Wash, Drainage Defense, Fastener Care, Corrosion Protection",
  "duration": "e.g. 45 Seconds",
  "difficulty": "DIY Safe" | "Intermediate" | "Professional Crew",
  "frequency": "e.g. Twice Annually, Post-Storm, Seasonal",
  "summary": "1-2 sentence overview of why this matters for Ghanaian properties",
  "safetyGear": ["3-4 specific safety gear items"],
  "toolsRequired": ["3-4 exact tools/materials required"],
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "Scene title",
      "durationSeconds": 10,
      "visualDescription": "Detailed visual storyboard description of what is shown on screen",
      "narration": "Exact spoken audio voiceover script (1-2 clear sentences)",
      "actionTip": "Key positive action instruction",
      "doNotDo": "Critical warning of what NOT to do",
      "graphicType": "wash_spray" | "gutter_clear" | "screw_check" | "corrosion_inspect" | "solar_mount" | "scratch_touchup"
    }
    // exactly 3 to 4 scenes total
  ],
  "proTips": [
    "3 actionable professional tips specific to Ghana climate"
  ]
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    const responseText = response.text || "";
    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch (parseErr) {
      const match = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/(\{[\s\S]*\})/);
      if (match) {
        parsed = JSON.parse(match[1]);
      } else {
        throw new Error("Unable to parse structured JSON from Gemini response.");
      }
    }

    const generatedTutorial: AluzincTutorial = {
      id: `ai-gen-${Date.now()}`,
      title: parsed.title || `Aluzinc Care: ${queryTopic.slice(0, 40)}`,
      category: parsed.category || "AI Custom Tutorial",
      duration: parsed.duration || "45 Seconds",
      difficulty: parsed.difficulty || "DIY Safe",
      frequency: parsed.frequency || "Seasonal Routine",
      summary: parsed.summary || `Expert guidance on ${queryTopic} for lasting roof protection.`,
      safetyGear: Array.isArray(parsed.safetyGear) ? parsed.safetyGear : ["Safety boots", "Gloves", "Harness"],
      toolsRequired: Array.isArray(parsed.toolsRequired) ? parsed.toolsRequired : ["Soft broom", "Neutral soap", "Hose"],
      scenes: Array.isArray(parsed.scenes) && parsed.scenes.length > 0 ? parsed.scenes.map((sc: any, idx: number) => ({
        sceneNumber: sc.sceneNumber || idx + 1,
        title: sc.title || `Step ${idx + 1}`,
        durationSeconds: Number(sc.durationSeconds) || 10,
        visualDescription: sc.visualDescription || "Video demonstration of the maintenance action.",
        narration: sc.narration || "Follow the safe procedure step by step.",
        actionTip: sc.actionTip || "Proceed methodically from ridge to eaves.",
        doNotDo: sc.doNotDo || "Avoid harsh chemical abrasive products.",
        graphicType: sc.graphicType || "wash_spray"
      })) : curatedAluzincTutorials[0].scenes,
      proTips: Array.isArray(parsed.proTips) ? parsed.proTips : [
        "Avoid washing roofs during midday scorching sun in Ghana.",
        "Inspect valleys before the rainy season begins.",
        "Step only on purlin fastener lines."
      ],
      aiGenerated: true
    };

    res.json({
      success: true,
      tutorial: generatedTutorial,
      source: "gemini-3.8-flash"
    });
  } catch (error: any) {
    console.error("Tutorial generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate tutorial" });
  }
});

// POST: Direct AI Video Rendering via Gemini Omni (gemini-omni-1.1-flash)
router.post("/tutorials/video-render", async (req, res) => {
  try {
    const { prompt, duration = "5s", resolution = "720p" } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "A prompt describing the Aluzinc video is required." });
    }

    let client: GoogleGenAI | null = null;
    try {
      client = getGeminiClient();
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        requiresPaidKey: true,
        message: "Gemini API key is required. Please ensure a valid API key is attached in Settings > Secrets."
      });
    }

    // Call gemini-omni-1.1-flash via Interactions API for video generation
    try {
      const interaction = await client.interactions.create({
        model: "gemini-omni-1.1-flash",
        input: `Professional cinematic instructional tutorial video on Aluzinc roofing care in Accra Ghana: ${prompt}. High clarity, real work demonstrator with soft brush, clean water spray, gutter clearing, bright sunlight, photorealistic industrial quality.`,
        background: false,
        store: false,
        stream: false,
        response_format: {
          type: "video",
          aspect_ratio: "16:9",
          duration: duration === "10s" ? "10s" : "5s",
          resolution: resolution === "1080p" ? "1080p" : "720p",
        }
      }, { timeout: 300000 });

      const videoPart = interaction.output_video;
      if (videoPart && videoPart.data) {
        const mimeType = videoPart.mime_type || "video/mp4";
        return res.json({
          success: true,
          videoUrl: `data:${mimeType};base64,${videoPart.data}`,
          duration,
          resolution,
          message: "Video generated successfully with Gemini Omni!"
        });
      }

      return res.json({
        success: false,
        message: "Video model response did not contain video data, interactive simulated video mode activated."
      });
    } catch (omniErr: any) {
      const errStr = omniErr.message || String(omniErr);
      const isPaidKeyIssue = errStr.includes("403") || errStr.includes("quota") || errStr.includes("billing") || errStr.includes("paid");
      return res.json({
        success: false,
        requiresPaidKey: isPaidKeyIssue,
        message: isPaidKeyIssue 
          ? "Gemini Omni video generation requires a paid API key tier. Switching to high-fidelity interactive multi-scene video simulation!" 
          : `Video generation notice: ${errStr}. Interactive video simulation active.`
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to initiate video generation." });
  }
});

export default router;

