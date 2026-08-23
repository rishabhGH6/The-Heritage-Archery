import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroCoach from './components/HeroCoach';
import Leaderboard from './components/Leaderboard';
import InteractiveScoring from './components/InteractiveScoring';
import ArcherDirectory from './components/ArcherDirectory';
import EquipmentTuner from './components/EquipmentTuner';
import VenueTracker from './components/VenueTracker';
import ChatHub from './components/ChatHub';
import GalleryInstagram from './components/GalleryInstagram';
import CoachPortal from './components/CoachPortal';
import MyProfile from './components/MyProfile';
import AiArcheryCoach from './components/AiArcheryCoach';
import ArcheryNews from './components/ArcheryNews';
import AdminControl from './components/AdminControl';
import CinematicIntro from './components/CinematicIntro';
import StreakNotificationBanner from './components/StreakNotificationBanner';

import { defaultData, loadAppData, saveAppData, defaultArchers, defaultStreaks, getPersistentSession, savePersistentSession } from './data/initialData';
import {
  fetchSupabaseData,
  syncSaveArcher,
  syncDeleteArcher,
  syncSaveCoach,
  syncSaveStreak,
  syncSaveVenue,
  syncSaveAnnouncement,
  syncSaveScoreLog,
  syncDeleteScoreLog,
  getDeletedScoreLogIds,
  syncSaveEquipment,
  syncSaveBadge,
  syncSaveChatMessage
} from './data/supabaseSync';
import { Target, Megaphone, Trophy, Shield, Heart } from 'lucide-react';

import { registerServiceWorker } from './lib/pushNotifications';

export default function App() {
  const [appData, setAppData] = useState(loadAppData());
  const [activeTab, setActiveTab] = useState('home');
  const [showIntro, setShowIntro] = useState(true);
  const [broadcastNotice, setBroadcastNotice] = useState(null);

  // Load from Supabase on mount & register Push Service Worker
  useEffect(() => {
    registerServiceWorker();
    fetchSupabaseData(appData).then(remoteData => {
      setAppData(prev => {
        const loadedArchers = (remoteData.archers && remoteData.archers.length > 0) ? remoteData.archers : (prev.archers && prev.archers.length > 0 ? prev.archers : defaultArchers);
        let activeUser = (prev.currentUser && prev.currentUser.id !== 'guest') ? prev.currentUser : { id: 'guest', role: 'guest', name: 'Guest' };

        if (activeUser && activeUser.role === 'archer') {
          const matchedArcher = loadedArchers.find(a => 
            a.id === activeUser.id || 
            (a.altId && a.altId === activeUser.id) ||
            (a.name && activeUser.name && a.name.trim().toLowerCase() === activeUser.name.trim().toLowerCase())
          );
          if (matchedArcher) {
            activeUser = {
              role: 'archer',
              id: matchedArcher.id,
              name: matchedArcher.name
            };
          }
        }

        const deletedLogsSet = getDeletedScoreLogIds();
        const cleanScoreLogs = (remoteData.scoreLogs || prev.scoreLogs || []).filter(s => !deletedLogsSet.has(s.id));

        return {
          ...remoteData,
          scoreLogs: cleanScoreLogs,
          archers: loadedArchers,
          streaks: (remoteData.streaks && Object.keys(remoteData.streaks).length > 0) ? remoteData.streaks : (prev.streaks && Object.keys(prev.streaks).length > 0 ? prev.streaks : defaultStreaks),
          currentUser: activeUser
        };
      });
    }).catch(err => {
      console.warn("Supabase background sync notice:", err);
    });
  }, []);

  // Preload profile photos in background for instant 0ms rendering
  useEffect(() => {
    if (appData.archers && appData.archers.length > 0) {
      appData.archers.forEach(a => {
        if (a.photo && a.photo.startsWith('http')) {
          const img = new Image();
          img.src = a.photo;
        }
      });
    }
  }, [appData.archers]);

  // Auto-save appData to localStorage as fallback cache
  useEffect(() => {
    saveAppData(appData);
  }, [appData]);

  // Handlers for updating state & syncing with Supabase
  const handleSwitchUser = (userObj) => {
    setAppData(prev => ({
      ...prev,
      currentUser: userObj
    }));
    savePersistentSession(userObj);
    setActiveTab('home'); // Requirement 3: Account switch resets to home section!
  };

  const handleUpdateCoach = (updatedCoach) => {
    setAppData(prev => ({
      ...prev,
      coach: updatedCoach
    }));
    syncSaveCoach(updatedCoach);
  };

  const handleUpdateCoachPassword = (newPassword) => {
    setAppData(prev => {
      const updatedCoach = { ...prev.coach, password: newPassword };
      syncSaveCoach(updatedCoach);
      return {
        ...prev,
        coach: updatedCoach
      };
    });
  };

  const handleUpdateArcher = (updatedArcher) => {
    setAppData(prev => ({
      ...prev,
      archers: prev.archers.map(a => a.id === updatedArcher.id ? updatedArcher : a)
    }));
    syncSaveArcher(updatedArcher);
  };

  const handleAddArcher = (newArcherObj) => {
    setAppData(prev => ({
      ...prev,
      archers: [...prev.archers, newArcherObj]
    }));
    syncSaveArcher(newArcherObj);
  };

  // Submit new registration request for admin approval
  const handleRequestAddArcher = (newPendingArcher) => {
    const pendingArcherObj = {
      ...newPendingArcher,
      status: 'pending'
    };
    setAppData(prev => ({
      ...prev,
      pendingArchers: [...(prev.pendingArchers || []), pendingArcherObj]
    }));
    syncSaveArcher(pendingArcherObj);
  };

  // Coach Jayanta (Admin) approves a pending registration
  const handleApproveArcher = (pendingArcher) => {
    const approvedArcher = {
      ...pendingArcher,
      status: 'approved'
    };
    setAppData(prev => ({
      ...prev,
      pendingArchers: (prev.pendingArchers || []).filter(p => p.id !== pendingArcher.id),
      archers: [...prev.archers, approvedArcher]
    }));
    syncSaveArcher(approvedArcher);
  };

  // Coach Jayanta (Admin) rejects a pending registration
  const handleRejectArcher = (pendingArcherId) => {
    setAppData(prev => ({
      ...prev,
      pendingArchers: (prev.pendingArchers || []).filter(p => p.id !== pendingArcherId)
    }));
    syncDeleteArcher(pendingArcherId);
  };

  const handleCheckInStreak = (archerId) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    setAppData(prev => {
      const currentStreakObj = prev.streaks[archerId] || { count: 0, lastChecked: null, history: [] };
      if (currentStreakObj.lastChecked === todayStr) return prev; // Already checked in today

      const historySet = new Set(currentStreakObj.history || []);
      if (currentStreakObj.lastChecked) historySet.add(currentStreakObj.lastChecked);
      historySet.add(todayStr);

      // Compute consecutive unbroken practice days ending today
      let consecutive = 0;
      let curr = new Date(today);

      while (true) {
        const dStr = curr.toISOString().split('T')[0];
        if (historySet.has(dStr)) {
          consecutive++;
          curr.setDate(curr.getDate() - 1);
        } else {
          break;
        }
      }

      const newStreakObj = {
        count: consecutive,
        lastChecked: todayStr,
        history: Array.from(historySet)
      };

      syncSaveStreak(archerId, newStreakObj);

      return {
        ...prev,
        streaks: {
          ...prev.streaks,
          [archerId]: newStreakObj
        }
      };
    });
  };

  const handleUpdateVenue = (newSchedule) => {
    setAppData(prev => ({
      ...prev,
      venueSchedule: newSchedule
    }));
    syncSaveVenue(newSchedule);
  };

  const handleSaveScorecard = (scoreLog) => {
    setAppData(prev => ({
      ...prev,
      scoreLogs: [scoreLog, ...(prev.scoreLogs || [])]
    }));
    syncSaveScoreLog(scoreLog);
  };

  const handleDeleteScorecard = (scoreLogId) => {
    setAppData(prev => {
      const updated = {
        ...prev,
        scoreLogs: (prev.scoreLogs || []).filter(s => s.id !== scoreLogId)
      };
      saveAppData(updated);
      return updated;
    });
    syncDeleteScoreLog(scoreLogId);
  };

  const handleSaveEquipment = (archerId, eqConfig) => {
    setAppData(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [archerId]: eqConfig
      }
    }));
    syncSaveEquipment(archerId, eqConfig);
  };

  const handleSendMessage = (msgObj) => {
    setAppData(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, msgObj]
    }));
    syncSaveChatMessage(msgObj);
  };

  const handleAddPhoto = (archerId, photoUrl) => {
    setAppData(prev => {
      let updatedArcher = null;
      const updatedArchers = prev.archers.map(a => {
        if (a.id === archerId) {
          updatedArcher = {
            ...a,
            photos: [...(a.photos || []), photoUrl]
          };
          return updatedArcher;
        }
        return a;
      });

      if (updatedArcher) {
        syncSaveArcher(updatedArcher);
      }

      return {
        ...prev,
        archers: updatedArchers
      };
    });
  };

  const handleAddAnnouncement = (annObj) => {
    setAppData(prev => ({
      ...prev,
      announcements: [annObj, ...prev.announcements]
    }));
    syncSaveAnnouncement(annObj);
  };

  const handleDeleteAnnouncement = (id) => {
    setAppData(prev => ({
      ...prev,
      announcements: prev.announcements.filter(a => a.id !== id)
    }));
  };

  const handleGrantBadge = (badgeObj) => {
    setAppData(prev => ({
      ...prev,
      badges: [badgeObj, ...prev.badges]
    }));
    syncSaveBadge(badgeObj);
  };

  const userStreak = appData.streaks[appData.currentUser.id] || { count: 0, lastChecked: null };

  const handleBroadcastStreakReminder = (msgText) => {
    setBroadcastNotice({
      message: msgText || "Archers, practice time! Log your scorecard or check in now to keep our team streak alive! 🔥",
      timestamp: new Date().toLocaleTimeString()
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Cinematic Splash Screen */}
      {showIntro && <CinematicIntro onComplete={() => setShowIntro(false)} />}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={appData.currentUser}
        archers={appData.archers}
        pendingArchers={appData.pendingArchers || []}
        coach={appData.coach}
        onSwitchUser={handleSwitchUser}
        onAddArcher={handleAddArcher}
        onRequestAddArcher={handleRequestAddArcher}
        onUpdateArcher={handleUpdateArcher}
        onReplayIntro={() => setShowIntro(true)}
      />

      {/* Main App Container with Smooth Entrance Transitions */}
      <main className="main-app-container fade-in-up" key={activeTab}>
        
        {/* GLOBAL STREAK NOTIFICATION BANNER (For All Users) */}
        <StreakNotificationBanner
          currentUser={appData.currentUser}
          userStreak={userStreak}
          onCheckInStreak={handleCheckInStreak}
          broadcastNotice={broadcastNotice}
          onCloseBroadcast={() => setBroadcastNotice(null)}
        />

        {/* Render Tab Contents */}
        {activeTab === 'home' && (
          <div>
            <HeroCoach
              coach={appData.coach}
              venueSchedule={appData.venueSchedule}
              currentUser={appData.currentUser}
              archers={appData.archers}
              streaks={appData.streaks}
              onCheckInStreak={handleCheckInStreak}
              userStreak={userStreak}
              onUpdateCoach={handleUpdateCoach}
              onBroadcastStreakReminder={handleBroadcastStreakReminder}
            />

            {/* Quick Overview Section: Full Width Coach Announcements */}
            <div style={{ marginBottom: '32px' }}>
              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Megaphone size={18} /> Coach Announcements & Team Bulletins
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Latest Updates</span>
                </div>

                {appData.announcements.length === 0 ? (
                  <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                    No announcements published yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {appData.announcements.map((an) => (
                      <div key={an.id} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '14px', borderRadius: '12px', borderLeft: '4px solid #d97706' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>{an.title}</span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{an.date}</span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>{an.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard
            archers={appData.archers}
            streaks={appData.streaks}
            currentUser={appData.currentUser}
            onCheckInStreak={handleCheckInStreak}
          />
        )}

        {activeTab === 'scoring' && (
          <InteractiveScoring
            currentUser={appData.currentUser}
            archers={appData.archers}
            scoreLogs={appData.scoreLogs || []}
            onSaveScorecard={handleSaveScorecard}
            onDeleteScorecard={handleDeleteScorecard}
          />
        )}

        {activeTab === 'archers' && (
          <ArcherDirectory
            archers={appData.archers}
            currentUser={appData.currentUser}
            coach={appData.coach}
            scoreLogs={appData.scoreLogs || []}
            onUpdateArcher={handleUpdateArcher}
            onAddArcher={handleAddArcher}
          />
        )}

        {activeTab === 'equipment' && (
          <EquipmentTuner
            archers={appData.archers}
            currentUser={appData.currentUser}
            equipmentData={appData.equipment}
            onSaveEquipment={handleSaveEquipment}
          />
        )}

        {activeTab === 'venue' && (
          <VenueTracker
            venueSchedule={appData.venueSchedule}
            currentUser={appData.currentUser}
            onUpdateVenue={handleUpdateVenue}
          />
        )}

        {activeTab === 'chat' && (
          <ChatHub
            currentUser={appData.currentUser}
            archers={appData.archers}
            coach={appData.coach}
            chatMessages={appData.chatMessages}
            onSendMessage={handleSendMessage}
            onSwitchUser={handleSwitchUser}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryInstagram
            archers={appData.archers}
            currentUser={appData.currentUser}
            onAddPhoto={handleAddPhoto}
          />
        )}

        {activeTab === 'profile' && (
          <MyProfile
            currentUser={appData.currentUser}
            archers={appData.archers}
            onUpdateArcher={handleUpdateArcher}
          />
        )}

        {activeTab === 'ai-coach' && (
          <AiArcheryCoach
            currentUser={appData.currentUser}
            archers={appData.archers}
            equipmentData={appData.equipment}
          />
        )}

        {activeTab === 'news' && (
          <ArcheryNews />
        )}

        {activeTab === 'admin' && (appData.currentUser.role === 'admin' || (appData.currentUser.name && appData.currentUser.name.trim().toLowerCase() === 'rishabh kumar sinha')) && (
          <AdminControl
            archers={appData.archers}
            pendingArchers={appData.pendingArchers || []}
            onApproveArcher={handleApproveArcher}
            onRejectArcher={handleRejectArcher}
          />
        )}

        {activeTab === 'coach' && appData.currentUser.role === 'coach' && (
          <CoachPortal
            coach={appData.coach}
            archers={appData.archers}
            announcements={appData.announcements}
            badges={appData.badges}
            onAddAnnouncement={handleAddAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            onGrantBadge={handleGrantBadge}
            onUpdateCoachPassword={handleUpdateCoachPassword}
          />
        )}

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-glass)', background: 'rgba(9, 13, 22, 0.9)', padding: '20px', textAlign: 'center', marginTop: 'auto' }}>
        <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>
          © {new Date().getFullYear()} The Heritage Archery Team Portal. Built for precision & college excellence.
        </p>
      </footer>

    </div>
  );
}
