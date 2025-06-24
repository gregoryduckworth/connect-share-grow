import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  MessageSquare,
  TrendingUp,
  Settings,
  UserMinus,
  Home,
  ChevronRight,
  Save,
  Plus,
  X,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface Moderator {
  id: string;
  name: string;
  role: string;
  joinedAsModAt: Date;
  actionsThisMonth: number;
}

interface CommunityAnalytics {
  totalMembers: number;
  totalPosts: number;
  postsThisWeek: number;
  activeMembers: number;
  reportsThisWeek: number;
}

const ModeratePage = () => {
  const { communityId } = useParams();
  const { toast } = useToast();
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [moderatorToRemove, setModeratorToRemove] = useState<Moderator | null>(
    null
  );
  const [removalReason, setRemovalReason] = useState("");
  const [editingRules, setEditingRules] = useState(false);

  // Mock community data
  const community = {
    id: communityId || "1",
    name: "Photography Enthusiasts",
    description:
      "A place for photographers to share their work and discuss techniques",
  };

  const [analytics] = useState<CommunityAnalytics>({
    totalMembers: 1250,
    totalPosts: 423,
    postsThisWeek: 18,
    activeMembers: 89,
    reportsThisWeek: 3,
  });

  const [moderators, setModerators] = useState<Moderator[]>([
    {
      id: "mod-1",
      name: "Sarah Johnson",
      role: "Lead Moderator",
      joinedAsModAt: new Date(2023, 0, 15),
      actionsThisMonth: 24,
    },
    {
      id: "mod-2",
      name: "Mike Chen",
      role: "Moderator",
      joinedAsModAt: new Date(2023, 2, 20),
      actionsThisMonth: 18,
    },
    {
      id: "mod-3",
      name: "Alex Rivera",
      role: "Moderator",
      joinedAsModAt: new Date(2023, 4, 10),
      actionsThisMonth: 12,
    },
  ]);

  const [rules, setRules] = useState([
    "Be respectful to all members",
    "No spam or self-promotion without approval",
    "Share constructive feedback on others' work",
    "Use appropriate tags for your posts",
    "No inappropriate or offensive content",
  ]);

  const [editedRules, setEditedRules] = useState([...rules]);
  const [newRule, setNewRule] = useState("");

  const handleRemoveModerator = (moderator: Moderator) => {
    setModeratorToRemove(moderator);
    setShowRemoveDialog(true);
  };

  const confirmRemoveModerator = () => {
    if (moderatorToRemove && removalReason.trim()) {
      // In a real app, this would require approval from another moderator
      toast({
        title: "Removal Request Submitted",
        description: `A request to remove ${moderatorToRemove.name} has been sent to other moderators for approval.`,
      });
      setShowRemoveDialog(false);
      setModeratorToRemove(null);
      setRemovalReason("");
    }
  };

  const handleSaveRules = () => {
    setRules([...editedRules]);
    setEditingRules(false);
    toast({
      title: "Rules Updated",
      description: "Community rules have been updated successfully.",
    });
  };

  const addRule = () => {
    if (newRule.trim()) {
      setEditedRules([...editedRules, newRule.trim()]);
      setNewRule("");
    }
  };

  const removeRule = (index: number) => {
    setEditedRules(editedRules.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/community/${communityId}`}>{community.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Moderate</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-social-primary">
              Moderate Community
            </h1>
            <p className="text-social-muted">{community.name}</p>
          </div>
          <Badge className="bg-social-primary">
            <Settings className="h-4 w-4 mr-1" />
            Moderator Panel
          </Badge>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-social-muted">
                    Total Members
                  </p>
                  <p className="text-2xl font-bold">
                    {analytics.totalMembers.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-social-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-social-muted">
                    Total Posts
                  </p>
                  <p className="text-2xl font-bold">{analytics.totalPosts}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-social-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-social-muted">
                    Posts This Week
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    +{analytics.postsThisWeek}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-social-muted">
                    Active Members
                  </p>
                  <p className="text-2xl font-bold">
                    {analytics.activeMembers}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-social-muted">
                    Reports This Week
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {analytics.reportsThisWeek}
                  </p>
                </div>
                <Settings className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Moderators */}
          <Card>
            <CardHeader>
              <CardTitle>Moderators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moderators.map((moderator) => (
                  <div
                    key={moderator.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-social-primary rounded-full flex items-center justify-center text-white">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{moderator.name}</p>
                        <p className="text-sm text-social-muted">
                          {moderator.role}
                        </p>
                        <p className="text-xs text-gray-400">
                          {moderator.actionsThisMonth} actions this month
                        </p>
                      </div>
                    </div>
                    {moderator.role !== "Lead Moderator" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveModerator(moderator)}
                        className="border-red-400 text-red-500 hover:bg-red-50"
                      >
                        <UserMinus className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Rules */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Community Rules</CardTitle>
                <Button
                  variant={editingRules ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (editingRules) {
                      handleSaveRules();
                    } else {
                      setEditingRules(true);
                      setEditedRules([...rules]);
                    }
                  }}
                >
                  {editingRules ? (
                    <Save className="h-4 w-4 mr-1" />
                  ) : (
                    <Settings className="h-4 w-4 mr-1" />
                  )}
                  {editingRules ? "Save" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingRules ? (
                <div className="space-y-3">
                  {editedRules.map((rule, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="font-medium text-social-primary text-sm">
                        {index + 1}.
                      </span>
                      <Input
                        value={rule}
                        onChange={(e) => {
                          const newRules = [...editedRules];
                          newRules[index] = e.target.value;
                          setEditedRules(newRules);
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeRule(index)}
                        className="border-red-400 text-red-500 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-social-primary text-sm">
                      {editedRules.length + 1}.
                    </span>
                    <Input
                      placeholder="Add new rule..."
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addRule}
                      disabled={!newRule.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <ol className="space-y-2 text-sm">
                  {rules.map((rule, index) => (
                    <li key={index} className="flex">
                      <span className="font-medium text-social-primary mr-2">
                        {index + 1}.
                      </span>
                      <span className="text-social-muted">{rule}</span>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Remove Moderator Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Moderator</DialogTitle>
            <DialogDescription>
              Are you sure you want to request the removal of{" "}
              {moderatorToRemove?.name}? This action requires approval from
              another moderator.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reason for removal</label>
              <Textarea
                placeholder="Please provide a reason for removing this moderator..."
                value={removalReason}
                onChange={(e) => setRemovalReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRemoveDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRemoveModerator}
              disabled={!removalReason.trim()}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModeratePage;
