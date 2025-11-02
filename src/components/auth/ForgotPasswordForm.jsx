import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import apiService from '../../services/apiService';

const ForgotPasswordForm = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    setError('');
    return true;
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      await apiService.forgotPassword(email);
      setSuccess(true);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4">
        <Alert 
          type="success" 
          message="Password reset link has been sent to your email. Please check your inbox."
        />
        <Button onClick={onBackToLogin} variant="secondary">
          <ArrowLeft className="inline h-4 w-4 mr-2" />
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {apiError && (
        <Alert 
          type="error" 
          message={apiError} 
          onClose={() => setApiError('')} 
        />
      )}
      
      <Alert 
        type="info" 
        message="Enter your email address and we'll send you a link to reset your password."
      />

      <Input
        label="Email Address"
        type="email"
        name="email"
        value={email}
        onChange={handleChange}
        error={error}
        placeholder="admin@school.com"
        icon={Mail}
      />

      <Button 
        type="submit"
        onClick={handleSubmit}
        loading={loading}
      >
        Send Reset Link
      </Button>

      <Button onClick={onBackToLogin} variant="secondary">
        <ArrowLeft className="inline h-4 w-4 mr-2" />
        Back to Login
      </Button>
    </div>
  );
};

export default ForgotPasswordForm;