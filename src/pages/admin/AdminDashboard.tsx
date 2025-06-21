
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, MessageSquare, Shield, TrendingUp, AlertTriangle, Settings } from "lucide-react";
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
      </div>

      {/* Quick Stats and Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-social-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/users" className="block">
              <Button variant="outline" size="sm" className="w-full justify-start h-10">
                <Users className="h-4 w-4 mr-3" />
                Manage Users
              </Button>
            </Link>
            <Link to="/admin/communities" className="block">
              <Button variant="outline" size="sm" className="w-full justify-start h-10">
                <MessageSquare className="h-4 w-4 mr-3" />
                Manage Communities
              </Button>
            </Link>
            <Link to="/admin/reports" className="block">
              <Button variant="outline" size="sm" className="w-full justify-start h-10">
                <AlertTriangle className="h-4 w-4 mr-3" />
                Review Reports
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Moderation */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-social-primary" />
              Moderation
            </CardTitle>
            <CardDescription>Content and user moderation tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/roles" className="block">
              <Button variant="outline" size="sm" className="w-full justify-start h-10">
                <Shield className="h-4 w-4 mr-3" />
                Manage Roles
              </Button>
            </Link>
            <Link to="/admin/logs" className="block">
              <Button variant="outline" size="sm" className="w-full justify-start h-10">
                <AlertTriangle className="h-4 w-4 mr-3" />
                View Audit Logs
              </Button>
            </Link>
            <Link to="/admin/settings" className="block">
              <Button variant="outline" size="sm" className="w-full justify-start h-10">
                <Settings className="h-4 w-4 mr-3" />
                Platform Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Platform Health */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-green-500">+12% from last month</p>
            <p className="text-xs text-muted-foreground mt-1">Total registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              Active Communities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-blue-500">+3 this week</p>
            <p className="text-xs text-muted-foreground mt-1">Communities with recent activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Platform Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Good</div>
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
