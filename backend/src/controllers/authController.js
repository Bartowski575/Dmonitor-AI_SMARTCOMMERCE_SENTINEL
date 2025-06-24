const User = require("../model/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateTokenAndSetCookie = require("../utils/generateToken.js");
const { result } = require("lodash");

exports.signup = async (req, res) => {
  try {
    const { email, password, mobile } = req.body;
    console.log("req.body", req.body);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid Email Format" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        error: "Email is already registered. pls signin with your account",
      });
    }
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({
        error:
          "Mobile number is already registered. pls signin with your account",
      });
    }
    if (password.length < 8) {
      res
        .status(400)
        .json({ error: "Password must be atleast 8 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, mobile });
    console.log("newUser", newUser);

    if (newUser) {
      const token = await generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({ message: "User created", result: newUser, token });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
    const token = await generateTokenAndSetCookie(user, res);
    res.status(200).json({user, token});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.validateUser = async (req, res) => {
  try {
    console.log("req.user", req.user);
    const user = await User.findById(req?.user?.userId).select("-password");
    const token = req?.cookies?.jwt;
    if (!user || !token) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    res.status(200).json({ message: "user validated successfully", user, token });
  } catch (error) {
    console.log("error", error?.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
