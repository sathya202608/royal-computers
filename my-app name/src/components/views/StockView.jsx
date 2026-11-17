import React, { useState } from "react";
import {
  Package,
  Plus,
  AlertTriangle,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  X
} from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import { useShop } from "../../lib/ShopContext";

export function StockView() {
  const {
    stockList,
    updateStockItem,
    addStockItem,
    deleteStockItem,
    adjustStockQty,
  } = useShop();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Add Item Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Paper");
  const [newItemQty, setNewItemQty] = useState(10);
  const [newItemUnit, setNewItemUnit] = useState("Reams");
  const [newItemThreshold, setNewItemThreshold] = useState(5);
  const [newItemSupplier, setNewItemSupplier] = useState("Local Paper Mart");

  // Edit Item Modal
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("Paper");
  const [editQty, setEditQty] = useState(0);
  const [editUnit, setEditUnit] = useState("Reams");
  const [editThreshold, setEditThreshold] = useState(5);
  const [editSupplier, setEditSupplier] = useState("");

  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const categories = ["All", "Paper", "Special Paper", "Toner", "Binding", "Lamination"];

  const filteredStock = stockList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      filterCategory === "All" || item.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const lowStockCount = stockList.filter(
    (item) => item.quantity <= item.minThreshold
  ).length;

  const totalPaperReams = stockList
    .filter((i) => i.category === "Paper" && i.unit.toLowerCase().includes("ream"))
    .reduce((sum, i) => sum + i.quantity, 0);

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditQty(item.quantity);
    setEditUnit(item.unit);
    setEditThreshold(item.minThreshold);
    setEditSupplier(item.supplier);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    const res = await updateStockItem(editingItem.id, {
      name: editName,
      category: editCategory,
      quantity: Number(editQty) || 0,
      unit: editUnit,
      minThreshold: Number(editThreshold) || 5,
      supplier: editSupplier,
    });

    if (res && res.success) {
      showToast(`Updated "${editName}" in MongoDB Atlas!`);
      setEditingItem(null);
    } else {
      alert(res?.message || "Failed to update stock in MongoDB Atlas.");
    }
  };

  const handleAddNewItem = async (e) => {
    e.preventDefault();
    if (!newItemName) return;

    const res = await addStockItem({
      name: newItemName,
      category: newItemCategory,
      quantity: Number(newItemQty) || 0,
      unit: newItemUnit,
      minThreshold: Number(newItemThreshold) || 5,
      supplier: newItemSupplier,
    });

    if (res && res.success) {
      showToast(`Added "${newItemName}" to MongoDB Atlas!`);
      setIsAddModalOpen(false);
      setNewItemName("");
      setNewItemQty(10);
    } else {
      alert(res?.message || "Failed to add stock item to MongoDB Atlas.");
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from stock inventory?`)) {
      const res = await deleteStockItem(id);
      if (res && res.success) {
        showToast(`Removed "${name}" from MongoDB Atlas.`);
      } else {
        alert(res?.message || "Failed to delete stock from MongoDB Atlas.");
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

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-[#1E2126] border border-[#2B2F36]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#EAB308]/15 text-[#EAB308] border border-[#EAB308]/30">
              INVENTORY MANAGEMENT
            </span>
            {lowStockCount > 0 && (
              <span className="text-xs text-amber-400 flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                {lowStockCount} Item(s) Need Reorder
              </span>
            )}
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-[#EAB308]" />
            Consumables & Raw Material Stock
          </h1>
          <p className="text-sm text-[#9CA3AF]">
            Track copier paper reams, laser toners, binding coils & lamination pouches with full edit controls.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#EAB308] hover:bg-[#CA8A04] text-[#121417] font-bold shadow-gold-glow"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add / Restock Item
        </Button>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="border-[#2B2F36]">
          <CardHeader className="pb-2">
            <span className="text-xs text-[#9CA3AF] uppercase font-semibold">
              Total Paper in Shop
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-[#EAB308]">
              {totalPaperReams} Reams
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1">
              Approx ~{(totalPaperReams * 500).toLocaleString()} printable sheets
            </p>
          </CardContent>
        </Card>

        <Card className={lowStockCount > 0 ? "border-amber-500/40" : ""}>
          <CardHeader className="pb-2">
            <span className="text-xs text-[#9CA3AF] uppercase font-semibold">
              Low Stock Warnings
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-amber-400">
              {lowStockCount} Items
            </div>
            <p className="text-xs text-amber-300 mt-1">
              Items at or below safe threshold
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#2B2F36]">
          <CardHeader className="pb-2">
            <span className="text-xs text-[#9CA3AF] uppercase font-semibold">
              Total Managed SKUs
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">
              {stockList.length} Items
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1">
              Across {categories.length - 1} consumable categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#6B7280]" />
          <Input
            placeholder="Search paper, toner or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[#1E2126] border-[#2B2F36]"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                filterCategory === cat
                  ? "bg-[#EAB308] text-[#121417] font-bold shadow-sm"
                  : "bg-[#1E2126] text-[#9CA3AF] hover:text-white border border-[#2B2F36]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Items Table with EDIT & DELETE Options */}
      <Card className="border-[#2B2F36]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#2B2F36]">
                <TableHead className="w-[100px]">Item ID</TableHead>
                <TableHead>Description / Specification</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Actions & Edits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStock.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-[#2B2F36] hover:bg-[#1E2126]/60 transition-colors"
                >
                  <TableCell className="font-mono text-xs text-[#9CA3AF]">
                    {item.id}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-white block text-sm">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-[#6B7280]">
                      Min Threshold: {item.minThreshold} {item.unit}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-base font-extrabold ${
                          item.quantity <= item.minThreshold
                            ? "text-amber-400"
                            : "text-[#EAB308]"
                        }`}
                      >
                        {item.quantity}
                      </span>
                      <span className="text-xs text-[#9CA3AF]">{item.unit}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.quantity <= item.minThreshold ? (
                      <Badge variant="warning" className="gap-1">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </Badge>
                    ) : (
                      <Badge variant="success">In Stock</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-[#9CA3AF]">
                    {item.supplier}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Quick Adjust Buttons */}
                      <button
                        onClick={() => adjustStockQty(item.id, -1)}
                        className="px-2 py-1 text-xs rounded bg-[#2B2F36] hover:bg-rose-500/20 hover:text-rose-400 text-[#9CA3AF] transition-colors"
                        title="Use / Deduct 1 unit"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => adjustStockQty(item.id, 5)}
                        className="px-2 py-1 text-xs rounded bg-[#2B2F36] hover:bg-[#EAB308]/20 hover:text-[#EAB308] text-[#9CA3AF] transition-colors"
                        title="Restock +5 units"
                      >
                        +5
                      </button>

                      {/* EDIT MODAL BUTTON */}
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-xs rounded bg-[#2B2F36] hover:bg-[#EAB308]/20 hover:text-[#EAB308] text-[#9CA3AF] transition-colors"
                        title="Edit Item Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => handleDeleteItem(item.id, item.name)}
                        className="p-1.5 text-xs rounded bg-[#2B2F36] hover:bg-rose-500/20 hover:text-rose-400 text-[#9CA3AF] transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* EDIT STOCK MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#1E2126] border border-[#2B2F36] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#EAB308]" />
                Edit Consumable Item
              </h2>
              <button
                onClick={() => setEditingItem(null)}
                className="text-[#9CA3AF] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Update inventory specifications, safe threshold and supplier.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">
                  Item Description
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
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#121417] border border-[#2B2F36] text-white text-xs focus:border-[#EAB308] focus:outline-none"
                  >
                    <option value="Paper">Paper</option>
                    <option value="Special Paper">Special Paper</option>
                    <option value="Toner">Toner</option>
                    <option value="Binding">Binding</option>
                    <option value="Lamination">Lamination</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">
                    Packaging Unit
                  </label>
                  <Input
                    required
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">
                    Current Quantity
                  </label>
                  <Input
                    type="number"
                    min="0"
                    required
                    value={editQty}
                    onChange={(e) => setEditQty(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">
                    Low Stock Threshold
                  </label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={editThreshold}
                    onChange={(e) => setEditThreshold(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">
                  Supplier Name
                </label>
                <Input
                  value={editSupplier}
                  onChange={(e) => setEditSupplier(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                  className="border-[#2B2F36]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#EAB308] hover:bg-[#CA8A04] text-[#121417] font-bold"
                >
                  Save Item Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / RESTOCK ITEM MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#1E2126] border border-[#2B2F36] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#EAB308]" />
                Add / Restock Consumable
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#9CA3AF] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Enter item details to register incoming paper reams or toner kits.
            </p>

            <form onSubmit={handleAddNewItem} className="space-y-4">
              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">
                  Item Description
                </label>
                <Input
                  required
                  placeholder="e.g. Century Star A4 Paper 75 GSM"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">
                    Category
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#121417] border border-[#2B2F36] text-white text-xs focus:border-[#EAB308] focus:outline-none"
                  >
                    <option value="Paper">Paper</option>
                    <option value="Special Paper">Special Paper</option>
                    <option value="Toner">Toner</option>
                    <option value="Binding">Binding</option>
                    <option value="Lamination">Lamination</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">
                    Packaging Unit
                  </label>
                  <Input
                    required
                    placeholder="e.g. Reams, Packs, Kits"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">
                    Opening Quantity
                  </label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">
                    Low Stock Threshold
                  </label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={newItemThreshold}
                    onChange={(e) => setNewItemThreshold(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">
                  Supplier Name
                </label>
                <Input
                  placeholder="e.g. Century Paper Distributors"
                  value={newItemSupplier}
                  onChange={(e) => setNewItemSupplier(e.target.value)}
                />
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
                  Save to Inventory
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
