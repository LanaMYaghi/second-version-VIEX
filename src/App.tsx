import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";

import TeachersPage from "./pages/TeachersPage";
import CoursesPage from "./pages/CoursesPage";
import StudentsPage from "./pages/StudentsPage";
import CourseQuizzesPage from "./pages/quiz/CourseQuizzesPage";
import QuizBuilderPage from "./pages/quiz/QuizBuilderPage";
import StudentQuizzesPage from "./pages/quiz/StudentQuizzesPage";
import TakeQuizPage from "./pages/quiz/TakeQuizPage";
import QuizResultsPage from "./pages/quiz/QuizResultsPage";
import EmployeesPage from "./pages/EmployeesPage";
import RolesPage from "./pages/RolesPage";
import PaymentsPage from "./pages/payment/PaymentsPage.js";

import AppLayout from "./layout/AppLayout";
import RequireRole from "./guards/RequireRole";
import { getRole, homeFor } from "./utils/permissions.js";

// "/" بتوجّه حسب حالة المستخدم
function HomeRedirect() {
  const token = localStorage.getItem("token");
  return <Navigate to={token ? homeFor(getRole()) : "/login"} replace />;
}

const NotFound = () => (
  <div className="p-10 text-center text-red-500 font-bold">
    عذراً، الصفحة غير موجودة (404)
  </div>
);

const router = createBrowserRouter([
  { path: "/", element: <HomeRedirect /> },
<<<<<<< HEAD
=======
  // صفحات المصادقة بدون Layout
  
  // صفحات بدون Layout
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
>>>>>>> 601a4bc8f388312968ce50ef1bd427767b13f10d

  // صفحة تسجيل الدخول الوحيدة المتاحة للعامة بدون Layout
  { path: "/login", element: <LoginPage /> },

  // كل الصفحات الأساسية تحت الـ Layout (sidebar + navbar) وتحتاج تسجيل دخول
  {
    element: <AppLayout />,
    children: [
      // المشتركة بين الأدمن والسكرتير والأستاذ
      {
        element: <RequireRole roles={["admin", "secretary", "teacher"]} />,
        children: [
          { path: "/courses", element: <CoursesPage /> },
          { path: "/courses/:courseId/quizzes", element: <CourseQuizzesPage /> },
          { path: "/quizzes/:quizId", element: <QuizBuilderPage /> },
          { path: "/quizzes/:quizId/results", element: <QuizResultsPage /> },
        ],
      },
      // خاصة بالأدمن والسكرتير (إدارة الطلاب، الأساتذة، والمدفوعات)
      {
        element: <RequireRole roles={["admin", "secretary"]} />,
        children: [
          { path: "/students", element: <StudentsPage /> },
          { path: "/teachers", element: <TeachersPage /> },
          { path: "/payments", element: <PaymentsPage /> },
        ],
      },
      // خاصة بالأدمن حصراً
      {
        element: <RequireRole roles={["admin"]} />,
        children: [
          { path: "/employees", element: <EmployeesPage /> },
          { path: "/roles", element: <RolesPage /> },
        ],
      },
      // خاصة بالطلاب
      {
        element: <RequireRole roles={["student"]} />,
        children: [
          { path: "/student/quizzes", element: <StudentQuizzesPage /> },
          { path: "/student/quizzes/:quizId", element: <TakeQuizPage /> },
        ],
      },
    ],
  },

  // أي رابط غير موجود
  { path: "*", element: <NotFound /> },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;