// src/services/quizApi.js
import { request } from "./http";

export const fetchCourseQuizzes = (courseId) =>
  request(`/courses/${courseId}/quizzes`);
export const fetchQuiz = (quizId) => request(`/quizzes/${quizId}`); // مع questions و answers

export const createQuiz = ({ title, courseId }) =>
  request("/quizzes", {
    method: "POST",
    body: JSON.stringify({ title, courseId }),
  });

export const updateQuiz = (quizId, { title }) =>
  request(`/quizzes/${quizId}`, {
    method: "PUT",
    body: JSON.stringify({ title }),
  });

export const deleteQuiz = (quizId) =>
  request(`/quizzes/${quizId}`, { method: "DELETE" });

// data = { question: "...", answers: [{ option: "...", isCorrect: true }, ...] }
export const addQuestion = (quizId, data) =>
  request(`/quizzes/${quizId}/questions`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateQuestion = (quizId, questionId, data) =>
  request(`/quizzes/${quizId}/questions/${questionId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteQuestion = (quizId, questionId) =>
  request(`/quizzes/${quizId}/questions/${questionId}`, { method: "DELETE" });

// الطالب
export const fetchStudentQuizzes = () => request("/student/quizzes");
export const fetchQuizToTake = (quizId) => request(`/quizzes/${quizId}/take`);

// answers = [{ questionId, answerId }]
export const submitQuiz = (quizId, answers) =>
  request(`/quizzes/${quizId}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });

export const fetchQuizResults = (quizId) =>
  request(`/quizzes/${quizId}/results`);
