
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, Filter, ArrowUpDown, Search } from "lucide-react";

interface AdminAnalyticsFiltersProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  filterCategory: string;
  onFilterCategoryChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: "asc" | "desc";
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
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-wrap gap-3">
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-[140px]">
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
          <SelectTrigger className="w-[160px]">
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
          <SelectTrigger className="w-[140px]">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="members">Members</SelectItem>
            <SelectItem value="posts">Posts</SelectItem>
            <SelectItem value="activity">Activity</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSortToggle}
          className="px-3"
        >
          {sortOrder === "desc" ? "↓" : "↑"}
        </Button>
      </div>

      <div className="relative w-full sm:w-64">
        <div className="absolute inset-0 pointer-events-none rounded-lg border border-purple-200 bg-gradient-to-r from-purple-100/40 to-blue-100/20" />
        <div className="flex items-center gap-2 relative z-10 p-1 rounded-lg bg-white/90 border border-purple-200 w-full focus-within:border-purple-500 focus-within:shadow-lg focus-within:shadow-purple-200/40 transition-colors h-12">
          <Search className="ml-3 text-social-primary h-5 w-5" />
          <Input
            placeholder="Search communities..."
            className="pl-2 py-3 border-0 bg-transparent focus:ring-0 focus:outline-none shadow-none min-w-0 flex-1 text-base h-full"
            value={communitySearch}
            onChange={(e) => onCommunitySearchChange(e.target.value)}
            type="text"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsFilters;
