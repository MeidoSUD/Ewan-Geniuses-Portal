
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Search, Star, Clock, Filter, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { BookingModal } from './BookingModal';

// Mock Data
const TEACHERS = [
  { id: 1, name: "Sarah Johnson", subject: "English", rating: 4.9, price: 80, bio: "Certified TESOL teacher with 5 years exp.", nationality: "UK", img: "SJ" },
  { id: 2, name: "Mohammed Ali", subject: "Physics", rating: 4.8, price: 120, bio: "Physics expert specializing in high school curriculum.", nationality: "SA", img: "MA" },
  { id: 3, name: "Layla Hassan", subject: "Chemistry", rating: 4.7, price: 90, bio: "Making chemistry fun and easy to understand.", nationality: "EG", img: "LH" },
  { id: 4, name: "John Doe", subject: "Math", rating: 4.5, price: 70, bio: "Math tutor for all levels.", nationality: "US", img: "JD" },
  { id: 5, name: "Fatima Al-Sayed", subject: "Arabic", rating: 5.0, price: 100, bio: "Native Arabic speaker & professional tutor.", nationality: "SA", img: "FA" },
];

export const PrivateLessonsTab: React.FC = () => {
  const { t, direction, language } = useLanguage();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(200);
  const [bookingItem, setBookingItem] = useState<{title: string, price: number} | null>(null);

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in relative">
      
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={() => setShowMobileFilters(true)}>
            <Filter size={18} /> {t.filters}
        </Button>
      </div>

      {/* Sidebar Filters */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:w-72 lg:block lg:bg-transparent
        ${showMobileFilters ? 'translate-x-0' : (direction === 'rtl' ? 'translate-x-full' : '-translate-x-full')}
        ${direction === 'rtl' ? 'right-0 left-auto' : 'left-0 right-auto'}
      `}>
        <div className="h-full overflow-y-auto p-6 bg-white rounded-2xl border border-slate-100 shadow-sm lg:sticky lg:top-24">
            <div className="flex justify-between items-center mb-6 lg:hidden">
                <h3 className="font-bold text-lg">{t.filters}</h3>
                <button onClick={() => setShowMobileFilters(false)}><X size={24} /></button>
            </div>

            <div className="space-y-6">
                <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">{t.subject}</h4>
                    <Select 
                        label=""
                        options={[
                            {value: '', label: 'All Subjects'},
                            {value: 'math', label: 'Mathematics'},
                            {value: 'english', label: 'English'},
                            {value: 'physics', label: 'Physics'},
                        ]}
                        className="mb-0"
                    />
                </div>

                <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">{t.rating}</h4>
                    <div className="space-y-2">
                        {[5, 4, 3].map(star => (
                            <label key={star} className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
                                <div className="flex text-amber-400 group-hover:opacity-80">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill={i < star ? "currentColor" : "none"} className={i >= star ? "text-slate-300" : ""} />
                                    ))}
                                </div>
                                <span className="text-sm text-slate-600">& Up</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">{t.priceRange}</h4>
                    <input 
                        type="range" 
                        min="50" 
                        max="500" 
                        value={priceRange} 
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-sm text-slate-500 mt-2 font-medium">
                        <span>50 {t.sar}</span>
                        <span>{priceRange} {t.sar}</span>
                    </div>
                </div>

                <Button className="w-full mt-4">{t.applyFilters}</Button>
                <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-700">{t.clearFilters}</Button>
            </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setShowMobileFilters(false)}></div>
      )}

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Search Bar */}
        <div className="relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${direction === 'rtl' ? 'right-4' : 'left-4'}`} size={20} />
            <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                className={`w-full h-12 rounded-xl border border-slate-200 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all ${direction === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
            />
        </div>

        {/* Teacher Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {TEACHERS.map((teacher) => (
                <div key={teacher.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                    <div className="p-5 flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-3">
                                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                    {teacher.img}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{teacher.name}</h3>
                                    <p className="text-xs text-slate-500">{teacher.nationality}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg text-amber-500 text-xs font-bold">
                                <Star size={12} fill="currentColor" /> {teacher.rating}
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <span className="inline-block px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-semibold mb-2">
                                {teacher.subject}
                            </span>
                            <p className="text-sm text-slate-600 line-clamp-2">{teacher.bio}</p>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <div>
                            <span className="block text-xs text-slate-400">Rate</span>
                            <span className="font-bold text-primary">{teacher.price} <span className="text-xs font-normal text-slate-500">{t.sar}{t.perHour}</span></span>
                        </div>
                        <Button 
                            className="h-9 px-4 text-sm"
                            onClick={() => setBookingItem({ title: teacher.name, price: teacher.price })}
                        >
                            {t.bookNow}
                        </Button>
                    </div>
                </div>
            ))}
        </div>
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
