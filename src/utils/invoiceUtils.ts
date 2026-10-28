/**
 * Formats a 4-digit sequential reference number with month and 2-digit year.
 * Format: nzinv[0001, 0002, 0003...]/[MM]/[YY] (e.g. nzinv0001/09/26, nzinv0002/01/26)
 */
export function formatProformaRef(sequence: number, targetDate: Date | string = new Date()): string {
  const dateObj = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
  
  const monthStr = String(validDate.getMonth() + 1).padStart(2, "0");
  const yearStr = String(validDate.getFullYear()).slice(-2);
  const paddedSeq = String(Math.max(1, sequence)).padStart(4, "0");

  return `nzinv${paddedSeq}/${monthStr}/${yearStr}`;
}

/**
 * Parses an existing nzinv reference string into its sequence number, month, and year components.
 */
export function parseProformaRef(ref: string): { sequence: number; month: string; year: string } | null {
  if (!ref || typeof ref !== "string") return null;
  const match = ref.trim().match(/^nzinv(\d+)\/(\d{1,2})\/(\d{2,4})$/i);
  if (match) {
    return {
      sequence: parseInt(match[1], 10),
      month: match[2].padStart(2, "0"),
      year: match[3].slice(-2)
    };
  }
  // Also handle loose patterns like nzinv0002 or nzinv-0002
  const looseMatch = ref.trim().match(/^nzinv[-_]?(\d+)/i);
  if (looseMatch) {
    const currentYear = String(new Date().getFullYear()).slice(-2);
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
    return {
      sequence: parseInt(looseMatch[1], 10),
      month: currentMonth,
      year: currentYear
    };
  }
  return null;
}

/**
 * Checks if a reference string is a valid nzinv format.
 */
export function isProformaRef(ref: string): boolean {
  if (!ref) return false;
  return /^nzinv\d{4}\/\d{2}\/\d{2}$/i.test(ref.trim());
}

/**
 * Generates the next sequential proforma reference number based on existing records or starts from 0001.
 * Starts with nzinv0001/MM/YY, nzinv0002/MM/YY, nzinv0003/MM/YY...
 */
export function generateSequentialProformaRef(
  existingInvoices: any[] = [],
  targetDate: Date | string = new Date()
): string {
  let maxSeq = 0;

  if (Array.isArray(existingInvoices)) {
    existingInvoices.forEach((inv) => {
      if (!inv) return;
      // Check proformaRef field
      if (inv.proformaRef) {
        const parsed = parseProformaRef(inv.proformaRef);
        if (parsed && parsed.sequence > maxSeq) {
          maxSeq = parsed.sequence;
        }
      }
      // Check id field in case it was stored as nzinv...
      if (inv.id && typeof inv.id === "string") {
        const parsed = parseProformaRef(inv.id);
        if (parsed && parsed.sequence > maxSeq) {
          maxSeq = parsed.sequence;
        }
      }
    });
  }

  const nextSeq = maxSeq > 0 ? maxSeq + 1 : 1;
  return formatProformaRef(nextSeq, targetDate);
}

/**
 * Increments an existing reference string by +1 sequence, preserving or updating the month and year.
 */
export function incrementProformaRef(currentRef: string, targetDate?: Date | string): string {
  const parsed = parseProformaRef(currentRef);
  const nextSeq = parsed ? parsed.sequence + 1 : 1;
  return formatProformaRef(nextSeq, targetDate || new Date());
}

/**
 * Auto-generates a unique sequential invoice number based on the current year and existing records.
 * Format: ZOF-[YEAR]-[THREE_DIGIT_SEQUENCE] (e.g., ZOF-2025-001)
 */
export function generateSequentialInvoiceNumber(
  existingInvoices: any[],
  docMode?: string
): string {
  const currentYear = new Date().getFullYear();
  let maxSeq = 0;

  if (Array.isArray(existingInvoices)) {
    existingInvoices.forEach((inv) => {
      if (inv && inv.id) {
        // Look for 3-digit sequence suffix at the end, e.g., "001" or "003"
        // Also supports extracting from "ZOF-PRO-2026-001" or "ZOF-2026-004"
        const match = inv.id.match(/(\d{3,4})$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxSeq) {
            maxSeq = num;
          }
        }
      }
    });
  }

  const nextSeq = maxSeq + 1;
  const paddedSeq = String(nextSeq).padStart(3, "0");

  // Generate clean sequential invoice number matching the e.g. ZOF-2025-001 pattern
  return `ZOF-${currentYear}-${paddedSeq}`;
}

/**
 * Checks if a given invoice ID is already formatted in a clean sequential manner
 * (e.g., ZOF-2026-004 or ZOF-PRO-2026-001).
 */
export function isSequentialInvoiceId(id: string): boolean {
  if (!id) return false;
  // Match ZOF-[YEAR]-[3 or 4 digits] or ZOF-[MODE]-[YEAR]-[3 or 4 digits]
  return /^ZOF-(PRO|REC|PROP)-\d{4}-\d{3,4}$/i.test(id) || /^ZOF-\d{4}-\d{3,4}$/i.test(id);
}

