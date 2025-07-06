
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { TrendingUp } from "lucide-react";
import { fetchAnalyticsData } from "@/lib/backend/services/adminService";
import { AnalyticsCommunity, PlatformStats, ActivityDataPoint, AnalyticsDataPoint } from "@/lib/types";

const AdminAnalyticsPage = () => {
  const [communities, setCommunities] = useState<AnalyticsCommunity[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [activityData, setActivityData] = useState<ActivityDataPoint[]>([]);
  const [chartData, setChartData] = useState<AnalyticsDataPoint[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);

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

  const topCommunities = communities
    .sort((a, b) => b.members - a.members)
    .slice(0, 10);

  const communityGrowthData = communities.map((community) => ({
    name: community.name,
    members: community.members,
    posts: community.posts,
    comments: community.comments || 0,
    engagementRate: community.comments && community.posts ? (community.comments / community.posts).toFixed(1) : "0.0",
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <TrendingUp className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="communities">Communities</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {platformStats?.totalUsers || "Loading..."}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Communities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {platformStats?.totalCommunities || "Loading..."}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {platformStats?.totalPosts || "Loading..."}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {platformStats?.activeUsers || "Loading..."}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="posts" stroke="#8884d8" />
                  <Line type="monotone" dataKey="users" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Communities by Members</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Posts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCommunities.map((community) => (
                    <TableRow 
                      key={community.id}
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => setSelectedCommunity(community.name)}
                    >
                      <TableCell>{community.name}</TableCell>
                      <TableCell>{community.members}</TableCell>
                      <TableCell>{community.posts}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCommunityData ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">{selectedCommunityData.name}</h3>
                  <p>Members: {selectedCommunityData.members}</p>
                  <p>Posts: {selectedCommunityData.posts}</p>
                  {selectedCommunityData.comments !== undefined && (
                    <p>Comments: {selectedCommunityData.comments}</p>
                  )}
                  {selectedCommunityData.activity !== undefined && (
                    <p>Activity: {selectedCommunityData.activity}%</p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Click on a community to view details.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={communityGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="members" fill="#8884d8" />
                  <Bar dataKey="posts" fill="#82ca9d" />
                  {communityGrowthData[0]?.engagementRate !== undefined && (
                    <Bar dataKey="engagementRate" fill="#ffc658" />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Category Distribution</CardTitle>
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
                    fill="#8884d8"
                    label
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
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
