
import { COMMUNITIES_DATA } from "../data/communities";
import { USERS_DATA } from "../data/users";
import type { Community, CommunityDetail } from "@/lib/types";

export const communityService = {
  getCommunities: async (): Promise<Community[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return COMMUNITIES_DATA;
  },

  getCommunityDetail: async (communitySlug: string): Promise<CommunityDetail | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const community = COMMUNITIES_DATA.find((c) => c.slug === communitySlug);

    if (!community) return null;

    return {
      id: community.slug,
      name: community.name,
      description: community.description,
      memberCount: community.memberCount,
      postCount: community.postCount,
      tags: community.tags,
      isMember: community.isJoined,
      isModerator:
        community.moderators?.includes(
          "b2c3d4e5-f6g7-8901-2345-678901bcdefg"
        ) || false,
      moderators:
        community.moderators?.map((modId) => {
          const user = USERS_DATA.find((u) => u.id === modId);
          return {
            id: modId,
            name: user?.name || "Unknown User",
            role: "moderator",
            joinedAsModAt: new Date("2024-01-10T14:20:00Z"),
          };
        }) || [],
      rules: [
        "Be respectful to all community members",
        "Stay on topic and relevant to the community",
        "No spam or self-promotion without permission",
        "Use appropriate language and content",
        "Follow platform-wide community guidelines",
      ],
    };
  },
};
