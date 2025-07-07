const express = require('express');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoute');
require('dotenv').config();
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5002;

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/todos', todoRoutes);

// Start server only after DB connects
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('Failed to start server due to DB error:', error);
  process.exit(1);
});
