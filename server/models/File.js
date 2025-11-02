// models/File.js
const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  associatedId: { type: String, required: true }, // your query id
  filename: { type: String, required: true },
  path: { type: String, required: true },
  caseName : {type:String},
  userId: {type:String},
  uploadedAt: { type: Date, default: Date.now },
  latitude: {type:String},
  longitude: {type:String}
});

module.exports = mongoose.model("File", FileSchema);
