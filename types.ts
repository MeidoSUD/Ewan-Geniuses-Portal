
export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export interface Translations {
  [key: string]: string;
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
