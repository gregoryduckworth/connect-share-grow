import { Badge } from "@/components/ui/badge";
import React from "react";

export type StatusType =
  | "active"
  | "suspended"
  | "banned"
  | "pending"
  | "reviewed"
  | "resolved"
  | "unread"
  | "default"
  | "user"
  | "moderator"
  | "admin";

const statusColorMap: Record<StatusType, string> = {
  active: "bg-green-500 text-white",
  suspended: "bg-orange-500 text-white",
  banned: "bg-red-500 text-white",
  pending: "bg-yellow-500 text-white",
  reviewed: "bg-blue-500 text-white",
  resolved: "bg-gray-400 text-white",
  unread: "bg-red-500 text-white",
  default: "bg-gray-300 text-gray-700",
  user: "bg-slate-400 text-white",
  moderator: "bg-social-secondary text-white",
  admin: "bg-social-primary text-white",
};

export interface StatusBadgeProps {
  status: StatusType;
  children?: React.ReactNode;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  className,
}) => {
  return (
    <Badge
      className={`${statusColorMap[status] || statusColorMap.default} ${
        className || ""
      }`.trim()}
    >
      {children || status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default StatusBadge;
