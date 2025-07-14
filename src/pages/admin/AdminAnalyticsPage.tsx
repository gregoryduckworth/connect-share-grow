
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminAnalyticsFilters from '@/components/admin/AdminAnalyticsFilters';
import AdminAnalyticsOverview from '@/components/admin/AdminAnalyticsOverview';
import AdminAnalyticsCommunities from '@/components/admin/AdminAnalyticsCommunities';
import AdminAnalyticsEngagement from '@/components/admin/AdminAnalyticsEngagement';
import AppErrorBoundary from '@/components/common/AppErrorBoundary';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useAdminFilters } from '@/hooks/useAdminFilters';
import { communityService } from '@/lib/backend/services/communityService';
import type { Community, AnalyticsCommunity, PlatformStats, ActivityDataPoint, AnalyticsDataPoint } from '@/lib/types';

const AdminAnalyticsPage = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const { isLoading, error, startLoading, stopLoading, setLoadingError } = useLoadingState();
  
  const {
    searchQuery: communitySearch,
    setSearchQuery: setCommunitySearch,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    filterValue: filterCategory,
    setFilterValue: setFilterCategory,
  } = useAdminFilters({
    data: communities,
    searchKey: 'name',
    sortKey: 'name',
    filterKey: 'memberCount',
  });

  const [timeRange, setTimeRange] = useState('7d');
  const [selectedCommunityData, setSelectedCommunityData] = useState<AnalyticsCommunity | undefined>();

  // Mock data for analytics components
  const platformStats: PlatformStats = {
    totalUsers: 12453,
    totalCommunities: communities.length,
    totalPosts: 8967,
    activeUsers: 3421,
    totalReports: 142,
  };

  const activityData: ActivityDataPoint[] = [
    { name: 'Mon', posts: 120, users: 80 },
    { name: 'Tue', posts: 95, users: 65 },
    { name: 'Wed', posts: 140, users: 90 },
    { name: 'Thu', posts: 110, users: 75 },
    { name: 'Fri', posts: 165, users: 105 },
    { name: 'Sat', posts: 85, users: 55 },
    { name: 'Sun', posts: 75, users: 45 },
  ];

  const analyticsCommunitiesData: AnalyticsCommunity[] = communities.map((community) => ({
    id: community.id || community.slug,
    name: community.name,
    members: community.memberCount,
    posts: community.postCount,
    activity: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 500),
  }));

  const topCommunities = analyticsCommunitiesData.slice(0, 10);

  const chartData: AnalyticsDataPoint[] = [
    { name: 'Technology', value: 400 },
    { name: 'Creative Arts', value: 300 },
    { name: 'Health & Fitness', value: 200 },
    { name: 'Business', value: 150 },
  ];

  const communityGrowthData = analyticsCommunitiesData.map(community => ({
    name: community.name,
    members: community.members,
    posts: community.posts,
    comments: community.comments || 0,
    activity: community.activity || 0,
    engagementRate: `${Math.floor(Math.random() * 50 + 10)}%`,
  }));

  useEffect(() => {
    const loadCommunities = async () => {
      startLoading();
      try {
        const data = await communityService.getCommunities();
        setCommunities(data);
      } catch (err) {
        setLoadingError(err as Error);
      } finally {
        stopLoading();
      }
    };

    loadCommunities();
  }, [startLoading, stopLoading, setLoadingError]);

  const handleCommunitySelect = (communityName: string) => {
    const selected = analyticsCommunitiesData.find(c => c.name === communityName);
    setSelectedCommunityData(selected);
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error loading analytics data: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AppErrorBoundary level="page">
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Monitor community activity and engagement metrics
          </p>
        </div>

        <AdminAnalyticsFilters
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          filterCategory={filterCategory}
          onFilterCategoryChange={(value: string) => setFilterCategory(value)}
          sortBy={String(sortBy)}
          onSortByChange={(value: string) => setSortBy(value as keyof Community)}
          sortOrder={sortOrder}
          onSortToggle={toggleSortOrder}
          communitySearch={communitySearch}
          onCommunitySearchChange={setCommunitySearch}
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading analytics data..." />
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
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
                filteredCommunities={analyticsCommunitiesData}
                sortBy={String(sortBy)}
                selectedCommunityData={selectedCommunityData}
                onCommunitySelect={handleCommunitySelect}
              />
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4">
              <AdminAnalyticsEngagement 
                communityGrowthData={communityGrowthData}
                chartData={chartData}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppErrorBoundary>
  );
};

export default AdminAnalyticsPage;
