import api from "./apiClient.js";

// الباك بيرجّع { data: [...], pagination }
export const listInvoicesApi = async (params = { page: 1, limit: 20 }) => {
  const res = await api.get("/invoices", { params });
  return { invoices: res.data.data, pagination: res.data.pagination };
};

export const createInvoiceApi = async (payload) =>
  (await api.post("/invoices", payload)).data;

export const updateInvoiceApi = async (id, payload) =>
  (await api.patch(`/invoices/${id}`, payload)).data;

export const deleteInvoiceApi = async (id) =>
  (await api.delete(`/invoices/${id}`)).data;
