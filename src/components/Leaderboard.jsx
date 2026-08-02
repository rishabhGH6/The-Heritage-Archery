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

  const getPracticedHistorySet = (stObj) => {
    const historySet = new Set(stObj?.history || []);
    if (stObj?.lastChecked) {
      historySet.add(stObj.lastChecked);
    }

    const effectiveStreak = getEffectiveStreak(stObj);
    if (effectiveStreak > 0 && stObj?.lastChecked) {
      const startDate = new Date(stObj.lastChecked);
      for (let i = 0; i < effectiveStreak; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() - i);
        historySet.add(d.toISOString().split('T')[0]);
      }
    }
    return historySet;
  };

  const leaderboardData = archers.map(archer => {
    const s = streaks[archer.id] || { count: 0, lastChecked: null, history: [] };
    const effectiveStreak = getEffectiveStreak(s);
    const historySet = getPracticedHistorySet(s);
    const hasCheckedToday = s.lastChecked === todayStr;
    return {
      ...archer,
      streakCount: effectiveStreak,
      totalPracticedDays: historySet.size,
      lastChecked: s.lastChecked,
      hasCheckedToday
    };
  }).sort((a, b) => b.streakCount - a.streakCount || b.totalPracticedDays - a.totalPracticedDays);

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
            Practice Days & Active Streak Leaderboard 🎯
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Tracks two key metrics: <strong>Active Consecutive Streak</strong> and <strong>Total Days Practiced (Calendar)</strong>.
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
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

              {/* 2 Metric Stats Boxes: Active Streak & Total Days Practiced */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div style={{ background: 'rgba(217, 119, 6, 0.15)', border: '1px solid rgba(217, 119, 6, 0.3)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase' }}>Active Streak</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Flame size={16} color="#f59e0b" fill="#f59e0b" /> {archer.streakCount} 🔥
                  </div>
                </div>

                <div style={{ background: 'rgba(5, 150, 105, 0.15)', border: '1px solid rgba(5, 150, 105, 0.3)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase' }}>Total Practiced</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Calendar size={15} color="#34d399" /> {archer.totalPracticedDays} Days
                  </div>
                </div>
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
