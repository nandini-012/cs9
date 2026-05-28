import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import authRoutes from './routes/authRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import internRoutes from './routes/internRoutes.js';
import queryRoutes from './routes/queryRoutes.js';
import flaggedRoutes from './routes/flaggedRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'] // Include Authorization in allowed headers
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/intern', internRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/flagged', flaggedRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', time: new Date().toISOString() });
});

// Start database and server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
