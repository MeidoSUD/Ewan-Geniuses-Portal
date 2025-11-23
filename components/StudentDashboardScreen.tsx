
import React, { useState } from 'react';
import { AuthResponse } from '../services/api';
import { Navbar } from './Navbar';
import { OverviewTab } from './student/OverviewTab';
import { PrivateLessonsTab } from './student/PrivateLessonsTab';
import { SubjectsTab } from './student/SubjectsTab';
import { LanguageLearningTab } from './student/LanguageLearningTab';
import { StudentScheduleTab } from './student/StudentScheduleTab';
import { BookingsTab } from './student/BookingsTab';
import { DisputesTab } from './student/DisputesTab';
import { PaymentMethodsTab } from './student/PaymentMethodsTab'; // Updated import
import { ProfileTab } from './dashboard/ProfileTab';   
import { useLanguage } from '../contexts/LanguageContext';

interface StudentDashboardScreenProps {
  data: AuthResponse;
  onLogout: () => void;
}

export const StudentDashboardScreen: React.FC<StudentDashboardScreenProps> = ({ data, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { t } = useLanguage();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab user={data.user.data} onNavigate={setActiveTab} />;
      case 'private-lessons':
        return <PrivateLessonsTab />;
      case 'courses':
        return <SubjectsTab />;
      case 'language-learning':
        return <LanguageLearningTab />;
      case 'schedule':
        // Schedule defaults to calendar, can switch to list
        return <StudentScheduleTab onViewList={() => setActiveTab('bookings')} />;
      case 'bookings':
        // Separate route for list view if needed
        return <BookingsTab onViewCalendar={() => setActiveTab('schedule')} />;
      case 'disputes':
        return <DisputesTab />;
      case 'wallet':
        return <PaymentMethodsTab />; // Updated Component
      case 'profile':
        return <ProfileTab />;
      default:
        return <OverviewTab user={data.user.data} onNavigate={setActiveTab} />;
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