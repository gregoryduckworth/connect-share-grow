
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { UserCheck, Users, Shield, Settings, Eye, Edit } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  assignedAt: Date;
}

const AdminRolesPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock roles data
  const [roles] = useState<Role[]>([
    {
      id: "admin",
      name: "Administrator",
      description: "Full system access with all permissions",
      permissions: [
        "manage_users",
        "manage_communities",
        "manage_reports",
        "manage_settings",
        "view_analytics",
        "manage_roles"
      ],
      userCount: 3,
      createdAt: new Date(2023, 0, 1)
    },
    {
      id: "moderator",
      name: "Moderator",
      description: "Can moderate communities and handle user reports",
      permissions: [
        "moderate_communities",
        "manage_reports",
        "suspend_users",
        "view_user_profiles"
      ],
      userCount: 12,
      createdAt: new Date(2023, 1, 15)
    },
    {
      id: "user",
      name: "Regular User",
      description: "Standard user with basic permissions",
      permissions: [
        "create_posts",
        "join_communities",
        "send_messages",
        "edit_profile"
      ],
      userCount: 832,
      createdAt: new Date(2023, 0, 1)
    }
  ]);

  // Mock users with roles
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "Administrator",
      assignedAt: new Date(2023, 0, 1)
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "Moderator", 
      assignedAt: new Date(2023, 2, 10)
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike@example.com",
      role: "Moderator",
      assignedAt: new Date(2023, 3, 5)
    }
  ]);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "administrator":
        return "bg-red-500";
      case "moderator":
        return "bg-orange-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Roles & Permissions</h2>
        <Button className="bg-social-primary hover:bg-social-secondary">
          <UserCheck className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Input
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {role.name}
                </CardTitle>
                <Badge className={getRoleColor(role.name)}>
                  {role.userCount} users
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{role.description}</p>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Permissions:</h4>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map((permission) => (
                    <Badge key={permission} variant="secondary" className="text-xs">
                      {permission.replace('_', ' ')}
                    </Badge>
                  ))}
                  {role.permissions.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{role.permissions.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Role Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Role Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-social-primary rounded-full flex items-center justify-center text-white">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {user.assignedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRolesPage;
