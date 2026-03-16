import React, { useEffect, useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import KanbanBoard from '../components/KanbanBoard';
import { Plus, LayoutGrid, List, Filter, Search, Trash2, Link as LinkIcon } from 'lucide-react';
import TaskDetailsModal from '../components/TaskDetailsModal';
import CreateTaskModal from '../components/CreateTaskModal';

export default function Tasks() {
  const { fetchTasks, fetchEmployees, fetchDepartments, tasks, deleteTask } = useDataStore();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
    fetchDepartments();
  }, [fetchTasks, fetchEmployees, fetchDepartments]);

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upravljanje predmetima</h1>
          <p className="text-gray-500 mt-1">Upravljajte i pratite napredak svog tima</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex">
            <button 
              onClick={() => setView('kanban')}
              className={`p-2 rounded-lg transition-all ${view === 'kanban' ? 'bg-[#151619] text-white' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-[#151619] text-white' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List size={18} />
            </button>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#00FF00] text-black font-bold px-6 py-2.5 rounded-xl shadow-sm flex items-center space-x-2 hover:bg-[#00DD00] transition-all"
          >
            <Plus size={20} />
            <span>Novi predmet</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filtriraj predmete..." 
              className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm w-64 focus:ring-1 focus:ring-[#00FF00]"
            />
          </div>
          <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50">
            <Filter size={16} />
            <span>Filteri</span>
          </button>
        </div>

        <div className="text-sm text-gray-500">
          Prikazano <span className="font-bold text-black">{tasks.length}</span> predmeta
        </div>
      </div>

      {view === 'kanban' ? (
        <KanbanBoard />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Predmet</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Prioritet</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Dodeljeno</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Rok</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr 
                  key={task.id} 
                  onClick={() => handleTaskClick(task)}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <td className="p-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        {task.parentTaskId && <LinkIcon size={12} className="text-blue-400" />}
                        <p className="font-bold text-sm group-hover:text-[#00FF00] transition-colors">{task.title}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          task.category === 'Parnica' ? 'bg-green-500' :
                          task.category === 'Krivica' ? 'bg-pink-500' :
                          'bg-white border border-gray-400'
                        }`} />
                        <span className="text-[10px] font-bold text-gray-400">{task.category}</span>
                        {task.caseNumber && <span className="text-[10px] font-bold text-blue-400">#{task.caseNumber}</span>}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate max-w-xs mt-1">{task.description}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600 uppercase">
                      {task.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                      task.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold">
                        {task.assignedTo?.firstName[0] || '?'}
                      </div>
                      <span className="text-sm">{task.assignedTo ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}` : 'Nedodeljeno'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/P'}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Obriši predmet"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TaskDetailsModal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        task={selectedTask} 
      />
      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
