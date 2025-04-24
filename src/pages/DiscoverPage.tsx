
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Community {
  id: number;
  name: string;
  description: string;
  members: number;
  tags: string[];
  joined: boolean;
}

interface Person {
  id: number;
  name: string;
  interests: string[];
  mutualFriends: number;
  isFriend: boolean;
}

const DiscoverPage = () => {
  const { toast } = useToast();
  const [communities, setCommunities] = useState<Community[]>([
    {
      id: 1,
      name: "Photography Enthusiasts",
      description: "Share your best shots and photography tips.",
      members: 2453,
      tags: ["Photography", "Art", "Creative"],
      joined: false,
    },
    {
      id: 2,
      name: "Travel Adventures",
      description: "Share travel stories and find travel companions.",
      members: 3872,
      tags: ["Travel", "Adventure", "Culture"],
      joined: false,
    },
    {
      id: 3,
      name: "Home Cooking",
      description: "Exchange recipes and cooking tips for homemade meals.",
      members: 4156,
      tags: ["Cooking", "Food", "Recipes"],
      joined: false,
    },
  ]);
  
  const [people, setPeople] = useState<Person[]>([
    {
      id: 1,
      name: "Jordan Lee",
      interests: ["Photography", "Hiking", "Technology"],
      mutualFriends: 4,
      isFriend: false,
    },
    {
      id: 2,
      name: "Casey Williams",
      interests: ["Music", "Film", "Art"],
      mutualFriends: 2,
      isFriend: false,
    },
    {
      id: 3,
      name: "Riley Garcia",
      interests: ["Gaming", "Programming", "Books"],
      mutualFriends: 3,
      isFriend: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  
  const toggleJoinCommunity = (id: number) => {
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
  
  const toggleFriendRequest = (id: number) => {
    setPeople(people.map(person => 
      person.id === id 
        ? { ...person, isFriend: !person.isFriend } 
        : person
    ));
    
    const person = people.find(p => p.id === id);
    if (person) {
      toast({
        title: person.isFriend ? "Friend request canceled" : "Friend request sent",
        description: person.isFriend 
          ? `You have canceled your friend request to ${person.name}` 
          : `You have sent a friend request to ${person.name}`,
      });
    }
  };
  
  const filteredCommunities = communities.filter(community => 
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    community.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredPeople = people.filter(person => 
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    person.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-social-primary">Discover</h1>
          <p className="text-social-muted">Find new communities and people based on your interests</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="communities">Communities</SelectItem>
              <SelectItem value="people">People</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Recommended Communities Section */}
      {(filterBy === "all" || filterBy === "communities") && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-social-secondary">Recommended Communities</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCommunities.map(community => (
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
                <CardFooter>
                  <Button 
                    variant={community.joined ? "outline" : "default"}
                    className={community.joined 
                      ? "border-social-primary text-social-primary" 
                      : "bg-social-primary hover:bg-social-secondary"}
                    onClick={() => toggleJoinCommunity(community.id)}
                  >
                    {community.joined ? "Leave" : "Join"} Community
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {filteredCommunities.length === 0 && (
              <div className="col-span-full text-center p-8">
                <p className="text-social-muted">No communities found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* People You Might Know Section */}
      {(filterBy === "all" || filterBy === "people") && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-social-secondary">People You Might Know</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPeople.map(person => (
              <Card key={person.id} className="hover-scale">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-social-primary text-white">
                      {person.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{person.name}</CardTitle>
                    <CardDescription>
                      {person.mutualFriends} mutual {person.mutualFriends === 1 ? "friend" : "friends"}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="text-sm font-medium mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {person.interests.map(interest => (
                      <Badge key={interest} variant="secondary" className="bg-social-accent/50">{interest}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={person.isFriend ? "outline" : "default"}
                    className={person.isFriend 
                      ? "border-social-primary text-social-primary" 
                      : "bg-social-primary hover:bg-social-secondary w-full"}
                    onClick={() => toggleFriendRequest(person.id)}
                  >
                    {person.isFriend ? "Cancel Request" : "Add Friend"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {filteredPeople.length === 0 && (
              <div className="col-span-full text-center p-8">
                <p className="text-social-muted">No people found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
