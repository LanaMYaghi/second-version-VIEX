import { useState } from 'react';
import Form from '../components/Form';
import CustomTable from '../components/CustomTable';
import { getRoleFormFields } from '../constants/formConfigs.js';
import { createRoleApi, deleteRoleApi } from '../services/roleApi.js';

function RolesPage() {
  const [roles, setRoles] = useState([
    { _id: 1, name: 'admin', description: 'Has full system access' },
    { _id: 2, name: 'secretary', description: 'Manages students and courses' }
  ]);

  const [editingRole, setEditingRole] = useState(null);
  const roleFields = getRoleFormFields();

  const handleSaveRole = async (formValues) => {
    if (editingRole) {
      setRoles(roles.map(r => r._id === editingRole._id ? { ...r, ...formValues } : r));
      alert('Role updated successfully!');
      setEditingRole(null);
    } else {
      try {
        const newRole = await createRoleApi(formValues);
        setRoles(prev => [newRole, ...prev]);
        alert('Role added successfully!');
      } catch (error) {
        const fallbackRole = { ...formValues, _id: Date.now() };
        setRoles(prev => [fallbackRole, ...prev]);
        alert('Role added (Local Mode)!');
      }
    }
  };

  const handleDeleteRole = async (row) => {
    if (window.confirm(`Delete role: ${row.name}?`)) {
      await deleteRoleApi(row._id);
      setRoles(roles.filter(r => r._id !== row._id));
    }
  };

  const tableHeaders = [
    { key: "id", label: "ID" },
    { key: 'name', label: 'Role Name' },
    { key: 'description', label: 'Description' },
    {
      type: 'actions',
      label: 'Actions',
      buttons: (row) => [
        {
          label: 'Edit',
          className: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
          onClick: (r) => setEditingRole(r)
        },
        {
          label: 'Delete',
          className: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
          onClick: (r) => handleDeleteRole(r)
        }
      ]
    }
  ];

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-10 bg-slate-50 min-h-screen" dir="ltr">
      <h1 className="text-3xl font-bold text-slate-800">Roles Management</h1>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4 text-slate-700">
          {editingRole ? `Edit Role: ${editingRole.name}` : 'Add New Role'}
        </h2>
        <Form 
          key={editingRole ? editingRole._id : 'new-role'}
          inputData={roleFields}
          onSubmit={handleSaveRole}
          initialValues={editingRole}
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4 text-slate-700">Roles List</h2>
        <CustomTable headers={tableHeaders} data={roles} />
      </div>
    </div>
  );
}

export default RolesPage;