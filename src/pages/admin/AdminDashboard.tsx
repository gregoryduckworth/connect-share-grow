
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, Users, MessageSquare, Shield, TrendingUp, AlertTriangle } from "lucide-react";
import AdminCommunityApprovals from "@/components/admin/AdminCommunityApprovals";
import AdminReports from "@/components/admin/AdminReports";
import InactiveModeratorAlert from "@/components/admin/InactiveModeratorAlert";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-social-primary">Admin Dashboard</h2>
          <p className="text-social-muted">Manage your platform and monitor activity</p>
        </div>
        <Link to="/admin/analytics">
          <Button className="bg-social-primary hover:bg-social-secondary">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </Link>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link to="/admin/users">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
              </Link>
              <Link to="/admin/communities">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Manage Communities
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Moderation</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link to="/admin/roles">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Manage Roles
                </Button>
              </Link>
              <Link to="/admin/logs">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  View Audit Logs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-green-500">+12% from last month</p>
            <p className="text-xs text-muted-foreground mt-1">Total registered users</p>
            <Link to="/admin/analytics">
              <Button variant="outline" size="sm" className="w-full mt-2">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Full Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Good</div>
            <p className="text-xs text-muted-foreground">System status</p>
            <div className="mt-2 space-y-1">
              <div className="text-xs">Uptime: 99.9%</div>
              <div className="text-xs">Response time: 120ms</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inactive Moderator Alert */}
      <InactiveModeratorAlert />

      {/* Community Approvals and Reports */}
      <div className="grid gap-6 md:grid-cols-2">
        <AdminCommunityApprovals />
        <AdminReports />
      </div>
    </div>
  );
};

export default AdminDashboard;
