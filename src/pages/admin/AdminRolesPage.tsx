import { Shield, User, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
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
    api.getAdminRoles().then((data: ApiRole[]) => {
      setRoles(
        data.map((role) => ({
          ...role,
          icon:
            role.icon === "admin" ? (
              <Crown className="h-5 w-5" />
            ) : role.icon === "moderator" ? (
              <Shield className="h-5 w-5" />
            ) : (
              <User className="h-5 w-5" />
            ),
          users: role.users.map((user) => ({
            ...user,
            joinDate:
              user.joinDate instanceof Date
                ? user.joinDate
                : new Date(user.joinDate),
          })),
        }))
      );
    });
  }, []);

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
