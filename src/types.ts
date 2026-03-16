export type Role = 'Admin' | 'Manager' | 'Employee' | 'Auditor';

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  departmentId: string;
  department?: Department;
  status: 'Active' | 'Inactive';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Waiting' | 'Completed' | 'Cancelled' | 'Overdue';
  assignedToId?: string;
  assignedTo?: Employee;
  originatorId?: string;
  originator?: Employee;
  category: 'Parnica' | 'Krivica' | 'Prekršaji';
  caseNumber?: string;
  registrarId?: string;
  registrar?: Employee;
  smilAssigneeId?: string;
  smilAssignee?: Employee;
  departmentId: string;
  department?: Department;
  dueDate?: string;
  parentTaskId?: string;
  parentTask?: Task;
  childTasks?: Task[];
  history?: any[];
  createdAt: string;
}
