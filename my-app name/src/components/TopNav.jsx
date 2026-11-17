import React from "react";
import {
  Calendar,
  LogOut,
  Menu,
  Bell,
  PlusCircle,
  ChevronRight,
  Database
} from "lucide-react";
import { Button } from "./ui/button";
import { navigationItems } from "./Sidebar";
import logoImg from "../assets/image.png";
import { useShop } from "../lib/ShopContext";

export function TopNav({
  currentSection,
  onOpenMobileSidebar,
  onQuickNewBill,
  onLogout
}) {
  const { dbConnected } = useShop();
  const currentItem = navigationItems.find((item) => item.id === currentSection) || {
    name: "Dashboard",
  };

  // Format today's date (defaults to nice 25 Sept 2026 or dynamic format)
  const todayFormatted = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 md:px-8 bg-[#121417]/95 backdrop-blur-md border-b border-[#2B2F36]">
      {/* Left: Mobile hamburger + App Image Logo + Breadcrumbs */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-2 text-[#9CA3AF] rounded-lg hover:text-white hover:bg-[#1E2126] lg:hidden transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* App Image on Top Navigation Header Tab */}
        <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-[#1E2126] border border-[#EAB308]/40 shadow-[0_0_12px_rgba(234,179,8,0.15)] hover:border-[#EAB308] transition-all">
          <img
            src={logoImg}
            alt="Royal Computers"
            className="w-7 h-7 object-contain rounded-md drop-shadow-[0_2px_4px_rgba(234,179,8,0.3)]"
          />
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-extrabold tracking-wider text-white uppercase font-sans leading-none">
              ROYAL COMPUTERS
            </span>
            <span className="text-[9px] font-bold text-[#EAB308] tracking-widest uppercase leading-none mt-1">
              XEROX SHOP
            </span>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-[#6B7280] hidden sm:inline" />

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm font-medium">
          <span className="text-white font-semibold flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#EAB308]" />
            {currentItem.name}
          </span>
        </nav>
      </div>

      {/* Right Side: Quick Action + Date Display + Logout Button */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick New Bill CTA in Golden Yellow */}
        <Button
          onClick={onQuickNewBill}
          size="sm"
          className="hidden md:inline-flex items-center gap-2 bg-[#EAB308] hover:bg-[#CA8A04] text-[#121417] font-bold shadow-gold-glow-subtle hover:shadow-gold-glow transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Bill (F2)</span>
        </Button>

        {/* Database Status Pill */}
        <div
          title={dbConnected ? "Connected to MongoDB Atlas Cluster0" : "Offline Cache Mode"}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold tracking-wide transition-all ${
            dbConnected
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
              : "bg-amber-950/40 border-amber-500/30 text-amber-400"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span className={`w-1.5 h-1.5 rounded-full ${dbConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
          <span className="text-[11px] font-bold">{dbConnected ? "MongoDB Atlas" : "Offline Cache"}</span>
        </div>

        {/* Date Display Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1E2126] border border-[#2B2F36] text-xs font-medium text-white shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-[#EAB308]" />
          <span className="text-[#9CA3AF] hidden sm:inline">Today:</span>
          <span className="font-semibold text-white tracking-wide">
            {todayFormatted}
          </span>
        </div>

        {/* Notification Icon */}
        <div className="relative hidden sm:block">
          <button
            title="Notifications"
            className="p-2 text-[#9CA3AF] hover:text-white bg-[#1E2126] hover:bg-[#252930] border border-[#2B2F36] rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EAB308] rounded-full"></span>
          </button>
        </div>

        {/* Logout Button */}
        <Button
          onClick={onLogout}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-[#2B2F36] hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-colors text-xs font-semibold px-3 py-1.5"
        >
          <LogOut className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-red-400" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
}
