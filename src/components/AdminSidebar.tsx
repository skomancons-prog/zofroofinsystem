import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  BadgeCheck,
  ShoppingCart,
  CreditCard,
  Truck,
  BarChart3,
  ShieldCheck,
  UserCog,
  History,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Store,
  Lock,
} from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  end?: boolean;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const sections: NavSection[] = [
  {
    title: "MAIN MENU",
    items: [
      { label: "Dashboard overview", path: "/admin", icon: LayoutDashboard, end: true },
      { label: "Products & services", path: "/admin/products", icon: Package },
      { label: "Customers & sellers", path: "/admin/users", icon: Users },
      { label: "Seller KYC verification", path: "/admin/kyc", icon: BadgeCheck, badge: "3" },
      { label: "Orders & returns", path: "/admin/orders", icon: ShoppingCart, badge: "12" },
      { label: "Payments & transactions", path: "/admin/payments", icon: CreditCard },
      { label: "Shipping & delivery", path: "/admin/shipping", icon: Truck },
      { label: "Reports & analytics", path: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    title: "SYSTEM & SECURITY",
    items: [
      { label: "Security & access", path: "/admin/security", icon: ShieldCheck },
      { label: "Admin users & roles", path: "/admin/roles", icon: UserCog },
      { label: "Audit logs", path: "/admin/audit-logs", icon: History },
      { label: "Settings", path: "/admin/settings", icon: Settings },
    ],
  },
];

export interface AdminSidebarProps {
  onLogout?: () => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export default function AdminSidebar({
  onLogout,
  collapsed: externalCollapsed,
  onCollapsedChange,
}: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  // Allow controlled or uncontrolled collapsed state
  const isControlled = externalCollapsed !== undefined;
  const collapsed = isControlled ? externalCollapsed : internalCollapsed;

  const handleToggleCollapse = () => {
    const nextVal = !collapsed;
    if (onCollapsedChange) {
      onCollapsedChange(nextVal);
    }
    if (!isControlled) {
      setInternalCollapsed(nextVal);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
        className="fixed left-4 top-4 z-50 flex items-center justify-center rounded-xl bg-slate-900 p-2.5 text-white shadow-lg transition-transform active:scale-95 lg:hidden"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          aria-label="Close navigation backdrop"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-72"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm shadow-blue-700/25">
            <Store size={22} />
          </div>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h1 className="truncate font-bold text-slate-900 text-base leading-tight">
                  MarketHub Admin
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/80">
                  <Lock size={9} className="text-emerald-600" />
                  Secure
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">Management dashboard</p>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5 scrollbar-thin">
          {sections.map((section) => (
            <div key={section.title}>
              {!collapsed ? (
                <p className="mb-2.5 px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  {section.title}
                </p>
              ) : (
                <div className="mx-auto my-2 h-[1px] w-6 bg-slate-200" />
              )}

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      title={collapsed ? item.label : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150 ${
                          collapsed ? "justify-center" : "justify-between"
                        } ${
                          isActive
                            ? "bg-blue-50 font-semibold text-blue-700 shadow-xs"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`
                      }
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          size={20}
                          className="shrink-0 transition-transform group-hover:scale-105"
                        />
                        {!collapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </div>

                      {!collapsed && item.badge && (
                        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 group-hover:bg-slate-200">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="space-y-1.5 border-t border-slate-200 p-3 bg-slate-50/50">
          <button
            onClick={handleToggleCollapse}
            type="button"
            className="hidden w-full items-center justify-center gap-2 rounded-xl p-2.5 text-sm text-slate-500 hover:bg-slate-200/70 hover:text-slate-800 transition-colors lg:flex cursor-pointer"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span className="text-xs font-medium">Collapse sidebar</span>}
          </button>

          <button
            onClick={onLogout}
            type="button"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? "Sign out" : undefined}
          >
            <LogOut size={19} className="shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
