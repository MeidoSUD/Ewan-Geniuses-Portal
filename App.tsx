
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
  const [customUrl, setCustomUrl] = useState('');

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenService.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        console.log("--- AUTH INIT START ---");
        // 1. Force fetch fresh profile to validate token and get role
        const response = await authService.getProfile();
        
        // 2. Normalize Data
        const userObj = response.user?.data || (response as any).data || response;
        
        if (!userObj || !userObj.role_id) {
            throw new Error("Invalid Profile Data: Missing role_id");
        }

        const rid = Number(userObj.role_id);
        let finalRole = '';

        // 3. STRICT MAPPING - NO FALLBACKS
        if (rid === 4) finalRole = 'student';
        else if (rid === 3) finalRole = 'teacher';
        else if (rid === 1) finalRole = 'admin';
        else {
            // Critical Safety: Unknown role logs out
            console.error("Unknown Role ID:", rid);
            throw new Error("Unauthorized Role");
        }

        // 4. Update State safely
        setUserData({
            user: { role: finalRole, data: userObj },
            token: token
        });
        setCurrentScreen('dashboard');

      } catch (error: any) {
        console.error("Auth Failed:", error);
        if (error.message && (error.message.includes("Tunnel") || error.message.includes("Network Error"))) {
           setConnectionError(true);
        } else {
           // Clear invalid session
           tokenService.removeToken();
           setUserData(null);
           setCurrentScreen('login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLoginSuccess = (data: AuthResponse) => {
    const rid = Number(data.user.data?.role_id);
    
    // Explicit mapping on login too
    if (rid === 4) data.user.role = 'student';
    else if (rid === 3) data.user.role = 'teacher';
    else if (rid === 1) data.user.role = 'admin';
    else {
        alert("Login Error: Unknown Role ID " + rid);
        return;
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
                    Unable to connect to <strong>{API_BASE_URL}</strong>.
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
                          Verify Tunnel
                      </a>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                      <input 
                        type="text" 
                        placeholder="https://..." 
                        className="flex-1 border rounded-lg px-3 py-2 text-sm"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                      />
                      <Button 
                        onClick={() => {
                            if (customUrl) setApiUrl(customUrl.endsWith('/api') ? customUrl : `${customUrl}/api`);
                        }}
                        className="px-4"
                      >
                        Connect
                      </Button>
                  </div>
                  
                  <button 
                      onClick={() => { tokenService.removeToken(); window.location.reload(); }}
                      className="text-xs text-slate-400 hover:text-red-500 mt-4 underline"
                  >
                      Logout & Retry
                  </button>
                </div>
            </div>
        </div>
      );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background flex-col gap-4">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Explicit Role Guard
  const renderDashboard = () => {
      if (!userData) return null;
      const role = userData.user.role;
      
      if (role === 'admin') return <AdminDashboardScreen data={userData} onLogout={handleLogout} />;
      if (role === 'student') return <StudentDashboardScreen data={userData} onLogout={handleLogout} />;
      if (role === 'teacher') return <TeacherDashboardScreen data={userData} onLogout={handleLogout} />;
      
      return <div className="p-10 text-center">Unknown Role: {role}</div>;
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
