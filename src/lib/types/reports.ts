import { Identifiable } from './base';

export interface Report extends Identifiable {
  contentType: 'post' | 'reply' | 'user';
  contentId: string;
  contentPreview: string;
  reportedBy: string;
  createdAt: Date;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'in progress';
  content: string;
  communityId: string;
  assignedTo?: string; // user id
  originalContent?: {
    title?: string;
    community?: string;
    author?: string;
    fullText?: string;
    parentPost?: string;
  };
  originalLink?: string;
}

export interface FlaggedReport extends Report {
  reportedByName: string;
}
