// src/pages/StudentQuizzesPage.jsx  (بنفس مجلد CourseQuizzesPage ونفس عمق الـ imports)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../components/CustomTable.js";
import { fetchStudentQuizzes } from "../../services/quizApi.js";
import { usePageHeader } from "../../layout/AppLayout.js";

function StudentQuizzesPage() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  usePageHeader("My Quizzes");  
  useEffect(() => {
    fetchStudentQuizzes()
      .then(setQuizzes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const rows = quizzes.map((q) => ({
    ...q,
    resultBadge: q.attempt ? (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
        {q.attempt.mark} / {q.attempt.total}
      </span>
    ) : (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        Not taken
      </span>
    ),
  }));

  const tableHeaders = [
    { key: "id", label: "ID" },
    { key: "title", label: "Quiz Title" },
    { key: "questionsCount", label: "Questions" },
    { key: "resultBadge", label: "Result" },
    {
      type: "actions",
      label: "Actions",
      buttons: (row) => [
        {
          label: row.attempt ? "View Result" : "Start Quiz",
          className: row.attempt
            ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
          onClick: (r) => navigate(`/student/quizzes/${r.id}`),
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        {loading && <p className="text-slate-400">Loading...</p>}
        {error && <p className="text-rose-500">{error}</p>}
        {!loading && !error && (
          <CustomTable headers={tableHeaders} data={rows} />
        )}
      </div>
    </div>
  );
}

export default StudentQuizzesPage;
