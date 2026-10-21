import { useMemo, useState } from "react";
import Form from "../../components/Form";
import CustomTable from "../../components/CustomTable";
import { usePageHeader } from "../../layout/AppLayout";
import { getInvoiceFormFields } from "../../constants/formConfigs.js";
import {
  listInvoicesApi,
  createInvoiceApi,
  deleteInvoiceApi,
} from "../../services/invoicesApi.js";
import { listUsersApi } from "../../services/usersApi.js";
import { listCoursesApi } from "../../services/courseApi.js";
import { errorText } from "../../services/apiClient.js";
import { useAsync } from "../../hooks/useAsync.js";
import { can } from "../../utils/permissions.js";
import { formatDate } from "../../utils/format.js";

const LIMIT = 20;

// القوائم المرجعية (الطلاب/الكورسات) اختيارية: إذا ما في صلاحية منكمل بدونها
async function loadLookups() {
  const [students, courses] = await Promise.all([
    can("students.read") ? listUsersApi("students").catch(() => []) : [],
    can("courses.view") ? listCoursesApi().catch(() => []) : [],
  ]);
  return { students, courses };
}

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);

  const { data: lookups } = useAsync(loadLookups, [], { students: [], courses: [] });
  const { data, loading, error, reload } = useAsync(
    () => listInvoicesApi({ page, limit: LIMIT }),
    [page],
    { invoices: [], pagination: null }
  );

  const students = lookups?.students ?? [];
  const courses = lookups?.courses ?? [];
  const invoices = data?.invoices ?? [];
  const pagination = data?.pagination;

  usePageHeader("Payments", `${pagination?.total ?? invoices.length} invoices`);

  const fields = useMemo(() => getInvoiceFormFields(students, courses), [students, courses]);

  const studentName = (id) => {
    const key = typeof id === "object" ? id?._id : id;
    return students.find((s) => s.id === key)?.full_name ?? key;
  };
  const courseName = (id) => {
    const key = typeof id === "object" ? id?._id : id;
    return courses.find((c) => c._id === key)?.title ?? key;
  };

  const handleCreate = async (values) => {
    setSaving(true);
    try {
      await createInvoiceApi({
        userId: values.userId,
        courseId: values.courseId,
        amount: Number(values.amount),
        receiptNumber: (values.receiptNumber || "").trim(),
      });
      setPage(1);
      await reload();
      return true;
    } catch (e) {
      alert(errorText(e));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (inv) => {
    if (!window.confirm(`Delete invoice ${inv.receiptNumber}?`)) return;
    try {
      await deleteInvoiceApi(inv._id);
      await reload();
    } catch (e) {
      alert(errorText(e));
    }
  };

  const headers = [
    { key: "counter", label: "#" },
    { key: "receiptNumber", label: "Receipt" },
    { label: "Student", render: (r) => studentName(r.userId) },
    { label: "Course", render: (r) => courseName(r.courseId) },
    { label: "Amount ($)", render: (r) => r.amount },
    { label: "Date", render: (r) => formatDate(r.createdAt) },
    {
      type: "actions",
      label: "Actions",
      buttons: () => [
        ...(can("invoices.delete")
          ? [
              {
                label: "Delete",
                className: "bg-rose-50 text-rose-600 hover:bg-rose-100",
                onClick: handleDelete,
              },
            ]
          : []),
      ],
    },
  ];

  const totalPages = pagination?.totalPages ?? pagination?.pages ?? 1;

  return (
    <div className="space-y-8">
      {can("invoices.create") && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-6 text-slate-700">New Invoice</h2>
          <Form inputData={fields} onSubmit={handleCreate} submitting={saving} />
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6 text-slate-700">Invoices</h2>
        {error && <p className="text-rose-600 text-sm mb-4">{error}</p>}
        {loading ? (
          <p className="text-slate-400 text-sm">Loading...</p>
        ) : (
          <CustomTable headers={headers} data={invoices.map((i) => ({ ...i, id: i._id }))} />
        )}

        {totalPages > 1 && (
          <div className="flex items-center gap-3 mt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-xs text-slate-500">
              Page {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
