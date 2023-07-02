import { coreApi } from "..";

export const getUmkm = (id) => {
  return coreApi.get(`/v1/umkm/${id}`);
};

export const updateUmkm = (id, param) => {
  return coreApi.put(`/v1/umkm/${id}`, param);
};
