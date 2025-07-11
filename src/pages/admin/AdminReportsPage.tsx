import { useState, useEffect } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import AdminTablePagination from '@/components/admin/AdminTablePagination';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Eye, Check, Trash2, RotateCcw } from 'lucide-react';
import { logAdminAction } from '@/lib/admin-logger';
import { formatDate } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ReportDetailsDialog from '@/components/admin/ReportDetailsDialog';
import { userService } from '@/lib/backend/services/userService';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Report } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const AdminReportsPage = () => {
  // Update reports state to include extra fields
  const [reports, setReports] = useState<
    (Report & { reportedByName: string; assignedToName?: string })[]
  >([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [isUnresolveDialogOpen, setIsUnresolveDialogOpen] = useState(false);
  const [reportToUnresolve, setReportToUnresolve] = useState<string | null>(null);
  const [unresolveReason, setUnresolveReason] = useState('');
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // Add loading state for reports
  const [loading, setLoading] = useState(true);

  const clearFilters = () => {
    setStatusFilter('all');
    setReasonFilter('all');
    setAssigneeFilter('all');
    setCurrentPage(1);
  };

  // Move filteredReports above paginatedReports so it is initialized first
  const filteredReports = reports.filter(
    (report) =>
      (statusFilter === 'all' || report.status === statusFilter) &&
      (reasonFilter === 'all' || report.reason === reasonFilter) &&
      (assigneeFilter === 'all' || report.assignedTo === assigneeFilter),
  );
  // Update paginatedReports to use pageSize
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const totalPages = Math.max(1, Math.ceil(filteredReports.length / pageSize));

  useEffect(() => {
    Promise.all([api.getReports(), userService.getUsers()]).then(([reportData, users]) => {
      // Accept all statuses including 'in progress'
      const processedReports: (Report & { reportedByName: string; assignedToName?: string })[] =
        reportData.map((report) => ({
          ...report,
          status: report.status as Report['status'],
          reportedByName: users.find((u) => u.id === report.reportedBy)?.name || report.reportedBy,
          assignedToName:
            report.assignedTo && typeof report.assignedTo === 'string'
              ? users.find((u) => u.id === report.assignedTo)?.name || report.assignedTo
              : undefined,
        }));
      setReports(processedReports);
      setLoading(false); // Set loading to false after data is fetched
    });
  }, []);

  // Get unique statuses, reasons, and assignees from reports
  const statusOptions = Array.from(new Set(reports.map((r) => r.status)));
  const reasonOptions = Array.from(new Set(reports.map((r) => r.reason)));
  // Only allow assignment to admins
  const adminUsers = reports
    .filter(
      (r) =>
        typeof r.assignedTo === 'string' && r.assignedToName && r.assignedToName !== r.assignedTo,
    )
    .map((r) => ({ id: r.assignedTo as string, name: r.assignedToName as string }));
  const assigneeIdToName: Record<string, string> = Object.fromEntries(
    adminUsers.map((u) => [u.id, u.name]),
  );
  const assigneeOptions = adminUsers.map((u) => u.id);

  const handleResolveReport = (report: Report) => {
    const updatedReports = reports.map((r) =>
      r.id === report.id ? { ...r, status: 'resolved' as const } : r,
    );
    setReports(updatedReports);

    toast({
      title: 'Report Resolved',
      description: 'The report has been marked as resolved.',
    });

    logAdminAction({
      action: 'report_resolved',
      details: `Resolved report ${report.id}: ${report.reason}`,
      targetId: report.id,
      targetType: 'report',
    });
  };

  const handleUnresolveReport = () => {
    if (!reportToUnresolve || !unresolveReason.trim()) {
      toast({
        title: 'Reason Required',
        description: 'Please provide a reason for unresolving this report.',
        variant: 'destructive',
      });
      return;
    }

    const report = reports.find((r) => r.id === reportToUnresolve);
    const updatedReports = reports.map((r) =>
      r.id === reportToUnresolve ? { ...r, status: 'pending' as const } : r,
    );
    setReports(updatedReports);

    toast({
      title: 'Report Unresolved',
      description: `The report has been marked as pending. Reason: ${unresolveReason}`,
    });

    logAdminAction({
      action: 'report_unresolved',
      details: `Unresolved report ${reportToUnresolve}: ${report?.reason || 'Unknown reason'}. Reason: ${unresolveReason}`,
      targetId: reportToUnresolve,
      targetType: 'report',
    });

    setIsUnresolveDialogOpen(false);
    setReportToUnresolve(null);
    setUnresolveReason('');
  };

  const handleResolveById = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (report) {
      handleResolveReport(report);
    }
  };

  const handleDeleteReport = (id: string) => {
    const report = reports.find((r) => r.id === id);
    const updatedReports = reports.filter((report) => report.id !== id);
    setReports(updatedReports);

    toast({
      title: 'Report Deleted',
      description: 'The report has been successfully deleted.',
    });

    logAdminAction({
      action: 'report_deleted',
      details: `Deleted report ${id}: ${report?.reason || 'Unknown reason'}`,
      targetId: id,
      targetType: 'report',
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
      case 'pending':
        return <Badge variant="destructive">Pending</Badge>;
      case 'reviewed':
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            Reviewed
          </Badge>
        );
      case 'resolved':
        return (
          <Badge variant="outline" className="border-green-500 text-green-600">
            Resolved
          </Badge>
        );
      case 'in progress':
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-600 bg-purple-50">
            In Progress
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Define columns for AdminTable
  const columns = [
    {
      header: 'Content',
      accessor: (r: Report) => (
        <div className="truncate max-w-xs" title={r.contentPreview}>
          {r.contentPreview}
        </div>
      ),
    },
    {
      header: 'Reason',
      accessor: (r: Report) => (
        <Badge variant="outline" className="border-orange-400 text-orange-600">
          {r.reason}
        </Badge>
      ),
      headerClassName: 'hidden md:table-cell',
      cellClassName: 'hidden md:table-cell',
    },
    {
      header: 'Reported By',
      accessor: (r: Report & { reportedByName: string }) => r.reportedByName,
      headerClassName: 'hidden md:table-cell',
      cellClassName: 'hidden md:table-cell',
    },
    {
      header: 'Date',
      accessor: (r: Report) => formatDate(r.createdAt),
      headerClassName: 'hidden md:table-cell',
      cellClassName: 'hidden md:table-cell text-sm text-gray-600',
    },
    { header: 'Status', accessor: (r: Report) => getStatusBadge(r.status) },
    {
      header: 'Assignee',
      accessor: (r: Report & { assignedToName?: string }) =>
        r.assignedTo ? (
          r.assignedToName || r.assignedTo
        ) : (
          <span className="text-gray-400 italic">Unassigned</span>
        ),
      headerClassName: 'hidden md:table-cell',
      cellClassName: 'hidden md:table-cell',
    },
    {
      header: 'Actions',
      accessor: (report: Report) => (
        <div className="flex justify-end gap-2 items-center flex-wrap">
          <Select
            value={report.assignedTo || ''}
            onValueChange={(assigneeId: string) => {
              setReports(
                reports.map((r) =>
                  r.id === report.id
                    ? {
                        ...r,
                        assignedTo: assigneeId,
                        status: 'in progress' as Report['status'],
                      }
                    : r,
                ),
              );
            }}
          >
            <SelectTrigger className="w-28 border border-purple-200 bg-white hover:bg-purple-50 focus:ring-2 focus:ring-purple-200 rounded-md shadow-none font-medium text-social-primary flex items-center justify-center transition-colors">
              <SelectValue placeholder={report.assignedTo ? 'Reassign...' : 'Assign'} />
            </SelectTrigger>
            <SelectContent className="w-28 z-50">
              {adminUsers.map((admin) => (
                <SelectItem key={admin.id} value={admin.id}>
                  {admin.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
            onClick={() => setSelectedReport(report)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          {report.status === 'pending' && (
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
          {report.status === 'resolved' && (
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
      ),
      headerClassName: 'text-right w-80',
      cellClassName: 'text-right align-middle w-80',
    },
  ];

  // Show skeleton loaders during initial loading state
  if (loading) {
    return (
      <div className="p-4 md:p-6 min-h-screen bg-background">
        <div className="space-y-4 max-w-2xl mx-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full mb-2 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-social-primary mb-2">Manage Reports</h1>

        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40 bg-white/90 border border-purple-200 rounded-lg shadow-none px-4 py-0 h-12 flex items-center focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200/40 transition-colors">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={reasonFilter} onValueChange={setReasonFilter}>
            <SelectTrigger className="w-full md:w-40 bg-white/90 border border-purple-200 rounded-lg shadow-none px-4 py-0 h-12 flex items-center focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200/40 transition-colors">
              <SelectValue placeholder="Reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reasons</SelectItem>
              {reasonOptions.map((reason) => (
                <SelectItem key={reason} value={reason}>
                  {reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-full md:w-40 bg-white/90 border border-purple-200 rounded-lg shadow-none px-4 py-0 h-12 flex items-center focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200/40 transition-colors">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {assigneeOptions.map((assigneeId) => (
                <SelectItem key={assigneeId} value={assigneeId}>
                  {assigneeIdToName[assigneeId] || assigneeId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="default"
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-0 h-12 min-w-[100px]"
            data-testid="admin-logs-clear-filters"
          >
            <RotateCcw className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <div className="border rounded-lg bg-white/50 backdrop-blur-sm">
        <AdminTable
          columns={columns}
          data={paginatedReports}
          emptyMessage={
            filteredReports.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-gray-500">
                  {statusFilter !== 'all' || reasonFilter !== 'all' || assigneeFilter !== 'all'
                    ? 'No reports found matching your filters.'
                    : 'No reports found.'}
                </p>
              </div>
            ) : undefined
          }
        />

        {/* Admin-style Pagination controls */}
        {filteredReports.length > 0 && (
          <AdminTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredReports.length}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
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
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
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
              Please provide a reason for unresolving this report. This will change its status back
              to pending.
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
                setUnresolveReason('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUnresolveReport} className="bg-orange-500 hover:bg-orange-600">
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
