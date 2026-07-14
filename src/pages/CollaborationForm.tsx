import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../api';
import { 
  User, 
  Phone, 
  Instagram, 
  Sparkles, 
  FileText, 
  Calendar, 
  Clock, 
  ChevronRight, 
  AlertCircle, 
  Check, 
  ArrowLeft 
} from 'lucide-react';

interface CollaborationFormProps {
  onNavigate: (page: string) => void;
  isDark: boolean;
}

interface FormErrors {
  name?: string;
  mobile?: string;
  instagram?: string;
  request_type?: string;
  idea_title?: string;
  idea_description?: string;
  preferred_date?: string;
  preferred_time?: string;
  video_duration?: string;
}

export default function CollaborationForm({ onNavigate, isDark }: CollaborationFormProps) {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    instagram: '',
    request_type: 'Collaboration',
    idea_title: '',
    idea_description: '',
    preferred_date: '',
    preferred_time: '',
    video_duration: '',
    additional_note: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle standard changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error as user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Form Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required.';
    }

    // Phone number must contain only digits
    const trimmedMobile = formData.mobile.trim();
    if (!trimmedMobile) {
      newErrors.mobile = 'Mobile Number is required.';
    } else {
      // Prompt: "Phone number must contain only digits."
      // Let's enforce strictly digits
      const isOnlyDigits = /^\d+$/.test(trimmedMobile);
      if (!isOnlyDigits) {
        newErrors.mobile = 'Phone number must contain only digits (e.g. 919999999999).';
      }
    }

    if (!formData.instagram.trim()) {
      newErrors.instagram = 'Instagram username cannot be empty.';
    }

    if (!formData.idea_title.trim()) {
      newErrors.idea_title = 'Idea title cannot be empty.';
    }

    if (!formData.idea_description.trim()) {
      newErrors.idea_description = 'Description cannot be empty.';
    }

    if (formData.video_duration.trim() !== '') {
      const parsedDur = Number(formData.video_duration.trim());
      if (isNaN(parsedDur) || parsedDur < 0) {
        newErrors.video_duration = 'Video duration must be a positive number.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        instagram: formData.instagram.trim().startsWith('@') ? formData.instagram.trim() : `@${formData.instagram.trim()}`,
        request_type: formData.request_type,
        idea_title: formData.idea_title.trim(),
        idea_description: formData.idea_description.trim(),
        preferred_date: formData.preferred_date ? formData.preferred_date : undefined,
        preferred_time: formData.preferred_time ? formData.preferred_time : undefined,
        video_duration: formData.video_duration.trim() ? parseInt(formData.video_duration.trim(), 10) : undefined,
        additional_note: formData.additional_note.trim() || undefined
      };

      const res = await api.submitRequest(payload);
      if (res.success) {
        setSubmitSuccess(true);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to submit collaboration request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      {/* Dynamic Background */}
      <div className="absolute top-[10%] right-[5%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-2xl mx-auto w-full relative">
        {/* Back Button */}
        <button
          id="btn-back-home"
          onClick={() => onNavigate('home')}
          className={`mb-6 inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all cursor-pointer ${
            isDark 
              ? 'border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-gray-300' 
              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <AnimatePresence mode="wait">
          {!submitSuccess ? (
            <motion.div
              key="collab-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className={`rounded-3xl border overflow-hidden p-6 sm:p-10 ${
                isDark ? 'glass-dark border-slate-800 bg-slate-900/40' : 'glass-light border-slate-200/80 bg-white shadow-xl'
              }`}
            >
              {/* Header */}
              <div className="border-b border-gray-100 dark:border-slate-900 pb-6 mb-8 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-500 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Personal Collaboration Form</span>
                </div>
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Submit Collaboration Idea</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please provide the details about your campaign, pitch, or concept below.</p>
              </div>

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter Full Name"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                        isDark 
                          ? 'border-slate-800 bg-slate-950/60 text-white focus:border-indigo-500 focus:bg-slate-950' 
                          : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-500 focus:bg-white'
                      } ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Mobile Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="Enter 10 digit number"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                          isDark 
                            ? 'border-slate-800 bg-slate-950/60 text-white focus:border-indigo-500 focus:bg-slate-950' 
                            : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-500 focus:bg-white'
                        } ${errors.mobile ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                    </div>
                    {errors.mobile && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.mobile}</p>}
                  </div>

                  {/* Instagram Username */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Instagram Username *</label>
                    <div className="relative">
                      <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                      <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        placeholder="e.g. @futurewithai.official"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                          isDark 
                            ? 'border-slate-800 bg-slate-950/60 text-white focus:border-indigo-500 focus:bg-slate-950' 
                            : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-500 focus:bg-white'
                        } ${errors.instagram ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                    </div>
                    {errors.instagram && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.instagram}</p>}
                  </div>
                </div>

                {/* Type of Request Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Type of Request *</label>
                  <select
                    name="request_type"
                    value={formData.request_type}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-3 rounded-xl border text-sm outline-none cursor-pointer transition-all ${
                      isDark 
                        ? 'border-slate-800 bg-slate-950 text-white focus:border-indigo-500' 
                        : 'border-gray-200 bg-white text-gray-900 focus:border-indigo-500'
                    }`}
                  >
                    <option value="Collaboration">Collaboration</option>
                    <option value="Promotion">Promotion</option>
                    <option value="Brand Partnership">Brand Partnership</option>
                    <option value="AI Video Idea">AI Video Creation</option>
                    <option value="Content Suggestion">Content Suggestion</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Title of Your Idea */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Title of Your Idea *</label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <input
                      type="text"
                      name="idea_title"
                      value={formData.idea_title}
                      onChange={handleChange}
                      placeholder="e.g. Village Life in Summer"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                        isDark 
                          ? 'border-slate-800 bg-slate-950/60 text-white focus:border-indigo-500 focus:bg-slate-950' 
                          : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-500 focus:bg-white'
                      } ${errors.idea_title ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.idea_title && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.idea_title}</p>}
                </div>

                {/* Describe Your Idea */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Describe Your Idea *</label>
                  <textarea
                    name="idea_description"
                    rows={4}
                    value={formData.idea_description}
                    onChange={handleChange}
                    placeholder="Provide a detailed description of your idea, visual instructions, sounds, or objectives..."
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-y ${
                      isDark 
                        ? 'border-slate-800 bg-slate-950/60 text-white focus:border-indigo-500 focus:bg-slate-950' 
                        : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-500 focus:bg-white'
                    } ${errors.idea_description ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.idea_description && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.idea_description}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Preferred Upload Date */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Preferred Video Upload Date (Optional)</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                      <input
                        type="date"
                        name="preferred_date"
                        value={formData.preferred_date}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                          isDark 
                            ? 'border-slate-800 bg-slate-950/60 text-white focus:border-indigo-500 focus:bg-slate-950' 
                            : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-500 focus:bg-white'
                        } ${errors.preferred_date ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                    </div>
                    {errors.preferred_date && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.preferred_date}</p>}
                  </div>

                  {/* Preferred Upload Time */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Preferred Upload Time (Optional)</label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                      <input
                        type="time"
                        name="preferred_time"
                        value={formData.preferred_time}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                          isDark 
                            ? 'border-slate-800 bg-slate-950/60 text-white focus:border-indigo-500 focus:bg-slate-950' 
                            : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-500 focus:bg-white'
                        } ${errors.preferred_time ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                    </div>
                    {errors.preferred_time && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.preferred_time}</p>}
                  </div>
                </div>

                {/* Video Duration (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Duration of Video in Seconds (Optional)</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <input
                      type="number"
                      name="video_duration"
                      value={formData.video_duration}
                      onChange={handleChange}
                      placeholder="e.g. 60"
                      min="0"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                        isDark 
                          ? 'border-slate-800 bg-slate-950/60 text-white focus:border-indigo-500 focus:bg-slate-950' 
                          : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-500 focus:bg-white'
                      } ${errors.video_duration ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.video_duration && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.video_duration}</p>}
                </div>

                {/* Anything Else? Optional */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Anything Else? (Optional)</label>
                  <textarea
                    name="additional_note"
                    rows={3}
                    value={formData.additional_note}
                    onChange={handleChange}
                    placeholder="Enter any secondary information, links, background resources, etc..."
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-y ${
                      isDark 
                        ? 'border-slate-800 bg-slate-950/60 text-white focus:border-indigo-500 focus:bg-slate-950' 
                        : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-500 focus:bg-white'
                    }`}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-gray-100 dark:border-slate-900">
                  <button
                    id="btn-submit-request"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/25 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </div>
                    ) : (
                      <>
                        Submit Idea
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          ) : (
            // Success Component
            <motion.div
              key="submit-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`rounded-3xl border overflow-hidden p-8 sm:p-12 text-center flex flex-col items-center justify-center ${
                isDark ? 'glass-dark border-slate-800 bg-slate-900/40' : 'glass-light border-slate-200 bg-white shadow-2xl'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 flex items-center justify-center mb-6 animate-bounce">
                <Check className="w-8 h-8 stroke-[3px]" />
              </div>

              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-3 font-semibold">Thank You!</h2>
              
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold mb-6 text-sm">
                Thank you! Your idea has been submitted successfully. I will review it soon.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <button
                  id="btn-return-home"
                  onClick={() => onNavigate('home')}
                  className="px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md transition-all cursor-pointer text-xs"
                >
                  Return to Home
                </button>
                
                <button
                  id="btn-sub-another"
                  onClick={() => {
                    setFormData({
                      name: '',
                      mobile: '',
                      instagram: '',
                      request_type: 'Collaboration',
                      idea_title: '',
                      idea_description: '',
                      preferred_date: '',
                      preferred_time: '',
                      video_duration: '',
                      additional_note: ''
                    });
                    setSubmitSuccess(false);
                  }}
                  className={`px-6 py-3 rounded-xl font-medium border transition-all cursor-pointer text-xs ${
                    isDark
                      ? 'border-slate-800 text-gray-300 hover:bg-slate-900'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Submit Another Request
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
