import { useState, useMemo, useEffect } from "react";
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

  // Helper for avatar fallback
  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  const [showChatList, setShowChatList] = useState(true);

  // Sort chats: unread first, then by most recent
  const sortedChats = useMemo(() => {
    return [...chats]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .sort(
        (a, b) => (b.unreadCount > 0 ? 1 : 0) - (a.unreadCount > 0 ? 1 : 0)
      );
  }, [chats]);
  const filteredChats = sortedChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Responsive: hide chat list on mobile when a chat is selected
  useEffect(() => {
    if (window.innerWidth < 1024 && selectedChat) setShowChatList(false);
  }, [selectedChat]);

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
        {showChatList && (
          <div className="lg:col-span-1">
            <Card className="h-full border border-border">
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
                          <h4 className="font-medium mb-2">
                            Create Group Chat
                          </h4>
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
                <div className="relative mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1 relative">
                    <div
                      className="absolute inset-0 pointer-events-none rounded-lg border border-purple-200 bg-gradient-to-r from-purple-100/40 to-blue-100/20"
                      style={{ zIndex: 0 }}
                    />
                    <div className="flex items-center gap-2 relative z-10 p-1 rounded-lg bg-white/90 border border-purple-200 w-full focus-within:border-purple-500 focus-within:shadow-lg focus-within:shadow-purple-200/40 transition-colors">
                      <Search className="ml-3 text-social-primary h-5 w-5" />
                      <Input
                        placeholder="Search conversations..."
                        className="pl-2 py-3 border-0 bg-transparent focus:ring-0 focus:outline-none shadow-none min-w-0 flex-1"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ boxShadow: "none" }}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div
                  className="space-y-1 max-h-[60vh] overflow-y-auto py-6"
                  role="listbox"
                  aria-label="Chat list"
                >
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-3 cursor-pointer flex items-center gap-3 border-2 transition-shadow bg-white max-w-[95%] mx-auto
                        ${
                          selectedChat === chat.id
                            ? "border-purple-400 bg-purple-50 scale-[1.03] rounded-lg shadow-xl"
                            : "border-transparent bg-white rounded-lg hover:shadow-md hover:scale-[1.01] hover:border-purple-200 hover:bg-purple-50"
                        }
                      `}
                      onClick={() => setSelectedChat(chat.id)}
                      aria-selected={selectedChat === chat.id}
                      aria-label={`Open chat with ${chat.name}`}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          setSelectedChat(chat.id);
                      }}
                    >
                      <Avatar className="h-10 w-10 bg-social-primary text-white">
                        <div className="flex h-full w-full items-center justify-center font-bold">
                          {getInitials(chat.name)}
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
                            {chat.type === "group" &&
                            chat.lastMessage.includes(":")
                              ? chat.lastMessage
                              : chat.type === "group"
                              ? `${chat.participants[0]}: ${chat.lastMessage}`
                              : chat.lastMessage}
                          </p>
                          {chat.unreadCount > 0 && (
                            <Badge className="bg-muted text-primary rounded-full px-2 py-0.5 text-xs font-semibold ml-2">
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
                  ))}
                </div>
                {/* Mobile close button */}
                <div className="block lg:hidden p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChatList(false)}
                    aria-label="Hide chat list"
                  >
                    Hide
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chat Window */}
        <div className={`lg:col-span-2 ${!showChatList ? "col-span-1" : ""}`}>
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
