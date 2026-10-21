// src/pages/QuizResultsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CustomTable from "../../components/CustomTable.js";
import { fetchQuizResults } from "../../services/quizApi.js";
import { usePageHeader } from "../../layout/AppLayout.js";

const PASS_PERCENT = 50; // نسبة النجاح

function StatCard({ label, value }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
      <p className="text-xs uppercase font-bold text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );
}

function QuizResultsPage() {
  const { quizId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  usePageHeader("Quiz Results", data?.quiz?.title ?? "");

  useEffect(() => {
    fetchQuizResults(quizId)
      .then(setData)
      .catch((err) => setError(err.message)) // مثلاً 403 إذا الكوييز مو تبع هالأستاذ
      .finally(() => setLoading(false));
  }, [quizId]);

  // نرتب من الأعلى للأدنى ونحسب النسبة والترتيب مرة وحدة
  const rows = useMemo(() => {
    if (!data) return [];
    const { results, total } = data;

    return [...results]
      .sort((a, b) => b.mark - a.mark)
      .map((r, i) => {
        const percent = total ? Math.round((r.mark / total) * 100) : 0;
        const passed = percent >= PASS_PERCENT;
        return {
          ...r,
          rank: i + 1,
          markText: `${r.mark} / ${total}`,
          percentText: `${percent}%`,
          statusBadge: (
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                passed
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {passed ? "Passed" : "Failed"}
            </span>
          ),
          percent,
        };
      });
  }, [data]);

  const stats = useMemo(() => {
    if (rows.length === 0) return null;
    const avg = rows.reduce((sum, r) => sum + r.percent, 0) / rows.length;
    return {
      count: rows.length,
      average: `${Math.round(avg)}%`,
      highest: `${rows[0].mark} / ${data.total}`,
      passed: rows.filter((r) => r.percent >= PASS_PERCENT).length,
    };
  }, [rows, data]);

  const tableHeaders = [
    { key: "id", label: "ID" },
    { key: "rank", label: "#" },
    { key: "studentName", label: "Student" },
    { key: "markText", label: "Mark" },
    { key: "percentText", label: "Percentage" },
    { key: "statusBadge", label: "Status" },
  ];

  return (
    <div className="space-y-8">
      <Link
        to={data ? `/courses/${data.quiz.courseId}/quizzes` : "/courses"}
        className="text-sm font-semibold text-slate-600 hover:underline"
      >
        ← Back to Quizzes
      </Link>
      {loading && <p className="text-slate-400">Loading...</p>}
      {error && <p className="text-rose-500">{error}</p>}

      {!loading && !error && (
        <>
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Submissions" value={stats.count} />
              <StatCard label="Average" value={stats.average} />
              <StatCard label="Highest" value={stats.highest} />
              <StatCard
                label="Passed"
                value={`${stats.passed} / ${stats.count}`}
              />
            </div>
          )}

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-6 text-slate-700">Students</h2>
            <CustomTable headers={tableHeaders} data={rows} />
          </div>
        </>
      )}
    </div>
  );
}

export default QuizResultsPage;
