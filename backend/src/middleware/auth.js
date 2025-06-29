const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.cookies?.jwt; // <-- get token from cookie
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET');
    console.log("decoded", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
