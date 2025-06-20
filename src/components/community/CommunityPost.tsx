import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageCircle, MoreHorizontal, Flag, Lock, Unlock, Ban, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LockPostDialog from "./LockPostDialog";

export interface User {
  id: string;
  name: string;
  isModerator?: boolean;
}

export interface Reply {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  likes: number;
  isLiked: boolean;
  isReported: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: Date;
  tags: string[];
  likes: number;
  isLiked: boolean;
  isReported: boolean;
  isLocked: boolean;
  areCommentsLocked: boolean;
  lockReason?: string;
  lockDate?: Date;
  lockedBy?: string;
  replies: Reply[];
}

interface CommunityPostProps {
  post: Post;
  currentUser: User;
  onLike: (postId: string) => void;
  onReply: (postId: string, content: string) => void;
  onLikeReply: (postId: string, replyId: string) => void;
  onReport: (postId: string) => void;
  onReportReply: (postId: string, replyId: string) => void;
  onLockPost?: (postId: string, reason: string) => void;
  onLockComments?: (postId: string, reason: string) => void;
  onUnlockPost?: (postId: string) => void;
  onUnlockComments?: (postId: string) => void;
}

const CommunityPost = ({ 
  post, 
  currentUser, 
  onLike, 
  onReply, 
  onLikeReply, 
  onReport, 
  onReportReply,
  onLockPost,
  onLockComments,
  onUnlockPost,
  onUnlockComments
}: CommunityPostProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [lockDialogOpen, setLockDialogOpen] = useState(false);
  const [lockType, setLockType] = useState<"post" | "comments">("post");
  const { toast } = useToast();

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(post.id, replyContent);
      setReplyContent("");
      setShowReplyForm(false);
    }
  };

  const handleLockClick = (type: "post" | "comments") => {
    setLockType(type);
    setLockDialogOpen(true);
  };

  const handleLockConfirm = (reason: string) => {
    if (lockType === "post" && onLockPost) {
      onLockPost(post.id, reason);
    } else if (lockType === "comments" && onLockComments) {
      onLockComments(post.id, reason);
    }
  };

  const handleUnlockPost = () => {
    if (onUnlockPost) {
      onUnlockPost(post.id);
    }
  };

  const handleUnlockComments = () => {
    if (onUnlockComments) {
      onUnlockComments(post.id);
    }
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="bg-social-primary text-white">
                <div className="flex h-full w-full items-center justify-center">
                  {post.author.name.charAt(0)}
                </div>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{post.author.name}</h3>
                  {post.author.isModerator && (
                    <Badge variant="outline" className="text-xs bg-social-accent/50">
                      Moderator
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-social-muted">{formatTimeAgo(post.createdAt)}</p>
              </div>
            </div>
            
            {currentUser.isModerator && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!post.isLocked ? (
                    <DropdownMenuItem onClick={() => handleLockClick("post")}>
                      <Lock className="h-4 w-4 mr-2" />
                      Lock Post
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={handleUnlockPost}>
                      <Unlock className="h-4 w-4 mr-2" />
                      Unlock Post
                    </DropdownMenuItem>
                  )}
                  {!post.areCommentsLocked ? (
                    <DropdownMenuItem onClick={() => handleLockClick("comments")}>
                      <Ban className="h-4 w-4 mr-2" />
                      Lock Comments
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={handleUnlockComments}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Unlock Comments
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onReport(post.id)}>
                    <Flag className="h-4 w-4 mr-2" />
                    Report Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-social-accent/50">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-social-foreground mb-4">{post.content}</p>
          
          {/* Lock notification */}
          {(post.isLocked || post.areCommentsLocked) && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {post.isLocked ? (
                  <Lock className="h-4 w-4 text-orange-600" />
                ) : (
                  <Ban className="h-4 w-4 text-orange-600" />
                )}
                <span className="font-medium text-orange-800">
                  {post.isLocked ? "This post has been locked" : "Comments have been locked"}
                </span>
              </div>
              {post.lockReason && (
                <p className="text-sm text-orange-700">
                  <strong>Reason:</strong> {post.lockReason}
                </p>
              )}
              {post.lockDate && post.lockedBy && (
                <p className="text-xs text-orange-600 mt-1">
                  Locked by {post.lockedBy} on {post.lockDate.toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onLike(post.id)}
              disabled={post.isLocked}
              className={post.isLiked ? "text-red-500" : ""}
            >
              <Heart className={`h-4 w-4 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
              {post.likes}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowReplyForm(!showReplyForm)}
              disabled={post.isLocked || post.areCommentsLocked}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {post.replies.length} replies
            </Button>

            {!currentUser.isModerator && (
              <Button variant="ghost" size="sm" onClick={() => onReport(post.id)}>
                <Flag className="h-4 w-4 mr-2" />
                Report
              </Button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && !post.isLocked && !post.areCommentsLocked && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <Textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="mb-3"
              />
              <div className="flex gap-2">
                <Button onClick={handleSubmitReply} size="sm">
                  Post Reply
                </Button>
                <Button variant="outline" onClick={() => setShowReplyForm(false)} size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Replies */}
          {post.replies.length > 0 && (
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-social-primary">Replies</h4>
              {post.replies.map(reply => (
                <div key={reply.id} className="border-l-2 border-social-accent/30 pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6 bg-social-secondary text-white text-xs">
                        <div className="flex h-full w-full items-center justify-center">
                          {reply.author.name.charAt(0)}
                        </div>
                      </Avatar>
                      <span className="text-sm font-medium">{reply.author.name}</span>
                      {reply.author.isModerator && (
                        <Badge variant="outline" className="text-xs bg-social-accent/50">
                          Moderator
                        </Badge>
                      )}
                      <span className="text-xs text-social-muted">{formatTimeAgo(reply.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-sm mb-2">{reply.content}</p>
                  <div className="flex items-center space-x-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onLikeReply(post.id, reply.id)}
                      className={reply.isLiked ? "text-red-500" : ""}
                    >
                      <Heart className={`h-3 w-3 mr-1 ${reply.isLiked ? 'fill-current' : ''}`} />
                      {reply.likes}
                    </Button>
                    {!currentUser.isModerator && (
                      <Button variant="ghost" size="sm" onClick={() => onReportReply(post.id, reply.id)}>
                        <Flag className="h-3 w-3 mr-1" />
                        Report
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <LockPostDialog
        isOpen={lockDialogOpen}
        onClose={() => setLockDialogOpen(false)}
        onConfirm={handleLockConfirm}
        postTitle={post.title}
        type={lockType}
      />
    </>
  );
};

export default CommunityPost;
