import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/user-permissions';

// جلب الصلاحيات الخاصة بمستخدم معين
export const getUserPermissionsApi = async (userId) => {
  try {
    const res = await axios.get(`${API_URL}/user/${userId}`);
    return res.data;
  } catch (error) {
    console.warn('Using local fallback for user permissions');
    return [];
  }
};

// إضافة أو تحديث صلاحية مباشرة لمستخدم (Allow / Deny)
export const saveUserPermissionApi = async (data) => {
  try {
    const res = await axios.post(API_URL, data); // يرسل { userId, permissionId, effect }
    return res.data;
  } catch (error) {
    return { ...data, _id: Date.now() };
  }
};

// حذف الاستثناء (إلغاء الصلاحية المباشرة)
export const deleteUserPermissionApi = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    return { id };
  }
};