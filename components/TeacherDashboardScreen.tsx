
import React, { useState } from 'react';
import { AuthResponse } from '../services/api';
import { Navbar } from './Navbar';
import { OverviewTab } from './dashboard/OverviewTab';
import { ScheduleTab } from './dashboard/ScheduleTab';
import { WalletTab } from './dashboard/WalletTab';
import { SubjectsTab } from './dashboard/SubjectsTab';
import { ProfileTab } from './dashboard/ProfileTab';
import { useLanguage } from '../contexts/LanguageContext';

interface TeacherDashboardScreenProps {
  data: AuthResponse;
  onLogout: () => void;
}

export const TeacherDashboardScreen: React.FC<TeacherDashboardScreenProps> = ({ data, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { t } = useLanguage();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab user={data.user.data} />;
      case 'schedule':
        return <ScheduleTab />;
      case 'wallet':
        return <WalletTab user={data.user.data} />;
      case 'subjects':
        return <SubjectsTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <OverviewTab user={data.user.data} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans pb-10">
      <Navbar 
        userData={data} 
        onLogout={onLogout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};
