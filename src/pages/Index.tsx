import { useEffect, useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CreateCommunityDialog from '@/components/community/CreateCommunityDialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import CommunityCard from '@/components/community/CommunityCard';
import { mockPendingModeratorRoleChanges } from '@/lib/api';
import type { Community, Report, PendingAdminRoleChange } from '@/lib/types';
import type { UserCommunityMembership } from '@/lib/backend/data/userCommunityMemberships';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/useAuth';

const CommunitiesPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const communitiesPerPage = 6;
  const [myCommunities, setMyCommunities] = useState<Community[]>([]);
  const [userMemberships, setUserMemberships] = useState<UserCommunityMembership[]>([]);
  useEffect(() => {
    if (!user) return;
    api.getUserCommunities(user.id).then((data) => {
      setMyCommunities(data as Community[]);
    });
    // Fetch user memberships (join table)
    api.getUserCommunityMemberships(user.id).then((memberships: UserCommunityMembership[]) => {
      setUserMemberships(memberships);
    });
  }, [user]);

  // Compute isModerator for each community using the join table
  type CommunityWithModerator = Community & { isModerator: boolean };
  const communitiesWithModerator: CommunityWithModerator[] = useMemo(
    () =>
      myCommunities.map((community) => {
        const membership = userMemberships.find(
          (m) => m.communitySlug === community.slug && m.role === 'moderator',
        );
        return {
          ...community,
          isModerator: Boolean(membership),
        };
      }),
    [myCommunities, userMemberships],
  );

  const filteredCommunities = communitiesWithModerator.filter(
    (community: CommunityWithModerator) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const getCurrentPageCommunities = (communities: CommunityWithModerator[]) => {
    const startIndex = (currentPage - 1) * communitiesPerPage;
    const endIndex = startIndex + communitiesPerPage;
    return communities.slice(startIndex, endIndex);
  };

  const getTotalPages = (communities: Community[]) => {
    return Math.ceil(communities.length / communitiesPerPage);
  };

  // Add state for moderation actions
  const [modActionCount, setModActionCount] = useState<{
    [communityName: string]: number;
  }>({});

  // Fetch moderation actions for all communities the user moderates
  useEffect(() => {
    // Only for communities the user moderates
    const moderatedCommunities = communitiesWithModerator.filter((c) => c.isModerator);
    Promise.all(
      moderatedCommunities.map((community: CommunityWithModerator) =>
        Promise.all([api.getReports(), Promise.resolve(mockPendingModeratorRoleChanges)]).then(
          ([reports, roleChanges]: [Report[], PendingAdminRoleChange[]]) => {
            const reportCount = reports.filter(
              (r: Report) =>
                r.communityId && r.status === 'pending' && r.communityId === community.slug,
            ).length;
            const roleChangeCount = roleChanges.filter(
              (rc: PendingAdminRoleChange) =>
                rc.status === 'pending' &&
                rc.communityName &&
                rc.communityName.toLowerCase().replace(/\s+/g, '') ===
                  (community.name || '').toLowerCase().replace(/\s+/g, ''),
            ).length;
            return {
              name: community.name,
              count: reportCount + roleChangeCount,
            };
          },
        ),
      ),
    ).then((results) => {
      const counts: { [communityName: string]: number } = {};
      results.forEach((r: { name: string; count: number }) => {
        counts[r.name] = r.count;
      });
      setModActionCount(counts);
    });
  }, [communitiesWithModerator]);

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen" data-testid="communities-page">
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
        data-testid="communities-header"
      >
        <div>
          <h1
            className="text-3xl font-bold text-social-primary mb-2"
            data-testid="communities-title"
          >
            My Communities
          </h1>
          <p className="text-social-muted" data-testid="communities-description">
            Communities you belong to and moderate
          </p>
        </div>
        <CreateCommunityDialog
          trigger={
            <Button data-testid="create-community-btn">
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </Button>
          }
        />
      </div>

      <div
        className="relative mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
        data-testid="communities-search-container"
      >
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
                setCurrentPage(1);
              }}
              className="pl-2 py-3 border-0 bg-transparent focus:ring-0 focus:outline-none shadow-none min-w-0 flex-1"
              style={{ boxShadow: 'none' }}
              data-testid="communities-search-input"
            />
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
        data-testid="communities-list"
      >
        {getCurrentPageCommunities(filteredCommunities).map((community) => (
          <CommunityCard
            key={community.slug}
            id={community.slug}
            name={community.name}
            description={community.description}
            memberCount={community.memberCount}
            tags={community.tags}
            isModerator={community.isModerator}
            isJoined={true}
            onJoinLeave={() => {
              /* implement leave logic here if needed */
            }}
            moderateButtonBadge={
              community.isModerator && modActionCount[community.name] > 0
                ? modActionCount[community.name]
                : undefined
            }
            data-testid={`community-card-${community.slug}`}
          />
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-12" data-testid="communities-empty-state">
          <p className="text-social-muted">No communities found matching your search.</p>
        </div>
      )}

      {filteredCommunities.length > communitiesPerPage && (
        <div className="flex justify-center" data-testid="communities-pagination-container">
          <Pagination data-testid="communities-pagination">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                  data-testid="communities-pagination-prev"
                />
              </PaginationItem>

              {Array.from({ length: getTotalPages(filteredCommunities) }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                      data-testid={`communities-pagination-link-${page}`}
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
                  data-testid="communities-pagination-next"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default CommunitiesPage;
