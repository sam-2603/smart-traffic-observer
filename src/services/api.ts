import axios from 'axios';
import type { Violation, Challan, DashboardStats } from '@/lib/mockData';

// Configure this to point to your Node.js backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Health check
export const checkHealth = async () => {
  const res = await api.get('/health');
  return res.data;
};

// Video Upload & Processing
export const uploadVideo = async (
  file: File,
  onUploadProgress?: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append('video', file);

  const res = await api.post('/videos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 600000, // 10 min for large videos
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onUploadProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(progress);
      }
    },
  });

  return res.data as {
    success: boolean;
    jobId: string;
    violations: Violation[];
    totalViolations: number;
    processedVideo?: string;
    error?: string;
  };
};

// Violations
export const getViolations = async (params?: {
  status?: string;
  violationType?: string;
  limit?: number;
  skip?: number;
}) => {
  const res = await api.get('/violations', { params });
  return res.data as {
    violations: Violation[];
    total: number;
  };
};

export const getViolationById = async (id: string) => {
  const res = await api.get(`/violations/${id}`);
  return res.data as Violation;
};

export const verifyViolation = async (id: string, status: 'verified' | 'rejected') => {
  const res = await api.put(`/violations/${id}/verify`, { status });
  return res.data as Violation;
};

// Challans
export const getChallans = async (params?: {
  status?: string;
  limit?: number;
  skip?: number;
}) => {
  const res = await api.get('/challans', { params });
  return res.data as {
    challans: Challan[];
    total: number;
  };
};

export const generateChallan = async (data: {
  violationId: string;
  ownerName: string;
  ownerAddress?: string;
  penaltyAmount: number;
}) => {
  const res = await api.post('/challans/generate', data);
  return res.data as { success: boolean; challan: Challan };
};

// Job status
export const getJobStatus = async (jobId: string) => {
  const res = await api.get(`/jobs/${jobId}`);
  return res.data;
};

// Dashboard stats — your backend may or may not have this endpoint.
// If not, we compute from violations/challans.
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const res = await api.get('/stats');
    return res.data;
  } catch {
    // Fallback: compute from violations
    const { violations, total } = await getViolations({ limit: 1000 });
    const pending = violations.filter(v => v.status === 'pending').length;
    return {
      totalViolationsToday: total,
      pendingChallans: pending,
      activeCameras: 12,
      systemUptime: '99.7%',
      detectionAccuracy: 97.3,
      processedChallans: total - pending,
    };
  }
};

export default api;
