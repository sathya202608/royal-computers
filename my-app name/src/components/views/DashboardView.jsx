import React from "react";
import {
  TrendingUp,
  Copy,
  Receipt,
  Package,
  Printer,
  Zap,
  CheckCircle2,
  QrCode,
  Banknote,
  Plus
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import { useShop } from "../../lib/ShopContext";

export function DashboardView({ onNavigateToBilling, onNavigateToStock, onNavigateToReport }) {
  const { billsHistory, stockList } = useShop();

  const totalRevenue = billsHistory.reduce((sum, b) => sum + (Number(b.total) || 0), 0);
  const upiRevenue = billsHistory
    .filter((b) => (b.mode || "").toLowerCase().includes("upi") || (b.mode || "").toLowerCase().includes("pay"))
    .reduce((sum, b) => sum + (Number(b.total) || 0), 0);
  const cashRevenue = Math.max(0, totalRevenue - upiRevenue);

  const totalBills = billsHistory.length;
  const avgTicket = totalBills > 0 ? (totalRevenue / totalBills).toFixed(2) : "0.00";

  const totalPaperReams = stockList
    .filter((s) => (s.unit || "").toLowerCase().includes("ream"))
    .reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);

  const lowStockCount = stockList.filter(
    (s) => (Number(s.quantity) || 0) <= (Number(s.minThreshold) || 5)
  ).length;

  const metrics = [
    {
      id: "revenue",
      title: "Today's Revenue",
      value: `₹ ${totalRevenue.toLocaleString()}`,
      change: "MongoDB Atlas Cloud Sync",
      trend: "up",
      icon: TrendingUp,
      accent: true, // Uses primary golden yellow
      subtext: `Cash: ₹${cashRevenue.toLocaleString()} • UPI: ₹${upiRevenue.toLocaleString()}`,
      onClick: onNavigateToReport,
    },
    {
      id: "copies",
      title: "Total Copies Today",
      value: "4,890",
      change: "3,920 B/W • 970 Color",
      trend: "up",
      icon: Copy,
      accent: false,
      subtext: "Canon & Xerox copiers active",
      onClick: onNavigateToReport,
    },
    {
      id: "bills",
      title: "Total Bills Issued",
      value: String(totalBills),
      change: `Avg ticket: ₹${avgTicket}`,
      trend: "up",
      icon: Receipt,
      accent: false,
      subtext: billsHistory[0] ? `Last bill: ${billsHistory[0].date}` : "Ready for next bill",
      onClick: onNavigateToBilling,
    },
    {
      id: "stock",
      title: "Stock Health",
      value: `${totalPaperReams || 24} Reams`,
      change: lowStockCount > 0 ? `${lowStockCount} Item Needs Restock` : "All Supplies Healthy",
      trend: lowStockCount > 0 ? "warning" : "up",
      icon: Package,
      accent: false,
      subtext: lowStockCount > 0 ? "Threshold alert" : "Stock optimal",
      onClick: onNavigateToStock,
    },
  ];

  const machines = [
    {
      name: "Canon imageRUNNER 2630i",
      type: "Heavy B/W Copier",
      status: "Ready",
      toner: 78,
      paperTray: 92,
      todayCopies: 2840,
    },
    {
      name: "Xerox VersaLink C7025",
      type: "High-Speed Color Laser",
      status: "Printing",
      toner: 64,
      paperTray: 45,
      todayCopies: 1250,
    },
    {
      name: "HP LaserJet Pro 404dn",
      type: "Express Counter B/W",
      status: "Ready",
      toner: 32,
      paperTray: 80,
      todayCopies: 800,
    },
  ];

  const recentTransactions =
    billsHistory && billsHistory.length > 0
      ? billsHistory.slice(0, 5).map((b) => ({
          id: b.id,
          customer: b.customer,
          service: b.itemsDetail || "Photocopy & Printing",
          copies: `${b.itemsCount || 1} item(s)`,
          mode: b.mode || "UPI / GPay",
          amount: b.total,
          time: b.date || "Just now",
          status: "Completed",
        }))
      : [
          {
            id: "RC-2026-0142",
            customer: "Vikas (College Student)",
            service: "Project Report Xerox & Spiral Binding",
            copies: "180 pgs (B/W + Color)",
            mode: "GPay UPI",
            amount: 450,
            time: "2 mins ago",
            status: "Completed",
          },
        ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Welcome & Quick Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 rounded-2xl bg-gradient-to-r from-[#1E2126] via-[#1E2126] to-[#252830] border border-[#2B2F36]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EAB308]/15 text-[#EAB308] border border-[#EAB308]/30">
              ROYAL COMPUTERS COPIER OS
            </span>
            <span className="text-xs text-[#9CA3AF]">v2.6 Enterprise</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Welcome Back, Owner! 👋
          </h1>
          <p className="text-sm text-[#9CA3AF]">
            Here is the live pulse of Royal Computers Xerox Shop operations today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={onNavigateToBilling}
            className="bg-[#EAB308] hover:bg-[#CA8A04] text-[#121417] font-bold shadow-gold-glow"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create Xerox Bill
          </Button>
          <Button
            onClick={onNavigateToReport}
            variant="secondary"
            className="bg-[#2B2F36] hover:bg-[#373C45] text-white"
          >
            Today's Sheet
          </Button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card
              key={m.id}
              onClick={m.onClick}
              className={`relative overflow-hidden transition-all duration-200 hover:border-[#EAB308]/50 cursor-pointer ${
                m.accent ? "border-[#EAB308]/60 bg-[#1E2126] shadow-gold-glow-subtle" : ""
              }`}
            >
              {m.accent && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EAB308] via-[#FACC15] to-[#CA8A04]" />
              )}
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
                  {m.title}
                </span>
                <div
                  className={`p-2 rounded-lg ${
                    m.accent
                      ? "bg-[#EAB308]/20 text-[#EAB308]"
                      : "bg-[#2B2F36] text-[#9CA3AF]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div
                  className={`text-3xl font-extrabold tracking-tight ${
                    m.accent ? "text-[#EAB308]" : "text-white"
                  }`}
                >
                  {m.value}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span
                    className={`text-xs font-semibold ${
                      m.trend === "warning"
                        ? "text-amber-400"
                        : "text-emerald-400 flex items-center"
                    }`}
                  >
                    {m.change}
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-[#9CA3AF] border-t border-[#2B2F36] pt-2">
                  {m.subtext}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Middle Row: Machine Copier Fleet Status & Hourly Traffic */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Machine Copier Fleet Status */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#EAB308]" />
                Connected Copier Fleet
              </CardTitle>
              <CardDescription>
                Live hardware status, toner levels & counter readings
              </CardDescription>
            </div>
            <Badge variant="success" className="gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All 3 Online
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {machines.map((machine, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-[#16181C] border border-[#2B2F36] hover:border-[#3A3F49] transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">
                          {machine.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            machine.status === "Printing"
                              ? "bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/40 animate-pulse"
                              : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          }`}
                        >
                          {machine.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{machine.type}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-right">
                        <span className="text-[#9CA3AF]">Today's Count</span>
                        <p className="font-bold text-[#EAB308]">
                          {machine.todayCopies.toLocaleString()} copies
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress bars for Toner and Paper */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 pt-3 border-t border-[#2B2F36]">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#9CA3AF]">Toner Level</span>
                        <span
                          className={`font-semibold ${
                            machine.toner < 40 ? "text-amber-400" : "text-white"
                          }`}
                        >
                          {machine.toner}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#2B2F36] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            machine.toner < 40 ? "bg-amber-500" : "bg-[#EAB308]"
                          }`}
                          style={{ width: `${machine.toner}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#9CA3AF]">Paper Tray</span>
                        <span className="font-semibold text-white">
                          {machine.paperTray}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#2B2F36] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${machine.paperTray}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Rate & Service Calculator Shortcut */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#EAB308]" />
              Quick Price Sheet
            </CardTitle>
            <CardDescription>Most frequently ordered jobs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#16181C] border border-[#2B2F36]">
              <div>
                <p className="text-xs font-semibold text-white">A4 B/W Single Side</p>
                <p className="text-[11px] text-[#9CA3AF]">75 GSM JK Copier</p>
              </div>
              <span className="text-sm font-bold text-[#EAB308]">₹ 2.00</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#16181C] border border-[#2B2F36]">
              <div>
                <p className="text-xs font-semibold text-white">A4 B/W Back to Back</p>
                <p className="text-[11px] text-[#9CA3AF]">Both sides printing</p>
              </div>
              <span className="text-sm font-bold text-[#EAB308]">₹ 3.00</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#16181C] border border-[#2B2F36]">
              <div>
                <p className="text-xs font-semibold text-white">A4 Color Laser Print</p>
                <p className="text-[11px] text-[#9CA3AF]">High-res graphics</p>
              </div>
              <span className="text-sm font-bold text-[#EAB308]">₹ 10.00</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#16181C] border border-[#2B2F36]">
              <div>
                <p className="text-xs font-semibold text-white">Spiral Project Binding</p>
                <p className="text-[11px] text-[#9CA3AF]">Sheet + OHP sheet</p>
              </div>
              <span className="text-sm font-bold text-[#EAB308]">₹ 35.00</span>
            </div>

            <div className="pt-2">
              <Button
                onClick={onNavigateToBilling}
                className="w-full bg-[#EAB308] hover:bg-[#CA8A04] text-[#121417] font-bold"
              >
                Open Full Billing POS
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Live Transactions Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#EAB308]" />
              Live Orders & Billing Stream
            </CardTitle>
            <CardDescription>
              Recent bills generated at the front desk
            </CardDescription>
          </div>
          <Button
            onClick={onNavigateToBilling}
            variant="outline"
            size="sm"
            className="text-xs border-[#2B2F36] hover:border-[#EAB308]/40"
          >
            View All Billing Logs
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill No.</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service Ordered</TableHead>
                <TableHead>Quantity / Copies</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead className="text-right">Total (₹)</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-mono font-semibold text-[#EAB308]">
                    {tx.id}
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    {tx.customer}
                    <span className="block text-[11px] text-[#9CA3AF]">
                      {tx.time}
                    </span>
                  </TableCell>
                  <TableCell className="text-[#9CA3AF]">{tx.service}</TableCell>
                  <TableCell className="font-medium text-white">
                    {tx.copies}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                      {tx.mode.includes("UPI") || tx.mode.includes("Pay") ? (
                        <QrCode className="w-3.5 h-3.5 text-[#EAB308]" />
                      ) : (
                        <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      {tx.mode}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-extrabold text-[#EAB308] text-base">
                    ₹ {tx.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="success">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {tx.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
