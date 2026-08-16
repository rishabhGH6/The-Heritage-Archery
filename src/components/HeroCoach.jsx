import React, { useState } from 'react';
import { Shield, Award, Edit3, Flame, MapPin, Calendar, ArrowRight, Quote, CheckCircle2, Upload, Trash2, Trophy, BarChart2, CheckSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HeroCoach({ coach, venueSchedule, currentUser, archers = [], streaks = {}, onCheckInStreak, userStreak, onUpdateCoach, onBroadcastStreakReminder }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [tagline, setTagline] = useState(coach.tagline);
  const [motivatingLines, setMotivatingLines] = useState(coach.motivatingLines);
  const [photoUrl, setPhotoUrl] = useState(coach.photo || '');

  const handleSaveCoachInfo = (e) => {
    e.preventDefault();
    onUpdateCoach({
      ...coach,
      tagline,
      motivatingLines,
      photo: photoUrl
    });
    setShowEditModal(false);
  };

  const handleCoachFilePicker = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerStreakCheckIn = () => {
    if (currentUser.role === 'guest') {
      alert("🔒 Guest Mode: Please log in or register an archer account to track daily practice streaks!");
      return;
    }
    onCheckInStreak(currentUser.id);
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#059669', '#d97706', '#fbbf24']
      });
    } catch (err) {}
  };

  // Compute effective daily streak (resets down to 0 if last checked was before yesterday)
  const getEffectiveStreak = (stObj) => {
    if (!stObj) return { count: 0, isCheckedToday: false };

    const historySet = new Set(stObj.history || []);
    if (stObj.lastChecked) historySet.add(stObj.lastChecked);

    if (historySet.size === 0) return { count: 0, isCheckedToday: false };

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const isCheckedToday = historySet.has(todayStr);
    const isCheckedYesterday = historySet.has(yesterdayStr);

    if (!isCheckedToday && !isCheckedYesterday) {
      return { count: 0, isCheckedToday: false };
    }

    // Count unbroken consecutive practice days backwards starting from today (or yesterday)
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

  const currentEffective = getEffectiveStreak(userStreak);

  const getPracticedHistorySet = (stObj) => {
    const historySet = new Set(stObj?.history || []);
    if (stObj?.lastChecked) {
      historySet.add(stObj.lastChecked);
    }

    const eff = getEffectiveStreak(stObj);
    if (eff.count > 0 && stObj?.lastChecked) {
      const startDate = new Date(stObj.lastChecked);
      for (let i = 0; i < eff.count; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() - i);
        historySet.add(d.toISOString().split('T')[0]);
      }
    }
    return historySet;
  };

  const userPracticedSet = getPracticedHistorySet(userStreak);

  // Compute Live Leaderboard (Ranked by active streak)
  const rankedLeaderboard = archers
    .map(a => {
      const stObj = streaks[a.id] || { count: 0, lastChecked: null };
      const eff = getEffectiveStreak(stObj);
      const practicedSet = getPracticedHistorySet(stObj);
      return {
        ...a,
        streakCount: eff.count,
        lastChecked: stObj.lastChecked,
        totalPracticedDays: practicedSet.size
      };
    })
    .sort((a, b) => b.streakCount - a.streakCount || b.totalPracticedDays - a.totalPracticedDays);

  // Generate 28-Day Calendar Grid (7 columns x 4 rows)
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const isPracticed = userPracticedSet.has(dateStr);
      days.push({
        dateStr,
        dayNum: d.getDate(),
        isPracticed
      });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();
  const totalPracticedCount = userPracticedSet.size;

  return (
    <section style={{ marginBottom: '32px' }}>
      
      {/* 1. Main Glass Hero Coach Card */}
      <div className="glass-card" style={{ padding: '28px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(217, 119, 6, 0.25)', marginBottom: '24px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', alignItems: 'center' }} className="hero-responsive-grid">
          
          {/* Coach Photo Frame */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '130px',
              height: '130px',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '3px solid #d97706',
              boxShadow: '0 10px 30px rgba(217, 119, 6, 0.3)',
              position: 'relative',
              background: 'rgba(15, 23, 42, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {coach.photo ? (
                <img 
                  src={coach.photo} 
                  alt={coach.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <Shield size={48} color="#fbbf24" />
                  <span style={{ fontSize: '0.65rem', color: '#fbbf24', fontWeight: 700 }}>COACH</span>
                </div>
              )}
            </div>

            <div style={{
              marginTop: '-12px',
              background: '#d97706',
              color: '#090d16',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '3px 12px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              zIndex: 2,
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
            }}>
              Head Archery Coach
            </div>
          </div>

          {/* Coach Quotes & Hero Content */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <span className="badge-gold">
                <Award size={13} /> {coach.role}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                The Heritage College Archery Team
              </span>
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0 6px 0', lineHeight: 1.2 }}>
              {coach.name}
            </h2>

            <p style={{ fontSize: '1rem', color: '#fbbf24', fontStyle: 'italic', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <Quote size={16} /> "{coach.tagline}"
            </p>

            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderLeft: '4px solid #d97706',
              padding: '12px 16px',
              borderRadius: '0 12px 12px 0',
              fontSize: '0.9rem',
              color: '#cbd5e1',
              lineHeight: 1.5,
              marginBottom: '16px'
            }}>
              {coach.motivatingLines}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {currentUser.role === 'coach' && (
                <>
                  <button 
                    onClick={() => {
                      setTagline(coach.tagline);
                      setMotivatingLines(coach.motivatingLines);
                      setPhotoUrl(coach.photo || '');
                      setShowEditModal(true);
                    }}
                    className="btn-gold"
                    style={{ width: '100%', maxWidth: '220px', justifyContent: 'center' }}
                  >
                    <Edit3 size={16} /> Edit Profile & Photo
                  </button>

                  <button
                    onClick={() => {
                      if (onBroadcastStreakReminder) {
                        onBroadcastStreakReminder("Archers, practice time! Check in your daily streak or log your scorecard to keep our team streak alive! 🔥");
                        alert("📢 Streak Reminder Broadcasted to all team members!");
                      }
                    }}
                    className="btn-gold"
                    style={{
                      background: 'linear-gradient(135deg, #d97706, #b45309)',
                      border: '1px solid rgba(251, 191, 36, 0.5)',
                      padding: '10px 18px',
                      borderRadius: '12px',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    📢 Send Team Streak Reminder
                  </button>
                </>
              )}

              {/* Daily Streak Check-in Button */}
              <button 
                onClick={triggerStreakCheckIn}
                className={currentEffective.isCheckedToday ? "btn-ghost" : "btn-emerald"}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  width: '100%',
                  maxWidth: '300px'
                }}
              >
                <Flame size={18} color="#f59e0b" fill={currentEffective.count > 0 ? "#f59e0b" : "none"} />
                {currentEffective.isCheckedToday ? (
                  <span>Practiced Today! ({currentEffective.count} 🔥 Streak)</span>
                ) : (
                  <span>Mark Practiced Today (+1 Streak)</span>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* 2. Side-by-Side 2-Column Layout for PC: Daily Practice Tracker (Left 50%) + Live Streak Leaderboard (Right 50%) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }} className="hero-responsive-grid">
        
        {/* LEFT COLUMN: Daily Practice Tracker Calendar Box */}
        <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(5, 150, 105, 0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Flame size={20} color="#f59e0b" /> Daily Practice Tracker
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Practice daily to build streak! Missing 1 day resets streak to 0.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ background: 'rgba(5, 150, 105, 0.15)', border: '1px solid rgba(5,150,105,0.4)', padding: '5px 10px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Practiced</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#34d399' }}>{totalPracticedCount} Days</div>
                </div>

                <div style={{ background: 'rgba(217, 119, 6, 0.15)', border: '1px solid rgba(217,119,6,0.4)', padding: '5px 10px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Current Streak</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fbbf24' }}>{currentEffective.count} 🔥</div>
                </div>
              </div>
            </div>

            {/* 7-Column Calendar Grid View */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '8px', textAlign: 'center', fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                {calendarDays.map((d, idx) => (
                  <div
                    key={idx}
                    title={`${d.dateStr}: ${d.isPracticed ? 'Practiced 🎯' : 'Rest Day'}`}
                    style={{
                      height: '36px',
                      borderRadius: '8px',
                      background: d.isPracticed ? 'linear-gradient(135deg, #059669, #10b981)' : 'rgba(15, 23, 42, 0.7)',
                      border: d.isPracticed ? '1px solid #34d399' : '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: d.isPracticed ? '#ffffff' : '#64748b',
                      boxShadow: d.isPracticed ? '0 2px 8px rgba(5, 150, 105, 0.4)' : 'none'
                    }}
                  >
                    {d.dayNum}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', fontSize: '0.72rem', color: '#94a3b8' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#10b981', display: 'inline-block' }} /> Practiced Day
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.2)', display: 'inline-block' }} /> Rest / Missed
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Team Daily Streak Leaderboard */}
        <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(217, 119, 6, 0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Trophy size={20} color="#fbbf24" /> Live Team Daily Streak Leaderboard 🏆
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Real-time rankings of archers maintaining daily practice streaks.
                </p>
              </div>
            </div>

            {rankedLeaderboard.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                No registered archers on leaderboard yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {rankedLeaderboard.slice(0, 5).map((archer, idx) => (
                  <div 
                    key={archer.id} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: idx === 0 ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid var(--border-glass)',
                      padding: '10px 14px',
                      borderRadius: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        color: idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : '#64748b',
                        minWidth: '20px'
                      }}>
                        #{idx + 1}
                      </div>

                      <img
                        src={archer.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                        alt={archer.name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #059669' }}
                      />

                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.2 }}>
                          {archer.name}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 600 }}>
                          {archer.category} Archer • {archer.totalPracticedDays} Days Practiced
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(217, 119, 6, 0.15)', padding: '4px 10px', borderRadius: '9999px', border: '1px solid rgba(217, 119, 6, 0.3)' }}>
                      <Flame size={14} color="#f59e0b" fill="#f59e0b" />
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fbbf24' }}>
                        {archer.streakCount} 🔥
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Edit Coach Info Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={20} color="#fbbf24" /> Edit Coach Jayanta's Profile & Photo
              </h3>
              <button onClick={() => setShowEditModal(false)} className="btn-ghost" style={{ padding: '4px 8px' }}>✕</button>
            </div>

            <form onSubmit={handleSaveCoachInfo} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Photo Upload Section */}
              <div style={{ background: 'rgba(15,23,42,0.5)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(251,191,36,0.3)' }}>
                <label style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                  Coach Profile Photo
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '14px', overflow: 'hidden', border: '2px solid #d97706', background: 'rgba(15,23,42,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {photoUrl ? (
                      <img src={photoUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Shield size={28} color="#fbbf24" />
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <input
                      type="file"
                      accept="image/*"
                      id="coach-photo-picker"
                      style={{ display: 'none' }}
                      onChange={handleCoachFilePicker}
                    />
                    <label htmlFor="coach-photo-picker" className="btn-gold" style={{ cursor: 'pointer', fontSize: '0.78rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Upload size={14} /> Choose from Device
                    </label>

                    {photoUrl && (
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Trash2 size={12} /> Remove Current Photo
                      </button>
                    )}
                  </div>
                </div>

                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Or Paste Photo URL</label>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="https://..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Team Tagline
                </label>
                <input
                  type="text"
                  className="input-glass"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Motivating Quote / Message for Archers
                </label>
                <textarea
                  className="input-glass"
                  rows={4}
                  value={motivatingLines}
                  onChange={(e) => setMotivatingLines(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="btn-gold">
                  Save Coach Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
