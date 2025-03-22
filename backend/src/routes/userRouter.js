import { Router } from "express";
import bcrypt from "bcryptjs";
import db from "../config/db.js";
import jwt from "jsonwebtoken";
import { checkLogin } from "../middlewares/authMiddleware.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const router = Router();

// Store tokens temporarily (in a real app, use a database)
const resetTokens = new Map();

// User signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const emailExists = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (emailExists.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );
    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.log("Signup error:", err.message);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
});

// User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).json({ message: "Logged in successfully", user: user});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("token", { path: "/" });
    return res.json({ message: "Logged out successfully" });
  });
});

// check login
router.get("/check", checkLogin, (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.send(500).json({ message: "Internal server error" });
  }
});

// edit the user data
router.post("/edit", checkLogin, async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    let query;
    let params;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query =
        "UPDATE users SET name = $1, email = $2, password = $3, updated_at = $4 WHERE id = $5 RETURNING *";
      params = [name, email, hashedPassword, new Date(), req.user.id];
    } else {
      query =
        "UPDATE users SET name = $1, email = $2, updated_at = $3 WHERE id = $4 RETURNING *";
      params = [name, email, new Date(), req.user.id];
    }

    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.log("Error in update profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    resetTokens.set(token, { email, expires: Date.now() + 15 * 60 * 1000 });

    // Send email with reset link
    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.MAILTRAP_USER,
      to: email,
      subject: "Password Reset",
      text: `Click this link to reset your password: ${resetLink}`,
    });

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.log("Forgot Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Reset Password Route
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  if (!resetTokens.has(token)) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const { email } = resetTokens.get(token);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("UPDATE users SET password = $1 WHERE email = $2", [
      hashedPassword,
      email,
    ]);

    resetTokens.delete(token);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.log("Reset Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
