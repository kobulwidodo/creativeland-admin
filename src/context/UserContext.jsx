import React, { createContext, useContext, useEffect, useState } from "react";
import { coreApi } from "../api";
import { getUser } from "../api/models/user";
import useSnackbar from "../hooks/useSnackbar";

export const defaultValue = {
  isAuthenticated: !!localStorage.getItem("cl_admin_token"),
  userInfo: null,
  login: () => {},
  logout: () => {},
  fetchUser: () => {},
};

const UserContext = createContext(defaultValue);

export const UserWrapper = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    defaultValue.isAuthenticated
  );
  const [userInfo, setUserInfo] = useState(defaultValue.userInfo);

  const snackbar = useSnackbar();

  const login = (token) => {
    coreApi.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    console.log(token);
    localStorage.setItem("cl_admin_token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserInfo({});
    localStorage.removeItem("cl_admin_token");
    coreApi.defaults.headers.common["Authorization"] = "";
    snackbar.success("Successfully logout");
  };

  const fetchUser = async () => {
    try {
      const res = await getUser();
      if (res.data.data) {
        setUserInfo(res.data.data);
        console.log(res.data.data);
      }
    } catch (error) {
      snackbar.error(error.response?.meta.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        userInfo,
        fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
