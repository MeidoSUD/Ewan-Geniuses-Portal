
import React, { useState } from 'react';
import { AuthResponse } from '../services/api';
import { AdminSidebar } from './admin/AdminSidebar';
import { UsersTab } from './admin/UsersTab';
import { EducationTab } from './admin/EducationTab';
import { PayoutsTab } from './admin/PayoutsTab';
import { VerificationsTab } from './admin/VerificationsTab';
import { DisputesTab } from './student/DisputesTab'; // Reusing Disputes UI but logic should be admin specific later
import { Menu } from 'lucide-react';

interface AdminDashboardScreenProps {
  data: AuthResponse;
  onLogout: () => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ data, onLogout }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersTab />;
      case 'education':
        return <EducationTab />;
      case 'payouts':
        return <PayoutsTab />;
      case 'verifications':
        return <VerificationsTab />;
      case 'disputes':
        return <DisputesTab />; // Reusing for UI consistency, would connect to Admin API in real app
      default:
        return <UsersTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="text-slate-600">
                <Menu size={24} />
            </button>
            <h1 className="font-bold text-lg">Admin Dashboard</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};
