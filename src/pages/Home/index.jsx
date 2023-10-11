import React, { useEffect, useState } from "react";
import {
  getAllDashboardAnalytic,
  getDashboardAnalytic,
} from "../../api/models/analytic";
import NavigationBar from "../../components/Navbar";
import { useUserContext } from "../../context/userContext";
import useSnackbar from "../../hooks/useSnackbar";

const Home = () => {
  const [data, setData] = useState({});
  const { userInfo } = useUserContext();
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

  useEffect(() => {
    if (userInfo?.IsAdmin) {
      fetchAllDashboardAnalytic();
    } else {
      if (userInfo?.UmkmID) {
        fetchDashboardAnalytic(userInfo?.UmkmID);
      }
    }
  }, [userInfo?.UmkmID]);

  return (
    <>
      <NavigationBar />
      <div className="max-w-7xl mx-auto py-5 px-4">
        <h4 className="mb-5">Selamat Datang, {userInfo?.Nama}</h4>
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
