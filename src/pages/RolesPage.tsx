import { useCallback, useEffect, useMemo, useState } from "react";
import Form from "../components/Form";
import CustomTable from "../components/CustomTable";
import { usePageHeader } from "../layout/AppLayout";
import { getRoleFormFields } from "../constants/formConfigs.js";
import {
  listRolesApi,
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
  listPermissionsApi,
  getRolePermissionsApi,
  setRolePermissionsApi,
} from "../services/roleApi.js";
import { errorText } from "../services/apiClient.js";
import { can } from "../utils/permissions.js";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [checked, setChecked] = useState(new Set());
  const canManage = can("roles.manage");

  usePageHeader("Roles", `${roles.length} roles`);

  const roleFields = getRoleFormFields();

  const load = useCallback(async () => {
    try {
      const [r, p] = await Promise.all([listRolesApi(), listPermissionsApi()]);
      setRoles(r.map((x) => ({ ...x, id: x._id })));
      setPermissions(p);
    } catch (e) {
      alert(errorText(e));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const initialValues = useMemo(() => editingRole, [editingRole]);

  const handleSaveRole = async (values) => {
    try {
      const payload = { name: values.name, description: values.description || "" };
      if (editingRole) {
        await updateRoleApi(editingRole._id, payload);
        setEditingRole(null);
      } else {
        await createRoleApi(payload);
      }
      await load();
      return true;
    } catch (e) {
      alert(errorText(e));
      return false;
    }
  };

  const handleDeleteRole = async (role) => {
    if (!window.confirm(`Delete role: ${role.name}?`)) return;
    try {
      await deleteRoleApi(role._id);
      if (selectedRole?._id === role._id) setSelectedRole(null);
      await load();
    } catch (e) {
      alert(errorText(e));
    }
  };

  const openPermissions = async (role) => {
    try {
      setChecked(new Set(await getRolePermissionsApi(role._id)));
      setSelectedRole(role);
    } catch (e) {
      alert(errorText(e));
    }
  };

  const togglePermission = (id) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const savePermissions = async () => {
    try {
      await setRolePermissionsApi(selectedRole._id, [...checked]);
      alert("Permissions saved");
    } catch (e) {
      alert(errorText(e));
    }
  };

  const headers = [
    { key: "counter", label: "#" },
    { key: "name", label: "Role Name" },
    { key: "description", label: "Description" },
    {
      type: "actions",
      label: "Actions",
      buttons: (row) => [
        ...(canManage
          ? [
              {
                label: "Edit",
                className: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
                onClick: () => setEditingRole(row),
              },
            ]
          : []),
        {
          label: "Permissions",
          className: "bg-amber-50 text-amber-600 hover:bg-amber-100",
          onClick: () => openPermissions(row),
        },
        ...(canManage
          ? [
              {
                label: "Delete",
                className: "bg-rose-50 text-rose-600 hover:bg-rose-100",
                onClick: () => handleDeleteRole(row),
              },
            ]
          : []),
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {canManage && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-4 text-slate-700">
            {editingRole ? `Edit Role: ${editingRole.name}` : "Add New Role"}
          </h2>
          <Form
            key={editingRole ? editingRole._id : "new-role"}
            inputData={roleFields}
            onSubmit={handleSaveRole}
            initialValues={initialValues}
          />
          {editingRole && (
            <button
              onClick={() => setEditingRole(null)}
              className="mt-3 text-xs text-rose-500 font-semibold hover:underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4 text-slate-700">Roles List</h2>
        <CustomTable headers={headers} data={roles} />
      </div>

      {selectedRole && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-4 text-slate-700">
            Permissions for: {selectedRole.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {permissions.map((p) => (
              <label key={p._id} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked.has(p._id)}
                  disabled={!canManage}
                  onChange={() => togglePermission(p._id)}
                  className="w-4 h-4"
                />
                {p.name}
              </label>
            ))}
          </div>
          {canManage && (
            <button
              onClick={savePermissions}
              className="mt-6 h-11 rounded-xl px-6 text-white font-semibold bg-[#3A5B22] hover:bg-black text-sm"
            >
              Save Permissions
            </button>
          )}
        </div>
      )}
    </div>
  );
}
