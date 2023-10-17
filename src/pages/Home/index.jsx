import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getAllDashboardAnalytic,
  getDashboardAnalytic,
} from "../../api/models/analytic";
import { updateUmkm } from "../../api/models/umkm";
import Modal from "../../components/Modal";
import NavigationBar from "../../components/Navbar";
import { useUserContext } from "../../context/userContext";
import useSnackbar from "../../hooks/useSnackbar";

const Home = () => {
  const { handleSubmit } = useForm();
  const [data, setData] = useState({});
  const [refreshData, setRefreshData] = useState(false);
  const [showModalStatus, setShowModalStatus] = useState(false);
  const { userInfo, fetchUser } = useUserContext();
  const snackbar = useSnackbar();

  const fetchDashboardAnalytic = async (id) => {
    try {
      const res = await getDashboardAnalytic(id);
      setData(res.data.data);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const fetchAllDashboardAnalytic = async () => {
    try {
      const res = await getAllDashboardAnalytic();
      setData(res.data.data);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const param = {
        status: userInfo?.UmkmStatus === "open" ? "close" : "open",
      };
      const res = await updateUmkm(userInfo.UmkmID, param);
      snackbar.success(res.data.meta.message);
      await fetchUser();
      setRefreshData(!refreshData);
      setShowModalStatus(false);
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  const handleOnClickStatus = () => {
    setShowModalStatus(true);
  };

  useEffect(() => {
    if (userInfo?.IsAdmin) {
      fetchAllDashboardAnalytic();
    } else {
      if (userInfo?.UmkmID) {
        fetchDashboardAnalytic(userInfo?.UmkmID);
      }
    }
  }, [userInfo?.UmkmID, refreshData]);

  return (
    <>
      {showModalStatus ? (
        <Modal
          headerText="Konfirmasi"
          confirmText="Ya"
          setShowModalClose={() => setShowModalStatus(false)}
          handleSubmit={handleSubmit(handleUpdateStatus)}
        >
          <div className="">
            <h1>
              Anda ingin{" "}
              {userInfo?.UmkmStatus === "open" ? "Menutup" : "Membuka"} toko?
            </h1>
          </div>
        </Modal>
      ) : null}
      <NavigationBar />
      <div className="max-w-7xl mx-auto py-5 px-4">
        <h4 className="mb-5">Selamat Datang, {userInfo?.Nama}</h4>
        {!userInfo?.IsAdmin ? (
          <div className="">
            <hr />
            <div className="flex justify-between items-center">
              <div className="text-2xl my-3">
                Status Toko :{" "}
                {userInfo?.UmkmStatus === "open" ? "Buka" : "Tutup"}
              </div>
              <div className="">
                {userInfo?.UmkmStatus === "open" ? (
                  <button
                    onClick={() => handleOnClickStatus()}
                    className="px-2 py-1 bg-red-400 rounded-md text-bold text-white"
                  >
                    Tutup Toko
                  </button>
                ) : (
                  <button
                    onClick={() => handleOnClickStatus()}
                    className="px-2 py-1 bg-green-400 rounded-md text-bold text-white"
                  >
                    Buka Toko
                  </button>
                )}
              </div>
            </div>
            <p className="mb-3">
              Jangan lupa untuk tutup toko jika sudah selesai berjualan ^_^
            </p>
            <hr />
          </div>
        ) : null}
        <div className="flex gap-x-4">
          <div className="w-full rounded-xl px-3 py-5 shadow-sm">
            <p>Total Pesanan Hari ini</p>
            <p className="text-xl mt-2">{data.TotalTodayTransaction}</p>
          </div>
          <div className="w-full rounded-xl px-3 py-5 shadow-sm">
            <p>Total Pesanan Kemarin</p>
            <p className="text-xl mt-2">{data.TotalYesterdayTransaction}</p>
          </div>
        </div>
        <div className="flex gap-x-4">
          <div className="w-full rounded-xl px-3 py-5 shadow-sm">
            <p>Total Penghasilan Hari ini</p>
            <p className="text-xl mt-2">Rp {data.TotalTodayRevenue}</p>
          </div>
          <div className="w-full rounded-xl px-3 py-5 shadow-sm">
            <p>Total Penghasilan Kemarin</p>
            <p className="text-xl mt-2">Rp {data.TotalYesterdayRevenue}</p>
          </div>
        </div>
        <div className="flex gap-x-4">
          <div className="w-full rounded-xl px-3 py-5 shadow-sm">
            <p>Total Pesanan Bulan ini</p>
            <p className="text-xl mt-2">{data.TotalMonthTransaction}</p>
          </div>
          <div className="w-full rounded-xl px-3 py-5 shadow-sm">
            <p>Total Pesanan Bulan Kemarin</p>
            <p className="text-xl mt-2">{data.TotalLastMonthTransaction}</p>
          </div>
        </div>
        <div className="flex gap-x-4">
          <div className="w-full rounded-xl px-3 py-5 shadow-sm">
            <p>Total Penghasilan Bulan ini</p>
            <p className="text-xl mt-2">Rp {data.TotalMonthRevenue}</p>
          </div>
          <div className="w-full rounded-xl px-3 py-5 shadow-sm">
            <p>Total Penghasilan Bulan Lalu</p>
            <p className="text-xl mt-2">Rp {data.TotalLastMonthRevenue}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
