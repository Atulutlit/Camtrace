const PdfTracker = require("./../models/PdfTrackerRecord");
const mongoose = require('mongoose')
// Create tracker data
exports.createTrackerData = async (req, res) => {
  try {
    const tracker = new PdfTracker(req.body);
    await tracker.save();
    res.status(201).json({ success: true, data: tracker });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get tracker data by ID
exports.getTrackerData = async (req, res) => {
  try {
    const { id } = req.params;
    const tracker = await PdfTracker.find({ userId: id });

    if (!tracker) {
      return res
        .status(404)
        .json({ success: false, message: "Data not found" });
    }

    res.json({ success: true, data: tracker });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update tracker with IP fetch info
exports.updateFetch = async (req, res) => {
  try {
    const { id } = req.query; // Get id from URL params
    console.log(id, "id ,,,");
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "id is required" });
    }

    // Get user IP (different headers for proxy/CDN compatibility)
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || // handles proxy
      req.socket?.remoteAddress || // node >= v13
      req.connection?.remoteAddress; // fallback

    const tracker = await PdfTracker.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) }, // filter object
      { $set: { ipAddress: ip, lastFetchedAt: new Date() } },
      { new: true }
    );

    if (!tracker) {
      return res
        .status(404)
        .json({ success: false, message: "Data not found" });
    }

    res.json({ success: true, data: tracker });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
