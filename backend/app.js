const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const dotenv = require("dotenv");
const app = express();
const path = require("path");
const productAIRoutes = require('./src/routes/productAIRoutes');

dotenv.config({ path: path.join(process.cwd(), "..", ".env") });
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true,
  })
);
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use('/api/product', productAIRoutes);
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/products", require("./src/routes/productRoutes"));
// const __dirname = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));

//   app.get(/(.*)/, (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//   });
// }
// app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  connectDB();
});
