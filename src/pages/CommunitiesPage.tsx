import { useState } from "react";
import { Search, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateCommunityDialog from "@/components/community/CreateCommunityDialog";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const communitiesPerPage = 6;

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
  ]);

  const filteredCommunities = allCommunities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const joinedCommunities = allCommunities.filter(
    (community) => community.isJoined
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

  const handleCreateCommunity = (communityData: any) => {
    // In a real app, this would make an API call
    console.log("Creating community:", communityData);
    toast({
      title: "Community created!",
      description: "Your new community has been created successfully.",
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-social-primary mb-2">
            Communities
          </h1>
          <p className="text-social-muted">
            Discover and join communities that match your interests
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

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Communities</TabsTrigger>
          <TabsTrigger value="joined">My Communities</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {getCurrentPageCommunities(filteredCommunities).map((community) => (
              <Card
                key={community.id}
                className="hover-scale text-left transition-shadow hover:shadow-xl hover:bg-accent/60 hover:border-accent h-full"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        <Link
                          to={`/community/${community.id}`}
                          className="hover:text-social-primary transition-colors"
                        >
                          {community.name}
                        </Link>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {community.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-social-muted mb-4">
                    <Users className="h-4 w-4 mr-1" />
                    {community.memberCount.toLocaleString()} members
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {community.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleJoinCommunity(community.id)}
                      variant={community.isJoined ? "outline" : "default"}
                      className="flex-1"
                    >
                      {community.isJoined ? "Leave" : "Join"}
                    </Button>
                    {community.isModerator && (
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/moderate">Moderate</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
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
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
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
        </TabsContent>

        <TabsContent value="joined" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedCommunities.map((community) => (
              <Card
                key={community.id}
                className="hover-scale text-left transition-shadow hover:shadow-xl hover:bg-accent/60 hover:border-accent h-full"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        <Link
                          to={`/community/${community.id}`}
                          className="hover:text-social-primary transition-colors"
                        >
                          {community.name}
                        </Link>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {community.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-social-muted mb-4">
                    <Users className="h-4 w-4 mr-1" />
                    {community.memberCount.toLocaleString()} members
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {community.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleJoinCommunity(community.id)}
                      variant={community.isJoined ? "outline" : "default"}
                      className="flex-1"
                    >
                      {community.isJoined ? "Leave" : "Join"}
                    </Button>
                    {community.isModerator && (
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/moderate">Moderate</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {joinedCommunities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-social-muted">
                You haven't joined any communities yet.
              </p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Community
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunitiesPage;
