
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, MessageCircle, Share2, MoreVertical, 
  Pin, Lock, Unlock, AlertTriangle, Eye, Flag 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LockPostDialog from "./LockPostDialog";

interface CommunityPostProps {
  post: {
    id: string;
    title: string;
    content: string;
    author: string;
    timestamp: Date;
    likes: number;
    comments: number;
    isLiked: boolean;
    isPinned?: boolean;
    isLocked?: boolean;
    lockReason?: string;
    commentsLocked?: boolean;
    commentsLockReason?: string;
    tags?: string[];
  };
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
  isModerator = false 
}: CommunityPostProps) => {
  const { toast } = useToast();
  const [lockDialogOpen, setLockDialogOpen] = useState(false);
  const [lockType, setLockType] = useState<"post" | "comments">("post");

  const handleLockClick = (type: "post" | "comments") => {
    setLockType(type);
    setLockDialogOpen(true);
  };

  const handleLockConfirm = (reason: string) => {
    if (lockType === "post" && onLock) {
      onLock(post.id, reason);
    } else if (lockType === "comments" && onLockComments) {
      onLockComments(post.id, reason);
    }
  };

  const handleUnlock = (type: "post" | "comments") => {
    if (type === "post" && onUnlock) {
      onUnlock(post.id);
      toast({
        title: "Post Unlocked",
        description: "The post has been unlocked and is now available for editing.",
      });
    } else if (type === "comments" && onUnlockComments) {
      onUnlockComments(post.id);
      toast({
        title: "Comments Unlocked",
        description: "Comments have been unlocked and users can now reply.",
      });
    }
  };

  const handleReport = () => {
    toast({
      title: "Post Reported",
      description: "Thank you for reporting this post. Our moderators will review it.",
    });
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-social-primary text-white">
                <div className="flex h-full w-full items-center justify-center">
                  {post.author.charAt(0)}
                </div>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{post.author}</p>
                  {post.isPinned && (
                    <Badge variant="secondary" className="bg-social-accent/50 text-xs">
                      <Pin className="h-3 w-3 mr-1" />
                      Pinned
                    </Badge>
                  )}
                  {post.isLocked && (
                    <Badge variant="destructive" className="text-xs">
                      <Lock className="h-3 w-3 mr-1" />
                      Locked
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {post.timestamp.toLocaleString()}
                </p>
              </div>
            </div>
            
            {isModerator && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onPin && (
                    <DropdownMenuItem onClick={() => onPin(post.id)}>
                      <Pin className="h-4 w-4 mr-2" />
                      {post.isPinned ? "Unpin Post" : "Pin Post"}
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  
                  {post.isLocked ? (
                    <DropdownMenuItem onClick={() => handleUnlock("post")}>
                      <Unlock className="h-4 w-4 mr-2" />
                      Unlock Post
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => handleLockClick("post")}>
                      <Lock className="h-4 w-4 mr-2" />
                      Lock Post
                    </DropdownMenuItem>
                  )}
                  
                  {post.commentsLocked ? (
                    <DropdownMenuItem onClick={() => handleUnlock("comments")}>
                      <Unlock className="h-4 w-4 mr-2" />
                      Unlock Comments
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => handleLockClick("comments")}>
                      <Lock className="h-4 w-4 mr-2" />
                      Lock Comments
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-700">{post.content}</p>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-social-accent/50">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Lock notifications */}
          {post.isLocked && post.lockReason && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-center gap-2 text-red-700">
                <Lock className="h-4 w-4" />
                <span className="font-medium">This post has been locked</span>
              </div>
              <p className="text-sm text-red-600 mt-1">Reason: {post.lockReason}</p>
            </div>
          )}

          {post.commentsLocked && post.commentsLockReason && (
            <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
              <div className="flex items-center gap-2 text-orange-700">
                <Lock className="h-4 w-4" />
                <span className="font-medium">Comments have been locked</span>
              </div>
              <p className="text-sm text-orange-600 mt-1">Reason: {post.commentsLockReason}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike(post.id)}
                className={post.isLiked ? "text-red-500" : ""}
                disabled={post.isLocked}
              >
                <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                {post.likes}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onComment(post.id)}
                disabled={post.commentsLocked}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                {post.comments}
              </Button>
              
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
            
            {!isModerator && (
              <Button variant="ghost" size="sm" onClick={handleReport}>
                <Flag className="h-4 w-4 mr-1" />
                Report
              </Button>
            )}
          </div>
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
