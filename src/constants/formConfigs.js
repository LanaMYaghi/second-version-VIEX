const SUBMIT_CLASS = "bg-[#3A5B22] text-white hover:bg-black transition-colors";

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

// بالتعديل منشيل حقول معينة (الباسوورد، الـ position)
const hideOnEdit = (fields, isEdit, names) =>
  isEdit
    ? fields
        .map((f) =>
          f.inputs ? { ...f, inputs: f.inputs.filter((i) => !names.includes(i.name)) } : f
        )
        .filter((f) => !names.includes(f.name) && !(f.inputs && f.inputs.length === 0))
    : fields;

// ===== Auth =====
export const getLoginFormFields = () => [
  {
    inputs: [
      { label: "Email", type: "email", placeholder: "Enter your email", name: "email" },
      { label: "Password", type: "password", placeholder: "Enter password", name: "password" },
    ],
  },
  { type: "submit", text: "Login" },
];

// ===== Students =====
export const getStudentFormFields = (isEdit = false) =>
  hideOnEdit(
    [
      {
        inputs: [
          { label: "Full Name", type: "text", placeholder: "Enter student's full name", name: "full_name" },
          { label: "Email Address", type: "email", placeholder: "Enter email address", name: "email" },
        ],
      },
      {
        inputs: [
          { label: "Password", type: "password", placeholder: "Enter secure password", name: "password" },
          { label: "Phone Number", type: "text", placeholder: "Enter phone number", name: "number_phone" },
        ],
      },
      {
        inputs: [
          { label: "Father's Phone", type: "text", placeholder: "Enter father's phone number", name: "father_number" },
          { label: "Date of Birth", type: "date", name: "birthday" },
        ],
      },
      { type: "select", label: "Gender", name: "gender", placeholder: "Select Gender", options: GENDER_OPTIONS },
      { inputs: [{ label: "Nationality", type: "text", placeholder: "e.g. Syrian", name: "nationality" }] },
      { type: "submit", text: "Add Student", className: SUBMIT_CLASS },
    ],
    isEdit,
    ["password"]
  );

// ===== Teachers =====
export const getTeacherFormFields = (isEdit = false) =>
  hideOnEdit(
    [
      {
        inputs: [
          { label: "Full Name", type: "text", placeholder: "e.g. Dr. John Doe", name: "full_name" },
          { label: "Email Address", type: "email", placeholder: "teacher@example.com", name: "email" },
        ],
      },
      {
        inputs: [
          { label: "Password", type: "password", placeholder: "••••••••", name: "password" },
          { label: "Phone Number", type: "tel", placeholder: "+123456789", name: "number_phone" },
        ],
      },
      { type: "select", label: "Gender", name: "gender", placeholder: "Select Gender", options: GENDER_OPTIONS },
      {
        inputs: [
          { label: "Nationality", type: "text", placeholder: "e.g. Syrian", name: "nationality" },
          { label: "Specialization", type: "text", placeholder: "e.g. English Literature", name: "specialization" },
          { label: "Salary ($)", type: "number", placeholder: "e.g. 500", name: "salary" },
        ],
      },
      {
        inputs: [
          { label: "Certificate Image URL", type: "text", placeholder: "Enter certificate image link", name: "certificateImage" },
        ],
      },
      { type: "submit", text: "Add Teacher", className: SUBMIT_CLASS },
    ],
    isEdit,
    ["password"]
  );

// ===== Employees =====
export const getEmployeeFormFields = (isEdit = false) =>
  hideOnEdit(
    [
      {
        inputs: [
          { label: "Full Name", type: "text", placeholder: "Enter employee's full name", name: "full_name" },
          { label: "Email Address", type: "email", placeholder: "Enter email address", name: "email" },
        ],
      },
      {
        inputs: [
          { label: "Password", type: "password", placeholder: "Enter secure password", name: "password" },
          { label: "Phone Number", type: "text", placeholder: "Enter phone number", name: "number_phone" },
        ],
      },
      {
        type: "select",
        label: "Employee Role / Position",
        name: "position",
        placeholder: "Select Position",
        options: [
          { value: "secretary", label: "Secretary" },
          { value: "accountant", label: "Accountant" },
          { value: "hr", label: "HR Manager" },
        ],
      },
      {
        inputs: [
          { label: "Nationality", type: "text", placeholder: "e.g. Syrian", name: "nationality" },
          { label: "Salary", type: "number", placeholder: "Enter salary", name: "salary" },
        ],
      },
      { type: "select", label: "Gender", name: "gender", placeholder: "Select Gender", options: GENDER_OPTIONS },
      {
        inputs: [
          { label: "Address", type: "text", placeholder: "Enter city/address", name: "address" },
          { label: "Identity Image URL", type: "text", placeholder: "Enter identity image link", name: "identityImage" },
        ],
      },
      { type: "submit", text: "Add Employee", className: SUBMIT_CLASS },
    ],
    isEdit,
    ["password", "position"]
  );

// ===== Courses (مطابق لـ Course model: ما في teacherId/level/days) =====
export const getCourseFormFields = () => [
  {
    inputs: [
      { label: "Course Title (max 20)", type: "text", placeholder: "e.g. English A1", name: "title" },
      { label: "Price ($)", type: "number", placeholder: "e.g. 100", name: "price" },
    ],
  },
  {
    type: "textarea",
    label: "Course Description",
    name: "description",
    placeholder: "Enter brief description about the course...",
  },
  {
    inputs: [
      { label: "Start Date", type: "date", name: "start_date" },
      { label: "End Date", type: "date", name: "end_date" },
      { label: "Start Time", type: "time", name: "start_time" },
      { label: "End Time", type: "time", name: "end_time" },
    ],
  },
  { type: "submit", text: "Add Course", className: SUBMIT_CLASS },
];

// ===== Quiz =====
export const getQuizFormFields = () => [
  { inputs: [{ label: "Quiz Title", type: "text", placeholder: "e.g. Unit 1 Quiz", name: "title" }] },
  { type: "submit", text: "Create Quiz", className: SUBMIT_CLASS },
];

// ===== Roles =====
export const getRoleFormFields = () => [
  { inputs: [{ label: "Role Name", type: "text", placeholder: "e.g. manager, supervisor", name: "name" }] },
  { type: "textarea", label: "Description", name: "description", placeholder: "Enter role description..." },
  { type: "submit", text: "Save Role", className: SUBMIT_CLASS },
];

// ===== Invoices =====
export const getInvoiceFormFields = (students = [], courses = []) => [
  {
    type: "select",
    label: "Student",
    name: "userId",
    placeholder: "Choose a student",
    options: students.map((s) => ({ value: s.id, label: `${s.full_name} (${s.email})` })),
  },
  {
    type: "select",
    label: "Course",
    name: "courseId",
    placeholder: "Choose a course",
    options: courses.map((c) => ({ value: c._id, label: c.title })),
  },
  {
    inputs: [
      { label: "Amount ($)", type: "number", placeholder: "e.g. 100", name: "amount" },
      { label: "Receipt Number", type: "text", placeholder: "e.g. RCPT-0001", name: "receiptNumber" },
    ],
  },
  { type: "submit", text: "Create Invoice", className: SUBMIT_CLASS },
];
