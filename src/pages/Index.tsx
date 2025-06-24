import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Heart, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Post } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

const Index = () => {
  const [hotPosts, setHotPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const communitiesPerPage = 6;
  const { toast } = useToast();

  // Mock data for communities (copy from CommunitiesPage)
  const [allCommunities, setAllCommunities] = useState([
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
      name: "Health and Wellness",
      description: "Sharing tips and experiences on physical and mental health",
      memberCount: 720,
      tags: ["Health", "Wellness", "Fitness"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "4",
      name: "Travel Buddies",
      description: "For those who love to travel and explore new places",
      memberCount: 980,
      tags: ["Travel", "Adventure", "Exploration"],
      isJoined: false,
      isModerator: false,
    },
    {
      id: "5",
      name: "Foodies Unite",
      description: "A community for food lovers to share and discover recipes",
      memberCount: 1100,
      tags: ["Food", "Cooking", "Recipes"],
      isJoined: true,
      isModerator: false,
    },
    {
      id: "6",
      name: "Book Club",
      description: "For readers to discuss and share their favorite books",
      memberCount: 430,
      tags: ["Books", "Reading", "Literature"],
      isJoined: false,
      isModerator: false,
    },
  ]);

  useEffect(() => {
    const fetchHotPosts = async () => {
      try {
        const posts = await api.getHotPosts();
        setHotPosts(posts);
      } catch (error) {
        console.error("Failed to fetch hot posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotPosts();
  }, []);

  const filteredCommunities = allCommunities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const getCurrentPageCommunities = (communities) => {
    const startIndex = (currentPage - 1) * communitiesPerPage;
    const endIndex = startIndex + communitiesPerPage;
    return communities.slice(startIndex, endIndex);
  };

  const getTotalPages = (communities) => {
    return Math.ceil(communities.length / communitiesPerPage);
  };

  const handleJoinCommunity = (communityId) => {
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

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-social-primary mb-2">
          Welcome to ConnectSphere
        </h1>
        <p className="text-lg text-social-secondary mb-6">
          Connect with friends and communities that share your interests
        </p>

        {/* Hot Topics Section */}
        <section className="space-y-4 pb-10 border-b-2 border-dashed border-social-primary/30 mb-10">
          <div className="flex items-center gap-2 mb-4 mt-4">
            <TrendingUp className="h-5 w-5 text-social-primary" />
            <h2 className="text-2xl font-bold text-social-primary">
              Hot Topics
            </h2>
          </div>

          {loading ? (
            <div className="text-left">Loading hot topics...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotPosts.map((post) => (
                <Card key={post.id} className="hover-scale text-left">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          <Link
                            to={`/community/${post.communityId}/post/${post.id}`}
                            className="hover:text-social-primary transition-colors"
                          >
                            {post.title}
                          </Link>
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-social-muted">
                          <span>by {post.author}</span>
                          <span>•</span>
                          <Badge variant="secondary">
                            {post.communityName}
                          </Badge>
                          <span>•</span>
                          <span>{post.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-social-muted mb-3 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-social-muted">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.replies} replies</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* All Communities Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4 mt-4">
            <Users className="h-5 w-5 text-social-primary" />
            <h2 className="text-2xl font-bold text-social-primary">
              All Communities
            </h2>
          </div>

          {/* Search Bar (already here) */}
          <div className="relative mb-6 max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-social-muted h-4 w-4" />
            <Input
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

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
              {/* Pagination logic here, copy from CommunitiesPage */}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;
