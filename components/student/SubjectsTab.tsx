
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { BookOpen, Video, Users, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { BookingModal } from './BookingModal';

// Mock Data
const CATEGORIES = [
  { id: 'all', name_en: 'All', name_ar: 'الكل' },
  { id: 'math', name_en: 'Mathematics', name_ar: 'الرياضيات' },
  { id: 'science', name_en: 'Science', name_ar: 'العلوم' },
  { id: 'languages', name_en: 'Languages', name_ar: 'اللغات' },
  { id: 'programming', name_en: 'Programming', name_ar: 'البرمجة' },
  { id: 'arts', name_en: 'Arts', name_ar: 'الفنون' },
];

const COURSES = [
  { id: 1, title: "Calculus I", category: "math", teacher: "Dr. Ahmed", price: 150, rating: 4.8, students: 120, type: 'video' },
  { id: 2, title: "Physics 101", category: "science", teacher: "Sara Ali", price: 200, rating: 4.5, students: 85, type: 'live' },
  { id: 3, title: "English Conversation", category: "languages", teacher: "John Smith", price: 120, rating: 4.9, students: 200, type: 'live' },
  { id: 4, title: "Intro to Python", category: "programming", teacher: "Code Master", price: 300, rating: 4.7, students: 150, type: 'video' },
  { id: 5, title: "Algebra Basics", category: "math", teacher: "Fatima Noor", price: 100, rating: 4.6, students: 90, type: 'video' },
];

export const SubjectsTab: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [bookingItem, setBookingItem] = useState<{title: string, price: number} | null>(null);

  const filteredCourses = activeCategory === 'all' 
    ? COURSES 
    : COURSES.filter(c => c.category === activeCategory);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">{t.courses}</h2>
      </div>

      {/* Categories Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-primary text-white shadow-md shadow-primary/30'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {language === 'ar' ? cat.name_ar : cat.name_en}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group">
            {/* Course Image Placeholder */}
            <div className="h-40 bg-slate-100 relative flex items-center justify-center group-hover:bg-slate-200 transition-colors">
               <BookOpen size={48} className="text-slate-300" />
               <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                  <Star size={12} className="text-amber-400 fill-current" /> {course.rating}
               </div>
               <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium">
                  {course.type === 'video' ? 'Video Course' : 'Live Session'}
               </div>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                 <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{course.title}</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4">by {course.teacher}</p>
              
              <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                 <span className="flex items-center gap-1"><Users size={14} /> {course.students} students</span>
                 <span className="flex items-center gap-1"><Video size={14} /> 12 Lessons</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-xl font-bold text-primary">{course.price} <span className="text-xs font-normal text-slate-400">{t.sar}</span></span>
                <Button 
                    className="h-9 px-4 text-sm"
                    onClick={() => setBookingItem({ title: course.title, price: course.price })}
                >
                    {t.bookNow}
                </Button>
              </div>
            </div>
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
