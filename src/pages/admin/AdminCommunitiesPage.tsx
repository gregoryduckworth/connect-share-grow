
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Users, MessageSquare, Shield, CheckCircle, XCircle, Calendar, Settings, Eye } from "lucide-react";
import CommunityDetailsDialog from "@/components/admin/CommunityDetailsDialog";
import { logAdminAction } from "@/lib/admin-logger";
import AdminTablePagination from "@/components/admin/AdminTablePagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  postCount: number;
  status: "active" | "pending" | "suspended";
  createdAt: Date;
  createdBy: string;
  moderators: string[];
  rules: string[];
}

const AdminCommunitiesPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [approvalReason, setApprovalReason] = useState("");

  const [communities, setCommunities] = useState<Community[]>([
    {
      id: "comm-1",
      name: "Photography Enthusiasts",
      description: "A place for photographers to share their work and discuss techniques",
      memberCount: 1250,
      postCount: 423,
      status: "active",
      createdAt: new Date(2023, 0, 15),
      createdBy: "sarah@example.com",
      moderators: ["sarah@example.com", "mike@example.com"],
      rules: [
        "Be respectful to all members",
        "No spam or self-promotion without approval",
        "Share constructive feedback on others' work"
      ]
    },
    {
      id: "comm-2",
      name: "Cooking Adventures",
      description: "Share recipes and cooking tips with fellow food lovers",
      memberCount: 890,
      postCount: 234,
      status: "active",
      createdAt: new Date(2023, 1, 20),
      createdBy: "chef@example.com",
      moderators: ["chef@example.com"],
      rules: [
        "Share original recipes or properly credit sources",
        "Be respectful in discussions",
        "No commercial promotion without approval"
      ]
    },
    {
      id: "comm-3",
      name: "Tech Discussions",
      description: "Community pending approval for technology discussions",
      memberCount: 0,
      postCount: 0,
      status: "pending",
      createdAt: new Date(2024, 5, 10),
      createdBy: "tech@example.com",
      moderators: ["tech@example.com"],
      rules: [
        "Keep discussions on-topic",
        "No spam or self-promotion",
        "Be respectful to all members"
      ]
    },
    {
      id: "comm-4",
      name: "Fitness Journey",
      description: "Motivation and tips for staying healthy",
      memberCount: 567,
      postCount: 145,
      status: "active",
      createdAt: new Date(2023, 3, 5),
      createdBy: "fitness@example.com",
      moderators: ["fitness@example.com", "trainer@example.com"],
      rules: [
        "Support and encourage others",
        "Share accurate health information",
        "No promotion of unsafe practices"
      ]
    }
  ]);

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCommunities.length / pageSize);
  const paginatedCommunities = filteredCommunities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewDetails = (community: Community) => {
    setSelectedCommunity(community);
    setShowDetailsDialog(true);
  };

  const handleApproval = (community: Community, action: 'approve' | 'reject') => {
    setSelectedCommunity(community);
    setApprovalAction(action);
    setShowApprovalDialog(true);
  };

  const handleApprovalConfirm = () => {
    if (!selectedCommunity) return;

    if (approvalAction === 'reject' && !approvalReason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for rejecting the community.",
        variant: "destructive"
      });
      return;
    }

    const newStatus = approvalAction === 'approve' ? 'active' : 'suspended';
    
    setCommunities(communities.map(c => 
      c.id === selectedCommunity.id 
        ? { ...c, status: newStatus as "active" | "pending" | "suspended" }
        : c
    ));

    toast({
      title: `Community ${approvalAction === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `${selectedCommunity.name} has been ${approvalAction}d.`,
      variant: approvalAction === 'approve' ? 'default' : 'destructive',
    });

    logAdminAction({
      action: `community_${approvalAction}d`,
      details: `${approvalAction === 'approve' ? 'Approved' : 'Rejected'} community "${selectedCommunity.name}"${approvalAction === 'reject' ? `. Reason: ${approvalReason}` : ''}`,
      targetId: selectedCommunity.id,
      targetType: "community"
    });

    setShowApprovalDialog(false);
    setApprovalReason("");
    setSelectedCommunity(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "suspended":
        return <Badge className="bg-red-500">Suspended</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Manage Communities</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search communities..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle>Communities</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Community</th>
                  <th className="text-left p-4 hidden md:table-cell">Created By</th>
                  <th className="text-left p-4 hidden lg:table-cell">Created</th>
                  <th className="text-left p-4 hidden sm:table-cell">Members</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCommunities.map((community) => (
                  <tr key={community.id} className="border-b hover:bg-muted/20">
                    <td className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-social-primary flex items-center justify-center text-white flex-shrink-0">
                          <Users className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm md:text-base truncate">{community.name}</h3>
                          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                            {community.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1 md:hidden">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              {community.memberCount}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MessageSquare className="h-3 w-3" />
                              {community.postCount}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-social-primary" />
                        <span className="text-sm">{community.createdBy}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {community.createdAt.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <div className="text-center">
                        <div className="text-sm font-medium">{community.memberCount}</div>
                        <div className="text-xs text-muted-foreground">{community.postCount} posts</div>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(community.status)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1 md:gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(community)}
                          className="text-xs px-2 md:px-3"
                        >
                          <Eye className="h-3 w-3 md:mr-1" />
                          <span className="hidden md:inline">View</span>
                        </Button>
                        
                        {community.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproval(community, 'approve')}
                              className="text-xs px-2 md:px-3 border-green-500 text-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="h-3 w-3 md:mr-1" />
                              <span className="hidden md:inline">Approve</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproval(community, 'reject')}
                              className="text-xs px-2 md:px-3 border-red-500 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-3 w-3 md:mr-1" />
                              <span className="hidden md:inline">Reject</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {paginatedCommunities.length === 0 && (
            <div className="text-center p-8">
              <p className="text-social-muted">No communities found matching your search.</p>
            </div>
          )}

          {filteredCommunities.length > 0 && (
            <AdminTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredCommunities.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Community Details Dialog */}
      {selectedCommunity && (
        <CommunityDetailsDialog
          community={{
            id: selectedCommunity.id,
            name: selectedCommunity.name,
            description: selectedCommunity.description,
            memberCount: selectedCommunity.memberCount,
            postCount: selectedCommunity.postCount,
            status: selectedCommunity.status,
            createdAt: selectedCommunity.createdAt,
            createdBy: selectedCommunity.createdBy,
            moderators: selectedCommunity.moderators,
            rules: selectedCommunity.rules
          }}
          isOpen={showDetailsDialog}
          onClose={() => {
            setShowDetailsDialog(false);
            setSelectedCommunity(null);
          }}
          onUpdateRules={(newRules) => {
            setCommunities(communities.map(c => 
              c.id === selectedCommunity.id 
                ? { ...c, rules: newRules }
                : c
            ));
          }}
        />
      )}

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? 'Approve' : 'Reject'} Community
            </DialogTitle>
            <DialogDescription>
              You are about to {approvalAction} the community "{selectedCommunity?.name}".
              {approvalAction === 'reject' && ' Please provide a reason for rejection.'}
            </DialogDescription>
          </DialogHeader>
          
          {approvalAction === 'reject' && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for rejection *</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a reason for rejecting this community..."
                  value={approvalReason}
                  onChange={(e) => setApprovalReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleApprovalConfirm}
              variant={approvalAction === 'approve' ? 'default' : 'destructive'}
            >
              {approvalAction === 'approve' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Community
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Community
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCommunitiesPage;
