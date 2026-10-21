import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/roles';

export const getRolesApi = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    console.warn('Using local fallback for roles');
    return [];
  }
};

export const createRoleApi = async (data) => {
  try {
    const res = await axios.post(API_URL, data);
    return res.data;
  } catch (error) {
    return { ...data, _id: Date.now() };
  }
};

export const deleteRoleApi = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    return { id };
  }
};