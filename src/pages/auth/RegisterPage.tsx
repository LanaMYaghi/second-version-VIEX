
import Form from '../../components/Form';
import { registerUser } from "../../services/authApi.js"
import {getRegisterFormFields} from "../../constants/formConfigs.js"

const RegisterPage = () => {
// 1. جلب حقول التسجيل
  const registerFields = getRegisterFormFields();

  // 2. دالة التعامل مع الإرسال (تستدعي الـ API الخارجي)
  const handleRegisterSubmit = async (formValues) => {
    console.log("Form Values to send:", formValues);

    try {
      // استدعاء دالة الـ API اللي عملناها بملف لحال
      const data = await registerUser(formValues);
      
      console.log('Account Created Successfully:', data);
      alert('تم إنشاء الحساب بنجاح!');
      
      // هنا ممكن تعملي توجيه لصفحة تسجيل الدخول مثلاً باستخدام useNavigate
    } catch (error) {
      console.error('Registration Error:', error);
      alert('حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 my-10">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Create New Account</h2>
      
      {/* استدعاء الفورم العام */}
      <Form 
        inputData={registerFields} 
        onSubmit={handleRegisterSubmit}
        linkTo="/login"
        textFooter="Already have an account?"
        textLink="Log in"
      />
     
    </div>
  );
}

export default RegisterPage