
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import type { Community } from '@/lib/types';

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
    filteredAndSortedData: filteredCommunities,
  } = useAdminFilters({
    data: communities,
    searchKey: 'name',
    sortKey: 'name',
    filterKey: 'memberCount',
  });

  const [timeRange, setTimeRange] = useState('7d');

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
          onFilterCategoryChange={setFilterCategory}
          sortBy={sortBy}
          onSortByChange={setSortBy}
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
              <AdminAnalyticsOverview timeRange={timeRange} />
            </TabsContent>

            <TabsContent value="communities" className="space-y-4">
              <AdminAnalyticsCommunities 
                communities={filteredCommunities}
                timeRange={timeRange}
              />
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4">
              <AdminAnalyticsEngagement 
                communities={filteredCommunities}
                timeRange={timeRange}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppErrorBoundary>
  );
};

export default AdminAnalyticsPage;
