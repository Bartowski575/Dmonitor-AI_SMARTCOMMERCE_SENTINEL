const Product = require('../model/product');
const axios = require('axios');

// Helper: Call AI model for prediction
async function callAIModel(endpoint, payload) {
  try {
    const { data } = await axios.post(`http://localhost:4000/predict/${endpoint}`, payload);
    return data.prediction;
  } catch (err) {
    console.error(`AI model error (${endpoint}):`, err.message);
    return null;
  }
}

exports.updateAndPredict = async (req, res) => {
  try {
    const { productId, stock, qualityInput, demandInput, recent_sales } = req.body;

    // 1. Update product with provided values
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        ...(stock !== undefined && { stock }),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!product) return res.status(404).json({ error: 'Product not found' });

    // 2. Predict qualityScore, demandScore, and availability using AI
    const [qualityScore, demandScore, availability] = await Promise.all([
      callAIModel('quality', { productId, qualityInput, stock }),
      callAIModel('demand', { productId, demandInput, stock }),
      callAIModel('availability', { productId, stock, recent_sales: recent_sales || 0 })
    ]);

    // 3. Update product with AI predictions
    product.qualityScore = qualityScore ?? product.qualityScore;
    product.demandScore = demandScore ?? product.demandScore;
    product.stock = availability ?? product.stock;
    product.updatedAt = new Date();
    await product.save();

    res.json({
      productId: product._id,
      sku: product.sku,
      qualityScore: product.qualityScore,
      demandScore: product.demandScore,
      availability: product.stock,
      updatedAt: product.updatedAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};