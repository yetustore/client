import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket'],
});

export const onSocket = (event, handler) => {
  socket.on(event, handler);
  return () => socket.off(event, handler);
};
