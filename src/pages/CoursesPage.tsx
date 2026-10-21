import React, { useState } from "react";
import Form from "../components/Form.js";
import CustomTable from "../components/CustomTable.js";
import { getCourseFormFields } from "../constants/formConfigs.js";
import { createCourseApi } from "../services/courseApi.js";

import { useNavigate } from "react-router-dom";
import QuizModal from "../components/QuizModal.jsx";
import { createQuiz } from "../services/quizApi.js";
import { can, getUserId } from "../utils/permissions.js";
import { usePageHeader } from "../layout/AppLayout.js";

function CoursesPage() {
  const currentUserRole = localStorage.getItem("userRole") || "secretary";
  const [teachers] = useState([
    { id: 1, name: "Mr. Mohammad Khaled" },
    { id: 2, name: "Ms. Fatima Ahmed" },
  ]);

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "General English Intensive",
      price: "200",
      description: "Complete intensive English course...",
      teacherId: "1",
      level: "B1-1",
      startDate: "2026-11-01",
      endDate: "2026-12-15",
      startTime: "10:00",
      endTime: "12:00",
      days: ["Sun", "Tue", "Thu"],
      status: "active",
    },
  ]);
  usePageHeader("Courses", `${courses.length} courses`);
  const [editingCourse, setEditingCourse] = useState(null);
  const courseFields = getCourseFormFields(teachers);

  // دالة الحفظ
  const handleSaveCourse = async (formValues) => {
    if (editingCourse) {
      setCourses(
        courses.map((c) =>
          c.id === editingCourse.id ? { ...c, ...formValues } : c
        )
      );
      alert("Course updated successfully!");
      setEditingCourse(null);
    } else {
      try {
        const newCourse = await createCourseApi(formValues);
        setCourses((prev) => [newCourse, ...prev]);
        alert("Course added successfully!");
      } catch (error) {
        // تجنب توقف التطبيق في حال حدوث خطأ شبكة
        const fallbackCourse = {
          ...formValues,
          id: Date.now(),
          status: "active",
        };
        setCourses((prev) => [fallbackCourse, ...prev]);
        alert("Course added (Local Mode)!");
      }
    }
  };

  const handleToggleStatus = (row) => {
    const nextStatus = row.status === "active" ? "suspended" : "active";
    setCourses(
      courses.map((c) => (c.id === row.id ? { ...c, status: nextStatus } : c))
    );
  };

  const handleDeleteCourse = (row) => {
    if (
      window.confirm(`Are you sure you want to delete course: ${row.title}?`)
    ) {
      setCourses(courses.filter((c) => c.id !== row.id));
    }
  };

  // تجهيز الداتا وعرض الأزرار والشارات الملونة
  const formattedCourses = courses.map((course) => ({
    ...course,
    statusBadge: (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          course.status === "active"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-rose-100 text-rose-700"
        }`}
      >
        {course.status === "active" ? "Active" : "Suspended"}
      </span>
    ),
  }));

  // أزرار العمليات المباشرة
  const actionButtons = [
    {
      label: "Edit",
      className: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
      onClick: (r) => setEditingCourse(r),
    },
    {
      label: "Toggle Status",
      className: "bg-amber-50 text-amber-600 hover:bg-amber-100",
      onClick: (r) => handleToggleStatus(r),
    },
  ];

  if (currentUserRole === "admin") {
    actionButtons.push({
      label: "Delete",
      className: "bg-rose-50 text-rose-600 hover:bg-rose-100",
      onClick: (r) => handleDeleteCourse(r),
    });
  }

  const tableHeaders = [
    { key: "id", label: "ID" },
    { key: "title", label: "Course Title" },
    { key: "level", label: "Level" },
    { key: "price", label: "Price ($)" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "statusBadge", label: "Status" },
    /* {
      type: "actions",
      label: "Actions",
      buttons: actionButtons,
    }, */

    {
      type: "actions",
      label: "Actions",
      buttons: (row) => {
        const btns = [...actionButtons];

        // الكل بيشوف كويزات الكورس
        btns.push({
          label: "Quizzes",
          className: "bg-sky-50 text-sky-600 hover:bg-sky-100",
          onClick: (r) => navigate(`/courses/${r.id}/quizzes`),
        });

        // الأستاذ بس، وعلى كورساته بس
        if (
          can("quiz:create") &&
          String(row.teacherId) === String(getUserId())
        ) {
          btns.push({
            label: "+ Quiz",
            className: "bg-violet-50 text-violet-600 hover:bg-violet-100",
            onClick: (r) => setQuizCourse(r),
          });
        }
        return btns;
      },
    },
  ];

  // داخل CoursesPage بعد الـ states
  const navigate = useNavigate();
  const [quizCourse, setQuizCourse] = useState(null); // الكورس اللي عم نضيفله كوييز

  const handleCreateQuiz = async ({ title }) => {
    if (!title?.trim()) return alert("Please enter quiz title");
    try {
      // courseId بيجي من الكورس المختار، مو من الفورم
      const quiz = await createQuiz({
        title: title.trim(),
        courseId: quizCourse.id,
      });
      setQuizCourse(null);
      navigate(`/quizzes/${quiz.id}`); // صفحة بناء الكوييز
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      className="p-6 sm:p-10 max-w-6xl mx-auto space-y-10 bg-slate-50 min-h-screen"
      dir="ltr"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 text-left">
          Course Management
        </h1>
        <span className="text-xs px-3 py-1 bg-slate-200 text-slate-700 rounded-full font-medium uppercase">
          Role: {currentUserRole}
        </span>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-700 text-left">
            {editingCourse
              ? `Edit Course: ${editingCourse.title}`
              : "Add New Course"}
          </h2>
          {editingCourse && (
            <button
              onClick={() => setEditingCourse(null)}
              className="text-xs text-rose-500 font-semibold hover:underline"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <Form
          key={editingCourse ? editingCourse.id : "new-course"}
          inputData={courseFields}
          onSubmit={handleSaveCourse}
          initialValues={editingCourse}
        />
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6 text-slate-700 text-left">
          Current Courses List
        </h2>
        <CustomTable headers={tableHeaders} data={formattedCourses} />
      </div>

      {quizCourse && (
        <QuizModal
          title={`New Quiz for: ${quizCourse.title}`}
          onSubmit={handleCreateQuiz}
          onClose={() => setQuizCourse(null)}
        />
      )}
    </div>
  );
}

export default CoursesPage;
