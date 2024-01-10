import React, { useEffect, useState } from "react";
import {
  cancelTransaction,
  completeTransaction,
  getTransaction,
} from "../../api/models/transaction";
import Modal from "../../components/Modal";
import Navbar from "../../components/Navbar";
import { useUserContext } from "../../context/userContext";
import useSnackbar from "../../hooks/useSnackbar";

const Transaction = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [showModalConfirmCancel, setShowModalConfirmCancel] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [refreshData, setRefreshData] = useState(false);
  const { userInfo } = useUserContext();
  const snackbar = useSnackbar();

  const fetchTransactionData = async (umkmId) => {
    try {
      const res = await getTransaction(umkmId, ["paid"], "");
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
      setShowModalDetail(false);
      setRefreshData(!refreshData);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const handleCancelOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await cancelTransaction(
        userInfo.UmkmID,
        selectedData.transaction_id
      );
      snackbar.success(res.data.meta.message);
      setShowModalConfirmCancel(false);
      setRefreshData(!refreshData);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const handleOnClickCloseModal = () => {
    setShowModalDetail(false);
    setSelectedData({});
  };

  const handleOnClickTransaction = (item) => {
    setShowModalDetail(true);
    setSelectedData(item);
  };

  const handleOnClickCancel = () => {
    setShowModalDetail(false);
    setShowModalConfirmCancel(true);
  };

  useEffect(() => {
    if (userInfo?.UmkmID) {
      fetchTransactionData(userInfo?.UmkmID);
    }
  }, [userInfo?.UmkmID, refreshData]);

  return (
    <>
      {showModalConfirmCancel ? (
        <Modal
          handleSubmit={handleCancelOrder}
          setShowModalClose={() => setShowModalConfirmCancel(false)}
          headerText={`Konfirmasi Batalkan Pesanan`}
          confirmText="Batalkan Pesanan"
        >
          <h1>Anda yakin ingin batalkan pesanan?</h1>
        </Modal>
      ) : null}
      {showModalDetail ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 px-3 outline-none focus:outline-none">
            <div className="relative my-6 mx-auto max-w-3xl w-full">
              {/*content*/}
              <form
                className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
                onSubmit={handleCompleteOrder}
              >
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">{`Detail Pesanan ${selectedData.buyer_name}`}</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => handleOnClickCloseModal()}
                  >
                    <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                      X
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
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
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b gap-x-5">
                  <button
                    className="bg-green-400 text-white active:bg-green-400 font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="submit"
                  >
                    Selesaikan Pesanan
                  </button>
                  <button
                    className="bg-red-400 text-white active:bg-red-400 font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => handleOnClickCancel()}
                  >
                    Batalkan Pesanan
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      <Navbar />
      <div className="max-w-7xl mx-auto py-5 px-4">
        <h1 className="text-3xl">Transaksi Aktif</h1>
        <p>Segera proses pesanan dibawah ya!</p>
        {userInfo?.UmkmStatus !== "open" ? (
          <p className="px-3 py-1 rounded-md bg-red-200 mt-5">
            Status toko kamu tutup, silahkan buka toko di dashboard untuk
            memulai berjualan ^__^
          </p>
        ) : null}
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
