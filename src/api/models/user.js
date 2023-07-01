import { coreApi } from "..";

export const loginAdmin = (username, password) => {
  const param = {
    username: username,
    password: password,
  };
  return coreApi.post("/v1/auth/login", param);
};

export const getUser = () => {
  return coreApi.get("/v1/user/me");
};
