import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1';

// دالة مساعدة لجلب التوكن المخزن
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// 1. تسجيل الدخول (للعامة)
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 2. إنشاء طالب جديد (للأدمن/السكرتير)
export const createStudentApi = async (studentData) => {
  try {
    const response = await axios.post(`${API_URL}/students`, studentData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 3. إنشاء أستاذ جديد (للأدمن/السكرتير)
export const createTeacherApi = async (teacherData) => {
  try {
    const response = await axios.post(`${API_URL}/teachers`, teacherData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 4. إنشاء موظف جديد (للأدمن حصراً)
export const createEmployeeApi = async (employeeData) => {
  try {
    const response = await axios.post(`${API_URL}/employees`, employeeData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};