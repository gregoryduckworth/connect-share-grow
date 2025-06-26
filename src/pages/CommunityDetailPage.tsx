import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  MessageSquare,
  Plus,
  Settings,
  ChevronRight,
  Home,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CommunityPost from "@/components/community/CommunityPost";
import { useToast } from "@/components/ui/use-toast";
import UserProfileDialog from "@/components/user/UserProfileDialog";
import { api } from "@/lib/api";
import type {
  CommunityDetail,
  CommunityPost as CommunityPostType,
} from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CommunityDetailPage = () => {
  const { communityId } = useParams();
  const { toast } = useToast();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showModPanel, setShowModPanel] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [community, setCommunity] = useState<CommunityDetail | null>(null);
  const [posts, setPosts] = useState<CommunityPostType[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (communityId) {
      api.getCommunityDetail(communityId).then(setCommunity);
      api.getCommunityPosts(communityId).then(setPosts);
    }
  }, [communityId]);

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) =>
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

  const handleCommentPost = (postId: string) => {
    // Navigate to post detail page
    window.location.href = `/community/${communityId}/post/${postId}`;
  };

  const handlePinPost = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, isPinned: !post.isPinned } : post
      )
    );
  };

  // Filtered and paginated posts
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.author.toLowerCase().includes(search.toLowerCase())
  );
  const sortedPosts = filteredPosts.slice().sort((a, b) => {
    if (a.isPinned === b.isPinned) return 0;
    return a.isPinned ? -1 : 1;
  });
  const totalPages = Math.ceil(sortedPosts.length / pageSize);
  const paginatedPosts = sortedPosts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  if (!community) return null;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/discover">Discover</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{community.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Community Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-social-primary mb-2">
                  {community.name}
                </h1>
                <p className="text-social-muted mb-4">
                  {community.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-social-muted">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {community.memberCount.toLocaleString()} members
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{community.postCount} posts</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {community.isMember && (
                  <Button onClick={() => setShowCreatePost(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                )}

                {community.isModerator && (
                  <Button variant="outline" asChild>
                    <Link to={`/community/${communityId}/moderate`}>
                      <Settings className="h-4 w-4 mr-2" />
                      Moderate
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {community.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative w-full">
              <Card className="w-full p-0 border border-input bg-background shadow-none">
                <div className="flex items-center gap-2 relative z-10 p-1 rounded-lg bg-white/90 border border-purple-200 w-full focus-within:border-purple-500 focus-within:shadow-lg focus-within:shadow-purple-200/40 transition-colors">
                  <Search className="ml-3 text-social-primary h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search posts..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-2 py-3 border-0 bg-transparent focus:ring-0 focus:outline-none shadow-none min-w-0 flex-1"
                    style={{ boxShadow: "none" }}
                  />
                </div>
              </Card>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {paginatedPosts.map((post) => (
              <div key={post.id}>
                <Link
                  to={`/community/${communityId}/post/${post.id}`}
                  tabIndex={-1}
                  className="block focus:outline-none"
                  style={{ textDecoration: "none" }}
                >
                  <CommunityPost
                    post={post}
                    onLike={handleLikePost}
                    onComment={handleCommentPost}
                    onPin={handlePinPost}
                    isModerator={community.isModerator}
                    showPreview={true}
                  />
                </Link>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-6">
              <div className="flex-1 flex justify-center">
                <Pagination>
                  <PaginationContent className="flex flex-wrap gap-1 justify-center">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className={
                          page === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                        aria-label="Previous page"
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pg) => (
                        <PaginationItem key={pg}>
                          <PaginationLink
                            onClick={() => setPage(pg)}
                            isActive={page === pg}
                            className={`cursor-pointer ${
                              page === pg
                                ? "bg-accent text-primary font-bold"
                                : ""
                            }`}
                            aria-label={`Go to page ${pg}`}
                          >
                            {pg}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        className={
                          page === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                        aria-label="Next page"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <label htmlFor="perPage" className="text-sm text-social-muted">
                  Posts per page:
                </label>
                <Select
                  value={String(pageSize)}
                  onValueChange={(val) => {
                    setPageSize(Number(val));
                    setPage(1);
                  }}
                >
                  <SelectTrigger id="perPage" className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20].map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 flex flex-col">
            {/* Moderators */}
            <Card className="hover-scale text-left transition-shadow hover:shadow-xl hover:bg-accent/60 hover:border-accent mb-6">
              <CardHeader>
                <CardTitle>Moderators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {community.moderators.map((moderator) => (
                    <div key={moderator.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-social-primary flex items-center justify-center text-white">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <button
                          className="font-medium text-sm hover:text-social-primary transition-colors cursor-pointer"
                          onClick={() => setSelectedUserId(moderator.id)}
                        >
                          {moderator.name}
                        </button>
                        <p className="text-xs text-social-muted">
                          {moderator.role}
                        </p>
                        <p className="text-xs text-gray-400">
                          Since {moderator.joinedAsModAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Rules */}
            <Card className="hover-scale text-left transition-shadow hover:shadow-xl hover:bg-accent/60 hover:border-accent mb-6">
              <CardHeader>
                <CardTitle>Community Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm">
                  {community.rules.map((rule, index) => (
                    <li key={index} className="flex">
                      <span className="font-medium text-social-primary mr-2">
                        {index + 1}.
                      </span>
                      <span className="text-social-muted">{rule}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* User Profile Dialog */}
      {selectedUserId && (
        <UserProfileDialog
          userId={selectedUserId}
          isOpen={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
          currentUserId="current-user-id"
        />
      )}
    </div>
  );
};

export default CommunityDetailPage;
