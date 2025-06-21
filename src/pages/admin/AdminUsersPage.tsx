
import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, 
  AlertDialogFooter, AlertDialogHeader, 
  AlertDialogTitle, AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Shield, Search, User, Check } from "lucide-react";
import { logAdminAction } from "@/lib/admin-logger";
import UserProfileDialog from "@/components/admin/UserProfileDialog";

interface AppUser {
  id: string;
  name: string;
  email: string;
  joinDate: Date;
  role: "user" | "moderator" | "admin";
  status: "active" | "suspended" | "banned";
  communities?: string[];
  suspensionReason?: string;
  suspendedAt?: Date;
}

const AdminUsersPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser] = useState("admin@example.com"); // Mock current admin user
  const [users, setUsers] = useState<AppUser[]>([
    {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@example.com",
      joinDate: new Date(2023, 0, 15),
      role: "admin",
      status: "active",
      communities: ["Photography", "Tech Talk"]
    },
    {
      id: "user-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      joinDate: new Date(2023, 1, 3),
      role: "moderator",
      status: "active",
      communities: ["Cooking Club", "Travel Adventures"]
    },
    {
      id: "user-3",
      name: "Robert Johnson",
      email: "robert.j@example.com",
      joinDate: new Date(2023, 2, 20),
      role: "user",
      status: "active",
      communities: ["Book Readers"]
    },
    {
      id: "user-4",
      name: "Lisa Brown",
      email: "lisa.b@example.com",
      joinDate: new Date(2023, 3, 5),
      role: "user",
      status: "suspended",
      communities: [],
      suspensionReason: "Repeated violation of community guidelines and inappropriate behavior",
      suspendedAt: new Date(2024, 5, 10)
    },
    {
      id: "user-5",
      name: "Michael Wilson",
      email: "michael.w@example.com",
      joinDate: new Date(2023, 4, 12),
      role: "user",
      status: "active",
      communities: ["Gaming", "Tech Talk"]
    },
  ]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = (userId: string, newRole: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole as "user" | "moderator" | "admin" } : u
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

  const isCurrentUser = (userEmail: string) => userEmail === currentUser;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Manage Users</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-social-primary flex items-center justify-center text-white">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                <TableCell className="hidden md:table-cell">{user.joinDate.toLocaleDateString()}</TableCell>
                <TableCell>
                  {isCurrentUser(user.email) ? (
                    <Badge className="bg-social-primary">
                      {user.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                      {user.role} (You)
                    </Badge>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <div>
                          <Select 
                            defaultValue={user.role} 
                            onValueChange={(value) => {}} // Handled by AlertDialog
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to change {user.name}'s role? This action will update their permissions across the platform.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => {
                            // This would normally get the new role from the dialog context
                            // For now, we'll cycle through roles as an example
                            const roleOrder = ["user", "moderator", "admin"];
                            const currentIndex = roleOrder.indexOf(user.role);
                            const newRole = roleOrder[(currentIndex + 1) % roleOrder.length];
                            handleRoleChange(user.id, newRole);
                          }}>
                            <Check className="h-4 w-4 mr-1" /> Confirm Change
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={
                    user.status === "active" ? "bg-green-500" :
                    user.status === "suspended" ? "bg-orange-500" :
                    "bg-red-500"
                  }>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <UserProfileDialog user={user}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                    >
                      View Profile
                    </Button>
                  </UserProfileDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredUsers.length === 0 && (
          <div className="text-center p-8">
            <p className="text-social-muted">No users found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
