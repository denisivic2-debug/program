import React, { useState } from 'react';
import { useAuthStore } from './store/useAuthStore';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Login from './pages/Login';

export default function App() {
  const { token } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!token) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'tasks': return <Tasks />;
      case 'employees': return <Employees />;
      case 'departments': return <Departments />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}
