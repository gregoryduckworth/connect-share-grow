import { Identifiable } from "./base";

// Report types - unified interface
export interface ReportBase extends Identifiable {
  contentType: "post" | "reply" | "user";
  contentId: string;
  contentPreview: string;
  reportedBy: string;
  createdAt: Date;
  reason: string;
  status: "pending" | "reviewed" | "resolved";
  content: string;
  communityId: string;
  originalContent?: {
    title?: string;
    community?: string;
    author?: string;
    fullText?: string;
    parentPost?: string;
  };
  originalLink?: string;
}

// Keep Report as alias for backward compatibility
export type Report = ReportBase;

export interface FlaggedReport extends Report {
  reportedByName: string;
}
