const API_BASE_URL = 'http://localhost:8000/api';

// Temporary login credentials for testing (REMOVE IN PRODUCTION)
const TEMP_CREDENTIALS = {
  email: 'admin@school.com',
  password: 'admin123',
};

// Set to true to use temporary credentials, false to use real API
const USE_TEMP_LOGIN = true;

const apiService = {
  login: async (email, password) => {
    // TEMPORARY LOGIN - Remove this when backend is ready
    if (USE_TEMP_LOGIN) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === TEMP_CREDENTIALS.email && password === TEMP_CREDENTIALS.password) {
            resolve({
              user: {
                id: 1,
                name: 'Admin User',
                email: email,
                role: 'admin',
              },
              token: 'temporary-token-12345',
            });
          } else {
            reject(new Error('Invalid email or password'));
          }
        }, 1000); // Simulate network delay
      });
    }

    // REAL API CALL - This will run when USE_TEMP_LOGIN is false
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ "username/mail": email, password }),
      });

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
          if (email === TEMP_CREDENTIALS.email) {
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