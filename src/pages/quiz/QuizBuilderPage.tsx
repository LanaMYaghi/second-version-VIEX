// src/pages/QuizBuilderPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CustomTable from "../../components/CustomTable.js";
import QuestionForm from "../../components/QuestionForm.jsx";
import {
  fetchQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "../../services/quizApi.js";
import { can } from "../../utils/permissions.js";
import { usePageHeader } from "../../layout/AppLayout.js";

function QuizBuilderPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const canEdit = can("quiz:edit"); // الأستاذ بس. الباقي read-only

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingQuestion, setEditingQuestion] = useState(null);
  usePageHeader(
    quiz?.title ?? "Quiz",
    quiz ? `${quiz.questions.length} questions` : ""
  );
  useEffect(() => {
    fetchQuiz(quizId)
      .then(setQuiz)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [quizId]);

  // QuestionForm بيمسك الأخطاء بنفسه، فما منعمل try/catch هون
  const handleSaveQuestion = async (data) => {
    if (editingQuestion) {
      const updated = await updateQuestion(quiz.id, editingQuestion.id, data);
      setQuiz((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === updated.id ? updated : q
        ),
      }));
      setEditingQuestion(null);
    } else {
      const created = await addQuestion(quiz.id, data);
      setQuiz((prev) => ({ ...prev, questions: [...prev.questions, created] }));
    }
  };

  const handleDeleteQuestion = async (row) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await deleteQuestion(quiz.id, row.id);
      setQuiz((prev) => ({
        ...prev,
        questions: prev.questions.filter((q) => q.id !== row.id),
      }));
      if (editingQuestion?.id === row.id) setEditingQuestion(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFinish = () => {
    if (canEdit && quiz.questions.length === 0)
      return alert("Add at least one question first");
    navigate(`/courses/${quiz.courseId}/quizzes`);
  };

  if (loading) return <div className="p-10 text-slate-400">Loading...</div>;
  if (error) return <div className="p-10 text-rose-500">{error}</div>;
  if (!quiz) return null;

  // تجهيز الصفوف: الجواب الصح بلون أخضر
  const rows = quiz.questions.map((q, i) => ({
    ...q,
    index: i + 1,
    answersView: (
      <ul className="space-y-1">
        {q.answers.map((a) => (
          <li
            key={a.id}
            className={
              a.isCorrect ? "font-semibold text-emerald-600" : "text-slate-500"
            }
          >
            {a.isCorrect ? "✔" : "•"} {a.option}
          </li>
        ))}
      </ul>
    ),
  }));

  const tableHeaders = [
    { key: "id", label: "ID" },
    { key: "index", label: "#" },
    { key: "question", label: "Question" },
    { key: "answersView", label: "Answers" },
    // عمود الأزرار بيظهر للأستاذ بس
    ...(canEdit
      ? [
          {
            type: "actions",
            label: "Actions",
            buttons: [
              {
                label: "Edit",
                className:
                  "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
                onClick: (row) => setEditingQuestion(row),
              },
              {
                label: "Delete",
                className: "bg-rose-50 text-rose-600 hover:bg-rose-100",
                onClick: (row) => handleDeleteQuestion(row),
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-8">
      <Link
        to={`/courses/${quiz.courseId}/quizzes`}
        className="inline-block text-sm font-semibold text-slate-600 hover:underline"
      >
        ← Back to Quizzes
      </Link>

      {canEdit && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-6 text-slate-700">
            {editingQuestion ? "Edit Question" : "Add New Question"}
          </h2>
          <QuestionForm
            key={editingQuestion ? editingQuestion.id : "new-question"}
            initialValues={editingQuestion}
            onSubmit={handleSaveQuestion}
            onCancel={editingQuestion ? () => setEditingQuestion(null) : null}
          />
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6 text-slate-700">
          Questions & Answers
        </h2>
        <CustomTable headers={tableHeaders} data={rows} />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleFinish}
          className="h-11 rounded-xl px-8 text-sm font-semibold text-white bg-[#3A5B22] hover:bg-black transition-colors"
        >
          {canEdit ? "Finish Quiz" : "Back"}
        </button>
      </div>
    </div>
  );
}

export default QuizBuilderPage;
