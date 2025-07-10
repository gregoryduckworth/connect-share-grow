import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Search, MessageSquare, Plus, Users, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import ChatInterface from '@/components/chat/ChatInterface';
import { useAuth } from '@/contexts/useAuth';
import { api } from '@/lib/api';
import { User as UserType } from '@/lib/types';
import { USERS_DATA } from '@/lib/backend/data/users';
import { UserRelationship } from '@/lib/backend/data/userRelationships';
import { ChatMessage } from '@/lib/backend/data/chatMessages';
import { useLocation } from 'react-router-dom';

interface Chat {
  id: string;
  name: string;
  type: 'individual' | 'group';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const { user } = useAuth();
  const location = useLocation();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [_relationships, setRelationships] = useState<UserRelationship[]>([]);

  useEffect(() => {
    if (!user) return;
    // Fetch all users and relationships
    Promise.all([
      api.getUsers() as Promise<UserType[]>,
      Promise.resolve(api.getUserRelationships(user.id)),
      Promise.resolve(api.getChatThreads(user.id)),
    ]).then(([users, rels, threads]) => {
      setRelationships(rels);
      // Friends = users with 'friend' relationship
      const friendIds = rels
        .filter((r) => r.status === 'friend')
        .map((r) => (r.userId1 === user.id ? r.userId2 : r.userId1));
      setFriends(
        users
          .filter((u: UserType) => friendIds.includes(u.id) && u.id !== user.id)
          .map((u: UserType) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            isOnline: true, // For demo, all online
          })),
      );
      // Chats = threads for this user
      const chatList: Chat[] = threads.map((t) => {
        const isGroup = t.isGroup;
        const otherParticipantIds = t.participantIds.filter((id: string) => id !== user.id);
        const name = isGroup
          ? t.name || 'Group Chat'
          : users.find((u: UserType) => u.id === otherParticipantIds[0])?.name || 'Unknown';
        // Find the last message for this thread
        const threadMessages: ChatMessage[] = api.getChatMessages(t.id);
        const lastMsg =
          threadMessages.length > 0 ? threadMessages[threadMessages.length - 1] : null;
        let lastMessage = '';
        if (lastMsg) {
          const sender = USERS_DATA.find((u) => u.id === lastMsg.senderId);
          lastMessage = `${sender ? sender.name : lastMsg.senderId}: ${lastMsg.content}`;
        }
        return {
          id: t.id,
          name,
          type: isGroup ? 'group' : 'individual',
          participants: t.participantIds, // Use user IDs
          lastMessage,
          timestamp: t.createdAt,
          unreadCount: 0, // Could be calculated from messages
        };
      });
      setChats(chatList);
    });
  }, [user]);

  // Helper for avatar fallback
  function getInitials(name: string) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  const [showChatList, setShowChatList] = useState(true);

  // Sort chats: unread first, then by most recent
  const sortedChats = useMemo(() => {
    return [...chats]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .sort((a, b) => (b.unreadCount > 0 ? 1 : 0) - (a.unreadCount > 0 ? 1 : 0));
  }, [chats]);
  const filteredChats = sortedChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  // Responsive: hide chat list on mobile when a chat is selected
  useEffect(() => {
    if (window.innerWidth < 1024 && selectedChat) setShowChatList(false);
  }, [selectedChat]);

  const handleStartIndividualChat = (friendId: string) => {
    const friend = friends.find((f) => f.id === friendId);
    if (!friend) return;

    const existingChat = chats.find(
      (chat) => chat.type === 'individual' && chat.participants.includes(friend.id),
    );

    if (existingChat) {
      setSelectedChat(existingChat.id);
    } else {
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        name: friend.name,
        type: 'individual',
        participants: [friend.id],
        lastMessage: 'Start your conversation...',
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

    const participantIds = selectedFriends;

    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      name: groupName,
      type: 'group',
      participants: participantIds,
      lastMessage: 'Group created!',
      timestamp: new Date(),
      unreadCount: 0,
    };

    setChats([newChat, ...chats]);
    setSelectedChat(newChat.id);
    setSelectedFriends([]);
    setGroupName('');
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

  // Auto-select chat thread if threadId is in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const threadId = params.get('threadId');
    if (threadId && chats.some((c) => c.id === threadId)) {
      setSelectedChat(threadId);
    }
  }, [location.search, chats]);

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen" data-testid="chat-page">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
        {/* Chat List */}
        {showChatList && (
          <div className="lg:col-span-1" data-testid="chat-list-container">
            <Card className="h-full border border-border" data-testid="chat-list-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle data-testid="chat-list-title">Messages</CardTitle>
                  <Dialog open={newChatDialogOpen} onOpenChange={setNewChatDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" data-testid="new-chat-btn">
                        <Plus className="h-4 w-4 mr-2" />
                        New Chat
                      </Button>
                    </DialogTrigger>
                    <DialogContent data-testid="new-chat-dialog">
                      <DialogHeader>
                        <DialogTitle>Start New Chat</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Start Individual Chat</h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {friends.map((friend) => (
                              <div
                                key={friend.id}
                                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                                onClick={() => handleStartIndividualChat(friend.id)}
                                data-testid={`start-individual-chat-${friend.id}`}
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8 bg-social-primary text-white">
                                    <div className="flex h-full w-full items-center justify-center">
                                      <User className="h-4 w-4" />
                                    </div>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-sm">{friend.name}</p>
                                    <p className="text-xs text-gray-500">{friend.email}</p>
                                  </div>
                                </div>
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    friend.isOnline ? 'bg-green-500' : 'bg-gray-300'
                                  }`}
                                  data-testid={`friend-status-${friend.id}`}
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
                            data-testid="group-name-input"
                          />
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {friends.map((friend) => (
                              <div
                                key={friend.id}
                                className="flex items-center space-x-2"
                                data-testid={`group-friend-checkbox-${friend.id}`}
                              >
                                <Checkbox
                                  id={friend.id}
                                  checked={selectedFriends.includes(friend.id)}
                                  onCheckedChange={(checked: boolean | string) =>
                                    handleFriendSelection(friend.id, Boolean(checked))
                                  }
                                  data-testid={`group-checkbox-${friend.id}`}
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
                            disabled={selectedFriends.length === 0 || !groupName.trim()}
                            className="w-full mt-3"
                            data-testid="create-group-btn"
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
                        style={{ boxShadow: 'none' }}
                        data-testid="chat-search-input"
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
                  data-testid="chat-list"
                >
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-3 cursor-pointer flex items-center gap-3 border-2 transition-shadow bg-white max-w-[95%] mx-auto
                        ${
                          selectedChat === chat.id
                            ? 'border-purple-400 bg-purple-50 scale-[1.03] rounded-lg shadow-xl'
                            : 'border-transparent bg-white rounded-lg hover:shadow-md hover:scale-[1.01] hover:border-purple-200 hover:bg-purple-50'
                        }
                      `}
                      onClick={() => setSelectedChat(chat.id)}
                      aria-selected={selectedChat === chat.id}
                      aria-label={`Open chat with ${chat.name}`}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setSelectedChat(chat.id);
                      }}
                      data-testid={`chat-list-item-${chat.id}`}
                    >
                      <Avatar className="h-10 w-10 bg-social-primary text-white">
                        <div className="flex h-full w-full items-center justify-center font-bold">
                          {getInitials(chat.name)}
                        </div>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">{chat.name}</p>
                          <span className="text-xs text-gray-500">
                            {chat.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 truncate">
                            {chat.type === 'group' && chat.lastMessage.includes(':')
                              ? chat.lastMessage
                              : chat.type === 'group'
                                ? `${(() => {
                                    const user = USERS_DATA.find(
                                      (u) => u.id === chat.participants[0],
                                    );
                                    return user ? user.name : chat.participants[0];
                                  })()}: ${chat.lastMessage}`
                                : chat.lastMessage}
                          </p>
                          {chat.unreadCount > 0 && (
                            <Badge
                              className="bg-muted text-primary rounded-full px-2 py-0.5 text-xs font-semibold ml-2"
                              data-testid={`unread-badge-${chat.id}`}
                            >
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                        {chat.type === 'group' && (
                          <p
                            className="text-xs text-gray-400"
                            data-testid={`group-participants-${chat.id}`}
                          >
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
                    data-testid="hide-chat-list-btn"
                  >
                    Hide
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chat Window */}
        <div
          className={`lg:col-span-2 ${!showChatList ? 'col-span-1' : ''}`}
          data-testid="chat-window-container"
        >
          <Card className="h-full" data-testid="chat-window-card">
            {selectedChatData ? (
              <ChatInterface
                chatId={selectedChatData.id}
                chatName={selectedChatData.name}
                chatType={selectedChatData.type}
                participants={selectedChatData.participants}
                currentUser={user?.id}
                data-testid="chat-interface"
              />
            ) : (
              <CardContent
                className="h-full flex items-center justify-center"
                data-testid="chat-empty-state"
              >
                <div className="text-center text-gray-500">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
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
