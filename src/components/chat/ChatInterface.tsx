
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, User, Users } from "lucide-react";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  chatId: string;
  chatName: string;
  chatType: "individual" | "group";
  participants: string[];
  currentUser: string;
}

const ChatInterface = ({ chatId, chatName, chatType, participants, currentUser }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hey! How are you doing?",
      senderId: "Alice Johnson",
      senderName: "Alice Johnson", 
      timestamp: new Date(2024, 5, 20, 14, 30)
    },
    {
      id: "2",
      content: "I'm good! Just working on some new photography techniques. How about you?",
      senderId: currentUser,
      senderName: "You",
      timestamp: new Date(2024, 5, 20, 14, 32)
    },
    {
      id: "3",
      content: "That sounds interesting! I'd love to see some of your work.",
      senderId: "Alice Johnson",
      senderName: "Alice Johnson",
      timestamp: new Date(2024, 5, 20, 14, 35)
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: currentUser,
      senderName: "You",
      timestamp: new Date()
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-3">
          <Avatar className="h-8 w-8 bg-social-primary text-white">
            <div className="flex h-full w-full items-center justify-center">
              {chatType === "group" ? (
                <Users className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
          </Avatar>
          <div>
            <div className="font-medium">{chatName}</div>
            {chatType === "group" && (
              <div className="text-sm text-muted-foreground">
                {participants.length} participants
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === currentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderId === currentUser
                  ? 'bg-social-primary text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {chatType === "group" && message.senderId !== currentUser && (
                <div className="text-xs font-medium mb-1 opacity-70">
                  {message.senderName}
                </div>
              )}
              <div className="text-sm">{message.content}</div>
              <div className={`text-xs mt-1 ${
                message.senderId === currentUser ? 'text-white/70' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      
      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
