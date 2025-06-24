import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";

interface CommunityCardProps {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  tags?: string[];
  growthRate?: number;
  category?: string;
  isJoined?: boolean;
  isModerator?: boolean;
  onJoinLeave?: (id: string) => void;
}

const CommunityCard = ({
  id,
  name,
  description,
  memberCount,
  tags = [],
  growthRate,
  category,
  isJoined,
  isModerator,
  onJoinLeave,
}: CommunityCardProps) => (
  <Card className="flex flex-col h-full border-2 transition-shadow hover:shadow-xl hover:scale-[1.03] hover:border-purple-400 hover:bg-purple-50 focus-within:border-purple-500 focus-within:bg-purple-50">
    <CardHeader className="flex-1 pb-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <CardTitle className="text-base sm:text-lg break-words">
            <Link
              to={`/community/${id}`}
              className="hover:text-primary transition-colors"
            >
              {name}
            </Link>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm mt-2 break-words">
            {description}
          </CardDescription>
        </div>
        {growthRate !== undefined && (
          <Badge
            variant="outline"
            className={`text-xs whitespace-nowrap ${
              growthRate >= 0
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {growthRate >= 0 ? "+" : ""}
            {growthRate}%
          </Badge>
        )}
      </div>
    </CardHeader>
    <CardContent className="flex flex-col flex-1 justify-end">
      <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
        <span className="text-muted-foreground">Members</span>
        <span className="font-medium">{memberCount.toLocaleString()}</span>
      </div>
      {category && (
        <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
          <span className="text-muted-foreground">Category</span>
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
        </div>
      )}
      {tags.length > 0 && (
        <div className="flex items-center justify-between text-xs sm:text-sm mb-4">
          <span className="text-muted-foreground">Tags</span>
          <span className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </span>
        </div>
      )}
      <div className="flex gap-2 mt-auto w-full">
        {onJoinLeave ? (
          <Button
            onClick={() => onJoinLeave(id)}
            variant={isJoined ? "outline" : "default"}
            className="flex-1 min-w-0 h-10"
          >
            {isJoined ? "Leave" : "Join"}
          </Button>
        ) : (
          <Button className="w-full text-xs sm:text-sm" asChild>
            <Link to={`/community/${id}`}>Join Community</Link>
          </Button>
        )}
        {isModerator && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-10 min-w-[100px]"
          >
            <Link to="/moderate">Moderate</Link>
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

export default CommunityCard;
