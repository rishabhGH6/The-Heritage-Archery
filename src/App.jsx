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

import { loadAppData, saveAppData } from './data/initialData';
import { Target, Megaphone, Trophy, Shield, Heart } from 'lucide-react';

export default function App() {
  const [appData, setAppData] = useState(loadAppData());
  const [activeTab, setActiveTab] = useState('home');

  // Auto-save appData to localStorage whenever it changes
  useEffect(() => {
    saveAppData(appData);
  }, [appData]);

  // Handlers for updating state
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
  };

  const handleUpdateCoachPassword = (newPassword) => {
    setAppData(prev => ({
      ...prev,
      coach: { ...prev.coach, password: newPassword }
    }));
  };

  const handleUpdateArcher = (updatedArcher) => {
    setAppData(prev => ({
      ...prev,
      archers: prev.archers.map(a => a.id === updatedArcher.id ? updatedArcher : a)
    }));
  };

  const handleCheckInStreak = (archerId) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setAppData(prev => {
      const currentStreakObj = prev.streaks[archerId] || { count: 0, lastChecked: null, history: [] };
      if (currentStreakObj.lastChecked === todayStr) return prev; // already checked today

      const newCount = currentStreakObj.count + 1;
      const newHistory = [todayStr, ...(currentStreakObj.history || [])];

      return {
        ...prev,
        streaks: {
          ...prev.streaks,
          [archerId]: {
            count: newCount,
            lastChecked: todayStr,
            history: newHistory
          }
        }
      };
    });
  };

  const handleUpdateVenue = (newSchedule) => {
    setAppData(prev => ({
      ...prev,
      venueSchedule: newSchedule
    }));
  };

  const handleSaveScorecard = (scoreLog) => {
    setAppData(prev => ({
      ...prev,
      scoreLogs: [scoreLog, ...prev.scoreLogs]
    }));
  };

  const handleSaveEquipment = (archerId, eqConfig) => {
    setAppData(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [archerId]: eqConfig
      }
    }));
  };

  const handleSendMessage = (msgObj) => {
    setAppData(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, msgObj]
    }));
  };

  const handleAddPhoto = (archerId, photoUrl) => {
    setAppData(prev => ({
      ...prev,
      archers: prev.archers.map(a => {
        if (a.id === archerId) {
          return {
            ...a,
            photos: [...(a.photos || []), photoUrl]
          };
        }
        return a;
      })
    }));
  };

  const handleAddAnnouncement = (annObj) => {
    setAppData(prev => ({
      ...prev,
      announcements: [annObj, ...prev.announcements]
    }));
  };

  const handleGrantBadge = (badgeObj) => {
    setAppData(prev => ({
      ...prev,
      badges: [badgeObj, ...prev.badges]
    }));
  };

  const userStreak = appData.streaks[appData.currentUser.id] || { count: 0, lastChecked: null };
  const hasCheckedToday = userStreak.lastChecked === new Date().toISOString().split('T')[0];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={appData.currentUser}
        archers={appData.archers}
        coach={appData.coach}
        onSwitchUser={handleSwitchUser}
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
              userStreak={{ ...userStreak, hasCheckedToday }}
              onUpdateCoach={handleUpdateCoach}
            />

            {/* Quick Announcements Banner */}
            <div className="glass-card" style={{ padding: '24px', marginBottom: '32px', borderLeft: '4px solid #fbbf24' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Megaphone size={20} /> Latest Team Announcements
                </h3>
                {appData.currentUser.role === 'coach' && (
                  <button onClick={() => setActiveTab('coach')} className="btn-ghost" style={{ fontSize: '0.8rem' }}>
                    + Post Announcement
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {appData.announcements.slice(0, 2).map(ann => (
                  <div key={ann.id} style={{ background: 'rgba(15,23,42,0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
                      {ann.title}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                      {ann.content}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '0.72rem', color: '#94a3b8' }}>
                      <span>By {ann.author}</span>
                      <span>{ann.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Combined Highlights: Streak Leaderboard & Venue Tracker */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }} className="home-dual-grid">
              <div>
                <Leaderboard
                  archers={appData.archers}
                  streaks={appData.streaks}
                  currentUser={appData.currentUser}
                  onCheckInStreak={handleCheckInStreak}
                />
              </div>

              <div>
                <VenueTracker
                  venueSchedule={appData.venueSchedule}
                  currentUser={appData.currentUser}
                  onUpdateVenue={handleUpdateVenue}
                />
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
            scoreLogs={appData.scoreLogs}
            onSaveScorecard={handleSaveScorecard}
          />
        )}

        {activeTab === 'equipment' && (
          <EquipmentTuner
            currentUser={appData.currentUser}
            archers={appData.archers}
            equipmentData={appData.equipment}
            onSaveEquipment={handleSaveEquipment}
          />
        )}

        {activeTab === 'archers' && (
          <ArcherDirectory
            archers={appData.archers}
            currentUser={appData.currentUser}
            coach={appData.coach}
            onUpdateArcher={handleUpdateArcher}
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
      <footer style={{ borderTop: '1px solid var(--border-glass)', background: 'rgba(9, 13, 22, 0.95)', padding: '24px 20px', textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#f8fafc' }}>
            <Target size={18} color="#059669" />
            <span>THE HERITAGE ARCHERY TEAM</span>
          </div>

          <div>
            Head Coach: <strong style={{ color: '#fbbf24' }}>Jayanta Chakraborty</strong> • Precision & Excellence
          </div>

          <div>
            Designed with <Heart size={13} color="#ef4444" style={{ display: 'inline' }} /> for Heritage College Archers
          </div>
        </div>
      </footer>

    </div>
  );
}
