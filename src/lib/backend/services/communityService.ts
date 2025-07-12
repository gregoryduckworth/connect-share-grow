import { COMMUNITIES_DATA } from '../data/communities';
import { USERS_DATA } from '../data/users';
import {
  USER_COMMUNITY_MEMBERSHIPS,
  UserCommunityMembership,
} from '../data/userCommunityMemberships';
import type { Community, CommunityDetail } from '@/lib/types';
import { auditService } from '@/lib/audit/auditService';

export const communityService = {
  getCommunities: async (): Promise<Community[]> => {
    return COMMUNITIES_DATA;
  },

  getCommunityDetail: async (communitySlug: string): Promise<CommunityDetail | null> => {
    const community = COMMUNITIES_DATA.find((c) => c.slug === communitySlug);
    if (!community) return null;

    // Get all memberships for this community
    const memberships = USER_COMMUNITY_MEMBERSHIPS.filter((m) => m.communitySlug === communitySlug);
    const moderators = memberships
      .filter((m) => m.role === 'moderator')
      .map((m) => {
        const user = USERS_DATA.find((u) => u.id === m.userId);
        return {
          id: m.userId,
          name: user?.name || 'Unknown User',
          role: 'moderator',
          joinedAsModAt: m.joinedAt,
        };
      });

    return {
      id: community.slug,
      name: community.name,
      description: community.description,
      memberCount: community.memberCount,
      postCount: community.postCount,
      tags: community.tags,
      isMember: false, // Should be set per-user at runtime
      isModerator: false, // Should be set per-user at runtime
      moderators, // Always computed from join table
      rules: [
        'Be respectful to all community members',
        'Stay on topic and relevant to the community',
        'No spam or self-promotion without permission',
        'Use appropriate language and content',
        'Follow platform-wide community guidelines',
      ],
    };
  },

  // Get all memberships for a community
  getCommunityMemberships: async (communitySlug: string): Promise<UserCommunityMembership[]> => {
    return USER_COMMUNITY_MEMBERSHIPS.filter((m) => m.communitySlug === communitySlug);
  },

  // Get all users in a community (with role and join date)
  getCommunityMembers: async (communitySlug: string) => {
    const memberships = USER_COMMUNITY_MEMBERSHIPS.filter((m) => m.communitySlug === communitySlug);
    return memberships
      .map((m) => {
        const user = USERS_DATA.find((u) => u.id === m.userId);
        return user ? { ...user, role: m.role, joinedAt: m.joinedAt } : undefined;
      })
      .filter(Boolean);
  },

  // New: Get all moderators for a community (computed from join table)
  getCommunityModerators: async (communitySlug: string) => {
    const memberships = USER_COMMUNITY_MEMBERSHIPS.filter(
      (m) => m.communitySlug === communitySlug && m.role === 'moderator',
    );
    return memberships
      .map((m) => {
        const user = USERS_DATA.find((u) => u.id === m.userId);
        return user ? { ...user, joinedAsModAt: m.joinedAt } : undefined;
      })
      .filter(Boolean);
  },

  // Example: log when a user joins a community (add this to the relevant join/leave methods)
  logCommunityAction: (
    action: 'community_join' | 'community_leave',
    communitySlug: string,
    userId: string,
  ) => {
    const community = COMMUNITIES_DATA.find((c) => c.slug === communitySlug);
    if (!community) return;

    const user = USERS_DATA.find((u) => u.id === userId);
    if (!user) return;

    auditService.logCommunityAction(
      action,
      communitySlug,
      `User ${action === 'community_join' ? 'joined' : 'left'} community: ${communitySlug}`,
      { userId },
    );
  },
};
