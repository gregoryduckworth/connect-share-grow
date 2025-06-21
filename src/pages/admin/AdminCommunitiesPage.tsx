
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Check, X, Search, Users, MessageSquare } from "lucide-react";
import { logAdminAction } from "@/lib/admin-logger";
import CommunityDetailsDialog from "@/components/admin/CommunityDetailsDialog";

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  postCount: number;
  createdAt: Date;
  createdBy: string;
  moderators: string[];
  status: "active" | "pending" | "suspended";
  category: string;
  rules: string[];
}

interface PendingCommunity {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: string;
  category: string;
  rules: string[];
  status: "pending";
  tags: string[];
  requestedAt: Date;
}

const AdminCommunitiesPage = () => {
  const { toast } = useToast();
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock data for communities
  const [communities, setCommunities] = useState<Community[]>([
    {
      id: "comm-1",
      name: "Photography Enthusiasts",
      description: "A community for sharing photography tips, techniques, and showcasing work",
      memberCount: 1247,
      postCount: 3891,
      createdAt: new Date(2024, 0, 15),
      createdBy: "user-123",
      moderators: ["mod-1", "mod-2"],
      status: "active",
      category: "Photography",
      rules: ["Be respectful", "No spam", "Keep posts relevant to photography"]
    },
    {
      id: "comm-2", 
      name: "Cooking Adventures",
      description: "Share recipes, cooking tips, and culinary experiences",
      memberCount: 892,
      postCount: 2156,
      createdAt: new Date(2024, 1, 3),
      createdBy: "user-456",
      moderators: ["mod-3"],
      status: "active",
      category: "Food & Cooking",
      rules: ["Share original recipes", "No duplicate posts", "Be constructive with feedback"]
    }
  ]);

  // Mock pending communities
  const [pendingCommunities, setPendingCommunities] = useState<PendingCommunity[]>([
    {
      id: "pending-1",
      name: "Tech Discussions",
      description: "A place to discuss the latest in technology and innovation",
      createdAt: new Date(2024, 5, 18),
      createdBy: "user-101",
      category: "Technology",
      rules: ["Stay on topic", "Cite sources when making claims", "No self-promotion"],
      status: "pending",
      tags: ["Technology", "Innovation"],
      requestedAt: new Date(2024, 5, 18)
    },
    {
      id: "pending-2", 
      name: "Book Club Online",
      description: "Monthly book discussions and reading recommendations",
      createdAt: new Date(2024, 5, 19),
      createdBy: "user-202",
      category: "Literature",
      rules: ["No spoilers in titles", "Use spoiler tags", "Monthly reading schedule"],
      status: "pending",
      tags: ["Books", "Literature"],
      requestedAt: new Date(2024, 5, 19)
    }
  ]);

  const handleViewCommunity = (community: Community) => {
    setSelectedCommunity(community);
    setDetailsDialogOpen(true);
  };

  const handleApproveCommunity = (id: string) => {
    const pendingCommunity = pendingCommunities.find(c => c.id === id);
    if (pendingCommunity) {
      // Convert pending community to active community
      const newCommunity: Community = {
        ...pendingCommunity,
        memberCount: 1,
        postCount: 0,
        moderators: [pendingCommunity.createdBy],
        status: "active"
      };
      
      setCommunities([...communities, newCommunity]);
      setPendingCommunities(pendingCommunities.filter(c => c.id !== id));
      
      toast({
        title: "Community Approved",
        description: `${pendingCommunity.name} has been approved and is now active.`,
      });
      
      logAdminAction({
        action: "community_approved",
        details: `Approved community: ${pendingCommunity.name}`,
        targetId: id,
        targetType: "community"
      });
    }
  };

  const handleRejectCommunity = (id: string) => {
    const pendingCommunity = pendingCommunities.find(c => c.id === id);
    if (pendingCommunity) {
      setPendingCommunities(pendingCommunities.filter(c => c.id !== id));
      
      toast({
        title: "Community Rejected",
        description: `${pendingCommunity.name} has been rejected.`,
        variant: "destructive",
      });
      
      logAdminAction({
        action: "community_rejected", 
        details: `Rejected community: ${pendingCommunity.name}`,
        targetId: id,
        targetType: "community"
      });
    }
  };

  // Filter and paginate communities
  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCommunities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCommunities = filteredCommunities.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">Manage Communities</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-social-accent/50">
              {communities.length} Active
            </Badge>
            <Badge variant="outline" className="bg-orange-100 text-orange-800">
              {pendingCommunities.length} Pending
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Pending Communities */}
        {pendingCommunities.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-orange-600">Pending Approval</h3>
            {pendingCommunities.map((community) => (
              <Card key={community.id} className="border-orange-200">
                <CardHeader className="bg-orange-50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {community.name}
                    </CardTitle>
                    <Badge className="bg-orange-500 text-white">
                      Pending Approval
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 mb-4">{community.description}</p>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="text-sm text-gray-500">
                      Created {community.createdAt.toLocaleDateString()} by {community.createdBy}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        className="border-red-400 text-red-500 hover:bg-red-50"
                        onClick={() => handleRejectCommunity(community.id)}
                      >
                        <X className="h-4 w-4 mr-2" /> Reject
                      </Button>
                      <Button 
                        variant="default"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => handleApproveCommunity(community.id)}
                      >
                        <Check className="h-4 w-4 mr-2" /> Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Active Communities */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Active Communities</h3>
          
          {paginatedCommunities.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-social-muted">No communities found</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {paginatedCommunities.map((community) => (
                <Card key={community.id}>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {community.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-social-background">
                          {community.memberCount} members
                        </Badge>
                        <Badge variant="outline" className="bg-social-background">
                          {community.postCount} posts
                        </Badge>
                        <Badge className={
                          community.status === "active" ? "bg-green-500" :
                          community.status === "suspended" ? "bg-red-500" : "bg-orange-500"
                        }>
                          {community.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{community.description}</p>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="text-sm text-gray-500">
                        Created {community.createdAt.toLocaleDateString()} • {community.moderators.length} moderators
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => handleViewCommunity(community)}
                      >
                        <Eye className="h-4 w-4 mr-2" /> View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Simple pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <CommunityDetailsDialog
        isOpen={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        community={selectedCommunity}
      />
    </>
  );
};

export default AdminCommunitiesPage;
