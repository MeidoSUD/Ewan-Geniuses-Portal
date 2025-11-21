
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Clock, Star, ChevronRight, PlayCircle, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { UserData } from '../../services/api';

// Mock Data (Will be replaced with API calls)
const LAST_BOOKING = {
  id: 101,
  teacher_name: "Ahmed Al-Salem",
  subject: "Mathematics",
  date: "Oct 15, 2025",
  time: "10:00 AM",
  status: "confirmed",
  type: "online"
};

const TOP_TEACHERS = [
  { id: 1, name: "Sarah Johnson", subject: "English", rating: 4.9, price: 80, img: "SJ" },
  { id: 2, name: "Mohammed Ali", subject: "Physics", rating: 4.8, price: 120, img: "MA" },
  { id: 3, name: "Layla Hassan", subject: "Chemistry", rating: 4.7, price: 90, img: "LH" },
  { id: 4, name: "John Doe", subject: "Math", rating: 4.5, price: 70, img: "JD" },
];

const COURSES = [
  { id: 1, title: "Advanced Algebra", teacher: "Mohammed Ali", price: 400, lessons: 12 },
  { id: 2, title: "IELTS Preparation", teacher: "Sarah Johnson", price: 600, lessons: 20 },
  { id: 3, title: "Organic Chemistry", teacher: "Layla Hassan", price: 350, lessons: 10 },
];

interface OverviewTabProps {
  user: UserData;
  onNavigate: (tab: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ user, onNavigate }) => {
  const { t, direction } = useLanguage();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white shadow-lg shadow-blue-200">
        <h1 className="text-3xl font-bold mb-2">{t.welcomeBack} {user.first_name}!</h1>
        <p className="text-blue-100 opacity-90">Ready to learn something new today?</p>
      </div>

      {/* Last Booking Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">{t.lastBooking}</h2>
            <button className="text-sm text-primary font-medium hover:underline" onClick={() => onNavigate('schedule')}>
                {t.viewAll}
            </button>
        </div>
        
        {LAST_BOOKING ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">{LAST_BOOKING.subject}</h3>
                        <p className="text-slate-500 text-sm">with {LAST_BOOKING.teacher_name}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                            <span>{LAST_BOOKING.date}</span>
                            <span>•</span>
                            <span>{LAST_BOOKING.time}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                LAST_BOOKING.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {LAST_BOOKING.status}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none text-xs h-10">
                        View Details
                    </Button>
                    <Button className="flex-1 md:flex-none text-xs h-10">
                        Join Session
                    </Button>
                </div>
            </div>
        ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500">
                {t.noBookings}
            </div>
        )}
      </div>

      {/* Top Teachers */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">{t.topTeachers}</h2>
            <button className="text-sm text-primary font-medium hover:underline" onClick={() => onNavigate('private-lessons')}>
                {t.viewAll}
            </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOP_TEACHERS.map((teacher) => (
                <div key={teacher.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                        <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                            {teacher.img}
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                            <Star size={14} fill="currentColor" /> {teacher.rating}
                        </div>
                    </div>
                    <h3 className="font-bold text-slate-900 truncate">{teacher.name}</h3>
                    <p className="text-sm text-slate-500 mb-3">{teacher.subject}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                        <span className="text-sm font-semibold text-primary">{teacher.price} {t.sar}<span className="text-slate-400 text-xs font-normal">{t.perHour}</span></span>
                        <ChevronRight size={18} className={`text-slate-300 group-hover:text-primary transition-colors ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Recommended Courses */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">{t.recommendedCourses}</h2>
            <button className="text-sm text-primary font-medium hover:underline" onClick={() => onNavigate('courses')}>
                {t.viewAll}
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COURSES.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-32 bg-slate-100 flex items-center justify-center text-slate-300">
                        <BookOpen size={40} />
                    </div>
                    <div className="p-5">
                        <h3 className="font-bold text-slate-900 mb-1">{course.title}</h3>
                        <p className="text-sm text-slate-500 mb-4">by {course.teacher}</p>
                        
                        <div className="flex items-center justify-between mb-4 text-xs text-slate-500 font-medium bg-slate-50 p-2 rounded-lg">
                            <span className="flex items-center gap-1"><PlayCircle size={14} /> {course.lessons} Lessons</span>
                            <span>Online</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary">{course.price} {t.sar}</span>
                            <Button variant="outline" className="h-9 text-xs px-3">Enroll</Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
