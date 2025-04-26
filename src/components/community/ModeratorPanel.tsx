
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Lock, MessageSquare, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface Report {
  id: string;
  contentType: 'post' | 'reply';
  contentId: string;
  contentTitle?: string;
  contentPreview: string;
  reportedBy: string;
  reason: string;
  createdAt: Date;
  status: 'pending' | 'reviewed';
}

interface ModeratorPanelProps {
  communityId: string;
  reports: Report[];
  onResolveReport: (reportId: string) => void;
  onLockPost: (postId: string) => void;
  onLockComments: (postId: string) => void;
}

const ModeratorPanel = ({ 
  communityId, 
  reports, 
  onResolveReport,
  onLockPost,
  onLockComments
}: ModeratorPanelProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("reports");
  
  const pendingReports = reports.filter(report => report.status === 'pending');
  const resolvedReports = reports.filter(report => report.status === 'reviewed');

  const handleResolveReport = (reportId: string) => {
    onResolveReport(reportId);
    
    toast({
      title: "Report resolved",
      description: "The report has been marked as reviewed.",
    });
  };

  const handleLockPost = (postId: string) => {
    onLockPost(postId);
    
    toast({
      title: "Post locked",
      description: "The post has been locked successfully.",
    });
  };

  const handleLockComments = (postId: string) => {
    onLockComments(postId);
    
    toast({
      title: "Comments locked",
      description: "Comments for this post have been locked successfully.",
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-social-primary" />
          <CardTitle>Moderator Panel</CardTitle>
        </div>
        <CardDescription>
          Manage reported content and moderate community discussions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reports" className="flex gap-2 items-center">
              <AlertTriangle className="h-4 w-4" />
              <span>Reported Content</span>
              {pendingReports.length > 0 && (
                <Badge className="ml-1 bg-red-500">{pendingReports.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="resolved">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Resolved Reports
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports" className="pt-4">
            {pendingReports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="mx-auto h-10 w-10 mb-2 text-muted-foreground/60" />
                <p>No pending reports at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReports.map((report) => (
                  <Card key={report.id} className="border-orange-200">
                    <CardHeader className="py-3 px-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="bg-orange-100 text-orange-800">
                              {report.contentType === 'post' ? 'Post' : 'Reply'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Reported on {formatDate(report.createdAt)}
                            </span>
                          </div>
                          <div className="font-medium">
                            {report.contentTitle || `Reported ${report.contentType}`}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 px-4">
                      <div className="mb-2">
                        <div className="text-sm font-medium text-muted-foreground mb-1">Content preview:</div>
                        <div className="text-sm border-l-2 border-gray-200 pl-3 py-1 mb-2 bg-gray-50 rounded">
                          {report.contentPreview}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Reason for report:</div>
                        <div className="text-sm border-l-2 border-orange-200 pl-3 py-1 bg-orange-50 rounded">
                          {report.reason}
                        </div>
                      </div>
                    </CardContent>
                    <div className="px-4 pb-4 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleResolveReport(report.id)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Mark as Resolved
                      </Button>
                      {report.contentType === 'post' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs border-orange-200 hover:bg-orange-50"
                            onClick={() => handleLockPost(report.contentId)}
                          >
                            <Lock className="h-3.5 w-3.5 mr-1" />
                            Lock Post
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs border-amber-200 hover:bg-amber-50"
                            onClick={() => handleLockComments(report.contentId)}
                          >
                            <MessageSquare className="h-3.5 w-3.5 mr-1" />
                            Lock Comments
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="resolved" className="pt-4">
            {resolvedReports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="mx-auto h-10 w-10 mb-2 text-muted-foreground/60" />
                <p>No resolved reports yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {resolvedReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge variant="outline" className="bg-gray-100 text-gray-800">
                          {report.contentType === 'post' ? 'Post' : 'Reply'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(report.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-1">{report.contentPreview}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Resolved
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ModeratorPanel;
