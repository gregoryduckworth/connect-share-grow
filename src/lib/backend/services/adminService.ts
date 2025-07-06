import {
  AnalyticsCommunity,
  AnalyticsDataPoint,
  ActivityDataPoint,
  PlatformStats,
} from "@/lib/types";

export const fetchAnalyticsData = async (): Promise<{
  communities: AnalyticsCommunity[];
  platformStats: PlatformStats;
  activityData: ActivityDataPoint[];
  chartData: AnalyticsDataPoint[];
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const communities: AnalyticsCommunity[] = [
    { id: "1", name: "React Developers", members: 1250, posts: 342, comments: 1200, activity: 85 },
    { id: "2", name: "JavaScript Masters", members: 980, posts: 267, comments: 890, activity: 72 },
    { id: "3", name: "UI/UX Design", members: 756, posts: 189, comments: 650, activity: 68 },
    { id: "4", name: "Python Programmers", members: 634, posts: 156, comments: 420, activity: 55 },
    { id: "5", name: "Data Science Hub", members: 512, posts: 134, comments: 380, activity: 62 }
  ];

  const platformStats: PlatformStats = {
    totalUsers: 12500,
    totalCommunities: 45,
    totalPosts: 8900,
    totalReports: 23,
    activeUsers: 3400
  };

  const activityData: ActivityDataPoint[] = [
    { name: "Jan", posts: 500, users: 250 },
    { name: "Feb", posts: 650, users: 300 },
    { name: "Mar", posts: 720, users: 350 },
    { name: "Apr", posts: 800, users: 400 },
    { name: "May", posts: 900, users: 450 },
  ];

  const chartData: AnalyticsDataPoint[] = [
    { name: "Members", value: 12500, color: "#82ca9d" },
    { name: "Posts", value: 8900, color: "#8884d8" },
    { name: "Active", value: 3400, color: "#a8dadc" },
    { name: "New", value: 6700, color: "#457b9d" },
  ];

  return {
    communities,
    platformStats,
    activityData,
    chartData
  };
};
