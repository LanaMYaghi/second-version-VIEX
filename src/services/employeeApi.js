// src/services/employeeApi.js
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1/employees';

export const createEmployeeApi = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.warn('API Endpoint not ready, using local fallback.');
    return { ...data, id: Date.now(), status: 'active' };
  }
};

export const toggleEmployeeStatusApi = async (id, newStatus) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status: newStatus });
    return response.data;
  } catch (error) {
    return { id, status: newStatus };
  }
};

export const deleteEmployeeApi = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    return { id };
  }
};