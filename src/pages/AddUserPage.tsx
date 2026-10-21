import { useState } from "react";
import Form from "../components/Form";
import { getRegisterFormFields } from "../constants/formConfigs.js";
import { createStudentApi } from "../services/userApi.js"; // استدعاء الدالة الجديدة

const AddStudentPage = () => {
  const studentFields = getRegisterFormFields(); // حقول الطالب

  const handleCreateStudent = async (formValues) => {
    try {
      // إرسال البيانات مع التوكن الخاص بالأدمن المسجل دخول حالياً
      const response = await createStudentApi(formValues);
      
      console.log('Student Created Successfully:', response);
      alert('تم إضافة الطالب بنجاح!');
      
    } catch (error) {
      console.error('Creation Error:', error);
      const errorMsg = error.message || 'حدث خطأ أثناء إضافة الطالب';
      alert(errorMsg);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 my-10">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Add New Student</h2>
      
      <Form 
        inputData={studentFields} 
        onSubmit={handleCreateStudent}
        isAuth={false} // لم يعد فورم مصادقة عام بل فورم إداري
      />
    </div>
  );
};

export default AddStudentPage;