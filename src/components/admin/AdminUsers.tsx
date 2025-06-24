import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Shield, Ban, Eye, UserX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import UserProfileDialog from "./UserProfileDialog";
import RoleChangeDialog from "./RoleChangeDialog";
import AdminTablePagination from "./AdminTablePagination";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  joinDate: Date;
  lastActive: Date;
  postCount: number;
  reportCount: number;
  suspensionDetails?: {
    reason: string;
    adminName: string;
    suspendedAt: Date;
    expiresAt?: Date;
  };
}

const AdminUsers = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleChangeUser, setRoleChangeUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Mock data - in a real app, this would come from an API
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "user",
      status: "active",
      joinDate: new Date(2024, 0, 15),
      lastActive: new Date(2024, 5, 20),
      postCount: 45,
      reportCount: 0
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      role: "moderator",
      status: "active",
      joinDate: new Date(2023, 11, 3),
      lastActive: new Date(2024, 5, 21),
      postCount: 127,
      reportCount: 0
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike.wilson@example.com",
      role: "user",
      status: "suspended",
      joinDate: new Date(2024, 2, 10),
      lastActive: new Date(2024, 5, 18),
      postCount: 23,
      reportCount: 3,
      suspensionDetails: {
        reason: "Harassment and inappropriate behavior towards other community members",
        adminName: "Admin Smith",
        suspendedAt: new Date(2024, 5, 18),
        expiresAt: new Date(2024, 6, 18)
      }
    },
    {
      id: "4",
      name: "Emily Chen",
      email: "emily.chen@example.com",
      role: "user",
      status: "active",
      joinDate: new Date(2024, 1, 22),
      lastActive: new Date(2024, 5, 19),
      postCount: 67,
      reportCount: 1
    },
    {
      id: "5",
      name: "David Rodriguez",
      email: "david.rodriguez@example.com",
      role: "admin",
      status: "active",
      joinDate: new Date(2023, 8, 5),
      lastActive: new Date(2024, 5, 21),
      postCount: 89,
      reportCount: 0
    }
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'moderator': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'suspended': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'banned': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? {
            ...user,
            status: 'suspended' as const,
            suspensionDetails: {
              reason: "Violation of community guidelines",
              adminName: "Admin User",
              suspendedAt: new Date(),
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
          }
        : user
    ));

    const user = users.find(u => u.id === userId);
    toast({
      title: "User suspended",
      description: `${user?.name} has been suspended for 30 days`,
    });
  };

  const handleUnsuspendUser = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: 'active' as const, suspensionDetails: undefined }
        : user
    ));

    const user = users.find(u => u.id === userId);
    toast({
      title: "User unsuspended",
      description: `${user?.name} has been unsuspended`,
    });
  };

  const handleBanUser = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: 'banned' as const } : user
    ));

    const user = users.find(u => u.id === userId);
    toast({
      title: "User banned",
      description: `${user?.name} has been permanently banned`,
    });
  };

  const handleRoleChange = (userId: string, newRole: 'user' | 'moderator' | 'admin') => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ));

    const user = users.find(u => u.id === userId);
    toast({
      title: "Role updated",
      description: `${user?.name} is now a ${newRole}`,
    });
    setRoleChangeUser(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead>Reports</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium break-words">{user.name}</div>
                        <div className="text-sm text-muted-foreground break-words">{user.email}</div>
                        {user.suspensionDetails && (
                          <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                            <div className="break-words">Suspended by {user.suspensionDetails.adminName}: {user.suspensionDetails.reason}</div>
                            {user.suspensionDetails.expiresAt && (
                              <div>Expires: {user.suspensionDetails.expiresAt.toLocaleDateString()}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.joinDate.toLocaleDateString()}</TableCell>
                    <TableCell>{user.postCount}</TableCell>
                    <TableCell>
                      <span className={user.reportCount > 0 ? 'text-red-600 dark:text-red-400 font-semibold' : ''}>
                        {user.reportCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setRoleChangeUser(user)}>
                            <Shield className="h-4 w-4 mr-2" />
                            Change Role
                          </DropdownMenuItem>
                          {user.status === 'active' && (
                            <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                              <UserX className="h-4 w-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          )}
                          {user.status === 'suspended' && (
                            <DropdownMenuItem onClick={() => handleUnsuspendUser(user.id)}>
                              <Shield className="h-4 w-4 mr-2" />
                              Unsuspend
                            </DropdownMenuItem>
                          )}
                          {user.status !== 'banned' && (
                            <DropdownMenuItem 
                              onClick={() => handleBanUser(user.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Ban
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <AdminTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredUsers.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={() => {}}
          />
        </CardContent>
      </Card>

      {selectedUser && (
        <UserProfileDialog user={selectedUser}>
          <div />
        </UserProfileDialog>
      )}

      {roleChangeUser && (
        <RoleChangeDialog
          user={roleChangeUser}
          isOpen={!!roleChangeUser}
          onClose={() => setRoleChangeUser(null)}
          onConfirm={handleRoleChange}
        />
      )}
    </div>
  );
};

export default AdminUsers;
