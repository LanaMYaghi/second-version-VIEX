import { useState, useEffect } from "react";
import Form from "../../components/Form.tsx";
import CustomTable from "../../components/CustomTable.tsx";
import { usePageHeader } from "../../layout/AppLayout.tsx";
import {
  DollarSign,
  Receipt,
  CheckCircle,
  Clock,
  ShieldAlert,
  CreditCard,
} from "lucide-react";

// قائمة الطلاب المتاحة للاختيار (مطابقة لداتا النظام)
const DEFAULT_STUDENTS = [
  { id: 1, fullName: "Ahmad Omar", studentId: "ST-2026-001" },
  { id: 2, fullName: "Sara Ali", studentId: "ST-2026-002" },
  { id: 3, fullName: "Lina Hassan", studentId: "ST-2026-003" },
];

// قائمة الكورسات المتاحة للاختيار (مطابقة لداتا النظام)
const DEFAULT_COURSES = [
  { id: 1, title: "General English Intensive", price: "200" },
  { id: 2, title: "Advanced English Speaking", price: "250" },
  { id: 3, title: "Business English Essentials", price: "180" },
];

// داتا مدفوعات أولية متوافقة مع الـ Schema في الرسم اليدوي
const INITIAL_PAYMENTS = [
  {
    id: 1,
    student_id: "1",
    studentName: "Ahmad Omar",
    studentCode: "ST-2026-001",
    cours_id: "1",
    courseTitle: "General English Intensive",
    Amount: "200",
    number_des: "REC-2026-101",
    paymentDate: "2026-10-15",
    paymentMethod: "Cash",
    status: "completed",
  },
  {
    id: 2,
    student_id: "2",
    studentName: "Sara Ali",
    studentCode: "ST-2026-002",
    cours_id: "1",
    courseTitle: "General English Intensive",
    Amount: "100",
    number_des: "REC-2026-102",
    paymentDate: "2026-10-18",
    paymentMethod: "Bank Transfer",
    status: "pending",
  },
  {
    id: 3,
    student_id: "3",
    studentName: "Lina Hassan",
    studentCode: "ST-2026-003",
    cours_id: "2",
    courseTitle: "Advanced English Speaking",
    Amount: "250",
    number_des: "REC-2026-103",
    paymentDate: "2026-10-20",
    paymentMethod: "Credit Card",
    status: "completed",
  },
];

const STORAGE_KEY = "mock_payments";

// دالة توليد حقول الفورم بالهيكلية المتوافقة تماماً مع Form.tsx
const getPaymentFormFields = (students: any[], courses: any[]) => [
  {
    type: "select",
    label: "Student (student_id)",
    name: "student_id",
    placeholder: "Select Student",
    options: students.map((s) => ({
      value: String(s.id),
      label: `${s.fullName} (${s.studentId})`,
    })),
  },
  {
    type: "select",
    label: "Course (cours_id)",
    name: "cours_id",
    placeholder: "Select Course",
    options: courses.map((c) => ({
      value: String(c.id),
      label: `${c.title} - $${c.price}`,
    })),
  },
  {
    inputs: [
      {
        label: "Amount ($)",
        type: "number",
        placeholder: "e.g. 200",
        name: "Amount",
      },
      {
        label: "Receipt / Doc Number (number_des)",
        type: "text",
        placeholder: "e.g. REC-2026-104",
        name: "number_des",
      },
    ],
  },
  {
    inputs: [
      {
        label: "Payment Date",
        type: "date",
        name: "paymentDate",
      },
    ],
  },
  {
    type: "select",
    label: "Payment Method",
    name: "paymentMethod",
    placeholder: "Select Method",
    options: [
      { value: "Cash", label: "Cash" },
      { value: "Bank Transfer", label: "Bank Transfer" },
      { value: "Credit Card", label: "Credit Card" },
    ],
  },
  {
    type: "select",
    label: "Status",
    name: "status",
    placeholder: "Select Status",
    options: [
      { value: "completed", label: "Completed (Paid)" },
      { value: "pending", label: "Pending" },
    ],
  },
  {
    type: "submit",
    text: "Record Payment",
    className: "bg-[#3A5B22] text-white hover:bg-black transition-colors",
  },
];

export default function PaymentsPage() {
  const currentUserRole = localStorage.getItem("userRole") || "secretary";
  const isAuthorized = currentUserRole === "admin" || currentUserRole === "secretary";

  // استرجاع المدفوعات من localStorage أو الداتا الافتراضية
  const [payments, setPayments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
    } catch {
      return INITIAL_PAYMENTS;
    }
  });

  const [students] = useState(DEFAULT_STUDENTS);
  const [courses] = useState(DEFAULT_COURSES);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [expandedPaymentId, setExpandedPaymentId] = useState<any>(null);

  // تحديث عنوان الـ Navbar العلوي بنفس أسلوب التيم
  usePageHeader("Payments", `${payments.length} transactions`);

  // حفظ التعديلات في localStorage تلقائياً
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  }, [payments]);

  // حماية الصفحة: مسموح للأدمن والسكرتير فقط
  if (!isAuthorized) {
    return (
      <div className="p-8 max-w-md mx-auto my-12 bg-white rounded-2xl shadow-sm border border-slate-200 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
          <ShieldAlert size={24} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Access Restricted</h2>
        <p className="text-sm text-slate-600">
          Payments management is restricted to <strong>Admin</strong> and <strong>Secretary</strong> roles only.
        </p>
        <p className="text-xs text-slate-400">
          Current Role: <span className="font-semibold capitalize text-rose-600">{currentUserRole}</span>
        </p>
      </div>
    );
  }

  // معالجة حفظ الدفعة (إضافة أو تعديل)
  const handleSavePayment = (formValues: any) => {
    const studentObj = students.find((s) => String(s.id) === String(formValues.student_id));
    const courseObj = courses.find((c) => String(c.id) === String(formValues.cours_id));

    if (editingPayment) {
      // تعديل دفعة موجودة
      setPayments((prev) =>
        prev.map((p) =>
          p.id === editingPayment.id
            ? {
                ...p,
                ...formValues,
                studentName: studentObj ? studentObj.fullName : p.studentName,
                studentCode: studentObj ? studentObj.studentId : p.studentCode,
                courseTitle: courseObj ? courseObj.title : p.courseTitle,
              }
            : p
        )
      );
      alert("Payment updated successfully!");
      setEditingPayment(null);
    } else {
      // إضافة دفعة جديدة
      const newPayment = {
        id: Date.now(),
        student_id: formValues.student_id || (students[0] ? String(students[0].id) : "1"),
        studentName: studentObj ? studentObj.fullName : "Unknown Student",
        studentCode: studentObj ? studentObj.studentId : "ST-000",
        cours_id: formValues.cours_id || (courses[0] ? String(courses[0].id) : "1"),
        courseTitle: courseObj ? courseObj.title : "General Course",
        Amount: formValues.Amount || "0",
        number_des:
          formValues.number_des || `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
        paymentDate:
          formValues.paymentDate || new Date().toISOString().split("T")[0],
        paymentMethod: formValues.paymentMethod || "Cash",
        status: formValues.status || "completed",
      };

      setPayments((prev) => [newPayment, ...prev]);
      alert("Payment recorded successfully!");
    }
  };

  // تبديل حالة الدفعة (Paid <-> Pending)
  const handleToggleStatus = (row: any) => {
    const nextStatus = row.status === "completed" ? "pending" : "completed";
    setPayments((prev) =>
      prev.map((p) => (p.id === row.id ? { ...p, status: nextStatus } : p))
    );
  };

  // حذف دفعة (للأدمن فقط مثل باقي صفحات التيم)
  const handleDeletePayment = (row: any) => {
    if (window.confirm(`Are you sure you want to delete receipt ${row.number_des}?`)) {
      setPayments((prev) => prev.filter((p) => p.id !== row.id));
      if (expandedPaymentId === row.id) setExpandedPaymentId(null);
    }
  };

  // إحصائيات الدفعات السريعة
  const totalAmount = payments.reduce((sum, p) => sum + (Number(p.Amount) || 0), 0);
  const completedCount = payments.filter((p) => p.status === "completed").length;
  const pendingCount = payments.filter((p) => p.status === "pending").length;

  // تجهيز البيانات والأزرار لجدول CustomTable
  const formattedPayments = payments.map((p) => {
    const isCompleted = p.status === "completed";

    const rowButtons = [
      {
        label: "Edit",
        className: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
        onClick: (r: any) => setEditingPayment(r),
      },
      {
        label: isCompleted ? "Mark Pending" : "Mark Paid",
        className: "bg-amber-50 text-amber-600 hover:bg-amber-100",
        onClick: (r: any) => handleToggleStatus(r),
      },
      {
        label: expandedPaymentId === p.id ? "Hide Details" : "Receipt",
        className: "bg-sky-50 text-sky-600 hover:bg-sky-100",
        onClick: (r: any) =>
          setExpandedPaymentId(expandedPaymentId === r.id ? null : r.id),
      },
    ];

    // زر الحذف محصور بالأدمن فقط كما هو متبع في المشروع
    if (currentUserRole === "admin") {
      rowButtons.push({
        label: "Delete",
        className: "bg-rose-50 text-rose-600 hover:bg-rose-100",
        onClick: (r: any) => handleDeletePayment(r),
      });
    }

    return {
      ...p,
      formattedAmount: `$${p.Amount}`,
      statusBadge: (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            isCompleted
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {isCompleted ? "Completed" : "Pending"}
        </span>
      ),
      customButtons: rowButtons,
    };
  });

  const tableHeaders = [
    { key: "id", label: "ID" },
    { key: "number_des", label: "Receipt No." },
    { key: "studentName", label: "Student" },
    { key: "courseTitle", label: "Course" },
    { key: "formattedAmount", label: "Amount" },
    { key: "paymentDate", label: "Date" },
    { key: "paymentMethod", label: "Method" },
    { key: "statusBadge", label: "Status" },
    {
      type: "actions",
      label: "Actions",
      buttons: (row: any) => row.customButtons,
    },
  ];

  const paymentFields = getPaymentFormFields(students, courses);

  const FormComponent = Form as any;
  const CustomTableComponent = CustomTable as any;

  return (
    <div className="space-y-8" dir="ltr">
      {/* رأس الصفحة مع توضيح الرول */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 text-left">
            Payments Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track student tuition, receipts, and course payment statuses
          </p>
        </div>
        <span className="text-xs px-3 py-1 bg-slate-200 text-slate-700 rounded-full font-medium uppercase">
          Role: {currentUserRole}
        </span>
      </div>

      {/* بطاقات الإحصائيات (Stat Cards) بنفس أسلوب صفحة النتائج */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">Total Collected</p>
            <p className="text-2xl font-bold text-slate-800">${totalAmount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Receipt size={24} />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">Total Receipts</p>
            <p className="text-2xl font-bold text-slate-800">{payments.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">Completed</p>
            <p className="text-2xl font-bold text-slate-800">{completedCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">Pending</p>
            <p className="text-2xl font-bold text-slate-800">{pendingCount}</p>
          </div>
        </div>
      </div>

      {/* قسم الفورم: إضافة أو تعديل دفعة باستخدام كومبوننت Form الجاهز */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-700 text-left">
            {editingPayment
              ? `Edit Payment: ${editingPayment.number_des}`
              : "Record New Payment"}
          </h2>
          {editingPayment && (
            <button
              onClick={() => setEditingPayment(null)}
              className="text-xs text-rose-500 font-semibold hover:underline"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <FormComponent
          key={editingPayment ? editingPayment.id : "new-payment"}
          inputData={paymentFields}
          onSubmit={handleSavePayment}
          initialValues={editingPayment}
        />
      </div>

      {/* قسم جدول الدفعات باستخدام كومبوننت CustomTable الجاهز مع ميزة Expanded Row */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6 text-slate-700 text-left">
          Payments & Receipts List
        </h2>
        <CustomTableComponent
          headers={tableHeaders}
          data={formattedPayments}
          expandedRowId={expandedPaymentId}
          renderExpanded={(row: any) => (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-[#3A5B22]" size={20} />
                  <span className="font-bold text-slate-800">
                    Payment Receipt Details (#{row.number_des})
                  </span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Method: {row.paymentMethod}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                <div>
                  <p className="text-xs text-slate-400">Student Info</p>
                  <p className="font-semibold text-slate-800">{row.studentName}</p>
                  <p className="text-xs text-slate-500">ID: {row.studentCode || `ST-${row.student_id}`}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Course Info</p>
                  <p className="font-semibold text-slate-800">{row.courseTitle}</p>
                  <p className="text-xs text-slate-500">Course ID: {row.cours_id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Payment Breakdown</p>
                  <p className="font-semibold text-emerald-600 text-base">${row.Amount}</p>
                  <p className="text-xs text-slate-500">Date: {row.paymentDate}</p>
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
