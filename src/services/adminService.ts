import api from './api';

export const adminService = {
  getLeaderboard: async (params?: { week?: string; month?: string }) => {
    const response = await api.get('/analytics/leaderboard', { params });
    return response.data;
  },
  
  getGroupedPerformance: async (by: 'branch' | 'role') => {
    const response = await api.get('/analytics/grouped', { params: { by } });
    return response.data;
  },
  
  getTargetVsAchievement: async (roleName: string) => {
    const response = await api.get(`/analytics/targets/${roleName}`);
    return response.data;
  }
};
