import { useState, useEffect } from "react";
import AdminTable from "@/components/admin/AdminTable";
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
import { api } from "@/lib/api";

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

  // Centralized community mocks from api.ts
  const [communities, setCommunities] = useState<Community[]>([]);
  const [pendingCommunities, setPendingCommunities] = useState<
    PendingCommunity[]
  >([]);

  // Load mock data from api.ts
  useEffect(() => {
    api.getAdminCommunities().then(setCommunities);
    api.getPendingCommunities().then(setPendingCommunities);
  }, []);

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

  // Columns for pending communities
  const pendingColumns = [
    {
      header: "Community",
      accessor: (community: PendingCommunity) => (
        <div>
          <p className="font-semibold text-lg text-foreground group-hover:text-purple-700 transition-colors">
            {community.name}
          </p>
          <p className="text-sm text-social-muted">{community.description}</p>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: (community: PendingCommunity) => (
        <Badge
          variant="outline"
          className="bg-purple-100 text-purple-700 border-purple-200 group-hover:bg-purple-200"
        >
          {community.category}
        </Badge>
      ),
    },
    {
      header: "Requested",
      accessor: (community: PendingCommunity) =>
        community.requestedAt.toLocaleDateString(),
    },
    {
      header: "Actions",
      accessor: (community: PendingCommunity) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="default"
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
              setApprovalCommunity({ ...community });
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
      ),
      className: "text-right",
    },
  ];

  // Columns for all communities
  const allColumns = [
    {
      header: "Community",
      accessor: (community: Community) => (
        <div>
          <p className="font-semibold text-lg text-foreground group-hover:text-purple-700 transition-colors">
            {community.name}
          </p>
          <p className="text-sm text-social-muted">{community.description}</p>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: (community: Community) => (
        <Badge
          variant="outline"
          className="bg-purple-100 text-purple-700 border-purple-200 group-hover:bg-purple-200"
        >
          {community.category}
        </Badge>
      ),
    },
    {
      header: "Members",
      accessor: (community: Community) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-purple-400" />
          <span className="font-semibold">
            {community.memberCount.toLocaleString()}
          </span>
        </div>
      ),
      className: "hidden md:table-cell",
    },
    {
      header: "Posts",
      accessor: (community: Community) => (
        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4 text-blue-400" />
          <span className="font-semibold">{community.postCount}</span>
        </div>
      ),
      className: "hidden md:table-cell",
    },
    {
      header: "Status",
      accessor: (community: Community) => (
        <Badge
          className={
            community.status === "active"
              ? "bg-green-500 text-white"
              : community.status === "suspended"
              ? "bg-red-500 text-white"
              : "bg-orange-500 text-white"
          }
        >
          {community.status}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: (community: Community) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="default"
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
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-social-primary mb-2">
          Manage Communities
        </h1>
        <div className="relative w-full sm:w-64">
          <div
            className="absolute inset-0 pointer-events-none rounded-lg border border-purple-200 bg-gradient-to-r from-purple-100/40 to-blue-100/20"
            style={{ zIndex: 0 }}
          />
          <div className="flex items-center gap-2 relative z-10 p-1 rounded-lg bg-white/90 border border-purple-200 w-full focus-within:border-purple-500 focus-within:shadow-lg focus-within:shadow-purple-200/40 transition-colors">
            <Search className="ml-3 text-social-primary h-5 w-5" />
            <Input
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-2 py-3 border-0 bg-transparent focus:ring-0 focus:outline-none shadow-none min-w-0 flex-1"
              style={{ boxShadow: "none" }}
              type="text"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      {pendingCommunities.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-social-primary">
            Pending Community Approvals
          </h3>
          <AdminTable
            columns={pendingColumns}
            data={pendingCommunities}
            emptyMessage={
              <div className="text-center p-8 text-social-muted">
                No pending communities.
              </div>
            }
          />
        </div>
      )}

      {/* All Communities */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-social-primary">
          All Communities
        </h3>
        <AdminTable
          columns={allColumns}
          data={paginatedCommunities}
          emptyMessage={
            <div className="text-center p-8 text-social-muted">
              No communities found matching your search.
            </div>
          }
        />
      </div>
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
