
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChevronLeft, ChevronRight, Clock, MapPin, Video, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Booking } from '../../types';

// Mock Data
const MOCK_BOOKINGS: Booking[] = [
  { id: 1, teacher_name: "Ahmed Ali", subject: "Math", date: "2025-11-20", time: "10:00 AM", status: "confirmed", type: "online" },
  { id: 2, teacher_name: "Sarah Smith", subject: "English", date: "2025-11-22", time: "02:00 PM", status: "pending", type: "presence" },
  { id: 3, teacher_name: "Mohammed Noor", subject: "Physics", date: "2025-11-25", time: "11:00 AM", status: "confirmed", type: "online" },
];

export const StudentScheduleTab: React.FC<{ onViewList?: () => void }> = ({ onViewList }) => {
  const { t, direction } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // Nov 2025
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sun

  // Adjust first day for RTL if needed (Standard calendar is usually Sun-Sat or Mon-Sun regardless of RTL, usually)
  // We'll assume standard Sun-Sat grid.

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getBookingsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return MOCK_BOOKINGS.filter(b => b.date === dateStr);
  };

  const renderCalendarDays = () => {
    const days = [];
    // Empty cells for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-slate-50/50 border border-slate-100"></div>);
    }
    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const bookings = getBookingsForDay(d);
      const isToday = new Date().getDate() === d && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
      
      days.push(
        <div key={d} className={`h-24 border border-slate-100 p-2 relative group transition-colors hover:bg-slate-50 ${isToday ? 'bg-blue-50/30' : 'bg-white'}`}>
          <span className={`text-sm font-medium ${isToday ? 'text-primary bg-blue-100 w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-700'}`}>
            {d}
          </span>
          <div className="mt-1 space-y-1 overflow-y-auto max-h-[calc(100%-24px)] scrollbar-hide">
            {bookings.map(b => (
              <button 
                key={b.id}
                onClick={() => setSelectedBooking(b)}
                className={`w-full text-left text-[10px] px-1.5 py-1 rounded truncate font-medium ${
                  b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                  b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {b.time} - {b.subject}
              </button>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">{t.mySchedule}</h2>
        <div className="flex gap-2">
            {onViewList && (
                <Button variant="outline" onClick={onViewList}>
                    {t.viewList}
                </Button>
            )}
            <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-md text-slate-600">
                    <ChevronLeft size={20} className={direction === 'rtl' ? 'rotate-180' : ''} />
                </button>
                <span className="px-4 font-semibold text-slate-900 min-w-[140px] text-center">
                    {/* Simple translation mapping or use Intl in real app */}
                    {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-md text-slate-600">
                    <ChevronRight size={20} className={direction === 'rtl' ? 'rotate-180' : ''} />
                </button>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center py-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs font-bold text-slate-500 uppercase tracking-wider">{day}</div>
          ))}
        </div>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 bg-slate-200 gap-px">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Booking Detail Modal */}
      <Modal isOpen={!!selectedBooking} onClose={() => setSelectedBooking(null)} title={t.bookingDetails}>
        {selectedBooking && (
            <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {selectedBooking.teacher_name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-lg">{selectedBooking.teacher_name}</h4>
                        <p className="text-slate-500 text-sm">{selectedBooking.subject}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-400 mb-1">{t.date}</p>
                        <div className="flex items-center gap-2 font-medium text-slate-700">
                            <CalendarIcon size={16} className="text-primary" />
                            {selectedBooking.date}
                        </div>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-400 mb-1">{t.time}</p>
                        <div className="flex items-center gap-2 font-medium text-slate-700">
                            <Clock size={16} className="text-primary" />
                            {selectedBooking.time}
                        </div>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-400 mb-1">{t.status}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                            selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                            selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {selectedBooking.status}
                        </span>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-400 mb-1">Type</p>
                        <div className="flex items-center gap-2 font-medium text-slate-700 capitalize">
                            {selectedBooking.type === 'online' ? <Video size={16} /> : <MapPin size={16} />}
                            {selectedBooking.type}
                        </div>
                    </div>
                </div>

                <div className="pt-2 flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setSelectedBooking(null)}>Close</Button>
                    {selectedBooking.status === 'confirmed' && selectedBooking.type === 'online' && (
                        <Button className="flex-1">Join Meeting</Button>
                    )}
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};
