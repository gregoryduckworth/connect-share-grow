import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Search, Filter, RotateCcw } from "lucide-react";
import { adminLogs } from "@/lib/admin-logger";
import AdminTablePagination from "@/components/admin/AdminTablePagination";

const AdminLogsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
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

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-social-primary mb-2">
            Audit Log
          </h1>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                className="pl-8 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full md:w-40">
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
              <SelectTrigger className="w-full md:w-40">
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
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>
            Showing {paginatedLogs.length} of {filteredLogs.length} log entries
          </span>
        </div>

        <Card>
          <CardHeader className="bg-muted/50">
            <CardTitle>Admin Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Timestamp</th>
                    <th className="text-left p-4">Admin</th>
                    <th className="text-left p-4">Action</th>
                    <th className="text-left p-4 hidden md:table-cell">
                      Details
                    </th>
                    <th className="text-left p-4 hidden md:table-cell">
                      Target
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((log, index) => (
                    <tr key={index} className="border-b hover:bg-muted/20">
                      <td className="p-4 whitespace-nowrap text-sm">
                        <div className="hidden md:block">
                          {log.timestamp.toLocaleDateString()}{" "}
                          {log.timestamp.toLocaleTimeString()}
                        </div>
                        <div className="md:hidden text-xs">
                          {log.timestamp.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 text-xs"
                        >
                          {log.adminId}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={`${getBadgeColor(log.action)} text-xs`}
                        >
                          {formatActionText(log.action)}
                        </Badge>
                      </td>
                      <td className="p-4 hidden md:table-cell max-w-md">
                        <div className="truncate" title={log.details}>
                          {log.details}
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <Badge variant="outline" className="text-xs">
                          {log.targetType}: {log.targetId}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {paginatedLogs.length === 0 && (
              <div className="text-center p-8">
                <p className="text-social-muted">
                  No logs found matching your search criteria.
                </p>
              </div>
            )}

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogsPage;
