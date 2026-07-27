import React, { useState } from 'react';
import { Shield, Award, Edit3, Flame, MapPin, Calendar, ArrowRight, Quote, CheckCircle2, Upload, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HeroCoach({ coach, venueSchedule, currentUser, onCheckInStreak, userStreak, onUpdateCoach }) {
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
                  <Shield size={52} color="#fbbf24" />
                  <span style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 700 }}>COACH</span>
                </div>
              )}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <span className="badge-gold">
                <Award size={13} /> {coach.role}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                The Heritage College Archery Team
              </span>
            </div>

            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0 8px 0', lineHeight: 1.2 }}>
              {coach.name}
            </h2>

            <p style={{ fontSize: '1.05rem', color: '#fbbf24', fontStyle: 'italic', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Quote size={16} /> "{coach.tagline}"
            </p>

            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderLeft: '4px solid #d97706',
              padding: '12px 16px',
              borderRadius: '0 12px 12px 0',
              fontSize: '0.92rem',
              color: '#cbd5e1',
              lineHeight: 1.5,
              marginBottom: '16px'
            }}>
              {coach.motivatingLines}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              {currentUser.role === 'coach' && (
                <button 
                  onClick={() => {
                    setTagline(coach.tagline);
                    setMotivatingLines(coach.motivatingLines);
                    setPhotoUrl(coach.photo || '');
                    setShowEditModal(true);
                  }}
                  className="btn-gold"
                >
                  <Edit3 size={16} /> Edit Profile & Photo
                </button>
              )}

              {/* Streak Check-in Button */}
              <button 
                onClick={triggerStreakCheckIn}
                className={userStreak.lastChecked === new Date().toISOString().split('T')[0] ? "btn-ghost" : "btn-emerald"}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Flame size={18} color="#f59e0b" fill={userStreak.count > 0 ? "#f59e0b" : "none"} />
                {userStreak.lastChecked === new Date().toISOString().split('T')[0] ? (
                  <span>Practiced Today! ({userStreak.count} 🔥)</span>
                ) : (
                  <span>Mark Practiced Today (+1 Streak)</span>
                )}
              </button>
            </div>

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
