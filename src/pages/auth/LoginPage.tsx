import { useNavigate } from "react-router-dom";
import Form from "../../components/Form";
import { getLoginFormFields } from "../../constants/formConfigs.js";
import { loginUser } from "../../services/authApi.js";

const LoginPage = () => {
  const loginFields = getLoginFormFields();
  const navigate = useNavigate();

 const handleLoginSubmit = async (formValues) => {
    try {
      const response = await loginUser(formValues);
      
      // البيانات تأتي داخل response.data حسب الـ Controller لديك
      const { user, roles, permissions, accessToken } = response.data;

      // تخزين التوكن والمعلومات في الـ localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("userRole", roles[0] || "student"); // أول دور للمستخدم
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.full_name ?? "");
      localStorage.setItem("userPermissions", JSON.stringify(permissions)); // تخزين الصلاحيات إن أردتِ استخدامها لاحقاً

      navigate("/courses", { replace: true });

      console.log("Login Successful:", response);
      alert("تم تسجيل الدخول بنجاح!");
    } catch (error) {
      console.error("Login Failed:", error);
      // عرض رسالة الخطأ القادمة من الباك إند إن وجدت
      const errorMsg = error.message || "البريد أو كلمة المرور غير صحيحة!";
      alert(errorMsg);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 my-10">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">
        Welcome Back
      </h2>

      <Form
        inputData={loginFields}
        onSubmit={handleLoginSubmit}
        linkTo="/register"
        textFooter="Don't have an account?"
        textLink="Sign up"
        isAuth={true}
      />
    </div>
  );
};

export default LoginPage;
