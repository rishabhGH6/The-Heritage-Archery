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

  archers: [],

  streaks: {},

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
  // Purge legacy demo data cache if present
  try {
    localStorage.removeItem("heritage_archery_data_v1");
    localStorage.removeItem("heritage_archery_clean_v2");
    localStorage.removeItem("heritage_archery_clean_v3");
  } catch (e) {}

  const saved = localStorage.getItem("heritage_archery_clean_v4");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
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
    localStorage.setItem("heritage_archery_clean_v4", JSON.stringify(data));
  } catch (e) {
    console.error("Error saving archery data to localStorage", e);
  }
};
