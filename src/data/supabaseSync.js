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

export const fetchSupabaseData = async (defaultData) => {
  try {
    // 4.5-second timeout promise to eliminate 30s network hanging on cold starts
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Supabase request timeout')), 4500)
    );

    const dataFetchPromise = Promise.all([
      supabase.from('archers').select('*'),
      supabase.from('coach').select('*'),
      supabase.from('streaks').select('*'),
      supabase.from('venue_schedule').select('*'),
      supabase.from('announcements').select('*').order('created_at', { ascending: false }),
      supabase.from('equipment').select('*'),
      supabase.from('score_logs').select('*').order('created_at', { ascending: false }),
      supabase.from('badges').select('*').order('created_at', { ascending: false }),
      supabase.from('chat_messages').select('*').order('created_at', { ascending: true })
    ]);

    const [
      { data: archersData },
      { data: coachData },
      { data: streaksData },
      { data: venueData },
      { data: announcementsData },
      { data: equipmentData },
      { data: scoreLogsData },
      { data: badgesData },
      { data: chatData }
    ] = await Promise.race([dataFetchPromise, timeoutPromise]);

    const result = { ...defaultData };

    if (archersData && archersData.length > 0) {
      const activeList = [];
      const pendingList = [];

      archersData.forEach(a => {
        const defaultA = defaultData.archers?.find(da => da.name.trim().toLowerCase() === a.name.trim().toLowerCase() || da.id === a.id);
        const fallbackPhoto = defaultA?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

        const archerObj = {
          id: a.id,
          altId: defaultA?.id,
          name: a.name,
          password: a.password || 'archer',
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
          status: a.status || 'approved',
          requestDate: a.created_at ? new Date(a.created_at).toLocaleDateString() : new Date().toLocaleDateString()
        };

        if (a.status === 'pending') {
          pendingList.push(archerObj);
        } else {
          activeList.push(archerObj);
        }
      });

      if (activeList.length > 0) {
        result.archers = activeList;
      }
      result.pendingArchers = pendingList;
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
        if (s.archer_id) streaksObj[s.archer_id] = streakData;
        if (matchingArcher) {
          streaksObj[matchingArcher.id] = streakData;
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

    if (scoreLogsData && scoreLogsData.length > 0) {
      result.scoreLogs = scoreLogsData.map(s => ({
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

    return result;
  } catch (err) {
    console.warn("Supabase fetch failed, using local state", err);
    return defaultData;
  }
};

// Sync functions to upsert data to Supabase
export const syncSaveArcher = async (archer) => {
  try {
    await supabase.from('archers').upsert({
      id: archer.id,
      name: archer.name,
      password: archer.password,
      security_answer: archer.securityAnswer || '',
      photo: archer.photo || '',
      category: archer.category || 'Junior',
      occupation: archer.occupation || 'Student',
      currently_practicing: archer.currentlyPracticing || 'Yes',
      dob: archer.dob || '',
      aim: archer.aim || '',
      summary: archer.summary || '',
      states_played: JSON.stringify(archer.statesPlayed || []),
      photos: JSON.stringify(archer.photos || []),
      status: archer.status || 'approved'
    });
  } catch (e) {
    console.error("Supabase archer save error", e);
  }
};

export const syncDeleteArcher = async (archerId) => {
  try {
    await supabase.from('archers').delete().eq('id', archerId);
  } catch (e) {
    console.error("Supabase archer delete error", e);
  }
};

export const syncSaveCoach = async (coach) => {
  try {
    await supabase.from('coach').upsert({
      id: 'coach_jayanta',
      name: coach.name,
      role: coach.role,
      photo: coach.photo || '',
      tagline: coach.tagline,
      motivating_lines: coach.motivatingLines,
      password: coach.password
    });
  } catch (e) {
    console.error("Supabase coach save error", e);
  }
};

export const syncSaveStreak = async (archerId, streakObj) => {
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

export const syncSaveEquipment = async (archerId, config) => {
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
  try {
    await supabase.from('chat_messages').insert({
      id: msg.id,
      sender_id: msg.senderId,
      sender_name: msg.senderName,
      sender_role: msg.senderRole,
      text: msg.text,
      channel: msg.channel || 'general',
      timestamp: msg.timestamp
    });
  } catch (e) {
    console.error("Supabase chat message save error", e);
  }
};
