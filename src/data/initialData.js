export const defaultArchers = [
  {
    id: "archer_rishabh",
    name: "Rishabh Kumar Sinha",
    password: "archer",
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
    id: "archer_rishiraj",
    name: "Rishiraj Rout",
    password: "archer",
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
    id: "archer_ajay",
    name: "Ajay Kumar",
    password: "archer",
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
    id: "archer_anisha",
    name: "Anisha Karan",
    password: "archer",
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
    id: "archer_rahim",
    name: "Md Rahimuddin",
    password: "archer",
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

// Helper function to load data from LocalStorage or initialize default
export const loadAppData = () => {
  const saved = localStorage.getItem("heritage_archery_clean_v5");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        archers: (parsed.archers && parsed.archers.length > 0) ? parsed.archers : defaultArchers,
        streaks: (parsed.streaks && Object.keys(parsed.streaks).length > 0) ? parsed.streaks : defaultStreaks,
        currentUser: { id: "guest", role: "guest", name: "Guest" } // Always start website in Guest mode
      };
    } catch (e) {
      console.error("Error loading saved archery data", e);
    }
  }
  return {
    ...defaultData,
    currentUser: { id: "guest", role: "guest", name: "Guest" }
  };
};

export const saveAppData = (data) => {
  try {
    localStorage.setItem("heritage_archery_clean_v5", JSON.stringify(data));
  } catch (e) {
    console.error("Error saving archery data to localStorage", e);
  }
};
