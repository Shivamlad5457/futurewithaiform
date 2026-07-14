import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowDown } from 'lucide-react';
import CollaborationForm from './CollaborationForm';

interface HomeProps {
  onNavigate: (page: string) => void;
  isDark: boolean;
}

export default function Home({ onNavigate, isDark }: HomeProps) {
  const handleScrollToForm = () => {
    const el = document.getElementById('collaboration-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-between">
      {/* Glow Ambient Spots */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 dark:bg-indigo-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[45%] h-[45%] rounded-full bg-purple-600/10 dark:bg-purple-500/10 blur-[130px] pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 flex-grow flex flex-col justify-center items-center text-center relative z-10">
        
        {/* Sparkles pill tag */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide border bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>futurewithai.official Collaboration Form</span>
        </motion.div>

        {/* Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight leading-none bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-900 dark:from-white dark:via-indigo-100 dark:to-purple-200 bg-clip-text text-transparent max-w-4xl"
        >
          Let's Create Amazing <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Content Together</span>
        </motion.h1>

        {/* Short description */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mt-6 font-light leading-relaxed"
        >
          If you have an idea for collaboration, promotion, brand partnership, or AI video creation, submit your idea below.
        </motion.p>

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10"
        >
          <button 
            id="cta-collaborate-now"
            onClick={handleScrollToForm}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4.5 rounded-2xl text-white font-semibold text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/35 active:scale-[0.98] transition-all cursor-pointer group"
          >
            Submit Your Idea
            <ArrowDown className="w-5 h-5 transition-transform group-hover:translate-y-1" />
          </button>
        </motion.div>

        {/* Soft floating scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="mt-16 flex flex-col items-center gap-1.5 cursor-pointer text-slate-400"
          onClick={handleScrollToForm}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest">Scroll Down</span>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* Embed the form right here inside this section */}
      <section id="collaboration-form-section" className="relative z-10 py-12 border-t border-slate-200/50 dark:border-slate-900/50">
        <CollaborationForm onNavigate={onNavigate} isDark={isDark} />
      </section>
    </div>
  );
}
