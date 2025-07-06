import { useState, useEffect } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { Search, Eye, Check, Trash2 } from "lucide-react";
import { logAdminAction } from "@/lib/admin-logger";
import { formatDate } from "@/lib/utils";
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
import ReportDetailsDialog from "@/components/admin/ReportDetailsDialog";
import { ADMIN_REPORTS_DATA } from "@/lib/backend/data/admin-reports";
import { ReportBase } from "@/lib/types";

const AdminReportsPage = () => {
  const [reports, setReports] = useState<ReportBase[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<ReportBase | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching reports from an API
    setReports(ADMIN_REPORTS_DATA);
  }, []);

  const filteredReports = reports.filter(
    (report) =>
      report.contentPreview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleResolveReport = (report: ReportBase) => {
    const updatedReports = reports.map((r) =>
      r.id === report.id ? { ...r, status: "resolved" as const } : r
    );
    setReports(updatedReports);

    toast({
      title: "Report Resolved",
      description: "The report has been marked as resolved.",
    });

    logAdminAction({
      action: "report_resolved",
      details: `Resolved report ${report.id}`,
      targetId: report.id,
      targetType: "report",
    });
  };

  const handleDeleteReport = (id: string) => {
    const updatedReports = reports.filter((report) => report.id !== id);
    setReports(updatedReports);

    toast({
      title: "Report Deleted",
      description: "The report has been successfully deleted.",
    });

    logAdminAction({
      action: "report_deleted",
      details: `Deleted report ${id}`,
      targetId: id,
      targetType: "report",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Manage Reports</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search reports..."
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
              <TableHead>Content</TableHead>
              <TableHead className="hidden md:table-cell">Reason</TableHead>
              <TableHead className="hidden md:table-cell">Reported By</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.contentPreview}</TableCell>
                <TableCell className="hidden md:table-cell">{report.reason}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {report.originalContent?.author || "N/A"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(report.createdAt)}
                </TableCell>
                <TableCell>
                  {report.status === "pending" ? (
                    <span className="text-yellow-500">Pending</span>
                  ) : report.status === "reviewed" ? (
                    <span className="text-blue-500">Reviewed</span>
                  ) : (
                    <span className="text-green-500">Resolved</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReport(report)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    {report.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500 text-green-500 hover:bg-green-50"
                        onClick={() => handleResolveReport(report)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Resolve
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredReports.length === 0 && (
          <div className="text-center p-8">
            <p className="text-social-muted">No reports found.</p>
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the report.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-red-50"
              onClick={() => {
                if (selectedReport) {
                  handleDeleteReport(selectedReport.id);
                  setIsDeleteDialogOpen(false);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ReportDetailsDialog
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
};

export default AdminReportsPage;
