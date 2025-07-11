import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  AlertTriangle,
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RoleChangeAlert from '@/components/admin/AdminRoleChangeAlert';
import { getMockFlaggedReports } from '@/lib/api';
import { Moderator, CommunityAnalytics, FlaggedReport } from '@/lib/types';
import UserProfileLink from '@/components/user/UserProfileLink';
import { useAuth } from '@/contexts/useAuth';
import { userService } from '@/lib/backend/services/userService';

import { useDialog } from '@/hooks/useDialog';
import { formatNumber } from '@/lib/utils';
import { InfoBadge } from '@/components/common/InfoBadge';
import { Skeleton } from '@/components/ui/skeleton';

const ModeratePage = () => {
  const { communityId } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const removeDialog = useDialog(false);
  const [moderatorToRemove, setModeratorToRemove] = useState<Moderator | null>(null);
  const [removalReason, setRemovalReason] = useState('');
  const [editingRules, setEditingRules] = useState(false);

  // Mock community data
  const community = {
    id: communityId || '1',
    name: 'Photography Enthusiasts',
    description: 'A place for photographers to share their work and discuss techniques',
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
      id: 'mod-1',
      name: 'Sarah Johnson',
      role: 'Lead Moderator',
      joinedAsModAt: new Date(2023, 0, 15),
      actionsThisMonth: 24,
    },
    {
      id: 'mod-2',
      name: 'Mike Chen',
      role: 'Moderator',
      joinedAsModAt: new Date(2023, 2, 20),
      actionsThisMonth: 18,
    },
    {
      id: 'mod-3',
      name: 'Alex Rivera',
      role: 'Moderator',
      joinedAsModAt: new Date(2023, 4, 10),
      actionsThisMonth: 12,
    },
  ]);

  const [rules, setRules] = useState([
    'Be respectful to all members',
    'No spam or self-promotion without approval',
    "Share constructive feedback on others' work",
    'Use appropriate tags for your posts',
    'No inappropriate or offensive content',
  ]);

  const [editedRules, setEditedRules] = useState([...rules]);
  const [newRule, setNewRule] = useState('');

  // Mock pending removal requests
  const [pendingRemovalRequests, setPendingRemovalRequests] = useState([
    {
      id: 'req-1',
      moderator: moderators[1],
      requestedBy: 'Sarah Johnson',
      requestedAt: new Date(),
      reason: 'Inactivity and lack of engagement with the community.',
    },
  ]);

  // Flagged reports state
  const [flaggedReports, setFlaggedReports] = useState<FlaggedReport[]>([]);

  // Add loading state for analytics and moderators
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // Simulate loading
  }, []);

  // Map user names into flaggedReports for instant rendering
  useEffect(() => {
    const loadFlaggedReports = async () => {
      try {
        const reports = await getMockFlaggedReports();
        const users = await userService.getUsers();
        setFlaggedReports(
          reports.map((r) => {
            const userObj = users.find((u) => u.id === r.reportedBy);
            return {
              ...r,
              type: r.contentType,
              reportedByName: userObj?.name || 'Unknown',
            };
          }),
        );
      } catch (error) {
        console.error('Failed to load flagged reports:', error);
      }
    };

    if (communityId) {
      loadFlaggedReports();
    }
  }, [communityId]);

  // Replace hardcoded currentUser and moderator logic with user context
  const currentUser = user?.name || '';

  const handleRemoveModerator = (moderator: Moderator) => {
    setModeratorToRemove(moderator);
    removeDialog.open();
  };

  const confirmRemoveModerator = () => {
    if (moderatorToRemove && removalReason.trim()) {
      // In a real app, this would require approval from another moderator
      toast({
        title: 'Removal Request Submitted',
        description: `A request to remove ${moderatorToRemove.name} has been sent to other moderators for approval.`,
      });
      removeDialog.close();
      setModeratorToRemove(null);
      setRemovalReason('');
    }
  };

  const handleSaveRules = () => {
    setRules([...editedRules]);
    setEditingRules(false);
    toast({
      title: 'Rules Updated',
      description: 'Community rules have been updated successfully.',
    });
  };

  const addRule = () => {
    if (newRule.trim()) {
      setEditedRules([...editedRules, newRule.trim()]);
      setNewRule('');
    }
  };

  const removeRule = (index: number) => {
    setEditedRules(editedRules.filter((_, i) => i !== index));
  };

  const handleApproveRemoval = (requestId: string) => {
    const req = pendingRemovalRequests.find((r) => r.id === requestId);
    if (req) {
      setModerators(moderators.filter((m) => m.id !== req.moderator.id));
      setPendingRemovalRequests(pendingRemovalRequests.filter((r) => r.id !== requestId));
      toast({
        title: 'Moderator Removed',
        description: `${req.moderator.name} has been removed as a moderator.`,
      });
    }
  };

  const handleRejectRemoval = (requestId: string) => {
    setPendingRemovalRequests(pendingRemovalRequests.filter((r) => r.id !== requestId));
    toast({
      title: 'Removal Request Rejected',
      description: `The moderator removal request has been rejected.`,
    });
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 min-h-screen bg-background">
        <div className="space-y-4 max-w-2xl mx-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full mb-2 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen" data-testid="moderate-page">
      {/* Breadcrumbs */}
      <div className="mb-6" data-testid="moderate-breadcrumbs">
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
        <div className="flex items-center justify-between" data-testid="moderate-header">
          <div>
            <h1 className="text-3xl font-bold text-social-primary" data-testid="moderate-title">
              Moderate Community
            </h1>
            <p className="text-social-muted" data-testid="moderate-community-name">
              {community.name}
            </p>
          </div>
          <InfoBadge
            type="category"
            className="bg-social-primary"
            data-testid="moderator-panel-badge"
            icon={<Settings className="h-4 w-4 mr-1" />}
          >
            Moderator Panel
          </InfoBadge>
        </div>

        {/* Pending Moderator Removal Requests Alert */}
        <RoleChangeAlert
          pendingChanges={pendingRemovalRequests.map((req) => ({
            id: req.id,
            user: {
              id: req.moderator.id,
              name: req.moderator.name,
              email: 'moderator@example.com',
              role: req.moderator.role,
            },
            requestedBy: req.requestedBy,
            requestedAt: req.requestedAt,
            newRole: 'removed',
          }))}
          currentUser={currentUser}
          onApprove={handleApproveRemoval}
          onReject={handleRejectRemoval}
          alertTitle={'Moderator Removal Approval Required'}
          data-testid="moderator-removal-alert"
        />

        {/* Analytics Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
          data-testid="moderate-analytics-cards"
        >
          <Card data-testid="analytics-total-members">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-social-muted">Total Members</p>
                  <p className="text-2xl font-bold">{formatNumber(analytics.totalMembers)}</p>
                </div>
                <Users className="h-8 w-8 text-social-primary" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="analytics-total-posts">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-social-muted">Total Posts</p>
                  <p className="text-2xl font-bold">{analytics.totalPosts}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-social-primary" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="analytics-posts-this-week">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-social-muted">Posts This Week</p>
                  <p className="text-2xl font-bold text-green-600">+{analytics.postsThisWeek}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="analytics-active-members">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-social-muted">Active Members</p>
                  <p className="text-2xl font-bold">{analytics.activeMembers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="analytics-reports-this-week">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-social-muted">Reports This Week</p>
                  <p className="text-2xl font-bold text-orange-600">{analytics.reportsThisWeek}</p>
                </div>
                <Settings className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Moderators */}
          <Card data-testid="moderators-card">
            <CardHeader>
              <CardTitle>Moderators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moderators.map((moderator) => (
                  <div
                    key={moderator.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    data-testid={`moderator-row-${moderator.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-social-primary rounded-full flex items-center justify-center text-white">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">
                          <UserProfileLink userId={moderator.id} userName={moderator.name} />
                        </p>
                        <p className="text-sm text-social-muted">{moderator.role}</p>
                        <p className="text-xs text-gray-400">
                          {moderator.actionsThisMonth} actions this month
                        </p>
                      </div>
                    </div>
                    {moderator.role !== 'Lead Moderator' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveModerator(moderator)}
                        className="border-red-400 text-red-500 hover:bg-red-50"
                        data-testid={`remove-moderator-btn-${moderator.id}`}
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
          <Card data-testid="community-rules-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Community Rules</CardTitle>
                <Button
                  variant={editingRules ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    if (editingRules) {
                      handleSaveRules();
                    } else {
                      setEditingRules(true);
                      setEditedRules([...rules]);
                    }
                  }}
                  data-testid={editingRules ? 'save-rules-btn' : 'edit-rules-btn'}
                >
                  {editingRules ? (
                    <Save className="h-4 w-4 mr-1" />
                  ) : (
                    <Settings className="h-4 w-4 mr-1" />
                  )}
                  {editingRules ? 'Save' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingRules ? (
                <div className="space-y-3">
                  {editedRules.map((rule, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2"
                      data-testid={`edit-rule-row-${index}`}
                    >
                      <span className="font-medium text-social-primary text-sm">{index + 1}.</span>
                      <Input
                        value={rule}
                        onChange={(e) => {
                          const newRules = [...editedRules];
                          newRules[index] = e.target.value;
                          setEditedRules(newRules);
                        }}
                        className="flex-1"
                        data-testid={`edit-rule-input-${index}`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeRule(index)}
                        className="border-red-400 text-red-500 hover:bg-red-50"
                        data-testid={`remove-rule-btn-${index}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2" data-testid="add-rule-row">
                    <span className="font-medium text-social-primary text-sm">
                      {editedRules.length + 1}.
                    </span>
                    <Input
                      placeholder="Add new rule..."
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      className="flex-1"
                      data-testid="add-rule-input"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addRule}
                      disabled={!newRule.trim()}
                      data-testid="add-rule-btn"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <ol className="space-y-2 text-sm">
                  {rules.map((rule, index) => (
                    <li key={index} className="flex" data-testid={`rule-row-${index}`}>
                      <span className="font-medium text-social-primary mr-2">{index + 1}.</span>
                      <span className="text-social-muted">{rule}</span>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Flagged Posts/Replies/Users Section */}
        {flaggedReports.length > 0 && (
          <Card className="mb-6" data-testid="flagged-reports-card">
            <CardHeader>
              <CardTitle>
                <AlertTriangle className="inline-block mr-2 text-orange-500" />
                Flagged Content for Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flaggedReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3 border rounded-lg bg-orange-50 flex flex-col gap-2"
                    data-testid={`flagged-report-${report.id}`}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        {report.contentType.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium">
                        {report.contentType === 'post' && `Post: ${report.content}`}
                        {report.contentType === 'reply' && `Reply: ${report.content}`}
                        {report.contentType === 'user' && `User: ${report.content}`}
                      </span>
                    </div>
                    <div className="text-xs text-social-muted">
                      Reported by:{' '}
                      <UserProfileLink
                        userId={report.reportedBy}
                        userName={report.reportedByName}
                      />{' '}
                      • Reason: {report.reason}
                    </div>
                    {/* Moderation actions: lock post/comments, etc. */}
                    {report.contentType === 'post' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-400 text-red-500 hover:bg-red-50"
                          data-testid={`lock-post-btn-${report.id}`}
                        >
                          Lock Post
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-400 text-orange-500 hover:bg-orange-50"
                          data-testid={`lock-comments-btn-${report.id}`}
                        >
                          Lock Comments
                        </Button>
                      </div>
                    )}
                    {report.contentType === 'reply' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-400 text-red-500 hover:bg-red-50"
                          data-testid={`lock-reply-btn-${report.id}`}
                        >
                          Lock Reply
                        </Button>
                      </div>
                    )}
                    {report.contentType === 'user' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-400 text-red-500 hover:bg-red-50"
                          data-testid={`suspend-user-btn-${report.id}`}
                        >
                          Suspend User
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Remove Moderator Dialog */}
      <Dialog
        open={removeDialog.isOpen}
        onOpenChange={removeDialog.setOpen}
        data-testid="remove-moderator-dialog"
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Moderator</DialogTitle>
            <DialogDescription>
              Are you sure you want to request the removal of {moderatorToRemove?.name}? This action
              requires approval from another moderator.
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
                data-testid="removal-reason-textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => removeDialog.close()}
              data-testid="cancel-remove-moderator-btn"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRemoveModerator}
              disabled={!removalReason.trim()}
              data-testid="submit-remove-moderator-btn"
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
