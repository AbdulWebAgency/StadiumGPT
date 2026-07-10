import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query,
  orderBy
} from 'firebase/firestore';
import type { UserPreferences, UserMemory, LostFoundReport } from '../types';

// Detect if Firebase configuration is provided in env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigValid = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

let app;
let auth: any = null;
let db: any = null;

if (isConfigValid) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('StadiumGPT: Firebase successfully initialized in LIVE mode.');
  } catch (err) {
    console.error('StadiumGPT: Failed to initialize live Firebase, switching to LOCAL mode:', err);
  }
} else {
  console.log('StadiumGPT: Firebase env keys missing. Running in LOCAL/MOCK mode.');
}

// ----------------------------------------------------
// AUTHENTICATION INTERFACES & WRAPPERS
// ----------------------------------------------------

export const signInWithGoogle = async (): Promise<UserPreferences> => {
  if (auth) {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return {
      isOnboarded: true,
      isGuest: false,
      displayName: result.user.displayName,
      email: result.user.email,
      uid: result.user.uid,
    };
  } else {
    // Mock login popups in Local Mode
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: UserPreferences = {
          isOnboarded: true,
          isGuest: false,
          displayName: 'Alex Morgan',
          email: 'alex.morgan@fifafan.com',
          uid: 'mock_google_user_123',
        };
        localStorage.setItem('stadiumgpt_mock_user', JSON.stringify(mockUser));
        resolve(mockUser);
      }, 800);
    });
  }
};

export const continueAsGuest = (): UserPreferences => {
  const guestUser: UserPreferences = {
    isOnboarded: true,
    isGuest: true,
    displayName: 'Guest Fan',
    email: null,
    uid: 'guest_' + Math.random().toString(36).substring(2, 11),
  };
  localStorage.setItem('stadiumgpt_mock_user', JSON.stringify(guestUser));
  return guestUser;
};

export const logoutUser = async (): Promise<void> => {
  if (auth) {
    await signOut(auth);
  } else {
    localStorage.removeItem('stadiumgpt_mock_user');
  }
};

export const monitorAuthState = (callback: (user: UserPreferences | null) => void) => {
  if (auth) {
    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        callback({
          isOnboarded: true,
          isGuest: false,
          displayName: fbUser.displayName,
          email: fbUser.email,
          uid: fbUser.uid,
        });
      } else {
        // Fallback to local guest check if active
        const savedMock = localStorage.getItem('stadiumgpt_mock_user');
        if (savedMock) {
          callback(JSON.parse(savedMock));
        } else {
          callback(null);
        }
      }
    });
  } else {
    const checkLocal = () => {
      const savedMock = localStorage.getItem('stadiumgpt_mock_user');
      if (savedMock) {
        callback(JSON.parse(savedMock));
      } else {
        callback(null);
      }
    };
    checkLocal();
    // Simulate unsubscribe for mock auth listener
    return () => {};
  }
};

// ----------------------------------------------------
// FIRESTORE / MEMORY & DATABASE WRAPPERS
// ----------------------------------------------------

export const saveUserMemory = async (uid: string, memory: UserMemory): Promise<void> => {
  if (db) {
    const docRef = doc(db, 'user_memories', uid);
    await setDoc(docRef, memory, { merge: true });
  } else {
    localStorage.setItem(`stadiumgpt_memory_${uid}`, JSON.stringify(memory));
  }
};

export const getUserMemory = async (uid: string): Promise<UserMemory | null> => {
  if (db) {
    const docRef = doc(db, 'user_memories', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserMemory;
    }
    return null;
  } else {
    const saved = localStorage.getItem(`stadiumgpt_memory_${uid}`);
    return saved ? JSON.parse(saved) : null;
  }
};

export const createLostFoundReport = async (report: Omit<LostFoundReport, 'id' | 'timestamp' | 'status'>): Promise<LostFoundReport> => {
  const fullReport: LostFoundReport = {
    ...report,
    id: Math.random().toString(36).substring(2, 11),
    timestamp: Date.now(),
    status: 'active',
  };

  if (db) {
    const colRef = collection(db, 'lost_found_reports');
    const docRef = await addDoc(colRef, fullReport);
    fullReport.id = docRef.id;
  } else {
    const list = getLocalLostFoundReports();
    list.unshift(fullReport);
    localStorage.setItem('stadiumgpt_lost_found', JSON.stringify(list));
  }
  return fullReport;
};

export const getLostFoundReports = async (): Promise<LostFoundReport[]> => {
  if (db) {
    const colRef = collection(db, 'lost_found_reports');
    // Order by timestamp desc
    const q = query(colRef, orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    const results: LostFoundReport[] = [];
    snap.forEach((doc) => {
      results.push({ ...doc.data(), id: doc.id } as LostFoundReport);
    });
    return results;
  } else {
    return getLocalLostFoundReports();
  }
};

const getLocalLostFoundReports = (): LostFoundReport[] => {
  const saved = localStorage.getItem('stadiumgpt_lost_found');
  if (saved) return JSON.parse(saved);
  
  // Seed with mock reports for immediate realistic testing
  const seed: LostFoundReport[] = [
    {
      id: 'lf_seed_1',
      type: 'found',
      item: 'Keys',
      color: 'Silver',
      location: 'Section 104 restrooms',
      description: 'Keychain with a miniature leather football and three metal keys.',
      timestamp: Date.now() - 3600000 * 2, // 2 hours ago
      status: 'active',
      reportedBy: 'system_bot',
    },
    {
      id: 'lf_seed_2',
      type: 'found',
      item: 'Blue Backpack',
      color: 'Blue',
      location: 'Gate A turnstile area',
      description: 'FIFA branded blue backpack containing stadium credentials and a scarf.',
      timestamp: Date.now() - 3600000 * 5, // 5 hours ago
      status: 'active',
      reportedBy: 'system_bot',
    },
    {
      id: 'lf_seed_3',
      type: 'found',
      item: 'iPhone 15',
      color: 'Black',
      location: 'Section 220, Row K',
      description: 'Black iPhone in a red silicon case. Wallpaper is a picture of a golden retriever.',
      timestamp: Date.now() - 3600000 * 8, // 8 hours ago
      status: 'active',
      reportedBy: 'system_bot',
    }
  ];
  localStorage.setItem('stadiumgpt_lost_found', JSON.stringify(seed));
  return seed;
};
