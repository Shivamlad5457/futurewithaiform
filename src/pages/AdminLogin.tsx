import React, { useState } from 'react';
import { motion } from 'motion/react';
import { api } from '../api';
import { Shield, User, Lock, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
  onNavigate: (page: string) => void;
  isDark: boolean;
}

export default function AdminLogin({ onLoginSuccess, onNavigate, isDark }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.login({ username, password });
      if (res.success && res.token) {
        localStorage.setItem('admin_token', res.token);
        onLoginSuccess(res.token);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background blobs */}
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full mx-auto relative">
        {/* Back Button */}
        <button
          id="btn-back-from-login"
          onClick={() => onNavigate('home')}
          className={`mb-6 inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all cursor-pointer ${
            isDark 
              ? 'border-gray-800 bg-gray-900/40 hover:bg-gray-800 text-gray-300' 
              : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-sm'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-3xl border p-8 sm:p-10 ${
            isDark ? 'glass-dark border-slate-800' : 'glass-light border-slate-200 shadow-2xl'
          }`}
        >
          {/* Lock Icon */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 stroke-[2px]" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Admin Portal</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Authenticate to access collaboration insights.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3.5 rounded-xl border border-red-500/35 bg-red-500/10 text-red-500 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                    isDark 
                      ? 'border-slate-800 bg-slate-900/60 text-white focus:border-indigo-500 focus:bg-slate-900' 
                      : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-500 focus:bg-white'
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                    isDark 
                      ? 'border-slate-800 bg-slate-900/60 text-white focus:border-indigo-500 focus:bg-slate-900' 
                      : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-500 focus:bg-white'
                  }`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="btn-admin-login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/25 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer mt-2"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Secured by Environment Variables - No helper hint shown */}
        </motion.div>
      </div>
    </div>
  );
}
