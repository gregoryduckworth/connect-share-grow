import { useState, useEffect } from 'react';
import { Search, TrendingUp, Users, MessageSquare, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import CommunityCard from '@/components/community/CommunityCard';
import InfoCard from '@/components/ui/InfoCard';
import UserProfileLink from '@/components/user/UserProfileLink';
import { api } from '@/lib/api';
import { Post, Community } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const HotTopicsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [trendingCommunities, setTrendingCommunities] = useState<Community[]>([]);
  const [userCommunities, setUserCommunities] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      api.getHotPosts(),
      api.getCommunities(),
      user ? api.getUserLikedPosts(user.id) : Promise.resolve([] as string[]),
    ]).then(([posts, communities, likedPosts]) => {
      setTrendingCommunities(
        (communities as Community[]).map((c) => ({
          ...c,
          isJoined: false,
        })),
      );
      setTrendingPosts(
        (posts as Post[]).map((p) => ({
          ...p,
          isLiked: likedPosts.includes(p.id),
        })),
      );
    });
    if (user) {
      api.getUserCommunities(user.id).then((data) => {
        setUserCommunities(data.map((c) => c.id));
      });
    }
  }, [user]);

  // Add join/leave logic for trending communities
  const trendingCommunitiesWithJoin = trendingCommunities.map((community) => ({
    ...community,
    isJoined: userCommunities.includes(community.id),
  }));

  const handleJoinLeave = (communityId: string) => {
    setTrendingCommunities((prev) =>
      prev.map((community) =>
        community.id === communityId ? { ...community, isJoined: !community.isJoined } : community,
      ),
    );
    // Optionally, update backend/join table here
  };

  // Add like/unlike logic for trending posts
  const handleLikePost = async (postId: string, isLiked: boolean) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'You must be signed in to like posts.',
        variant: 'destructive',
      });
      return;
    }
    try {
      if (isLiked) {
        await api.unlikePost(user.id, postId);
      } else {
        await api.likePost(user.id, postId);
      }
      // Refresh trending posts and liked posts
      const [posts, likedPosts] = await Promise.all([
        api.getHotPosts(),
        api.getUserLikedPosts(user.id),
      ]);
      setTrendingPosts(
        (posts as Post[]).map((p) => ({
          ...p,
          isLiked: likedPosts.includes(p.id),
        })),
      );
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update like. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const filteredPosts = trendingPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.communityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredCommunities = trendingCommunitiesWithJoin.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen" data-testid="hot-topics-page">
      <div className="mb-6" data-testid="hot-topics-header">
        <h1 className="text-3xl font-bold text-social-primary mb-2" data-testid="hot-topics-title">
          Hot Topics
        </h1>
        <p
          className="text-sm sm:text-base text-muted-foreground"
          data-testid="hot-topics-description"
        >
          Explore trending content and growing communities
        </p>
      </div>

      <div
        className="relative mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
        data-testid="hot-topics-search-container"
      >
        <div className="flex-1 relative">
          <div
            className="absolute inset-0 pointer-events-none rounded-lg border border-purple-200 bg-gradient-to-r from-purple-100/40 to-blue-100/20"
            style={{ zIndex: 0 }}
          />
          <div className="flex items-center gap-2 relative z-10 p-1 rounded-lg bg-white/90 border border-purple-200 w-full focus-within:border-purple-500 focus-within:shadow-lg focus-within:shadow-purple-200/40 transition-colors">
            <Search className="ml-3 text-social-primary h-5 w-5" />
            <Input
              placeholder="Search trending posts and communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-2 py-3 border-0 bg-transparent focus:ring-0 focus:outline-none shadow-none min-w-0 flex-1"
              style={{ boxShadow: 'none' }}
              data-testid="hot-topics-search-input"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="posts" data-testid="hot-topics-tabs">
        <TabsList data-testid="hot-topics-tabs-list">
          <TabsTrigger value="posts" data-testid="tab-trending-posts">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending Posts
          </TabsTrigger>
          <TabsTrigger value="communities" data-testid="tab-growing-communities">
            <Users className="h-4 w-4 mr-2" />
            Growing Communities
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="posts"
          className="space-y-4 sm:space-y-6"
          data-testid="tab-content-trending-posts"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPosts.length === 0 &&
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full mb-2 rounded-lg" />
              ))}
            {filteredPosts.map((post) => (
              <InfoCard
                key={post.id}
                title={
                  <Link
                    to={`/community/${post.communityId}/post/${post.id}`}
                    className="hover:text-primary transition-colors"
                    data-testid={`post-title-link-${post.id}`}
                  >
                    {post.title}
                  </Link>
                }
                description={post.content.slice(0, 120) + (post.content.length > 120 ? '...' : '')}
                headerRight={
                  <div className="flex flex-col items-end gap-2 min-w-[60px]">
                    <div className="flex items-center gap-1 text-xs">
                      <Button
                        variant={post.isLiked ? 'ghost' : 'outline'}
                        size="icon"
                        onClick={() => handleLikePost(post.id, post.isLiked)}
                        className={`p-1 h-6 w-6 ${post.isLiked ? 'text-red-500' : 'text-social-muted'}`}
                        data-testid={`like-post-btn-${post.id}`}
                      >
                        <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      </Button>
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                      <span>{post.replies}</span>
                    </div>
                  </div>
                }
                contentTop={
                  <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-2">
                    <span className="break-words">
                      by{' '}
                      <UserProfileLink
                        userId={post.author}
                        data-testid={`post-author-link-${post.id}`}
                      />{' '}
                      • {formatDate(post.createdAt)}
                    </span>
                  </div>
                }
                actions={
                  <Link
                    to={`/community/${post.communityId}/post/${post.id}`}
                    className="flex-1"
                    data-testid={`read-more-link-${post.id}`}
                  >
                    <Button
                      variant="outline"
                      className="w-full text-xs sm:text-sm"
                      data-testid={`read-more-btn-${post.id}`}
                    >
                      <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Read More
                    </Button>
                  </Link>
                }
                data-testid={`trending-post-card-${post.id}`}
              />
            ))}
          </div>
          {filteredPosts.length === 0 && (
            <div className="text-center py-12" data-testid="trending-posts-empty-state">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No trending posts found matching your search.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent
          value="communities"
          className="space-y-4 sm:space-y-6"
          data-testid="tab-content-growing-communities"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingCommunities.length === 0 &&
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full mb-2 rounded-lg" />
              ))}
            {filteredCommunities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                description={community.description}
                memberCount={community.memberCount}
                category={community.category}
                isJoined={community.isJoined}
                onJoinLeave={handleJoinLeave}
                data-testid={`growing-community-card-${community.id}`}
              />
            ))}
          </div>
          {filteredCommunities.length === 0 && (
            <div className="text-center py-12" data-testid="growing-communities-empty-state">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No growing communities found matching your search.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HotTopicsPage;
