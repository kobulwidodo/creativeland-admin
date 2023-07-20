import React, { useEffect, useState } from "react";
import { getTransaction } from "../../api/models/transaction";
import Modal from "../../components/Modal";
import Navbar from "../../components/Navbar";
import { useUserContext } from "../../context/userContext";
import useDebounce from "../../hooks/useDebounce";
import useSnackbar from "../../hooks/useSnackbar";

const TransactionHistory = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedData, setSelectedData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const { userInfo } = useUserContext();
  const snackbar = useSnackbar();

  const fetchTransaction = async (umkmId) => {
    try {
      const res = await getTransaction(umkmId, "done", query);
      setTransactionData(res.data.data);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const handleOnClickDetail = (item) => {
    setSelectedData(item);
    setShowModal(true);
  };

  useDebounce(() => fetchTransaction(userInfo?.UmkmID), 1000, [query]);

  useEffect(() => {
    if (userInfo?.UmkmID) {
      fetchTransaction(userInfo?.UmkmID);
    }
  }, [userInfo?.UmkmID]);

  return (
    <>
      {showModal ? (
        <Modal
          headerText="Detail Pesanan"
          confirmText="Ok"
          setShowModalClose={() => setShowModal(false)}
          handleSubmit={() => {
            setShowModal(false);
          }}
        >
          <div className="">
            <h4>Pembeli : {selectedData.buyer_name}</h4>
            <h4>Kursi : {selectedData.seat}</h4>
            <h4>Notes : {selectedData.notes}</h4>
            <h4>
              Status Pesanan :{" "}
              {selectedData.status === "done" ? "Selesai" : "?"}
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
        <h1 className="text-3xl mb-3">Riwayat Pesanan</h1>
        <input
          type="text"
          placeholder="Order ID"
          className="px-5 py-2 rounded-lg w-full border"
          onChange={(e) => setQuery(e.target.value)}
        />
        <table className="w-full border mt-5">
          <thead className="border">
            <tr>
              <th>Order ID</th>
              <th>Pembeli</th>
              <th>Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactionData.map((item, key) => {
              return (
                <tr key={key} className={key % 2 == 1 ? "bg-gray-100" : ""}>
                  <td className="text-center py-5">{item.midtrans_order_id}</td>
                  <td className="text-center">{item.buyer_name}</td>
                  <td className="text-center">{item.price}</td>
                  <td className="text-center">
                    <button
                      onClick={() => handleOnClickDetail(item)}
                      className="bg-green-400 text-white active:bg-green-400 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 self-auto"
                    >
                      Detail Pesanan
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TransactionHistory;
