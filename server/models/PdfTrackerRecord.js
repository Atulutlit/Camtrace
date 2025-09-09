const mongoose = require('mongoose');

const pdfTrackerSchema = new mongoose.Schema({
  userId: { type: String, required: true },        // logged-in user id
  targetName: { type: String, required: true },    // name of the pdf or file
  ipAddress: { type: String },                     // captured IP
  pdfType: { type: String },                       // type of PDF
  details: { type: String },                       // any extra details
  created_at: { type: Date, default: Date.now },   // default timestamp
}, { timestamps: true }); // also adds createdAt & updatedAt automatically

module.exports = mongoose.model('PdfTracker', pdfTrackerSchema);
