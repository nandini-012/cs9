import jwt from "jsonwebtoken";
import sendResponse from "../utils/apiResponse.js";

const getTokenFromRequest = (req) => {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((cookie) => {
      const [name, ...value] = cookie.trim().split("=");
      return [name, decodeURIComponent(value.join("="))];
    })
  );

  return cookies.token || cookies.authToken || null;
};

export const verifyToken = (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return sendResponse(res, 401, false, "Missing token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendResponse(res, 401, false, "Expired token");
    }

    return sendResponse(res, 401, false, "Invalid token");
  }
};

export const checkRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return sendResponse(res, 403, false, "Unauthorized role");
  }

  return next();
};
