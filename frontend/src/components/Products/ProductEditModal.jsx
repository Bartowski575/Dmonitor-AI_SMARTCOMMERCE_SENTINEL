import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProduct } from "../../redux/productSlice";

export default function ProductEditModal({ product }) {
  const [open, setOpen] = useState(false);
  const [stock, setStock] = useState(product.stock);
  const dispatch = useDispatch();

  const handleUpdate = () => {
    dispatch(updateProduct({ sku: product.sku, data: { stock } }));
    setOpen(false);
  };

  return (
    <>
      <button className="btn btn-sm btn-primary mt-2" onClick={() => setOpen(true)}>
        Edit
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-80">
            <h4 className="font-bold mb-2">Edit Product</h4>
            <input
              type="number"
              value={stock}
              onChange={e => setStock(e.target.value)}
              className="input input-bordered w-full mb-4"
            />
            <button className="btn btn-primary mr-2" onClick={handleUpdate}>Save</button>
            <button className="btn" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}