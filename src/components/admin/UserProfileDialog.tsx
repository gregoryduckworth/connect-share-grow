import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Shield, AlertTriangle } from "lucide-react";
import type { User } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/common/StatusBadge";

interface UserProfileDialogProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: "user" | "moderator" | "admin";
    isActive: boolean;
    isEmailVerified: boolean;
    isSuspended: boolean;
    createdAt: Date;
    communities?: string[];
    suspensionReason?: string;
    language?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    dateOfBirth?: Date;
    suspendedAt?: Date;
    suspendedBy?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

// Helper to infer user status from isSuspended/isActive
function getUserStatus(user: User): "active" | "suspended" | "banned" {
  if (user.isSuspended) return "suspended";
  if (user.isActive) return "active";
  return "banned";
}

const UserProfileDialog = ({
  user,
  isOpen,
  onClose,
}: UserProfileDialogProps) => {
  // Mock user activity data
  const userStats = {
    totalPosts: 127,
    totalComments: 348,
    communitiesJoined: user.communities?.length || 0,
    lastActive: new Date(2024, 5, 18),
    accountCreated: user.createdAt,
    reportsReceived: 2,
    reportsResolved: 0,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {/* Replace <User ... /> with a generic icon or remove if not needed */}
            <Shield className="h-5 w-5" />
            {user.name || user.email}'s Profile
          </DialogTitle>
          <DialogDescription>
            Detailed information about this user's account and activity.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{user.name || user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Role:</span>
                <StatusBadge status={user.role}>
                  {user.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                  {user.role}
                </StatusBadge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <StatusBadge status={getUserStatus(user)} />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Joined:</span>
                <span>{formatDate(user.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Last Active:</span>
                <span>{formatDate(userStats.lastActive)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Suspension Details */}
          {user.isSuspended && user.suspensionReason && (
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="h-5 w-5" />
                  Suspension Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Suspension Reason:</span>
                  <span className="text-orange-700">
                    {user.suspensionReason}
                  </span>
                </div>
                {user.suspendedAt && (
                  <div className="flex justify-between">
                    <span className="font-medium">Suspended Date:</span>
                    <span>{formatDate(user.suspendedAt)}</span>
                  </div>
                )}
                {user.suspendedBy && (
                  <div className="flex justify-between">
                    <span className="font-medium">Suspended By:</span>
                    <span className="font-semibold text-red-600">
                      {user.suspendedBy === "admin@example.com"
                        ? "Admin User"
                        : user.suspendedBy}
                    </span>
                  </div>
                )}
                <div className="p-3 bg-orange-50 rounded-md">
                  <p className="text-sm text-orange-800">
                    This user is currently suspended and cannot access the
                    platform.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Activity Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex justify-between">
                <span className="font-medium">Total Posts:</span>
                <span>{userStats.totalPosts}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Comments:</span>
                <span>{userStats.totalComments}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Communities Joined:</span>
                <span>{userStats.communitiesJoined}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Reports Received:</span>
                <span className="text-red-600">
                  {userStats.reportsReceived}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Communities */}
          {user.communities && user.communities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Communities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.communities.map((community, index) => (
                    <Badge key={index} variant="secondary">
                      {community}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
