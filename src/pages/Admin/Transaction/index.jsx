import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getTransactionAdmin,
  markAsPaid,
} from "../../../api/models/transaction";
import Modal from "../../../components/Modal";
import Navbar from "../../../components/Navbar";
import useDebounce from "../../../hooks/useDebounce";
import useSnackbar from "../../../hooks/useSnackbar";

const TransactionAdmin = () => {
  const { register, handleSubmit, reset } = useForm();
  const [transaction, setTransaction] = useState([]);
  const [query, setQuery] = useState("");
  const [refreshData, setRefreshData] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const snackbar = useSnackbar();

  const fetchTransactionAdmin = async () => {
    try {
      const res = await getTransactionAdmin(query, 10, currentPage);
      setTransaction(res.data.data);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
      if (currentPage != 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleUpdateStatus = async (d) => {
    if (d.status === "success") {
      try {
        const res = await markAsPaid(d.order_id);
        setRefreshData(!refreshData);
        setShowModal(false);
        reset();
        snackbar.success(res.data.meta.message);
      } catch (error) {
        snackbar.error(error.response?.data.meta.message);
      }
    }
  };

  const handleOnClickDetail = (item) => {
    setSelectedData(item);
    setShowModal(true);
  };

  useDebounce(() => fetchTransactionAdmin(), 1000, [query]);

  useEffect(() => {
    fetchTransactionAdmin();
  }, [currentPage, refreshData]);

  return (
    <>
      {showModal ? (
        <Modal
          headerText="Detail Pesanan"
          confirmText="Simpan"
          setShowModalClose={() => setShowModal(false)}
          handleSubmit={handleSubmit(handleUpdateStatus)}
        >
          <div className="">
            <h4>Pembeli : {selectedData.buyer_name}</h4>
            <h4>Kursi : {selectedData.seat}</h4>
            <h4>Notes : {selectedData.notes}</h4>
            <h4>
              Status Pesanan :{" "}
              {selectedData.status === "success"
                ? "Dibayar"
                : selectedData.status === "pending"
                ? "Belum dibayar"
                : "?"}
            </h4>
            <h4>Total Harga : Rp {selectedData.price}</h4>
          </div>
          <hr className="my-5" />
          {selectedData.item_menus.map((item, key) => {
            return (
              <div className="flex justify-between mb-5" key={key}>
                <div className="">
                  <h1 className="font-medium text-lg">{item.umkm_name}</h1>
                  <h3>{item.name}</h3>
                  <p>
                    Status :{" "}
                    {item.status === "paid"
                      ? "Diproses"
                      : item.status === "done"
                      ? "Selesai"
                      : item.status === "unpaid"
                      ? "Belum Dibayar"
                      : "?"}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="">x{item.qty}</h3>
                  <h3>{item.price}</h3>
                </div>
              </div>
            );
          })}
          {selectedData.status === "pending" ? (
            <>
              <hr />
              <p className="my-3">Ubah Status Pembayaran</p>
              <input
                type="text"
                hidden
                value={selectedData.midtrans_order_id}
                {...register("order_id")}
              />
              <select
                className="appearance-none px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                defaultValue={selectedData.status}
                {...register("status", { required: true })}
              >
                <option value="pending">Belum Dibayar</option>
                <option value="success">Dibayar</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  ></path>
                </svg>
              </div>
            </>
          ) : null}
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
            {transaction.map((item, key) => {
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
        <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 mt-5">
          <div className="flex flex-1 justify-between items-center">
            <button
              onClick={() => {
                if (currentPage != 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
              href="#"
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
            <p>Page : {currentPage}</p>
            <button
              onClick={() => {
                setCurrentPage(currentPage + 1);
              }}
              href="#"
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionAdmin;
