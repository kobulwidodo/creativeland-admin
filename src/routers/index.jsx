import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { UserWrapper } from "../context/userContext";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Menu from "../pages/Menu";
import Transaction from "../pages/Transaction";
import TransactionHistory from "../pages/TransactionHistory";
import Umkm from "../pages/Umkm";
import AuthRoute from "./AuthRoute";
import ProtectedRoute from "./ProtectedRoute";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const Routers = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <UserWrapper>
        <Routes>
          <Route element={<AuthRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/umkm" element={<Umkm />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route
              path="/transaction-history"
              element={<TransactionHistory />}
            />
          </Route>
        </Routes>
      </UserWrapper>
    </BrowserRouter>
  );
};

export default Routers;
