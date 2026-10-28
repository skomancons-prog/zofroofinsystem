/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Award, 
  Sparkles, 
  Receipt, 
  RotateCcw,
  CheckCircle,
  Hash,
  User,
  MapPin,
  Calendar,
  DollarSign,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  LogOut,
  AlertCircle,
  BadgeCheck,
  Stamp,
  Eye,
  EyeOff,
  FileCheck,
  Download,
  QrCode,
  Share2,
  RefreshCw,
  Zap,
  CheckCircle2,
  UserCheck,
  Import,
  Building,
  UploadCloud,
  FileSignature,
  Layers,
  Scale,
  ChevronDown,
  ChevronUp,
  PackageCheck,
  AlertTriangle
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import zofLogo from "../assets/images/zof_bright_logo_2026.svg";
import { DigitalSignaturePad } from "./DigitalSignaturePad";
import { TermsAndConditionsAgreement, AgreementData } from "./TermsAndConditionsAgreement";
import { 
  formatProformaRef, 
  generateSequentialProformaRef, 
  incrementProformaRef, 
  parseProformaRef, 
  isProformaRef 
} from "../utils/invoiceUtils";

interface CollapsibleInvoiceTermsProps {
  isCollapsed: boolean;
  onToggle: () => void;
  docMode?: "proposal" | "proforma" | "receipt";
  isProforma?: boolean;
}

/**
 * Collapsible Terms and Conditions Section for Invoice Views
 * Displays ZOF ROOFING SYSTEM Official Verbatim Terms & Conditions from the uploaded template
 */
function CollapsibleInvoiceTerms({
  isCollapsed,
  onToggle,
  docMode = "proforma",
  isProforma = true
}: CollapsibleInvoiceTermsProps) {
  return (
    <div className="border border-stone-400 rounded-xl overflow-hidden bg-white text-stone-900 shadow-xs mb-3 text-left print:break-inside-avoid">
      {/* Collapsible Header Accordion Bar */}
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 py-2 text-left cursor-pointer transition-colors ${
          isProforma
            ? "bg-stone-100 hover:bg-stone-200 border-b border-stone-300 text-stone-950"
            : "bg-stone-900 hover:bg-stone-850 text-white"
        }`}
        aria-expanded={!isCollapsed}
        title={isCollapsed ? "Click to expand Standard Terms & Conditions" : "Click to collapse Standard Terms & Conditions"}
      >
        <div className="flex items-center space-x-2">
          <Scale className={`h-4 w-4 shrink-0 ${isProforma ? "text-stone-900" : "text-amber-400"}`} />
          <div>
            <span className="font-sans font-black text-[11px] tracking-tight uppercase block leading-tight">
              ZOF Roofing System Standard Terms & Conditions
            </span>
            <span className="font-mono text-[9px] text-stone-500 block leading-tight">
              Official Client Agreement & Sales Policies
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase hidden sm:inline-block ${
            isProforma ? "bg-stone-200 text-stone-800 border border-stone-300" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
          }`}>
            Official Template
          </span>
          <span className={`flex items-center space-x-0.5 text-[10px] font-mono font-bold ${
            isProforma ? "text-stone-700" : "text-amber-400"
          }`}>
            <span>{isCollapsed ? "Expand" : "Collapse"}</span>
            {isCollapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </span>
        </div>
      </button>

      {/* Collapsed State Summary Row */}
      {isCollapsed && (
        <div className="px-3 py-2 bg-stone-50 text-[10px] text-stone-600 flex items-center justify-between">
          <p className="font-sans leading-snug line-clamp-1">
            <strong className="text-stone-900">Summary:</strong> 10-day validity, 80% deposit before production, GT Bank / Mobile Money payment details, 10% refund penalty, and 17% quantity tolerance levels.
          </p>
          <button
            type="button"
            onClick={onToggle}
            className="text-[9px] font-mono font-bold text-blue-600 hover:underline shrink-0 ml-2 cursor-pointer print:hidden"
          >
            View Details
          </button>
        </div>
      )}

      {/* Expanded State Body */}
      {!isCollapsed && (
        <div className="p-3 bg-stone-50/80 space-y-2.5 text-[10px] font-mono leading-relaxed">
          {/* Preamble Disclaimer */}
          <div className="bg-red-50 border-l-4 border-red-700 p-2 rounded-r-lg text-[9px] font-bold text-stone-900 uppercase">
            THIS QUOTATION IS NOT A CONTRACT. ANY ORDERS PLACED AS A RESULT OF THIS QUOTATION TERMS ARE SUBJECT TO OUR FURTHER ACCEPTANCE OF OUR STANDARD TERMS AND CONDITIONS OF SALE.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {/* Column 1: Clauses 1-4 */}
            <div className="space-y-2 bg-white p-2.5 rounded-lg border border-stone-250 shadow-xs">
              {/* Clause 1: Validity */}
              <div>
                <p className="font-bold text-stone-950 text-[9.5px]">
                  <span className="text-red-700 font-extrabold">1. VALIDITY:</span>
                </p>
                <p className="pl-3 text-stone-800 text-[9px] leading-tight">
                  (a) PROFORMA INVOICE ARE VALID FOR ONLY SEVEN (7) DAYS FROM THE DATE OF ISSUE.<br />
                  (b) PRICES ARE SUBJECT TO CHANGE WITHOUT NOTICE AFTER THIS PERIOD UNLESS FULL PAYMENT ON ACTUAL ORDERS HAS BEEN MADE.
                </p>
              </div>

              {/* Clause 2: Terms of Payment */}
              <div>
                <p className="font-bold text-stone-950 text-[9.5px]">
                  <span className="text-red-700 font-extrabold">2. TERMS OF PAYMENT:</span>
                </p>
                <p className="pl-3 text-stone-800 text-[9px] leading-tight">
                  (a) 80% OF TOTAL COST TO BE PAID BEFORE PRODUCTION.<br />
                  (b) 20% REMAIN TO BE PAID BEFORE FINAL FINISHING PRODUCTION.
                </p>
              </div>

              {/* Clause 3: Mode of Payment */}
              <div>
                <p className="font-bold text-stone-950 text-[9.5px]">
                  <span className="text-red-700 font-extrabold">3. MODE OF PAYMENT:</span>
                </p>
                <p className="pl-3 text-stone-800 text-[9px] leading-tight">
                  (a) PAYMENT CAN BE MADE EITHER TO THE CASHIER / MARKETING MANAGER AT THE OFFICE ONLY IN CASH.<br />
                  (b) PAYMENTS MADE IN A FORM OF BANKERS DRAFT / CHEQUE / FUNDS TRANSFER TO COMPANY'S ACCOUNT ARE SUBJECT TO CLEARING AT THE BANK BEFORE ORDERS WOULD BE CONFIRMED FOR PRODUCTION. GT BANK ACCOUNT (NAME - Zof Roofing System) NUMBER (<span className="text-red-700 font-bold">3221-00101-5330</span>) OR MOBILE MONEY <span className="text-red-700 font-bold">0597391978</span>.
                </p>
              </div>

              {/* Clause 4: Refunds */}
              <div>
                <p className="font-bold text-stone-950 text-[9.5px]">
                  <span className="text-red-700 font-extrabold">4. REFUNDS:</span>
                </p>
                <p className="pl-3 text-stone-800 text-[9px] leading-tight">
                  (a) ORDERS ONCE CONFIRMED AND PROCESSED ARE NOT REFUNDABLE.<br />
                  (b) ALL REFUNDS BE PAID BY CHEQUE IN THE NAME OF CLIENT AS FOUND ON INVOICE WITH 10% PENALTY.
                </p>
              </div>
            </div>

            {/* Column 2: Clauses 5-8 */}
            <div className="space-y-2 bg-white p-2.5 rounded-lg border border-stone-250 shadow-xs">
              {/* Clause 5: Collection of Order */}
              <div>
                <p className="font-bold text-stone-950 text-[9.5px]">
                  <span className="text-red-700 font-extrabold">5. COLLECTION OF ORDER:</span>
                </p>
                <p className="pl-3 text-stone-800 text-[9px] leading-tight">
                  (a) QUANTITY AND VALUE TOLERANCE LEVEL 17%.<br />
                  (b) CHECKING OF DESCRIPTION, QUANTITY, AND LENGTHS IS THE RESPONSIBILITY OF CUSTOMER AND COMPANY WILL NOT TAKE RESPONSIBILITY OF IT.<br />
                  (c) CUSTOMER MUST BRING ALONG ORIGINAL RECEIPT OF PAYMENT AND PROFORMA INVOICE WHEN COMING TO COLLECT GOODS.<br />
                  (d) ORDERS NOT COLLECTED AFTER TWO (2) WEEKS OF SCHEDULED COLLECTION DATE WOULD ATTRACT A PENALTY OF 20% OF THE MATERIALS COST.<br />
                  (e) GOODS SOLD OUT ARE RETURNABLE.
                </p>
              </div>

              {/* Clause 6: Delivery of Orders */}
              <div>
                <p className="font-bold text-stone-950 text-[9.5px]">
                  <span className="text-red-700 font-extrabold">6. DELIVERY OF ORDERS:</span>
                </p>
                <p className="pl-3 text-stone-800 text-[9px] leading-tight">
                  (a) DELIVERY OF ITEMS SHALL BE STATED ON THE PROFORMA INVOICE.<br />
                  (b) THE CUSTOMER TAKES TOTAL RESPONSIBILITY OF THE SHEETS ONCE DELIVERED.<br />
                  (c) THE COMPANY SHALL BE RELIEVED OF THEFT OR DESTRUCTION OF ROOFING SHEETS UPON CHECKING AND DELIVERY AT SITE.
                </p>
              </div>

              {/* Clause 7: Excess of Productions */}
              <div>
                <p className="font-bold text-stone-950 text-[9.5px]">
                  <span className="text-red-700 font-extrabold">7. EXCESS OF PRODUCTIONS:</span>
                </p>
                <p className="pl-3 text-stone-800 text-[9px] leading-tight">
                  EXCESS OF PRODUCTIONS SUPPLIED ARE THE PROPERTY OF THE CUSTOMER AND SHORTAGE OF PRODUCTIONS MUST BE PURCHASED BY THE CUSTOMER.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Endorsement note */}
          <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg text-[9px] text-stone-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 font-mono">
            <span>
              <strong>Prepared by:</strong> Mr Francis O. Dugbazah (MD, Tel: 0577796161)
            </span>
            <span className="text-[#10223D] uppercase font-bold shrink-0">
              ZOF GROUP OF COMPANIES
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export interface ItemLine {
  id: string;
  name: string;
  description: string;
  lengthMeters?: string;
  quantity: number;
  unitPrice: number;
}

interface ProposalReceiptGeneratorProps {
  isAdmin?: boolean;
  onAttachToForm?: (details: {
    title: string;
    items: ItemLine[];
    subtotal: number;
    vat: number;
    discount: number;
    total: number;
    docId: string;
    clientName: string;
    location: string;
  }) => void;
  onScrollToForm?: () => void;
  initialConsultationId?: string | null;
  restoredInvoice?: any;
  onSaveSuccess?: () => void;
  onPrintSuccess?: () => void;
}

// High-Quality Presets tailored for ZOF Roofing Systems
const PRESETS = {
  proforma: {
    title: "Official Proforma Invoice (Pastor Kissi Sample)",
    clientName: "Pastor Kissi",
    clientPhone: "0204222233",
    siteLocation: "Tigo Kpom",
    proformaRef: formatProformaRef(2, new Date()),
    proformaVatReg: "P0014921413",
    proformaPrintTime: "09:00 am",
    proformaPrintDate: "02/01/26",
    installationCost: 7000,
    transportCost: 1500,
    discountPercent: 4,
    proformaColour: "Aluzinc / Wine Red",
    proformaPreparedBy: "Samson K.",
    proformaApprovedBy: "F. O. Dugbazah MD",
    warranty: 50,
    duration: "Immediate Delivery",
    deposit: 0,
    notes: "Official ZOF Roofing System Proforma Invoice.",
    items: [
      { id: "1", name: "MMARSL Aluzinc self lockR/S", description: "0.45mm Aluzinc self lock roofing sheets", lengthMeters: "(23,6,11,6,26)", quantity: 49, unitPrice: 211.10 },
      { id: "2", name: "MMARSL Aluzinc self lockR/S", description: "0.45mm Aluzinc self lock roofing sheets", lengthMeters: "(35,34,34,)", quantity: 59, unitPrice: 198.80 },
      { id: "3", name: "MMARSL Aluzinc 2ms", description: "Aluzinc 2ms roofing profile", lengthMeters: "(35,42,31,21)", quantity: 64, unitPrice: 189.00 },
      { id: "4", name: "MMARSL Aluzinc ms", description: "Aluzinc ms profile", lengthMeters: "(15,8,10,)", quantity: 64, unitPrice: 120.00 },
      { id: "5", name: "MMARSL Aluzinc 2ms", description: "Aluzinc 2ms profile", lengthMeters: "35.9", quantity: 52, unitPrice: 93.00 },
      { id: "6", name: "Rain Gutter Dropouts", description: "Aluzinc rain gutter dropouts", lengthMeters: "10", quantity: 49, unitPrice: 55.00 },
      { id: "7", name: "Rain Cups", description: "Aluzinc drainage rain cups", lengthMeters: "14", quantity: 49, unitPrice: 45.00 },
      { id: "8", name: "Valley", description: "Internal roof valley flashing", lengthMeters: "6", quantity: 49, unitPrice: 40.00 },
      { id: "9", name: "Site trim", description: "Perimeter barge trim flashing", lengthMeters: "5", quantity: 49, unitPrice: 41.00 },
      { id: "10", name: "Rivert Pins", description: "Stainless steel rivet pins", lengthMeters: "5.79", quantity: 20, unitPrice: 18.20 },
      { id: "11", name: "Self lock Fixings (100 Sets Of 2\" Nails)", description: "Concealed self-lock fixings", lengthMeters: "-", quantity: 8, unitPrice: 18.20 },
      { id: "12", name: "Sealant", description: "High grade silicone roof sealant", lengthMeters: "-", quantity: 8, unitPrice: 22.00 },
    ]
  },
  selflock: {
    title: "Selflock® Premium Roof Proposal",
    items: [
      {
        id: "1",
        name: "Timber Woodwork & Steel Truss Framing",
        description: "Premium seasoned structural wood carpentry alignment and engineered truss erection.",
        quantity: 1,
        unitPrice: 12500,
      },
      {
        id: "2",
        name: "Seamless Selflock® concealed fastener sheets",
        description: "Advanced Aluzinc rustproof alloy panels, zero nails exposed, 100% leak proof.",
        quantity: 3500,
        unitPrice: 120,
      },
      {
        id: "3",
        name: "Master Installation Labor & Rigging",
        description: "Certified carpentry team erection, safety harnesses, and professional alignment.",
        quantity: 1,
        unitPrice: 4500,
      },
      {
        id: "4",
        name: "Custom Site Clean-up & Scrap Disposal",
        description: "Complete removal of old decking, construction debris, and structural load sorting.",
        quantity: 1,
        unitPrice: 1500,
      }
    ],
    warranty: 50,
    duration: "5-7 Days",
    deposit: 30000,
    notes: "Selflock system includes our Unified 50-Year leak-proof warranty. Balance due upon visual sign-off."
  },
  steptiles: {
    title: "Step Tiles Residential Proposal",
    items: [
      {
        id: "1",
        name: "Step Tiles Mediterranean Metal Sheeting",
        description: "Prestige step-profile lightweight steel sheets in Woodland Gray finish.",
        quantity: 1800,
        unitPrice: 115,
      },
      {
        id: "2",
        name: "Structural Carpentry & Roof Framing",
        description: "Erection of high-strength structural purlins, rafters, and ridge caps.",
        quantity: 1,
        unitPrice: 8900,
      },
      {
        id: "3",
        name: "Seamless Gutter Systems & Downpipes",
        description: "Roll-formed on site, seamless joints, premium matching custom runners.",
        quantity: 150,
        unitPrice: 85,
      },
      {
        id: "4",
        name: "Standard Installation & Waterproofing",
        description: "Professional alignment of sheets with weather-tight zinc-coated fasteners.",
        quantity: 1,
        unitPrice: 3800,
      }
    ],
    warranty: 40,
    duration: "4-6 Days",
    deposit: 20000,
    notes: "High-spanning Mediterranean look with superior drainage parameters. Ideal for East Legon climates."
  },
  combo: {
    title: "Waterproofing & Ceiling Restoration Combo",
    items: [
      {
        id: "1",
        name: "Watertight Concrete Sealing & Waterproofing",
        description: "Surgical membrane waterproofing over flat concrete decks and joint seals.",
        quantity: 1,
        unitPrice: 5500,
      },
      {
        id: "2",
        name: "POP Ceiling & Interior Gypsum Board Framing",
        description: "Premium architectural plaster ceilings with recessed LED panel borders.",
        quantity: 12,
        unitPrice: 650,
      },
      {
        id: "3",
        name: "UV-Reflective Weather-Shield Roof Spray Painting",
        description: "Elite coating applied to restore faded sheets and block tropical infrared rays.",
        quantity: 1,
        unitPrice: 3500,
      },
      {
        id: "4",
        name: "Joint Damp-Proofing & Diagnostic Audit",
        description: "Sealing concrete wall damp spots and full structural integrity verification.",
        quantity: 1,
        unitPrice: 1200,
      }
    ],
    warranty: 15,
    duration: "3-5 Days",
    deposit: 10000,
    notes: "Combo bundle saves 15% on overall trades coordination. Unified schedule eliminates contractor friction."
  }
};

// Option A and Option B Quick Select Items (from Handwritten Spec Sheet)
export const INVOICE_OPTION_A_ITEMS = [
  { name: "Seamless selflock (0.05)", description: "Premium 0.05mm seamless selflock concealed fastener roofing sheets", unitPrice: 220.00 },
  { name: "Seamless selflock (0.045)", description: "Premium 0.045mm seamless selflock concealed fastener roofing sheets", unitPrice: 211.10 },
  { name: "Seamless selflock (0.04)", description: "Premium 0.04mm seamless selflock concealed fastener roofing sheets", unitPrice: 198.80 },
  { name: "IBR - (0.05)", description: "Premium 0.05mm Inverted Box Rib (IBR) angular roofing profile", unitPrice: 189.00 },
  { name: "IBR - 0.045", description: "Premium 0.045mm Inverted Box Rib (IBR) angular roofing profile", unitPrice: 175.50 },
  { name: "IBR - 0.04", description: "Premium 0.04mm Inverted Box Rib (IBR) angular roofing profile", unitPrice: 160.00 },
  { name: "Transparent polycarb (White, Bro)", description: "White & Bronze transparent polycarbonate impact-resistant skylight sheet", unitPrice: 245.00 },
  { name: "Transparent polycarb (Blue, green)", description: "Blue & Green transparent polycarbonate impact-resistant skylight sheet", unitPrice: 245.00 },
  { name: "Transparent polycarb (Brown)", description: "Brown transparent polycarbonate impact-resistant skylight sheet", unitPrice: 245.00 },
  { name: "steptiles", description: "Mediterranean style Step Tiles residential profile roofing sheets", unitPrice: 115.00 },
  { name: "Galvanized iron PPGI / PPG2", description: "Pre-Painted Galvanized Iron PPGI / PPG2 heavy-duty roofing panels", unitPrice: 130.00 },
  { name: "Long span", description: "Long span corrugated premium roofing profile sheets", unitPrice: 125.00 }
];

export const INVOICE_OPTION_B_ITEMS = [
  { name: "Rain gutter Droopout", description: "Aluzinc rain gutter downpipe dropout outlet drainage pieces", unitPrice: 55.00 },
  { name: "Rain caps", description: "Aluzinc protective rain caps and cover fittings", unitPrice: 45.00 },
  { name: "Valleys", description: "Heavy-gauge internal roof valley flashing system", unitPrice: 40.00 },
  { name: "site trim", description: "Custom site trim and perimeter barge flashing lines", unitPrice: 41.00 },
  { name: "Rivert pin", description: "High strength stainless steel rivet pins and fasteners", unitPrice: 18.20 },
  { name: "selflock Fixing & nails", description: "Concealed selflock fixing clips and specialized 2\" anchor nails", unitPrice: 18.20 },
  { name: "sealand", description: "Elite high-grade watertight silicone roof joint sealant", unitPrice: 22.00 },
  { name: "Ibr screw nails", description: "Heavy-duty matching IBR profile specialized roofing screw nails", unitPrice: 20.00 }
];

export const INVOICE_OFFLINE_SERVICES = [
  { name: "Woodwork & Carpentry", description: "High-grade structural timber construction and roof woodwork framing alignment", unitPrice: 4500.00 },
  { name: "Consultancy & Design Audit", description: "Professional structural design audit and on-site engineering advisory", unitPrice: 1200.00 },
  { name: "Project Supervision (Abroad)", description: "Remote site supervision for clients living abroad with HD live feeds and progress reports", unitPrice: 2500.00 },
  { name: "Site Measurement & Diagnostics", description: "In-person laser-guided roof dimensions measurement and structural audit", unitPrice: 500.00 },
  { name: "Waterproofing & Leak Sealing", description: "Anti-leak waterproofing treatments and seam joint sealant reinforcement", unitPrice: 1800.00 },
  { name: "Exterior Painting & Protective Spraying", description: "UV-reflective protective paint spraying on faded or weathered roofing sheets", unitPrice: 3500.00 }
];

// Admin Credentials
const TARGET_ADMIN_EMAIL = "zofroofingsyst@gamil.com";
const TARGET_ADMIN_EMAIL_ALT = "zofroofingsyst@gmail.com";
const TARGET_ADMIN_PASSWORDS = ["P,485ks@m", ",P,485ks@m"];

export function ProposalReceiptGenerator({
  isAdmin: propIsAdmin = true,
  onAttachToForm,
  onScrollToForm,
  initialConsultationId,
  restoredInvoice,
  onSaveSuccess,
  onPrintSuccess
}: ProposalReceiptGeneratorProps) {
  // Document mode state
  const [docMode, setDocMode] = useState<"proposal" | "proforma" | "receipt">("proposal");

  // Agreement and Page Navigation state
  const [includeAgreement, setIncludeAgreement] = useState<boolean>(true);
  const [previewSheetTab, setPreviewSheetTab] = useState<"page1" | "page2" | "combined">("page1");
  const [isAgreementEditorOpen, setIsAgreementEditorOpen] = useState<boolean>(false);
  const [isTermsCollapsed, setIsTermsCollapsed] = useState<boolean>(false);
  const [agreementCustomData, setAgreementCustomData] = useState<AgreementData>({
    validityDays: 10,
    depositPercent: 80,
    finalPercent: 20,
    gtBankAccount: "3221-00101-5330",
    gtAccountName: "Zof Roofing System",
    momoNumber: "0597391978",
    refundPenaltyPercent: 10,
    collectionTolerancePercent: 17,
    uncollectedPenaltyPercent: 20,
    uncollectedWeeks: 2,
    preparedByName: "Mr Francis O. Dugbazah",
    preparedByTitle: "MD",
    preparedByTel: "0577796161",
    email: "hrzof1@gmail.com",
    digitalAddress: "GC -088-4481",
    contactPhones: "0577796161 - 0242866658"
  });

  // Print feedback and toast state
  const [isPreparingPrint, setIsPreparingPrint] = useState(false);
  const [printToast, setPrintToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isPrintUnlocked, setIsPrintUnlocked] = useState(false);
  const [unlockedReason, setUnlockedReason] = useState<string>("Enter client information to authorize");

  const handlePrint = () => {
    if (!isPrintUnlocked) {
      setPrintToast({ message: "Print dialog is locked. Please select an invoice/receipt or supply client details first.", type: "error" });
      setTimeout(() => setPrintToast(null), 4000);
      return;
    }

    // Show 'Preparing print' loading state
    setIsPreparingPrint(true);
    
    // Auto-timeout to clear loading after 1.2 seconds, trigger print, and show success toast
    setTimeout(() => {
      setIsPreparingPrint(false);
      
      // Copy content to print-root to guarantee no modal/styling parent constraints hide it
      let printRoot = document.getElementById("print-root");
      if (!printRoot) {
        printRoot = document.createElement("div");
        printRoot.id = "print-root";
        document.body.appendChild(printRoot);
      }
      printRoot.innerHTML = "";

      // Determine which pages to print
      if (previewSheetTab === "page2") {
        // Print ONLY Page 2: Terms & Conditions Agreement
        const termsArea = document.getElementById("terms-conditions-sheet") || document.getElementById("hidden-terms-conditions-sheet");
        if (termsArea) {
          const pageDiv = document.createElement("div");
          pageDiv.className = "print-page";
          const clone = termsArea.cloneNode(true) as HTMLElement;
          clone.id = "terms-conditions-sheet-clone";
          pageDiv.appendChild(clone);
          printRoot.appendChild(pageDiv);
        }
      } else if (!includeAgreement && previewSheetTab === "page1") {
        // Print ONLY Page 1: Invoice / Proforma
        const printArea = document.getElementById("printable-document-area");
        if (printArea) {
          const pageDiv = document.createElement("div");
          pageDiv.className = "print-page";
          const clone = printArea.cloneNode(true) as HTMLElement;
          clone.id = "printable-document-area-clone";
          const printHiddenElements = clone.querySelectorAll(".print\\:hidden");
          printHiddenElements.forEach((el) => el.remove());
          pageDiv.appendChild(clone);
          printRoot.appendChild(pageDiv);
        }
      } else {
        // Multi-page print: Page 1 (Invoice / Proforma / Proposal) + Page 2 (Attached Terms & Conditions Agreement)
        const printArea = document.getElementById("printable-document-area");
        if (printArea) {
          const page1Div = document.createElement("div");
          page1Div.className = "print-page";
          const clone1 = printArea.cloneNode(true) as HTMLElement;
          clone1.id = "printable-document-area-clone";
          const printHiddenElements = clone1.querySelectorAll(".print\\:hidden");
          printHiddenElements.forEach((el) => el.remove());
          page1Div.appendChild(clone1);
          printRoot.appendChild(page1Div);
        }

        const termsArea = document.getElementById("terms-conditions-sheet") || document.getElementById("hidden-terms-conditions-sheet");
        if (termsArea) {
          const page2Div = document.createElement("div");
          page2Div.className = "print-page";
          const clone2 = termsArea.cloneNode(true) as HTMLElement;
          clone2.id = "terms-conditions-sheet-clone";
          page2Div.appendChild(clone2);
          printRoot.appendChild(page2Div);
        }
      }

      // Add print helper mode to document body
      document.body.classList.add("is-printing");

      // Give a tiny tick for layout engine, then print
      setTimeout(() => {
        // Notify server that document has been printed immediately when printing is initiated
        if (documentId) {
          fetch(`/api/invoices/${documentId}/print`, { method: "POST" })
            .then(res => {
              if (res.ok) {
                if (onPrintSuccess) {
                  onPrintSuccess();
                }
              }
            })
            .catch(err => console.error("Error marking invoice as printed", err));
        }

        window.print();
        
        // Remove class after printing starts
        document.body.classList.remove("is-printing");
        if (printRoot) printRoot.innerHTML = "";

        // Show elegant success toast feedback
        const docName = previewSheetTab === "page2"
          ? "Terms & Conditions Agreement"
          : includeAgreement
          ? `${docMode === "proforma" ? "Proforma Invoice" : docMode === "receipt" ? "Receipt" : "Proposal"} + Attached Agreement`
          : (docMode === "proforma" ? "Proforma Invoice" : docMode === "receipt" ? "Paid Receipt" : "Scope Proposal");

        setPrintToast({ message: `Successfully prepared ${docName} for print & PDF download!`, type: "success" });
        
        // Auto-dismiss toast
        setTimeout(() => {
          setPrintToast(null);
        }, 5000);
      }, 350);

    }, 1200);
  };

  // Selected Branch for corporate tracking
  const [selectedBranch, setSelectedBranch] = useState<string>("Accra Head Office");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Restore / load selected invoice from prop
  useEffect(() => {
    if (restoredInvoice) {
      if (restoredInvoice.docMode) setDocMode(restoredInvoice.docMode);
      if (restoredInvoice.customerName) setClientName(restoredInvoice.customerName);
      if (restoredInvoice.customerPhone) setClientPhone(restoredInvoice.customerPhone);
      if (restoredInvoice.customerLocation) setProjectLocation(restoredInvoice.customerLocation);
      if (restoredInvoice.items) setItems(restoredInvoice.items);
      if (restoredInvoice.id) setDocumentId(restoredInvoice.id);
      if (restoredInvoice.proformaRef) setProformaRef(restoredInvoice.proformaRef);
      
      if (restoredInvoice.docMode === "proforma") {
        setDiscountPercent(restoredInvoice.discountPercent ?? 0);
        setInstallationCost(restoredInvoice.installationCost ?? 0);
        setTransportCost(restoredInvoice.transportCost ?? 0);
        setProformaApplyTax(restoredInvoice.applyTax ?? true);
        setProformaPreparedBy(restoredInvoice.preparedBy ?? "Samson K.");
        setProformaApprovedBy(restoredInvoice.approvedBy ?? "F. O. Dugbazah MD");
        if (restoredInvoice.materialsHeader) {
          setMaterialsHeader(restoredInvoice.materialsHeader);
        }
      }
      
      if (restoredInvoice.branch) {
        setSelectedBranch(restoredInvoice.branch);
      }
    }
  }, [restoredInvoice]);

  // Admin Authentication State
  const [isAdmin, setIsAdmin] = useState(propIsAdmin); // Default active for immediate admin proposal template editing
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [officialApprovalStamp, setOfficialApprovalStamp] = useState(true);

  // Proforma Invoice Specific Fields with Dynamic Sequential nzinv Reference
  const [proformaRef, setProformaRef] = useState<string>(() => formatProformaRef(1, new Date()));
  const [proformaVatReg, setProformaVatReg] = useState("P0014921413");

  // Helper handlers for automatic and manual sequential nzinv reference manipulation
  const handleIncrementProformaRef = () => {
    setProformaRef((prev) => incrementProformaRef(prev, issueDate || new Date()));
  };

  const handleDecrementProformaRef = () => {
    setProformaRef((prev) => {
      const parsed = parseProformaRef(prev);
      if (!parsed) return formatProformaRef(1, issueDate || new Date());
      const prevSeq = Math.max(1, parsed.sequence - 1);
      return formatProformaRef(prevSeq, issueDate || new Date());
    });
  };

  const handleSyncDateToProformaRef = () => {
    const parsed = parseProformaRef(proformaRef);
    const seq = parsed ? parsed.sequence : 1;
    setProformaRef(formatProformaRef(seq, issueDate || new Date()));
  };

  const handleSetSpecificSequence = (seq: number) => {
    setProformaRef(formatProformaRef(seq, issueDate || new Date()));
  };
  const [proformaPrintTime, setProformaPrintTime] = useState(() => {
    const todayObj = new Date();
    let hours = todayObj.getHours();
    const minutes = todayObj.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  });
  const [proformaPrintDate, setProformaPrintDate] = useState(() => {
    return new Date().toLocaleDateString("en-GB"); // Returns today's date formatted as DD/MM/YYYY
  });
  const [installationCost, setInstallationCost] = useState<number>(7000);
  const [transportCost, setTransportCost] = useState<number>(1500);
  const [discountPercent, setDiscountPercent] = useState<number>(4);
  const [proformaColour, setProformaColour] = useState("Aluzinc / Wine Red");
  const [proformaPreparedBy, setProformaPreparedBy] = useState("Samson K.");
  const [proformaApprovedBy, setProformaApprovedBy] = useState("F. O. Dugbazah MD");
  const [proformaApplyTax, setProformaApplyTax] = useState<boolean>(true);
  const [proformaTaxScheme, setProformaTaxScheme] = useState<"standard" | "vat_only" | "flat_5" | "exempt">("standard");
  const [materialsHeader, setMaterialsHeader] = useState<string>("Materials (0.45)");

  // Canvas Digital Signature State
  const [digitalSignature, setDigitalSignature] = useState<string | null>(null);
  const [signerName, setSignerName] = useState<string>("Samson K. (Site Manager)");
  const [showQuickSign, setShowQuickSign] = useState<boolean>(false);

  // QR Code Verification Generator State
  const [showQrCode, setShowQrCode] = useState(true);
  const [qrCopied, setQrCopied] = useState(false);

  // Line items state
  const [items, setItems] = useState<ItemLine[]>(PRESETS.selflock.items);
  const [catalogTab, setCatalogTab] = useState<"A" | "B" | "offline">("A");

  // Custom PDF Watermark States
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean>(true);
  const [watermarkType, setWatermarkType] = useState<"text" | "image">("text");
  const [watermarkText, setWatermarkText] = useState<string>("DRAFT");
  const [watermarkImageUrl, setWatermarkImageUrl] = useState<string>("");
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.12);
  const [watermarkRotation, setWatermarkRotation] = useState<number>(-30);
  const [watermarkFontSize, setWatermarkFontSize] = useState<number>(72);

  // Client info state
  const [clientName, setClientName] = useState("Mr. Emmanuel Kwasi Osei");
  const [clientPhone, setClientPhone] = useState("+233 24 286 6658");
  const [clientEmail, setClientEmail] = useState("emmanuel.osei@yahoo.com");
  const [projectLocation, setProjectLocation] = useState("East Legon, Accra");
  const [documentId, setDocumentId] = useState("");
  const [issueDate, setIssueDate] = useState("");

  // Auto-Save and Auto-Preview State Variables
  const [autoPreviewEnabled, setAutoPreviewEnabled] = useState<boolean>(true);
  const [lastAutoSavedAt, setLastAutoSavedAt] = useState<string>("");
  const [autoSaveMessage, setAutoSaveMessage] = useState<string>("");

  // Track print permission states
  useEffect(() => {
    if (restoredInvoice) {
      setIsPrintUnlocked(true);
      setUnlockedReason(`Active Document Selected (ID: ${restoredInvoice.id || "Registry Entry"}) - Print fully authorized.`);
      return;
    }

    if (isAdmin) {
      setIsPrintUnlocked(true);
      setUnlockedReason("Executive Admin Override - Printing fully unlocked.");
      return;
    }

    if (clientName.trim() && clientPhone.trim()) {
      setIsPrintUnlocked(true);
      setUnlockedReason("Valid client details supplied - Ready to print.");
    } else {
      setIsPrintUnlocked(false);
      setUnlockedReason("Supply client name and phone to unlock print layout.");
    }
  }, [clientName, clientPhone, isAdmin, restoredInvoice]);

  // Load from localStorage on mount (Auto-Save restoration)
  useEffect(() => {
    try {
      const savedDataStr = localStorage.getItem("zof_estimate_draft");
      if (savedDataStr) {
        const saved = JSON.parse(savedDataStr);
        if (saved.clientName) setClientName(saved.clientName);
        if (saved.clientPhone) setClientPhone(saved.clientPhone);
        if (saved.clientEmail) setClientEmail(saved.clientEmail);
        if (saved.projectLocation) setProjectLocation(saved.projectLocation);
        if (saved.items && Array.isArray(saved.items)) setItems(saved.items);
        if (saved.docMode) setDocMode(saved.docMode);
        if (saved.selectedBranch) setSelectedBranch(saved.selectedBranch);
        if (saved.installationCost !== undefined) setInstallationCost(saved.installationCost);
        if (saved.transportCost !== undefined) setTransportCost(saved.transportCost);
        if (saved.discountPercent !== undefined) setDiscountPercent(saved.discountPercent);
        if (saved.proformaColour) setProformaColour(saved.proformaColour);
        if (saved.proformaPreparedBy) setProformaPreparedBy(saved.proformaPreparedBy);
        if (saved.proformaApprovedBy) setProformaApprovedBy(saved.proformaApprovedBy);
        if (saved.proformaApplyTax !== undefined) {
          setProformaApplyTax(saved.proformaApplyTax);
          setProformaTaxScheme(saved.proformaApplyTax ? "standard" : "exempt");
        }
        if (saved.proformaTaxScheme !== undefined) setProformaTaxScheme(saved.proformaTaxScheme);
        if (saved.materialsHeader !== undefined) setMaterialsHeader(saved.materialsHeader);
        
        const now = new Date();
        setLastAutoSavedAt(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setAutoSaveMessage("⚡ Draft Restored from last session");
        setTimeout(() => setAutoSaveMessage(""), 4000);
      }
    } catch (err) {
      console.warn("Failed to load estimate draft from localStorage", err);
    }
  }, []);

  // Periodic Auto-Save mechanism triggers on input modification
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      try {
        const draftPayload = {
          clientName,
          clientPhone,
          clientEmail,
          projectLocation,
          items,
          docMode,
          selectedBranch,
          installationCost,
          transportCost,
          discountPercent,
          proformaColour,
          proformaPreparedBy,
          proformaApprovedBy,
          proformaApplyTax,
          proformaTaxScheme,
          materialsHeader
        };
        localStorage.setItem("zof_estimate_draft", JSON.stringify(draftPayload));
        
        const now = new Date();
        setLastAutoSavedAt(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setAutoSaveMessage("⚡ Auto-Saved");
        setTimeout(() => setAutoSaveMessage(""), 2000);
      } catch (err) {
        console.warn("Could not save estimate draft to localStorage", err);
      }
    }, 1500); // 1.5s debounce to optimize browser rendering

    return () => clearTimeout(saveTimer);
  }, [
    clientName,
    clientPhone,
    clientEmail,
    projectLocation,
    items,
    docMode,
    selectedBranch,
    installationCost,
    transportCost,
    discountPercent,
    proformaColour,
    proformaPreparedBy,
    proformaApprovedBy,
    proformaApplyTax,
    proformaTaxScheme,
    materialsHeader
  ]);

  // Dynamic Currency Converter State for Diaspora clients
  const [currency, setCurrency] = useState<"GHS" | "USD">("GHS");
  const [exchangeRate, setExchangeRate] = useState<number>(14.50);

  const formatCurrency = (ghsAmount: number, withLabel = true) => {
    if (currency === "USD") {
      const usdAmount = ghsAmount / exchangeRate;
      return withLabel 
        ? `$ ${usdAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
        : usdAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return withLabel
      ? `GH₵ ${ghsAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : ghsAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Financial adjusters
  const [vatPercent, setVatPercent] = useState<number>(0); // e.g. 5% or 15% or 0%
  const [discountAmount, setDiscountAmount] = useState<number>(1500); // flat discount in GHC

  // Auxiliary details
  const [warrantyYears, setWarrantyYears] = useState<number>(50);
  const [estDuration, setEstDuration] = useState<string>("5-7 Days");
  const [depositPaid, setDepositPaid] = useState<number>(30000);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer / Mobile Money");
  const [termsAndNotes, setTermsAndNotes] = useState(PRESETS.selflock.notes);

  // Interactive UI feedback
  const [copied, setCopied] = useState(false);
  const [attached, setAttached] = useState(false);

  // Consultation Form Auto-Populate State
  const [consultationsList, setConsultationsList] = useState<any[]>([]);
  const [loadingConsultations, setLoadingConsultations] = useState(false);
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);
  const [autoPopulatedNotice, setAutoPopulatedNotice] = useState<string | null>(null);

  // Fetch consultation submissions on mount
  const fetchConsultations = async () => {
    setLoadingConsultations(true);
    try {
      const res = await fetch("/api/consultation/list");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setConsultationsList(data);
        }
      }
    } catch (err) {
      console.error("Failed to load consultation list", err);
    } finally {
      setLoadingConsultations(false);
    }
  };

  useEffect(() => {
    fetchConsultations();

    // Automatically sync active sequential proforma reference on mount
    const fetchNextProformaRef = async () => {
      if (restoredInvoice) return;
      try {
        const res = await fetch(`/api/invoices/next-proforma-ref?date=${new Date().toISOString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.nextRef) {
            setProformaRef(data.nextRef);
          }
        }
      } catch (err) {
        console.warn("Using local sequence for proforma reference", err);
      }
    };
    fetchNextProformaRef();
  }, []);

  useEffect(() => {
    if (initialConsultationId && consultationsList.length > 0) {
      handleSelectAndPopulateConsultation(initialConsultationId);
    }
  }, [initialConsultationId, consultationsList.length]);

  // Helper to build line items from a Consultation submission
  const buildItemsFromConsultation = (consultation: any): ItemLine[] => {
    const est = consultation.estimateDetails;
    if (!est) {
      const defaultItems: ItemLine[] = [
        {
          id: "c-item-1",
          name: "Diagnostic Site Assessment & Roof Leak Audit",
          description: `Comprehensive diagnostic log for property in ${consultation.city || "Accra"}. Reported condition: ${consultation.roofCondition?.replace(/_/g, " ") || "Audit requested"}.`,
          quantity: 1,
          unitPrice: 1500,
        }
      ];
      if (consultation.undertakings?.includes("Woodwork")) {
        defaultItems.push({
          id: "c-item-2",
          name: "Timber Carpentry & Structural Truss Framing",
          description: "Anti-termite treated hardwood timber trusses, wall plates, rafters & bracing.",
          quantity: 1,
          unitPrice: 18500,
        });
      }
      if (consultation.undertakings?.includes("Consultancy")) {
        defaultItems.push({
          id: "c-item-3",
          name: "Metal Sheeting & Coastal Durability Consultancy",
          description: "Atmospheric marine-grade durability analysis and customized sheet profile fitting.",
          quantity: 1,
          unitPrice: 22000,
        });
      }
      return defaultItems;
    }

    const area = est.areaSqFt || 2000;
    const itemsList: ItemLine[] = [];

    let profileName = "Selflock® Interlocking 0.50mm Roofing Sheets";
    let unitRate = 120;
    if (est.roofType === "step_tiles") {
      profileName = "Mediterranean Step Tiles 0.45mm Sheeting";
      unitRate = 115;
    } else if (est.roofType === "ibr") {
      profileName = "IBR Industrial Longspan 0.55mm Sheeting";
      unitRate = 95;
    } else if (est.roofType === "idt") {
      profileName = "IDT Industrial Deep Trough Sheeting";
      unitRate = 100;
    } else if (est.roofType === "aluminium_plain") {
      profileName = "Marine-Grade Aluminium Plain Solid Sheeting";
      unitRate = 145;
    } else if (est.roofType === "galvanize") {
      profileName = "Passivated Galvanized High-Tensile Steel Sheeting";
      unitRate = 75;
    } else if (est.roofType === "aluzinc_plain") {
      profileName = "Aluzinc Dual-Alloy Plain Anti-Corrosion Sheeting";
      unitRate = 110;
    } else if (est.roofType === "transparent_sheets") {
      profileName = "UV-Stabilized Polycarbonate Skylight Sheeting";
      unitRate = 65;
    }

    // Line 1: Sheeting Material
    itemsList.push({
      id: "c-item-1",
      name: profileName,
      description: `Factory precision custom length sheeting covering approx. ${area.toLocaleString()} sq ft deck footprint.`,
      quantity: area,
      unitPrice: unitRate,
    });

    // Line 2: Structural Carpentry
    itemsList.push({
      id: "c-item-2",
      name: "Treated Hardwood Timber Trusses & Structural Framing",
      description: "Pressure-treated timber wall plates, rafters, purlins, king-posts & bracing erection.",
      quantity: 1,
      unitPrice: Math.round(area * 18),
    });

    // Line 3: Seamless Gutters (if requested)
    if (est.includeGutters) {
      itemsList.push({
        id: "c-item-3",
        name: "Seamless Aluminum Rain Gutter System & Downpipes",
        description: "On-site custom continuous box gutters with downspout drainage connectors.",
        quantity: Math.round(4 * Math.sqrt(area)),
        unitPrice: 85,
      });
    }

    // Line 4: Thermal Insulation (if requested)
    if (est.premiumInsulation) {
      itemsList.push({
        id: "c-item-4",
        name: "Double-Sided Radiant Thermal Heat Shield Membrane",
        description: "Sub-sheeting reflective foil insulation layer reducing interior building heat.",
        quantity: area,
        unitPrice: 25,
      });
    }

    return itemsList;
  };

  // Populate handler
  const handleSelectAndPopulateConsultation = (id: string) => {
    setSelectedConsultationId(id);
    const found = consultationsList.find((c) => c.id === id);
    if (!found) return;

    setClientName(found.fullName || "");
    setClientPhone(found.phone || "");
    setClientEmail(found.email || "");
    setProjectLocation(found.city ? `${found.city}, Ghana` : "Accra, Ghana");

    // Reference ID formatting
    const cleanId = found.id ? found.id.replace("ROOF-", "") : Math.floor(1000 + Math.random() * 9000);
    const dateYear = new Date().getFullYear();
    setDocumentId(`ZOF-PROP-${dateYear}-${cleanId}`);

    // Sequential nzinv reference generation based on consultation sequence and date
    const consIndex = consultationsList.findIndex((c) => c.id === id);
    const seqNum = consIndex >= 0 ? consIndex + 1 : 1;
    const targetDate = found.timestamp ? new Date(found.timestamp) : new Date();
    setProformaRef(formatProformaRef(seqNum, targetDate));

    // Today's date or preferred date
    const today = new Date().toISOString().split("T")[0];
    setIssueDate(today);
    setProformaPrintDate(new Date().toLocaleDateString("en-GB"));
    
    // Dynamic current time format: "09:30 am" or "10:15 pm"
    const todayObj = new Date();
    let hours = todayObj.getHours();
    const minutes = todayObj.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    setProformaPrintTime(`${hours}:${minutesStr} ${ampm}`);

    // Formulate custom terms & disclaimers
    const condText = found.roofCondition ? found.roofCondition.replace(/_/g, " ") : "Inspection requested";
    const undertText = (found.undertakings || []).join(", ");
    const noteText = found.notes ? ` Notes: ${found.notes}` : "";
    setTermsAndNotes(`Site Condition: ${condText}. Scope: ${undertText}.${noteText}`);

    // Populate line items
    const generatedItems = buildItemsFromConsultation(found);
    setItems(generatedItems);

    // If estimate details exist, update proforma & financial parameters
    if (found.estimateDetails) {
      const est = found.estimateDetails;
      if (est.roofType === "selflock") setProformaColour("Aluzinc / Wine Red");
      else if (est.roofType === "step_tiles") setProformaColour("Cottage Green");
      else if (est.roofType === "ibr") setProformaColour("Deep Ocean");
      else if (est.roofType === "aluminium_plain") setProformaColour("Plain Marine Silver");
      
      if (est.totalEstimatedMin) {
        setDepositPaid(Math.round(est.totalEstimatedMin * 0.6));
      }
    }

    setAutoPopulatedNotice(`⚡ Populated fields from Submission #${found.id} (${found.fullName})!`);
    setTimeout(() => setAutoPopulatedNotice(null), 5000);
  };

  // Initialize dates and unique document IDs on mount
  useEffect(() => {
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0];
    setIssueDate(dateStr);

    const randNum = Math.floor(100000 + Math.random() * 900000);
    const prefix = docMode === "proposal" ? "P" : docMode === "proforma" ? "INV" : "R";
    setDocumentId(`ZOF-${prefix}-2026-${randNum}`);

    // Automatically remove 'DRAFT' watermark from official paid receipts
    if (docMode === "receipt") {
      setWatermarkEnabled(false); // Disabled by default for clean receipts
      if (watermarkText === "DRAFT") {
        setWatermarkText("PAID");
      }
    } else {
      // Restore default preview watermark for proposals & proformas
      setWatermarkEnabled(true);
      if (watermarkText === "PAID") {
        setWatermarkText("DRAFT");
      }
    }
  }, [docMode]);

  // Fetch real-time GHS exchange rate on load
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        if (res.ok) {
          const data = await res.json();
          if (data && data.rates && data.rates.GHS) {
            setExchangeRate(parseFloat(parseFloat(data.rates.GHS).toFixed(2)));
          }
        }
      } catch (err) {
        console.warn("Could not retrieve real-time exchange rate, using standard billing rate 14.50", err);
      }
    };
    fetchRate();
  }, []);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vatAmount = Math.round((subtotal * vatPercent) / 100);
  const total = Math.max(0, subtotal + vatAmount - discountAmount);
  const outstandingBalance = Math.max(0, total - depositPaid);

  // Proforma Calculations
  const proformaDiscountAmount = (subtotal * discountPercent) / 100;
  const proformaMaterialsTotal = subtotal - proformaDiscountAmount;
  const proformaSupplyValue = proformaMaterialsTotal + installationCost + transportCost;
  
  const proformaLeviesAmount = (proformaApplyTax && proformaTaxScheme === "standard") 
    ? Math.round(proformaSupplyValue * 0.06) 
    : 0;
    
  const proformaVatAmount = !proformaApplyTax ? 0 :
    proformaTaxScheme === "standard" ? Math.round((proformaSupplyValue + proformaLeviesAmount) * 0.15) :
    proformaTaxScheme === "vat_only" ? Math.round(proformaSupplyValue * 0.15) :
    proformaTaxScheme === "flat_5" ? Math.round(proformaSupplyValue * 0.05) : 0;
    
  const proformaGrandTotal = proformaSupplyValue + proformaLeviesAmount + proformaVatAmount;

  // QR Code Verification & Mobile Sharing Helper
  const getQrVerificationText = () => {
    const isProforma = docMode === "proforma";
    const refCode = isProforma ? proformaRef : (documentId || "ZOF-2026-EST");
    const totalVal = isProforma ? proformaGrandTotal : total;
    const dateStr = isProforma ? proformaPrintDate : (issueDate || "13/08/2026");

    return `${docMode === "receipt" ? "ZOF ROOFING SYSTEM" : "ZOF ROOFING SYSTEM"}
OFFICIAL VERIFICATION & AUDIT
Type: ${isProforma ? "PROFORMA INVOICE" : docMode.toUpperCase() + " RECEIPT"}
Ref ID: ${refCode}
Client: ${clientName}
Site: ${projectLocation}
Date: ${dateStr}
Grand Total: GHC ${totalVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Inspector: ${signerName || proformaPreparedBy}
Phone: ${clientPhone}
Verify URL: https://zofroofing.com/verify?ref=${encodeURIComponent(refCode)}`;
  };

  const handleWhatsAppShare = () => {
    const text = getQrVerificationText();
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleCopyQrSummary = () => {
    navigator.clipboard.writeText(getQrVerificationText());
    setQrCopied(true);
    setTimeout(() => setQrCopied(false), 2500);
  };

  // Load preset helper
  const handleLoadPreset = (key: keyof typeof PRESETS) => {
    const preset = PRESETS[key];
    setItems(preset.items);
    setWarrantyYears(preset.warranty);
    setEstDuration(preset.duration);
    setDepositPaid(preset.deposit);
    setTermsAndNotes(preset.notes);

    if (key === "proforma") {
      setDocMode("proforma");
      if ("clientName" in preset) setClientName(preset.clientName);
      if ("clientPhone" in preset) setClientPhone(preset.clientPhone);
      if ("siteLocation" in preset) setProjectLocation(preset.siteLocation);
      if ("proformaRef" in preset) setProformaRef(preset.proformaRef);
      if ("proformaVatReg" in preset) setProformaVatReg(preset.proformaVatReg);
      if ("proformaPrintTime" in preset) setProformaPrintTime(preset.proformaPrintTime);
      if ("proformaPrintDate" in preset) setProformaPrintDate(preset.proformaPrintDate);
      if ("installationCost" in preset) setInstallationCost(preset.installationCost);
      if ("transportCost" in preset) setTransportCost(preset.transportCost);
      if ("discountPercent" in preset) setDiscountPercent(preset.discountPercent);
      if ("proformaColour" in preset) setProformaColour(preset.proformaColour);
      if ("proformaPreparedBy" in preset) setProformaPreparedBy(preset.proformaPreparedBy);
      if ("proformaApprovedBy" in preset) setProformaApprovedBy(preset.proformaApprovedBy);
    }
  };

  // Itemized list handlers
  const handleAddItem = () => {
    const newItem: ItemLine = {
      id: Date.now().toString(),
      name: "New Custom Roofing Item",
      description: "Enter detailed technical description of materials or service.",
      quantity: 1,
      unitPrice: 1000,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleUpdateItem = (id: string, field: keyof ItemLine, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Copy Plain Text Invoice Handler
  const handleCopyText = () => {
    const separator = "=========================================";
    const itemsText = items
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.name}\n   - Spec: ${it.description}\n   - Qty: ${it.quantity} | Rate: GHC ${it.unitPrice.toLocaleString()} | Subtotal: GHC ${(it.quantity * it.unitPrice).toLocaleString()}`
      )
      .join("\n\n");

    const textToCopy = `
${separator}
ZOF GROUP - OFFICIAL ${docMode === "proposal" ? "SCOPE PROPOSAL" : "PAYMENT RECEIPT"}
${separator}
DOCUMENT ID: ${documentId}
ISSUE DATE: ${issueDate}
${docMode === "receipt" ? `PAYMENT METHOD: ${paymentMethod}` : ""}

CLIENT DETAILS:
- Name: ${clientName}
- Phone: ${clientPhone}
- Email: ${clientEmail}
- Project Location: ${projectLocation}

${docMode === "proposal" ? "PROPOSED WORKS SCHEDULE:" : "ITEMIZED LEDGER OF CHARGES:"}
${itemsText}

${separator}
FINANCIAL BREAKDOWN:
- Subtotal: GHC ${subtotal.toLocaleString()}
- VAT (${vatPercent}%): GHC ${vatAmount.toLocaleString()}
- Applied Discount: GHC ${discountAmount.toLocaleString()}
- Total Amount: GHC ${total.toLocaleString()}
${docMode === "receipt" ? `- Amount Paid (Deposit): GHC ${depositPaid.toLocaleString()}\n- Outstanding Balance: GHC ${outstandingBalance.toLocaleString()}` : ""}

WARRANTY PROTECTION: ${warrantyYears}-Year Watertight Leak Certificate
ESTIMATED TIME FRAME: ${estDuration}

TERMS & NOTES:
${termsAndNotes}

This document is authorized by ZOF Group Certified Systems.
Address: 45 Industrial Close, Accra, Ghana
WhatsApp Support: +233 54 633 1603 | Hotline: 0242 866 658
${separator}
`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Attach Document to main Consultation Form
  const handleAttachDocument = () => {
    onAttachToForm({
      title: docMode === "proposal" ? "Official Scope Proposal" : "Official Paid Receipt",
      items,
      subtotal,
      vat: vatAmount,
      discount: discountAmount,
      total,
      docId: documentId,
      clientName,
      location: projectLocation,
    });
    setAttached(true);
    setTimeout(() => setAttached(false), 3000);
    onScrollToForm();
  };

  // Auto-sync offline saved invoices when going online
  useEffect(() => {
    const handleOnline = async () => {
      try {
        const offlineInvoices = JSON.parse(localStorage.getItem("zof_offline_invoices") || "[]");
        if (offlineInvoices.length === 0) return;

        console.log(`Synchronizing ${offlineInvoices.length} offline invoice(s) with MD registry...`);
        const successfullySynced: any[] = [];
        
        for (const payload of offlineInvoices) {
          try {
            const res = await fetch("/api/invoices", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });
            if (res.ok) {
              successfullySynced.push(payload.id);
            }
          } catch (err) {
            console.error("Failed to sync offline invoice", payload.id, err);
          }
        }

        if (successfullySynced.length > 0) {
          const remaining = offlineInvoices.filter((inv: any) => !successfullySynced.includes(inv.id));
          localStorage.setItem("zof_offline_invoices", JSON.stringify(remaining));
          setSaveMessage(`⚡ Auto-Synced ${successfullySynced.length} offline invoice(s) with central registry!`);
          setTimeout(() => setSaveMessage(null), 5000);
        }
      } catch (err) {
        console.warn("Offline sync check failed", err);
      }
    };

    window.addEventListener("online", handleOnline);
    // Also run immediately on mount if online
    if (typeof navigator !== "undefined" && navigator.onLine) {
      handleOnline();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  // Sync and save generated invoice/receipt to MD Portal Live Registry
  const handleSaveToLiveRegistry = async () => {
    setSaveLoading(true);
    setSaveMessage(null);
    try {
      const isProforma = docMode === "proforma";
      const totalAmount = isProforma ? proformaGrandTotal : total;
      
      const payload = {
        id: documentId,
        proformaRef: isProforma ? proformaRef : undefined,
        branch: selectedBranch,
        docMode,
        customerName: clientName,
        customerPhone: clientPhone,
        customerLocation: projectLocation,
        items,
        subtotal,
        discountPercent: isProforma ? discountPercent : 0,
        installationCost: isProforma ? installationCost : 0,
        transportCost: isProforma ? transportCost : 0,
        applyTax: isProforma ? proformaApplyTax : false,
        totalAmount,
        timestamp: new Date().toISOString(),
        status: "pending_approval",
        preparedBy: isProforma ? proformaPreparedBy : signerName,
        approvedBy: isProforma ? proformaApprovedBy : "F. O. Dugbazah MD",
        materialsHeader: isProforma ? materialsHeader : undefined
      };

      let res;
      let isOfflineSaved = false;

      if (typeof navigator !== "undefined" && !navigator.onLine) {
        const offlineInvoices = JSON.parse(localStorage.getItem("zof_offline_invoices") || "[]");
        // Avoid duplicate ids in queue
        const filtered = offlineInvoices.filter((inv: any) => inv.id !== payload.id);
        filtered.push(payload);
        localStorage.setItem("zof_offline_invoices", JSON.stringify(filtered));
        isOfflineSaved = true;
      } else {
        try {
          res = await fetch("/api/invoices", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
        } catch (fetchErr) {
          const offlineInvoices = JSON.parse(localStorage.getItem("zof_offline_invoices") || "[]");
          const filtered = offlineInvoices.filter((inv: any) => inv.id !== payload.id);
          filtered.push(payload);
          localStorage.setItem("zof_offline_invoices", JSON.stringify(filtered));
          isOfflineSaved = true;
        }
      }

      if (isOfflineSaved) {
        setSaveMessage("⚡ Offline Mode: Saved invoice locally. It will auto-sync with central registry once connectivity is restored.");
        if (isProforma) {
          setProformaRef((prev) => incrementProformaRef(prev, issueDate || new Date()));
        }
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      } else if (res && res.ok) {
        const data = await res.json();
        setSaveMessage(`⚡ Logged successfully to central MD Portal audit! (ID: ${data.invoice.id})`);
        if (isProforma) {
          setProformaRef((prev) => incrementProformaRef(prev, issueDate || new Date()));
        }
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      } else {
        setSaveMessage("❌ Error: Failed to save to central audit database.");
      }
    } catch (err) {
      console.error(err);
      setSaveMessage("❌ Error: Network timeout saving to central database.");
    } finally {
      setSaveLoading(false);
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  // Admin Authentication Actions
  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError("");

    const cleanEmail = inputEmail.trim().toLowerCase();
    const isMatchingEmail =
      cleanEmail === TARGET_ADMIN_EMAIL.toLowerCase() ||
      cleanEmail === TARGET_ADMIN_EMAIL_ALT.toLowerCase();

    if (isMatchingEmail && TARGET_ADMIN_PASSWORDS.includes(inputPassword.trim())) {
      setIsAdmin(true);
      setShowAdminModal(false);
      setAuthError("");
    } else {
      setAuthError("Authentication Failed: Check credentials for zofroofingsyst@gamil.com");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
  };

  return (
    <section id="estimator" className="py-20 bg-stone-50 border-y border-stone-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title & Introduction block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-sm text-blue-700 mb-4 select-none font-semibold">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider">Corporate Bid & Ledger Suite</span>
          </div>
          <h2 className="font-sans font-black text-3xl sm:text-4xl text-stone-900 tracking-tight mb-4">
            Official Scope Proposal & Receipt Builder
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Draft, edit, and print highly compliant scope proposals and paid customer receipts in seconds. Select one of our instant presets, edit items to match real dimensions, and generate fully binding warrants.
          </p>

          {/* Quick Loading Presets Bar */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <span className="text-xs text-stone-500 font-bold self-center mr-2">Load Presets:</span>
            <button
              type="button"
              onClick={() => handleLoadPreset("proforma")}
              className="text-xs font-sans font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center space-x-1"
            >
              <FileCheck className="h-3.5 w-3.5" />
              <span>Official Proforma Invoice (Pastor Kissi Sample)</span>
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset("selflock")}
              className="text-xs font-sans font-bold bg-white hover:bg-stone-100 border border-stone-250 text-stone-700 px-3.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              🏠 Premium Selflock® Roof
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset("steptiles")}
              className="text-xs font-sans font-bold bg-white hover:bg-stone-100 border border-stone-250 text-stone-700 px-3.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              🏢 Step Tiles Residential
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset("combo")}
              className="text-xs font-sans font-bold bg-white hover:bg-stone-100 border border-stone-250 text-stone-700 px-3.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              🛠️ Ceiling & Leak Sealing Combo
            </button>
          </div>
        </div>

        {/* Dashboard Grid split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: The interactive document editor */}
          <div className="lg:col-span-6 bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-md text-left">
            
            {/* AUTO-SAVE STATUS INDICATOR */}
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] font-mono text-stone-500 bg-stone-50 border border-stone-200/60 p-3 rounded-xl shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${autoSaveMessage ? "bg-emerald-500 animate-pulse scale-110" : "bg-blue-500 animate-pulse"}`} />
                  <span>Local State: <strong className="text-stone-700">{autoSaveMessage || "Synced to Browser cache"}</strong></span>
                </div>
                {lastAutoSavedAt && (
                  <p className="text-[10px] text-stone-400">Memory Write: {lastAutoSavedAt}</p>
                )}
              </div>
              
              <button
                type="button"
                onClick={handleSaveToLiveRegistry}
                disabled={saveLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-sans font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer select-none active:scale-95"
              >
                {saveLoading ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <UploadCloud className="h-3.5 w-3.5" />
                )}
                <span>Force Sync to Cloud</span>
              </button>
            </div>

            {saveMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 p-3 rounded-xl text-xs font-mono border ${
                  saveMessage.includes("❌") 
                    ? "bg-red-500/10 border-red-500/20 text-red-600" 
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-700"
                } flex items-center space-x-2`}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-current animate-ping" />
                <span className="font-bold">{saveMessage}</span>
              </motion.div>
            )}

            {/* ADMIN STATUS BANNER */}
            <div className={`p-3.5 rounded-xl mb-5 border transition-all text-xs font-sans ${
              isAdmin 
                ? "bg-slate-900 text-white border-amber-500/40 shadow-sm" 
                : "bg-amber-500/10 border-amber-500/30 text-stone-900"
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className={`h-4 w-4 shrink-0 ${isAdmin ? "text-amber-400" : "text-amber-600"}`} />
                  <div>
                    <span className="font-mono font-bold text-[10px] uppercase tracking-wider block">
                      {isAdmin ? "Admin Mode Active" : "Admin Authentication Required"}
                    </span>
                    <span className="font-semibold text-xs">
                      {isAdmin ? "zofroofingsyst@gamil.com" : "Sign in to manage Official Scope Proposal Template"}
                    </span>
                  </div>
                </div>

                {isAdmin ? (
                  <button
                    type="button"
                    onClick={handleAdminLogout}
                    className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg text-[10px] font-mono font-bold transition-colors cursor-pointer shrink-0 flex items-center space-x-1"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAdminModal(true)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer shrink-0 shadow-sm flex items-center space-x-1"
                  >
                    <Lock className="h-3 w-3" />
                    <span>Admin Login</span>
                  </button>
                )}
              </div>

              {isAdmin && docMode === "proposal" && (
                <div className="mt-2.5 pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-amber-400/90 flex items-center space-x-1">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    <span>Official Admin Scope Template Authorization</span>
                  </span>
                  <label className="inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={officialApprovalStamp}
                      onChange={(e) => setOfficialApprovalStamp(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500 relative"></div>
                    <span className="ml-1.5 text-[10px] text-stone-300">Approval Seal</span>
                  </label>
                </div>
              )}
            </div>

            {/* Header document mode toggle tabs */}
            <div className="flex border border-stone-200 p-1 bg-stone-50 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setDocMode("proposal")}
                className={`flex-1 py-2.5 text-xs font-extrabold font-sans rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  docMode === "proposal"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Scope Proposal</span>
              </button>
              <button
                type="button"
                onClick={() => setDocMode("proforma")}
                className={`flex-1 py-2.5 text-xs font-extrabold font-sans rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  docMode === "proforma"
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <FileCheck className="h-3.5 w-3.5" />
                <span>Proforma Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => setDocMode("receipt")}
                className={`flex-1 py-2.5 text-xs font-extrabold font-sans rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  docMode === "receipt"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Receipt className="h-3.5 w-3.5" />
                <span>Paid Receipt</span>
              </button>
            </div>

            {/* Editor fields grouped */}
            <div className="space-y-5">
              
              {/* Consultation Form Auto-Populate Integration Panel */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 shadow-sm text-left relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center space-x-2">
                    <div className="h-7 w-7 bg-amber-500 text-slate-950 rounded-lg flex items-center justify-center font-bold shrink-0 shadow-xs">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase text-amber-900 text-amber-300 tracking-wider flex items-center space-x-1.5">
                        <span>Auto-Populate from Consultation Submissions</span>
                      </h4>
                      <p className="text-[10px] text-stone-600 text-stone-400 font-sans">
                        Load client contact, site location, and calculated material line items from form submissions.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={fetchConsultations}
                    disabled={loadingConsultations}
                    className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-250 text-stone-800 rounded-lg text-[10px] font-mono font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-xs"
                    title="Fetch latest client submissions"
                  >
                    <RefreshCw className={`h-3 w-3 text-amber-600 ${loadingConsultations ? "animate-spin" : ""}`} />
                    <span>{loadingConsultations ? "Syncing..." : "Sync Submissions"}</span>
                  </button>
                </div>

                {/* Submissions Selector Dropdown & Quick Action */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
                  <div className="sm:col-span-2">
                    <select
                      value={selectedConsultationId || ""}
                      onChange={(e) => handleSelectAndPopulateConsultation(e.target.value)}
                      className="w-full p-2.5 bg-white border border-amber-300 hover:border-amber-500 text-stone-900 rounded-xl font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-xs"
                    >
                      <option value="" disabled>-- Select Client Submission to Auto-Populate --</option>
                      {consultationsList.map((c) => (
                        <option key={c.id} value={c.id}>
                          [{c.id}] {c.fullName} — {c.city} ({c.estimateDetails ? `${c.estimateDetails.roofType?.toUpperCase()} ${c.estimateDetails.areaSqFt}sqft` : "Consultation"})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    disabled={!selectedConsultationId}
                    onClick={() => selectedConsultationId && handleSelectAndPopulateConsultation(selectedConsultationId)}
                    className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 cursor-pointer transition-all shadow-md"
                  >
                    <Zap className="h-3.5 w-3.5 fill-slate-950" />
                    <span>Auto-Fill Invoice</span>
                  </button>
                </div>

                {/* Notification Toast */}
                {autoPopulatedNotice && (
                  <div className="mt-2.5 p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-[11px] font-mono font-bold text-emerald-900 text-emerald-300 flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 text-emerald-400 shrink-0" />
                    <span>{autoPopulatedNotice}</span>
                  </div>
                )}
              </div>

              {/* Branch Selection & MD Portal Sync Panel */}
              <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 shadow-xs text-left relative overflow-hidden">
                <div className="flex items-center space-x-2 mb-2.5">
                  <div className="h-7 w-7 bg-slate-900 text-amber-400 rounded-lg flex items-center justify-center font-bold shrink-0 shadow-xs">
                    <Building className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase text-stone-900 tracking-wider">
                      Corporate Branch & MD Sync
                    </h4>
                    <p className="text-[10px] text-stone-500 font-sans">
                      Assign this document to a specific branch and log it directly into the Managing Director's audit database.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider mb-1">
                      Assigned Branch
                    </label>
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full p-2 bg-white border border-stone-200 focus:border-stone-400 text-stone-900 rounded-lg text-xs font-mono focus:outline-none cursor-pointer"
                    >
                      <option value="Accra Head Office">Accra Head Office</option>
                      <option value="Kumasi Branch">Kumasi Branch</option>
                      <option value="Tema Coastal Hub">Tema Coastal Hub</option>
                      <option value="Diaspora Remote Desk">Diaspora Remote Desk</option>
                    </select>
                  </div>

                  <div>
                    <button
                      type="button"
                      disabled={saveLoading}
                      onClick={handleSaveToLiveRegistry}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${saveLoading ? "animate-spin" : ""}`} />
                      <span>{saveLoading ? "Saving..." : "Save to MD Portal"}</span>
                    </button>
                  </div>
                </div>

                {saveMessage && (
                  <div className={`mt-2.5 p-2 rounded-xl text-[10px] font-mono font-bold flex items-center space-x-2 border ${
                    saveMessage.includes("❌")
                      ? "bg-red-500/10 border-red-500/20 text-red-600"
                      : "bg-emerald-500/10 border-emerald-500/25 text-emerald-700"
                  }`}>
                    <span>{saveMessage}</span>
                  </div>
                )}
              </div>

              {/* Diaspora Client Currency Converter */}
              <div className="bg-amber-50/40 border border-amber-200/50 rounded-2xl p-4 shadow-xs text-left relative overflow-hidden">
                <div className="flex items-center space-x-2 mb-2.5">
                  <div className="h-7 w-7 bg-amber-500 text-slate-950 rounded-lg flex items-center justify-center font-bold shrink-0 shadow-xs">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase text-stone-900 tracking-wider">
                      Diaspora Client Currency Converter
                    </h4>
                    <p className="text-[10px] text-stone-500 font-sans">
                      Toggle active invoice pricing currency between GHS and USD with on-the-fly adjustable rates.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider mb-1">
                      Billing Currency
                    </label>
                    <div className="flex rounded-lg overflow-hidden border border-stone-200 p-0.5 bg-white">
                      <button
                        type="button"
                        onClick={() => setCurrency("GHS")}
                        className={`flex-1 py-1 text-center font-mono text-xs font-bold rounded-md transition-colors cursor-pointer ${
                          currency === "GHS"
                            ? "bg-amber-500 text-slate-950 font-black"
                            : "bg-transparent text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        GHS (₵)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrency("USD")}
                        className={`flex-1 py-1 text-center font-mono text-xs font-bold rounded-md transition-colors cursor-pointer ${
                          currency === "USD"
                            ? "bg-amber-500 text-slate-950 font-black"
                            : "bg-transparent text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        USD ($)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider mb-1">
                      Exchange Rate (GHS per 1 USD)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={exchangeRate}
                        onChange={(e) => setExchangeRate(Math.max(1, parseFloat(e.target.value) || 1))}
                        className="w-full p-1.5 bg-white border border-stone-200 focus:border-stone-400 text-stone-900 rounded-lg text-xs font-mono font-bold focus:outline-none pl-7"
                      />
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-stone-400">GH₵</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Part A: Client Information */}
              <div>
                <h4 className="text-[11px] font-mono uppercase text-stone-400 font-bold tracking-widest border-b border-stone-100 pb-2 mb-3">
                  1. Client & Project Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                      Client Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 hover:bg-stone-50/50 border border-stone-200 focus:border-stone-400 text-stone-900 rounded-lg text-xs font-sans focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                      Project Location / Town
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                      <input
                        type="text"
                        value={projectLocation}
                        onChange={(e) => setProjectLocation(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 hover:bg-stone-50/50 border border-stone-200 focus:border-stone-400 text-stone-900 rounded-lg text-xs font-sans focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                      Client Contact Phone
                    </label>
                    <input
                      type="text"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 hover:bg-stone-50/50 border border-stone-200 focus:border-stone-400 text-stone-900 rounded-lg text-xs font-sans focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                      Client Email Address
                    </label>
                    <input
                      type="text"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 hover:bg-stone-50/50 border border-stone-200 focus:border-stone-400 text-stone-900 rounded-lg text-xs font-sans focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                      Document ID Reference
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                      <input
                        type="text"
                        value={documentId}
                        onChange={(e) => setDocumentId(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 hover:bg-stone-50/50 border border-stone-200 focus:border-stone-400 text-stone-900 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                      Document Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                      <input
                        type="date"
                        value={issueDate}
                        onChange={(e) => {
                          const newDate = e.target.value;
                          setIssueDate(newDate);
                          if (newDate) {
                            const parts = newDate.split("-");
                            if (parts.length === 3) {
                              const [y, m, d] = parts;
                              setProformaPrintDate(`${d}/${m}/${y.slice(-2)}`);
                              // Automatically synchronize month/year in nzinv reference
                              const parsed = parseProformaRef(proformaRef);
                              if (parsed) {
                                setProformaRef(formatProformaRef(parsed.sequence, newDate));
                              }
                            }
                          }
                        }}
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 hover:bg-stone-50/50 border border-stone-200 focus:border-stone-400 text-stone-900 rounded-lg text-xs font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Part B: Itemized line items editor */}
              <div>
                <div className="flex justify-between items-center border-b border-stone-100 pb-2 mb-3">
                  <h4 className="text-[11px] font-mono uppercase text-stone-400 font-bold tracking-widest">
                    2. Itemized Works Schedule & Pricing
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-sans font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                {/* ZOF QUICK-ADD CATALOG PANEL */}
                <div className="mb-5 bg-stone-100/80 border border-stone-200/80 rounded-2xl p-4 text-left shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mb-3">
                    <span className="text-[10px] font-mono font-black uppercase text-stone-600 tracking-wider">
                      ⚡ Quick-Add Item Catalog (Handwritten Specs)
                    </span>
                    <div className="flex rounded-lg overflow-hidden border border-stone-200 p-0.5 bg-white shrink-0 self-start sm:self-center">
                      <button
                        type="button"
                        onClick={() => setCatalogTab("A")}
                        className={`px-3 py-1 text-center font-mono text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
                          catalogTab === "A"
                            ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                            : "bg-transparent text-stone-500 hover:text-stone-850"
                        }`}
                      >
                        Option A (Profiles)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCatalogTab("B")}
                        className={`px-3 py-1 text-center font-mono text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
                          catalogTab === "B"
                            ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                            : "bg-transparent text-stone-500 hover:text-stone-850"
                        }`}
                      >
                        Option B (Accessories)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCatalogTab("offline")}
                        className={`px-3 py-1 text-center font-mono text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
                          catalogTab === "offline"
                            ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                            : "bg-transparent text-stone-500 hover:text-stone-850"
                        }`}
                      >
                        Offline Services
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-stone-500 font-sans mb-3">
                    Click any item below to instantly append it to the current estimate line sheet.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[160px] overflow-y-auto no-scrollbar pr-1">
                    {(catalogTab === "A" ? INVOICE_OPTION_A_ITEMS : catalogTab === "B" ? INVOICE_OPTION_B_ITEMS : INVOICE_OFFLINE_SERVICES).map((catalogItem) => (
                      <button
                        key={catalogItem.name}
                        type="button"
                        onClick={() => {
                          const newId = "quick-" + Math.random().toString(36).substring(2, 9);
                          setItems(prev => [
                            ...prev,
                            {
                              id: newId,
                              name: catalogItem.name,
                              description: catalogItem.description,
                              quantity: 1,
                              unitPrice: catalogItem.unitPrice,
                              lengthMeters: ""
                            }
                          ]);
                        }}
                        className="p-2.5 bg-white hover:bg-amber-500/5 border border-stone-200 hover:border-amber-400/50 rounded-xl text-left cursor-pointer transition-all active:scale-95 group flex flex-col justify-between h-full"
                      >
                        <div className="mb-2">
                          <p className="text-[10.5px] font-sans font-extrabold text-stone-800 line-clamp-2 group-hover:text-amber-700 leading-tight">
                            {catalogItem.name}
                          </p>
                          <p className="text-[8.5px] text-stone-400 line-clamp-1 mt-0.5 leading-none">
                            {catalogItem.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-1.5 border-t border-stone-100 mt-auto">
                          <span className="text-[9px] font-mono font-bold text-stone-600">
                            GH₵ {catalogItem.unitPrice.toFixed(2)}
                          </span>
                          <span className="text-[9px] font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform flex items-center space-x-0.5">
                            <Plus className="h-2.5 w-2.5 shrink-0" />
                            <span>Add</span>
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid list of dynamic rows */}
                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="bg-stone-50 p-3.5 border border-stone-200 rounded-xl relative space-y-2.5 text-left"
                    >
                      <div className="flex justify-between items-center pr-8">
                        <span className="text-[10px] font-mono bg-stone-200 text-stone-750 px-2 py-0.5 rounded font-bold">
                          Item #{idx + 1}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="absolute top-2.5 right-2.5 p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove this item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-5">
                          <div className="flex justify-between items-center mb-0.5">
                            <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider">
                              Item Name / Profile Title
                            </label>
                            <select
                              onChange={(e) => {
                                const selectedVal = e.target.value;
                                if (!selectedVal) return;
                                const optA = INVOICE_OPTION_A_ITEMS.find(x => x.name === selectedVal);
                                const optB = INVOICE_OPTION_B_ITEMS.find(x => x.name === selectedVal);
                                const match = optA || optB;
                                if (match) {
                                  handleUpdateItem(item.id, "name", match.name);
                                  handleUpdateItem(item.id, "description", match.description);
                                  handleUpdateItem(item.id, "unitPrice", match.unitPrice);
                                }
                                e.target.value = ""; // Reset after selection
                              }}
                              className="text-[9px] font-sans font-black text-amber-600 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer max-w-[150px] outline-none"
                              style={{ padding: 0, margin: 0, WebkitAppearance: 'none' }}
                            >
                              <option value="">⚡ Quick Select...</option>
                              <optgroup label="Option A (Roofing Profiles)">
                                {INVOICE_OPTION_A_ITEMS.map((o) => (
                                  <option key={o.name} value={o.name}>{o.name}</option>
                                ))}
                              </optgroup>
                              <optgroup label="Option B (Accessories)">
                                {INVOICE_OPTION_B_ITEMS.map((o) => (
                                  <option key={o.name} value={o.name}>{o.name}</option>
                                ))}
                              </optgroup>
                            </select>
                          </div>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleUpdateItem(item.id, "name", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-200 focus:border-stone-350 text-stone-900 rounded-lg text-xs font-sans focus:outline-none"
                            placeholder="Type or select above..."
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider mb-0.5">
                            Length L(M)
                          </label>
                          <input
                            type="text"
                            value={item.lengthMeters || ""}
                            placeholder="e.g. (23,6,11,6,26)"
                            onChange={(e) => handleUpdateItem(item.id, "lengthMeters", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-200 focus:border-stone-350 text-stone-900 rounded-lg text-xs font-mono focus:outline-none"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider mb-0.5">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-200 focus:border-stone-350 text-stone-900 rounded-lg text-xs font-sans focus:outline-none"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider mb-0.5">
                            Unit Price (GHC)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => handleUpdateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-200 focus:border-stone-350 text-stone-900 rounded-lg text-xs font-sans focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider mb-0.5">
                          Detailed Description of Specific Work
                        </label>
                        <textarea
                          rows={1}
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, "description", e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-200 focus:border-stone-350 text-stone-900 rounded-lg text-xs font-sans focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Part C: Adjusters and parameters */}
              <div>
                <h4 className="text-[11px] font-mono uppercase text-stone-400 font-bold tracking-widest border-b border-stone-100 pb-2 mb-3">
                  3. Taxes, Terms & Invoice Parameters
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {docMode === "proforma" ? (
                    <>
                      <div className="space-y-1 sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-mono text-stone-600 uppercase font-bold tracking-wider">
                            Ref Number <span className="text-amber-600 font-semibold">(Sequential nzinv)</span>
                          </label>
                          <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                            Auto: nzinv0001, 0002, 0003.../MM/YY
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <input
                            type="text"
                            value={proformaRef}
                            onChange={(e) => setProformaRef(e.target.value)}
                            className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 focus:border-amber-500 text-stone-900 rounded-lg text-xs font-mono font-bold tracking-wide focus:outline-none focus:ring-1 focus:ring-amber-500"
                            placeholder="nzinv0001/09/26"
                          />
                          <button
                            type="button"
                            onClick={handleDecrementProformaRef}
                            title="Previous sequence number (-1)"
                            className="px-2.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-mono font-bold border border-stone-300 transition-colors cursor-pointer flex items-center"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={handleIncrementProformaRef}
                            title="Next sequence number (+1)"
                            className="px-2.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-mono font-bold border border-amber-600 transition-colors cursor-pointer flex items-center space-x-1 shadow-xs"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Next Ref</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleSyncDateToProformaRef}
                            title="Sync month and year with document date"
                            className="px-2.5 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer flex items-center space-x-1"
                          >
                            <RefreshCw className="h-3 w-3 text-amber-400" />
                            <span>Sync Date</span>
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[9px] font-mono text-stone-400 uppercase">Sequence:</span>
                          {[1, 2, 3, 4, 5, 10].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => handleSetSpecificSequence(num)}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                                parseProformaRef(proformaRef)?.sequence === num
                                  ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                                  : "bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200"
                              }`}
                            >
                              {String(num).padStart(4, "0")}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                          Materials Section Label
                        </label>
                        <input
                          type="text"
                          value={materialsHeader}
                          onChange={(e) => setMaterialsHeader(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 text-stone-900 rounded-lg text-xs font-sans focus:outline-none"
                          placeholder="e.g. Materials (0.45)"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                          Discount Rate (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={discountPercent}
                          onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 text-stone-900 rounded-lg text-xs font-sans focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                          Installation Cost (GHC)
                        </label>
                        <select
                          value={[0, 1500, 3000, 4500, 7000].includes(installationCost) ? installationCost.toString() : "custom"}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val !== "custom") {
                              setInstallationCost(parseFloat(val));
                            }
                          }}
                          className="w-full px-3 py-2 mb-1.5 bg-stone-50 border border-stone-200 text-stone-900 rounded-lg text-xs font-sans focus:outline-none cursor-pointer"
                        >
                          <option value="0">GHS 0 (No Installation)</option>
                          <option value="1500">GHS 1,500 (Small/Partial Work)</option>
                          <option value="3000">GHS 3,000 (Standard Residential)</option>
                          <option value="4500">GHS 4,500 (Large Residential)</option>
                          <option value="7000">GHS 7,000 (Premium / Commercial)</option>
                          <option value="custom">Custom Amount...</option>
                        </select>
                        <input
                          type="number"
                          min="0"
                          value={installationCost}
                          onChange={(e) => setInstallationCost(parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 text-stone-900 rounded-lg text-xs font-sans focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                          Transport Cost (GHC)
                        </label>
                        <select
                          value={[0, 500, 1000, 1500, 2500].includes(transportCost) ? transportCost.toString() : "custom"}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val !== "custom") {
                              setTransportCost(parseFloat(val));
                            }
                          }}
                          className="w-full px-3 py-2 mb-1.5 bg-stone-50 border border-stone-200 text-stone-900 rounded-lg text-xs font-sans focus:outline-none cursor-pointer"
                        >
                          <option value="0">GHS 0 (Client Pickup)</option>
                          <option value="500">GHS 500 (Local Accra)</option>
                          <option value="1000">GHS 1,000 (Greater Accra)</option>
                          <option value="1500">GHS 1,500 (Regional Delivery)</option>
                          <option value="2500">GHS 2,500 (Long Distance)</option>
                          <option value="custom">Custom Amount...</option>
                        </select>
                        <input
                          type="number"
                          min="0"
                          value={transportCost}
                          onChange={(e) => setTransportCost(parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 text-stone-900 rounded-lg text-xs font-sans focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                          Sheet Colour
                        </label>
                        <input
                          type="text"
                          value={proformaColour}
                          onChange={(e) => setProformaColour(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 text-stone-900 rounded-lg text-xs font-sans focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                          Prepared By
                        </label>
                        <input
                          type="text"
                          value={proformaPreparedBy}
                          onChange={(e) => setProformaPreparedBy(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 text-stone-900 rounded-lg text-xs font-sans focus:outline-none"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider">
                            Printing Date
                          </label>
                          <button
                            type="button"
                            onClick={() => setProformaPrintDate(new Date().toLocaleDateString("en-GB"))}
                            className="text-[9px] font-mono font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200/50 transition-colors"
                            title="Reset to current date"
                          >
                            Set Today
                          </button>
                        </div>
                        <input
                          type="text"
                          value={proformaPrintDate}
                          onChange={(e) => setProformaPrintDate(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 text-stone-900 rounded-lg text-xs font-mono focus:outline-none"
                          placeholder="e.g. DD/MM/YY"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider">
                            Printing Time
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const todayObj = new Date();
                              let hours = todayObj.getHours();
                              const minutes = todayObj.getMinutes();
                              const ampm = hours >= 12 ? 'pm' : 'am';
                              hours = hours % 12;
                              hours = hours ? hours : 12;
                              const minutesStr = minutes < 10 ? '0' + minutes : minutes;
                              setProformaPrintTime(`${hours}:${minutesStr} ${ampm}`);
                            }}
                            className="text-[9px] font-mono font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200/50 transition-colors"
                            title="Reset to current time"
                          >
                            Set Now
                          </button>
                        </div>
                        <input
                          type="text"
                          value={proformaPrintTime}
                          onChange={(e) => setProformaPrintTime(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 text-stone-900 rounded-lg text-xs font-mono focus:outline-none"
                          placeholder="e.g. hh:mm am/pm"
                        />
                      </div>
                      <div className="sm:col-span-2 bg-blue-50/50 border border-blue-200/60 p-3.5 rounded-xl space-y-2.5">
                        <div className="flex items-center space-x-2.5">
                          <input
                            type="checkbox"
                            id="proformaApplyTax"
                            checked={proformaApplyTax}
                            onChange={(e) => setProformaApplyTax(e.target.checked)}
                            className="h-4.5 w-4.5 text-blue-600 border-stone-300 rounded focus:ring-blue-500 cursor-pointer shrink-0"
                          />
                          <div className="text-left flex-1">
                            <label htmlFor="proformaApplyTax" className="text-xs font-sans font-black text-stone-850 cursor-pointer select-none">
                              Apply Taxes & Levies to Proforma Invoice
                            </label>
                            <p className="text-[10px] text-stone-500 font-medium mt-0.5 leading-snug">
                              Calculate and display GETFund/NHIL levies and VAT arithmetically on the document paper.
                            </p>
                          </div>
                        </div>

                        {proformaApplyTax && (
                          <div className="pt-2 border-t border-blue-200/40 text-left">
                            <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                              Select Tax Scheme
                            </label>
                            <select
                              value={proformaTaxScheme}
                              onChange={(e) => setProformaTaxScheme(e.target.value as any)}
                              className="w-full px-3 py-2 bg-white border border-stone-200 text-stone-900 rounded-lg text-xs font-sans focus:outline-none cursor-pointer"
                            >
                              <option value="standard">Standard Ghana Scheme (6% Levies + 15% VAT)</option>
                              <option value="vat_only">VAT Only (15%)</option>
                              <option value="flat_5">VAT Flat Rate (5%)</option>
                              <option value="exempt">Tax Exempt (0% VAT / 0% Levies)</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                          Applied Discount (GHC)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={discountAmount}
                          onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 focus:border-stone-450 text-stone-900 rounded-lg text-xs font-sans focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                          VAT / Tax rate (%)
                        </label>
                        <select
                          value={vatPercent}
                          onChange={(e) => setVatPercent(parseInt(e.target.value))}
                          className="w-full p-2 bg-stone-50 border border-stone-200 text-stone-900 rounded-lg text-xs font-sans cursor-pointer focus:outline-none"
                        >
                          <option value={0}>0% Tax Exempt</option>
                          <option value={5}>5% Flat VAT Rate</option>
                          <option value={15}>15% Ghana Standard VAT</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                          Warranty Sourcing (Yrs)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={warrantyYears}
                          onChange={(e) => setWarrantyYears(parseInt(e.target.value) || 10)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 focus:border-stone-450 text-stone-900 rounded-lg text-xs font-sans focus:outline-none"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                      Estimated Build Window
                    </label>
                    <input
                      type="text"
                      value={estDuration}
                      onChange={(e) => setEstDuration(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 focus:border-stone-450 text-stone-900 rounded-lg text-xs font-sans focus:outline-none"
                    />
                  </div>

                  {docMode === "receipt" ? (
                    <>
                      <div>
                        <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                          Deposit Paid (GHC)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={depositPaid}
                          onChange={(e) => setDepositPaid(parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 focus:border-emerald-500 text-stone-900 rounded-lg text-xs font-sans focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                          Payment Mode
                        </label>
                        <input
                          type="text"
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 focus:border-stone-450 text-stone-900 rounded-lg text-xs font-sans focus:outline-none"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-1">
                        Down Payment Recommendation
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 70% deposit before truss erection"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 text-stone-900 rounded-lg text-xs font-sans focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Part C.5: Custom PDF Watermark & Security Stamp */}
              <div className="pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between mb-3.5">
                  <h4 className="text-[11px] font-mono uppercase text-stone-400 font-bold tracking-widest">
                    3.5 Custom Watermark & Protection Stamp
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={watermarkEnabled}
                      onChange={(e) => setWatermarkEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500 relative"></div>
                    <span className="ml-1.5 text-[10px] font-mono font-bold text-stone-750">
                      {watermarkEnabled ? "Watermark Active" : "Disabled"}
                    </span>
                  </label>
                </div>

                {watermarkEnabled && (
                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-3.5 text-left">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider mb-1">
                          Stamp Type
                        </label>
                        <select
                          value={watermarkType}
                          onChange={(e) => setWatermarkType(e.target.value as "text" | "image")}
                          className="w-full p-2 bg-white border border-stone-200 focus:border-stone-400 text-stone-900 rounded-lg text-xs font-mono focus:outline-none cursor-pointer"
                        >
                          <option value="text">Custom Text (Draft/Confidential)</option>
                          <option value="image">Custom Stamp Image URL</option>
                        </select>
                      </div>

                      {watermarkType === "text" ? (
                        <div>
                          <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider mb-1">
                            Watermark Text
                          </label>
                          <input
                            type="text"
                            value={watermarkText}
                            onChange={(e) => setWatermarkText(e.target.value)}
                            className="w-full p-2 bg-white border border-stone-200 focus:border-stone-400 text-stone-900 rounded-lg text-xs font-mono font-bold focus:outline-none uppercase"
                            placeholder="e.g. DRAFT"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider mb-1">
                            Stamp Image URL
                          </label>
                          <input
                            type="text"
                            value={watermarkImageUrl}
                            onChange={(e) => setWatermarkImageUrl(e.target.value)}
                            className="w-full p-2 bg-white border border-stone-200 focus:border-stone-400 text-stone-900 rounded-lg text-xs font-mono focus:outline-none"
                            placeholder="e.g. https://.../stamp.png"
                          />
                        </div>
                      )}
                    </div>

                    {watermarkType === "text" && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[9px] font-mono text-stone-400 font-bold uppercase mr-1">Presets:</span>
                        {["DRAFT", "CONFIDENTIAL", "COPY", "ORIGINAL", "PENDING APPROVED", "PREVIEW ONLY"].map((pre) => (
                          <button
                            type="button"
                            key={pre}
                            onClick={() => setWatermarkText(pre)}
                            className="px-2 py-0.5 bg-white hover:bg-stone-200 border border-stone-200 text-stone-800 text-[9px] font-mono rounded font-bold cursor-pointer"
                          >
                            {pre}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">
                            Opacity
                          </label>
                          <span className="text-[9px] font-mono font-bold text-stone-700">
                            {Math.round(watermarkOpacity * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.02"
                          max="0.40"
                          step="0.01"
                          value={watermarkOpacity}
                          onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-200 rounded-lg appearance-none"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">
                            Rotation
                          </label>
                          <span className="text-[9px] font-mono font-bold text-stone-700">
                            {watermarkRotation}°
                          </span>
                        </div>
                        <input
                          type="range"
                          min="-90"
                          max="90"
                          step="5"
                          value={watermarkRotation}
                          onChange={(e) => setWatermarkRotation(parseInt(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-200 rounded-lg appearance-none"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">
                            Text/Stamp Size
                          </label>
                          <span className="text-[9px] font-mono font-bold text-stone-700">
                            {watermarkFontSize}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="24"
                          max="130"
                          step="2"
                          value={watermarkFontSize}
                          onChange={(e) => setWatermarkFontSize(parseInt(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-200 rounded-lg appearance-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Part D: Official Terms & Conditions Agreement (Page 2 Attached) */}
              <div className="pt-2 border-t border-stone-200">
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-left">
                      <div className="p-1 bg-red-100 text-red-700 rounded-lg">
                        <FileSignature className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 font-sans">
                          4. Official Terms & Conditions Agreement (Attached Sheet)
                        </h4>
                        <p className="text-[10px] text-stone-500">
                          8-Clause Agreement with Validity, 80/20 Payment, GT Bank & MD Sign-off
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={includeAgreement}
                        onChange={(e) => setIncludeAgreement(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-red-700"></div>
                      <span className="ml-1.5 text-[10px] font-mono font-bold text-stone-700">
                        {includeAgreement ? "Attached" : "Omitted"}
                      </span>
                    </label>
                  </div>

                  {includeAgreement && (
                    <div className="pt-2 border-t border-stone-200/80 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-stone-600 font-bold">Standard Verbatim Attachment:</span>
                        <button
                          type="button"
                          onClick={() => setIsAgreementEditorOpen(!isAgreementEditorOpen)}
                          className="text-blue-700 hover:text-blue-900 font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <span>{isAgreementEditorOpen ? "Hide Clause Settings" : "Edit Clause Values"}</span>
                          {isAgreementEditorOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                      </div>

                      {isAgreementEditorOpen && (
                        <div className="bg-white border border-stone-200 rounded-lg p-3 space-y-3 text-left">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                            <div>
                              <label className="block text-[9px] font-mono text-stone-500 uppercase font-bold">
                                Validity Period (Days)
                              </label>
                              <input
                                type="number"
                                value={agreementCustomData.validityDays || 10}
                                onChange={(e) => setAgreementCustomData({ ...agreementCustomData, validityDays: parseInt(e.target.value) || 10 })}
                                className="w-full px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs font-mono text-stone-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-stone-500 uppercase font-bold">
                                Payment Deposit (%)
                              </label>
                              <input
                                type="number"
                                value={agreementCustomData.depositPercent || 80}
                                onChange={(e) => setAgreementCustomData({ ...agreementCustomData, depositPercent: parseInt(e.target.value) || 80 })}
                                className="w-full px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs font-mono text-stone-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-stone-500 uppercase font-bold">
                                Final Balance (%)
                              </label>
                              <input
                                type="number"
                                value={agreementCustomData.finalPercent || 20}
                                onChange={(e) => setAgreementCustomData({ ...agreementCustomData, finalPercent: parseInt(e.target.value) || 20 })}
                                className="w-full px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs font-mono text-stone-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-stone-500 uppercase font-bold">
                                GT Bank Account Number
                              </label>
                              <input
                                type="text"
                                value={agreementCustomData.gtBankAccount || "3221-00101-5330"}
                                onChange={(e) => setAgreementCustomData({ ...agreementCustomData, gtBankAccount: e.target.value })}
                                className="w-full px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs font-mono text-stone-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-stone-500 uppercase font-bold">
                                Official MoMo Number
                              </label>
                              <input
                                type="text"
                                value={agreementCustomData.momoNumber || "0597391978"}
                                onChange={(e) => setAgreementCustomData({ ...agreementCustomData, momoNumber: e.target.value })}
                                className="w-full px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs font-mono text-stone-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-stone-500 uppercase font-bold">
                                Prepared By (MD Name)
                              </label>
                              <input
                                type="text"
                                value={agreementCustomData.preparedByName || "Mr Francis O. Dugbazah"}
                                onChange={(e) => setAgreementCustomData({ ...agreementCustomData, preparedByName: e.target.value })}
                                className="w-full px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs font-mono text-stone-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-stone-500 uppercase font-bold">
                                MD Contact Tel
                              </label>
                              <input
                                type="text"
                                value={agreementCustomData.preparedByTel || "0577796161"}
                                onChange={(e) => setAgreementCustomData({ ...agreementCustomData, preparedByTel: e.target.value })}
                                className="w-full px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs font-mono text-stone-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-stone-500 uppercase font-bold">
                                Uncollected Delay Penalty (%)
                              </label>
                              <input
                                type="number"
                                value={agreementCustomData.uncollectedPenaltyPercent || 20}
                                onChange={(e) => setAgreementCustomData({ ...agreementCustomData, uncollectedPenaltyPercent: parseInt(e.target.value) || 20 })}
                                className="w-full px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs font-mono text-stone-900"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setPreviewSheetTab("page2")}
                          className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-[10px] font-sans font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View Agreement Sheet (Page 2)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewSheetTab("combined")}
                          className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-[10px] font-sans font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          <Layers className="h-3 w-3" />
                          <span>View Both Pages</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Part E: Custom invoice notes & disclaimers */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider text-left">
                    5. Additional Invoice Notes & Disclaimers
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsTermsCollapsed(prev => !prev)}
                    className="text-[10px] font-mono font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 cursor-pointer flex items-center space-x-1 transition-colors"
                  >
                    <Scale className="h-3 w-3" />
                    <span>Terms Accordion: {isTermsCollapsed ? "Collapsed" : "Expanded"}</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={termsAndNotes}
                  onChange={(e) => setTermsAndNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 hover:border-stone-305 text-stone-900 rounded-lg text-xs font-sans focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>

              {/* Part F: Site Manager Canvas Digital Signature */}
              <div className="pt-2 border-t border-stone-200">
                <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider mb-2 text-left">
                  6. Site Manager / Inspector Canvas Digital Sign-Off
                </label>
                <DigitalSignaturePad
                  signerName={signerName}
                  signerTitle="Site Manager & Quality Inspector"
                  onSignerNameChange={setSignerName}
                  onSignatureChange={setDigitalSignature}
                  initialSignature={digitalSignature}
                />
              </div>

              {/* Part G: QR Code Generator & Mobile Sharing */}
              <div className="pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-mono text-stone-500 uppercase font-bold tracking-wider text-left flex items-center space-x-1.5">
                    <QrCode className="h-3.5 w-3.5 text-amber-600" />
                    <span>7. Mobile QR Code Verification & Share</span>
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showQrCode}
                      onChange={(e) => setShowQrCode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
                    <span className="ml-1.5 text-[10px] font-mono font-bold text-stone-700">
                      {showQrCode ? "QR Shown" : "QR Hidden"}
                    </span>
                  </label>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl flex flex-col sm:flex-row items-center gap-3">
                  <div className="bg-white p-2 border border-stone-250 rounded-lg shadow-xs flex flex-col items-center shrink-0">
                    <QRCodeSVG
                      value={getQrVerificationText()}
                      size={80}
                      level="M"
                    />
                    <span className="text-[7px] font-mono font-bold text-stone-500 mt-1 uppercase tracking-tight">SCAN MOBILE COPY</span>
                  </div>

                  <div className="flex-1 space-y-1.5 w-full text-left">
                    <p className="text-[11px] font-bold text-stone-900 font-sans">
                      Audit & Mobile Share QR Code
                    </p>
                    <p className="text-[10px] text-stone-500 leading-snug">
                      Encodes Ref <span className="font-mono font-bold text-stone-800">{docMode === "proforma" ? proformaRef : documentId}</span>, total, site details, and verification link.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleWhatsAppShare}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-sans font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        <Share2 className="h-3 w-3" />
                        <span>Share WhatsApp</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyQrSummary}
                        className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-[10px] font-sans font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        {qrCopied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        <span>{qrCopied ? "Summary Copied!" : "Copy Summary"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Editor Action buttons */}
            <div className="mt-8 pt-5 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAttachDocument}
                className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl font-sans text-xs font-black tracking-wider uppercase transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              >
                <CheckCircle className="h-4.5 w-4.5" />
                <span>{attached ? "Attached!" : "Attach to Booking Schedule"}</span>
              </button>
              <button
                type="button"
                onClick={handleCopyText}
                className="py-3.5 px-5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-sans text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer border border-stone-250"
              >
                {copied ? (
                  <>
                    <Check className="h-4.5 w-4.5 text-emerald-600" />
                    <span>Plaintext Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4.5 w-4.5 text-stone-500" />
                    <span>Copy Text Block</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: The live document visual preview (rendered like premium corporate paper) */}
          <div className="lg:col-span-6 flex flex-col h-full sticky top-24">
            
            {/* Multi-Page & Document Format Navigator */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-stone-900 border border-stone-800 p-2 rounded-xl text-xs print:hidden shadow-md">
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setPreviewSheetTab("page1")}
                  className={`px-3 py-1.5 rounded-lg font-sans font-bold flex items-center space-x-1.5 transition-all text-xs cursor-pointer ${
                    previewSheetTab === "page1"
                      ? "bg-amber-500 text-stone-950 shadow-sm"
                      : "text-stone-300 hover:text-white hover:bg-stone-800"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Page 1: {docMode === "proforma" ? "Proforma" : docMode === "receipt" ? "Receipt" : "Proposal"}</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setPreviewSheetTab("page2")}
                  className={`px-3 py-1.5 rounded-lg font-sans font-bold flex items-center space-x-1.5 transition-all text-xs cursor-pointer ${
                    previewSheetTab === "page2"
                      ? "bg-red-700 text-white shadow-sm"
                      : "text-stone-300 hover:text-white hover:bg-stone-800"
                  }`}
                >
                  <FileSignature className="h-3.5 w-3.5 text-red-300" />
                  <span>Page 2: Terms & Agreement</span>
                  <span className="bg-red-950 text-red-300 text-[9px] font-mono px-1 py-0.2 rounded border border-red-800 ml-0.5">
                    Official
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewSheetTab("combined")}
                  className={`px-3 py-1.5 rounded-lg font-sans font-bold flex items-center space-x-1.5 transition-all text-xs cursor-pointer ${
                    previewSheetTab === "combined"
                      ? "bg-amber-500 text-stone-950 shadow-sm"
                      : "text-stone-300 hover:text-white hover:bg-stone-800"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>2-Page View</span>
                </button>
              </div>

              <label className="inline-flex items-center space-x-1.5 cursor-pointer text-[11px] font-mono text-stone-300 pr-1 select-none">
                <input
                  type="checkbox"
                  checked={includeAgreement}
                  onChange={(e) => setIncludeAgreement(e.target.checked)}
                  className="rounded border-stone-700 bg-stone-950 text-amber-500 focus:ring-amber-500 h-3.5 w-3.5 cursor-pointer"
                />
                <span>Attach to PDF/Print</span>
              </label>
            </div>

            {/* PAGE 2 VIEW: Render Agreement Sheet */}
            {previewSheetTab === "page2" && (
              <div className="space-y-4">
                <TermsAndConditionsAgreement
                  data={{
                    validityDays: agreementCustomData.validityDays || 10,
                    depositPercent: agreementCustomData.depositPercent || 80,
                    finalPercent: agreementCustomData.finalPercent || 20,
                    gtBankAccount: agreementCustomData.gtBankAccount || "3221-00101-5330",
                    gtAccountName: agreementCustomData.gtAccountName || "Zof Roofing System",
                    momoNumber: agreementCustomData.momoNumber || "0597391978",
                    refundPenaltyPercent: agreementCustomData.refundPenaltyPercent || 10,
                    collectionTolerancePercent: agreementCustomData.collectionTolerancePercent || 17,
                    uncollectedPenaltyPercent: agreementCustomData.uncollectedPenaltyPercent || 20,
                    uncollectedWeeks: agreementCustomData.uncollectedWeeks || 2,
                    preparedByName: agreementCustomData.preparedByName || "Mr Francis O. Dugbazah",
                    preparedByTitle: agreementCustomData.preparedByTitle || "MD",
                    preparedByTel: agreementCustomData.preparedByTel || "0577796161",
                    clientName: clientName,
                    clientPhone: clientPhone,
                    invoiceRef: docMode === "proforma" ? proformaRef : documentId,
                    digitalSignature: digitalSignature,
                    email: agreementCustomData.email || "hrzof1@gmail.com",
                    digitalAddress: agreementCustomData.digitalAddress || "GC -088-4481",
                    contactPhones: agreementCustomData.contactPhones || "0577796161 - 0242866658"
                  }}
                  id="terms-conditions-sheet"
                />
              </div>
            )}

            {/* Live Document Canvas Box (Page 1) */}
            <div 
              id="printable-document-area"
              style={{ display: previewSheetTab === "page2" ? "none" : undefined }}
              className={
                docMode === "proforma"
                  ? "bg-white border-2 border-stone-900 p-5 sm:p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden text-stone-950 shadow-xl min-h-[680px] text-left"
                  : "bg-white border-2 border-stone-200 p-6 sm:p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden text-stone-900 shadow-lg min-h-[620px] text-left"
              }
            >
              {/* WATERMARK LAYER */}
              {watermarkEnabled && (
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
                  style={{ opacity: watermarkOpacity }}
                >
                  {watermarkType === "text" ? (
                    <div 
                      className="font-sans font-black tracking-widest text-center whitespace-nowrap text-stone-900"
                      style={{ 
                        transform: `rotate(${watermarkRotation}deg)`, 
                        fontSize: `${watermarkFontSize}px`,
                        lineHeight: 1
                      }}
                    >
                      {watermarkText || "DRAFT"}
                    </div>
                  ) : (
                    watermarkImageUrl ? (
                      <img 
                        src={watermarkImageUrl} 
                        alt="Watermark" 
                        style={{ 
                          transform: `rotate(${watermarkRotation}deg)`, 
                          maxHeight: `${watermarkFontSize * 2}px`,
                          maxWidth: "80%",
                          objectFit: "contain"
                        }}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      /* Elegant Fallback Branded Watermark Emblem if no custom image is supplied */
                      <div 
                        className="flex flex-col items-center justify-center text-stone-900"
                        style={{ transform: `rotate(${watermarkRotation}deg)` }}
                      >
                        <Award style={{ height: `${watermarkFontSize}px`, width: `${watermarkFontSize}px` }} />
                        <span className="font-mono text-xs font-black uppercase mt-2 tracking-widest">ZOF APPROVED</span>
                      </div>
                    )
                  )}
                </div>
              )}

              {docMode === "proforma" ? (
                /* OFFICIAL PROFORMA INVOICE LOOK matching user provided sample image */
                <div className="relative z-10 flex flex-col justify-between flex-1 w-full font-mono text-stone-950 space-y-4">
                  <div>
                    {/* Header: Logo + Title + Company Address Box */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-3 border-b-2 border-stone-900">
                      {/* Left Header */}
                      <div className="flex items-start space-x-3">
                        <img src={zofLogo} className="h-14 w-14 object-contain rounded-full border border-stone-300 shrink-0" alt="ZOF Logo" referrerPolicy="no-referrer" />
                        <div>
                          <h2 className="font-sans font-black text-base sm:text-lg tracking-wider uppercase text-stone-950 leading-tight">
                            ZOF ROOFING SYSTEM
                          </h2>
                          <div className="bg-[#B2FFFF] text-stone-900 border border-[#8FEBEB] font-mono font-black text-[9px] tracking-widest px-2 py-0.5 rounded uppercase my-0.5 inline-block shadow-sm">
                            <strong>UNDER TAKINGS FREE ESTIMATE</strong>
                          </div>
                          <p className="text-[10px] font-black text-stone-950 uppercase tracking-tight">
                            <strong>Woodwork | Consultancy | Project Supervision</strong>
                          </p>
                          <p className="text-[9px] font-bold text-stone-950">
                            <strong>You can transact remotely and conveniently with us without any stress.</strong>
                          </p>
                        </div>
                      </div>

                      {/* Right Header Company Details */}
                      <div className="text-right text-[10px] font-mono text-stone-850 space-y-0.5 shrink-0 sm:self-center">
                        <p className="font-bold">P.BOX 343</p>
                        <p>E-mail: zofroofingsyst@gmail.com</p>
                        <p className="font-bold">Tel: 0577796161</p>
                        <p>DIGITAL ADDRESS: GC -088-4481</p>
                        <p className="font-bold text-emerald-800">Whatsapp: 0546331603</p>
                      </div>
                    </div>

                    {/* PROFORMA INVOICE Title Banner */}
                    <div className="text-center my-3 border-b-2 border-stone-900 pb-1">
                      <h3 className="font-sans font-black text-lg sm:text-xl tracking-widest text-stone-950 uppercase">
                        PROFORMA INVOICE
                      </h3>
                    </div>

                    {/* Client Information Table Grid with optional QR Code */}
                    <div className="flex items-center justify-between border-2 border-stone-900 p-2.5 bg-stone-50 rounded-lg text-xs font-mono mb-3">
                      <div className="space-y-0.5 text-left">
                        <p><span className="font-bold">BILL TO:</span> {clientName}</p>
                        <p><span className="font-bold">PHONE NUMBER:</span> {clientPhone}</p>
                        <p><span className="font-bold">Site Location:</span> {projectLocation}</p>
                        <p><span className="font-bold">Printing Time:</span> {proformaPrintTime}</p>
                      </div>
                      <div className="space-y-0.5 text-right">
                        <p><span className="font-bold">Ref.</span> {proformaRef}</p>
                        <p><span className="font-bold">Printing Date:</span> {proformaPrintDate}</p>
                        <p><span className="font-bold">VAT Reg:</span> {proformaVatReg}</p>
                      </div>
                      {showQrCode && (
                        <div className="pl-3 border-l-2 border-stone-900 flex flex-col items-center justify-center shrink-0">
                          <QRCodeSVG
                            value={getQrVerificationText()}
                            size={58}
                            level="M"
                          />
                          <span className="text-[7px] font-mono font-black uppercase tracking-tight text-stone-950 mt-0.5">VERIFY QR</span>
                        </div>
                      )}
                    </div>

                    {/* Items Table */}
                    <div className="overflow-x-auto mb-3">
                      <table className="w-full border-collapse border-2 border-stone-900 text-[11px] font-mono">
                        <thead>
                          <tr className="bg-stone-200 border-b-2 border-stone-900 text-stone-950 font-black">
                            <th className="border border-stone-900 p-1 text-center w-8">No.</th>
                            <th className="border border-stone-900 p-1 text-left">Items Description</th>
                            <th className="border border-stone-900 p-1 text-center font-bold">L(M)</th>
                            <th className="border border-stone-900 p-1 text-center w-20">Qty</th>
                            <th className="border border-stone-900 p-1 text-right">Unit Cost</th>
                            <th className="border border-stone-900 p-1 text-right">AMOUNT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Materials Header */}
                          <tr className="bg-stone-100 font-black border-b border-stone-900">
                            <td colSpan={6} className="border border-stone-900 px-2 py-0.5 text-stone-950">
                              <input
                                type="text"
                                value={materialsHeader}
                                onChange={(e) => setMaterialsHeader(e.target.value)}
                                className="w-full bg-transparent hover:bg-stone-200 focus:bg-white border-0 font-mono font-black text-stone-950 outline-none p-0.5 text-left text-[11px] select-all cursor-text rounded"
                                title="Click to edit Materials Section label"
                                placeholder="Materials (e.g. 0.45)"
                              />
                            </td>
                          </tr>
                          {items.map((it, idx) => (
                            <tr key={it.id} className="border-b border-stone-900 group">
                              <td className="border border-stone-900 p-1 text-center font-bold relative min-w-[32px]">
                                <span className="group-hover:opacity-0 transition-opacity duration-150 inline-block">
                                  {idx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(it.id)}
                                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-1 text-red-600 hover:bg-red-50 hover:text-red-700 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer print:hidden"
                                  title="Remove item"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </td>
                              <td className="border border-stone-900 p-1 font-semibold text-left">
                                <input
                                  type="text"
                                  value={it.name}
                                  onChange={(e) => handleUpdateItem(it.id, "name", e.target.value)}
                                  className="w-full bg-transparent hover:bg-stone-100 focus:bg-white focus:ring-1 focus:ring-stone-400 font-sans font-semibold p-0.5 px-1.5 outline-none rounded transition-colors text-[11px] text-stone-950 border-0"
                                />
                                <input
                                  type="text"
                                  value={it.description}
                                  placeholder="Detailed technical specification..."
                                  onChange={(e) => handleUpdateItem(it.id, "description", e.target.value)}
                                  className="w-full bg-transparent hover:bg-stone-100 focus:bg-white focus:ring-1 focus:ring-stone-400 font-sans font-normal p-0.5 px-1.5 outline-none rounded transition-colors text-[9px] text-stone-500 mt-0.5 block border-0"
                                />
                              </td>
                              <td className="border border-stone-900 p-1 text-center font-mono text-[10px]">
                                <input
                                  type="text"
                                  value={it.lengthMeters || ""}
                                  placeholder="-"
                                  onChange={(e) => handleUpdateItem(it.id, "lengthMeters", e.target.value)}
                                  className="w-full bg-transparent hover:bg-stone-100 focus:bg-white focus:ring-1 focus:ring-stone-400 font-mono text-center p-0.5 outline-none rounded transition-colors text-[10px] text-stone-950 border-0"
                                />
                              </td>
                              <td className="border border-stone-900 p-1 text-center w-20">
                                <input
                                  type="number"
                                  value={it.quantity}
                                  onChange={(e) => handleUpdateItem(it.id, "quantity", parseInt(e.target.value) || 0)}
                                  className="w-full bg-transparent hover:bg-stone-100 focus:bg-white focus:ring-1 focus:ring-stone-400 text-center p-0.5 outline-none rounded transition-colors text-[10px] font-mono text-stone-950 border-0"
                                />
                              </td>
                              <td className="border border-stone-900 p-1 text-right w-16">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={it.unitPrice}
                                  onChange={(e) => handleUpdateItem(it.id, "unitPrice", parseFloat(e.target.value) || 0)}
                                  className="w-full bg-transparent hover:bg-stone-100 focus:bg-white focus:ring-1 focus:ring-stone-400 text-right p-0.5 outline-none rounded transition-colors text-[10px] font-mono text-stone-950 border-0"
                                />
                              </td>
                              <td className="border border-stone-900 p-1 text-right font-bold w-20">
                                {formatCurrency(it.quantity * it.unitPrice, false)}
                              </td>
                            </tr>
                          ))}

                          {/* Add Item Action Row inside preview paper */}
                          <tr className="bg-stone-50/50 print:hidden border-b border-stone-900">
                            <td colSpan={6} className="p-1.5 text-center">
                              <button
                                type="button"
                                onClick={handleAddItem}
                                className="inline-flex items-center space-x-1 text-[10px] font-sans font-extrabold text-blue-600 hover:text-blue-700 py-1 px-3 bg-white border border-blue-200 hover:border-blue-400 rounded-lg shadow-sm transition-all cursor-pointer active:scale-95"
                              >
                                <Plus className="h-3 w-3" />
                                <span>Add New Item Row</span>
                              </button>
                            </td>
                          </tr>

                          {/* Summary Rows inside table */}
                          <tr className="bg-stone-50 font-bold border-t-2 border-stone-900">
                            <td colSpan={5} className="border border-stone-900 px-2 py-1 text-right">SUB TOTAL FOR MATERIALS</td>
                            <td className="border border-stone-900 px-2 py-1 text-right">{formatCurrency(subtotal, false)}</td>
                          </tr>
                          {discountPercent > 0 && (
                            <tr className="bg-stone-50">
                              <td colSpan={5} className="border border-stone-900 px-2 py-1 text-right font-semibold">
                                {discountPercent}% DISCOUNT ({formatCurrency((subtotal * discountPercent) / 100)})
                              </td>
                              <td className="border border-stone-900 px-2 py-1 text-right font-bold text-emerald-800">
                                {formatCurrency(proformaMaterialsTotal, false)}
                              </td>
                            </tr>
                          )}
                          <tr className="bg-stone-100 font-black">
                            <td colSpan={5} className="border border-stone-900 px-2 py-1 text-right uppercase">Materials TOTAL</td>
                            <td className="border border-stone-900 px-2 py-1 text-right font-black">{formatCurrency(proformaMaterialsTotal, false)}</td>
                          </tr>
                          <tr className="bg-stone-50 font-semibold">
                            <td colSpan={5} className="border border-stone-900 px-2 py-1 text-right">INSTALLATION</td>
                            <td className="border border-stone-900 px-2 py-1 text-right">{formatCurrency(installationCost, false)}</td>
                          </tr>
                          <tr className="bg-stone-50 font-semibold">
                            <td colSpan={5} className="border border-stone-900 px-2 py-1 text-right">TRANSPORT</td>
                            <td className="border border-stone-900 px-2 py-1 text-right">{formatCurrency(transportCost, false)}</td>
                          </tr>
                           <tr className="bg-stone-50 font-bold text-stone-800">
                             <td colSpan={5} className="border border-stone-900 px-2 py-1 text-right">
                               {proformaApplyTax && proformaTaxScheme === "standard" ? "GETF/NHIL (6%)" : "Levies (0%)"}
                             </td>
                             <td className="border border-stone-900 px-2 py-1 text-right font-bold">
                               {proformaApplyTax && proformaLeviesAmount > 0 
                                 ? formatCurrency(proformaLeviesAmount, false) 
                                 : "-"}
                             </td>
                           </tr>
                           <tr className="bg-stone-50 font-bold text-stone-800">
                             <td colSpan={5} className="border border-stone-900 px-2 py-1 text-right">
                               {proformaApplyTax ? (
                                 proformaTaxScheme === "standard" || proformaTaxScheme === "vat_only" ? "VAT (15%)" :
                                 proformaTaxScheme === "flat_5" ? "VAT (5%)" : "VAT (0%)"
                               ) : "VAT (0%)"}
                             </td>
                             <td className="border border-stone-900 px-2 py-1 text-right font-bold">
                               {proformaApplyTax && proformaVatAmount > 0 
                                 ? formatCurrency(proformaVatAmount, false) 
                                 : "-"}
                             </td>
                           </tr>
                          {/* GRAND TOTAL ROW */}
                          <tr className="bg-white text-stone-950 font-black text-xs sm:text-sm">
                            <td colSpan={5} className="border border-stone-900 px-3 py-1.5 text-right uppercase tracking-wider">GRAND TOTAL ({currency})</td>
                            <td className="border border-stone-900 px-3 py-1.5 text-right tracking-tight">{formatCurrency(proformaGrandTotal, false)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Collapsible Terms and Conditions Section with Project Warranty & Material Handling Disclaimers */}
                  <div className="print:hidden">
                    <CollapsibleInvoiceTerms
                      isCollapsed={isTermsCollapsed}
                      onToggle={() => setIsTermsCollapsed(prev => !prev)}
                      docMode="proforma"
                      isProforma={true}
                    />
                  </div>

                  {/* Footer Sign-off Block */}
                  <div className="pt-2 border-t-2 border-stone-900 space-y-2 text-xs font-mono">
                    <p><span className="font-bold">Colour:</span> {proformaColour}</p>
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div>
                        <p><span className="font-bold">Prepared By:</span> {signerName || proformaPreparedBy}</p>
                        <div className="h-10 border-b border-stone-900 mt-1 relative flex items-end justify-start">
                          {digitalSignature ? (
                            <img src={digitalSignature} alt="Prepared Digital Signature" className="h-12 max-w-[170px] object-contain absolute -bottom-1 left-0" />
                          ) : (
                            <p className="text-[10px] text-stone-500">by: ....................................................</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <p><span className="font-bold">Approved By:</span> {proformaApprovedBy}</p>
                        <div className="h-10 border-b border-stone-900 mt-1 relative flex items-end justify-start">
                          <p className="text-[10px] text-stone-500">by: ....................................................</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* WATERMARKED PHYSICAL Stamp for PAID receipts */}
                  {docMode === "receipt" && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-25deg] select-none pointer-events-none opacity-[0.14] z-0">
                      <div className="border-[8px] border-emerald-600 rounded-3xl px-8 py-4 flex flex-col items-center">
                        <span className="font-sans font-black text-7xl text-emerald-600 tracking-widest leading-none">PAID</span>
                        <span className="font-mono text-[10px] text-emerald-600 font-extrabold tracking-widest uppercase mt-2">
                          ZOF GROUP OFFICIAL SEAL
                        </span>
                        <span className="font-mono text-xs text-emerald-600 font-bold mt-1">
                          {issueDate}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Large structural watermarked background logo */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none z-0">
                    <img src={zofLogo} className="h-96 w-96 object-contain rounded-full" alt="" referrerPolicy="no-referrer" />
                  </div>

                  {/* Real Content Section */}
                  <div className="relative z-10 flex flex-col justify-between flex-1 w-full">
                    
                    {/* Document Paper Header */}
                    <div className="text-center pb-5 border-b-2 border-dashed border-stone-200 mb-5 shrink-0">
                      <div className="h-10 w-10 mx-auto bg-stone-950 p-0.5 rounded-full overflow-hidden shrink-0 border border-stone-300 mb-2 shadow-sm">
                        <img src={zofLogo} className="h-full w-full object-cover rounded-full" alt="Zof logo" referrerPolicy="no-referrer" />
                      </div>
                      <h3 className="font-sans font-black text-sm uppercase tracking-widest text-stone-900">ZOF GROUP</h3>
                      <p className="font-sans text-[10px] text-stone-500 font-bold tracking-wider uppercase mt-0.5">Zof Roofing System</p>
                      
                      <div className="bg-[#B2FFFF] text-stone-900 border border-[#8FEBEB] font-mono font-black text-[9px] tracking-widest px-2 py-0.5 rounded uppercase my-1 inline-block shadow-sm">
                        <strong>UNDER TAKINGS FREE ESTIMATE</strong>
                      </div>
                      <p className="text-[10px] font-black text-stone-900 uppercase tracking-tight mt-0.5">
                        <strong>Woodwork | Consultancy | Project Supervision</strong>
                      </p>
                      <p className="text-[9px] font-bold text-stone-900 mt-0.5">
                        <strong>You can transact remotely and conveniently with us without any stress.</strong>
                      </p>

                      <p className="text-[9px] font-mono text-stone-400 uppercase tracking-widest mt-1">Accra • Kumasi • West Africa Sourcing</p>
                      
                      <div className="mt-3 inline-block">
                        {docMode === "proposal" ? (
                          <span className="font-sans font-extrabold text-xs text-blue-950 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200 uppercase tracking-wide inline-flex items-center space-x-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                            <span>{isAdmin ? "Official Scope Proposal Template (Admin Approved)" : "Official Scope Proposal Template"}</span>
                          </span>
                        ) : (
                          <span className="font-sans font-extrabold text-xs text-emerald-950 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 uppercase tracking-wide inline-flex items-center space-x-1.5">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Official Transaction Receipt</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata details panel */}
                    <div className="flex items-center justify-between bg-white/60 border border-stone-200/80 p-3.5 rounded-xl mb-5 text-[11px] font-sans shrink-0">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 flex-1">
                        <div>
                          <p className="text-stone-400 font-mono text-[9px] uppercase tracking-wider">Document ID</p>
                          <p className="font-mono font-bold text-stone-900">{documentId}</p>
                        </div>
                        <div>
                          <p className="text-stone-400 font-mono text-[9px] uppercase tracking-wider">Issue Date</p>
                          <p className="font-mono font-bold text-stone-900">{issueDate}</p>
                        </div>
                        <div>
                          <p className="text-stone-400 font-mono text-[9px] uppercase tracking-wider">Client Representative</p>
                          <p className="font-sans font-bold text-stone-900">{clientName}</p>
                        </div>
                        <div>
                          <p className="text-stone-400 font-mono text-[9px] uppercase tracking-wider">Project Location</p>
                          <p className="font-sans font-bold text-stone-900">{projectLocation}</p>
                        </div>
                        {docMode === "receipt" && (
                          <div className="col-span-2 border-t border-stone-100 pt-2 flex justify-between items-center">
                            <div>
                              <span className="text-stone-400 font-mono text-[9px] uppercase tracking-wider">Payment Method: </span>
                              <span className="font-mono font-bold text-stone-800">{paymentMethod}</span>
                            </div>
                            <span className="text-[9px] font-mono font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded leading-none">
                              APPROVED & SECURED
                            </span>
                          </div>
                        )}
                      </div>
                      {showQrCode && (
                        <div className="ml-3 pl-3 border-l border-stone-200/80 flex flex-col items-center justify-center shrink-0">
                          <QRCodeSVG
                            value={getQrVerificationText()}
                            size={64}
                            level="M"
                          />
                          <span className="text-[7px] font-mono font-bold uppercase tracking-tight text-stone-700 mt-1">VERIFY QR</span>
                        </div>
                      )}
                    </div>

                    {/* Itemized charges table */}
                    <div className="flex-1 min-h-[160px] mb-5">
                      <h5 className="font-sans font-bold text-[10px] uppercase tracking-wider text-stone-500 border-b border-stone-200 pb-1.5 mb-2">
                        Itemized Works Schedule ({currency})
                      </h5>
                      
                      {/* Ledger Table */}
                      <div className="space-y-4 text-xs">
                        {items.map((it, idx) => (
                          <div key={it.id} className="flex justify-between items-start pb-3 border-b border-stone-100 group">
                            <div className="pr-4 flex-1 text-left">
                              <p className="font-bold text-stone-850 text-stone-900 flex items-center space-x-1.5">
                                <span className="text-stone-500 font-mono text-[11px] shrink-0">{idx + 1}.</span>
                                <input
                                  type="text"
                                  value={it.name}
                                  onChange={(e) => handleUpdateItem(it.id, "name", e.target.value)}
                                  className="w-full bg-transparent hover:bg-stone-100 focus:bg-white focus:ring-1 focus:ring-stone-400 font-sans font-bold p-0.5 px-1.5 outline-none rounded transition-colors text-xs text-stone-900 border-0"
                                />
                              </p>
                              <div className="text-[10px] text-stone-500 leading-snug mt-1 pl-4">
                                <textarea
                                  rows={1}
                                  value={it.description}
                                  onChange={(e) => handleUpdateItem(it.id, "description", e.target.value)}
                                  className="w-full bg-transparent hover:bg-stone-100 focus:bg-white focus:ring-1 focus:ring-stone-400 font-sans font-normal p-0.5 px-1.5 outline-none rounded transition-colors text-[10px] text-stone-500 resize-none border-0"
                                />
                              </div>
                              <div className="flex items-center space-x-2 text-[10px] font-mono text-stone-400 mt-1 pl-4">
                                <span>Qty:</span>
                                <input
                                  type="number"
                                  value={it.quantity}
                                  onChange={(e) => handleUpdateItem(it.id, "quantity", parseInt(e.target.value) || 1)}
                                  className="w-14 bg-transparent hover:bg-stone-100 focus:bg-white focus:ring-1 focus:ring-stone-400 text-center p-0.5 outline-none rounded transition-colors text-stone-850 border-0"
                                />
                                <span>× Unit Price: {currency}</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={it.unitPrice}
                                  onChange={(e) => handleUpdateItem(it.id, "unitPrice", parseFloat(e.target.value) || 0)}
                                  className="w-20 bg-transparent hover:bg-stone-100 focus:bg-white focus:ring-1 focus:ring-stone-400 text-left p-0.5 px-1 outline-none rounded transition-colors text-stone-850 border-0"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col items-end justify-between self-stretch shrink-0 text-right pl-2">
                              <span className="font-mono font-black text-stone-900">
                                {formatCurrency(it.quantity * it.unitPrice)}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(it.id)}
                                className="mt-2 p-1 text-red-600 hover:bg-red-50 hover:text-red-700 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer print:hidden"
                                title="Remove item"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Add Item Action Button at bottom of ledger in preview paper */}
                        <div className="pt-2 flex justify-center print:hidden">
                          <button
                            type="button"
                            onClick={handleAddItem}
                            className="inline-flex items-center space-x-1.5 text-[10px] font-sans font-extrabold text-blue-600 hover:text-blue-700 py-1.5 px-4 bg-white border border-blue-200 hover:border-blue-400 rounded-lg shadow-sm transition-all cursor-pointer active:scale-95"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add New Item Row</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Summary Totals Calculation section */}
                    <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl mb-5 shrink-0">
                      <div className="space-y-1 text-xs text-left">
                        <div className="flex justify-between font-mono text-stone-600">
                          <span>Schedule Subtotal:</span>
                          <span>{formatCurrency(subtotal)}</span>
                        </div>
                        {vatPercent > 0 && (
                          <div className="flex justify-between font-mono text-stone-600">
                            <span>VAT ({vatPercent}%):</span>
                            <span>{formatCurrency(vatAmount)}</span>
                          </div>
                        )}
                        {discountAmount > 0 && (
                          <div className="flex justify-between font-mono text-stone-600">
                            <span>Corporate Discount:</span>
                            <span className="text-emerald-700">- {formatCurrency(discountAmount)}</span>
                          </div>
                        )}
                        <div className="border-t border-stone-200 pt-2 mt-2 flex justify-between items-baseline">
                          <span className="font-sans font-black text-xs uppercase tracking-wider text-stone-900">
                            {docMode === "proposal" ? `Proposed Contract Sum (${currency}):` : `Total Invoice Amount (${currency}):`}
                          </span>
                          <span className="font-sans font-black text-xl text-stone-900">
                            {formatCurrency(total)}
                          </span>
                        </div>

                        {docMode === "receipt" && (
                          <div className="border-t border-dashed border-emerald-500/20 pt-2 mt-2 space-y-1">
                            <div className="flex justify-between font-mono text-stone-600">
                              <span>Amount Paid (Deposit Clearance):</span>
                              <span className="text-emerald-700 font-bold">{formatCurrency(depositPaid)}</span>
                            </div>
                            <div className="flex justify-between font-mono text-stone-900 border-t border-stone-200/60 pt-1 mt-1 font-bold">
                              <span>Outstanding Balance Due:</span>
                              <span className="text-red-700">{formatCurrency(outstandingBalance)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Collapsible Terms and Conditions Section with Project Warranty & Material Handling Disclaimers */}
                    <div className="print:hidden">
                      <CollapsibleInvoiceTerms
                        isCollapsed={isTermsCollapsed}
                        onToggle={() => setIsTermsCollapsed(prev => !prev)}
                        docMode={docMode}
                        isProforma={false}
                      />
                    </div>

                    {/* Signature E-Lines block */}
                    <div className="pt-3 border-t border-stone-200 grid grid-cols-2 gap-4 text-left shrink-0">
                      <div>
                        <p className="text-[9px] text-stone-400 uppercase font-mono">Prepared & Verified By</p>
                        <div className="h-10 border-b border-stone-300 mt-1 relative flex items-end justify-between pb-0.5">
                          {digitalSignature ? (
                            <img src={digitalSignature} alt="Site Manager Digital Signature" className="h-12 max-w-[180px] object-contain absolute -bottom-1 left-0" />
                          ) : (
                            <span className="font-serif italic text-xs text-blue-900 font-bold opacity-80 px-1 select-none">
                              {isAdmin ? "ZOF Officer Digital Sign-off" : "ZOF Inspector Sign-off"}
                            </span>
                          )}
                          <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded ml-auto z-10">
                            {digitalSignature ? "DIGITALLY SIGNED" : "ADMIN VERIFIED"}
                          </span>
                        </div>
                        <p className="text-[9px] font-sans font-bold text-stone-800 mt-1">
                          {signerName || (isAdmin ? "Admin Officer (ZOF Roofing Systems)" : "Authorized ZOF Officer")}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-stone-400 uppercase font-mono">Accepted By Client</p>
                        <div className="h-10 border-b border-stone-300 mt-1 relative flex items-end">
                          <p className="text-[10px] text-stone-400 italic font-mono mb-1">Client Signature Line</p>
                        </div>
                        <p className="text-[9px] font-sans font-bold text-stone-800 mt-1">{clientName} / Representative</p>
                      </div>
                    </div>

                  </div>
                </>
              )}
            </div>

            {/* Direct print and PDF export action floating buttons */}
            <div className="mt-4 space-y-4">
              {/* Touch-Friendly Sign-off panel directly in print view */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-3 shadow-md print:hidden text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="p-1 bg-amber-500/20 text-amber-400 rounded-lg">
                      <UserCheck className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white font-sans uppercase tracking-wider">
                        Official MD / Staff Sign-off
                      </h4>
                      <p className="text-[10px] text-stone-400">
                        Sign directly below to stamp signature onto the paper
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowQuickSign(prev => !prev)}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    {showQuickSign ? "✕ Close Canvas" : "✍️ Sign Document Now"}
                  </button>
                </div>

                {showQuickSign && (
                  <div className="p-1 bg-stone-950 rounded-xl">
                    <DigitalSignaturePad
                      signerName={signerName}
                      signerTitle="Managing Director / Authorized Officer"
                      onSignerNameChange={setSignerName}
                      onSignatureChange={setDigitalSignature}
                      initialSignature={digitalSignature}
                    />
                  </div>
                )}

                {digitalSignature && !showQuickSign && (
                  <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl text-xs font-mono text-emerald-400">
                    <div className="flex items-center space-x-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Ready! Signed off by: <strong className="text-white">{signerName}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setDigitalSignature(null); }}
                      className="text-[10px] text-red-400 hover:text-red-300 underline cursor-pointer"
                    >
                      Clear Signature
                    </button>
                  </div>
                )}
              </div>

              {/* Real-time PDF Export Auto-Preview Module */}
              <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl space-y-3.5 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="p-1 bg-blue-500/20 text-blue-400 rounded-lg">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white font-sans uppercase tracking-wider">
                        Real-time Export Hub
                      </h4>
                      <p className="text-[10px] text-stone-400">
                        Inspect high-fidelity digital layout parameters
                      </p>
                    </div>
                  </div>
                  <label className="inline-flex items-center space-x-1.5 cursor-pointer text-xs font-mono text-amber-400">
                    <input
                      type="checkbox"
                      checked={autoPreviewEnabled}
                      onChange={(e) => setAutoPreviewEnabled(e.target.checked)}
                      className="rounded border-stone-800 bg-stone-950 text-amber-500 focus:ring-amber-500 h-3.5 w-3.5"
                    />
                    <span>Auto-Preview</span>
                  </label>
                </div>

                {autoPreviewEnabled && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-stone-950 border border-stone-850 p-4 rounded-xl space-y-3 shadow-2xl relative overflow-hidden"
                  >
                    {/* Branded Watermark Stamp */}
                    <div className="absolute right-3 top-3 rotate-12 border-2 border-emerald-500/20 text-[8px] font-black font-mono text-emerald-500/30 px-2 py-0.5 rounded tracking-widest select-none uppercase">
                      ZOF Verified
                    </div>

                    {/* Header replica */}
                    <div className="flex justify-between items-start border-b border-stone-850 pb-2">
                      <div className="space-y-0.5">
                        <h5 className="text-[10px] font-black text-amber-400 uppercase tracking-wider font-sans flex items-center space-x-1">
                          <span>⚡ ZOF ROOFING SYSTEMS</span>
                        </h5>
                        <p className="text-[8px] font-mono text-stone-400">Accra, Ghana • zofroofing.com</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-mono font-black text-white block uppercase">
                          {docMode === "proforma" ? "Proforma Invoice" : docMode === "receipt" ? "Official Receipt" : "Scope Proposal"}
                        </span>
                        <span className="text-[7px] font-mono text-stone-500 block">{documentId || "GEN-2026-904"}</span>
                      </div>
                    </div>

                    {/* Client parameters */}
                    <div className="grid grid-cols-2 gap-2 text-[8px] font-mono text-stone-300">
                      <div>
                        <p className="text-stone-500 uppercase text-[7px] font-bold">Invoiced Client</p>
                        <p className="text-white font-bold truncate">{clientName || "Walk-In Client"}</p>
                        <p className="text-stone-400">{clientPhone}</p>
                      </div>
                      <div>
                        <p className="text-stone-500 uppercase text-[7px] font-bold">Site Project Location</p>
                        <p className="text-stone-400 truncate">{projectLocation || "Accra Site"}</p>
                        <p className="text-stone-500 text-[7px] font-bold mt-1">Branch Assigned</p>
                        <p className="text-stone-400">{selectedBranch}</p>
                      </div>
                    </div>

                    {/* Item Rows Ledger */}
                    <div className="border-t border-stone-850 pt-2 space-y-1">
                      <div className="flex justify-between text-[7px] font-mono text-stone-500 font-bold uppercase pb-0.5 border-b border-stone-900">
                        <span>Profile Description</span>
                        <span>Quantity</span>
                        <span className="text-right">Total Amount</span>
                      </div>
                      {items.slice(0, 3).map((item, idx) => (
                        <div key={item.id || idx} className="flex justify-between text-[8px] font-mono text-stone-300">
                          <span className="truncate max-w-[150px]">{item.name}</span>
                          <span>{item.quantity}</span>
                          <span className="text-right font-bold text-white">{formatCurrency(item.quantity * item.unitPrice)}</span>
                        </div>
                      ))}
                      {items.length > 3 && (
                        <p className="text-[7px] font-mono text-stone-500 text-center italic">
                          + {items.length - 3} additional spec items listed in master schedule...
                        </p>
                      )}
                    </div>

                    {/* Totals Summary */}
                    <div className="border-t border-stone-850 pt-2 flex justify-between items-center text-[9px] font-sans">
                      <span className="text-[7px] font-mono text-stone-400 uppercase font-black">
                        Grand Total ({currency}):
                      </span>
                      <span className="text-amber-400 font-black text-xs">
                        {formatCurrency(docMode === "proforma" ? proformaGrandTotal : total)}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* COMBINED VIEW: Render Page 2 directly below Page 1 with a neat separator */}
              {previewSheetTab === "combined" && (
                <div className="mt-6 space-y-3">
                  <div className="border-t-2 border-dashed border-stone-300 pt-3 pb-1 flex items-center justify-between text-xs text-stone-600 font-mono print:hidden">
                    <div className="flex items-center space-x-2">
                      <FileSignature className="h-4 w-4 text-red-600" />
                      <span className="font-bold text-stone-900">PAGE 2 OF 2: OFFICIAL ATTACHED TERMS & CONDITIONS AGREEMENT</span>
                    </div>
                    <span className="text-[10px] bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 rounded font-bold">
                      Standard 8 Clauses Attached
                    </span>
                  </div>

                  <TermsAndConditionsAgreement
                    data={{
                      validityDays: agreementCustomData.validityDays || 10,
                      depositPercent: agreementCustomData.depositPercent || 80,
                      finalPercent: agreementCustomData.finalPercent || 20,
                      gtBankAccount: agreementCustomData.gtBankAccount || "3221-00101-5330",
                      gtAccountName: agreementCustomData.gtAccountName || "Zof Roofing System",
                      momoNumber: agreementCustomData.momoNumber || "0597391978",
                      refundPenaltyPercent: agreementCustomData.refundPenaltyPercent || 10,
                      collectionTolerancePercent: agreementCustomData.collectionTolerancePercent || 17,
                      uncollectedPenaltyPercent: agreementCustomData.uncollectedPenaltyPercent || 20,
                      uncollectedWeeks: agreementCustomData.uncollectedWeeks || 2,
                      preparedByName: agreementCustomData.preparedByName || "Mr Francis O. Dugbazah",
                      preparedByTitle: agreementCustomData.preparedByTitle || "MD",
                      preparedByTel: agreementCustomData.preparedByTel || "0577796161",
                      clientName: clientName,
                      clientPhone: clientPhone,
                      invoiceRef: docMode === "proforma" ? proformaRef : documentId,
                      digitalSignature: digitalSignature,
                      email: agreementCustomData.email || "hrzof1@gmail.com",
                      digitalAddress: agreementCustomData.digitalAddress || "GC -088-4481",
                      contactPhones: agreementCustomData.contactPhones || "0577796161 - 0242866658"
                    }}
                    id="terms-conditions-sheet"
                  />
                </div>
              )}

              {/* Hidden Agreement instance for Page 1 view so multi-page printing can clone it */}
              {previewSheetTab === "page1" && (
                <div className="hidden" aria-hidden="true">
                  <TermsAndConditionsAgreement
                    data={{
                      validityDays: agreementCustomData.validityDays || 10,
                      depositPercent: agreementCustomData.depositPercent || 80,
                      finalPercent: agreementCustomData.finalPercent || 20,
                      gtBankAccount: agreementCustomData.gtBankAccount || "3221-00101-5330",
                      gtAccountName: agreementCustomData.gtAccountName || "Zof Roofing System",
                      momoNumber: agreementCustomData.momoNumber || "0597391978",
                      refundPenaltyPercent: agreementCustomData.refundPenaltyPercent || 10,
                      collectionTolerancePercent: agreementCustomData.collectionTolerancePercent || 17,
                      uncollectedPenaltyPercent: agreementCustomData.uncollectedPenaltyPercent || 20,
                      uncollectedWeeks: agreementCustomData.uncollectedWeeks || 2,
                      preparedByName: agreementCustomData.preparedByName || "Mr Francis O. Dugbazah",
                      preparedByTitle: agreementCustomData.preparedByTitle || "MD",
                      preparedByTel: agreementCustomData.preparedByTel || "0577796161",
                      clientName: clientName,
                      clientPhone: clientPhone,
                      invoiceRef: docMode === "proforma" ? proformaRef : documentId,
                      digitalSignature: digitalSignature,
                      email: agreementCustomData.email || "hrzof1@gmail.com",
                      digitalAddress: agreementCustomData.digitalAddress || "GC -088-4481",
                      contactPhones: agreementCustomData.contactPhones || "0577796161 - 0242866658"
                    }}
                    id="hidden-terms-conditions-sheet"
                  />
                </div>
              )}
            </div>

            {/* Badges and interactive controls moved outside the A4 paper print area */}
            <div className="mt-4 space-y-4 print:hidden">
              {/* Official ZOF Enterprise Security & Payment Verification Badge */}
              <div className="bg-gradient-to-r from-stone-900 via-stone-925 to-stone-950 border border-stone-800/90 p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black shrink-0 shadow-xs">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                  <div className="text-left">
                    <p className="font-sans font-bold text-xs text-white flex items-center space-x-1.5">
                      <span>Official ZOF Roofing Quality & GSA Standards</span>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">
                        GS 1059:2019
                      </span>
                    </p>
                    <p className="text-[10px] text-stone-400">AZ150 Aluzinc • Corro-Shield 30-Year Warranty • Official Ghana MoMo / Bank Settlement</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-[10px] font-mono text-stone-400 bg-stone-900 border border-stone-800 px-2.5 py-1 rounded-lg">
                    Direct Line: <strong className="text-amber-400">0242 866 658</strong>
                  </span>
                </div>
              </div>

              {/* PRINT & EXPORT PERMISSION STATUS BADGE */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-all duration-300 ${
                isPrintUnlocked 
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                  : "bg-stone-950 border-stone-850 text-stone-400"
              }`}>
                <div className="flex items-center space-x-2.5 text-left">
                  <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${isPrintUnlocked ? 'bg-emerald-500 animate-pulse' : 'bg-stone-700'}`} />
                  <div>
                    <p className="font-sans font-extrabold text-[10px] uppercase tracking-wider text-white">
                      {isPrintUnlocked ? "🔓 PRINT STATUS: FULLY UNLOCKED" : "🔒 PRINT STATUS: RESTRICTED"}
                    </p>
                    <p className="text-[9px] text-stone-400 mt-0.5">{unlockedReason}</p>
                  </div>
                </div>
                {isPrintUnlocked && (
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-lg font-bold font-sans uppercase tracking-tight shrink-0">
                    Authorized
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 animate-fade-in"
                >
                  <Download className="h-4 w-4" />
                  <span>
                    {previewSheetTab === "page2"
                      ? "Export Agreement as PDF"
                      : includeAgreement
                      ? "Export 2-Page PDF (Invoice + Agreement)"
                      : docMode === "proforma"
                      ? "Export Invoice as PDF"
                      : docMode === "receipt"
                      ? "Export Receipt as PDF"
                      : "Export Proposal as PDF"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>
                    {previewSheetTab === "page2"
                      ? "Print Terms & Agreement (Page 2)"
                      : includeAgreement
                      ? "Print 2-Page Invoice & Agreement"
                      : docMode === "proforma"
                      ? "Print Proforma Invoice"
                      : docMode === "receipt"
                      ? "Print Paid Receipt"
                      : "Print Scope Proposal"}
                  </span>
                </button>
              </div>
            </div>

            <p className="text-center text-[10px] text-stone-400 mt-3 select-none">
              {docMode === "receipt" ? "ZOF GROUP" : "ZOF GROUP"} • 45 Industrial Close, Accra, Ghana • Tel: 0242 866 658
            </p>

          </div>

        </div>

      </div>

      {/* ADMIN AUTHENTICATION MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 text-left text-stone-200 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2 text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
                <span>Admin Sign-In Authentication</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="text-stone-400 hover:text-white text-xs font-mono px-2 py-1 bg-stone-800 rounded hover:bg-stone-700 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Log in with ZOF Roofing System admin credentials to authorize and edit the <span className="text-amber-300 font-bold">Official Scope Proposal Template</span>.
            </p>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-stone-400 uppercase font-bold tracking-wider mb-1">
                  Admin Email Address
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-stone-500" />
                  <input
                    type="email"
                    required
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="admin@zofroofing.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-500 text-white rounded-xl text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-stone-400 uppercase font-bold tracking-wider mb-1">
                  Admin Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-stone-500" />
                  <input
                    type={showModalPassword ? "text" : "password"}
                    required
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-500 text-white rounded-xl text-xs font-mono focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowModalPassword(!showModalPassword)}
                    className="absolute right-3 top-2.5 p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
                    title={showModalPassword ? "Hide password" : "Show password"}
                  >
                    {showModalPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Unlock className="h-4 w-4" />
                  <span>Authenticate Admin Access</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* SUCCESS TOAST NOTIFICATION */}
      <AnimatePresence>
        {printToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-101 max-w-md bg-stone-900 border border-stone-800 p-4 rounded-xl shadow-2xl flex items-center space-x-3"
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${printToast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              {printToast.type === 'success' ? '✓' : '✕'}
            </div>
            <div className="text-left">
              <p className="font-sans font-bold text-xs text-white">System Notification</p>
              <p className="text-[11px] text-stone-300 font-medium mt-0.5">{printToast.message}</p>
            </div>
            <button 
              onClick={() => setPrintToast(null)} 
              className="text-stone-400 hover:text-white text-xs pl-2 font-mono"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREPARING PRINT LOADING ANIMATION OVERLAY */}
      <AnimatePresence>
        {isPreparingPrint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-101 bg-stone-950/85 backdrop-blur-md flex flex-col items-center justify-center space-y-4"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
              <div className="absolute font-sans font-black text-amber-500 text-[10px] tracking-widest uppercase">
                ZOF
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="font-sans font-black text-xs text-white uppercase tracking-widest">Preparing Document Layout</p>
              <p className="text-[11px] text-stone-400 font-mono">Formulating vector styles, print matrices & metadata...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
