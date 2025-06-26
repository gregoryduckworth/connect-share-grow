import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { PostDetailData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import {
  Heart,
  MessageSquare,
  Pin,
  Lock,
  User,
  Send,
  Home,
  ChevronRight,
  Reply,
  Unlock,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useToast } from "@/components/ui/use-toast";
import ReportModal from "@/components/ui/ReportModal";
import UserProfileLink from "@/components/user/UserProfileLink";
import UserProfileDialog from "@/components/user/UserProfileDialog";

interface Reply {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  isLocked?: boolean;
  lockReason?: string;
  parentId?: string;
  replies: Reply[];
}

const PostDetailPage = () => {
  const { communityId, postId } = useParams();
  const { toast } = useToast();
  const [newReply, setNewReply] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>(
    {}
  );
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportContext, setReportContext] = useState<{
    type: "post" | "reply";
    postId: string;
    replyId?: string;
    communityId?: string;
    originalContent?: string;
  } | null>(null);

  const [post, setPost] = useState<PostDetailData | null>(null);
  const [isModerator, setIsModerator] = useState(true); // TODO: Replace with real user/role logic

  useEffect(() => {
    if (postId) {
      api.getPostDetail(postId).then(setPost);
    }
  }, [postId]);

  // Add a 3rd level reply to the mock data for demonstration
  useEffect(() => {
    if (
      post &&
      post.replies.length > 0 &&
      post.replies[0].replies[0] &&
      (!post.replies[0].replies[0].replies ||
        post.replies[0].replies[0].replies.length === 0)
    ) {
      setPost((prev) => {
        if (!prev) return prev;
        const updated = { ...prev };
        if (updated.replies[0] && updated.replies[0].replies[0]) {
          updated.replies[0].replies[0].replies = [
            {
              id: "reply-3",
              author: "Third Level User",
              content: "This is a 3rd level reply for visual testing.",
              timestamp: new Date(),
              likes: 1,
              isLiked: false,
              parentId: updated.replies[0].replies[0].id,
              replies: [],
            },
          ];
        }
        return updated;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post && post.replies.length > 0 && post.replies[0].replies[0]]);

  if (!post) {
    return null; // or a loading spinner, or any placeholder you prefer
  }

  const handleLikePost = () => {
    setPost((prev) => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
    }));
  };

  const handleLikeReply = (replyId: string) => {
    const updateReplies = (replies: Reply[]): Reply[] => {
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

    setPost((prev) => ({
      ...prev,
      replies: updateReplies(prev.replies),
    }));
  };

  const handleSubmitReply = (parentId?: string) => {
    const content = parentId ? replyContent[parentId] : newReply;
    if (!content.trim()) return;

    const newReplyObj: Reply = {
      id: `reply-${Date.now()}`,
      author: "Current User",
      content: content,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      parentId: parentId,
      replies: [],
    };

    if (parentId) {
      const addReplyToParent = (replies: Reply[]): Reply[] => {
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

      setPost((prev) => ({
        ...prev,
        replies: addReplyToParent(prev.replies),
        comments: prev.comments + 1,
      }));

      setReplyContent((prev) => ({ ...prev, [parentId]: "" }));
      setReplyToId(null);
    } else {
      setPost((prev) => ({
        ...prev,
        replies: [...prev.replies, newReplyObj],
        comments: prev.comments + 1,
      }));
      setNewReply("");
    }

    toast({
      title: "Reply posted",
      description: "Your reply has been added to the discussion.",
    });
  };

  const currentUserId = "user-1"; // TODO: Replace with actual user context

  const openReportModal = (context: typeof reportContext) => {
    setReportContext(context);
    setReportModalOpen(true);
  };
  const closeReportModal = () => setReportModalOpen(false);

  const ReplyComponent = ({
    reply,
    depth = 0,
  }: {
    reply: Reply;
    depth?: number;
  }) => (
    <Card
      className={`mb-4 rounded-xl shadow-sm w-full ${
        depth % 2 === 0
          ? "bg-white border border-gray-200"
          : "bg-gray-200 border border-gray-300"
      } ${depth > 0 ? "ml-8 max-w-[calc(100%-2rem)]" : "ml-4 max-w-full"} ${
        depth > 2 ? "border-l-4 border-blue-200 pl-6" : ""
      }`}
    >
      <CardContent className="pt-4 pb-4 px-6">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 bg-social-primary text-white">
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-5 w-5" />
            </div>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 justify-between">
              <div className="flex items-center gap-2">
                <UserProfileLink
                  userId={`user-${reply.author
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  userName={reply.author}
                  currentUserId={"current-user-id"}
                />
                <span className="text-sm text-gray-400 font-normal">
                  {reply.timestamp.toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                {isModerator &&
                  (reply.isLocked ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Unlock reply
                        setPost((prev) => {
                          if (!prev) return prev;
                          const unlockReply = (replies: Reply[]): Reply[] =>
                            replies.map((r) =>
                              r.id === reply.id
                                ? {
                                    ...r,
                                    isLocked: false,
                                    lockReason: undefined,
                                  }
                                : {
                                    ...r,
                                    replies: unlockReply(r.replies),
                                  }
                            );
                          return {
                            ...prev,
                            replies: unlockReply(prev.replies),
                          };
                        });
                      }}
                      className="text-xs border-green-400 text-green-500 hover:bg-green-50"
                    >
                      <Unlock className="h-3 w-3 mr-1" />
                      Unlock Reply
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Lock reply
                        setPost((prev) => {
                          if (!prev) return prev;
                          const lockReply = (replies: Reply[]): Reply[] =>
                            replies.map((r) =>
                              r.id === reply.id
                                ? {
                                    ...r,
                                    isLocked: true,
                                    lockReason: "Locked by moderator",
                                  }
                                : {
                                    ...r,
                                    replies: lockReply(r.replies),
                                  }
                            );
                          return {
                            ...prev,
                            replies: lockReply(prev.replies),
                          };
                        });
                      }}
                      className="text-xs border-red-400 text-red-500 hover:bg-red-50"
                    >
                      <Lock className="h-3 w-3 mr-1" />
                      Lock Reply
                    </Button>
                  ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-gray-400 hover:text-red-500 px-2 py-0 h-auto"
                  onClick={() =>
                    openReportModal({
                      type: "reply",
                      postId: post.id,
                      replyId: reply.id,
                      communityId: post.communityId,
                      originalContent: reply.content,
                    })
                  }
                >
                  Report
                </Button>
              </div>
            </div>
            <p className="text-gray-700 mb-4 text-[1.08rem] leading-relaxed">
              {reply.isLocked ? (
                <span className="italic text-gray-400">
                  [This reply has been locked and its content is redacted]
                </span>
              ) : (
                reply.content
              )}
            </p>
            {reply.isLocked && reply.lockReason && (
              <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-xs text-red-700">
                  <Lock className="h-3 w-3 inline mr-1" />
                  <strong>Reply Locked:</strong> {reply.lockReason}
                </p>
              </div>
            )}
            <div className="flex items-center gap-4 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLikeReply(reply.id)}
                className={`flex items-center gap-1 text-sm ${
                  reply.isLiked ? "text-red-500" : "text-gray-500"
                }`}
                disabled={post.commentsLocked}
              >
                <Heart
                  className={`h-3 w-3 ${reply.isLiked ? "fill-current" : ""}`}
                />
                {reply.likes}
              </Button>
              {/* Only show Reply button if reply is not locked and post comments are not locked */}
              {!reply.isLocked && !post.commentsLocked && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setReplyToId(replyToId === reply.id ? null : reply.id)
                  }
                  className="flex items-center gap-1 text-sm text-gray-500"
                >
                  <Reply className="h-3 w-3" />
                  Reply
                </Button>
              )}
            </div>
            {/* Reply form for this specific reply */}
            {replyToId === reply.id &&
              !post.commentsLocked &&
              !reply.isLocked && (
                <div className="mt-4 flex gap-3">
                  <Avatar className="h-8 w-8 bg-social-primary text-white">
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  </Avatar>
                  <div className="flex-1 flex gap-3">
                    <Textarea
                      placeholder={`Reply to ${reply.author}...`}
                      value={replyContent[reply.id] || ""}
                      onChange={(e) =>
                        setReplyContent((prev) => ({
                          ...prev,
                          [reply.id]: e.target.value,
                        }))
                      }
                      className="flex-1"
                      rows={2}
                    />
                    <Button
                      onClick={() => handleSubmitReply(reply.id)}
                      disabled={!replyContent[reply.id]?.trim()}
                      size="sm"
                      className="self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
          </div>
        </div>
      </CardContent>
      {/* Render nested replies */}
      {reply.replies.length > 0 && (
        <div className="space-y-2 mt-2">
          {reply.replies.map((nestedReply) => (
            <ReplyComponent
              key={nestedReply.id}
              reply={nestedReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </Card>
  );

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
                <Link to={`/community/${communityId}`}>
                  {post.communityName}
                </Link>
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
            post.isPinned ? "border-social-primary bg-social-accent/10" : ""
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 bg-social-primary text-white">
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                    {post.isPinned && (
                      <Pin className="h-5 w-5 text-social-primary" />
                    )}
                    {post.isLocked && <Lock className="h-5 w-5 text-red-500" />}
                  </div>
                  <p className="text-sm text-social-muted">
                    by{" "}
                    <UserProfileLink
                      userId={`user-${post.author
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      userName={post.author}
                      currentUserId={"current-user-id"}
                    />{" "}
                    • {post.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {isModerator && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPost(
                        (prev) => prev && { ...prev, isPinned: !prev.isPinned }
                      )
                    }
                    className="text-xs"
                  >
                    <Pin className="h-3 w-3 mr-1" />
                    {post.isPinned ? "Unpin" : "Pin"}
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
                          }
                      )
                    }
                    className="text-xs border-green-400 text-green-500 hover:bg-green-50"
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
                            lockReason: "Locked by moderator",
                          }
                      )
                    }
                    className="text-xs border-red-400 text-red-500 hover:bg-red-50"
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
                      type: "post",
                      postId: post.id,
                      communityId: post.communityId,
                      originalContent: post.content,
                    })
                  }
                >
                  Report
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {post.isLocked && post.lockReason && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">
                  <Lock className="h-4 w-4 inline mr-1" />
                  <strong>Post Locked:</strong> {post.lockReason}
                </p>
              </div>
            )}

            <p className="text-social-foreground mb-4 text-lg leading-relaxed">
              {post.content}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikePost}
                className={`flex items-center gap-2 ${
                  post.isLiked ? "text-red-500" : "text-social-muted"
                }`}
                disabled={post.isLocked}
              >
                <Heart
                  className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`}
                />
                {post.likes}
              </Button>

              <div className="flex items-center gap-2 text-social-muted">
                <MessageSquare className="h-4 w-4" />
                {post.comments} replies
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Replies Section */}
        <div className="space-y-4 w-full">
          <h2 className="text-xl font-semibold">
            Replies ({post.replies.length})
          </h2>

          {post.replies.map((reply) => (
            <ReplyComponent key={reply.id} reply={reply} />
          ))}

          {/* Main Reply Form */}
          {!post.isLocked && !post.commentsLocked && (
            <Card className="ml-4">
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10 bg-social-primary text-white">
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                  </Avatar>
                  <div className="flex-1 flex gap-3">
                    <Textarea
                      placeholder="Write a reply..."
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      className="flex-1"
                      rows={3}
                    />
                    <Button
                      onClick={() => handleSubmitReply()}
                      disabled={!newReply.trim()}
                      className="self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {post.commentsLocked && post.commentsLockReason && (
            <div className="ml-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
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
          currentUserId="current-user-id"
        />
      )}

      {/* Report Modal */}
      {reportContext && (
        <ReportModal
          open={reportModalOpen}
          onClose={closeReportModal}
          context={reportContext}
          reportedBy={currentUserId}
          onSubmitted={() =>
            toast({
              title: "Report submitted",
              description: "Thank you for helping us keep the community safe.",
            })
          }
        />
      )}
    </div>
  );
};

export default PostDetailPage;
