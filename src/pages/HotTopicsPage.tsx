import { useState, useEffect } from "react";
import { Search, TrendingUp, Users, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import CommunityCard from "@/components/community/CommunityCard";
import InfoCard from "@/components/ui/InfoCard";
import UserProfileLink from "@/components/user/UserProfileLink";
import { api } from "@/lib/api";

interface TrendingPostUI {
  id: string;
  title: string;
  author: string;
  community: string;
  communityId: string;
  likes: number;
  replies: number;
  createdAt: Date;
  excerpt: string;
}
interface TrendingCommunityUI {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  growthRate: number;
  category: string;
}

const HotTopicsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingPosts, setTrendingPosts] = useState<TrendingPostUI[]>([]);
  const [trendingCommunities, setTrendingCommunities] = useState<
    TrendingCommunityUI[]
  >([]);

  useEffect(() => {
    Promise.all([api.getHotPosts(), api.getCommunities()]).then(
      ([posts, communities]) => {
        // Build a set of valid community IDs
        const validCommunityIds = new Set(communities.map((c) => c.slug));
        setTrendingCommunities(
          communities.map((c) => ({
            id: c.slug,
            name: c.name,
            description: c.description,
            memberCount: c.memberCount,
            growthRate: Math.round(Math.random() * 20 * 10) / 10,
            category: c.category,
          }))
        );
        setTrendingPosts(
          posts
            .filter((p) => validCommunityIds.has(p.communityId))
            .map((p) => ({
              id: p.id,
              title: p.title,
              author: p.author,
              community: p.communityName,
              communityId: p.communityId,
              likes: p.likes,
              replies: p.replies,
              createdAt: p.createdAt,
              excerpt:
                p.content.slice(0, 120) + (p.content.length > 120 ? "..." : ""),
            }))
        );
      }
    );
  }, []);

  const filteredPosts = trendingPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.community.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCommunities = trendingCommunities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-social-primary mb-2">
          Hot Topics
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Explore trending content and growing communities
        </p>
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
              placeholder="Search trending posts and communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-2 py-3 border-0 bg-transparent focus:ring-0 focus:outline-none shadow-none min-w-0 flex-1"
              style={{ boxShadow: "none" }}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending Posts
          </TabsTrigger>
          <TabsTrigger value="communities">
            <Users className="h-4 w-4 mr-2" />
            Growing Communities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <InfoCard
                key={post.id}
                title={
                  <Link
                    to={`/community/${post.communityId}/post/${post.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                }
                description={post.excerpt}
                headerRight={
                  <div className="flex flex-col items-end gap-2 min-w-[60px]">
                    <div className="flex items-center gap-1 text-xs">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                      <span>{post.replies}</span>
                    </div>
                  </div>
                }
                contentTop={
                  <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-2">
                    <span className="break-words">
                      by{" "}
                      <UserProfileLink
                        userId={`user-${post.author
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        userName={post.author}
                        currentUserId={"current-user-id"}
                      />{" "}
                      • in {post.community} •{" "}
                      {post.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                }
                actions={
                  <Link
                    to={`/community/${post.communityId}/post/${post.id}`}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      className="w-full text-xs sm:text-sm"
                    >
                      <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Read More
                    </Button>
                  </Link>
                }
              />
            ))}
          </div>
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No trending posts found matching your search.
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="communities" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                description={community.description}
                memberCount={community.memberCount}
                growthRate={community.growthRate}
                category={community.category}
              />
            ))}
          </div>
          {filteredCommunities.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No growing communities found matching your search.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HotTopicsPage;
