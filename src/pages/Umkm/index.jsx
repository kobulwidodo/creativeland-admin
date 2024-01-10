import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getUmkm, updateUmkm, uploadUmkmImage } from "../../api/models/umkm";
import Modal from "../../components/Modal";
import Navbar from "../../components/Navbar";
import { useUserContext } from "../../context/userContext";
import useSnackbar from "../../hooks/useSnackbar";

const Umkm = () => {
  const { register: registerUpdate, handleSubmit: handleSubmitUpdate } =
    useForm();
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
      const res = await updateUmkm(userInfo.UmkmID, d);
      snackbar.success(res.data.meta.message);
      setRefreshData(!refreshData);
      setShowModalUpdate(false);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await uploadUmkmImage(userInfo.UmkmID, formData);
        snackbar.success(res.data.meta.message);
        setRefreshData(!refreshData); // Trigger a refresh to show the new image
      } catch (error) {
        snackbar.error(error.response?.data.meta.message);
      }
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
          headerText="Update Informasi Tenant"
          confirmText="Simpan"
          handleSubmit={handleSubmitUpdate(handleUpdateUmkm)}
          setShowModalClose={() => setShowModalUpdate(false)}
        >
          <div className="mb-5">
            <input
              type="text"
              className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
              placeholder="Masukan Nama Menu"
              {...registerUpdate("name", { value: umkmData.Name })}
            />
          </div>
          <div className="mb-5">
            <input
              type="text"
              className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
              placeholder="Masukan Description Menu"
              {...registerUpdate("slogan", {
                value: umkmData.Slogan,
              })}
            />
          </div>
        </Modal>
      ) : null}
      <Navbar />
      <div className="max-w-7xl mx-auto py-5 px-4">
        <h1 className="text-3xl mb-10">Informasi Tenant</h1>
        <div className="flex flex-col items-center gap-y-5 mb-16">
          <img
            src={
              umkmData.ImgPath
                ? `http://localhost:8080/${umkmData.ImgPath}`
                : "https://placehold.co/900x600"
            }
            className="md:w-full w-72 h-48 rounded-xl mx-auto object-cover"
            alt=""
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="imageUpload"
          />
          <label
            htmlFor="imageUpload"
            className="bg-green-400 text-white active:bg-green-400 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 cursor-pointer"
          >
            Ganti Foto
          </label>
        </div>
        <div className="flex flex-col gap-y-2 items-center">
          <h1 className="text-xl">{umkmData.Name}</h1>
          <h1 className="text-md">{umkmData.Slogan}</h1>
          <button
            onClick={() => setShowModalUpdate(true)}
            className="mt-3 bg-green-400 text-white active:bg-green-400 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 self-auto"
          >
            Ganti Informasi Tenant
          </button>
        </div>
      </div>
    </>
  );
};

export default Umkm;
