import React, { useState, useEffect } from 'react';
import { Flame, Bell, CheckCircle2, X, Zap, Megaphone, Smartphone, BellRing } from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  getNotificationPermissionState, 
  requestMobileNotificationPermission, 
  sendMobileStreakNotification, 
  scheduleDailyStreakCheck 
} from '../lib/pushNotifications';

export default function StreakNotificationBanner({ currentUser, userStreak, onCheckInStreak, broadcastNotice, onCloseBroadcast }) {
  const [dismissed, setDismissed] = useState(false);
  const [permissionState, setPermissionState] = useState(getNotificationPermissionState());

  // Compute effective daily streak & today's check-in status
  const getStreakStatus = (stObj) => {
    if (!stObj) return { count: 0, isCheckedToday: false };

    const historySet = new Set(stObj.history || []);
    if (stObj.lastChecked) historySet.add(stObj.lastChecked);

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const isCheckedToday = historySet.has(todayStr);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const isCheckedYesterday = historySet.has(yesterdayStr);

    if (!isCheckedToday && !isCheckedYesterday && historySet.size > 0) {
      return { count: 0, isCheckedToday: false };
    }

    let consecutive = 0;
    let curr = new Date(isCheckedToday ? today : yesterday);

    while (true) {
      const dStr = curr.toISOString().split('T')[0];
      if (historySet.has(dStr)) {
        consecutive++;
        curr.setDate(curr.getDate() - 1);
      } else {
        break;
      }
    }

    const finalCount = Math.max(consecutive, stObj.count || 0);
    return { count: finalCount, isCheckedToday };
  };

  const streakStatus = getStreakStatus(userStreak);

  useEffect(() => {
    if (currentUser && currentUser.role !== 'guest') {
      scheduleDailyStreakCheck(streakStatus, currentUser.name);
    }
  }, [currentUser, streakStatus]);

  if (!currentUser || currentUser.role === 'guest') return null;

  const handleEnablePhoneNotifications = async () => {
    const granted = await requestMobileNotificationPermission();
    if (granted) {
      setPermissionState('granted');
    }
  };

  const handleSendTestNotification = () => {
    sendMobileStreakNotification(
      "🔥 Heritage Archery Streak Alert!",
      `Hey ${currentUser.name}! This is how your daily streak reminder appears on your phone lock screen (just like WhatsApp or IG)! 🏹`,
      true
    );
  };

  const handleQuickCheckIn = () => {
    if (onCheckInStreak) {
      onCheckInStreak(currentUser.id);
      try {
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.2 },
          colors: ['#f59e0b', '#059669', '#3b82f6', '#fbbf24']
        });
      } catch (err) {}
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
      
      {/* 1. Mobile Phone Push Notification Enable Banner (If Permission not yet granted) */}
      {permissionState !== 'granted' && (
        <div 
          className="fade-in-up"
          style={{
            background: 'linear-gradient(90deg, rgba(5, 150, 105, 0.25), rgba(15, 23, 42, 0.85))',
            border: '1px solid rgba(52, 211, 153, 0.4)',
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(5, 150, 105, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399',
              flexShrink: 0
            }}>
              <Smartphone size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                📱 Get Streak Notifications on Your Phone!
              </div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Receive phone lock-screen push alerts for daily streak reminders just like WhatsApp & Instagram!
              </span>
            </div>
          </div>

          <button
            onClick={handleEnablePhoneNotifications}
            className="btn-emerald"
            style={{
              padding: '7px 16px',
              fontSize: '0.82rem',
              borderRadius: '9999px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            <BellRing size={15} /> Enable Phone Push Alerts
          </button>
        </div>
      )}

      {/* 2. Broadcast Announcement Notification from Coach */}
      {broadcastNotice && (
        <div 
          className="fade-in-up"
          style={{
            background: 'linear-gradient(90deg, rgba(217, 119, 6, 0.95), rgba(180, 83, 9, 0.95))',
            border: '1px solid rgba(251, 191, 36, 0.6)',
            borderRadius: '16px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            color: '#ffffff',
            boxShadow: '0 8px 30px rgba(217, 119, 6, 0.4)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Megaphone size={22} color="#fde047" />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📢 Team Streak Announcement from Coach Jayanta!
              </div>
              <p style={{ fontSize: '0.84rem', opacity: 0.95, margin: '2px 0 0 0' }}>
                {broadcastNotice.message || "Archers, practice time! Check in your daily practice streak or log your scorecard to keep our team streak alive! 🔥"}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {!streakStatus.isCheckedToday && (
              <button
                onClick={handleQuickCheckIn}
                style={{
                  background: '#ffffff',
                  color: '#92400e',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
              >
                ⚡ Check In Now
              </button>
            )}
            <button
              onClick={onCloseBroadcast}
              style={{ background: 'transparent', border: 'none', color: '#ffffff', opacity: 0.8, cursor: 'pointer', padding: '4px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 3. Personal Streak Check-In Reminder Banner (Shows if NOT checked in today) */}
      {!streakStatus.isCheckedToday && !dismissed && (
        <div 
          className="fade-in-up"
          style={{
            background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.95), rgba(6, 18, 36, 0.95))',
            border: '1px solid rgba(251, 191, 36, 0.4)',
            borderRadius: '16px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(217, 119, 6, 0.2)',
              border: '1.5px solid rgba(251, 191, 36, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Flame size={24} color="#fbbf24" style={{ filter: 'drop-shadow(0 0 8px #fbbf24)' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔥 Don't Break Your Streak, {currentUser.name}! 
                <span className="badge-gold" style={{ fontSize: '0.72rem' }}>
                  {streakStatus.count > 0 ? `Current: ${streakStatus.count} Days` : 'Start Today!'}
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                You haven't checked in for today's archery practice. Click below to extend your practice streak!
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleQuickCheckIn}
              className="btn-gold"
              style={{
                padding: '8px 20px',
                fontSize: '0.84rem',
                borderRadius: '9999px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 15px rgba(217, 119, 6, 0.4)'
              }}
            >
              <Zap size={15} /> Check In Today (+1 🔥)
            </button>

            {permissionState === 'granted' && (
              <button
                onClick={handleSendTestNotification}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#cbd5e1',
                  padding: '7px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                title="Send a test notification to your phone"
              >
                🔔 Test Phone Push
              </button>
            )}

            <button
              onClick={() => setDismissed(true)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              title="Dismiss for now"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 4. Checked In Today Confirmation Toast */}
      {streakStatus.isCheckedToday && (
        <div 
          style={{
            background: 'rgba(5, 150, 105, 0.12)',
            border: '1px solid rgba(5, 150, 105, 0.35)',
            borderRadius: '12px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            color: '#34d399',
            fontWeight: 700,
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#34d399" />
            <span>Awesome job! You are checked in for today's practice. Streak active: 🔥 <strong>{streakStatus.count} Days</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {permissionState === 'granted' && (
              <button
                onClick={handleSendTestNotification}
                style={{
                  background: 'rgba(52, 211, 153, 0.15)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  color: '#a7f3d0',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🔔 Test Phone Notification
              </button>
            )}
            <span style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>Keep up the momentum! 🎯</span>
          </div>
        </div>
      )}

    </div>
  );
}
