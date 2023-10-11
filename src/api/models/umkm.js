import { coreApi } from "..";

export const getListUmkm = (name) => {
  return coreApi.get(`/v1/umkm?name=${name}`);
};

export const getUmkm = (id) => {
  return coreApi.get(`/v1/umkm/${id}`);
};

export const updateUmkm = (id, param) => {
  return coreApi.put(`/v1/umkm/${id}`, param);
};

export const createUmkm = (name, slogan) => {
  const data = {
    name: name,
    slogan: slogan,
  };
  return coreApi.post(`/v1/umkm/create`, data);
};

export const registerUmkmAcc = (name, password, umkmID, username) => {
  const data = {
    nama: name,
    password: password,
    umkmID: umkmID,
    username: username,
  };
  return coreApi.post(`/v1/auth/register`, data);
};
