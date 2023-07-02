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
