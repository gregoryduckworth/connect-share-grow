import { CHAT_THREADS, ChatThread } from '../data/chatThreads';
import { CHAT_MESSAGES, ChatMessage } from '../data/chatMessages';
import {
  USER_RELATIONSHIPS,
  UserRelationship,
  RelationshipStatus,
} from '../data/userRelationships';

export const chatService = {
  getThreadsForUser: (userId: string): ChatThread[] => {
    const threads = CHAT_THREADS.filter((thread) => thread.participantIds.includes(userId));
    return threads;
  },

  getMessagesForThread: (threadId: string): ChatMessage[] =>
    CHAT_MESSAGES.filter((msg) => msg.threadId === threadId),

  sendMessage: (threadId: string, senderId: string, content: string): ChatMessage => {
    const now = new Date();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      threadId,
      senderId,
      content,
      timestamp: now,
      readBy: [senderId],
    };
    CHAT_MESSAGES.push(newMsg);
    return newMsg;
  },

  markMessageRead: (messageId: string, userId: string): void => {
    const msg = CHAT_MESSAGES.find((m) => m.id === messageId);
    if (msg && !msg.readBy.includes(userId)) {
      msg.readBy.push(userId);
    }
  },

  // Relationship methods
  getRelationshipsForUser: (userId: string): UserRelationship[] =>
    USER_RELATIONSHIPS.filter((rel) => rel.userId1 === userId || rel.userId2 === userId),

  addRelationship: (
    userId1: string,
    userId2: string,
    status: RelationshipStatus,
  ): UserRelationship => {
    const newRel: UserRelationship = {
      id: `rel-${Date.now()}`,
      userId1,
      userId2,
      status,
      createdAt: new Date(),
    };
    USER_RELATIONSHIPS.push(newRel);
    return newRel;
  },

  updateRelationship: (relId: string, status: RelationshipStatus): void => {
    const rel = USER_RELATIONSHIPS.find((r) => r.id === relId);
    if (rel) rel.status = status;
  },
};
