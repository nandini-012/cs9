import jwt from 'jsonwebtoken';
import { getInternByEmail } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'samagama_secret_key_2026';

export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization Header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token string
      token = req.headers.authorization.split(' ')[1];

      // Verify token signature
      const decoded = jwt.verify(token, JWT_SECRET);

      // Fetch user profile from database
      const user = await getInternByEmail(decoded.email);
      if (!user) {
        return res.status(401).json({ message: "User session not found or deleted" });
      }

      // Attach user profile to request context
      req.user = user;
      next();
    } catch (error) {
      console.error("JWT validation error:", error);
      return res.status(401).json({ message: "Not authorized, session expired or invalid" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no session token provided" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: "Access denied, administrative permissions required" });
  }
};
