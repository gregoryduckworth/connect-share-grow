
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, AlertTriangle, Lock, Eye, ThumbsUp, Flag } from "lucide-react";

export interface User {
  id: string;
  name: string;
  avatar?: string;
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
  replies: Reply[];
}

interface CommunityPostProps {
  post: Post;
  currentUser?: User;
  onLike: (postId: string) => void;
  onReply: (postId: string, content: string) => void;
  onLikeReply: (postId: string, replyId: string) => void;
  onReport: (postId: string) => void;
  onReportReply: (postId: string, replyId: string) => void;
  onLockPost?: (postId: string) => void;
  onLockComments?: (postId: string) => void;
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
}: CommunityPostProps) => {
  const { toast } = useToast();
  const [replyContent, setReplyContent] = useState("");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportingReplyId, setReportingReplyId] = useState<string | null>(null);

  const isModerator = currentUser?.isModerator;
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSubmitReply = () => {
    if (replyContent.trim().length === 0) {
      toast({
        title: "Error",
        description: "Reply content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    onReply(post.id, replyContent);
    setReplyContent("");
  };

  const handleReport = () => {
    if (reportReason.trim().length === 0) {
      toast({
        title: "Error",
        description: "Please provide a reason for reporting",
        variant: "destructive",
      });
      return;
    }

    if (reportingReplyId) {
      onReportReply(post.id, reportingReplyId);
    } else {
      onReport(post.id);
    }
    
    toast({
      title: "Report submitted",
      description: "Thank you for helping keep our community safe.",
    });
    
    setIsReportDialogOpen(false);
    setReportReason("");
    setReportingReplyId(null);
  };

  const openReportDialog = (replyId?: string) => {
    setReportingReplyId(replyId || null);
    setIsReportDialogOpen(true);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{post.author.name}</span>
                {post.author.isModerator && (
                  <Badge variant="outline" className="text-xs bg-social-accent/50">Moderator</Badge>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {post.isLocked && (
              <Badge variant="outline" className="bg-red-100 text-red-800 flex gap-1 items-center">
                <Lock className="h-3 w-3" />
                <span>Locked</span>
              </Badge>
            )}
            {isModerator && !post.isLocked && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => onLockPost?.(post.id)}
              >
                <Lock className="h-3 w-3 mr-1" />
                Lock Post
              </Button>
            )}
          </div>
        </div>
        <CardTitle className="text-xl mt-2">{post.title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-1">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-social-accent/50 text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {post.isLocked ? (
          <div className="flex flex-col items-center justify-center p-6 text-center bg-slate-50 rounded-md">
            <Lock className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-600">This post has been locked by a moderator</p>
          </div>
        ) : (
          <div className="prose max-w-none">
            <p>{post.content}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 pt-0">
        <div className="flex justify-between w-full">
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onLike(post.id)}
              disabled={post.isLocked}
              className={post.isLiked ? "text-social-primary" : ""}
            >
              <ThumbsUp className={`h-4 w-4 mr-1 ${post.isLiked ? "fill-social-primary" : ""}`} />
              {post.likes} Like{post.likes !== 1 ? "s" : ""}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              disabled={post.isLocked || post.areCommentsLocked}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              {post.replies.length} Repl{post.replies.length !== 1 ? "ies" : "y"}
            </Button>
            
          </div>
          <div className="flex space-x-2">
            {!post.isReported && !post.isLocked && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-orange-500"
                onClick={() => openReportDialog()}
              >
                <Flag className="h-4 w-4 mr-1" />
                Report
              </Button>
            )}
            {isModerator && !post.areCommentsLocked && (
              <Button
                variant="ghost"
                size="sm"
                className="text-amber-600"
                onClick={() => onLockComments?.(post.id)}
              >
                <Lock className="h-4 w-4 mr-1" />
                Lock Comments
              </Button>
            )}
          </div>
        </div>

        {/* Reply section */}
        {!post.isLocked && !post.areCommentsLocked && (
          <div className="w-full">
            <Textarea
              placeholder="Write a reply..."
              className="w-full mb-2"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitReply}
                className="bg-social-primary hover:bg-social-secondary"
              >
                Reply
              </Button>
            </div>
          </div>
        )}
        
        {/* Comments are locked message */}
        {post.areCommentsLocked && !post.isLocked && (
          <div className="w-full p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-2 text-sm text-amber-700">
            <Lock className="h-4 w-4" />
            <span>Comments have been locked by a moderator</span>
          </div>
        )}
        
        {/* Replies */}
        {post.replies.length > 0 && (
          <div className="w-full border-t pt-4 mt-2 space-y-4">
            <h3 className="text-lg font-medium">Replies</h3>
            
            {post.replies.map((reply) => (
              <div key={reply.id} className="border-l-2 border-gray-200 pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6" />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-sm">{reply.author.name}</span>
                        {reply.author.isModerator && (
                          <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-social-accent/50">Mod</Badge>
                        )}
                        <span className="text-xs text-gray-500">· {formatDate(reply.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  {!reply.isReported && !post.areCommentsLocked && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-orange-500 h-6 p-0 px-1"
                      onClick={() => openReportDialog(reply.id)}
                    >
                      <Flag className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                <div className="mt-1 text-sm">{reply.content}</div>
                
                <div className="mt-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onLikeReply(post.id, reply.id)}
                    className={`h-6 px-2 text-xs ${reply.isLiked ? "text-social-primary" : ""}`}
                  >
                    <ThumbsUp className={`h-3 w-3 mr-1 ${reply.isLiked ? "fill-social-primary" : ""}`} />
                    {reply.likes}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardFooter>

      {/* Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Report {reportingReplyId ? 'Reply' : 'Post'}
            </DialogTitle>
            <DialogDescription>
              Please tell us why you're reporting this {reportingReplyId ? 'reply' : 'post'}. 
              Reports are sent to community moderators for review.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            placeholder="Describe why you're reporting this content..."
            className="min-h-[100px]"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsReportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReport}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CommunityPost;
