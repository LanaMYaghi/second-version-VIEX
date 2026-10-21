import { Link } from "react-router-dom";
import { usePageHeader } from "../../layout/AppLayout";
import { listCoursesApi } from "../../services/courseApi.js";
import { listQuizzesApi } from "../../services/quizApi.js";
import { useAsync } from "../../hooks/useAsync.js";

// الباك ما عنده endpoint لـ "كورساتي"، فمنجرّب كل كورس
// والكورسات اللي الطالب مو مسجّل فيها بترجّع 403 فمنتجاهلها.
async function loadMyQuizzes() {
  const courses = await listCoursesApi();
  const results = await Promise.all(
    courses.map(async (course) => {
      try {
        const quizzes = await listQuizzesApi(course._id);
        return quizzes.map((quiz) => ({ course, quiz }));
      } catch {
        return [];
      }
    })
  );
  return results.flat();
}

export default function StudentQuizzesPage() {
  const { data, loading, error } = useAsync(loadMyQuizzes, [], []);
  usePageHeader("My Quizzes", `${data?.length ?? 0} quizzes`);

  if (loading) return <p className="text-slate-400">Loading...</p>;
  if (error) return <p className="text-rose-600">{error}</p>;
  if (!data.length) {
    return <p className="text-slate-500">No quizzes available. Make sure you are enrolled in a course.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map(({ course, quiz }) => (
        <div key={quiz._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs text-slate-400 uppercase font-bold">{course.title}</p>
          <h3 className="text-lg font-bold text-slate-800 mt-1">{quiz.title}</h3>
          <p className="text-sm text-slate-500 mt-1">{quiz.questions?.length ?? 0} questions</p>
          <Link
            to={`/student/courses/${course._id}/quizzes/${quiz._id}`}
            className="inline-block mt-4 h-10 leading-10 rounded-xl px-5 text-white font-semibold bg-[#3A5B22] hover:bg-black text-sm"
          >
            Open
          </Link>
        </div>
      ))}
    </div>
  );
}
