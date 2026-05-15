const API_BASE_URL = "https://phoenixedubackend.dpdns.org/api";

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
                username: username,
                role: 'admin',
              },
              token: 'temporary-token-12345',
            });
          } else {
            reject(new Error('Invalid username or password'));
          }
        }, 1000);
      });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return {
        user: data.data ? data.data.user : data.user,
        token: data.data ? data.data.token : data.token
      };
    } catch (error) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  forgotPassword: async (email) => {
    if (USE_TEMP_LOGIN) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === 'admin@school.com') { 
            resolve({
              message: 'Password reset link sent to your email',
            });
          } else {
            reject(new Error('Email not found in our system'));
          }
        }, 1000);
      });
    }

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