// server.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const connectDB = require("./database/db");
const File = require("./models/File");

const app = express();
const PORT = process.env.PORT || 5000;
const URL = 'http://localhost:5000/api/uploads'

// Enable CORS
app.use(cors({ origin: "*" }));


// Connect to MongoDB
connectDB();

// Ensure uploads folder exists
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${Date.now()}${ext}`);
  },
});

// Accept only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

const upload = multer({ storage, fileFilter });

// Routes

// Upload a file
app.post("/api/upload", upload.single("file"), async (req, res) => {
  const { id } = req.query;

  if (!id) return res.status(400).json({ message: "Missing id in query" });
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const fileDoc = await File.create({
      associatedId: id,
      filename: req.file.filename,
      path: `${URL}/${req.file.filename}`,
    });
    console.log(`${URL}/${req.file.filename}`,'url')
    res.status(201).json({
      message: "File uploaded successfully",
      file: fileDoc,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all files by id
app.get("/api/files", async (req, res) => {
  const { id } = req.query;
  console.log(id,'id ...');
  if (!id) return res.status(400).json({ message: "Missing id in query" });

  try {
    const files = await File.find({ associatedId: id }).sort({ uploadedAt: -1 });
    console.log(files,'filess ....');
    res.json({ files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Serve uploaded files statically
app.use("/api/uploads", express.static(UPLOAD_DIR));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
