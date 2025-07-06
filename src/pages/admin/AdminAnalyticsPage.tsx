import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  ArrowDown,
  ArrowUp,
  Users,
  LayoutDashboard,
  MessageSquare,
  Flag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AnalyticsDataPoint,
  AnalyticsCommunity,
  ActivityDataPoint,
  PlatformStats,
} from "@/lib/types";

const AdminAnalyticsPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [selectedCommunitiesData, setSelectedCommunitiesData] = useState<AnalyticsCommunity[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalCommunities: 0,
    totalPosts: 0,
    totalReports: 0,
    activeUsers: 0,
  });
  const [activityChartData, setActivityChartData] = useState<ActivityDataPoint[]>([]);
  const [growthChartData, setGrowthChartData] = useState<AnalyticsDataPoint[]>([]);

  useEffect(() => {
    const initialCommunitiesData: AnalyticsCommunity[] = [
      {
        id: "community-1",
        name: "Tech Enthusiasts",
        members: 1234,
        posts: 567,
        comments: 234,
        activity: 89,
      },
      {
        id: "community-2",
        name: "Bookworms United",
        members: 876,
        posts: 432,
        comments: 187,
        activity: 67,
      },
      {
        id: "community-3",
        name: "Fitness Fanatics",
        members: 987,
        posts: 654,
        comments: 321,
        activity: 98,
      },
      {
        id: "community-4",
        name: "Foodie Adventures",
        members: 1122,
        posts: 789,
        comments: 456,
        activity: 112,
      },
      {
        id: "community-5",
        name: "Travel Junkies",
        members: 765,
        posts: 321,
        comments: 123,
        activity: 56,
      },
    ];

    const initialPlatformStats: PlatformStats = {
      totalUsers: 5432,
      totalCommunities: 123,
      totalPosts: 9876,
      totalReports: 456,
      activeUsers: 3211,
    };

    const initialActivityChartData: ActivityDataPoint[] = [
      { name: "Jan", posts: 120, users: 80 },
      { name: "Feb", posts: 150, users: 90 },
      { name: "Mar", posts: 180, users: 100 },
      { name: "Apr", posts: 200, users: 110 },
      { name: "May", posts: 220, users: 120 },
    ];

    const initialGrowthChartData: AnalyticsDataPoint[] = [
      { name: "Jan", value: 120, color: "#FF6633" },
      { name: "Feb", value: 150, color: "#66B2FF" },
      { name: "Mar", value: 180, color: "#99FF99" },
      { name: "Apr", value: 200, color: "#FFCC99" },
      { name: "May", value: 220, color: "#CC99FF" },
    ];

    setSelectedCommunitiesData(initialCommunitiesData);
    setPlatformStats(initialPlatformStats);
    setActivityChartData(initialActivityChartData);
    setGrowthChartData(initialGrowthChartData);
  }, []);

  const filteredCommunities = selectedCommunitiesData.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const transformedCommunitiesData = filteredCommunities.map((community) => ({
    name: community.name,
    members: community.members,
    posts: community.posts,
    comments: community.comments || 0,
    engagement: (community.comments || 0) / community.posts || 0,
  }));

  const handleCommunityClick = (data: any) => {
    const community = selectedCommunitiesData.find((c) => c.id === data.payload.id);
    if (community) {
      setSelectedCommunity(community.name);
      toast({
        title: "Community Selected",
        description: `You have selected ${community.name}.`,
      });
      navigate(`/community/${community.name.toLowerCase().replace(/ /g, "-")}`);
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const selectedCommunityData = selectedCommunitiesData.find((c) => c.name === selectedCommunity);

  const communityEngagement = selectedCommunityData?.comments && selectedCommunityData?.posts
    ? (selectedCommunityData.comments / selectedCommunityData.posts) * 100
    : 0;

  const engagementRate = selectedCommunityData?.comments || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search communities..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-50 text-blue-900">
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{platformStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 text-green-900">
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{platformStats.totalCommunities}</div>
            <p className="text-xs text-muted-foreground">Total Communities</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 text-orange-900">
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{platformStats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">Total Posts</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 text-red-900">
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{platformStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{platformStats.activeUsers} from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 lg:col-span-1">
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Community Engagement</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transformedCommunitiesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="members" fill="#8884d8" />
                <Bar dataKey="posts" fill="#82ca9d" />
                <Bar dataKey="comments" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-1">
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Activity Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="posts" fill="#8884d8" />
                <Bar dataKey="users" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Community Details</h3>
          {selectedCommunityData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <p className="font-bold">{selectedCommunityData.name}</p>
              </div>
              <div>
                <Label>Members</Label>
                <p className="font-bold">{selectedCommunityData.members}</p>
              </div>
              <div>
                <Label>Posts</Label>
                <p className="font-bold">{selectedCommunityData.posts}</p>
              </div>
              <div>
                <Label>Comments</Label>
                <p className="font-bold">{selectedCommunityData.comments}</p>
              </div>
              <div>
                <Label>Engagement Rate</Label>
                <p className="font-bold">{communityEngagement.toFixed(2)}%</p>
              </div>
              <div>
                <Label>Total Engagement</Label>
                <p className="font-bold">{engagementRate}</p>
              </div>
            </div>
          ) : (
            <p>Select a community to view details.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Community Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={growthChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {growthChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Top Communities</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead>Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transformedCommunitiesData.map((community) => (
                <TableRow key={community.name}>
                  <TableCell>{community.name}</TableCell>
                  <TableCell>{community.members}</TableCell>
                  <TableCell>{community.posts}</TableCell>
                  <TableCell>{community.comments}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsPage;
