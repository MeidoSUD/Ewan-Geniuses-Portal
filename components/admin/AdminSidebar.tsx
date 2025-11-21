
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { LayoutDashboard, Users, Layers, DollarSign, CheckSquare, AlertCircle, LogOut, Globe } from 'lucide-react';
import { Logo } from '../Logo';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, onLogout, isOpen, setIsOpen }) => {
  const { t, language, setLanguage, direction } = useLanguage();

  const menuItems = [
    { id: 'overview', label: t.dashboard, icon: LayoutDashboard },
    { id: 'users', label: t.users, icon: Users },
    { id: 'education', label: t.academicStructure, icon: Layers },
    { id: 'verifications', label: t.verifications, icon: CheckSquare },
    { id: 'payouts', label: t.payoutRequests, icon: DollarSign },
    { id: 'disputes', label: t.disputes, icon: AlertCircle },
  ];

  return (
    <>
        {/* Mobile Overlay */}
        {isOpen && (
            <div 
                className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                onClick={() => setIsOpen(false)}
            ></div>
        )}

        <div className={`
            fixed lg:static inset-y-0 z-50 w-64 bg-white border-r border-slate-200 shadow-lg lg:shadow-none transform transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : (direction === 'rtl' ? 'translate-x-full' : '-translate-x-full')}
            lg:translate-x-0
            ${direction === 'rtl' ? 'right-0 border-l border-r-0' : 'left-0'}
        `}>
            <div className="flex flex-col h-full">
                <div className="p-6 flex justify-center border-b border-slate-100">
                    <Logo className="scale-75" />
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                activeTab === item.id
                                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-100 space-y-2">
                    <button 
                        onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
                    >
                        <Globe size={20} />
                        {language === 'en' ? 'العربية' : 'English'}
                    </button>
                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                    >
                        <LogOut size={20} />
                        {t.logout}
                    </button>
                </div>
            </div>
        </div>
    </>
  );
};
