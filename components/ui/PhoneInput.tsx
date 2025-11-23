import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  value: string;
  onChangeText: (text: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({ 
  label, 
  error, 
  value, 
  onChangeText,
  className = '', 
  ...props 
}) => {
  const { direction } = useLanguage();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const val = e.target.value.replace(/\D/g, '');
    onChangeText(val);
  };

  return (
    <div className="mb-4 w-full">
      <label className="block text-sm font-medium text-text mb-1">
        {label}
      </label>
      <div className="relative flex" dir="ltr"> 
        {/* Fixed Country Code - Always LTR for number layout */}
        <div className="flex items-center justify-center rounded-l-lg border border-r-0 border-slate-200 bg-slate-100 px-3 text-slate-600 font-semibold">
          <span className="mr-1">🇸🇦</span> +966
        </div>
        
        <input
          {...props}
          value={value}
          onChange={handleChange}
          type="tel"
          maxLength={9}
          placeholder="5xxxxxxxx"
          className={`
            flex-1 rounded-r-lg border bg-white py-3 px-4 text-text shadow-sm transition-all
            focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none
            disabled:cursor-not-allowed disabled:bg-slate-50
            ${error ? 'border-error' : 'border-slate-200'}
            ${className}
          `}
        />
      </div>
      {error && (
        <p className={`mt-1 text-xs text-error ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
          {error}
        </p>
      )}
    </div>
  );
};