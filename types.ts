export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export interface Translations {
  loginTitle: string;
  registerTitle: string;
  loginSubtitle: string;
  registerSubtitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender: string;
  genderMale: string;
  genderFemale: string;
  nationality: string;
  rememberMe: string;
  forgotPassword: string;
  loginBtn: string;
  registerBtn: string;
  haveAccount: string;
  noAccount: string;
  switchToLogin: string;
  switchToRegister: string;
  language: string;
  required: string;
  invalidEmail: string;
  passwordsNoMatch: string;
  successLogin: string;
  successRegister: string;
  loading: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
}
