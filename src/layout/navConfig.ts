// src/layout/navConfig.js
import { BookOpen, GraduationCap, Users, ClipboardList } from "lucide-react";

export const NAV_ITEMS = [
  {
    to: "/courses",
    label: "Courses",
    icon: BookOpen,
    roles: ["admin", "secretary", "teacher"],
  },
  {
    to: "/students",
    label: "Students",
    icon: GraduationCap,
    roles: ["admin", "secretary"],
  },
  {
    to: "/teachers",
    label: "Teachers",
    icon: Users,
    roles: ["admin", "secretary"],
  },
  {
    to: "/student/quizzes",
    label: "My Quizzes",
    icon: ClipboardList,
    roles: ["student"],
  },
];

// إذا العنصر ما إلو roles بيظهر للكل
export const canSee = (item, role) => !item.roles || item.roles.includes(role);
