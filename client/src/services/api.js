import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/+$/, '')}/api`;
  }

  // If in browser and on a deployed domain (like Vercel), default directly to live Render backend
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return 'https://ai-resume-builder-yuli.onrender.com/api';
  }

  // Local development fallback through Vite proxy
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('resumai_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      // localStorage.removeItem('resumai_jwt_token');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  demoLogin: () => api.post('/auth/demo'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const resumeAPI = {
  getResumes: () => api.get('/resumes'),
  getResumeById: (id) => api.get(`/resumes/${id}`),
  createResume: (data) => api.post('/resumes', data),
  updateResume: (id, data) => api.put(`/resumes/${id}`, data),
  deleteResume: (id) => api.delete(`/resumes/${id}`),
  duplicateResume: (id) => api.post(`/resumes/${id}/duplicate`),
};

export const jobAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post('/jobs', data),
};

export const aiAPI = {
  enhanceSummary: (data) => api.post('/ai/enhance-summary', data),
  generateBullets: (data) => api.post('/ai/generate-bullets', data),
  matchJob: (data) => api.post('/ai/match-job', data),
  getMatches: () => api.get('/ai/matches'),
  applyTailoring: (matchId) => api.post(`/ai/apply-tailoring/${matchId}`),
  getInterviewQuestions: (data) => api.post('/ai/interview-questions', data),
  evaluateMock: (data) => api.post('/ai/mock-evaluate', data),
  getSkillRoadmap: (data) => api.post('/ai/skill-roadmap', data),
};

export default api;
