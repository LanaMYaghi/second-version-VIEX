
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// استيراد الصفحات (تأكدي من تطابق المسارات مع مجلداتك)
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';


// 1. تعريف المسارات باستخدام createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />, // الصفحة الرئيسية مؤقتاً هي تسجيل الدخول
   
    errorElement: <div className="p-10 text-center text-red-500 font-bold">عذراً، الصفحة غير موجودة (404)</div>
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