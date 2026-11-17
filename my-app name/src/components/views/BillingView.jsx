import React, { useState } from "react";
import {
  Receipt,
  Plus,
  Trash2,
  Printer,
  Calculator,
  User,
  Phone
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import { useShop } from "../../lib/ShopContext";

const standardServices = [
  { id: "s1", name: "A4 B/W Single Side", price: 2.0, category: "Photocopy" },
  { id: "s2", name: "A4 B/W Back-to-Back", price: 3.0, category: "Photocopy" },
  { id: "s3", name: "A4 Color Laser Print", price: 10.0, category: "Digital Print" },
  { id: "s4", name: "Legal B/W Photocopy", price: 3.0, category: "Photocopy" },
  { id: "s5", name: "A3 Heavy Print / Drawing", price: 15.0, category: "Engineering" },
  { id: "s6", name: "Spiral Project Binding", price: 35.0, category: "Finishing" },
  { id: "s7", name: "A4 Thermal Lamination", price: 20.0, category: "Lamination" },
  { id: "s8", name: "PVC ID Card Printing", price: 50.0, category: "ID Card" },
  { id: "s9", name: "Document Scanning (Per Page)", price: 5.0, category: "Scanning" },
  { id: "s10", name: "DTP / Typing Charges (Page)", price: 40.0, category: "DTP" },
];

export function BillingView() {
  const { billsHistory, addBill, ratesData, customers } = useShop();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI / GPay");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [billError, setBillError] = useState("");
  const [isSubmittingBill, setIsSubmittingBill] = useState(false);

  // Cart items
  const [items, setItems] = useState([
    {
      id: "s1",
      name: "A4 B/W Single Side",
      price: 2.0,
      pages: 45,
      copies: 2,
    },
    {
      id: "s6",
      name: "Spiral Project Binding",
      price: 35.0,
      pages: 1,
      copies: 2,
    },
  ]);

  const catalogueServices =
    ratesData && ratesData.length > 0
      ? ratesData.flatMap((cat) =>
          cat.rates.map((r) => ({
            id: r.id,
            name: r.name,
            price: r.price,
            category: cat.category,
          }))
        )
      : standardServices;

  const [activeModalBill, setActiveModalBill] = useState(null);

  const addItemToCart = (service) => {
    const existingIndex = items.findIndex((i) => i.id === service.id);
    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].copies += 1;
      setItems(updated);
    } else {
      setItems([
        ...items,
        {
          id: service.id,
          name: service.name,
          price: service.price,
          pages: 1,
          copies: 1,
        },
      ]);
    }
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = Math.max(1, Number(value) || 1);
    setItems(updated);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.pages * item.copies,
    0
  );
  const discountAmount = (subtotal * discountPercent) / 100;
  const grandTotal = Math.round(subtotal - discountAmount);

  const handleGenerateBill = async () => {
    if (items.length === 0 || isSubmittingBill) return;
    setBillError("");
    setIsSubmittingBill(true);

    const newBill = {
      customer: customerName.trim() || "Walk-in Customer",
      phone: customerPhone.trim() || "N/A",
      items: [...items],
      itemsCount: items.length,
      subtotal,
      discount: discountAmount,
      total: grandTotal,
      mode: paymentMode,
      date: "Just now",
      dateTimeFull: new Date().toLocaleString(),
      itemsDetail: items.map((i) => i.name).slice(0, 2).join(" & "),
    };

    const res = await addBill(newBill);
    setIsSubmittingBill(false);

    if (res && res.success && res.data) {
      setActiveModalBill(res.data);
      // Reset form ONLY after MongoDB confirms document creation
      setItems([]);
      setCustomerName("");
      setCustomerPhone("");
      setDiscountPercent(0);
    } else {
      setBillError(res?.message || "Failed to save bill to MongoDB Atlas. Please ensure backend is running.");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-[#EAB308]" />
            Fast Billing POS & Invoice Generator
          </h1>
          <p className="text-sm text-[#9CA3AF]">
            Calculate Xerox copies, binding, lamination, and generate receipts in 1-click.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Services Catalogue (Quick Add) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white flex items-center justify-between">
                <span>Services Catalogue</span>
                <span className="text-xs font-normal text-[#9CA3AF]">Click to add</span>
              </CardTitle>
              <CardDescription>
                Preset prices for photocopies, printouts and finishing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
                {catalogueServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => addItemToCart(service)}
                    className="p-3 text-left rounded-xl bg-[#16181C] border border-[#2B2F36] hover:border-[#EAB308]/60 hover:bg-[#20242B] transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] group-hover:text-[#EAB308]">
                        {service.category}
                      </span>
                      <p className="text-xs font-semibold text-white mt-0.5 line-clamp-1">
                        {service.name}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center justify-between pt-1 border-t border-[#2B2F36]/60">
                      <span className="text-sm font-extrabold text-[#EAB308]">
                        ₹ {service.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-[#9CA3AF] group-hover:text-white flex items-center">
                        <Plus className="w-3.5 h-3.5" /> Add
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Active Bill Form */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-[#2B2F36] shadow-card-dark">
            <CardHeader className="pb-3 border-b border-[#2B2F36]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-white">
                    Current Bill / Order Items
                  </CardTitle>
                  <CardDescription>
                    Configure pages count, sets multiplier and client details
                  </CardDescription>
                </div>
                <Badge variant="default" className="text-xs font-bold">
                  {items.length} Items Selected
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {billError && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center justify-between">
                  <span>{billError}</span>
                  <button onClick={() => setBillError("")} className="text-red-400 hover:text-white font-bold ml-2">✕</button>
                </div>
              )}

              {/* Customer Info row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#9CA3AF] mb-1 block">
                    Customer Name / Reference
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-[#6B7280]" />
                    <Input
                      list="customer-suggestions"
                      placeholder="e.g. Rahul / College Student"
                      value={customerName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomerName(val);
                        const matched = customers?.find((c) => c.name?.toLowerCase() === val.toLowerCase());
                        if (matched && matched.phone) {
                          setCustomerPhone(matched.phone);
                        }
                      }}
                      className="pl-9"
                    />
                    <datalist id="customer-suggestions">
                      {customers?.map((c) => (
                        <option key={c.id || c._id} value={c.name}>
                          {c.phone ? `(${c.phone}) - ${c.category || "Customer"}` : ""}
                        </option>
                      ))}
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#9CA3AF] mb-1 block">
                    Customer Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-[#6B7280]" />
                    <Input
                      placeholder="e.g. 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              {/* Items List Table */}
              <div className="border border-[#2B2F36] rounded-xl overflow-hidden bg-[#16181C]">
                {items.length === 0 ? (
                  <div className="py-12 text-center text-[#9CA3AF]">
                    <Calculator className="w-8 h-8 mx-auto text-[#6B7280] mb-2" />
                    <p className="text-sm font-medium">No services added to bill yet</p>
                    <p className="text-xs text-[#6B7280]">
                      Click any service on the left to add it here.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-[#121417]">
                      <TableRow>
                        <TableHead className="w-[40%]">Service Item</TableHead>
                        <TableHead className="text-center w-[18%]">Pages/Units</TableHead>
                        <TableHead className="text-center w-[18%]">Sets/Qty</TableHead>
                        <TableHead className="text-right w-[18%]">Subtotal</TableHead>
                        <TableHead className="w-[6%]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, idx) => (
                        <TableRow key={idx} className="hover:bg-[#1E2126]">
                          <TableCell className="font-medium text-white">
                            <span className="block text-xs font-semibold">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-[#9CA3AF]">
                              ₹ {item.price.toFixed(2)} / unit
                            </span>
                          </TableCell>

                          {/* Pages input */}
                          <TableCell className="text-center">
                            <input
                              type="number"
                              min="1"
                              value={item.pages}
                              onChange={(e) =>
                                updateItem(idx, "pages", e.target.value)
                              }
                              className="w-16 px-2 py-1 text-center bg-[#121417] border border-[#2B2F36] rounded-md text-white text-xs font-semibold focus:border-[#EAB308] focus:outline-none"
                            />
                          </TableCell>

                          {/* Copies input */}
                          <TableCell className="text-center">
                            <input
                              type="number"
                              min="1"
                              value={item.copies}
                              onChange={(e) =>
                                updateItem(idx, "copies", e.target.value)
                              }
                              className="w-16 px-2 py-1 text-center bg-[#121417] border border-[#2B2F36] rounded-md text-white text-xs font-semibold focus:border-[#EAB308] focus:outline-none"
                            />
                          </TableCell>

                          {/* Line total */}
                          <TableCell className="text-right font-bold text-[#EAB308] text-sm">
                            ₹ {(item.price * item.pages * item.copies).toFixed(2)}
                          </TableCell>

                          <TableCell className="text-right">
                            <button
                              onClick={() => removeItem(idx)}
                              className="text-[#6B7280] hover:text-red-400 p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Payment Mode & Discount Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-medium text-[#9CA3AF] mb-1.5 block">
                    Payment Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["UPI / GPay", "Cash", "Card"].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPaymentMode(mode)}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                          paymentMode === mode
                            ? "bg-[#EAB308]/15 border-[#EAB308] text-[#EAB308]"
                            : "bg-[#16181C] border-[#2B2F36] text-[#9CA3AF] hover:text-white"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#9CA3AF] mb-1.5 block">
                    Discount (%)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={discountPercent}
                      onChange={(e) =>
                        setDiscountPercent(
                          Math.min(100, Math.max(0, Number(e.target.value) || 0))
                        )
                      }
                      placeholder="0"
                      className="text-right"
                    />
                    <span className="text-xs text-[#9CA3AF] font-bold">%</span>
                  </div>
                </div>
              </div>

              {/* Total Calculation Summary Card */}
              <div className="p-4 rounded-xl bg-[#16181C] border border-[#2B2F36] space-y-2">
                <div className="flex justify-between text-xs text-[#9CA3AF]">
                  <span>Subtotal Amount:</span>
                  <span className="text-white font-medium">₹ {subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400">
                    <span>Discount ({discountPercent}%):</span>
                    <span>- ₹ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#2B2F36] flex items-center justify-between">
                  <span className="text-sm font-bold text-white uppercase tracking-wider">
                    Grand Total:
                  </span>
                  {/* Highlighted in Golden Yellow */}
                  <span className="text-2xl font-black text-[#EAB308] tracking-tight">
                    ₹ {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={handleGenerateBill}
                  disabled={items.length === 0 || isSubmittingBill}
                  className="flex-1 bg-[#EAB308] hover:bg-[#CA8A04] text-[#121417] font-bold text-base h-12 shadow-gold-glow"
                >
                  <Receipt className="w-5 h-5 mr-2" />
                  {isSubmittingBill ? "Saving to MongoDB Atlas..." : `Generate & Print Bill (₹ ${grandTotal})`}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setItems([])}
                  disabled={items.length === 0}
                  className="border-[#2B2F36] text-[#9CA3AF] hover:text-white"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Bills Log */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base text-white">
              Recent Bills Log (Today)
            </CardTitle>
            <CardDescription>
              Audit log of receipts issued today with reprint options
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {billsHistory.length} Total Receipts
          </Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Total Paid</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Issued Time</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billsHistory.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-mono font-semibold text-[#EAB308]">
                    {bill.id}
                  </TableCell>
                  <TableCell className="text-white font-medium">
                    {bill.customer}
                  </TableCell>
                  <TableCell className="text-[#9CA3AF]">{bill.phone}</TableCell>
                  <TableCell className="font-bold text-[#EAB308]">
                    ₹ {bill.total}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{bill.mode}</Badge>
                  </TableCell>
                  <TableCell className="text-[#9CA3AF] text-xs">{bill.date}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setActiveModalBill({
                          id: bill.id,
                          customer: bill.customer,
                          phone: bill.phone,
                          total: bill.total,
                          subtotal: bill.total,
                          discount: 0,
                          mode: bill.mode,
                          date: bill.date,
                          items: [
                            {
                              name: "Photocopy & Printing Services",
                              pages: 1,
                              copies: 1,
                              price: bill.total,
                            },
                          ],
                        })
                      }
                      className="h-7 text-xs border-[#2B2F36] hover:border-[#EAB308]"
                    >
                      <Printer className="w-3 h-3 mr-1 text-[#EAB308]" /> Print Slip
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bill Preview Modal */}
      {activeModalBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#1E2126] border border-[#EAB308]/50 rounded-2xl p-6 shadow-2xl relative text-left">
            {/* Printable Receipt Preview */}
            <div className="border border-[#2B2F36] rounded-xl p-5 bg-[#16181C] font-mono text-xs">
              <div className="text-center pb-3 border-b border-dashed border-[#2B2F36]">
                <p className="text-base font-bold text-white tracking-widest uppercase">
                  ROYAL COMPUTERS
                </p>
                <p className="text-[11px] font-semibold text-[#EAB308]">
                  XEROX & DIGITAL PRINTING
                </p>
                <p className="text-[10px] text-[#9CA3AF]">
                  142 College Road, Near Junction
                </p>
                <p className="text-[10px] text-[#9CA3AF]">Ph: +91 94432 10987</p>
              </div>

              <div className="py-2.5 border-b border-dashed border-[#2B2F36] flex justify-between text-[#9CA3AF] text-[11px]">
                <div>
                  <span>Bill: </span>
                  <span className="text-white font-bold">{activeModalBill.id}</span>
                </div>
                <div>
                  <span>Date: </span>
                  <span className="text-white">{activeModalBill.date}</span>
                </div>
              </div>

              <div className="py-2 border-b border-dashed border-[#2B2F36] text-[11px]">
                <span className="text-[#9CA3AF]">Customer: </span>
                <span className="text-white font-semibold">
                  {activeModalBill.customer}
                </span>
              </div>

              {/* Items */}
              <div className="py-3 space-y-2 border-b border-dashed border-[#2B2F36]">
                {activeModalBill.items &&
                  activeModalBill.items.map((it, i) => (
                    <div key={i} className="flex justify-between text-white">
                      <span>
                        {it.name} ({it.pages}p x {it.copies})
                      </span>
                      <span className="font-bold">
                        ₹ {(it.price * it.pages * it.copies).toFixed(2)}
                      </span>
                    </div>
                  ))}
              </div>

              <div className="pt-3 space-y-1 text-right">
                <div className="flex justify-between text-[#9CA3AF]">
                  <span>Subtotal:</span>
                  <span>₹ {activeModalBill.subtotal || activeModalBill.total}</span>
                </div>
                {activeModalBill.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount:</span>
                    <span>- ₹ {activeModalBill.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#EAB308] pt-1 border-t border-[#2B2F36]">
                  <span>NET TOTAL:</span>
                  <span>₹ {activeModalBill.total}</span>
                </div>
                <div className="text-[10px] text-[#9CA3AF] pt-1">
                  Paid via {activeModalBill.mode} • Thank You!
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setActiveModalBill(null)}
                className="border-[#2B2F36]"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  window.print();
                }}
                className="bg-[#EAB308] hover:bg-[#CA8A04] text-[#121417] font-bold"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Receipt
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
