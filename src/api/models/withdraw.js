import { coreApi } from "..";

export const createWithdraw = (umkmId, amount, date) => {
  const data = {
    umkmID: parseInt(umkmId),
    date: date,
    amount: parseInt(amount),
  };
  return coreApi.post(`/v1/admin/withdraw`, data);
};

export const getWithdrawList = (date, limit, page) => {
  return coreApi.get(
    `/v1/admin/withdraw?limit=${limit}&page=${page}&date=${date}`
  );
};
