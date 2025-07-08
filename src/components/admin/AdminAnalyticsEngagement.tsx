
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { AnalyticsDataPoint } from "@/lib/types";

interface CommunityGrowthData {
  name: string;
  members: number;
  posts: number;
  comments: number;
  activity: number;
  engagementRate: string;
}

interface AdminAnalyticsEngagementProps {
  communityGrowthData: CommunityGrowthData[];
  chartData: AnalyticsDataPoint[];
}

const AdminAnalyticsEngagement = ({ communityGrowthData, chartData }: AdminAnalyticsEngagementProps) => {
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
    <div className="space-y-4">
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
    </div>
  );
};

export default AdminAnalyticsEngagement;
