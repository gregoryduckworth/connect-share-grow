
import { Identifiable } from './base';

export interface ReportBase extends Identifiable {
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

export interface Report extends ReportBase {
  // Additional properties specific to full Report if needed
}

export interface FlaggedReport extends Report {
  reportedByName: string;
}
