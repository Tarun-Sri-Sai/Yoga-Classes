import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const Layout = () => {
  return (
    <>
      <h1 className="text-center text-4xl font-bold mt-4">
        Yoga Classes Management System
      </h1>
      <NavBar />
      <Outlet />
    </>
  );
};

export default Layout;
