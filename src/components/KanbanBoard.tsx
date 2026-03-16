import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Task } from '../types';
import { useDataStore } from '../store/useDataStore';
import { Calendar, Flag, MoreVertical, Plus, Trash2, History, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import CreateTaskModal from './CreateTaskModal';
import TaskDetailsModal from './TaskDetailsModal';

const COLUMNS = ['Pending', 'In Progress', 'Waiting', 'Completed'];

export default function KanbanBoard() {
  const { tasks, updateTaskStatus, deleteTask } = useDataStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    updateTaskStatus(draggableId, destination.droppableId);
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  const handleDelete = async (id: string) => {
    await handleDeleteTask(id);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-500 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {COLUMNS.map((column) => (
            <div key={column} className="flex-shrink-0 w-80">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500">{column}</h3>
                  <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {tasks.filter(t => t.status === column).length}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
              </div>

              <Droppable droppableId={column}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-100/50 p-3 rounded-2xl min-h-[500px] space-y-3"
                  >
                    {tasks
                      .filter((task) => task.status === column)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => handleTaskClick(task)}
                              className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-[#00FF00] transition-colors group cursor-pointer"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex flex-col space-y-1">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                  </span>
                                  <div className={`w-full h-1 rounded-full ${
                                    task.category === 'Parnica' ? 'bg-green-500' :
                                    task.category === 'Krivica' ? 'bg-pink-500' :
                                    'bg-white border border-gray-200'
                                  }`} title={task.category} />
                                </div>
                                <div className="flex items-center space-x-2">
                                  {task.caseNumber && <span className="text-[9px] font-bold text-blue-400">#{task.caseNumber}</span>}
                                  {task.parentTaskId && <LinkIcon size={12} className="text-blue-400" />}
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                                    className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    title="Delete Task"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                  <Flag size={14} className={task.priority === 'High' ? 'text-red-400' : 'text-gray-300'} />
                                </div>
                              </div>
                              
                              <h4 className="font-bold text-sm mb-2 group-hover:text-[#00FF00] transition-colors">{task.title}</h4>
                              <p className="text-xs text-gray-500 line-clamp-2 mb-4">{task.description}</p>
                              
                              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                <div className="flex items-center text-[10px] text-gray-400">
                                  <Calendar size={12} className="mr-1" />
                                  {task.dueDate ? format(new Date(task.dueDate), 'MMM d') : 'No date'}
                                </div>
                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold" title={`${task.assignedTo?.firstName} ${task.assignedTo?.lastName}`}>
                                  {task.assignedTo?.firstName[0] || '?'}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <TaskDetailsModal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        task={selectedTask} 
      />
    </>
  );
}
