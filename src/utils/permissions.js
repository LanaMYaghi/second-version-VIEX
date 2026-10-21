function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export const getRole = () => localStorage.getItem("userRole") || "";

export const getPermissions = () => read("userPermissions", []);

// للشكل فقط (إخفاء/إظهار أزرار). الحماية الحقيقية بالباك.
export const can = (permission) => getPermissions().includes(permission);

export const canAny = (...permissions) => permissions.some(can);

// الصفحة الأولى حسب الصلاحيات (مو حسب اسم الدور)
export function homeFor() {
  if (can("courses.view")) return can("quizzes.submit") && !can("courses.create") ? "/student/quizzes" : "/courses";
  if (can("students.read")) return "/students";
  if (can("invoices.read")) return "/payments";
  if (can("roles.read")) return "/roles";
  return "/login";
}
