
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
import { Search, Eye, Check, Trash2, RotateCcw } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ReportDetailsDialog from "@/components/admin/ReportDetailsDialog";
import { ADMIN_REPORTS_DATA } from "@/lib/backend/data/admin-reports";
import { ReportBase } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const AdminReportsPage = () => {
  const [reports, setReports] = useState<ReportBase[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<ReportBase | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [isUnresolveDialogOpen, setIsUnresolveDialogOpen] = useState(false);
  const [reportToUnresolve, setReportToUnresolve] = useState<string | null>(null);
  const [unresolveReason, setUnresolveReason] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const processedReports = ADMIN_REPORTS_DATA.map(report => ({
      ...report,
      status: report.status as "pending" | "reviewed" | "resolved"
    }));
    setReports(processedReports);
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
      details: `Resolved report ${report.id}: ${report.reason}`,
      targetId: report.id,
      targetType: "report",
    });
  };

  const handleUnresolveReport = () => {
    if (!reportToUnresolve || !unresolveReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for unresolving this report.",
        variant: "destructive",
      });
      return;
    }

    const report = reports.find(r => r.id === reportToUnresolve);
    const updatedReports = reports.map((r) =>
      r.id === reportToUnresolve ? { ...r, status: "pending" as const } : r
    );
    setReports(updatedReports);

    toast({
      title: "Report Unresolved",
      description: `The report has been marked as pending. Reason: ${unresolveReason}`,
    });

    logAdminAction({
      action: "report_unresolved",
      details: `Unresolved report ${reportToUnresolve}: ${report?.reason || 'Unknown reason'}. Reason: ${unresolveReason}`,
      targetId: reportToUnresolve,
      targetType: "report",
    });

    setIsUnresolveDialogOpen(false);
    setReportToUnresolve(null);
    setUnresolveReason("");
  };

  const handleResolveById = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      handleResolveReport(report);
    }
  };

  const handleDeleteReport = (id: string) => {
    const report = reports.find(r => r.id === id);
    const updatedReports = reports.filter((report) => report.id !== id);
    setReports(updatedReports);

    toast({
      title: "Report Deleted",
      description: "The report has been successfully deleted.",
    });

    logAdminAction({
      action: "report_deleted",
      details: `Deleted report ${id}: ${report?.reason || 'Unknown reason'}`,
      targetId: id,
      targetType: "report",
    });
  };

  const openDeleteDialog = (reportId: string) => {
    setReportToDelete(reportId);
    setIsDeleteDialogOpen(true);
  };

  const openUnresolveDialog = (reportId: string) => {
    setReportToUnresolve(reportId);
    setIsUnresolveDialogOpen(true);
  };

  const confirmDelete = () => {
    if (reportToDelete) {
      handleDeleteReport(reportToDelete);
      setReportToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="destructive">Pending</Badge>;
      case "reviewed":
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Reviewed</Badge>;
      case "resolved":
        return <Badge variant="outline" className="border-green-500 text-green-600">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-social-primary mb-2">
          Manage Reports
        </h1>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-0 pointer-events-none rounded-lg border border-purple-200 bg-gradient-to-r from-purple-100/40 to-blue-100/20" />
          <div className="flex items-center gap-2 relative z-10 p-1 rounded-lg bg-white/90 border border-purple-200 w-full focus-within:border-purple-500 focus-within:shadow-lg focus-within:shadow-purple-200/40 transition-colors h-12">
            <Search className="ml-3 text-social-primary h-5 w-5" />
            <Input
              placeholder="Search reports..."
              className="pl-2 py-3 border-0 bg-transparent focus:ring-0 focus:outline-none shadow-none min-w-0 flex-1 text-base h-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      <div className="border rounded-lg bg-white/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-purple-100">
              <TableHead className="font-semibold text-social-primary">Content</TableHead>
              <TableHead className="hidden md:table-cell font-semibold text-social-primary">Reason</TableHead>
              <TableHead className="hidden md:table-cell font-semibold text-social-primary">Reported By</TableHead>
              <TableHead className="hidden md:table-cell font-semibold text-social-primary">Date</TableHead>
              <TableHead className="font-semibold text-social-primary">Status</TableHead>
              <TableHead className="text-right font-semibold text-social-primary">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id} className="hover:bg-purple-50/50 transition-colors">
                <TableCell className="max-w-xs">
                  <div className="truncate" title={report.contentPreview}>
                    {report.contentPreview}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline" className="border-orange-400 text-orange-600">
                    {report.reason}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {report.originalContent?.author || report.reportedBy}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-gray-600">
                  {formatDate(report.createdAt)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(report.status)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-200 text-purple-600 hover:bg-purple-50"
                      onClick={() => setSelectedReport(report)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    {report.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500 text-green-600 hover:bg-green-50"
                        onClick={() => handleResolveReport(report)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Resolve
                      </Button>
                    )}
                    {report.status === "resolved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-500 text-orange-600 hover:bg-orange-50"
                        onClick={() => openUnresolveDialog(report.id)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Unresolve
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-600 hover:bg-red-50"
                      onClick={() => openDeleteDialog(report.id)}
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
            <p className="text-gray-500">
              {searchQuery ? "No reports found matching your search." : "No reports found."}
            </p>
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
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isUnresolveDialogOpen} onOpenChange={setIsUnresolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unresolve Report</DialogTitle>
            <DialogDescription>
              Please provide a reason for unresolving this report. This will change its status back to pending.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="unresolve-reason">Reason for unresolving</Label>
              <Textarea
                id="unresolve-reason"
                placeholder="Explain why this report needs to be unresolved..."
                value={unresolveReason}
                onChange={(e) => setUnresolveReason(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUnresolveDialogOpen(false);
                setReportToUnresolve(null);
                setUnresolveReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUnresolveReport}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Unresolve Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ReportDetailsDialog
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        onResolve={handleResolveById}
      />
    </div>
  );
};

export default AdminReportsPage;
