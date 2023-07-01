import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import useSnackbar from "../hooks/useSnackbar";

const ProtectedRoute = () => {
  const { isAuthenticated } = useUserContext();
  const snackbar = useSnackbar();

  if (isAuthenticated) {
    return <Outlet />;
  }

  snackbar.error("Login required");
  return <Navigate to="/login" />;
};

export default ProtectedRoute;
