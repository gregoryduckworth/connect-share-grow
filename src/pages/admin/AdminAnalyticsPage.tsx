
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Calendar, Filter, ArrowUpDown } from "lucide-react";
import { fetchAnalyticsData } from "@/lib/backend/services/adminService";
import { AnalyticsCommunity, PlatformStats, ActivityDataPoint, AnalyticsDataPoint } from "@/lib/types";
import AdminHeader from "@/components/admin/AdminHeader";

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

  const COLORS = [
    "#0088FE",
    "#00C49F", 
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#a4de6c",
    "#d0ed57",
    "#ffc658",
    "#ff7300",
  ];

  const handleSortToggle = () => {
    setSortOrder(prev => prev === "desc" ? "asc" : "desc");
  };

  return (
    <div className="space-y-6 p-6">
      <AdminHeader />

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Communities</SelectItem>
              <SelectItem value="high-activity">High Activity</SelectItem>
              <SelectItem value="low-activity">Low Activity</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="members">Members</SelectItem>
              <SelectItem value="posts">Posts</SelectItem>
              <SelectItem value="activity">Activity</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSortToggle}
            className="px-3"
          >
            {sortOrder === "desc" ? "↓" : "↑"}
          </Button>
        </div>
      </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {platformStats?.totalUsers?.toLocaleString() || "Loading..."}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Communities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {platformStats?.totalCommunities?.toLocaleString() || "Loading..."}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {platformStats?.totalPosts?.toLocaleString() || "Loading..."}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +24% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {platformStats?.activeUsers?.toLocaleString() || "Loading..."}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +18% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Activity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="posts" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Posts"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    name="Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communities" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                Top Communities by {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Showing {topCommunities.length} of {filteredCommunities.length} communities
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">Members</TableHead>
                    <TableHead className="text-muted-foreground">Posts</TableHead>
                    <TableHead className="text-muted-foreground">Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCommunities.map((community) => (
                    <TableRow 
                      key={community.id}
                      className="cursor-pointer hover:bg-muted/50 border-border"
                      onClick={() => setSelectedCommunity(community.name)}
                    >
                      <TableCell className="font-medium text-foreground">
                        {community.name}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {community.members.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {community.posts.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-foreground">
                        <div className="flex items-center">
                          <div className="w-12 bg-muted rounded-full h-2 mr-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${community.activity || 0}%` }}
                            />
                          </div>
                          {community.activity || 0}%
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Community Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCommunityData ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    {selectedCommunityData.name}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Members</p>
                      <p className="text-2xl font-bold text-foreground">
                        {selectedCommunityData.members.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Posts</p>
                      <p className="text-2xl font-bold text-foreground">
                        {selectedCommunityData.posts.toLocaleString()}
                      </p>
                    </div>
                    {selectedCommunityData.comments !== undefined && (
                      <div>
                        <p className="text-sm text-muted-foreground">Comments</p>
                        <p className="text-2xl font-bold text-foreground">
                          {selectedCommunityData.comments.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {selectedCommunityData.activity !== undefined && (
                      <div>
                        <p className="text-sm text-muted-foreground">Activity</p>
                        <p className="text-2xl font-bold text-foreground">
                          {selectedCommunityData.activity}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Click on a community to view details.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Community Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={communityGrowthData.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                  />
                  <Bar dataKey="members" fill="hsl(var(--primary))" name="Members" />
                  <Bar dataKey="posts" fill="hsl(var(--secondary))" name="Posts" />
                  <Bar dataKey="activity" fill="hsl(var(--accent))" name="Activity %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Content Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={160}
                    fill="hsl(var(--primary))"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalyticsPage;
