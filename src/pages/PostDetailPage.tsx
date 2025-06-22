
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Heart, MessageSquare, Pin, Lock, User, Send, Home, ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useToast } from "@/components/ui/use-toast";

interface Reply {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
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
        isLiked: false
      },
      {
        id: "reply-2",
        author: "Bob Wilson",
        content: "Thanks for sharing! Do you have any recommendations for specific lens filters? I'm just starting out with landscape photography.",
        timestamp: new Date(2024, 5, 15, 16, 20),
        likes: 3,
        isLiked: true
      },
      {
        id: "reply-3",
        author: "Emma Davis",
        content: "This is so helpful! I've been struggling with exposure during golden hour. Your tip about bracketing shots is game-changing.",
        timestamp: new Date(2024, 5, 15, 17, 10),
        likes: 2,
        isLiked: false
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
    setPost(prev => ({
      ...prev,
      replies: prev.replies.map(reply =>
        reply.id === replyId
          ? {
              ...reply,
              isLiked: !reply.isLiked,
              likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
            }
          : reply
      )
    }));
  };

  const handleSubmitReply = () => {
    if (newReply.trim()) {
      const reply: Reply = {
        id: `reply-${Date.now()}`,
        author: "Current User",
        content: newReply,
        timestamp: new Date(),
        likes: 0,
        isLiked: false
      };

      setPost(prev => ({
        ...prev,
        replies: [...prev.replies, reply],
        comments: prev.comments + 1
      }));

      setNewReply("");
      toast({
        title: "Reply posted",
        description: "Your reply has been added to the discussion.",
      });
    }
  };

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
                    by {post.author} • {post.timestamp.toLocaleDateString()}
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
            <Card key={reply.id} className="ml-4">
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10 bg-social-primary text-white">
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium">{reply.author}</p>
                      <span className="text-sm text-gray-500">
                        {reply.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{reply.content}</p>
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Reply Form */}
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
                      onClick={handleSubmitReply}
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
