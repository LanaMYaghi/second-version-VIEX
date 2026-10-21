import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../components/Form";
import CustomTable from "../components/CustomTable";
import { usePageHeader } from "../layout/AppLayout";
import { getCourseFormFields } from "../constants/formConfigs.js";
import {
  listCoursesApi,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
  enrollStudentApi,
  unenrollStudentApi,
} from "../services/courseApi.js";
import { listUsersApi } from "../services/usersApi.js";
import { errorText } from "../services/apiClient.js";
import { useAsync } from "../hooks/useAsync.js";
import { can } from "../utils/permissions.js";
import { toDateInput, formatDate } from "../utils/format.js";

const NUMBER_FIELDS = ["price"];
const FIELDS = ["title", "description", "price", "start_date", "end_date", "start_time", "end_time"];

function buildPayload(values) {
  const out = {};
  for (const name of FIELDS) {
    const v = values[name];
    if (v === undefined || v === null || v === "") continue;
    out[name] = NUMBER_FIELDS.includes(name) ? Number(v) : v;
  }
  return out;
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const { data: courses, loading, error, reload } = useAsync(listCoursesApi, [], []);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  // قسم التسجيل بالكورس
  const [enrollCourse, setEnrollCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");

  usePageHeader("Courses", `${courses?.length ?? 0} courses`);

  const fields = useMemo(() => getCourseFormFields(), []);

  const initialValues = useMemo(() => {
    if (!editing) return null;
    return {
      ...editing,
      start_date: toDateInput(editing.start_date),
      end_date: toDateInput(editing.end_date),
    };
  }, [editing]);

  const handleSave = async (values) => {
    setSaving(true);
    try {
      const payload = buildPayload(values);
      if (editing) {
        await updateCourseApi(editing._id, payload);
        setEditing(null);
      } else {
        await createCourseApi(payload);
      }
      await reload();
      return true;
    } catch (e) {
      alert(errorText(e));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete course: ${course.title}?`)) return;
    try {
      await deleteCourseApi(course._id);
      if (enrollCourse?._id === course._id) setEnrollCourse(null);
      await reload();
    } catch (e) {
      alert(errorText(e));
    }
  };

  const openEnroll = async (course) => {
    try {
      if (!students.length) setStudents(await listUsersApi("students"));
      setStudentId("");
      setEnrollCourse(course);
    } catch (e) {
      alert(errorText(e));
    }
  };

  const doEnroll = async (remove = false) => {
    if (!studentId) return alert("Choose a student first");
    try {
      await (remove ? unenrollStudentApi : enrollStudentApi)(enrollCourse._id, studentId);
      alert(remove ? "Student unenrolled" : "Student enrolled");
    } catch (e) {
      alert(errorText(e));
    }
  };

  const rows = (courses ?? []).map((c) => ({ ...c, id: c._id }));

  const headers = [
    { key: "counter", label: "#" },
    { key: "title", label: "Title" },
    { key: "price", label: "Price ($)" },
    { label: "Dates", render: (r) => `${formatDate(r.start_date)} → ${formatDate(r.end_date)}` },
    { label: "Time", render: (r) => (r.start_time ? `${r.start_time} - ${r.end_time ?? ""}` : "—") },
    {
      type: "actions",
      label: "Actions",
      buttons: (row) => [
        ...(can("quizzes.view")
          ? [
              {
                label: "Quizzes",
                className: "bg-sky-50 text-sky-600 hover:bg-sky-100",
                onClick: () => navigate(`/courses/${row._id}/quizzes`),
              },
            ]
          : []),
        ...(can("course_students.manage")
          ? [
              {
                label: "Enroll",
                className: "bg-amber-50 text-amber-600 hover:bg-amber-100",
                onClick: () => openEnroll(row),
              },
            ]
          : []),
        ...(can("courses.update")
          ? [
              {
                label: "Edit",
                className: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
                onClick: () => setEditing(row),
              },
            ]
          : []),
        ...(can("courses.delete")
          ? [
              {
                label: "Delete",
                className: "bg-rose-50 text-rose-600 hover:bg-rose-100",
                onClick: () => handleDelete(row),
              },
            ]
          : []),
      ],
    },
  ];

  const canSave = editing ? can("courses.update") : can("courses.create");

  return (
    <div className="space-y-8">
      {canSave && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-700">
              {editing ? `Edit Course: ${editing.title}` : "Add New Course"}
            </h2>
            {editing && (
              <button
                onClick={() => setEditing(null)}
                className="text-xs text-rose-500 font-semibold hover:underline"
              >
                Cancel Edit
              </button>
            )}
          </div>
          <Form
            key={editing ? editing._id : "new-course"}
            inputData={fields}
            onSubmit={handleSave}
            initialValues={initialValues}
            submitting={saving}
          />
        </div>
      )}

      {enrollCourse && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-4 text-slate-700">
            Enrollment: {enrollCourse.title}
          </h2>
          <div className="flex flex-wrap items-end gap-3">
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="h-11 min-w-[260px] border border-slate-300 rounded-xl px-4 text-sm bg-white"
            >
              <option value="">Choose a student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name} ({s.email})
                </option>
              ))}
            </select>
            <button
              onClick={() => doEnroll(false)}
              className="h-11 rounded-xl px-5 text-white font-semibold bg-[#3A5B22] hover:bg-black text-sm"
            >
              Enroll
            </button>
            <button
              onClick={() => doEnroll(true)}
              className="h-11 rounded-xl px-5 font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 text-sm"
            >
              Unenroll
            </button>
            <button
              onClick={() => setEnrollCourse(null)}
              className="h-11 px-3 text-xs text-slate-500 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6 text-slate-700">Courses List</h2>
        {error && <p className="text-rose-600 text-sm mb-4">{error}</p>}
        {loading ? (
          <p className="text-slate-400 text-sm">Loading...</p>
        ) : (
          <CustomTable headers={headers} data={rows} />
        )}
      </div>
    </div>
  );
}
