/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum RoofType {
  SELFLOCK = "SELFLOCK",
  IBR = "IBR",
  IDT = "IDT",
  STEP_TILES = "STEP_TILES",
  ALUMINIUM_PLAIN = "ALUMINIUM_PLAIN",
  GALVANIZE = "GALVANIZE",
  TRANSPARENT_SHEETS = "TRANSPARENT_SHEETS",
  ALUZINC_PLAIN = "ALUZINC_PLAIN",
}

export enum RoofPitch {
  FLAT = "FLAT", // 0/12 to 2/12
  STANDARD = "STANDARD", // 3/12 to 8/12
  STEEP = "STEEP", // 9/12+
}

export interface EstimateInput {
  propertyType: "commercial" | "residential";
  roofType: RoofType;
  areaSqFt: number;
  pitch: RoofPitch;
  tearOffLayers: number;
  includeGutters: boolean;
  includeGutterGuards: boolean;
  premiumInsulation: boolean; // overlay for flat roofs or extra R-value
}

export interface EstimateResult {
  baseMaterialCost: number;
  laborCost: number;
  tearOffCost: number;
  addOnCost: number;
  totalEstimatedMin: number;
  totalEstimatedMax: number;
  efficiencyRating: string;
  warrantyPeriodYears: number;
  estimatedDurationDays: string;
}

export interface ConsultationRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string; // Accra, Kumasi, Tema, Takoradi, Koforidua, etc. (Ghana service regions)
  propertyType: "commercial" | "residential";
  preferredDate: string;
  roofCondition: "good" | "leaking" | "missing_shingles" | "storm_damage" | "old_aged";
  notes?: string;
  estimateDetails?: EstimateInput & EstimateResult;
  timestamp: string;
  status: "pending" | "confirmed";
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface ShowcaseProject {
  id: string;
  title: string;
  category: "Commercial PVC" | "Standing Seam Metal" | "Architectural Shingles" | "Seamless Gutters";
  location: string;
  description: string;
  roofArea: string;
  imageUrl: string;
  duration: string;
  videoUrl?: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  lengthMeters?: string;
  quantity: number;
  unitPrice: number;
}

export interface GeneratedDocument {
  id: string;
  branch: string;
  docMode: "proposal" | "proforma" | "receipt";
  customerName: string;
  customerPhone: string;
  customerLocation: string;
  items: InvoiceItem[];
  subtotal: number;
  discountPercent: number;
  installationCost: number;
  transportCost: number;
  applyTax: boolean;
  totalAmount: number;
  timestamp: string;
  status: "pending_approval" | "approved" | "rejected";
  preparedBy: string;
  approvedBy: string;
  roofType?: string;
}

export interface AccraWeatherData {
  location: string;
  country: string;
  latitude: number;
  longitude: number;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  rain: number;
  windSpeed: number;
  weatherCode: number;
  condition: string;
  isDay: boolean;
  isRaining: boolean;
  isHighHumidity: boolean;
  alertLevel: "critical_rain" | "rain_alert" | "high_humidity" | "favorable";
  alertTitle: string;
  alertSummary: string;
  defenseTips: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    urgency: "high" | "medium" | "preventative";
    recommendedProfile?: string;
  }>;
  lastUpdated: string;
  dataSource: "live" | "cached" | "simulation";
}

export interface GoldenShieldWarrantyCertificate {
  id: string; // e.g. ZOF-GSW-2026-89421
  consultationId?: string;
  propertyOwner: string;
  ownerPhone: string;
  ownerEmail: string;
  siteLocation: string;
  digitalAddress?: string;
  buildingType: "residential" | "commercial" | "industrial" | "institutional" | "estate";
  roofProfile: string; // e.g. "ZOF 0.50mm Selflock® Concealed Interlocking Aluzinc"
  warrantyTier: "golden_shield_master" | "platinum_coastal_fortress" | "architectural_elite";
  coverageDurationYears: number; // 25, 40, 50
  issueDate: string;
  expiryDate: string;
  authorizedBy: string;
  installerCertification: string;
  verificationHash: string;
  status: "active_registered" | "pending_site_audit" | "verified";
  protectionClauses: string[];
}
