import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import StudentsPage from "./pages/StudentsPage";
import TeachersPage from "./pages/TeachersPage";
import EmployeesPage from "./pages/EmployeesPage";
import RolesPage from "./pages/RolesPage";
import CoursesPage from "./pages/CoursesPage";
import CourseQuizzesPage from "./pages/quiz/CourseQuizzesPage";
import QuizBuilderPage from "./pages/quiz/QuizBuilderPage";
import StudentQuizzesPage from "./pages/quiz/StudentQuizzesPage";
import TakeQuizPage from "./pages/quiz/TakeQuizPage";
import PaymentsPage from "./pages/payment/PaymentsPage";

import AppLayout from "./layout/AppLayout";
import RequirePermission from "./guards/RequireRole";
import { homeFor } from "./utils/permissions";

function HomeRedirect() {
  const token = localStorage.getItem("token");
  return <Navigate to={token ? homeFor() : "/login"} replace />;
}

const NotFound = () => (
  <div className="p-10 text-center text-red-500 font-bold">Page not found (404)</div>
);

// الحماية حسب الصلاحية (نفس الأسماء اللي بالباك/seed) مو حسب اسم الدور
const router = createBrowserRouter([
  { path: "/", element: <HomeRedirect /> },
  { path: "/login", element: <LoginPage /> },

  {
    element: <AppLayout />,
    children: [
      {
        element: <RequirePermission permissions={["courses.view"]} />,
        children: [{ path: "/courses", element: <CoursesPage /> }],
      },
      {
        element: <RequirePermission permissions={["quizzes.update", "quizzes.create"]} />,
        children: [
          { path: "/courses/:courseId/quizzes", element: <CourseQuizzesPage /> },
          { path: "/courses/:courseId/quizzes/:quizId", element: <QuizBuilderPage /> },
        ],
      },
      {
        element: <RequirePermission permissions={["students.read"]} />,
        children: [{ path: "/students", element: <StudentsPage /> }],
      },
      {
        element: <RequirePermission permissions={["teachers.read"]} />,
        children: [{ path: "/teachers", element: <TeachersPage /> }],
      },
      {
        element: <RequirePermission permissions={["employees.read"]} />,
        children: [{ path: "/employees", element: <EmployeesPage /> }],
      },
      {
        element: <RequirePermission permissions={["roles.read"]} />,
        children: [{ path: "/roles", element: <RolesPage /> }],
      },
      {
        element: <RequirePermission permissions={["invoices.read"]} />,
        children: [{ path: "/payments", element: <PaymentsPage /> }],
      },
      {
        element: <RequirePermission permissions={["quizzes.submit"]} />,
        children: [
          { path: "/student/quizzes", element: <StudentQuizzesPage /> },
          { path: "/student/courses/:courseId/quizzes/:quizId", element: <TakeQuizPage /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
