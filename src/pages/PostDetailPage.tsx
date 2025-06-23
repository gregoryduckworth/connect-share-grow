import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Heart, MessageSquare, Pin, Lock, User, Send, Home, ChevronRight, Reply } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useToast } from "@/components/ui/use-toast";
import UserProfileDialog from "@/components/user/UserProfileDialog";

interface Reply {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  parentId?: string;
  replies: Reply[];
}

interface PostData {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
  isPinned: boolean;
  isLocked: boolean;
  commentsLocked: boolean;
  tags: string[];
  lockReason?: string;
  commentsLockReason?: string;
  replies: Reply[];
  communityId: string;
  communityName: string;
}

const PostDetailPage = () => {
  const { communityId, postId } = useParams();
  const { toast } = useToast();
  const [newReply, setNewReply] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<{[key: string]: string}>({});

  // Mock data - in a real app, this would come from an API
  const [post, setPost] = useState<PostData>({
    id: postId || "1",
    title: "Golden Hour Landscape Tips",
    content: "Here are some techniques I've learned for capturing stunning golden hour landscapes. The key is to arrive early and scout your location during the day. Understanding how the light will hit your subject is crucial for getting that perfect shot.",
    author: "Sarah Johnson",
    timestamp: new Date(2024, 5, 15, 14, 30),
    likes: 24,
    comments: 8,
    isLiked: false,
    isPinned: true,
    isLocked: false,
    commentsLocked: false,
    tags: ["Landscape", "Golden Hour", "Tips"],
    communityId: communityId || "1",
    communityName: "Photography Enthusiasts",
    replies: [
      {
        id: "reply-1",
        author: "Alice Cooper",
        content: "Great tips! I especially love the advice about using graduated filters. Do you have any specific brand recommendations?",
        timestamp: new Date(2024, 5, 15, 15, 45),
        likes: 5,
        isLiked: false,
        replies: [
          {
            id: "reply-1-1",
            author: "Sarah Johnson",
            content: "I personally use Lee Filters - they're a bit pricey but the quality is excellent. Cokin is also a good budget option!",
            timestamp: new Date(2024, 5, 15, 16, 15),
            likes: 3,
            isLiked: false,
            parentId: "reply-1",
            replies: []
          }
        ]
      },
      {
        id: "reply-2",
        author: "Bob Wilson",
        content: "Thanks for sharing! Do you have any recommendations for specific lens filters? I'm just starting out with landscape photography.",
        timestamp: new Date(2024, 5, 15, 16, 20),
        likes: 3,
        isLiked: true,
        replies: []
      },
      {
        id: "reply-3",
        author: "Emma Davis",
        content: "This is so helpful! I've been struggling with exposure during golden hour. Your tip about bracketing shots is game-changing.",
        timestamp: new Date(2024, 5, 15, 17, 10),
        likes: 2,
        isLiked: false,
        replies: []
      }
    ]
  });

  const handleLikePost = () => {
    setPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
    }));
  };

  const handleLikeReply = (replyId: string) => {
    const updateReplies = (replies: Reply[]): Reply[] => {
      return replies.map(reply => {
        if (reply.id === replyId) {
          return {
            ...reply,
            isLiked: !reply.isLiked,
            likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
          };
        }
        if (reply.replies.length > 0) {
          return {
            ...reply,
            replies: updateReplies(reply.replies)
          };
        }
        return reply;
      });
    };

    setPost(prev => ({
      ...prev,
      replies: updateReplies(prev.replies)
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
      replies: []
    };

    if (parentId) {
      const addReplyToParent = (replies: Reply[]): Reply[] => {
        return replies.map(reply => {
          if (reply.id === parentId) {
            return {
              ...reply,
              replies: [...reply.replies, newReplyObj]
            };
          }
          if (reply.replies.length > 0) {
            return {
              ...reply,
              replies: addReplyToParent(reply.replies)
            };
          }
          return reply;
        });
      };

      setPost(prev => ({
        ...prev,
        replies: addReplyToParent(prev.replies),
        comments: prev.comments + 1
      }));

      setReplyContent(prev => ({ ...prev, [parentId]: "" }));
      setReplyToId(null);
    } else {
      setPost(prev => ({
        ...prev,
        replies: [...prev.replies, newReplyObj],
        comments: prev.comments + 1
      }));
      setNewReply("");
    }

    toast({
      title: "Reply posted",
      description: "Your reply has been added to the discussion.",
    });
  };

  const ReplyComponent = ({ reply, depth = 0 }: { reply: Reply; depth?: number }) => (
    <Card className={`${depth > 0 ? 'ml-8' : 'ml-4'} ${depth > 2 ? 'border-l-2 border-gray-200 pl-4' : ''}`}>
      <CardContent className="pt-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 bg-social-primary text-white">
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-5 w-5" />
            </div>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <UserProfileDialog username={reply.author}>
                <button className="font-medium hover:text-social-primary transition-colors cursor-pointer">
                  {reply.author}
                </button>
              </UserProfileDialog>
              <span className="text-sm text-gray-500">
                {reply.timestamp.toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 mb-3">{reply.content}</p>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLikeReply(reply.id)}
                className={`flex items-center gap-1 text-sm ${
                  reply.isLiked ? "text-red-500" : "text-gray-500"
                }`}
                disabled={post.commentsLocked}
              >
                <Heart className={`h-3 w-3 ${reply.isLiked ? "fill-current" : ""}`} />
                {reply.likes}
              </Button>
              
              {!post.commentsLocked && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyToId(replyToId === reply.id ? null : reply.id)}
                  className="flex items-center gap-1 text-sm text-gray-500"
                >
                  <Reply className="h-3 w-3" />
                  Reply
                </Button>
              )}
            </div>
            
            {/* Reply form for this specific reply */}
            {replyToId === reply.id && !post.commentsLocked && (
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
                    onChange={(e) => setReplyContent(prev => ({ ...prev, [reply.id]: e.target.value }))}
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
            <ReplyComponent key={nestedReply.id} reply={nestedReply} depth={depth + 1} />
          ))}
        </div>
      )}
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-6">
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
                <Link to={`/community/${communityId}`}>{post.communityName}</Link>
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

      <div className="max-w-4xl mx-auto">
        {/* Main Post */}
        <Card className={`mb-6 ${post.isPinned ? "border-social-primary bg-social-accent/10" : ""}`}>
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
                    {post.isPinned && <Pin className="h-5 w-5 text-social-primary" />}
                    {post.isLocked && <Lock className="h-5 w-5 text-red-500" />}
                  </div>
                  <p className="text-sm text-social-muted">
                    by <UserProfileDialog username={post.author}>
                      <button className="hover:text-social-primary transition-colors cursor-pointer">
                        {post.author}
                      </button>
                    </UserProfileDialog> • {post.timestamp.toLocaleDateString()}
                  </p>
                </div>
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
            
            <p className="text-social-foreground mb-4 text-lg leading-relaxed">{post.content}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-social-accent/50">
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
                <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
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
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Replies ({post.replies.length})</h2>
          
          {post.replies.map((reply) => (
            <ReplyComponent key={reply.id} reply={reply} />
          ))}

          {/* Main Reply Form */}
          {!post.commentsLocked && (
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
    </div>
  );
};

export default PostDetailPage;
