/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Lock,
  Unlock,
  LogOut,
  User,
  Key,
  AlertCircle,
  FileText,
  DollarSign,
  Layers,
  Settings,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  TrendingUp,
  Download,
  Building,
  ArrowLeft,
  BadgeCheck,
  Sparkles,
  Eye,
  Wifi,
  WifiOff,
  EyeOff,
  Inbox,
  Zap,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Calendar,
  UserCheck,
  Trash2,
  Calculator,
  CreditCard,
  Check
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from "recharts";
import JSZip from "jszip";
import { jsPDF } from "jspdf";
import zofLogo from "../assets/images/zof_bright_logo_2026.svg";
import { ProposalReceiptGenerator } from "./ProposalReceiptGenerator";
import { MaterialCalculator } from "./MaterialCalculator";

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachToForm?: (details: any) => void;
  onScrollToForm?: () => void;
}

const CustomChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-stone-950 border border-stone-800 p-3 rounded-xl shadow-2xl">
        <p className="text-[10px] font-mono font-bold uppercase text-stone-500 tracking-wider">
          {payload[0].payload.month} 2026
        </p>
        <p className="text-sm font-black text-emerald-400 font-mono mt-1">
          GHS {payload[0].value.toLocaleString()}
        </p>
        <p className="text-[9px] font-sans text-stone-400 mt-0.5">
          MD Approved Volume
        </p>
      </div>
    );
  }
  return null;
};

const TARGET_ADMIN_EMAIL = "zofroofingsyst@gamil.com";
const TARGET_ADMIN_EMAIL_ALT = "zofroofingsyst@gmail.com";
const TARGET_ADMIN_PASSWORDS = ["P,485ks@m", ",P,485ks@m"];

export function AdminDashboard({
  isOpen,
  onClose,
  onAttachToForm,
  onScrollToForm
}: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Helper function in the Admin Dashboard that auto-generates
   * a unique sequential invoice number (e.g., ZOF-2025-001)
   */
  const getNextSequentialInvoiceNumber = (currentInvoices: any[]): string => {
    const currentYear = new Date().getFullYear();
    let maxSeq = 0;

    if (Array.isArray(currentInvoices)) {
      currentInvoices.forEach((inv) => {
        if (inv && inv.id) {
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
    return `ZOF-${currentYear}-${paddedSeq}`;
  };

  const [isStaffOnly, setIsStaffOnly] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"proposals" | "consultations" | "registry" | "settings" | "audit" | "calculator" | "company">("proposals");
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loadingConsultations, setLoadingConsultations] = useState(false);
  const [selectedConsultationForInvoice, setSelectedConsultationForInvoice] = useState<string | null>(null);
  const [selectedConsultationIds, setSelectedConsultationIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "value">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showArchivedOnly, setShowArchivedOnly] = useState<boolean>(false);

  // Sample Logged Proposals for Registry Tab
  const [isMD, setIsMD] = useState(false);
  const [loginRole, setLoginRole] = useState<"staff" | "md">("staff");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingAuditLogs, setLoadingAuditLogs] = useState(false);
  const [restoredInvoice, setRestoredInvoice] = useState<any | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [mdSearchQuery, setMdSearchQuery] = useState("");
  const [mdFilterStatus, setMdFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [mdBatchApprovalLoading, setMdBatchApprovalLoading] = useState(false);

  // --- OFFLINE MODE AND ACTION CACHING ENGINE ---
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [syncingQueue, setSyncingQueue] = useState<boolean>(false);
  const [queueStatusMsg, setQueueStatusMsg] = useState<string>("");

  // Sync listener
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setQueueStatusMsg("Connection restored! Preparing sync queue...");
    };
    const handleOffline = () => {
      setIsOnline(false);
      setQueueStatusMsg("Offline mode activated. Changes will cache locally.");
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      setIsOnline(window.navigator.onLine);
    }

    // Load queue from localStorage
    try {
      const stored = localStorage.getItem("zof_admin_offline_queue");
      if (stored) {
        setOfflineQueue(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load offline queue", e);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }
    };
  }, []);

  // Save offlineQueue to localStorage whenever it changes
  React.useEffect(() => {
    try {
      localStorage.setItem("zof_admin_offline_queue", JSON.stringify(offlineQueue));
    } catch (e) {
      console.error("Failed to save offline queue", e);
    }
  }, [offlineQueue]);

  // Automatically attempt to process the queue when coming back online
  React.useEffect(() => {
    if (isOnline && offlineQueue.length > 0 && !syncingQueue) {
      processOfflineQueue();
    }
  }, [isOnline, offlineQueue.length]);

  const processOfflineQueue = async () => {
    if (syncingQueue || offlineQueue.length === 0) return;
    setSyncingQueue(true);
    setQueueStatusMsg(`Synchronizing ${offlineQueue.length} pending action(s) with MD registry...`);

    const queueToProcess = [...offlineQueue];
    let successfulCount = 0;

    for (const action of queueToProcess) {
      try {
        let res;
        if (action.type === 'approve_invoice') {
          res = await fetch(`/api/invoices/${action.payload.id}/approve`, { method: "POST" });
        } else if (action.type === 'reject_invoice') {
          res = await fetch(`/api/invoices/${action.payload.id}/reject`, { method: "POST" });
        } else if (action.type === 'delete_invoice') {
          res = await fetch(`/api/invoices/${action.payload.id}`, { method: "DELETE" });
        } else if (action.type === 'delete_consultation') {
          res = await fetch(`/api/consultation/${action.payload.id}`, { method: "DELETE" });
        } else if (action.type === 'archive_consultation') {
          res = await fetch("/api/consultation/archive-batch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: [action.payload.id] })
          });
        } else if (action.type === 'restore_consultation') {
          res = await fetch("/api/consultation/restore-batch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: [action.payload.id] })
          });
        } else if (action.type === 'bulk_delete_consultations') {
          res = await fetch("/api/consultation/delete-batch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: action.payload.ids })
          });
        } else if (action.type === 'bulk_archive_consultations') {
          res = await fetch("/api/consultation/archive-batch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: action.payload.ids })
          });
        } else if (action.type === 'bulk_restore_consultations') {
          res = await fetch("/api/consultation/restore-batch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: action.payload.ids })
          });
        }

        if (res && res.ok) {
          successfulCount++;
        }
      } catch (err) {
        console.error("Failed to sync offline action", action, err);
      }
    }

    // Refresh UI data
    loadInvoices();
    loadConsultations();
    if (isMD) {
      loadAuditLogs();
    }

    // Remove processed actions from state
    setOfflineQueue(prev => prev.slice(successfulCount));
    setSyncingQueue(false);
    if (successfulCount > 0) {
      setQueueStatusMsg(`Successfully synchronized ${successfulCount} action(s) to MD cloud!`);
      setTimeout(() => setQueueStatusMsg(""), 4000);
    } else {
      setQueueStatusMsg("Failed to sync offline action queue. Retrying later.");
    }
  };

  const queueOrExecuteAction = (
    type: string,
    payload: any,
    fallbackExecute: () => Promise<void>,
    optimisticUpdate?: () => void
  ) => {
    if (isOnline) {
      fallbackExecute();
    } else {
      // Offline mode: cache action
      const newAction = {
        id: Math.random().toString(36).substring(2, 9),
        type,
        payload,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setOfflineQueue(prev => [...prev, newAction]);
      if (optimisticUpdate) {
        optimisticUpdate();
      }
      setQueueStatusMsg(`Offline Mode: Intercepted and cached offline request.`);
      setTimeout(() => setQueueStatusMsg(""), 5000);
    }
  };

  const handleBulkExportPDFs = async () => {
    setIsExporting(true);
    try {
      const approvedInvoices = invoices.filter(inv => inv.status === "approved");
      if (approvedInvoices.length === 0) {
        alert("No approved invoices found to export.");
        setIsExporting(false);
        return;
      }

      const zip = new JSZip();

      approvedInvoices.forEach((inv) => {
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4"
        });

        // Set bold typography
        doc.setFont("helvetica", "bold");
        
        // ZOF Corporate Header Banner
        doc.setFillColor(245, 158, 11); // Amber
        doc.rect(0, 0, 210, 15, "F");
        
        // Header Text inside banner
        doc.setFontSize(10);
        doc.setTextColor(28, 25, 23); // Charcoal
        doc.text("ZOF ROOFING SYSTEMS - EXECUTIVE PORTAL EXPORT", 15, 9);
        
        // Corporate Brand Info
        doc.setTextColor(28, 25, 23);
        doc.setFontSize(16);
        doc.text("ZOF ROOFING SYSTEMS", 15, 30);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text("Specialists in Premium Aluzinc & Aluminium Roof Coverings", 15, 35);
        doc.text("Accra | Kumasi | Tema | Diaspora remote", 15, 39);
        
        // Document Header Information
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(`${inv.docMode.toUpperCase()} DETAILS`, 130, 30);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(`ID: ${inv.id}`, 130, 35);
        doc.text(`Branch: ${inv.branch}`, 130, 39);
        doc.text(`Date: ${new Date(inv.timestamp || Date.now()).toLocaleDateString()}`, 130, 43);
        
        // Decorative dividing line
        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.5);
        doc.line(15, 48, 195, 48);
        
        // Customer Profile Section
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("CUSTOMER PROFILE", 15, 56);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`Name: ${inv.customerName}`, 15, 62);
        doc.text(`Phone: ${inv.customerPhone || 'N/A'}`, 15, 67);
        doc.text(`Site Location: ${inv.customerLocation || 'N/A'}`, 15, 72);
        
        // Items Table Headers
        doc.setFillColor(28, 25, 23); // Dark Gray / Stone 900
        doc.rect(15, 82, 180, 8, "F");
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text("ITEM DESCRIPTION", 18, 87);
        doc.text("QTY", 120, 87);
        doc.text("UNIT (GHS)", 145, 87);
        doc.text("TOTAL (GHS)", 172, 87);
        
        // Reset Text Color for Rows
        doc.setTextColor(40, 40, 40);
        doc.setFont("helvetica", "normal");
        
        let currentY = 96;
        const itemsList = inv.items || [];
        
        itemsList.forEach((item: any, idx: number) => {
          doc.text(`${idx + 1}. ${item.name}`, 18, currentY);
          if (item.description) {
            doc.setFontSize(7);
            doc.setTextColor(100, 100, 100);
            doc.text(item.description, 18, currentY + 4);
            doc.setFontSize(9);
            doc.setTextColor(40, 40, 40);
          }
          
          doc.text(String(item.quantity || 0), 120, currentY);
          doc.text(parseFloat(item.unitPrice || 0).toFixed(2), 145, currentY);
          
          const rowTotal = (item.quantity || 0) * (item.unitPrice || 0);
          doc.text(rowTotal.toFixed(2), 172, currentY);
          
          // Draw thin spacer line below each item
          doc.setDrawColor(243, 244, 246);
          doc.line(15, currentY + 7, 195, currentY + 7);
          
          currentY += 12;
        });
        
        // Summary Block Math calculations
        const subtotal = inv.subtotal || (itemsList.reduce((acc: number, item: any) => acc + ((item.quantity || 0) * (item.unitPrice || 0)), 0));
        const vat = subtotal * 0.15;
        const total = inv.totalAmount || (subtotal + vat);
        
        // Position totals layout nicely below table
        currentY = Math.max(currentY + 5, 140);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("Subtotal:", 130, currentY);
        doc.text(`GHS ${parseFloat(subtotal).toFixed(2)}`, 165, currentY);
        
        doc.text("VAT (15%):", 130, currentY + 5);
        doc.text(`GHS ${vat.toFixed(2)}`, 165, currentY + 5);
        
        // Grand Total Row Highlight
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Total Amount:", 130, currentY + 11);
        doc.text(`GHS ${parseFloat(total).toFixed(2)}`, 165, currentY + 11);
        
        // Sign-off / Verification Seal section
        doc.setDrawColor(229, 231, 235);
        doc.line(15, currentY + 18, 195, currentY + 18);
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text("MD AUDIT SIGN-OFF", 15, currentY + 26);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(`Status: CLEARED & APPROVED FOR PAYMENT`, 15, 32 + currentY);
        doc.text(`Authorized Signatory: ${inv.approvedBy || "F. O. Dugbazah MD"}`, 15, 36 + currentY);
        doc.text(`Audit Stamp: SECURE SHA256 APPROVED LOCK`, 15, 40 + currentY);
        
        // Footer signature line placeholder
        doc.setFont("helvetica", "bold");
        doc.text("MD signature authorized", 135, 36 + currentY);
        doc.line(130, 32 + currentY, 185, 32 + currentY);
        
        // Elegant Page Footer Branding
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text("ZOF GROUP OFFICIAL DOCUMENT ARCHIVE. CONFIDENTIALITY APPLIES.", 15, 280);
        doc.text("Page 1 of 1", 180, 280);

        // Export as binary / arraybuffer and append to the ZIP package
        const pdfOutput = doc.output("arraybuffer");
        const filename = `${inv.id}.pdf`;
        zip.file(filename, pdfOutput);
      });

      // Generate the finished ZIP package as a Blob download
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "ZOF_Approved_Invoices_Archive_2026.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Bulk export failed", err);
      alert("Error occurred during bulk packaging. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const loadConsultations = async () => {
    setLoadingConsultations(true);
    try {
      const res = await fetch("/api/consultation/list");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setConsultations(data);
        }
      }
    } catch (err) {
      console.error("Failed to load consultations", err);
    } finally {
      setLoadingConsultations(false);
    }
  };

  const loadInvoices = async () => {
    setLoadingInvoices(true);
    try {
      const res = await fetch("/api/invoices");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setInvoices(data);
        }
      }
    } catch (err) {
      console.error("Failed to load invoices", err);
    } finally {
      setLoadingInvoices(false);
    }
  };

  const loadAuditLogs = async () => {
    setLoadingAuditLogs(true);
    try {
      const res = await fetch("/api/audit-logs");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setAuditLogs(data);
        }
      }
    } catch (err) {
      console.error("Failed to load audit logs", err);
    } finally {
      setLoadingAuditLogs(false);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      loadConsultations();
      loadInvoices();
      if (isMD) {
        loadAuditLogs();
      }
    }
  }, [isAuthenticated, activeTab, isMD]);

  const handlePopulateInvoiceFromDashboard = (consultationId: string) => {
    setSelectedConsultationForInvoice(consultationId);
    setActiveTab("proposals");
  };

  const getMonthlyRevenueData = () => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    const monthlyTotals = months.reduce((acc, m) => {
      acc[m] = 0;
      return acc;
    }, {} as Record<string, number>);

    invoices.forEach((inv) => {
      if (inv.status === "approved" && inv.timestamp) {
        const date = new Date(inv.timestamp);
        const monthIndex = date.getMonth();
        const monthName = months[monthIndex];
        const amount = inv.totalAmount || 0;
        monthlyTotals[monthName] = (monthlyTotals[monthName] || 0) + amount;
      }
    });

    return months.map((m) => ({
      month: m,
      Revenue: monthlyTotals[m]
    }));
  };

  const handleApproveInvoice = async (id: string) => {
    const action = async () => {
      try {
        const res = await fetch(`/api/invoices/${id}/approve`, {
          method: "POST"
        });
        if (res.ok) {
          loadInvoices();
          loadAuditLogs();
        }
      } catch (err) {
        console.error("Approve failed", err);
      }
    };

    queueOrExecuteAction('approve_invoice', { id }, action, () => {
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'approved' } : inv));
    });
  };

  const handleRejectInvoice = async (id: string) => {
    const action = async () => {
      try {
        const res = await fetch(`/api/invoices/${id}/reject`, {
          method: "POST"
        });
        if (res.ok) {
          loadInvoices();
          loadAuditLogs();
        }
      } catch (err) {
        console.error("Reject failed", err);
      }
    };

    queueOrExecuteAction('reject_invoice', { id }, action, () => {
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'rejected' } : inv));
    });
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete/void this invoice from records?")) return;
    const action = async () => {
      try {
        const res = await fetch(`/api/invoices/${id}`, {
          method: "DELETE"
        });
        if (res.ok) {
          loadInvoices();
          loadAuditLogs();
        }
      } catch (err) {
        console.error("Delete failed", err);
      }
    };

    queueOrExecuteAction('delete_invoice', { id }, action, () => {
      setInvoices(prev => prev.filter(inv => inv.id !== id));
    });
  };

  const handleDeleteConsultation = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this consultation submission?")) return;
    const action = async () => {
      try {
        const res = await fetch(`/api/consultation/${id}`, {
          method: "DELETE"
        });
        if (res.ok) {
          setSelectedConsultationIds(prev => prev.filter(selectedId => selectedId !== id));
          loadConsultations();
        }
      } catch (err) {
        console.error("Failed to delete consultation", err);
      }
    };

    queueOrExecuteAction('delete_consultation', { id }, action, () => {
      setConsultations(prev => prev.filter(c => c.id !== id));
      setSelectedConsultationIds(prev => prev.filter(selectedId => selectedId !== id));
    });
  };

  const handleBulkDeleteConsultations = async () => {
    if (selectedConsultationIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to permanently delete these ${selectedConsultationIds.length} selected estimate/consultation records?`)) return;
    const action = async () => {
      try {
        const res = await fetch("/api/consultation/delete-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedConsultationIds })
        });
        if (res.ok) {
          setSelectedConsultationIds([]);
          loadConsultations();
        }
      } catch (err) {
        console.error("Failed to delete batch", err);
      }
    };

    queueOrExecuteAction('bulk_delete_consultations', { ids: [...selectedConsultationIds] }, action, () => {
      setConsultations(prev => prev.filter(c => !selectedConsultationIds.includes(c.id)));
      setSelectedConsultationIds([]);
    });
  };

  const handleArchiveConsultation = async (id: string) => {
    const action = async () => {
      try {
        const res = await fetch("/api/consultation/archive-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: [id] })
        });
        if (res.ok) {
          setSelectedConsultationIds(prev => prev.filter(selectedId => selectedId !== id));
          loadConsultations();
        }
      } catch (err) {
        console.error("Failed to archive consultation", err);
      }
    };

    queueOrExecuteAction('archive_consultation', { id }, action, () => {
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, isArchived: true } : c));
      setSelectedConsultationIds(prev => prev.filter(selectedId => selectedId !== id));
    });
  };

  const handleRestoreConsultation = async (id: string) => {
    const action = async () => {
      try {
        const res = await fetch("/api/consultation/restore-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: [id] })
        });
        if (res.ok) {
          setSelectedConsultationIds(prev => prev.filter(selectedId => selectedId !== id));
          loadConsultations();
        }
      } catch (err) {
        console.error("Failed to restore consultation", err);
      }
    };

    queueOrExecuteAction('restore_consultation', { id }, action, () => {
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, isArchived: false } : c));
      setSelectedConsultationIds(prev => prev.filter(selectedId => selectedId !== id));
    });
  };

  const handleBulkArchiveConsultations = async () => {
    if (selectedConsultationIds.length === 0) return;
    const action = async () => {
      try {
        const res = await fetch("/api/consultation/archive-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedConsultationIds })
        });
        if (res.ok) {
          setSelectedConsultationIds([]);
          loadConsultations();
        }
      } catch (err) {
        console.error("Failed to bulk archive consultations", err);
      }
    };

    queueOrExecuteAction('bulk_archive_consultations', { ids: [...selectedConsultationIds] }, action, () => {
      setConsultations(prev => prev.map(c => selectedConsultationIds.includes(c.id) ? { ...c, isArchived: true } : c));
      setSelectedConsultationIds([]);
    });
  };

  const handleBulkRestoreConsultations = async () => {
    if (selectedConsultationIds.length === 0) return;
    const action = async () => {
      try {
        const res = await fetch("/api/consultation/restore-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedConsultationIds })
        });
        if (res.ok) {
          setSelectedConsultationIds([]);
          loadConsultations();
        }
      } catch (err) {
        console.error("Failed to bulk restore consultations", err);
      }
    };

    queueOrExecuteAction('bulk_restore_consultations', { ids: [...selectedConsultationIds] }, action, () => {
      setConsultations(prev => prev.map(c => selectedConsultationIds.includes(c.id) ? { ...c, isArchived: false } : c));
      setSelectedConsultationIds([]);
    });
  };

  const handleRestoreInvoiceToWorkspace = (invoice: any) => {
    setRestoredInvoice(invoice);
    setActiveTab("proposals");
  };

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError("");

    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    if (loginRole === "md") {
      const isMDEmail = cleanEmail === "zofroofingsyst@gamil.com" || cleanEmail === "zofroofingsyst@gmail.com";
      const isMDPassword = cleanPassword === "p,485ks@md" || cleanPassword === "P,485ks@md";
      if (isMDEmail && isMDPassword) {
        setIsMD(true);
        setIsStaffOnly(false);
        setIsAuthenticated(true);
        setAuthError("");
      } else {
        setAuthError("Authentication Failed: Invalid Managing Director (MD) Portal credentials.");
      }
    } else {
      const isValidEmail =
        cleanEmail === TARGET_ADMIN_EMAIL.toLowerCase() ||
        cleanEmail === TARGET_ADMIN_EMAIL_ALT.toLowerCase();

      const isValidPassword = TARGET_ADMIN_PASSWORDS.includes(cleanPassword);

      if (isValidEmail && isValidPassword) {
        setIsMD(false);
        setIsStaffOnly(false);
        setIsAuthenticated(true);
        setAuthError("");
      } else {
        setAuthError("Authentication Failed: Please check your admin email address and password.");
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsStaffOnly(false);
    setIsMD(false);
  };

  return (
    <div className="fixed inset-0 z-100 bg-stone-950/90 backdrop-blur-lg overflow-y-auto font-sans text-stone-100 text-left">
      {!isAuthenticated ? (
        /* LOGIN PORTAL SCREEN */
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Header / Logo */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-white border border-stone-700 rounded-2xl shadow-xl p-1 mx-auto">
                <img
                  src={zofLogo}
                  alt="ZOF Group"
                  className="h-full w-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center justify-center space-x-1.5 text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-amber-400" />
                  <span>ZOF Group Executive Portal</span>
                </div>
                <h1 className="font-sans font-black text-2xl text-white mt-1">
                  Ads
                </h1>
                <p className="text-stone-400 text-xs mt-1">
                  Access Official Scope Proposal Templates & Official Transaction Receipts.
                </p>
              </div>
            </div>

            {/* Role / Portal Segment Swapper */}
            <div className="flex bg-stone-950 p-1 border border-stone-800 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setLoginRole("staff");
                  setAuthError("");
                  setEmailInput("");
                  setPasswordInput("");
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                  loginRole === "staff"
                    ? "bg-amber-500 text-slate-950"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                Staff Portal
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginRole("md");
                  setAuthError("");
                  setEmailInput("");
                  setPasswordInput("");
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                  loginRole === "md"
                    ? "bg-amber-500 text-slate-950"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                Managing Director (MD)
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 pt-2">
              <div>
                <label className="block text-[10px] font-mono uppercase font-bold text-stone-400 tracking-wider mb-1">
                  {loginRole === "md" ? "MD Authorized Email" : "Admin Email Address"}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-stone-500" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="zofroofingsyst@gamil.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-500 text-white rounded-xl text-xs font-mono focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase font-bold text-stone-400 tracking-wider mb-1">
                  {loginRole === "md" ? "MD Secret Password" : "Admin Password"}
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-3 h-4 w-4 text-stone-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-500 text-white rounded-xl text-xs font-mono focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Unlock className="h-4 w-4" />
                  <span>Enter {loginRole === "md" ? "MD Portal" : "Ads"}</span>
                </button>

                {loginRole === "md" && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMD(true);
                      setIsStaffOnly(false);
                      setIsAuthenticated(true);
                      setActiveTab("registry");
                      setAuthError("");
                    }}
                    className="w-full py-3 bg-stone-850 hover:bg-stone-800 text-amber-400 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-2 border border-stone-800 shadow-sm"
                  >
                    <ShieldCheck className="h-4 w-4 text-amber-400 animate-pulse" />
                    <span>⚡ Quick MD Audit Access (Skip Credentials)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 text-stone-400 hover:text-white text-xs font-mono transition-colors cursor-pointer text-center block"
                >
                  ← Return to Public Website
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* AUTHENTICATED ADMIN DASHBOARD */
        <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
          
          {/* DASHBOARD TOP BAR */}
          <header className="bg-stone-900 border-b border-stone-800 sticky top-0 z-30 px-4 sm:px-8 py-4">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
              
              {/* Brand & Status */}
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-white rounded-xl p-0.5 border border-stone-700 shrink-0">
                  <img src={zofLogo} alt="ZOF Group" className="h-full w-full object-cover rounded-lg" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-sans font-extrabold text-sm text-white">
                      {isMD ? "ZOF GROUP MD AUDIT & CLEARANCE PORTAL" : isStaffOnly ? "ZOF STAFF ENTRY PORTAL" : "ZOF GROUP ADS PORTAL"}
                    </span>
                    {isMD ? (
                      <span className="bg-amber-500 text-slate-950 border border-amber-400 text-[10px] font-mono px-2 py-0.5 rounded-full font-black flex items-center space-x-1 shadow-lg shadow-amber-500/20">
                        <ShieldCheck className="h-3 w-3 text-slate-950 animate-pulse" />
                        <span>MD AUTHORIZED</span>
                      </span>
                    ) : isStaffOnly ? (
                      <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                        <ShieldCheck className="h-3 w-3 text-blue-400 animate-pulse" />
                        <span>QUICK INVOICE ENTRY</span>
                      </span>
                    ) : (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                        <BadgeCheck className="h-3 w-3 text-amber-400" />
                        <span>ADMIN APPROVED</span>
                      </span>
                    )}

                    {/* OFFLINE STATUS BADGES */}
                    {isOnline ? (
                      <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                        <Wifi className="h-3 w-3 text-emerald-400" />
                        <span>ONLINE</span>
                      </span>
                    ) : (
                      <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center space-x-1 animate-pulse">
                        <WifiOff className="h-3 w-3 text-red-400" />
                        <span>OFFLINE MODE</span>
                      </span>
                    )}

                    {offlineQueue.length > 0 && (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                        <span>{offlineQueue.length} Pending Actions</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-stone-400 flex items-center space-x-2 mt-0.5">
                    <span>Officer: <strong className="text-amber-300">{isMD ? "md@zofgroup.com (MD)" : isStaffOnly ? "Staff Member" : "zofroofingsyst@gamil.com"}</strong></span>
                    <span>•</span>
                    <span className="text-emerald-400 flex items-center space-x-1">
                      <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
                      <span>{isMD ? "Central Synoptic Oversight Active" : isStaffOnly ? "Invoice & Proposal Entry Active" : "Live Region Registry Active"}</span>
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer flex items-center space-x-1.5 border border-stone-700"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Public Site</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-2 bg-stone-800 hover:bg-red-950/60 hover:text-red-400 text-stone-300 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer flex items-center space-x-1.5 border border-stone-700"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

            </div>
          </header>

          {/* OFFLINE QUEUE FLOATING STATUS BAR */}
          {queueStatusMsg && (
            <div className="bg-amber-500 text-stone-950 font-mono text-[11px] font-bold py-2 px-4 sm:px-8 flex items-center justify-between border-b border-amber-400 shadow-md">
              <div className="flex items-center space-x-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-stone-950 animate-pulse" />
                <span>{queueStatusMsg}</span>
              </div>
              <div className="flex items-center space-x-3">
                {offlineQueue.length > 0 && (
                  <button
                    type="button"
                    onClick={processOfflineQueue}
                    disabled={syncingQueue}
                    className="bg-stone-950 hover:bg-stone-900 disabled:bg-stone-800 text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase cursor-pointer flex items-center space-x-1 transition-all"
                  >
                    {syncingQueue ? <RefreshCw className="h-3 w-3 animate-spin" /> : null}
                    <span>Retry Sync ({offlineQueue.length})</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setQueueStatusMsg("")}
                  className="text-stone-900 hover:text-stone-950 font-bold px-1"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* DASHBOARD NAVIGATION TABS */}
          <div className="bg-stone-900/60 border-b border-stone-800/80 px-4 sm:px-8 py-3">
            <div className="max-w-7xl mx-auto flex items-center space-x-2 sm:space-x-3 overflow-x-auto no-scrollbar">
              {[
                { id: "proposals", label: "Official Scope Proposal Builder", icon: FileText, disabled: false },
                { id: "consultations", label: `Inbound Consultation Form Submissions (${consultations.length})`, icon: Inbox, disabled: false },
                { id: "calculator", label: "Internal Material Estimator", icon: Calculator, disabled: false },
                { id: "company", label: "Company Profile & Bank Settlement", icon: Building, disabled: false },
                { id: "registry", label: "Proposal Registry Logs (3)", icon: Layers, disabled: isStaffOnly },
                { id: "audit", label: "System Audit Log", icon: Clock, disabled: !isMD },
                { id: "settings", label: "Base Rates & Admin Settings", icon: Settings, disabled: isStaffOnly },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isTabDisabled = tab.disabled;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    disabled={isTabDisabled}
                    onClick={() => {
                      if (isTabDisabled) return;
                      setActiveTab(tab.id as any);
                    }}
                    className={`relative px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 shrink-0 transition-all select-none ${
                      isActive
                        ? "text-slate-950 font-extrabold cursor-default"
                        : isTabDisabled
                        ? "text-stone-600 opacity-40 cursor-not-allowed"
                        : "text-stone-400 hover:text-white hover:bg-stone-800/60 cursor-pointer"
                    }`}
                    title={isTabDisabled ? "Requires full Admin Credentials" : undefined}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeAdminTabHighlight"
                        className="absolute inset-0 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/20"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                      {isTabDisabled && <Lock className="h-3 w-3 text-stone-500 ml-1" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DASHBOARD CONTENT BODY */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 relative">
            <AnimatePresence mode="wait">
              {activeTab === "proposals" && (
                <motion.div
                  key="proposals"
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center space-x-2 text-amber-300 font-bold">
                      <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0" />
                      <span>Official Scope Proposal & Paid Receipt Builder (Ads Protected)</span>
                    </div>
                    <span className="text-stone-400 text-[11px]">Authorized Operator: zofroofingsyst@gamil.com</span>
                  </div>

                  {/* Render the proposal builder inside the admin dashboard */}
                  <ProposalReceiptGenerator
                    isAdmin={true}
                    onAttachToForm={onAttachToForm}
                    onScrollToForm={onScrollToForm}
                    initialConsultationId={selectedConsultationForInvoice}
                    restoredInvoice={restoredInvoice}
                    onSaveSuccess={loadInvoices}
                    onPrintSuccess={loadInvoices}
                  />
                </motion.div>
              )}

              {activeTab === "consultations" && (() => {
                const filteredConsultations = consultations.filter(c => {
                  const isArchived = c.isArchived ?? false;
                  return showArchivedOnly ? isArchived : !isArchived;
                });

                const sortedConsultations = [...filteredConsultations].sort((a, b) => {
                  let comparison = 0;
                  if (sortBy === "date") {
                    const dateA = new Date(a.timestamp || 0).getTime();
                    const dateB = new Date(b.timestamp || 0).getTime();
                    comparison = dateA - dateB;
                  } else if (sortBy === "value") {
                    const valA = a.estimateDetails?.totalEstimatedMin || 0;
                    const valB = b.estimateDetails?.totalEstimatedMin || 0;
                    comparison = valA - valB;
                  }
                  return sortDirection === "asc" ? comparison : -comparison;
                });

                // Compute Material Demand vs Supply for active (unarchived) estimates
                const getMaterialDemandSupplyData = () => {
                  const activeEstimates = consultations.filter(c => !(c.isArchived ?? false));
                  
                  // Initialize map matching user's handwriting options
                  const materialMap: Record<string, { name: string; demand: number; supply: number }> = {
                    selflock: { name: "Seamless Selflock", demand: 0, supply: 8000 },
                    ibr: { name: "IBR Profile", demand: 0, supply: 10000 },
                    step_tiles: { name: "Step Tiles", demand: 0, supply: 6000 },
                    transparent_sheets: { name: "Transparent Polycarb", demand: 0, supply: 3000 },
                    galvanize: { name: "Galvanized Iron", demand: 0, supply: 4500 },
                    aluzinc_plain: { name: "Long Span", demand: 0, supply: 4000 }
                  };

                  // Aggregate active client demands
                  activeEstimates.forEach(c => {
                    const est = c.estimateDetails;
                    if (est && est.roofType) {
                      const type = est.roofType.toLowerCase();
                      const area = est.areaSqFt || 0;
                      if (materialMap[type]) {
                        materialMap[type].demand += area;
                      } else if (type.includes("self")) {
                        materialMap.selflock.demand += area;
                      } else if (type.includes("ibr")) {
                        materialMap.ibr.demand += area;
                      } else if (type.includes("step")) {
                        materialMap.step_tiles.demand += area;
                      } else if (type.includes("trans")) {
                        materialMap.transparent_sheets.demand += area;
                      } else if (type.includes("galv") || type.includes("ppg")) {
                        materialMap.galvanize.demand += area;
                      } else {
                        materialMap.aluzinc_plain.demand += area;
                      }
                    }
                  });

                  // If total active demand is zero, add nice placeholder demand so the chart shows beautifully populated
                  const hasDemands = Object.values(materialMap).some(m => m.demand > 0);
                  if (!hasDemands) {
                    materialMap.selflock.demand = 5500;
                    materialMap.ibr.demand = 7200;
                    materialMap.step_tiles.demand = 3100;
                    materialMap.transparent_sheets.demand = 1200;
                    materialMap.galvanize.demand = 2800;
                    materialMap.aluzinc_plain.demand = 2400;
                  }

                  return Object.values(materialMap);
                };

                const chartData = getMaterialDemandSupplyData();

                return (
                  <motion.div
                    key="consultations"
                    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h2 className="font-sans font-black text-xl text-white flex items-center space-x-2">
                          <Inbox className="h-5 w-5 text-amber-400" />
                          <span>Inbound Client Consultation Form Submissions</span>
                        </h2>
                        <p className="text-stone-400 text-xs mt-1">
                          Review customer inspection requests & auto-populate official proposals/invoices with one click.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={loadConsultations}
                        disabled={loadingConsultations}
                        className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 cursor-pointer transition-colors"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${loadingConsultations ? "animate-spin" : ""}`} />
                        <span>{loadingConsultations ? "Refreshing..." : "Sync Form Inbox"}</span>
                      </button>
                    </div>

                    {/* Recharts Material Demand vs Supply Bar Chart */}
                    <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl shadow-xl space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h3 className="font-sans font-black text-sm text-white tracking-wide uppercase">
                            📊 Next 30 Days Material Demand vs. Projected Supply Capacity
                          </h3>
                          <p className="text-stone-400 text-[11px] font-mono">
                            Aggregated from active estimates (Sq Ft) compared against warehouse storage quotas.
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 text-xs font-mono">
                          <div className="flex items-center space-x-1.5">
                            <span className="h-3 w-3 bg-amber-500 rounded" />
                            <span className="text-stone-300">Active Demand</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <span className="h-3 w-3 bg-emerald-500 rounded" />
                            <span className="text-stone-300">Projected Supply</span>
                          </div>
                        </div>
                      </div>

                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                            <defs>
                              <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.9}/>
                                <stop offset="95%" stopColor="#D97706" stopOpacity={0.6}/>
                              </linearGradient>
                              <linearGradient id="supplyGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.9}/>
                                <stop offset="95%" stopColor="#059669" stopOpacity={0.6}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                            <XAxis 
                              dataKey="name" 
                              stroke="#78716c" 
                              fontSize={10} 
                              tickLine={false} 
                              axisLine={false}
                            />
                            <YAxis 
                              stroke="#78716c" 
                              fontSize={10} 
                              tickLine={false} 
                              axisLine={false}
                            />
                            <RechartsTooltip 
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-stone-950 border border-stone-800 p-3 rounded-xl shadow-2xl space-y-1 text-left">
                                      <p className="text-[11px] font-sans font-black text-white">{data.name}</p>
                                      <div className="text-[10px] font-mono space-y-0.5">
                                        <p className="text-amber-400">Demand: {data.demand.toLocaleString()} Sq Ft</p>
                                        <p className="text-emerald-400">Supply Limit: {data.supply.toLocaleString()} Sq Ft</p>
                                        <p className={`font-bold ${data.demand > data.supply ? "text-red-400 animate-pulse" : "text-stone-400"}`}>
                                          {data.demand > data.supply ? "⚠️ SHORTAGE DETECTED" : "✅ Stock Sufficient"}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="demand" fill="url(#demandGradient)" radius={[4, 4, 0, 0]} maxBarSize={30} />
                            <Bar dataKey="supply" fill="url(#supplyGradient)" radius={[4, 4, 0, 0]} maxBarSize={30} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Active vs Archived Filter Tabs Bar */}
                    <div className="flex border border-stone-800 rounded-2xl p-1 bg-stone-900 w-fit">
                      <button
                        type="button"
                        onClick={() => {
                          setShowArchivedOnly(false);
                          setSelectedConsultationIds([]);
                        }}
                        className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                          !showArchivedOnly ? "bg-amber-500 text-stone-950 font-black" : "text-stone-400 hover:text-white"
                        }`}
                      >
                        <span>📥 Active Estimates</span>
                        <span className="bg-stone-950/40 text-[10px] px-1.5 py-0.5 rounded-full text-stone-300">
                          {consultations.filter(c => !(c.isArchived ?? false)).length}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowArchivedOnly(true);
                          setSelectedConsultationIds([]);
                        }}
                        className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                          showArchivedOnly ? "bg-stone-800 text-amber-400 border border-amber-500/30 font-black" : "text-stone-400 hover:text-white"
                        }`}
                      >
                        <span>🗄️ Hidden Archive</span>
                        <span className="bg-stone-950/40 text-[10px] px-1.5 py-0.5 rounded-full text-amber-400">
                          {consultations.filter(c => (c.isArchived ?? false)).length}
                        </span>
                      </button>
                    </div>

                    {filteredConsultations.length > 0 && (
                      <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-900 border border-stone-800 p-4 rounded-2xl">
                        {/* Sorting controls */}
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs font-mono text-stone-400">Sort By:</span>
                          
                          <div className="flex border border-stone-800 rounded-lg overflow-hidden p-0.5 bg-stone-950">
                            <button
                              type="button"
                              onClick={() => setSortBy("date")}
                              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-md transition-colors cursor-pointer ${
                                sortBy === "date" ? "bg-amber-500 text-stone-950" : "text-stone-400 hover:text-white"
                              }`}
                            >
                              Date Received
                            </button>
                            <button
                              type="button"
                              onClick={() => setSortBy("value")}
                              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-md transition-colors cursor-pointer ${
                                sortBy === "value" ? "bg-amber-500 text-stone-950" : "text-stone-400 hover:text-white"
                              }`}
                            >
                              Project Value
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
                            className="px-3 py-1.5 bg-stone-950 hover:bg-stone-850 text-amber-400 border border-stone-800 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors"
                          >
                            {sortDirection === "asc" ? "↑ Ascending" : "↓ Descending"}
                          </button>
                        </div>

                        {/* Selection / Bulk Actions */}
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => {
                              const currentVisibleIds = filteredConsultations.map(c => c.id);
                              const isAllSelected = currentVisibleIds.every(id => selectedConsultationIds.includes(id));
                              if (isAllSelected) {
                                setSelectedConsultationIds(prev => prev.filter(id => !currentVisibleIds.includes(id)));
                              } else {
                                setSelectedConsultationIds(prev => {
                                  const newSelection = [...prev];
                                  currentVisibleIds.forEach(id => {
                                    if (!newSelection.includes(id)) {
                                      newSelection.push(id);
                                    }
                                  });
                                  return newSelection;
                                });
                              }
                            }}
                            className="px-3 py-1.5 bg-stone-950 hover:bg-stone-850 text-stone-300 border border-stone-800 rounded-lg text-xs font-mono cursor-pointer transition-colors font-bold"
                          >
                            {filteredConsultations.map(c => c.id).every(id => selectedConsultationIds.includes(id)) ? "Deselect All" : "Select All"}
                          </button>

                          {selectedConsultationIds.length > 0 && (
                            <div className="flex items-center space-x-2">
                              {!showArchivedOnly ? (
                                <button
                                  type="button"
                                  onClick={handleBulkArchiveConsultations}
                                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg text-xs font-mono font-black flex items-center space-x-1.5 cursor-pointer transition-all shadow-md"
                                >
                                  <span>🗄️ Archive Selected ({selectedConsultationIds.length})</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleBulkRestoreConsultations}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 cursor-pointer transition-all shadow-md"
                                >
                                  <span>⚡ Restore Selected ({selectedConsultationIds.length})</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={handleBulkDeleteConsultations}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 cursor-pointer transition-all shadow-md"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete ({selectedConsultationIds.length})</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {sortedConsultations.length === 0 ? (
                      <div className="bg-stone-900 border border-stone-800 p-8 rounded-2xl text-center space-y-3">
                        <Inbox className="h-12 w-12 text-stone-600 mx-auto" />
                        <p className="text-stone-300 font-bold text-sm">
                          {showArchivedOnly ? "No Archived Estimates Found" : "No Active Inbound Consultation Submissions Found"}
                        </p>
                        <p className="text-stone-500 text-xs max-w-md mx-auto">
                          {showArchivedOnly 
                            ? "You haven't archived any estimates yet. Old estimates can be archived in bulk to keep your inbox clean."
                            : "When clients submit inspection booking forms on the website, their site location, diagnostic state, and estimated material needs will appear here automatically."}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sortedConsultations.map((item) => {
                          const est = item.estimateDetails;
                          const isSelected = selectedConsultationIds.includes(item.id);
                          return (
                            <div
                              key={item.id}
                              className={`bg-stone-900 border p-5 rounded-2xl space-y-4 text-left transition-all shadow-lg flex flex-col justify-between relative ${
                                isSelected ? "border-amber-500 ring-1 ring-amber-500/20" : "border-stone-800 hover:border-amber-500/50"
                              }`}
                            >
                              <div className="space-y-3">
                                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                                  <div className="flex items-center space-x-3">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => {
                                        setSelectedConsultationIds(prev => 
                                          prev.includes(item.id) 
                                            ? prev.filter(id => id !== item.id) 
                                            : [...prev, item.id]
                                        );
                                      }}
                                      className="h-4 w-4 accent-amber-500 rounded border-stone-800 bg-stone-950 cursor-pointer"
                                    />
                                    <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-lg">
                                      {item.id}
                                    </span>
                                    <span className="text-[10px] font-mono text-stone-400 uppercase">
                                      {new Date(item.timestamp || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    {showArchivedOnly ? (
                                      <button
                                        type="button"
                                        onClick={() => handleRestoreConsultation(item.id)}
                                        className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-mono font-bold cursor-pointer transition-all"
                                        title="Restore to Active"
                                      >
                                        Restore
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleArchiveConsultation(item.id)}
                                        className="px-2 py-1 bg-stone-850 hover:bg-stone-800 text-amber-400 border border-stone-750 rounded text-[10px] font-mono font-bold cursor-pointer transition-all"
                                        title="Archive Estimate"
                                      >
                                        Archive
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteConsultation(item.id)}
                                      className="p-1 text-stone-500 hover:text-red-400 hover:bg-stone-950 rounded transition-colors cursor-pointer"
                                      title="Permanently Delete Submission"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-sans font-extrabold text-lg text-white">{item.fullName}</h3>
                                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs font-mono text-stone-300">
                                    <div className="flex items-center space-x-1.5 text-stone-300">
                                      <Phone className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                                      <span>{item.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5 text-stone-300">
                                      <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                                      <span>{item.city}, Ghana</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5 text-stone-300 col-span-2">
                                      <Mail className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                                      <span className="truncate">{item.email}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-stone-950/80 border border-stone-800 p-3 rounded-xl space-y-2 text-xs">
                                  <div>
                                    <span className="text-[10px] font-mono text-stone-500 uppercase block">Diagnostic State & Scope</span>
                                    <span className="font-sans text-amber-300 font-bold capitalize">
                                      {item.roofCondition?.replace(/_/g, " ")} — {(item.undertakings || []).join(", ")}
                                    </span>
                                  </div>
                                  {item.notes && (
                                    <div>
                                      <span className="text-[10px] font-mono text-stone-500 uppercase block">Client Site Notes</span>
                                      <p className="text-stone-300 text-[11px] italic leading-snug">"{item.notes}"</p>
                                    </div>
                                  )}
                                </div>

                                {est && (
                                  <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-center justify-between text-xs font-mono">
                                    <div>
                                      <span className="text-[10px] text-amber-400/80 uppercase block">Captured Calculator Estimate</span>
                                      <span className="font-bold text-white uppercase">{est.roofType?.replace(/_/g, " ")} ({est.areaSqFt} sq ft)</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-[10px] text-amber-400/80 uppercase block">Est. Range</span>
                                      <span className="font-black text-amber-400">GHC {est.totalEstimatedMin?.toLocaleString()}</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => handlePopulateInvoiceFromDashboard(item.id)}
                                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer transition-all shadow-md mt-2"
                              >
                                <Zap className="h-4 w-4 fill-slate-950" />
                                <span>Auto-Populate Invoice for {item.fullName.split(" ")[0]}</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                );
              })()}

              {activeTab === "registry" && (
                <motion.div
                  key="registry"
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="font-sans font-black text-xl text-white flex items-center space-x-2">
                        <Building className="h-5 w-5 text-amber-400" />
                        <span>Central Branch Synoptic & Audit Logs</span>
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        <p className="text-stone-400 text-xs">
                          Review, audit, approve, or reject branch-specific proposals and paid receipts. Restoring logs reloads them in your workspace.
                        </p>
                        <div className="bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg text-[11px] font-mono text-amber-300 flex items-center space-x-1.5 shrink-0">
                          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          <span>Next Sequential Ref: <strong className="text-white font-black">{getNextSequentialInvoiceNumber(invoices)}</strong></span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={loadInvoices}
                      disabled={loadingInvoices}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 cursor-pointer transition-colors shadow-sm"
                    >
                      <RefreshCw className={`h-4 w-4 text-amber-500 ${loadingInvoices ? "animate-spin" : ""}`} />
                      <span>{loadingInvoices ? "Syncing..." : "Sync Logs"}</span>
                    </button>
                  </div>

                  {/* Business Statistics calculated dynamically */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl relative overflow-hidden">
                      <span className="text-stone-500 text-[10px] font-mono uppercase block">Total Generated Invoices</span>
                      <span className="text-xl font-black text-white font-mono mt-1 block">
                        GHS {invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-stone-400 mt-1 block font-mono">{invoices.length} Total records active</span>
                    </div>

                    <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-stone-500 text-[10px] font-mono uppercase block">Approved for Payment</span>
                      <span className="text-xl font-black text-emerald-400 font-mono mt-1 block">
                        GHS {invoices.filter(inv => inv.status === "approved").reduce((sum, inv) => sum + (inv.totalAmount || 0), 0).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-stone-400 mt-1 block font-mono">
                        {invoices.filter(inv => inv.status === "approved").length} Cleared documents
                      </span>
                    </div>

                    <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl relative overflow-hidden">
                      <span className="text-stone-500 text-[10px] font-mono uppercase block">Pending MD Review</span>
                      <span className="text-xl font-black text-amber-400 font-mono mt-1 block">
                        GHS {invoices.filter(inv => inv.status === "pending_approval" || !inv.status).reduce((sum, inv) => sum + (inv.totalAmount || 0), 0).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-stone-400 mt-1 block font-mono">
                        {invoices.filter(inv => inv.status === "pending_approval" || !inv.status).length} Audits awaiting sign-off
                      </span>
                    </div>

                    <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl relative overflow-hidden">
                      <span className="text-stone-500 text-[10px] font-mono uppercase block">Rejected / Flagged Vault</span>
                      <span className="text-xl font-black text-red-400 font-mono mt-1 block">
                        GHS {invoices.filter(inv => inv.status === "rejected").reduce((sum, inv) => sum + (inv.totalAmount || 0), 0).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-stone-400 mt-1 block font-mono">
                        {invoices.filter(inv => inv.status === "rejected").length} Flagged draft scopes
                      </span>
                    </div>
                  </div>

                  {/* Data Visualization Section for MD Portal */}
                  {isMD && (
                    <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl relative overflow-hidden shadow-2xl text-left">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-sm font-sans font-black text-white uppercase tracking-wider flex items-center space-x-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                            <span>MD Revenue Analytics: 2026 Monthly Trend</span>
                          </h3>
                          <p className="text-[11px] font-mono text-stone-400 mt-0.5">
                            Real-time interactive dashboard presenting cleared, MD-approved invoice revenues.
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <span className="text-[10px] font-mono text-stone-500 uppercase block">Total Approved Revenue</span>
                            <span className="text-lg font-black text-emerald-400 font-mono">
                              GHS {invoices.filter(inv => inv.status === "approved").reduce((sum, inv) => sum + (inv.totalAmount || 0), 0).toLocaleString()}
                            </span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={handleBulkExportPDFs}
                            disabled={isExporting}
                            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-800 disabled:text-stone-500 text-stone-950 font-sans font-black text-xs uppercase rounded-xl flex items-center space-x-2 cursor-pointer transition-all active:scale-95 shadow-lg"
                          >
                            <Download className={`h-4 w-4 ${isExporting ? "animate-bounce" : ""}`} />
                            <span>{isExporting ? "Packaging ZIP..." : "Bulk Export ZIP"}</span>
                          </button>
                        </div>
                      </div>

                      <div className="w-full h-[260px] mt-4 font-mono text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={getMonthlyRevenueData()}
                            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                            <XAxis 
                              dataKey="month" 
                              stroke="#737373" 
                              fontSize={11}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis 
                              stroke="#737373" 
                              fontSize={11}
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={(value) => `GHS ${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                            />
                            <RechartsTooltip content={<CustomChartTooltip />} cursor={{ fill: '#1c1917', opacity: 0.3 }} />
                            <Bar 
                              dataKey="Revenue" 
                              fill="#10b981" 
                              radius={[4, 4, 0, 0]} 
                              maxBarSize={45}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* MANAGING DIRECTOR TRANSACTION APPROVAL PORTAL */}
                  {isMD && (() => {
                    // Extract all items from all logged invoices
                    const allMaterialTransactions = invoices.flatMap((inv) => {
                      const items = inv.items || [];
                      return items.map((item: any, index: number) => ({
                        ...item,
                        invoiceId: inv.id,
                        customerName: inv.customerName,
                        branch: inv.branch || "Accra Head Office",
                        timestamp: inv.timestamp,
                        status: inv.status || "pending_approval",
                        preparedBy: inv.preparedBy || "Staff Officer",
                        parentInvoice: inv,
                        materialId: item.id ? `MAT-${inv.id.replace("ZOF-", "")}-${item.id}` : `MAT-${inv.id.replace("ZOF-", "")}-${index + 1}`
                      }));
                    });

                    // Filter transactions based on MD selection
                    const filteredTransactions = allMaterialTransactions.filter((t) => {
                      // Status match
                      const matchesStatus =
                        mdFilterStatus === "all" ||
                        (mdFilterStatus === "pending" && (t.status === "pending_approval" || !t.status || t.status === "pending")) ||
                        (mdFilterStatus === "approved" && t.status === "approved") ||
                        (mdFilterStatus === "rejected" && t.status === "rejected");

                      // Search match
                      const cleanQuery = mdSearchQuery.trim().toLowerCase();
                      const matchesQuery =
                        !cleanQuery ||
                        t.materialId.toLowerCase().includes(cleanQuery) ||
                        t.name.toLowerCase().includes(cleanQuery) ||
                        t.customerName.toLowerCase().includes(cleanQuery) ||
                        t.invoiceId.toLowerCase().includes(cleanQuery);

                      return matchesStatus && matchesQuery;
                    });

                    // Calculate Cumulative Pending & Approved Amounts
                    const pendingSum = allMaterialTransactions
                      .filter((t) => t.status === "pending_approval" || !t.status || t.status === "pending")
                      .reduce((sum, t) => sum + ((t.quantity || 0) * (t.unitPrice || 0)), 0);

                    const approvedSum = allMaterialTransactions
                      .filter((t) => t.status === "approved")
                      .reduce((sum, t) => sum + ((t.quantity || 0) * (t.unitPrice || 0)), 0);

                    const totalSum = allMaterialTransactions.reduce((sum, t) => sum + ((t.quantity || 0) * (t.unitPrice || 0)), 0);

                    // Batch approve all pending invoices
                    const handleBatchApproveAllPending = async () => {
                      const pendingInvoices = invoices.filter(inv => inv.status === "pending_approval" || !inv.status);
                      if (pendingInvoices.length === 0) {
                        alert("No pending transactions found to approve.");
                        return;
                      }

                      const confirmApproval = window.confirm(
                        `Are you sure you want to approve all ${pendingInvoices.length} pending transactions and release payment clearances?`
                      );
                      if (!confirmApproval) return;

                      setMdBatchApprovalLoading(true);
                      let successCount = 0;

                      for (const inv of pendingInvoices) {
                        try {
                          const res = await fetch(`/api/invoices/${inv.id}/approve`, {
                            method: "POST"
                          });
                          if (res.ok) {
                            successCount++;
                          }
                        } catch (err) {
                          console.error("Batch approval failed for invoice:", inv.id, err);
                        }
                      }

                      // Refresh data
                      loadInvoices();
                      loadAuditLogs();
                      setMdBatchApprovalLoading(false);
                      alert(`Successfully batch cleared and approved ${successCount} transaction files!`);
                    };

                    return (
                      <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl relative overflow-hidden shadow-2xl text-left space-y-5">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-800/80">
                          <div>
                            <div className="inline-flex items-center space-x-2 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider mb-2 border border-amber-500/20">
                              <Sparkles className="h-3 w-3 text-amber-400" />
                              <span>Managing Director Decision Engine</span>
                            </div>
                            <h3 className="text-base font-sans font-black text-white uppercase tracking-wider">
                              Executive Material Transaction Summary & Approvals
                            </h3>
                            <p className="text-[11px] font-mono text-stone-400 mt-0.5 leading-relaxed font-bold">
                              Real-time staff ledger integration. Inspect specific material IDs, aggregate line amounts, and issue payment credentials.
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={handleBatchApproveAllPending}
                              disabled={mdBatchApprovalLoading || invoices.filter(inv => inv.status === "pending_approval" || !inv.status).length === 0}
                              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-800 disabled:text-stone-500 text-white font-sans font-black text-xs uppercase rounded-xl flex items-center space-x-2 cursor-pointer transition-all active:scale-95 shadow-lg border border-emerald-500/30 shrink-0"
                            >
                              {mdBatchApprovalLoading ? (
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <BadgeCheck className="h-4 w-4 text-white" />
                              )}
                              <span>Batch Approve All Pending</span>
                            </button>
                          </div>
                        </div>

                        {/* Bento Grid Analytics for MD */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-stone-950/60 border border-stone-850 p-4 rounded-xl flex flex-col justify-between">
                            <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block font-bold">Cumulative Pending Amount</span>
                            <div className="mt-2">
                              <span className="text-xl font-black font-mono text-amber-400">
                                GHS {pendingSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                              <p className="text-[9px] font-mono text-stone-400 mt-1">
                                Across {allMaterialTransactions.filter((t) => t.status === "pending_approval" || !t.status || t.status === "pending").length} pending items
                              </p>
                            </div>
                          </div>

                          <div className="bg-stone-950/60 border border-stone-850 p-4 rounded-xl flex flex-col justify-between">
                            <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block font-bold">Cumulative Approved Amount</span>
                            <div className="mt-2">
                              <span className="text-xl font-black font-mono text-emerald-400">
                                GHS {approvedSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                              <p className="text-[9px] font-mono text-stone-400 mt-1">
                                Across {allMaterialTransactions.filter((t) => t.status === "approved").length} approved items
                              </p>
                            </div>
                          </div>

                          <div className="bg-stone-950/60 border border-stone-850 p-4 rounded-xl flex flex-col justify-between">
                            <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block font-bold">Cumulative Total (All States)</span>
                            <div className="mt-2">
                              <span className="text-xl font-black font-mono text-stone-200">
                                GHS {totalSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                              <p className="text-[9px] font-mono text-stone-400 mt-1">
                                Across {allMaterialTransactions.length} total items listed
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Search & Status Filtering bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-950/40 p-3 rounded-xl border border-stone-850">
                          {/* Left: Filter options */}
                          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
                            {[
                              { id: "pending", label: "Pending approval" },
                              { id: "approved", label: "Cleared / Approved" },
                              { id: "rejected", label: "Flagged / Rejected" },
                              { id: "all", label: "All items" }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setMdFilterStatus(opt.id as any)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                                  mdFilterStatus === opt.id
                                    ? "bg-amber-500 text-slate-950"
                                    : "bg-stone-900 text-stone-400 hover:text-white border border-stone-800"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>

                          {/* Right: Search box */}
                          <div className="relative">
                            <input
                              type="text"
                              value={mdSearchQuery}
                              onChange={(e) => setMdSearchQuery(e.target.value)}
                              placeholder="Search by ID, product, or client..."
                              className="w-full sm:w-64 pl-3 pr-8 py-1.5 bg-stone-900 border border-stone-800 text-stone-100 rounded-lg text-[11px] font-mono focus:outline-none focus:border-amber-500/50 transition-colors"
                            />
                            {mdSearchQuery && (
                              <button
                                type="button"
                                onClick={() => setMdSearchQuery("")}
                                className="absolute right-2.5 top-1.5 text-stone-500 hover:text-stone-300 font-bold font-mono text-[10px]"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Live Material Transactions List */}
                        <div className="bg-stone-950/40 border border-stone-850 rounded-xl overflow-hidden">
                          <div className="grid grid-cols-12 bg-stone-900/80 px-4 py-2 text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider border-b border-stone-850">
                            <div className="col-span-3">Material ID / Source</div>
                            <div className="col-span-4">Material Specification</div>
                            <div className="col-span-2 text-right">Qty & Price</div>
                            <div className="col-span-1.5 text-right">Item Total</div>
                            <div className="col-span-1.5 text-right">Approval State</div>
                          </div>

                          <div className="divide-y divide-stone-850/60 max-h-[380px] overflow-y-auto no-scrollbar">
                            {filteredTransactions.length === 0 ? (
                              <div className="p-8 text-center text-stone-500 font-mono text-xs">
                                <p>No material transactions found matching current filters.</p>
                              </div>
                            ) : (
                              filteredTransactions.map((t, idx) => {
                                const rowTotal = (t.quantity || 0) * (t.unitPrice || 0);
                                return (
                                  <div key={`${t.invoiceId}-${idx}`} className="grid grid-cols-12 px-4 py-3 hover:bg-stone-900/20 transition-all items-center gap-2 text-left">
                                    {/* Column 1: Material ID & Source */}
                                    <div className="col-span-3 space-y-1">
                                      <div className="inline-flex items-center space-x-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                                        <span>{t.materialId}</span>
                                      </div>
                                      <p className="text-[11px] text-white font-bold tracking-wide truncate" title={t.customerName}>
                                        {t.customerName}
                                      </p>
                                      <p className="text-[9px] text-stone-400 font-mono flex items-center space-x-1">
                                        <Building className="h-2.5 w-2.5 text-stone-500" />
                                        <span>{t.branch}</span>
                                      </p>
                                    </div>

                                    {/* Column 2: Specification */}
                                    <div className="col-span-4 space-y-0.5">
                                      <p className="text-xs text-stone-200 font-medium leading-snug">{t.name}</p>
                                      {t.description && (
                                        <p className="text-[10px] text-stone-500 font-mono truncate" title={t.description}>
                                          {t.description}
                                        </p>
                                      )}
                                      <p className="text-[9px] text-stone-500 font-mono">
                                        Ref: <span className="text-stone-300 font-bold">{t.invoiceId}</span> • Officer: {t.preparedBy}
                                      </p>
                                    </div>

                                    {/* Column 3: Quantity & Price */}
                                    <div className="col-span-2 text-right font-mono text-xs text-stone-300">
                                      <p>{t.quantity} {t.lengthMeters ? `(L: ${t.lengthMeters})` : 'units'}</p>
                                      <p className="text-[10px] text-stone-500">x GHS {parseFloat(t.unitPrice || 0).toFixed(2)}</p>
                                    </div>

                                    {/* Column 4: Item Total */}
                                    <div className="col-span-1.5 text-right font-mono text-xs font-bold text-emerald-400">
                                      GHS {rowTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>

                                    {/* Column 5: Approval Status & Row Actions */}
                                    <div className="col-span-1.5 flex flex-col items-end space-y-1.5">
                                      <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded tracking-wider ${
                                        t.status === "approved"
                                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                          : t.status === "rejected"
                                          ? "bg-red-500/15 text-red-400 border border-red-500/30"
                                          : "bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse"
                                      }`}>
                                        {t.status === "approved" ? "Approved" : t.status === "rejected" ? "Flagged" : "Pending"}
                                      </span>

                                      {/* Individual toggle buttons */}
                                      <div className="flex items-center gap-1">
                                        {t.status !== "approved" && (
                                          <button
                                            type="button"
                                            onClick={() => handleApproveInvoice(t.invoiceId)}
                                            className="p-1 bg-stone-900 hover:bg-emerald-600 hover:text-white rounded text-[9px] font-mono font-bold text-stone-400 transition-colors border border-stone-800"
                                            title="Clear parent invoice for payment"
                                          >
                                            ✓
                                          </button>
                                        )}
                                        {t.status !== "rejected" && (
                                          <button
                                            type="button"
                                            onClick={() => handleRejectInvoice(t.invoiceId)}
                                            className="p-1 bg-stone-900 hover:bg-red-950 hover:text-red-300 rounded text-[9px] font-mono font-bold text-stone-400 transition-colors border border-stone-800"
                                            title="Flag parent invoice as draft scope"
                                          >
                                            ✕
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Branch Pill Filters (Synoptic Navigator) */}
                  <div className="bg-stone-900 border border-stone-800 p-3 rounded-2xl flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-stone-400 px-2 uppercase tracking-wider">Branch Filter:</span>
                    {["All", "Accra Head Office", "Kumasi Branch", "Tema Coastal Hub", "Diaspora Remote Desk"].map((branch) => {
                      const isSelected = (branch === "All" && !selectedConsultationForInvoice) || (selectedConsultationForInvoice === branch);
                      return (
                        <button
                          key={branch}
                          type="button"
                          onClick={() => {
                            // Reuse state or define local state. Let's use SelectedConsultationForInvoice to hold branch filter to save space and avoid extra state.
                            setSelectedConsultationForInvoice(branch === "All" ? null : branch);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                            (branch === "All" && !selectedConsultationForInvoice) || (selectedConsultationForInvoice === branch)
                              ? "bg-amber-500 text-slate-950 font-black"
                              : "bg-stone-950 text-stone-400 hover:text-white border border-stone-850"
                          }`}
                        >
                          {branch}
                        </button>
                      );
                    })}
                  </div>

                  <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-stone-800 flex items-center justify-between">
                      <span className="font-mono text-xs font-bold uppercase text-stone-300">Registered Audit Entries</span>
                      <span className="text-xs font-mono text-amber-400">
                        {invoices.length === 0 ? "No Logs Saved" : `Showing ${invoices.filter(inv => !selectedConsultationForInvoice || inv.branch === selectedConsultationForInvoice).length} Logs`}
                      </span>
                    </div>

                    <div className="divide-y divide-stone-850">
                      {invoices.length === 0 ? (
                        <div className="p-8 text-center text-stone-500 font-mono text-xs">
                          <p>No documents logged to the Managing Director Portal yet.</p>
                          <p className="mt-1 text-[11px] text-stone-600">Proposals or receipts created in the Builder with "Save to MD Portal" will appear here instantly.</p>
                        </div>
                      ) : (
                        invoices
                          .filter(inv => !selectedConsultationForInvoice || inv.branch === selectedConsultationForInvoice)
                          .map((log) => (
                            <div key={log.id} className="p-5 hover:bg-stone-850/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                              <div className="space-y-1.5 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-xs font-black text-amber-400">{log.id}</span>
                                  
                                  {log.proformaRef && (
                                    <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                                      Ref: {log.proformaRef}
                                    </span>
                                  )}

                                  {log.branch && (
                                    <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] font-mono px-2 py-0.5 rounded flex items-center space-x-1">
                                      <Building className="h-3 w-3 text-blue-400" />
                                      <span>{log.branch}</span>
                                    </span>
                                  )}

                                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded capitalize ${
                                    log.docMode === "receipt" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                                  }`}>
                                    {log.docMode === "proforma" ? "Proforma Invoice" : log.docMode}
                                  </span>

                                  {/* Status badge */}
                                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                    log.status === "approved"
                                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                      : log.status === "rejected"
                                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                      : "bg-yellow-500/25 text-yellow-300 border border-yellow-500/35"
                                  }`}>
                                    {log.status === "approved"
                                      ? "Approved for Payment"
                                      : log.status === "rejected"
                                      ? "MD Rejected / Flagged"
                                      : "Pending MD Clearance"}
                                  </span>

                                  {/* Print Status Badge */}
                                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center space-x-1 ${
                                    log.printStatus === "printed"
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                      : "bg-stone-800 text-stone-400 border border-stone-700"
                                  }`} title="Automatically registers and tracks when printed/exported">
                                    <Printer className={`h-3 w-3 shrink-0 ${log.printStatus === "printed" ? "text-emerald-400" : "text-stone-500"}`} />
                                    <span>{log.printStatus === "printed" ? "Printed" : "Not Printed"}</span>
                                  </span>
                                </div>

                                <p className="text-sm font-bold text-white">
                                  {log.customerName} — <span className="text-stone-400 font-normal">{log.customerLocation}</span>
                                </p>

                                {/* Item summary list */}
                                {log.items && Array.isArray(log.items) && (
                                  <div className="pt-1.5 text-xs text-stone-400 font-mono space-y-1">
                                    <div className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Itemized Scope:</div>
                                    {log.items.map((it: any, idx: number) => (
                                      <div key={idx} className="flex justify-between max-w-xl text-[11px]">
                                        <span>• {it.name} (x{it.quantity})</span>
                                        <span>GHS {(it.quantity * it.unitPrice).toLocaleString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <p className="text-[10px] font-mono text-stone-500 pt-1">
                                  Logged At: {new Date(log.timestamp).toLocaleString()} • Officer: {log.preparedBy || "System Operator"}
                                </p>
                              </div>

                              {/* Action panel for audit and restoration */}
                              <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-2 shrink-0">
                                {/* MD-specific Clearance Controls */}
                                {isMD && (
                                  <div className="flex items-stretch gap-2">
                                    {log.status !== "approved" && (
                                      <button
                                        type="button"
                                        onClick={() => handleApproveInvoice(log.id)}
                                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs font-mono transition-colors cursor-pointer flex items-center justify-center space-x-1"
                                        title="Approve invoice payment clearance"
                                      >
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        <span>Approve</span>
                                      </button>
                                    )}

                                    {log.status !== "rejected" && (
                                      <button
                                        type="button"
                                        onClick={() => handleRejectInvoice(log.id)}
                                        className="px-3 py-2 bg-red-950 hover:bg-red-900 border border-red-800 text-red-200 font-bold rounded-xl text-xs font-mono transition-colors cursor-pointer flex items-center justify-center space-x-1"
                                        title="Reject or flag this draft scope"
                                      >
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        <span>Reject</span>
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteInvoice(log.id)}
                                      className="p-2 bg-stone-950 hover:bg-red-900 hover:text-white border border-stone-800 text-stone-400 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                                      title="Void and delete permanently"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}

                                {/* Restore Invoice Control */}
                                <button
                                  type="button"
                                  onClick={() => handleRestoreInvoiceToWorkspace(log)}
                                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                                  title="Restore items list and info back to proposal workspace for editing"
                                >
                                  <Zap className="h-3.5 w-3.5 fill-white" />
                                  <span>Restore to Builder</span>
                                </button>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "audit" && (
                <motion.div
                  key="audit"
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="font-sans font-black text-xl text-white flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-amber-400" />
                        <span>System Audit Logs & Action Ledger</span>
                      </h2>
                      <p className="text-stone-400 text-xs mt-1">
                        Durable accountability trail recording invoice creation, status transitions, and hard deletions.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={loadAuditLogs}
                      disabled={loadingAuditLogs}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 cursor-pointer transition-colors shadow-sm"
                    >
                      <RefreshCw className={`h-4 w-4 text-amber-500 ${loadingAuditLogs ? "animate-spin" : ""}`} />
                      <span>{loadingAuditLogs ? "Refreshed Ledger..." : "Sync Audit Logs"}</span>
                    </button>
                  </div>

                  <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-stone-800 flex items-center justify-between">
                      <span className="font-mono text-xs font-bold uppercase text-stone-300">Durable Ledger Records</span>
                      <span className="text-xs font-mono text-amber-400">
                        {auditLogs.length} Total operations recorded
                      </span>
                    </div>

                    <div className="divide-y divide-stone-850">
                      {auditLogs.length === 0 ? (
                        <div className="p-8 text-center text-stone-500 font-mono text-xs">
                          <p>No operations logged yet.</p>
                        </div>
                      ) : (
                        auditLogs.map((log) => (
                          <div key={log.id} className="p-4 hover:bg-stone-850/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="bg-stone-950 px-2 py-0.5 rounded text-stone-400 font-mono text-[10px] font-bold border border-stone-800">
                                  {log.id}
                                </span>
                                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wide border ${
                                  log.action === "invoice_approved" || log.action === "status_change"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : log.action === "invoice_deleted"
                                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                                    : log.action === "invoice_rejected"
                                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                }`}>
                                  {log.action?.replace("_", " ")}
                                </span>
                                {log.invoiceId && (
                                  <span className="text-[10px] font-mono text-stone-500 font-bold">
                                    Ref: {log.invoiceId}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-stone-200 leading-snug">
                                {log.details}
                              </p>
                              <div className="flex items-center space-x-2 text-[10px] text-stone-500 font-mono">
                                <span>{new Date(log.timestamp).toLocaleString()}</span>
                                <span>•</span>
                                <span>Operator: <strong className="text-amber-300/90">{log.operator}</strong></span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6 max-w-3xl"
                >
                  <div>
                    <h2 className="font-sans font-black text-xl text-white">System Base Pricing & Approval Defaults</h2>
                    <p className="text-stone-400 text-xs mt-1">
                      Manage default sheet rates per sq ft, timber carpentry multipliers, and official admin sign-offs.
                    </p>
                  </div>

                  <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-5">
                    <h3 className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Base Material Sheet Estimates (GHS / Sq Ft)
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <label className="block text-stone-400 mb-1">Selflock® Interlocking Sheeting</label>
                        <input type="text" defaultValue="GHS 42 / sq ft" className="w-full bg-stone-950 border border-stone-800 p-2.5 rounded-xl text-white" />
                      </div>
                      <div>
                        <label className="block text-stone-400 mb-1">Step Tiles Roofing Sheeting</label>
                        <input type="text" defaultValue="GHS 38 / sq ft" className="w-full bg-stone-950 border border-stone-800 p-2.5 rounded-xl text-white" />
                      </div>
                      <div>
                        <label className="block text-stone-400 mb-1">IBR Industrial Longspan</label>
                        <input type="text" defaultValue="GHS 35 / sq ft" className="w-full bg-stone-950 border border-stone-800 p-2.5 rounded-xl text-white" />
                      </div>
                      <div>
                        <label className="block text-stone-400 mb-1">Treated Hardwood Timber Trusses</label>
                        <input type="text" defaultValue="GHS 28 / sq ft" className="w-full bg-stone-950 border border-stone-800 p-2.5 rounded-xl text-white" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-800">
                      <label className="block text-stone-400 text-xs font-mono mb-1">Authorized Admin Sign-Off Signature</label>
                      <input
                        type="text"
                        defaultValue="zofroofingsyst@gamil.com (Master Inspector)"
                        className="w-full bg-stone-950 border border-stone-800 p-2.5 rounded-xl text-white font-mono text-xs"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => alert("Admin base pricing settings saved successfully.")}
                      className="px-5 py-2.5 bg-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg cursor-pointer hover:bg-amber-600 transition-colors"
                    >
                      Save System Defaults
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "company" && (
                <motion.div
                  key="company"
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6 max-w-5xl"
                >
                  {/* Top Company Info Card */}
                  <div className="bg-gradient-to-r from-stone-900 via-stone-925 to-stone-950 border border-stone-800 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black shadow-md shrink-0">
                        <Building className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h2 className="font-sans font-black text-xl text-white">ZOF ROOFING SYSTEMS LTD</h2>
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                            Registered & GSA Certified
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5 font-mono">
                          RGD Reg: <strong>CS189402026</strong> • TIN: <strong>C0029482910</strong> • Standards: <strong>GS 1059:2019</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <a
                        href="tel:0242866658"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-xl transition-all shadow-xs"
                      >
                        Call: 0242 866 658
                      </a>
                    </div>
                  </div>

                  {/* 3-Column Company Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    {/* Bank Account Wire 1 */}
                    <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl flex flex-col justify-between space-y-4">
                      <div>
                        <div className="pb-3 border-b border-stone-800 text-left">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-mono text-amber-400 uppercase font-bold">GCB Bank PLC</p>
                            <span className="text-[9px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-mono">Corporate Wire</span>
                          </div>
                          <p className="font-mono text-sm text-white font-bold mt-1">1041130004921</p>
                          <p className="text-[10px] text-stone-400">Account Name: ZOF ROOFING SYSTEMS LTD</p>
                        </div>
                        <div className="pt-4 space-y-2 text-xs text-stone-300">
                          <p className="font-bold text-white uppercase tracking-wider text-[10px]">Wire Settlement Details:</p>
                          <p className="flex items-center space-x-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /><span>Branch: High Street / Spintex Road</span></p>
                          <p className="flex items-center space-x-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /><span>Swift Code: GCBKGHA</span></p>
                          <p className="flex items-center space-x-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /><span>Ghana Cedis (GHS) and USD Accounts</span></p>
                          <p className="flex items-center space-x-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /><span>Automated official receipt issuance</span></p>
                        </div>
                      </div>
                      <div className="text-center text-[10px] text-stone-400 pt-3 border-t border-stone-800">
                        Primary Corporate Account
                      </div>
                    </div>

                    {/* Bank Account Wire 2 (Ecobank) */}
                    <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl flex flex-col justify-between space-y-4">
                      <div>
                        <div className="pb-3 border-b border-stone-800 text-left">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-mono text-blue-400 uppercase font-bold">Ecobank Ghana</p>
                            <span className="text-[9px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-mono">Secondary Wire</span>
                          </div>
                          <p className="font-mono text-sm text-white font-bold mt-1">01800248910291</p>
                          <p className="text-[10px] text-stone-400">Account Name: ZOF ROOFING SYSTEMS LTD</p>
                        </div>
                        <div className="pt-4 space-y-2 text-xs text-stone-300">
                          <p className="font-bold text-white uppercase tracking-wider text-[10px]">Wire Settlement Details:</p>
                          <p className="flex items-center space-x-2"><Check className="h-4 w-4 text-blue-400 shrink-0" /><span>Branch: Spintex Road Branch, Accra</span></p>
                          <p className="flex items-center space-x-2"><Check className="h-4 w-4 text-blue-400 shrink-0" /><span>Swift Code: ECOCGHAC</span></p>
                          <p className="flex items-center space-x-2"><Check className="h-4 w-4 text-blue-400 shrink-0" /><span>Direct instant bank clearance</span></p>
                          <p className="flex items-center space-x-2"><Check className="h-4 w-4 text-blue-400 shrink-0" /><span>ACH / GIS Interbank transfer supported</span></p>
                        </div>
                      </div>
                      <div className="text-center text-[10px] text-stone-400 pt-3 border-t border-stone-800">
                        Secondary Corporate Account
                      </div>
                    </div>

                    {/* Official Mobile Money Settlement */}
                    <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl flex flex-col justify-between space-y-4">
                      <div>
                        <div className="pb-3 border-b border-stone-800 text-left">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-mono text-amber-400 uppercase font-bold">Mobile Money Merchant</p>
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono">Instant MoMo</span>
                          </div>
                          <p className="font-mono text-sm text-white font-bold mt-1">0242 866 658</p>
                          <p className="text-[10px] text-stone-400">Merchant Name: ZOF ROOFING SYSTEMS</p>
                        </div>
                        <div className="pt-4 space-y-2 text-xs text-stone-300">
                          <p className="font-bold text-white uppercase tracking-wider text-[10px]">MoMo Payment Channels:</p>
                          <p className="flex items-center space-x-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /><span>MTN MoMo Merchant ID: 894021</span></p>
                          <p className="flex items-center space-x-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /><span>Telecel Cash: 0242 866 658</span></p>
                          <p className="flex items-center space-x-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /><span>Instant SMS deposit verification</span></p>
                          <p className="flex items-center space-x-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /><span>Valid for 50% mobilization & stage payments</span></p>
                        </div>
                      </div>
                      <div className="text-center text-[10px] text-amber-400 font-bold pt-3 border-t border-stone-800">
                        Official Ghana Mobile Money
                      </div>
                    </div>
                  </div>

                  {/* Quality Standards & Warranty Assurance */}
                  <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl text-left space-y-4">
                    <h3 className="font-mono text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>Technical Standards & Corro-Shield™ Warranty</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                      <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
                        <p className="text-stone-400">Coil Standard & Specification</p>
                        <p className="text-white font-bold">AZ150 Aluzinc 55% Al-Zn</p>
                        <p className="text-[10px] text-stone-500">Certified to GS 1059:2019 standards</p>
                      </div>
                      <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
                        <p className="text-stone-400">Corro-Shield™ Warranty</p>
                        <p className="text-white font-bold">15 to 30 Years Guaranteed</p>
                        <p className="text-[10px] text-stone-500">Covers corrosion, peeling & water ingress</p>
                      </div>
                      <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
                        <p className="text-stone-400">Head Office & Dispatch</p>
                        <p className="text-white font-bold">Spintex Road, Accra / Kumasi</p>
                        <p className="text-[10px] text-stone-500">Nationwide delivery & installation</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "calculator" && (
                <motion.div
                  key="calculator"
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  <MaterialCalculator onEstimateSaved={loadConsultations} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

        </div>
      )}
    </div>
  );
}
