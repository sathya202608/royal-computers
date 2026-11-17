import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "./api";

const ShopContext = createContext(null);

export const DEFAULT_AUTH = {
  ownerId: "RC2024",
  password: "password123",
  premierKey: "ROYAL777",
  ownerName: "K. Rajasekaran",
  phone: "75981 88737",
  email: "grkroyalcomputers@gmail.com",
};

export const DEFAULT_SHOP_SETTINGS = {
  shopName: "Royal Computers Xerox Shop",
  established: "2012",
  tagline: "Complete Shop Management System",
  subTagline: "Billing · Stock · Employees · Reports",
  address: "142 College High Road, Opposite Arts College, Pin 600028",
  gstNumber: "33AAAAA0000A1Z5",
  upiId: "royalcomputers@okaxis",
  phone: "75981 88737",
  email: "royalcomputers.xerox@gmail.com",
  services: [
    { id: "s1", name: "Digital Printing & Photocopy", icon: "🖨️" },
    { id: "s2", name: "Binding & Lamination", icon: "📑" },
    { id: "s3", name: "ID Cards & Scanning", icon: "🎴" },
    { id: "s4", name: "DTP & Design Services", icon: "🖥️" },
  ],
};

export function ShopProvider({ children }) {
  const [dbConnected, setDbConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // States populated exclusively from MongoDB Atlas
  const [authData, setAuthData] = useState(DEFAULT_AUTH);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("rc_authenticated") === "true";
  });
  const [shopSettings, setShopSettings] = useState(DEFAULT_SHOP_SETTINGS);
  const [ratesData, setRatesData] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [billsHistory, setBillsHistory] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Fetch all live data directly from MongoDB Atlas
  const refreshFromBackend = useCallback(async () => {
    setLoading(true);
    try {
      const health = await api.checkHealth();
      if (health.success && health.status === "ok") {
        setDbConnected(true);

        const [authRes, settingsRes, ratesRes, stockRes, empRes, billsRes, custRes] =
          await Promise.all([
            api.getCurrentAuth(),
            api.getShopSettings(),
            api.getRates(),
            api.getStock(),
            api.getEmployees(),
            api.getBills(),
            api.getCustomers(),
          ]);

        if (authRes.success && authRes.data) {
          setAuthData((prev) => ({ ...prev, ...authRes.data }));
        }
        if (settingsRes.success && settingsRes.data) {
          setShopSettings(settingsRes.data);
        }
        if (ratesRes.success && Array.isArray(ratesRes.data)) {
          setRatesData(ratesRes.data);
        }
        if (stockRes.success && Array.isArray(stockRes.data)) {
          setStockList(stockRes.data);
        }
        if (empRes.success && Array.isArray(empRes.data)) {
          setEmployees(empRes.data);
        }
        if (billsRes.success && Array.isArray(billsRes.data)) {
          setBillsHistory(billsRes.data);
        }
        if (custRes.success && Array.isArray(custRes.data)) {
          setCustomers(custRes.data);
        }
      } else {
        setDbConnected(false);
      }
    } catch (err) {
      console.error("MongoDB Atlas connection error:", err);
      setDbConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFromBackend();
  }, [refreshFromBackend]);

  // Auth Functions (MongoDB Atlas)
  const login = async (id, pwd) => {
    try {
      const res = await api.login(id, pwd);
      if (res.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("rc_authenticated", "true");
        if (res.data) {
          setAuthData((prev) => ({ ...prev, ...res.data, password: pwd }));
        }
        return { success: true };
      }
      return { success: false, message: res.message || "Invalid credentials." };
    } catch (err) {
      return { success: false, message: err.message || "Failed to reach MongoDB server." };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("rc_authenticated");
  };

  const sendPhoneOtp = async (phone) => {
    const targetPhone = (phone || authData?.phone || "75981 88737").toString().trim();
    return await api.sendPhoneOtp(targetPhone);
  };

  const verifyPhoneOtp = async (phone, otp) => {
    const cleanOtp = (otp || "").toString().trim();
    if (!cleanOtp) {
      return { success: false, message: "Please enter the 6-digit OTP code." };
    }
    return await api.verifyPhoneOtp(phone, cleanOtp);
  };

  const sendOtp = async (phoneOrEmail, userId) => {
    return await sendPhoneOtp(phoneOrEmail);
  };

  const verifyOtp = async (otp, phoneOrEmail) => {
    return await verifyPhoneOtp(phoneOrEmail, otp);
  };

  const resetPassword = async (phoneOrPayload, newPassword, resetTokenOrOtp = null) => {
    const res = await api.resetPassword(phoneOrPayload, newPassword, resetTokenOrOtp);
    if (!res.success) {
      return { success: false, message: res.message || "Failed to reset password in MongoDB Atlas." };
    }
    setAuthData((prev) => ({
      ...prev,
      password: newPassword,
    }));
    return { success: true, message: res.message || "Password updated successfully in MongoDB Atlas!" };
  };

  const resetPasswordWithPremierKey = async (ownerIdInput, premierKeyInput, newPassword) => {
    return resetPassword(ownerIdInput, newPassword, premierKeyInput);
  };

  const registerOwner = async (newData) => {
    const finalUserId = (newData.username || newData.ownerId || "").trim();
    const finalPassword = newData.password;

    const res = await api.registerOwner({
      fullName: newData.fullName,
      ownerId: finalUserId,
      phone: newData.phone,
      email: newData.email,
      password: finalPassword,
    });
    if (!res.success) {
      return { success: false, message: res.message || "Failed to create account in MongoDB Atlas." };
    }
    if (res.data) {
      setAuthData((prev) => ({
        ...prev,
        ...res.data,
        password: finalPassword,
      }));
    }
    setIsAuthenticated(true);
    sessionStorage.setItem("rc_authenticated", "true");
    return { success: true, message: "Account created successfully in MongoDB Atlas!" };
  };

  const updateProfile = async (profileData) => {
    const res = await api.updateProfile(profileData);
    if (!res.success) {
      return { success: false, message: res.message || "Failed to update profile in MongoDB Atlas." };
    }
    if (res.auth) {
      setAuthData((prev) => ({ ...prev, ...res.auth }));
    }
    if (res.shopSettings) {
      setShopSettings(res.shopSettings);
    }
    return { success: true, message: res.message || "Profile updated successfully in MongoDB Atlas!" };
  };

  const updateShopSettings = async (settings) => {
    const res = await api.updateShopSettings(settings);
    if (!res.success) {
      return { success: false, message: res.message || "Failed to update settings in MongoDB Atlas." };
    }
    if (res.data) {
      setShopSettings(res.data);
    }
    return { success: true, message: res.message || "Shop settings updated in MongoDB Atlas!" };
  };

  // Customers Management (MongoDB Atlas)
  const addCustomer = async (customerData) => {
    const res = await api.addCustomer(customerData);
    if (res && res.success && res.data) {
      setCustomers((prev) => [res.data, ...prev]);
      return { success: true, data: res.data, message: res.message };
    }
    return { success: false, message: res?.message || "Failed to save customer to MongoDB Atlas." };
  };

  const updateCustomer = async (id, updatedFields) => {
    const res = await api.updateCustomer(id, updatedFields);
    if (res && res.success && res.data) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === id || c._id === id ? res.data : c))
      );
      return { success: true, data: res.data, message: res.message };
    }
    return { success: false, message: res?.message || "Failed to update customer in MongoDB Atlas." };
  };

  const deleteCustomer = async (id) => {
    const res = await api.deleteCustomer(id);
    if (res && res.success) {
      setCustomers((prev) => prev.filter((c) => c.id !== id && c._id !== id));
      return { success: true, message: res.message };
    }
    return { success: false, message: res?.message || "Failed to delete customer from MongoDB Atlas." };
  };

  // Bills Management (MongoDB Atlas)
  const addBill = async (bill) => {
    const res = await api.createBill(bill);
    if (res && res.success && res.data) {
      setBillsHistory((prev) => [res.data, ...prev]);
      // Silently refresh customers list to reflect visit & spending updates
      api.getCustomers().then((cRes) => {
        if (cRes.success && Array.isArray(cRes.data)) setCustomers(cRes.data);
      }).catch(() => {});
      return { success: true, data: res.data };
    }
    return { success: false, message: res?.message || "Failed to save bill to MongoDB Atlas." };
  };

  const updateBill = async (id, updatedFields) => {
    const res = await api.updateBill(id, updatedFields);
    if (res && res.success && res.data) {
      setBillsHistory((prev) =>
        prev.map((b) => (b.id === id || b._id === id ? res.data : b))
      );
      return { success: true, data: res.data };
    }
    return { success: false, message: res?.message || "Failed to update bill in MongoDB Atlas." };
  };

  const deleteBill = async (id) => {
    const res = await api.deleteBill(id);
    if (res && res.success) {
      setBillsHistory((prev) => prev.filter((b) => b.id !== id && b._id !== id));
      return { success: true };
    }
    return { success: false, message: res?.message || "Failed to delete bill from MongoDB Atlas." };
  };

  // Stock Management (MongoDB Atlas)
  const addStockItem = async (newItem) => {
    const res = await api.addStock(newItem);
    if (res && res.success && res.data) {
      setStockList((prev) => [res.data, ...prev]);
      return { success: true, data: res.data };
    }
    return { success: false, message: res?.message || "Failed to save stock item to MongoDB Atlas." };
  };

  const updateStockItem = async (id, updatedFields) => {
    const res = await api.updateStock(id, updatedFields);
    if (res && res.success && res.data) {
      setStockList((prev) =>
        prev.map((item) => (item.id === id || item._id === id ? res.data : item))
      );
      return { success: true, data: res.data };
    }
    return { success: false, message: res?.message || "Failed to update stock in MongoDB Atlas." };
  };

  const adjustStockQty = async (id, delta) => {
    const res = await api.adjustStock(id, delta);
    if (res && res.success && res.data) {
      setStockList((prev) =>
        prev.map((item) => (item.id === id || item._id === id ? res.data : item))
      );
      return { success: true, data: res.data };
    }
    return { success: false, message: res?.message || "Failed to adjust stock in MongoDB Atlas." };
  };

  const deleteStockItem = async (id) => {
    const res = await api.deleteStock(id);
    if (res && res.success) {
      setStockList((prev) => prev.filter((item) => item.id !== id && item._id !== id));
      return { success: true };
    }
    return { success: false, message: res?.message || "Failed to delete stock from MongoDB Atlas." };
  };

  // Employees Management (MongoDB Atlas)
  const addEmployee = async (newEmp) => {
    const res = await api.addEmployee(newEmp);
    if (res && res.success && res.data) {
      setEmployees((prev) => [...prev, res.data]);
      return { success: true, data: res.data };
    }
    return { success: false, message: res?.message || "Failed to save employee to MongoDB Atlas." };
  };

  const updateEmployee = async (id, updatedFields) => {
    const res = await api.updateEmployee(id, updatedFields);
    if (res && res.success && res.data) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === id || emp._id === id ? res.data : emp))
      );
      return { success: true, data: res.data };
    }
    return { success: false, message: res?.message || "Failed to update employee in MongoDB Atlas." };
  };

  const deleteEmployee = async (id) => {
    const res = await api.deleteEmployee(id);
    if (res && res.success) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id && emp._id !== id));
      return { success: true };
    }
    return { success: false, message: res?.message || "Failed to delete employee from MongoDB Atlas." };
  };

  const toggleEmployeeDuty = async (id) => {
    const res = await api.toggleEmployeeDuty(id);
    if (res && res.success && res.data) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === id || emp._id === id ? res.data : emp))
      );
      return { success: true, data: res.data };
    }
    return { success: false, message: res?.message || "Failed to toggle duty in MongoDB Atlas." };
  };

  // Rates Management (MongoDB Atlas)
  const addRate = async (categoryId, newRate) => {
    const res = await api.addRate(categoryId, newRate);
    if (res && res.success && res.data) {
      setRatesData((prev) =>
        prev.map((cat) => (cat.id === categoryId ? res.data : cat))
      );
      return { success: true, data: res.data };
    }
    return { success: false, message: res?.message || "Failed to save rate to MongoDB Atlas." };
  };

  const updateRate = async (categoryId, rateId, updatedFields) => {
    const res = await api.updateRate(categoryId, rateId, updatedFields);
    if (res && res.success && res.data) {
      setRatesData((prev) =>
        prev.map((cat) => (cat.id === categoryId ? res.data : cat))
      );
      return { success: true, data: res.data };
    }
    return { success: false, message: res?.message || "Failed to update rate in MongoDB Atlas." };
  };

  const deleteRate = async (categoryId, rateId) => {
    const res = await api.deleteRate(categoryId, rateId);
    if (res && res.success && res.data) {
      setRatesData((prev) =>
        prev.map((cat) => (cat.id === categoryId ? res.data : cat))
      );
      return { success: true, data: res.data };
    }
    return { success: false, message: res?.message || "Failed to delete rate from MongoDB Atlas." };
  };

  return (
    <ShopContext.Provider
      value={{
        dbConnected,
        loading,
        refreshFromBackend,
        authData,
        isAuthenticated,
        shopSettings,
        ratesData,
        stockList,
        employees,
        billsHistory,
        customers,
        login,
        logout,
        sendOtp,
        verifyOtp,
        sendPhoneOtp,
        verifyPhoneOtp,
        resetPassword,
        resetPasswordWithPremierKey,
        registerOwner,
        updateProfile,
        updateShopSettings,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        updateRate,
        addRate,
        deleteRate,
        updateStockItem,
        addStockItem,
        deleteStockItem,
        adjustStockQty,
        updateEmployee,
        addEmployee,
        deleteEmployee,
        toggleEmployeeDuty,
        addBill,
        updateBill,
        deleteBill,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
