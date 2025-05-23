
import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Search, Users, Settings, UserPlus } from "lucide-react";
import { logAdminAction } from "@/lib/admin-logger";

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: Date;
  status: "active" | "pending" | "archived";
  createdBy: string;
  moderators: string[];
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
  const [communities, setCommunities] = useState<Community[]>([
    {
      id: "comm-1",
      name: "Photography Enthusiasts",
      description: "A community for sharing photography tips and showcasing your work.",
      memberCount: 128,
      createdAt: new Date(2023, 1, 15),
      status: "active",
      createdBy: "John Doe",
      moderators: ["John Doe", "Jane Smith"]
    },
    {
      id: "comm-2",
      name: "Tech Talk",
      description: "Discuss the latest in technology, software, and gadgets.",
      memberCount: 256,
      createdAt: new Date(2023, 2, 10),
      status: "active",
      createdBy: "Robert Johnson",
      moderators: ["Robert Johnson"]
    },
    {
      id: "comm-3",
      name: "Book Readers",
      description: "Share book recommendations and discuss literature.",
      memberCount: 96,
      createdAt: new Date(2023, 3, 5),
      status: "active",
      createdBy: "Lisa Brown",
      moderators: ["Lisa Brown", "Michael Wilson"]
    },
    {
      id: "comm-4",
      name: "Travel Adventures",
      description: "Share travel stories, tips, and destinations.",
      memberCount: 78,
      createdAt: new Date(2023, 4, 20),
      status: "pending",
      createdBy: "Jane Smith",
      moderators: ["Jane Smith"]
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
              <TableHead className="hidden md:table-cell">Created</TableHead>
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
                <TableCell className="hidden md:table-cell">{community.createdAt.toLocaleDateString()}</TableCell>
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
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Manage Community</DialogTitle>
                          <DialogDescription>
                            View and update details for {community.name}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
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
                        <DialogFooter>
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
