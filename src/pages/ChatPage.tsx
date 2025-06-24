import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Search, MessageSquare, Plus, Users, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import ChatInterface from "@/components/chat/ChatInterface";

interface Chat {
  id: string;
  name: string;
  type: "individual" | "group";
  participants: string[];
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
}

interface Friend {
  id: string;
  name: string;
  email: string;
  isOnline: boolean;
}

const ChatPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const currentUser = "current-user";

  // Mock friends data
  const friends: Friend[] = [
    {
      id: "friend-1",
      name: "Alice Johnson",
      email: "alice@example.com",
      isOnline: true,
    },
    {
      id: "friend-2",
      name: "Bob Smith",
      email: "bob@example.com",
      isOnline: false,
    },
    {
      id: "friend-3",
      name: "Carol Davis",
      email: "carol@example.com",
      isOnline: true,
    },
    {
      id: "friend-4",
      name: "David Wilson",
      email: "david@example.com",
      isOnline: false,
    },
  ];

  const [chats, setChats] = useState<Chat[]>([
    {
      id: "chat-1",
      name: "Alice Johnson",
      type: "individual",
      participants: ["Alice Johnson"],
      lastMessage: "Hey! How are you doing?",
      timestamp: new Date(2024, 5, 20, 14, 30),
      unreadCount: 2,
    },
    {
      id: "chat-2",
      name: "Photography Group",
      type: "group",
      participants: ["Alice Johnson", "Bob Smith", "Carol Davis"],
      lastMessage: "Check out this sunset shot!",
      timestamp: new Date(2024, 5, 20, 12, 15),
      unreadCount: 0,
    },
    {
      id: "chat-3",
      name: "Bob Smith",
      type: "individual",
      participants: ["Bob Smith"],
      lastMessage: "Thanks for the help!",
      timestamp: new Date(2024, 5, 19, 16, 45),
      unreadCount: 0,
    },
  ]);

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartIndividualChat = (friendId: string) => {
    const friend = friends.find((f) => f.id === friendId);
    if (!friend) return;

    const existingChat = chats.find(
      (chat) =>
        chat.type === "individual" && chat.participants.includes(friend.name)
    );

    if (existingChat) {
      setSelectedChat(existingChat.id);
    } else {
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        name: friend.name,
        type: "individual",
        participants: [friend.name],
        lastMessage: "Start your conversation...",
        timestamp: new Date(),
        unreadCount: 0,
      };
      setChats([newChat, ...chats]);
      setSelectedChat(newChat.id);
    }
    setNewChatDialogOpen(false);
  };

  const handleStartGroupChat = () => {
    if (selectedFriends.length === 0 || !groupName.trim()) return;

    const participantNames = selectedFriends
      .map((friendId) => friends.find((f) => f.id === friendId)?.name || "")
      .filter(Boolean);

    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      name: groupName,
      type: "group",
      participants: participantNames,
      lastMessage: "Group created!",
      timestamp: new Date(),
      unreadCount: 0,
    };

    setChats([newChat, ...chats]);
    setSelectedChat(newChat.id);
    setSelectedFriends([]);
    setGroupName("");
    setNewChatDialogOpen(false);
  };

  const handleFriendSelection = (friendId: string, checked: boolean) => {
    if (checked) {
      setSelectedFriends([...selectedFriends, friendId]);
    } else {
      setSelectedFriends(selectedFriends.filter((id) => id !== friendId));
    }
  };

  const selectedChatData = chats.find((chat) => chat.id === selectedChat);

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Messages</CardTitle>
                <Dialog
                  open={newChatDialogOpen}
                  onOpenChange={setNewChatDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Chat
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Start New Chat</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">
                          Start Individual Chat
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {friends.map((friend) => (
                            <div
                              key={friend.id}
                              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                              onClick={() =>
                                handleStartIndividualChat(friend.id)
                              }
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 bg-social-primary text-white">
                                  <div className="flex h-full w-full items-center justify-center">
                                    <User className="h-4 w-4" />
                                  </div>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">
                                    {friend.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {friend.email}
                                  </p>
                                </div>
                              </div>
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  friend.isOnline
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Create Group Chat</h4>
                        <Input
                          placeholder="Group name..."
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                          className="mb-3"
                        />
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {friends.map((friend) => (
                            <div
                              key={friend.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={friend.id}
                                checked={selectedFriends.includes(friend.id)}
                                onCheckedChange={(checked) =>
                                  handleFriendSelection(
                                    friend.id,
                                    checked as boolean
                                  )
                                }
                              />
                              <label
                                htmlFor={friend.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {friend.name}
                              </label>
                            </div>
                          ))}
                        </div>
                        <Button
                          onClick={handleStartGroupChat}
                          disabled={
                            selectedFriends.length === 0 || !groupName.trim()
                          }
                          className="w-full mt-3"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Create Group
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-3 cursor-pointer hover:bg-gray-50 ${
                      selectedChat === chat.id ? "bg-social-accent/20" : ""
                    }`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-social-primary text-white">
                        <div className="flex h-full w-full items-center justify-center">
                          {chat.type === "group" ? (
                            <Users className="h-5 w-5" />
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </div>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">
                            {chat.name}
                          </p>
                          <span className="text-xs text-gray-500">
                            {chat.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 truncate">
                            {chat.lastMessage}
                          </p>
                          {chat.unreadCount > 0 && (
                            <Badge className="bg-social-primary text-xs px-2">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>

                        {chat.type === "group" && (
                          <p className="text-xs text-gray-400">
                            {chat.participants.length} participants
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredChats.length === 0 && (
                <div className="text-center p-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">No conversations found</p>
                  <p className="text-sm text-gray-400">
                    Start a chat with your friends!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            {selectedChatData ? (
              <ChatInterface
                chatId={selectedChatData.id}
                chatName={selectedChatData.name}
                chatType={selectedChatData.type}
                participants={selectedChatData.participants}
                currentUser={currentUser}
              />
            ) : (
              <CardContent className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">
                    Select a conversation
                  </h3>
                  <p>Choose a chat to start messaging with your friends</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
