import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const LoginPage = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    document.title = showForgotPassword
      ? 'Reset Password - Phoenix Management System'
      : 'Login - Phoenix Management System';
  }, [showForgotPassword]);

  // Handle transitions smoothly
  const toggleView = (state) => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowForgotPassword(state);
      setIsAnimating(false);
    }, 300); // Wait for fade out
  };

  return (
    <div className="min-h-screen flex w-full bg-white overflow-hidden">
      
      {/* LEFT SIDE: Brand & Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#800000] items-center justify-center overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#600000] to-[#990000] opacity-100"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-black opacity-20 rounded-full blur-3xl"></div>
        
        {/* Content */}
        <div className="relative z-10 p-12 text-white max-w-lg">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-xl">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6 tracking-tight leading-tight">
            Manage your assets with confidence.
          </h1>
          <p className="text-lg text-red-100/80 leading-relaxed">
            Welcome to the Phoenix Management System. Secure, efficient, and reliable management for the modern enterprise.
          </p>
          
          {/* Footer Quote/Status */}
          {/* <div className="mt-12 pt-8 border-t border-white/10 flex items-center gap-4">
             <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="w-8 h-8 rounded-full bg-white/20 border border-[#800000]"></div>
               ))}
             </div>
             <p className="text-sm text-red-200">Trusted by top management teams.</p>
          </div> */}
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-gray-50/50">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Logo (Visible only on mobile) */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-[#800000] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Phoenix System</h2>
          </div>

          {/* Header Text */}
          <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {showForgotPassword ? 'Reset Password' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-gray-500">
              {showForgotPassword 
                ? 'Enter your email to receive recovery instructions.' 
                : 'Please enter your details to sign in.'}
            </p>
          </div>

          {/* Form Container with transition */}
          <div className={`transition-all duration-300 transform ${isAnimating ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
            {showForgotPassword ? (
              <ForgotPasswordForm 
                onBackToLogin={() => toggleView(false)} 
              />  
            ) : (
              <LoginForm 
                onForgotPassword={() => toggleView(true)} 
              />
            )}
          </div>

          {/* Copyright/Footer */}
          <p className="text-center text-xs text-gray-400 mt-8">
            &copy; {new Date().getFullYear()} Phoenix Management. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;