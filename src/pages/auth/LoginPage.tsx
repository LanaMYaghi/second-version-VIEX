import { useNavigate } from "react-router-dom";
import Form from "../../components/Form";
import { getLoginFormFields } from "../../constants/formConfigs.js";
import { loginUser } from "../../services/authApi.js";

const LoginPage = () => {
  const loginFields = getLoginFormFields();
  const navigate = useNavigate();

  const handleLoginSubmit = async (formValues) => {
    try {
      const result = await loginUser(formValues);
      // localStorage.setItem("token", result.token);
      // localStorage.setItem("userRole", result.user.role);
      // localStorage.setItem("userId", result.user.id);
      // localStorage.setItem("userName", result.user.fullName ?? "");
      //for dev
      localStorage.setItem("token", "dev-token");
      localStorage.setItem("userRole", "teacher"); // أو admin / secretary
      localStorage.setItem("userId", "1"); // لازم يساوي teacherId للكورس

      navigate("/courses", { replace: true });

      console.log("Login Successful:", result);
      alert("تم تسجيل الدخول بنجاح!");
    } catch (error) {
      console.error("Login Failed:", error);
      alert("البريد أو كلمة المرور غير صحيحة!");
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
