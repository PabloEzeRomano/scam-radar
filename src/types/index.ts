import { Timestamp } from 'firebase/firestore';
import { ButtonHTMLAttributes, ReactNode } from 'react';

/* ------------------------- Core Analysis Types ------------------------- */

export interface AnalysisData {
  riskScore: number;
  flags: string[];
  summary: string;
  guidance: string[];
  entities?: AnalysisEntities;
  signals?: RepoSignals;
  evidence?: EvidenceData;
}

export interface AnalysisEntities {
  emails: string[];
  urls: string[];
  wallets: string[];
}

export type RepoSignals = {
  scripts: Record<string, string>;
  filesWithHits: string[];
  endpoints: string[];
  decodedBlobs: Array<{ file: string; line: number; preview: string }>;
  walletDeps: string[];
  fsSensitive: Array<{ file: string; line: number; snippet: string }>;
  dynamicExec: Array<{ file: string; line: number; snippet: string }>;
  lifecycle: string[];
  childProcess: Array<{ file: string; line: number; snippet: string }>;
  obfuscation: Array<{ file: string; line: number; snippet: string }>;
  findings: Finding[];
  meta: Record<string, unknown>;
};

export type FindingType = 'pattern' | 'endpoint' | 'blob' | 'fs' | 'wallet_dep';

export type Finding = {
  type: FindingType;
  file?: string;
  line?: number;
  snippet?: string;
  note: string;
};

export type EvidenceData =
  | string[]
  | Array<{
      file?: string;
      line?: number;
      snippet?: string;
      note?: string;
    }>;

/* ------------------------- Analysis Results Types ------------------------- */

export interface AnalysisResultsProps {
  analysis: AnalysisData;
  onConvertToReport: () => void;
  className?: string;
}

/* ------------------------- Report Form Types ------------------------- */
export interface ReportFormData {
  type: ReportType;
  url?: string; // Required for chat, optional for repo
  title: string; // Always required, auto-filled based on analysis type
  platform: string;
  reason: string;
  email: string;
  linkedin: string;
  name: string;
  expertise: string;
  website?: string; // Honeypot field
}

export interface ReportFormProps {
  initialData?: Partial<ReportFormData>;
  onSubmit?: (reportId: string) => void;
  onCancel?: () => void;
  submitButtonText?: string;
  showHoneypot?: boolean;
  className?: string;
  analysisType?: 'chat' | 'repo'; // To determine title requirements
}

/* ------------------------- Form Validation Types ------------------------- */

export interface ReportFormValidation {
  // Either title OR url must be provided
  hasTitleOrUrl: boolean;
  // Title is always required for chat analysis
  isTitleRequired: boolean;
  // URL is optional but can be used for auto-filling title
  hasUrl: boolean;
}

/* ------------------------- Analyser Wrapper Types ------------------------- */

export interface AnalyserWrapperProps {
  children: ReactNode;
  analysis: AnalysisData | null;
  onConvertToReport: () => void;
  showReportForm: boolean;
  onCancelReport: () => void;
  getReportFormInitialData: () => ReportFormData;
  onSubmitReport: (reportId: string) => void;
  className?: string;
  analysisType?: 'chat' | 'repo';
}

export interface AnalyserContentWrapperProps {
  children: ReactNode;
  className?: string;
}

/* ------------------------- LLM Provider Types ------------------------- */

export type Provider =
  | 'heuristic'
  | 'openrouter'
  | 'cloudflare'
  | 'deepseek'
  | 'openai';

export interface ProviderConfig {
  provider: Provider;
  openRouterKey?: string;
  deepseekKey?: string;
  openaiKey?: string;
  cloudflare?: {
    token?: string;
    accountId?: string;
    model?: string;
  };
}

export interface LLMProviderSelectorProps {
  onChange: (cfg: ProviderConfig) => void;
  defaultProvider?: Provider;
  allowBYOForFree?: boolean;
}

/* ------------------------- Analyser Component Props ------------------------- */

export interface ChatAnalyserProps {
  providerConfig: ProviderConfig;
}

export interface RepoAnalyserProps {
  providerConfig: ProviderConfig;
}

/* ------------------------- Analysis Result Types ------------------------- */

export interface ChatAnalysis {
  riskScore: number;
  flags: string[];
  entities: AnalysisEntities;
  summary: string;
  guidance: string[];
  evidence: string[];
}

export interface RepoAnalysis {
  riskScore: number;
  flags: string[];
  summary: string;
  guidance: string[];
  signals?: RepoSignals;
}

/* ------------------------- Chat Analysis Signals ------------------------- */

export interface ChatExtractedSignals {
  entities: AnalysisEntities;
  preFlags: string[];
}

/* ------------------------- API Request/Response Types ------------------------- */

export interface ChatAnalyzeRequest {
  text: string;
  useLlm?: boolean;
  providerConfig?: ProviderConfig;
}

export interface RepoAnalyzeRequest {
  zipBase64: string;
  useLlm?: boolean;
  providerConfig?: ProviderConfig;
}

export interface ChatAnalysisResult {
  riskScore: number;
  flags: string[];
  entities: AnalysisEntities;
  summary: string;
  guidance: string[];
  evidence: string[];
}

export interface RepoAnalysisResult {
  riskScore: number;
  flags: string[];
  summary: string;
  guidance: string[];
  signals: RepoSignals;
  evidence?: Array<{
    file?: string;
    line?: number;
    snippet?: string;
    note?: string;
  }>;
}

/* ------------------------- UI Component Types ------------------------- */

export interface BadgeProps {
  children: ReactNode;
  variant?: 'risk' | 'status' | 'type' | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface RiskBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  className?: string;
}

export interface PillProps {
  children: ReactNode;
  variant?: 'default' | 'info' | 'warning' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface FileDropzoneProps {
  onDrop: (files: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
  showFileList?: boolean;
  selectedFiles?: File[];
  onRemoveFile?: (index: number) => void;
}

export interface FormFieldProps {
  label: string;
  name?: string;
  type?: 'text' | 'email' | 'url' | 'textarea' | 'select';
  required?: boolean;
  optional?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  rows?: number;
}

/* ------------------------- Report Types ------------------------- */

export type ReportType = 'project' | 'profile' | 'company';
export type ReportStatus = 'pending' | 'approved' | 'rejected';

export interface Report {
  id?: string;
  type: ReportType;
  title?: string;
  url?: string; // Required for chat reports, optional for repo reports
  platform?: string;
  reason: string;
  reporterId?: string;
  status: ReportStatus;
  createdAt: Timestamp;
}

export interface ReportCardProps {
  report: Report;
}

/* ------------------------- User Types ------------------------- */

export interface User {
  id?: string;
  email?: string;
  linkedin?: string;
  name?: string;
  expertise?: string;
  createdAt: Timestamp;
}
