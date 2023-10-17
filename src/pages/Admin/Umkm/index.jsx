import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createUmkm,
  getListUmkm,
  registerUmkmAcc,
} from "../../../api/models/umkm";
import Modal from "../../../components/Modal";
import Navbar from "../../../components/Navbar";
import useDebounce from "../../../hooks/useDebounce";
import useSnackbar from "../../../hooks/useSnackbar";

const UmkmAdmin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [umkmData, setUmkmData] = useState([]);
  const [query, setQuery] = useState("");
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [refreshData, setRefreshData] = useState(false);
  const snackbar = useSnackbar();

  const fetchUmkm = async () => {
    try {
      const res = await getListUmkm(query);
      setUmkmData(res.data.data);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const handleRegisterUMKM = async (d) => {
    try {
      const res = await createUmkm(d.name, d.slogan);
      await registerUmkmAcc(d.name, d.password, res.data.data.ID, d.username);
      setRefreshData(!refreshData);
      setShowModalCreate(false);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const handleUpdateUMKM = async (d) => {
    try {
      console.log(d);
      setRefreshData(!refreshData);
      setShowModalCreate(false);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const handleOnClickDetail = (item) => {
    setSelectedData(item);
    setShowModalUpdate(true);
  };

  useDebounce(() => fetchUmkm(), 1000, [query]);

  useEffect(() => {
    fetchUmkm();
  }, [refreshData]);

  return (
    <>
      {showModalCreate ? (
        <Modal
          headerText="Register Akun UMKM Baru"
          confirmText="Tambah"
          handleSubmit={handleSubmit(handleRegisterUMKM)}
          setShowModalClose={() => setShowModalCreate(false)}
        >
          <div className="mb-5">
            <input
              type="text"
              className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
              placeholder="Masukan Nama UMKM"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <span className="text-sm text-red-600">Nama wajib diisi</span>
            )}
          </div>
          <div className="mb-5">
            <input
              type="text"
              className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
              placeholder="Masukan Slogan UMKM"
              {...register("slogan", { required: true })}
            />
            {errors.slogan && (
              <span className="text-sm text-red-600">Slogan wajib diisi</span>
            )}
          </div>
          <div className="mb-5">
            <input
              type="text"
              className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
              placeholder="Masukan Username UMKM"
              {...register("username", { required: true })}
            />
            {errors.username && (
              <span className="text-sm text-red-600">Username wajib diisi</span>
            )}
          </div>
          <div className="mb-5">
            <input
              type="password"
              className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
              placeholder="Masukan Password UMKM"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="text-sm text-red-600">Password wajib diisi</span>
            )}
          </div>
        </Modal>
      ) : null}
      {showModalUpdate ? (
        <Modal
          headerText="Ubdah Data UMKM"
          confirmText="Ubah"
          handleSubmit={handleSubmit(handleUpdateUMKM)}
          setShowModalClose={() => setShowModalUpdate(false)}
        >
          <div className="mb-5">
            <input
              type="text"
              className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
              placeholder="Masukan Nama UMKM"
              {...register("name", { value: selectedData.Name })}
            />
          </div>
          <div className="mb-5">
            <input
              type="text"
              className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
              placeholder="Masukan Slogan UMKM"
              {...register("slogan", { value: selectedData.Slogan })}
            />
          </div>
        </Modal>
      ) : null}
      <Navbar />
      <div className="max-w-7xl mx-auto py-5 px-4">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl mb-3">Daftar UMKM</h1>
          <button
            className="bg-green-400 text-white active:bg-green-400 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 self-auto"
            onClick={() => setShowModalCreate(true)}
          >
            Tambah UMKM
          </button>
        </div>
        <input
          type="text"
          placeholder="Cari UMKM"
          className="px-5 py-2 rounded-lg w-full border"
          onChange={(e) => setQuery(e.target.value)}
        />
        <table className="w-full border mt-5">
          <thead className="border">
            <tr>
              <th className="px-2">No</th>
              <th className="px-2">Name</th>
              <th className="px-2">Slogan</th>
              <th className="px-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {umkmData.map((item, key) => {
              return (
                <tr key={key} className={key % 2 == 1 ? "bg-gray-100" : ""}>
                  <td className="px-2">{key + 1}</td>
                  <td className="px-2">{item.Name}</td>
                  <td className="px-2">{item.Slogan}</td>
                  <td className="text-center p-2">
                    <button
                      onClick={() => handleOnClickDetail(item)}
                      className="bg-green-400 text-white active:bg-green-400 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 self-auto"
                    >
                      Kelola
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

export default UmkmAdmin;
