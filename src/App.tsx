// import { createBrowserRouter, RouterProvider } from "react-router-dom";

// // استيراد الصفحات (تأكدي من تطابق المسارات مع مجلداتك)
// import LoginPage from "./pages/auth/LoginPage";
// import RegisterPage from "./pages/auth/RegisterPage";

// import TeachersPage from "./pages/TeachersPage";
// import CoursesPage from "./pages/CoursesPage";
// import StudentsPage from "./pages/StudentsPage";
// import RequireRole from "./guards/RequireRole";
// import CourseQuizzesPage from "./pages/quiz/CourseQuizzesPage";
// import QuizBuilderPage from "./pages/quiz/QuizBuilderPage";
// import DevToolbar from "./components/DevToolbar";
// import StudentQuizzesPage from "./pages/quiz/StudentQuizzesPage";
// import TakeQuizPage from "./pages/quiz/TakeQuizPage";
// import QuizResultsPage from "./pages/quiz/QuizResultsPage";

// // function HomeRedirect() {
// //   const token = localStorage.getItem("token");
// //   return <Navigate to={token ? homeFor(getRole()) : "/login"} replace />;
// // }

// // 1. تعريف المسارات باستخدام createBrowserRouter
// const router = createBrowserRouter([

//   // { path: "/", element: <HomeRedirect /> },
//   // { path: "/login", element: <LoginPage /> },       // بدون Layout
//   // { path: "/register", element: <RegisterPage /> },


//   {
//     path: "/course",

//     element: <CoursesPage />,

//     errorElement: (
//       <div className="p-10 text-center text-red-500 font-bold">
//         عذراً، الصفحة غير موجودة (404)
//       </div>
//     ),
//     // element: <LoginPage />, // الصفحة الرئيسية مؤقتاً هي تسجيل الدخول
//   },
//   {
//     path: "/login",
//     element: <LoginPage />,
//   },
//   {
//     path: "/register",
//     element: <RegisterPage />,
//   },

//   {
//     element: <RequireRole roles={["admin", "secretary", "teacher"]} />,
//     errorElement: (
//       <div className="p-10 text-center text-red-500 font-bold">
//         عذراً، الصفحة غير موجودة (404)
//       </div>
//     ),
//     children: [
//       { path: "/courses", element: <CoursesPage /> },
//       { path: "/courses/:courseId/quizzes", element: <CourseQuizzesPage /> },
//       { path: "/quizzes/:quizId", element: <QuizBuilderPage /> },
//     ],
//   },

//   {
//     element: <RequireRole roles={["admin", "teacher", "secretary"]} />,
//     children: [
//       { path: "/students", element: <StudentsPage /> },
//       { path: "/teachers", element: <TeachersPage /> },
//       { path: "/quizzes/:quizId/results", element: <QuizResultsPage /> },
//     ],
//   },

//   {
//     element: <RequireRole roles={["student"]} />,
//     children: [
//       { path: "/student/quizzes", element: <StudentQuizzesPage /> },
//       { path: "/student/quizzes/:quizId", element: <TakeQuizPage /> },
//     ],
//   },
// ]);

// // 2. المكون الرئيسي الذي يعرض الراوتر
// function App() {
//   return (
//     <>
//       <RouterProvider router={router} />;
//       <DevToolbar />;
//     </>
//   );
// }

// export default App;


import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import TeachersPage from "./pages/TeachersPage";
import CoursesPage from "./pages/CoursesPage";
import StudentsPage from "./pages/StudentsPage";
import CourseQuizzesPage from "./pages/quiz/CourseQuizzesPage";
import QuizBuilderPage from "./pages/quiz/QuizBuilderPage";
import StudentQuizzesPage from "./pages/quiz/StudentQuizzesPage";
import TakeQuizPage from "./pages/quiz/TakeQuizPage";
import QuizResultsPage from "./pages/quiz/QuizResultsPage";

import AppLayout from "./layout/AppLayout";
import RequireRole from "./guards/RequireRole";
import DevToolbar from "./components/DevToolbar";
import { getRole, homeFor } from "./utils/permissions.js";
import EmployeesPage from "./pages/EmployeesPage";

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
  // بدون Layout
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  // كل الصفحات تحت الـ Layout (sidebar + navbar)
  {
    element: <AppLayout />,
    children: [
      {
        element: <RequireRole roles={["admin", "secretary", "teacher"]} />,
        children: [
          { path: "/courses", element: <CoursesPage /> },
          { path: "/courses/:courseId/quizzes", element: <CourseQuizzesPage /> },
          { path: "/quizzes/:quizId", element: <QuizBuilderPage /> },
          { path: "/quizzes/:quizId/results", element: <QuizResultsPage /> },
        ],
      },
      {
        element: <RequireRole roles={["admin", "secretary"]} />,
        children: [
          { path: "/students", element: <StudentsPage /> },
          { path: "/teachers", element: <TeachersPage /> },
        

        ],
      },
      {
        element: <RequireRole roles={["admin"]} />,
        children: [
          {path:"/employees",element:<EmployeesPage/>}

        ],
      },
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
    <>
      <RouterProvider router={router} />
      <DevToolbar />
    </>
  );
}

export default App;