
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, UserMinus, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface InactiveModerator {
  id: string;
  name: string;
  communityId: string;
  communityName: string;
  lastActivity: Date;
  daysSinceActivity: number;
}

const InactiveModeratorAlert = () => {
  const { toast } = useToast();
  const [inactiveModerators, setInactiveModerators] = useState<InactiveModerator[]>([
    {
      id: "mod-1",
      name: "Jane Smith",
      communityId: "comm-1",
      communityName: "Photography Enthusiasts",
      lastActivity: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000), // 95 days ago
      daysSinceActivity: 95
    },
    {
      id: "mod-2",
      name: "Robert Johnson",
      communityId: "comm-2", 
      communityName: "Tech Talk",
      lastActivity: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000), // 105 days ago
      daysSinceActivity: 105
    }
  ]);

  const handleRemoveModerator = (moderatorId: string) => {
    const moderator = inactiveModerators.find(m => m.id === moderatorId);
    if (moderator) {
      setInactiveModerators(inactiveModerators.filter(m => m.id !== moderatorId));
      
      toast({
        title: "Moderator Removed",
        description: `${moderator.name} has been removed as moderator from ${moderator.communityName}.`,
        variant: "destructive"
      });
    }
  };

  const handleDismissAlert = (moderatorId: string) => {
    setInactiveModerators(inactiveModerators.filter(m => m.id !== moderatorId));
    
    toast({
      title: "Alert Dismissed",
      description: "The inactive moderator alert has been dismissed.",
    });
  };

  if (inactiveModerators.length === 0) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          Inactive Moderators Alert
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {inactiveModerators.map((moderator) => (
          <div key={moderator.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <div className="font-medium">{moderator.name}</div>
                <div className="text-sm text-muted-foreground">
                  {moderator.communityName} • Inactive for {moderator.daysSinceActivity} days
                </div>
              </div>
              <Badge variant="outline" className="bg-orange-100 text-orange-800">
                Inactive 3+ months
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDismissAlert(moderator.id)}
              >
                Dismiss
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => handleRemoveModerator(moderator.id)}
              >
                <UserMinus className="h-3.5 w-3.5 mr-1" />
                Remove Moderator
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default InactiveModeratorAlert;
