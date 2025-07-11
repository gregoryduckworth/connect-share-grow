import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { PostDetailData, PostDetailReply } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppAvatar from '@/components/common/AppAvatar';
import { Heart, MessageSquare, Pin, Lock, User, Home, ChevronRight, Unlock } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useToast } from '@/components/ui/use-toast';
import ReportModal from '@/components/ui/ReportModal';
import UserProfileLink from '@/components/user/UserProfileLink';
import UserProfileDialog from '@/components/user/UserProfileDialog';
import { useAuth } from '@/contexts/useAuth';
import { userService } from '@/lib/backend/services/userService';
import PostReply from '@/components/post/PostReply';
import ReplyForm from '@/components/post/ReplyForm';
import {
  formatDate,
  buildReplyTree,
  mapUserNamesToReplies,
  lockReplyRecursive,
  unlockReplyRecursive,
} from '@/lib/utils';
import { useReportModal } from '@/hooks/useReportModal';
import { InfoBadge } from '@/components/common/InfoBadge';
import { Skeleton } from '@/components/ui/skeleton';

const PostDetailPage = () => {
  const { postId } = useParams();
  const { toast } = useToast();
  const { user, isModerator: checkIsModerator } = useAuth();
  const [newReply, setNewReply] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { reportModalOpen, reportContext, openReportModal, closeReportModal } = useReportModal();

  const [post, setPost] = useState<PostDetailData | null>(null);
  const isModerator = checkIsModerator();

  useEffect(() => {
    if (postId) {
      Promise.all([api.getPostDetail(postId), userService.getUsers()]).then(([postData, users]) => {
        const user = users.find((u: { id: string; name: string }) => u.id === postData?.author);
        // Convert PostDetailReply[] to Reply[] for buildReplyTree
        const repliesRaw = (postData?.replies ?? []).map((r: PostDetailReply) => ({
          id: r.id,
          content: r.content,
          author: r.author,
          postId: postId,
          createdAt: r.timestamp ? r.timestamp : new Date(),
          likes: r.likes,
          isLocked: r.isLocked ?? false,
          parentReplyId: r.parentId ? r.parentId : null,
        }));
        const replies = buildReplyTree(repliesRaw);
        setPost(
          postData
            ? {
                ...postData,
                userName: user?.name || undefined,
                replies: mapUserNamesToReplies(replies, users),
              }
            : null,
        );
      });
    }
  }, [postId]);

  const handleLikePost = async () => {
    if (!user || !postId) return;
    try {
      if (post?.isLiked) {
        await api.unlikePost(user.id, postId);
      } else {
        await api.likePost(user.id, postId);
      }
      // Refresh post data from backend
      const [postData, users] = await Promise.all([
        api.getPostDetail(postId, user.id),
        userService.getUsers(),
      ]);
      if (postData) {
        // Convert PostDetailReply[] to Reply[] for buildReplyTree
        const repliesRaw = (postData.replies ?? []).map((r: PostDetailReply) => ({
          id: r.id,
          content: r.content,
          author: r.author,
          postId: postId,
          createdAt: r.timestamp ? r.timestamp : new Date(),
          likes: r.likes,
          isLocked: r.isLocked ?? false,
          parentReplyId: r.parentId ? r.parentId : null,
        }));
        const replies = buildReplyTree(repliesRaw);
        const userObj = users.find((u: { id: string; name: string }) => u.id === postData.author);
        setPost({
          ...postData,
          userName: userObj?.name || undefined,
          replies: mapUserNamesToReplies(replies, users),
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update like. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleLikeReply = (replyId: string) => {
    const updateReplies = (replies: PostDetailReply[]): PostDetailReply[] => {
      return replies.map((reply) => {
        if (reply.id === replyId) {
          return {
            ...reply,
            isLiked: !reply.isLiked,
            likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
          };
        }
        if (reply.replies.length > 0) {
          return {
            ...reply,
            replies: updateReplies(reply.replies),
          };
        }
        return reply;
      });
    };
    setPost((prev) =>
      prev
        ? {
            ...prev,
            replies: updateReplies(prev.replies),
          }
        : prev,
    );
  };

  const handleSubmitReply = (parentId?: string) => {
    const content = parentId ? replyContent[parentId] : newReply;
    if (!content.trim()) return;
    const newReplyObj: PostDetailReply = {
      id: `reply-${Date.now()}`,
      author: user?.id ?? '',
      content: content,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      parentId: parentId,
      replies: [],
    };
    if (parentId) {
      const addReplyToParent = (replies: PostDetailReply[]): PostDetailReply[] => {
        return replies.map((reply) => {
          if (reply.id === parentId) {
            return {
              ...reply,
              replies: [...reply.replies, newReplyObj],
            };
          }
          if (reply.replies.length > 0) {
            return {
              ...reply,
              replies: addReplyToParent(reply.replies),
            };
          }
          return reply;
        });
      };
      setPost((prev) =>
        prev
          ? {
              ...prev,
              replies: addReplyToParent(prev.replies),
              comments: prev.comments + 1,
            }
          : prev,
      );
      setReplyContent((prev) => ({ ...prev, [parentId]: '' }));
      setReplyToId(null);
    } else {
      setPost((prev) =>
        prev
          ? {
              ...prev,
              replies: [...prev.replies, newReplyObj],
              comments: prev.comments + 1,
            }
          : prev,
      );
      setNewReply('');
    }
    toast({
      title: 'Reply posted',
      description: 'Your reply has been added to the discussion.',
    });
  };

  // Helper functions for locking/unlocking replies
  const handleLockReply = (replyId: string) => {
    setPost((prev) =>
      prev
        ? {
            ...prev,
            replies: lockReplyRecursive(prev.replies, replyId),
          }
        : prev,
    );
  };
  const handleUnlockReply = (replyId: string) => {
    setPost((prev) =>
      prev
        ? {
            ...prev,
            replies: unlockReplyRecursive(prev.replies, replyId),
          }
        : prev,
    );
  };

  if (!post) {
    return (
      <div className="p-4 md:p-6 min-h-screen bg-background">
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
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="space-y-4 max-w-2xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full mb-2 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen" data-testid="post-detail-page">
      {/* Breadcrumbs */}
      <div className="mb-6" data-testid="post-detail-breadcrumbs">
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
                <Link to={`/community/${post.communityId}`}>{post.communityName}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="w-full">
        {/* Main Post */}
        <Card
          className={`mb-6 w-full ${
            post.isPinned ? 'border-social-primary bg-social-accent/10' : ''
          }`}
          data-testid="post-detail-card"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <AppAvatar size="h-12 w-12">
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                </AppAvatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold" data-testid="post-title">
                      {post.title}
                    </h1>
                    {post.isPinned && (
                      <Pin className="h-5 w-5 text-social-primary" data-testid="post-pinned-icon" />
                    )}
                    {post.isLocked && (
                      <Lock className="h-5 w-5 text-red-500" data-testid="post-locked-icon" />
                    )}
                  </div>
                  <p className="text-sm text-social-muted" data-testid="post-author">
                    by <UserProfileLink userId={post.author} userName={post.userName} /> •{' '}
                    {formatDate(post.timestamp)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {isModerator && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPost((prev) => prev && { ...prev, isPinned: !prev.isPinned })}
                    className="text-xs"
                    data-testid="pin-post-btn"
                  >
                    <Pin className="h-3 w-3 mr-1" />
                    {post.isPinned ? 'Unpin' : 'Pin'}
                  </Button>
                )}
                {isModerator && post.isLocked ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPost(
                        (prev) =>
                          prev && {
                            ...prev,
                            isLocked: false,
                            lockReason: undefined,
                          },
                      )
                    }
                    className="text-xs border-green-400 text-green-500 hover:bg-green-50"
                    data-testid="unlock-post-btn"
                  >
                    <Unlock className="h-3 w-3 mr-1" />
                    Unlock Post
                  </Button>
                ) : isModerator ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPost(
                        (prev) =>
                          prev && {
                            ...prev,
                            isLocked: true,
                            lockReason: 'Locked by moderator',
                          },
                      )
                    }
                    className="text-xs border-red-400 text-red-500 hover:bg-red-50"
                    data-testid="lock-post-btn"
                  >
                    <Lock className="h-3 w-3 mr-1" />
                    Lock Post
                  </Button>
                ) : null}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-gray-400 hover:text-red-500"
                  onClick={() =>
                    openReportModal({
                      type: 'post',
                      postId: post.id,
                      communityId: post.communityId,
                      originalContent: post.content,
                    })
                  }
                  data-testid="report-post-btn"
                >
                  Report
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {post.isLocked && post.lockReason && (
              <div
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
                data-testid="post-locked-message"
              >
                <p className="text-sm text-red-700">
                  <Lock className="h-4 w-4 inline mr-1" />
                  <strong>Post Locked:</strong> {post.lockReason}
                </p>
              </div>
            )}

            <p
              className="text-social-foreground mb-4 text-lg leading-relaxed"
              data-testid="post-content"
            >
              {post.content}
            </p>

            <div className="flex flex-wrap gap-2 mb-4" data-testid="post-tags">
              {post.tags.map((tag, index) => (
                <InfoBadge key={index} type="tag" data-testid={`post-tag-${tag}`}>
                  {tag}
                </InfoBadge>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikePost}
                className={`flex items-center gap-2 ${
                  post.isLiked ? 'text-red-500' : 'text-social-muted'
                }`}
                disabled={post.isLocked}
                data-testid="like-post-btn"
              >
                <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                {post.likes}
              </Button>

              <div
                className="flex items-center gap-2 text-social-muted"
                data-testid="post-replies-count"
              >
                <MessageSquare className="h-4 w-4" />
                {post.comments} replies
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Replies Section */}
        <div className="space-y-4 w-full" data-testid="replies-section">
          <h2 className="text-xl font-semibold" data-testid="replies-title">
            Replies ({post.replies.length})
          </h2>

          {post.replies.map((reply) => (
            <PostReply
              key={reply.id}
              reply={reply}
              depth={0}
              isModerator={isModerator}
              postLocked={post.commentsLocked}
              replyToId={replyToId}
              replyContent={replyContent}
              setReplyToId={setReplyToId}
              setReplyContent={setReplyContent}
              handleLikeReply={handleLikeReply}
              handleSubmitReply={handleSubmitReply}
              handleLockReply={handleLockReply}
              handleUnlockReply={handleUnlockReply}
            />
          ))}

          {/* Main Reply Form */}
          {!post.isLocked && !post.commentsLocked && (
            <Card className="ml-4" data-testid="main-reply-form">
              <CardContent className="pt-4">
                <ReplyForm
                  value={newReply}
                  onChange={setNewReply}
                  onSubmit={() => handleSubmitReply()}
                  disabled={false}
                  placeholder="Write a reply..."
                  avatarSize="h-10 w-10"
                  buttonLabel="Reply"
                  dataTestIdInput="main-reply-input"
                  dataTestIdButton="main-reply-submit-btn"
                />
              </CardContent>
            </Card>
          )}

          {post.commentsLocked && post.commentsLockReason && (
            <div
              className="ml-4 p-3 bg-orange-50 border border-orange-200 rounded-md"
              data-testid="comments-locked-message"
            >
              <p className="text-sm text-orange-700">
                <Lock className="h-4 w-4 inline mr-1" />
                <strong>Comments Locked:</strong> {post.commentsLockReason}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Dialog */}
      {selectedUserId && (
        <UserProfileDialog
          userId={selectedUserId}
          isOpen={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
          data-testid="user-profile-dialog"
        />
      )}

      {/* Report Modal */}
      {reportContext && (
        <ReportModal
          open={reportModalOpen}
          onClose={closeReportModal}
          context={reportContext}
          reportedBy={user?.id ?? ''}
          onSubmitted={() =>
            toast({
              title: 'Report submitted',
              description: 'Thank you for helping us keep the community safe.',
            })
          }
          data-testid="report-modal"
        />
      )}
    </div>
  );
};

export default PostDetailPage;
