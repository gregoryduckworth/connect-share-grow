
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Shield, User, Search, Ban, UserCheck } from "lucide-react";
import { logAdminAction } from "@/lib/admin-logger";

interface AppUser {
  id: string;
  name: string;
  email: string;
  joinDate: Date;
  role: "user" | "moderator" | "admin";
  status: "active" | "suspended" | "banned";
}

const AdminUsers = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<AppUser[]>([
    {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@example.com",
      joinDate: new Date(2023, 0, 15),
      role: "admin",
      status: "active"
    },
    {
      id: "user-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      joinDate: new Date(2023, 1, 3),
      role: "moderator",
      status: "active"
    },
    {
      id: "user-3",
      name: "Robert Johnson",
      email: "robert.j@example.com",
      joinDate: new Date(2023, 2, 20),
      role: "user",
      status: "active"
    },
    {
      id: "user-4",
      name: "Lisa Brown",
      email: "lisa.b@example.com",
      joinDate: new Date(2023, 3, 5),
      role: "user",
      status: "suspended"
    },
    {
      id: "user-5",
      name: "Michael Wilson",
      email: "michael.w@example.com",
      joinDate: new Date(2023, 4, 12),
      role: "user",
      status: "active"
    },
  ]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleRole = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      const newRole = user.role === "user" ? "moderator" : "user";
      
      setUsers(users.map(u => 
        u.id === id ? { ...u, role: newRole as "user" | "moderator" | "admin" } : u
      ));
      
      toast({
        title: `Role Updated`,
        description: `${user.name} is now a ${newRole}.`,
      });
      
      logAdminAction({
        action: "role_updated",
        details: `Changed ${user.name}'s role from ${user.role} to ${newRole}`,
        targetId: user.id,
        targetType: "user"
      });
    }
  };

  const handleToggleStatus = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      const newStatus = user.status === "active" ? "suspended" : "active";
      
      setUsers(users.map(u => 
        u.id === id ? { ...u, status: newStatus as "active" | "suspended" | "banned" } : u
      ));
      
      toast({
        title: `Account ${newStatus === 'active' ? 'Activated' : 'Suspended'}`,
        description: `${user.name}'s account has been ${newStatus === 'active' ? 'activated' : 'suspended'}.`,
        variant: newStatus === 'active' ? 'default' : 'destructive',
      });
      
      logAdminAction({
        action: newStatus === 'active' ? "user_activated" : "user_suspended",
        details: `${newStatus === 'active' ? 'Activated' : 'Suspended'} ${user.name}'s account`,
        targetId: user.id,
        targetType: "user"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Manage Users</h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4 hidden md:table-cell">Email</th>
                  <th className="text-left p-4 hidden md:table-cell">Join Date</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/20">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-social-primary flex items-center justify-center text-white">
                          <User size={16} />
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">{user.email}</td>
                    <td className="p-4 hidden md:table-cell">{user.joinDate.toLocaleDateString()}</td>
                    <td className="p-4">
                      <Badge className={
                        user.role === "admin" ? "bg-social-primary" : 
                        user.role === "moderator" ? "bg-social-secondary" : 
                        "bg-muted"
                      }>
                        {user.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={
                        user.status === "active" ? "bg-green-500" :
                        user.status === "suspended" ? "bg-orange-500" :
                        "bg-red-500"
                      }>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {user.role !== "admin" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleRole(user.id)}
                            className="text-xs"
                          >
                            {user.role === "user" ? "Make Moderator" : "Remove Mod"}
                          </Button>
                        )}
                        <Button 
                          variant={user.status === "active" ? "destructive" : "default"}
                          size="sm"
                          onClick={() => handleToggleStatus(user.id)}
                          className="text-xs"
                        >
                          {user.status === "active" ? (
                            <><Ban className="h-3 w-3 mr-1" /> Suspend</>
                          ) : (
                            <><UserCheck className="h-3 w-3 mr-1" /> Activate</>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center p-8">
              <p className="text-social-muted">No users found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
