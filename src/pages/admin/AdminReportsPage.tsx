import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Eye, AlertTriangle, Lock } from "lucide-react";
import { logAdminAction } from "@/lib/admin-logger";
import ReportDetailsDialog from "@/components/admin/ReportDetailsDialog";
import { api } from "@/lib/api";
import AdminTable from "@/components/admin/AdminTable";
import AdminTablePagination from "@/components/admin/AdminTablePagination";
import { formatDate } from "@/lib/utils";

const AdminReportsPage = () => {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [reports, setReports] = useState([]);

  // Load reports from api.ts
  useEffect(() => {
    api.getReports().then(setReports);
  }, []);

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
  const reviewedReports = reports.filter((r) => r.status === "reviewed");
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
              Reported {formatDate(new Date(report.createdAt))}
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
                  <div className="text-sm text-gray-600">
                    <span>
                      <strong>Title:</strong> {report.originalContent.title}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>
                      <strong>Community:</strong>{" "}
                      {report.originalContent.community}
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
                    <strong>Reply to:</strong> {report.originalContent.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Author:</strong> {report.originalContent.author}
                  </div>
                </>
              )}
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

  // Pagination state for archive
  const [archivePage, setArchivePage] = useState(1);
  const [archivePageSize, setArchivePageSize] = useState(10);
  const archiveTotalPages = Math.ceil(reviewedReports.length / archivePageSize);
  const paginatedArchive = reviewedReports.slice(
    (archivePage - 1) * archivePageSize,
    archivePage * archivePageSize
  );

  return (
    <div
      className="p-4 md:p-6 space-y-6 bg-background min-h-screen"
      data-testid="admin-reports-page"
    >
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
          <Tabs
            defaultValue="all"
            className="space-y-6"
            data-testid="admin-reports-tabs"
          >
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
              {pendingReports.length === 0 ? (
                <div className="text-center p-8 text-social-muted">
                  No pending reports.
                </div>
              ) : (
                pendingReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))
              )}
            </TabsContent>
            <TabsContent value="posts" className="space-y-4">
              {postReports.length === 0 ? (
                <div className="text-center p-8 text-social-muted">
                  No post reports.
                </div>
              ) : (
                postReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))
              )}
            </TabsContent>
            <TabsContent value="replies" className="space-y-4">
              {replyReports.length === 0 ? (
                <div className="text-center p-8 text-social-muted">
                  No reply reports.
                </div>
              ) : (
                replyReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))
              )}
            </TabsContent>
            <TabsContent value="users" className="space-y-4">
              {userReports.length === 0 ? (
                <div className="text-center p-8 text-social-muted">
                  No user reports.
                </div>
              ) : (
                userReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))
              )}
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
        data-testid="admin-report-details-dialog"
      />
      <hr />
      {/* Archive Section as AdminTable */}
      <div
        className="mt-10 space-y-4"
        data-testid="admin-reports-archive-section"
      >
        <h2 className="text-lg font-semibold text-social-primary">Archive</h2>
        <AdminTable
          columns={[
            {
              header: "Type",
              accessor: (row) => (
                <Badge
                  variant="outline"
                  className={
                    row.contentType === "post"
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : row.contentType === "reply"
                      ? "bg-purple-100 text-purple-700 border-purple-200"
                      : "bg-orange-100 text-orange-700 border-orange-200"
                  }
                >
                  {row.contentType.charAt(0).toUpperCase() +
                    row.contentType.slice(1)}
                </Badge>
              ),
            },
            {
              header: "User",
              accessor: (row) => (
                <span className="font-medium text-foreground">
                  {row.reportedBy || row.user || "-"}
                </span>
              ),
            },
            {
              header: "Outcome",
              accessor: (row) => (
                <Badge
                  className={
                    row.status === "reviewed"
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }
                >
                  Reviewed
                </Badge>
              ),
            },
            {
              header: "Actions",
              accessor: (row) => (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewContent(row)}
                >
                  <Eye className="h-4 w-4 mr-1 inline" /> Details
                </Button>
              ),
              className: "text-right",
            },
          ]}
          data={paginatedArchive}
          emptyMessage={
            <div
              className="text-center p-8 text-social-muted"
              data-testid="admin-reports-archive-empty"
            >
              No archived reports found.
            </div>
          }
          data-testid="admin-reports-archive-table"
        />
        {reviewedReports.length > 0 && (
          <AdminTablePagination
            currentPage={archivePage}
            totalPages={archiveTotalPages}
            pageSize={archivePageSize}
            totalItems={reviewedReports.length}
            onPageChange={setArchivePage}
            onPageSizeChange={(size) => {
              setArchivePageSize(size);
              setArchivePage(1);
            }}
            data-testid="admin-reports-archive-pagination"
          />
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;
