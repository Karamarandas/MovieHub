import jwt from "jsonwebtoken";
import db from "../config/db.js";
// Middleware to check if user is logged in
export const checkLogin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const user = await db.query("SELECT * FROM users WHERE id = $1", [
      payload.id,
    ]);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user.rows[0];
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token" });
    }
    console.log("Login error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
