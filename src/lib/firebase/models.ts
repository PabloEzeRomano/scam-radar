import { Timestamp } from 'firebase/firestore';

export type ReportType = 'project' | 'profile' | 'company';
export type ReportStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id?: string;
  email?: string;
  linkedin?: string;
  name?: string;
  expertise?: string;
  createdAt: Timestamp;
}
export type NewUser = Omit<User, 'createdAt'>;

export interface Report {
  id?: string;
  type: ReportType;
  title?: string;
  url: string;
  platform?: string;
  reason: string;
  reporterId?: string;
  status: ReportStatus;
  createdAt: Timestamp;
}
export type NewReport = Omit<Report, 'createdAt'>;

export interface Suggestion {
  id?: string;
  userId: string;
  message: string;
  createdAt: Timestamp;
}
export type NewSuggestion = Omit<Suggestion, 'createdAt'>;

export type AnalysisKind = 'chat' | 'repo';
export type AnalysisStatus = 'done' | 'failed';

export interface Analysis {
  userId: string | null;
  kind: AnalysisKind;
  riskScore: number;
  flags: string[];
  entities: {
    emails: string[];
    urls: string[];
    wallets: string[];
  };
  summary: string;
  guidance: string[];
  status: AnalysisStatus;
  createdAt: Timestamp;
  public: boolean;
}

export const COLLECTIONS = {
  USERS: 'users',
  REPORTS: 'reports',
  SUGGESTIONS: 'suggestions',
  ANALYSES: 'analyses',
  FINDINGS: 'findings',
} as const;
