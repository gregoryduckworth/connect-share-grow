
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search, Video } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Community {
  id: number;
  name: string;
  description: string;
  members: number;
  tags: string[];
  joined: boolean;
}

const CommunitiesPage = () => {
  const { toast } = useToast();
  const [communities, setCommunities] = useState<Community[]>([
    {
      id: 1,
      name: "Photography Enthusiasts",
      description: "Share your best shots, photography tips, and camera recommendations.",
      members: 2453,
      tags: ["Photography", "Art", "Creative"],
      joined: false,
    },
    {
      id: 2,
      name: "Web Developers",
      description: "A community for all web developers to share knowledge, tips, and career advice.",
      members: 5721,
      tags: ["Technology", "Coding", "Web Dev"],
      joined: false,
    },
    {
      id: 3,
      name: "Fitness & Wellness",
      description: "Get fit together! Share workout routines, nutrition tips, and motivation.",
      members: 3189,
      tags: ["Health", "Fitness", "Wellbeing"],
      joined: true,
    },
    {
      id: 4,
      name: "Book Club",
      description: "Monthly book discussions, recommendations, and literary analysis.",
      members: 1276,
      tags: ["Reading", "Literature", "Discussion"],
      joined: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  
  const toggleJoin = (id: number) => {
    setCommunities(communities.map(community => 
      community.id === id 
        ? { ...community, joined: !community.joined } 
        : community
    ));
    
    const community = communities.find(c => c.id === id);
    if (community) {
      toast({
        title: community.joined ? "Left community" : "Joined community",
        description: community.joined 
          ? `You have left the ${community.name} community` 
          : `You have joined the ${community.name} community`,
      });
    }
  };
  
  const filteredCommunities = communities.filter(community => 
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-social-primary">Communities</h1>
          <p className="text-social-muted">Connect with people who share your interests</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search communities..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="discover">
        <TabsList className="mb-4">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="my-communities">My Communities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="discover" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredCommunities.map(community => (
              <Card key={community.id} className="hover-scale">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {community.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> {community.members.toLocaleString()} members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{community.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {community.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-social-accent/50">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant={community.joined ? "outline" : "default"}
                    className={community.joined 
                      ? "border-social-primary text-social-primary" 
                      : "bg-social-primary hover:bg-social-secondary"}
                    onClick={() => toggleJoin(community.id)}
                  >
                    {community.joined ? "Leave" : "Join"} Community
                  </Button>
                  {community.joined && (
                    <Button variant="outline" className="border-social-primary text-social-primary">
                      <Video className="h-4 w-4 mr-2" /> Video Chat
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredCommunities.length === 0 && (
            <div className="text-center p-8">
              <p className="text-social-muted">No communities found matching your search.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="my-communities" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredCommunities.filter(c => c.joined).map(community => (
              <Card key={community.id} className="hover-scale">
                <CardHeader>
                  <CardTitle>{community.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> {community.members.toLocaleString()} members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{community.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {community.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-social-accent/50">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline"
                    className="border-social-primary text-social-primary"
                    onClick={() => toggleJoin(community.id)}
                  >
                    Leave Community
                  </Button>
                  <Button variant="outline" className="border-social-primary text-social-primary">
                    <Video className="h-4 w-4 mr-2" /> Video Chat
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredCommunities.filter(c => c.joined).length === 0 && (
            <div className="text-center p-8">
              <p className="text-social-muted">You haven't joined any communities yet.</p>
              <Button className="mt-4 bg-social-primary hover:bg-social-secondary">
                Discover Communities
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunitiesPage;
