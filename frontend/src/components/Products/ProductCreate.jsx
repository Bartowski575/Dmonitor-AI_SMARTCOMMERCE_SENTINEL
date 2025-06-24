import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../redux/productSlice";
import { useNavigate } from "react-router-dom";

export default function ProductCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const initialState = {
    sku: "",
    stock: 0,
    modelCode: "",
  };
  const [form, setForm] = useState(initialState);
  const [modal, setModal] = useState({
    open: false,
    success: false,
    message: "",
  });

  //   if (!user?.isAdmin) return <div className="p-6 text-red-600">Admin access only.</div>;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(createProduct(form));
      if (createProduct.fulfilled.match(resultAction)) {
        setModal({
          open: true,
          success: true,
          message: "SKU Created Successfully",
        });
        // Do NOT reset form or navigate here; wait for user to click OK
      } else {
        setModal({
          open: true,
          success: false,
          message: "Something Went Wrong",
        });
      }
    } catch {
      setModal({ open: true, success: false, message: "Something Went Wrong" });
    }
  };

  const closeModal = () => {
    setModal({ ...modal, open: false });
    if (modal.success) {
      setForm(initialState); // Reset form only on success
      // Optionally, navigate("/products");
    }
  };

  // ...existing code...
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#152331] via-[#2d5577] to-[#112b4d] relative">
      <div className="max-w-lg w-full p-8 bg-[#152331] rounded-2xl shadow-2xl ring-4 ring-indigo-200 border border-indigo-300 relative">
        {/* Modal as floating notification */}
        {modal.open && (
          <div className="absolute left-1/2 -translate-x-1/2 -top-20 z-20">
            <div className="bg-white rounded-lg shadow-2xl px-8 py-6 flex flex-col items-center border-2 border-indigo-200">
              <span
                className={`text-3xl mb-2 ${
                  modal.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {modal.success ? "✅" : "❌"}
              </span>
              <p className="mb-2 text-lg">{modal.message}</p>
              <button className="btn btn-primary btn-sm" onClick={closeModal}>
                OK
              </button>
            </div>
          </div>
        )}
        <h2 className="text-3xl font-extrabold mb-8 text-white text-center drop-shadow">
          CREATE PRODUCT
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <label
              htmlFor="sku"
              className="block w-36 text-black text-center font-semibold bg-white rounded-lg px-3 py-2 shadow"
            >
              SKU
            </label>
            <input
              id="sku"
              name="sku"
              placeholder="Enter SKU (e.g., SKU12345)"
              className="input input-bordered flex-1 shadow border-e-gray-50"
              value={form.sku}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label
              htmlFor="modelCode"
              className="block w-36 text-black text-center font-semibold bg-white rounded-lg px-3 py-2 shadow"
            >
              ModelCode
            </label>
            <input
              id="modelCode"
              name="modelCode"
              placeholder="Enter modelCode (e.g., SKU12345INS)"
              className="input input-bordered flex-1 shadow border-e-gray-50"
              value={form.modelCode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label
              htmlFor="stock"
              className="block w-36 text-black text-center font-semibold bg-white rounded-lg px-3 py-2 shadow"
            >
              Stock
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              placeholder="Enter Quantity"
              className="input input-bordered flex-1 shadow border-e-gray-50"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary bg-white text-black shadow-lg">
              CREATE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
