import { create } from 'zustand';
import { Task, Employee, Department } from '../types';
import { useAuthStore } from './useAuthStore';

interface DataState {
  tasks: Task[];
  employees: Employee[];
  departments: Department[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  fetchEmployees: () => Promise<void>;
  fetchDepartments: () => Promise<void>;
  updateTaskStatus: (taskId: string, status: string) => Promise<void>;
  addTask: (taskData: any) => Promise<void>;
  assignTask: (taskId: string, assignedToId: string | null) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  addEmployee: (data: any) => Promise<void>;
  updateEmployee: (id: string, data: any) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  addDepartment: (data: any) => Promise<void>;
  updateDepartment: (id: string, data: any) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  tasks: [],
  employees: [],
  departments: [],
  loading: false,
  fetchTasks: async () => {
    const token = useAuthStore.getState().token;
    const res = await fetch('/api/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) set({ tasks: await res.json() });
  },
  fetchEmployees: async () => {
    const token = useAuthStore.getState().token;
    const res = await fetch('/api/employees', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) set({ employees: await res.json() });
  },
  fetchDepartments: async () => {
    const token = useAuthStore.getState().token;
    const res = await fetch('/api/departments', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) set({ departments: await res.json() });
  },
  updateTaskStatus: async (taskId, status) => {
    const token = useAuthStore.getState().token;
    const res = await fetch(`/api/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      const updatedTask = await res.json();
      set({
        tasks: get().tasks.map(t => t.id === taskId ? { ...t, status: updatedTask.status } : t)
      });
    }
  },
  addTask: async (taskData) => {
    const token = useAuthStore.getState().token;
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(taskData)
    });
    if (res.ok) {
      await get().fetchTasks();
    }
  },
  assignTask: async (taskId, assignedToId) => {
    const token = useAuthStore.getState().token;
    const res = await fetch(`/api/tasks/${taskId}/assign`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ assignedToId })
    });
    if (res.ok) {
      await get().fetchTasks();
    }
  },
  deleteTask: async (taskId) => {
    const token = useAuthStore.getState().token;
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      await get().fetchTasks();
    }
  },
  addEmployee: async (data) => {
    const token = useAuthStore.getState().token;
    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (res.ok) await get().fetchEmployees();
  },
  updateEmployee: async (id, data) => {
    const token = useAuthStore.getState().token;
    const res = await fetch(`/api/employees/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (res.ok) await get().fetchEmployees();
  },
  deleteEmployee: async (id) => {
    const token = useAuthStore.getState().token;
    const res = await fetch(`/api/employees/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) await get().fetchEmployees();
  },
  addDepartment: async (data) => {
    const token = useAuthStore.getState().token;
    const res = await fetch('/api/departments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (res.ok) await get().fetchDepartments();
  },
  updateDepartment: async (id, data) => {
    const token = useAuthStore.getState().token;
    const res = await fetch(`/api/departments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (res.ok) await get().fetchDepartments();
  },
  deleteDepartment: async (id) => {
    const token = useAuthStore.getState().token;
    const res = await fetch(`/api/departments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) await get().fetchDepartments();
  }
}));
