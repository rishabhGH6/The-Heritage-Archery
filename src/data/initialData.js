export const defaultArchers = [
  {
    id: "archer_1785297210984",
    altId: "archer_rishabh",
    name: "Rishabh Kumar Sinha",
    password: "Rishabh14102004",
    securityAnswer: "archer",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    category: "Junior Archer",
    occupation: "College Student",
    currentlyPracticing: "Yes",
    dob: "2004-05-12",
    aim: "Gold Medal in All-India University Nationals 🎯",
    summary: "Dedicated Recurve Archer focused on form consistency and high-pressure tournament matchplay.",
    statesPlayed: ["West Bengal", "Jharkhand"],
    photos: []
  },
  {
    id: "archer_1785340402782",
    altId: "archer_rishiraj",
    name: "Rishiraj Rout",
    password: "rishi9211",
    securityAnswer: "archer",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    category: "Senior Archer",
    occupation: "College Student",
    currentlyPracticing: "Yes",
    dob: "2003-09-18",
    aim: "National Championship Medalist",
    summary: "Senior Recurve Archer specializing in 70m Olympic distance qualification rounds.",
    statesPlayed: ["West Bengal"],
    photos: []
  },
  {
    id: "archer_1785338580996",
    altId: "archer_ajay",
    name: "AJAΨ KUMAR",
    password: "SarwasresthDhanurdharX36",
    securityAnswer: "archer",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    category: "Junior Archer",
    occupation: "College Student",
    currentlyPracticing: "Yes",
    dob: "2004-01-22",
    aim: "Consistent 10-ring execution",
    summary: "Compound & Recurve archer practicing daily ends to maintain active tournament streak.",
    statesPlayed: ["West Bengal"],
    photos: []
  },
  {
    id: "archer_1785650256269",
    altId: "archer_anisha",
    name: "Anisha Karan",
    password: "pihumerijaan",
    securityAnswer: "archer",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    category: "Junior Archer",
    occupation: "College Student",
    currentlyPracticing: "Yes",
    dob: "2004-11-05",
    aim: "State Championship Gold",
    summary: "Precision shooter practicing 50m & 70m target rounds.",
    statesPlayed: ["West Bengal"],
    photos: []
  },
  {
    id: "archer_1785342143430",
    altId: "archer_rahim",
    name: "Md Rahimuddin",
    password: "Rahim@2002",
    securityAnswer: "archer",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    category: "Junior Archer",
    occupation: "College Student",
    currentlyPracticing: "Yes",
    dob: "2003-12-14",
    aim: "University Archery Team Captaincy",
    summary: "Passionate archer honing stance stability and anchor point discipline.",
    statesPlayed: ["West Bengal"],
    photos: []
  }
];

export const defaultStreaks = {
  archer_rishabh: {
    count: 8,
    lastChecked: "2026-08-05",
    history: ["2026-07-29", "2026-07-30", "2026-07-31", "2026-08-01", "2026-08-02", "2026-08-03", "2026-08-04", "2026-08-05"]
  },
  archer_rishiraj: {
    count: 0,
    lastChecked: "2026-07-29",
    history: ["2026-07-29"]
  },
  archer_ajay: {
    count: 7,
    lastChecked: "2026-08-05",
    history: ["2026-07-30", "2026-07-31", "2026-08-01", "2026-08-02", "2026-08-03", "2026-08-04", "2026-08-05"]
  },
  archer_anisha: {
    count: 2,
    lastChecked: "2026-08-05",
    history: ["2026-08-04", "2026-08-05"]
  },
  archer_rahim: {
    count: 1,
    lastChecked: "2026-08-05",
    history: ["2026-08-05"]
  }
};

export const defaultData = {
  coach: {
    name: "Coach Jayanta Chakraborty",
    role: "Head Archery Coach",
    photo: "",
    tagline: "Precision, Discipline, and Unshakable Focus.",
    motivatingLines: "Welcome to The Heritage Archery official team portal. Keep your eyes on the gold target!",
    password: "STAR@Archery"
  },

  currentUser: {
    id: "guest",
    role: "guest",
    name: "Guest"
  },

  archers: defaultArchers,

  pendingArchers: [],

  streaks: defaultStreaks,

  venueSchedule: {
    venue: "The Heritage College Sports Ground - Target Range",
    date: "Today",
    time: "4:30 PM - 7:00 PM",
    distance: "70m & 50m Target Line",
    equipmentNotes: "Bring 70m Target Faces, Bow Stand, Arm Guard, Chest Guard, Arrow Puller & Finger Tab.",
    updatedBy: "Coach Jayanta",
    updatedAt: new Date().toLocaleDateString()
  },

  announcements: [],

  equipment: {},

  scoreLogs: [],

  badges: [],

  chatMessages: []
};

// Authentication & Session Persistence Constants
export const AUTH_TOKEN_KEY = "heritage_archery_auth_token";
export const AUTH_SESSION_KEY = "heritage_archery_user_session";
export const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds

/**
 * Requirement 1: Persistence on Login
 * Stores user auth token along with an expiration timestamp (5 days from login time) in localStorage
 */
export const savePersistentSession = (userObj, token = null) => {
  try {
    if (!userObj || userObj.role === 'guest') {
      clearPersistentSession();
    } else {
      const now = Date.now();
      const expiresAt = now + FIVE_DAYS_MS;
      const authToken = token || `ha_auth_token_${userObj.id}_${now}`;

      const sessionPayload = {
        token: authToken,
        user: userObj,
        loginTime: now,
        expiresAt: expiresAt
      };

      localStorage.setItem(AUTH_TOKEN_KEY, authToken);
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionPayload));
    }
  } catch (e) {
    console.warn("Failed to persist authentication session:", e);
  }
};

/**
 * Requirement 2: Auto-Check on App Load / Page Refresh
 * Verifies if the token exists and is not expired (within 5 days from login).
 * - If valid: returns the stored logged-in user state.
 * - If expired or missing: clears storage and returns logged-out guest state.
 */
export const getPersistentSession = () => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const savedSession = localStorage.getItem(AUTH_SESSION_KEY);

    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      const now = Date.now();

      // Verify token exists and expiration timestamp has not passed (5-day validity check)
      if (parsed && parsed.expiresAt && now < parsed.expiresAt && parsed.user && parsed.user.role !== 'guest') {
        return parsed.user;
      }
    }
  } catch (e) {
    console.error("Error checking authentication session state:", e);
  }

  // If expired or missing: clear storage and return logged-out guest state
  clearPersistentSession();
  return { id: "guest", role: "guest", name: "Guest" };
};

/**
 * Requirement 3: Logout Handler Helper
 * Explicitly removes stored authentication token and expiration timestamp from localStorage
 */
export const clearPersistentSession = () => {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_SESSION_KEY);
  } catch (e) {
    console.warn("Failed to clear authentication session:", e);
  }
};

/**
 * Helper function to load data from LocalStorage or initialize default on app load/refresh
 */
export const loadAppData = () => {
  const activeUser = getPersistentSession(); // Auto-Check 5-day token on app load/refresh!
  const saved = localStorage.getItem("heritage_archery_clean_v6") || localStorage.getItem("heritage_archery_clean_v5");

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        archers: (parsed.archers && parsed.archers.length > 0) ? parsed.archers : defaultArchers,
        streaks: (parsed.streaks && Object.keys(parsed.streaks).length > 0) ? parsed.streaks : defaultStreaks,
        currentUser: activeUser
      };
    } catch (e) {
      console.error("Error loading saved archery data", e);
    }
  }
  return {
    ...defaultData,
    currentUser: activeUser
  };
};

import { saveCustomArcherPhoto, resolveArcherPhoto } from './photoStorage';

export const saveAppData = (data) => {
  try {
    // Save any custom archer profile photos to dedicated photoStorage
    if (data.archers && Array.isArray(data.archers)) {
      data.archers.forEach(a => {
        if (a.photo && a.photo.trim().length > 10) {
          if (a.id) saveCustomArcherPhoto(a.id, a.photo);
          if (a.altId) saveCustomArcherPhoto(a.altId, a.photo);
          if (a.name) saveCustomArcherPhoto(a.name.trim().toLowerCase(), a.photo);
        }
      });
    }

    localStorage.setItem("heritage_archery_clean_v6", JSON.stringify(data));
  } catch (e) {
    try {
      // Safe fallback if localStorage quota exceeded: preserve photos in photoStorage map
      localStorage.setItem("heritage_archery_clean_v6", JSON.stringify({
        ...data,
        archers: (data.archers || []).map(a => ({
          ...a,
          photo: resolveArcherPhoto(a)
        }))
      }));
    } catch (err) {
      console.warn("Storage quota exceeded, continuing with memory state:", err);
    }
  }
};
