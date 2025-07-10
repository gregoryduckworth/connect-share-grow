import { createContext, useContext, useState, ReactNode } from 'react';

interface ChatThreadContextType {
  selectedThreadId: string | null;
  setSelectedThreadId: (id: string | null) => void;
}

const ChatThreadContext = createContext<ChatThreadContextType | undefined>(undefined);

export const ChatThreadProvider = ({ children }: { children: ReactNode }) => {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  return (
    <ChatThreadContext.Provider value={{ selectedThreadId, setSelectedThreadId }}>
      {children}
    </ChatThreadContext.Provider>
  );
};

export function useChatThread() {
  const ctx = useContext(ChatThreadContext);
  if (!ctx) throw new Error('useChatThread must be used within a ChatThreadProvider');
  return ctx;
}
