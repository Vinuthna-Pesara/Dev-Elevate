import jwt from 'jsonwebtoken';
import User from '../model/UserModel.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = async (req, res, next) => {
  const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "").trim();

  if (!token) {
    return res.status(401).json({ message: "User not logged in" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET); // Use JWT_SECRET constant

    // --- CORRECTION HERE ---
    // Change 'user' to 'User' (the imported model)
    const userData = await User.findById(decodedToken?.userId).select("-password -refreshToken");

    if (!userData) {
      // It's good practice to send a more generic unauthorized error to avoid user enumeration
      return res.status(401).json({ message: "Invalid Access Token" });
    }

    req.user = userData;
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    // Be specific about the type of error for debugging
    return res.status(401).json({ message: 'Unauthorized: Invalid token or expired token' });
  }
};

export const requireAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  } catch (error) {
    console.error("Error in requireAdmin middleware:", error);
    return res.status(500).json({ message: "Internal server errror while authorizing" });
  }
};