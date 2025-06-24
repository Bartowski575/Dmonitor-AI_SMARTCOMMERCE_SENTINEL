import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSettings, FiChevronDown, FiGrid, FiBox } from "react-icons/fi";
import { useSelector } from "react-redux";

export default function HomePage() {
  const [productsOpen, setProductsOpen] = useState(false);
  const { user } = useSelector((state) => state.user); // assuming user object has isAdmin

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-center">
      <div className="absolute top-6 right-10">
        {/* Settings Dropdown */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <FiSettings className="w-7 h-7 text-blue-900" />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-box w-56"
          >
            <li>
              <Link to="/dashboard" className="flex items-center gap-2">
                <FiGrid /> Dashboard
              </Link>
            </li>
            <li
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <a className="flex items-center gap-2">
                <FiBox /> Products
                <FiChevronDown className="ml-auto" />
              </a>
              {/* Submenu */}
              {productsOpen && (
                <ul className="absolute left-full top-0 mt-0 ml-2 menu menu-sm bg-white shadow rounded-box w-60 z-10">
                  <li>
                    <Link to="/products">Get All Products</Link>
                  </li>
                  <li>
                    <Link to="/products/get-by-sku">Get Product by SKU</Link>
                  </li>
                  <li>
                    <Link to="/products/create">Create New Product</Link>
                  </li>
                  <li>
                    <Link to="/products/sku">
                      Delete Product by SKU
                    </Link>
                  </li>
                  <li>
                    <Link to="/products/sku">Update Product</Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-4">
          Welcome to Dmonitor
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Your smart commerce sentinel dashboard.
        </p>
        <Link
          to="/dashboard"
          className="btn btn-primary btn-lg rounded-full px-8 shadow"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
