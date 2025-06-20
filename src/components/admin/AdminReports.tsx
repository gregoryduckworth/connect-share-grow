
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Check, Eye, AlertTriangle, Lock } from "lucide-react";
import { logAdminAction } from "@/lib/admin-logger";
import ReportDetailsDialog from "./ReportDetailsDialog";

interface Report {
  id: string;
  contentType: "post" | "reply" | "user";
  contentId: string;
  contentPreview: string;
  reportedBy: string;
  reason: string;
  createdAt: Date;
  status: "pending" | "reviewed";
}

const AdminReports = () => {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([
    {
      id: "report-1",
      contentType: "post",
      contentId: "post-123",
      contentPreview: "This post contains potentially inappropriate content about politics...",
      reportedBy: "user-456",
      reason: "Contains inappropriate content",
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      status: "pending"
    },
    {
      id: "report-2",
      contentType: "reply",
      contentId: "reply-789",
      contentPreview: "This reply contains offensive language and personal attacks...",
      reportedBy: "user-101",
      reason: "Harassment",
      createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      status: "pending"
    },
    {
      id: "report-3",
      contentType: "user",
      contentId: "user-202",
      contentPreview: "This user has been repeatedly posting spam across multiple communities...",
      reportedBy: "user-303",
      reason: "Spamming",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: "pending"
    },
  ]);

  const handleViewContent = (report: Report) => {
    setSelectedReport(report);
    setDetailsDialogOpen(true);
  };

  const handleResolve = (id: string) => {
    const report = reports.find(r => r.id === id);
    if (report) {
      setReports(reports.map(r => 
        r.id === id ? { ...r, status: "reviewed" } : r
      ));
      
      toast({
        title: "Report Resolved",
        description: `The report has been marked as resolved.`,
      });
      
      logAdminAction({
        action: "report_resolved",
        details: `Resolved report for ${report.contentType}: ${report.contentId}`,
        targetId: report.contentId,
        targetType: report.contentType
      });
    }
  };

  const handleLockContent = (id: string) => {
    const report = reports.find(r => r.id === id);
    if (report) {
      setReports(reports.map(r => 
        r.id === id ? { ...r, status: "reviewed" } : r
      ));
      
      toast({
        title: "Content Locked",
        description: `The reported content has been locked.`,
        variant: "destructive",
      });
      
      logAdminAction({
        action: "content_locked",
        details: `Locked ${report.contentType}: ${report.contentId}`,
        targetId: report.contentId,
        targetType: report.contentType
      });
    }
  };

  const pendingReports = reports.filter(r => r.status === "pending");

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Reports</h2>
          <Badge variant="outline" className="bg-social-accent/50">
            {pendingReports.length} Pending
          </Badge>
        </div>
        
        {pendingReports.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-social-muted">No pending reports</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingReports.map((report) => (
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
                      <Badge variant="destructive">
                        {report.reason}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="p-3 rounded-md bg-muted/50 border">
                    <p className="text-sm">{report.contentPreview}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-end mt-4">
                    <Button 
                      variant="outline"
                      onClick={() => handleViewContent(report)}
                    >
                      <Eye className="h-4 w-4 mr-2" /> View Content
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
            ))}
          </div>
        )}
      </div>

      <ReportDetailsDialog
        isOpen={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        report={selectedReport}
        onResolve={handleResolve}
        onLockContent={handleLockContent}
      />
    </>
  );
};

export default AdminReports;
