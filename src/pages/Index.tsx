import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateCommunityDialog from "@/components/community/CreateCommunityDialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import CommunityCard from "@/components/community/CommunityCard";
import { mockPendingModeratorRoleChanges } from "@/lib/api";
import type { Report } from "@/lib/types";
import { api } from "@/lib/api";

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  tags: string[];
  isJoined: boolean;
  isModerator: boolean;
}

// Define the type for pending moderator role changes
interface PendingModeratorRoleChange {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    joinDate: Date;
    role: string;
    status: string;
    communities: string[];
  };
  requestedBy: string;
  requestedAt: Date;
  newRole: string;
  communityName: string;
  status: string;
}

const CommunitiesPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const communitiesPerPage = 6;

  // Mock data - in a real app, this would come from an API
  const [allCommunities, setAllCommunities] = useState<Community[]>([
    {
      id: "photography",
      name: "Photography Enthusiasts",
      description:
        "A place for photographers to share their work and discuss techniques",
      memberCount: 1250,
      tags: ["Photography", "Art", "Camera"],
      isJoined: true,
      isModerator: true,
    },
    {
      id: "tech-innovators",
      name: "Tech Innovators",
      description: "Discussing the latest in technology and innovation",
      memberCount: 890,
      tags: ["Technology", "Innovation", "Startups"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "cooking-adventures",
      name: "Cooking Adventures",
      description: "Share recipes, cooking tips, and culinary experiences",
      memberCount: 2100,
      tags: ["Cooking", "Recipes", "Food"],
      isJoined: true,
      isModerator: false,
    },
    {
      id: "travel-stories",
      name: "Travel Stories",
      description: "Share your travel experiences and get recommendations",
      memberCount: 756,
      tags: ["Travel", "Adventure", "Culture"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "fitness-health",
      name: "Fitness & Health",
      description: "Tips, motivation, and discussions about fitness and health",
      memberCount: 1543,
      tags: ["Fitness", "Health", "Wellness"],
      isJoined: true,
      isModerator: false,
    },
    {
      id: "book-club",
      name: "Book Club",
      description: "Monthly book discussions and reading recommendations",
      memberCount: 432,
      tags: ["Books", "Reading", "Literature"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "gaming-hub",
      name: "Gaming Hub",
      description: "Discuss games, share gameplay, and find gaming partners",
      memberCount: 2890,
      tags: ["Gaming", "Entertainment", "Community"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "art-design",
      name: "Art & Design",
      description: "Showcase artwork and discuss design principles",
      memberCount: 1120,
      tags: ["Art", "Design", "Creative"],
      isJoined: false,
      isModerator: false,
    },
  ]);

  // Only show communities the user is a member of
  const myCommunities = allCommunities.filter(
    (community) => community.isJoined
  );
  const filteredCommunities = myCommunities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const getCurrentPageCommunities = (communities: Community[]) => {
    const startIndex = (currentPage - 1) * communitiesPerPage;
    const endIndex = startIndex + communitiesPerPage;
    return communities.slice(startIndex, endIndex);
  };

  const getTotalPages = (communities: Community[]) => {
    return Math.ceil(communities.length / communitiesPerPage);
  };

  const handleJoinCommunity = (communityId: string) => {
    setAllCommunities((communities) =>
      communities.map((community) =>
        community.id === communityId
          ? {
              ...community,
              isJoined: !community.isJoined,
              memberCount: community.isJoined
                ? community.memberCount - 1
                : community.memberCount + 1,
            }
          : community
      )
    );

    const community = allCommunities.find((c) => c.id === communityId);
    toast({
      title: community?.isJoined ? "Left community" : "Joined community",
      description: community?.isJoined
        ? `You have left ${community.name}`
        : `Welcome to ${community?.name}!`,
    });
  };

  const handleCreateCommunity = (communityData: Community) => {
    // In a real app, this would make an API call
    console.log("Creating community:", communityData);
    toast({
      title: "Community created!",
      description: "Your new community has been created successfully.",
    });
  };

  // Add state for moderation actions
  const [modActionCount, setModActionCount] = useState<{
    [communityName: string]: number;
  }>({});

  // Fetch moderation actions for all communities the user moderates
  useEffect(() => {
    // Only for communities the user moderates
    const moderatedCommunities = allCommunities.filter((c) => c.isModerator);
    Promise.all(
      moderatedCommunities.map((community) =>
        Promise.all([
          api.getReports(),
          Promise.resolve(mockPendingModeratorRoleChanges),
        ]).then(
          ([reports, roleChanges]: [
            Report[],
            PendingModeratorRoleChange[]
          ]) => {
            const reportCount = reports.filter(
              (r) =>
                r.communityId &&
                r.status === "pending" &&
                r.communityId === community.id
            ).length;
            const roleChangeCount = roleChanges.filter(
              (rc) =>
                rc.status === "pending" &&
                rc.communityName &&
                rc.communityName.toLowerCase().replace(/\s+/g, "") ===
                  (community.name || "").toLowerCase().replace(/\s+/g, "")
            ).length;
            return {
              name: community.name,
              count: reportCount + roleChangeCount,
            };
          }
        )
      )
    ).then((results) => {
      const counts: { [communityName: string]: number } = {};
      results.forEach((r) => {
        counts[r.name] = r.count;
      });
      setModActionCount(counts);
    });
  }, [allCommunities]);

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-social-primary mb-2">
            My Communities
          </h1>
          <p className="text-social-muted">
            Communities you belong to and moderate
          </p>
        </div>
        <CreateCommunityDialog
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </Button>
          }
        />
      </div>

      <div className="relative mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex-1 relative">
          <div
            className="absolute inset-0 pointer-events-none rounded-lg border border-purple-200 bg-gradient-to-r from-purple-100/40 to-blue-100/20"
            style={{ zIndex: 0 }}
          />
          <div className="flex items-center gap-2 relative z-10 p-1 rounded-lg bg-white/90 border border-purple-200 w-full focus-within:border-purple-500 focus-within:shadow-lg focus-within:shadow-purple-200/40 transition-colors">
            <Search className="ml-3 text-social-primary h-5 w-5" />
            <Input
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-2 py-3 border-0 bg-transparent focus:ring-0 focus:outline-none shadow-none min-w-0 flex-1"
              style={{ boxShadow: "none" }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {myCommunities.map((community) => (
          <CommunityCard
            key={community.id}
            id={community.id}
            name={community.name}
            description={community.description}
            memberCount={community.memberCount}
            tags={community.tags}
            isJoined={community.isJoined}
            isModerator={community.isModerator}
            onJoinLeave={handleJoinCommunity}
            moderateButtonBadge={
              community.isModerator && modActionCount[community.name] > 0
                ? modActionCount[community.name]
                : undefined
            }
          />
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-social-muted">
            No communities found matching your search.
          </p>
        </div>
      )}

      {filteredCommunities.length > communitiesPerPage && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from(
                { length: getTotalPages(filteredCommunities) },
                (_, i) => i + 1
              ).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(
                      Math.min(
                        getTotalPages(filteredCommunities),
                        currentPage + 1
                      )
                    )
                  }
                  className={
                    currentPage === getTotalPages(filteredCommunities)
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default CommunitiesPage;
