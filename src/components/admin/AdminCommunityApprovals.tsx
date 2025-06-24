import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Check, X, Shield, Eye } from "lucide-react";
import { logAdminAction } from "@/lib/admin-logger";
import CommunityDetailsDialog from "./CommunityDetailsDialog";
import CommunityApprovalDialog from "./CommunityApprovalDialog";
import CommunityRejectionDialog from "./CommunityRejectionDialog";

interface PendingCommunity {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdBy: string;
  requestedAt: Date;
}

const AdminCommunityApprovals = () => {
  const { toast } = useToast();
  const [selectedCommunity, setSelectedCommunity] =
    useState<PendingCommunity | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);

  const [pendingCommunities, setPendingCommunities] = useState<
    PendingCommunity[]
  >([
    {
      id: "comm-1",
      name: "Travel Photography Group",
      description:
        "A community for sharing travel photography tips, destinations, and gear recommendations.",
      tags: ["Travel", "Photography", "Adventure"],
      createdBy: "SarahT",
      requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    },
    {
      id: "comm-2",
      name: "Machine Learning Enthusiasts",
      description:
        "Discuss ML algorithms, share projects, and learn from each other's experiences in AI and machine learning.",
      tags: ["AI", "Machine Learning", "Technology", "Data Science"],
      createdBy: "AIFanatic",
      requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    },
    {
      id: "comm-3",
      name: "Vegan Recipe Sharing",
      description:
        "Share your favorite vegan recipes, cooking tips, and restaurant recommendations.",
      tags: ["Vegan", "Food", "Recipes", "Cooking"],
      createdBy: "VeganChef",
      requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
  ]);

  const handleViewDetails = (community: PendingCommunity) => {
    setSelectedCommunity(community);
    setDetailsDialogOpen(true);
  };

  const handleApprove = (
    id: string,
    updatedCommunity: { name: string; description: string }
  ) => {
    const community = pendingCommunities.find((c) => c.id === id);
    if (community) {
      setPendingCommunities(pendingCommunities.filter((c) => c.id !== id));

      toast({
        title: "Community Approved",
        description: `${updatedCommunity.name} has been approved and is now live.`,
      });

      logAdminAction({
        action: "community_approved",
        details: `Approved community: ${updatedCommunity.name}${
          updatedCommunity.name !== community.name
            ? ` (renamed from ${community.name})`
            : ""
        }`,
        targetId: community.id,
        targetType: "community",
      });
    }
  };

  const handleReject = (id: string, feedback: string) => {
    const community = pendingCommunities.find((c) => c.id === id);
    if (community) {
      setPendingCommunities(pendingCommunities.filter((c) => c.id !== id));

      toast({
        title: "Community Rejected",
        description: `${community.name} request has been rejected with feedback.`,
      });

      logAdminAction({
        action: "community_rejected",
        details: `Rejected community: ${community.name}. Feedback: ${feedback}`,
        targetId: community.id,
        targetType: "community",
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Pending Community Approvals
          </h2>
          <Badge variant="outline" className="bg-social-accent/50">
            {pendingCommunities.length} Pending
          </Badge>
        </div>

        {pendingCommunities.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-social-muted">
                No pending community approvals
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingCommunities.map((community) => (
              <Card key={community.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <CardTitle>{community.name}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-social-background">
                        Requested{" "}
                        {new Date(community.requestedAt).toLocaleDateString()}
                      </Badge>
                      <Badge variant="outline" className="bg-social-background">
                        By {community.createdBy}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <p>{community.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {community.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-social-accent/50"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-end mt-4">
                    <Button
                      variant="outline"
                      onClick={() => handleViewDetails(community)}
                    >
                      <Eye className="h-4 w-4 mr-2" /> View Details
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-400 text-red-500 hover:bg-red-50"
                      onClick={() => {
                        setSelectedCommunity(community);
                        setRejectionDialogOpen(true);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" /> Reject
                    </Button>
                    <Button
                      variant="default"
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => {
                        setSelectedCommunity(community);
                        setApprovalDialogOpen(true);
                      }}
                    >
                      <Check className="h-4 w-4 mr-2" /> Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
        community={selectedCommunity}
        onApprove={handleApprove}
      />

      <CommunityRejectionDialog
        isOpen={rejectionDialogOpen}
        onClose={() => setRejectionDialogOpen(false)}
        community={selectedCommunity}
        onReject={handleReject}
      />
    </>
  );
};

export default AdminCommunityApprovals;
