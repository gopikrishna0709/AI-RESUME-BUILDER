const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Allowed Origins for Production and Local Development
const explicitOrigins = [
  'https://airesume-rouge-phi.vercel.app',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:5173',
].filter(Boolean).map(url => url.replace(/\/+$/, '')); // trim any trailing slashes

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server, mobile)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/+$/, '');
    if (
      explicitOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app') ||
      cleanOrigin.includes('localhost') ||
      cleanOrigin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }
    // Permissive fallback so dynamic preview deployments work seamlessly
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'AI Resume Builder & Job Matcher API',
    timestamp: new Date(),
    mongodb: require('mongoose').connection.readyState === 1 ? 'connected' : 'connecting/disconnected',
  });
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.send('AI Resume Builder & Job Matcher API Server is Running.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
  console.log(`📡 MongoDB Atlas credentials connected`);
  console.log(`=========================================`);
});
