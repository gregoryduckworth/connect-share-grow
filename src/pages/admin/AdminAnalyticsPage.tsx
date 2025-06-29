import { api } from "@/lib/api";
import { useEffect, useState, useMemo } from "react";
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

  // Centralized analytics data from api.ts
  const [communities, setCommunities] = useState([]);
  const [platformStats, setPlatformStats] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [sizeDistribution, setSizeDistribution] = useState([]);

  useEffect(() => {
    api.getAnalyticsCommunities().then(setCommunities);
    api.getPlatformStats().then(setPlatformStats);
    api.getActivityData().then(setActivityData);
    api.getSizeDistribution().then(setSizeDistribution);
  }, []);

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
  }, [selectedCommunity, communities]);

  const resetFilters = () => {
    setSelectedCommunity("all");
    setTimeRange("30");
  };

  const selectedCommunityData = communities.find(
    (c) => c.id === selectedCommunity
  );

  return (
    <div
      className="p-4 md:p-6 space-y-6 bg-background min-h-screen"
      data-testid="admin-analytics-page"
    >
      {/* Header with filters */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        data-testid="admin-analytics-header"
      >
        <h1
          className="text-3xl font-bold text-social-primary mb-2"
          data-testid="admin-analytics-title"
        >
          Analytics & Statistics
        </h1>
        <div
          className="flex flex-col md:flex-row gap-2"
          data-testid="admin-analytics-filters"
        >
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full md:w-48 justify-between px-4 py-0 h-12 flex items-center bg-white/90 border border-purple-200 rounded-lg shadow-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200/40 transition-colors"
                data-testid="admin-analytics-community-filter"
              >
                {selectedCommunity === "all"
                  ? "All Communities"
                  : communities.find((c) => c.id === selectedCommunity)?.name}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0">
              <Command>
                <CommandInput
                  placeholder="Search communities..."
                  data-testid="admin-analytics-community-search"
                />
                <CommandList>
                  <CommandEmpty>No community found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        setSelectedCommunity("all");
                        setOpen(false);
                      }}
                      data-testid="admin-analytics-community-all"
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
                        data-testid={`admin-analytics-community-option-${community.id}`}
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
            <SelectTrigger className="w-full md:w-32 bg-white/90 border border-purple-200 rounded-lg shadow-none px-4 py-0 h-12 flex items-center focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200/40 transition-colors">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7" data-testid="admin-analytics-timerange-7">
                7 days
              </SelectItem>
              <SelectItem value="30" data-testid="admin-analytics-timerange-30">
                30 days
              </SelectItem>
              <SelectItem value="90" data-testid="admin-analytics-timerange-90">
                90 days
              </SelectItem>
              <SelectItem
                value="365"
                data-testid="admin-analytics-timerange-365"
              >
                1 year
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="default"
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-0 h-12 min-w-[100px]"
            data-testid="admin-analytics-reset-button"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Filter indicator */}
      <div
        className="flex items-center gap-2 text-sm"
        data-testid="admin-analytics-filter-indicator"
      >
        <span className="text-muted-foreground">Showing:</span>
        <Badge variant="default" data-testid="admin-analytics-filter-community">
          {selectedCommunity === "all"
            ? "All Communities"
            : selectedCommunityData?.name}
        </Badge>
        <Badge variant="default" data-testid="admin-analytics-filter-timerange">
          Last {timeRange} days
        </Badge>
      </div>

      {/* Platform Overview Metrics */}
      {selectedCommunity === "all" && platformStats && (
        <>
          <div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            data-testid="admin-analytics-metrics-cards"
          >
            <AdminMetricsCard
              title="Total Users"
              value={platformStats?.totalUsers?.toLocaleString?.() ?? "-"}
              description="Registered platform users"
              icon={<Users className="h-4 w-4" />}
              trend={{ value: "+12% from last month", isPositive: true }}
              data-testid="admin-analytics-metric-users"
            />
            <AdminMetricsCard
              title="Total Communities"
              value={platformStats?.totalCommunities?.toLocaleString?.() ?? "-"}
              description="Active communities"
              icon={<Users className="h-4 w-4" />}
              trend={{ value: "+2 this month", isPositive: true }}
              data-testid="admin-analytics-metric-communities"
            />
            <AdminMetricsCard
              title="Total Posts"
              value={platformStats?.totalPosts?.toLocaleString?.() ?? "-"}
              description="Posts across all communities"
              icon={<MessageSquare className="h-4 w-4" />}
              trend={{ value: "+18% from last month", isPositive: true }}
              data-testid="admin-analytics-metric-posts"
            />
            <AdminMetricsCard
              title="Active Users"
              value={platformStats?.activeUsers?.toLocaleString?.() ?? "-"}
              description="Users active in last 30 days"
              icon={<TrendingUp className="h-4 w-4" />}
              trend={{ value: "66% of total users", isPositive: true }}
              data-testid="admin-analytics-metric-active-users"
            />
          </div>

          {/* Community Size Distribution */}
          <Card data-testid="admin-analytics-size-distribution-card">
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
                    dataKey="value"
                    data-testid="admin-analytics-size-distribution-pie"
                  >
                    {(sizeDistribution || []).map((entry, index) => {
                      const COLORS = [
                        "#8884d8",
                        "#82ca9d",
                        "#ffc658",
                        "#ff8042",
                        "#8dd1e1",
                        "#a4de6c",
                        "#d0ed57",
                        "#d8854f",
                        "#b47ddb",
                        "#f47fa1",
                      ];
                      const color =
                        entry.color || COLORS[index % COLORS.length];
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={color}
                          data-testid={`admin-analytics-size-distribution-segment-${index}`}
                        />
                      );
                    })}
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
        <div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          data-testid="admin-analytics-community-metrics"
        >
          <AdminMetricsCard
            title="Members"
            value={selectedCommunityData.members}
            description="Total community members"
            icon={<Users className="h-4 w-4" />}
            trend={{ value: "+8 this week", isPositive: true }}
            data-testid="admin-analytics-community-metric-members"
          />
          <AdminMetricsCard
            title="Posts"
            value={selectedCommunityData.posts}
            description="Total posts in community"
            icon={<MessageSquare className="h-4 w-4" />}
            trend={{ value: "+15 this week", isPositive: true }}
            data-testid="admin-analytics-community-metric-posts"
          />
          <AdminMetricsCard
            title="Comments"
            value={selectedCommunityData.comments}
            description="Total comments"
            icon={<MessageSquare className="h-4 w-4" />}
            trend={{ value: "+42 this week", isPositive: true }}
            data-testid="admin-analytics-community-metric-comments"
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
            data-testid="admin-analytics-community-metric-engagement"
          />
        </div>
      )}

      {/* Activity Chart */}
      <Card data-testid="admin-analytics-activity-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Activity Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={activityData}
              data-testid="admin-analytics-activity-chart"
            >
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
                data-testid="admin-analytics-activity-users"
              />
              <Line
                type="monotone"
                dataKey="posts"
                stroke="#82ca9d"
                name="Posts"
                data-testid="admin-analytics-activity-posts"
              />
              <Line
                type="monotone"
                dataKey="comments"
                stroke="#ffc658"
                name="Comments"
                data-testid="admin-analytics-activity-comments"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Community Breakdown */}
      <Card data-testid="admin-analytics-breakdown-card">
        <CardHeader>
          <CardTitle>Community Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={communityBreakdown}
              data-testid="admin-analytics-breakdown-chart"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="members"
                fill="#8884d8"
                name="Members"
                data-testid="admin-analytics-breakdown-members"
              />
              <Bar
                dataKey="posts"
                fill="#82ca9d"
                name="Posts"
                data-testid="admin-analytics-breakdown-posts"
              />
              <Bar
                dataKey="comments"
                fill="#ffc658"
                name="Comments"
                data-testid="admin-analytics-breakdown-comments"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsPage;
