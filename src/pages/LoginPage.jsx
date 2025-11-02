import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const LoginPage = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  React.useEffect(() => {
    document.title = showForgotPassword
      ? 'Reset Password - Phoenix Management System'
      : 'Login - Phoenix Management System';
  }, [showForgotPassword]);

  React.useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && showForgotPassword) setShowForgotPassword(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showForgotPassword]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e6e6] to-[#e6cccc] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-[#800000] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#800000]">
            Phoenix Management System
          </h1>
          <p className="text-gray-600 mt-2">
            {showForgotPassword ? 'Reset Your Password' : 'Login Here'}
          </p>
        </div>

        {showForgotPassword ? (
          <ForgotPasswordForm 
            onBackToLogin={() => setShowForgotPassword(false)} 
          />  
        ) : (
          <LoginForm 
            onForgotPassword={() => setShowForgotPassword(true)} 
          />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
