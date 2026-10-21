// src/components/QuestionForm.jsx
import { useState } from "react";
import Form from "./Form";

const emptyAnswers = () => [
  { option: "", isCorrect: true },
  { option: "", isCorrect: false },
];

function QuestionForm({ initialValues = null, onSubmit, onCancel }) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // تشكيل البيانات الأولية بالتنسيق الذي يتعامل معه Form
  const formattedInitialValues = {
    question: initialValues?.question || "",
    answers: initialValues?.answers?.map((a) => ({
      option: a.option,
      isCorrect: a.isCorrect,
    })) || emptyAnswers(),
  };

  const handleSubmit = async (formData) => {
    setError("");

    const currentQuestion = formData.question || "";
    const answersList = formData.answers || emptyAnswers();

    const cleaned = answersList
      .map((a) => ({ ...a, option: a.option.trim() }))
      .filter((a) => a.option !== "");

    if (!currentQuestion.trim()) return setError("Please write the question");
    if (cleaned.length < 2) return setError("Add at least 2 answers");
    if (cleaned.filter((a) => a.isCorrect).length !== 1)
      return setError("Choose exactly one correct answer");

    setSaving(true);
    try {
      await onSubmit({ question: currentQuestion.trim(), answers: cleaned });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // هيكل الحقول الممررة لمكوّن Form الأساسي
  const inputData = [
    { type: "question" },
    { 
      type: "submit", 
      text: saving ? "Saving..." : "Add Question",
      updateText: saving ? "Saving..." : "Update Question",
      disabled: saving 
    }
  ];

  return (
    <div className="space-y-4">
      <Form
        inputData={inputData}
        initialValues={formattedInitialValues}
        onSubmit={handleSubmit}
        isAuth={true}
      />

      {error && <p className="text-sm text-rose-500">{error}</p>}

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
  );
}

export default QuestionForm;