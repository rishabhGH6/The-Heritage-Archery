import { supabase } from '../lib/supabaseClient';

// Helper to safely parse JSON or return default
const parseJson = (val, fallback) => {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
};

const CACHE_KEY = 'heritage_supabase_cache_v2';
const CACHE_TIME_KEY = 'heritage_supabase_cache_time_v2';
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 Minutes Smart Cache to minimize Egress bandwidth
const DELETED_SCORE_LOGS_KEY = 'heritage_deleted_score_logs_v1';

export const getDeletedScoreLogIds = () => {
  try {
    const raw = localStorage.getItem(DELETED_SCORE_LOGS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (e) {
    return new Set();
  }
};

export const trackDeletedScoreLog = (scoreLogId) => {
  try {
    const currentSet = getDeletedScoreLogIds();
    currentSet.add(scoreLogId);
    localStorage.setItem(DELETED_SCORE_LOGS_KEY, JSON.stringify(Array.from(currentSet)));
  } catch (e) {}
};

export const fetchSupabaseData = async (defaultData, forceRefresh = false) => {
  // 1. Check local cache first to save bandwidth (Egress)
  if (!forceRefresh) {
    try {
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
      const cachedData = localStorage.getItem(CACHE_KEY);

      if (cachedTime && cachedData) {
        const age = Date.now() - parseInt(cachedTime, 10);
        if (age < CACHE_TTL_MS) {
          const parsed = JSON.parse(cachedData);
          if (parsed && parsed.archers && parsed.archers.length > 0) {
            const deletedSet = getDeletedScoreLogIds();
            parsed.scoreLogs = (parsed.scoreLogs || []).filter(s => !deletedSet.has(s.id));
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn("Cache read error:", err);
    }
  }

  // 2. Fetch from Supabase with safe individual fallbacks
  try {
    const safeQuery = async (queryPromise, fallback = []) => {
      try {
        const res = await queryPromise;
        return res?.data || fallback;
      } catch (e) {
        return fallback;
      }
    };

    const [
      archersData,
      coachData,
      streaksData,
      venueData,
      announcementsData,
      equipmentData,
      scoreLogsData,
      badgesData,
      chatData
    ] = await Promise.all([
      safeQuery(supabase.from('archers').select('*')),
      safeQuery(supabase.from('coach').select('*')),
      safeQuery(supabase.from('streaks').select('*')),
      safeQuery(supabase.from('venue_schedule').select('*')),
      safeQuery(supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(20)),
      safeQuery(supabase.from('equipment').select('*')),
      safeQuery(supabase.from('score_logs').select('*').order('created_at', { ascending: false }).limit(50)),
      safeQuery(supabase.from('badges').select('*').order('created_at', { ascending: false })),
      safeQuery(supabase.from('chat_messages').select('*').order('created_at', { ascending: true }).limit(100))
    ]);

    const result = { ...defaultData };

    if (archersData && archersData.length > 0) {
      const activeList = [];
      const pendingList = [];

      archersData.forEach(a => {
        const defaultA = defaultData.archers?.find(da => 
          da.name.trim().toLowerCase() === a.name.trim().toLowerCase() || 
          da.id === a.id || 
          (da.altId && da.altId === a.id)
        );
        const fallbackPhoto = defaultA?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

        const archerObj = {
          id: a.id,
          altId: defaultA?.id,
          name: a.name,
          password: a.password || defaultA?.password || '',
          securityAnswer: a.security_answer || '',
          photo: (a.photo && a.photo.trim().length > 5) ? a.photo : fallbackPhoto,
          category: a.category || defaultA?.category || 'Junior',
          occupation: a.occupation || defaultA?.occupation || 'Student',
          currentlyPracticing: a.currently_practicing || 'Yes',
          dob: a.dob || defaultA?.dob || '',
          aim: a.aim || defaultA?.aim || '',
          summary: a.summary || defaultA?.summary || '',
          statesPlayed: parseJson(a.states_played, defaultA?.statesPlayed || ["West Bengal"]),
          photos: parseJson(a.photos, []),
          status: 'approved',
          requestDate: a.created_at ? new Date(a.created_at).toLocaleDateString() : new Date().toLocaleDateString()
        };

        activeList.push(archerObj);
      });

      if (activeList.length > 0) {
        result.archers = activeList;
      }
    }

    if (coachData && coachData.length > 0) {
      const c = coachData[0];
      const defaultCoachPhoto = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80";
      result.coach = {
        name: c.name || defaultData.coach.name,
        role: c.role || defaultData.coach.role,
        photo: (c.photo && c.photo.trim().length > 5) ? c.photo : (defaultData.coach.photo || defaultCoachPhoto),
        tagline: c.tagline || defaultData.coach.tagline,
        motivatingLines: c.motivating_lines || defaultData.coach.motivatingLines,
        password: c.password || defaultData.coach.password
      };
    }

    if (streaksData && streaksData.length > 0) {
      const streaksObj = { ...defaultData.streaks };
      streaksData.forEach(s => {
        const matchingArcher = result.archers.find(a => a.id === s.archer_id || a.altId === s.archer_id);
        const streakData = {
          count: s.count || 0,
          lastChecked: s.last_checked || null,
          history: parseJson(s.history, [])
        };
        streaksObj[s.archer_id] = streakData;
        if (matchingArcher) {
          if (matchingArcher.id) streaksObj[matchingArcher.id] = streakData;
          if (matchingArcher.altId) streaksObj[matchingArcher.altId] = streakData;
        }
      });
      result.streaks = streaksObj;
    }

    if (venueData && venueData.length > 0) {
      const v = venueData[0];
      result.venueSchedule = {
        venue: v.venue,
        date: v.date,
        time: v.time,
        distance: v.distance,
        equipmentNotes: v.equipment_notes,
        updatedBy: v.updated_by,
        updatedAt: v.updated_at
      };
    }

    if (announcementsData && announcementsData.length > 0) {
      result.announcements = announcementsData.map(an => ({
        id: an.id,
        title: an.title,
        content: an.content,
        author: an.author,
        date: an.date
      }));
    }

    if (equipmentData && equipmentData.length > 0) {
      const eqMap = {};
      equipmentData.forEach(eq => {
        eqMap[eq.archer_id] = parseJson(eq.config, {});
      });
      result.equipment = eqMap;
    }

    if (scoreLogsData) {
      const deletedSet = getDeletedScoreLogIds();
      result.scoreLogs = scoreLogsData
        .filter(s => !deletedSet.has(s.id))
        .map(s => ({
          id: s.id,
          archerId: s.archer_id,
          archerName: s.archer_name,
          date: s.date,
          distance: s.distance,
          totalScore: s.total_score,
          rounds: parseJson(s.rounds, []),
          groupingAnalysis: parseJson(s.grouping_analysis, null)
        }));
    }

    if (badgesData && badgesData.length > 0) {
      result.badges = badgesData.map(b => ({
        id: b.id,
        archerId: b.archer_id,
        title: b.title,
        description: b.description,
        grantedBy: b.granted_by,
        date: b.date
      }));
    }

    if (chatData && chatData.length > 0) {
      result.chatMessages = chatData.map(cm => ({
        id: cm.id,
        senderId: cm.sender_id,
        senderName: cm.sender_name,
        senderRole: cm.sender_role,
        text: cm.text,
        channel: cm.channel,
        timestamp: cm.timestamp
      }));
    }

    // Save to local cache
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(result));
      localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    } catch (e) {}

    return result;
  } catch (err) {
    console.warn("Supabase fetch failed, using local state", err);
    return defaultData;
  }
};

// Write helpers clear cache to ensure fresh sync on mutations
const invalidateCache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIME_KEY);
  } catch (e) {}
};

export const syncSaveArcher = async (archer) => {
  invalidateCache();
  try {
    await supabase.from('archers').upsert({
      id: archer.id,
      name: archer.name,
      password: archer.password,
      security_answer: archer.securityAnswer,
      photo: archer.photo,
      category: archer.category,
      occupation: archer.occupation,
      currently_practicing: archer.currentlyPracticing,
      dob: archer.dob,
      aim: archer.aim,
      summary: archer.summary,
      states_played: JSON.stringify(archer.statesPlayed || []),
      photos: JSON.stringify(archer.photos || [])
    });
  } catch (e) {
    console.error("Supabase archer save error", e);
  }
};

export const syncDeleteArcher = async (archerId) => {
  invalidateCache();
  try {
    await supabase.from('archers').delete().eq('id', archerId);
  } catch (e) {
    console.error("Supabase archer delete error", e);
  }
};

export const syncSaveCoach = async (coachObj) => {
  invalidateCache();
  try {
    await supabase.from('coach').upsert({
      id: 'coach_jayanta',
      name: coachObj.name,
      role: coachObj.role,
      photo: coachObj.photo,
      tagline: coachObj.tagline,
      motivating_lines: coachObj.motivatingLines,
      password: coachObj.password || 'jayanta'
    });
  } catch (e) {
    console.error("Supabase coach save error", e);
  }
};

export const syncSaveStreak = async (archerId, streakObj) => {
  invalidateCache();
  try {
    await supabase.from('streaks').upsert({
      archer_id: archerId,
      count: streakObj.count,
      last_checked: streakObj.lastChecked,
      history: JSON.stringify(streakObj.history || [])
    });
  } catch (e) {
    console.error("Supabase streak save error", e);
  }
};

export const syncSaveVenue = async (venueObj) => {
  invalidateCache();
  try {
    await supabase.from('venue_schedule').upsert({
      id: 'default_venue',
      venue: venueObj.venue,
      date: venueObj.date,
      time: venueObj.time,
      distance: venueObj.distance,
      equipment_notes: venueObj.equipmentNotes,
      updated_by: venueObj.updatedBy,
      updated_at: venueObj.updatedAt
    });
  } catch (e) {
    console.error("Supabase venue save error", e);
  }
};

export const syncSaveAnnouncement = async (an) => {
  invalidateCache();
  try {
    await supabase.from('announcements').insert({
      id: an.id,
      title: an.title,
      content: an.content,
      author: an.author,
      date: an.date
    });
  } catch (e) {
    console.error("Supabase announcement save error", e);
  }
};

export const syncSaveScoreLog = async (log) => {
  invalidateCache();
  try {
    await supabase.from('score_logs').insert({
      id: log.id,
      archer_id: log.archerId,
      archer_name: log.archerName,
      date: log.date,
      distance: log.distance,
      total_score: log.totalScore,
      rounds: JSON.stringify(log.rounds || []),
      grouping_analysis: JSON.stringify(log.groupingAnalysis || null)
    });
  } catch (e) {
    console.error("Supabase score log save error", e);
  }
};

export const syncDeleteScoreLog = async (scoreLogId) => {
  trackDeletedScoreLog(scoreLogId);
  invalidateCache();
  try {
    const { error } = await supabase.from('score_logs').delete().eq('id', scoreLogId);
    if (error) {
      console.warn("Supabase score log delete notice:", error);
    }
  } catch (e) {
    console.error("Supabase score log delete error", e);
  }
};

export const syncSaveEquipment = async (archerId, config) => {
  invalidateCache();
  try {
    await supabase.from('equipment').upsert({
      archer_id: archerId,
      config: JSON.stringify(config)
    });
  } catch (e) {
    console.error("Supabase equipment save error", e);
  }
};

export const syncSaveBadge = async (b) => {
  invalidateCache();
  try {
    await supabase.from('badges').insert({
      id: b.id,
      archer_id: b.archerId,
      title: b.title,
      description: b.description,
      granted_by: b.grantedBy,
      date: b.date
    });
  } catch (e) {
    console.error("Supabase badge save error", e);
  }
};

export const syncSaveChatMessage = async (msg) => {
  invalidateCache();
  try {
    await supabase.from('chat_messages').insert({
      id: msg.id,
      sender_id: msg.senderId,
      sender_name: msg.senderName,
      sender_role: msg.senderRole,
      text: msg.text,
      channel: msg.channel,
      timestamp: msg.timestamp
    });
  } catch (e) {
    console.error("Supabase chat save error", e);
  }
};

export const syncSaveInquiry = async (inquiry) => {
  invalidateCache();
  try {
    await supabase.from('inquiries').upsert({
      id: inquiry.id,
      name: inquiry.name,
      email_or_phone: inquiry.emailOrPhone,
      user_type: inquiry.userType,
      subject: inquiry.subject,
      message: inquiry.message,
      date: inquiry.date,
      status: inquiry.status || 'new'
    });
  } catch (e) {
    console.warn("Supabase inquiry save notice:", e);
  }
};

export const syncDeleteInquiry = async (inquiryId) => {
  invalidateCache();
  try {
    await supabase.from('inquiries').delete().eq('id', inquiryId);
  } catch (e) {
    console.warn("Supabase inquiry delete notice:", e);
  }
};

