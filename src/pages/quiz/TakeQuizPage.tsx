// src/pages/TakeQuizPage.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchQuizToTake, submitQuiz } from "../../services/quizApi.js";

function ResultCard({ mark, total }) {
  const percent = total ? Math.round((mark / total) * 100) : 0;
  const passed = percent >= 50;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-3">
      <p className="text-sm text-slate-500">Your result</p>
      <p
        className={`text-5xl font-bold ${
          passed ? "text-emerald-600" : "text-rose-600"
        }`}
      >
        {mark} / {total}
      </p>
      <p className="text-slate-500">{percent}%</p>
      <Link
        to="/student/quizzes"
        className="inline-block mt-4 h-11 leading-[2.75rem] rounded-xl px-8 text-sm font-semibold text-white bg-[#3A5B22] hover:bg-black transition-colors"
      >
        Back to My Quizzes
      </Link>
    </div>
  );
}

function TakeQuizPage() {
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState({}); // { [questionId]: answerId }
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuizToTake(quizId)
      .then((data) => {
        setQuiz(data);
        if (data.attempt) setResult(data.attempt); // محلول من قبل
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [quizId]);

  const handleSelect = (questionId, answerId) =>
    setSelected((prev) => ({ ...prev, [questionId]: answerId }));

  const answeredCount = Object.keys(selected).length;
  const total = quiz?.questions.length ?? 0;

  const handleSubmit = async () => {
    if (answeredCount < total) {
      const ok = window.confirm(
        `You answered ${answeredCount} of ${total}. Submit anyway?`
      );
      if (!ok) return;
    }

    setSubmitting(true);
    try {
      const answers = Object.entries(selected).map(
        ([questionId, answerId]) => ({
          questionId: Number(questionId),
          answerId,
        })
      );
      const res = await submitQuiz(quiz.id, answers);
      setResult(res);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-slate-400">Loading...</div>;
  if (error) return <div className="p-10 text-rose-500">{error}</div>;
  if (!quiz) return null;

  return (
    <div
      className="p-6 sm:p-10 max-w-3xl mx-auto space-y-8 bg-slate-50 min-h-screen"
      dir="ltr"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">{quiz.title}</h1>
        {!result && (
          <span className="text-sm text-slate-500">
            {answeredCount} / {total} answered
          </span>
        )}
      </div>

      {result ? (
        <ResultCard mark={result.mark} total={result.total} />
      ) : (
        <>
          {quiz.questions.map((q, i) => (
            <div
              key={q.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
            >
              <p className="font-semibold text-slate-700 mb-4">
                {i + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.answers.map((a) => (
                  <label
                    key={a.id}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer text-sm transition-colors ${
                      selected[q.id] === a.id
                        ? "border-[#3A5B22] bg-emerald-50 text-slate-800"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      checked={selected[q.id] === a.id}
                      onChange={() => handleSelect(q.id, a.id)}
                      className="w-4 h-4 accent-[#3A5B22]"
                    />
                    {a.option}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="h-11 rounded-xl px-8 text-sm font-semibold text-white bg-[#3A5B22] hover:bg-black transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TakeQuizPage;
