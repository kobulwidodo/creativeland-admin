import { coreApi } from "..";

export const createWithdraw = (umkmId, amount, date, status, method) => {
  const data = {
    umkmID: parseInt(umkmId),
    date: date,
    amount: parseInt(amount),
    status: status,
    method: method,
  };
  return coreApi.post(`/v1/admin/withdraw`, data);
};

export const getWithdrawList = (date, limit, page) => {
  return coreApi.get(
    `/v1/admin/withdraw?limit=${limit}&page=${page}&date=${date}`
  );
};

export const updateWithdraw = (status, id) => {
  const data = {
    status: status,
  };
  return coreApi.put(`/v1/admin/withdraw/${id}`, data);
};
