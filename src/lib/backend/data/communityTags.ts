// Community-Tag join table
export interface CommunityTag {
  communitySlug: string;
  tagId: string;
}

export const COMMUNITY_TAGS: CommunityTag[] = [
  { communitySlug: 'photography-enthusiasts', tagId: 'photography' },
  { communitySlug: 'photography-enthusiasts', tagId: 'creative' },
  { communitySlug: 'tech-discussions', tagId: 'tech' },
  { communitySlug: 'tech-discussions', tagId: 'programming' },
  { communitySlug: 'fitness-wellness', tagId: 'fitness' },
  { communitySlug: 'fitness-wellness', tagId: 'health' },
  { communitySlug: 'entrepreneurs-united', tagId: 'business' },
  { communitySlug: 'entrepreneurs-united', tagId: 'startups' },
];
