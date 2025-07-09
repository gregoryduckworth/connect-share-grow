import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CreateCommunityDialog from '@/components/community/CreateCommunityDialog';
import { useToast } from '@/components/ui/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import CommunityCard from '@/components/community/CommunityCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/useAuth';

interface Community {
  slug: string;
  name: string;
  description: string;
  memberCount: number;
  tags: string[];
  isJoined: boolean;
  isModerator: boolean;
}

const CommunitiesPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPageOptions = [12, 24, 36, 48];
  const [communitiesPerPage, setCommunitiesPerPage] = useState(perPageOptions[0]);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [allCommunities, setAllCommunities] = useState<Community[]>([]);
  const [userCommunities, setUserCommunities] = useState<string[]>([]); // store slugs

  useEffect(() => {
    api.getCommunities().then((data) => {
      setAllCommunities(
        data.map((community) => ({
          ...community,
          isModerator: false,
          isJoined: false, // default, will be updated below
        })),
      );
    });
    if (user) {
      api.getUserCommunities(user.id).then((data) => {
        setUserCommunities(data.map((c) => c.slug));
      });
    }
  }, [user]);

  // Compute isJoined for each community
  const communitiesWithJoin = allCommunities.map((community) => ({
    ...community,
    isJoined: userCommunities.includes(community.slug),
  }));

  // Sort and filter communities
  const filteredCommunities = communitiesWithJoin
    .filter(
      (community) =>
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .sort((a, b) =>
      sortOrder === 'desc' ? b.memberCount - a.memberCount : a.memberCount - b.memberCount,
    );

  const getCurrentPageCommunities = (communities: Community[]) => {
    const startIndex = (currentPage - 1) * communitiesPerPage;
    const endIndex = startIndex + communitiesPerPage;
    return communities.slice(startIndex, endIndex);
  };

  const getTotalPages = (communities: Community[]) => {
    return Math.ceil(communities.length / communitiesPerPage);
  };

  const handleJoinCommunity = (communityId: string) => {
    setAllCommunities((communities) =>
      communities.map((community) =>
        community.slug === communityId
          ? {
              ...community,
              isJoined: !community.isJoined,
              memberCount: community.isJoined
                ? community.memberCount - 1
                : community.memberCount + 1,
            }
          : community,
      ),
    );

    const community = allCommunities.find((c) => c.slug === communityId);
    toast({
      title: community?.isJoined ? 'Left community' : 'Joined community',
      description: community?.isJoined
        ? `You have left ${community.name}`
        : `Welcome to ${community?.name}!`,
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen" data-testid="communities-page">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
        <div>
          <h1
            className="text-3xl font-bold text-social-primary mb-2"
            data-testid="communities-title"
          >
            All Communities
          </h1>
          <p className="text-social-muted" data-testid="communities-description">
            Communities for you to connect, share, and grow together.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end gap-2 w-full sm:w-auto">
          <CreateCommunityDialog
            trigger={
              <Button data-testid="create-community-button">
                <Plus className="h-4 w-4 mr-2" />
                Create Community
              </Button>
            }
          />
        </div>
      </div>

      <div className="relative mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex-1 relative">
          <div
            className="absolute inset-0 pointer-events-none rounded-lg border border-purple-200 bg-gradient-to-r from-purple-100/40 to-blue-100/20"
            style={{ zIndex: 0 }}
          />
          <div className="flex items-center gap-2 relative z-10 p-1 rounded-lg bg-white/90 border border-purple-200 w-full focus-within:border-purple-500 focus-within:shadow-lg focus-within:shadow-purple-200/40 transition-colors">
            <Search className="ml-3 text-social-primary h-5 w-5" />
            <Input
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="pl-2 py-3 border-0 bg-transparent focus:ring-0 focus:outline-none shadow-none min-w-0 flex-1"
              style={{ boxShadow: 'none' }}
              data-testid="communities-search-input"
            />
            <div className="flex items-center gap-2 min-w-[200px] sm:min-w-[260px] md:min-w-[320px] lg:min-w-[340px]">
              <label
                htmlFor="sortOrder"
                className="text-sm text-social-muted ml-2 whitespace-nowrap"
              >
                Sort by
              </label>
              <Select value={sortOrder} onValueChange={(val: 'desc' | 'asc') => setSortOrder(val)}>
                <SelectTrigger
                  id="sortOrder"
                  className="w-full bg-white/90 border-0 shadow-none px-2"
                  data-testid="communities-sort-trigger"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc" data-testid="sort-desc">
                    Members: High to Low
                  </SelectItem>
                  <SelectItem value="asc" data-testid="sort-asc">
                    Members: Low to High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`grid gap-6 mb-6 
          ${
            communitiesPerPage >= 36
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
              : communitiesPerPage >= 24
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
          }
        `}
        data-testid="communities-grid"
      >
        {getCurrentPageCommunities(filteredCommunities).map((community) => (
          <CommunityCard
            key={community.slug}
            id={community.slug}
            name={community.name}
            description={community.description}
            memberCount={community.memberCount}
            tags={community.tags}
            isJoined={community.isJoined}
            isModerator={community.isModerator}
            onJoinLeave={handleJoinCommunity}
            data-testid={`community-card-${community.slug}`}
          />
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-social-muted">No communities found matching your search.</p>
        </div>
      )}

      {/* Pagination and per-page selector */}
      {filteredCommunities.length > communitiesPerPage ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-2">
          <div className="flex-1 flex justify-center">
            <Pagination>
              <PaginationContent className="flex flex-wrap gap-1 justify-center">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={
                      currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                    }
                    aria-label="Previous page"
                  />
                </PaginationItem>
                {Array.from({ length: getTotalPages(filteredCommunities) }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className={`cursor-pointer ${
                          currentPage === page ? 'bg-accent text-primary font-bold' : ''
                        }`}
                        aria-label={`Go to page ${page}`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage(Math.min(getTotalPages(filteredCommunities), currentPage + 1))
                    }
                    className={
                      currentPage === getTotalPages(filteredCommunities)
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                    aria-label="Next page"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <label htmlFor="perPage" className="text-sm text-social-muted">
              Per page:
            </label>
            <Select
              value={String(communitiesPerPage)}
              onValueChange={(val: string) => {
                setCommunitiesPerPage(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger id="perPage" className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {perPageOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <div className="flex justify-end mt-2">
          <div className="flex items-center gap-2">
            <label htmlFor="perPage" className="text-sm text-social-muted">
              Per page:
            </label>
            <Select
              value={String(communitiesPerPage)}
              onValueChange={(val: string) => {
                setCommunitiesPerPage(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger id="perPage" className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {perPageOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunitiesPage;
