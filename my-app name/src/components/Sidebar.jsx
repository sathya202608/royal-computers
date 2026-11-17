import React from "react";
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Package,
  Tag,
  Users,
  UserCheck,
  BarChart3,
  User,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { RoyalLogo } from "./RoyalLogo";
import { cn } from "../lib/utils";

export const navigationItems = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    id: "today-report",
    name: "Today's Report",
    icon: FileText,
    badge: "LIVE",
    badgeVariant: "gold",
  },
  {
    id: "billing",
    name: "Billing",
    icon: Receipt,
    badge: "POS",
  },
  {
    id: "stock",
    name: "Stock",
    icon: Package,
    badge: "1 Low",
    badgeVariant: "warning",
  },
  {
    id: "prices",
    name: "Prices",
    icon: Tag,
    badge: null,
  },
  {
    id: "employees",
    name: "Employees",
    icon: Users,
    badge: "2 Active",
  },
  {
    id: "customers",
    name: "Customers",
    icon: UserCheck,
    badge: null,
  },
  {
    id: "reports",
    name: "Reports",
    icon: BarChart3,
    badge: null,
  },
  {
    id: "owner-profile",
    name: "Owner Profile",
    icon: User,
    badge: null,
  },
];

export function Sidebar({ currentSection, onSelectSection, isMobileOpen, setIsMobileOpen }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-[#121417] border-r border-[#2B2F36] transition-transform duration-300 ease-in-out lg:translate-x-0 select-none",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-[#2B2F36] bg-[#16181D]">
          <RoyalLogo />
        </div>

        {/* Quick Shop Status Banner */}
        <div className="px-5 py-3 mx-4 mt-4 mb-2 rounded-lg bg-[#1E2126] border border-[#2B2F36] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EAB308] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EAB308]"></span>
            </span>
            <span className="text-xs font-medium text-white">Printers Online</span>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#EAB308]/15 text-[#EAB308] border border-[#EAB308]/30">
            3 Ready
          </span>
        </div>

        {/* Navigation Section Title */}
        <div className="px-6 pt-3 pb-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
            Main Menu
          </p>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectSection(item.id);
                  if (setIsMobileOpen) setIsMobileOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-[#1E2126] text-white border border-[#EAB308]/60 shadow-gold-glow-subtle font-semibold"
                    : "text-[#9CA3AF] hover:text-white hover:bg-[#1E2126]/70 border border-transparent"
                )}
              >
                {/* Active Indicator Bar on Left */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#EAB308] rounded-r-full shadow-[0_0_8px_#EAB308]" />
                )}

                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      isActive
                        ? "text-[#EAB308] bg-[#EAB308]/15"
                        : "text-[#9CA3AF] group-hover:text-white group-hover:bg-[#2B2F36]"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="tracking-wide">{item.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                        item.badgeVariant === "gold" || isActive
                          ? "bg-[#EAB308]/15 text-[#EAB308] border-[#EAB308]/30"
                          : item.badgeVariant === "warning"
                          ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          : "bg-[#2B2F36] text-[#9CA3AF] border-[#373C45]"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#EAB308]" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Footer: Current Logged-in User Indicator */}
        <div className="p-4 border-t border-[#2B2F36] bg-[#16181D]">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1E2126] border border-[#2B2F36] hover:border-[#EAB308]/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#CA8A04] flex items-center justify-center font-bold text-[#121417] shadow-sm">
                  RC
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#1E2126] rounded-full" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white tracking-wide">
                  Owner - Administrator
                </span>
                <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#EAB308]" />
                  Full Privileges
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
