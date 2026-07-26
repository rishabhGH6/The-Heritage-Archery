import React, { useState } from 'react';
import { Shield, Award, Edit3, Flame, MapPin, Calendar, ArrowRight, Quote, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HeroCoach({ coach, venueSchedule, currentUser, onCheckInStreak, userStreak, onUpdateCoach }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [tagline, setTagline] = useState(coach.tagline);
  const [motivatingLines, setMotivatingLines] = useState(coach.motivatingLines);
  const [photoUrl, setPhotoUrl] = useState(coach.photo);

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

  const triggerStreakCheckIn = () => {
    onCheckInStreak(currentUser.id);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#d97706', '#fbbf24']
      });
    } catch (err) {}
  };

  return (
    <section style={{ marginBottom: '32px' }}>
      
      {/* Main Glass Hero Card */}
      <div className="glass-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(217, 119, 6, 0.25)' }}>
        
        {/* Subtle Background Glow */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(217, 119, 6, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '28px', alignItems: 'center' }} className="hero-responsive-grid">
          
          {/* Coach Photo Frame */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '3px solid #d97706',
              boxShadow: '0 10px 30px rgba(217, 119, 6, 0.3)',
              position: 'relative'
            }}>
              <img 
                src={coach.photo} 
                alt={coach.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#d97706',
              color: '#090d16',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '2px 10px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
            }}>
              Head Coach
            </div>
          </div>

          {/* Coach Quotes & Hero Content */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge-gold">
                    <Shield size={13} /> Official Coach Guidance
                  </span>
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', margin: '6px 0 2px 0' }}>
                  {coach.name}
                </h2>
                <p style={{ fontSize: '1rem', color: '#fbbf24', fontWeight: 600, fontStyle: 'italic' }}>
                  "{coach.tagline}"
                </p>
              </div>

              {currentUser.role === 'coach' && (
                <button onClick={() => setShowEditModal(true)} className="btn-ghost" style={{ border: '1px solid rgba(217,119,6,0.5)', color: '#fbbf24' }}>
                  <Edit3 size={16} /> Edit Tagline & Quote
                </button>
              )}
            </div>

            {/* Motivating Line Box */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderLeft: '4px solid #d97706',
              padding: '14px 18px',
              borderRadius: '0 12px 12px 0',
              marginTop: '16px',
              position: 'relative'
            }}>
              <Quote size={20} color="#d97706" style={{ position: 'absolute', top: '10px', right: '12px', opacity: 0.3 }} />
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, fontStyle: 'italic' }}>
                {coach.motivatingLines}
              </p>
            </div>
          </div>

        </div>

        {/* Live Practice Check-in & Schedule Bar */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-glass)',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '20px',
          alignItems: 'center'
        }} className="hero-action-grid">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '0.9rem', fontWeight: 600 }}>
              <MapPin size={18} />
              <span>Practice: <strong style={{ color: '#f8fafc' }}>{venueSchedule.time}</strong> at {venueSchedule.venue}</span>
            </div>
          </div>

          {/* Daily Streak Check-in Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {userStreak?.hasCheckedToday ? (
              <div style={{
                background: 'rgba(5, 150, 105, 0.2)',
                border: '1px solid rgba(5, 150, 105, 0.5)',
                color: '#34d399',
                padding: '10px 18px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={18} color="#34d399" /> Practiced Today! ({userStreak?.count || 0} Day Streak 🔥)
              </div>
            ) : (
              <button onClick={triggerStreakCheckIn} className="btn-gold" style={{ padding: '12px 22px', fontSize: '0.95rem' }}>
                <Flame size={20} color="#090d16" /> Mark Practiced Today (+1 Streak)
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Edit Coach Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={20} color="#fbbf24" /> Edit Coach Jayanta's Profile
              </h3>
              <button onClick={() => setShowEditModal(false)} className="btn-ghost" style={{ padding: '4px 8px' }}>✕</button>
            </div>

            <form onSubmit={handleSaveCoachInfo} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

              <div>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Coach Photo Image URL
                </label>
                <input
                  type="text"
                  className="input-glass"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
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
