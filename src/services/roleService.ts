import api from './api';

export const roleService = {
  getRoleConfigs: async () => {
    const response = await api.get('/role-configs');
    return response.data;
  },
  
  getRoleConfigByName: async (roleName: string) => {
    const response = await api.get(`/role-configs/${roleName}`);
    return response.data;
  },
  
  createRoleConfig: async (configData: any) => {
    const response = await api.post('/role-configs', configData);
    return response.data;
  },
  
  updateRoleConfig: async (roleName: string, configData: any) => {
    const response = await api.put(`/role-configs/${roleName}`, configData);
    return response.data;
  },
  
  deleteRoleConfig: async (roleName: string) => {
    const response = await api.delete(`/role-configs/${roleName}`);
    return response.data;
  }
};
