import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../context/userContext";

const AdminRoute = () => {
  const { userInfo } = useUserContext();

  if (!userInfo?.IsAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoute;
