const express = require('express');
const router = express.Router();
const {updateAndPredict} = require('../controllers/productAIController');

// POST /api/product/ai-update
router.post('/ai-update', updateAndPredict);

module.exports = router;