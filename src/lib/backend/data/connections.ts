import { USERS_DATA } from "./users";
import { ConnectionData } from "@/lib/types";

export const CONNECTIONS_DATA: ConnectionData[] = [
  // Alex Johnson
  {
    userId: USERS_DATA[2].id,
    connections: [
      {
        id: USERS_DATA[3].id, // Sarah Chen
        status: "connected",
        mutualConnections: 3,
        lastActive: new Date("2024-06-19T10:00:00Z"),
      },
      {
        id: USERS_DATA[6].id, // David Kim
        status: "pending",
        mutualConnections: 2,
        lastActive: new Date("2024-06-17T09:00:00Z"),
      },
      {
        id: USERS_DATA[7].id, // Mike Rodriguez
        status: "connected",
        mutualConnections: 1,
        lastActive: new Date("2024-06-15T09:00:00Z"),
      },
      {
        id: USERS_DATA[8].id, // Priya Patel
        status: "connected",
        mutualConnections: 2,
        lastActive: new Date("2024-06-14T09:00:00Z"),
      },
    ],
  },
  // Sarah Chen
  {
    userId: USERS_DATA[3].id,
    connections: [
      {
        id: USERS_DATA[2].id, // Alex Johnson
        status: "connected",
        mutualConnections: 3,
        lastActive: new Date("2024-06-20T12:00:00Z"),
      },
      {
        id: USERS_DATA[4].id, // Mike Rodriguez
        status: "pending",
        mutualConnections: 1,
        lastActive: new Date("2024-06-18T08:00:00Z"),
      },
      {
        id: USERS_DATA[6].id, // David Kim
        status: "connected",
        mutualConnections: 2,
        lastActive: new Date("2024-06-13T09:00:00Z"),
      },
      {
        id: USERS_DATA[9].id, // Liam O'Brien
        status: "connected",
        mutualConnections: 1,
        lastActive: new Date("2024-06-12T09:00:00Z"),
      },
    ],
  },
  // Mike Rodriguez
  {
    userId: USERS_DATA[4].id,
    connections: [
      {
        id: USERS_DATA[3].id, // Sarah Chen
        status: "pending",
        mutualConnections: 1,
        lastActive: new Date("2024-06-19T10:00:00Z"),
      },
      {
        id: USERS_DATA[5].id, // David Kim
        status: "connected",
        mutualConnections: 2,
        lastActive: new Date("2024-06-11T09:00:00Z"),
      },
      {
        id: USERS_DATA[7].id, // Mike Rodriguez
        status: "connected",
        mutualConnections: 1,
        lastActive: new Date("2024-06-10T09:00:00Z"),
      },
    ],
  },
  // David Kim
  {
    userId: USERS_DATA[6].id,
    connections: [
      {
        id: USERS_DATA[2].id, // Alex Johnson
        status: "pending",
        mutualConnections: 2,
        lastActive: new Date("2024-06-20T12:00:00Z"),
      },
      {
        id: USERS_DATA[3].id, // Sarah Chen
        status: "connected",
        mutualConnections: 2,
        lastActive: new Date("2024-06-13T09:00:00Z"),
      },
      {
        id: USERS_DATA[8].id, // Priya Patel
        status: "connected",
        mutualConnections: 1,
        lastActive: new Date("2024-06-09T09:00:00Z"),
      },
    ],
  },
  // Priya Patel
  {
    userId: USERS_DATA[7].id,
    connections: [
      {
        id: USERS_DATA[2].id, // Alex Johnson
        status: "connected",
        mutualConnections: 1,
        lastActive: new Date("2024-06-15T09:00:00Z"),
      },
      {
        id: USERS_DATA[4].id, // Mike Rodriguez
        status: "connected",
        mutualConnections: 1,
        lastActive: new Date("2024-06-10T09:00:00Z"),
      },
      {
        id: USERS_DATA[8].id, // Priya Patel
        status: "pending",
        mutualConnections: 2,
        lastActive: new Date("2024-06-08T09:00:00Z"),
      },
    ],
  },
  // Liam O'Brien
  {
    userId: USERS_DATA[8].id,
    connections: [
      {
        id: USERS_DATA[2].id, // Alex Johnson
        status: "connected",
        mutualConnections: 2,
        lastActive: new Date("2024-06-14T09:00:00Z"),
      },
      {
        id: USERS_DATA[6].id, // David Kim
        status: "connected",
        mutualConnections: 1,
        lastActive: new Date("2024-06-09T09:00:00Z"),
      },
      {
        id: USERS_DATA[7].id, // Mike Rodriguez
        status: "pending",
        mutualConnections: 2,
        lastActive: new Date("2024-06-08T09:00:00Z"),
      },
      {
        id: USERS_DATA[9].id, // Sofia Rossi
        status: "connected",
        mutualConnections: 1,
        lastActive: new Date("2024-06-07T09:00:00Z"),
      },
    ],
  },
  // Sofia Rossi
  {
    userId: USERS_DATA[9].id,
    connections: [
      {
        id: USERS_DATA[3].id, // Sarah Chen
        status: "connected",
        mutualConnections: 1,
        lastActive: new Date("2024-06-12T09:00:00Z"),
      },
      {
        id: USERS_DATA[8].id, // Priya Patel
        status: "connected",
        mutualConnections: 1,
        lastActive: new Date("2024-06-07T09:00:00Z"),
      },
      {
        id: USERS_DATA[5].id, // David Kim
        status: "pending",
        mutualConnections: 1,
        lastActive: new Date("2024-06-06T09:00:00Z"),
      },
    ],
  },
  // Lucas Müller
  {
    userId: USERS_DATA[10]?.id,
    connections: [
      {
        id: USERS_DATA[4].id, // Mike Rodriguez
        status: "connected",
        mutualConnections: 1,
        lastActive: new Date("2024-06-11T09:00:00Z"),
      },
      {
        id: USERS_DATA[9].id, // Sofia Rossi
        status: "pending",
        mutualConnections: 1,
        lastActive: new Date("2024-06-06T09:00:00Z"),
      },
    ],
  },
  // Demo Admin User
  {
    userId: USERS_DATA[0].id, // demo-admin-0001
    connections: [
      {
        id: USERS_DATA[2].id, // Alex Johnson
        status: "connected",
        mutualConnections: 2,
        lastActive: new Date("2024-06-21T10:00:00Z"),
      },
      {
        id: USERS_DATA[3].id, // Sarah Chen
        status: "connected",
        mutualConnections: 1,
        lastActive: new Date("2024-06-20T09:00:00Z"),
      },
      {
        id: USERS_DATA[7].id, // Priya Patel
        status: "pending",
        mutualConnections: 1,
        lastActive: new Date("2024-06-19T08:00:00Z"),
      },
    ],
  },
];
