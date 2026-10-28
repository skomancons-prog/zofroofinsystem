/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import zofLogo from "../assets/images/zof_bright_logo_2026.svg";
import { 
  ShieldCheck, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  FileText, 
  CheckCircle2, 
  Calendar,
  Layers,
  Maximize2,
  Hammer,
  Truck,
  Trees
} from "lucide-react";

export interface PrintableProposalProps {
  id?: string;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  clientCity?: string;
  length: number;
  width: number;
  unit: "meters" | "feet";
  roofShape: "gable" | "hip" | "flat" | "shed";
  materialProfile: "selflock" | "ibr" | "step_tiles" | "aluminium_plain";
  trussType: "mahogany" | "steel" | "none";
  currency: "GHS" | "USD";
  exchangeRate?: number;
  proposalNumber?: string;
  date?: string;
  materialCost: number;
  trussCost: number;
  installationCost: number;
  transportBase: number;
  grandTotal: number;
  sqMeters: number;
  surfaceAreaDisplay: number;
  includeAgreement?: boolean;
}

export function PrintableProposalDocument({
  id = "printable-proposal-area",
  clientName = "Prospective Property Developer",
  clientPhone = "+233 (0) 24 286 6658",
  clientEmail = "client@property.gh",
  clientCity = "Accra",
  length,
  width,
  unit,
  roofShape,
  materialProfile,
  trussType,
  currency,
  exchangeRate = 14.50,
  proposalNumber = `ZOF-PROP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
  date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
  materialCost,
  trussCost,
  installationCost,
  transportBase,
  grandTotal,
  sqMeters,
  surfaceAreaDisplay,
  includeAgreement = true
}: PrintableProposalProps) {
  
  const roofProfileNames = {
    selflock: "ZOF 0.50mm Selflock® Interlocking Aluzinc (Concealed Clips)",
    ibr: "ZOF 0.50mm Premium IBR Angular Corrugated Panels",
    step_tiles: "ZOF 0.50mm Mediterranean Step Tile Architectural Sheets",
    aluminium_plain: "ZOF 0.70mm Marine-Grade Plain Aluminium Coastal Alloy"
  };

  const roofShapeNames = {
    gable: "Gable Dual-Pitch Design (1.15x Slope Factor)",
    hip: "Hip Roof Multi-Slope Profile (1.30x Slope Factor)",
    flat: "Low-Slope Contemporary Flat Roof (1.05x Slope Factor)",
    shed: "Mono-Pitch Architectural Shed Design (1.10x Slope Factor)"
  };

  const trussNames = {
    mahogany: "High-Strength Pressure-Treated Hardwood Mahogany Timber",
    steel: "Structural Light-Gauge Galvanized Steel Trusses (Rust-Proof)",
    none: "Existing Structural Framework (Labor & Fasteners Only)"
  };

  const formatGHS = (val: number) => `GH₵ ${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatUSD = (val: number) => `$ ${(val / exchangeRate).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const usdTotal = grandTotal / exchangeRate;

  return (
    <div id={id} className="bg-white text-stone-900 p-6 sm:p-8 font-sans max-w-4xl mx-auto border-2 border-stone-900 rounded-xl shadow-md text-left">
      
      {/* 1. Official Header & Corporate Identity */}
      <div className="flex flex-col sm:flex-row items-start justify-between border-b-2 border-stone-900 pb-4 mb-5 gap-4">
        <div className="flex items-center space-x-3.5">
          <img 
            src={zofLogo} 
            alt="ZOF Group" 
            className="h-14 w-auto object-contain shrink-0" 
          />
          <div>
            <h1 className="font-sans font-black text-xl text-stone-950 uppercase tracking-tight leading-none">
              ZOF ROOFING SYSTEMS LTD
            </h1>
            <p className="text-[10px] text-stone-600 font-mono font-bold tracking-wider uppercase mt-1">
              Architectural Structural Engineering & Premium Aluzinc Systems
            </p>
            <p className="text-[9px] text-stone-500 font-mono mt-0.5">
              Spintex Road Commercial Corridor, Accra, Ghana • Digital Address: GC-088-4481
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right font-mono text-xs space-y-0.5 shrink-0 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
          <div className="flex sm:justify-end items-center space-x-1.5">
            <span className="text-[10px] text-stone-500 font-bold uppercase">Proposal Ref:</span>
            <span className="font-bold text-amber-700">{proposalNumber}</span>
          </div>
          <div className="flex sm:justify-end items-center space-x-1.5">
            <span className="text-[10px] text-stone-500 font-bold uppercase">Issue Date:</span>
            <span className="font-bold text-stone-900">{date}</span>
          </div>
          <div className="flex sm:justify-end items-center space-x-1.5">
            <span className="text-[10px] text-stone-500 font-bold uppercase">Validity:</span>
            <span className="font-bold text-emerald-700">14 Calendar Days</span>
          </div>
          <div className="flex sm:justify-end items-center space-x-1.5">
            <span className="text-[10px] text-stone-500 font-bold uppercase">TIN / REG:</span>
            <span className="text-stone-700">C0004928190</span>
          </div>
        </div>
      </div>

      {/* 2. Document Title Banner */}
      <div className="bg-stone-950 text-white px-4 py-2 rounded-lg mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-amber-400" />
          <span className="font-sans font-black text-xs sm:text-sm uppercase tracking-wider">
            OFFICIAL PROJECT COST ESTIMATE & PROPOSAL
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest bg-stone-900 px-2 py-0.5 rounded">
          AZ150 Aluzinc High-Grade Specification
        </span>
      </div>

      {/* 3. Client & Project Location Metadata Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 bg-stone-50 p-4 rounded-xl border border-stone-200">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block mb-1">
            CLIENT & CONTACT DETAILS
          </span>
          <p className="font-sans font-bold text-sm text-stone-950">{clientName || "Valued Property Developer"}</p>
          <div className="font-mono text-xs text-stone-600 space-y-0.5 mt-1">
            <p className="flex items-center space-x-1.5">
              <Phone className="h-3 w-3 text-stone-400" />
              <span>{clientPhone || "+233 (0) 24 286 6658"}</span>
            </p>
            <p className="flex items-center space-x-1.5">
              <Mail className="h-3 w-3 text-stone-400" />
              <span>{clientEmail || "info@zofgroup.com"}</span>
            </p>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block mb-1">
            PROJECT LOCATION & STRUCTURAL SCOPE
          </span>
          <p className="font-sans font-bold text-sm text-stone-950 flex items-center space-x-1.5">
            <MapPin className="h-3.5 w-3.5 text-red-600 shrink-0" />
            <span>{clientCity}, Greater Accra Region, Ghana</span>
          </p>
          <div className="font-mono text-xs text-stone-600 space-y-0.5 mt-1">
            <p><strong>Footprint:</strong> {length}m × {width}m ({((length * width)).toFixed(1)} m² base)</p>
            <p><strong>Profile:</strong> {roofShapeNames[roofShape]}</p>
          </div>
        </div>
      </div>

      {/* 4. Structural Engineering & Dimensional Parameters */}
      <div className="mb-5">
        <h4 className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold mb-2">
          1.0 STRUCTURAL DIMENSIONAL AUDIT & MATERIAL MATRIX
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
          <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
            <span className="text-[9px] text-stone-500 block uppercase">Net Base Area</span>
            <span className="font-bold text-stone-900 block mt-0.5">{(length * width).toFixed(1)} m²</span>
            <span className="text-[9px] text-stone-400">({((length * width) * 10.764).toFixed(0)} sq ft)</span>
          </div>

          <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
            <span className="text-[9px] text-stone-500 block uppercase">Calculated Slope Area</span>
            <span className="font-bold text-amber-700 block mt-0.5">{sqMeters.toFixed(1)} m²</span>
            <span className="text-[9px] text-stone-400">({(sqMeters * 10.764).toFixed(0)} sq ft slope)</span>
          </div>

          <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
            <span className="text-[9px] text-stone-500 block uppercase">Roof Panel Count</span>
            <span className="font-bold text-stone-900 block mt-0.5">{Math.ceil(sqMeters * 1.08)} Panels</span>
            <span className="text-[9px] text-stone-400">(Incl. 8% overlap/eaves)</span>
          </div>

          <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
            <span className="text-[9px] text-stone-500 block uppercase">Aluzinc Coating</span>
            <span className="font-bold text-emerald-700 block mt-0.5">AZ150 Standard</span>
            <span className="text-[9px] text-stone-400">55% Al-Zn Anti-Rust</span>
          </div>
        </div>
      </div>

      {/* 5. Itemized Bill of Quantities / Cost Schedule */}
      <div className="mb-5">
        <h4 className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold mb-2">
          2.0 ITEMIZED BILL OF QUANTITIES & CONTRACT VALUE
        </h4>
        <div className="border border-stone-900 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-stone-950 text-white uppercase text-[9.5px]">
              <tr>
                <th className="py-2 px-3">Item Description & Structural Scope</th>
                <th className="py-2 px-2 text-center">Unit / Area</th>
                <th className="py-2 px-3 text-right">Amount (GH₵)</th>
                <th className="py-2 px-3 text-right">Amount (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              
              {/* Item 1: Roof Sheeting */}
              <tr className="bg-white">
                <td className="py-2.5 px-3">
                  <div className="font-bold text-stone-900">0.50mm Premium Roof Sheeting Panels</div>
                  <div className="text-[10px] text-stone-600 font-sans">{roofProfileNames[materialProfile]}</div>
                </td>
                <td className="py-2.5 px-2 text-center font-bold text-stone-700">
                  {sqMeters.toFixed(1)} m²
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-stone-900">
                  {formatGHS(materialCost)}
                </td>
                <td className="py-2.5 px-3 text-right text-stone-600">
                  {formatUSD(materialCost)}
                </td>
              </tr>

              {/* Item 2: Truss Framework */}
              <tr className="bg-stone-50/70">
                <td className="py-2.5 px-3">
                  <div className="font-bold text-stone-900">Truss Framework Construction Matrix</div>
                  <div className="text-[10px] text-stone-600 font-sans">{trussNames[trussType]}</div>
                </td>
                <td className="py-2.5 px-2 text-center font-bold text-stone-700">
                  {trussType === "none" ? "N/A" : `${sqMeters.toFixed(1)} m²`}
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-stone-900">
                  {trussType === "none" ? "Excluded" : formatGHS(trussCost)}
                </td>
                <td className="py-2.5 px-3 text-right text-stone-600">
                  {trussType === "none" ? "—" : formatUSD(trussCost)}
                </td>
              </tr>

              {/* Item 3: Certified Labor & Carpentry */}
              <tr className="bg-white">
                <td className="py-2.5 px-3">
                  <div className="font-bold text-stone-900">Architectural Carpentry & Expert Installation</div>
                  <div className="text-[10px] text-stone-600 font-sans">
                    Master roofing technicians, valley flashings, fascia alignment, and waterproof torque fastening
                  </div>
                </td>
                <td className="py-2.5 px-2 text-center font-bold text-stone-700">
                  {sqMeters.toFixed(1)} m²
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-stone-900">
                  {formatGHS(installationCost)}
                </td>
                <td className="py-2.5 px-3 text-right text-stone-600">
                  {formatUSD(installationCost)}
                </td>
              </tr>

              {/* Item 4: Logistics & Transport */}
              <tr className="bg-stone-50/70">
                <td className="py-2.5 px-3">
                  <div className="font-bold text-stone-900">Site Haulage, Crane Offloading & Safety Insurance</div>
                  <div className="text-[10px] text-stone-600 font-sans">
                    Direct transport to site in {clientCity} with protective bubble interleaving and transit insurance
                  </div>
                </td>
                <td className="py-2.5 px-2 text-center font-bold text-stone-700">
                  1 Site Trip
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-stone-900">
                  {formatGHS(transportBase)}
                </td>
                <td className="py-2.5 px-3 text-right text-stone-600">
                  {formatUSD(transportBase)}
                </td>
              </tr>

            </tbody>
            <tfoot className="bg-stone-900 text-white font-bold">
              <tr>
                <td colSpan={2} className="py-3 px-3 uppercase tracking-wider text-[11px]">
                  TOTAL CONTRACT VALUE (NET ESTIMATE)
                </td>
                <td className="py-3 px-3 text-right text-amber-400 text-sm">
                  {formatGHS(grandTotal)}
                </td>
                <td className="py-3 px-3 text-right text-amber-300 text-xs">
                  {formatUSD(grandTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="text-[9px] text-stone-500 font-mono mt-1 italic">
          *Note: Currency conversion calculated at indicative peg of 1.00 USD = {exchangeRate.toFixed(2)} GHS. Price includes standard waste factor.
        </p>
      </div>

      {/* 6. Technical Certifications & Comprehensive Warranties */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 text-[10px] font-mono">
        <div className="border border-stone-200 rounded-lg p-2.5 bg-stone-50 flex items-start space-x-2">
          <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-stone-950 block">15-Year Material Warranty</span>
            <span className="text-stone-600">Guaranteed against perforation, corrosion, and tropical sun fading.</span>
          </div>
        </div>

        <div className="border border-stone-200 rounded-lg p-2.5 bg-stone-50 flex items-start space-x-2">
          <Award className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-stone-950 block">5-Year Workmanship Guarantee</span>
            <span className="text-stone-600">Free structural adjustments on all carpentry joins and roof leak points.</span>
          </div>
        </div>

        <div className="border border-stone-200 rounded-lg p-2.5 bg-stone-50 flex items-start space-x-2">
          <CheckCircle2 className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-stone-950 block">Rainy Season Defense Ready</span>
            <span className="text-stone-600">Complimentary 6-month post-installation storm audit and gutter check.</span>
          </div>
        </div>
      </div>

      {/* 7. Payment Terms & Bank Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs font-mono">
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-700 block mb-1">
            STANDARD MILESTONE PAYMENT SCHEDULE
          </span>
          <ul className="space-y-1 text-stone-700 text-[10px]">
            <li className="flex items-center space-x-1.5">
              <span className="font-bold text-stone-900">• 70% Initial Material Deposit:</span>
              <span>Mobilization & coil fabrication</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <span className="font-bold text-stone-900">• 20% Framework Stage:</span>
              <span>Upon truss erection & sheet delivery</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <span className="font-bold text-stone-900">• 10% Handover:</span>
              <span>Upon final water tightness test & sign-off</span>
            </li>
          </ul>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-stone-700 block mb-1">
            CORPORATE BANKING ACCOUNTS (GHANA)
          </span>
          <div className="text-[10px] space-y-0.5 text-stone-700">
            <p><strong>Bank:</strong> Guaranty Trust Bank (GTBank) Ghana</p>
            <p><strong>Account Name:</strong> ZOF ROOFING SYSTEMS LTD</p>
            <p><strong>Account Number:</strong> 3221-00101-5330 (Cedi Main)</p>
            <p><strong>Official MoMo Merchant:</strong> 0597391978 (Zof Roofing)</p>
          </div>
        </div>
      </div>

      {/* 8. Official Verification Signatures & Stamp */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t-2 border-stone-900 pt-4 gap-4">
        <div className="text-left">
          <div className="h-9 w-32 border-b border-stone-400 mb-1 flex items-end">
            <span className="font-serif italic text-xs text-stone-800 font-bold">F. O. Dugbazah</span>
          </div>
          <p className="font-sans font-bold text-xs text-stone-950">Mr. Francis O. Dugbazah</p>
          <p className="text-[9px] font-mono text-stone-500">Managing Director • ZOF Group</p>
        </div>

        {/* Official Corporate Stamp Seal */}
        <div className="border-2 border-dashed border-red-700 text-red-700 rounded-lg p-2 text-center uppercase font-mono font-bold text-[9px] tracking-wider shrink-0 rotate-[-3deg]">
          <p className="text-[10px]">★ ZOF ROOFING SYSTEMS ★</p>
          <p className="text-[8px] text-stone-700 font-normal">APPROVED COMMERCIAL PROPOSAL</p>
          <p className="text-[8px] font-semibold">{date}</p>
        </div>

        <div className="text-left sm:text-right">
          <div className="h-9 w-32 sm:ml-auto border-b border-stone-400 mb-1 flex items-end justify-start sm:justify-end">
            <span className="font-serif italic text-xs text-stone-800 font-bold">Samson K.</span>
          </div>
          <p className="font-sans font-bold text-xs text-stone-950">Samson Kwakye</p>
          <p className="text-[9px] font-mono text-stone-500">Chief Estimator & Project Lead</p>
        </div>
      </div>

      {/* 9. Footer Security Statement */}
      <div className="mt-4 pt-2 border-t border-stone-200 text-center text-[8.5px] font-mono text-stone-500">
        This document is an official quotation produced by ZOF Roofing Systems Ltd. For verification or custom adjustments, contact Accra HQ: +233 (0) 24 286 6658 / 0577796161 • Email: zofroofingsyst@gmail.com • www.zofgroup.com
      </div>

    </div>
  );
}
