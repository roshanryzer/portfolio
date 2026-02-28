/**
 * API client for backend (NestJS). Base URL: VITE_API_URL or same origin.
 * All backend routes are under /api/v1.
 */
import type { PortfolioAll, Profile, Skill, Certification, Education, Experience, Project } from './types';
import { getStoredToken } from '../lib/auth';

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_BASE = `${BASE}/api/v1`;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    credentials: 'include',
  });
  if (!res.ok) {
    let message = `API ${res.status}: ${res.statusText}`;
    try {
      const data = await res.json();
      if (data && typeof (data as any).message === 'string') {
        message = (data as any).message;
      }
    } catch {
      // ignore JSON parse errors and fall back to default message
    }
    throw new Error(message);
  }
  return res.json();
}

function authHeaders(): HeadersInit {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function requestWithAuth<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...init?.headers,
    },
    credentials: 'include',
  });
  if (!res.ok) {
    let message = `API ${res.status}: ${res.statusText}`;
    try {
      const data = await res.json();
      if (data && typeof (data as any).message === 'string') {
        message = (data as any).message;
      }
    } catch {
      // ignore JSON parse errors and fall back to default message
    }
    throw new Error(message);
  }
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  auth: {
    login: (email: string, password: string) =>
      api.post<{ accessToken: string; refreshToken: string }>('/auth/login', {
        email,
        password,
      }),
    register: (email: string, password: string, name?: string) =>
      api.post<{ accessToken: string; refreshToken: string }>('/auth/register', { email, password, name }),
    forgotPassword: (email: string) =>
      api.post<{ ok: boolean; resetToken?: string }>('/auth/forgot-password', { email }),
    resetPassword: (token: string, password: string) =>
      api.post<{ ok: boolean }>('/auth/reset-password', { token, password }),
  },
  health: () => api.get<{ status: string }>('/health'),
  portfolio: {
    getAll: () => api.get<PortfolioAll>('/portfolio'),
    getProfile: () => api.get<Profile | null>('/portfolio/profile'),
    getSkills: () => api.get<Skill[]>('/portfolio/skills'),
    getCertifications: () => api.get<Certification[]>('/portfolio/certifications'),
    getEducation: () => api.get<Education[]>('/portfolio/education'),
    getExperience: () => api.get<Experience[]>('/portfolio/experience'),
    getProjects: () => api.get<Project[]>('/portfolio/projects'),
    // Admin write (require auth)
    createProfile: (body: Record<string, unknown>) => requestWithAuth<Profile>('/portfolio/profile', { method: 'POST', body: JSON.stringify(body) }),
    updateProfile: (body: Record<string, unknown>) => requestWithAuth<Profile>('/portfolio/profile', { method: 'PATCH', body: JSON.stringify(body) }),
    createSkill: (body: { category: string; name: string; sortOrder?: number; iconUrl?: string }) =>
      requestWithAuth<Skill>('/portfolio/skills', { method: 'POST', body: JSON.stringify(body) }),
    updateSkill: (id: string, body: Record<string, unknown>) => requestWithAuth<Skill>(`/portfolio/skills/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    deleteSkill: (id: string) => requestWithAuth<void>(`/portfolio/skills/${id}`, { method: 'DELETE' }),
    createCertification: (body: Record<string, unknown>) => requestWithAuth<Certification>('/portfolio/certifications', { method: 'POST', body: JSON.stringify(body) }),
    updateCertification: (id: string, body: Record<string, unknown>) => requestWithAuth<Certification>(`/portfolio/certifications/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    deleteCertification: (id: string) => requestWithAuth<void>(`/portfolio/certifications/${id}`, { method: 'DELETE' }),
    createEducation: (body: Record<string, unknown>) => requestWithAuth<Education>('/portfolio/education', { method: 'POST', body: JSON.stringify(body) }),
    updateEducation: (id: string, body: Record<string, unknown>) => requestWithAuth<Education>(`/portfolio/education/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    deleteEducation: (id: string) => requestWithAuth<void>(`/portfolio/education/${id}`, { method: 'DELETE' }),
    createExperience: (body: Record<string, unknown>) => requestWithAuth<Experience>('/portfolio/experience', { method: 'POST', body: JSON.stringify(body) }),
    updateExperience: (id: string, body: Record<string, unknown>) => requestWithAuth<Experience>(`/portfolio/experience/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    deleteExperience: (id: string) => requestWithAuth<void>(`/portfolio/experience/${id}`, { method: 'DELETE' }),
    createProject: (body: Record<string, unknown>) => requestWithAuth<Project>('/portfolio/projects', { method: 'POST', body: JSON.stringify(body) }),
    updateProject: (id: string, body: Record<string, unknown>) => requestWithAuth<Project>(`/portfolio/projects/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    deleteProject: (id: string) => requestWithAuth<void>(`/portfolio/projects/${id}`, { method: 'DELETE' }),
  },
};
