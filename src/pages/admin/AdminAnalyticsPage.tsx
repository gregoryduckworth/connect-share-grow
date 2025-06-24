import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  MessageSquare,
  UserPlus,
  TrendingUp,
  Calendar,
  RotateCcw,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import AdminMetricsCard from "@/components/admin/AdminMetricsCard";

const AdminAnalyticsPage = () => {
  const [selectedCommunity, setSelectedCommunity] = useState("all");
  const [timeRange, setTimeRange] = useState("30");
  const [open, setOpen] = useState(false);

  // Mock data for communities
  const communities = [
    {
      id: "comm-1",
      name: "Photography Enthusiasts",
      members: 128,
      posts: 342,
      comments: 1456,
    },
    {
      id: "comm-2",
      name: "Tech Talk",
      members: 256,
      posts: 789,
      comments: 2890,
    },
    {
      id: "comm-3",
      name: "Book Readers",
      members: 96,
      posts: 156,
      comments: 678,
    },
    {
      id: "comm-4",
      name: "Travel Adventures",
      members: 78,
      posts: 234,
      comments: 890,
    },
    {
      id: "comm-5",
      name: "Fitness & Health",
      members: 189,
      posts: 445,
      comments: 1234,
    },
  ];

  // Mock analytics data
  const platformStats = {
    totalUsers: 2847,
    totalCommunities: 12,
    totalPosts: 5673,
    totalComments: 18429,
    activeUsers: 1892,
    newUsersThisMonth: 342,
    reportsCount: 23,
    moderatorsCount: 15,
  };

  // Community breakdown data
  const communityBreakdown = useMemo(() => {
    if (selectedCommunity === "all") {
      return communities.map((community) => ({
        name: community.name,
        members: community.members,
        posts: community.posts,
        comments: community.comments,
        engagement: ((community.comments / community.posts) * 100).toFixed(1),
      }));
    } else {
      return communities
        .filter((c) => c.id === selectedCommunity)
        .map((community) => ({
          name: community.name,
          members: community.members,
          posts: community.posts,
          comments: community.comments,
          engagement: ((community.comments / community.posts) * 100).toFixed(1),
        }));
    }
  }, [selectedCommunity]);

  // Mock time-series data
  const activityData = [
    { date: "2024-06-01", users: 120, posts: 45, comments: 180 },
    { date: "2024-06-07", users: 135, posts: 52, comments: 210 },
    { date: "2024-06-14", users: 142, posts: 48, comments: 195 },
    { date: "2024-06-21", users: 158, posts: 61, comments: 240 },
  ];

  const sizeDistribution = [
    { name: "Small (0-50)", value: 3, color: "#8884d8" },
    { name: "Medium (51-150)", value: 6, color: "#82ca9d" },
    { name: "Large (151+)", value: 3, color: "#ffc658" },
  ];

  const resetFilters = () => {
    setSelectedCommunity("all");
    setTimeRange("30");
  };

  const selectedCommunityData = communities.find(
    (c) => c.id === selectedCommunity
  );

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-social-primary mb-2">
          Analytics & Statistics
        </h1>
        <div className="flex flex-col md:flex-row gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full md:w-48 justify-between"
              >
                {selectedCommunity === "all"
                  ? "All Communities"
                  : communities.find((c) => c.id === selectedCommunity)?.name}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0">
              <Command>
                <CommandInput placeholder="Search communities..." />
                <CommandList>
                  <CommandEmpty>No community found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        setSelectedCommunity("all");
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          selectedCommunity === "all"
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      All Communities
                    </CommandItem>
                    {communities.map((community) => (
                      <CommandItem
                        key={community.id}
                        value={community.name}
                        onSelect={() => {
                          setSelectedCommunity(community.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedCommunity === community.id
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        {community.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full md:w-32">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="365">1 year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={resetFilters}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Filter indicator */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Showing:</span>
        <Badge variant="outline">
          {selectedCommunity === "all"
            ? "All Communities"
            : selectedCommunityData?.name}
        </Badge>
        <Badge variant="outline">Last {timeRange} days</Badge>
      </div>

      {/* Platform Overview Metrics */}
      {selectedCommunity === "all" && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AdminMetricsCard
              title="Total Users"
              value={platformStats.totalUsers.toLocaleString()}
              description="Registered platform users"
              icon={<Users className="h-4 w-4" />}
              trend={{ value: "+12% from last month", isPositive: true }}
            />
            <AdminMetricsCard
              title="Total Communities"
              value={platformStats.totalCommunities}
              description="Active communities"
              icon={<Users className="h-4 w-4" />}
              trend={{ value: "+2 this month", isPositive: true }}
            />
            <AdminMetricsCard
              title="Total Posts"
              value={platformStats.totalPosts.toLocaleString()}
              description="Posts across all communities"
              icon={<MessageSquare className="h-4 w-4" />}
              trend={{ value: "+18% from last month", isPositive: true }}
            />
            <AdminMetricsCard
              title="Active Users"
              value={platformStats.activeUsers.toLocaleString()}
              description="Users active in last 30 days"
              icon={<TrendingUp className="h-4 w-4" />}
              trend={{ value: "66% of total users", isPositive: true }}
            />
          </div>

          {/* Community Size Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Community Size Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sizeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sizeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}

      {/* Community-specific metrics */}
      {selectedCommunity !== "all" && selectedCommunityData && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AdminMetricsCard
            title="Members"
            value={selectedCommunityData.members}
            description="Total community members"
            icon={<Users className="h-4 w-4" />}
            trend={{ value: "+8 this week", isPositive: true }}
          />
          <AdminMetricsCard
            title="Posts"
            value={selectedCommunityData.posts}
            description="Total posts in community"
            icon={<MessageSquare className="h-4 w-4" />}
            trend={{ value: "+15 this week", isPositive: true }}
          />
          <AdminMetricsCard
            title="Comments"
            value={selectedCommunityData.comments}
            description="Total comments"
            icon={<MessageSquare className="h-4 w-4" />}
            trend={{ value: "+42 this week", isPositive: true }}
          />
          <AdminMetricsCard
            title="Engagement Rate"
            value={`${(
              (selectedCommunityData.comments / selectedCommunityData.posts) *
              100
            ).toFixed(1)}%`}
            description="Comments per post"
            icon={<TrendingUp className="h-4 w-4" />}
            trend={{ value: "Above average", isPositive: true }}
          />
        </div>
      )}

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Activity Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#8884d8"
                name="Active Users"
              />
              <Line
                type="monotone"
                dataKey="posts"
                stroke="#82ca9d"
                name="Posts"
              />
              <Line
                type="monotone"
                dataKey="comments"
                stroke="#ffc658"
                name="Comments"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Community Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Community Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={communityBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="members" fill="#8884d8" name="Members" />
              <Bar dataKey="posts" fill="#82ca9d" name="Posts" />
              <Bar dataKey="comments" fill="#ffc658" name="Comments" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsPage;
