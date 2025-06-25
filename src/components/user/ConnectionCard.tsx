import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MessageCircle } from "lucide-react";
import React from "react";

interface ConnectionCardProps {
  connection: {
    id: string;
    name: string;
    mutualConnections: number;
    status: "connected" | "pending" | "received";
    lastActive: Date;
    bio?: string;
  };
  showActions?: boolean;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onViewProfile?: (connection: ConnectionCardProps["connection"]) => void;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({
  connection,
  showActions = false,
  onAccept,
  onReject,
  onViewProfile,
}) => (
  <Card className="flex flex-col h-full border-2 transition-shadow hover:shadow-xl hover:scale-[1.03] hover:border-purple-400 hover:bg-purple-50 focus-within:border-purple-500 focus-within:bg-purple-50">
    <CardHeader className="flex-1 pb-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <CardTitle className="text-base sm:text-lg break-words">
            {connection.name}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm mt-1 break-words">
            {connection.bio}
          </CardDescription>
        </div>
        <Badge variant="outline" className="text-xs whitespace-nowrap">
          {connection.mutualConnections} mutual
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="flex flex-col flex-1 justify-end space-y-3">
      <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-2">
        <span className="break-words">
          Last active: {connection.lastActive.toLocaleDateString()}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-auto w-full">
        {showActions ? (
          <>
            <Button
              onClick={() => onAccept && onAccept(connection.id)}
              className="flex-1 text-xs sm:text-sm"
            >
              Accept
            </Button>
            <Button
              onClick={() => onReject && onReject(connection.id)}
              variant="outline"
              className="flex-1 text-xs sm:text-sm"
            >
              Decline
            </Button>
          </>
        ) : connection.status === "pending" ? (
          <Button
            onClick={() => onViewProfile && onViewProfile(connection)}
            variant="outline"
            className="flex-1 text-xs sm:text-sm"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            View Profile
          </Button>
        ) : (
          <Button variant="outline" className="flex-1 text-xs sm:text-sm">
            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Message
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

export default ConnectionCard;
