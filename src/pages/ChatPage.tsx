
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Send, Video, Search, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Friend {
  id: number;
  name: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface ChatMessage {
  id: number;
  senderId: number;
  text: string;
  time: string;
}

const ChatPage = () => {
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: 1,
      name: "Alex Johnson",
      avatar: undefined,
      lastMessage: "Are we still meeting today?",
      time: "10:42 AM",
      unread: 2,
    },
    {
      id: 2,
      name: "Morgan Smith",
      avatar: undefined,
      lastMessage: "I found that book you mentioned!",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: 3,
      name: "Taylor Wilson",
      avatar: undefined,
      lastMessage: "Thanks for the recommendations!",
      time: "2 days ago",
      unread: 0,
    },
  ]);

  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(friends[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      senderId: 1,
      text: "Hey there! How's your project coming along?",
      time: "10:30 AM",
    },
    {
      id: 2,
      senderId: 0, // User's ID
      text: "It's going well! I've almost finished the design phase.",
      time: "10:32 AM",
    },
    {
      id: 3,
      senderId: 1,
      text: "That's great news! Would you like to meet up today to discuss it?",
      time: "10:35 AM",
    },
    {
      id: 4,
      senderId: 1,
      text: "I'm free around 3 PM if that works for you.",
      time: "10:36 AM",
    },
    {
      id: 5,
      senderId: 0,
      text: "3 PM works for me. Should we meet at the usual cafe?",
      time: "10:38 AM",
    },
    {
      id: 6,
      senderId: 1,
      text: "Perfect! Yes, the cafe sounds good. Are we still meeting today?",
      time: "10:42 AM",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedFriend) return;
    
    const newMsg: ChatMessage = {
      id: messages.length + 1,
      senderId: 0, // User's ID
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
    
    // Simulate reply after 1 second
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: messages.length + 2,
        senderId: selectedFriend.id,
        text: "Thanks for letting me know!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages(prevMessages => [...prevMessages, replyMsg]);
    }, 1000);
  };

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startVideoCall = () => {
    setIsVideoCallActive(true);
  };

  const endVideoCall = () => {
    setIsVideoCallActive(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      <h1 className="text-3xl font-bold text-social-primary mb-4">Chat</h1>

      <div className="flex flex-1 gap-4 h-full">
        {/* Friends List */}
        <Card className="w-full md:w-1/3 flex flex-col h-full">
          <CardHeader className="pb-2">
            <CardTitle>Friends</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search friends..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-1 p-4">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-md cursor-pointer",
                      selectedFriend?.id === friend.id
                        ? "bg-social-primary text-white"
                        : "hover:bg-social-background"
                    )}
                    onClick={() => {
                      setSelectedFriend(friend);
                      // Mark messages as read when opening chat
                      setFriends(friends.map(f => 
                        f.id === friend.id ? { ...f, unread: 0 } : f
                      ));
                    }}
                  >
                    <Avatar>
                      <AvatarFallback className={cn(
                        selectedFriend?.id === friend.id
                          ? "bg-white text-social-primary"
                          : "bg-social-primary text-white"
                      )}>
                        {friend.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className={cn(
                          "font-medium truncate",
                          selectedFriend?.id !== friend.id && friend.unread > 0 && "font-bold"
                        )}>
                          {friend.name}
                        </h4>
                        <span className="text-xs">
                          {friend.time}
                        </span>
                      </div>
                      <p className={cn(
                        "text-sm truncate",
                        selectedFriend?.id === friend.id
                          ? "text-white/90"
                          : "text-gray-500",
                        friend.unread > 0 && "font-semibold"
                      )}>
                        {friend.lastMessage}
                      </p>
                    </div>
                    {friend.unread > 0 && (
                      <div className="min-w-[1.5rem] h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                        {friend.unread}
                      </div>
                    )}
                  </div>
                ))}
                
                {filteredFriends.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-social-muted">No friends found matching your search.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* Chat Area */}
        <Card className="flex-1 flex flex-col h-full">
          {selectedFriend ? (
            <>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-social-primary text-white">
                      {selectedFriend.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedFriend.name}</CardTitle>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-social-primary text-social-primary"
                    onClick={startVideoCall}
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              {isVideoCallActive ? (
                <div className="flex-1 bg-gray-900 flex flex-col items-center justify-center relative">
                  <div className="text-white text-center">
                    <h3 className="text-xl font-bold mb-2">Video Call with {selectedFriend.name}</h3>
                    <p className="text-gray-300 mb-4">Connected</p>
                    
                    {/* Large video placeholder */}
                    <div className="w-full max-w-2xl h-80 bg-gray-800 rounded-lg mb-6 flex items-center justify-center">
                      <Avatar className="w-32 h-32">
                        <AvatarFallback className="text-4xl bg-social-primary">
                          {selectedFriend.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    {/* Small self-view video */}
                    <div className="absolute bottom-20 right-8 w-48 h-32 bg-gray-700 rounded-lg border-2 border-white flex items-center justify-center">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="text-2xl bg-social-secondary">
                          <User />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <Button 
                      variant="destructive"
                      onClick={endVideoCall}
                      className="mt-4"
                    >
                      End Call
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-full p-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={cn(
                              "flex",
                              message.senderId === 0 ? "justify-end" : "justify-start"
                            )}
                          >
                            <div
                              className={cn(
                                "max-w-[70%] rounded-lg px-4 py-2",
                                message.senderId === 0
                                  ? "bg-social-primary text-white"
                                  : "bg-gray-100"
                              )}
                            >
                              <p>{message.text}</p>
                              <span className={cn(
                                "text-xs block text-right mt-1",
                                message.senderId === 0 ? "text-white/70" : "text-gray-500"
                              )}>
                                {message.time}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  
                  <div className="p-4 border-t">
                    <form 
                      className="flex items-center gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                    >
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        type="submit" 
                        size="icon"
                        className="bg-social-primary hover:bg-social-secondary"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <MessageCircle className="h-12 w-12 text-social-muted mb-4" />
              <h3 className="text-xl font-medium mb-2">No chat selected</h3>
              <p className="text-social-muted">Choose a friend to start chatting</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
