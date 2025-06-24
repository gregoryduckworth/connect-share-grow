
import { useState } from "react";
import { Search, TrendingUp, Users, MessageSquare, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

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
      excerpt: "As we move forward, remote work is becoming the norm rather than the exception. Here's what I think the future holds..."
    },
    {
      id: "2",
      title: "Best Photography Spots in Urban Areas",
      author: "Mike Rodriguez",
      community: "Photography Enthusiasts",
      likes: 189,
      replies: 43,
      createdAt: new Date(2024, 5, 19),
      excerpt: "Discovering amazing photography locations in the concrete jungle. These spots will transform your urban photography..."
    },
    {
      id: "3",
      title: "Healthy Meal Prep Ideas for Busy Professionals",
      author: "Emma Thompson",
      community: "Health & Wellness",
      likes: 156,
      replies: 29,
      createdAt: new Date(2024, 5, 18),
      excerpt: "Time-saving meal prep strategies that don't compromise on nutrition. Perfect for those hectic weekdays..."
    }
  ];

  const trendingCommunities: TrendingCommunity[] = [
    {
      id: "1",
      name: "AI & Machine Learning",
      description: "Discussions about artificial intelligence, machine learning, and their applications",
      memberCount: 2890,
      growthRate: 15.2,
      category: "Technology"
    },
    {
      id: "2",
      name: "Sustainable Living",
      description: "Tips and discussions about eco-friendly lifestyle choices",
      memberCount: 1456,
      growthRate: 12.8,
      category: "Lifestyle"
    },
    {
      id: "3",
      name: "Indie Game Development",
      description: "For independent game developers to share experiences and resources",
      memberCount: 987,
      growthRate: 18.5,
      category: "Gaming"
    }
  ];

  const filteredPosts = trendingPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.community.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCommunities = trendingCommunities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Discover</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Explore trending content and growing communities</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search trending posts and communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="posts" className="flex items-center gap-2 text-xs sm:text-sm">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            Trending Posts
          </TabsTrigger>
          <TabsTrigger value="communities" className="flex items-center gap-2 text-xs sm:text-sm">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            Growing Communities
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="space-y-4 sm:space-y-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-base sm:text-lg mb-2 break-words">
                      <Link to={`/post/${post.id}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <span>by {post.author}</span>
                      <span>•</span>
                      <span>in {post.community}</span>
                      <span>•</span>
                      <span>{post.createdAt.toLocaleDateString()}</span>
                    </div>
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
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 break-words">{post.excerpt}</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/post/${post.id}`}>Read More</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No trending posts found matching your search.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="communities" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCommunities.map((community) => (
              <Card key={community.id} className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-base sm:text-lg break-words">
                        <Link to={`/community/${community.id}`} className="hover:text-primary transition-colors">
                          {community.name}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm mt-2 break-words">
                        {community.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 text-xs whitespace-nowrap">
                      +{community.growthRate}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Members</span>
                      <span className="font-medium">{community.memberCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Category</span>
                      <Badge variant="secondary" className="text-xs">{community.category}</Badge>
                    </div>
                  </div>
                  
                  <Button className="w-full text-xs sm:text-sm" asChild>
                    <Link to={`/community/${community.id}`}>Join Community</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredCommunities.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No growing communities found matching your search.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiscoverPage;
