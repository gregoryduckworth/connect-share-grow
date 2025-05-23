
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminCommunityApprovals from "@/components/admin/AdminCommunityApprovals";
import AdminReports from "@/components/admin/AdminReports";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminAuditLogs from "@/components/admin/AdminAuditLogs";
import AdminMetricsCard from "@/components/admin/AdminMetricsCard";
import AdminActivityChart from "@/components/admin/AdminActivityChart";
import AdminCommunityMetrics from "@/components/admin/AdminCommunityMetrics";
import { UsersRound, AlertTriangle, Shield, History, MessageSquare, FileText, Award, BarChart3 } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock activity data for the past 7 days
  const activityData = [
    { date: 'Mon', users: 5, posts: 20, comments: 45 },
    { date: 'Tue', users: 8, posts: 15, comments: 38 },
    { date: 'Wed', users: 12, posts: 25, comments: 52 },
    { date: 'Thu', users: 7, posts: 18, comments: 40 },
    { date: 'Fri', users: 10, posts: 22, comments: 48 },
    { date: 'Sat', users: 15, posts: 30, comments: 65 },
    { date: 'Sun', users: 20, posts: 28, comments: 60 },
  ];

  // Mock community engagement data
  const communityEngagementData = [
    { name: 'Photography', value: 30, color: '#8884d8' },
    { name: 'Tech Talk', value: 25, color: '#82ca9d' },
    { name: 'Book Readers', value: 15, color: '#ffc658' },
    { name: 'Travel', value: 20, color: '#ff8042' },
    { name: 'Gaming', value: 10, color: '#0088fe' },
  ];

  // Mock community growth data
  const communityGrowthData = [
    { name: 'Photography', value: 25, color: '#8884d8' },
    { name: 'Tech Talk', value: 35, color: '#82ca9d' },
    { name: 'Book Readers', value: 10, color: '#ffc658' },
    { name: 'Travel', value: 15, color: '#ff8042' },
    { name: 'Gaming', value: 15, color: '#0088fe' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="approvals">Community Approvals</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AdminMetricsCard
              title="Total Users"
              value="1,234"
              description="21 new users today"
              icon={<UsersRound className="h-4 w-4" />}
              trend={{ value: "+8% from last week", isPositive: true }}
            />
            
            <AdminMetricsCard
              title="Active Communities"
              value="28"
              description="3 new this week"
              icon={<Shield className="h-4 w-4" />}
              trend={{ value: "+12% from last month", isPositive: true }}
            />
            
            <AdminMetricsCard
              title="Total Posts"
              value="3,872"
              description="154 created today"
              icon={<FileText className="h-4 w-4" />}
              trend={{ value: "+5% from last week", isPositive: true }}
            />
            
            <AdminMetricsCard
              title="Total Comments"
              value="12,489"
              description="352 created today"
              icon={<MessageSquare className="h-4 w-4" />}
              trend={{ value: "+18% from last week", isPositive: true }}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <AdminActivityChart title="Platform Activity (Last 7 Days)" data={activityData} />
            
            <div className="grid gap-4 grid-rows-2">
              <Card className="p-4">
                <div className="flex justify-between mb-2">
                  <div>
                    <h3 className="font-medium">New User Registration</h3>
                    <p className="text-sm text-muted-foreground">Last 30 days</p>
                  </div>
                  <span className="text-green-500 font-medium">+24%</span>
                </div>
                <Progress value={85} className="h-2" />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>0</span>
                  <span>124 users</span>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex justify-between mb-2">
                  <div>
                    <h3 className="font-medium">Active User Growth</h3>
                    <p className="text-sm text-muted-foreground">Last 30 days</p>
                  </div>
                  <span className="text-green-500 font-medium">+18%</span>
                </div>
                <Progress value={68} className="h-2" />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>0</span>
                  <span>425 users</span>
                </div>
              </Card>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <AdminCommunityMetrics title="Community Engagement" data={communityEngagementData} />
            <AdminCommunityMetrics title="Community Growth" data={communityGrowthData} />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Communities</CardTitle>
                <CardDescription>Most active communities by post volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span>Photography Enthusiasts</span>
                    </div>
                    <span className="font-medium">542 posts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-slate-400" />
                      <span>Tech Talk</span>
                    </div>
                    <span className="font-medium">425 posts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-700" />
                      <span>Book Readers</span>
                    </div>
                    <span className="font-medium">318 posts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-4" />
                      <span>Travel Adventures</span>
                    </div>
                    <span className="font-medium">256 posts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-4" />
                      <span>Gaming</span>
                    </div>
                    <span className="font-medium">224 posts</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>Reports and actions taken</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Pending reports</span>
                    <Badge className="bg-orange-500">12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Posts removed (this week)</span>
                    <span>24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Comments removed (this week)</span>
                    <span>47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>User warnings issued</span>
                    <span>8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Account suspensions</span>
                    <span>3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="approvals" className="mt-6">
          <AdminCommunityApprovals />
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <AdminReports />
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <AdminUsers />
        </TabsContent>
        
        <TabsContent value="logs" className="mt-6">
          <AdminAuditLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
