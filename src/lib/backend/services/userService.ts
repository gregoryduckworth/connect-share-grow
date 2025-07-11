import { USERS_DATA } from '../data/users';
import {
  USER_COMMUNITY_MEMBERSHIPS,
  UserCommunityMembership,
} from '../data/userCommunityMemberships';
import { COMMUNITIES_DATA } from '../data/communities';
import type { User, Community } from '@/lib/types';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    return USERS_DATA;
  },

  getUserById: async (userId: string): Promise<User | undefined> => {
    return USERS_DATA.find((user) => user.id === userId);
  },

  getUserByEmail: async (email: string): Promise<User | undefined> => {
    return USERS_DATA.find((user) => user.email === email);
  },

  // New: Get all community memberships for a user
  getUserCommunityMemberships: async (userId: string): Promise<UserCommunityMembership[]> => {
    return USER_COMMUNITY_MEMBERSHIPS.filter((m) => m.userId === userId);
  },

  // New: Get all communities a user is a member of, with role and join date
  getUserCommunities: async (
    userId: string,
  ): Promise<Array<Community & { role: string; joinedAt: Date }>> => {
    const memberships = USER_COMMUNITY_MEMBERSHIPS.filter((m) => m.userId === userId);
    return memberships
      .map((m) => {
        const comm = COMMUNITIES_DATA.find((c) => c.slug === m.communitySlug);
        if (comm) {
          return {
            ...comm,
            role: m.role,
            joinedAt: m.joinedAt,
          };
        }
        return undefined;
      })
      .filter(Boolean) as Array<Community & { role: string; joinedAt: Date }>;
  },

  createUser: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      ...userData,
    };
    USERS_DATA.push(newUser);
    return newUser;
  },

  updateUser: async (userId: string, updates: Partial<User>): Promise<User | null> => {
    const userIndex = USERS_DATA.findIndex((user) => user.id === userId);
    if (userIndex === -1) return null;

    USERS_DATA[userIndex] = { ...USERS_DATA[userIndex], ...updates };
    return USERS_DATA[userIndex];
  },

  // Remove a user-community membership (mock, mutates the join table array)
  removeUserCommunityMembership: async (userId: string, communitySlug: string): Promise<void> => {
    const idx = USER_COMMUNITY_MEMBERSHIPS.findIndex(
      (m) => m.userId === userId && m.communitySlug === communitySlug,
    );
    if (idx !== -1) {
      USER_COMMUNITY_MEMBERSHIPS.splice(idx, 1);
    }
  },
};
