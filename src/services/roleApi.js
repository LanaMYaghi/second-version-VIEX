import api from "./apiClient.js";

export const listRolesApi = async () => (await api.get("/roles")).data.data.roles;
export const createRoleApi = async (d) => (await api.post("/roles", d)).data;
export const updateRoleApi = async (id, d) => (await api.patch(`/roles/${id}`, d)).data;
export const deleteRoleApi = async (id) => (await api.delete(`/roles/${id}`)).data;

export const listPermissionsApi = async () =>
  (await api.get("/permissions")).data.data.permissions;
export const getRolePermissionsApi = async (id) =>
  (await api.get(`/roles/${id}/permissions`)).data.data.permissionIds;
export const setRolePermissionsApi = async (id, permissionIds) =>
  (await api.put(`/roles/${id}/permissions`, { permissionIds })).data;

export const getUserOverridesApi = async (userId) =>
  (await api.get(`/user-permissions/user/${userId}`)).data.data.overrides;
export const saveUserOverrideApi = async (d) =>
  (await api.post("/user-permissions", d)).data;
export const deleteUserOverrideApi = async (id) =>
  (await api.delete(`/user-permissions/${id}`)).data;
