const express = require("express");
const router = express.Router();
const pdfTrackerController = require("./../controller/PdfTrackerController");

// Create new tracker data
router.post("/", pdfTrackerController.createTrackerData);

// Get tracker data by ID
router.get("/:id", pdfTrackerController.getTrackerData);

// Update tracker data for IP fetch
router.post("/ip-fetch", pdfTrackerController.updateFetch);

router.get("",((req,res)=>{
    res.send("Hello World");
}))


module.exports = router;
