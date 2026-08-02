import React from 'react';
import { Award, Flame, CheckCircle2, Calendar, Trophy, Medal, Star } from 'lucide-react';

export default function Leaderboard({ archers, streaks, currentUser, onCheckInStreak }) {
  // Map archers with their streak stats
  const todayStr = new Date().toISOString().split('T')[0];
  
  const getEffectiveStreak = (stObj) => {
    if (!stObj || !stObj.lastChecked) return 0;
    const todayStr = new Date().toISOString().split('T')[0];
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (stObj.lastChecked === todayStr || stObj.lastChecked === yesterdayStr) {
      return stObj.count || 0;
    }
    return 0;
  };

  const leaderboardData = archers.map(archer => {
    const s = streaks[archer.id] || { count: 0, lastChecked: null, history: [] };
    const effectiveStreak = getEffectiveStreak(s);
    const hasCheckedToday = s.lastChecked === todayStr;
    return {
      ...archer,
      streakCount: effectiveStreak,
      lastChecked: s.lastChecked,
      hasCheckedToday,
      historyCount: effectiveStreak > 0 ? (s.history ? s.history.length : effectiveStreak) : 0
    };
  }).sort((a, b) => b.streakCount - a.streakCount);

  return (
    <div style={{ marginBottom: '32px' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-gold">
              <Trophy size={13} /> Official Ranking
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
            Practice Days Streak Leaderboard 🎯
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Consistent range practice builds champions. Check-in daily to climb the team ranking!
          </p>
        </div>

        {currentUser.role === 'archer' && (
          <button 
            onClick={() => onCheckInStreak(currentUser.id)}
            className="btn-emerald"
            style={{ padding: '12px 20px' }}
          >
            <Flame size={18} /> Mark Practiced Today (+1)
          </button>
        )}
      </div>

      {/* Leaderboard Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {leaderboardData.map((archer, index) => {
          let rankBadge = null;
          let rankColor = '#475569';
          if (index === 0) {
            rankBadge = <span style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', padding: '4px 10px', borderRadius: '9999px', fontWeight: 800, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Trophy size={12} /> 1ST RANK</span>;
            rankColor = '#fbbf24';
          } else if (index === 1) {
            rankBadge = <span style={{ background: 'linear-gradient(135deg, #94a3b8, #64748b)', color: '#000', padding: '4px 10px', borderRadius: '9999px', fontWeight: 800, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Medal size={12} /> 2ND RANK</span>;
            rankColor = '#cbd5e1';
          } else if (index === 2) {
            rankBadge = <span style={{ background: 'linear-gradient(135deg, #b45309, #78350f)', color: '#fff', padding: '4px 10px', borderRadius: '9999px', fontWeight: 800, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Medal size={12} /> 3RD RANK</span>;
            rankColor = '#d97706';
          }

          return (
            <div 
              key={archer.id} 
              className={`glass-card ${index === 0 ? 'glass-card-gold' : 'glass-card-hover'}`}
              style={{
                padding: '20px',
                position: 'relative',
                border: index === 0 ? '1px solid rgba(217, 119, 6, 0.5)' : '1px solid var(--border-glass)'
              }}
            >
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={archer.photo} 
                    alt={archer.name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${rankColor}` }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                      {archer.name}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                      {archer.category} Archer
                    </span>
                  </div>
                </div>

                {rankBadge || <span style={{ color: '#64748b', fontWeight: 800, fontSize: '1rem' }}>#{index + 1}</span>}
              </div>

              {/* Streak Counter Box */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '14px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Flame size={24} color={archer.streakCount > 0 ? "#f59e0b" : "#64748b"} className={archer.streakCount > 5 ? "pulse-glow" : ""} />
                  <div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
                      {archer.streakCount} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>Days</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Current Streak</span>
                  </div>
                </div>

                {archer.hasCheckedToday ? (
                  <span style={{ color: '#34d399', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> Checked Today
                  </span>
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                    Pending Today
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#94a3b8' }}>
                <span>Practicing: <strong style={{ color: '#34d399' }}>{archer.currentlyPracticing}</strong></span>
                <span>Last: {archer.lastChecked || 'Not yet'}</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
