
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Settings, Shield } from "lucide-react";
import CommunityPost, { Post, User, Reply } from "@/components/community/CommunityPost";
import CreatePostForm from "@/components/community/CreatePostForm";
import ModeratorPanel, { Report } from "@/components/community/ModeratorPanel";
import { useToast } from "@/components/ui/use-toast";

const mockCurrentUser: User = {
  id: "user-1",
  name: "John Doe",
  isModerator: true
};

const CommunityDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [community, setCommunity] = useState({
    id: id || "1",
    name: "Photography Enthusiasts",
    description: "Share your best shots, photography tips, and camera recommendations.",
    members: 2453,
    tags: ["Photography", "Art", "Creative"],
    joined: true,
    isModeratedBy: mockCurrentUser.id
  });

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "post-1",
      title: "New Camera Recommendation?",
      content: "I'm looking to upgrade from my entry-level DSLR. Budget is around $1,000. Any recommendations for a good mirrorless camera?",
      author: { id: "user-2", name: "Jane Smith" },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      tags: ["Question", "Equipment", "Mirrorless"],
      likes: 12,
      isLiked: false,
      isReported: false,
      isLocked: false,
      areCommentsLocked: false,
      replies: [
        {
          id: "reply-1",
          content: "I'd recommend the Sony Alpha a6400. Great image quality and within your budget when bought with the kit lens.",
          author: { id: "user-3", name: "Michael Brown" },
          createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          likes: 5,
          isLiked: true,
          isReported: false
        },
        {
          id: "reply-2",
          content: "Fujifilm X-T30 is also excellent. Beautiful color science and film simulations.",
          author: { id: "user-4", name: "Sarah Wilson" },
          createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          likes: 3,
          isLiked: false,
          isReported: false
        }
      ]
    },
    {
      id: "post-2",
      title: "Sunset Photography Tips?",
      content: "I'm struggling to capture good sunset shots. Any tips on camera settings and composition for better sunset photography?",
      author: { id: "user-5", name: "Alex Johnson" },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      tags: ["Tips", "Landscape", "Lighting"],
      likes: 24,
      isLiked: true,
      isReported: false,
      isLocked: false,
      areCommentsLocked: false,
      replies: [
        {
          id: "reply-3",
          content: "Use a tripod and bracket your exposures. The dynamic range during sunset is too wide for a single shot.",
          author: { id: "user-6", name: "Chris Taylor", isModerator: true },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          likes: 8,
          isLiked: false,
          isReported: false
        }
      ]
    },
    {
      id: "post-3",
      title: "Portrait lens recommendation",
      content: "What's your favorite portrait lens for full-frame cameras? Looking to create beautiful bokeh for my portrait shots.",
      author: { id: "user-7", name: "Emma Davis" },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      tags: ["Portrait", "Lens", "Equipment"],
      likes: 18,
      isLiked: false,
      isReported: true,
      isLocked: true,
      areCommentsLocked: false,
      replies: []
    }
  ]);

  const [reports, setReports] = useState<Report[]>([
    {
      id: "report-1",
      contentType: 'post',
      contentId: "post-3",
      contentTitle: "Portrait lens recommendation",
      contentPreview: "What's your favorite portrait lens for full-frame cameras? Looking to create beautiful bokeh for my portrait shots.",
      reportedBy: "user-8",
      reason: "This post contains spam and off-topic content promoting specific brands.",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      status: 'pending'
    },
    {
      id: "report-2",
      contentType: 'reply',
      contentId: "reply-3",
      contentPreview: "Use a tripod and bracket your exposures. The dynamic range during sunset is too wide for a single shot.",
      reportedBy: "user-9",
      reason: "This reply contains misleading information about photography techniques.",
      createdAt: new Date(Date.now() - 1000 * 60 * 45),
      status: 'pending'
    },
    {
      id: "report-3",
      contentType: 'post',
      contentId: "post-2",
      contentTitle: "Sunset Photography Tips?",
      contentPreview: "I'm struggling to capture good sunset shots. Any tips on camera settings and composition for better sunset photography?",
      reportedBy: "user-10",
      reason: "This content was previously resolved as part of a monthly cleanup.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      status: 'reviewed'
    }
  ]);

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleLikeReply = (postId: string, replyId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: post.replies.map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                isLiked: !reply.isLiked
              };
            }
            return reply;
          })
        };
      }
      return post;
    }));
  };

  const handleCreateReply = (postId: string, content: string) => {
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      content,
      author: mockCurrentUser,
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
      isReported: false
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [...post.replies, newReply]
        };
      }
      return post;
    }));

    toast({
      title: "Reply posted",
      description: "Your reply has been added to the discussion.",
    });
  };

  const handleReportPost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isReported: true
        };
      }
      return post;
    }));

    // Simulate creating a new report
    setReports([...reports, {
      id: `report-${Date.now()}`,
      contentType: 'post',
      contentId: postId,
      contentTitle: posts.find(p => p.id === postId)?.title,
      contentPreview: posts.find(p => p.id === postId)?.content || "",
      reportedBy: mockCurrentUser.id,
      reason: "Reported by user",
      createdAt: new Date(),
      status: 'pending'
    }]);
  };

  const handleReportReply = (postId: string, replyId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: post.replies.map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                isReported: true
              };
            }
            return reply;
          })
        };
      }
      return post;
    }));

    // Find the reply content
    const post = posts.find(p => p.id === postId);
    const reply = post?.replies.find(r => r.id === replyId);

    if (reply) {
      // Simulate creating a new report
      setReports([...reports, {
        id: `report-${Date.now()}`,
        contentType: 'reply',
        contentId: replyId,
        contentPreview: reply.content,
        reportedBy: mockCurrentUser.id,
        reason: "Reported by user",
        createdAt: new Date(),
        status: 'pending'
      }]);
    }
  };

  const handlePostCreated = () => {
    // Simulate adding a new post to the list
    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: "New Post Title",
      content: "This is a newly created post content.",
      author: mockCurrentUser,
      createdAt: new Date(),
      tags: ["New", "Discussion"],
      likes: 0,
      isLiked: false,
      isReported: false,
      isLocked: false,
      areCommentsLocked: false,
      replies: []
    };

    setPosts([newPost, ...posts]);
  };

  const handleResolveReport = (reportId: string) => {
    setReports(reports.map(report => {
      if (report.id === reportId) {
        return {
          ...report,
          status: 'reviewed'
        };
      }
      return report;
    }));
  };

  const handleLockPost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLocked: true
        };
      }
      return post;
    }));
  };

  const handleLockComments = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          areCommentsLocked: true
        };
      }
      return post;
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-social-primary">{community.name}</h1>
          <div className="flex items-center gap-2 text-social-muted">
            <Users className="h-4 w-4" />
            <span>{community.members.toLocaleString()} members</span>
            {mockCurrentUser.isModerator && (
              <Badge variant="outline" className="ml-2 bg-social-accent/50">You're a moderator</Badge>
            )}
          </div>
          <p className="mt-2 text-social-muted">{community.description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {community.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="bg-social-accent/50">{tag}</Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {mockCurrentUser.isModerator && (
            <Button 
              variant="outline" 
              className="border-social-primary text-social-primary"
            >
              <Settings className="h-4 w-4 mr-2" />
              Community Settings
            </Button>
          )}
          <Button
            variant={community.joined ? "outline" : "default"}
            className={community.joined 
              ? "border-social-primary text-social-primary" 
              : "bg-social-primary hover:bg-social-secondary"}
          >
            {community.joined ? "Leave" : "Join"} Community
          </Button>
        </div>
      </div>

      <Tabs defaultValue="discussions">
        <TabsList>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          {mockCurrentUser.isModerator && (
            <TabsTrigger value="moderation" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Moderation
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="discussions" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Community Posts</h2>
            <CreatePostForm 
              communityId={community.id} 
              onPostCreated={handlePostCreated} 
            />
          </div>

          {posts.map(post => (
            <CommunityPost
              key={post.id}
              post={post}
              currentUser={mockCurrentUser}
              onLike={handleLikePost}
              onReply={handleCreateReply}
              onLikeReply={handleLikeReply}
              onReport={handleReportPost}
              onReportReply={handleReportReply}
              onLockPost={mockCurrentUser.isModerator ? handleLockPost : undefined}
              onLockComments={mockCurrentUser.isModerator ? handleLockComments : undefined}
            />
          ))}
        </TabsContent>

        {mockCurrentUser.isModerator && (
          <TabsContent value="moderation" className="mt-6">
            <ModeratorPanel 
              communityId={community.id}
              reports={reports}
              onResolveReport={handleResolveReport}
              onLockPost={handleLockPost}
              onLockComments={handleLockComments}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default CommunityDetailPage;
