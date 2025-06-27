import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";
import { adminLogs } from "@/lib/admin-logger";
import AdminTablePagination from "@/components/admin/AdminTablePagination";
import AdminTable from "@/components/admin/AdminTable";

const AdminLogsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [targetTypeFilter, setTargetTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const actionTypes = useMemo(() => {
    const types = Array.from(new Set(adminLogs.map((log) => log.action)));
    return types.sort();
  }, []);

  const targetTypes = useMemo(() => {
    const types = Array.from(new Set(adminLogs.map((log) => log.targetType)));
    return types.sort();
  }, []);

  const filteredLogs = useMemo(() => {
    let filtered = adminLogs;
    if (searchQuery) {
      filtered = filtered.filter(
        (log) =>
          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.adminId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.targetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.timestamp
            .toLocaleString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }
    if (actionFilter !== "all") {
      filtered = filtered.filter((log) => log.action === actionFilter);
    }
    if (targetTypeFilter !== "all") {
      filtered = filtered.filter((log) => log.targetType === targetTypeFilter);
    }
    return filtered.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }, [searchQuery, actionFilter, targetTypeFilter]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const clearFilters = () => {
    setSearchQuery("");
    setActionFilter("all");
    setTargetTypeFilter("all");
    setCurrentPage(1);
  };

  const getBadgeColor = (action: string) => {
    if (action.includes("approved") || action.includes("activated"))
      return "bg-green-500";
    if (
      action.includes("rejected") ||
      action.includes("suspend") ||
      action.includes("banned")
    )
      return "bg-red-500";
    if (action.includes("locked") || action.includes("warn"))
      return "bg-orange-500";
    if (action.includes("moderator")) return "bg-blue-500";
    return "bg-social-primary";
  };

  const formatActionText = (action: string) => {
    return action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Define columns for AdminTable
  const columns = [
    {
      header: "Timestamp",
      accessor: (log: (typeof adminLogs)[0]) => (
        <div>
          <div className="hidden md:block">
            {log.timestamp.toLocaleDateString()}{" "}
            {log.timestamp.toLocaleTimeString()}
          </div>
          <div className="md:hidden text-xs">
            {log.timestamp.toLocaleDateString()}
          </div>
        </div>
      ),
      className: "whitespace-nowrap text-sm",
    },
    {
      header: "Admin",
      accessor: (log: (typeof adminLogs)[0]) => (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
          {log.adminId}
        </Badge>
      ),
    },
    {
      header: "Action",
      accessor: (log: (typeof adminLogs)[0]) => (
        <Badge className={`${getBadgeColor(log.action)} text-xs`}>
          {formatActionText(log.action)}
        </Badge>
      ),
    },
    {
      header: "Details",
      accessor: (log: (typeof adminLogs)[0]) => (
        <div className="truncate max-w-md" title={log.details}>
          {log.details}
        </div>
      ),
      className: "hidden md:table-cell max-w-md",
    },
    {
      header: "Target",
      accessor: (log: (typeof adminLogs)[0]) => (
        <Badge variant="outline" className="text-xs">
          {log.targetType}: {log.targetId}
        </Badge>
      ),
      className: "hidden md:table-cell",
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-social-primary mb-2">
            Audit Log
          </h1>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative w-full md:w-64">
              <div
                className="absolute inset-0 pointer-events-none rounded-lg border border-purple-200 bg-gradient-to-r from-purple-100/40 to-blue-100/20"
                style={{ zIndex: 0 }}
              />
              <div className="flex items-center gap-2 relative z-10 p-1 rounded-lg bg-white/90 border border-purple-200 w-full focus-within:border-purple-500 focus-within:shadow-lg focus-within:shadow-purple-200/40 transition-colors h-12">
                <Search className="ml-3 text-social-primary h-5 w-5" />
                <Input
                  placeholder="Search logs..."
                  className="pl-2 py-3 border-0 bg-transparent focus:ring-0 focus:outline-none shadow-none min-w-0 flex-1 text-base h-full"
                  style={{ boxShadow: "none" }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  autoComplete="off"
                />
              </div>
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full md:w-40 bg-white/90 border border-purple-200 rounded-lg shadow-none px-4 py-0 h-12 flex items-center focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200/40 transition-colors">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {actionTypes.map((action) => (
                  <SelectItem key={action} value={action}>
                    {formatActionText(action)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={targetTypeFilter}
              onValueChange={setTargetTypeFilter}
            >
              <SelectTrigger className="w-full md:w-40 bg-white/90 border border-purple-200 rounded-lg shadow-none px-4 py-0 h-12 flex items-center focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200/40 transition-colors">
                <SelectValue placeholder="Target Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {targetTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="default"
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-0 h-12 min-w-[100px]"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        <AdminTable
          columns={columns}
          data={paginatedLogs}
          emptyMessage={
            <div className="text-center p-8 text-social-muted">
              No logs found matching your search criteria.
            </div>
          }
        />
        {filteredLogs.length > 0 && (
          <AdminTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredLogs.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminLogsPage;
