import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs-extra";
import puppeteer from "puppeteer";
import { createCanvas, loadImage } from "canvas";
import Certificate from "../models/certificate.js";

const router = express.Router();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the certificates directory exists
const certificatesDir = path.join(__dirname, "../public/certificates");
fs.ensureDirSync(certificatesDir);

// 📌 Serve static certificate files
router.use("/certificates", express.static(certificatesDir));

// 📌 Create a new certificate entry and generate PNG & PDF
router.post("/create", async (req, res) => {
  try {
    const { username, certificateId, course, date } = req.body;

    if (!username || !certificateId || !course || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Define file paths
    const pngPath = path.join(certificatesDir, `${certificateId}.png`);
    const pdfPath = path.join(certificatesDir, `${certificateId}.pdf`);

    // ✅ Step 1: Generate PNG with Canvas
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext("2d");

    // Load background image (OPTIONAL: Replace with your own template)
    const background = await loadImage(path.join(certificatesDir, "certificate-template.png"));
    // Change this to your actual template
    ctx.drawImage(background, 0, 0, 800, 600);

    // Add text to PNG
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Certificate of Completion", 200, 100);
    ctx.fillText(`Name: ${username}`, 200, 200);
    ctx.fillText(`Course: ${course}`, 200, 300);
    ctx.fillText(`Date: ${date}`, 200, 400);
    ctx.fillText(`Certificate ID: ${certificateId}`, 200, 500);

    // Save PNG
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(pngPath, buffer);

    // ✅ Step 2: Generate PDF using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(`
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: blue; }
        </style>
      </head>
      <body>
        <h1>Certificate of Completion</h1>
        <p>This is to certify that</p>
        <h2>${username}</h2>
        <p>has successfully completed the course</p>
        <h3>${course}</h3>
        <p>on ${date}</p>
        <h4>Certificate ID: ${certificateId}</h4>
      </body>
      </html>
    `);
    await page.pdf({ path: pdfPath, format: "A4" });
    await browser.close();

    // ✅ Step 3: Save to MongoDB
    const newCertificate = new Certificate({
      username,
      certificateId,
      course,
      date,
      fileUrls: {
        png: `/certificates/${certificateId}.png`,
        pdf: `/certificates/${certificateId}.pdf`,
      },
    });

    await newCertificate.save();

    res.status(201).json({
      success: true,
      message: "Certificate created successfully",
      certificate: newCertificate,
    });
  } catch (error) {
    console.error("Error creating certificate:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// 📌 Fetch all certificates
router.get("/all", async (req, res) => {
  try {
    const certificates = await Certificate.find({});
    res.status(200).json({ success: true, certificates });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// 📌 Fetch a single certificate by certificateId
router.get("/:certificateId", async (req, res) => {
  try {
    const { certificateId } = req.params;
    console.log("Fetching certificate with ID:", certificateId);

    const certificate = await Certificate.findOne({ certificateId });

    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    res.status(200).json({ success: true, certificate });
  } catch (error) {
    console.error("Error fetching certificate:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
