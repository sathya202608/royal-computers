import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  UserCheck
} from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import { useShop } from "../../lib/ShopContext";

export function CustomersView() {
  const { customers, addCustomer, updateCustomer, deleteCustomer, dbConnected } = useShop();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Add Customer Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCategory, setNewCategory] = useState("Regular");
  const [newNotes, setNewNotes] = useState("");

  // Edit Customer Modal
  const [editingCust, setEditingCust] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCategory, setEditCategory] = useState("Regular");
  const [editNotes, setEditNotes] = useState("");
  const [editVisits, setEditVisits] = useState(1);
  const [editSpent, setEditSpent] = useState(0);

  // Status Alerts
  const [toastMessage, setToastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setErrorMessage("");
    setTimeout(() => setToastMessage(""), 4000);
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setToastMessage("");
    setTimeout(() => setErrorMessage(""), 6000);
  };

  // Filter customers
  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.phone?.includes(searchTerm) ||
      cust.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || cust.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate Metrics
  const totalCustomers = customers.length;
  const regularCount = customers.filter((c) => c.category === "Regular").length;
  const totalVisits = customers.reduce((sum, c) => sum + (Number(c.totalVisits) || 0), 0);
  const totalSpent = customers.reduce((sum, c) => sum + (Number(c.totalSpent) || 0), 0);

  // Handle Add Customer (MongoDB Atlas)
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      showError("Customer Name and Phone Number are required.");
      return;
    }

    const res = await addCustomer({
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim(),
      address: newAddress.trim(),
      category: newCategory,
      notes: newNotes.trim(),
      totalVisits: 1,
      totalSpent: 0,
    });

    if (res.success) {
      showToast(`Customer "${newName}" successfully inserted into MongoDB Atlas!`);
      setIsAddModalOpen(false);
      setNewName("");
      setNewPhone("");
      setNewEmail("");
      setNewAddress("");
      setNewCategory("Regular");
      setNewNotes("");
    } else {
      showError(res.message || "Failed to save customer to MongoDB Atlas.");
    }
  };

  // Open Edit Modal
  const openEditModal = (cust) => {
    setEditingCust(cust);
    setEditName(cust.name || "");
    setEditPhone(cust.phone || "");
    setEditEmail(cust.email || "");
    setEditAddress(cust.address || "");
    setEditCategory(cust.category || "Regular");
    setEditNotes(cust.notes || "");
    setEditVisits(cust.totalVisits || 1);
    setEditSpent(cust.totalSpent || 0);
  };

  // Handle Update Customer (MongoDB Atlas)
  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editPhone.trim()) {
      showError("Customer Name and Phone Number are required.");
      return;
    }

    const res = await updateCustomer(editingCust.id || editingCust._id, {
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      address: editAddress.trim(),
      category: editCategory,
      notes: editNotes.trim(),
      totalVisits: Number(editVisits),
      totalSpent: Number(editSpent),
    });

    if (res.success) {
      showToast(`Customer "${editName}" updated in MongoDB Atlas!`);
      setEditingCust(null);
    } else {
      showError(res.message || "Failed to update customer in MongoDB Atlas.");
    }
  };

  // Handle Delete Customer (MongoDB Atlas)
  const handleDeleteCustomer = async (cust) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete customer "${cust.name}" (${cust.id}) from MongoDB Atlas?`
    );
    if (!confirmDelete) return;

    const res = await deleteCustomer(cust.id || cust._id);
    if (res.success) {
      showToast(`Customer "${cust.name}" successfully deleted from MongoDB Atlas!`);
    } else {
      showError(res.message || "Failed to delete customer from MongoDB Atlas.");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast & Error Alerts */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-emerald-950 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-red-950 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl shadow-2xl">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span className="text-sm font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#EAB308]" />
            Customer Directory & Accounts
          </h1>
          <p className="text-sm text-[#9CA3AF]">
            Directly connected to MongoDB Atlas &bull; Manage student, corporate and regular client profiles
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#EAB308] hover:bg-[#CA8A04] text-[#121417] font-bold shadow-gold-glow flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Customer</span>
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#16181D] border-[#2B2F36]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Total Customers
              </p>
              <h3 className="text-2xl font-black text-white mt-1">{totalCustomers}</h3>
              <p className="text-[11px] text-[#EAB308] mt-0.5">Stored in Atlas</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#EAB308]/15 border border-[#EAB308]/30 flex items-center justify-center text-[#EAB308]">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#16181D] border-[#2B2F36]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Regular Accounts
              </p>
              <h3 className="text-2xl font-black text-white mt-1">{regularCount}</h3>
              <p className="text-[11px] text-emerald-400 mt-0.5">Frequent clients</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#16181D] border-[#2B2F36]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Total Orders / Visits
              </p>
              <h3 className="text-2xl font-black text-white mt-1">{totalVisits}</h3>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">Cumulative shop visits</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#16181D] border-[#2B2F36]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Total Customer Revenue
              </p>
              <h3 className="text-2xl font-black text-[#EAB308] mt-1">₹ {totalSpent.toLocaleString()}</h3>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">Lifetime billed</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <DollarSign className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Category Filter Bar */}
      <Card className="bg-[#16181D] border-[#2B2F36]">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#9CA3AF]" />
            <Input
              placeholder="Search by customer name, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-[#1E2126] border-[#2B2F36] text-white focus:border-[#EAB308]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {["All", "Regular", "Student", "Corporate", "Walk-in", "VIP"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#EAB308] text-[#121417] shadow-sm font-bold"
                    : "bg-[#1E2126] text-[#9CA3AF] hover:text-white border border-[#2B2F36]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card className="bg-[#16181D] border-[#2B2F36] shadow-card-dark">
        <CardHeader className="py-4 px-6 border-b border-[#2B2F36] flex flex-row items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Customer Records</span>
            <Badge variant="outline" className="text-xs text-[#EAB308] border-[#EAB308]/40">
              {filteredCustomers.length} Found
            </Badge>
          </h2>
          <span className="text-xs text-[#9CA3AF]">
            {dbConnected ? "🟢 Synced with Atlas" : "🔴 Disconnected"}
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#2B2F36] bg-[#1E2126]/40 hover:bg-transparent">
                  <TableHead className="text-xs font-bold text-[#9CA3AF] py-3 pl-6">ID</TableHead>
                  <TableHead className="text-xs font-bold text-[#9CA3AF] py-3">Customer Name</TableHead>
                  <TableHead className="text-xs font-bold text-[#9CA3AF] py-3">Phone</TableHead>
                  <TableHead className="text-xs font-bold text-[#9CA3AF] py-3">Category</TableHead>
                  <TableHead className="text-xs font-bold text-[#9CA3AF] py-3">Visits</TableHead>
                  <TableHead className="text-xs font-bold text-[#9CA3AF] py-3">Total Spent</TableHead>
                  <TableHead className="text-xs font-bold text-[#9CA3AF] py-3">Address / Notes</TableHead>
                  <TableHead className="text-xs font-bold text-[#9CA3AF] py-3 pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-[#9CA3AF]">
                      <Users className="w-10 h-10 mx-auto text-[#4B5563] mb-2" />
                      <p className="text-sm font-semibold">No customers found</p>
                      <p className="text-xs mt-1">Click "Add New Customer" above to create one in MongoDB Atlas.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((cust) => (
                    <TableRow
                      key={cust.id || cust._id}
                      className="border-b border-[#2B2F36] hover:bg-[#1E2126]/60 transition-colors"
                    >
                      <TableCell className="pl-6 font-mono text-xs text-[#EAB308] font-bold">
                        {cust.id}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-white text-sm">{cust.name}</div>
                        {cust.email && (
                          <div className="text-xs text-[#9CA3AF] flex items-center gap-1">
                            <Mail className="w-3 h-3 text-[#6B7280]" />
                            {cust.email}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-white font-medium flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#EAB308]" />
                          {cust.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            cust.category === "Corporate"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                              : cust.category === "Student"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                              : cust.category === "VIP"
                              ? "bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/40"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          }
                        >
                          {cust.category || "Regular"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-white font-semibold">
                        {cust.totalVisits || 1}
                      </TableCell>
                      <TableCell className="text-xs text-[#EAB308] font-black">
                        ₹ {(cust.totalSpent || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs text-[#9CA3AF] max-w-xs truncate">
                        {cust.address || cust.notes || "—"}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(cust)}
                            className="h-8 px-2.5 text-[#9CA3AF] hover:text-[#EAB308] hover:bg-[#EAB308]/10"
                            title="Edit customer in MongoDB Atlas"
                          >
                            <Edit2 className="w-3.5 h-3.5 mr-1" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCustomer(cust)}
                            className="h-8 px-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            title="Delete customer from MongoDB Atlas"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            <span>Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ADD CUSTOMER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#16181D] border border-[#2B2F36] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2B2F36] pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#EAB308]" />
                <span>Add Customer to MongoDB Atlas</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#9CA3AF] hover:text-white p-1 rounded-lg hover:bg-[#20242B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                  Customer Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-[#1E2126] border-[#2B2F36] text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                    Phone Number *
                  </label>
                  <Input
                    required
                    placeholder="e.g. 98412 34567"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="bg-[#1E2126] border-[#2B2F36] text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#1E2126] border border-[#2B2F36] text-white text-sm focus:border-[#EAB308] outline-none"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Student">Student</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                  Email Address (Optional)
                </label>
                <Input
                  type="email"
                  placeholder="e.g. ramesh@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-[#1E2126] border-[#2B2F36] text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                  Address / Department (Optional)
                </label>
                <Input
                  placeholder="e.g. Govt Arts College, BCA Dept"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="bg-[#1E2126] border-[#2B2F36] text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Special instructions or account details..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1E2126] border border-[#2B2F36] text-white text-sm focus:border-[#EAB308] outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2B2F36]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="border-[#2B2F36] text-[#9CA3AF] hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#EAB308] hover:bg-[#CA8A04] text-[#121417] font-bold"
                >
                  Save to MongoDB Atlas
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CUSTOMER MODAL */}
      {editingCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#16181D] border border-[#2B2F36] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2B2F36] pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#EAB308]" />
                <span>Edit Customer: {editingCust.id}</span>
              </h3>
              <button
                onClick={() => setEditingCust(null)}
                className="text-[#9CA3AF] hover:text-white p-1 rounded-lg hover:bg-[#20242B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCustomer} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                  Customer Name *
                </label>
                <Input
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-[#1E2126] border-[#2B2F36] text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                    Phone Number *
                  </label>
                  <Input
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="bg-[#1E2126] border-[#2B2F36] text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#1E2126] border border-[#2B2F36] text-white text-sm focus:border-[#EAB308] outline-none"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Student">Student</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="bg-[#1E2126] border-[#2B2F36] text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                  Address / Department
                </label>
                <Input
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="bg-[#1E2126] border-[#2B2F36] text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                    Total Visits
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={editVisits}
                    onChange={(e) => setEditVisits(e.target.value)}
                    className="bg-[#1E2126] border-[#2B2F36] text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                    Total Spent (₹)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={editSpent}
                    onChange={(e) => setEditSpent(e.target.value)}
                    className="bg-[#1E2126] border-[#2B2F36] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1E2126] border border-[#2B2F36] text-white text-sm focus:border-[#EAB308] outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2B2F36]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingCust(null)}
                  className="border-[#2B2F36] text-[#9CA3AF] hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#EAB308] hover:bg-[#CA8A04] text-[#121417] font-bold"
                >
                  Update in MongoDB Atlas
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

