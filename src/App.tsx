import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Home from './pages/Home';
import CollaborationForm from './pages/CollaborationForm';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { api } from './api';
import { 
  Instagram, 
  Youtube, 
  Mail, 
  MessageSquare, 
  Sun, 
  Moon, 
  Lock, 
  Sparkles,
  Award,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  // Theme State
  const [isDark, setIsDark] = useState<boolean>(true); // Default to a gorgeous Dark theme for creative creator-vibes

  // Routing State: 'home', 'form', 'admin-login', 'admin-dashboard'
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [verifyingToken, setVerifyingToken] = useState<boolean>(false);

  // Parse hash and navigate
  const parseHash = async () => {
    const hash = window.location.hash;
    const token = localStorage.getItem('admin_token');

    if (hash === '#form') {
      setCurrentRoute('form');
    } else if (hash === '#admin') {
      if (token) {
        setVerifyingToken(true);
        try {
          const res = await api.verifyToken();
          if (res.success) {
            setIsAdminAuthenticated(true);
            setCurrentRoute('admin-dashboard');
            window.location.hash = '#admin-dashboard';
          } else {
            setCurrentRoute('admin-login');
            window.location.hash = '#admin';
          }
        } catch {
          setCurrentRoute('admin-login');
          window.location.hash = '#admin';
        } finally {
          setVerifyingToken(false);
        }
      } else {
        setCurrentRoute('admin-login');
      }
    } else if (hash === '#admin-dashboard') {
      if (token) {
        setIsAdminAuthenticated(true);
        setCurrentRoute('admin-dashboard');
      } else {
        setCurrentRoute('admin-login');
        window.location.hash = '#admin';
      }
    } else {
      setCurrentRoute('home');
      window.location.hash = '#home';
    }
  };

  // Setup routing hash listeners and theme configuration
  useEffect(() => {
    // Initial parse
    parseHash();

    // Listen for hash changes
    const handleHashChange = () => {
      parseHash();
    };
    window.addEventListener('hashchange', handleHashChange);

    // Initial theme check
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Set Navigation
  const handleNavigate = (route: string) => {
    if (route === 'home') window.location.hash = '#home';
    else if (route === 'form') window.location.hash = '#form';
    else if (route === 'admin-login') window.location.hash = '#admin';
    else if (route === 'admin-dashboard') window.location.hash = '#admin-dashboard';
  };

  // Toggle theme
  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Handle Login Success
  const handleLoginSuccess = (token: string) => {
    setIsAdminAuthenticated(true);
    setCurrentRoute('admin-dashboard');
    window.location.hash = '#admin-dashboard';
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAdminAuthenticated(false);
    setCurrentRoute('home');
    window.location.hash = '#home';
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-slate-50/50 text-slate-800'
    }`}>
      
      {/* 1. TOP HEADER / NAVIGATION */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-all ${
        isDark 
          ? 'bg-slate-950/75 border-slate-900' 
          : 'bg-white/75 border-slate-200/80 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <div 
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-display font-semibold shadow-md shadow-indigo-500/10 group-hover:scale-[1.03] transition-transform">
              F
            </div>
            <span className="font-display font-bold tracking-tight text-lg bg-gradient-to-r from-gray-900 to-indigo-950 dark:from-white dark:to-indigo-100 bg-clip-text text-transparent">
              futurewithai.official
            </span>
          </div>

          {/* Quick Menu */}
          <div className="flex items-center gap-3">
            {/* Direct Admin Access Icon */}
            {currentRoute !== 'admin-dashboard' && currentRoute !== 'admin-login' && (
              <button
                id="header-admin-link"
                onClick={() => handleNavigate('admin-login')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isDark 
                    ? 'border-slate-800 text-gray-400 hover:bg-slate-900/50 hover:text-white' 
                    : 'border-slate-200 text-gray-600 hover:bg-slate-50'
                }`}
                title="Admin Dashboard"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            {/* Light / Dark Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark 
                  ? 'border-slate-800 text-gray-400 hover:bg-slate-900/50 hover:text-white' 
                  : 'border-slate-200 text-gray-600 hover:bg-slate-50'
              }`}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            {/* Quick Action */}
            {currentRoute === 'home' && (
              <button
                id="header-collab-btn"
                onClick={() => handleNavigate('form')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/15 cursor-pointer transition-all"
              >
                Collaborate Now
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. DYNAMIC SCREEN CONTAINER */}
      <main className="flex-grow">
        {verifyingToken ? (
          <div className="min-h-[75vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-light">Authenticating admin portal...</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {currentRoute === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Home onNavigate={handleNavigate} isDark={isDark} />
              </motion.div>
            )}

            {currentRoute === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CollaborationForm onNavigate={handleNavigate} isDark={isDark} />
              </motion.div>
            )}

            {currentRoute === 'admin-login' && (
              <motion.div
                key="admin-login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AdminLogin 
                  onLoginSuccess={handleLoginSuccess} 
                  onNavigate={handleNavigate} 
                  isDark={isDark} 
                />
              </motion.div>
            )}

            {currentRoute === 'admin-dashboard' && (
              <motion.div
                key="admin-dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AdminDashboard onLogout={handleLogout} isDark={isDark} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* 3. FLOATING SOCIAL BUTTONS */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3.5 z-40">
        {/* Floating Instagram Profile Button */}
        <a
          id="floating-instagram-btn"
          href="https://www.instagram.com/direct/t/18039023441546802/?hl=en" // Customizable placeholder profile
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 hover:opacity-95 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all group relative"
          title="Visit Instagram"
        >
          <Instagram className="w-5.5 h-5.5" />
          <span className="absolute right-14 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-950 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap border dark:border-slate-100 border-slate-800">
            Visit Instagram
          </span>
        </a>
      </div>

      {/* 4. FOOTER */}
      <footer className={`border-t py-12 px-4 transition-colors ${
        isDark 
          ? 'border-slate-900 bg-slate-950/60 text-slate-400' 
          : 'border-slate-200 bg-white text-slate-500 shadow-inner'
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Brand/Pitch */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                F
              </div>
              <span className="font-display font-bold text-gray-900 dark:text-white">futurewithai.official</span>
            </div>
            <p className="text-xs max-w-sm mx-auto md:mx-0 font-light leading-relaxed">
              Tailoring custom, cinematic, and AI-assisted short form media assets to capture and convert audiences across social pipelines.
            </p>
          </div>

          {/* Social connections */}
          <div className="space-y-3 flex flex-col items-center">
            <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Social Channels</span>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/futurewithai.official/?hl=en" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-xl border border-gray-200 dark:border-slate-800 flex items-center justify-center hover:text-indigo-500 hover:border-indigo-500/50 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.youtube.com/@brightverse_ai" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-xl border border-gray-200 dark:border-slate-800 flex items-center justify-center hover:text-red-500 hover:border-red-500/50 transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="mailto:futurewithai.official5457.com" 
                className="w-9 h-9 rounded-xl border border-gray-200 dark:border-slate-800 flex items-center justify-center hover:text-indigo-500 hover:border-indigo-500/50 transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Copyright/Credits */}
          <div className="flex flex-col justify-center md:items-end text-xs space-y-1.5 font-light">
            <p>&copy; {new Date().getFullYear()} futurewithai.official. All rights reserved.</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              Handcrafted for premium Brand Collaborations & AI Video Assets
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
