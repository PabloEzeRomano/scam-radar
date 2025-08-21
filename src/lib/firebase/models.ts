// Firebase data models to replace Drizzle schema

export type ReportType = 'project' | 'profile' | 'company';
export type ReportStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id?: string;
  email?: string;
  linkedin?: string;
  name?: string;
  expertise?: string;
  createdAt: Date;
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
  createdAt: Date;
}

export type NewReport = Omit<Report, 'createdAt'>;

export interface Suggestion {
  id?: string;
  userId: string;
  message: string;
  createdAt: Date;
}

export type NewSuggestion = Omit<Suggestion, 'createdAt'>;

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  REPORTS: 'reports',
  SUGGESTIONS: 'suggestions',
} as const;