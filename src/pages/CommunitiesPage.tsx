import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  tags: string[];
  isJoined: boolean;
  isModerator: boolean;
}

const CommunitiesPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPageOptions = [12, 24, 36, 48];
  const [communitiesPerPage, setCommunitiesPerPage] = useState(
    perPageOptions[0]
  );

  // Mock data - in a real app, this would come from an API
  const [allCommunities, setAllCommunities] = useState<Community[]>([
    {
      id: "1",
      name: "Photography Enthusiasts",
      description:
        "A place for photographers to share their work and discuss techniques",
      memberCount: 1250,
      tags: ["Photography", "Art", "Camera"],
      isJoined: true,
      isModerator: true,
    },
    {
      id: "2",
      name: "Tech Innovators",
      description: "Discussing the latest in technology and innovation",
      memberCount: 890,
      tags: ["Technology", "Innovation", "Startups"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "3",
      name: "Cooking Adventures",
      description: "Share recipes, cooking tips, and culinary experiences",
      memberCount: 2100,
      tags: ["Cooking", "Recipes", "Food"],
      isJoined: true,
      isModerator: false,
    },
    {
      id: "4",
      name: "Travel Stories",
      description: "Share your travel experiences and get recommendations",
      memberCount: 756,
      tags: ["Travel", "Adventure", "Culture"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "5",
      name: "Fitness & Health",
      description: "Tips, motivation, and discussions about fitness and health",
      memberCount: 1543,
      tags: ["Fitness", "Health", "Wellness"],
      isJoined: true,
      isModerator: false,
    },
    {
      id: "6",
      name: "Book Club",
      description: "Monthly book discussions and reading recommendations",
      memberCount: 432,
      tags: ["Books", "Reading", "Literature"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "7",
      name: "Gaming Hub",
      description: "Discuss games, share gameplay, and find gaming partners",
      memberCount: 2890,
      tags: ["Gaming", "Entertainment", "Community"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "8",
      name: "Art & Design",
      description: "Showcase artwork and discuss design principles",
      memberCount: 1120,
      tags: ["Art", "Design", "Creative"],
      isJoined: false,
      isModerator: false,
    },
    // Additional mocked communities for pagination
    {
      id: "9",
      name: "Music Makers",
      description:
        "A community for musicians and music lovers to collaborate and share.",
      memberCount: 980,
      tags: ["Music", "Collaboration", "Instruments"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "10",
      name: "Sustainable Living",
      description: "Discuss eco-friendly habits and sustainable lifestyles.",
      memberCount: 1340,
      tags: ["Sustainability", "Eco", "Green"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "11",
      name: "Parenting Support",
      description: "Advice and support for parents at every stage.",
      memberCount: 760,
      tags: ["Parenting", "Family", "Support"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "12",
      name: "Entrepreneurs United",
      description: "Connect with fellow entrepreneurs and share business tips.",
      memberCount: 2105,
      tags: ["Business", "Entrepreneurship", "Startups"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "13",
      name: "Pet Lovers",
      description: "Share stories, tips, and photos of your pets.",
      memberCount: 1580,
      tags: ["Pets", "Animals", "Care"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "14",
      name: "Language Exchange",
      description: "Practice and learn new languages with others.",
      memberCount: 1200,
      tags: ["Languages", "Learning", "Exchange"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "15",
      name: "Film Buffs",
      description: "Discuss movies, directors, and the art of filmmaking.",
      memberCount: 890,
      tags: ["Movies", "Film", "Discussion"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "16",
      name: "Science Explorers",
      description: "Explore the wonders of science and discovery.",
      memberCount: 1010,
      tags: ["Science", "Discovery", "Learning"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "17",
      name: "Mindfulness & Meditation",
      description: "Share mindfulness practices and meditation tips.",
      memberCount: 670,
      tags: ["Mindfulness", "Meditation", "Wellness"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "18",
      name: "Home Gardeners",
      description: "Tips and inspiration for home gardening enthusiasts.",
      memberCount: 940,
      tags: ["Gardening", "Plants", "Home"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "19",
      name: "Cycling Community",
      description: "Connect with cyclists and share your rides.",
      memberCount: 800,
      tags: ["Cycling", "Fitness", "Outdoors"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "20",
      name: "Board Game Society",
      description: "Discuss and play board games with others.",
      memberCount: 540,
      tags: ["Board Games", "Fun", "Strategy"],
      isJoined: false,
      isModerator: false,
    },
  ]);

  // Show all communities, not just joined
  const filteredCommunities = allCommunities.filter(
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

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-social-primary mb-2">
            All Communities
          </h1>
          <p className="text-social-muted">
            Communities for you to connect, share, and grow together.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end gap-2 w-full sm:w-auto">
          <CreateCommunityDialog
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Community
              </Button>
            }
          />
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-social-muted h-4 w-4" />
        <Input
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to first page when searching
          }}
          className="pl-10"
        />
      </div>

      <div
        className={`grid gap-6 mb-6 
          ${
            communitiesPerPage >= 36
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
              : communitiesPerPage >= 24
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          }
        `}
      >
        {getCurrentPageCommunities(filteredCommunities).map((community) => (
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

      {/* Pagination and per-page selector */}
      {filteredCommunities.length > communitiesPerPage ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-2">
          <div className="flex-1 flex justify-center">
            <Pagination>
              <PaginationContent className="flex flex-wrap gap-1 justify-center">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                    aria-label="Previous page"
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
                      className={`cursor-pointer ${
                        currentPage === page
                          ? "bg-accent text-primary font-bold"
                          : ""
                      }`}
                      aria-label={`Go to page ${page}`}
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
                    aria-label="Next page"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <label htmlFor="perPage" className="text-sm text-social-muted">
              Per page:
            </label>
            <Select
              value={String(communitiesPerPage)}
              onValueChange={(val) => {
                setCommunitiesPerPage(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger id="perPage" className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {perPageOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <div className="flex justify-end mt-2">
          <div className="flex items-center gap-2">
            <label htmlFor="perPage" className="text-sm text-social-muted">
              Per page:
            </label>
            <Select
              value={String(communitiesPerPage)}
              onValueChange={(val) => {
                setCommunitiesPerPage(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger id="perPage" className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {perPageOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunitiesPage;
