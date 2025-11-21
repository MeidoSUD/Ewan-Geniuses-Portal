
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Layers, ChevronRight, Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '../ui/Button';

// Mock Data
const LEVELS = [
    { id: 1, name: 'Primary School' },
    { id: 2, name: 'Middle School' },
    { id: 3, name: 'High School' },
    { id: 4, name: 'University' },
];

const CLASSES = [
    { id: 1, levelId: 1, name: 'Grade 1' },
    { id: 2, levelId: 1, name: 'Grade 2' },
    { id: 3, levelId: 2, name: 'Grade 7' },
];

const SUBJECTS = [
    { id: 1, classId: 1, name: 'Math' },
    { id: 2, classId: 1, name: 'Science' },
];

export const EducationTab: React.FC = () => {
    const { t, direction } = useLanguage();
    const [activeLevel, setActiveLevel] = useState<number | null>(null);
    const [activeClass, setActiveClass] = useState<number | null>(null);

    const filteredClasses = activeLevel ? CLASSES.filter(c => c.levelId === activeLevel) : [];
    const filteredSubjects = activeClass ? SUBJECTS.filter(s => s.classId === activeClass) : [];

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900">{t.academicStructure}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
                
                {/* Levels Column */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">{t.levels}</h3>
                        <button className="p-1 hover:bg-white rounded-md text-primary"><Plus size={18} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {LEVELS.map(level => (
                            <div 
                                key={level.id}
                                onClick={() => { setActiveLevel(level.id); setActiveClass(null); }}
                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                                    activeLevel === level.id ? 'bg-primary/5 border-primary text-primary border' : 'hover:bg-slate-50 border border-transparent'
                                }`}
                            >
                                <span className="font-medium">{level.name}</span>
                                <ChevronRight size={16} className={`text-slate-400 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Classes Column */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">{t.classes}</h3>
                        <button className="p-1 hover:bg-white rounded-md text-primary" disabled={!activeLevel}><Plus size={18} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {!activeLevel ? (
                            <div className="text-center text-slate-400 mt-10 text-sm">Select a level first</div>
                        ) : filteredClasses.length === 0 ? (
                            <div className="text-center text-slate-400 mt-10 text-sm">No classes found</div>
                        ) : (
                            filteredClasses.map(cls => (
                                <div 
                                    key={cls.id}
                                    onClick={() => setActiveClass(cls.id)}
                                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                                        activeClass === cls.id ? 'bg-primary/5 border-primary text-primary border' : 'hover:bg-slate-50 border border-transparent'
                                    }`}
                                >
                                    <span className="font-medium">{cls.name}</span>
                                    <div className="flex gap-2">
                                        <button className="text-slate-300 hover:text-blue-500"><Edit2 size={14} /></button>
                                        <ChevronRight size={16} className={`text-slate-400 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Subjects Column */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">{t.subjects}</h3>
                        <button className="p-1 hover:bg-white rounded-md text-primary" disabled={!activeClass}><Plus size={18} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {!activeClass ? (
                            <div className="text-center text-slate-400 mt-10 text-sm">Select a class first</div>
                        ) : filteredSubjects.length === 0 ? (
                            <div className="text-center text-slate-400 mt-10 text-sm">No subjects found</div>
                        ) : (
                            filteredSubjects.map(sub => (
                                <div 
                                    key={sub.id}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent"
                                >
                                    <span className="font-medium">{sub.name}</span>
                                    <div className="flex gap-2">
                                        <button className="text-slate-300 hover:text-blue-500"><Edit2 size={14} /></button>
                                        <button className="text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
