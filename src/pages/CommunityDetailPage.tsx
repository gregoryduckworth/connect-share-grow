
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, Plus, ArrowLeft, Pin, Settings, 
  UserPlus, Shield, MessageSquare, TrendingUp 
} from "lucide-react";
import CommunityPost from "@/components/community/CommunityPost";
import CreatePostForm from "@/components/community/CreatePostForm";
import ModeratorPanel from "@/components/community/ModeratorPanel";

const CommunityDetailPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "moderator">("posts");

  // Mock data - in a real app, this would come from your API
  const community = {
    id: id || "1",
    name: "Photography Enthusiasts",
    description: "A community dedicated to sharing photography tips, techniques, and showcasing beautiful captures from around the world.",
    memberCount: 1234,
    postCount: 567,
    tags: ["Photography", "Art", "Creative", "Nature"],
    rules: [
      "Be respectful to all members",
      "No spam or self-promotion without permission",
      "Use appropriate tags for your posts",
      "Keep content photography-related"
    ],
    moderators: ["Alice Johnson", "Bob Smith", "Carol Williams"],
    isJoined: true,
    isModerator: true // For demo purposes
  };

  const [posts, setPosts] = useState([
    {
      id: "1",
      title: "Golden Hour Landscape Photography Tips",
      content: "Here are some essential tips for capturing stunning golden hour landscapes...",
      author: "Alice Johnson",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      likes: 45,
      comments: 12,
      isLiked: true,
      isPinned: true,
      isLocked: false,
      commentsLocked: false,
      tags: ["Tips", "Landscape", "Golden Hour"]
    },
    {
      id: "2",
      title: "My Latest Wildlife Photography Adventure",
      content: "Just got back from an amazing wildlife photography trip to Yellowstone...",
      author: "David Chen",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      likes: 23,
      comments: 8,
      isLiked: false,
      isPinned: false,
      isLocked: true,
      lockReason: "Post contains inappropriate language and has been temporarily locked pending review.",
      commentsLocked: false,
      tags: ["Wildlife", "Adventure", "Nature"]
    },
    {
      id: "3",
      title: "Camera Gear Recommendations for Beginners",
      content: "Starting your photography journey? Here's what I recommend for beginners...",
      author: "Sarah Martinez",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      likes: 67,
      comments: 34,
      isLiked: false,
      isPinned: false,
      isLocked: false,
      commentsLocked: true,
      commentsLockReason: "Comments locked due to multiple off-topic discussions and arguments.",
      tags: ["Gear", "Beginner", "Recommendations"]
    }
  ]);

  const handleJoinCommunity = () => {
    toast({
      title: "Joined Community",
      description: `You've successfully joined ${community.name}!`,
    });
  };

  const handleLike = (postId: string) => {
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

  const handleComment = (postId: string) => {
    console.log(`Comment on post ${postId}`);
  };

  const handlePin = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isPinned: !post.isPinned }
        : post
    ));
    
    const post = posts.find(p => p.id === postId);
    toast({
      title: post?.isPinned ? "Post Unpinned" : "Post Pinned",
      description: post?.isPinned ? "Post has been unpinned." : "Post has been pinned to the top.",
    });
  };

  const handleLock = (postId: string, reason: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLocked: true, lockReason: reason }
        : post
    ));
    
    toast({
      title: "Post Locked",
      description: "The post has been locked and the author has been notified.",
    });
  };

  const handleUnlock = (postId: string) => {
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
    
    toast({
      title: "Comments Locked",
      description: "Comments have been locked and the author has been notified.",
    });
  };

  const handleUnlockComments = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, commentsLocked: false, commentsLockReason: undefined }
        : post
    ));
  };

  const handleCreatePost = (title: string, content: string, tags: string[]) => {
    const newPost = {
      id: String(posts.length + 1),
      title,
      content,
      author: "You", // In a real app, this would be the current user
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
    
    toast({
      title: "Post Created",
      description: "Your post has been published successfully!",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <Link to="/communities">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Communities
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{community.name}</h1>
            <p className="text-gray-600 mb-4">{community.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>{community.memberCount.toLocaleString()} members</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MessageSquare className="h-4 w-4" />
                <span>{community.postCount} posts</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {community.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-social-accent/50">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {!community.isJoined ? (
              <Button onClick={handleJoinCommunity}>
                <UserPlus className="h-4 w-4 mr-2" />
                Join Community
              </Button>
            ) : (
              <Button 
                onClick={() => setShowCreatePost(true)}
                className="bg-social-primary hover:bg-social-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            )}
            
            {community.isModerator && (
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Manage
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === "posts" ? "default" : "outline"}
              onClick={() => setActiveTab("posts")}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Posts
            </Button>
            {community.isModerator && (
              <Button
                variant={activeTab === "moderator" ? "default" : "outline"}
                onClick={() => setActiveTab("moderator")}
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Moderator
              </Button>
            )}
          </div>

          {activeTab === "posts" && (
            <>
              {showCreatePost && (
                <div className="mb-6">
                  <CreatePostForm
                    onSubmit={handleCreatePost}
                    onCancel={() => setShowCreatePost(false)}
                    availableTags={community.tags}
                  />
                </div>
              )}

              <div className="space-y-4">
                {posts.map((post) => (
                  <CommunityPost
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onPin={handlePin}
                    onLock={handleLock}
                    onUnlock={handleUnlock}
                    onLockComments={handleLockComments}
                    onUnlockComments={handleUnlockComments}
                    isModerator={community.isModerator}
                  />
                ))}
              </div>
            </>
          )}

          {activeTab === "moderator" && community.isModerator && (
            <ModeratorPanel
              community={community}
              posts={posts}
              onUpdatePost={(postId, updates) => {
                setPosts(posts.map(post => 
                  post.id === postId ? { ...post, ...updates } : post
                ));
              }}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Members</span>
                <span className="font-semibold">{community.memberCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Posts</span>
                <span className="font-semibold">{community.postCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Today</span>
                <span className="font-semibold text-green-600">
                  <TrendingUp className="h-4 w-4 inline mr-1" />
                  234
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Moderators */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Moderators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {community.moderators.map((moderator, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-social-primary" />
                    <span className="text-sm">{moderator}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {community.rules.map((rule, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium text-social-primary">{index + 1}. </span>
                    <span className="text-gray-700">{rule}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetailPage;
