import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getInternByEmail, createIntern } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'samagama_secret_key_2026';

// @desc    Authenticate User (Student or Admin) & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    const normEmail = email.toLowerCase().trim();
    const user = await getInternByEmail(normEmail);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password hash
    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Sign JSON Web Token
    const token = jwt.sign(
      { email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      token,
      email: user.email,
      role: user.role,
      name: user.name
    });
  } catch (error) {
    console.error("Login controller error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};

// @desc    Register a new Intern profile & get token
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    const normEmail = email.toLowerCase().trim();
    const existingUser = await getInternByEmail(normEmail);

    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered. Please login instead." });
    }

    // Generate salt and hash the password
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Auto-detect role based on Hotmail domains
    const role = normEmail.includes('@hotmail') ? 'admin' : 'student';

    // Prepare default profile record matching intern schema
    const newInternData = {
      email: normEmail,
      passwordHash,
      role,
      name: name || normEmail.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      joinedDate: new Date().toISOString().split('T')[0],
      status: {
        phase: "Bronze",
        bronzeStatus: "in-progress",
        silverStatus: "locked",
        goldStatus: "locked",
        platinumStatus: "locked"
      },
      internshipDates: {
        start: "2026-06-01",
        end: "2026-08-01",
        isConfirmed: false
      },
      noc: {
        status: "pending_upload",
        fileName: "",
        uploadDate: "",
        verificationDate: "",
        isEmailForwardPath: false
      },
      offerLetter: {
        status: "locked",
        type: "none",
        downloadUrl: "",
        issuedDate: "",
        acceptedDate: ""
      },
      vibeEmail: "",
      exemptions: {
        mernStack: false,
        coursework: false
      },
      escalations: []
    };

    const created = await createIntern(newInternData);

    // Sign Token
    const token = jwt.sign(
      { email: created.email, role: created.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      token,
      email: created.email,
      role: created.role,
      name: created.name
    });
  } catch (error) {
    console.error("Register controller error:", error);
    return res.status(500).json({ message: "Server error during registration" });
  }
};
