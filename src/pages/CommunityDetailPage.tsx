
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Calendar, Tag, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CommunityPost from "@/components/community/CommunityPost";
import CreatePostForm from "@/components/community/CreatePostForm";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import type { CommunityDetail, CommunityPost as CommunityPostType } from "@/lib/types";

const CommunityDetailPage = () => {
  const { communitySlug } = useParams<{ communitySlug: string }>();
  const { toast } = useToast();
  const [community, setCommunity] = useState<CommunityDetail | null>(null);
  const [posts, setPosts] = useState<CommunityPostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityData = async () => {
      if (!communitySlug) return;
      
      try {
        setLoading(true);
        const [communityData, communityPosts] = await Promise.all([
          api.getCommunityDetail(communitySlug),
          api.getCommunityPosts(communitySlug)
        ]);
        
        setCommunity(communityData);
        setPosts(communityPosts);
      } catch (error) {
        console.error("Error fetching community data:", error);
        toast({
          title: "Error",
          description: "Failed to load community data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [communitySlug, toast]);

  const handlePostCreated = () => {
    // Refresh posts after creating a new one
    if (communitySlug) {
      api.getCommunityPosts(communitySlug).then(setPosts);
    }
  };

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleComment = (postId: string) => {
    // Navigate to post detail page for commenting
    console.log("Navigate to post detail:", postId);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-background min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="p-6 space-y-6 bg-background min-h-screen">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-muted-foreground mb-4">
            Community Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            The community you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/communities">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Communities
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/communities">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {/* Community Info */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="text-2xl text-social-primary">
                {community.name}
              </CardTitle>
              <CardDescription className="text-base">
                {community.description}
              </CardDescription>
            </div>
            {community.isModerator && (
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Moderate
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {community.memberCount.toLocaleString()} members
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {community.postCount} posts
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {community.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-3">
            {community.isMember ? (
              <Button variant="outline">Leave Community</Button>
            ) : (
              <Button>Join Community</Button>
            )}
            <CreatePostForm 
              communityId={communitySlug!} 
              onPostCreated={handlePostCreated}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Posts Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Posts</h2>
        </div>

        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No posts yet in this community.
              </p>
              <CreatePostForm 
                communityId={communitySlug!} 
                onPostCreated={handlePostCreated}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <CommunityPost
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                isModerator={community.isModerator}
                showPreview={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Community Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Community Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {community.rules.map((rule, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="font-medium text-social-primary">{index + 1}.</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityDetailPage;
