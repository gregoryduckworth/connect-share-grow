
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageSquare, Plus, Users, User, Send } from "lucide-react";

interface Chat {
  id: string;
  name: string;
  type: "individual" | "group";
  participants: string[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [newChatType, setNewChatType] = useState<"individual" | "group">("individual");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mock data
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      name: "John Doe",
      type: "individual",
      participants: ["John Doe"],
      lastMessage: "Hey, how's the photography project going?",
      lastMessageTime: new Date(2024, 5, 20, 14, 30),
      unreadCount: 2
    },
    {
      id: "2",
      name: "Photography Team",
      type: "group",
      participants: ["Sarah Johnson", "Mike Chen", "Alex Rivera"],
      lastMessage: "Sarah: Let's meet tomorrow at 3 PM",
      lastMessageTime: new Date(2024, 5, 20, 12, 15),
      unreadCount: 0
    },
    {
      id: "3",
      name: "Jane Smith",
      type: "individual",
      participants: ["Jane Smith"],
      lastMessage: "Thanks for the help with the community setup!",
      lastMessageTime: new Date(2024, 5, 19, 16, 45),
      unreadCount: 1
    }
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "1": [
      {
        id: "1",
        sender: "John Doe",
        content: "Hey, how's the photography project going?",
        timestamp: new Date(2024, 5, 20, 14, 30)
      },
      {
        id: "2",
        sender: "John Doe",
        content: "I saw your latest shots on the community page, they're amazing!",
        timestamp: new Date(2024, 5, 20, 14, 31)
      }
    ],
    "2": [
      {
        id: "1",
        sender: "Sarah Johnson",
        content: "Let's meet tomorrow at 3 PM",
        timestamp: new Date(2024, 5, 20, 12, 15)
      }
    ],
    "3": [
      {
        id: "1",
        sender: "Jane Smith",
        content: "Thanks for the help with the community setup!",
        timestamp: new Date(2024, 5, 19, 16, 45)
      }
    ]
  });

  // Mock available users for creating new chats
  const availableUsers = [
    "Sarah Johnson", "Mike Chen", "Alex Rivera", "Robert Wilson", 
    "Lisa Brown", "David Kim", "Emma Thompson", "James Miller"
  ];

  const selectedChatData = chats.find(chat => chat.id === selectedChat);
  const chatMessages = selectedChat ? messages[selectedChat] || [] : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), message]
    }));

    // Update last message in chat list
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat 
        ? { ...chat, lastMessage: `You: ${newMessage}`, lastMessageTime: new Date() }
        : chat
    ));

    setNewMessage("");
  };

  const handleCreateChat = () => {
    if (!newChatName.trim() || selectedUsers.length === 0) return;

    const newChat: Chat = {
      id: Date.now().toString(),
      name: newChatType === "group" ? newChatName : selectedUsers[0],
      type: newChatType,
      participants: selectedUsers,
      lastMessage: "Chat created",
      lastMessageTime: new Date(),
      unreadCount: 0
    };

    setChats([newChat, ...chats]);
    setMessages(prev => ({ ...prev, [newChat.id]: [] }));
    
    // Reset form
    setNewChatName("");
    setSelectedUsers([]);
    setShowNewChatDialog(false);
  };

  const handleUserSelection = (user: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      setSelectedUsers(selectedUsers.filter(u => u !== user));
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Chat List */}
      <div className="w-1/3 border-r bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Messages</h2>
            <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start New Chat</DialogTitle>
                  <DialogDescription>
                    Create a new individual chat or group conversation.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="individual"
                        checked={newChatType === "individual"}
                        onCheckedChange={() => setNewChatType("individual")}
                      />
                      <Label htmlFor="individual">Individual</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="group"
                        checked={newChatType === "group"}
                        onCheckedChange={() => setNewChatType("group")}
                      />
                      <Label htmlFor="group">Group</Label>
                    </div>
                  </div>

                  {newChatType === "group" && (
                    <div>
                      <Label htmlFor="chatName">Group Name</Label>
                      <Input
                        id="chatName"
                        placeholder="Enter group name..."
                        value={newChatName}
                        onChange={(e) => setNewChatName(e.target.value)}
                      />
                    </div>
                  )}

                  <div>
                    <Label>Select {newChatType === "group" ? "Participants" : "User"}</Label>
                    <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-2">
                      {availableUsers.map(user => (
                        <div key={user} className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedUsers.includes(user)}
                            onCheckedChange={(checked) => handleUserSelection(user, checked as boolean)}
                            disabled={newChatType === "individual" && selectedUsers.length >= 1 && !selectedUsers.includes(user)}
                          />
                          <Label className="text-sm">{user}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewChatDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateChat}
                    disabled={selectedUsers.length === 0 || (newChatType === "group" && !newChatName.trim())}
                  >
                    Create Chat
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                selectedChat === chat.id ? "bg-social-accent/20 border-l-4 border-l-social-primary" : ""
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
                    <h3 className="font-medium truncate">{chat.name}</h3>
                    {chat.unreadCount > 0 && (
                      <Badge className="bg-social-primary text-xs">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {chat.lastMessageTime.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChatData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-card">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 bg-social-primary text-white">
                  <div className="flex h-full w-full items-center justify-center">
                    {selectedChatData.type === "group" ? (
                      <Users className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedChatData.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedChatData.type === "group" 
                      ? `${selectedChatData.participants.length} members`
                      : "Active now"
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === "You"
                        ? "bg-social-primary text-white"
                        : "bg-muted"
                    }`}
                  >
                    {selectedChatData.type === "group" && message.sender !== "You" && (
                      <p className="text-xs font-semibold mb-1">{message.sender}</p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === "You" ? "text-white/70" : "text-muted-foreground"
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-card">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a chat to start messaging</h3>
              <p className="text-muted-foreground">
                Choose from your existing conversations or start a new one.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
