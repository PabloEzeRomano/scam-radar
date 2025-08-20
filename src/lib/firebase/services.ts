import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentData,
} from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS, User, NewUser, Report, NewReport } from './models';

// Helper function to convert Firestore timestamp to Date
const convertTimestamps = (data: DocumentData) => {
  if (data.createdAt && typeof data.createdAt.toDate === 'function') {
    data.createdAt = data.createdAt.toDate();
  }
  return data;
};

// Check if Firebase is initialized
const isFirebaseReady = () => {
  return db !== null;
};

// User services
export const userServices = {
  async createUser(userData: NewUser): Promise<User> {
    if (!isFirebaseReady()) {
      throw new Error('Firebase not initialized');
    }

    const docRef = await addDoc(collection(db!, COLLECTIONS.USERS), {
      ...userData,
      createdAt: new Date(),
    });

    const doc = await getDoc(docRef);
    return { id: doc.id, ...convertTimestamps(doc.data()!) } as User;
  },

  async updateUser(userId: string, userData: Partial<NewUser>): Promise<User> {
    if (!isFirebaseReady()) {
      throw new Error('Firebase not initialized');
    }

    const userRef = doc(db!, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, userData);

    const updatedDoc = await getDoc(userRef);
    return { id: updatedDoc.id, ...convertTimestamps(updatedDoc.data()!) } as User;
  },

  async findUserByEmail(email: string): Promise<User | null> {
    if (!isFirebaseReady()) {
      throw new Error('Firebase not initialized');
    }

    const q = query(
      collection(db!, COLLECTIONS.USERS),
      where('email', '==', email),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...convertTimestamps(doc.data()) } as User;
  },

  async findUserByLinkedIn(linkedin: string): Promise<User | null> {
    if (!isFirebaseReady()) {
      throw new Error('Firebase not initialized');
    }

    const q = query(
      collection(db!, COLLECTIONS.USERS),
      where('linkedin', '==', linkedin),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...convertTimestamps(doc.data()) } as User;
  },

  async upsertUser(userData: NewUser): Promise<User> {
    // Try to find existing user by email or LinkedIn
    let existingUser: User | null = null;

    if (userData.email) {
      existingUser = await this.findUserByEmail(userData.email);
    } else if (userData.linkedin) {
      existingUser = await this.findUserByLinkedIn(userData.linkedin);
    }

    if (existingUser) {
      // Update existing user
      return await this.updateUser(existingUser.id!, userData);
    } else {
      // Create new user
      return await this.createUser(userData);
    }
  },
};

// Report services
export const reportServices = {
  async createReport(reportData: NewReport): Promise<Report> {
    if (!isFirebaseReady()) {
      throw new Error('Firebase not initialized');
    }

    const docRef = await addDoc(collection(db!, COLLECTIONS.REPORTS), {
      ...reportData,
      status: reportData.status || 'pending',
      createdAt: new Date(),
    });

    const doc = await getDoc(docRef);
    return { id: doc.id, ...convertTimestamps(doc.data()!) } as Report;
  },

  async getReports(filters: {
    type?: string;
    search?: string;
    status?: string;
  } = {}): Promise<Report[]> {
    if (!isFirebaseReady()) {
      throw new Error('Firebase not initialized');
    }

    const constraints: QueryConstraint[] = [];

    // Add status filter (default to 'approved')
    const status = filters.status || 'approved';
    constraints.push(where('status', '==', status));

    // Add type filter if specified
    if (filters.type) {
      constraints.push(where('type', '==', filters.type));
    }

    // Add ordering
    constraints.push(orderBy('createdAt', 'asc'));

    const q = query(collection(db!, COLLECTIONS.REPORTS), ...constraints);
    const querySnapshot = await getDocs(q);

    let reports = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as Report[];

    // Apply search filter (client-side since Firestore doesn't support full-text search)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      reports = reports.filter(report =>
        report.url.toLowerCase().includes(searchLower) ||
        (report.title && report.title.toLowerCase().includes(searchLower))
      );
    }

    return reports;
  },
};
