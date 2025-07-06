
import { Named } from "./base";

// Analytics types
export interface AnalyticsDataPoint extends Named {
  value: number;
  color?: string;
}

export interface AnalyticsCommunity extends Named {
  id: string;
  members: number;
  posts: number;
  comments?: number;
  activity?: number;
}

export interface ActivityDataPoint extends Named {
  posts: number;
  users: number;
}

export type PlatformStats = {
  totalUsers: number;
  totalCommunities: number;
  totalPosts: number;
  totalReports: number;
  activeUsers: number;
};
