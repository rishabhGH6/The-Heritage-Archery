import React, { useState } from 'react';
import { Shield, Megaphone, Award, Key, Plus, Trash2, CheckCircle2, UserCheck, Bell, Sparkles, Users, Send } from 'lucide-react';

export default function CoachPortal({ coach, archers = [], pendingArchers = [], announcements = [], badges = [], onAddAnnouncement, onDeleteAnnouncement, onGrantBadge, onUpdateCoachPassword, onApproveArcher, onRejectArcher }) {
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState('General Notice 📢');

  // Badge granting form state
  const [selectedArcherId, setSelectedArcherId] = useState(archers[0]?.id || '');
  const [badgeTitle, setBadgeTitle] = useState('Gold Bullseye Master 🎯');
  const [badgeDesc, setBadgeDesc] = useState('Shot 3 consecutive X-ring arrows at 70m practice session.');

  // Password update state
  const [newPassword, setNewPassword] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    onAddAnnouncement({
      id: "ann_" + Date.now(),
      title: `${annCategory} ${annTitle.trim()}`,
      content: annContent.trim(),
      date: new Date().toISOString().split('T')[0],
      author: coach.name
    });

    setAnnTitle('');
    setAnnContent('');
    alert("Announcement published to the team portal!");
  };

  const handleGrantBadge = (e) => {
    e.preventDefault();
    const targetArcher = archers.find(a => a.id === selectedArcherId);
    onGrantBadge({
      id: "b_" + Date.now(),
      archerId: selectedArcherId,
      title: badgeTitle,
      description: badgeDesc,
      date: new Date().toISOString().split('T')[0]
    });
    alert(`Badge "${badgeTitle}" awarded to ${targetArcher?.name || 'Archer'}!`);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    onUpdateCoachPassword(newPassword.trim());
    setNewPassword('');
    setPassSuccess(true);
    setTimeout(() => setPassSuccess(false), 3000);
  };

  return (
    <div style={{ marginBottom: '36px' }}>
      
      {/* Head Coach Command Center Banner */}
      <div className="glass-card glass-card-gold" style={{ padding: '28px', marginBottom: '24px', border: '1px solid rgba(217, 119, 6, 0.4)', background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(217,119,6,0.15))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge-gold">
                <Shield size={13} /> Head Coach Management Hub
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              Coach Jayanta Chakraborty's Command Center 🛡️
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: 0 }}>
              Broadcast team bulletins, grant official coach endorsement badges, and manage security settings.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(217, 119, 6, 0.3)', padding: '8px 16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Team Archers</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fbbf24' }}>{archers.length} Registered</div>
            </div>

            <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(5, 150, 105, 0.3)', padding: '8px 16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Announcements</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399' }}>{announcements.length} Published</div>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Column Stacked System for Coach Portal Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Section 1: Broadcast Team Announcement */}
        <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(217, 119, 6, 0.35)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Megaphone size={20} color="#fbbf24" /> Broadcast Team Announcement
          </h3>

          <form onSubmit={handlePostAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Category Badge</label>
              <select className="select-glass" value={annCategory} onChange={(e) => setAnnCategory(e.target.value)}>
                <option value="📢 Notice:">📢 General Notice</option>
                <option value="🏆 Trial Update:">🏆 Tournament & Trial Update</option>
                <option value="🚨 Important:">🚨 High Priority Alert</option>
                <option value="🎯 Range Schedule:">🎯 Range & Practice Schedule</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Headline Title</label>
              <input
                type="text"
                className="input-glass"
                placeholder="e.g. State Selection Trial Date Confirmed"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Announcement Details</label>
              <textarea
                className="input-glass"
                rows={4}
                placeholder="Write message details for the archers..."
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-gold" style={{ justifyContent: 'center', gap: '8px', padding: '12px', alignSelf: 'flex-start' }}>
              <Send size={16} /> Publish Announcement to Team
            </button>
          </form>
        </div>

        {/* Section 2: Active Published Bulletins */}
        <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h4 style={{ fontSize: '1.1rem', color: '#fbbf24', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} /> Published Team Bulletins ({announcements.length})
          </h4>

          {announcements.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: '0.88rem', textAlign: 'center', padding: '20px' }}>
              No active announcements published yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {announcements.map(ann => (
                <div key={ann.id} style={{ background: 'rgba(15,23,42,0.7)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #fbbf24', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc' }}>{ann.title}</div>
                    <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: '6px 0', lineHeight: 1.5 }}>{ann.content}</p>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Posted on {ann.date} by {ann.author || 'Coach'}</span>
                  </div>

                  {onDeleteAnnouncement && (
                    <button
                      type="button"
                      onClick={() => onDeleteAnnouncement(ann.id)}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', padding: '6px 10px', height: 'fit-content' }}
                      title="Remove Announcement"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Award Coach Endorsement Badge */}
        <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(5, 150, 105, 0.35)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="#34d399" /> Award Coach Endorsement Badge
          </h3>

          <form onSubmit={handleGrantBadge} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Select Recipient Archer</label>
              {archers.length === 0 ? (
                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>No registered archers available.</div>
              ) : (
                <select className="select-glass" value={selectedArcherId} onChange={(e) => setSelectedArcherId(e.target.value)}>
                  {archers.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.category} Archer)</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Select Badge Title</label>
              <select className="select-glass" value={badgeTitle} onChange={(e) => setBadgeTitle(e.target.value)}>
                <option value="Gold Bullseye Master 🎯">Gold Bullseye Master 🎯</option>
                <option value="Form Perfectionist 🏹">Form Perfectionist 🏹</option>
                <option value="10-Ring Consistency 🥇">10-Ring Consistency 🥇</option>
                <option value="14-Day Streak Warrior 🔥">14-Day Streak Warrior 🔥</option>
                <option value="State Trial Qualifier 🏆">State Trial Qualifier 🏆</option>
                <option value="Most Dedicated Archer ⭐">Most Dedicated Archer ⭐</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Badge Endorsement Note</label>
              <input
                type="text"
                className="input-glass"
                value={badgeDesc}
                onChange={(e) => setBadgeDesc(e.target.value)}
                placeholder="e.g. Shot 3 consecutive X-ring arrows at 70m practice session."
                required
              />
            </div>

            <button type="submit" className="btn-emerald" style={{ justifyContent: 'center', gap: '8px', padding: '12px', alignSelf: 'flex-start' }}>
              <Award size={16} /> Grant Endorsement Badge
            </button>
          </form>
        </div>

        {/* Section 4: Update Head Coach Password */}
        <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(217, 119, 6, 0.3)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fbbf24', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} color="#fbbf24" /> Update Head Coach Password
          </h3>

          <form onSubmit={handlePasswordChange} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="password"
              className="input-glass"
              placeholder="Enter new password for Coach Jayanta..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ flex: 1, minWidth: '240px' }}
              required
            />
            <button type="submit" className="btn-gold" style={{ padding: '0 24px', flexShrink: 0, justifyContent: 'center' }}>
              Update Password
            </button>
          </form>

          {passSuccess && (
            <div style={{ color: '#34d399', fontSize: '0.85rem', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <CheckCircle2 size={16} /> Password updated successfully!
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
