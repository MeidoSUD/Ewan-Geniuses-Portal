// =====================================================
// API INTEGRATION
// =====================================================

const TUNNEL_URL = "https://myewanlaravelapp.loca.lt/api";
const EMULATOR_URL = "http://10.0.2.2:8000/api";
const URL_STORAGE_KEY = 'api_base_url';

// Default to TUNNEL_URL
export let API_BASE_URL = localStorage.getItem(URL_STORAGE_KEY) || TUNNEL_URL;

export const setApiUrl = (url: string) => {
  localStorage.setItem(URL_STORAGE_KEY, url);
  API_BASE_URL = url;
  window.location.reload();
};

export const resetApiUrl = () => {
  localStorage.removeItem(URL_STORAGE_KEY);
  API_BASE_URL = TUNNEL_URL;
  window.location.reload();
};

// --- Token Management ---
const TOKEN_KEY = 'auth_token';

export const tokenService = {
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
};

// --- Types ---
import { 
  WalletResponse, 
  StudentPaymentMethod, 
  AuthResponse, 
  ReferenceItem, 
  TeacherSubject, 
  BankReference, 
  BankAccount, 
  UserData 
} from '../types';

export type { 
  AuthResponse, 
  UserData, 
  WalletResponse, 
  StudentPaymentMethod, 
  ReferenceItem, 
  TeacherSubject, 
  BankReference, 
  BankAccount, 
};

// --- Helpers ---

export const getStorageUrl = (path: string | undefined | null): string | undefined => {
    if (!path) return undefined;
    if (path.startsWith('http')) return path;
    
    const baseUrl = API_BASE_URL.replace('/api', '');
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // Common storage paths
    if (cleanPath.startsWith('images/') || cleanPath.startsWith('profile_photos/') || cleanPath.startsWith('storage/')) {
        // Avoid double storage/storage
        if (cleanPath.startsWith('storage/')) return `${baseUrl}/${cleanPath}`;
        return `${baseUrl}/storage/${cleanPath}`;
    }
    
    return `${baseUrl}/${cleanPath}`;
};

// --- Authenticated Fetch Helper ---
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = tokenService.getToken();
  
  const headers: any = {
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': '69420', // Bypass Ngrok warning page
    'Cache-Control': 'no-cache, no-store, must-revalidate', 
    'Pragma': 'no-cache',
    'Expires': '0',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
  }

  try {
    console.log(`API Request: ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type");
    const text = await response.text();

    // Check for HTML responses (Tunnel Warning or 500 Error Pages)
    if (contentType && contentType.includes("text/html")) {
       if (text.includes("tunnel") || text.includes("Localtunnel") || text.includes("ngrok")) {
           throw new Error("Tunnel verification required. Please open the API URL in browser.");
       }
       // Try to extract error from HTML title if possible, or generic
       throw new Error(`Server returned HTML (Status ${response.status}). Possible PHP Error or 404.`);
    }

    let result;
    try {
        result = text ? JSON.parse(text) : {};
    } catch {
        result = text;
    }

    if (!response.ok) {
      if (response.status === 401) {
        tokenService.removeToken();
      }

      const errorMessage =
        (typeof result === 'object' && (result.message || result.error))
        ? (result.message || result.error)
        : "API Request failed";

      const error: any = new Error(errorMessage);
      if (typeof result === 'object' && result.errors) {
          error.errors = result.errors;
      }
      throw error;
    }

    return result;

  } catch (error: any) {
    if (error.message === 'Failed to fetch') {
      throw new Error(`Network Error: Unable to connect to ${API_BASE_URL}`);
    }
    throw error;
  }
};

// --- Services ---

export const authService = {
  login: async (data: any): Promise<AuthResponse> => {
    const result = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (result.token) tokenService.setToken(result.token);
    return result;
  },

  register: async (data: any) => {
    return fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getProfile: async (): Promise<AuthResponse> => {
    const res = await fetchWithAuth('/auth/user/details', {
       method: 'GET'
    });
    
    if (res.data && res.data.id && !res.user) {
        return { user: { data: res.data, role: '' }, token: '' } as AuthResponse;
    }
    return res;
  },
  
  // Laravel PUT spoofing for FormData
  updateProfile: async (formData: FormData) => {
      formData.append('_method', 'PUT'); // Critical for Laravel
      return fetchWithAuth('/profile/profile/update', {
          method: 'POST', // Send as POST, handled as PUT by server
          body: formData
      });
  },
  
  deleteAccount: async () => {
      return fetchWithAuth('/profile/profile', { // Assuming destroy route
          method: 'DELETE'
      });
  },
  
  logout: async () => {
    tokenService.removeToken();
  }
};

export const referenceService = {
  getEducationLevels: async (): Promise<ReferenceItem[]> => (await fetchWithAuth('/education-levels')).education_levels || [],
  getClasses: async (id: number): Promise<ReferenceItem[]> => (await fetchWithAuth(`/classes/${id}`)).classes || [],
  getSubjects: async (id: number): Promise<ReferenceItem[]> => {
      const res = await fetchWithAuth(`/subjects/${id}`);
      return res.subjects || (Array.isArray(res) ? res : [res]);
  },
  getBanks: async (): Promise<BankReference[]> => {
      const res = await fetchWithAuth('/banks');
      return res.data || res || [];
  }
};

export const teacherService = {
  getSubjects: async (): Promise<TeacherSubject[]> => {
     const res = await fetchWithAuth('/teacher/subjects');
     return Array.isArray(res) ? res : (res.data || []);
  },
  addSubject: async (ids: number[]) => fetchWithAuth('/teacher/subjects', { method: 'POST', body: JSON.stringify({ subjects_id: ids }) }),
  getCourses: async () => (await fetchWithAuth('/teacher/courses')).data || [],
  getOrders: async () => (await fetchWithAuth('/teacher/orders/browse')).data || [],
  applyToOrder: async (id: number) => fetchWithAuth(`/teacher/orders/${id}/apply`, { method: 'POST' }),
  getWallet: async () => (await fetchWithAuth('/teacher/wallet')).data,
  getPaymentMethods: async (): Promise<BankAccount[]> => (await fetchWithAuth('/teacher/payment-methods')).data || [],
  addPaymentMethod: async (data: any) => fetchWithAuth('/teacher/payment-methods', { method: 'POST', body: JSON.stringify(data) }),
  setDefaultPaymentMethod: async (id: number) => fetchWithAuth(`/teacher/payment-methods/set-default/${id}`, { method: 'POST' }),
  deletePaymentMethod: async (id: number) => fetchWithAuth(`/teacher/payment-methods/${id}`, { method: 'DELETE' }),
  withdraw: async (data: any) => fetchWithAuth('/teacher/wallet/withdraw', { method: 'POST', body: JSON.stringify(data) }),
  updateInfo: async (data: any) => fetchWithAuth('/teacher/info', { method: 'POST', body: JSON.stringify(data) })
};

export const studentService = {
  getServices: async () => (await fetchWithAuth('/student/services')).data || [],
  getTeachers: async () => (await fetchWithAuth('/student/teachers')).data || [],
  
  getPaymentMethods: async (): Promise<StudentPaymentMethod[]> => {
    const response = await fetchWithAuth('/student/payment-methods');
    if (response && Array.isArray(response.data)) return response.data;
    if (Array.isArray(response)) return response;
    return [];
  },

  addPaymentMethod: async (data: any) => {
    return fetchWithAuth('/student/payment-methods', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  deletePaymentMethod: async (id: number) => {
    return fetchWithAuth(`/student/payment-methods/${id}`, {
      method: 'DELETE'
    });
  },
};
