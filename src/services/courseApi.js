import api from "./apiClient.js";

export const listCoursesApi = async () =>
  (await api.get("/courses")).data.data.courses;

export const createCourseApi = async (payload) =>
  (await api.post("/courses", payload)).data;

export const updateCourseApi = async (id, payload) =>
  (await api.patch(`/courses/${id}`, payload)).data;

export const deleteCourseApi = async (id) =>
  (await api.delete(`/courses/${id}`)).data;

export const enrollStudentApi = async (courseId, studentId) =>
  (await api.post(`/courses/${courseId}/students/${studentId}`)).data;

export const unenrollStudentApi = async (courseId, studentId) =>
  (await api.delete(`/courses/${courseId}/students/${studentId}`)).data;
