import { useMemo, useState } from "react";
import Form from "./Form";
import CustomTable from "./CustomTable";
import { usePageHeader } from "../layout/AppLayout";
import { useUsers } from "../hooks/useUsers";
import {
  createUserApi,
  updateUserApi,
  setUserStatusApi,
  deleteUserApi,
} from "../services/usersApi";
import { errorText } from "../services/apiClient";
import { can } from "../utils/permissions";
import { toDateInput } from "../utils/format";

// أسماء الحقول وأنواعها من إعدادات الفورم
function fieldTypes(fields) {
  const map = {};
  for (const f of fields) {
    if (f.inputs) f.inputs.forEach((i) => (map[i.name] = i.type));
    else if (f.name) map[f.name] = f.type;
  }
  return map;
}

// بيبعت بس الحقول المعروفة، بيحذف الفاضي، وبيحوّل الأرقام
function buildPayload(values, types) {
  const out = {};
  for (const [name, type] of Object.entries(types)) {
    const v = values[name];
    if (v === undefined || v === null || v === "") continue;
    out[name] = type === "number" ? Number(v) : v;
  }
  return out;
}

export default function UsersCrudPage({ type, title, singular, getFields, columns }) {
  const { items, loading, error, reload } = useUsers(type);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  usePageHeader(title, `${items.length} ${title.toLowerCase()}`);

  const fields = useMemo(() => getFields(!!editing), [getFields, editing]);
  const types = useMemo(() => fieldTypes(fields), [fields]);

  const initialValues = useMemo(() => {
    if (!editing) return null;
    return { ...editing, birthday: toDateInput(editing.birthday) };
  }, [editing]);

  const handleSave = async (formValues) => {
    setSaving(true);
    try {
      const payload = buildPayload(formValues, types);
      if (editing) {
        await updateUserApi(type, editing.id, payload);
        setEditing(null);
        alert(`${singular} updated successfully`);
      } else {
        await createUserApi(type, payload);
        alert(`${singular} added successfully`);
      }
      await reload(); // الباك هو المصدر الوحيد للحقيقة
      return true;
    } catch (e) {
      alert(errorText(e));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (row) => {
    try {
      await setUserStatusApi(type, row.id, row.status === "active" ? "suspended" : "active");
      await reload();
    } catch (e) {
      alert(errorText(e));
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete: ${row.full_name}?`)) return;
    try {
      await deleteUserApi(type, row.id);
      if (editing?.id === row.id) setEditing(null);
      await reload();
    } catch (e) {
      alert(errorText(e));
    }
  };

  const rows = items.map((item) => {
    const suspended = item.status === "suspended";
    const buttons = [];

    if (can(`${type}.update`)) {
      buttons.push(
        {
          label: "Edit",
          className: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
          onClick: () => setEditing(item), // الداتا الأصلية مو الصف المنسّق
        },
        {
          label: suspended ? "Activate" : "Suspend",
          className: suspended
            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            : "bg-amber-50 text-amber-600 hover:bg-amber-100",
          onClick: () => handleToggle(item),
        }
      );
    }
    if (can(`${type}.delete`)) {
      buttons.push({
        label: "Delete",
        className: "bg-rose-50 text-rose-600 hover:bg-rose-100",
        onClick: () => handleDelete(item),
      });
    }

    return { ...item, customButtons: buttons };
  });

  const headers = [
    { key: "counter", label: "#" },
    ...columns,
    {
      label: "Status",
      render: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            row.status === "suspended"
              ? "bg-rose-100 text-rose-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {row.status === "suspended" ? "Suspended" : "Active"}
        </span>
      ),
    },
    { type: "actions", label: "Actions", buttons: (row) => row.customButtons },
  ];

  return (
    <div className="space-y-8">
      {can(`${type}.create`) && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-700">
              {editing ? `Edit ${singular}: ${editing.full_name}` : `Add New ${singular}`}
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
            key={editing ? editing.id : `new-${type}`}
            inputData={fields}
            onSubmit={handleSave}
            initialValues={initialValues}
            submitting={saving}
          />
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6 text-slate-700">{title} List</h2>
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
