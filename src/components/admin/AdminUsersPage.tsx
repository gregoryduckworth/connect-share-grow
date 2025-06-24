import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Shield, Search, User } from "lucide-react";
import { logAdminAction } from "@/lib/admin-logger";
import UserProfileDialog from "@/components/admin/UserProfileDialog";
import RoleChangeDialog from "@/components/admin/RoleChangeDialog";
import AdminTablePagination from "@/components/admin/AdminTablePagination";

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
  suspendedBy?: string;
}

const AdminUsersPage = () => {
  console.log("AdminUsersPage rendering...");

  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser] = useState({
    email: "admin@example.com",
    name: "Admin User",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [roleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false);

  const [users, setUsers] = useState<AppUser[]>([
    {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@example.com",
      joinDate: new Date(2023, 0, 15),
      role: "admin",
      status: "active",
      communities: ["Photography", "Tech Talk"],
    },
    {
      id: "user-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      joinDate: new Date(2023, 1, 3),
      role: "moderator",
      status: "active",
      communities: ["Cooking Club", "Travel Adventures"],
    },
    {
      id: "user-3",
      name: "Robert Johnson",
      email: "robert.j@example.com",
      joinDate: new Date(2023, 2, 20),
      role: "user",
      status: "active",
      communities: ["Book Readers"],
    },
    {
      id: "user-4",
      name: "Lisa Brown",
      email: "lisa.b@example.com",
      joinDate: new Date(2023, 3, 5),
      role: "user",
      status: "suspended",
      communities: [],
      suspensionReason:
        "Repeated violation of community guidelines and inappropriate behavior",
      suspendedAt: new Date(2024, 5, 10),
      suspendedBy: "admin@example.com",
    },
    {
      id: "user-5",
      name: "Michael Wilson",
      email: "michael.w@example.com",
      joinDate: new Date(2023, 4, 12),
      role: "user",
      status: "active",
      communities: ["Gaming", "Tech Talk"],
    },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleRoleChange = (userId: string, newRole: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setUsers(
        users.map((u) =>
          u.id === userId
            ? { ...u, role: newRole as "user" | "moderator" | "admin" }
            : u
        )
      );

      toast({
        title: `Role Updated`,
        description: `${user.name} is now a ${newRole}.`,
      });

      logAdminAction({
        action: "role_updated",
        details: `Changed ${user.name}'s role from ${user.role} to ${newRole}`,
        targetId: user.id,
        targetType: "user",
      });
    }
  };

  const handleChangeRole = (user: AppUser) => {
    setSelectedUser(user);
    setRoleChangeDialogOpen(true);
  };

  const isCurrentUser = (userEmail: string) => userEmail === currentUser.email;

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
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-social-primary flex items-center justify-center text-white">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.email}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.joinDate.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      user.role === "admin"
                        ? "bg-social-primary"
                        : user.role === "moderator"
                        ? "bg-social-secondary"
                        : "bg-slate-400"
                    }
                  >
                    {user.role === "admin" && (
                      <Shield className="h-3 w-3 mr-1" />
                    )}
                    {user.role}
                    {isCurrentUser(user.email) && " (You)"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      user.status === "active"
                        ? "bg-green-500"
                        : user.status === "suspended"
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        console.log(
                          "View Profile button clicked for user:",
                          user.id
                        );
                        setSelectedUser(user);
                      }}
                    >
                      View Profile
                    </Button>
                    {!isCurrentUser(user.email) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log(
                            "Change Role button clicked for user:",
                            user.id
                          );
                          handleChangeRole(user);
                        }}
                        className="text-xs"
                      >
                        Change Role
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {paginatedUsers.length === 0 && (
          <div className="text-center p-8">
            <p className="text-social-muted">
              No users found matching your search.
            </p>
          </div>
        )}

        {filteredUsers.length > 0 && (
          <AdminTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredUsers.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {selectedUser && (
        <UserProfileDialog
          user={{
            ...selectedUser,
            name: isCurrentUser(selectedUser.email)
              ? currentUser.name
              : selectedUser.name,
          }}
          isOpen={!!selectedUser}
          onClose={() => {
            console.log("Closing UserProfileDialog");
            setSelectedUser(null);
          }}
        />
      )}

      <RoleChangeDialog
        isOpen={roleChangeDialogOpen}
        onClose={() => {
          console.log("Closing RoleChangeDialog");
          setRoleChangeDialogOpen(false);
        }}
        user={selectedUser}
        onConfirm={handleRoleChange}
      />
    </div>
  );
};

export default AdminUsersPage;
