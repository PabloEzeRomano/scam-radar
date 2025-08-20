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

// types/firestore.ts


export interface UserDoc {
  email?: string;         // uno de email | linkedin es requerido a nivel app
  linkedin?: string;
  name?: string;
  expertise?: string;     // "Frontend dev", "PM", etc
  createdAt: number;      // Date.now()
}

export interface ReportDoc {
  type: ReportType;
  title?: string;         // si falta, se deriva de la URL
  url: string;
  platform: string;       // auto-detectado (editable)
  reason: string;
  reporterId: string;     // ref a users/{id}
  status: ReportStatus;   // default 'pending'
  createdAt: number;
}

export interface SuggestionDoc {
  userId: string;
  message: string;
  createdAt: number;
}
