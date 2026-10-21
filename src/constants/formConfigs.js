// 1. فورم تسجيل الدخول (Login)
export const getLoginFormFields = () => [
  {
    inputs: [
      {
        label: "Email",
        type: "email",
        placeholder: "Enter your email",
        name: "email",
      },
      {
        label: "Password",
        type: "password",
        placeholder: "Enter password",
        name: "password",
      },
    ],
  },
  {
    type: "submit",
    text: "Login",
  },
];

// 2. فورم إنشاء حساب جديد (Register / Sign Up)
export const getRegisterFormFields = () => [
  {
    inputs: [
      {
        label: "Full Name",
        type: "text",
        placeholder: "Enter your full name",
        name: "fullName",
      },
      {
        label: "Email Address",
        type: "email",
        placeholder: "Enter your email",
        name: "email",
      },
      {
        label: "Password",
        type: "password",
        placeholder: "Create a strong password",
        name: "password",
      },
    ],
  },
  {
    type: "submit",
    text: "Create Account",
    className: "bg-[#3A5B22] text-white hover:bg-black transition-colors",
  },
];

// 1. فورم إضافة طالب

export const getStudentFormFields = () => [
  {
    inputs: [
      {
        label: "Full Name",
        type: "text",
        placeholder: "Enter student's full name",
        name: "fullName",
      },
      {
        label: "Email Address",
        type: "email",
        placeholder: "Enter email address",
        name: "email",
      },
    ],
  },
  {
    inputs: [
      {
        label: "Password",
        type: "password",
        placeholder: "Enter secure password",
        name: "password",
      },
      {
        // تم تعديل الـ name ليطابق الـ backend (father_number)
        label: "Father's Phone",
        type: "text",
        placeholder: "Enter father's phone number",
        name: "father_number",
      },
    ],
  },
  {
    inputs: [
      {
        label: "Student ID",
        type: "text",
        placeholder: "Enter student unique number",
        name: "studentId",
      },
      { 
        // تم تعديل الـ name ليطابق الـ backend (birthday)
        label: "Date of Birth", 
        type: "date", 
        name: "birthday" 
      },
    ],
  },
  {
    type: "select",
    label: "Gender",
    name: "gender",
    placeholder: "Select Gender",
    options: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
    ],
  },
  {
    inputs: [
      {
        label: "Nationality",
        type: "text",
        placeholder: "e.g. Syrian",
        name: "nationality",
      },
    ],
  },
  {
    type: "submit",
    text: "Add Student",
    className: "bg-[#3A5B22] text-white hover:bg-black transition-colors",
  },
];

//فورم اضافة استاذ
export const getTeacherFormFields = () => [
  {
    inputs: [
      {
        label: "Full Name",
        type: "text",
        placeholder: "e.g. Dr. John Doe",
        name: "fullName",
      },
      {
        label: "Email Address",
        type: "email",
        placeholder: "teacher@example.com",
        name: "email",
      },
    ],
  },
  {
    inputs: [
      {
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        name: "password",
      },
      {
        label: "Phone Number",
        type: "tel",
        placeholder: "+123456789",
        name: "phone",
      },
    ],
  },
  {
    type: "select",
    label: "Gender",
    name: "gender",
    placeholder: "Select Gender",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
  },
  {
    inputs: [
      {
        label: "Nationality",
        type: "text",
        placeholder: "e.g. Syrian",
        name: "nationality",
      },
      {
        label: "Specialization",
        type: "text",
        placeholder: "e.g. English Literature",
        name: "specialization",
      },
      {
        // تم تعديل الـ name من hourlyRate إلى salary ليتطابق مع الـ Schema
        label: "Salary ($)",
        type: "number",
        placeholder: "e.g. 500",
        name: "salary",
      },
    ],
  },
  {
    inputs: [
      {
        // تم إضافة هذا الحقل لأنه مطلوب (required) في الباك إند
        label: "Certificate Image URL",
        type: "text",
        placeholder: "Enter certificate image link or path",
        name: "certificateImage",
      },
    ],
  },
  {
    type: "submit",
    text: "Add Teacher",
    className: "bg-[#3A5B22] text-white hover:bg-black transition-colors",
  },
];

//فورم اضافة كورس
export const getCourseFormFields = (teachersList = []) => [
  {
    inputs: [
      {
        label: "Course Title",
        type: "text",
        placeholder: "e.g. English Beginners",
        name: "title",
      },
    ],
  },
  {
    type: "textarea",
    label: "Course Description",
    name: "description",
    placeholder: "Enter brief description about the course...",
  },
  // أضفنا حقل السعر (Price) لأنه موجود في الباك إند وكان ناقصاً بالفورم
  {
    inputs: [
      {
        label: "Price ($)",
        type: "number",
        placeholder: "e.g. 100",
        name: "price",
      },
    ],
  },
  {
    type: "select",
    label: "Select Teacher",
    name: "teacherId",
    placeholder: "Choose a teacher",
    options: teachersList.map((t) => ({ value: t.id, label: t.name })),
  },
  {
    type: "select",
    label: "Language Level",
    name: "level",
    placeholder: "Choose level",
    options: [
      { value: "A1-1", label: "A1-1" },
      { value: "A1-2", label: "A1-2" },
      { value: "A2-1", label: "A2-1" },
      { value: "A2-2", label: "A2-2" },
      { value: "B1-1", label: "B1-1" },
      { value: "B1-2", label: "B1-2" },
      { value: "B2", label: "B2" },
    ],
  },
  {
    inputs: [
      // تم تعديل الأسماء هنا لتطابق الباك إند (start_date, end_date, start_time, end_time)
      { label: "Start Date", type: "date", name: "start_date" },
      { label: "End Date", type: "date", name: "end_date" },
      { label: "Start Time", type: "time", name: "start_time" },
      { label: "End Time", type: "time", name: "end_time" },
    ],
  },
  {
    type: "checkbox-group",
    label: "Course Days",
    name: "days",
    options: [
      { value: "Sat", label: "Saturday" },
      { value: "Sun", label: "Sunday" },
      { value: "Mon", label: "Monday" },
      { value: "Tue", label: "Tuesday" },
      { value: "Wed", label: "Wednesday" },
      { value: "Thu", label: "Thursday" },
    ],
  },
  {
    type: "submit",
    text: "Add Course",
    className: "bg-[#3A5B22] text-white hover:bg-black transition-colors",
  },
];

//quiz form
export const getQuizFormFields = () => [
  {
    inputs: [
      {
        label: "Quiz Title",
        type: "text",
        placeholder: "e.g. Unit 1 Quiz",
        name: "title",
      },
    ],
  },
  { type: "submit", text: "Create Quiz" },
];

// فورم اضافة موظف 
export const getEmployeeFormFields = () => [
  {
    inputs: [
      { label: "Full Name", type: "text", placeholder: "Enter employee's full name", name: "full_name" },
      { label: "Email Address", type: "email", placeholder: "Enter email address", name: "email" }
    ]
  },
  {
    inputs: [
      { label: "Password", type: "password", placeholder: "Enter secure password", name: "password" },
      { label: "Phone Number", type: "text", placeholder: "Enter phone number", name: "number_phone" }
    ]
  },
  {
    type: "select",
    label: "Employee Role / Position",
    name: "position",
    placeholder: "Select Position",
    options: [
      { value: "Secretary", label: "Secretary" },
      { value: "Accountant", label: "Accountant" },
      { value: "HR", label: "HR Manager" }
    ]
  },
  {
    inputs: [
      { label: "Nationality", type: "text", placeholder: "e.g. Syrian", name: "nationality" },
      { label: "Salary", type: "number", placeholder: "Enter salary", name: "salary" }
    ]
  },
  {
    type: "select",
    label: "Gender",
    name: "gender",
    placeholder: "Select Gender",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" }
    ]
  },
  {
    inputs: [
      { label: "Address", type: "text", placeholder: "Enter city/address", name: "address" }
    ]
  },
  {
    type: "submit",
    text: "Add Employee",
    className: "bg-[#3A5B22] text-white hover:bg-black transition-colors"
  }
];
//roles
export const getRoleFormFields = () => [
  {
    inputs: [
      {
        label: "Role Name",
        type: "text",
        placeholder: "e.g. manager, supervisor",
        name: "name",
      },
    ],
  },
  {
    type: "textarea",
    label: "Description",
    name: "description",
    placeholder: "Enter role description...",
  },
  {
    type: "submit",
    text: "Save Role",
    className: "bg-[#3A5B22] text-white hover:bg-black transition-colors",
  },
];
//user-permissions
export const getUserPermissionFormFields = (usersList = [], permissionsList = []) => [
  {
    type: "select",
    label: "Select User",
    name: "userId",
    placeholder: "Choose a user",
    options: usersList.map((u) => ({ value: u._id, label: u.fullName || u.email })),
  },
  {
    type: "select",
    label: "Select Permission",
    name: "permissionId",
    placeholder: "Choose a permission",
    options: permissionsList.map((p) => ({ value: p._id, label: p.name })),
  },
  {
    type: "select",
    label: "Effect",
    name: "effect",
    placeholder: "Select Effect",
    options: [
      { value: "allow", label: "Allow (سماح)" },
      { value: "deny", label: "Deny (منع قاطع)" },
    ],
  },
  {
    type: "submit",
    text: "Save Permission Override",
    className: "bg-[#3A5B22] text-white hover:bg-black transition-colors",
  },
];