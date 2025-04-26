
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { adminLogs } from "@/lib/admin-logger";

const AdminAuditLogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredLogs = useMemo(() => {
    return adminLogs.filter(log => 
      log.action.includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.timestamp.toLocaleString().includes(searchQuery)
    ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [searchQuery, adminLogs]);

  const getBadgeColor = (action: string) => {
    if (action.includes('approved') || action.includes('activated')) return 'bg-green-500';
    if (action.includes('rejected') || action.includes('suspend') || action.includes('banned')) return 'bg-red-500';
    if (action.includes('locked') || action.includes('warn')) return 'bg-orange-500';
    return 'bg-social-primary';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Audit Log</h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search logs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
                  <th className="text-left p-4 hidden md:table-cell">Details</th>
                  <th className="text-left p-4 hidden md:table-cell">Target</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr key={index} className="border-b hover:bg-muted/20">
                    <td className="p-4 whitespace-nowrap">{log.timestamp.toLocaleString()}</td>
                    <td className="p-4">{log.adminId}</td>
                    <td className="p-4">
                      <Badge className={getBadgeColor(log.action)}>
                        {log.action.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4 hidden md:table-cell">{log.details}</td>
                    <td className="p-4 hidden md:table-cell">
                      <Badge variant="outline">
                        {log.targetType}: {log.targetId}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="text-center p-8">
              <p className="text-social-muted">No logs found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuditLogs;
