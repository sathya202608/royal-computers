import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { DashboardView } from "./views/DashboardView";
import { TodayReportView } from "./views/TodayReportView";
import { BillingView } from "./views/BillingView";
import { StockView } from "./views/StockView";
import { PricesView } from "./views/PricesView";
import { EmployeesView } from "./views/EmployeesView";
import { CustomersView } from "./views/CustomersView";
import { ReportsView } from "./views/ReportsView";
import { OwnerProfileView } from "./views/OwnerProfileView";

export function DashboardLayout({ onLogout }) {
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Render view based on active section
  const renderView = () => {
    switch (currentSection) {
      case "dashboard":
        return (
          <DashboardView
            onNavigateToBilling={() => setCurrentSection("billing")}
            onNavigateToStock={() => setCurrentSection("stock")}
            onNavigateToReport={() => setCurrentSection("today-report")}
          />
        );
      case "today-report":
        return <TodayReportView />;
      case "billing":
        return <BillingView />;
      case "stock":
        return <StockView />;
      case "prices":
        return <PricesView />;
      case "employees":
        return <EmployeesView />;
      case "customers":
        return <CustomersView />;
      case "reports":
        return <ReportsView />;
      case "owner-profile":
        return <OwnerProfileView />;
      default:
        return <DashboardView onNavigateToBilling={() => setCurrentSection("billing")} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#121417] text-white flex">
      {/* Left Sidebar */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area (offset by sidebar width 72 = 18rem on lg screens) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-300">
        {/* Top Navigation Bar */}
        <TopNav
          currentSection={currentSection}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
          onQuickNewBill={() => setCurrentSection("billing")}
          onLogout={onLogout}
        />

        {/* Page Main View Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {renderView()}
        </main>

        {/* Global Footer */}
        <footer className="py-6 px-8 border-t border-[#2B2F36] text-center text-xs text-[#9CA3AF] bg-[#121417]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#EAB308]"></span>
              Royal Computers Xerox Shop Management System &bull; Version 2.6
            </span>
            <span>
              &copy; {new Date().getFullYear()} Royal Computers. All rights reserved.
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
