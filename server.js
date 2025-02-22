import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

console.log("✅ Middleware and routes initialized");

app.use("/api/admin", adminRoutes);
app.use("/api/certificates", certificateRoutes);

// ✅ Test API route
app.get("/api/admin/test", (req, res) => {
  res.json({ message: "Admin route is working!" });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

// ❌ Catch unregistered routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
