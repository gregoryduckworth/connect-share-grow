
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Shield,
  Users,
  AlertTriangle,
  UserMinus,
  Search,
  TrendingUp,
  Check,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { logAdminAction } from "@/lib/admin-logger";
import ModeratorSuccessionDialog from "./ModeratorSuccessionDialog";
import LockPostDialog from "./LockPostDialog";
import { formatDate } from "@/lib/utils";
import { Moderator, CommunityAnalytics, FlaggedReport, PendingAdminRoleChange } from "@/lib/types";

interface ModeratorPanelProps {
  communitySlug: string;
}

const ModeratorPanel = ({ communitySlug }: ModeratorPanelProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [moderators, setModerators] = useState<Moderator[]>([
    {
      id: "mod-1",
      name: "Jane Smith",
      role: "moderator",
      joinedAsModAt: new Date(),
      actionsThisMonth: 42,
    },
    {
      id: "mod-2",
      name: "Robert Johnson",
      role: "moderator",
      joinedAsModAt: new Date(),
      actionsThisMonth: 15,
    },
  ]);
  const [pendingReports, setPendingReports] = useState<FlaggedReport[]>([
    {
      id: "report-1",
      contentType: "post",
      contentId: "post-123",
      contentPreview: "This post violates community guidelines...",
      reportedBy: "user-456",
      createdAt: new Date(),
      reason: "Hate speech",
      status: "pending",
      content: "Offensive content",
      communityId: "comm-1",
      reportedByName: "Alice Johnson",
    },
    {
      id: "report-2",
      contentType: "reply",
      contentId: "reply-789",
      contentPreview: "Inappropriate language in this reply...",
      reportedBy: "user-789",
      createdAt: new Date(),
      reason: "Harassment",
      status: "pending",
      content: "Harassing content",
      communityId: "comm-1",
      reportedByName: "Bob Williams",
    },
  ]);
  const [communityAnalytics] = useState<CommunityAnalytics>({
    totalMembers: 1234,
    totalPosts: 567,
    postsThisWeek: 89,
    activeMembers: 345,
    reportsThisWeek: 12,
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLockDialogOpen, setIsLockDialogOpen] = useState(false);
  const [isUnlockDialogOpen, setIsUnlockDialogOpen] = useState(false);
  const [isCommentsLockDialogOpen, setIsCommentsLockDialogOpen] = useState(false);
  const [isCommentsUnlockDialogOpen, setIsCommentsUnlockDialogOpen] = useState(false);
  const [lockReason, setLockReason] = useState("");
  const [commentsLockReason, setCommentsLockReason] = useState("");
  const [isSuccessionDialogOpen, setIsSuccessionDialogOpen] = useState(false);
  const [pendingAdminRoleChanges, setPendingAdminRoleChanges] = useState<PendingAdminRoleChange[]>([]);

  const filteredModerators = moderators.filter((moderator) =>
    moderator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveModerator = (moderatorId: string) => {
    setModerators(moderators.filter((m) => m.id !== moderatorId));

    toast({
      title: "Moderator Removed",
      description: "The moderator has been successfully removed.",
    });

    logAdminAction({
      action: "moderator_removed",
      details: `Removed moderator ${moderatorId} from community ${communitySlug}`,
      targetId: moderatorId,
      targetType: "moderator",
    });
  };

  const handleApproveAdminRoleChange = (userId: string) => {
    setPendingAdminRoleChanges(
      pendingAdminRoleChanges.filter((change) => change.user.id !== userId)
    );

    toast({
      title: "Admin Role Approved",
      description: "The user has been granted admin privileges.",
    });

    logAdminAction({
      action: "admin_role_approved",
      details: `Approved admin role for user ${userId} in community ${communitySlug}`,
      targetId: userId,
      targetType: "user",
    });
  };

  const handleRejectAdminRoleChange = (userId: string) => {
    setPendingAdminRoleChanges(
      pendingAdminRoleChanges.filter((change) => change.user.id !== userId)
    );

    toast({
      title: "Admin Role Rejected",
      description: "The admin role request has been rejected.",
    });

    logAdminAction({
      action: "admin_role_rejected",
      details: `Rejected admin role for user ${userId} in community ${communitySlug}`,
      targetId: userId,
      targetType: "user",
    });
  };

  const handleResolveReport = (reportId: string) => {
    setPendingReports(pendingReports.filter((report) => report.id !== reportId));

    toast({
      title: "Report Resolved",
      description: "The report has been marked as resolved.",
    });

    logAdminAction({
      action: "report_resolved",
      details: `Resolved report ${reportId} in community ${communitySlug}`,
      targetId: reportId,
      targetType: "report",
    });
  };

  const handleLockPost = () => {
    toast({
      title: "Post Locked",
      description: "The post has been locked.",
    });

    logAdminAction({
      action: "post_locked",
      details: `Locked post in community ${communitySlug} with reason: ${lockReason}`,
      targetId: "post-id",
      targetType: "post",
    });
    setIsLockDialogOpen(false);
  };

  const handleUnlockPost = () => {
    toast({
      title: "Post Unlocked",
      description: "The post has been unlocked.",
    });

    logAdminAction({
      action: "post_unlocked",
      details: `Unlocked post in community ${communitySlug}`,
      targetId: "post-id",
      targetType: "post",
    });
    setIsUnlockDialogOpen(false);
  };

  const handleLockComments = () => {
    toast({
      title: "Comments Locked",
      description: "Comments have been locked for this post.",
    });

    logAdminAction({
      action: "comments_locked",
      details: `Locked comments for post in community ${communitySlug} with reason: ${commentsLockReason}`,
      targetId: "post-id",
      targetType: "post",
    });
    setIsCommentsLockDialogOpen(false);
  };

  const handleUnlockComments = () => {
    toast({
      title: "Comments Unlocked",
      description: "Comments have been unlocked for this post.",
    });

    logAdminAction({
      action: "comments_unlocked",
      details: `Unlocked comments for post in community ${communitySlug}`,
      targetId: "post-id",
      targetType: "post",
    });
    setIsCommentsUnlockDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Moderator Panel</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search moderators..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="moderators" className="space-y-4">
        <TabsList>
          <TabsTrigger value="moderators">
            <Users className="h-4 w-4 mr-2" /> Moderators ({moderators.length})
          </TabsTrigger>
          <TabsTrigger value="reports">
            <AlertTriangle className="h-4 w-4 mr-2" /> Reports ({pendingReports.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="h-4 w-4 mr-2" /> Analytics
          </TabsTrigger>
          <TabsTrigger value="admin-requests">
            <Shield className="h-4 w-4 mr-2" /> Admin Requests ({pendingAdminRoleChanges.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="moderators" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Moderators</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModerators.map((moderator) => (
                    <TableRow key={moderator.id}>
                      <TableCell>{moderator.name}</TableCell>
                      <TableCell>{moderator.role}</TableCell>
                      <TableCell>{formatDate(moderator.joinedAsModAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-500 hover:bg-red-50"
                          onClick={() => handleRemoveModerator(moderator.id)}
                        >
                          <UserMinus className="h-3.5 w-3.5 mr-1" />
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredModerators.length === 0 && (
                <div className="text-center p-8">
                  <p className="text-social-muted">No moderators found.</p>
                </div>
              )}
            </CardContent>
          </Card>
          <ModeratorSuccessionDialog
            isOpen={isSuccessionDialogOpen}
            onClose={() => setIsSuccessionDialogOpen(false)}
            members={[]}
            onSelectNewModerator={() => {}}
            communityName={communitySlug}
          />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.contentPreview}</TableCell>
                      <TableCell>{report.reportedByName}</TableCell>
                      <TableCell>{report.reason}</TableCell>
                      <TableCell>{formatDate(report.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-500 hover:bg-green-50"
                          onClick={() => handleResolveReport(report.id)}
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Resolve
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {pendingReports.length === 0 && (
                <div className="text-center p-8">
                  <p className="text-social-muted">No pending reports.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Analytics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-lg font-medium">Total Members</div>
                <div className="text-2xl font-bold">{communityAnalytics.totalMembers}</div>
              </div>
              <div className="space-y-2">
                <div className="text-lg font-medium">Total Posts</div>
                <div className="text-2xl font-bold">{communityAnalytics.totalPosts}</div>
              </div>
              <div className="space-y-2">
                <div className="text-lg font-medium">Posts This Week</div>
                <div className="text-2xl font-bold">{communityAnalytics.postsThisWeek}</div>
              </div>
              <div className="space-y-2">
                <div className="text-lg font-medium">Active Members</div>
                <div className="text-2xl font-bold">{communityAnalytics.activeMembers}</div>
              </div>
              <div className="space-y-2">
                <div className="text-lg font-medium">Reports This Week</div>
                <div className="text-2xl font-bold">{communityAnalytics.reportsThisWeek}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Admin Role Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingAdminRoleChanges.map((change) => (
                    <TableRow key={change.user.id}>
                      <TableCell>{change.user.name}</TableCell>
                      <TableCell>{change.requestedBy}</TableCell>
                      <TableCell>{formatDate(change.requestedAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-500 text-green-500 hover:bg-green-50"
                            onClick={() => handleApproveAdminRoleChange(change.user.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                            onClick={() => handleRejectAdminRoleChange(change.user.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {pendingAdminRoleChanges.length === 0 && (
                <div className="text-center p-8">
                  <p className="text-social-muted">No pending admin role requests.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post from the
              community.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-red-50"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                toast({
                  title: "Post Deleted",
                  description: "The post has been successfully deleted.",
                });
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LockPostDialog
        isOpen={isLockDialogOpen}
        onClose={() => setIsLockDialogOpen(false)}
        onConfirm={handleLockPost}
        lockReason={lockReason}
        setLockReason={setLockReason}
      />

      <Dialog open={isUnlockDialogOpen} onOpenChange={setIsUnlockDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Unlock Post</DialogTitle>
            <DialogDescription>Are you sure you want to unlock this post?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsUnlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleUnlockPost}>
              Unlock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LockPostDialog
        isOpen={isCommentsLockDialogOpen}
        onClose={() => setIsCommentsLockDialogOpen(false)}
        onConfirm={handleLockComments}
        lockReason={commentsLockReason}
        setLockReason={setCommentsLockReason}
        title="Lock Comments"
        description="Are you sure you want to lock comments for this post?"
        lockReasonLabel="Reason for locking comments:"
      />

      <Dialog open={isCommentsUnlockDialogOpen} onOpenChange={setIsCommentsUnlockDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Unlock Comments</DialogTitle>
            <DialogDescription>
              Are you sure you want to unlock comments for this post?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsCommentsUnlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleUnlockComments}>
              Unlock Comments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModeratorPanel;
