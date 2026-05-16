import api from './api';

export const authService = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.data?.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  }
};
