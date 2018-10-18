import { Session } from '../models/session';
import { io } from '../';
import Lobby from './lobby';

const activeGames: Map<string, Lobby> = new Map();

export function runSocketIO() {
  io.of(/^\/.+$/ as any).on('connection', async socket => {
    const sessionId = socket.nsp.name.substring(1);
    console.log('new connection', sessionId, 'socket', socket.conn.id);
    if (!activeGames.has(sessionId)) {
      activeGames.set(sessionId, new Lobby(sessionId));
      await activeGames.get(sessionId).create();
    }
    const lobby = activeGames.get(sessionId);
    const { userId } = socket.handshake.query;
    await lobby.addUser(userId);
    const dpNames = lobby.extractDisplayNames();
    console.log(`  emitting participants: ${dpNames}`)
    io.of(socket.nsp.name).emit('participants', dpNames);

    socket.on('leave', userId => {
      lobby.removeUser(userId);
      io.of(socket.nsp.name).emit('participants', dpNames);
    });

    socket.on('startGame', userId => {
      if (lobby.getHostId() === userId) {
        lobby.lock();
        lobby.startGame(socket);
      }
    });
  });
}

// Maintain sessions on memory it could be redis eventually