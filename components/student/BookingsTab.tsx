
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Search, Filter, Calendar, Clock, User, Video, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Booking } from '../../types';

// Mock Data
const MOCK_BOOKINGS: Booking[] = [
  { id: 1, teacher_name: "Ahmed Ali", subject: "Mathematics", date: "2025-11-20", time: "10:00 AM", status: "confirmed", type: "online", price: 150 },
  { id: 2, teacher_name: "Sarah Smith", subject: "English Literature", date: "2025-11-22", time: "02:00 PM", status: "pending", type: "presence", price: 200 },
  { id: 3, teacher_name: "Mohammed Noor", subject: "Physics", date: "2025-10-15", time: "11:00 AM", status: "completed", type: "online", price: 120 },
  { id: 4, teacher_name: "Layla Hassan", subject: "Chemistry", date: "2025-10-10", time: "09:00 AM", status: "cancelled", type: "online", price: 100 },
];

export const BookingsTab: React.FC<{ onViewCalendar?: () => void }> = ({ onViewCalendar }) => {
  const { t, direction } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');

  const filteredBookings = MOCK_BOOKINGS.filter(b => {
      const matchesSearch = b.teacher_name.toLowerCase().includes(search.toLowerCase()) || b.subject.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      
      if (filter === 'all') return true;
      if (filter === 'upcoming') return ['confirmed', 'pending'].includes(b.status);
      if (filter === 'completed') return b.status === 'completed';
      if (filter === 'cancelled') return b.status === 'cancelled';
      return true;
  });

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'confirmed': return 'bg-green-100 text-green-700';
          case 'pending': return 'bg-yellow-100 text-yellow-700';
          case 'completed': return 'bg-blue-100 text-blue-700';
          case 'cancelled': return 'bg-red-100 text-red-700';
          default: return 'bg-slate-100 text-slate-700';
      }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">{t.myBookings}</h2>
        {onViewCalendar && (
            <Button variant="outline" onClick={onViewCalendar} className="self-end sm:self-auto">
                {t.viewCalendar}
            </Button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
         <div className="relative flex-1">
            <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${direction === 'rtl' ? 'right-3' : 'left-3'}`} size={18} />
            <input 
                type="text" 
                placeholder={t.searchPlaceholder} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-primary ${direction === 'rtl' ? 'pr-10 pl-4' : ''}`} 
            />
         </div>
         <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {[
                { id: 'all', label: 'All' },
                { id: 'upcoming', label: t.upcoming },
                { id: 'completed', label: t.completed },
                { id: 'cancelled', label: t.cancelled }
            ].map(f => (
                <button
                    key={f.id}
                    onClick={() => setFilter(f.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        filter === f.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    {f.label}
                </button>
            ))}
         </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500">
                No bookings found matching your criteria.
            </div>
        ) : (
            filteredBookings.map(booking => (
                <div key={booking.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex gap-4">
                            <div className="h-14 w-14 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600">
                                {booking.teacher_name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{booking.subject}</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                                    <User size={14} /> {booking.teacher_name}
                                </div>
                                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded"><Calendar size={12} /> {booking.date}</span>
                                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded"><Clock size={12} /> {booking.time}</span>
                                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                                        {booking.type === 'online' ? <Video size={12} /> : <MapPin size={12} />} {booking.type}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col justify-between items-end gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                                {booking.status}
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-slate-900">{booking.price} {t.sar}</span>
                                <Button variant="outline" className="h-9 text-xs">
                                    {booking.status === 'completed' ? t.bookAgain : t.bookingDetails}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};
