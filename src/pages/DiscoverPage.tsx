
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, TrendingUp, Star } from "lucide-react";

const DiscoverPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock trending communities
  const trendingCommunities = [
    {
      id: 1,
      name: "Photography Enthusiasts",
      description: "Share your best shots and learn new techniques",
      members: 15420,
      posts: 892,
      tags: ["Photography", "Art", "Creative"],
      growth: "+12%"
    },
    {
      id: 2,
      name: "Web Development",
      description: "Discussion about modern web technologies",
      members: 8930,
      posts: 1247,
      tags: ["Programming", "JavaScript", "React"],
      growth: "+8%"
    },
    {
      id: 3,
      name: "Cooking Adventures",
      description: "Recipes, tips, and culinary discussions",
      members: 12580,
      posts: 567,
      tags: ["Cooking", "Recipes", "Food"],
      growth: "+15%"
    },
    {
      id: 4,
      name: "Fitness Journey",
      description: "Motivation and tips for staying healthy",
      members: 7652,
      posts: 432,
      tags: ["Fitness", "Health", "Motivation"],
      growth: "+6%"
    }
  ];

  // Mock popular topics
  const popularTopics = [
    { name: "React Hooks", posts: 234 },
    { name: "Street Photography", posts: 189 },
    { name: "Meal Prep", posts: 156 },
    { name: "Home Workouts", posts: 143 },
    { name: "JavaScript Tips", posts: 128 },
    { name: "Portrait Photography", posts: 112 },
    { name: "Healthy Recipes", posts: 98 },
    { name: "CSS Grid", posts: 87 }
  ];

  const filteredCommunities = trendingCommunities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-social-primary mb-2">Discover</h1>
        <p className="text-social-muted mb-6">
          Find new communities and topics that interest you
        </p>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search communities, topics, or tags..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trending Communities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Communities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCommunities.map((community) => (
                  <div key={community.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-social-primary">
                          {community.name}
                        </h3>
                        <p className="text-social-muted text-sm">{community.description}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        {community.growth}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3 text-sm text-social-muted">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{community.members.toLocaleString()} members</span>
                      </div>
                      <div>
                        <span>{community.posts} posts</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {community.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm">Join Community</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Popular Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium text-social-foreground">
                      #{topic.name}
                    </span>
                    <span className="text-sm text-social-muted">
                      {topic.posts} posts
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Browse Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "Technology",
                  "Arts & Creativity", 
                  "Health & Fitness",
                  "Food & Cooking",
                  "Travel",
                  "Education",
                  "Gaming",
                  "Music"
                ].map((category, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
