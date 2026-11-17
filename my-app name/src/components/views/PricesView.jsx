import React, { useState } from "react";
import {
  Tag,
  Printer,
  Calculator,
  Edit2,
  Trash2,
  Plus,
  CheckCircle2,
  X
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { useShop } from "../../lib/ShopContext";

export function PricesView() {
  const { ratesData, updateRate, addRate, deleteRate } = useShop();

  const [testPages, setTestPages] = useState(50);
  const [selectedService, setSelectedService] = useState("A4 Single Side (1 - 50 copies)");
  const [includeBinding, setIncludeBinding] = useState(true);

  // Edit Modal State
  const [editingRate, setEditingRate] = useState(null); // { catId, rate }
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [editPopular, setEditPopular] = useState(false);

  // Add Rate Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addCatId, setAddCatId] = useState(ratesData[0]?.id || "cat-1");
  const [addName, setAddName] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [addUnit, setAddUnit] = useState("per page");
  const [addPopular, setAddPopular] = useState(false);

  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Estimator calculation based on active rates
  const allRates = ratesData.flatMap((cat) => cat.rates);
  const matchedService = allRates.find((r) => r.name === selectedService) || allRates[0];
  const unitRate = matchedService ? Number(matchedService.price) : 2.0;

  const bindingRateObj = allRates.find((r) => r.name.toLowerCase().includes("spiral project")) || { price: 35 };
  const bindingCost = includeBinding ? Number(bindingRateObj.price) : 0;
  const copyTotal = testPages * unitRate;
  const estimateTotal = copyTotal + bindingCost;

  const handleOpenEdit = (catId, rate) => {
    setEditingRate({ catId, rate });
    setEditName(rate.name);
    setEditPrice(rate.price);
    setEditUnit(rate.unit);
    setEditPopular(!!rate.popular);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingRate) return;

    const res = await updateRate(editingRate.catId, editingRate.rate.id, {
      name: editName,
      price: Number(editPrice) || 0,
      unit: editUnit,
      popular: editPopular,
    });

    if (res && res.success) {
      showToast(`Updated rate for "${editName}" in MongoDB Atlas!`);
      setEditingRate(null);
    } else {
      alert(res?.message || "Failed to update rate in MongoDB Atlas.");
    }
  };

  const handleAddNewRate = async (e) => {
    e.preventDefault();
    if (!addName || !addPrice) return;

    const res = await addRate(addCatId, {
      name: addName,
      price: Number(addPrice) || 0,
      unit: addUnit,
      popular: addPopular,
    });

    if (res && res.success) {
      showToast(`Added new service rate "${addName}" to MongoDB Atlas!`);
      setIsAddModalOpen(false);
      setAddName("");
      setAddPrice("");
    } else {
      alert(res?.message || "Failed to add rate to MongoDB Atlas.");
    }
  };

  const handleDeleteRate = async (catId, rateId, rateName) => {
    if (window.confirm(`Are you sure you want to delete rate for "${rateName}"?`)) {
      const res = await deleteRate(catId, rateId);
      if (res && res.success) {
        showToast(`Deleted rate "${rateName}" from MongoDB Atlas!`);
      } else {
        alert(res?.message || "Failed to delete rate from MongoDB Atlas.");
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[#1E2126] border border-[#EAB308] text-white px-4 py-3 rounded-xl shadow-2xl animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#EAB308]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-[#1E2126] border border-[#2B2F36]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#EAB308]/15 text-[#EAB308] border border-[#EAB308]/30">
              OFFICIAL RATE CARD
            </span>
            <span className="text-xs text-[#9CA3AF]">Customizable & Live Sync</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#EAB308]" />
            Royal Computers Xerox Shop Price List & Rates
          </h1>
          <p className="text-sm text-[#9CA3AF]">
            Standard counter rates for photocopy, digital color prints, thesis binding & PVC ID cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#EAB308] hover:bg-[#CA8A04] text-[#121417] font-bold shadow-gold-glow"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Rate
          </Button>

          <Button
            onClick={() => window.print()}
            variant="outline"
            className="border-[#2B2F36] hover:border-[#EAB308] text-white"
          >
            <Printer className="w-4 h-4 mr-2 text-[#EAB308]" />
            Print Rate Chart
          </Button>
        </div>
      </div>

      {/* Interactive Quick Estimator Widget */}
      <Card className="border-[#EAB308]/50 shadow-gold-glow-subtle bg-gradient-to-r from-[#1E2126] via-[#1E2126] to-[#252830]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#EAB308]" />
            Instant Project Price Estimator (Customer Quick Quote)
          </CardTitle>
          <CardDescription>
            Simulate live quote for student project submissions, thesis or legal copy bundles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div>
              <label className="text-xs text-[#9CA3AF] block mb-1">Select Service</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#121417] border border-[#2B2F36] text-white text-xs focus:border-[#EAB308] focus:outline-none"
              >
                {allRates.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name} (₹{r.price} {r.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-[#9CA3AF] block mb-1">
                Number of Pages / Units
              </label>
              <Input
                type="number"
                min="1"
                value={testPages}
                onChange={(e) => setTestPages(Math.max(1, Number(e.target.value) || 1))}
                className="bg-[#121417]"
              />
            </div>

            <div>
              <label className="text-xs text-[#9CA3AF] block mb-1">
                Spiral Project Binding
              </label>
              <label className="flex items-center gap-2 h-10 px-3 rounded-lg bg-[#121417] border border-[#2B2F36] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeBinding}
                  onChange={(e) => setIncludeBinding(e.target.checked)}
                  className="accent-[#EAB308] w-4 h-4 rounded"
                />
                <span className="text-xs text-white">Add Spiral (+₹{bindingRateObj.price})</span>
              </label>
            </div>

            {/* Estimated Total in Golden Accent */}
            <div className="p-3 rounded-xl bg-[#121417] border border-[#EAB308]/40 text-right">
              <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block">
                Estimated Customer Quote:
              </span>
              <span className="text-2xl font-black text-[#EAB308]">
                ₹ {estimateTotal.toFixed(2)}
              </span>
              <span className="text-[10px] text-[#9CA3AF] block">
                ({testPages} pgs @ ₹{unitRate} + {includeBinding ? "Binding" : "No binding"})
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categorized Rate Tables with Full EDIT Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ratesData.map((cat) => (
          <Card key={cat.id} className="border-[#2B2F36]">
            <CardHeader className="pb-3 border-b border-[#2B2F36]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base text-white">
                    {cat.category}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {cat.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {cat.rates.length} Rates
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-[#EAB308] hover:text-[#CA8A04] hover:bg-[#EAB308]/10"
                    onClick={() => {
                      setAddCatId(cat.id);
                      setIsAddModalOpen(true);
                    }}
                  >
                    + Add
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="divide-y divide-[#2B2F36]">
                {cat.rates.map((rate) => (
                  <div
                    key={rate.id}
                    className="py-3 flex items-center justify-between hover:bg-[#16181C] px-2.5 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-white">
                        {rate.name}
                      </span>
                      {rate.popular && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/30">
                          POPULAR
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#EAB308]">
                          ₹ {Number(rate.price).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-[#9CA3AF] block">
                          {rate.unit}
                        </span>
                      </div>

                      {/* EDIT & DELETE BUTTONS */}
                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(cat.id, rate)}
                          className="p-1.5 text-xs rounded bg-[#2B2F36] hover:bg-[#EAB308]/20 hover:text-[#EAB308] text-[#9CA3AF] transition-colors"
                          title="Edit Rate & Price"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRate(cat.id, rate.id, rate.name)}
                          className="p-1.5 text-xs rounded bg-[#2B2F36] hover:bg-rose-500/20 hover:text-rose-400 text-[#9CA3AF] transition-colors"
                          title="Delete Rate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* EDIT RATE MODAL */}
      {editingRate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#1E2126] border border-[#2B2F36] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#EAB308]" />
                Edit Service Rate
              </h2>
              <button
                onClick={() => setEditingRate(null)}
                className="text-[#9CA3AF] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Modify the price and description for this Xerox shop service.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">
                  Service Name / Specification
                </label>
                <Input
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">
                    Price (₹)
                  </label>
                  <Input
                    type="number"
                    step="0.25"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">
                    Per Unit Description
                  </label>
                  <Input
                    required
                    placeholder="e.g. per page, per book"
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editPopular}
                    onChange={(e) => setEditPopular(e.target.checked)}
                    className="accent-[#EAB308] w-4 h-4 rounded"
                  />
                  <span>Mark as "POPULAR" counter favorite</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingRate(null)}
                  className="border-[#2B2F36]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#EAB308] hover:bg-[#CA8A04] text-[#121417] font-bold"
                >
                  Save Rate Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW RATE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#1E2126] border border-[#2B2F36] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#EAB308]" />
                Add New Service Rate
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#9CA3AF] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Add a new printing, binding, scanning or Xerox counter service.
            </p>

            <form onSubmit={handleAddNewRate} className="space-y-4">
              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">
                  Service Category
                </label>
                <select
                  value={addCatId}
                  onChange={(e) => setAddCatId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#121417] border border-[#2B2F36] text-white text-xs focus:border-[#EAB308] focus:outline-none"
                >
                  {ratesData.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">
                  Service Name
                </label>
                <Input
                  required
                  placeholder="e.g. A2 Blue Print Plotting"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">
                    Price (₹)
                  </label>
                  <Input
                    type="number"
                    step="0.25"
                    required
                    placeholder="25.00"
                    value={addPrice}
                    onChange={(e) => setAddPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">
                    Unit Description
                  </label>
                  <Input
                    required
                    placeholder="e.g. per sheet, per set"
                    value={addUnit}
                    onChange={(e) => setAddUnit(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addPopular}
                    onChange={(e) => setAddPopular(e.target.checked)}
                    className="accent-[#EAB308] w-4 h-4 rounded"
                  />
                  <span>Mark as "POPULAR"</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="border-[#2B2F36]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#EAB308] hover:bg-[#CA8A04] text-[#121417] font-bold"
                >
                  Add Service Rate
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
