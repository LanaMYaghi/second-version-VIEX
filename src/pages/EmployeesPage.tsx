import { useState } from 'react';
import Form from '../components/Form';
import CustomTable from '../components/CustomTable';
import { getEmployeeFormFields } from '../constants/formConfigs.js';
import { createEmployeeApi, toggleEmployeeStatusApi, deleteEmployeeApi } from '../services/employeeApi.js';

function EmployeesPage() { 
    // جلب الرول الحقيقي للمستخدم الحالي
    const currentUserRole = localStorage.getItem('userRole') || 'admin';

    // قائمة الموظفين (مثال افتراضي لسكرتير موجود مسبقاً)
    const [employees, setEmployees] = useState([
        {
            id: 1,
            fullName: 'Sara Al-Ahmad',
            email: 'sara.sec@example.com',
            phone: '+963933445566',
            position: 'Secretary',
            status: 'active'
        }
    ]);

    const [editingEmployee, setEditingEmployee] = useState(null);
    const employeeFields = getEmployeeFormFields();

    // دالة حفظ الموظف (إضافة أو تعديل)
    const handleSaveEmployee = async (formValues) => {
        if (editingEmployee) {
            setEmployees(employees.map(e => e.id === editingEmployee.id ? { ...e, ...formValues } : e));
            alert('Employee updated successfully!');
            setEditingEmployee(null);
        } else {
            try {
                const newEmp = await createEmployeeApi(formValues);
                setEmployees((prev) => [newEmp, ...prev]);
                alert('Employee added successfully!');
            } catch (error) {
                const fallbackEmp = { ...formValues, id: Date.now(), status: 'active' };
                setEmployees((prev) => [fallbackEmp, ...prev]);
                alert('Employee added (Local Mode)!');
            }
        }
    };

    // تفعيل / إيقاف الموظف
    const handleToggleStatus = async (row) => {
        const nextStatus = row.status === 'active' ? 'suspended' : 'active';
        try {
            await toggleEmployeeStatusApi(row.id, nextStatus);
        } catch (error) {
            console.warn('Local status update');
        }
        setEmployees(employees.map(e => e.id === row.id ? { ...e, status: nextStatus } : e));
    };

    // حذف موظف (للأدمن حصراً)
    const handleDeleteEmployee = async (row) => {
        if (window.confirm(`Are you sure you want to delete employee: ${row.fullName}?`)) {
            try {
                await deleteEmployeeApi(row.id);
            } catch (error) {
                console.warn('Local delete');
            }
            setEmployees(employees.filter(e => e.id !== row.id));
        }
    };

    // تجهيز الداتا للجدول مع أزرار العمليات الديناميكية
    const formattedEmployees = employees.map(emp => {
        const isSuspended = emp.status === 'suspended';

        const rowButtons = [
            {
                label: 'Edit',
                className: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
                onClick: (r) => setEditingEmployee(r)
            },
            {
                label: isSuspended ? 'Activate' : 'Suspend',
                className: isSuspended 
                    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                    : 'bg-rose-50 text-rose-600 hover:bg-rose-100',
                onClick: (r) => handleToggleStatus(r)
            }
        ];

        // صلاحية الحذف للأدمن فقط
        if (currentUserRole === 'admin') {
            rowButtons.push({
                label: 'Delete',
                className: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
                onClick: (r) => handleDeleteEmployee(r)
            });
        }

        return {
            ...emp,
            statusBadge: (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    emp.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                    {emp.status === 'active' ? 'Active' : 'Suspended'}
                </span>
            ),
            customButtons: rowButtons
        };
    });

    const tableHeaders = [
        { key: "id", label: "ID" },
        { key: 'fullName', label: 'Full Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'position', label: 'Position' },
        { key: 'statusBadge', label: 'Status' },
        {
            type: 'actions',
            label: 'Actions',
            buttons: (row) => row.customButtons
        }
    ];

    return (
        <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-10 bg-slate-50 min-h-screen" dir="ltr">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800 text-left">Employees Management</h1>
                <span className="text-xs px-3 py-1 bg-slate-200 text-slate-700 rounded-full font-medium uppercase">
                    Role: {currentUserRole}
                </span>
            </div>

            {/* قسم إضافة أو تعديل موظف */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-700 text-left">
                        {editingEmployee ? `Edit Employee: ${editingEmployee.fullName}` : 'Add New Employee'}
                    </h2>
                    {editingEmployee && (
                        <button onClick={() => setEditingEmployee(null)} className="text-xs text-rose-500 font-semibold hover:underline">
                            Cancel Edit
                        </button>
                    )}
                </div>

                <Form 
                    key={editingEmployee ? editingEmployee.id : 'new-employee'}
                    inputData={employeeFields} 
                    onSubmit={handleSaveEmployee} 
                    initialValues={editingEmployee}
                />
            </div>

            {/* جدول الموظفين */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold mb-6 text-slate-700 text-left">Employees List</h2>
                <CustomTable headers={tableHeaders} data={formattedEmployees} />
            </div>
        </div>
    );
}

export default EmployeesPage;