import { coreApi } from "..";

export const getTransaction = (umkmId, status, orderId) => {
  return coreApi.get(
    `/v1/umkm/${umkmId}/transactions?status=${status}&order_id=${orderId}`
  );
};

export const completeTransaction = (umkmId, transactionId) => {
  return coreApi.put(
    `/v1/umkm/${umkmId}/transaction/${transactionId}/mark-as-done`
  );
};

export const getTransactionAdmin = (orderId, limit, page) => {
  return coreApi.get(
    `/v1/admin/transactions?limit=${limit}&page=${page}&order_id=${orderId}`
  );
};

export const getRecapTransaction = (date) => {
  return coreApi.get(`/v1/admin/transactions/recap?date=${date}`);
};

export const markAsPaid = (order_id) => {
  return coreApi.put(`/v1/admin/transaction/${order_id}/mark-as-paid`);
};
