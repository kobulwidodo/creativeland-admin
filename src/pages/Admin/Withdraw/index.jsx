import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getListUmkm, updateUmkm } from "../../../api/models/umkm";
import { createWithdraw, getWithdrawList } from "../../../api/models/withdraw";
import Modal from "../../../components/Modal";
import Navbar from "../../../components/Navbar";
import useSnackbar from "../../../hooks/useSnackbar";

const Withdraw = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [withdrawData, setWithdrawData] = useState([]);
  const [umkmData, setUmkmData] = useState([]);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterToday, setIsFilterToday] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [dateFilter, setDateFilter] = useState("");
  const snackbar = useSnackbar();

  const fetchUmkm = async () => {
    try {
      const res = await getListUmkm("");
      setUmkmData(res.data.data);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const fetchWithdraw = async () => {
    try {
      const res = await getWithdrawList(dateFilter, 20, currentPage);
      if (res.data.data.length == 0) {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
      setWithdrawData(res.data.data);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const handleAddWithdraw = async (d) => {
    try {
      const res = await createWithdraw(d.umkm_id, d.amount, d.date);
      if (d.status === "close") {
        await updateUmkm(d.umkm_id, { status: d.status });
      }
      setRefreshData(!refreshData);
      setShowModalCreate(false);
      setSelectedData({});
      reset();
      snackbar.success(res.data.meta.message);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const handleFilterToday = () => {
    if (isFilterToday) {
      setIsFilterToday(false);
      setDateFilter("");
    } else {
      setIsFilterToday(true);
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];
      console.log(formattedDate);
      setDateFilter(formattedDate);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    fetchWithdraw();
    fetchUmkm();
  }, [currentPage, isFilterToday, refreshData]);

  return (
    <>
      {showModalCreate ? (
        <Modal
          headerText="Tambah Withdraw Baru"
          confirmText="Tambah"
          handleSubmit={handleSubmit(handleAddWithdraw)}
          setShowModalClose={() => setShowModalCreate(false)}
        >
          <div className="mb-5 relative">
            <select
              className="appearance-none px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
              placeholder="Pilih Umkm"
              {...register("umkm_id", { required: true })}
              defaultValue="Pilih UMKM"
              onChange={(e) => {
                const selectedId = e.target.value;
                const selectedItem = umkmData.find(
                  (item) => item.ID == selectedId
                );
                if (selectedItem) {
                  setSelectedData(selectedItem);
                }
              }}
            >
              <option disabled value={"Pilih UMKM"}>
                Pilih Umkm
              </option>
              {umkmData.map((item, key) => {
                return (
                  <option value={item.ID} key={key}>
                    {item.Name}
                  </option>
                );
              })}
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
            {errors.date && (
              <span className="text-sm text-red-600">Tanggal wajib diisi</span>
            )}
          </div>
          <div className="mb-5">
            <input
              type="date"
              className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
              placeholder="Masukan Tanggal"
              {...register("date", { required: true })}
            />
            {errors.date && (
              <span className="text-sm text-red-600">Tanggal wajib diisi</span>
            )}
          </div>
          <div className="mb-5">
            <input
              type="number"
              className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
              placeholder="Masukan Jumlah Withdraw"
              {...register("amount", { required: true })}
            />
            {errors.amount && (
              <span className="text-sm text-red-600">Jumlah wajib diisi</span>
            )}
          </div>
          {console.log(selectedData)}
          {Object.keys(selectedData).length !== 0 &&
          selectedData?.Status === "open" ? (
            <div className="mb-5 relative">
              <select
                className="appearance-none px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                defaultValue={selectedData.Status}
                disabled={selectedData.Status === "close"}
                {...register("status", { required: true })}
              >
                <option value="open">Buka</option>
                <option value="close">Tutup</option>
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
            </div>
          ) : null}
        </Modal>
      ) : null}
      <Navbar />
      <div className="max-w-7xl mx-auto py-5 px-4">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl mb-3">Daftar Withdraw</h1>
          <button
            className="bg-green-400 text-white active:bg-green-400 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 self-auto"
            onClick={() => setShowModalCreate(true)}
          >
            Tambah Withdraw
          </button>
        </div>
        <div className="">
          <div className="flex items-center gap-x-3">
            <p>Filter : </p>
            <button
              className={`px-3 py-2 rounded border border-blue-400 hover:bg-blue-100 ${
                isFilterToday ? "bg-blue-200" : ""
              }`}
              onClick={() => handleFilterToday()}
            >
              Hari Ini
            </button>
          </div>
        </div>
        <table className="w-full border mt-5">
          <thead className="border">
            <tr>
              <th>Tanggal</th>
              <th>Umkm</th>
              <th>Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {withdrawData.map((item, key) => {
              return (
                <tr key={key} className={key % 2 == 1 ? "bg-gray-100" : ""}>
                  <td className="text-center py-5">{item.Date}</td>
                  <td className="text-center">{item.UmkmName}</td>
                  <td className="text-center">Rp {item.Amount}</td>
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
              onClick={() => handleNextPage()}
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

export default Withdraw;
