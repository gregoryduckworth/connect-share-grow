
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PlatformStats, ActivityDataPoint } from "@/lib/types";

interface AdminAnalyticsOverviewProps {
  platformStats: PlatformStats | null;
  activityData: ActivityDataPoint[];
}

const AdminAnalyticsOverview = ({ platformStats, activityData }: AdminAnalyticsOverviewProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default AdminAnalyticsOverview;
