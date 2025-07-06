
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { ChatMessage } from "@/lib/types";

interface ChatInterfaceProps {
  connectionId: string;
  connectionName: string;
  chatId?: string;
}

const ChatInterface = ({ connectionId, connectionName }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dummy data for testing
    const initialMessages: ChatMessage[] = [
      {
        id: "1",
        connectionId: connectionId,
        senderId: "user1",
        content: "Hey, how's it going?",
        sentAt: new Date(),
        isRead: true,
      },
      {
        id: "2",
        connectionId: connectionId,
        senderId: "user2",
        content: "Not bad, just chilling. You?",
        sentAt: new Date(),
        isRead: true,
      },
    ];
    setMessages(initialMessages);
  }, [connectionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const newChatMessage: ChatMessage = {
        id: String(messages.length + 1), // Simple ID generation
        connectionId: connectionId,
        senderId: "currentUser", // Replace with actual user ID
        content: newMessage,
        sentAt: new Date(),
        isRead: false,
      };

      setMessages([...messages, newChatMessage]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">{connectionName}</h2>
      </div>
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.senderId === "currentUser" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`rounded-lg px-3 py-2 text-sm ${
                  message.senderId === "currentUser"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {message.content}
              </div>
              <div className="text-xs text-gray-500">
                {message.senderId === "currentUser" ? "You" : "Them"} -{" "}
                {message.sentAt.toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage}>
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
