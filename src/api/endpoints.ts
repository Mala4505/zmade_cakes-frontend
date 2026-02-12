// import apiClient from "./apiClient";

// // =====================
// // AUTH
// // =====================
// export const loginAdmin = async (password: string) => {
//   const response = await apiClient.post("/api/admin/login/", { password });
//   return response.data;
// };

// // =====================
// // ORDERS (ADMIN)
// // =====================
// export const getAdminOrders = async () => {
//   const response = await apiClient.get("/api/admin/orders/");
//   return response.data;
// };

// export const getAdminOrderById = async (id: number) => {
//   const response = await apiClient.get(`/api/admin/orders/${id}/`);
//   return response.data;
// };

// export const createAdminOrder = async (orderData: any) => {
//   const response = await apiClient.post("/api/admin/orders/", orderData);
//   return response.data;
// };

// export const updateAdminOrder = async (id: number, orderData: any) => {
//   const response = await apiClient.put(`/api/admin/orders/${id}/`, orderData);
//   return response.data;
// };

// export const deleteAdminOrder = async (id: number) => {
//   const response = await apiClient.delete(`/api/admin/orders/${id}/`);
//   return response.data;
// };

// // =====================
// // ORDER STATUS / PAYMENT
// // =====================
// export const updateOrderStatus = async (id: number, status: string) => {
//   const response = await apiClient.post(`/api/admin/orders/${id}/status/`, { status });
//   return response.data;
// };

// export const updateOrderPayment = async (id: number, paymentStatus: string) => {
//   const response = await apiClient.post(`/api/admin/orders/${id}/payment/`, { payment_status: paymentStatus });
//   return response.data;
// };

// export const generateInvoice = async (id: number) => {
//   const response = await apiClient.post(`/api/admin/orders/${id}/invoice/`);
//   return response.data;
// };


// // =====================
// // PUBLIC ENDPOINTS
// // =====================
// export const getOrderEdit = async (token: string) => {
//   const response = await apiClient.get(`/api/orders/edit/${token}/`);
//   return response.data;
// };

// export const updateOrderEdit = async (token: string, orderData: any) => {
//   const response = await apiClient.put(`/api/orders/edit/${token}/`, orderData);
//   return response.data;
// };

// export const getOrderView = async (token: string) => {
//   const response = await apiClient.get(`/api/orders/view/${token}/`);
//   return response.data;
// };

// // If you add a dedicated invoice view route in Django:
// export const getInvoiceView = async (token: string) => {
//   const response = await apiClient.get(`/api/invoice/${token}/`);
//   return response.data;
// };


// // =====================
// // NOTIFICATIONS
// // =====================

// export const getNotifications = async () => {
//   const response = await apiClient.get("/api/admin/notifications/");
//   return response.data;
// };

// export const markNotificationRead = async (id: number) => {
//   const response = await apiClient.post(`/api/admin/notifications/${id}/read/`);
//   return response.data;
// };

// export const markAllNotificationsRead = async () => {
//   const response = await apiClient.post("/api/admin/notifications/mark-all-read/");
//   return response.data;
// };


import apiClient from "./apiClient";

// =====================
// AUTH
// =====================
export const loginAdmin = async (username: string, password: string) => {
  const response = await apiClient.post("/api/auth/login/", { username, password });
  const { access, refresh } = response.data;
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
  return response.data;
};

export const logoutAdmin = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};

// =====================
// ORDERS (ADMIN)
// =====================
export const getAdminOrders = async () => {
  const response = await apiClient.get("/api/admin/orders/");
  return response.data;
};

export const getAdminOrderById = async (id: number) => {
  const response = await apiClient.get(`/api/admin/orders/${id}/`);
  return response.data;
};

export const createAdminOrder = async (orderData: any) => {
  const response = await apiClient.post("/api/admin/orders/", orderData);
  return response.data;
};

export const updateAdminOrder = async (id: number, orderData: any) => {
  const response = await apiClient.put(`/api/admin/orders/${id}/`, orderData);
  return response.data;
};

export const deleteAdminOrder = async (id: number) => {
  const response = await apiClient.delete(`/api/admin/orders/${id}/`);
  return response.data;
};

// =====================
// ORDER STATUS / PAYMENT
// =====================
export const updateOrderStatus = async (id: number, status: string) => {
  const response = await apiClient.post(`/api/admin/orders/${id}/status/`, { status });
  return response.data;
};

export const updateOrderPayment = async (id: number, paymentStatus: string) => {
  const response = await apiClient.post(`/api/admin/orders/${id}/payment/`, { payment_status: paymentStatus });
  return response.data;
};

export const generateInvoice = async (id: number) => {
  const response = await apiClient.post(`/api/admin/orders/${id}/invoice/`);
  return response.data;
};

// =====================
// PUBLIC ENDPOINTS
// =====================
export const getOrderEdit = async (token: string) => {
  const response = await apiClient.get(`/api/orders/edit/${token}/`);
  return response.data;
};

export const updateOrderEdit = async (token: string, orderData: any) => {
  const response = await apiClient.put(`/api/orders/edit/${token}/`, orderData);
  return response.data;
};

export const getOrderView = async (token: string) => {
  const response = await apiClient.get(`/api/orders/view/${token}/`);
  return response.data;
};

export const getInvoiceView = async (token: string) => {
  const response = await apiClient.get(`/api/invoice/${token}/`);
  return response.data;
};

// =====================
// NOTIFICATIONS
// =====================
export const getNotifications = async () => {
  const response = await apiClient.get("/api/admin/notifications/");
  return response.data;
};

export const markNotificationRead = async (id: number) => {
  const response = await apiClient.post(`/api/admin/notifications/${id}/read/`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await apiClient.post("/api/admin/notifications/mark-all-read/");
  return response.data;
};
