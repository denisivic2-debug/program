import React, { useEffect, useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import { Plus, MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import CreateDepartmentModal from '../components/CreateDepartmentModal';
import DepartmentPreviewModal from '../components/DepartmentPreviewModal';

export default function Departments() {
  const { departments, employees, fetchDepartments, fetchEmployees, deleteDepartment } = useDataStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, [fetchDepartments, fetchEmployees]);

  const handleEdit = (dept: any) => {
    setEditData(dept);
    setIsModalOpen(true);
  };

  const handlePreview = (dept: any) => {
    setSelectedDept(dept);
    setIsPreviewOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteDepartment(id);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Odeljenja</h1>
          <p className="text-gray-500 mt-1">Upravljajte organizacionom strukturom</p>
        </div>

        <button 
          onClick={() => { setEditData(null); setIsModalOpen(true); }}
          className="bg-[#151619] text-white font-bold px-6 py-2.5 rounded-xl shadow-sm flex items-center space-x-2 hover:bg-black transition-all"
        >
          <Plus size={20} />
          <span>Dodaj odeljenje</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div 
            key={dept.id} 
            onClick={() => handlePreview(dept)}
            className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-md hover:border-[#00FF00] transition-all group relative cursor-pointer"
          >
            <div className="absolute top-6 right-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => handleEdit(dept)} className="p-2 text-gray-400 hover:text-[#00FF00] hover:bg-gray-50 rounded-lg transition-all">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(dept.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-all">
                <Trash2 size={16} />
              </button>
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-[#00FF00] transition-colors">{dept.name}</h3>
            <p className="text-sm text-gray-500 mb-6 line-clamp-2">{dept.description || 'Opis nije unet.'}</p>
            
            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {employees.filter(e => e.departmentId === dept.id).length} Zaposlenih
              </span>
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {employees.filter(e => e.departmentId === dept.id).slice(0, 3).map(emp => (
                    <div key={emp.id} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-400">
                      {emp.firstName[0]}
                    </div>
                  ))}
                </div>
                <Eye size={14} className="text-gray-300 group-hover:text-[#00FF00] transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateDepartmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editData={editData} 
      />

      <DepartmentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        department={selectedDept}
      />
    </div>
  );
}
