import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  Ban,
  MessageSquare,
  Shield,
  Users,
  Unlock,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";

export interface Report {
  id: string;
  contentType: "post" | "reply";
  contentId: string;
  contentTitle?: string;
  contentPreview: string;
  reportedBy: string;
  reason: string;
  createdAt: Date;
  status: "pending" | "reviewed";
}

interface CommunityMember {
  id: string;
  name: string;
  avatarUrl?: string;
  joinDate: Date;
  isBanned: boolean;
}

interface ModeratorPanelProps {
  communityId: string;
  reports: Report[];
  members?: CommunityMember[];
  posts?: Array<{
    id: string;
    title: string;
    isLocked: boolean;
    areCommentsLocked: boolean;
  }>;
  onResolveReport: (reportId: string) => void;
  onLockPost: (postId: string) => void;
  onLockComments: (postId: string) => void;
  onUnlockPost?: (postId: string) => void;
  onUnlockComments?: (postId: string) => void;
  onBanUser?: (userId: string) => void;
  onUnbanUser?: (userId: string) => void;
}

const ModeratorPanel = ({
  communityId,
  reports = [],
  members = [],
  posts = [],
  onResolveReport,
  onLockPost,
  onLockComments,
  onUnlockPost,
  onUnlockComments,
  onBanUser,
  onUnbanUser,
}: ModeratorPanelProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("reports");

  const pendingReports = reports.filter(
    (report) => report.status === "pending"
  );
  const resolvedReports = reports.filter(
    (report) => report.status === "reviewed"
  );
  const lockedPosts = posts.filter(
    (post) => post.isLocked || post.areCommentsLocked
  );

  // Mock data for members if not provided
  const displayMembers =
    members.length > 0
      ? members
      : [
          {
            id: "user-1",
            name: "John Doe",
            joinDate: new Date(2023, 1, 15),
            isBanned: false,
          },
          {
            id: "user-2",
            name: "Jane Smith",
            joinDate: new Date(2023, 2, 5),
            isBanned: true,
          },
          {
            id: "user-3",
            name: "Robert Johnson",
            joinDate: new Date(2023, 3, 20),
            isBanned: false,
          },
          {
            id: "user-4",
            name: "Lisa Brown",
            joinDate: new Date(2023, 4, 12),
            isBanned: false,
          },
        ];

  const handleResolveReport = (reportId: string) => {
    onResolveReport(reportId);

    toast({
      title: "Report resolved",
      description: "The report has been marked as reviewed.",
    });
  };

  const handleLockPost = (postId: string) => {
    onLockPost(postId);

    toast({
      title: "Post locked",
      description: "The post has been locked successfully.",
    });
  };

  const handleLockComments = (postId: string) => {
    onLockComments(postId);

    toast({
      title: "Comments locked",
      description: "Comments for this post have been locked successfully.",
    });
  };

  const handleUnlockPost = (postId: string) => {
    if (onUnlockPost) {
      onUnlockPost(postId);

      toast({
        title: "Post unlocked",
        description: "The post has been unlocked successfully.",
      });
    }
  };

  const handleUnlockComments = (postId: string) => {
    if (onUnlockComments) {
      onUnlockComments(postId);

      toast({
        title: "Comments unlocked",
        description: "Comments for this post have been unlocked successfully.",
      });
    }
  };

  const handleBanUser = (userId: string) => {
    if (onBanUser) {
      onBanUser(userId);

      toast({
        title: "User banned",
        description: "The user has been banned from this community.",
      });
    }
  };

  const handleUnbanUser = (userId: string) => {
    if (onUnbanUser) {
      onUnbanUser(userId);

      toast({
        title: "User unbanned",
        description: "The user has been unbanned from this community.",
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-social-primary" />
          <CardTitle>Moderator Panel</CardTitle>
        </div>
        <CardDescription>
          Manage reported content and community members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reports" className="flex gap-2 items-center">
              <AlertTriangle className="h-4 w-4" />
              <span>Reports</span>
              {pendingReports.length > 0 && (
                <Badge className="ml-1 bg-red-500">
                  {pendingReports.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="resolved">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Resolved
            </TabsTrigger>
            <TabsTrigger value="locked" className="flex gap-2 items-center">
              <Ban className="h-4 w-4" />
              <span>Locked</span>
              {lockedPosts.length > 0 && (
                <Badge className="ml-1 bg-orange-500">
                  {lockedPosts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="members" className="flex gap-2 items-center">
              <Users className="h-4 w-4" />
              <span>Members</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="pt-4">
            {pendingReports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="mx-auto h-10 w-10 mb-2 text-muted-foreground/60" />
                <p>No pending reports at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReports.map((report) => (
                  <Card key={report.id} className="border-orange-200">
                    <CardHeader className="py-3 px-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className="bg-orange-100 text-orange-800"
                            >
                              {report.contentType === "post" ? "Post" : "Reply"}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Reported on {formatDate(report.createdAt)}
                            </span>
                          </div>
                          <div className="font-medium">
                            {report.contentTitle ||
                              `Reported ${report.contentType}`}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 px-4">
                      <div className="mb-2">
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          Content preview:
                        </div>
                        <div className="text-sm border-l-2 border-gray-200 pl-3 py-1 mb-2 bg-gray-50 rounded">
                          {report.contentPreview}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          Reason for report:
                        </div>
                        <div className="text-sm border-l-2 border-orange-200 pl-3 py-1 bg-orange-50 rounded">
                          {report.reason}
                        </div>
                      </div>
                    </CardContent>
                    <div className="px-4 pb-4 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleResolveReport(report.id)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Mark as Resolved
                      </Button>
                      {report.contentType === "post" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs border-orange-200 hover:bg-orange-50"
                            onClick={() => handleLockPost(report.contentId)}
                          >
                            <Ban className="h-3.5 w-3.5 mr-1" />
                            Lock Post
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs border-amber-200 hover:bg-amber-50"
                            onClick={() => handleLockComments(report.contentId)}
                          >
                            <MessageSquare className="h-3.5 w-3.5 mr-1" />
                            Lock Comments
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="resolved" className="pt-4">
            {resolvedReports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="mx-auto h-10 w-10 mb-2 text-muted-foreground/60" />
                <p>No resolved reports yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {resolvedReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-800"
                        >
                          {report.contentType === "post" ? "Post" : "Reply"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(report.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-1">
                        {report.contentPreview}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Resolved
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="locked" className="pt-4">
            {lockedPosts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Ban className="mx-auto h-10 w-10 mb-2 text-muted-foreground/60" />
                <p>No locked posts or comments.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lockedPosts.map((post) => (
                  <Card key={post.id} className="border-orange-200">
                    <CardHeader className="py-3 px-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{post.title}</div>
                          <div className="flex gap-2 mt-1">
                            {post.isLocked && (
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-800"
                              >
                                Post Locked
                              </Badge>
                            )}
                            {post.areCommentsLocked && (
                              <Badge
                                variant="outline"
                                className="bg-orange-100 text-orange-800"
                              >
                                Comments Locked
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <div className="px-4 pb-4 flex flex-wrap gap-2">
                      {post.isLocked && onUnlockPost && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-green-200 hover:bg-green-50"
                          onClick={() => handleUnlockPost(post.id)}
                        >
                          <Unlock className="h-3.5 w-3.5 mr-1" />
                          Unlock Post
                        </Button>
                      )}
                      {post.areCommentsLocked && onUnlockComments && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-blue-200 hover:bg-blue-50"
                          onClick={() => handleUnlockComments(post.id)}
                        >
                          <MessageSquare className="h-3.5 w-3.5 mr-1" />
                          Unlock Comments
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="members" className="pt-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 bg-social-primary text-white">
                            <div className="flex h-full w-full items-center justify-center">
                              {member.name.charAt(0)}
                            </div>
                          </Avatar>
                          <span>{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(member.joinDate)}</TableCell>
                      <TableCell>
                        {member.isBanned ? (
                          <Badge
                            variant="outline"
                            className="bg-red-100 text-red-800"
                          >
                            Banned
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800"
                          >
                            Active
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {member.isBanned ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleUnbanUser(member.id)}
                            disabled={!onUnbanUser}
                          >
                            Unban User
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs border-red-200 hover:bg-red-50"
                            onClick={() => handleBanUser(member.id)}
                            disabled={!onBanUser}
                          >
                            <Ban className="h-3.5 w-3.5 mr-1" />
                            Ban from Community
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ModeratorPanel;
