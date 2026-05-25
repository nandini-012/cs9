import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendResponse from "../utils/apiResponse.js";

const cookieName = "token";

const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const toSafeUser = (user) => ({
  userId: user._id,
  email: user.email,
  role: user.role,
  name: user.name,
});

const signToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password) {
      return sendResponse(res, 401, false, "Missing credentials");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 403, false, "User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "USER",
    });

    return sendResponse(res, 201, true, "Registered successfully", {
      user: toSafeUser(user),
    });
  } catch (error) {
    return sendResponse(res, 500, false, "Registration failed", {
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 401, false, "Missing credentials");
    }

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return sendResponse(res, 401, false, "Invalid email or password");
    }

    const isPasswordValid = await user.comparePassword(passwordHash);
    if (!isPasswordValid) {
      return sendResponse(res, 401, false, "Invalid email or password");
    }

    res.cookie(cookieName, signToken(user), getCookieOptions());

    console.log("COOKIE SET");
    console.log(signToken(user));

    return sendResponse(res, 200, true, "Logged in successfully", {
      user: toSafeUser(user),
    });
  } catch (error) {
    return sendResponse(res, 500, false, "Login failed", {
      error: error.message,
    });
  }
};

export const logout = (_req, res) => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return sendResponse(res, 200, true, "Logged out successfully");
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return sendResponse(res, 401, false, "Invalid token");
    }

    return sendResponse(res, 200, true, "Current user fetched", {
      user: toSafeUser(user),
    });
  } catch (error) {
    return sendResponse(res, 500, false, "Failed to fetch current user", {
      error: error.message,
    });
  }
};
