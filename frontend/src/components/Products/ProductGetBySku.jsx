import React, { useState } from "react";
import axios from "axios";

export default function ProductGetBySku() {
  const [sku, setSku] = useState("");
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setProduct(null);
    try {
      const response = await axios.get(`/api/products/${sku}`);
      setProduct(response.data);
      setSku("");
    } catch (err) {
      setError("Product not found");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181F2C] via-[#232B3E] to-[#1A2233]">
      <div className="w-full max-w-xl bg-[#fdfdfd] p-8 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-[#2a373d] text-center">Get Product by SKU</h2>
        <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
          {/* <label htmlFor="sku" className="text-base bg-blue-950 text-white font-extrabold md:mb-0 md:mr-2 w-full md:w-auto text-center md:text-left">
            SKU:
          </label> */}
          <input
            id="sku"
            className="input input-bordered w-full md:w-64"
            placeholder="Enter SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
          <button className="btn btn-primary md:ml-2 w-full md:w-auto" onClick={handleSearch}>
            Search
          </button>
        </div>
        {product && (
          <div className="bg-white p-4 rounded shadow mt-4">
            <h3 className="font-semibold text-lg text-[#232B3E]">{product.sku}</h3>
            <p className="text-gray-700">Stock: {product.stock}</p>
            <p className="text-gray-700">Quality: {product.qualityScore}</p>
            <p className="text-gray-700">Demand: {product.demandScore}</p>
          </div>
        )}
        {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
      </div>
    </div>
  );
}