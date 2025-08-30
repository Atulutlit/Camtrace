const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors({ origin: "*" }));

// Ensure uploads folder exists
const UPLOAD_DIR = "uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Map to store files per ID
// In production, use a database
const filesById = {};

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

const upload = multer({ storage, fileFilter });

// Upload route with query id
app.post("/upload", upload.single("file"), (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: "Missing id in query" });

  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  // Save file info under the given id
  if (!filesById[id]) filesById[id] = [];
  filesById[id].push({ filename: req.file.filename, path: req.file.path });

  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    path: req.file.path,
  });
});

// Get all files for a given id
app.get("/files", (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: "Missing id in query" });

  const files = filesById[id] || [];
  res.json({ files });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
