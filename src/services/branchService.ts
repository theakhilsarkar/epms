import api from './api';

export const branchService = {
  getBranches: async () => {
    const response = await api.get('/branches');
    return response.data;
  },
  
  createBranch: async (branchData: { name: string; location: string }) => {
    const response = await api.post('/branches', branchData);
    return response.data;
  },
  
  updateBranch: async (id: string, branchData: { name?: string; location?: string }) => {
    const response = await api.put(`/branches/${id}`, branchData);
    return response.data;
  },
  
  deleteBranch: async (id: string) => {
    const response = await api.delete(`/branches/${id}`);
    return response.data;
  }
};
