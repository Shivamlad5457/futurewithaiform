export interface CollaborationRequest {
  id: number;
  name: string;
  mobile: string;
  instagram: string;
  request_type: 'Collaboration' | 'Promotion' | 'Brand Partnership' | 'AI Video Idea' | 'Content Suggestion' | 'Other';
  idea_title: string;
  idea_description: string;
  preferred_date?: string;
  preferred_time?: string;
  video_duration?: number;
  additional_note?: string;
  status: 'pending' | 'reviewed' | 'completed';
  created_at: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  reviewed: number;
  completed: number;
}
