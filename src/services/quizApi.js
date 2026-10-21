import api from "./apiClient.js";

const base = (courseId) => `/courses/${courseId}/quizzes`;

export const listQuizzesApi = async (courseId) =>
  (await api.get(base(courseId))).data.data.quizzes;

export const getQuizApi = async (courseId, quizId) =>
  (await api.get(`${base(courseId)}/${quizId}`)).data.data.quiz;

export const createQuizApi = async (courseId, payload) =>
  (await api.post(base(courseId), payload)).data;

export const updateQuizApi = async (courseId, quizId, payload) =>
  (await api.patch(`${base(courseId)}/${quizId}`, payload)).data;

export const deleteQuizApi = async (courseId, quizId) =>
  (await api.delete(`${base(courseId)}/${quizId}`)).data;

export const addQuestionApi = async (courseId, quizId, payload) =>
  (await api.post(`${base(courseId)}/${quizId}/questions`, payload)).data;

export const updateQuestionApi = async (courseId, quizId, questionId, payload) =>
  (await api.patch(`${base(courseId)}/${quizId}/questions/${questionId}`, payload)).data;

export const deleteQuestionApi = async (courseId, quizId, questionId) =>
  (await api.delete(`${base(courseId)}/${quizId}/questions/${questionId}`)).data;

// ===== جهة الطالب =====
export const submitAttemptApi = async (quizId, answers) =>
  (await api.post(`/quizzes/${quizId}/attempts`, { answers })).data.data;

// بيرجّع null إذا ما في محاولة (404)
export const getMyAttemptApi = async (quizId) => {
  try {
    return (await api.get(`/quizzes/${quizId}/attempts/me`)).data.data.attempt;
  } catch (e) {
    if (e.status === 404) return null;
    throw e;
  }
};
