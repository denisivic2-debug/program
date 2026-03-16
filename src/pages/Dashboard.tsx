import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Users,
  TrendingUp
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Dashboard() {
  const { token } = useAuthStore();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(setStats);
  }, [token]);

  if (!stats) return <div className="flex items-center justify-center h-full">Loading...</div>;

  const statusData = stats.tasksByStatus.map((s: any) => ({
    name: s.status,
    value: s._count
  }));

  const COLORS = ['#00FF00', '#FFBB28', '#FF8042', '#0088FE', '#FF4444'];

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <TrendingUp size={18} className="text-[#00FF00]" />
          <span className="text-sm font-medium">System Performance: Optimal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={stats.totalTasks} icon={CheckCircle2} color="bg-blue-500" />
        <StatCard title="Active Employees" value={stats.totalEmployees} icon={Users} color="bg-indigo-500" />
        <StatCard title="Overdue Tasks" value={stats.overdueTasks} icon={AlertCircle} color="bg-red-500" />
        <StatCard title="Pending Review" value={stats.tasksByStatus.find((s:any) => s.status === 'Waiting')?._count || 0} icon={Clock} color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">Task Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                <Tooltip 
                  cursor={{ fill: '#F8F9FA' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" fill="#151619" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">Status Breakdown</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold">{stats.totalTasks}</span>
              <span className="text-xs text-gray-500 uppercase tracking-widest">Tasks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
