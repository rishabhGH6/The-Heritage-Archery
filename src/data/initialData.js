export const defaultData = {
  coach: {
    name: "Coach Jayanta Chakraborty",
    role: "Head Archery Coach",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    tagline: "Precision, Discipline, and Unshakable Focus.",
    motivatingLines: "Welcome to The Heritage Archery official team portal. Keep your eyes on the gold target!",
    password: "STAR@Archery"
  },

  currentUser: {
    id: "coach",
    role: "coach",
    name: "Coach Jayanta Chakraborty"
  },

  archers: [],

  streaks: {},

  venueSchedule: {
    venue: "The Heritage College Sports Ground - Target Range",
    date: "Today",
    time: "4:30 PM - 7:00 PM",
    distance: "70m & 50m Target Line",
    equipmentNotes: "Bring your archery equipment and water bottles.",
    updatedBy: "Coach Jayanta Chakraborty",
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
  // Purge legacy demo data cache if present
  try {
    localStorage.removeItem("heritage_archery_data_v1");
  } catch (e) {}

  const saved = localStorage.getItem("heritage_archery_clean_v2");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error loading saved archery data", e);
    }
  }
  return defaultData;
};

export const saveAppData = (data) => {
  try {
    localStorage.setItem("heritage_archery_clean_v2", JSON.stringify(data));
  } catch (e) {
    console.error("Error saving archery data to localStorage", e);
  }
};
