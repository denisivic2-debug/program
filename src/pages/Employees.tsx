import React, { useEffect, useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import { UserPlus, Mail, Phone, MapPin, Edit2, Trash2 } from 'lucide-react';
import CreateEmployeeModal from '../components/CreateEmployeeModal';

export default function Employees() {
  const { employees, fetchEmployees, fetchDepartments, deleteEmployee } = useDataStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, [fetchEmployees, fetchDepartments]);

  const handleEdit = (emp: any) => {
    setEditData(emp);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteEmployee(id);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-gray-500 mt-1">Manage your organization's human resources</p>
        </div>

        <button 
          onClick={() => { setEditData(null); setIsModalOpen(true); }}
          className="bg-[#151619] text-white font-bold px-6 py-2.5 rounded-xl shadow-sm flex items-center space-x-2 hover:bg-black transition-all"
        >
          <UserPlus size={20} />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <div key={employee.id} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-all group relative">
            <div className="absolute top-6 right-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(employee)} className="p-2 text-gray-400 hover:text-[#00FF00] hover:bg-gray-50 rounded-lg transition-all">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(employee.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-all">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-gray-400">
                {employee.firstName[0]}{employee.lastName[0]}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold group-hover:text-[#00FF00] transition-colors">
                {employee.firstName} {employee.lastName}
              </h3>
              <p className="text-sm text-gray-500 font-medium">{employee.position}</p>
              <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-bold text-gray-500 uppercase">
                {employee.department?.name}
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-50">
              <div className="flex items-center text-sm text-gray-500">
                <Mail size={16} className="mr-3 text-gray-400" />
                {employee.email}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Phone size={16} className="mr-3 text-gray-400" />
                {employee.phone || 'No phone'}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin size={16} className="mr-3 text-gray-400" />
                Remote / Office
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                employee.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {employee.status}
              </span>
              <button className="text-xs font-bold text-[#00FF00] hover:underline">View Profile</button>
            </div>
          </div>
        ))}
      </div>

      <CreateEmployeeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editData={editData} 
      />
    </div>
  );
}
