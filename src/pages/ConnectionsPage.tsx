import { useState, useEffect } from "react";
import { Search, Users, MessageCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import UserProfileDialog from "@/components/user/UserProfileDialog";
import InfoCard from "@/components/ui/InfoCard";
import UserProfileLink from "@/components/user/UserProfileLink";
import { connectionService } from "@/lib/backend/services/connectionService";
import { USERS_DATA } from "@/lib/backend/data/users";
import { useAuth } from "@/contexts/AuthContext";
import { Connection, ConnectionRequest } from "@/lib/types";
import { useDialog } from "@/hooks/useDialog";
import { formatDate } from "@/lib/utils";

const ConnectionsPage = () => {
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const profileDialog = useDialog(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<
    ConnectionRequest[]
  >([]);

  useEffect(() => {
    if (!user?.id) return;
    // Load connections for the current user from backend service
    connectionService.getConnectionsForUser(user.id).then((conns) => {
      // Map backend connection data to Connection type for UI
      setConnections(
        conns.map((c) => {
          const userObj = USERS_DATA.find((u) => u.id === c.id);
          return {
            id: c.id,
            name: userObj?.name || "Unknown",
            mutualConnections: c.mutualConnections,
            status: c.status,
            lastActive: c.lastActive,
            bio: userObj?.bio,
          };
        })
      );
    });
  }, [user?.id]);

  useEffect(() => {
    // Load connection requests from localStorage
    const requests = JSON.parse(
      localStorage.getItem("connectionRequests") || "[]"
    );
    setConnectionRequests(requests);
  }, []);

  // Sync requests if a new one is added (e.g., after sending from dialog)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "connectionRequests") {
        const requests = JSON.parse(
          localStorage.getItem("connectionRequests") || "[]"
        );
        setConnectionRequests(requests);
      }
    };
    window.addEventListener("storage", onStorage);
    // Also poll every 1s in case of same-tab update
    const interval = setInterval(() => {
      const requests = JSON.parse(
        localStorage.getItem("connectionRequests") || "[]"
      );
      setConnectionRequests(requests);
    }, 1000);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, []);

  const connectedUsers = connections.filter((c) => c.status === "connected");
  const pendingRequests = connections.filter((c) => c.status === "pending");

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
    profileDialog.open();
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div
      className="p-4 md:p-6 space-y-6 bg-background min-h-screen"
      data-testid="connections-page"
    >
      <div className="mb-6" data-testid="connections-header">
        <h1
          className="text-3xl font-bold text-social-primary mb-2"
          data-testid="connections-title"
        >
          My Connections
        </h1>
        <p
          className="text-sm sm:text-base text-muted-foreground"
          data-testid="connections-description"
        >
          Manage your network and connection requests
        </p>
      </div>

      <div
        className="relative mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
        data-testid="connections-search-container"
      >
        <div className="flex-1 relative">
          <div
            className="absolute inset-0 pointer-events-none rounded-lg border border-purple-200 bg-gradient-to-r from-purple-100/40 to-blue-100/20"
            style={{ zIndex: 0 }}
          />
          <div className="flex items-center gap-2 relative z-10 p-1 rounded-lg bg-white/90 border border-purple-200 w-full focus-within:border-purple-500 focus-within:shadow-lg focus-within:shadow-purple-200/40 transition-colors">
            <Search className="ml-3 text-social-primary h-5 w-5" />
            <Input
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-2 py-3 border-0 bg-transparent focus:ring-0 focus:outline-none shadow-none min-w-0 flex-1"
              style={{ boxShadow: "none" }}
              data-testid="connections-search-input"
            />
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="connected"
        className="w-full"
        data-testid="connections-tabs"
      >
        <TabsList
          className="grid w-full grid-cols-3 mb-6"
          data-testid="connections-tabs-list"
        >
          <TabsTrigger
            value="connected"
            className="text-xs sm:text-sm"
            data-testid="tab-connected"
          >
            Connected ({connectedUsers.length})
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="text-xs sm:text-sm"
            data-testid="tab-pending"
          >
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="text-xs sm:text-sm"
            data-testid="tab-requests"
          >
            Requests ({connectionRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connected" data-testid="tab-content-connected">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConnections.map((connection) => (
              <InfoCard
                key={connection.id}
                title={
                  <UserProfileLink
                    userId={connection.id}
                    userName={connection.name}
                  />
                }
                description={connection.bio}
                headerRight={
                  <Badge
                    variant="outline"
                    className="text-xs whitespace-nowrap"
                  >
                    {connection.mutualConnections} mutual
                  </Badge>
                }
                contentTop={
                  <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-2">
                    <span className="break-words">
                      Last active: {formatDate(connection.lastActive)}
                    </span>
                  </div>
                }
                actions={
                  <Button
                    variant="outline"
                    className="flex-1 text-xs sm:text-sm"
                    data-testid={`message-btn-${connection.id}`}
                  >
                    <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Message
                  </Button>
                }
                data-testid={`connection-card-${connection.id}`}
              />
            ))}
          </div>

          {filteredConnections.length === 0 && (
            <div
              className="text-center py-12"
              data-testid="connections-empty-state"
            >
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No connections found.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" data-testid="tab-content-pending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRequests.map((connection) => (
              <InfoCard
                key={connection.id}
                title={
                  <UserProfileLink
                    userId={connection.id}
                    userName={connection.name}
                  />
                }
                description={connection.bio}
                headerRight={
                  <Badge
                    variant="outline"
                    className="text-xs whitespace-nowrap"
                  >
                    {connection.mutualConnections} mutual
                  </Badge>
                }
                contentTop={
                  <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-2">
                    <span className="break-words">
                      Last active: {formatDate(connection.lastActive)}
                    </span>
                  </div>
                }
                actions={
                  <Button
                    onClick={() => handleViewProfile(connection)}
                    variant="outline"
                    className="flex-1 text-xs sm:text-sm"
                    data-testid={`view-profile-btn-${connection.id}`}
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    View Profile
                  </Button>
                }
                data-testid={`pending-card-${connection.id}`}
              />
            ))}
          </div>

          {pendingRequests.length === 0 && (
            <div
              className="text-center py-12"
              data-testid="pending-empty-state"
            >
              <p className="text-muted-foreground">No pending requests.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" data-testid="tab-content-requests">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectionRequests.map((request) => (
              <InfoCard
                key={request.id + request.date}
                title={
                  <UserProfileLink
                    userId={request.id}
                    userName={request.name}
                  />
                }
                description={request.message}
                headerRight={
                  <span className="text-xs text-muted-foreground">
                    {formatDate(new Date(request.date))}
                  </span>
                }
                actions={
                  <Button
                    variant="outline"
                    className="flex-1 text-xs sm:text-sm"
                    disabled
                    data-testid={`pending-btn-${request.id}`}
                  >
                    Pending
                  </Button>
                }
                data-testid={`request-card-${request.id}`}
              />
            ))}
          </div>

          {connectionRequests.length === 0 && (
            <div
              className="text-center py-12"
              data-testid="requests-empty-state"
            >
              <p className="text-muted-foreground">No connection requests.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedUserId && (
        <UserProfileDialog
          userId={selectedUserId!}
          isOpen={profileDialog.isOpen}
          onClose={profileDialog.close}
        />
      )}
    </div>
  );
};

export default ConnectionsPage;
