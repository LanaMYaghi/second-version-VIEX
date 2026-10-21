import api from "./apiClient.js";

// type = "students" | "teachers" | "employees"
export const listUsersApi = async (type) =>
  (await api.get(`/${type}`)).data.data[type];

export const createUserApi = async (type, payload) =>
  (await api.post(`/${type}`, payload)).data;

export const updateUserApi = async (type, id, payload) =>
  (await api.patch(`/${type}/${id}`, payload)).data;

export const setUserStatusApi = async (type, id, status) =>
  (await api.patch(`/${type}/${id}/status`, { status })).data;

export const deleteUserApi = async (type, id) =>
  (await api.delete(`/${type}/${id}`)).data;
