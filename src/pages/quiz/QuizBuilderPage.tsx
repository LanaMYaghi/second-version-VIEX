import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usePageHeader } from "../../layout/AppLayout";
import {
  getQuizApi,
  updateQuizApi,
  addQuestionApi,
  updateQuestionApi,
  deleteQuestionApi,
} from "../../services/quizApi.js";
import { errorText } from "../../services/apiClient.js";
import { useAsync } from "../../hooks/useAsync.js";

const EMPTY = { text: "", choices: ["", ""], correctAnswer: 0 };

function QuestionEditor({ initial, onSave, onCancel, saving }) {
  const [q, setQ] = useState(initial ?? EMPTY);

  const setChoice = (i, v) =>
    setQ((p) => ({ ...p, choices: p.choices.map((c, idx) => (idx === i ? v : c)) }));

  const addChoice = () =>
    setQ((p) => (p.choices.length >= 6 ? p : { ...p, choices: [...p.choices, ""] }));

  const removeChoice = (i) =>
    setQ((p) => {
      if (p.choices.length <= 2) return p;
      let correct = p.correctAnswer;
      if (i === correct) correct = 0;
      else if (i < correct) correct -= 1;
      return { ...p, choices: p.choices.filter((_, idx) => idx !== i), correctAnswer: correct };
    });

  const submit = async (e) => {
    e.preventDefault();
    const ok = await onSave({
      text: q.text.trim(),
      choices: q.choices.map((c) => c.trim()),
      correctAnswer: q.correctAnswer,
    });
    if (ok && !initial) setQ(EMPTY);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700 mb-1.5 block">Question</label>
        <textarea
          value={q.text}
          onChange={(e) => setQ((p) => ({ ...p, text: e.target.value }))}
          placeholder="Write your question here..."
          className="w-full h-24 border border-slate-300 focus:border-[#3A5B22] rounded-xl p-3 text-sm outline-none resize-none"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700 mb-2 block">
          Choices <span className="text-slate-400 font-normal">(select the correct one)</span>
        </label>
        <div className="space-y-3">
          {q.choices.map((c, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="radio"
                name="correct"
                checked={q.correctAnswer === i}
                onChange={() => setQ((p) => ({ ...p, correctAnswer: i }))}
                className="w-4 h-4 accent-[#3A5B22]"
              />
              <input
                type="text"
                value={c}
                onChange={(e) => setChoice(i, e.target.value)}
                placeholder={`Choice ${i + 1}`}
                className="w-full h-11 border border-slate-300 focus:border-[#3A5B22] rounded-xl px-4 text-sm outline-none"
              />
              {q.choices.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeChoice(i)}
                  className="text-rose-500 text-xl px-2"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        {q.choices.length < 6 && (
          <button
            type="button"
            onClick={addChoice}
            className="mt-3 text-xs font-semibold text-[#3A5B22] hover:underline"
          >
            + Add another choice
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="h-11 rounded-xl px-6 text-white font-semibold bg-[#3A5B22] hover:bg-black text-sm disabled:opacity-50"
        >
          {initial ? "Update Question" : "Add Question"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-xs text-rose-500 hover:underline">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function QuizBuilderPage() {
  const { courseId, quizId } = useParams();
  const { data: quiz, loading, error, reload } = useAsync(
    () => getQuizApi(courseId, quizId),
    [courseId, quizId]
  );
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(null);

  usePageHeader("Quiz Builder", quiz?.title ?? "");

  const run = async (fn) => {
    setSaving(true);
    try {
      await fn();
      await reload();
      return true;
    } catch (e) {
      alert(errorText(e)); // 409 إذا في طالب قدّم محاولة
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveTitle = async (e) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    const ok = await run(() => updateQuizApi(courseId, quizId, { name: t, title: t }));
    if (ok) setTitle(null);
  };

  if (loading) return <p className="text-slate-400">Loading...</p>;
  if (error) return <p className="text-rose-600">{error}</p>;
  if (!quiz) return null;

  return (
    <div className="space-y-8">
      <Link
        to={`/courses/${courseId}/quizzes`}
        className="text-sm text-[#3A5B22] font-semibold hover:underline"
      >
        ← Back to quizzes
      </Link>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        {title === null ? (
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-700">{quiz.title}</h2>
            <button
              onClick={() => setTitle(quiz.title)}
              className="text-xs text-emerald-600 font-semibold hover:underline"
            >
              Rename
            </button>
          </div>
        ) : (
          <form onSubmit={saveTitle} className="flex gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 h-11 border border-slate-300 rounded-xl px-4 text-sm outline-none"
            />
            <button className="h-11 rounded-xl px-5 text-white bg-[#3A5B22] text-sm font-semibold">
              Save
            </button>
            <button type="button" onClick={() => setTitle(null)} className="text-xs text-rose-500">
              Cancel
            </button>
          </form>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-700">Questions ({quiz.questions.length})</h2>
        {quiz.questions.map((q, idx) => (
          <div key={q._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            {editingId === q._id ? (
              <QuestionEditor
                initial={{ text: q.text, choices: q.choices, correctAnswer: q.correctAnswer }}
                saving={saving}
                onCancel={() => setEditingId(null)}
                onSave={async (payload) => {
                  const ok = await run(() => updateQuestionApi(courseId, quizId, q._id, payload));
                  if (ok) setEditingId(null);
                  return ok;
                }}
              />
            ) : (
              <>
                <div className="flex justify-between gap-4">
                  <p className="font-semibold text-slate-800">
                    {idx + 1}. {q.text}
                  </p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setEditingId(q._id)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        window.confirm("Delete this question?") &&
                        run(() => deleteQuestionApi(courseId, quizId, q._id))
                      }
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 text-sm">
                  {q.choices.map((c, i) => (
                    <li
                      key={i}
                      className={i === q.correctAnswer ? "text-emerald-700 font-semibold" : "text-slate-600"}
                    >
                      {i === q.correctAnswer ? "✓" : "○"} {c}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4 text-slate-700">Add Question</h2>
        <QuestionEditor
          saving={saving}
          onSave={(payload) => run(() => addQuestionApi(courseId, quizId, payload))}
        />
      </div>
    </div>
  );
}
