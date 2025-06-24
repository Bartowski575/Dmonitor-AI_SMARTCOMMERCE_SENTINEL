import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../redux/productSlice";

export default function ProductDetails() {
  const { sku } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProduct(sku));
  }, [dispatch, sku]);

  if (loading || !product) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Product Details</h2>
      <div className="mb-2"><b>SKU:</b> {product.sku}</div>
      <div className="mb-2"><b>Stock:</b> {product.stock}</div>
      <div className="mb-2"><b>Quality Score:</b> {product.qualityScore}</div>
      <div className="mb-2"><b>Demand Score:</b> {product.demandScore}</div>
      <div className="flex gap-2 mt-4">
        <Link to="/products" className="btn btn-secondary">Back</Link>
        <Link to={`/products/${product._id}/edit`} className="btn btn-warning">Edit</Link>
      </div>
    </div>
  );
}