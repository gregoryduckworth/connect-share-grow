import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdminRoleChangeAlertProps {
  pendingChanges: {
    id: string;
    user: { id: string; name: string; email: string; role: string };
    requestedBy: string;
    requestedAt: Date;
    newRole: "admin" | "user" | "moderator";
  }[];
  currentUser: string;
  onApprove: (changeId: string) => void;
  onReject: (changeId: string) => void;
}

const AdminRoleChangeAlert = ({
  pendingChanges,
  currentUser,
  onApprove,
  onReject,
}: AdminRoleChangeAlertProps) => {
  if (!pendingChanges.length) return null;
  return (
    <Card className="border-orange-200 bg-orange-50/50 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          Admin Role Change Approval Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingChanges.map((change) => (
          <div
            key={change.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg border"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-500" />
                <span className="font-medium">{change.user.name}</span>
                <Badge className="bg-red-100 text-red-800">
                  {change.user.role} → {change.newRole}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Requested by: {change.requestedBy} •{" "}
                {change.requestedAt.toLocaleString()}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50"
                onClick={() => onApprove(change.id)}
                disabled={change.requestedBy === currentUser}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => onReject(change.id)}
                disabled={change.requestedBy === currentUser}
              >
                Reject
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AdminRoleChangeAlert;
