import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Clock,
  Wrench
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export function ReportsView() {
  const [selectedPeriod, setSelectedPeriod] = useState("year");

  // Monthly revenue mock data for Royal Computers Xerox Shop
  const monthlyData = [
    { month: "Jan", revenue: 260000, copies: 98000 },
    { month: "Feb", revenue: 290000, copies: 112000 },
    { month: "Mar", revenue: 380000, copies: 145000 }, // Exam season
    { month: "Apr", revenue: 410000, copies: 158000 }, // College project submission
    { month: "May", revenue: 190000, copies: 72000 },  // Vacation
    { month: "Jun", revenue: 320000, copies: 125000 }, // New admissions
    { month: "Jul", revenue: 350000, copies: 135000 },
    { month: "Aug", revenue: 375000, copies: 142000 },
    { month: "Sep", revenue: 360000, copies: 139000 },
    { month: "Oct", revenue: 385400, copies: 149000 }, // Best month
  ];

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  const hourlyTraffic = [
    { hour: "8 AM - 10 AM", intensity: 45, label: "Morning Forms & ID" },
    { hour: "10 AM - 1 PM", intensity: 95, label: "Peak College Projects", peak: true },
    { hour: "1 PM - 3 PM", intensity: 35, label: "Lunch Lull" },
    { hour: "3 PM - 6 PM", intensity: 75, label: "Advocate & Legal" },
    { hour: "6 PM - 9 PM", intensity: 90, label: "Evening Student Rush", peak: true },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-[#1E2126] border border-[#2B2F36]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#EAB308]/15 text-[#EAB308] border border-[#EAB308]/30">
              BUSINESS ANALYTICS
            </span>
            <span className="text-xs text-[#9CA3AF]">Fiscal Year 2026</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#EAB308]" />
            Long-term Revenue & Machine Utilization Reports
          </h1>
          <p className="text-sm text-[#9CA3AF]">
            Track annual growth, seasonal exam peaks, and copier fleet efficiency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-1 rounded-xl bg-[#121417] border border-[#2B2F36]">
            {["year", "month"].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  selectedPeriod === p
                    ? "bg-[#EAB308] text-[#121417]"
                    : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                {p === "year" ? "Full Year" : "Recent Month"}
              </button>
            ))}
          </div>

          <Button
            onClick={() => window.print()}
            variant="outline"
            className="border-[#2B2F36] hover:border-[#EAB308] text-white"
          >
            <Download className="w-4 h-4 mr-2 text-[#EAB308]" />
            Export Audit Report
          </Button>
        </div>
      </div>

      {/* Top Annual Performance Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="border-[#EAB308]/50 shadow-gold-glow-subtle">
          <CardHeader className="pb-2">
            <span className="text-xs text-[#9CA3AF] uppercase font-semibold">
              1-Year Total Revenue
            </span>
          </CardHeader>
          <CardContent>
            {/* Primary Accent Golden Yellow */}
            <div className="text-3xl font-extrabold text-[#EAB308]">
              ₹ 33,20,400
            </div>
            <p className="text-xs text-emerald-400 mt-1 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +22.4% vs Previous Fiscal Year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs text-[#9CA3AF] uppercase font-semibold">
              Best Performing Month
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">
              April 2026
            </div>
            <p className="text-xs text-[#EAB308] mt-1 font-semibold">
              ₹ 4,10,000 (Final Semester Project Submissions)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs text-[#9CA3AF] uppercase font-semibold">
              Total Photocopies Generated
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">
              1,275,000
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1">
              980k B/W • 295k Color Prints
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Bar Chart Visualization */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white text-base">
              Monthly Revenue Performance (2026)
            </CardTitle>
            <CardDescription>
              Seasonal peaks coincide with March-April university semester submissions
            </CardDescription>
          </div>
          <Badge variant="default" className="text-xs">
            10 Months Tracked
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="pt-6 pb-2">
            <div className="flex items-end justify-between gap-2 sm:gap-4 h-64 border-b border-[#2B2F36] pb-2">
              {monthlyData.map((d, i) => {
                const heightPercent = Math.round((d.revenue / maxRevenue) * 100);
                const isCurrent = d.month === "Oct";

                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative"
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[#121417] border border-[#EAB308] text-white text-[10px] py-1 px-2 rounded pointer-events-none z-10 whitespace-nowrap shadow-lg">
                      <p className="font-bold text-[#EAB308]">
                        ₹ {(d.revenue / 1000).toFixed(0)}k
                      </p>
                      <p className="text-[#9CA3AF]">{d.copies.toLocaleString()} copies</p>
                    </div>

                    {/* Bar */}
                    <div
                      className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 group-hover:opacity-90 ${
                        isCurrent
                          ? "bg-gradient-to-t from-[#CA8A04] to-[#EAB308] shadow-gold-glow-subtle"
                          : "bg-[#2B2F36] hover:bg-[#3A3F49]"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span
                      className={`text-[11px] mt-2 font-semibold ${
                        isCurrent ? "text-[#EAB308]" : "text-[#9CA3AF]"
                      }`}
                    >
                      {d.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Grid: Peak Hours Heatmap & Machine Service History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours Traffic Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#EAB308]" />
              Store Rush Hours & Footfall Density
            </CardTitle>
            <CardDescription>
              Helps schedule machine operators during high volume hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {hourlyTraffic.map((slot, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-white flex items-center gap-2">
                    {slot.hour}
                    {slot.peak && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        RUSH
                      </span>
                    )}
                  </span>
                  <span className="text-[#9CA3AF] text-[11px]">{slot.label}</span>
                </div>
                <div className="w-full h-2.5 bg-[#121417] rounded-full overflow-hidden border border-[#2B2F36]">
                  <div
                    className={`h-full rounded-full ${
                      slot.peak ? "bg-[#EAB308]" : "bg-[#3A3F49]"
                    }`}
                    style={{ width: `${slot.intensity}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Machine Maintenance & Drum Health Log */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#EAB308]" />
              Copier Hardware Maintenance & Drum Cycles
            </CardTitle>
            <CardDescription>
              Service intervals for optical drums, fuser rollers & developer units
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-xl bg-[#16181C] border border-[#2B2F36]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white">
                  Canon 2630i Drum Unit
                </span>
                <span className="text-[#EAB308] font-bold">72% Life Remaining</span>
              </div>
              <p className="text-[11px] text-[#9CA3AF] mt-1">
                Last replaced at 100,000 copies. Next inspection in 28,000 prints.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#16181C] border border-[#2B2F36]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white">
                  Xerox VersaLink Fuser Belt
                </span>
                <span className="text-emerald-400 font-bold">Good Condition</span>
              </div>
              <p className="text-[11px] text-[#9CA3AF] mt-1">
                Serviced by Authorized Xerox Engineer on 15 September 2026.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#16181C] border border-[#2B2F36]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white">
                  Thermal Lamination Rollers
                </span>
                <span className="text-amber-400 font-bold">Cleaning Due</span>
              </div>
              <p className="text-[11px] text-[#9CA3AF] mt-1">
                Weekly silicon oil cleaning recommended tonight after shift.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
