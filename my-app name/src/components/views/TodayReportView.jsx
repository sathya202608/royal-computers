import React, { useState } from "react";
import {
  FileText,
  Printer,
  CheckCircle2,
  Coins,
  Gauge,
  Layers
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import { useShop } from "../../lib/ShopContext";

export function TodayReportView() {
  const { billsHistory } = useShop();
  const [activeShift, setActiveShift] = useState("all");

  const todayRevenue = billsHistory.reduce((sum, b) => sum + (Number(b.total) || 0), 0);
  const upiRevenue = billsHistory
    .filter((b) => (b.mode || "").toLowerCase().includes("upi") || (b.mode || "").toLowerCase().includes("pay"))
    .reduce((sum, b) => sum + (Number(b.total) || 0), 0);
  const cashRevenue = Math.max(0, todayRevenue - upiRevenue);
  const billsCount = billsHistory.length;

  const todayFormatted = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const meterReadings = [
    {
      machine: "Canon imageRUNNER 2630i (Main B/W)",
      startReading: 142850,
      endReading: 145690,
      totalCount: 2840,
      wastage: 18,
      netBillable: 2822,
      operator: "Ramesh (Morning)",
    },
    {
      machine: "Xerox VersaLink C7025 (Color Digital)",
      startReading: 48920,
      endReading: 50170,
      totalCount: 1250,
      wastage: 8,
      netBillable: 1242,
      operator: "Suresh (Evening)",
    },
    {
      machine: "HP LaserJet Pro 404dn (Express Counter)",
      startReading: 98120,
      endReading: 98920,
      totalCount: 800,
      wastage: 4,
      netBillable: 796,
      operator: "Ramesh (Morning)",
    },
  ];

  const categoryBreakdown = [
    { name: "B/W Xerox & Photocopy", amount: 7840, copies: 3920, percentage: 53 },
    { name: "Color Laser Printouts", amount: 3880, copies: 970, percentage: 26 },
    { name: "Spiral & Hard Binding", amount: 1610, copies: 46, percentage: 11 },
    { name: "Lamination & ID Cards", amount: 980, copies: 34, percentage: 7 },
    { name: "DTP, Typing & Scanning", amount: 540, copies: 18, percentage: 3 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header with Date and Shift Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-[#1E2126] border border-[#2B2F36]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#EAB308]/15 text-[#EAB308] border border-[#EAB308]/30">
              AUDIT REGISTER
            </span>
            <span className="text-xs text-[#9CA3AF]">{todayFormatted}</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#EAB308]" />
            Today's Daily Business & Meter Report
          </h1>
          <p className="text-sm text-[#9CA3AF]">
            End-of-day register reconciliation, cash drawer balance & copier counters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex p-1 rounded-xl bg-[#121417] border border-[#2B2F36]">
            {["all", "morning", "evening"].map((shift) => (
              <button
                key={shift}
                onClick={() => setActiveShift(shift)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  activeShift === shift
                    ? "bg-[#EAB308] text-[#121417] shadow-sm"
                    : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                {shift === "all" ? "Full Day" : `${shift} Shift`}
              </button>
            ))}
          </div>

          <Button
            onClick={() => window.print()}
            variant="outline"
            className="border-[#2B2F36] hover:border-[#EAB308] text-white"
          >
            <Printer className="w-4 h-4 mr-2 text-[#EAB308]" />
            Print Day Sheet
          </Button>
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-[#EAB308]/50 shadow-gold-glow-subtle">
          <CardHeader className="pb-2">
            <span className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold">
              Net Day Revenue
            </span>
          </CardHeader>
          <CardContent>
            {/* Golden Highlight for Total */}
            <div className="text-3xl font-extrabold text-[#EAB308]">
              ₹ {todayRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> {billsCount} Receipts Closed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold">
              Cash in Hand (Drawer)
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">
              ₹ {cashRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1">
              {todayRevenue > 0
                ? ((cashRevenue / todayRevenue) * 100).toFixed(1)
                : 0}
              % of today's total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold">
              UPI & Online QR
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">
              ₹ {upiRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1">
              {todayRevenue > 0
                ? ((upiRevenue / todayRevenue) * 100).toFixed(1)
                : 0}
              % (PhonePe / GPay / Paytm)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold">
              Total Machine Copies
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">
              4,890
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1">
              Wastage: 30 sheets (0.6%)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Copier Meter Readings Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <Gauge className="w-5 h-5 text-[#EAB308]" />
              Machine Meter Readings (Start vs End Counters)
            </CardTitle>
            <CardDescription>
              Verified mechanical counter logs to prevent unaccounted copies
            </CardDescription>
          </div>
          <Badge variant="default" className="text-xs font-semibold">
            All Readings Synced
          </Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Copier Machine</TableHead>
                <TableHead>Start Meter</TableHead>
                <TableHead>Closing Meter</TableHead>
                <TableHead>Total Impressions</TableHead>
                <TableHead>Waste / Test</TableHead>
                <TableHead className="text-right">Net Billable</TableHead>
                <TableHead className="text-right">Shift Operator</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meterReadings.map((m, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-semibold text-white">
                    {m.machine}
                  </TableCell>
                  <TableCell className="font-mono text-[#9CA3AF]">
                    {m.startReading.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-white font-semibold">
                    {m.endReading.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-[#EAB308] font-bold">
                    +{m.totalCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-rose-400 font-mono text-xs">
                    {m.wastage} sheets
                  </TableCell>
                  <TableCell className="text-right font-mono font-extrabold text-white">
                    {m.netBillable.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="text-[11px]">
                      {m.operator}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Category Breakdown & Payment Reconcile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Layers className="w-5 h-5 text-[#EAB308]" />
              Service Category Breakdown
            </CardTitle>
            <CardDescription>
              Volume and revenue share by service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-white">{cat.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#9CA3AF]">{cat.copies} units</span>
                    <span className="font-bold text-[#EAB308]">
                      ₹ {cat.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-[#121417] rounded-full overflow-hidden border border-[#2B2F36]">
                  <div
                    className="h-full bg-[#EAB308] rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Drawer Verification & Settlement */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Coins className="w-5 h-5 text-[#EAB308]" />
              Cash Drawer Settlement
            </CardTitle>
            <CardDescription>
              Physical cash count vs billing system expected balance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-xl bg-[#16181C] border border-[#2B2F36] flex justify-between items-center text-xs">
              <span className="text-[#9CA3AF]">Opening Float Balance:</span>
              <span className="font-bold text-white">₹ 1,500.00</span>
            </div>
            <div className="p-3 rounded-xl bg-[#16181C] border border-[#2B2F36] flex justify-between items-center text-xs">
              <span className="text-[#9CA3AF]">Today's Cash Collection:</span>
              <span className="font-bold text-emerald-400">+ ₹ 6,240.00</span>
            </div>
            <div className="p-3 rounded-xl bg-[#16181C] border border-[#2B2F36] flex justify-between items-center text-xs">
              <span className="text-[#9CA3AF]">Shop Expense / Tea Paid:</span>
              <span className="font-bold text-rose-400">- ₹ 180.00</span>
            </div>
            <div className="p-4 rounded-xl bg-[#252930] border border-[#EAB308]/40 flex justify-between items-center">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#9CA3AF] font-bold">
                  Expected Physical Cash:
                </span>
                <p className="text-[11px] text-[#EAB308]">Drawer Balanced & Verified</p>
              </div>
              <span className="text-xl font-extrabold text-[#EAB308]">
                ₹ 7,560.00
              </span>
            </div>

            <Button className="w-full bg-[#EAB308] hover:bg-[#CA8A04] text-[#121417] font-bold mt-2">
              Sign & Lock Day Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
