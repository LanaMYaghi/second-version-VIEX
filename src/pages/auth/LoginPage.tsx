
import Form from '../../components/Form';
import { getLoginFormFields} from "../../constants/formConfigs.js"
import {loginUser} from "../../services/authApi.js";

const LoginPage = () => {
  const loginFields = getLoginFormFields();

  const handleLoginSubmit = async (formValues) => {
    try {
      const result = await loginUser(formValues);
      console.log('Login Successful:', result);
      alert('تم تسجيل الدخول بنجاح!');
    } catch (error) {
      console.error('Login Failed:', error);
      alert('البريد أو كلمة المرور غير صحيحة!');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 my-10">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Welcome Back</h2>
      
      <Form 
        inputData={loginFields} 
        onSubmit={handleLoginSubmit}
        linkTo="/register"
        textFooter="Don't have an account?"
        textLink="Sign up"
      />
     
    </div>
  );
}

export default LoginPage