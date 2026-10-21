import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usePageHeader } from "../../layout/AppLayout";
import { getQuizApi, getMyAttemptApi, submitAttemptApi } from "../../services/quizApi.js";
import { errorText } from "../../services/apiClient.js";
import { useAsync } from "../../hooks/useAsync.js";

async function loadAll(courseId, quizId) {
  const [quiz, attempt] = await Promise.all([
    getQuizApi(courseId, quizId),
    getMyAttemptApi(quizId),
  ]);
  return { quiz, attempt };
}

export default function TakeQuizPage() {
  const { courseId, quizId } = useParams();
  const { data, loading, error, reload } = useAsync(
    () => loadAll(courseId, quizId),
    [courseId, quizId]
  );
  const [answers, setAnswers] = useState({}); // { questionId: choiceIndex }
  const [submitting, setSubmitting] = useState(false);

  usePageHeader("Quiz", data?.quiz?.title ?? "");

  const submit = async () => {
    const questions = data.quiz.questions;
    if (Object.keys(answers).length < questions.length) {
      if (!window.confirm("You didn't answer all questions. Submit anyway?")) return;
    }
    setSubmitting(true);
    try {
      await submitAttemptApi(
        quizId,
        Object.entries(answers).map(([questionId, choiceIndex]) => ({ questionId, choiceIndex }))
      );
      await reload(); // بيرجّع النتيجة من الباك
    } catch (e) {
      alert(errorText(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-slate-400">Loading...</p>;
  if (error) return <p className="text-rose-600">{error}</p>;
  if (!data) return null;

  const { quiz, attempt } = data;

  if (attempt) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-3">
        <h2 className="text-2xl font-bold text-slate-800">{quiz.title}</h2>
        <p className="text-5xl font-bold text-[#3A5B22]">
          {attempt.score} / {attempt.totalQuestions}
        </p>
        <p className="text-sm text-slate-500">
          Submitted on {new Date(attempt.createdAt).toLocaleString()}
        </p>
        <Link to="/student/quizzes" className="inline-block text-sm text-[#3A5B22] font-semibold hover:underline">
          ← Back to my quizzes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {quiz.questions.length === 0 && (
        <p className="text-slate-500">This quiz has no questions yet.</p>
      )}

      {quiz.questions.map((q, idx) => (
        <div key={q._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="font-semibold text-slate-800 mb-4">
            {idx + 1}. {q.text}
          </p>
          <div className="space-y-2">
            {q.choices.map((c, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  name={q._id}
                  checked={answers[q._id] === i}
                  onChange={() => setAnswers((p) => ({ ...p, [q._id]: i }))}
                  className="w-4 h-4 accent-[#3A5B22]"
                />
                {c}
              </label>
            ))}
          </div>
        </div>
      ))}

      {quiz.questions.length > 0 && (
        <button
          onClick={submit}
          disabled={submitting}
          className="h-11 rounded-xl px-8 text-white font-semibold bg-[#3A5B22] hover:bg-black text-sm disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      )}
      <p className="text-xs text-slate-400">You can submit only once.</p>
    </div>
  );
}
