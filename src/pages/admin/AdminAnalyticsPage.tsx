
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp } from "lucide-react";
import { fetchAnalyticsData } from "@/lib/backend/services/adminService";
import { AnalyticsCommunity, PlatformStats, ActivityDataPoint, AnalyticsDataPoint } from "@/lib/types";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminAnalyticsFilters from "@/components/admin/AdminAnalyticsFilters";
import AdminAnalyticsOverview from "@/components/admin/AdminAnalyticsOverview";
import AdminAnalyticsCommunities from "@/components/admin/AdminAnalyticsCommunities";
import AdminAnalyticsEngagement from "@/components/admin/AdminAnalyticsEngagement";

const AdminAnalyticsPage = () => {
  const [communities, setCommunities] = useState<AnalyticsCommunity[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [activityData, setActivityData] = useState<ActivityDataPoint[]>([]);
  const [chartData, setChartData] = useState<AnalyticsDataPoint[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("7d");
  const [sortBy, setSortBy] = useState<string>("members");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAnalyticsData();
        setCommunities(data.communities);
        setPlatformStats(data.platformStats);
        setActivityData(data.activityData);
        setChartData(data.chartData);
      } catch (error) {
        console.error("Failed to load analytics data:", error);
      }
    };

    loadData();
  }, []);

  const sortedCommunities = [...communities].sort((a, b) => {
    const aValue = sortBy === "members" ? a.members : 
                   sortBy === "posts" ? a.posts : 
                   sortBy === "activity" ? (a.activity || 0) : a.members;
    const bValue = sortBy === "members" ? b.members : 
                   sortBy === "posts" ? b.posts : 
                   sortBy === "activity" ? (b.activity || 0) : b.members;
    
    return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
  });

  const filteredCommunities = sortedCommunities.filter(community => {
    if (filterCategory === "all") return true;
    if (filterCategory === "high-activity") return (community.activity || 0) > 70;
    if (filterCategory === "low-activity") return (community.activity || 0) < 50;
    return true;
  });

  const topCommunities = filteredCommunities.slice(0, 10);

  const communityGrowthData = filteredCommunities.map((community) => ({
    name: community.name,
    members: community.members,
    posts: community.posts,
    comments: community.comments || 0,
    activity: community.activity || 0,
    engagementRate: community.comments && community.posts ? 
      ((community.comments / community.posts) * 100).toFixed(1) : "0.0",
  }));

  const selectedCommunityData = communities.find(
    (c) => c.name === selectedCommunity
  );

  const handleSortToggle = () => {
    setSortOrder(prev => prev === "desc" ? "asc" : "desc");
  };

  return (
    <div className="space-y-6 p-6">
      <AdminHeader />

      <AdminAnalyticsFilters
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        filterCategory={filterCategory}
        onFilterCategoryChange={setFilterCategory}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortToggle={handleSortToggle}
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="overview">
            <TrendingUp className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="communities">Communities</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AdminAnalyticsOverview
            platformStats={platformStats}
            activityData={activityData}
          />
        </TabsContent>

        <TabsContent value="communities" className="space-y-4">
          <AdminAnalyticsCommunities
            topCommunities={topCommunities}
            filteredCommunities={filteredCommunities}
            sortBy={sortBy}
            selectedCommunityData={selectedCommunityData}
            onCommunitySelect={setSelectedCommunity}
          />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <AdminAnalyticsEngagement
            communityGrowthData={communityGrowthData}
            chartData={chartData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalyticsPage;
