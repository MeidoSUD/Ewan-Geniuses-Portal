
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Plus, Clock, User, MoreVertical, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { ScheduleItem } from '../../types';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

const MOCK_SCHEDULE: ScheduleItem[] = [
  { id: '1', time: '09:00 AM', type: 'online', subject: 'Physics 101', level: 'High School', studentsCount: 3, maxStudents: 5, price: 50, isAvailable: false },
  { id: '2', time: '11:30 AM', type: 'presence', subject: 'Math Tutoring', level: 'University', studentsCount: 1, maxStudents: 1, price: 120, isAvailable: false },
  { id: '3', time: '02:00 PM', type: 'online', subject: '', level: '', studentsCount: 0, maxStudents: 0, price: 50, isAvailable: true },
];

export const ScheduleTab: React.FC = () => {
  const { t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const days = [
    { name: 'Sat', date: '14', value: 'saturday' },
    { name: 'Sun', date: '15', value: 'sunday' },
    { name: 'Mon', date: '16', value: 'monday' },
    { name: 'Tue', date: '17', value: 'tuesday' },
    { name: 'Wed', date: '18', value: 'wednesday' },
    { name: 'Thu', date: '19', value: 'thursday' },
    { name: 'Fri', date: '20', value: 'friday' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">{t.schedule}</h2>
        <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-primary/25">
          <Plus size={18} className="mr-2" /> {t.addSlot}
        </Button>
      </div>

      {/* Days Navigation */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedDay(idx)}
            className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-2xl transition-all border ${
              selectedDay === idx
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-medium uppercase">{day.name}</span>
            <span className="text-xl font-bold">{day.date}</span>
          </button>
        ))}
      </div>

      {/* Time Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_SCHEDULE.map((slot) => (
          <div 
            key={slot.id} 
            className={`relative p-5 rounded-2xl border transition-all ${
              slot.isAvailable 
                ? 'bg-white border-dashed border-slate-300 hover:border-primary/50' 
                : 'bg-white border-slate-100 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center text-slate-900 font-bold">
                <Clock size={18} className="mr-2 text-primary" />
                {slot.time}
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreVertical size={18} />
              </button>
            </div>

            {slot.isAvailable ? (
              <div className="py-4 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium">
                  {t.available}
                </span>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <h4 className="font-bold text-slate-800 text-lg">{slot.subject}</h4>
                  <p className="text-sm text-slate-500">{slot.level}</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-slate-600">
                    <User size={16} />
                    <span>{slot.studentsCount}/{slot.maxStudents}</span>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    slot.type === 'online' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                  }`}>
                    {slot.type === 'online' ? t.online : t.presence}
                  </div>
                </div>
              </>
            )}
            
            <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
               <span className="font-bold text-slate-900">{slot.price} {t.sar}</span>
               {!slot.isAvailable && <span className="text-xs text-slate-400">/ hour</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Add Slot Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t.addSlot}>
         <div className="space-y-4">
            <Select 
                label="Day of Week"
                options={days.map(d => ({ value: d.value, label: `${d.name} (${d.date})` }))}
            />
            <div className="grid grid-cols-2 gap-4">
                <Input label="Start Time" type="time" defaultValue="09:00" />
                <Input label="End Time" type="time" defaultValue="10:00" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Select 
                    label="Type"
                    options={[{value: 'online', label: t.online}, {value: 'presence', label: t.presence}]}
                />
                <Input label="Price (SAR)" type="number" placeholder={t.phAmount} />
            </div>
            <div className="pt-2">
                <Button className="w-full" onClick={() => { alert("Slot Added!"); setIsModalOpen(false); }}>
                    Save Time Slot
                </Button>
            </div>
         </div>
      </Modal>
    </div>
  );
};
