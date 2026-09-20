require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middleware/error');

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Change in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(helmet());
app.use(cors({ origin: '*', credentials: true })); // Change origin in production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static client files (optional, depending on architecture)
// app.use(express.static(path.join(__dirname, '../client')));

const authRouter = require('./routes/authRoutes');
const serviceRouter = require('./routes/serviceRoutes');
const queueRouter = require('./routes/queueRoutes');

// Routes (will be populated in next phases)
app.use('/api/auth', authRouter);
app.use('/api/services', serviceRouter);
app.use('/api/queues', queueRouter);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running properly' });
});

// Handle unhandled routes
app.use((req, res, next) => {
  if (!req.originalUrl.startsWith('/api')) return next();
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('⚡ Client connected to Socket.IO:', socket.id);

  // Relay queue events to all connected clients
  socket.on('joinQueue', (data) => {
    socket.broadcast.emit('queueUpdated', { newTicket: data });
  });

  socket.on('tokenCalled', (data) => {
    io.emit('tokenCalled', data);
    io.emit('queueUpdated', { calledTicket: data });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected from Socket.IO:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
