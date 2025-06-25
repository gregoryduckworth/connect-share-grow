import { useState } from "react";
import {
  Search,
  TrendingUp,
  Users,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import CommunityCard from "@/components/community/CommunityCard";

interface TrendingPost {
  id: string;
  title: string;
  author: string;
  community: string;
  likes: number;
  replies: number;
  createdAt: Date;
  excerpt: string;
}

interface TrendingCommunity {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  growthRate: number;
  category: string;
}

const DiscoverPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const trendingPosts: TrendingPost[] = [
    {
      id: "1",
      title: "The Future of Remote Work in Tech",
      author: "Sarah Chen",
      community: "Tech Innovators",
      likes: 234,
      replies: 67,
      createdAt: new Date(2024, 5, 20),
      excerpt:
        "As we move forward, remote work is becoming the norm rather than the exception. Here's what I think the future holds...",
    },
    {
      id: "2",
      title: "Best Photography Spots in Urban Areas",
      author: "Mike Rodriguez",
      community: "Photography Enthusiasts",
      likes: 189,
      replies: 43,
      createdAt: new Date(2024, 5, 19),
      excerpt:
        "Discovering amazing photography locations in the concrete jungle. These spots will transform your urban photography...",
    },
    {
      id: "3",
      title: "Healthy Meal Prep Ideas for Busy Professionals",
      author: "Emma Thompson",
      community: "Health & Wellness",
      likes: 156,
      replies: 29,
      createdAt: new Date(2024, 5, 18),
      excerpt:
        "Time-saving meal prep strategies that don't compromise on nutrition. Perfect for those hectic weekdays...",
    },
  ];

  const trendingCommunities: TrendingCommunity[] = [
    {
      id: "1",
      name: "AI & Machine Learning",
      description:
        "Discussions about artificial intelligence, machine learning, and their applications",
      memberCount: 2890,
      growthRate: 15.2,
      category: "Technology",
    },
    {
      id: "2",
      name: "Sustainable Living",
      description: "Tips and discussions about eco-friendly lifestyle choices",
      memberCount: 1456,
      growthRate: 12.8,
      category: "Lifestyle",
    },
    {
      id: "3",
      name: "Indie Game Development",
      description:
        "For independent game developers to share experiences and resources",
      memberCount: 987,
      growthRate: 18.5,
      category: "Gaming",
    },
  ];

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
              <Card
                key={post.id}
                className="flex flex-col h-full border-2 transition-shadow hover:shadow-xl hover:scale-[1.03] hover:border-purple-400 hover:bg-purple-50 focus-within:border-purple-500 focus-within:bg-purple-50"
              >
                <CardHeader className="flex-1 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-base sm:text-lg break-words">
                        <Link
                          to={`/post/${post.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {post.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm mt-1 break-words">
                        {post.excerpt}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                        <span>{post.replies}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 justify-end space-y-3">
                  <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-2">
                    <span className="break-words">
                      by {post.author} • in {post.community} •{" "}
                      {post.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex mt-auto w-full">
                    <Button
                      variant="outline"
                      className="flex-1 text-xs sm:text-sm"
                    >
                      <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
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

export default DiscoverPage;
