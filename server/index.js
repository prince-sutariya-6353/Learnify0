const express = require("express");
const ImageKit = require("imagekit");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Authentication endpoint
app.get("/auth", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// List uploaded files
app.get("/files", async (req, res) => {
  try {
    const result = await imagekit.listFiles({
      path: "Learnify",
      sort: "DESC_CREATED",
    });
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
