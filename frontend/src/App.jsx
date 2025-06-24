import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ResetPassword from "./components/Auth/ResetPassword";
import Dashboard from "./components/Dashboard/Dashboard";
import Products from "./components/Products/Products";
import ProductCreate from "./components/Products/ProductCreate";
import ProductEdit from "./components/Products/ProductEdit";
import ProductDetails from "./components/Products/ProductDetails";
import HomePage from "./components/Auth/HomePage";
import LoadingSpinner from "./components/LoadingSpinner";
import Sidebar from "./components/Layout/Sidebar";
import AuthenticatedLayout from "./components/Layout/AuthenticatedLayout";
import ProductGetBySku from "./components/Products/ProductGetBySku";
import { validateUser } from "./redux/userSlice"; // Make sure this thunk exists
import ContactForm from "./components/ContactUsPage";

function App() {
  const dispatch = useDispatch();
  const { user: authUser, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(validateUser());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Authenticated routes */}
      {authUser && (
        <Route
          path="/*"
          element={
            <AuthenticatedLayout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/create" element={<ProductCreate />} />
                <Route path="/products/:id/edit" element={<ProductEdit />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route
                  path="/products/get-by-sku"
                  element={<ProductGetBySku />}
                />
                <Route path="/products/sku" element={<ProductEdit />} />
                <Route path="/contact" element={<ContactForm />} />{" "}
                {/* Add more authenticated routes here */}
              </Routes>
            </AuthenticatedLayout>
          }
        />
      )}

      {/* Redirect all other routes to login if not authenticated */}
      {!authUser && <Route path="*" element={<Navigate to="/login" />} />}
    </Routes>
  );
}

export default App;
