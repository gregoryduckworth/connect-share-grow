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
import AdminRoleChangeAlert from "@/components/admin/AdminRoleChangeAlert";
import UserSuspendDialog from "@/components/admin/UserSuspendDialog";
import UserActivateDialog from "@/components/admin/UserActivateDialog";

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
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser] = useState("admin@example.com");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [roleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false);
  const [roleChangeTargetUser, setRoleChangeTargetUser] =
    useState<AppUser | null>(null);
  const [pendingAdminRoleChanges, setPendingAdminRoleChanges] = useState<
    {
      id: string;
      user: AppUser;
      requestedBy: string;
      requestedAt: Date;
      newRole: "admin" | "user" | "moderator";
    }[]
  >([
    {
      id: "mock-1",
      user: {
        id: "user-2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        joinDate: new Date(2023, 1, 3),
        role: "moderator",
        status: "active",
        communities: ["Cooking Club", "Travel Adventures"],
      },
      requestedBy: "admin@example.com",
      requestedAt: new Date(),
      newRole: "admin",
    },
  ]);

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
      // If changing to or from admin, require approval
      if (
        (user.role === "admin" && newRole !== "admin") ||
        (user.role !== "admin" && newRole === "admin")
      ) {
        setPendingAdminRoleChanges([
          ...pendingAdminRoleChanges,
          {
            id: `${userId}-${Date.now()}`,
            user,
            requestedBy: currentUser,
            requestedAt: new Date(),
            newRole: newRole as "admin" | "user" | "moderator",
          },
        ]);
        toast({
          title: "Admin Approval Required",
          description: `A request to change ${user.name}'s role to ${newRole} has been sent to all admins for approval.`,
        });
        return;
      }

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
    setRoleChangeDialogOpen(true);
    setRoleChangeTargetUser(user);
  };

  const isCurrentUser = (userEmail: string) => userEmail === currentUser;

  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [userToSuspend, setUserToSuspend] = useState<AppUser | null>(null);
  const [userToActivate, setUserToActivate] = useState<AppUser | null>(null);

  const handleSuspendUser = (userId: string, reason: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: "suspended",
              suspensionReason: reason,
              suspendedAt: new Date(),
              suspendedBy: currentUser,
            }
          : u
      )
    );
    toast({
      title: "User Suspended",
      description: `The user has been suspended. Reason: ${reason}`,
    });
    logAdminAction({
      action: "user_suspended",
      details: `Suspended user ${userId} for reason: ${reason}`,
      targetId: userId,
      targetType: "user",
    });
  };

  const handleActivateUser = (userId: string, message: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: "active",
              suspensionReason: undefined,
              suspendedAt: undefined,
              suspendedBy: undefined,
            }
          : u
      )
    );
    toast({
      title: "User Activated",
      description: `The user has been reactivated. Message: ${message}`,
    });
    logAdminAction({
      action: "user_activated",
      details: `Activated user ${userId} with message: ${message}`,
      targetId: userId,
      targetType: "user",
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-social-primary mb-2">
          Manage Users
        </h1>
        <div className="relative w-full sm:w-64">
          <div
            className="absolute inset-0 pointer-events-none rounded-lg border border-purple-200 bg-gradient-to-r from-purple-100/40 to-blue-100/20"
            style={{ zIndex: 0 }}
          />
          <div className="flex items-center gap-2 relative z-10 p-1 rounded-lg bg-white/90 border border-purple-200 w-full focus-within:border-purple-500 focus-within:shadow-lg focus-within:shadow-purple-200/40 transition-colors">
            <Search className="ml-3 text-social-primary h-5 w-5" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-2 py-3 border-0 bg-transparent focus:ring-0 focus:outline-none shadow-none min-w-0 flex-1"
              style={{ boxShadow: "none" }}
              type="text"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      <AdminRoleChangeAlert
        pendingChanges={pendingAdminRoleChanges}
        currentUser={currentUser}
        onApprove={(changeId) => {
          const change = pendingAdminRoleChanges.find((c) => c.id === changeId);
          if (change) {
            setUsers(
              users.map((u) =>
                u.id === change.user.id ? { ...u, role: change.newRole } : u
              )
            );
            setPendingAdminRoleChanges(
              pendingAdminRoleChanges.filter((c) => c.id !== changeId)
            );
            toast({
              title: "Role Change Approved",
              description: `${change.user.name}'s role has been updated to ${change.newRole}.`,
            });
            logAdminAction({
              action: "role_updated",
              details: `Changed ${change.user.name}'s role to ${change.newRole} (approved by another admin)`,
              targetId: change.user.id,
              targetType: "user",
            });
          }
        }}
        onReject={(changeId) => {
          setPendingAdminRoleChanges(
            pendingAdminRoleChanges.filter((c) => c.id !== changeId)
          );
          toast({
            title: "Role Change Rejected",
            description: `The admin role change request has been rejected.`,
          });
        }}
      />

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-64">User</TableHead>
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
                <TableCell className="w-64">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-social-primary flex items-center justify-center text-white flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="font-medium truncate">{user.name}</span>
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
                      variant="default"
                      size="sm"
                      className="text-xs"
                      onClick={() => setSelectedUser(user)}
                    >
                      View Profile
                    </Button>
                    {!isCurrentUser(user.email) && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleChangeRole(user)}
                        className="text-xs"
                      >
                        Change Role
                      </Button>
                    )}
                    {user.status === "active" && !isCurrentUser(user.email) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setUserToSuspend(user);
                          setSuspendDialogOpen(true);
                        }}
                      >
                        Suspend
                      </Button>
                    )}
                    {user.status === "suspended" &&
                      !isCurrentUser(user.email) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-green-700 border-green-500 hover:bg-green-50"
                          onClick={() => {
                            setUserToActivate(user);
                            setActivateDialogOpen(true);
                          }}
                        >
                          Activate
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
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      <RoleChangeDialog
        isOpen={roleChangeDialogOpen}
        onClose={() => setRoleChangeDialogOpen(false)}
        user={roleChangeTargetUser}
        onConfirm={handleRoleChange}
      />

      {userToSuspend && (
        <UserSuspendDialog
          isOpen={suspendDialogOpen}
          onClose={() => {
            setSuspendDialogOpen(false);
            setUserToSuspend(null);
          }}
          user={userToSuspend}
          onSuspend={handleSuspendUser}
        />
      )}
      {userToActivate && (
        <UserActivateDialog
          isOpen={activateDialogOpen}
          onClose={() => {
            setActivateDialogOpen(false);
            setUserToActivate(null);
          }}
          user={userToActivate}
          onActivate={handleActivateUser}
        />
      )}
    </div>
  );
};

export default AdminUsersPage;
