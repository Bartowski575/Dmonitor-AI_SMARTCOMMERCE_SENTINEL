const express = require('express');
const router = express.Router();
const { signup, login, validateUser } = require('../controllers/authController');
const auth = require('../middleware/auth.js');


router.post('/signup', signup);
router.post('/login', login);
router.get("/validateUser", auth, validateUser);

module.exports = router;
// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected');
//   } catch (err) {
//     console.error(err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;