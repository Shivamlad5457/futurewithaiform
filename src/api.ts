import { CollaborationRequest, DashboardStats } from './types';

// Simple relative API client
const API_BASE = '/api';

function getHeaders() {
  const token = localStorage.getItem('admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Public Request Submission
  async submitRequest(data: {
    name: string;
    mobile: string;
    instagram: string;
    request_type: string;
    idea_title: string;
    idea_description: string;
    preferred_date: string;
    preferred_time: string;
    additional_note?: string;
  }): Promise<{ success: boolean; message: string; requestId: number }> {
    const response = await fetch(`${API_BASE}/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    if (!response.ok) throw new Error(res.error || 'Failed to submit request');
    return res;
  },

  // Admin Log In
  async login(credentials: any): Promise<{ success: boolean; token: string; admin: any }> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const res = await response.json();
    if (!response.ok) throw new Error(res.error || 'Invalid credentials');
    return res;
  },

  // Token Verification
  async verifyToken(): Promise<{ success: boolean; admin: any }> {
    const response = await fetch(`${API_BASE}/auth/verify`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const res = await response.json();
    if (!response.ok) throw new Error(res.error || 'Token expired');
    return res;
  },

  // Admin: Retrieve all requests
  async getRequests(params?: {
    search?: string;
    status?: string;
  }): Promise<{
    success: boolean;
    data: CollaborationRequest[];
  }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);

    const response = await fetch(`${API_BASE}/admin/requests?${query.toString()}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const res = await response.json();
    if (!response.ok) throw new Error(res.error || 'Failed to load requests');
    return res;
  },

  // Admin: Retrieve single request
  async getRequestDetails(id: number): Promise<{ success: boolean; data: CollaborationRequest }> {
    const response = await fetch(`${API_BASE}/admin/request/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const res = await response.json();
    if (!response.ok) throw new Error(res.error || 'Failed to load details');
    return res;
  },

  // Admin: Update status or additional_note via PATCH
  async updateRequest(id: number, updateBody: { status?: 'pending' | 'reviewed' | 'completed'; additional_note?: string }): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/admin/request/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updateBody),
    });
    const res = await response.json();
    if (!response.ok) throw new Error(res.error || 'Failed to update request');
    return res;
  },

  // Admin: Delete request
  async deleteRequest(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/admin/request/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const res = await response.json();
    if (!response.ok) throw new Error(res.error || 'Failed to delete request');
    return res;
  },

  // Admin: Get Dashboard Stats
  async getStats(): Promise<{ success: boolean; data: DashboardStats }> {
    const response = await fetch(`${API_BASE}/admin/stats`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const res = await response.json();
    if (!response.ok) throw new Error(res.error || 'Failed to load dashboard statistics');
    return res;
  }
};
