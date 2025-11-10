import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

let ioInstance: Server | null = null;

export const initSocket = (server: any, corsOrigin: string) => {
  const io = new Server(server, {
    cors: {
      origin: corsOrigin,
      credentials: true
    }
  });

  // Autenticación por token JWT pasado en auth (socket.io v4)
  io.use((socket, next) => {
    try {
      const token = (socket.handshake.auth && (socket.handshake.auth as any).token) || socket.handshake.query.token;
      if (!token || typeof token !== 'string') {
        return next(new Error('Auth token missing'));
      }
      const secret = process.env.JWT_SECRET;
      if (!secret) return next(new Error('JWT secret not configured'));
      const decoded = jwt.verify(token, secret) as any;
      (socket as any).user = { id: decoded.id, role: decoded.role };
      return next();
    } catch (err) {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    console.log('🔌 Socket conectado:', { socketId: socket.id, user });

    // Unir al usuario a su sala personal para notificaciones directas
    if (user?.id) {
      const personalRoom = `user:${user.id}`;
      socket.join(personalRoom);
      console.log(`👤 Usuario ${user.id} unido a sala personal ${personalRoom}`);
    }

    // Cliente solicita unirse a una conversación con su par (peerId)
    socket.on('join', (peerId: number) => {
      if (!user?.id || !peerId) return;
      const room = getConversationRoom(user.id, Number(peerId));
      socket.join(room);
      console.log(`👥 Usuario ${user.id} unido a sala ${room}`);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket desconectado:', socket.id);
    });
  });

  ioInstance = io;
  return io;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.io no inicializado');
  }
  return ioInstance;
};

export const getConversationRoom = (a: number, b: number) => {
  const [x, y] = [a, b].sort((m, n) => m - n);
  return `conv:${x}-${y}`;
};
