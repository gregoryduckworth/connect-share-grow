import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Eye, AlertTriangle, Lock } from "lucide-react";
import { logAdminAction } from "@/lib/admin-logger";
import ReportDetailsDialog from "@/components/admin/ReportDetailsDialog";

const AdminReportsPage = () => {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [reports, setReports] = useState([
    {
      id: "report-1",
      contentType: "post",
      contentId: "post-123",
      contentPreview:
        "This post contains potentially inappropriate content about politics and inflammatory language that goes against community guidelines. It uses divisive rhetoric and could incite arguments.",
      reportedBy: "user-456",
      reason: "Contains inappropriate content",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      status: "pending",
      originalContent: {
        title: "Why Current Political System is Completely Broken",
        author: "AngryUser2024",
        community: "Political Discussion",
        fullText:
          "I'm so tired of all these politicians lying to us constantly. They're all corrupt and only care about their own power. The whole system needs to be torn down and rebuilt from scratch. Anyone who supports the current administration is either blind or complicit in this corruption. We need to take action now before it's too late and our democracy is completely destroyed. This is not a drill - we're heading towards a complete collapse of our society if we don't act immediately.",
      },
    },
    {
      id: "report-2",
      contentType: "reply",
      contentId: "reply-789",
      contentPreview:
        "This reply contains offensive language and personal attacks directed at other community members. The language used is clearly harassment and violates our community standards.",
      reportedBy: "user-101",
      reason: "Harassment",
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
      status: "pending",
      originalContent: {
        author: "ToxicUser123",
        parentPost: "Best Programming Languages for Beginners",
        fullText:
          "You're absolutely clueless and shouldn't be giving advice to anyone. Your suggestions are terrible and show you have no idea what you're talking about. Maybe stick to something you actually understand instead of spreading misinformation. People like you are what's wrong with this community - always acting like experts when you clearly aren't. Just delete your account and save everyone the trouble of reading your garbage posts.",
      },
    },
    {
      id: "report-3",
      contentType: "user",
      contentId: "user-202",
      contentPreview:
        "This user has been repeatedly posting spam across multiple communities including promotional links, duplicate content, and off-topic advertisements that disrupt community discussions.",
      reportedBy: "user-303",
      reason: "Spamming",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: "pending",
    },
  ]);

  const handleViewContent = (report) => {
    setSelectedReport(report);
    setDetailsDialogOpen(true);
  };

  const handleResolve = (id) => {
    const report = reports.find((r) => r.id === id);
    if (report) {
      setReports(
        reports.map((r) => (r.id === id ? { ...r, status: "reviewed" } : r))
      );
      toast({
        title: "Report Resolved",
        description: `The report has been marked as resolved.`,
      });
      logAdminAction({
        action: "report_resolved",
        details: `Resolved report for ${report.contentType}: ${report.contentId}`,
        targetId: report.contentId,
        targetType: report.contentType,
      });
    }
  };

  const handleLockContent = (id) => {
    const report = reports.find((r) => r.id === id);
    if (report) {
      setReports(
        reports.map((r) => (r.id === id ? { ...r, status: "reviewed" } : r))
      );
      toast({
        title: "Content Locked",
        description: `The reported content has been locked.`,
        variant: "destructive",
      });
      logAdminAction({
        action: "content_locked",
        details: `Locked ${report.contentType}: ${report.contentId}`,
        targetId: report.contentId,
        targetType: report.contentType,
      });
    }
  };

  const pendingReports = reports.filter((r) => r.status === "pending");
  const postReports = pendingReports.filter((r) => r.contentType === "post");
  const replyReports = pendingReports.filter((r) => r.contentType === "reply");
  const userReports = pendingReports.filter((r) => r.contentType === "user");

  const ReportCard = ({ report }) => (
    <Card key={report.id}>
      <CardHeader className="bg-muted/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            {report.contentType === "post" && "Post Report"}
            {report.contentType === "reply" && "Reply Report"}
            {report.contentType === "user" && "User Report"}
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-social-background">
              Reported {new Date(report.createdAt).toLocaleDateString()}
            </Badge>
            <Badge variant="destructive">{report.reason}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {report.originalContent && (
          <div>
            <h4 className="font-medium text-sm mb-2">Original Content:</h4>
            <div className="p-4 rounded-md bg-muted/50 border space-y-2">
              {report.contentType === "post" && (
                <>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      <strong>Title:</strong> {report.originalContent.title}
                    </span>
                    <span>
                      <strong>Community:</strong> {report.originalContent.community}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Author:</strong> {report.originalContent.author}
                  </div>
                </>
              )}
              {report.contentType === "reply" && (
                <>
                  <div className="text-sm text-gray-600">
                    <strong>Reply to:</strong> {report.originalContent.parentPost}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Author:</strong> {report.originalContent.author}
                  </div>
                </>
              )}
              <div className="pt-2 border-t">
                <p className="text-sm">{report.originalContent.fullText}</p>
              </div>
            </div>
          </div>
        )}
        <div>
          <h4 className="font-medium text-sm mb-2">Report Summary:</h4>
          <div className="p-4 rounded-md bg-red-50 border border-red-200">
            <p className="text-sm">{report.contentPreview}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-end mt-4">
          <Button variant="outline" onClick={() => handleViewContent(report)}>
            <Eye className="h-4 w-4 mr-2" /> View Full Details
          </Button>
          <Button
            variant="outline"
            className="border-orange-400 text-orange-500 hover:bg-orange-50"
            onClick={() => handleLockContent(report.id)}
          >
            <Lock className="h-4 w-4 mr-2" /> Lock Content
          </Button>
          <Button
            variant="default"
            className="bg-green-500 hover:bg-green-600"
            onClick={() => handleResolve(report.id)}
          >
            <Check className="h-4 w-4 mr-2" /> Mark Resolved
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-social-primary mb-2">
            Reports
          </h1>
          <Badge variant="outline" className="bg-social-accent/50">
            {pendingReports.length} Pending
          </Badge>
        </div>
        {pendingReports.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-left">
              <p className="text-social-muted">No pending reports</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                All Reports ({pendingReports.length})
              </TabsTrigger>
              <TabsTrigger value="posts">
                Posts ({postReports.length})
              </TabsTrigger>
              <TabsTrigger value="replies">
                Replies ({replyReports.length})
              </TabsTrigger>
              <TabsTrigger value="users">
                Users ({userReports.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              {pendingReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </TabsContent>
            <TabsContent value="posts" className="space-y-4">
              {postReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </TabsContent>
            <TabsContent value="replies" className="space-y-4">
              {replyReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </TabsContent>
            <TabsContent value="users" className="space-y-4">
              {userReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
      <ReportDetailsDialog
        isOpen={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        report={selectedReport}
        onResolve={handleResolve}
        onLockContent={handleLockContent}
      />
    </div>
  );
};

export default AdminReportsPage;
