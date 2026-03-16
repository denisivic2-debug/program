import React from 'react';
import { X, User, Mail, Phone, Briefcase } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';
import { Department } from '../types';

interface DepartmentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
}

export default function DepartmentPreviewModal({ isOpen, onClose, department }: DepartmentPreviewModalProps) {
  const { employees } = useDataStore();

  if (!isOpen || !department) return null;

  const deptEmployees = employees.filter(emp => emp.departmentId === department.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{department.name}</h2>
            <p className="text-gray-500 text-sm mt-1">Team Overview • {deptEmployees.length} Members</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors shadow-sm border border-transparent hover:border-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto">
          {deptEmployees.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="text-gray-300" size={32} />
              </div>
              <p className="text-gray-500 font-medium">No employees assigned to this department yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {deptEmployees.map((emp) => (
                <div key={emp.id} className="flex items-center p-4 rounded-2xl border border-gray-100 hover:border-[#00FF00] hover:bg-gray-50/50 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-400 group-hover:bg-[#00FF00] group-hover:text-black transition-colors">
                    {emp.firstName[0]}{emp.lastName[0]}
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-bold text-gray-900">{emp.firstName} {emp.lastName}</h4>
                    <div className="flex items-center mt-1 space-x-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <Briefcase size={12} className="mr-1" />
                        {emp.position}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Mail size={12} className="mr-1" />
                        {emp.email}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-[#151619] text-white font-bold rounded-xl hover:bg-black transition-all"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
