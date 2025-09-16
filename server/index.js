// index.js
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");
const ImageKit = require("imagekit");
const User = require("./models/User"); // ✅ User Schema

const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");

dotenv.config();
const app = express();

// ================== CONFIG ==================
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ CORS setup
const corsOptions = {
  origin: [
    "https://learnify0-nfmn.vercel.app", // deployed frontend
    "http://localhost:5173",             // local dev
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Auth-Token", "Origin"],
};
app.use(cors(corsOptions));
app.use(express.json());

// ✅ Fix COOP/COEP headers to allow Google login popups
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

// ✅ MongoDB Setup
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ ImageKit Setup
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// ================== AUTH ROUTES ==================

// Signup
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Google Login
app.post("/google-login", async (req, res) => {
  const { id_token } = req.body;
  if (!id_token) return res.status(400).json({ message: "id_token required" });

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, email_verified } = payload;

    if (!email || !email_verified) {
      return res.status(400).json({ message: "Google account email not verified" });
    }

    // find existing user or create
    let user = await User.findOne({ email });
    if (!user) {
      const randomPw = crypto.randomBytes(16).toString("hex");
      const hashed = await bcrypt.hash(randomPw, 10);
      user = new User({ name, email, password: hashed });
      await user.save();
    }

    // create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("❌ Google login error:", err);
    res.status(500).json({ message: "Google auth failed", error: err.message });
  }
});

// ================== IMAGEKIT ROUTES ==================

// Authentication (for frontend uploads)
app.get("/auth", (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// List files from "Learnify" folder
app.get("/files", async (req, res) => {
  try {
    const result = await imagekit.listFiles({
      path: "Learnify",
      sort: "DESC_CREATED",
    });
    res.send(result);
  } catch (error) {
    console.error("❌ ImageKit error:", error);
    res.status(500).send({ error: error.message });
  }
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
