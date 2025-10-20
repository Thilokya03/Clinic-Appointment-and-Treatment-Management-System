const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

// In-memory OTP store
const otpStore = {};

// Request OTP
router.post("/request-reset", async (req, res) => {
  const { role, username, email, nic } = req.body;
  if (!role || !email || (!username && !nic)) return res.status(400).json({ error: "Role, email, and username or NIC required" });

  try {
    let query, params;
    if (role === "staff") query = username ? "SELECT * FROM staff WHERE username=? AND email=?" : "SELECT * FROM staff WHERE nic=? AND email=?";
    else if (role === "patient") query = username ? "SELECT * FROM patient WHERE username=? AND email=?" : "SELECT * FROM patient WHERE nic=? AND email=?";
    else return res.status(400).json({ error: "Invalid role" });

    params = username ? [username, email] : [nic, email];
    const [rows] = await db.execute(query, params);
    if (!rows.length) return res.status(404).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;
    console.log(`OTP for ${email}: ${otp}`);

    res.json({ message: "Verification code sent (check console)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!otpStore[email] || otpStore[email] !== otp) return res.status(400).json({ message: "Invalid or expired OTP" });
  res.json({ message: "OTP verified successfully" });
});

// Reset password
router.post("/reset-password", async (req, res) => {
  const { role, email, otp, newPassword } = req.body;
  if (!role || !email || !otp || !newPassword) return res.status(400).json({ error: "Role, email, OTP, and newPassword required" });

  if (!otpStore[email] || otpStore[email] !== otp) return res.status(400).json({ error: "Invalid or expired OTP" });

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const table = role === "staff" ? "staff" : role === "patient" ? "patient" : null;
    if (!table) return res.status(400).json({ error: "Invalid role" });

    await db.execute(`UPDATE ${table} SET password=? WHERE email=?`, [hashedPassword, email]);
    delete otpStore[email];
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
