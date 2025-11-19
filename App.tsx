
import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { TeacherDashboardScreen } from './components/TeacherDashboardScreen';
import { Button } from './components/ui/Button';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { AuthResponse, authService, tokenService, API_BASE_URL } from './services/api';

const AppContent = () => {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'dashboard'>('login');
  const [userData, setUserData] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenService.getToken();
      if (token) {
        try {
          // Attempt to fetch profile to validate token and get user data
          const response = await authService.getProfile();
          // If successful, set user data and go to dashboard
          
          // Constructing a valid AuthResponse if only user data is returned
          const fullData = response.user ? response : { user: { role: 'teacher', data: response as any }, token };
          
          setUserData(fullData);
          setCurrentScreen('dashboard');
        } catch (error: any) {
          console.error("Session init error:", error);
          if (error.message && (error.message.includes("Tunnel verification") || error.message.includes("Network Error"))) {
             setConnectionError(true);
          } else {
             tokenService.removeToken();
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const handleLoginSuccess = (data: AuthResponse) => {
    setUserData(data);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setUserData(null);
    setCurrentScreen('login');
  };

  if (connectionError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-200">
                <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-900 mb-2">Connection Setup Required</h2>
                <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                    The development server is using a secure tunnel (Localtunnel) which requires a one-time manual verification to allow access.
                </p>
                
                <div className="space-y-3">
                  <a 
                      href={API_BASE_URL.replace('/api', '')} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-50 text-blue-700 rounded-lg font-semibold hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                      <ExternalLink size={18} />
                      1. Open Verification Page
                  </a>
                  <p className="text-xs text-slate-400">Click the button above, then click "Click to Submit" on the page that opens.</p>
                  
                  <Button 
                      onClick={() => window.location.reload()} 
                      className="w-full"
                  >
                      2. I've Verified, Retry
                  </Button>
                </div>
            </div>
        </div>
      );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-text" dir="ltr">
        {currentScreen === 'login' && (
          <div className="flex items-center justify-center min-h-screen p-4">
             <LoginScreen 
                onSwitch={() => setCurrentScreen('register')} 
                onLoginSuccess={handleLoginSuccess}
              />
          </div>
        )}
        
        {currentScreen === 'register' && (
          <div className="flex items-center justify-center min-h-screen p-4">
            <RegisterScreen 
              onSwitch={() => setCurrentScreen('login')} 
            />
          </div>
        )}

        {currentScreen === 'dashboard' && userData && (
          <TeacherDashboardScreen 
            data={userData} 
            onLogout={handleLogout} 
          />
        )}
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
