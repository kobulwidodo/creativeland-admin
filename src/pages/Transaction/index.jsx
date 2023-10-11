import React, { useEffect, useState } from "react";
import {
  completeTransaction,
  getTransaction,
} from "../../api/models/transaction";
import Modal from "../../components/Modal";
import Navbar from "../../components/Navbar";
import { useUserContext } from "../../context/userContext";
import useSnackbar from "../../hooks/useSnackbar";

const Transaction = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [refreshData, setRefreshData] = useState(false);
  const { userInfo } = useUserContext();
  const snackbar = useSnackbar();

  const fetchTransactionData = async (umkmId) => {
    try {
      const res = await getTransaction(umkmId, "paid", "");
      setTransactionData(res.data.data);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const handleCompleteOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await completeTransaction(
        userInfo.UmkmID,
        selectedData.transaction_id
      );
      snackbar.success(res.data.meta.message);
      setSelectedData({});
      setShowModalUpdate(false);
      setRefreshData(!refreshData);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const handleOnClickCloseModal = () => {
    setShowModalUpdate(false);
    setSelectedData({});
  };

  const handleOnClickTransaction = (item) => {
    setShowModalUpdate(true);
    setSelectedData(item);
  };

  useEffect(() => {
    if (userInfo?.UmkmID) {
      fetchTransactionData(userInfo?.UmkmID);
    }
  }, [userInfo?.UmkmID, refreshData]);

  return (
    <>
      {showModalUpdate ? (
        <Modal
          handleSubmit={handleCompleteOrder}
          setShowModalClose={() => handleOnClickCloseModal()}
          headerText={`Detail Pesanan ${selectedData.buyer_name}`}
          confirmText="Selesaikan Pesanan"
        >
          <div className="">
            <h4>Kursi : {selectedData.seat}</h4>
            <h4>Notes : {selectedData.notes}</h4>
            <h4>
              Status Pesanan :{" "}
              {selectedData.status === "paid" ? "Dibayar" : "?"}
            </h4>
            <h4>Total Harga : Rp {selectedData.price}</h4>
          </div>
          <hr className="my-5" />
          {selectedData.item_menus.map((item, key) => {
            return (
              <div className="flex justify-between" key={key}>
                <h3>{item.name}</h3>
                <h3>x{item.qty}</h3>
              </div>
            );
          })}
        </Modal>
      ) : null}
      <Navbar />
      <div className="max-w-7xl mx-auto py-5 px-4">
        <h1 className="text-3xl">Transaksi Aktif</h1>
        <p>Segera proses pesanan dibawah ya!</p>
        <div className="mt-7 flex flex-col gap-y-5">
          {transactionData.map((item, key) => {
            return (
              <div
                className="flex justify-between items-center border rounded-md px-3 py-2"
                key={key}
              >
                <div className="">
                  <h1>Pesanan atas nama {item.buyer_name}</h1>
                  <p className="text-sm">{item.created_at}</p>
                </div>
                <button
                  onClick={() => handleOnClickTransaction(item)}
                  className="bg-green-400 text-white active:bg-green-400 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 self-auto"
                >
                  Lihat Pesanan
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Transaction;
