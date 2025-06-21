
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Plus, Settings } from "lucide-react";
import CommunityPost from "@/components/community/CommunityPost";
import CreatePostForm from "@/components/community/CreatePostForm";
import ModeratorPanel from "@/components/community/ModeratorPanel";

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

const CommunityDetailPage = () => {
  const { communityId } = useParams();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showModPanel, setShowModPanel] = useState(false);
  
  // Mock data - in a real app, this would come from an API
  const community = {
    id: communityId || "1",
    name: "Photography Enthusiasts",
    description: "A place for photographers to share their work and discuss techniques",
    memberCount: 1250,
    postCount: 423,
    tags: ["Photography", "Art", "Camera", "Editing"],
    isMember: true,
    isModerator: true,
    rules: [
      "Be respectful to all members",
      "No spam or self-promotion without approval",
      "Share constructive feedback on others' work",
      "Use appropriate tags for your posts",
      "No inappropriate or offensive content"
    ]
  };

  const [posts, setPosts] = useState<PostData[]>([
    {
      id: "1",
      title: "Golden Hour Landscape Tips",
      content: "Here are some techniques I've learned for capturing stunning golden hour landscapes...",
      author: "Sarah Johnson",
      timestamp: new Date(2024, 5, 15, 14, 30),
      likes: 24,
      comments: 8,
      isLiked: false,
      isPinned: true,
      isLocked: false,
      commentsLocked: false,
      tags: ["Landscape", "Golden Hour", "Tips"]
    },
    {
      id: "2",
      title: "Street Photography Ethics",
      content: "Let's discuss the ethical considerations when photographing strangers in public spaces...",
      author: "Mike Chen",
      timestamp: new Date(2024, 5, 14, 10, 15),
      likes: 15,
      comments: 12,
      isLiked: true,
      isPinned: false,
      isLocked: false,
      commentsLocked: false,
      tags: ["Street Photography", "Ethics", "Discussion"]
    },
    {
      id: "3",
      title: "Camera Gear Recommendations",
      content: "Looking for advice on upgrading my camera setup for wildlife photography...",
      author: "Alex Rivera",
      timestamp: new Date(2024, 5, 13, 16, 45),
      likes: 31,
      comments: 18,
      isLiked: false,
      isPinned: false,
      isLocked: true,
      commentsLocked: false,
      tags: ["Gear", "Wildlife", "Advice"],
      lockReason: "Post contains outdated information and may mislead new photographers"
    }
  ]);

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  const handleCommentPost = (postId: string) => {
    console.log(`Comment on post ${postId}`);
  };

  const handlePinPost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, isPinned: !post.isPinned } : post
    ));
  };

  const handleLockPost = (postId: string, reason: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLocked: true, lockReason: reason }
        : post
    ));
  };

  const handleUnlockPost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLocked: false, lockReason: undefined }
        : post
    ));
  };

  const handleLockComments = (postId: string, reason: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, commentsLocked: true, commentsLockReason: reason }
        : post
    ));
  };

  const handleUnlockComments = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, commentsLocked: false, commentsLockReason: undefined }
        : post
    ));
  };

  const handleCreatePost = (title: string, content: string, tags: string[]) => {
    const newPost: PostData = {
      id: Date.now().toString(),
      title,
      content,
      author: "Current User",
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      isLiked: false,
      isPinned: false,
      isLocked: false,
      commentsLocked: false,
      tags
    };
    
    setPosts([newPost, ...posts]);
    setShowCreatePost(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Community Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-social-primary mb-2">
                  {community.name}
                </h1>
                <p className="text-social-muted mb-4">{community.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-social-muted">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{community.memberCount.toLocaleString()} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{community.postCount} posts</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {community.isMember && (
                  <Button onClick={() => setShowCreatePost(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                )}
                
                {community.isModerator && (
                  <Button 
                    variant="outline"
                    onClick={() => setShowModPanel(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Moderate
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {community.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-social-accent/50">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Create Post Form */}
          {showCreatePost && (
            <div className="mb-6">
              <CreatePostForm
                onSubmit={handleCreatePost}
                onCancel={() => setShowCreatePost(false)}
                availableTags={community.tags}
              />
            </div>
          )}

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <CommunityPost
                key={post.id}
                post={post}
                onLike={handleLikePost}
                onComment={handleCommentPost}
                onPin={community.isModerator ? handlePinPost : undefined}
                onLock={community.isModerator ? handleLockPost : undefined}
                onUnlock={community.isModerator ? handleUnlockPost : undefined}
                onLockComments={community.isModerator ? handleLockComments : undefined}
                onUnlockComments={community.isModerator ? handleUnlockComments : undefined}
                isModerator={community.isModerator}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Community Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm">
                {community.rules.map((rule, index) => (
                  <li key={index} className="flex">
                    <span className="font-medium text-social-primary mr-2">{index + 1}.</span>
                    <span className="text-social-muted">{rule}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Moderator Panel */}
      {showModPanel && (
        <ModeratorPanel
          isOpen={showModPanel}
          onClose={() => setShowModPanel(false)}
          posts={posts.map(post => ({
            id: post.id,
            title: post.title,
            isLocked: post.isLocked,
            areCommentsLocked: post.commentsLocked
          }))}
        />
      )}
    </div>
  );
};

export default CommunityDetailPage;
