import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TrendingPostCardProps {
  id: string;
  title: string;
  author: string;
  community: string;
  likes: number;
  replies: number;
  createdAt: Date;
  excerpt: string;
}

const TrendingPostCard = ({
  id,
  title,
  author,
  community,
  likes,
  replies,
  createdAt,
  excerpt,
}: TrendingPostCardProps) => (
  <Card className="flex flex-col h-full border-2 transition-shadow hover:shadow-xl hover:scale-[1.03] border-border hover:border-purple-400 hover:bg-purple-50 focus-within:border-purple-500 focus-within:bg-purple-50">
    <CardHeader className="flex-1 pb-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <CardTitle className="text-base sm:text-lg break-words">
            <Link
              to={`/post/${id}`}
              className="hover:text-primary transition-colors"
            >
              {title}
            </Link>
          </CardTitle>
          <div className="text-xs sm:text-sm mt-2 break-words text-muted-foreground">
            {excerpt}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 min-w-[60px]">
          <div className="flex items-center gap-1 text-xs">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
            <span>{replies}</span>
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent className="flex flex-col flex-1 justify-end">
      <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
        <span className="text-muted-foreground">Author</span>
        <span className="font-medium">{author}</span>
      </div>
      <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
        <span className="text-muted-foreground">Community</span>
        <span className="font-medium">{community}</span>
      </div>
      <div className="flex items-center justify-between text-xs sm:text-sm mb-4">
        <span className="text-muted-foreground">Posted</span>
        <span className="font-medium">{formatDate(createdAt)}</span>
      </div>
      <div className="flex gap-2 mt-auto w-full">
        <Button className="w-full text-xs sm:text-sm" asChild>
          <Link to={`/post/${id}`}>Read More</Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default TrendingPostCard;
