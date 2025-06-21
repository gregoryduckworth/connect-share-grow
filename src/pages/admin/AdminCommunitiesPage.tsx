
import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Search, Users, Settings, UserPlus, Check, MessageSquare, Plus, X } from "lucide-react";
import { logAdminAction } from "@/lib/admin-logger";

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  postCount: number;
  createdAt: Date;
  status: "active" | "pending" | "archived";
  createdBy: string;
  moderators: string[];
  rules: string[];
}

interface CommunityMember {
  id: string;
  name: string;
  role: "member" | "moderator" | "owner";
  joinedAt: Date;
}

const AdminCommunitiesPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [editingRules, setEditingRules] = useState(false);
  const [tempRules, setTempRules] = useState<string[]>([]);
  const [communities, setCommunities] = useState<Community[]>([
    {
      id: "comm-1",
      name: "Photography Enthusiasts",
      description: "A community for sharing photography tips and showcasing your work.",
      memberCount: 128,
      postCount: 342,
      createdAt: new Date(2023, 1, 15),
      status: "active",
      createdBy: "John Doe",
      moderators: ["John Doe", "Jane Smith"],
      rules: [
        "Be respectful to all members",
        "No spam or self-promotion without approval",
        "Share constructive feedback on others' work",
        "Use appropriate tags for your posts"
      ]
    },
    {
      id: "comm-2",
      name: "Tech Talk",
      description: "Discuss the latest in technology, software, and gadgets.",
      memberCount: 256,
      postCount: 789,
      createdAt: new Date(2023, 2, 10),
      status: "active",
      createdBy: "Robert Johnson",
      moderators: ["Robert Johnson"],
      rules: [
        "Keep discussions tech-related",
        "Provide sources for claims",
        "No personal attacks or flame wars",
        "Help newcomers learn"
      ]
    },
    {
      id: "comm-3",
      name: "Book Readers",
      description: "Share book recommendations and discuss literature.",
      memberCount: 96,
      postCount: 156,
      createdAt: new Date(2023, 3, 5),
      status: "active",
      createdBy: "Lisa Brown",
      moderators: ["Lisa Brown", "Michael Wilson"],
      rules: [
        "No spoilers without warnings",
        "Respect different reading preferences",
        "Provide book details when making recommendations"
      ]
    },
    {
      id: "comm-4",
      name: "Travel Adventures",
      description: "Share travel stories, tips, and destinations.",
      memberCount: 78,
      postCount: 234,
      createdAt: new Date(2023, 4, 20),
      status: "pending",
      createdBy: "Jane Smith",
      moderators: ["Jane Smith"],
      rules: [
        "Share authentic travel experiences",
        "Include photos when possible",
        "Respect local cultures and customs"
      ]
    },
  ]);
  
  // Mock community members for the manage moderators dialog
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>([
    { id: "user-1", name: "John Doe", role: "owner", joinedAt: new Date(2023, 1, 15) },
    { id: "user-2", name: "Jane Smith", role: "moderator", joinedAt: new Date(2023, 1, 16) },
    { id: "user-3", name: "Robert Johnson", role: "member", joinedAt: new Date(2023, 1, 20) },
    { id: "user-4", name: "Lisa Brown", role: "member", joinedAt: new Date(2023, 2, 5) },
    { id: "user-5", name: "Michael Wilson", role: "member", joinedAt: new Date(2023, 2, 12) },
  ]);

  const filteredCommunities = communities.filter(community => 
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePromoteToModerator = (memberId: string) => {
    setCommunityMembers(communityMembers.map(member => 
      member.id === memberId ? { ...member, role: "moderator" } : member
    ));
    
    const member = communityMembers.find(m => m.id === memberId);
    
    if (member && selectedCommunity) {
      toast({
        title: "Moderator Added",
        description: `${member.name} is now a moderator of ${selectedCommunity.name}.`,
      });
      
      logAdminAction({
        action: "moderator_added",
        details: `Added ${member.name} as moderator to ${selectedCommunity.name}`,
        targetId: selectedCommunity.id,
        targetType: "community"
      });
    }
  };

  const handleRemoveAsModerator = (memberId: string) => {
    setCommunityMembers(communityMembers.map(member => 
      member.id === memberId ? { ...member, role: "member" } : member
    ));
    
    const member = communityMembers.find(m => m.id === memberId);
    
    if (member && selectedCommunity) {
      toast({
        title: "Moderator Removed",
        description: `${member.name} is no longer a moderator of ${selectedCommunity.name}.`,
      });
      
      logAdminAction({
        action: "moderator_removed",
        details: `Removed ${member.name} as moderator from ${selectedCommunity.name}`,
        targetId: selectedCommunity.id,
        targetType: "community"
      });
    }
  };

  const handleApproveCommunity = (communityId: string) => {
    setCommunities(communities.map(community => 
      community.id === communityId ? { ...community, status: "active" } : community
    ));
    
    const community = communities.find(c => c.id === communityId);
    
    if (community) {
      toast({
        title: "Community Approved",
        description: `${community.name} has been approved and is now active.`,
      });
      
      logAdminAction({
        action: "community_approved",
        details: `Approved community: ${community.name}`,
        targetId: community.id,
        targetType: "community"
      });
    }
  };

  const handleEditRules = () => {
    if (selectedCommunity) {
      setTempRules([...selectedCommunity.rules]);
      setEditingRules(true);
    }
  };

  const handleSaveRules = () => {
    if (selectedCommunity) {
      setCommunities(communities.map(community => 
        community.id === selectedCommunity.id 
          ? { ...community, rules: tempRules }
          : community
      ));
      
      setSelectedCommunity({ ...selectedCommunity, rules: tempRules });
      setEditingRules(false);
      
      toast({
        title: "Rules Updated",
        description: `Community rules for ${selectedCommunity.name} have been updated.`,
      });
      
      logAdminAction({
        action: "community_rules_updated",
        details: `Updated rules for community: ${selectedCommunity.name}`,
        targetId: selectedCommunity.id,
        targetType: "community"
      });
    }
  };

  const handleAddRule = () => {
    setTempRules([...tempRules, ""]);
  };

  const handleRemoveRule = (index: number) => {
    setTempRules(tempRules.filter((_, i) => i !== index));
  };

  const handleRuleChange = (index: number, value: string) => {
    const newRules = [...tempRules];
    newRules[index] = value;
    setTempRules(newRules);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Manage Communities</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search communities..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Members</TableHead>
              <TableHead className="hidden md:table-cell">Posts</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCommunities.map((community) => (
              <TableRow key={community.id}>
                <TableCell>
                  <div className="font-medium">{community.name}</div>
                  <div className="text-xs text-muted-foreground hidden md:block">{community.description.substring(0, 50)}...</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{community.memberCount}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{community.postCount}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{community.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={
                    community.status === "active" ? "bg-green-500" :
                    community.status === "pending" ? "bg-orange-500" :
                    "bg-slate-500"
                  }>
                    {community.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {community.status === "pending" && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="text-xs bg-green-500 hover:bg-green-600"
                        onClick={() => handleApproveCommunity(community.id)}
                      >
                        <Check className="h-3 w-3 mr-1" /> Approve
                      </Button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => setSelectedCommunity(community)}
                        >
                          <Settings className="h-3 w-3 mr-1" /> Manage
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Manage Community</DialogTitle>
                          <DialogDescription>
                            View and update details for {community.name}.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Column - Basic Info */}
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold mb-1">Community Name</h3>
                              <p>{community.name}</p>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-1">Description</h3>
                              <p className="text-sm">{community.description}</p>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-1">Created By</h3>
                              <p>{community.createdBy}</p>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-1">Moderators</h3>
                              <div className="flex flex-wrap gap-2">
                                {community.moderators.map((mod, i) => (
                                  <Badge key={i} variant="secondary">{mod}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Right Column - Rules */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">Community Rules</h3>
                              {!editingRules && (
                                <Button variant="outline" size="sm" onClick={handleEditRules}>
                                  Edit Rules
                                </Button>
                              )}
                            </div>
                            
                            {editingRules ? (
                              <div className="space-y-3">
                                {tempRules.map((rule, index) => (
                                  <div key={index} className="flex gap-2">
                                    <Textarea
                                      value={rule}
                                      onChange={(e) => handleRuleChange(index, e.target.value)}
                                      placeholder={`Rule ${index + 1}...`}
                                      className="min-h-[60px]"
                                    />
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleRemoveRule(index)}
                                      className="mt-1"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" onClick={handleAddRule}>
                                    <Plus className="h-4 w-4 mr-1" /> Add Rule
                                  </Button>
                                  <Button size="sm" onClick={handleSaveRules}>
                                    <Check className="h-4 w-4 mr-1" /> Save Rules
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setEditingRules(false)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <ol className="space-y-2 text-sm">
                                {community.rules.map((rule, index) => (
                                  <li key={index} className="flex">
                                    <span className="font-medium text-social-primary mr-2">{index + 1}.</span>
                                    <span>{rule}</span>
                                  </li>
                                ))}
                              </ol>
                            )}
                          </div>
                        </div>

                        <DialogFooter className="mt-6">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="default">
                                <UserPlus className="h-4 w-4 mr-1" /> Manage Moderators
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Manage Moderators</DialogTitle>
                                <DialogDescription>
                                  Add or remove moderators for this community.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="max-h-[300px] overflow-y-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Member</TableHead>
                                      <TableHead>Role</TableHead>
                                      <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {communityMembers.map((member) => (
                                      <TableRow key={member.id}>
                                        <TableCell>{member.name}</TableCell>
                                        <TableCell>
                                          <Badge className={
                                            member.role === "owner" ? "bg-social-primary" :
                                            member.role === "moderator" ? "bg-social-secondary" :
                                            "bg-slate-400"
                                          }>
                                            {member.role}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          {member.role === "owner" ? (
                                            <span className="text-xs text-muted-foreground">Owner</span>
                                          ) : member.role === "moderator" ? (
                                            <Button 
                                              variant="outline" 
                                              size="sm" 
                                              className="text-xs"
                                              onClick={() => handleRemoveAsModerator(member.id)}
                                            >
                                              Remove Mod
                                            </Button>
                                          ) : (
                                            <Button 
                                              variant="outline" 
                                              size="sm" 
                                              className="text-xs"
                                              onClick={() => handlePromoteToModerator(member.id)}
                                            >
                                              <UserPlus className="h-3 w-3 mr-1" /> Make Mod
                                            </Button>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => {
                                  toast({
                                    title: "Changes Saved",
                                    description: "Moderator changes have been saved."
                                  });
                                }}>
                                  <Check className="h-4 w-4 mr-1" /> Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredCommunities.length === 0 && (
          <div className="text-center p-8">
            <p className="text-social-muted">No communities found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCommunitiesPage;
