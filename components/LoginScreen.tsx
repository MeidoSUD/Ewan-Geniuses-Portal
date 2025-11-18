import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Logo } from './Logo';
import { Mail, Lock, Globe } from 'lucide-react';
import { authService } from '../services/api';

interface LoginScreenProps {
  onSwitch: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSwitch }) => {
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
    // Basic email regex or phone regex logic would go here
    if (!formData.password) newErrors.password = t.required;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await authService.login(formData);
      alert(t.successLogin);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
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
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
          {t.loginTitle}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {t.loginSubtitle}
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4 rounded-md shadow-sm">
          <Input
            label={t.email}
            type="text" // allows email or phone
            placeholder={language === 'en' ? "name@example.com" : "name@example.com"}
            icon={<Mail size={18} />}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            error={errors.email}
          />
          <Input
            label={t.password}
            type="password"
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
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <label htmlFor="remember-me" className="ms-2 block text-sm text-slate-900">
              {t.rememberMe}
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-primary hover:text-teal-600">
              {t.forgotPassword}
            </a>
          </div>
        </div>

        <div>
          <Button type="submit" className="w-full" isLoading={isLoading}>
            {t.loginBtn}
          </Button>
        </div>
      </form>

      <div className="text-center text-sm">
        <span className="text-slate-500">{t.noAccount} </span>
        <button onClick={onSwitch} className="font-semibold text-primary hover:text-teal-600">
          {t.switchToRegister}
        </button>
      </div>
    </div>
  );
};
