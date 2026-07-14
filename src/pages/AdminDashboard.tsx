import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../api';
import { CollaborationRequest, DashboardStats } from '../types';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  Eye, 
  Trash2, 
  Search, 
  Filter, 
  LogOut, 
  Calendar, 
  Instagram, 
  Phone, 
  FileText, 
  AlertCircle, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown,
  BookOpen
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  isDark: boolean;
}

export default function AdminDashboard({ onLogout, isDark }: AdminDashboardProps) {
  // Requests & Stats State
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ total: 0, pending: 0, reviewed: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  // Selected Request (Detail drawer)
  const [selectedRequest, setSelectedRequest] = useState<CollaborationRequest | null>(null);

  // Pagination State (client-side for bulletproof compatibility)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const statsRes = await api.getStats();
      if (statsRes.success) {
        setStats(statsRes.data);
      }

      // 2. Fetch Requests
      const requestsRes = await api.getRequests({
        search: search.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });

      if (requestsRes.success) {
        setRequests(requestsRes.data);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger reload on filter or search changes
  useEffect(() => {
    loadData();
    setCurrentPage(1); // Reset page on filters
  }, [search, statusFilter]);

  // Handle Action: Update Status
  const handleUpdateStatus = async (id: number, newStatus: 'reviewed' | 'completed') => {
    try {
      const res = await api.updateRequest(id, { status: newStatus });
      if (res.success) {
        // Update in-place local states to reflect changes instantly
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        if (selectedRequest && selectedRequest.id === id) {
          setSelectedRequest(prev => prev ? { ...prev, status: newStatus } : null);
        }
        // Reload stats
        const statsRes = await api.getStats();
        if (statsRes.success) {
          setStats(statsRes.data);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update request status');
    }
  };

  // Handle Action: Delete Request
  const handleDeleteRequest = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this collaboration request? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await api.deleteRequest(id);
      if (res.success) {
        setSelectedRequest(null);
        setRequests(prev => prev.filter(r => r.id !== id));
        loadData(); // fully reload counts and list
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete request');
    }
  };

  // client-side sorting (newest vs oldest)
  const sortedRequests = [...requests].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // client-side pagination
  const totalPages = Math.ceil(sortedRequests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRequests = sortedRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Background blobs */}
      <div className="absolute top-[5%] right-[5%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[5%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100 dark:border-slate-900 mb-8 z-10 relative">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-display font-black text-gray-900 dark:text-white">Admin Dashboard</h1>
            <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 uppercase tracking-widest animate-pulse">Console</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Review, filter, and manage partnership pitches submitted from your Instagram bio.</p>
        </div>

        <button
          id="btn-admin-logout"
          onClick={onLogout}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border cursor-pointer transition-all ${
            isDark 
              ? 'border-red-950/40 bg-red-950/10 hover:bg-red-950/30 text-red-400' 
              : 'border-red-100 bg-red-50 hover:bg-red-100 text-red-600'
          }`}
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 z-10 relative">
        
        {/* STATS PANEL */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'total', label: 'Total Requests', val: stats.total, color: 'indigo', icon: ClipboardList },
            { id: 'pending', label: 'Pending Pitch', val: stats.pending, color: 'amber', icon: Clock },
            { id: 'reviewed', label: 'Reviewed', val: stats.reviewed, color: 'blue', icon: Eye },
            { id: 'completed', label: 'Completed', val: stats.completed, color: 'emerald', icon: CheckCircle },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between ${
                  isDark ? 'glass-dark border-slate-800 bg-slate-900/30' : 'glass-light border-slate-200 bg-white shadow-xs'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{card.label}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    card.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-500' :
                    card.color === 'amber' ? 'bg-amber-500/10 text-amber-500' :
                    card.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  {loading ? (
                    <div className="h-8 w-16 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
                  ) : (
                    <span className="text-3xl font-display font-black text-gray-900 dark:text-white">{card.val}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* SEARCH AND FILTER CONTROLS */}
        <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-4 items-center justify-between ${
          isDark ? 'glass-dark border-slate-800 bg-slate-900/30' : 'glass-light border-slate-200 bg-white shadow-xs'
        }`}>
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Name or Instagram..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                isDark 
                  ? 'border-slate-800 bg-slate-950/60 text-white focus:border-indigo-500' 
                  : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-500 focus:bg-white'
              }`}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 w-full md:w-auto items-center justify-end">
            {/* Status Selector */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`py-1.5 px-3 rounded-lg border text-xs outline-none cursor-pointer ${
                  isDark ? 'border-slate-800 bg-slate-950 text-white' : 'border-gray-200 bg-white text-gray-700 shadow-xs'
                }`}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Date Sorter Toggle */}
            <button
              id="btn-toggle-sort"
              onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                isDark 
                  ? 'border-slate-800 bg-slate-950 hover:bg-slate-900 text-gray-300' 
                  : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600 shadow-xs'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Date: {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>

        {/* DATA TABLE CONTAINER */}
        <div className={`border rounded-2xl overflow-hidden ${
          isDark ? 'border-slate-800 bg-slate-900/10' : 'border-slate-200 bg-white shadow-xs'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${
                  isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-gray-50'
                }`}>
                  <th className="py-4 px-5">ID</th>
                  <th className="py-4 px-5">Name</th>
                  <th className="py-4 px-5">Mobile</th>
                  <th className="py-4 px-5">Instagram</th>
                  <th className="py-4 px-5">Request Type</th>
                  <th className="py-4 px-5">Idea Title</th>
                  <th className="py-4 px-5">Submission Date</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80">
                {loading ? (
                  // Skeleton state
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td colSpan={9} className="py-4 px-5">
                        <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-full" />
                      </td>
                    </tr>
                  ))
                ) : sortedRequests.length === 0 ? (
                  // Empty State
                  <tr>
                    <td colSpan={9} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-8 h-8 text-gray-400" />
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">No requests found</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">Pitches or ideas matching filters could not be found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Requests list
                  paginatedRequests.map((req) => (
                    <tr 
                      key={req.id}
                      onClick={() => setSelectedRequest(req)}
                      className={`text-xs cursor-pointer hover:bg-indigo-500/[0.02] transition-all ${
                        selectedRequest?.id === req.id 
                          ? 'bg-indigo-500/[0.04]' 
                          : ''
                      }`}
                    >
                      {/* ID */}
                      <td className="py-4 px-5 font-mono font-medium text-gray-500">#{req.id}</td>

                      {/* Name */}
                      <td className="py-4 px-5 font-semibold text-gray-900 dark:text-white">{req.name}</td>

                      {/* Mobile */}
                      <td className="py-4 px-5 text-gray-600 dark:text-gray-300 font-mono">{req.mobile}</td>

                      {/* Instagram */}
                      <td className="py-4 px-5">
                        <span className="text-indigo-500 hover:underline flex items-center gap-1">
                          <Instagram className="w-3 h-3" />
                          {req.instagram}
                        </span>
                      </td>

                      {/* Request Type */}
                      <td className="py-4 px-5 font-medium text-gray-700 dark:text-gray-300">{req.request_type}</td>

                      {/* Idea Title */}
                      <td className="py-4 px-5 font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[150px]">{req.idea_title}</td>

                      {/* Submission Date */}
                      <td className="py-4 px-5 text-gray-500 dark:text-gray-400">
                        {new Date(req.created_at).toLocaleDateString()}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full capitalize ${
                          req.status === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                          req.status === 'reviewed' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                          'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          {req.status}
                        </span>
                      </td>

                      {/* Action trigger */}
                      <td className="py-4 px-5 text-right text-indigo-500 hover:underline font-semibold">
                        View &rarr;
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION CONTROL */}
          {!loading && sortedRequests.length > ITEMS_PER_PAGE && (
            <div className={`p-4 border-t flex items-center justify-between gap-4 ${
              isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-gray-50'
            }`}>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                <span className="font-semibold">{Math.min(sortedRequests.length, startIndex + ITEMS_PER_PAGE)}</span> of{' '}
                <span className="font-semibold">{sortedRequests.length}</span> entries
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark 
                      ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-gray-400' 
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600 shadow-sm'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark 
                      ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-gray-400' 
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600 shadow-sm'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* REQUEST DETAILS SLIDE-OUT DRAWER */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
            />

            {/* Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className={`w-full max-w-lg h-screen relative flex flex-col justify-between border-l shadow-2xl overflow-y-auto ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              {/* Header */}
              <div className={`p-6 border-b flex items-center justify-between gap-4 sticky top-0 z-10 ${
                isDark ? 'bg-slate-950/90 backdrop-blur border-slate-800' : 'bg-white/95 backdrop-blur border-gray-100'
              }`}>
                <div>
                  <h3 className="text-base font-bold">Collaboration Dossier</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">ID: #{selectedRequest.id} &bull; Received {new Date(selectedRequest.created_at).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    isDark ? 'border-slate-800 hover:bg-slate-900 text-white' : 'border-gray-200 hover:bg-gray-50 text-slate-700'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 flex-grow space-y-5">
                
                {/* 1. Submitter info */}
                <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
                  isDark ? 'border-slate-800 bg-slate-900/40' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                      {selectedRequest.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs">{selectedRequest.name}</h4>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">Submitter Profile</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs text-gray-600 dark:text-gray-300 border-t border-dashed border-gray-200 dark:border-slate-800 pt-2">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-3.5 h-3.5 text-indigo-500" />
                      <a 
                        href={`https://instagram.com/${selectedRequest.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-500 hover:underline"
                      >
                        {selectedRequest.instagram}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <a href={`tel:${selectedRequest.mobile}`} className="hover:text-indigo-500">
                        {selectedRequest.mobile}
                      </a>
                    </div>
                  </div>
                </div>

                {/* 2. Details */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-100 dark:border-slate-800 pb-1">Pitch Parameters</span>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 font-light">Request Type</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{selectedRequest.request_type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 font-light">Status</p>
                      <span className={`inline-block px-2 py-0.5 rounded-full capitalize font-bold text-[9px] mt-0.5 ${
                        selectedRequest.status === 'completed' ? 'bg-green-500/15 text-green-500 border border-green-500/20' :
                        selectedRequest.status === 'reviewed' ? 'bg-blue-500/15 text-blue-500 border border-blue-500/20' :
                        'bg-amber-500/15 text-amber-500 border border-amber-500/20'
                      }`}>
                        {selectedRequest.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 font-light">Upload Date</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{selectedRequest.preferred_date || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 font-light">Upload Time</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{selectedRequest.preferred_time || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 font-light">Video Duration</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{selectedRequest.video_duration ? `${selectedRequest.video_duration} seconds` : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Idea Title & Description */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-100 dark:border-slate-800 pb-1">Idea Title</span>
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-2">{selectedRequest.idea_title}</p>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-100 dark:border-slate-800 pb-1">Describe Your Idea</span>
                    <p className={`p-3 rounded-lg text-xs mt-2 italic leading-relaxed border ${
                      isDark ? 'bg-slate-900 border-slate-800 text-gray-300' : 'bg-gray-100/50 border-gray-200 text-gray-700'
                    }`}>{selectedRequest.idea_description}</p>
                  </div>
                </div>

                {/* 4. Notes ("Anything Else?") */}
                {selectedRequest.additional_note && (
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-100 dark:border-slate-800 pb-1">Anything Else? Note</span>
                    <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 mt-2">{selectedRequest.additional_note}</p>
                  </div>
                )}

              </div>

              {/* ACTION FOOTER */}
              <div className={`p-6 border-t flex gap-3 justify-between items-center sticky bottom-0 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-100'
              }`}>
                {/* Delete trigger */}
                <button
                  id="btn-delete-request"
                  onClick={() => handleDeleteRequest(selectedRequest.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isDark 
                      ? 'border-red-900/30 bg-red-950/10 hover:bg-red-950/45 text-red-400' 
                      : 'border-red-100 bg-red-50 hover:bg-red-100 text-red-600'
                  }`}
                  title="Delete Request permanently"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Status transitions */}
                <div className="flex gap-2">
                  {selectedRequest.status !== 'reviewed' && (
                    <button
                      id="btn-status-reviewed"
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'reviewed')}
                      className="px-4 py-2.5 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all cursor-pointer"
                    >
                      Mark as Reviewed
                    </button>
                  )}

                  {selectedRequest.status !== 'completed' && (
                    <button
                      id="btn-status-completed"
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'completed')}
                      className="px-4 py-2.5 text-xs font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all cursor-pointer"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
