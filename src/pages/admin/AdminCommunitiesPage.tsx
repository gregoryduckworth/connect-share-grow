import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Search, Users, MessageSquare, Check, X } from "lucide-react";
import { logAdminAction } from "@/lib/admin-logger";
import CommunityDetailsDialog from "@/components/admin/CommunityDetailsDialog";
import AdminTablePagination from "@/components/admin/AdminTablePagination";
import CommunityApprovalDialog from "@/components/admin/CommunityApprovalDialog";
import CommunityRejectionDialog from "@/components/admin/CommunityRejectionDialog";
import CommunitySuspendDialog from "@/components/admin/CommunitySuspendDialog";
import CommunityActivateDialog from "@/components/admin/CommunityActivateDialog";

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  postCount: number;
  category: string;
  createdAt: Date;
  status: "active" | "suspended" | "pending";
  moderators: string[];
  tags: string[];
  createdBy: string;
  requestedAt: Date;
}

interface PendingCommunity {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdBy: string;
  requestedAt: Date;
  memberCount: number;
  postCount: number;
  category: string;
  status: "pending";
  moderators: string[];
  createdAt: Date;
}

const AdminCommunitiesPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCommunity, setSelectedCommunity] = useState<
    Community | PendingCommunity | null
  >(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [approvalCommunity, setApprovalCommunity] =
    useState<PendingCommunity | null>(null);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionCommunity, setRejectionCommunity] =
    useState<PendingCommunity | null>(null);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [suspendCommunity, setSuspendCommunity] = useState<Community | null>(
    null
  );
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [activateCommunity, setActivateCommunity] = useState<Community | null>(
    null
  );

  const [communities, setCommunities] = useState<Community[]>([
    {
      id: "comm-1",
      name: "Photography Enthusiasts",
      description: "A place for photographers to share their work",
      memberCount: 1250,
      postCount: 423,
      category: "Art & Design",
      createdAt: new Date(2023, 0, 15),
      status: "active",
      moderators: ["Sarah Johnson", "Mike Chen"],
      tags: ["Photography", "Art", "Camera"],
      createdBy: "admin",
      requestedAt: new Date(2023, 0, 15),
    },
    {
      id: "comm-2",
      name: "Web Development",
      description: "Modern web development practices",
      memberCount: 2100,
      postCount: 867,
      category: "Technology",
      createdAt: new Date(2023, 1, 20),
      status: "active",
      moderators: ["Alex Rivera"],
      tags: ["JavaScript", "React", "Node.js"],
      createdBy: "admin",
      requestedAt: new Date(2023, 1, 20),
    },
    {
      id: "comm-3",
      name: "Cooking Club",
      description: "Share recipes and cooking tips",
      memberCount: 890,
      postCount: 234,
      category: "Food & Drink",
      createdAt: new Date(2023, 2, 10),
      status: "suspended",
      moderators: ["Emma Davis"],
      tags: ["Cooking", "Recipes", "Food"],
      createdBy: "admin",
      requestedAt: new Date(2023, 2, 10),
    },
  ]);

  const [pendingCommunities, setPendingCommunities] = useState<
    PendingCommunity[]
  >([
    {
      id: "pending-1",
      name: "Cryptocurrency Trading",
      description: "Discussion about crypto trading strategies",
      memberCount: 0,
      postCount: 0,
      category: "Finance",
      createdAt: new Date(2024, 5, 15),
      status: "pending",
      moderators: [],
      tags: ["Crypto", "Trading", "Investment"],
      createdBy: "John Trader",
      requestedAt: new Date(2024, 5, 15),
    },
  ]);

  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCommunities.length / pageSize);
  const paginatedCommunities = filteredCommunities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSuspendCommunity = (id: string, reason: string) => {
    const community = communities.find((c) => c.id === id);
    if (community) {
      setCommunities(
        communities.map((c) =>
          c.id === id ? { ...c, status: "suspended" as const } : c
        )
      );
      toast({
        title: "Community Suspended",
        description: `${community.name} has been suspended.\nReason: ${reason}`,
      });
      // Notify all moderators
      if (community.moderators && community.moderators.length > 0) {
        community.moderators.forEach((mod) => {
          toast({
            title: `Moderators Notified: ${mod}`,
            description: `The community "${community.name}" was suspended. Reason: ${reason}`,
          });
        });
      }
      logAdminAction({
        action: "community_suspended",
        details: `Suspended community: ${community.name}. Reason: ${reason}`,
        targetId: community.id,
        targetType: "community",
      });
    }
  };

  const handleActivateCommunity = (id: string, message: string) => {
    const community = communities.find((c) => c.id === id);
    if (community) {
      setCommunities(
        communities.map((c) =>
          c.id === id ? { ...c, status: "active" as const } : c
        )
      );
      toast({
        title: "Community Activated",
        description: `${community.name} has been activated.\nMessage: ${message}`,
      });
      // Notify all moderators
      if (community.moderators && community.moderators.length > 0) {
        community.moderators.forEach((mod) => {
          toast({
            title: `Moderator Notified: ${mod}`,
            description: `The community "${community.name}" was activated. Message: ${message}`,
          });
        });
      }
      logAdminAction({
        action: "community_activated",
        details: `Activated community: ${community.name}. Message: ${message}`,
        targetId: community.id,
        targetType: "community",
      });
    }
  };

  const handleApproveCommunity = (
    id: string,
    updated: { name: string; description: string; adminMessage?: string }
  ) => {
    const pendingCommunity = pendingCommunities.find((c) => c.id === id);
    if (pendingCommunity) {
      const newCommunity: Community = {
        id: pendingCommunity.id,
        name: updated.name,
        description: updated.description,
        memberCount: 1,
        postCount: 0,
        category: pendingCommunity.category,
        createdAt: new Date(),
        status: "active",
        moderators: [],
        tags: pendingCommunity.tags,
        createdBy: pendingCommunity.createdBy,
        requestedAt: pendingCommunity.requestedAt,
      };
      setCommunities([...communities, newCommunity]);
      setPendingCommunities(pendingCommunities.filter((c) => c.id !== id));
      toast({
        title: "Community Approved",
        description:
          `${updated.name} has been approved and is now active.` +
          (updated.adminMessage ? `\nMessage: ${updated.adminMessage}` : ""),
      });
      logAdminAction({
        action: "community_approved",
        details:
          `Approved community: ${updated.name}` +
          (updated.name !== pendingCommunity.name
            ? ` (renamed from ${pendingCommunity.name})`
            : "") +
          (updated.adminMessage ? ` | Message: ${updated.adminMessage}` : ""),
        targetId: pendingCommunity.id,
        targetType: "community",
      });
    }
  };

  const handleRejectCommunity = (id: string, feedback: string) => {
    const pendingCommunity = pendingCommunities.find((c) => c.id === id);
    if (pendingCommunity) {
      setPendingCommunities(pendingCommunities.filter((c) => c.id !== id));
      toast({
        title: "Community Rejected",
        description: `${pendingCommunity.name} has been rejected.\nReason: ${feedback}`,
      });
      logAdminAction({
        action: "community_rejected",
        details: `Rejected community: ${pendingCommunity.name}. Feedback: ${feedback}`,
        targetId: pendingCommunity.id,
        targetType: "community",
      });
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-social-primary mb-2">
          Manage Communities
        </h1>
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

      {/* Pending Approvals */}
      {pendingCommunities.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Pending Community Approvals</h3>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Community</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingCommunities.map((community) => (
                  <TableRow key={community.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{community.name}</p>
                        <p className="text-sm text-gray-500">
                          {community.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{community.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {community.requestedAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCommunity(community);
                            setDetailsDialogOpen(true);
                          }}
                        >
                          View Details
                        </Button>

                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => {
                            setApprovalCommunity({ ...community }); // ensures latest data is passed
                            setApprovalDialogOpen(true);
                          }}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setRejectionCommunity(community);
                            setRejectionDialogOpen(true);
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* All Communities */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Community</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">Members</TableHead>
              <TableHead className="hidden md:table-cell">Posts</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCommunities.map((community) => (
              <TableRow key={community.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{community.name}</p>
                    <p className="text-sm text-gray-500">
                      {community.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{community.category}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {community.memberCount.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {community.postCount}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      community.status === "active"
                        ? "bg-green-500"
                        : community.status === "suspended"
                        ? "bg-red-500"
                        : "bg-orange-500"
                    }
                  >
                    {community.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCommunity(community);
                        setDetailsDialogOpen(true);
                      }}
                    >
                      View Details
                    </Button>

                    {community.status === "active" ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSuspendCommunity(community);
                          setSuspendDialogOpen(true);
                        }}
                      >
                        Suspend
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => {
                          setActivateCommunity(community);
                          setActivateDialogOpen(true);
                        }}
                      >
                        Activate
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {paginatedCommunities.length === 0 && (
          <div className="text-center p-8">
            <p className="text-social-muted">
              No communities found matching your search.
            </p>
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
      </div>

      <CommunityDetailsDialog
        isOpen={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        community={selectedCommunity}
      />

      <CommunityApprovalDialog
        isOpen={approvalDialogOpen}
        onClose={() => setApprovalDialogOpen(false)}
        community={approvalCommunity}
        onApprove={handleApproveCommunity}
      />

      <CommunityRejectionDialog
        isOpen={rejectionDialogOpen}
        onClose={() => setRejectionDialogOpen(false)}
        community={rejectionCommunity}
        onReject={handleRejectCommunity}
      />

      <CommunitySuspendDialog
        isOpen={suspendDialogOpen}
        onClose={() => setSuspendDialogOpen(false)}
        community={suspendCommunity}
        onSuspend={handleSuspendCommunity}
      />

      <CommunityActivateDialog
        isOpen={activateDialogOpen}
        onClose={() => setActivateDialogOpen(false)}
        community={activateCommunity}
        onActivate={handleActivateCommunity}
      />
    </div>
  );
};

export default AdminCommunitiesPage;
