
// =====================================================
// API INTEGRATION
// =====================================================

const LOCAL_URL = "https://myewanlaravelapp.loca.lt/api";
const LIVE_URL = "https://portal.ewan-geniuses.com/api";
const URL_STORAGE_KEY = 'api_base_url';

export let API_BASE_URL = localStorage.getItem(URL_STORAGE_KEY) || LIVE_URL;

export const setApiUrl = (url: string) => {
  localStorage.setItem(URL_STORAGE_KEY, url);
  API_BASE_URL = url;
  window.location.reload();
};

export const resetApiUrl = () => {
  localStorage.removeItem(URL_STORAGE_KEY);
  API_BASE_URL = LOCAL_URL;
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

export interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role_id: number;
  nationality: string;
  gender: string;
  profile?: {
    bio: string;
    hourly_rate?: number;
    rating?: number;
    total_students?: number;
    current_balance?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface AuthResponse {
  user: {
    role: string;
    data: UserData;
  };
  token: string;
}

export interface ReferenceItem {
  id: number;
  name_en?: string;
  name_ar?: string;
  name?: string; // Fallback
  [key: string]: any;
}

export interface TeacherSubject {
  id: number;
  name_en: string;
  name_ar: string;
  class_id: number;
  education_level_id: number;
  subject?: any;
  class?: any;
  education_level?: any;
}

export interface Course {
  id: number;
  title: string;
  image?: string;
  price?: number;
  description?: string;
  [key: string]: any;
}

export interface Service {
  id: number;
  name_en: string;
  name_ar: string;
  image?: string;
}

export interface TeacherProfile {
  id: number;
  first_name: string;
  last_name: string;
  profile_photo?: string;
  [key: string]: any;
}

export interface Order {
  id: number;
  student: { first_name: string; last_name: string };
  subject: { name_en: string; name_ar: string };
  details: string;
  created_at: string;
  status: string;
}

export interface BankReference {
  id: number;
  name_en: string;
  name_ar: string;
}

export interface BankAccount {
  id: number;
  user_id: number;
  bank_id: number;
  account_number: string;
  account_holder_name: string;
  iban: string;
  swift_code?: string;
  is_default: number | boolean;
  banks?: {
    id: number;
    name_en: string;
    name_ar: string;
  };
}

import { WalletResponse } from '../types';

// --- Authenticated Fetch Helper ---
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = tokenService.getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // 'bypass-tunnel-reminder': 'true', // Kept commented: Enable only if backend allows this header
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let finalEndpoint = endpoint;
  
  try {
    const response = await fetch(`${API_BASE_URL}${finalEndpoint}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type");
    const text = await response.text();

    // Check for Localtunnel warning page (HTML response)
    if (contentType && contentType.includes("text/html")) {
       if (text.includes("tunnel") || text.includes("Localtunnel") || text.includes("loca.lt")) {
           throw new Error("Tunnel verification required. Please open the API URL in your browser to verify the connection.");
       }
       if (!response.ok) {
          throw new Error(`Server returned an HTML error (Status: ${response.status}). Check the API URL.`);
       }
       return text; 
    }

    let result;
    try {
        result = JSON.parse(text);
    } catch {
        result = text;
    }

    if (!response.ok) {
      if (response.status === 401) {
        tokenService.removeToken();
      }
      // Check for both 'message' and 'error' properties for error text
      const errorMessage = 
        (typeof result === 'object' && (result.message || result.error)) 
        ? (result.message || result.error) 
        : "API Request failed";
      throw new Error(errorMessage);
    }

    return result;

  } catch (error: any) {
    // Handle "Failed to fetch" (Network Error / CORS)
    if (error.message === 'Failed to fetch') {
      console.error("Network Error Details:", error);
      throw new Error(`Network Error: Unable to connect to ${API_BASE_URL}. Check internet or server.`);
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
    
    if (result.token) {
      tokenService.setToken(result.token);
    }
    return result;
  },

  register: async (data: any) => {
    return fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getProfile: async (): Promise<AuthResponse> => {
    return fetchWithAuth('/auth/user/details', {
       method: 'GET'
    });
  },
  
  logout: async () => {
    tokenService.removeToken();
  }
};

export const referenceService = {
  getEducationLevels: async (): Promise<ReferenceItem[]> => {
    const response = await fetchWithAuth('/education-levels');
    return response.education_levels || [];
  },

  getClasses: async (levelId: number): Promise<ReferenceItem[]> => {
    const response = await fetchWithAuth(`/classes/${levelId}`);
    return response.classes || [];
  },

  getSubjects: async (classId: number): Promise<ReferenceItem[]> => {
    const response = await fetchWithAuth(`/subjects/${classId}`);
    
    if (response.id && !Array.isArray(response)) {
      return [response];
    }
    return response.subjects || (Array.isArray(response) ? response : []);
  },

  getBanks: async (): Promise<BankReference[]> => {
    const response = await fetchWithAuth('/banks');
    return response.data || response || [];
  }
};

export const teacherService = {
  getSubjects: async (): Promise<TeacherSubject[]> => {
     const response = await fetchWithAuth('/teacher/subjects');
     if (Array.isArray(response) && response.length > 0 && Array.isArray(response[0])) {
        return response[0];
     }
     if (Array.isArray(response)) return response;
     return response.data || response || [];
  },

  addSubject: async (subjectIds: number[]) => {
    return fetchWithAuth('/teacher/subjects', { 
      method: 'POST', 
      body: JSON.stringify({ subjects_id: subjectIds }) 
    });
  },

  getCourses: async (): Promise<Course[]> => {
    const response = await fetchWithAuth('/teacher/courses');
    return response.data || response || [];
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await fetchWithAuth('/teacher/orders/browse');
    return response.data || response || [];
  },

  applyToOrder: async (orderId: number) => {
    return fetchWithAuth(`/teacher/orders/${orderId}/apply`, { method: 'POST' });
  },

  // Wallet & Payments
  getWallet: async (): Promise<WalletResponse> => {
      const response = await fetchWithAuth('/teacher/wallet');
      return response.data || response;
  },

  getPaymentMethods: async (): Promise<BankAccount[]> => {
    const response = await fetchWithAuth('/teacher/payment-methods');
    return response.data || response || [];
  },

  addPaymentMethod: async (data: any) => {
    return fetchWithAuth('/teacher/payment-methods', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  setDefaultPaymentMethod: async (id: number) => {
    return fetchWithAuth(`/teacher/payment-methods/set-default/${id}`, {
      method: 'POST' 
    });
  },

  deletePaymentMethod: async (id: number) => {
    return fetchWithAuth(`/teacher/payment-methods/${id}`, {
      method: 'DELETE'
    });
  },

  withdraw: async (data: { amount: number; payment_method_id: number }) => {
    return fetchWithAuth('/teacher/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Profile
  updateProfile: async (data: any) => {
     return fetchWithAuth('/teacher/info', {
         method: 'POST',
         body: JSON.stringify(data)
     });
  }
};

export const studentService = {
  getServices: async (): Promise<Service[]> => {
    const response = await fetchWithAuth('/student/services');
    return response.data || response || [];
  },

  getTeachers: async (): Promise<TeacherProfile[]> => {
    const response = await fetchWithAuth('/student/teachers');
    return response.data || response || [];
  },
  
  // Placeholder for dashboard data until endpoints are fully defined
  getDashboardData: async () => {
      return {
          lastBooking: null,
          topTeachers: [],
          recommendedCourses: []
      };
  }
};
