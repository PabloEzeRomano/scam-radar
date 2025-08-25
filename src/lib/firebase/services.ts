import {
  collection,
  doc,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  orderBy,
  where,
  limit,
  query,
  getDocs,
  serverTimestamp,
  QueryConstraint,
  DocumentData,
} from 'firebase/firestore';
import { db } from './config';
import {
  COLLECTIONS,
  User,
  NewUser,
  Report,
  NewReport,
  Suggestion,
  NewSuggestion,
} from './models';

/* --------------------------------------------------------------------- */
/* Utils                                                                 */
/* --------------------------------------------------------------------- */

const convertTimestamps = (documentData: DocumentData) => {
  if (
    documentData?.createdAt &&
    typeof documentData.createdAt.toDate === 'function'
  ) {
    documentData.createdAt = documentData.createdAt.toDate();
  }
  if (
    documentData?.updatedAt &&
    typeof documentData.updatedAt.toDate === 'function'
  ) {
    documentData.updatedAt = documentData.updatedAt.toDate();
  }
  return documentData;
};

const isFirebaseReady = () => !!db;

function normalizeLinkedin(rawLinkedinUrl?: string) {
  if (!rawLinkedinUrl) return undefined;
  try {
    const url = new URL(rawLinkedinUrl.trim());
    const host = url.hostname.replace(/^www\./i, '').toLowerCase();
    const path = url.pathname.replace(/\/+$/, '').toLowerCase();
    if (!host.endsWith('linkedin.com')) return rawLinkedinUrl.trim();
    return `https://linkedin.com${path}`;
  } catch {
    return rawLinkedinUrl.trim();
  }
}

function omitUndefined<T extends Record<string, unknown>>(
  input: T
): Partial<T> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) cleaned[key] = value;
  }
  return cleaned as Partial<T>;
}

function normalizeUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl.trim());
    const host = url.hostname.replace(/^www\./i, '').toLowerCase();
    const path = url.pathname.replace(/\/+$/, '');
    const search = url.search || '';
    return `${url.protocol}//${host}${path}${search}`;
  } catch {
    return rawUrl.trim();
  }
}

function simpleHashHex(input: string) {
  let hash = 5381;
  for (let i = 0; i < input.length; i++)
    hash = (hash * 33) ^ input.charCodeAt(i);
  return (hash >>> 0).toString(16);
}

function makeUserDocId(input: { email?: string; linkedin?: string }) {
  const base = input.email
    ? `email:${input.email.trim().toLowerCase()}`
    : `lk:${normalizeLinkedin(input.linkedin)}`;
  return `u:${simpleHashHex(base)}`;
}

function makeReportDocId(input: {
  type: string;
  url: string;
  reporterId: string;
}) {
  const normalized = normalizeUrl(input.url);
  const base = `type:${input.type}|url:${normalized}|reporter:${input.reporterId}`;
  return `r:${simpleHashHex(base)}`;
}

function toAppError(context: string, err: unknown) {
  const asAny = err as { code?: string; message?: string };
  const code = asAny?.code ? `[${asAny.code}] ` : '';
  const message = asAny?.message ? String(asAny.message) : String(err);
  return new Error(`${context}: ${code}${message}`);
}

/* --------------------------------------------------------------------- */
/* User Services                                                         */
/* --------------------------------------------------------------------- */

export const userServices = {
  async createUser(newUserData: NewUser): Promise<User> {
    try {
      if (!isFirebaseReady()) throw new Error('Firebase not initialized');
      if (!newUserData.email && !newUserData.linkedin)
        throw new Error('Provide email or LinkedIn');

      const userId = makeUserDocId({
        email: newUserData.email,
        linkedin: newUserData.linkedin,
      });
      const userRef = doc(db!, COLLECTIONS.USERS, userId);
      const existingSnap = await getDoc(userRef);

      if (existingSnap.exists()) {
        return {
          id: existingSnap.id,
          ...convertTimestamps(existingSnap.data()!),
        } as User;
      }

      const writePayload = omitUndefined({
        name: newUserData.name?.trim() || undefined,
        email: newUserData.email?.trim() || undefined,
        linkedin: normalizeLinkedin(newUserData.linkedin),
        expertise: newUserData.expertise?.trim() || undefined,
        createdAt: serverTimestamp(),
      });

      await setDoc(userRef, writePayload);
      const createdSnap = await getDoc(userRef);
      return { id: userId, ...convertTimestamps(createdSnap.data()!) } as User;
    } catch (err) {
      throw toAppError('Failed to create user', err);
    }
  },

  async updateUser(
    userId: string,
    partialUserData: Partial<NewUser>
  ): Promise<User> {
    try {
      if (!isFirebaseReady()) throw new Error('Firebase not initialized');
      const userRef = doc(db!, COLLECTIONS.USERS, userId);

      const updatePayload = omitUndefined({
        name: partialUserData.name?.trim() || undefined,
        email: partialUserData.email?.trim() || undefined,
        linkedin: normalizeLinkedin(partialUserData.linkedin),
        expertise: partialUserData.expertise?.trim() || undefined,
        updatedAt: serverTimestamp(),
      });

      await updateDoc(userRef, updatePayload as Partial<User>);
      const updatedSnap = await getDoc(userRef);
      return {
        id: updatedSnap.id,
        ...convertTimestamps(updatedSnap.data()!),
      } as User;
    } catch (err) {
      throw toAppError('Failed to update user', err);
    }
  },

  async upsertUser(newUserData: NewUser): Promise<User> {
    try {
      if (!isFirebaseReady()) throw new Error('Firebase not initialized');
      if (!newUserData.email && !newUserData.linkedin)
        throw new Error('Provide email or LinkedIn');

      const userId = makeUserDocId({
        email: newUserData.email,
        linkedin: newUserData.linkedin,
      });
      const userRef = doc(db!, COLLECTIONS.USERS, userId);
      const existingSnap = await getDoc(userRef);

      if (existingSnap.exists()) {
        return {
          id: existingSnap.id,
          ...convertTimestamps(existingSnap.data()!),
        } as User;
      }

      const writePayload = omitUndefined({
        name: newUserData.name?.trim() || undefined,
        email: newUserData.email?.trim() || undefined,
        linkedin: normalizeLinkedin(newUserData.linkedin),
        expertise: newUserData.expertise?.trim() || undefined,
        createdAt: serverTimestamp(),
      });

      await setDoc(userRef, writePayload);
      const createdSnap = await getDoc(userRef);
      return { id: userId, ...convertTimestamps(createdSnap.data()!) } as User;
    } catch (err) {
      throw toAppError('Failed to upsert user', err);
    }
  },
};

/* --------------------------------------------------------------------- */
/* Report Services                                                       */
/* --------------------------------------------------------------------- */

export const reportServices = {
  async createReport(newReportData: NewReport): Promise<Report> {
    try {
      if (!isFirebaseReady()) throw new Error('Firebase not initialized');

      const statusValue = newReportData.status || 'pending';

      const createdRef = await addDoc(collection(db!, COLLECTIONS.REPORTS), {
        ...newReportData,
        status: statusValue,
        createdAt: serverTimestamp(),
      });

      return {
        id: createdRef.id,
        ...(newReportData as Report),
        status: statusValue,
        createdAt: serverTimestamp(),
      } as Report;
    } catch (err) {
      throw toAppError('Failed to create report', err);
    }
  },

  async upsertReport(newReportData: NewReport): Promise<Report> {
    try {
      if (!isFirebaseReady()) throw new Error('Firebase not initialized');

      const normalizedUrl = normalizeUrl(newReportData.url);
      const reportType = newReportData.type;
      const reporterId = newReportData.reporterId;

      if (!reportType || !normalizedUrl || !reporterId) {
        throw new Error('Missing required fields: type, url, reporterId');
      }

      const reportId = makeReportDocId({
        type: reportType,
        url: normalizedUrl,
        reporterId,
      });
      const reportRef = doc(db!, COLLECTIONS.REPORTS, reportId);
      const existingSnap = await getDoc(reportRef);

      const resolvedTitle = newReportData.title?.trim();
      const resolvedPlatform = newReportData.platform;

      const firestoreWritePayload = omitUndefined({
        type: reportType,
        url: normalizedUrl,
        title: resolvedTitle,
        platform: resolvedPlatform,
        reason: newReportData.reason,
        reporterId,
        status: 'pending' as const,
        createdAt: existingSnap.exists() ? undefined : serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await setDoc(reportRef, firestoreWritePayload, { merge: true });

      const now = new Date();
      const localReturn: Report = {
        id: reportId,
        type: reportType,
        url: normalizedUrl,
        title: resolvedTitle,
        platform: resolvedPlatform,
        reason: newReportData.reason,
        reporterId,
        status: 'pending',
        createdAt: existingSnap.exists() ? undefined : now,
        updatedAt: now,
      } as unknown as Report;

      return localReturn;
    } catch (err) {
      throw toAppError('Failed to upsert report', err);
    }
  },

  async getReports(
    filters: {
      type?: string;
      search?: string;
      status?: string;
      limitTo?: number;
      sort?: 'asc' | 'desc';
    } = {}
  ): Promise<Report[]> {
    try {
      if (!isFirebaseReady()) throw new Error('Firebase not initialized');

      const queryConstraints: QueryConstraint[] = [];
      const statusFilter = filters.status || 'approved';
      queryConstraints.push(where('status', '==', statusFilter));

      if (filters.type)
        queryConstraints.push(where('type', '==', filters.type));
      queryConstraints.push(orderBy('createdAt', filters.sort || 'desc'));
      if (filters.limitTo) queryConstraints.push(limit(filters.limitTo));

      const reportsQuery = query(
        collection(db!, COLLECTIONS.REPORTS),
        ...queryConstraints
      );
      const reportsSnapshot = await getDocs(reportsQuery);

      let reports = reportsSnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...convertTimestamps(docSnap.data()),
      })) as Report[];

      if (filters.search) {
        const term = filters.search.toLowerCase();
        reports = reports.filter(
          (r) =>
            (r.url && r.url.toLowerCase().includes(term)) ||
            (r.title && r.title.toLowerCase().includes(term))
        );
      }

      return reports;
    } catch (err) {
      throw toAppError('Failed to get reports', err);
    }
  },
};

/* --------------------------------------------------------------------- */
/* Suggestion Services                                                   */
/* --------------------------------------------------------------------- */

export const suggestionServices = {
  async createSuggestion(
    newSuggestionData: NewSuggestion
  ): Promise<Suggestion> {
    try {
      if (!isFirebaseReady()) throw new Error('Firebase not initialized');

      const localReturnPayload = {
        ...newSuggestionData,
        createdAt: serverTimestamp(),
      };

      const createdRef = await addDoc(
        collection(db!, COLLECTIONS.SUGGESTIONS),
        {
          ...newSuggestionData,
          createdAt: serverTimestamp(),
        }
      );

      return { id: createdRef.id, ...localReturnPayload } as Suggestion;
    } catch (err) {
      throw toAppError('Failed to create suggestion', err);
    }
  },
};
