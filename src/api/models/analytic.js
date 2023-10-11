import { coreApi } from "..";

export const getDashboardAnalytic = (umkmId) => {
  return coreApi.get(`/v1/umkm/${umkmId}/analytic/dashboard-widget`);
};

export const getAllDashboardAnalytic = () => {
  return coreApi.get(`/v1/admin/analytic/dashboard-widget`);
};
