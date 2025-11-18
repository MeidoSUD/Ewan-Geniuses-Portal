import React, { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';

const AppContent = () => {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="w-full flex justify-center">
        {currentScreen === 'login' ? (
          <LoginScreen onSwitch={() => setCurrentScreen('register')} />
        ) : (
          <RegisterScreen onSwitch={() => setCurrentScreen('login')} />
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
