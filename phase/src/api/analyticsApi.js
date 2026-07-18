import api from './axiosInstance';

export const getDashboardAnalytics = async () => {
  const res = await api.get('/api/analytics/dashboard');
  return res.data;
};