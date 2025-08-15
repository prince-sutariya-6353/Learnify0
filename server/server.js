// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load .env

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/message", (req, res) => {
  res.json({ message: process.env.MESSAGE });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
