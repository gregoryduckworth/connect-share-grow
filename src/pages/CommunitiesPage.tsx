import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquare, Plus, Search, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import CreateCommunityDialog from "@/components/community/CreateCommunityDialog";

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  postCount: number;
  category: string;
  tags: string[];
  isJoined: boolean;
  lastActivity: Date;
}

const CommunitiesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("members");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [communities] = useState<Community[]>([
    {
      id: "1",
      name: "Photography Enthusiasts",
      description: "A place for photographers to share their work and discuss techniques",
      memberCount: 1250,
      postCount: 423,
      category: "Art & Design",
      tags: ["Photography", "Art", "Camera"],
      isJoined: true,
      lastActivity: new Date(2024, 5, 20)
    },
    {
      id: "2",
      name: "Web Development",
      description: "Discussion about modern web development practices and technologies",
      memberCount: 2100,
      postCount: 867,
      category: "Technology",
      tags: ["JavaScript", "React", "Node.js"],
      isJoined: false,
      lastActivity: new Date(2024, 5, 21)
    },
    {
      id: "3",
      name: "Book Club",
      description: "Monthly book discussions and reading recommendations",
      memberCount: 890,
      postCount: 234,
      category: "Literature",
      tags: ["Books", "Reading", "Discussion"],
      isJoined: true,
      lastActivity: new Date(2024, 5, 19)
    },
    {
      id: "4",
      name: "Fitness & Health",
      description: "Workout routines, nutrition tips, and health discussions",
      memberCount: 1567,
      postCount: 542,
      category: "Health & Fitness",
      tags: ["Fitness", "Health", "Nutrition"],
      isJoined: false,
      lastActivity: new Date(2024, 5, 22)
    },
  ]);

  const sortCommunities = (communities: Community[]) => {
    return [...communities].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "members":
          comparison = a.memberCount - b.memberCount;
          break;
        case "posts":
          comparison = a.postCount - b.postCount;
          break;
        case "activity":
          comparison = a.lastActivity.getTime() - b.lastActivity.getTime();
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === "desc" ? -comparison : comparison;
    });
  };

  const filteredCommunities = sortCommunities(
    communities.filter(community =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  const joinedCommunities = filteredCommunities.filter(c => c.isJoined);
  const availableCommunities = filteredCommunities.filter(c => !c.isJoined);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const CommunityCard = ({ community }: { community: Community }) => (
    <Card className="hover:shadow-md transition-shadow w-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <CardTitle className="text-lg">
                  <Link 
                    to={`/community/${community.id}`}
                    className="hover:text-social-primary transition-colors"
                  >
                    {community.name}
                  </Link>
                </CardTitle>
                <Badge variant="secondary" className="mt-1">
                  {community.category}
                </Badge>
              </div>
              <Button
                size="sm"
                variant={community.isJoined ? "outline" : "default"}
                className="ml-4 shrink-0"
              >
                {community.isJoined ? "Joined" : "Join"}
              </Button>
            </div>
            
            <p className="text-sm text-social-muted mb-3 line-clamp-2">{community.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-social-muted">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{community.memberCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{community.postCount}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 justify-end">
                {community.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {community.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{community.tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-social-primary">Communities</h1>
        <CreateCommunityDialog 
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </Button>
          }
        />
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search communities..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="members">Members</SelectItem>
                <SelectItem value="posts">Posts</SelectItem>
                <SelectItem value="activity">Activity</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSortOrder}
              className="flex items-center gap-1"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === "desc" ? "High to Low" : "Low to High"}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Communities</TabsTrigger>
          <TabsTrigger value="joined">My Communities ({joinedCommunities.length})</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {filteredCommunities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="joined" className="space-y-4">
          <div className="space-y-4">
            {joinedCommunities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          <div className="space-y-4">
            {availableCommunities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunitiesPage;
