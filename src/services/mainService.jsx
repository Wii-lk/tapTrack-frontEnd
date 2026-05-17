import { loaderController } from './loaderController';

// Base URL for your API
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
/**
 * Universal API Wrapper that handles:
 * 1. Global Loading State
 * 2. Auth Headers
 * 3. Error Handling
 */
const apiRequest = async (endpoint, options = {}) => {
  // 1. Show Loader
  loaderController.show();

  try {
    const token = localStorage.getItem("token");
    
    // Default Headers
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    // Handle FormData (remove Content-Type to let browser set boundary)
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;

  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  } finally {
    // 2. Hide Loader (Always runs, success or fail)
    loaderController.hide();
  }
};

// Export cleaner methods for your services
export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
  
  // Special method for File Uploads
  upload: (endpoint, formData) => apiRequest(endpoint, { method: 'POST', body: formData }),
};