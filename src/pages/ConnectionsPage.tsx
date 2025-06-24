import { useState } from "react";
import { Search, Users, MessageCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import UserProfileDialog from "@/components/user/UserProfileDialog";

interface Connection {
  id: string;
  name: string;
  mutualConnections: number;
  status: "connected" | "pending" | "received";
  lastActive: Date;
  bio?: string;
}

const ConnectionsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const [connections, setConnections] = useState<Connection[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      mutualConnections: 12,
      status: "connected",
      lastActive: new Date(2024, 5, 20),
      bio: "Photography enthusiast and travel blogger",
    },
    {
      id: "2",
      name: "Mike Chen",
      mutualConnections: 8,
      status: "connected",
      lastActive: new Date(2024, 5, 19),
      bio: "Software developer and tech enthusiast",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      mutualConnections: 5,
      status: "pending",
      lastActive: new Date(2024, 5, 18),
      bio: "Digital marketing specialist",
    },
    {
      id: "4",
      name: "David Kim",
      mutualConnections: 3,
      status: "received",
      lastActive: new Date(2024, 5, 17),
      bio: "Graphic designer and artist",
    },
  ]);

  const connectedUsers = connections.filter((c) => c.status === "connected");
  const pendingRequests = connections.filter((c) => c.status === "pending");
  const receivedRequests = connections.filter((c) => c.status === "received");

  const filteredConnections = connectedUsers.filter((connection) =>
    connection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAcceptRequest = (connectionId: string) => {
    setConnections(
      connections.map((connection) =>
        connection.id === connectionId
          ? { ...connection, status: "connected" as const }
          : connection
      )
    );

    const connection = connections.find((c) => c.id === connectionId);
    toast({
      title: "Connection accepted",
      description: `You are now connected with ${connection?.name}`,
    });
  };

  const handleRejectRequest = (connectionId: string) => {
    setConnections(
      connections.filter((connection) => connection.id !== connectionId)
    );

    const connection = connections.find((c) => c.id === connectionId);
    toast({
      title: "Connection rejected",
      description: `Request from ${connection?.name} has been declined`,
    });
  };

  const handleViewProfile = (connection: Connection) => {
    setSelectedUserId(connection.id);
    setProfileDialogOpen(true);
  };

  const ConnectionCard = ({
    connection,
    showActions = false,
  }: {
    connection: Connection;
    showActions?: boolean;
  }) => (
    <Card className="hover-scale text-left transition-shadow hover:shadow-xl hover:bg-accent/60 hover:border-accent h-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base sm:text-lg break-words">
              {connection.name}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1 break-words">
              {connection.bio}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs whitespace-nowrap">
            {connection.mutualConnections} mutual
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
          <span className="break-words">
            Last active: {connection.lastActive.toLocaleDateString()}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {showActions ? (
            <>
              <Button
                onClick={() => handleAcceptRequest(connection.id)}
                className="flex-1 text-xs sm:text-sm"
              >
                Accept
              </Button>
              <Button
                onClick={() => handleRejectRequest(connection.id)}
                variant="outline"
                className="flex-1 text-xs sm:text-sm"
              >
                Decline
              </Button>
            </>
          ) : connection.status === "pending" ? (
            <Button
              onClick={() => handleViewProfile(connection)}
              variant="outline"
              className="flex-1 text-xs sm:text-sm"
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              View Profile
            </Button>
          ) : (
            <Button variant="outline" className="flex-1 text-xs sm:text-sm">
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Message
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-social-primary mb-2">
          My Connections
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your network and connection requests
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search connections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="connected" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="connected" className="text-xs sm:text-sm">
            Connected ({connectedUsers.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs sm:text-sm">
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="requests" className="text-xs sm:text-sm">
            Requests ({receivedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connected">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConnections.map((connection) => (
              <ConnectionCard key={connection.id} connection={connection} />
            ))}
          </div>

          {filteredConnections.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No connections found.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRequests.map((connection) => (
              <ConnectionCard key={connection.id} connection={connection} />
            ))}
          </div>

          {pendingRequests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No pending requests.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {receivedRequests.map((connection) => (
              <ConnectionCard
                key={connection.id}
                connection={connection}
                showActions
              />
            ))}
          </div>

          {receivedRequests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No connection requests.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedUserId && (
        <UserProfileDialog
          userId={selectedUserId}
          isOpen={profileDialogOpen}
          onClose={() => {
            setProfileDialogOpen(false);
            setSelectedUserId(null);
          }}
          currentUserId="current-user-id"
          showConnectionButton={false}
        />
      )}
    </div>
  );
};

export default ConnectionsPage;
