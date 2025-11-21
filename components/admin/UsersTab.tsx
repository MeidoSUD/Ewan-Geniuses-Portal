
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Search, MoreVertical, Shield, User, GraduationCap } from 'lucide-react';
import { Button } from '../ui/Button';

// Mock Data
const MOCK_USERS = [
    { id: 1, name: 'Admin User', email: 'admin@ewan.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Ahmed Teacher', email: 'ahmed@test.com', role: 'teacher', status: 'active' },
    { id: 3, name: 'Sara Student', email: 'sara@test.com', role: 'student', status: 'active' },
    { id: 4, name: 'John Doe', email: 'john@test.com', role: 'teacher', status: 'banned' },
];

export const UsersTab: React.FC = () => {
    const { t, direction } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');

    const getRoleIcon = (role: string) => {
        switch(role) {
            case 'admin': return <Shield size={16} className="text-purple-600" />;
            case 'teacher': return <User size={16} className="text-blue-600" />;
            default: return <GraduationCap size={16} className="text-green-600" />;
        }
    };

    const filteredUsers = MOCK_USERS.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">{t.users}</h2>
                <Button>+ Add User</Button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative mb-4">
                    <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${direction === 'rtl' ? 'right-3' : 'left-3'}`} size={20} />
                    <input 
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-primary ${direction === 'rtl' ? 'pr-10 pl-4' : ''}`}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-slate-700">Name</th>
                                <th className="px-6 py-3 font-semibold text-slate-700">Role</th>
                                <th className="px-6 py-3 font-semibold text-slate-700">Status</th>
                                <th className="px-6 py-3 font-semibold text-slate-700 text-right">{t.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-bold text-slate-900">{user.name}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 capitalize bg-slate-100 px-3 py-1 rounded-full w-fit text-xs font-medium">
                                            {getRoleIcon(user.role)}
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                            user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-slate-600">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
