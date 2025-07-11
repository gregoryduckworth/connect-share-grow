import { REPORTS_DATA } from '../data/reports';
import type { Report } from '@/lib/types';

export const reportService = {
  getReports: async (): Promise<Report[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return REPORTS_DATA;
  },

  getFlaggedReports: async (): Promise<Report[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return REPORTS_DATA.filter((report) => report.status === 'pending');
  },

  submitReport: async (
    reportData: Omit<Report, 'id' | 'createdAt' | 'status'>,
  ): Promise<Report> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newReport: Report = {
      id: `rep${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      contentType: reportData.contentType,
      contentId: reportData.contentId,
      contentPreview: reportData.contentPreview,
      reportedBy: reportData.reportedBy,
      createdAt: new Date(),
      reason: reportData.reason,
      status: 'pending',
      content: reportData.content,
      communityId: reportData.communityId,
      originalContent: reportData.originalContent,
      originalLink: reportData.originalLink,
    };

    REPORTS_DATA.push(newReport);
    return newReport;
  },
};
