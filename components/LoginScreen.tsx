
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Logo } from './Logo';
import { Mail, Lock, Globe } from 'lucide-react';
import { authService, AuthResponse } from '../services/api';

interface LoginScreenProps {
  onSwitch: () => void;
  onLoginSuccess: (data: AuthResponse) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSwitch, onLoginSuccess }) => {
  const { t, language, setLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = t.required;
    if (!formData.password) newErrors.password = t.required;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await authService.login(formData);
      onLoginSuccess(response);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-surface p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
      <div className="flex justify-end">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
        >
          <Globe size={16} />
          {language === 'en' ? 'العربية' : 'English'}
        </button>
      </div>

      <Logo />

      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-text">
          {t.loginTitle}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {t.loginSubtitle}
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label={t.email}
            type="text"
            placeholder={t.phEmail}
            icon={<Mail size={18} />}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            error={errors.email}
          />
          <Input
            label={t.password}
            type="password"
            placeholder={t.phPassword}
            icon={<Lock size={18} />}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            error={errors.password}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="remember-me" className="ms-2 block text-sm text-text">
              {t.rememberMe}
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-primary hover:text-blue-600 transition-colors">
              {t.forgotPassword}
            </a>
          </div>
        </div>

        <div>
          <Button type="submit" className="w-full shadow-lg shadow-primary/20" isLoading={isLoading}>
            {t.loginBtn}
          </Button>
        </div>
      </form>

      <div className="text-center text-sm">
        <span className="text-slate-500">{t.noAccount} </span>
        <button onClick={onSwitch} className="font-semibold text-primary hover:text-blue-600 transition-colors">
          {t.switchToRegister}
        </button>
      </div>
    </div>
  );
};
