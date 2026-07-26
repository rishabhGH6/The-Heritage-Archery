export const defaultData = {
  coach: {
    name: "Coach Jayanta Chakraborty",
    role: "Head Archery Coach",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    tagline: "Precision, Discipline, and Unshakable Focus.",
    motivatingLines: "An arrow can only be shot by pulling it backward. When life is dragging you back with difficulties, it means it's going to launch you into something great. Keep your eyes on the gold target!",
    password: "STAR@Archery" // can be changed in settings
  },

  currentUser: {
    id: "coach",
    role: "coach", // 'coach' or 'archer'
    name: "Coach Jayanta Chakraborty"
  },

  archers: [
    {
      id: "archer_1",
      name: "Rahul Sharma",
      password: "archer",
      photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
      category: "Senior",
      occupation: "Student",
      currentlyPracticing: "Yes",
      dob: "2003-05-14", // Private
      aim: "Represent Heritage Archery at All-India Inter-University & National Trials",
      summary: "Recurve archer practicing 4 hours daily. Focusing on clicker timing and 70m arrow grouping.",
      statesPlayed: ["Bolpur State Championship 2024", "Kalimpong Open 2025", "Kolkata University Cup"],
      photos: [
        "https://images.unsplash.com/photo-1511067007398-7e4b90a77553?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: "archer_2",
      name: "Priyanshu Roy",
      password: "archer",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      category: "Junior",
      occupation: "Higher Studies",
      currentlyPracticing: "Yes",
      dob: "2004-11-20", // Private
      aim: "Achieve 340+ in 36-arrow 50m Compound Round",
      summary: "Compound bow spec with 58lbs draw weight. Precision release technique enthusiast.",
      statesPlayed: ["Rajgunj State Archery Meet", "Bolpur Junior Gold 2024"],
      photos: [
        "https://images.unsplash.com/photo-1565992441121-4367c2967103?auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: "archer_3",
      name: "Ananya Sengupta",
      password: "archer",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      category: "Senior",
      occupation: "Working Professional",
      currentlyPracticing: "Yes",
      dob: "2002-08-09", // Private
      aim: "Consistent 10-ring grouping under high wind conditions",
      summary: "Recurve archer. Balancing tech job & weekend morning practice sessions at college field.",
      statesPlayed: ["Kalimpong Open 2025", "Rajgunj Invitational", "Siliguri Archery Meet"],
      photos: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: "archer_4",
      name: "Sneha Basu",
      password: "archer",
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      category: "Junior",
      occupation: "Student",
      currentlyPracticing: "Yes",
      dob: "2005-02-18", // Private
      aim: "Master smooth back tension and bow stance rhythm",
      summary: "First-year Heritage archer passionate about recurve and state-level competition.",
      statesPlayed: ["Bolpur Junior Gold 2024"],
      photos: []
    }
  ],

  // Practice Streaks (archer_id -> streak count & last check-in date)
  streaks: {
    "archer_1": { count: 14, lastChecked: "2026-07-26", history: ["2026-07-26", "2026-07-25", "2026-07-24"] },
    "archer_2": { count: 9, lastChecked: "2026-07-26", history: ["2026-07-26", "2026-07-25"] },
    "archer_3": { count: 6, lastChecked: "2026-07-25", history: ["2026-07-25"] },
    "archer_4": { count: 4, lastChecked: "2026-07-26", history: ["2026-07-26"] }
  },

  // Timing & Venue Update Live Card
  venueSchedule: {
    venue: "The Heritage College Main Sports Ground - Target Range 1",
    date: "Today, 26th July 2026",
    time: "4:30 PM - 7:00 PM",
    distance: "70m & 50m Target Line",
    equipmentNotes: "Bring 70m sight mark sheets, fresh target faces, and water bottles.",
    updatedBy: "Coach Jayanta Chakraborty",
    updatedAt: "2026-07-26 11:30 AM"
  },

  // Announcements
  announcements: [
    {
      id: "ann_1",
      title: "🎯 State Selection Trials Announcement",
      content: "All Senior and Junior archers are requested to submit their 6-round scorecards before Thursday for state trial registration.",
      date: "2026-07-25",
      author: "Coach Jayanta Chakraborty"
    },
    {
      id: "ann_2",
      title: "🏹 New Easton Arrows & Target Faces Arrived",
      content: "Fresh target faces and arrow spine tuning gear are now available in the college equipment room.",
      date: "2026-07-22",
      author: "Coach Jayanta Chakraborty"
    }
  ],

  // Equipment Logs (archerId -> equipment config)
  equipment: {
    "archer_1": {
      poundage: "42 lbs",
      braceHeight: "8.75 inches",
      sightMarks: {
        "30m": "4.2",
        "50m": "6.8",
        "60m": "7.9",
        "70m": "9.1"
      },
      goodArrows: [1, 2, 3, 5, 7, 8, 10, 11] // arrow numbers #1 to #12
    },
    "archer_2": {
      poundage: "58 lbs",
      braceHeight: "7.2 inches",
      sightMarks: {
        "30m": "3.1",
        "50m": "5.4",
        "60m": "6.5",
        "70m": "7.8"
      },
      goodArrows: [1, 2, 4, 5, 6, 9, 10, 12]
    }
  },

  // Scoring History Logs
  scoreLogs: [
    {
      id: "score_101",
      archerId: "archer_1",
      archerName: "Rahul Sharma",
      date: "2026-07-26",
      distance: "70m",
      rounds: [
        {
          roundNumber: 1,
          arrows: [
            { score: 10, isX: true, xRatio: 0.05, yRatio: -0.02, tags: ["Good shot"], comment: "Clean clicker break" },
            { score: 10, isX: false, xRatio: 0.1, yRatio: 0.08, tags: ["Good shot"], comment: "Strong follow through" },
            { score: 9, isX: false, xRatio: -0.25, yRatio: 0.15, tags: ["New arrow"], comment: "Arrow #3 drift" },
            { score: 10, isX: true, xRatio: 0.02, yRatio: 0.01, tags: ["Good shot"], comment: "X ring!" },
            { score: 9, isX: false, xRatio: 0.22, yRatio: -0.18, tags: [], comment: "" },
            { score: 8, isX: false, xRatio: 0.45, yRatio: 0.3, tags: ["Bad release"], comment: "Plucked string slightly" }
          ],
          total: 56
        },
        {
          roundNumber: 2,
          arrows: [
            { score: 10, isX: true, xRatio: 0.01, yRatio: 0.02, tags: ["Good shot"], comment: "" },
            { score: 9, isX: false, xRatio: -0.2, yRatio: -0.1, tags: [], comment: "" },
            { score: 10, isX: false, xRatio: 0.12, yRatio: 0.05, tags: ["Good shot"], comment: "" },
            { score: 9, isX: false, xRatio: 0.28, yRatio: 0.12, tags: [], comment: "" },
            { score: 10, isX: true, xRatio: 0.04, yRatio: -0.03, tags: ["Good shot"], comment: "" },
            { score: 9, isX: false, xRatio: -0.18, yRatio: 0.22, tags: [], comment: "" }
          ],
          total: 56
        }
      ],
      totalScore: 334,
      groupingAnalysis: {
        tightness: "Tight 10-Ring Grouping",
        spreadRadius: "3.4 cm",
        bias: "Slight Top-Right Bias (+0.8cm X, +1.2cm Y)"
      }
    }
  ],

  // Badges granted by Coach Jayanta
  badges: [
    {
      id: "b1",
      archerId: "archer_1",
      title: "Gold Bullseye Master 🎯",
      description: "Shot 3 consecutive X-ring arrows at 70m practice session.",
      date: "2026-07-24"
    },
    {
      id: "b2",
      archerId: "archer_2",
      title: "14-Day Streak Warrior 🔥",
      description: "Maintained 100% daily practice check-in for two full weeks.",
      date: "2026-07-26"
    }
  ],

  // Group Chat & DMs
  chatMessages: [
    {
      id: "c1",
      senderId: "coach",
      senderName: "Coach Jayanta Chakraborty",
      senderRole: "coach",
      text: "Great shooting form today everyone! Make sure to log your 6-round target taps.",
      timestamp: "10:30 AM",
      channel: "general"
    },
    {
      id: "c2",
      senderId: "archer_1",
      senderName: "Rahul Sharma",
      senderRole: "archer",
      text: "Thank you Sir! Worked on my back tension release today.",
      timestamp: "10:34 AM",
      channel: "general"
    },
    {
      id: "c3",
      senderId: "archer_2",
      senderName: "Priyanshu Roy",
      senderRole: "archer",
      text: "Sir, what time is target setup today at the college ground?",
      timestamp: "11:05 AM",
      channel: "general"
    },
    {
      id: "c4",
      senderId: "coach",
      senderName: "Coach Jayanta Chakraborty",
      senderRole: "coach",
      text: "Target setup starts at 4:30 PM sharp. Venue card is updated on the homepage.",
      timestamp: "11:32 AM",
      channel: "general"
    }
  ]
};

// Helper function to load data from LocalStorage or initialize default
export const loadAppData = () => {
  const saved = localStorage.getItem("heritage_archery_data_v1");
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
    localStorage.setItem("heritage_archery_data_v1", JSON.stringify(data));
  } catch (e) {
    console.error("Error saving archery data to localStorage", e);
  }
};
