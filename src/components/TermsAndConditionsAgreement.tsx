import React from "react";

export interface AgreementData {
  validityDays?: number;
  depositPercent?: number;
  finalPercent?: number;
  gtBankAccount?: string;
  gtAccountName?: string;
  momoNumber?: string;
  refundPenaltyPercent?: number;
  collectionTolerancePercent?: number;
  uncollectedPenaltyPercent?: number;
  uncollectedWeeks?: number;
  preparedByName?: string;
  preparedByTitle?: string;
  preparedByTel?: string;
  clientName?: string;
  clientPhone?: string;
  invoiceRef?: string;
  digitalSignature?: string | null;
  email?: string;
  digitalAddress?: string;
  contactPhones?: string;
}

interface TermsAndConditionsAgreementProps {
  id?: string;
  data?: AgreementData;
  isPrintVersion?: boolean;
  className?: string;
}

export function TermsAndConditionsAgreement({
  id = "terms-conditions-sheet",
  data = {},
  isPrintVersion = false,
  className = ""
}: TermsAndConditionsAgreementProps) {
  const {
    validityDays = 10,
    depositPercent = 80,
    finalPercent = 20,
    gtBankAccount = "3221-00101-5330",
    gtAccountName = "Zof Roofing System",
    momoNumber = "0597391978",
    refundPenaltyPercent = 10,
    collectionTolerancePercent = 17,
    uncollectedPenaltyPercent = 20,
    uncollectedWeeks = 2,
    preparedByName = "Mr Francis O. Dugbazah",
    preparedByTitle = "MD",
    preparedByTel = "0577796161",
    clientName = "",
    clientPhone = "",
    invoiceRef = "",
    digitalSignature = null,
    email = "hrzof1@gmail.com",
    digitalAddress = "GC -088-4481",
    contactPhones = "0577796161 - 0242866658"
  } = data;

  return (
    <div
      id={id}
      className={`bg-white text-stone-950 flex flex-col justify-between relative overflow-hidden font-sans border-2 border-stone-900 rounded-2xl shadow-xl p-5 sm:p-7 text-left ${className}`}
      style={{ minHeight: isPrintVersion ? "auto" : "780px" }}
    >
      {/* Background Ghost Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.04] z-0 overflow-hidden">
        <div className="text-center font-sans font-black text-6xl sm:text-7xl uppercase tracking-widest leading-none rotate-[-25deg] text-stone-900">
          ZOF ROOFING
          <br />
          SYSTEM LTD
        </div>
      </div>

      <div className="relative z-10 space-y-3.5">
        {/* Red Heading */}
        <div className="text-center pt-1 shrink-0">
          <h3 className="font-sans font-black text-sm tracking-widest text-red-700 uppercase border-b-2 border-red-700/80 inline-block pb-0.5">
            ZOF ROOFING SYSTEM STANDARD TERMS & CONDITIONS
          </h3>
        </div>

        {/* Preamble Statement in Bold Caps */}
        <div className="bg-red-50/70 border-l-4 border-red-700 p-2.5 rounded-r-lg shrink-0">
          <p className="text-[9.5px] sm:text-[10px] font-bold text-stone-900 uppercase leading-snug tracking-tight">
            THIS QUOTATION IS NOT A CONTRACT. ANY ORDERS PLACED AS A RESULT OF THIS QUOTATION TERMS ARE SUBJECT TO OUR FURTHER ACCEPTANCE OF OUR STANDARD TERMS AND CONDITIONS OF SALE.
          </p>
        </div>

        {/* Numbered Terms and Conditions Clauses arranged in a beautiful, highly spaced 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-[9.5px] sm:text-[10px] font-mono text-stone-950 leading-relaxed">
          {/* Column 1: Clauses 1 - 4 */}
          <div className="border border-stone-300 rounded-xl p-3 bg-stone-50/50 space-y-3.5 flex flex-col justify-between h-full">
            {/* Clause 1: Validity */}
            <div className="space-y-0.5">
              <p className="font-bold text-stone-950">
                <span className="text-red-700 font-black">1. VALIDITY:</span>
              </p>
              <p className="pl-3 text-stone-900 leading-normal">
                (a) PROFORMA INVOICE ARE VALID FOR ONLY SEVEN (7) DAYS FROM THE DATE OF ISSUE.<br />
                (b) PRICES ARE SUBJECT TO CHANGE WITHOUT NOTICE AFTER THIS PERIOD UNLESS FULL PAYMENT ON ACTUAL ORDERS HAS BEEN MADE.
              </p>
            </div>

            {/* Clause 2: Terms of Payment */}
            <div className="space-y-0.5 border-t border-dashed border-stone-200 pt-2.5">
              <p className="font-bold text-stone-950">
                <span className="text-red-700 font-black">2. TERMS OF PAYMENT:</span>
              </p>
              <p className="pl-3 text-stone-900 leading-normal">
                (a) {depositPercent}% OF TOTAL COST TO BE PAID BEFORE PRODUCTION.<br />
                (b) {finalPercent}% REMAIN TO BE PAID BEFORE FINAL FINISHING PRODUCTION.
              </p>
            </div>

            {/* Clause 3: Mode of Payment */}
            <div className="space-y-0.5 border-t border-dashed border-stone-200 pt-2.5">
              <p className="font-bold text-stone-950">
                <span className="text-red-700 font-black">3. MODE OF PAYMENT:</span>
              </p>
              <p className="pl-3 text-stone-900 leading-normal">
                (a) PAYMENT CAN BE MADE EITHER TO THE CASHIER / MARKETING MANAGER AT THE OFFICE ONLY IN CASH.<br />
                (b) PAYMENTS MADE IN A FORM OF BANKERS DRAFT / CHEQUE / FUNDS TRANSFER TO COMPANY'S ACCOUNT ARE SUBJECT TO CLEARING AT THE BANK BEFORE ORDERS WOULD BE CONFIRMED FOR PRODUCTION. <span className="text-blue-950 font-black">GT BANK ACCOUNT (NAME - {gtAccountName}) NUMBER (<span className="text-red-700 font-bold">{gtBankAccount}</span>) OR MOBILE MONEY <span className="text-red-700 font-bold">{momoNumber}</span></span>.
              </p>
            </div>

            {/* Clause 4: Refunds */}
            <div className="space-y-0.5 border-t border-dashed border-stone-200 pt-2.5">
              <p className="font-bold text-stone-950">
                <span className="text-red-700 font-black">4. REFUNDS:</span>
              </p>
              <p className="pl-3 text-stone-900 leading-normal">
                (a) ORDERS ONCE CONFIRMED AND PROCESSED ARE NOT REFUNDABLE.<br />
                (b) ALL REFUNDS BE PAID BY CHEQUE IN THE NAME OF CLIENT AS FOUND ON INVOICE WITH {refundPenaltyPercent}% PENALTY.
              </p>
            </div>
          </div>

          {/* Column 2: Clauses 5 - 8 */}
          <div className="border border-stone-300 rounded-xl p-3 bg-stone-50/50 space-y-3.5 flex flex-col justify-between h-full">
            {/* Clause 5: Collection of Order */}
            <div className="space-y-0.5">
              <p className="font-bold text-stone-950">
                <span className="text-red-700 font-black">5. COLLECTION OF ORDER:</span>
              </p>
              <p className="pl-3 text-stone-900 leading-normal">
                (a) QUANTITY AND VALUE TOLERANCE LEVEL {collectionTolerancePercent}%.<br />
                (b) CHECKING OF DESCRIPTION, QUANTITY, AND LENGTHS IS THE RESPONSIBILITY OF CUSTOMER AND COMPANY WILL NOT TAKE RESPONSIBILITY OF IT.<br />
                (c) CUSTOMER MUST BRING ALONG ORIGINAL RECEIPT OF PAYMENT AND PROFORMA INVOICE WHEN COMING TO COLLECT GOODS.<br />
                (d) ORDERS NOT COLLECTED AFTER TWO ({uncollectedWeeks}) WEEKS OF SCHEDULED COLLECTION DATE WOULD ATTRACT A PENALTY OF {uncollectedPenaltyPercent}% OF THE MATERIALS COST.<br />
                (e) GOODS SOLD OUT ARE RETURNABLE.
              </p>
            </div>

            {/* Clause 6: Delivery of Orders */}
            <div className="space-y-0.5 border-t border-dashed border-stone-200 pt-2.5">
              <p className="font-bold text-stone-950">
                <span className="text-red-700 font-black">6. DELIVERY OF ORDERS:</span>
              </p>
              <p className="pl-3 text-stone-900 leading-normal">
                (a) DELIVERY OF ITEMS SHALL BE STATED ON THE PROFORMA INVOICE.<br />
                (b) THE CUSTOMER TAKES TOTAL RESPONSIBILITY OF THE SHEETS ONCE DELIVERED.<br />
                (c) THE COMPANY SHALL BE RELIEVED OF THEFT OR DESTRUCTION OF ROOFING SHEETS UPON CHECKING AND DELIVERY AT SITE.
              </p>
            </div>

            {/* Clause 7: Excess of Productions */}
            <div className="space-y-0.5 border-t border-dashed border-stone-200 pt-2.5">
              <p className="font-bold text-stone-950">
                <span className="text-red-700 font-black">7. EXCESS OF PRODUCTIONS:</span>
              </p>
              <p className="pl-3 text-stone-900 leading-normal">
                EXCESS OF PRODUCTIONS SUPPLIED ARE THE PROPERTY OF THE CUSTOMER AND SHORTAGE OF PRODUCTIONS MUST BE PURCHASED BY THE CUSTOMER.
              </p>
            </div>
          </div>
        </div>

        {/* Signatures & Execution Section */}
        <div className="pt-3 border-t-2 border-stone-900 grid grid-cols-2 gap-4 items-end text-xs font-mono">
          {/* Prepared by MD */}
          <div className="space-y-1">
            <p className="text-stone-900 font-bold text-[11px]">
              Prepared by <strong className="text-red-700 font-black underline">{preparedByName}</strong>
            </p>
            <p className="font-bold text-stone-900 text-[11px]">{preparedByTitle}</p>
            <p className="font-bold text-stone-900 text-[11px]">Tel: {preparedByTel}</p>
          </div>

          {/* Signature Line */}
          <div className="space-y-1 text-right">
            <div className="flex items-center justify-end space-x-2">
              <span className="font-bold text-[11px] text-stone-950">Signature:</span>
              <div className="h-10 border-b-2 border-stone-900 w-44 relative flex items-end justify-center">
                {digitalSignature ? (
                  <img
                    src={digitalSignature}
                    alt="Official Signature"
                    className="h-11 max-w-[170px] object-contain absolute -bottom-1"
                  />
                ) : (
                  <span className="font-serif italic font-black text-stone-900 text-sm opacity-90 select-none pb-0.5">
                    {preparedByName ? preparedByName.split(" ").slice(-1)[0] : "Dugbazah"}
                  </span>
                )}
              </div>
            </div>
            <p className="text-[9px] text-stone-600 italic">Official Executive Endorsement</p>
          </div>
        </div>
      </div>

      {/* Official Navy Blue Footer Bar matching stationery */}
      <div className="mt-4 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 bg-[#10223D] text-white p-3 text-[9px] sm:text-[10px] font-mono text-center space-y-1 border-t-2 border-stone-900">
        <div className="flex flex-wrap items-center justify-between gap-2 px-2">
          <p className="text-amber-300 font-bold">
            E-mail: <span className="text-white underline">{email}</span>
          </p>
          <p className="text-stone-200">
            Digital Address: <strong className="text-white">{digitalAddress}</strong>
          </p>
          <p className="text-amber-300 font-bold">
            Tel: <span className="text-white">{contactPhones}</span>
          </p>
        </div>
        <p className="font-sans font-black text-[10px] tracking-widest text-stone-300 uppercase pt-0.5 border-t border-blue-900">
          ZOF GROUP OF COMPANIES
        </p>
      </div>
    </div>
  );
}
