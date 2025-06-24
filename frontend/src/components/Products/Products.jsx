import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../../redux/productSlice";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { products } = useSelector((state) => state.products);
  const [deletedSku, setDeletedSku] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  // Inline edit state
  const [editingSku, setEditingSku] = useState(null);
  const [editStock, setEditStock] = useState("");
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (location.state && location.state.deletedSku) {
      setDeletedSku(location.state.deletedSku);
      setShowDialog(true);
      window.history.replaceState({}, document.title);
    }
    dispatch(fetchProducts());
  }, [dispatch, location.state]);

  const handleDelete = async (sku) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setDeletedSku(sku);
      setShowDialog(true);
      const result = await dispatch(deleteProduct(sku));
      if (result.meta.requestStatus === "fulfilled") {
        await dispatch(fetchProducts());
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingSku(product.sku);
    setEditStock(product.stock);
    setEditError("");
  };

  const handleEditCancel = () => {
    setEditingSku(null);
    setEditStock("");
    setEditError("");
  };

  const handleEditSave = async (sku) => {
    setEditLoading(true);
    setEditError("");
    try {
      await axios.put(`/api/products/${sku}`, { stock: editStock });
      setEditingSku(null);
      setEditStock("");
      await dispatch(fetchProducts());
    } catch {
      setEditError("Failed to update stock.");
    }
    setEditLoading(false);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setDeletedSku("");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/products/create")}
        >
          + Add Product
        </button>
      </div>
      {showDialog && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          SKU <span className="font-bold">{deletedSku}</span> deleted
          successfully.
          <button
            className="ml-4 text-sm text-blue-600 underline"
            onClick={handleCloseDialog}
          >
            Close
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded shadow">
            <Link to={`/products/${product.sku}`}>
              <h3 className="font-semibold text-lg hover:underline">
                {product.sku || product.name}
              </h3>
            </Link>
            <p>
              Stock:{" "}
              {editingSku === product.sku ? (
                <>
                  <input
                    type="number"
                    className="input input-bordered input-xs w-20 mr-2"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    disabled={editLoading}
                  />
                  <button
                    className="btn btn-xs btn-primary mr-1"
                    onClick={() => handleEditSave(product.sku)}
                    disabled={editLoading}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-xs btn-secondary"
                    onClick={handleEditCancel}
                    disabled={editLoading}
                  >
                    Cancel
                  </button>
                  {editError && (
                    <span className="text-red-500 ml-2">{editError}</span>
                  )}
                </>
              ) : (
                <>{product.stock}</>
              )}
            </p>
            <p>Quality: {product.qualityScore}</p>
            <p>Demand: {product.demandScore}</p>
            <div className="flex gap-2 mt-2">
              {editingSku !== product.sku && (
                <button
                  className="btn btn-xs btn-warning"
                  onClick={() => handleEditClick(product)}
                >
                  UPDATE
                </button>
              )}
              <button
                className="btn btn-xs btn-error"
                onClick={() => handleDelete(product.sku)}
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
