
import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { TeacherDashboardScreen } from './components/TeacherDashboardScreen';
import { StudentDashboardScreen } from './components/StudentDashboardScreen';
import { AdminDashboardScreen } from './components/AdminDashboardScreen';
import { Button } from './components/ui/Button';
import { AlertCircle, ExternalLink, RefreshCw, Server } from 'lucide-react';
import { AuthResponse, authService, tokenService, API_BASE_URL, setApiUrl } from './services/api';

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
          
          // Constructing a valid AuthResponse if only user data is returned
          const fullData = response.user ? response : { user: { role: 'teacher', data: response as any }, token };
          
          // Check for role based on role_id if string role is missing
          if (!fullData.user.role) {
              if (fullData.user.data?.role_id === 4) fullData.user.role = 'student';
              else if (fullData.user.data?.role_id === 1) fullData.user.role = 'admin';
              else fullData.user.role = 'teacher'; // Default
          }
          
          setUserData(fullData);
          setCurrentScreen('dashboard');
        } catch (error: any) {
          console.error("Session init error:", error);
          if (error.message && (error.message.includes("Tunnel") || error.message.includes("Network Error"))) {
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
    // Ensure role is set correctly
    if (!data.user.role) {
        if (data.user.data?.role_id === 4) data.user.role = 'student';
        else if (data.user.data?.role_id === 1) data.user.role = 'admin';
        else data.user.role = 'teacher';
    }
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
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-900 mb-2">Connection Error</h2>
                <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                    Unable to connect to the server at <strong>{API_BASE_URL}</strong>.
                </p>
                
                <div className="space-y-3">
                  {API_BASE_URL.includes('loca.lt') && (
                      <a 
                          href={API_BASE_URL.replace('/api', '')} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-50 text-blue-700 rounded-lg font-semibold hover:bg-blue-100 transition-colors border border-blue-200"
                      >
                          <ExternalLink size={18} />
                          Verify Tunnel (If Local)
                      </a>
                  )}
                  
                  <Button 
                      onClick={() => window.location.reload()} 
                      className="w-full"
                  >
                      <RefreshCw size={18} className="mr-2" /> Retry Connection
                  </Button>

                  <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                      <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">OR</span></div>
                  </div>

                  <Button 
                      variant="outline"
                      onClick={() => setApiUrl("https://portal.ewan-geniuses.com/api")} 
                      className="w-full"
                  >
                      <Server size={18} className="mr-2" /> Switch to Live Server
                  </Button>
                  
                  <button 
                      onClick={() => { tokenService.removeToken(); window.location.reload(); }}
                      className="text-xs text-slate-400 hover:text-red-500 mt-4 underline"
                  >
                      Clear Session & Restart
                  </button>
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

  const renderDashboard = () => {
      if (!userData) return null;
      
      const role = userData.user.role;
      
      if (role === 'admin') {
          return <AdminDashboardScreen data={userData} onLogout={handleLogout} />;
      } else if (role === 'student') {
          return <StudentDashboardScreen data={userData} onLogout={handleLogout} />;
      } else {
          return <TeacherDashboardScreen data={userData} onLogout={handleLogout} />;
      }
  };

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

        {currentScreen === 'dashboard' && renderDashboard()}
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
