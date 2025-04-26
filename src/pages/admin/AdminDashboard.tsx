
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminCommunityApprovals from "@/components/admin/AdminCommunityApprovals";
import AdminReports from "@/components/admin/AdminReports";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminAuditLogs from "@/components/admin/AdminAuditLogs";
import { UsersRound, AlertTriangle, Shield, History } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Communities</CardTitle>
                <Shield className="h-4 w-4 text-social-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">+2 since last week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Reports</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+5 since yesterday</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <UsersRound className="h-4 w-4 text-social-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+21 new users today</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Admin Actions</CardTitle>
                <History className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48</div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Community Requests</CardTitle>
                <CardDescription>Latest community creation requests pending approval</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="p-2 rounded-md hover:bg-muted">Travel Photography Group - 4 hours ago</li>
                  <li className="p-2 rounded-md hover:bg-muted">Machine Learning Enthusiasts - 6 hours ago</li>
                  <li className="p-2 rounded-md hover:bg-muted">Vegan Recipe Sharing - 1 day ago</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Admin Actions</CardTitle>
                <CardDescription>Latest actions taken by admin team members</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="p-2 rounded-md hover:bg-muted">Content removed by admin: JohnDoe - 1 hour ago</li>
                  <li className="p-2 rounded-md hover:bg-muted">User warned for inappropriate content - 3 hours ago</li>
                  <li className="p-2 rounded-md hover:bg-muted">Community approved: Fitness Group - 5 hours ago</li>
                </ul>
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
