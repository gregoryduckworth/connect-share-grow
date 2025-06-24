
import { useState } from "react";
import { Search, Users, UserCheck, UserPlus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import UserProfileDialog from "@/components/user/UserProfileDialog";

interface Connection {
  id: string;
  name: string;
  email: string;
  mutualConnections: number;
  status: 'connected' | 'pending' | 'suggested';
  connectionDate?: Date;
}

const ConnectionsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [connections, setConnections] = useState<Connection[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      mutualConnections: 12,
      status: 'connected',
      connectionDate: new Date(2024, 3, 15)
    },
    {
      id: "2",
      name: "Mike Chen",
      email: "mike.chen@example.com", 
      mutualConnections: 8,
      status: 'connected',
      connectionDate: new Date(2024, 4, 2)
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      mutualConnections: 5,
      status: 'pending'
    },
    {
      id: "4",
      name: "David Kim",
      email: "david.kim@example.com",
      mutualConnections: 15,
      status: 'suggested'
    },
    {
      id: "5",
      name: "Lisa Thompson",
      email: "lisa.thompson@example.com",
      mutualConnections: 3,
      status: 'pending'
    },
    {
      id: "6",
      name: "Alex Rivera",
      email: "alex.rivera@example.com",
      mutualConnections: 7,
      status: 'suggested'
    }
  ]);

  const filteredConnections = connections.filter(connection =>
    connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connection.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const connectedUsers = filteredConnections.filter(c => c.status === 'connected');
  const pendingRequests = filteredConnections.filter(c => c.status === 'pending');
  const suggestedConnections = filteredConnections.filter(c => c.status === 'suggested');

  const handleAcceptConnection = (connectionId: string) => {
    setConnections(connections.map(conn => 
      conn.id === connectionId 
        ? { ...conn, status: 'connected' as const, connectionDate: new Date() }
        : conn
    ));
    
    const connection = connections.find(c => c.id === connectionId);
    toast({
      title: "Connection accepted",
      description: `You are now connected with ${connection?.name}`,
    });
  };

  const handleDeclineConnection = (connectionId: string) => {
    setConnections(connections.filter(conn => conn.id !== connectionId));
    
    const connection = connections.find(c => c.id === connectionId);
    toast({
      title: "Connection declined",
      description: `Connection request from ${connection?.name} declined`,
    });
  };

  const handleSendConnectionRequest = (connectionId: string) => {
    setConnections(connections.map(conn => 
      conn.id === connectionId 
        ? { ...conn, status: 'pending' as const }
        : conn
    ));
    
    const connection = connections.find(c => c.id === connectionId);
    toast({
      title: "Connection request sent",
      description: `Connection request sent to ${connection?.name}`,
    });
  };

  const handleRemoveConnection = (connectionId: string) => {
    setConnections(connections.filter(conn => conn.id !== connectionId));
    
    const connection = connections.find(c => c.id === connectionId);
    toast({
      title: "Connection removed",
      description: `You are no longer connected with ${connection?.name}`,
    });
  };

  const ConnectionCard = ({ connection, showActions = true }: { connection: Connection; showActions?: boolean }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              {connection.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-semibold">
              <button 
                className="hover:text-social-primary transition-colors cursor-pointer"
                onClick={() => setSelectedUserId(connection.id)}
              >
                {connection.name}
              </button>
            </h3>
            <p className="text-sm text-social-muted">{connection.email}</p>
            <p className="text-xs text-social-muted mt-1">
              {connection.mutualConnections} mutual connections
            </p>
            {connection.connectionDate && (
              <p className="text-xs text-social-muted">
                Connected on {connection.connectionDate.toLocaleDateString()}
              </p>
            )}
          </div>
          
          {showActions && (
            <div className="flex gap-2">
              {connection.status === 'connected' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveConnection(connection.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              
              {connection.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleAcceptConnection(connection.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeclineConnection(connection.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUserId(connection.id)}
                  >
                    View Profile
                  </Button>
                </>
              )}
              
              {connection.status === 'suggested' && (
                <Button
                  size="sm"
                  onClick={() => handleSendConnectionRequest(connection.id)}
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-social-primary mb-2">Connections</h1>
        <p className="text-social-muted">Manage your network and discover new connections</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-social-muted h-4 w-4" />
        <Input
          placeholder="Search connections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="connected" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connected" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Connected ({connectedUsers.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Requests ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="suggested" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Suggested ({suggestedConnections.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="connected" className="mt-6">
          <div className="space-y-4">
            {connectedUsers.map((connection) => (
              <ConnectionCard key={connection.id} connection={connection} />
            ))}
            
            {connectedUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-social-muted">No connections found.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          <div className="space-y-4">
            {pendingRequests.map((connection) => (
              <ConnectionCard key={connection.id} connection={connection} />
            ))}
            
            {pendingRequests.length === 0 && (
              <div className="text-center py-12">
                <p className="text-social-muted">No pending connection requests.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="suggested" className="mt-6">
          <div className="space-y-4">
            {suggestedConnections.map((connection) => (
              <ConnectionCard key={connection.id} connection={connection} />
            ))}
            
            {suggestedConnections.length === 0 && (
              <div className="text-center py-12">
                <p className="text-social-muted">No suggested connections at the moment.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* User Profile Dialog */}
      {selectedUserId && (
        <UserProfileDialog
          userId={selectedUserId}
          isOpen={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
          currentUserId="current-user-id"
          showConnectionButton={false}
        />
      )}
    </div>
  );
};

export default ConnectionsPage;
