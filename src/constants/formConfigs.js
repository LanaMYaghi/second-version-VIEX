// 1. فورم تسجيل الدخول (Login)
export const getLoginFormFields = () => [
  {
    inputs: [
      { label: "Email", type: "email", placeholder: "Enter your email", name: "email" },
      { label: "Password", type: "password", placeholder: "Enter password", name: "password" }
    ]
  },
  {
    type: "submit",
    text: "Login"
  }
];


// 2. فورم إنشاء حساب جديد (Register / Sign Up)
export const getRegisterFormFields = () => [
  {
    inputs: [
      {  label: "Full Name",  type: "text",  placeholder: "Enter your full name",  name: "fullName"},
      {  label: "Email Address", type: "email",  placeholder: "Enter your email", name: "email" },
      {  label: "Password", type: "password", placeholder: "Create a strong password", name: "password"}
    ]
  },
  {
    type: "submit",
    text: "Create Account",
    className: "bg-[#3A5B22] text-white hover:bg-black transition-colors"
  }
];




// 1. فورم إضافة طالب
export const getStudentFormFields = () => [
  {
    inputs: [
      { label: "Full Name", type: "text", placeholder: "Enter student's full name", name: "fullName" },
      { label: "Email Address", type: "email", placeholder: "Enter email address", name: "email" },
      { label: "Password", type: "password", placeholder: "Enter secure password", name: "password" },
      { label: "Father's Phone", type: "text", placeholder: "Enter father's phone number", name: "fatherPhone" },
      { label: "Student ID", type: "text", placeholder: "Enter student unique number", name: "studentId" },
      { label: "Date of Birth", type: "date", name: "dateOfBirth" },
      { label: "Gender", type: "text", placeholder: "Male / Female", name: "gender" },
      { label: "Nationality", type: "text", placeholder: "e.g. Syrian", name: "nationality" }
    ]
  },
  {
    type: "submit",
    text: "Add Student"
  }
];

