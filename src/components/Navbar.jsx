import React, { useState } from 'react';
import { Target, Award, Calendar, MessageSquare, Shield, User, MapPin, Camera, Wrench, LogIn, ChevronDown } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentUser, archers, coach, onSwitchUser }) {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(currentUser.role);
  const [selectedArcherId, setSelectedArcherId] = useState(archers[0]?.id || '');
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (selectedRole === 'coach') {
      if (inputPassword === coach.password) {
        onSwitchUser({ role: 'coach', id: 'coach', name: coach.name });
        setShowRoleModal(false);
        setInputPassword('');
      } else {
        setPasswordError('Incorrect password for Coach Jayanta Chakraborty.');
      }
    } else {
      const archer = archers.find(a => a.id === selectedArcherId);
      if (!archer) return;
      if (inputPassword === archer.password || inputPassword === 'archer' || inputPassword === '') {
        onSwitchUser({ role: 'archer', id: archer.id, name: archer.name });
        setShowRoleModal(false);
        setInputPassword('');
      } else {
        setPasswordError('Incorrect password for selected archer.');
      }
    }
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100 }} className="glass-card">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
          <div style={{
            background: 'linear-gradient(135deg, #059669, #d97706)',
            padding: '10px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(5, 150, 105, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Target size={26} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, background: 'linear-gradient(90deg, #f8fafc, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
              THE HERITAGE ARCHERY
            </h1>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              College Team Portal
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto', padding: '4px 0' }}>
          <button className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <Target size={17} /> Home
          </button>
          <button className={`nav-tab ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}>
            <Award size={17} /> Leaderboard
          </button>
          <button className={`nav-tab ${activeTab === 'scoring' ? 'active' : ''}`} onClick={() => setActiveTab('scoring')}>
            <Target size={17} /> Scoring
          </button>
          <button className={`nav-tab ${activeTab === 'equipment' ? 'active' : ''}`} onClick={() => setActiveTab('equipment')}>
            <Wrench size={17} /> Equipment
          </button>
          <button className={`nav-tab ${activeTab === 'archers' ? 'active' : ''}`} onClick={() => setActiveTab('archers')}>
            <User size={17} /> Team Roster
          </button>
          <button className={`nav-tab ${activeTab === 'venue' ? 'active' : ''}`} onClick={() => setActiveTab('venue')}>
            <MapPin size={17} /> Venue
          </button>
          <button className={`nav-tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
            <MessageSquare size={17} /> Chat & DMs
          </button>
          <button className={`nav-tab ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}>
            <Camera size={17} /> Gallery
          </button>
          {currentUser.role === 'coach' && (
            <button className={`nav-tab ${activeTab === 'coach' ? 'active' : ''}`} onClick={() => setActiveTab('coach')}>
              <Shield size={17} /> Coach Dashboard
            </button>
          )}
        </nav>

        {/* Login / Active User Profile Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            onClick={() => setShowRoleModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: currentUser.role === 'coach' ? 'rgba(217, 119, 6, 0.15)' : 'rgba(5, 150, 105, 0.15)',
              border: `1px solid ${currentUser.role === 'coach' ? 'rgba(217, 119, 6, 0.4)' : 'rgba(5, 150, 105, 0.4)'}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: currentUser.role === 'coach' ? '#d97706' : '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              color: '#ffffff'
            }}>
              {currentUser.role === 'coach' ? 'C' : 'A'}
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.1 }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.68rem', color: currentUser.role === 'coach' ? '#fbbf24' : '#34d399', fontWeight: 600 }}>
                {currentUser.role === 'coach' ? 'Coach Jayanta Chakraborty' : 'Archer Account'} (Switch)
              </div>
            </div>
            <ChevronDown size={14} color="#94a3b8" />
          </div>
        </div>

      </div>

      {/* Role Switch / Login Modal */}
      {showRoleModal && (
        <div className="modal-overlay" onClick={() => setShowRoleModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogIn size={20} color="#fbbf24" /> Select Login Portal
              </h3>
              <button onClick={() => setShowRoleModal(false)} className="btn-ghost" style={{ padding: '4px 8px' }}>✕</button>
            </div>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                  Select Account Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => { setSelectedRole('coach'); setPasswordError(''); }}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: selectedRole === 'coach' ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
                      background: selectedRole === 'coach' ? 'rgba(217, 119, 6, 0.2)' : 'rgba(15,23,42,0.6)',
                      color: '#f8fafc',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Shield size={18} color="#fbbf24" /> Coach Jayanta
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSelectedRole('archer'); setPasswordError(''); }}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: selectedRole === 'archer' ? '2px solid #34d399' : '1px solid rgba(255,255,255,0.1)',
                      background: selectedRole === 'archer' ? 'rgba(5, 150, 105, 0.2)' : 'rgba(15,23,42,0.6)',
                      color: '#f8fafc',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <User size={18} color="#34d399" /> Archer Account
                  </button>
                </div>
              </div>

              {selectedRole === 'archer' && (
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Select Archer Name
                  </label>
                  <select 
                    className="select-glass"
                    value={selectedArcherId}
                    onChange={(e) => setSelectedArcherId(e.target.value)}
                  >
                    {archers.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.category})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Enter Password {selectedRole === 'coach' ? '(Default: STAR@Archery)' : '(Default: archer)'}
                </label>
                <input
                  type="password"
                  className="input-glass"
                  placeholder="Enter password..."
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                />
              </div>

              {passwordError && (
                <div style={{ color: '#ef4444', fontSize: '0.82rem', background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)' }}>
                  ⚠️ {passwordError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowRoleModal(false)} className="btn-ghost" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className={selectedRole === 'coach' ? 'btn-gold' : 'btn-emerald'} style={{ flex: 1, justifyContent: 'center' }}>
                  Login to Account
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </header>
  );
}
