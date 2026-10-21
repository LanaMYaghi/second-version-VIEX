// src/services/http.js
import { mockRequest } from "./mockServer.js";

export const USE_MOCK = true; // غيّريها لـ false لما يجهز الـ backend
const BASE_URL = "http://localhost:3000/api"; // غيّريه لعنوان الـ backend تبعك

// الطلب الحقيقي للسيرفر
const realRequest = async (path, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) throw new Error(data?.message || `Server Error (${res.status})`);
  return data;
};

// هاي اللي بتستوردها باقي الملفات (quizApi, authApi): بتختار mock أو حقيقي
export const request = (path, options) =>
  USE_MOCK ? mockRequest(path, options) : realRequest(path, options);
