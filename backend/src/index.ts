import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDatabase } from './db/database.js';
import usersRouter from './routes/users.js';
import topicsRouter from './routes/topics.js';
import responsesRouter from './routes/responses.js';
import compareRouter from './routes/compare.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDatabase();

// Routes
app.use('/api/users', usersRouter);
app.use('/api/topics', topicsRouter);
app.use('/api/responses', responsesRouter);
app.use('/api/compare', compareRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
