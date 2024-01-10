import { coreApi } from "..";

export const getTransaction = (umkmId, statuses, orderId) => {
  let queryParams = `order_id=${orderId}`;
  statuses.forEach((status) => {
    queryParams += `&statuses=${status}`;
  });

  return coreApi.get(`/v1/umkm/${umkmId}/transactions?${queryParams}`);
};

export const completeTransaction = (umkmId, transactionId) => {
  return coreApi.put(
    `/v1/umkm/${umkmId}/transaction/${transactionId}/mark-as-done`
  );
};

export const cancelTransaction = (umkmId, transactionId) => {
  return coreApi.put(
    `/v1/umkm/${umkmId}/transaction/${transactionId}/cancel-order`
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

export const generateRecapExcelFile = (date) => {
  return coreApi.get(`/v1/admin/transactions/recap/download?date=${date}`, {
    responseType: "blob",
  });
};
