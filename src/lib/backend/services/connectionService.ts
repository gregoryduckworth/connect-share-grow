import { CONNECTIONS_DATA } from '../data/connections';
import { CHAT_THREADS } from '../data/chatThreads';

export const connectionService = {
  getConnectionsForUser: async (userId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const userConnections = CONNECTIONS_DATA.find((c) => c.userId === userId);
    if (!userConnections) return [];
    return userConnections.connections.map((c) => {
      // Find or create a direct chat thread for this connection
      let thread = CHAT_THREADS.find(
        (t) =>
          !t.isGroup &&
          t.participantIds.includes(userId) &&
          t.participantIds.includes(c.id) &&
          t.participantIds.length === 2,
      );
      if (!thread) {
        // Optionally, create a new thread if not found (mock only)
        thread = {
          id: `thread-${userId}-${c.id}`,
          participantIds: [userId, c.id],
          isGroup: false,
          createdAt: new Date(),
        };
        CHAT_THREADS.push(thread);
      }
      return {
        ...c,
        chatThreadId: thread.id,
      };
    });
  },

  addConnection: async (
    userId: string,
    connectionId: string,
    status: 'connected' | 'pending' | 'received' = 'pending',
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let userConnections = CONNECTIONS_DATA.find((c) => c.userId === userId);
    if (!userConnections) {
      userConnections = { userId, connections: [] };
      CONNECTIONS_DATA.push(userConnections);
    }
    userConnections.connections.push({
      id: connectionId,
      status,
      mutualConnections: 0,
      lastActive: new Date(),
    });
    return true;
  },

  updateConnectionStatus: async (
    userId: string,
    connectionId: string,
    status: 'connected' | 'pending' | 'received',
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const userConnections = CONNECTIONS_DATA.find((c) => c.userId === userId);
    if (!userConnections) return false;
    const conn = userConnections.connections.find((c) => c.id === connectionId);
    if (!conn) return false;
    conn.status = status;
    return true;
  },

  removeConnection: async (userId: string, connectionId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const userConnections = CONNECTIONS_DATA.find((c) => c.userId === userId);
    if (!userConnections) return false;
    userConnections.connections = userConnections.connections.filter((c) => c.id !== connectionId);
    return true;
  },
};
