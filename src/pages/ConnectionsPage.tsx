
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Check, X, MessageCircle } from "lucide-react";
import { api } from "@/lib/api";
import { Connection, User } from "@/lib/types";
import { useNavigate } from "react-router-dom";

const ConnectionsPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [connectionMessage, setConnectionMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [connectionsData, usersData] = await Promise.all([
          api.getConnections("user-1"), // Current user ID
          api.getUsers()
        ]);
        setConnections(connectionsData);
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateConnection = async () => {
    if (!selectedUserId || !connectionMessage.trim()) {
      toast({
        title: "Error",
        description: "Please select a user and provide a message.",
        variant: "destructive"
      });
      return;
    }

    const selectedUser = users.find(u => u.id === selectedUserId);
    if (!selectedUser) return;

    try {
      const newConnection = await api.createConnectionRequest({
        fromUserId: "user-1", // Current user ID
        toUserId: selectedUserId,
        fromUserName: "John Doe", // Current user name
        toUserName: selectedUser.name,
        message: connectionMessage
      });

      setConnections([...connections, newConnection]);
      setIsCreateDialogOpen(false);
      setSelectedUserId("");
      setConnectionMessage("");

      toast({
        title: "Connection Request Sent",
        description: `Your connection request to ${selectedUser.name} has been sent.`,
      });
    } catch (error) {
      console.error("Failed to create connection:", error);
      toast({
        title: "Error",
        description: "Failed to send connection request.",
        variant: "destructive"
      });
    }
  };

  const handleRespondToConnection = async (connectionId: string, response: "accepted" | "declined") => {
    try {
      await api.respondToConnection(connectionId, response);
      setConnections(connections.map(c => 
        c.id === connectionId 
          ? { ...c, status: response, respondedAt: new Date() }
          : c
      ));

      toast({
        title: response === "accepted" ? "Connection Accepted" : "Connection Declined",
        description: `You have ${response} the connection request.`,
      });
    } catch (error) {
      console.error("Failed to respond to connection:", error);
      toast({
        title: "Error",
        description: "Failed to respond to connection request.",
        variant: "destructive"
      });
    }
  };

  const handleStartChat = (connectionId: string) => {
    navigate(`/chat?connection=${connectionId}`);
  };

  const pendingRequests = connections.filter(c => c.status === "pending");
  const acceptedConnections = connections.filter(c => c.status === "accepted");
  const sentRequests = connections.filter(c => c.fromUserId === "user-1" && c.status === "pending");
  const receivedRequests = connections.filter(c => c.toUserId === "user-1" && c.status === "pending");

  if (loading) {
    return <div className="container mx-auto px-4 py-6">Loading connections...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-social-primary">My Connections</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Connection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Connection Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="user-select">Select User</Label>
                <select
                  id="user-select"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="">Choose a user...</option>
                  {users.filter(u => u.id !== "user-1").map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="message">Connection Message</Label>
                <Textarea
                  id="message"
                  value={connectionMessage}
                  onChange={(e) => setConnectionMessage(e.target.value)}
                  placeholder="Why would you like to connect with this person?"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateConnection}>
                  Send Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="accepted" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="accepted">
            Connections ({acceptedConnections.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({receivedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Sent ({sentRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accepted" className="space-y-4">
          {acceptedConnections.length === 0 ? (
            <Card>
              <CardContent className="text-left p-6">
                <div className="flex items-center gap-3 text-gray-500">
                  <Users className="h-8 w-8" />
                  <p>No accepted connections yet.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            acceptedConnections.map((connection) => (
              <Card key={connection.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="font-semibold">
                        {connection.fromUserId === "user-1" ? connection.toUserName : connection.fromUserName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{connection.message}</p>
                      <p className="text-xs text-gray-400">
                        Connected on {connection.respondedAt?.toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleStartChat(connection.id)}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {receivedRequests.length === 0 ? (
            <Card>
              <CardContent className="text-left p-6">
                <div className="flex items-center gap-3 text-gray-500">
                  <Users className="h-8 w-8" />
                  <p>No pending connection requests.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            receivedRequests.map((connection) => (
              <Card key={connection.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="font-semibold">{connection.fromUserName}</h3>
                      <p className="text-sm text-gray-600 mb-2">{connection.message}</p>
                      <p className="text-xs text-gray-400">
                        Requested on {connection.requestedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        onClick={() => handleRespondToConnection(connection.id, "accepted")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleRespondToConnection(connection.id, "declined")}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentRequests.length === 0 ? (
            <Card>
              <CardContent className="text-left p-6">
                <div className="flex items-center gap-3 text-gray-500">
                  <Users className="h-8 w-8" />
                  <p>No sent connection requests.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            sentRequests.map((connection) => (
              <Card key={connection.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="font-semibold">{connection.toUserName}</h3>
                      <p className="text-sm text-gray-600 mb-2">{connection.message}</p>
                      <p className="text-xs text-gray-400">
                        Sent on {connection.requestedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConnectionsPage;
