import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getUmkm, updateUmkm } from "../../api/models/umkm";
import Modal from "../../components/Modal";
import Navbar from "../../components/Navbar";
import { useUserContext } from "../../context/userContext";
import useSnackbar from "../../hooks/useSnackbar";

const Umkm = () => {
  const { register, handleSubmit } = useForm();
  const [umkmData, setUmkmData] = useState({});
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const snackbar = useSnackbar();
  const { userInfo } = useUserContext();

  const fetchUmkmData = async (id) => {
    try {
      const res = await getUmkm(id);
      setUmkmData(res.data.data);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const handleUpdateUmkm = async (d) => {
    try {
      const res = await updateUmkm(userInfo.ID, d);
      snackbar.success(res.data.meta.message);
      setRefreshData(!refreshData);
      setShowModalUpdate(false);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  useEffect(() => {
    if (userInfo?.UmkmID) {
      fetchUmkmData(userInfo.UmkmID);
    }
  }, [userInfo?.UmkmID, refreshData]);

  return (
    <>
      {showModalUpdate ? (
        <Modal
          headerText="Update Informasi UMKM"
          confirmText="Simpan"
          handleSubmit={handleSubmit(handleUpdateUmkm)}
          setShowModalClose={() => setShowModalUpdate(false)}
        >
          <div className="mb-5">
            <input
              type="text"
              className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
              placeholder="Masukan Nama Menu"
              {...register("name", { value: umkmData.Name })}
            />
          </div>
          <div className="mb-5">
            <input
              type="text"
              className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
              placeholder="Masukan Description Menu"
              {...register("slogan", {
                value: umkmData.Slogan,
              })}
            />
          </div>
        </Modal>
      ) : null}
      <Navbar />
      <div className="max-w-7xl mx-auto py-5 px-4">
        <h1 className="text-3xl mb-10">Informasi Umkm</h1>
        <div className="flex flex-col items-center gap-y-5 mb-16">
          <img
            src="https://placehold.co/900x600"
            className="md:w-full w-72 h-auto rounded-xl mx-auto"
            alt=""
          />
          <button className="bg-green-400 text-white active:bg-green-400 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 self-auto">
            Ganti Foto
          </button>
        </div>
        <div className="flex flex-col gap-y-2 items-center">
          <h1 className="text-xl">{umkmData.Name}</h1>
          <h1 className="text-md">{umkmData.Slogan}</h1>
          <button
            onClick={() => setShowModalUpdate(true)}
            className="mt-3 bg-green-400 text-white active:bg-green-400 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 self-auto"
          >
            Ganti Informasi UMKM
          </button>
        </div>
      </div>
    </>
  );
};

export default Umkm;
