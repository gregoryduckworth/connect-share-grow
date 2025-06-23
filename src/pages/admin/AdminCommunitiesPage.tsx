import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Search, Users, MessageSquare, Check, X } from "lucide-react";
import { logAdminAction } from "@/lib/admin-logger";
import CommunityDetailsDialog from "@/components/admin/CommunityDetailsDialog";
import AdminTablePagination from "@/components/admin/AdminTablePagination";

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
  const [selectedCommunity, setSelectedCommunity] = useState<Community | PendingCommunity | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

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
      requestedAt: new Date(2023, 0, 15)
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
      requestedAt: new Date(2023, 1, 20)
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
      requestedAt: new Date(2023, 2, 10)
    }
  ]);

  const [pendingCommunities, setPendingCommunities] = useState<PendingCommunity[]>([
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
      requestedAt: new Date(2024, 5, 15)
    }
  ]);

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCommunities.length / pageSize);
  const paginatedCommunities = filteredCommunities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSuspendCommunity = (id: string) => {
    const community = communities.find(c => c.id === id);
    if (community) {
      setCommunities(communities.map(c =>
        c.id === id ? { ...c, status: "suspended" as const } : c
      ));

      toast({
        title: "Community Suspended",
        description: `${community.name} has been suspended.`,
        variant: "destructive",
      });

      logAdminAction({
        action: "community_suspended",
        details: `Suspended community: ${community.name}`,
        targetId: community.id,
        targetType: "community"
      });
    }
  };

  const handleActivateCommunity = (id: string) => {
    const community = communities.find(c => c.id === id);
    if (community) {
      setCommunities(communities.map(c =>
        c.id === id ? { ...c, status: "active" as const } : c
      ));

      toast({
        title: "Community Activated",
        description: `${community.name} has been activated.`,
      });

      logAdminAction({
        action: "community_activated",
        details: `Activated community: ${community.name}`,
        targetId: community.id,
        targetType: "community"
      });
    }
  };

  const handleApproveCommunity = (id: string) => {
    const pendingCommunity = pendingCommunities.find(c => c.id === id);
    if (pendingCommunity) {
      const newCommunity: Community = {
        id: pendingCommunity.id,
        name: pendingCommunity.name,
        description: pendingCommunity.description,
        memberCount: 1,
        postCount: 0,
        category: pendingCommunity.category,
        createdAt: new Date(),
        status: "active",
        moderators: [],
        tags: pendingCommunity.tags,
        createdBy: pendingCommunity.createdBy,
        requestedAt: pendingCommunity.requestedAt
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
        targetId: pendingCommunity.id,
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
        targetId: pendingCommunity.id,
        targetType: "community"
      });
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
                        <p className="text-sm text-gray-500">{community.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{community.category}</Badge>
                    </TableCell>
                    <TableCell>{community.requestedAt.toLocaleDateString()}</TableCell>
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
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" className="bg-green-500 hover:bg-green-600">
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Approve Community</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to approve "{community.name}"? This will make it publicly available.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleApproveCommunity(community.id)}>
                                Approve
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject Community</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to reject "{community.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRejectCommunity(community.id)}>
                                Reject
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
                    <p className="text-sm text-gray-500">{community.description}</p>
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
                  <Badge className={
                    community.status === "active" ? "bg-green-500" :
                    community.status === "suspended" ? "bg-red-500" :
                    "bg-orange-500"
                  }>
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            Suspend
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Suspend Community</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to suspend "{community.name}"? Members won't be able to post or interact.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleSuspendCommunity(community.id)}>
                              Suspend
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" className="bg-green-500 hover:bg-green-600">
                            Activate
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Activate Community</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to activate "{community.name}"? This will restore full functionality.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleActivateCommunity(community.id)}>
                              Activate
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
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
      </div>

      <CommunityDetailsDialog
        isOpen={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        community={selectedCommunity}
      />
    </div>
  );
};

export default AdminCommunitiesPage;
