
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe, Star, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { BookingModal } from './BookingModal';

// Mock Data
const LANGUAGE_TEACHERS = [
  { id: 1, name: "Sarah Johnson", language: "English", level: "Native", rating: 4.9, price: 80, img: "SJ" },
  { id: 2, name: "Pierre Dubois", language: "French", level: "Native", rating: 4.8, price: 120, img: "PD" },
  { id: 3, name: "Maria Garcia", language: "Spanish", level: "Native", rating: 4.7, price: 90, img: "MG" },
  { id: 4, name: "Li Wei", language: "Chinese", level: "Native", rating: 4.9, price: 110, img: "LW" },
  { id: 5, name: "Hans Müller", language: "German", level: "Native", rating: 4.6, price: 100, img: "HM" },
];

export const LanguageLearningTab: React.FC = () => {
  const { t } = useLanguage();
  const [bookingItem, setBookingItem] = useState<{title: string, price: number} | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-900">{t.languageLearning}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LANGUAGE_TEACHERS.map((teacher) => (
          <div key={teacher.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-500">
                  {teacher.img}
               </div>
               <div>
                  <h3 className="font-bold text-lg text-slate-900">{teacher.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                     <Globe size={14} /> {teacher.language} ({teacher.level})
                  </div>
               </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-4">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star size={16} fill="currentColor" /> {teacher.rating}
                </div>
                <div className="font-bold text-primary">
                    {teacher.price} <span className="text-slate-400 text-xs font-normal">{t.sar} {t.perHour}</span>
                </div>
            </div>

            <Button 
                className="w-full" 
                onClick={() => setBookingItem({ title: `${teacher.language} with ${teacher.name}`, price: teacher.price })}
            >
                {t.bookNow}
            </Button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={!!bookingItem}
        onClose={() => setBookingItem(null)}
        title={bookingItem?.title || ''}
        price={bookingItem?.price || 0}
      />
    </div>
  );
};
