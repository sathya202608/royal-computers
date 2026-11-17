const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: data.message || `Request failed with status ${res.status}`,
        status: res.status,
      };
    }
    return { success: true, ...data };
  } catch (error) {
    return {
      success: false,
      message: "Network connection issue. Please check your connection and try again.",
      networkError: true,
    };
  }
}

export const api = {
  // Health
  checkHealth: () => request("/health"),

  // Auth
  getCurrentAuth: () => request("/auth/current"),
  login: (id, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ id, password }),
    }),
  registerOwner: (data) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  sendPhoneOtp: (phone) =>
    request("/auth/send-phone-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),
  verifyPhoneOtp: (phone, otp) =>
    request("/auth/verify-phone-otp", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    }),
  sendOtp: (phoneOrEmail, userId) =>
    request("/auth/send-phone-otp", {
      method: "POST",
      body: JSON.stringify({ phone: phoneOrEmail, email: phoneOrEmail, userId }),
    }),
  verifyOtp: (otp, phoneOrEmail) =>
    request("/auth/verify-phone-otp", {
      method: "POST",
      body: JSON.stringify({ otp, phone: phoneOrEmail, email: phoneOrEmail }),
    }),
  resetPassword: (payloadOrTarget, newPassword, resetTokenOrOtp) => {
    let body = {};
    if (typeof payloadOrTarget === "object" && payloadOrTarget !== null) {
      body = payloadOrTarget;
    } else {
      body = {
        phone: payloadOrTarget,
        userId: payloadOrTarget,
        newPassword,
        resetToken: resetTokenOrOtp,
        otp: resetTokenOrOtp,
      };
    }
    return request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  updateProfile: (profileData) =>
    request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  // Shop Settings
  getShopSettings: () => request("/settings"),
  updateShopSettings: (settings) =>
    request("/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),

  // Rates
  getRates: () => request("/rates"),
  addRate: (categoryId, newRate) =>
    request(`/rates/${categoryId}/item`, {
      method: "POST",
      body: JSON.stringify(newRate),
    }),
  updateRate: (categoryId, rateId, updatedFields) =>
    request(`/rates/${categoryId}/item/${rateId}`, {
      method: "PUT",
      body: JSON.stringify(updatedFields),
    }),
  deleteRate: (categoryId, rateId) =>
    request(`/rates/${categoryId}/item/${rateId}`, {
      method: "DELETE",
    }),

  // Stock
  getStock: () => request("/stock"),
  addStock: (item) =>
    request("/stock", {
      method: "POST",
      body: JSON.stringify(item),
    }),
  updateStock: (id, fields) =>
    request(`/stock/${id}`, {
      method: "PUT",
      body: JSON.stringify(fields),
    }),
  adjustStock: (id, delta) =>
    request(`/stock/${id}/adjust`, {
      method: "PATCH",
      body: JSON.stringify({ delta }),
    }),
  deleteStock: (id) =>
    request(`/stock/${id}`, {
      method: "DELETE",
    }),

  // Employees
  getEmployees: () => request("/employees"),
  addEmployee: (emp) =>
    request("/employees", {
      method: "POST",
      body: JSON.stringify(emp),
    }),
  updateEmployee: (id, fields) =>
    request(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(fields),
    }),
  toggleEmployeeDuty: (id) =>
    request(`/employees/${id}/toggle-duty`, {
      method: "PATCH",
    }),
  deleteEmployee: (id) =>
    request(`/employees/${id}`, {
      method: "DELETE",
    }),

  // Bills
  getBills: () => request("/bills"),
  createBill: (billData) =>
    request("/bills", {
      method: "POST",
      body: JSON.stringify(billData),
    }),
  updateBill: (id, fields) =>
    request(`/bills/${id}`, {
      method: "PUT",
      body: JSON.stringify(fields),
    }),
  deleteBill: (id) =>
    request(`/bills/${id}`, {
      method: "DELETE",
    }),

  // Customers
  getCustomers: () => request("/customers"),
  getCustomer: (id) => request(`/customers/${id}`),
  addCustomer: (customerData) =>
    request("/customers", {
      method: "POST",
      body: JSON.stringify(customerData),
    }),
  updateCustomer: (id, fields) =>
    request(`/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(fields),
    }),
  deleteCustomer: (id) =>
    request(`/customers/${id}`, {
      method: "DELETE",
    }),
};
