
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Heart, MessageSquare, Pin, Lock, Unlock, User } from "lucide-react";
import LockPostDialog from "./LockPostDialog";

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
}

interface CommunityPostProps {
  post: PostData;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onPin?: (postId: string) => void;
  onLock?: (postId: string, reason: string) => void;
  onUnlock?: (postId: string) => void;
  onLockComments?: (postId: string, reason: string) => void;
  onUnlockComments?: (postId: string) => void;
  isModerator?: boolean;
}

const CommunityPost = ({
  post,
  onLike,
  onComment,
  onPin,
  onLock,
  onUnlock,
  onLockComments,
  onUnlockComments,
  isModerator = false,
}: CommunityPostProps) => {
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [lockType, setLockType] = useState<"post" | "comments">("post");

  const handleLockClick = (type: "post" | "comments") => {
    setLockType(type);
    setShowLockDialog(true);
  };

  const handleLockConfirm = (reason: string) => {
    if (lockType === "post" && onLock) {
      onLock(post.id, reason);
    } else if (lockType === "comments" && onLockComments) {
      onLockComments(post.id, reason);
    }
    setShowLockDialog(false);
  };

  return (
    <>
      <Card className={`mb-4 ${post.isPinned ? "border-social-primary bg-social-accent/10" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-social-primary text-white">
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  {post.isPinned && (
                    <Pin className="h-4 w-4 text-social-primary" />
                  )}
                  {post.isLocked && (
                    <Lock className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <p className="text-sm text-social-muted">
                  by {post.author} • {post.timestamp.toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {isModerator && (
              <div className="flex gap-2">
                {onPin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPin(post.id)}
                    className="text-xs"
                  >
                    <Pin className="h-3 w-3 mr-1" />
                    {post.isPinned ? "Unpin" : "Pin"}
                  </Button>
                )}
                
                {post.isLocked ? (
                  onUnlock && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUnlock(post.id)}
                      className="text-xs border-green-400 text-green-500 hover:bg-green-50"
                    >
                      <Unlock className="h-3 w-3 mr-1" />
                      Unlock Post
                    </Button>
                  )
                ) : (
                  onLock && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLockClick("post")}
                      className="text-xs border-red-400 text-red-500 hover:bg-red-50"
                    >
                      <Lock className="h-3 w-3 mr-1" />
                      Lock Post
                    </Button>
                  )
                )}
                
                {post.commentsLocked ? (
                  onUnlockComments && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUnlockComments(post.id)}
                      className="text-xs border-green-400 text-green-500 hover:bg-green-50"
                    >
                      <Unlock className="h-3 w-3 mr-1" />
                      Unlock Comments
                    </Button>
                  )
                ) : (
                  onLockComments && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLockClick("comments")}
                      className="text-xs border-orange-400 text-orange-500 hover:bg-orange-50"
                    >
                      <Lock className="h-3 w-3 mr-1" />
                      Lock Comments
                    </Button>
                  )
                )}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {post.isLocked && post.lockReason && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">
                <Lock className="h-4 w-4 inline mr-1" />
                <strong>Post Locked:</strong> {post.lockReason}
              </p>
            </div>
          )}
          
          {post.commentsLocked && post.commentsLockReason && (
            <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <p className="text-sm text-orange-700">
                <Lock className="h-4 w-4 inline mr-1" />
                <strong>Comments Locked:</strong> {post.commentsLockReason}
              </p>
            </div>
          )}
          
          <p className="text-social-foreground mb-4">{post.content}</p>
          
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
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-2 ${
                post.isLiked ? "text-red-500" : "text-social-muted"
              }`}
              disabled={post.isLocked}
            >
              <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
              {post.likes}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment(post.id)}
              className="flex items-center gap-2 text-social-muted"
              disabled={post.commentsLocked}
            >
              <MessageSquare className="h-4 w-4" />
              {post.comments}
            </Button>
          </div>
        </CardContent>
      </Card>

      <LockPostDialog
        isOpen={showLockDialog}
        onClose={() => setShowLockDialog(false)}
        onConfirm={handleLockConfirm}
        contentType={lockType}
      />
    </>
  );
};

export default CommunityPost;
