import api from './api';

export const reportService = {
  submitReport: async (reportData: { week: string; data: any }) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },
  
  getMyReports: async () => {
    const response = await api.get('/reports/my-reports');
    return response.data;
  },
  
  getAllReports: async () => {
    // Admin only
    const response = await api.get('/reports');
    return response.data;
  }
};
