import React, { useState } from "react";
import {
  Users,
  Printer,
  Plus,
  Phone,
  CheckCircle2,
  Edit2,
  Trash2,
  X
} from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useShop } from "../../lib/ShopContext";

export function EmployeesView() {
  const {
    employees,
    updateEmployee,
    addEmployee,
    deleteEmployee,
    toggleEmployeeDuty,
  } = useShop();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpRole, setNewEmpRole] = useState("Machine Operator");
  const [newEmpPhone, setNewEmpPhone] = useState("");
  const [newEmpShift, setNewEmpShift] = useState("Morning (8:00 AM - 4:00 PM)");
  const [newEmpStation, setNewEmpStation] = useState("Canon imageRUNNER 2630i");

  // Edit Employee Modal
  const [editingEmp, setEditingEmp] = useState(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("Machine Operator");
  const [editPhone, setEditPhone] = useState("");
  const [editShift, setEditShift] = useState("");
  const [editStation, setEditStation] = useState("");
  const [editImpressions, setEditImpressions] = useState(0);

  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const activeCount = employees.filter((e) => e.status === "On Duty").length;

  const handleOpenEdit = (emp) => {
    setEditingEmp(emp);
    setEditName(emp.name);
    setEditRole(emp.role);
    setEditPhone(emp.phone);
    setEditShift(emp.shift);
    setEditStation(emp.assignedMachine);
    setEditImpressions(emp.todayImpressions);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingEmp) return;

    const res = await updateEmployee(editingEmp.id, {
      name: editName,
      role: editRole,
      phone: editPhone,
      shift: editShift,
      assignedMachine: editStation,
      todayImpressions: Number(editImpressions) || 0,
    });

    if (res && res.success) {
      showToast(`Updated operator profile for "${editName}" in MongoDB Atlas!`);
      setEditingEmp(null);
    } else {
      alert(res?.message || "Failed to update employee in MongoDB Atlas.");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newEmpName) return;

    const res = await addEmployee({
      name: newEmpName,
      role: newEmpRole,
      phone: newEmpPhone || "+91 90000 00000",
      shift: newEmpShift,
      assignedMachine: newEmpStation,
      todayImpressions: 0,
    });

    if (res && res.success) {
      showToast(`Added "${newEmpName}" to staff team in MongoDB Atlas!`);
      setIsAddModalOpen(false);
      setNewEmpName("");
      setNewEmpPhone("");
    } else {
      alert(res?.message || "Failed to add employee to MongoDB Atlas.");
    }
  };

  const handleDeleteEmployee = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from shop staff?`)) {
      const res = await deleteEmployee(id);
      if (res && res.success) {
        showToast(`Removed ${name} from staff in MongoDB Atlas.`);
      } else {
        alert(res?.message || "Failed to delete employee from MongoDB Atlas.");
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
              STAFF MANAGEMENT
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {activeCount} Operators Currently On Duty
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#EAB308]" />
            Shop Operators & Staff Attendance
          </h1>
          <p className="text-sm text-[#9CA3AF]">
            Manage machine assignments, shift schedules, operator copy production counts and edit credentials.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#EAB308] hover:bg-[#CA8A04] text-[#121417] font-bold shadow-gold-glow"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Operator
        </Button>
      </div>

      {/* Staff Cards Grid with EDIT & DELETE Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {employees.map((emp) => (
          <Card
            key={emp.id}
            className={`transition-all duration-200 ${
              emp.status === "On Duty"
                ? "border-[#2B2F36] hover:border-[#EAB308]/50"
                : "border-[#2B2F36] opacity-75"
            }`}
          >
            <CardHeader className="pb-3 border-b border-[#2B2F36]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2B2F36] to-[#1E2126] border border-[#3A3F49] flex items-center justify-center font-bold text-[#EAB308] text-base">
                    {emp.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{emp.name}</h3>
                    <p className="text-xs text-[#9CA3AF]">{emp.role}</p>
                    <span className="text-[10px] text-[#6B7280] font-mono">
                      {emp.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Attendance toggle button */}
                  <button
                    onClick={() => toggleEmployeeDuty(emp.id)}
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all ${
                      emp.status === "On Duty"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                        : "bg-[#2B2F36] text-[#9CA3AF] border border-[#373C45] hover:text-white"
                    }`}
                  >
                    {emp.status === "On Duty" ? "● On Duty" : "○ Off Duty"}
                  </button>

                  {/* EDIT OPERATOR BUTTON */}
                  <button
                    onClick={() => handleOpenEdit(emp)}
                    className="p-1.5 text-xs rounded bg-[#2B2F36] hover:bg-[#EAB308]/20 hover:text-[#EAB308] text-[#9CA3AF] transition-colors"
                    title="Edit Operator Profile"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* DELETE OPERATOR BUTTON */}
                  <button
                    onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                    className="p-1.5 text-xs rounded bg-[#2B2F36] hover:bg-rose-500/20 hover:text-rose-400 text-[#9CA3AF] transition-colors"
                    title="Remove Operator"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-[#16181C] border border-[#2B2F36]">
                  <span className="text-[#9CA3AF] block">Shift Timings</span>
                  <span className="font-semibold text-white mt-0.5 block line-clamp-1">
                    {emp.shift}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#16181C] border border-[#2B2F36]">
                  <span className="text-[#9CA3AF] block">Assigned Station</span>
                  <span className="font-semibold text-[#EAB308] mt-0.5 block line-clamp-1">
                    {emp.assignedMachine}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#16181C] border border-[#2B2F36]">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-[#EAB308]" />
                  <span className="text-xs text-[#9CA3AF]">
                    Today's Copies Handled:
                  </span>
                </div>
                <span className="text-base font-extrabold text-[#EAB308]">
                  {Number(emp.todayImpressions).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#9CA3AF] pt-1">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  {emp.phone}
                </span>
                <span>With shop since {emp.joinDate}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* EDIT OPERATOR MODAL */}
      {editingEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#1E2126] border border-[#2B2F36] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#EAB308]" />
                Edit Operator Details
              </h2>
              <button
                onClick={() => setEditingEmp(null)}
                className="text-[#9CA3AF] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Update operator name, role, machine assignment and shift.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Full Name</label>
                <Input
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Job Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#121417] border border-[#2B2F36] text-white text-xs focus:border-[#EAB308] focus:outline-none"
                >
                  <option value="Senior Machine Operator">Senior Machine Operator</option>
                  <option value="Machine Operator">Machine Operator</option>
                  <option value="DTP Designer & Cashier">DTP Designer & Cashier</option>
                  <option value="Finishing & Binding Lead">Finishing & Binding Lead</option>
                  <option value="Trainee Assistant">Trainee Assistant</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">
                    Shift Timings
                  </label>
                  <Input
                    value={editShift}
                    onChange={(e) => setEditShift(e.target.value)}
                    placeholder="e.g. Morning (8 AM - 4 PM)"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">
                    Assigned Machine
                  </label>
                  <Input
                    value={editStation}
                    onChange={(e) => setEditStation(e.target.value)}
                    placeholder="e.g. Canon Copier"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">
                    Phone Number
                  </label>
                  <Input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">
                    Today's Copies
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={editImpressions}
                    onChange={(e) => setEditImpressions(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingEmp(null)}
                  className="border-[#2B2F36]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#EAB308] hover:bg-[#CA8A04] text-[#121417] font-bold"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD OPERATOR MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#1E2126] border border-[#2B2F36] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#EAB308]" />
                Add New Shop Employee
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#9CA3AF] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Register a new Xerox copier operator or desk assistant.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Full Name</label>
                <Input
                  required
                  placeholder="e.g. Anand R."
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Job Role</label>
                <select
                  value={newEmpRole}
                  onChange={(e) => setNewEmpRole(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#121417] border border-[#2B2F36] text-white text-xs focus:border-[#EAB308] focus:outline-none"
                >
                  <option value="Machine Operator">Machine Operator</option>
                  <option value="Senior Machine Operator">Senior Machine Operator</option>
                  <option value="DTP Designer">DTP Designer</option>
                  <option value="Cashier & Billing">Cashier & Billing</option>
                  <option value="Binding Specialist">Binding Specialist</option>
                  <option value="Trainee Assistant">Trainee Assistant</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">
                    Shift Timings
                  </label>
                  <Input
                    value={newEmpShift}
                    onChange={(e) => setNewEmpShift(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9CA3AF] block mb-1">
                    Assigned Station
                  </label>
                  <Input
                    value={newEmpStation}
                    onChange={(e) => setNewEmpStation(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Contact Phone</label>
                <Input
                  placeholder="+91 98765 43210"
                  value={newEmpPhone}
                  onChange={(e) => setNewEmpPhone(e.target.value)}
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
                  Save Employee
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
