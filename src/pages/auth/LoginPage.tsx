import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/Form";
import { getLoginFormFields } from "../../constants/formConfigs.js";
import { loginUser } from "../../services/authApi.js";
import { errorText } from "../../services/apiClient.js";
import { homeFor } from "../../utils/permissions.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const fields = getLoginFormFields();

  const handleLogin = async (values) => {
    setSubmitting(true);
    try {
      await loginUser(values); // بيخزّن الجلسة تلقائياً
      navigate(homeFor(), { replace: true });
      return true;
    } catch (e) {
      alert(errorText(e) || "Invalid email or password");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 my-10">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Welcome Back</h2>
      <Form inputData={fields} onSubmit={handleLogin} isAuth submitting={submitting} />
    </div>
  );
}
