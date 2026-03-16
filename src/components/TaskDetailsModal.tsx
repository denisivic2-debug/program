import React, { useState } from 'react';
import { X, History, Link as LinkIcon, User, Calendar, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';
import { Task } from '../types';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export default function TaskDetailsModal({ isOpen, onClose, task }: TaskDetailsModalProps) {
  const { employees, assignTask } = useDataStore();
  const [isAssigning, setIsAssigning] = useState(false);

  if (!isOpen || !task) return null;

  const handleReassign = async (empId: string) => {
    await assignTask(task.id, empId || null);
    setIsAssigning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'In Progress': return <Clock size={16} className="text-blue-500" />;
      default: return <AlertCircle size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh] animate-in zoom-in-95 duration-200">
        
        {/* Left Side: Details */}
        <div className="flex-1 p-8 overflow-y-auto border-r border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-gray-100 text-gray-600`}>
                  {task.status}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  task.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-600'
                }`}>
                  {task.priority} Priority
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center space-x-1 ${
                  task.category === 'Parnica' ? 'bg-green-50 text-green-600' :
                  task.category === 'Krivica' ? 'bg-pink-50 text-pink-600' :
                  'bg-gray-50 text-gray-600 border border-gray-200'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    task.category === 'Parnica' ? 'bg-green-500' :
                    task.category === 'Krivica' ? 'bg-pink-500' :
                    'bg-white border border-gray-400'
                  }`} />
                  <span>{task.category}</span>
                </span>
                {task.caseNumber && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-blue-50 text-blue-600">
                    #{task.caseNumber}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold tracking-tight">{task.title}</h2>
            </div>
            <button onClick={onClose} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-8">
            {/* Description Section */}
            <div>
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-100 mb-3">
                <div className="w-1 h-4 bg-gray-400 rounded-full" />
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Case Description</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                {task.description || 'No description provided.'}
              </p>
            </div>

            {/* People & Roles Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                <div className="w-1 h-4 bg-blue-500 rounded-full" />
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">People & Roles</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Source / Originator */}
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <label className="text-[9px] font-bold text-gray-400 uppercase mb-2 block">Originator (Source)</label>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center font-bold text-blue-500 border border-blue-100">
                      {task.originator ? task.originator.firstName[0] : '?'}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{task.originator ? `${task.originator.firstName} ${task.originator.lastName}` : 'External Source'}</p>
                      <p className="text-[10px] text-gray-500">{task.originator?.position || 'Originator'}</p>
                      {task.originator?.department && (
                        <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold mt-1 inline-block">
                          {task.originator.department.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Current Assignee */}
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <label className="text-[9px] font-bold text-gray-400 uppercase mb-2 block">Current Handler</label>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#00FF00]/10 rounded-full flex items-center justify-center font-bold text-[#00FF00] border border-[#00FF00]/20">
                      {task.assignedTo ? task.assignedTo.firstName[0] : '?'}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{task.assignedTo ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}` : 'Unassigned'}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-[10px] text-gray-500">{task.assignedTo?.position || 'Pending Assignment'}</p>
                        <button 
                          onClick={() => setIsAssigning(!isAssigning)}
                          className="text-[10px] text-[#00FF00] font-bold hover:underline"
                        >
                          {isAssigning ? 'Cancel' : 'Change'}
                        </button>
                      </div>
                    </div>
                  </div>
                  {isAssigning && (
                    <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                      <select 
                        className="w-full text-xs p-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#00FF00]/20 outline-none"
                        onChange={(e) => handleReassign(e.target.value)}
                        value={task.assignedToId || ''}
                      >
                        <option value="">Unassigned</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.department?.name})</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Registrar */}
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <label className="text-[9px] font-bold text-gray-400 uppercase mb-2 block">Registrar (Referent)</label>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center font-bold text-gray-500 border border-gray-100">
                      {task.registrar ? task.registrar.firstName[0] : '?'}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{task.registrar ? `${task.registrar.firstName} ${task.registrar.lastName}` : 'Not specified'}</p>
                      <p className="text-[9px] text-gray-500">{task.registrar?.position}</p>
                    </div>
                  </div>
                </div>

                {/* SMIL Assignee */}
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <label className="text-[9px] font-bold text-gray-400 uppercase mb-2 block">SMIL Assignee (Sudija)</label>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center font-bold text-indigo-500 border border-indigo-100">
                      {task.smilAssignee ? task.smilAssignee.firstName[0] : '?'}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{task.smilAssignee ? `${task.smilAssignee.firstName} ${task.smilAssignee.lastName}` : 'Not specified'}</p>
                      <p className="text-[9px] text-gray-500">{task.smilAssignee?.position}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logistics Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                <div className="w-1 h-4 bg-orange-500 rounded-full" />
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Logistics & Linking</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <label className="text-[9px] font-bold text-gray-400 uppercase mb-2 block">Timeline</label>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span className="font-medium">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}</span>
                  </div>
                </div>

                {task.parentTask && (
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <label className="text-[9px] font-bold text-blue-400 uppercase mb-2 block flex items-center">
                      <LinkIcon size={12} className="mr-1" /> Linked to Case
                    </label>
                    <p className="text-sm font-bold text-blue-900">{task.parentTask.title}</p>
                    <p className="text-[10px] text-blue-700 mt-1 line-clamp-1">{task.parentTask.description}</p>
                  </div>
                )}
              </div>

              {task.childTasks && task.childTasks.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <label className="text-[9px] font-bold text-gray-400 uppercase mb-2 block">Related Tickets</label>
                  <div className="space-y-2">
                    {task.childTasks.map(child => (
                      <div key={child.id} className="p-2 bg-white rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
                        <span className="text-xs font-medium">{child.title}</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-gray-50 border border-gray-100">
                          {child.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: History */}
        <div className="w-full md:w-80 bg-gray-50 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <History size={18} className="text-gray-400" />
              <h3 className="font-bold">Movement History</h3>
            </div>
            <button onClick={onClose} className="hidden md:block p-2 hover:bg-white rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
            {(task as any).history?.map((entry: any, idx: number) => (
              <div key={entry.id} className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center z-10">
                  <div className="w-2 h-2 bg-[#00FF00] rounded-full" />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-xs font-bold mb-1">{entry.changeType}</p>
                  <div className="flex items-center text-[11px] text-gray-500">
                    {entry.oldValue && (
                      <>
                        <span className="line-through">{entry.oldValue}</span>
                        <ArrowRight size={10} className="mx-1" />
                      </>
                    )}
                    <span className="text-black font-medium">{entry.newValue}</span>
                  </div>
                  <p className="text-[9px] text-gray-400 mt-2 italic">By: {entry.changedBy}</p>
                </div>
              </div>
            ))}
            {(!(task as any).history || (task as any).history.length === 0) && (
              <p className="text-xs text-gray-400 text-center py-8">No history recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
