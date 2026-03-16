import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';

interface CreateDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any;
}

export default function CreateDepartmentModal({ isOpen, onClose, editData }: CreateDepartmentModalProps) {
  const { addDepartment, updateDepartment } = useDataStore();
  const [formData, setFormData] = useState({
    name: editData?.name || '',
    description: editData?.description || '',
  });

  React.useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        description: editData.description || '',
      });
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [editData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editData) {
      await updateDepartment(editData.id, formData);
    } else {
      await addDepartment(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{editData ? 'Edit Department' : 'Create Department'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
            <textarea
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#00FF00] text-black font-bold py-3 rounded-xl hover:bg-[#00CC00] transition-colors mt-4"
          >
            {editData ? 'Update Department' : 'Create Department'}
          </button>
        </form>
      </div>
    </div>
  );
}
