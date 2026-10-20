import React, { useState } from 'react';

import CustomTable from '../components/CustomTable.js';
import { getTeacherFormFields } from '../constants/formConfigs.js';
import { addTeacherApi, toggleTeacherStatusApi, deleteTeacherApi } from '../services/teacherApi.js';
import Form from '../components/Form.js';

function TeachersPage() {
    const currentUserRole = localStorage.getItem('userRole') || 'secretary';
    const [teachers, setTeachers] = useState([
        {
            id: 101,
            fullName: 'Mr. Mohammad Khaled',
            email: 'mohammad@example.com',
            phone: '+963912345678',
            gender: 'Male',
            nationality: 'Syrian',
            specialization: 'English Language',
            hourlyRate: '30',
            status: 'active'
        },
       
    ]);

    // State خاص بالتحكم هل الفورم للإضافة أم للتعديل (يحمل بيانات الأستاذ المختار)
    const [editingTeacher, setEditingTeacher] = useState(null);

    const teacherFields = getTeacherFormFields();

    // دالة الحفظ (تتعامل مع الإضافة والتعديل معاً)
    const handleSaveTeacher = async (formValues) => {
        if (editingTeacher) {
            // 1. حالة التعديل: تحديث الأستاذ الموجود بالـ State
            setTeachers(teachers.map(t => t.id === editingTeacher.id ? { ...t, ...formValues } : t));
            alert('Teacher updated successfully!');
            setEditingTeacher(null); // إعادة الفورم لوضع الإضافة العادية
        } else {
            // 2. حالة الإضافة الجديدة
            try {
                await addTeacherApi(formValues);
                setTeachers((prev) => [...prev, { ...formValues, id: Date.now(), status: 'active' }]);
                alert('Teacher added successfully!');
            } catch (error) {
                setTeachers((prev) => [...prev, { ...formValues, id: Date.now(), status: 'active' }]);
                alert('Teacher added (Local Mode)!');
            }
        }
    };

    const handleToggleStatus = async (row) => {
        const nextStatus = row.status === 'active' ? 'suspended' : 'active';
        try {
            await toggleTeacherStatusApi(row.id, nextStatus);
        } catch (error) {
            console.log('Local status update fallback');
        }
        setTeachers(teachers.map(t => t.id === row.id ? { ...t, status: nextStatus } : t));
    };

    const handleDeleteTeacher = async (row) => {
        if (window.confirm(`Are you sure you want to delete ${row.fullName}?`)) {
            try {
                await deleteTeacherApi(row.id);
            } catch (error) {
                console.log('Local delete fallback');
            }
            setTeachers(teachers.filter(t => t.id !== row.id));
        }
    };

    const actionButtons = [
        {
            label: 'Edit',
            className: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
            onClick: (row) => {
                // عند الضغط على تعديل، نخزن الأستاذ بالـ State فيفتح الفورم تلقائياً وتتعبى بياناته
                setEditingTeacher(row);
            }
        },
        {
            label: 'Toggle Status',
            className: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
            onClick: (row) => handleToggleStatus(row)
        }
    ];

    if (currentUserRole === 'admin') {
        actionButtons.push({
            label: 'Delete',
            className: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
            onClick: (row) => handleDeleteTeacher(row)
        });
    }

    const tableHeaders = [
        { key: 'id', label: 'ID' },
        { key: 'fullName', label: 'Full Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'gender', label: 'Gender' },
        { key: 'nationality', label: 'Nationality' },
        { key: 'specialization', label: 'Specialization' },
        { key: 'hourlyRate', label: 'Rate ($)' },
        { key: 'status', label: 'Status' },
        {
            type: 'actions',
            label: 'Actions',
            buttons: actionButtons
        }
    ];

    return (
        <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-10 bg-slate-50 min-h-screen" dir="ltr">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Teachers Management</h1>
                <span className="text-xs px-3 py-1 bg-slate-200 text-slate-700 rounded-full font-medium uppercase">
                    Role: {currentUserRole}
                </span>
            </div>

            {/* قسم الفورم */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-700">
                        {editingTeacher ? `Edit Teacher: ${editingTeacher.fullName}` : 'Add New Teacher'}
                    </h2>

                    {/* زر إلغاء التعديل إذا أرادت العودة لوضع الإضافة */}
                    {editingTeacher && (
                        <button
                            onClick={() => setEditingTeacher(null)}
                            className="text-xs text-rose-500 font-semibold hover:underline"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>

                <Form
                    key={editingTeacher ? editingTeacher.id : 'new-teacher'} // لإجبار الفورم على إعادة الرسم عند تغيير الأستاذ
                    inputData={teacherFields}
                    onSubmit={handleSaveTeacher}
                    initialValues={editingTeacher} // تمرير بيانات الأستاذ المختار للحقول مباشرة
                />


            </div>

            {/* قسم جدول الأساتذة */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold mb-6 text-slate-700">Teachers List</h2>
                <CustomTable headers={tableHeaders} data={teachers} />
            </div>
        </div>
    );
}

export default TeachersPage;