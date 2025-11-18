import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Logo } from './Logo';
import { User, Mail, Lock, Phone, Globe, Flag } from 'lucide-react';
import { COUNTRIES } from '../constants';
import { authService } from '../services/api';

interface RegisterScreenProps {
  onSwitch: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onSwitch }) => {
  const { t, language, setLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    phone: '',
    nationality: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName) newErrors.firstName = t.required;
    if (!formData.lastName) newErrors.lastName = t.required;
    if (!formData.gender) newErrors.gender = t.required;
    if (!formData.email) {
      newErrors.email = t.required;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t.invalidEmail;
    }
    if (!formData.phone) newErrors.phone = t.required;
    if (!formData.nationality) newErrors.nationality = t.required;
    if (!formData.password) newErrors.password = t.required;
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.passwordsNoMatch;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await authService.register(formData);
      alert(t.successRegister);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when typing
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="w-full max-w-lg space-y-8">
       <div className="flex justify-end">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
        >
          <Globe size={16} />
          {language === 'en' ? 'العربية' : 'English'}
        </button>
      </div>

      <Logo className="scale-90" />

      <div className="text-center">
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          {t.registerTitle}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {t.registerSubtitle}
        </p>
      </div>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={t.firstName}
            icon={<User size={18} />}
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            error={errors.firstName}
          />
          <Input
            label={t.lastName}
            icon={<User size={18} />}
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            error={errors.lastName}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
           <Select
            label={t.gender}
            options={[
              { value: 'male', label: t.genderMale },
              { value: 'female', label: t.genderFemale }
            ]}
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            error={errors.gender}
          />
           <Select
            label={t.nationality}
            options={COUNTRIES.map(c => ({ value: c, label: c }))}
            value={formData.nationality}
            onChange={(e) => handleChange('nationality', e.target.value)}
            error={errors.nationality}
          />
        </div>

        <Input
          label={t.email}
          icon={<Mail size={18} />}
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
        />

        <Input
          label={t.phone}
          icon={<Phone size={18} />}
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          error={errors.phone}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={t.password}
            type="password"
            icon={<Lock size={18} />}
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
          />
          <Input
            label={t.confirmPassword}
            type="password"
            icon={<Lock size={18} />}
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full" isLoading={isLoading}>
            {t.registerBtn}
          </Button>
        </div>
      </form>

      <div className="text-center text-sm pb-4">
        <span className="text-slate-500">{t.haveAccount} </span>
        <button onClick={onSwitch} className="font-semibold text-primary hover:text-teal-600">
          {t.switchToLogin}
        </button>
      </div>
    </div>
  );
};
