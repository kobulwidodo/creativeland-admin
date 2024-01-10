import fileDownload from "js-file-download";
import React, { useEffect, useState } from "react";
import {
  generateRecapExcelFile,
  getRecapTransaction,
} from "../../../api/models/transaction";
import Modal from "../../../components/Modal";
import Navbar from "../../../components/Navbar";
import useSnackbar from "../../../hooks/useSnackbar";

const SalesRecap = () => {
  const [recapTransaction, setRecapTransaction] = useState([]);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [query, setQuery] = useState("");
  const [queryExcel, setQueryExcel] = useState("");
  const [selectedData, setSelectedData] = useState({});
  const snackbar = useSnackbar();

  const fetchRecapTransactions = async () => {
    try {
      const res = await getRecapTransaction(query);
      setRecapTransaction(res.data.data);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const handleDownloadButton = async () => {
    try {
      const res = await generateRecapExcelFile(queryExcel);
      const contentDisposition = res.headers["content-disposition"];
      let filename = `rekap-penjualan-${queryExcel}.xlsx`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch.length > 1) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }
      fileDownload(res.data, filename);
      setQueryExcel("");
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
    console.log(item);
  };

  useEffect(() => {
    fetchRecapTransactions();
  }, [query]);

  return (
    <>
      {showModalUpdate ? (
        <Modal
          setShowModalClose={() => handleOnClickCloseModal()}
          headerText={`Detail Recap ${selectedData.date}`}
        >
          <div className="">
            <table className="w-full border mt-5">
              <thead className="border">
                <tr>
                  <th>Nama</th>
                  <th>Pendapatan Bersih</th>
                  <th>Pendapatan Kotor</th>
                  <th>Total Order</th>
                </tr>
              </thead>
              <tbody>
                {selectedData.umkm_detail.map((item, key) => {
                  return (
                    <tr key={key} className={key % 2 == 1 ? "bg-gray-100" : ""}>
                      <td className="text-center py-5">{item.umkm_name}</td>
                      <td className="text-center">Rp {item.net_amount}</td>
                      <td className="text-center">Rp {item.gross_amount}</td>
                      <td className="text-center">{item.total_order}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Modal>
      ) : null}
      <Navbar />
      <div className="max-w-7xl mx-auto py-5 px-4">
        <h1 className="text-3xl mb-3">Rekap Pesanan</h1>
        <div className="flex gap-x-5">
          <input
            type="date"
            placeholder="Masukan Tanggal"
            className="px-5 py-2 rounded-lg w-full border"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <button
            onClick={() => setQuery("")}
            className="bg-green-500 text-white font-medium rounded-xl px-2"
          >
            Hapus
          </button>
        </div>
        <table className="w-full border mt-5">
          <thead className="border">
            <tr>
              <th>Tanggal</th>
              <th>Pendapatan Bersih</th>
              <th>Pendapatan Kotor</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {recapTransaction.map((item, key) => {
              return (
                <tr key={key} className={key % 2 == 1 ? "bg-gray-100" : ""}>
                  <td className="text-center py-5">{item.date}</td>
                  <td className="text-center">Rp {item.net_amount}</td>
                  <td className="text-center">Rp {item.gross_amount}</td>
                  <td className="text-center">
                    <button
                      onClick={() => handleOnClickTransaction(item)}
                      className="bg-green-400 text-white active:bg-green-400 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 self-auto"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <hr className="my-7" />
        <h1 className="text-xl mb-3">Unduh Excel</h1>
        <div className="flex gap-x-5">
          <input
            type="month"
            name="month"
            placeholder="Masukan Bulan"
            className="px-5 py-2 rounded-lg w-full border"
            onChange={(e) => setQueryExcel(e.target.value)}
            value={queryExcel}
          />
          <button
            className="bg-green-500 text-white font-medium rounded-xl px-2"
            onClick={handleDownloadButton}
          >
            Unduh
          </button>
        </div>
      </div>
    </>
  );
};

export default SalesRecap;
