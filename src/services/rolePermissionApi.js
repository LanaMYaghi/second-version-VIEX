import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/role-permissions';

// جلب الصلاحيات المرتبطة بدور محدد
export const getPermissionsByRoleApi = async (roleId) => {
  try {
    const res = await axios.get(`${API_URL}/role/${roleId}`);
    return res.data;
  } catch (error) {
    console.warn('Using local fallback for role permissions');
    return [];
  }
};

// ربط صلاحية بدور (إضافة)
export const assignPermissionApi = async (roleId, permissionId) => {
  try {
    const res = await axios.post(API_URL, { roleId, permissionId });
    return res.data;
  } catch (error) {
    return { roleId, permissionId };
  }
};

// إلغاء ربط صلاحية من دور (حذف)
export const removePermissionApi = async (roleId, permissionId) => {
  try {
    const res = await axios.delete(`${API_URL}`, { data: { roleId, permissionId } });
    return res.data;
  } catch (error) {
    return { roleId, permissionId };
  }
};