
import { Shield, User, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RoleUser {
  id: string;
  name: string;
  email: string;
  joinDate: Date;
  communities?: string[];
}

interface Role {
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  users: RoleUser[];
  icon: React.ReactNode;
  color: string;
}

type ApiRole = Omit<Role, "icon"> & { icon: string };

const AdminRolesPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    // Mock data since api.getAdminRoles() might not exist
    const mockRoles: Role[] = [
      {
        name: "Admin",
        description: "Full administrative access to all platform features",
        permissions: [
          "Manage all users and communities",
          "Access system settings",
          "View analytics and reports",
          "Moderate content across platform",
          "Manage roles and permissions"
        ],
        userCount: 3,
        users: [
          {
            id: "admin-1",
            name: "John Admin",
            email: "john.admin@example.com",
            joinDate: new Date("2024-01-01"),
            communities: ["All Communities"]
          },
          {
            id: "admin-2", 
            name: "Sarah System",
            email: "sarah.system@example.com",
            joinDate: new Date("2024-01-15"),
            communities: ["All Communities"]
          },
          {
            id: "admin-3",
            name: "Mike Manager",
            email: "mike.manager@example.com", 
            joinDate: new Date("2024-02-01"),
            communities: ["All Communities"]
          }
        ],
        icon: <Crown className="h-5 w-5" />,
        color: "bg-yellow-500"
      },
      {
        name: "Moderator",
        description: "Community moderation and content management",
        permissions: [
          "Moderate assigned communities",
          "Manage posts and replies",
          "Handle user reports",
          "Warn and suspend users",
          "Lock/unlock content"
        ],
        userCount: 12,
        users: [
          {
            id: "mod-1",
            name: "Alex Moderator",
            email: "alex.mod@example.com",
            joinDate: new Date("2024-01-10"),
            communities: ["React Developers", "JavaScript Masters"]
          },
          {
            id: "mod-2",
            name: "Lisa Community",
            email: "lisa.community@example.com",
            joinDate: new Date("2024-01-20"),
            communities: ["UI/UX Design", "Web Development"]
          },
          {
            id: "mod-3",
            name: "David Guard",
            email: "david.guard@example.com",
            joinDate: new Date("2024-02-05"),
            communities: ["Python Programmers", "Data Science Hub"]
          }
        ],
        icon: <Shield className="h-5 w-5" />,
        color: "bg-blue-500"
      },
      {
        name: "User",
        description: "Standard user with basic platform access",
        permissions: [
          "Create and join communities",
          "Post and reply to content",
          "Vote on posts and replies",
          "Report inappropriate content",
          "Customize profile settings"
        ],
        userCount: 2847,
        users: [
          {
            id: "user-1",
            name: "Emma User",
            email: "emma.user@example.com",
            joinDate: new Date("2024-03-01"),
            communities: ["React Developers", "UI/UX Design", "Web Development"]
          },
          {
            id: "user-2",
            name: "James Developer",
            email: "james.dev@example.com",
            joinDate: new Date("2024-03-05"),
            communities: ["JavaScript Masters", "Python Programmers"]
          },
          {
            id: "user-3",
            name: "Sophie Designer",
            email: "sophie.design@example.com",
            joinDate: new Date("2024-03-10"),
            communities: ["UI/UX Design", "Web Development"]
          }
        ],
        icon: <User className="h-5 w-5" />,
        color: "bg-green-500"
      }
    ];

    setRoles(mockRoles);
  }, []);

  const RoleCard = ({ role }: { role: Role }) => (
    <Card
      className="flex flex-col h-full border-border bg-white/50 backdrop-blur-sm"
      data-testid={`admin-role-card-${role.name}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${role.color} text-white`}>
              {role.icon}
            </div>
            <span className="text-social-primary">{role.name}</span>
          </CardTitle>
          <Badge variant="secondary">
            {role.userCount} {role.userCount === 1 ? "user" : "users"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <p className="text-social-muted">{role.description}</p>

        <div>
          <h4 className="font-medium mb-2 text-social-primary">Permissions:</h4>
          <ul className="space-y-1">
            {role.permissions.map((permission, index) => (
              <li
                key={index}
                className="text-sm text-social-muted flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-social-primary" />
                {permission}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1" />

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full mt-4 border-purple-200 text-purple-600 hover:bg-purple-50">
              <User className="h-4 w-4 mr-2" />
              View All {role.name}s
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${role.color} text-white`}>
                  {role.icon}
                </div>
                All {role.name}s ({role.userCount})
              </DialogTitle>
              <DialogDescription>
                Users with the {role.name} role and their associated communities
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {role.users.map((user) => (
                <Card key={user.id} className="p-4 border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-social-primary flex items-center justify-center text-white">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-social-primary">{user.name}</p>
                        <p className="text-sm text-social-muted">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-400">
                          Joined {formatDate(user.joinDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {user.communities && user.communities.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-1 text-social-primary">Communities:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.communities.map((community, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs border-purple-200 text-purple-600"
                          >
                            {community}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}

              {role.name === "User" && role.userCount > role.users.length && (
                <div className="text-center p-4 text-social-muted">
                  <p>Showing first {role.users.length} users</p>
                  <p className="text-sm">Total: {role.userCount} users</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );

  return (
    <div
      className="p-4 md:p-6 space-y-6 bg-background min-h-screen"
      data-testid="admin-roles-page"
    >
      <div>
        <h1
          className="text-3xl font-bold text-social-primary mb-2"
          data-testid="admin-roles-title"
        >
          Roles & Permissions
        </h1>
        <p className="text-social-muted" data-testid="admin-roles-description">
          Manage user roles and view their permissions across the platform
        </p>
      </div>

      <div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        data-testid="admin-roles-grid"
      >
        {roles.map((role) => (
          <RoleCard
            key={role.name}
            role={role}
            data-testid={`admin-role-card-${role.name}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminRolesPage;
