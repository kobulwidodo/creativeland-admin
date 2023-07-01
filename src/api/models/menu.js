import { coreApi } from "..";

export const getListMenu = (id, name = "") => {
  return coreApi.get(`/v1/menu?umkm_id=${id}&name=${name}`);
};

export const updateMenu = (id, data) => {
  data.price = parseInt(data.price);
  return coreApi.put(`/v1/menu/${id}`, data);
};

export const deleteMenu = (id) => {
  return coreApi.delete(`/v1/menu/${id}`);
};

export const createMenu = (umkm_id, data) => {
  data.price = parseInt(data.price);
  return coreApi.post(`/v1/umkm/${umkm_id}/menu/create`, data);
};
