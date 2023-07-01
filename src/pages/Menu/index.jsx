import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createMenu,
  deleteMenu,
  getListMenu,
  updateMenu,
} from "../../api/models/menu";
import MenuCard from "../../components/MenuCard";
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
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 px-3 outline-none focus:outline-none">
            <div className="relative my-6 mx-auto max-w-3xl w-full">
              {/*content*/}
              <form
                className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
                onSubmit={handleSubmit(handleCreateMenu)}
              >
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Tambah Menu</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModalCreate(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      x
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="mb-5">
                    <input
                      type="text"
                      className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                      placeholder="Masukan Nama Menu"
                      {...register("name")}
                    />
                    {errors.name && (
                      <span className="text-sm text-red-600">
                        Nama wajib diisi
                      </span>
                    )}
                  </div>
                  <div className="mb-5">
                    <input
                      type="text"
                      className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                      placeholder="Masukan Description Menu"
                      {...register("description")}
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
                      {...register("price")}
                    />
                    {errors.price && (
                      <span className="text-sm text-red-600">
                        Harga wajib diisi
                      </span>
                    )}
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b gap-x-5">
                  <button
                    className="bg-green-400 text-white active:bg-green-400 font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="submit"
                  >
                    Buat
                  </button>
                  <button
                    className="bg-red-400 text-white active:bg-red-400 font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModalCreate(false)}
                  >
                    Tutup
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      {showModalUpdate ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 px-3 outline-none focus:outline-none">
            <div className="relative my-6 mx-auto max-w-3xl w-full">
              {/*content*/}
              <form
                className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
                onSubmit={handleSubmit(handleUpdateMenu)}
              >
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Update Menu</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModalUpdate(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      x
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
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
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b gap-x-5">
                  <button
                    className="bg-green-400 text-white active:bg-green-400 font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="submit"
                  >
                    Simpan
                  </button>
                  <button
                    className="bg-red-400 text-white active:bg-red-400 font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModalUpdate(false)}
                  >
                    Tutup
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      {showModalDelete ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 px-3 outline-none focus:outline-none">
            <div className="relative my-6 mx-auto max-w-3xl w-full">
              {/*content*/}
              <form
                className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
                onSubmit={handleDeleteMenu}
              >
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Hapus Menu</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModalDelete(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      x
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <h1>Apakah anda yakin ingin menghapus menu?</h1>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b gap-x-5">
                  <button
                    className="bg-red-400 text-white active:bg-red-400 font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="submit"
                  >
                    Hapus
                  </button>
                  <button
                    className="bg-blue-400 text-white active:bg-blue-400 font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModalDelete(false)}
                  >
                    Tutup
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
