import React from "react";
import { useForm } from "react-hook-form";
import { loginAdmin } from "../../api/models/user";
import { useUserContext } from "../../context/userContext";
import useSnackbar from "../../hooks/useSnackbar";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const snackbar = useSnackbar();
  const { login } = useUserContext();

  const onSubmit = async (d) => {
    try {
      const res = await loginAdmin(d.username, d.password);
      login(res.data.data.token);
      snackbar.success("Selamat Datang!");
    } catch (error) {
      snackbar.error(error.response?.data.meta.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-xl text-center my-10">Login Admin</h1>
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <input
            className="border rounded-xl px-5 py-2 w-full"
            type="text"
            name="username"
            placeholder="Username"
            {...register("username", { required: true })}
          />
          {errors.username && (
            <span className="text-sm text-red-600">Username wajib diisi</span>
          )}
        </div>
        <div className="mb-3">
          <input
            className="border rounded-xl px-5 py-2 w-full"
            type="password"
            name="password"
            placeholder="Password"
            {...register("password", { required: true })}
          />
          {errors.username && (
            <span className="text-sm text-red-600">Password wajib diisi</span>
          )}
        </div>
        <div className="mb-3 text-right">
          <button
            className="px-5 py-2 bg-blue-500 rounded-xl text-white font-bold"
            type="submit"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
