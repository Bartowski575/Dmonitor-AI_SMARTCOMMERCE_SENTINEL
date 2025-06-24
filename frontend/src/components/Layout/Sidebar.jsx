import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FiUser,
  FiBox,
  FiGrid,
  FiBarChart2,
  FiMail,
  FiLogOut,
} from "react-icons/fi";
import { logout } from "../../redux/userSlice";
import logo from "../../assets/Dlogo1.png";

export default function Sidebar() {
  const { user } = useSelector((state) => state.user);
  const [productsOpen, setProductsOpen] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-[#152331] via-[#2d5577] to-[#040b20] shadow-2xl fixed left-0 top-0 z-20 flex flex-col">
      <div>
        {/* <img src={logo} className="w-14 h-14 inline-block" /> */}
        <p className=" inline-block text-center text-4xl bg-linear-330 from-cyan-50 via-purple-100 to-sky-900 text-transparent bg-clip-text font-extrabold mx-9 my-5">Dmonitor</p>
        <hr className="text-black shadow-2xl"></hr>
      </div>
      {/* User Profile Section */}
      <div className="flex items-center gap-4 p-5 bg-gradient-to-r shadow-xl border-b-4 backdrop-blur-md">
        <div className="bg-gradient-to-br shadow-xl p-1">
          <div className="bg-white p-2 flex items-center justify-center rounded-full">
            <FiUser className="w-9 h-9 rounded-full" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-white text-lg tracking-wide drop-shadow">
            {user?.name || "Profile"}
          </div>
          <div
            className="text-xs text-blue-100 font-medium tracking-wide truncate max-w-[9rem] cursor-pointer"
            title={user?.email || "user"}
          >
            {user?.email || "user"}
          </div>
        </div>
      </div>
      <ul className="menu p-4 flex-1 text-base font-semibold">
        {/* Dashboard */}
        <li>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-white hover:bg-[#22304A] rounded-lg px-3 py-2 transition"
          >
            <FiGrid className="w-6 h-6 text-white" />
            Dashboard
          </Link>
        </li>
        {/* Products with hover submenu */}
        <li
          className="relative"
          onMouseEnter={() => setProductsOpen(true)}
          onMouseLeave={() => setProductsOpen(false)}
        >
          <div className="flex items-center gap-3 text-white hover:bg-[#1B314A] rounded-lg px-3 py-2 cursor-pointer transition">
            <FiBox className="w-6 h-6 text-white" />
            Products
          </div>
          {productsOpen && (
            <ul className="absolute left-full top-0 mt-0 ml-2 min-w-[190px] menu bg-[#232B3E] shadow-lg rounded-xl text-white z-30 border border-[#334155]">
              <li>
                <Link
                  to="/products/create"
                  className="hover:bg-[#22304A] rounded-lg px-3 py-2"
                >
                  Create Product
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:bg-[#22304A] rounded-lg px-3 py-2"
                >
                  Get All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/products/sku"
                  className="hover:bg-[#22304A] rounded-lg px-3 py-2"
                >
                  Delete Product
                </Link>
              </li>
              <li>
                <Link
                  to="/products/get-by-sku"
                  className="hover:bg-[#22304A] rounded-lg px-3 py-2"
                >
                  Get Product by SKU
                </Link>
              </li>
              <li>
                <Link
                  to="/products/sku"
                  className="hover:bg-[#22304A] rounded-lg px-3 py-2"
                >
                  Update Product
                </Link>
              </li>
            </ul>
          )}
        </li>
        {/* Reports */}
        <li>
          <Link
            to="/reports"
            className="flex items-center gap-3 text-white hover:bg-[#14532D] rounded-lg px-3 py-2 transition"
          >
            <FiBarChart2 className="w-6 h-6 text-white" />
            Reports
          </Link>
        </li>
        {/* Contact Us */}
        <li>
          <Link
            to="/contact"
            className="flex items-center gap-3 text-white hover:bg-[#831843] rounded-lg px-3 py-2 transition"
          >
            <FiMail className="w-6 h-6 text-white" />
            Contact Us
          </Link>
        </li>
      </ul>
      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 justify-center bg-gradient-to-r from-[#14213c] to-[#676d6f] text-white font-bold py-2 rounded-xl shadow hover:from-[#565d75] hover:to-[#a3acb0] transition"
        >
          <FiLogOut className="w-6 h-6" />
          Logout
        </button>
      </div>
    </aside>
  );
}
