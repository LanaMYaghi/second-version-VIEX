import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Form from "../../components/Form";
import CustomTable from "../../components/CustomTable";
import { usePageHeader } from "../../layout/AppLayout";
import { getQuizFormFields } from "../../constants/formConfigs.js";
import { listQuizzesApi, createQuizApi, deleteQuizApi } from "../../services/quizApi.js";
import { errorText } from "../../services/apiClient.js";
import { useAsync } from "../../hooks/useAsync.js";
import { can } from "../../utils/permissions.js";
import { formatDate } from "../../utils/format.js";

export default function CourseQuizzesPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const { data: quizzes, loading, error, reload } = useAsync(
    () => listQuizzesApi(courseId),
    [courseId],
    []
  );

  usePageHeader("Quizzes", `${quizzes?.length ?? 0} quizzes`);

  const handleCreate = async (values) => {
    setSaving(true);
    try {
      // الـ Model بيطلب name و title، منبعت الاتنين بنفس القيمة
      const title = (values.title || "").trim();
      await createQuizApi(courseId, { name: title, title });
      await reload();
      return true;
    } catch (e) {
      alert(errorText(e));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (quiz) => {
    if (!window.confirm(`Delete quiz: ${quiz.title}?`)) return;
    try {
      await deleteQuizApi(courseId, quiz._id);
      await reload();
    } catch (e) {
      alert(errorText(e)); // 409 إذا في نتائج طلاب
    }
  };

  const headers = [
    { key: "counter", label: "#" },
    { key: "title", label: "Title" },
    { label: "Questions", render: (r) => r.questions?.length ?? 0 },
    { label: "Created", render: (r) => formatDate(r.createdAt) },
    {
      type: "actions",
      label: "Actions",
      buttons: (row) => [
        ...(can("quizzes.update")
          ? [
              {
                label: "Build",
                className: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
                onClick: () => navigate(`/courses/${courseId}/quizzes/${row._id}`),
              },
            ]
          : []),
        ...(can("quizzes.delete")
          ? [
              {
                label: "Delete",
                className: "bg-rose-50 text-rose-600 hover:bg-rose-100",
                onClick: () => handleDelete(row),
              },
            ]
          : []),
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <Link to="/courses" className="text-sm text-[#3A5B22] font-semibold hover:underline">
        ← Back to courses
      </Link>

      {can("quizzes.create") && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-6 text-slate-700">Add New Quiz</h2>
          <Form inputData={getQuizFormFields()} onSubmit={handleCreate} submitting={saving} />
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6 text-slate-700">Quizzes List</h2>
        {error && <p className="text-rose-600 text-sm mb-4">{error}</p>}
        {loading ? (
          <p className="text-slate-400 text-sm">Loading...</p>
        ) : (
          <CustomTable
            headers={headers}
            data={(quizzes ?? []).map((q) => ({ ...q, id: q._id }))}
          />
        )}
      </div>
    </div>
  );
}
