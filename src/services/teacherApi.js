// src/services/teacherApi.js
import axios from 'axios';

const API_URL = 'https://api.example.com/api/v1/teachers';

// 1. إضافة أستاذ بواسطة السكرتيرة
export const addTeacherApi = async (teacherData) => {
  try {
    const response = await axios.post(API_URL, teacherData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 2. تغيير حالة الأستاذ (تفعيل / إيقاف - للسكرتيرة والأدمن)
export const toggleTeacherStatusApi = async (teacherId, newStatus) => {
  try {
    const response = await axios.patch(`${API_URL}/${teacherId}/status`, { status: newStatus });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 3. حذف أستاذ (للأدمن فقط)
export const deleteTeacherApi = async (teacherId) => {
  try {
    const response = await axios.delete(`${API_URL}/${teacherId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};