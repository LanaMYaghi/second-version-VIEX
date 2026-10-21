// src/components/QuestionForm.jsx
import { useState } from "react";

const emptyAnswers = () => [
  { option: "", isCorrect: true },
  { option: "", isCorrect: false },
];

const inputClass =
  "w-full h-11 outline-none border border-slate-300 focus:border-[#3A5B22] focus:ring-1 focus:ring-[#3A5B22] rounded-xl px-4 text-sm bg-white transition-all";

function QuestionForm({ initialValues = null, onSubmit, onCancel }) {
  const [question, setQuestion] = useState(initialValues?.question || "");
  const [answers, setAnswers] = useState(
    initialValues?.answers?.map((a) => ({
      option: a.option,
      isCorrect: a.isCorrect,
    })) || emptyAnswers()
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateOption = (index, value) =>
    setAnswers((prev) =>
      prev.map((a, i) => (i === index ? { ...a, option: value } : a))
    );

  // جواب صح واحد فقط
  const setCorrect = (index) =>
    setAnswers((prev) =>
      prev.map((a, i) => ({ ...a, isCorrect: i === index }))
    );

  const addAnswer = () =>
    setAnswers((prev) => [...prev, { option: "", isCorrect: false }]);

  const removeAnswer = (index) =>
    setAnswers((prev) => {
      const next = prev.filter((_, i) => i !== index);
      // إذا حذفنا الجواب الصح، منخلي الأول هو الصح
      if (next.length && !next.some((a) => a.isCorrect))
        next[0] = { ...next[0], isCorrect: true };
      return next;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleaned = answers
      .map((a) => ({ ...a, option: a.option.trim() }))
      .filter((a) => a.option !== "");

    if (!question.trim()) return setError("Please write the question");
    if (cleaned.length < 2) return setError("Add at least 2 answers");
    if (cleaned.filter((a) => a.isCorrect).length !== 1)
      return setError("Choose exactly one correct answer");

    setSaving(true);
    try {
      await onSubmit({ question: question.trim(), answers: cleaned });
      if (!initialValues) {
        // وضع الإضافة: فضّي الفورم للسؤال الجاي
        setQuestion("");
        setAnswers(emptyAnswers());
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-sm font-medium text-slate-700 mb-1.5 block">
          Question
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Write your question here..."
          className="w-full h-24 outline-none border border-slate-300 focus:border-[#3A5B22] focus:ring-1 focus:ring-[#3A5B22] rounded-xl p-3 text-sm bg-white resize-none"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700 mb-2 block">
          Answers{" "}
          <span className="text-slate-400 font-normal">
            (select the correct one)
          </span>
        </label>
        <div className="space-y-3">
          {answers.map((a, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="radio"
                name="correctAnswer"
                checked={a.isCorrect}
                onChange={() => setCorrect(index)}
                className="w-4 h-4 accent-[#3A5B22]"
              />
              <input
                type="text"
                value={a.option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Answer ${index + 1}`}
                className={inputClass}
              />
              {answers.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeAnswer(index)}
                  className="text-rose-500 text-xl leading-none px-2"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addAnswer}
          className="mt-3 text-xs font-semibold text-[#3A5B22] hover:underline"
        >
          + Add another answer
        </button>
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="h-11 rounded-xl px-6 text-sm font-semibold text-white bg-[#3A5B22] hover:bg-black transition-colors disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : initialValues
            ? "Update Question"
            : "Add Question"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-rose-500 font-semibold hover:underline"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}

export default QuestionForm;
