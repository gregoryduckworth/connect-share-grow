import { USERS_DATA } from "../data/users";
import type { User } from "@/lib/types";

export const userService = {
  getUsers: async (): Promise<User[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return USERS_DATA;
  },

  getUserById: async (userId: string): Promise<User | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return USERS_DATA.find((user) => user.id === userId);
  },

  getUserByEmail: async (email: string): Promise<User | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return USERS_DATA.find((user) => user.email === email);
  },

  createUser: async (
    userData: Omit<User, "id" | "createdAt">
  ): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      ...userData,
    };
    USERS_DATA.push(newUser);
    return newUser;
  },

  updateUser: async (
    userId: string,
    updates: Partial<User>
  ): Promise<User | null> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const userIndex = USERS_DATA.findIndex((user) => user.id === userId);
    if (userIndex === -1) return null;

    USERS_DATA[userIndex] = { ...USERS_DATA[userIndex], ...updates };
    return USERS_DATA[userIndex];
  },
};
