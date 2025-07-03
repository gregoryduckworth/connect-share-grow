import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Calendar,
  Tag,
  Settings,
  User,
  Home,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CommunityPost from "@/components/community/CommunityPost";
import CreatePostForm from "@/components/community/CreatePostForm";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import type {
  CommunityDetail,
  CommunityPost as CommunityPostType,
} from "@/lib/types";
import UserProfileLink from "@/components/user/UserProfileLink";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { USERS_DATA } from "@/lib/backend/data/users";
import { formatNumber } from "@/lib/utils";
import { InfoBadge } from "@/components/common/InfoBadge";

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
          api.getCommunityPosts(communitySlug),
        ]);
        setCommunity(communityData);
        // Map userName into each post
        setPosts(
          communityPosts.map((post) => {
            const user = USERS_DATA.find((u) => u.id === post.author);
            return { ...post, userName: user?.name || undefined };
          })
        );
      } catch (error) {
        console.error("Error fetching community data:", error);
        toast({
          title: "Error",
          description: "Failed to load community data",
          variant: "destructive",
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
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
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
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Communities
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 md:p-6 space-y-6 bg-background min-h-screen"
      data-testid="community-detail-page"
    >
      {/* Header */}
      <div
        className="flex items-center gap-4 mb-6"
        data-testid="community-detail-header"
      >
        {/* Breadcrumbs */}
        <div className="mb-6" data-testid="community-detail-breadcrumbs">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/communities" className="flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    Communities
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <span className="text-muted-foreground">{community.name}</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Main Content + Sidebar Layout */}
      <div
        className="flex flex-col lg:flex-row gap-8"
        data-testid="community-detail-layout"
      >
        {/* Main Content */}
        <div
          className="flex-1 min-w-0 space-y-6"
          data-testid="community-detail-main"
        >
          {/* Community Info */}
          <Card data-testid="community-detail-info-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle
                    className="text-2xl text-social-primary"
                    data-testid="community-detail-title"
                  >
                    {community.name}
                  </CardTitle>
                  <CardDescription
                    className="text-base"
                    data-testid="community-detail-description"
                  >
                    {community.description}
                  </CardDescription>
                </div>
                {community.isModerator && (
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid="community-moderate-button"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Moderate
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <div
                  className="flex items-center gap-1"
                  data-testid="community-detail-members"
                >
                  <Users className="h-4 w-4" />
                  {formatNumber(community.memberCount)} members
                </div>
                <div
                  className="flex items-center gap-1"
                  data-testid="community-detail-posts"
                >
                  <Calendar className="h-4 w-4" />
                  {community.postCount} posts
                </div>
              </div>

              <div
                className="flex flex-wrap gap-2 mb-4"
                data-testid="community-detail-tags"
              >
                {community.tags.map((tag, index) => (
                  <InfoBadge
                    key={index}
                    type="tag"
                    data-testid={`community-detail-tag-${tag}`}
                    icon={<Tag className="h-3 w-3 mr-1" />}
                  >
                    {tag}
                  </InfoBadge>
                ))}
              </div>

              <div className="flex gap-3">
                {community.isMember ? (
                  <Button
                    variant="outline"
                    data-testid="leave-community-button"
                  >
                    Leave Community
                  </Button>
                ) : (
                  <Button data-testid="join-community-button">
                    Join Community
                  </Button>
                )}
                <CreatePostForm
                  communityId={communitySlug!}
                  onPostCreated={handlePostCreated}
                  data-testid="create-post-form"
                />
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Posts Section */}
          <div
            className="space-y-6"
            data-testid="community-detail-posts-section"
          >
            <div className="flex justify-between items-center">
              <h2
                className="text-xl font-semibold"
                data-testid="community-detail-posts-title"
              >
                Recent Posts
              </h2>
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
                    data-testid="create-post-form-empty"
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
                    communitySlug={communitySlug!}
                    data-testid={`community-post-${post.id}`}
                    // Pass userName to CommunityPost
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside
          className="w-full lg:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-8 self-start h-fit"
          data-testid="community-detail-sidebar"
        >
          {/* Moderators */}
          <Card data-testid="community-detail-moderators-card">
            <CardHeader>
              <CardTitle>Moderators</CardTitle>
            </CardHeader>
            <CardContent>
              {community.moderators.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No moderators listed.
                </p>
              ) : (
                <ul className="space-y-2">
                  {community.moderators.map((mod) => {
                    const user = USERS_DATA.find((u) => u.id === mod.id);
                    return (
                      <li
                        key={mod.id}
                        className="flex items-center gap-2 text-sm"
                        data-testid={`community-detail-moderator-${mod.id}`}
                      >
                        <User className="h-4 w-4 text-social-primary" />
                        <UserProfileLink
                          userId={mod.id}
                          userName={user?.name}
                          className="font-medium hover:underline hover:text-social-primary transition-colors"
                        />
                        <span className="text-muted-foreground">
                          ({mod.role})
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Community Rules */}
          <Card data-testid="community-detail-rules-card">
            <CardHeader>
              <CardTitle>Community Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {community.rules.map((rule, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm"
                    data-testid={`community-detail-rule-${index + 1}`}
                  >
                    <span className="font-medium text-social-primary">
                      {index + 1}.
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default CommunityDetailPage;
