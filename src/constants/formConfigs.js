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
        label: "Father's Phone",
        type: "text",
        placeholder: "Enter father's phone number",
        name: "fatherPhone",
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
      { label: "Date of Birth", type: "date", name: "dateOfBirth" },
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
        label: "Hourly Rate / Salary ($)",
        type: "number",
        placeholder: "e.g. 25",
        name: "hourlyRate",
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
  {
    type: "select",
    label: "Select Teacher",
    name: "teacherId",
    placeholder: "Choose a teacher",
    // الأستاذة
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
      { label: "Start Date", type: "date", name: "startDate" },
      { label: "End Date", type: "date", name: "endDate" },
      { label: "Start Time", type: "time", name: "startTime" },
      { label: "End Time", type: "time", name: "endTime" },
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
      { value: "Tue", label: "Tuseday" },
      { value: "Wed", label: "wednesday" },
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
      { label: "Full Name", type: "text", placeholder: "Enter employee's full name", name: "fullName" },
      { label: "Email Address", type: "email", placeholder: "Enter email address", name: "email" }
    ]
  },
  {
    inputs: [
      { label: "Password", type: "password", placeholder: "Enter secure password", name: "password" },
      { label: "Phone Number", type: "text", placeholder: "Enter phone number", name: "phone" }
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
    type: "submit",
    text: "Add Employee",
    className: "bg-[#3A5B22] text-white hover:bg-black transition-colors"
  }
];
