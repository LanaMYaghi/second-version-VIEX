import { useState } from "react";

import { getStudentFormFields } from "../constants/formConfigs.js";
import {
  createStudentApi,
  toggleStudentStatusApi,
  deleteStudentApi,
} from "../services/studentApi.js";
import CustomTable from "../components/CustomTable.tsx";
import Form from "../components/Form.tsx";
import { usePageHeader } from "../layout/AppLayout.tsx";

function StudentsPage() {
  // جلب الرول الحقيقي للمستخدم (افتراضياً secretary إذا لم يتم تسجيل الدخول)
  const currentUserRole = localStorage.getItem("userRole") || "secretary";

  const [students, setStudents] = useState([]);

  usePageHeader("Students", `${students.length} students`);


  const [editingStudent, setEditingStudent] = useState(null);
  const studentFields = getStudentFormFields();

  // دالة حفظ الطالب (إضافة جديدة عبر الـ API أو تعديل)
  const handleSaveStudent = async (formValues) => {
    if (editingStudent) {
      // حالة التعديل
      setStudents(
        students.map((s) =>
          s.id === editingStudent.id ? { ...s, ...formValues } : s
        )
      );
      alert("Student updated successfully!");
      setEditingStudent(null);
    } else {
      // حالة الإضافة الجديدة: استدعاء الـ API
      try {
        const newStudent = await createStudentApi(formValues);
        setStudents((prev) => [newStudent, ...prev]);
        alert("Student added successfully!");
      } catch (error) {
        console.warn("API Error, saving locally");
        const fallbackStudent = {
          ...formValues,
          id: Date.now(),
          status: "active",
        };
        setStudents((prev) => [fallbackStudent, ...prev]);
        alert("Student added (Local Mode)!");
      }
    }
  };

  // دالة إيقاف / تفعيل الطالب عبر الـ API
  const handleToggleStatus = async (row) => {
    const nextStatus = row.status === "active" ? "suspended" : "active";
    try {
      await toggleStudentStatusApi(row.id, nextStatus);
    } catch (error) {
      console.warn("API Status Toggle Error, updating locally");
    }
    setStudents(
      students.map((s) => (s.id === row.id ? { ...s, status: nextStatus } : s))
    );
  };

  // دالة الحذف عبر الـ API (للأدمن فقط)
  const handleDeleteStudent = async (row) => {
    if (
      window.confirm(
        `Are you sure you want to delete student: ${row.fullName}?`
      )
    ) {
      try {
        await deleteStudentApi(row.id);
      } catch (error) {
        console.warn("API Delete Error, deleting locally");
      }
      setStudents(students.filter((s) => s.id !== row.id));
    }
  };

  // تجهيز الداتا مع شارة الحالة الملونة
  const formattedStudents = students.map((student) => {
    const isSuspended = student.status === "suspended";

    // أزرار العمليات لكل سطر ديناميكياً
    const rowButtons = [
      {
        label: "Edit",
        className: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
        onClick: (r) => setEditingStudent(r),
      },
      {
        label: isSuspended ? "Activate" : "Suspend",
        className: isSuspended
          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
          : "bg-rose-50 text-rose-600 hover:bg-rose-100",
        onClick: (r) => handleToggleStatus(r),
      },
    ];

    // زر الحذف يظهر للأدمن حصراً
    if (currentUserRole === "admin") {
      rowButtons.push({
        label: "Delete",
        className: "bg-rose-50 text-rose-600 hover:bg-rose-100",
        onClick: (r) => handleDeleteStudent(r),
      });
    }

    return {
      ...student,
      statusBadge: (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            student.status === "active"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {student.status === "active" ? "Active" : "Suspended"}
        </span>
      ),
      customButtons: rowButtons,
    };
  });

  const tableHeaders = [
    { key: "id", label: "ID" },
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "fatherPhone", label: "Father's Phone" },
    { key: "nationality", label: "Nationality" },
    { key: "gender", label: "Gender" },
    { key: "statusBadge", label: "Status" },
    {
      type: "actions",
      label: "Actions",
      buttons: (row) => row.customButtons,
    },
  ];

  return (
    <div className="space-y-8">
      {/* قسم الفورم (إضافة أو تعديل طالب) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-700 text-left">
            {editingStudent
              ? `Edit Student: ${editingStudent.fullName}`
              : "Add New Student"}
          </h2>
          {editingStudent && (
            <button
              onClick={() => setEditingStudent(null)}
              className="text-xs text-rose-500 font-semibold hover:underline"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <Form
          key={editingStudent ? editingStudent.id : "new-student"}
          inputData={studentFields}
          onSubmit={handleSaveStudent}
          initialValues={editingStudent}
        />
      </div>
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6 text-slate-700 text-left">
          Students List
        </h2>
        <CustomTable headers={tableHeaders} data={formattedStudents} />
      </div>
    </div>
  );
}

export default StudentsPage;
