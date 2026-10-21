// src/layout/navConfig.js
import {
  BookOpen,
  GraduationCap,
  Users,
  Briefcase,
  ShieldCheck,
  ClipboardList,
  CreditCard,
} from "lucide-react";
import { can, canAny } from "../utils/permissions";

// طالب = بيقدر يقدّم اختبار وما بيقدر يدير الاختبارات
const isStudent = () => can("quizzes.submit") && !can("quizzes.update");

/**
 * permissions: يكفي وحدة منهم عشان يظهر العنصر
 * when: شرط إضافي اختياري
 */
export const NAV_ITEMS = [
  {
    to: "/courses",
    label: "Courses",
    icon: BookOpen,
    permissions: ["courses.view"],
    when: () => !isStudent(),
  },
  {
    to: "/students",
    label: "Students",
    icon: GraduationCap,
    permissions: ["students.read"],
  },
  {
    to: "/teachers",
    label: "Teachers",
    icon: Users,
    permissions: ["teachers.read"],
  },
  {
    to: "/employees",
    label: "Employees",
    icon: Briefcase,
    permissions: ["employees.read"],
  },
  {
    to: "/payments",
    label: "Payments",
    icon: CreditCard,
    permissions: ["invoices.read"],
  },
  {
    to: "/roles",
    label: "Roles",
    icon: ShieldCheck,
    permissions: ["roles.read"],
  },
  {
    to: "/student/quizzes",
    label: "My Quizzes",
    icon: ClipboardList,
    permissions: ["quizzes.submit"],
    when: isStudent,
  },
];

// العنصر بيظهر إذا عند المستخدم وحدة من صلاحياته وتحقق الشرط الإضافي
export const canSee = (item) =>
  (!item.permissions || canAny(...item.permissions)) &&
  (!item.when || item.when());