
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// استيراد الصفحات (تأكدي من تطابق المسارات مع مجلداتك)
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import TeachersPage from './pages/TeachersPage';
import CoursesPage from './pages/CoursesPage';
import StudentsPage from './pages/StudentsPage';


// 1. تعريف المسارات باستخدام createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/student",
 
    element:<StudentsPage/>,
   
    errorElement: <div className="p-10 text-center text-red-500 font-bold">عذراً، الصفحة غير موجودة (404)</div>
       // element: <LoginPage />, // الصفحة الرئيسية مؤقتاً هي تسجيل الدخول
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  }
]);

// 2. المكون الرئيسي الذي يعرض الراوتر
function App() {
  return <RouterProvider router={router} />;
}

export default App;