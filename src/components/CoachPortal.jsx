import React, { useState } from 'react';
import { Shield, Megaphone, Award, Key, Plus, Trash2, CheckCircle2, UserCheck } from 'lucide-react';

export default function CoachPortal({ coach, archers, announcements, badges, onAddAnnouncement, onGrantBadge, onUpdateCoachPassword }) {
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

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
      title: annTitle.trim(),
      content: annContent.trim(),
      date: new Date().toISOString().split('T')[0],
      author: coach.name
    });

    setAnnTitle('');
    setAnnContent('');
    alert("Announcement published to the team homepage!");
  };

  const handleGrantBadge = (e) => {
    e.preventDefault();
    onGrantBadge({
      id: "b_" + Date.now(),
      archerId: selectedArcherId,
      title: badgeTitle,
      description: badgeDesc,
      date: new Date().toISOString().split('T')[0]
    });
    alert("Badge awarded to archer!");
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
    <div style={{ marginBottom: '32px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-gold">
              <Shield size={13} /> Head Coach Management Hub
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
            Coach Jayanta Chakraborty's Control Panel 🛡️
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Broadcast team announcements, grant endorsement badges to archers, and update coach password.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="coach-responsive-grid">
        
        {/* Left Column: Broadcast Announcements */}
        <div className="glass-card glass-card-gold" style={{ padding: '24px', border: '1px solid rgba(217, 119, 6, 0.4)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fbbf24', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Megaphone size={20} /> Broadcast Team Announcement
          </h3>

          <form onSubmit={handlePostAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Announcement Headline</label>
              <input
                type="text"
                className="input-glass"
                placeholder="e.g. 📢 State Selection Trial Date Confirmed"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Announcement Details</label>
              <textarea
                className="input-glass"
                rows={4}
                placeholder="Write message details for the archers..."
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-gold" style={{ alignSelf: 'flex-start' }}>
              Publish Announcement
            </button>
          </form>

          {/* Existing Announcements List */}
          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 700, marginBottom: '10px' }}>Active Team Announcements ({announcements.length})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {announcements.map(ann => (
                <div key={ann.id} style={{ background: 'rgba(15,23,42,0.7)', padding: '12px', borderRadius: '10px', borderLeft: '3px solid #fbbf24' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>{ann.title}</div>
                  <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px' }}>{ann.content}</p>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>Posted on {ann.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Grant Badges & Change Password */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Grant Badges Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} /> Award Coach Endorsement Badge
            </h3>

            <form onSubmit={handleGrantBadge} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Select Archer</label>
                <select className="select-glass" value={selectedArcherId} onChange={(e) => setSelectedArcherId(e.target.value)}>
                  {archers.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Badge Title</label>
                <select className="select-glass" value={badgeTitle} onChange={(e) => setBadgeTitle(e.target.value)}>
                  <option value="Gold Bullseye Master 🎯">Gold Bullseye Master 🎯</option>
                  <option value="Form Perfectionist 🏹">Form Perfectionist 🏹</option>
                  <option value="10-Ring Consistency 🥇">10-Ring Consistency 🥇</option>
                  <option value="14-Day Streak Warrior 🔥">14-Day Streak Warrior 🔥</option>
                  <option value="State Trial Qualifier 🏆">State Trial Qualifier 🏆</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Badge Endorsement Note</label>
                <input
                  type="text"
                  className="input-glass"
                  value={badgeDesc}
                  onChange={(e) => setBadgeDesc(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-emerald" style={{ alignSelf: 'flex-start' }}>
                Grant Badge
              </button>
            </form>
          </div>

          {/* Coach Password Settings */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={18} color="#fbbf24" /> Update Coach Password
            </h3>

            <form onSubmit={handlePasswordChange} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="password"
                className="input-glass"
                placeholder="Enter new password for Coach Jayanta..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn-ghost" style={{ border: '1px solid #fbbf24', color: '#fbbf24' }}>
                Update
              </button>
            </form>

            {passSuccess && (
              <div style={{ color: '#34d399', fontSize: '0.82rem', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> Password updated successfully!
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
