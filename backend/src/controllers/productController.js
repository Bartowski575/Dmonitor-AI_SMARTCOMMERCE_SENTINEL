const { now } = require("mongoose");
const Product = require("../model/product.js");
const Enums = require("../utils/Enum.js"); // Assuming you have an Enums module for month names

// Simulate AI-powered analysis (replace with real AI logic as needed)
function aiAnalyzeProduct(product) {
  // Example: randomize for demo; replace with ML model or analytics
  return {
    availability: product.stock > 0 ? "In Stock" : "Out of Stock",
    qualityScore: Math.round(80 + Math.random() * 20), // 80-100
    demandScore: Math.round(Math.random() * 100), // 0-100
  };
}

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    console.log("Creating product with user:", req.user);
    req.body.updatedBy = req.user.userEmail; //Set the user who created the product(req.user is set by auth middleware)
    console.log("Creating product with data:", req.body);
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all products with AI-powered monitoring info
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }); // Fetch only active products
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    // Add AI-powered fields
    const monitored = await products.map((p) => ({
      ...p.toObject(),
      ...aiAnalyzeProduct(p),
    }));
    console.log("Monitored products:", monitored);
    res.status(200).json(monitored);
  } catch (error) {
    console.log;
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID with AI-powered info
exports.getProductBySku = async (req, res) => {
  try {
    const sku = req.params.sku;
    const product = await Product.findOne({ sku });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      ...product.toObject(),
      ...aiAnalyzeProduct(product),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    req.body.updatedBy = req.user.userEmail; // Set the user who updated the product(req.user is set by auth middleware)
    const product = await Product.findOneAndUpdate(
      { sku: req.params.sku },
      {
        $set: {
          sku: req.params.sku,
          updatedBy: req.body.updatedBy,
          stock: req.body.stock,
          updatedAt: now(),
        },
      },
      {
        new: true,
      }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      ...product.toObject(),
      ...aiAnalyzeProduct(product),
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({ message: error.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const updatedBy = req.user.userEmail; // Set the user who deleted the product(req.user is set by auth middleware)
    console.log("product update", req.user, req.params);
    const product = await Product.findOneAndUpdate(
      { sku: req.params.sku },
      { $set: { updatedBy, isActive: false, updatedAt: Date.now() } },
      { new: true }
    );
    console.log("delete product", product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted", sku: product.sku });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard stats (real-time monitoring summary)
exports.getDashboardStats = async (req, res) => {
  try {
    const products = await Product.find({isActive: true});
    const total = products.length;
    const inStock = products.filter((p) => p.stock > 0).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const avgQuality = Math.round(
      products.reduce((sum, p) => sum + aiAnalyzeProduct(p).qualityScore, 0) /
        (total || 1)
    );
    const highDemand = products.filter(
      (p) => aiAnalyzeProduct(p).demandScore > 70
    ).length;

    const stockTrend = products.map((p) => ({
      sku: p.sku,
      stock: p.stock,
      qualityScore: avgQuality,
      demandScore: highDemand,
      availability: aiAnalyzeProduct(p).availability,
      month: Enums.monthNames[p.updatedAt.getMonth() + 1], // Get month (1-12),
      year: p.updatedAt.getFullYear(), // Get year
    }));
    console.log("Dashboard stats:", {
      total,
      inStock,
      outOfStock,
      avgQuality,
      highDemand,
      stockTrend,
    });
    res.json({ total, inStock, outOfStock, avgQuality, highDemand, products, stockTrend});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
