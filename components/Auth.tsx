import React, { useState } from 'react';
import { Button } from './Button';
import { authService } from '../services/authService';
import { User } from '../types';
import { AlertCircle, Mail, ArrowRight, ArrowLeft, KeyRound, Sun, Moon, Book } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, isDarkMode, toggleTheme }) => {
  // Screen states: 'login' | 'signup' | 'otp'
  const [view, setView] = useState<'login' | 'signup' | 'otp'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (view === 'login') {
        const user = await authService.login(email, password);
        onLogin(user);
      } else if (view === 'signup') {
        if (!name.trim()) throw new Error('Name is required');
        const { user, session } = await authService.signup(email, password, name);
        
        if (session) {
          onLogin(user);
        } else {
          setSuccessMessage("Account created! Please enter the code sent to your email.");
          setView('otp');
        }
      } else if (view === 'otp') {
        const user = await authService.verifyOtp(email, otp);
        onLogin(user);
      }
    } catch (err: any) {
      const msg = err.message || 'An error occurred';
      setError(msg);
      
      if (view === 'login' && (msg.includes('confirm your account') || msg.includes('Email not confirmed'))) {
         // We stay on login but show a link to go to OTP
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await authService.resendConfirmation(email);
      setSuccessMessage("Code resent! Please check your inbox.");
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setIsLoading(false);
    }
  };

  const isConfirmationError = error && (error.includes('Email not confirmed') || error.includes('check your email'));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute bottom-[0%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="absolute top-4 right-4 z-10">
         {toggleTheme && (
            <button 
                onClick={toggleTheme}
                className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white/50 dark:bg-slate-900/50 rounded-full shadow-sm backdrop-blur-sm transition-all"
            >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
         )}
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-6">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)] ring-1 ring-indigo-500/20">
            <Book className="w-6 h-6 fill-current" />
          </div>
          <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">My Notes</span>
        </div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {view === 'login' && 'Sign in to your account'}
          {view === 'signup' && 'Create your account'}
          {view === 'otp' && 'Verify your email'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          {view === 'otp' 
            ? `We sent a code to ${email}`
            : 'Simple, clean note taking for everyone'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-900/80 py-8 px-4 shadow-2xl dark:shadow-[0_0_40px_rgba(0,0,0,0.3)] sm:rounded-2xl sm:px-10 border border-slate-100 dark:border-slate-800 backdrop-blur-sm transition-all">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg flex flex-col space-y-2 text-sm text-red-600 dark:text-red-400">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
                
                {isConfirmationError && view !== 'otp' && (
                  <div className="pl-7">
                    <button
                      type="button"
                      onClick={() => setView('otp')}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 underline focus:outline-none"
                    >
                      Enter confirmation code
                    </button>
                  </div>
                )}
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg flex items-start space-x-2 text-sm text-green-700 dark:text-green-400">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {view === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm px-3 py-2 border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {view !== 'otp' && (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm px-3 py-2 border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete={view === 'login' ? "current-password" : "new-password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm px-3 py-2 border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </>
            )}

            {view === 'otp' && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Confirmation Code
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <KeyRound className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 pl-10 focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm px-3 py-2 border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="123456"
                  />
                </div>
                <div className="mt-2 flex justify-between">
                   <button 
                      type="button" 
                      onClick={() => setView('login')}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                   >
                     Change email
                   </button>
                   <button 
                      type="button" 
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
                   >
                     Resend code
                   </button>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full flex justify-center py-2.5 group shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all"
                isLoading={isLoading}
              >
                {view === 'login' && 'Sign in'}
                {view === 'signup' && 'Create account'}
                {view === 'otp' && 'Verify Email'}
                {!isLoading && view === 'login' && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
                   {view === 'otp' ? 'Having trouble?' : (view === 'login' ? 'New to My Notes?' : 'Already have an account?')}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              {view === 'otp' ? (
                 <button
                  onClick={() => {
                    setView('login');
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="flex w-full items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign in
                </button>
              ) : (
                <button
                  onClick={() => {
                    setView(view === 'login' ? 'signup' : 'login');
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="flex w-full items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                  {view === 'login' ? 'Create an account' : 'Sign in instead'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};