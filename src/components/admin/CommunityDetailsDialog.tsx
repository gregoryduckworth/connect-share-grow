
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Calendar, User } from "lucide-react";

interface PendingCommunity {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdBy: string;
  requestedAt: Date;
}

interface CommunityDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  community: PendingCommunity | null;
}

const CommunityDetailsDialog = ({ isOpen, onClose, community }: CommunityDetailsDialogProps) => {
  if (!community) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{community.name}</DialogTitle>
          <DialogDescription>
            Community approval details and information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Community Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-1">Description</h4>
                <p className="text-sm">{community.description}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {(community.tags ?? []).map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-social-accent/50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Creator Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Creator Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created by</span>
                <span className="font-medium">{community.createdBy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Request date</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">
                    {community.requestedAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Time since request</span>
                <span className="font-medium">
                  {Math.floor((Date.now() - community.requestedAt.getTime()) / (1000 * 60 * 60))} hours ago
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Additional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Community ID</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {community.id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expected initial members</span>
                <span className="font-medium">1-5 members</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Category</span>
                <Badge variant="outline" className="bg-social-background">
                  {community.tags[0] || "General"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommunityDetailsDialog;
