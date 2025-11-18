// =====================================================
// API INTEGRATION INSTRUCTIONS (LARAVEL BACKEND)
// =====================================================
/*
  1. Base URL: Define your API base URL in a .env file (e.g., REACT_APP_API_URL=https://api.yourapp.com/api/v1)
  2. Axios: Use 'axios' for HTTP requests.
  3. Headers: 
     - 'Accept': 'application/json'
     - 'Content-Type': 'application/json'
     - 'Accept-Language': language (en/ar) -> Pass this from LanguageContext to handle validation errors in correct language.
*/

export const authService = {
  login: async (data: any) => {
    console.log("Calling API: POST /auth/login", data);
    // Example implementation:
    // const response = await axios.post(`${API_URL}/auth/login`, data);
    // return response.data;
    
    // Mock response
    return new Promise((resolve) => setTimeout(resolve, 1500));
  },

  register: async (data: any) => {
    console.log("Calling API: POST /auth/register", data);
    // Example implementation:
    // const response = await axios.post(`${API_URL}/auth/register`, data);
    // return response.data;

    // Mock response
    return new Promise((resolve) => setTimeout(resolve, 1500));
  }
};
