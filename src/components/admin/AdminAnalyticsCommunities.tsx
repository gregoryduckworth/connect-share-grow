
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AnalyticsCommunity } from "@/lib/types";

interface AdminAnalyticsCommunitiesProps {
  topCommunities: AnalyticsCommunity[];
  filteredCommunities: AnalyticsCommunity[];
  sortBy: string;
  selectedCommunityData: AnalyticsCommunity | undefined;
  onCommunitySelect: (communityName: string) => void;
}

const AdminAnalyticsCommunities = ({
  topCommunities,
  filteredCommunities,
  sortBy,
  selectedCommunityData,
  onCommunitySelect,
}: AdminAnalyticsCommunitiesProps) => {
  return (
    <div className="space-y-4">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            Top Communities by {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing {topCommunities.length} of {filteredCommunities.length} communities
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Members</TableHead>
                <TableHead className="text-muted-foreground">Posts</TableHead>
                <TableHead className="text-muted-foreground">Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCommunities.map((community) => (
                <TableRow 
                  key={community.id}
                  className="cursor-pointer hover:bg-muted/50 border-border"
                  onClick={() => onCommunitySelect(community.name)}
                >
                  <TableCell className="font-medium text-foreground">
                    {community.name}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {community.members.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {community.posts.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-foreground">
                    <div className="flex items-center">
                      <div className="w-12 bg-muted rounded-full h-2 mr-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${community.activity || 0}%` }}
                        />
                      </div>
                      {community.activity || 0}%
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Community Details</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedCommunityData ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                {selectedCommunityData.name}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Members</p>
                  <p className="text-2xl font-bold text-foreground">
                    {selectedCommunityData.members.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Posts</p>
                  <p className="text-2xl font-bold text-foreground">
                    {selectedCommunityData.posts.toLocaleString()}
                  </p>
                </div>
                {selectedCommunityData.comments !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">Comments</p>
                    <p className="text-2xl font-bold text-foreground">
                      {selectedCommunityData.comments.toLocaleString()}
                    </p>
                  </div>
                )}
                {selectedCommunityData.activity !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">Activity</p>
                    <p className="text-2xl font-bold text-foreground">
                      {selectedCommunityData.activity}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Click on a community to view details.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsCommunities;
