// src/services/authApi.js
import axios from 'axios';

// استبدلي هذا المسار بمسار الـ API الخاص بكِ
const API_URL = 'https://api.example.com/api/v1/auth';

// 1. دالة إنشاء حساب جديد (Register)
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 2. دالة تسجيل الدخول (Login)
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};