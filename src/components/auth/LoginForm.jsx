import React, { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';

const LoginForm = ({ onForgotPassword }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setApiError('');

    try {
      const response = await apiService.login(formData.username, formData.password);
      login(response.user, response.token);
    } catch (error) {
      setApiError(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {apiError && (
        <Alert type="error" message={apiError} onClose={() => setApiError('')} />
      )}
      
      <div className="space-y-2">
        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          placeholder="e.g. admin_user"
          icon={User}
        />

        <div className="relative">
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            icon={Lock}
          />
          <div className="absolute top-0 right-0">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs font-semibold text-[#800000] hover:text-[#660000] hover:underline"
              tabIndex="-1" // Skip tab index so it doesn't break flow
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button 
          type="submit" 
          loading={loading}
          variant="maroon"
          className="group"
        >
          <span>Sign In</span>
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;