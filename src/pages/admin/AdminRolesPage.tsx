import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, User, Users, Crown } from "lucide-react";
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

const AdminRolesPage = () => {
  const [roles] = useState<Role[]>([
    {
      name: "Admin",
      description: "Full system access with all administrative privileges",
      permissions: [
        "Manage all users and communities",
        "Access admin dashboard and analytics",
        "Modify system settings",
        "Handle reports and moderation",
        "Assign and revoke roles",
      ],
      userCount: 2,
      users: [
        {
          id: "admin-1",
          name: "John Doe",
          email: "john.doe@example.com",
          joinDate: new Date(2023, 0, 15),
          communities: ["Photography", "Tech Talk"],
        },
        {
          id: "admin-2",
          name: "Sarah Admin",
          email: "sarah.admin@example.com",
          joinDate: new Date(2023, 1, 1),
          communities: ["Photography", "Web Development"],
        },
      ],
      icon: <Crown className="h-5 w-5" />,
      color: "bg-red-500",
    },
    {
      name: "Moderator",
      description: "Community moderation and user management capabilities",
      permissions: [
        "Moderate community content",
        "Lock/unlock posts and comments",
        "Manage community rules",
        "Handle community reports",
        "Pin important posts",
      ],
      userCount: 5,
      users: [
        {
          id: "mod-1",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          joinDate: new Date(2023, 1, 3),
          communities: ["Cooking Club", "Travel Adventures"],
        },
        {
          id: "mod-2",
          name: "Mike Chen",
          email: "mike.chen@example.com",
          joinDate: new Date(2023, 2, 10),
          communities: ["Photography"],
        },
        {
          id: "mod-3",
          name: "Alex Rivera",
          email: "alex.rivera@example.com",
          joinDate: new Date(2023, 3, 15),
          communities: ["Web Development", "Tech Talk"],
        },
        {
          id: "mod-4",
          name: "Emma Davis",
          email: "emma.davis@example.com",
          joinDate: new Date(2023, 4, 20),
          communities: ["Book Club"],
        },
        {
          id: "mod-5",
          name: "Tom Wilson",
          email: "tom.wilson@example.com",
          joinDate: new Date(2023, 5, 5),
          communities: ["Fitness & Health"],
        },
      ],
      icon: <Shield className="h-5 w-5" />,
      color: "bg-orange-500",
    },
    {
      name: "User",
      description: "Standard user with basic community participation rights",
      permissions: [
        "Create and edit own posts",
        "Comment on posts",
        "Join communities",
        "Like and share content",
        "Report inappropriate content",
      ],
      userCount: 1247,
      users: [
        {
          id: "user-1",
          name: "Robert Johnson",
          email: "robert.j@example.com",
          joinDate: new Date(2023, 2, 20),
          communities: ["Book Readers"],
        },
        {
          id: "user-2",
          name: "Lisa Brown",
          email: "lisa.b@example.com",
          joinDate: new Date(2023, 3, 5),
          communities: [],
        },
        {
          id: "user-3",
          name: "Michael Wilson",
          email: "michael.w@example.com",
          joinDate: new Date(2023, 4, 12),
          communities: ["Gaming", "Tech Talk"],
        },
        // In a real app, this would be paginated
      ],
      icon: <User className="h-5 w-5" />,
      color: "bg-blue-500",
    },
  ]);

  const RoleCard = ({ role }: { role: Role }) => (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${role.color} text-white`}>
              {role.icon}
            </div>
            {role.name}
          </CardTitle>
          <Badge variant="secondary">
            {role.userCount} {role.userCount === 1 ? "user" : "users"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <p className="text-social-muted">{role.description}</p>

        <div>
          <h4 className="font-medium mb-2">Permissions:</h4>
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
            <Button variant="outline" className="w-full mt-4">
              <Users className="h-4 w-4 mr-2" />
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
                <Card key={user.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-social-primary flex items-center justify-center text-white">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-social-muted">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-400">
                          Joined {user.joinDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {user.communities && user.communities.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-1">Communities:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.communities.map((community, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
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
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-social-primary mb-2">
          Roles & Permissions
        </h1>
        <p className="text-social-muted">
          Manage user roles and view their permissions across the platform
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <RoleCard key={role.name} role={role} />
        ))}
      </div>
    </div>
  );
};

export default AdminRolesPage;
