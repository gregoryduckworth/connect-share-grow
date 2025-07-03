import { CONNECTIONS_DATA } from "../data/connections";

export const connectionService = {
  getConnectionsForUser: async (userId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const userConnections = CONNECTIONS_DATA.find((c) => c.userId === userId);
    return userConnections ? userConnections.connections : [];
  },

  addConnection: async (
    userId: string,
    connectionId: string,
    status: "connected" | "pending" | "received" = "pending"
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
    status: "connected" | "pending" | "received"
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
    userConnections.connections = userConnections.connections.filter(
      (c) => c.id !== connectionId
    );
    return true;
  },
};
