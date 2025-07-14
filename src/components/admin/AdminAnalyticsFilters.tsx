
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import * as React from 'react';
import { Calendar, Filter, ArrowUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { communityService } from '@/lib/backend/services/communityService';
import type { Community } from '@/lib/types';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';

interface AdminAnalyticsFiltersProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  filterCategory: string;
  onFilterCategoryChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortToggle: () => void;
  communitySearch: string;
  onCommunitySearchChange: (value: string) => void;
}

const AdminAnalyticsFilters = ({
  timeRange,
  onTimeRangeChange,
  filterCategory,
  onFilterCategoryChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortToggle,
  communitySearch,
  onCommunitySearchChange,
}: AdminAnalyticsFiltersProps) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [inputFocused, setInputFocused] = useState(false);
  const searchWrapperRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    communityService.getCommunities().then(setCommunities);
  }, []);

  // Filter communities for autocomplete
  const filteredCommunities = communitySearch
    ? communities.filter((c) => c.name.toLowerCase().includes(communitySearch.toLowerCase()))
    : communities;

  const showDropdown =
    inputFocused && communitySearch.length >= 1 && filteredCommunities.length > 0;

  // Handle blur to close dropdown only if focus leaves the wrapper
  function handleBlur() {
    setTimeout(() => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(document.activeElement)) {
        setInputFocused(false);
      }
    }, 0);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-wrap gap-3">
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-[140px] h-12">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterCategory} onValueChange={onFilterCategoryChange}>
          <SelectTrigger className="w-[160px] h-12">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Communities</SelectItem>
            <SelectItem value="high-activity">High Activity</SelectItem>
            <SelectItem value="low-activity">Low Activity</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-[140px] h-12">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="members">Members</SelectItem>
            <SelectItem value="posts">Posts</SelectItem>
            <SelectItem value="activity">Activity</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={onSortToggle} className="px-3 h-12">
          {sortOrder === 'desc' ? '↓' : '↑'}
        </Button>
      </div>
      <div className={`w-full sm:w-[260px] relative`} ref={searchWrapperRef}>
        <Command className="w-full border border-purple-200 bg-white transition-all rounded-lg">
          <CommandInput
            placeholder="Search communities..."
            value={communitySearch}
            onValueChange={onCommunitySearchChange}
            onFocus={() => setInputFocused(true)}
            onBlur={handleBlur}
            className="h-12 text-base rounded-lg"
          />
          {showDropdown && (
            <CommandList className="absolute left-0 top-full mt-0 z-20 w-full bg-white border border-purple-200 shadow-md max-h-60 overflow-y-auto rounded-lg p-1">
              {filteredCommunities.length === 0 && (
                <CommandEmpty>No communities found.</CommandEmpty>
              )}
              {filteredCommunities.map((community) => (
                <CommandItem
                  key={community.slug}
                  value={community.name}
                  onSelect={() => {
                    onCommunitySearchChange(community.name);
                    setInputFocused(false);
                  }}
                  className="cursor-pointer rounded-md px-3 py-2 text-base data-[selected=true]:bg-gray-100 data-[selected=true]:text-black"
                >
                  {community.name}
                </CommandItem>
              ))}
            </CommandList>
          )}
        </Command>
      </div>
    </div>
  );
};

export default AdminAnalyticsFilters;
