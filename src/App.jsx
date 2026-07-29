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
import CinematicIntro from './components/CinematicIntro';

import { defaultData, loadAppData, saveAppData } from './data/initialData';
import {
  fetchSupabaseData,
  syncSaveArcher,
  syncSaveCoach,
  syncSaveStreak,
  syncSaveVenue,
  syncSaveAnnouncement,
  syncSaveScoreLog,
  syncSaveEquipment,
  syncSaveBadge,
  syncSaveChatMessage
} from './data/supabaseSync';
import { Target, Megaphone, Trophy, Shield, Heart } from 'lucide-react';

export default function App() {
  const [appData, setAppData] = useState(loadAppData());
  const [activeTab, setActiveTab] = useState('home');
  const [showIntro, setShowIntro] = useState(true);

  // Load from Supabase on mount
  useEffect(() => {
    fetchSupabaseData(defaultData).then(remoteData => {
      setAppData(prev => ({
        ...remoteData,
        currentUser: prev.currentUser
      }));
    });
  }, []);

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

  const handleCheckInStreak = (archerId) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setAppData(prev => {
      const currentStreakObj = prev.streaks[archerId] || { count: 0, lastChecked: null, history: [] };
      if (currentStreakObj.lastChecked === todayStr) return prev; // already checked today

      const newCount = currentStreakObj.count + 1;
      const newHistory = [todayStr, ...(currentStreakObj.history || [])];

      const newStreakObj = {
        count: newCount,
        lastChecked: todayStr,
        history: newHistory
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
      scoreLogs: [scoreLog, ...prev.scoreLogs]
    }));
    syncSaveScoreLog(scoreLog);
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

  const handleGrantBadge = (badgeObj) => {
    setAppData(prev => ({
      ...prev,
      badges: [badgeObj, ...prev.badges]
    }));
    syncSaveBadge(badgeObj);
  };

  const userStreak = appData.streaks[appData.currentUser.id] || { count: 0, lastChecked: null };

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
        coach={appData.coach}
        onSwitchUser={handleSwitchUser}
        onAddArcher={handleAddArcher}
        onUpdateArcher={handleUpdateArcher}
      />

      {/* Main App Container */}
      <main style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '24px 20px', flex: 1 }}>
        
        {/* Render Tab Contents */}
        {activeTab === 'home' && (
          <div>
            <HeroCoach
              coach={appData.coach}
              venueSchedule={appData.venueSchedule}
              currentUser={appData.currentUser}
              onCheckInStreak={handleCheckInStreak}
              userStreak={userStreak}
              onUpdateCoach={handleUpdateCoach}
            />

            {/* Quick Overview Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              
              {/* Announcements Card */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Megaphone size={18} /> Coach Announcements
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Latest Updates</span>
                </div>

                {appData.announcements.length === 0 ? (
                  <div style={{ padding: '20px 0', textAlign: 'center', color: '#64748b', fontSize: '0.88rem' }}>
                    No announcements published yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {appData.announcements.slice(0, 3).map((an) => (
                      <div key={an.id} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '10px', borderLeft: '3px solid #d97706' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>{an.title}</span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{an.date}</span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0 }}>{an.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Leaderboard Summary Card */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trophy size={18} /> Streak Leaderboard
                  </h3>
                  <button onClick={() => setActiveTab('leaderboard')} className="btn-ghost" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                    View All →
                  </button>
                </div>

                {appData.archers.length === 0 ? (
                  <div style={{ padding: '20px 0', textAlign: 'center', color: '#64748b', fontSize: '0.88rem' }}>
                    No registered archers on leaderboard yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {appData.archers.slice(0, 3).map((archer, idx) => {
                      const st = appData.streaks[archer.id] || { count: 0 };
                      return (
                        <div key={archer.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.4)', padding: '8px 12px', borderRadius: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontWeight: 800, color: idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : '#b45309', fontSize: '0.9rem' }}>
                              #{idx + 1}
                            </span>
                            <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#f8fafc' }}>{archer.name}</span>
                          </div>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399' }}>
                            {st.count} Days 🔥
                          </span>
                        </div>
                      );
                    })}
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
            onSaveScorecard={handleSaveScorecard}
          />
        )}

        {activeTab === 'archers' && (
          <ArcherDirectory
            archers={appData.archers}
            currentUser={appData.currentUser}
            coach={appData.coach}
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

        {activeTab === 'coach' && appData.currentUser.role === 'coach' && (
          <CoachPortal
            coach={appData.coach}
            archers={appData.archers}
            announcements={appData.announcements}
            badges={appData.badges}
            onAddAnnouncement={handleAddAnnouncement}
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
