import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertTriangle,
  User,
  MessageSquare,
  FileText,
  Lock,
  Check,
  Ban,
  UserX,
} from "lucide-react";
import { logAdminAction } from "@/lib/admin-logger";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Report {
  id: string;
  contentType: "post" | "reply" | "user";
  contentId: string;
  contentPreview: string;
  reportedBy: string;
  reason: string;
  createdAt: Date;
  status: "pending" | "reviewed";
  originalContent?: {
    title?: string;
    community?: string;
    parentPost?: string;
    author?: string;
    fullText: string;
  };
}

interface ReportDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
  onResolve: (reportId: string) => void;
  onLockContent: (reportId: string) => void;
}

const ReportDetailsDialog = ({
  isOpen,
  onClose,
  report,
  onResolve,
  onLockContent,
}: ReportDetailsDialogProps) => {
  const { toast } = useToast();
  const [warnReason, setWarnReason] = useState("");
  const [suspendReason, setSuspendReason] = useState("");
  const [currentAdmin] = useState("admin@example.com"); // Mock current admin

  if (!report) return null;

  const handleResolve = () => {
    onResolve(report.id);
    onClose();
  };

  const handleLockContent = () => {
    onLockContent(report.id);
    onClose();
  };

  const handleWarnUser = () => {
    if (!warnReason.trim()) {
      toast({
        title: "Warning Required",
        description: "Please provide a reason for the warning.",
      });
      return;
    }

    toast({
      title: "User Warned",
      description: `Warning sent to user with reason: ${warnReason}`,
    });

    logAdminAction({
      action: "user_warned",
      details: `Warned user for report ${report.id}: ${warnReason} (Admin: ${currentAdmin})`,
      targetId: report.contentId,
      targetType: "user",
    });

    setWarnReason("");
    onClose();
  };

  const handleSuspendUser = () => {
    if (!suspendReason.trim()) {
      toast({
        title: "Suspension Reason Required",
        description: "Please provide a reason for the suspension.",
      });
      return;
    }

    toast({
      title: "User Suspended",
      description: `User suspended with reason: ${suspendReason}`,
    });

    logAdminAction({
      action: "user_suspended",
      details: `Suspended user for report ${report.id}: ${suspendReason} (Admin: ${currentAdmin})`,
      targetId: report.contentId,
      targetType: "user",
    });

    setSuspendReason("");
    onClose();
  };

  const getContentTypeIcon = () => {
    switch (report.contentType) {
      case "post":
        return <FileText className="h-5 w-5" />;
      case "reply":
        return <MessageSquare className="h-5 w-5" />;
      case "user":
        return <User className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getContentTypeLabel = () => {
    switch (report.contentType) {
      case "post":
        return "Post Report";
      case "reply":
        return "Reply Report";
      case "user":
        return "User Report";
      default:
        return "Content Report";
    }
  };

  // Prefer originalContent from report if available
  const getDetailedContent = () => {
    if (report.originalContent) {
      if (report.contentType === "post") {
        return {
          title: report.originalContent.title,
          author: report.originalContent.author,
          community: report.originalContent.community,
          content: report.originalContent.fullText,
        };
      }
      if (report.contentType === "reply") {
        return {
          parentPost: report.originalContent.parentPost,
          author: report.originalContent.author,
          content: report.originalContent.fullText,
        };
      }
    }
    // fallback to old mock if not present
    switch (report.contentType) {
      case "post":
        return {
          title: "Understanding React Hooks in Depth",
          author: "TechGuru123",
          community: "Web Development",
          content: report.contentPreview,
          metadata: {
            likes: 23,
            comments: 8,
            posted: "2 hours ago",
          },
        };
      case "reply":
        return {
          parentPost: "Best practices for API design",
          author: "CodeMaster",
          content: report.contentPreview,
          metadata: {
            likes: 5,
            replies: 2,
            posted: "1 hour ago",
          },
        };
      case "user":
        return {
          username: "SpamUser2024",
          joinDate: "1 week ago",
          content: report.contentPreview,
          metadata: {
            posts: 47,
            communities: 12,
            reports: 8,
          },
        };
      default:
        return null;
    }
  };

  const detailedContent = getDetailedContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getContentTypeIcon()}
            {getContentTypeLabel()}
          </DialogTitle>
          <DialogDescription>
            Review the reported content and take appropriate action
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Report Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reported by</span>
                <span className="font-medium">{report.reportedBy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Report reason</span>
                <Badge variant="destructive">{report.reason}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Report date</span>
                <span className="font-medium">
                  {report.createdAt.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Content ID</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {report.contentId}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-1 mt-2">
                  Report Summary
                </h4>
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                  <p className="text-sm">{report.contentPreview}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {getContentTypeIcon()}
                Reported Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {detailedContent && (
                <>
                  {report.contentType === "post" && (
                    <>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">
                          Post Title
                        </h4>
                        <p className="font-medium">{detailedContent.title}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-1">
                            Author
                          </h4>
                          <p>{detailedContent.author}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-1">
                            Community
                          </h4>
                          <p>{detailedContent.community}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {report.contentType === "reply" && (
                    <>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">
                          Reply to Post
                        </h4>
                        <p className="font-medium">
                          {detailedContent.parentPost}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">
                          Author
                        </h4>
                        <p>{detailedContent.author}</p>
                      </div>
                    </>
                  )}

                  {report.contentType === "user" && (
                    <>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">
                          Username
                        </h4>
                        <p className="font-medium">
                          {detailedContent.username}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">
                          Member since
                        </h4>
                        <p>{detailedContent.joinDate}</p>
                      </div>
                    </>
                  )}

                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">
                      Content
                    </h4>
                    <div className="p-3 rounded-md bg-muted/50 border">
                      <p className="text-sm">{detailedContent.content}</p>
                    </div>
                  </div>
                  {detailedContent.metadata && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">
                        Metadata
                      </h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        {Object.entries(detailedContent.metadata).map(
                          ([key, value]) => (
                            <div key={key} className="text-center">
                              <p className="text-gray-600 capitalize">{key}</p>
                              <p className="font-semibold">{value}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* User Actions (only for user reports) */}
          {report.contentType === "user" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserX className="h-5 w-5" />
                  User Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="warnReason">Warning Reason</Label>
                  <Input
                    id="warnReason"
                    placeholder="Enter reason for warning..."
                    value={warnReason}
                    onChange={(e) => setWarnReason(e.target.value)}
                  />
                  <Button
                    className="mt-2 bg-orange-500 hover:bg-orange-600"
                    onClick={handleWarnUser}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Send Warning
                  </Button>
                </div>

                <div>
                  <Label htmlFor="suspendReason">Suspension Reason</Label>
                  <Input
                    id="suspendReason"
                    placeholder="Enter reason for suspension..."
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                  />
                  <Button
                    className="mt-2"
                    variant="destructive"
                    onClick={handleSuspendUser}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend User
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="outline"
            className="border-orange-400 text-orange-500 hover:bg-orange-50"
            onClick={handleLockContent}
          >
            <Lock className="h-4 w-4 mr-2" /> Lock Content
          </Button>
          <Button
            variant="default"
            className="bg-green-500 hover:bg-green-600"
            onClick={handleResolve}
          >
            <Check className="h-4 w-4 mr-2" /> Mark Resolved
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailsDialog;
