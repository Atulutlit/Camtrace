
const PdfTracker = require("./../models/PdfTrackerRecord");
const mongoose = require('mongoose')
// Create tracker data
exports.createTrackerData = async (req, res) => {
  try {
    console.log(req.body,'req.body')
    const tracker = new PdfTracker(req.body);
    await tracker.save();
    res.status(201).json({ success: true, data: tracker });
  } catch (error) {
    console.log(error,'error');
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
    const { id, userId } = req.query;

    if (!id || !userId) {
      return res.status(400).json({ success: false, message: "id and userId are required" });
    }

    // Get Client IP
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      null;

    // Find tracker record
    let trackerDetail = await PdfTracker.findOne({ userId, pdfId: id });

    if (trackerDetail) {
      trackerDetail.ipAddress = ip;
      trackerDetail.lastFetchedAt = new Date();
      await trackerDetail.save();
    } else {
      trackerDetail = await PdfTracker.create({
        ipAddress: ip,
        userId,
        pdfId: id,
        lastFetchedAt: new Date(),
      });
    }
    console.log(trackerDetail,'tracker Detail')

    return res.json({ success: true, data: trackerDetail });

  } catch (error) {
    console.error("updateFetch error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

