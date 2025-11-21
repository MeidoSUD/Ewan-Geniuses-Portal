
export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export interface Translations {
  [key: string]: any;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  type: 'online' | 'presence';
  subject: string;
  level: string;
  studentsCount: number;
  maxStudents: number;
  price: number;
  isAvailable: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  time: string;
}

export interface BankReference {
  id: number;
  name_en: string;
  name_ar: string;
}

export interface BankAccount {
  id: number;
  user_id: number;
  bank_id: number;
  account_number: string;
  account_holder_name: string;
  iban: string;
  swift_code?: string;
  is_default: number | boolean; 
  banks?: {
    id: number;
    name_en: string;
    name_ar: string;
  };
}

export interface Withdrawal {
  id: number;
  amount: string; // API returns as string "500.00"
  status: string;
  requested_at: string;
  payment_method_id: number;
  payment_method?: BankAccount;
}

export interface WalletResponse {
  balance: number;
  withdrawals: {
    current_page: number;
    data: Withdrawal[];
    last_page: number;
    total: number;
  };
}

// Student Specific Types
export interface TeacherCard {
  id: number;
  first_name: string;
  last_name: string;
  profile_photo?: string;
  rating: number;
  subject?: string;
  hourly_rate?: number;
  nationality?: string;
  bio?: string;
}

export interface Booking {
  id: number;
  teacher_name: string;
  subject: string;
  date: string; // YYYY-MM-DD
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  type: 'online' | 'presence';
  price?: number;
}

export interface Dispute {
  id: string;
  caseNumber: string;
  teacherName: string;
  date: string;
  status: 'open' | 'resolved' | 'closed';
  reason: string;
  description: string;
}

export interface SubjectCategory {
  id: string;
  name_en: string;
  name_ar: string;
  icon?: any;
}