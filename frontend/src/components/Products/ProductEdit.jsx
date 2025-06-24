import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductEdit() {
  const { sku: paramSku } = useParams();
  const navigate = useNavigate();

  const [sku, setSku] = useState(paramSku || "");
  const [product, setProduct] = useState(null);
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [showSkuInput, setShowSkuInput] = useState(!paramSku);

  // Fetch product if SKU param exists
  useEffect(() => {
    if (paramSku) {
      setLoading(true);
      axios
        .get(`/api/products/${paramSku}`)
        .then((res) => {
          setProduct(res.data);
          setStock(res.data.stock);
          setLoading(false);
        })
        .catch(() => {
          setLocalError("Product not found.");
          setLoading(false);
        });
    }
  }, [paramSku]);

  // Handler for SKU input and fetch
  const handleSkuSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setProduct(null);
    setLoading(true);
    try {
      const res = await axios.get(`/api/products/${sku}`);
      setProduct(res.data);
      setStock("");
      setShowSkuInput(false);
    } catch {
      setLocalError("Product not found.");
    }
    setLoading(false);
  };

  // Handler for update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLoading(true);
    try {
      const res = await axios.put(`/api/products/${product.sku}`, { stock });
      setProduct(res.data);
      navigate("/products");
    } catch {
      setLocalError("Failed to update product.");
    }
    setLoading(false);
  };

  // Handler for delete
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setLocalError("");
    setLoading(true);
    try {
      await axios.delete(`/api/products/${product.sku}`);
      navigate("/products");
    } catch {
      setLocalError("Failed to delete product.");
    }
    setLoading(false);
  };

  // Show SKU input if needed
  if (showSkuInput) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={handleSkuSubmit} className="flex flex-col gap-4">
          <input
            name="sku"
            placeholder="Enter SKU"
            className="input input-bordered"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Loading..." : "Load Product"}
          </button>
          {localError && <div className="text-red-500">{localError}</div>}
        </form>
      </div>
    );
  }

  // If loading or no product, show loading
  if (loading || !product) {
    return <div className="p-6">Loading...</div>;
  }

  // Show product info card and edit/delete form
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <div className="bg-[#F3F4F6] p-4 rounded shadow mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-lg text-[#232B3E]">{product.sku}</span>
          <div className="flex gap-2">
            <button
              className="btn btn-sm btn-outline"
              onClick={() => {
                setShowSkuInput(true);
                setProduct(null);
                setSku("");
                setStock("");
                setLocalError("");
              }}
            >
              Change SKU
            </button>
            <button
              className="btn btn-sm btn-error"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </div>
        <div className="text-gray-700">Stock: {product.stock}</div>
        <div className="text-gray-700">Quality: {product.qualityScore}</div>
        <div className="text-gray-700">Demand: {product.demandScore}</div>
      </div>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          className="input input-bordered"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
        {localError && <div className="text-red-500">{localError}</div>}
      </form>
    </div>
  );
}