const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
// Updated temporary credentials to use 'username'
const TEMP_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

const USE_TEMP_LOGIN = false;

const apiService = {
  login: async (username, password) => {
    if (USE_TEMP_LOGIN) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {

          if (username === TEMP_CREDENTIALS.username && password === TEMP_CREDENTIALS.password) {
            resolve({
              user: {
                id: 1,
                name: 'Admin User',
                email: 'admin@school.com',
                username: username, // Added username to mock user
                role: 'admin',
              },
              token: 'temporary-token-12345',
            });
          } else {
            reject(new Error('Invalid username or password'));
          }
        }, 1000); // Simulate network delay
      });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Authorization':`Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      
        body: JSON.stringify({ "username": username, password }),
      });
      console.log(JSON.stringify({ "username": username, password }));
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return {
        user: data.data.user,
        token: data.data.token
      };
    } catch (error) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  forgotPassword: async (email) => {
    // TEMPORARY FORGOT PASSWORD - Remove this when backend is ready
    if (USE_TEMP_LOGIN) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Note: Forgot Password might still use email.
          // We are just checking against a mock email here.
          if (email === 'admin@school.com') { 
            resolve({
              message: 'Password reset link sent to your email',
            });
          } else {
            reject(new Error('Email not found in our system'));
          }
        }, 1000); // Simulate network delay
      });
    }

    // REAL API CALL - This will run when USE_TEMP_LOGIN is false
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error occurred');
    }
  },
};

export default apiService;