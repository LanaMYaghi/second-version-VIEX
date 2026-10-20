// src/services/studentApi.js
import axios from 'axios';

const API_URL = 'https://api.example.com/api/v1/students';

// 1. إضافة طالب جديد
export const createStudentApi = async (studentData) => {
  try {
    const response = await axios.post(API_URL, studentData);
    return response.data;
  } catch (error) {
    console.warn('API Endpoint not ready (404), switching to local mode.');
    // إرجاع البيانات محلياً لتفادي توقف الصفحة
    return { ...studentData, id: Date.now(), status: 'active' };
  }
};

// 2. تغيير حالة الطالب (تفعيل / إيقاف)
export const toggleStudentStatusApi = async (studentId, newStatus) => {
  try {
    const response = await axios.patch(`${API_URL}/${studentId}/status`, { status: newStatus });
    return response.data;
  } catch (error) {
    console.warn('API status update (Local Mode)');
    return { id: studentId, status: newStatus };
  }
};

// 3. حذف طالب (للأدمن فقط)
export const deleteStudentApi = async (studentId) => {
  try {
    const response = await axios.delete(`${API_URL}/${studentId}`);
    return response.data;
  } catch (error) {
    console.warn('API delete (Local Mode)');
    return { id: studentId };
  }
};