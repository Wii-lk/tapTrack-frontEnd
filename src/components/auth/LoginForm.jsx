import React, { useState } from 'react';
import { User, Lock } from 'lucide-react'; // Changed from Mail to User
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';

const LoginForm = ({ onForgotPassword }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '', // Changed from 'email'
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Updated validation for 'username'
    if (!formData.username) {
      newErrors.username = 'Username is required';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
    
    // Clear API error
    if (apiError) {
      setApiError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      // Pass 'formData.username' to the login service
      const response = await apiService.login(formData.username, formData.password);
      // Expected response: { user: {...}, token: '...' }
      login(response.user, response.token);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {apiError && (
        <Alert 
          type="error" 
          message={apiError} 
          onClose={() => setApiError('')} 
        />
      )}
      
      {/* Updated Input component for Username */}
      <Input
        label="Username"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        placeholder="Enter your username"
        icon={User} // Changed icon
      />

      

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        placeholder="Enter your password"
        icon={Lock}
      />

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Forgot Password?
        </button>
      </div>

      <Button 
        type="submit" 
        onClick={handleSubmit}
        loading={loading}
      >
        Sign In
      </Button>
    </div>
  );
};

export default LoginForm;