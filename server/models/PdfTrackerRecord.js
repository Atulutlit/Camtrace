const mongoose = require('mongoose');

const pdfTrackerSchema = new mongoose.Schema({
  userId: { type: String, required: true },        // logged-in user id
  ipAddress: { type: String },                     // captured IP
  pdfId: { type: String },                       // type of PDF
  lastFetchedAt: { type: Date},
  created_at: { type: Date, default: Date.now },   // default timestamp
}, { timestamps: true }); // also adds createdAt & updatedAt automatically

module.exports = mongoose.model('PdfTracker', pdfTrackerSchema);
