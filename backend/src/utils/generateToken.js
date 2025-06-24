const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = async (user, res) => {
    console.log("Generating token for user:", user);
 const token = jwt.sign(
    { userId: user._id, userEmail : user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET || 'SECRET',
    { expiresIn: "15d" }
  );
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development" || "development",
    sameSite: "strict",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
  return token;
};

module.exports = generateTokenAndSetCookie;