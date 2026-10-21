// src/utils/permissions.js
export const getRole = () => localStorage.getItem("userRole");
export const getUserId = () => localStorage.getItem("userId");

// الجدول الوحيد اللي بيحدد مين بيعمل شو
const PERMISSIONS = {
  admin: ["quiz:view", "quiz:results"],
  secretary: ["quiz:view", "quiz:results"],
  teacher: [
    "quiz:view",
    "quiz:create",
    "quiz:edit",
    "quiz:delete",
    "quiz:results",
  ],
  student: ["quiz:take"],
};

export const can = (permission) =>
  PERMISSIONS[getRole()]?.includes(permission) ?? false;

export const homeFor = (role) =>
  role === "student" ? "/student/quizzes" : "/courses";
