
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { DollarSign, Users, BookOpen, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { UserData } from '../../services/api';

interface OverviewTabProps {
  user: UserData;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ user }) => {
  const { t } = useLanguage();

  const stats = [
    { label: t.totalEarnings, value: "12,450", currency: t.sar, icon: DollarSign, color: "bg-blue-500", trend: "+12%" },
    { label: t.activeCourses, value: "8", icon: BookOpen, color: "bg-purple-500", trend: "+2" },
    { label: t.upcomingLessons, value: "24", icon: Users, color: "bg-teal-500", trend: "Today: 4" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 md:p-10 text-white shadow-lg shadow-blue-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t.welcomeBack} {user.first_name}!</h1>
            <p className="text-blue-100 opacity-90">You have 4 lessons scheduled for today.</p>
          </div>
          <Button 
            variant="ghost" 
            className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
          >
            {t.requestPayout}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {stat.value} <span className="text-sm font-normal text-slate-400">{stat.currency}</span>
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} text-white shadow-lg shadow-${stat.color.replace('bg-', '')}/30`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
              <ArrowUpRight size={16} className="mr-1" />
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity / Placeholder Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">{t.upcomingLessons}</h3>
          <div className="space-y-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                 <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                     {10 + i}
                   </div>
                   <div>
                     <h4 className="font-semibold text-slate-900">Mathematics (Grade 10)</h4>
                     <p className="text-xs text-slate-500">10:00 AM - 11:00 AM • Online</p>
                   </div>
                 </div>
                 <span className="text-xs font-medium px-2 py-1 rounded-md bg-green-100 text-green-700">Confirmed</span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Performance</h3>
          <div className="h-48 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-400 text-sm">Chart Visualization Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};
