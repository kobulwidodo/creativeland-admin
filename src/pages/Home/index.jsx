import React from "react";
import NavigationBar from "../../components/Navbar";
import { useUserContext } from "../../context/userContext";

const Home = () => {
  const { userInfo } = useUserContext();

  return (
    <>
      <NavigationBar />
      <div className="max-w-7xl mx-auto py-5 px-4">
        <h1>Selamat Datang, {userInfo?.Nama}</h1>
      </div>
    </>
  );
};

export default Home;
