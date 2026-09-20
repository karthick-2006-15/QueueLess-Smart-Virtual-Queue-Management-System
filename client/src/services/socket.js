import { io } from 'socket.io-client';

// Connect to the same origin or fallback to localhost:5000 in dev
const SOCKET_URL = window.location.hostname === 'localhost' && window.location.port === '5173'
  ? 'http://localhost:5000'
  : '/';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log('⚡ Socket connected to QueueLess server:', socket.id);
});

socket.on('disconnect', () => {
  console.log('🔌 Socket disconnected');
});

export default socket;
