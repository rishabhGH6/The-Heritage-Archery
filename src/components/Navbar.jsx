import React, { useState } from 'react';
import { Target, Award, Calendar, MessageSquare, Shield, User, MapPin, Camera, Wrench, LogIn, ChevronDown, UserPlus } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentUser, archers, coach, onSwitchUser, onAddArcher }) {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(currentUser.role); // 'coach', 'archer', 'new_archer'
  const [selectedArcherId, setSelectedArcherId] = useState(archers[0]?.id || '');
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // New archer sign up form state
  const [regName, setRegName] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regCategory, setRegCategory] = useState('Junior');
  const [regOccupation, setRegOccupation] = useState('Student');
  const [regPracticing, setRegPracticing] = useState('Yes');
  const [regDob, setRegDob] = useState('');

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
    } else if (selectedRole === 'new_archer') {
      // Register new archer
      if (!regName.trim() || !regPass.trim()) {
        setPasswordError('Please provide your name and password.');
        return;
      }

      const newArcher = {
        id: "archer_" + Date.now(),
        name: regName.trim(),
        password: regPass.trim(),
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        category: regCategory,
        occupation: regOccupation,
        currentlyPracticing: regPracticing,
        dob: regDob,
        aim: "Focusing on consistent technique and release.",
        summary: "Heritage Archery team member.",
        statesPlayed: [],
        photos: []
      };

      if (onAddArcher) {
        onAddArcher(newArcher);
      }
      onSwitchUser({ role: 'archer', id: newArcher.id, name: newArcher.name });
      setShowRoleModal(false);
      setRegName('');
      setRegPass('');
      setRegDob('');
    } else {
      // Existing archer login
      const archer = archers.find(a => a.id === selectedArcherId);
      if (!archer) {
        setPasswordError('No archer selected. Switch to "New Archer Sign Up" to register!');
        return;
      }
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
          {currentUser.role === 'archer' && (
            <button className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <User size={17} /> My Profile
            </button>
          )}
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
                {currentUser.role === 'coach' ? 'Coach Jayanta Chakraborty' : 'Archer Account'} (Switch / Login)
              </div>
            </div>
            <ChevronDown size={14} color="#94a3b8" />
          </div>
        </div>

      </div>

      {/* Role Switch / Login / Sign Up Modal */}
      {showRoleModal && (
        <div className="modal-overlay" onClick={() => setShowRoleModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogIn size={20} color="#fbbf24" /> Login or Sign Up
              </h3>
              <button onClick={() => setShowRoleModal(false)} className="btn-ghost" style={{ padding: '4px 8px' }}>✕</button>
            </div>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                  Select Account Portal
                </label>

                {/* 3 Account Portal Tabs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => { setSelectedRole('coach'); setPasswordError(''); }}
                    style={{
                      padding: '10px 4px',
                      borderRadius: '10px',
                      border: selectedRole === 'coach' ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
                      background: selectedRole === 'coach' ? 'rgba(217, 119, 6, 0.25)' : 'rgba(15,23,42,0.6)',
                      color: '#f8fafc',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Shield size={16} color="#fbbf24" /> Coach Jayanta
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSelectedRole('archer'); setPasswordError(''); }}
                    style={{
                      padding: '10px 4px',
                      borderRadius: '10px',
                      border: selectedRole === 'archer' ? '2px solid #34d399' : '1px solid rgba(255,255,255,0.1)',
                      background: selectedRole === 'archer' ? 'rgba(5, 150, 105, 0.25)' : 'rgba(15,23,42,0.6)',
                      color: '#f8fafc',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <User size={16} color="#34d399" /> Archer Login
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSelectedRole('new_archer'); setPasswordError(''); }}
                    style={{
                      padding: '10px 4px',
                      borderRadius: '10px',
                      border: selectedRole === 'new_archer' ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                      background: selectedRole === 'new_archer' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15,23,42,0.6)',
                      color: '#f8fafc',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <UserPlus size={16} color="#38bdf8" /> New Archer
                  </button>
                </div>
              </div>

              {/* Mode A: Existing Archer Select */}
              {selectedRole === 'archer' && (
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Select Archer Name
                  </label>
                  {archers.length === 0 ? (
                    <div style={{ fontSize: '0.82rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                      ℹ️ No archers registered yet. Click <strong>"New Archer"</strong> above to register your account!
                    </div>
                  ) : (
                    <select 
                      className="select-glass"
                      value={selectedArcherId}
                      onChange={(e) => setSelectedArcherId(e.target.value)}
                    >
                      {archers.map(a => (
                        <option key={a.id} value={a.id}>{a.name} ({a.category})</option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Mode B: New Archer Sign Up Form */}
              {selectedRole === 'new_archer' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>Your Full Name</label>
                    <input
                      type="text"
                      className="input-glass"
                      placeholder="e.g. Rahul Sharma"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>Set Password</label>
                    <input
                      type="password"
                      className="input-glass"
                      placeholder="Create your login password..."
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Category</label>
                      <select className="select-glass" value={regCategory} onChange={(e) => setRegCategory(e.target.value)}>
                        <option value="Junior">Junior Archer</option>
                        <option value="Senior">Senior Archer</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Occupation</label>
                      <select className="select-glass" value={regOccupation} onChange={(e) => setRegOccupation(e.target.value)}>
                        <option value="Student">Student</option>
                        <option value="Higher Studies">Higher Studies</option>
                        <option value="Working Professional">Working Professional</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Practicing Now?</label>
                      <select className="select-glass" value={regPracticing} onChange={(e) => setRegPracticing(e.target.value)}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>DOB (Private) 🔒</label>
                      <input
                        type="date"
                        className="input-glass"
                        value={regDob}
                        onChange={(e) => setRegDob(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Password Input for Coach & Existing Archer */}
              {selectedRole !== 'new_archer' && (
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
              )}

              {passwordError && (
                <div style={{ color: '#ef4444', fontSize: '0.82rem', background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)' }}>
                  ⚠️ {passwordError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowRoleModal(false)} className="btn-ghost" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className={selectedRole === 'coach' ? 'btn-gold' : selectedRole === 'new_archer' ? 'btn-emerald' : 'btn-emerald'} style={{ flex: 1, justifyContent: 'center' }}>
                  {selectedRole === 'new_archer' ? 'Register & Login' : 'Login to Account'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </header>
  );
}
