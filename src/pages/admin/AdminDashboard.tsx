import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users,
  MessageSquare,
  Shield,
  TrendingUp,
  AlertTriangle,
  Settings,
  ChevronRight,
} from "lucide-react";
import InactiveModeratorAlert from "@/components/admin/InactiveModeratorAlert";

const AdminDashboard = () => {
  return (
    <div
      className="p-4 md:p-6 space-y-6 bg-background min-h-screen"
      data-testid="admin-dashboard-page"
    >
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        data-testid="admin-dashboard-header"
      >
        <div>
          <h1
            className="text-3xl font-bold text-social-primary mb-2"
            data-testid="admin-dashboard-title"
          >
            Admin Dashboard
          </h1>
          <p
            className="text-sm sm:text-base text-muted-foreground"
            data-testid="admin-dashboard-description"
          >
            Manage your platform and monitor activity
          </p>
        </div>
      </div>

      <div
        className="grid gap-6 md:grid-cols-2"
        data-testid="admin-dashboard-quick-actions"
      >
        <Card
          className="md:col-span-1"
          data-testid="admin-dashboard-quick-actions-card"
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/users" className="block">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start h-10"
                data-testid="admin-dashboard-manage-users"
              >
                <Users className="h-4 w-4 mr-3" />
                Manage Users
              </Button>
            </Link>
            <Link to="/admin/communities" className="block">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start h-10"
                data-testid="admin-dashboard-manage-communities"
              >
                <MessageSquare className="h-4 w-4 mr-3" />
                Manage Communities
              </Button>
            </Link>
            <Link to="/admin/reports" className="block">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start h-10"
                data-testid="admin-dashboard-review-reports"
              >
                <AlertTriangle className="h-4 w-4 mr-3" />
                Review Reports
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card
          className="md:col-span-1"
          data-testid="admin-dashboard-moderation-card"
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Moderation
            </CardTitle>
            <CardDescription>Content and user moderation tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/roles" className="block">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start h-10"
                data-testid="admin-dashboard-manage-roles"
              >
                <Shield className="h-4 w-4 mr-3" />
                Manage Roles
              </Button>
            </Link>
            <Link to="/admin/logs" className="block">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start h-10"
                data-testid="admin-dashboard-view-logs"
              >
                <AlertTriangle className="h-4 w-4 mr-3" />
                View Audit Logs
              </Button>
            </Link>
            <Link to="/admin/settings" className="block">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start h-10"
                data-testid="admin-dashboard-settings"
              >
                <Settings className="h-4 w-4 mr-3" />
                Platform Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div
        className="grid gap-4 md:grid-cols-3"
        data-testid="admin-dashboard-metrics"
      >
        <Card data-testid="admin-dashboard-metric-users">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">2,847</div>
            <p className="text-xs text-green-500">+12% from last month</p>
            <p className="text-xs text-muted-foreground mt-1">
              Total registered users
            </p>
          </CardContent>
        </Card>

        <Card data-testid="admin-dashboard-metric-communities">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              Active Communities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">23</div>
            <p className="text-xs text-blue-500">+3 this week</p>
            <p className="text-xs text-muted-foreground mt-1">
              Communities with recent activity
            </p>
          </CardContent>
        </Card>

        <Card data-testid="admin-dashboard-metric-health">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Platform Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-500">
              Good
            </div>
            <div className="mt-2 space-y-1">
              <div className="text-xs">Uptime: 99.9%</div>
              <div className="text-xs">Response time: 120ms</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <InactiveModeratorAlert data-testid="admin-dashboard-inactive-moderator-alert" />

      <div
        className="grid gap-6 md:grid-cols-2"
        data-testid="admin-dashboard-approvals-reports"
      >
        <Card data-testid="admin-dashboard-approvals-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Community Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">
                  Communities pending approval
                </p>
              </div>
              <Link to="/admin/communities">
                <Button
                  variant="outline"
                  size="sm"
                  data-testid="admin-dashboard-approvals-view-all"
                >
                  View All
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="admin-dashboard-reports-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">
                  Reports requiring attention
                </p>
              </div>
              <Link to="/admin/reports">
                <Button
                  variant="outline"
                  size="sm"
                  data-testid="admin-dashboard-reports-review-all"
                >
                  Review All
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
