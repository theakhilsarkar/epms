import api from './api';

export const employeeService = {
  getEmployees: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  createEmployee: async (employeeData: {
    name: string;
    email: string;
    password: string;
    role: string;
    branchId: string;
  }) => {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },

  updateEmployee: async (id: string, employeeData: {
    name?: string;
    email?: string;
    role?: string;
    branchId?: string;
  }) => {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  deleteEmployee: async (id: string) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  }
};
