import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createMenu,
  deleteMenu,
  getListMenu,
  updateMenu,
} from "../../api/models/menu";
import MenuCard from "../../components/MenuCard";
import Modal from "../../components/Modal";
import Navbar from "../../components/Navbar";
import { useUserContext } from "../../context/userContext";
import useSnackbar from "../../hooks/useSnackbar";

const Menu = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [menuData, setMenuData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [selectedUpdateData, setSelectedUpdateData] = useState({});
  const [selectedDeleteData, setSelectedDeleteData] = useState(0);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const snackbar = useSnackbar();
  const { userInfo } = useUserContext();

  const fetchMenuData = async (id) => {
    try {
      const res = await getListMenu(id);
      setMenuData(res.data.data);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const handleCreateMenu = async (d) => {
    try {
      const res = await createMenu(userInfo.UmkmID, d);
      snackbar.success(res.data.meta.message);
      setRefreshData(!refreshData);
      setShowModalCreate(false);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const handleUpdateMenu = async (d) => {
    try {
      const res = await updateMenu(selectedUpdateData.ID, d);
      snackbar.success(res.data.meta.message);
      setRefreshData(!refreshData);
      setShowModalUpdate(false);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const handleDeleteMenu = async (e) => {
    e.preventDefault();
    try {
      const res = await deleteMenu(selectedDeleteData);
      snackbar.success(res.data.meta.message);
      setRefreshData(!refreshData);
      setShowModalDelete(false);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const handleClickEdit = (data) => {
    setSelectedUpdateData(data);
    setShowModalUpdate(true);
  };

  const handleClickDelete = (id) => {
    setSelectedDeleteData(id);
    setShowModalDelete(true);
  };

  useEffect(() => {
    if (userInfo?.UmkmID) {
      fetchMenuData(userInfo?.UmkmID);
    }
  }, [userInfo?.UmkmID, refreshData]);

  return (
    <>
      {showModalCreate ? (
        <Modal
          headerText="Tambah Menu"
          confirmText="Tambah"
          handleSubmit={handleSubmit(handleCreateMenu)}
          setShowModalClose={() => setShowModalCreate(false)}
        >
          <div className="mb-5">
            <input
              type="text"
              className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
              placeholder="Masukan Nama Menu"
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
              placeholder="Masukan Description Menu"
              {...register("description", { required: true })}
            />
            {errors.description && (
              <span className="text-sm text-red-600">
                Deskripsi wajib diisi
              </span>
            )}
          </div>
          <div className="mb-5">
            <input
              type="number"
              className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
              placeholder="Masukan Harga"
              {...register("price", { required: true })}
            />
            {errors.price && (
              <span className="text-sm text-red-600">Harga wajib diisi</span>
            )}
          </div>
        </Modal>
      ) : null}
      {showModalUpdate ? (
        <Modal
          headerText="Ubah Menu"
          confirmText="Ubah"
          handleSubmit={handleSubmit(handleUpdateMenu)}
          setShowModalClose={() => setShowModalUpdate(false)}
        >
          <div className="mb-5">
            <input
              type="text"
              className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
              placeholder="Masukan Nama Menu"
              {...register("name", { value: selectedUpdateData.Name })}
            />
          </div>
          <div className="mb-5">
            <input
              type="text"
              className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
              placeholder="Masukan Description Menu"
              {...register("description", {
                value: selectedUpdateData.Description,
              })}
            />
          </div>
          <div className="mb-5">
            <input
              type="number"
              className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
              placeholder="Masukan Harga"
              {...register("price", {
                value: selectedUpdateData.Price,
              })}
            />
          </div>
        </Modal>
      ) : null}
      {showModalDelete ? (
        <Modal
          headerText="Hapus Menu"
          confirmText="Hapus"
          handleSubmit={handleDeleteMenu}
          setShowModalClose={() => setShowModalDelete(false)}
        >
          <h1>Apakah anda yakin ingin menghapus menu?</h1>
        </Modal>
      ) : null}
      <Navbar />
      <div className="max-w-7xl mx-auto py-5 px-4">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-3xl">Menu</h1>
          <button
            className="bg-green-400 text-white active:bg-green-400 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 self-auto"
            onClick={() => setShowModalCreate(true)}
          >
            Tambah Menu
          </button>
        </div>
        {menuData.map((item, key) => {
          return (
            <MenuCard
              onClickEdit={() => handleClickEdit(item)}
              onClickDelete={() => handleClickDelete(item.ID)}
              key={key}
              menuName={item.Name}
              description={item.Description}
              pricePerItem={item.Price}
            />
          );
        })}
      </div>
    </>
  );
};

export default Menu;
