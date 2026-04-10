import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '10mb' }));

app.use(async (req, res, next) => {
  await connectDB(process.env.MONGODB_URL);
  next();
});

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

//404error
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
});

//global err
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} -`, err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});


if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
}


export default app;