// src/pages/CourseQuizzesPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CustomTable from "../../components/CustomTable.js";
import QuizModal from "../../components/QuizModal.jsx";
import {
  fetchCourseQuizzes,
  fetchQuiz,
  updateQuiz,
  deleteQuiz,
} from "../../services/quizApi.js";
import { can } from "../../utils/permissions.js";

// عرض الأسئلة وأجوبتها (قراءة فقط)
function QuestionsPreview({ detail, quizId, canEdit }) {
  const navigate = useNavigate();

  if (!detail || detail.loading) {
    return <p className="text-slate-400">Loading questions...</p>;
  }
  if (detail.error) {
    return <p className="text-rose-500">{detail.error}</p>;
  }
  if (detail.questions.length === 0) {
    return (
      <div className="text-slate-400">
        No questions yet.{" "}
        {canEdit && (
          <button
            onClick={() => navigate(`/quizzes/${quizId}`)}
            className="font-semibold text-[#3A5B22] hover:underline"
          >
            Add questions
          </button>
        )}
      </div>
    );
  }

  return (
    <ol className="space-y-4">
      {detail.questions.map((q, i) => (
        <li key={q.id}>
          <p className="font-semibold text-slate-700">
            {i + 1}. {q.question}
          </p>
          <ul className="mt-1.5 ms-5 space-y-1 text-sm">
            {q.answers.map((a) => (
              <li
                key={a.id}
                className={
                  a.isCorrect
                    ? "font-semibold text-emerald-600"
                    : "text-slate-500"
                }
              >
                {a.isCorrect ? "✔" : "•"} {a.option}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

function CourseQuizzesPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingQuiz, setEditingQuiz] = useState(null);

  // الصف المفتوح + الأسئلة المحمّلة لكل كوييز { [quizId]: { loading, error, questions } }
  const [expandedId, setExpandedId] = useState(null);
  const [details, setDetails] = useState({});

  useEffect(() => {
    fetchCourseQuizzes(courseId)
      .then(setQuizzes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleToggleQuestions = (row) => {
    // ضغطة تانية = سكّر
    if (expandedId === row.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(row.id);

    // إذا محمّلة قبل، ما منطلبها مرة تانية
    if (details[row.id]?.questions) return;

    setDetails((prev) => ({ ...prev, [row.id]: { loading: true } }));
    fetchQuiz(row.id)
      .then((quiz) =>
        setDetails((prev) => ({
          ...prev,
          [row.id]: { questions: quiz.questions },
        }))
      )
      .catch((err) =>
        setDetails((prev) => ({ ...prev, [row.id]: { error: err.message } }))
      );
  };

  const handleRename = async ({ title }) => {
    if (!title?.trim()) return alert("Please enter quiz title");
    try {
      const updated = await updateQuiz(editingQuiz.id, { title: title.trim() });
      setQuizzes((prev) =>
        prev.map((q) => (q.id === updated.id ? { ...q, ...updated } : q))
      );
      setEditingQuiz(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete quiz "${row.title}" with all its questions?`))
      return;
    try {
      await deleteQuiz(row.id);
      setQuizzes((prev) => prev.filter((q) => q.id !== row.id));
      if (expandedId === row.id) setExpandedId(null);
      setDetails(({ [row.id]: _removed, ...rest }) => rest);
    } catch (err) {
      alert(err.message);
    }
  };

  const tableHeaders = [
    { key: "title", label: "Quiz Title" },
    { key: "questionsCount", label: "Questions" },
    { key: "submissionsCount", label: "Submitted" }, // جديد
    {
      type: "actions",
      label: "Actions",
      buttons: (row) => {
        const btns = [
          {
            label: expandedId === row.id ? "Hide Questions" : "Show Questions",
            className: "bg-slate-100 text-slate-600 hover:bg-slate-200",
            onClick: handleToggleQuestions,
          },
        ];

        // جديد: النتائج للأستاذ والسكرتيرة والأدمن
        if (can("quiz:results")) {
          btns.push({
            label: "Results",
            className: "bg-violet-50 text-violet-600 hover:bg-violet-100",
            onClick: (r) => navigate(`/quizzes/${r.id}/results`),
          });
        }

        if (can("quiz:edit")) {
          btns.push({
            label: "Edit Questions",
            className: "bg-sky-50 text-sky-600 hover:bg-sky-100",
            onClick: (r) => navigate(`/quizzes/${r.id}`),
          });
          btns.push({
            label: "Rename",
            className: "bg-amber-50 text-amber-600 hover:bg-amber-100",
            onClick: (r) => setEditingQuiz(r),
          });
        }
        if (can("quiz:delete")) {
          btns.push({
            label: "Delete",
            className: "bg-rose-50 text-rose-600 hover:bg-rose-100",
            onClick: (r) => handleDelete(r),
          });
        }
        return btns;
      },
    },
  ];

  return (
    <div
      className="p-6 sm:p-10 max-w-6xl mx-auto space-y-8 bg-slate-50 min-h-screen"
      dir="ltr"
    >
        <Link
          to="/courses"
          className="text-sm font-semibold text-slate-600 hover:underline"
        >
          ← Back to Courses
        </Link>
     

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        {loading && <p className="text-slate-400">Loading...</p>}
        {error && <p className="text-rose-500">{error}</p>}
        {!loading && !error && (
          <CustomTable
            headers={tableHeaders}
            data={quizzes}
            expandedRowId={expandedId}
            renderExpanded={(row) => (
              <QuestionsPreview
                detail={details[row.id]}
                quizId={row.id}
                canEdit={can("quiz:edit")}
              />
            )}
          />
        )}
      </div>

      {editingQuiz && (
        <QuizModal
          title="Rename Quiz"
          initialValues={editingQuiz}
          onSubmit={handleRename}
          onClose={() => setEditingQuiz(null)}
        />
      )}
    </div>
  );
}

export default CourseQuizzesPage;
