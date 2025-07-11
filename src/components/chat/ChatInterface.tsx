import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { ChatMessage as BackendChatMessage } from '@/lib/backend/data/chatMessages';
import { User } from '@/lib/types/user';
import { api } from '@/lib/api';
import { USERS_DATA } from '@/lib/backend/data/users';
import { ChatMessage as AppChatMessage } from '@/lib/types/social';

interface ChatInterfaceProps {
  connectionId?: string;
  connectionName?: string;
  chatId?: string;
  chatName?: string;
  chatType?: 'individual' | 'group';
  participants?: string[];
  currentUser?: string;
}

const ChatInterface = ({
  connectionName,
  chatId,
  chatName,
  chatType,
  participants,
  currentUser,
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<AppChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const displayName = chatName || connectionName || 'Chat';

  useEffect(() => {
    if (!chatId || !currentUser) return;
    // Fetch messages from backend (synchronous)
    const backendMessages: BackendChatMessage[] = api.getChatMessages(chatId);
    setMessages(
      backendMessages.map((msg) => ({
        id: msg.id,
        connectionId: msg.threadId ?? '',
        senderId: msg.senderId,
        content: msg.content,
        sentAt: msg.timestamp ?? new Date(),
        isRead: Array.isArray(msg.readBy) ? msg.readBy.includes(currentUser) : false,
      })),
    );
  }, [chatId, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '' && chatId && currentUser) {
      api.sendChatMessage(chatId, currentUser, newMessage);
      const backendMessages: BackendChatMessage[] = api.getChatMessages(chatId);
      setMessages(
        backendMessages.map((msg) => ({
          id: msg.id,
          connectionId: msg.threadId ?? '',
          senderId: msg.senderId,
          content: msg.content,
          sentAt: msg.timestamp ?? new Date(),
          isRead: Array.isArray(msg.readBy) ? msg.readBy.includes(currentUser) : false,
        })),
      );
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">{displayName}</h2>
        {chatType === 'group' && participants && (
          <p className="text-sm text-gray-500">{participants.length} participants</p>
        )}
      </div>
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.senderId === (currentUser || 'currentUser') ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`rounded-lg px-3 py-2 text-sm ${
                  message.senderId === (currentUser || 'currentUser')
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.content}
              </div>
              <div className="text-xs text-gray-500">
                {(() => {
                  const sender = USERS_DATA.find((u: User) => u.id === message.senderId);
                  const senderName = sender ? sender.name : message.senderId;
                  const dateVal = message.sentAt;
                  return `${senderName} - ${dateVal.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                })()}
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
              if (e.key === 'Enter') {
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
