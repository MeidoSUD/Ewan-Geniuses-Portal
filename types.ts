

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

// --- Schedules ---
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

// --- Wallet & Finance ---
export interface BankReference {
  id: number;
  name_en: string;
  name_ar: string;
}

export interface BankAccount {
  id: number;
  user_id: number;
  bank_id: number | null;
  account_number: string;
  account_holder_name: string;
  iban: string;
  swift_code?: string;
  is_default: number | boolean; 
  banks?: {
    id: number;
    name_en: string;
    name_ar: string;
  } | null;
}

export interface StudentPaymentMethod {
  id: number;
  user_id: number;
  payment_method_id: number;
  
  // Card Specific
  card_number: string | null;
  card_holder_name: string | null;
  card_cvc?: string | null;
  card_expiry_month: number | string | null;
  card_expiry_year: number | string | null;
  card_brand?: string | null;

  // Bank Specific
  bank_id?: number | null;
  account_number?: string | null;
  account_holder_name?: string | null;
  iban?: string | null;
  swift_code?: string | null;

  is_default: number | boolean;
  created_at?: string;
  updated_at?: string;

  payment_method?: {
    id: number;
    name_en: string;
    name_ar: string;
    status: number;
    icon_url?: string;
    created_at?: string | null;
  };
  
  // UI Helpers
  last_four?: string;
  holder_name?: string;
}

export interface Withdrawal {
  id: number;
  amount: string;
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

// --- User & Auth ---

export interface TeacherProfileStats {
    rating?: number;
    total_students?: number;
    bio?: string;
    verified?: boolean;
    individual_hour_price?: number;
    group_hour_price?: number;
}

export interface StudentProfileNested {
    profile_photo?: string;
    current_balance?: number;
}

export interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  nationality?: string;
  gender?: string;
  role_id: number;
  role?: string; 
  
  // Teacher Specific (Flat structure)
  profile_image?: string;
  bio?: string;
  rating?: number;
  total_students?: number;
  verified?: boolean;
  individual_hour_price?: number;
  group_hour_price?: number;
  is_active?: number | boolean;
  current_balance?: number;

  // Student Specific (Nested structure)
  profile?: StudentProfileNested; 
  
  // Helper for nested API returns
  data?: UserData;
}

export interface AuthResponse {
  user: {
    role: string;
    data: UserData;
  };
  token: string;
  message?: string;
  errors?: any;
}

// --- General ---
export interface ReferenceItem {
  id: number;
  name: string;
  name_en?: string;
  name_ar?: string;
}

export interface TeacherSubject {
  id: number;
  name: string;
  name_en?: string;
  name_ar?: string;
  education_level_id: number;
  class_id: number;
}

// --- Student Specific ---
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
  date: string;
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
