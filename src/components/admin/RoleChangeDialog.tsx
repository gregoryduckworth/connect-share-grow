
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface RoleChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirm: (userId: string, newRole: string) => void;
}

const RoleChangeDialog = ({ isOpen, onClose, user, onConfirm }: RoleChangeDialogProps) => {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState("");

  const roles = [
    { value: "user", label: "Regular User", color: "bg-blue-500" },
    { value: "moderator", label: "Moderator", color: "bg-orange-500" },
    { value: "admin", label: "Administrator", color: "bg-red-500" }
  ];

  const handleConfirm = () => {
    if (user && selectedRole && selectedRole !== user.role) {
      onConfirm(user.id, selectedRole);
      toast({
        title: "Role Updated",
        description: `${user.name}'s role has been changed to ${roles.find(r => r.value === selectedRole)?.label}.`,
      });
      onClose();
      setSelectedRole("");
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedRole("");
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            You are about to change the role for {user.name}. This action will immediately update their permissions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <Badge className={roles.find(r => r.value === user.role.toLowerCase())?.color || "bg-blue-500"}>
              Current: {user.role}
            </Badge>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New Role</label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a new role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${role.color}`} />
                      {role.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRole && selectedRole !== user.role.toLowerCase() && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> Changing this user's role will immediately update their permissions and access levels.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedRole || selectedRole === user.role.toLowerCase()}
          >
            Confirm Change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleChangeDialog;
