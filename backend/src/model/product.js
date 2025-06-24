const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  sku: String,
  modelCode: String,
  stock: Number,
  qualityScore: Number,
  demandScore: Number,
  updatedBy: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);

