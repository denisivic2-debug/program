import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any;
}

export default function CreateEmployeeModal({ isOpen, onClose, editData }: CreateEmployeeModalProps) {
  const { departments, addEmployee, updateEmployee, fetchDepartments } = useDataStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    departmentId: '',
    status: 'Active',
  });

  useEffect(() => {
    if (isOpen) fetchDepartments();
    if (editData) {
      setFormData({
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
        phone: editData.phone || '',
        position: editData.position,
        departmentId: editData.departmentId,
        status: editData.status,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        departmentId: '',
        status: 'Active',
      });
    }
  }, [isOpen, editData, fetchDepartments]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editData) {
      await updateEmployee(editData.id, formData);
    } else {
      await addEmployee(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{editData ? 'Edit Employee' : 'Add Employee'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Name</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Name</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
            <input
              required
              type="email"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Position</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department</label>
            <select
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors"
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
            <select
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#00FF00] text-black font-bold py-3 rounded-xl hover:bg-[#00CC00] transition-colors mt-4"
          >
            {editData ? 'Update Employee' : 'Add Employee'}
          </button>
        </form>
      </div>
    </div>
  );
}
