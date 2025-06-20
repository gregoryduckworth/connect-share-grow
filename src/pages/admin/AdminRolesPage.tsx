
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Users, Save, Plus } from "lucide-react";
import { logAdminAction } from "@/lib/admin-logger";

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  locked?: boolean; // Add locked property for system roles
}

interface RolePermissions {
  [key: string]: Permission[];
}

const AdminRolesPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("system-roles");
  
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>({
    "admin": [
      { id: "perm-1", name: "manage_users", description: "Create, update, and delete users", enabled: true, locked: true },
      { id: "perm-2", name: "manage_communities", description: "Create, update, and delete communities", enabled: true, locked: true },
      { id: "perm-3", name: "manage_content", description: "Moderate all content across the platform", enabled: true, locked: true },
      { id: "perm-4", name: "manage_roles", description: "Assign roles to users", enabled: true, locked: true },
      { id: "perm-5", name: "view_analytics", description: "Access analytics and reports", enabled: true, locked: true },
    ],
    "moderator": [
      { id: "perm-1", name: "manage_users", description: "Create, update, and delete users", enabled: false, locked: true },
      { id: "perm-2", name: "manage_communities", description: "Create, update, and delete communities", enabled: false, locked: true },
      { id: "perm-3", name: "manage_content", description: "Moderate all content across the platform", enabled: true, locked: true },
      { id: "perm-4", name: "manage_roles", description: "Assign roles to users", enabled: false, locked: true },
      { id: "perm-5", name: "view_analytics", description: "Access analytics and reports", enabled: true, locked: true },
    ],
    "community_moderator": [
      { id: "perm-1", name: "manage_users", description: "Create, update, and delete users", enabled: false },
      { id: "perm-2", name: "manage_communities", description: "Create, update, and delete communities", enabled: false },
      { id: "perm-3", name: "manage_content", description: "Moderate content within assigned communities", enabled: true },
      { id: "perm-4", name: "manage_roles", description: "Assign roles to users", enabled: false },
      { id: "perm-5", name: "view_analytics", description: "Access analytics and reports", enabled: false },
    ],
    "user": [
      { id: "perm-1", name: "manage_users", description: "Create, update, and delete users", enabled: false, locked: true },
      { id: "perm-2", name: "manage_communities", description: "Create, update, and delete communities", enabled: false, locked: true },
      { id: "perm-3", name: "manage_content", description: "Moderate content across the platform", enabled: false, locked: true },
      { id: "perm-4", name: "manage_roles", description: "Assign roles to users", enabled: false, locked: true },
      { id: "perm-5", name: "view_analytics", description: "Access analytics and reports", enabled: false, locked: true },
    ],
  });

  const handlePermissionToggle = (role: string, permId: string) => {
    setRolePermissions({
      ...rolePermissions,
      [role]: rolePermissions[role].map(perm => 
        perm.id === permId ? { ...perm, enabled: !perm.enabled } : perm
      )
    });
  };

  const handleSavePermissions = (role: string) => {
    toast({
      title: "Permissions Updated",
      description: `Permissions for ${role} role have been updated.`,
    });
    
    logAdminAction({
      action: "permissions_updated",
      details: `Updated permissions for role: ${role}`,
      targetId: role,
      targetType: "role"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Roles & Permissions</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Create Custom Role
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="system-roles">System Roles</TabsTrigger>
          <TabsTrigger value="community-roles">Community Roles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="system-roles" className="space-y-4 mt-4">
          {/* Admin Role */}
          <Card>
            <CardHeader className="bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-social-primary" />
                  <CardTitle>Admin</CardTitle>
                </div>
                <Badge className="bg-social-primary">System Role - Fixed</Badge>
              </div>
              <CardDescription>
                Full access to manage the entire platform - permissions cannot be modified
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {rolePermissions["admin"].map((perm) => (
                  <div key={perm.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{perm.name}</p>
                      <p className="text-sm text-muted-foreground">{perm.description}</p>
                    </div>
                    <Switch 
                      checked={perm.enabled} 
                      onCheckedChange={() => handlePermissionToggle("admin", perm.id)}
                      disabled={perm.locked}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button disabled>
                  <Save className="h-4 w-4 mr-2" /> Cannot Modify System Role
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Moderator Role */}
          <Card>
            <CardHeader className="bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-social-secondary" />
                  <CardTitle>Moderator</CardTitle>
                </div>
                <Badge className="bg-social-secondary">System Role - Fixed</Badge>
              </div>
              <CardDescription>
                Platform-wide moderation capabilities - permissions cannot be modified
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {rolePermissions["moderator"].map((perm) => (
                  <div key={perm.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{perm.name}</p>
                      <p className="text-sm text-muted-foreground">{perm.description}</p>
                    </div>
                    <Switch 
                      checked={perm.enabled} 
                      onCheckedChange={() => handlePermissionToggle("moderator", perm.id)}
                      disabled={perm.locked}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button disabled>
                  <Save className="h-4 w-4 mr-2" /> Cannot Modify System Role
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* User Role */}
          <Card>
            <CardHeader className="bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <CardTitle>User</CardTitle>
                </div>
                <Badge variant="outline">Default Role - Fixed</Badge>
              </div>
              <CardDescription>
                Basic platform access for regular users - permissions cannot be modified
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {rolePermissions["user"].map((perm) => (
                  <div key={perm.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{perm.name}</p>
                      <p className="text-sm text-muted-foreground">{perm.description}</p>
                    </div>
                    <Switch 
                      checked={perm.enabled} 
                      onCheckedChange={() => handlePermissionToggle("user", perm.id)}
                      disabled={perm.locked}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button disabled>
                  <Save className="h-4 w-4 mr-2" /> Cannot Modify System Role
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="community-roles" className="space-y-4 mt-4">
          {/* Community Moderator Role */}
          <Card>
            <CardHeader className="bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-social-accent" />
                  <CardTitle>Community Moderator</CardTitle>
                </div>
                <Badge className="bg-social-accent">Community Role</Badge>
              </div>
              <CardDescription>
                Moderation capabilities within assigned communities
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {rolePermissions["community_moderator"].map((perm) => (
                  <div key={perm.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{perm.name}</p>
                      <p className="text-sm text-muted-foreground">{perm.description}</p>
                    </div>
                    <Switch 
                      checked={perm.enabled} 
                      onCheckedChange={() => handlePermissionToggle("community_moderator", perm.id)}
                      disabled={perm.locked}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => handleSavePermissions("community_moderator")}>
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center p-6">
            <Button variant="outline" className="mr-2">
              <Plus className="h-4 w-4 mr-2" /> Create Custom Community Role
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminRolesPage;
