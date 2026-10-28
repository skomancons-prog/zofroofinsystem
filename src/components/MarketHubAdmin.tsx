import React, { useState } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Bell,
  ArrowUpRight,
  Filter,
  Download,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  FileText,
  Key,
  Globe,
  Truck,
  CreditCard,
  BarChart3,
  UserCog,
  History,
  Settings as SettingsIcon,
  BadgeCheck
} from "lucide-react";

// Mock data for rich realistic dashboard
const kpiStats = [
  {
    title: "Gross Merchandise Value",
    value: "GHS 482,900",
    change: "+14.8%",
    isPositive: true,
    sub: "vs. last month",
    icon: DollarSign,
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Active Orders",
    value: "384",
    change: "+6.2%",
    isPositive: true,
    sub: "12 pending fulfillment",
    icon: ShoppingCart,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Verified Sellers",
    value: "1,240",
    change: "+28 new",
    isPositive: true,
    sub: "3 awaiting KYC approval",
    icon: Users,
    color: "bg-violet-50 text-violet-700",
  },
  {
    title: "Products & Listings",
    value: "8,950",
    change: "-1.2%",
    isPositive: false,
    sub: "34 low inventory alerts",
    icon: Package,
    color: "bg-amber-50 text-amber-700",
  },
];

const recentOrders = [
  { id: "ORD-9481", customer: "Kwame Mensah", seller: "Accra Steel & Metal Works", amount: "GHS 14,250", status: "Delivered", date: "Today, 11:20 AM" },
  { id: "ORD-9480", customer: "Abena Osei", seller: "GoldCoast Truss Systems", amount: "GHS 28,400", status: "Processing", date: "Today, 09:45 AM" },
  { id: "ORD-9479", customer: "Kofi Boateng", seller: "Tema Roofing Co.", amount: "GHS 6,800", status: "In Transit", date: "Yesterday, 04:15 PM" },
  { id: "ORD-9478", customer: "Esi Darkwah", seller: "Volt Timber Supply", amount: "GHS 19,500", status: "Delivered", date: "Yesterday, 02:30 PM" },
  { id: "ORD-9477", customer: "Yaw Frimpong", seller: "Kumasi Zinc Masters", amount: "GHS 8,120", status: "Pending Payment", date: "Oct 26, 2026" },
];

const pendingKyc = [
  { id: "KYC-302", business: "Sunyani Truss & Timber Ltd", owner: "Emmanuel Addo", regNumber: "BN-2024-8841", submissionDate: "Oct 27, 2026", status: "Under Review" },
  { id: "KYC-301", business: "Cape Coast Aluminum Hub", owner: "Dorothy Quaye", regNumber: "CS-2023-1190", submissionDate: "Oct 26, 2026", status: "Documents Attached" },
  { id: "KYC-300", business: "Kasoa Sheet Supplies", owner: "Samuel Antwi", regNumber: "BN-2025-4472", submissionDate: "Oct 25, 2026", status: "Identity Verified" },
];

function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white shadow-lg shadow-blue-700/10">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-blue-100">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Marketplace Operations Active
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">MarketHub Admin Central Console</h2>
          <p className="mt-1 text-sm text-blue-100 max-w-xl">
            Real-time management for marketplace orders, verified merchant KYC compliance, financial settlement, and catalog listings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/kyc"
            className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-blue-800 shadow-sm hover:bg-blue-50 transition-colors"
          >
            Review Pending KYC ({pendingKyc.length})
          </Link>
          <Link
            to="/admin/orders"
            className="rounded-xl bg-blue-600/60 border border-white/20 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-600 transition-colors"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.title}</span>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                  <span
                    className={`inline-flex items-center font-semibold ${
                      stat.isPositive ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {stat.isPositive ? <TrendingUp size={14} className="mr-0.5" /> : <TrendingDown size={14} className="mr-0.5" />}
                    {stat.change}
                  </span>
                  <span className="text-slate-400">{stat.sub}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Recent Orders & KYC Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Recent Transactions & Orders</h3>
              <p className="text-xs text-slate-500">Latest completed and active marketplace orders</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              View all orders <ChevronRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Merchant / Seller</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-medium text-blue-700">{order.id}</td>
                    <td className="px-6 py-3.5 font-medium text-slate-900">{order.customer}</td>
                    <td className="px-6 py-3.5 text-slate-600">{order.seller}</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-900">{order.amount}</td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          order.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : order.status === "Processing"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : order.status === "In Transit"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* KYC Queue & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BadgeCheck size={18} className="text-blue-700" />
                <h3 className="font-semibold text-slate-900 text-sm">Seller KYC Queue</h3>
              </div>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
                Action Required
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {pendingKyc.map((kyc) => (
                <div
                  key={kyc.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 text-xs">{kyc.business}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Owner: {kyc.owner}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{kyc.id}</span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                    <span className="text-slate-500">{kyc.submissionDate}</span>
                    <Link
                      to="/admin/kyc"
                      className="font-semibold text-blue-700 hover:text-blue-800"
                    >
                      Verify docs &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick System Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="font-semibold text-slate-900 text-sm mb-3">System Health & Security</h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  API Gateway & Webhooks
                </span>
                <span className="font-medium text-emerald-600">99.98% Healthy</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Payments & Settlement
                </span>
                <span className="font-medium text-slate-900">Live (Hubtel / Mobile Money)</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Audit Logging
                </span>
                <span className="font-medium text-slate-900">Active (SHA256 Encrypted)</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  RBAC Enforcement
                </span>
                <span className="font-medium text-slate-900">Strict Multi-role</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsPage() {
  const products = [
    { id: "PRD-101", title: "Selflock Charcoal Architectural Sheeting", category: "Roofing Sheets", stock: "1,420 m²", price: "GHS 185 / m²", seller: "ZOF Group Certified" },
    { id: "PRD-102", title: "High-Tensile Certified Timber Trusses", category: "Structural Trusses", stock: "68 Units", price: "GHS 4,500 / unit", seller: "GoldCoast Timber" },
    { id: "PRD-103", title: "Corrugated Aluzinc Marine-Coated Sheets", category: "Marine Grade", stock: "2,100 m²", price: "GHS 145 / m²", seller: "Accra Steel & Metal" },
    { id: "PRD-104", title: "Heavy Duty Ridge Caps & Valley Gutters", category: "Accessories", stock: "450 pcs", price: "GHS 65 / pc", seller: "Tema Roofing Co." },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Products & Services Catalog</h2>
          <p className="text-xs text-slate-500">Manage marketplace inventory, seller listings, and certified materials</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-800 shadow-sm cursor-pointer">
          <Plus size={16} />
          Add Product / Service
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by SKU or title..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-blue-600"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-600 hover:bg-slate-50">
            <Filter size={14} /> Filter
          </button>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
            <tr>
              <th className="px-6 py-3">SKU</th>
              <th className="px-6 py-3">Product Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Inventory</th>
              <th className="px-6 py-3">Unit Price</th>
              <th className="px-6 py-3">Verified Merchant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/70">
                <td className="px-6 py-3.5 font-mono text-blue-700 font-semibold">{p.id}</td>
                <td className="px-6 py-3.5 font-semibold text-slate-900">{p.title}</td>
                <td className="px-6 py-3.5 text-slate-600">{p.category}</td>
                <td className="px-6 py-3.5">{p.stock}</td>
                <td className="px-6 py-3.5 font-semibold text-slate-900">{p.price}</td>
                <td className="px-6 py-3.5 text-slate-600">{p.seller}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KycVerificationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Seller KYC Verification Hub</h2>
        <p className="text-xs text-slate-500">
          Review business registration certificates, Ghana Card documents, and compliance records before granting seller privileges.
        </p>
      </div>

      <div className="space-y-4">
        {pendingKyc.map((kyc) => (
          <div key={kyc.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{kyc.business}</h3>
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
                    {kyc.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Owner: <span className="font-medium text-slate-800">{kyc.owner}</span> • Business Reg ID: <span className="font-mono">{kyc.regNumber}</span> • Submitted: {kyc.submissionDate}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  <FileText size={15} /> View Ghana Card & Docs
                </button>
                <button className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
                  <CheckCircle size={15} /> Approve Seller
                </button>
                <button className="flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100">
                  <XCircle size={15} /> Reject
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-[11px] text-slate-400 block font-medium">GRA Tax Identification</span>
                <span className="font-mono font-semibold text-slate-800">TIN-GH-8291039-P</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-[11px] text-slate-400 block font-medium">Bank Settlement Account</span>
                <span className="font-mono font-semibold text-slate-800">GCB Bank •••• 4910</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-[11px] text-slate-400 block font-medium">Warehouse / Yard Address</span>
                <span className="font-semibold text-slate-800">Spintex Rd, Plot 14, Greater Accra</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericSectionPage({ title, description, icon: Icon }: { title: string; description: string; icon: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon size={22} className="text-blue-700" />
            {title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-600 hover:bg-slate-50">
            <Download size={14} /> Export Report
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-700 text-white rounded-xl text-xs font-medium hover:bg-blue-800">
            <Plus size={14} /> New Entry
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 mb-4">
          <Icon size={28} />
        </div>
        <h3 className="font-bold text-slate-900 text-base">{title} Console</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5">
          {description}. Connected to real-time sync with database tables and audit log ledger.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Active Service Connected
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Zero pending error alerts
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MarketHubAdmin() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Redirect to public website or login
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Component */}
      <AdminSidebar
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div
        className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, sellers, SKUs, transactions..."
                className="w-80 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-blue-600 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <ExternalLink size={14} className="text-slate-500" />
              <span>Public Storefront</span>
            </Link>

            <button
              aria-label="Notifications"
              className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600" />
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                AD
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-900 leading-tight">Super Admin</p>
                <p className="text-[11px] text-slate-400">admin@markethub.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route
              path="/users"
              element={
                <GenericSectionPage
                  title="Customers & Sellers"
                  description="Directory of verified buyers, merchant profiles, trade accounts, and ratings."
                  icon={Users}
                />
              }
            />
            <Route path="/kyc" element={<KycVerificationPage />} />
            <Route
              path="/orders"
              element={
                <GenericSectionPage
                  title="Orders & Returns"
                  description="Complete lifecycle tracking of orders, dispatch verification, and customer return authorizations."
                  icon={ShoppingCart}
                />
              }
            />
            <Route
              path="/payments"
              element={
                <GenericSectionPage
                  title="Payments & Transactions"
                  description="Financial settlement, escrow accounts, Hubtel/MTN MoMo reconciliation, and payouts."
                  icon={CreditCard}
                />
              }
            />
            <Route
              path="/shipping"
              element={
                <GenericSectionPage
                  title="Shipping & Delivery"
                  description="Logistics partner integrations, dispatch routes across Greater Accra and all Ghana regions."
                  icon={Truck}
                />
              }
            />
            <Route
              path="/reports"
              element={
                <GenericSectionPage
                  title="Reports & Analytics"
                  description="Deep dive reporting on gross merchandise volume, profit margins, conversion, and regional demand."
                  icon={BarChart3}
                />
              }
            />
            <Route
              path="/security"
              element={
                <GenericSectionPage
                  title="Security & Access Control"
                  description="Session policies, two-factor authentication, IP whitelisting, and perimeter defense."
                  icon={ShieldCheck}
                />
              }
            />
            <Route
              path="/roles"
              element={
                <GenericSectionPage
                  title="Admin Users & Roles"
                  description="Role-based access control (RBAC), permission tiers for Super Admin, KYC Officer, and Finance Staff."
                  icon={UserCog}
                />
              }
            />
            <Route
              path="/audit-logs"
              element={
                <GenericSectionPage
                  title="Audit Logs"
                  description="Tamper-evident system audit trail capturing every privileged action, credential change, and financial clearance."
                  icon={History}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <GenericSectionPage
                  title="Marketplace Settings"
                  description="Global platform parameters, commission rates, currency baseline, and notification channels."
                  icon={SettingsIcon}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
