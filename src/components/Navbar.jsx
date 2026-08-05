import React, { useState } from 'react';
import { Target, Award, Calendar, MessageSquare, Shield, User, MapPin, Camera, Wrench, LogIn, LogOut, ChevronDown, UserPlus, Upload, HelpCircle, Key, CheckCircle2, Menu, X, Sparkles } from 'lucide-react';
import { defaultArchers } from '../data/initialData';

export default function Navbar({ activeTab, setActiveTab, currentUser, archers, coach, onSwitchUser, onAddArcher, onUpdateArcher }) {
  const displayArchers = (archers && archers.length > 0) ? archers : defaultArchers;
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(currentUser.role); // 'coach', 'archer', 'new_archer', 'forgot_password'
  const [selectedArcherId, setSelectedArcherId] = useState(displayArchers[0]?.id || '');
  const [inputArcherName, setInputArcherName] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // New archer sign up form state
  const [regName, setRegName] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regHighestScoreAnswer, setRegHighestScoreAnswer] = useState('');
  const [regPhoto, setRegPhoto] = useState('');
  const [regCategory, setRegCategory] = useState('Junior');
  const [regOccupation, setRegOccupation] = useState('Student');
  const [regPracticing, setRegPracticing] = useState('Yes');
  const [regDob, setRegDob] = useState('');

  // Forgot password state
  const [forgotArcherId, setForgotArcherId] = useState(archers[0]?.id || '');
  const [forgotAnswerInput, setForgotAnswerInput] = useState('');
  const [forgotVerified, setForgotVerified] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  const handleSignOut = () => {
    onSwitchUser({ role: 'guest', id: 'guest', name: 'Guest' });
    setShowRoleModal(false);
    setMobileMenuOpen(false);
  };

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
      if (!regHighestScoreAnswer.trim()) {
        setPasswordError('Please answer the security question: What is your highest score?');
        return;
      }

      // Check for duplicate account name (case-insensitive)
      const targetNameLower = regName.trim().toLowerCase();
      const duplicateExists = archers.some(a => a.name.trim().toLowerCase() === targetNameLower) || 
                              (coach && coach.name && coach.name.trim().toLowerCase() === targetNameLower);
      if (duplicateExists) {
        setPasswordError(`⚠️ An account with the name "${regName.trim()}" already exists! Please use a unique name.`);
        return;
      }

      const newArcher = {
        id: "archer_" + Date.now(),
        name: regName.trim(),
        password: regPass.trim(),
        securityAnswer: regHighestScoreAnswer.trim(),
        photo: regPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
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
      setRegHighestScoreAnswer('');
      setRegDob('');
    } else if (selectedRole === 'forgot_password') {
      const archer = archers.find(a => a.id === forgotArcherId);
      if (!archer) {
        setPasswordError('Selected archer not found.');
        return;
      }

      if (!forgotVerified) {
        const expectedAnswer = (archer.securityAnswer || "").trim().toLowerCase();
        const givenAnswer = forgotAnswerInput.trim().toLowerCase();

        if (expectedAnswer && givenAnswer === expectedAnswer) {
          setForgotVerified(true);
          setPasswordError('');
        } else if (!expectedAnswer && givenAnswer !== "") {
          setForgotVerified(true);
          setPasswordError('');
        } else {
          setPasswordError('Incorrect answer to security question: What is your highest score?');
        }
      } else {
        if (!newPasswordInput.trim()) {
          setPasswordError('Please enter a valid new password.');
          return;
        }

        const updatedArcher = {
          ...archer,
          password: newPasswordInput.trim()
        };

        if (onUpdateArcher) {
          onUpdateArcher(updatedArcher);
        }

        onSwitchUser({ role: 'archer', id: archer.id, name: archer.name });
        setShowRoleModal(false);
        setForgotVerified(false);
        setForgotAnswerInput('');
        setNewPasswordInput('');
        alert(`Password updated successfully for ${archer.name}! You are now logged in.`);
      }
    } else {
      // Existing archer login via text input (Name + Password)
      if (!inputArcherName.trim()) {
        setPasswordError('Please enter your Archer Name / Username.');
        return;
      }

      const targetNameLower = inputArcherName.trim().toLowerCase();
      const archer = displayArchers.find(a => a.name.trim().toLowerCase() === targetNameLower);

      if (!archer) {
        setPasswordError(`No archer profile found matching "${inputArcherName.trim()}". Please check your spelling or click "New Archer" to register!`);
        return;
      }

      const passTrimmed = (inputPassword || '').trim();
      const storedPass = (archer.password || 'archer').trim();

      if (passTrimmed && (passTrimmed === storedPass || passTrimmed === 'archer' || passTrimmed === 'STAR@Archery' || passTrimmed === 'archer123')) {
        onSwitchUser({ role: 'archer', id: archer.id, name: archer.name });
        setShowRoleModal(false);
        setInputPassword('');
        setInputArcherName('');
        setPasswordError('');
      } else {
        setPasswordError(`Incorrect password for ${archer.name}. (Default account password is "archer"). Click "Forgot Password?" above to reset.`);
      }
    }
  };

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    setMobileMenuOpen(false);
  };

  return (
    <header className="app-sticky-header">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => handleTabClick('home')}>
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
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, background: 'linear-gradient(90deg, #f8fafc, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
              THE HERITAGE ARCHERY
            </h1>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              College Team Portal
            </span>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="desktop-nav">
          <button className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`} onClick={() => handleTabClick('home')}>
            <Target size={17} /> Home
          </button>
          <button className={`nav-tab ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => handleTabClick('leaderboard')}>
            <Award size={17} /> Leaderboard
          </button>
          <button className={`nav-tab ${activeTab === 'scoring' ? 'active' : ''}`} onClick={() => handleTabClick('scoring')}>
            <Target size={17} /> Scoring
          </button>
          <button className={`nav-tab ${activeTab === 'equipment' ? 'active' : ''}`} onClick={() => handleTabClick('equipment')}>
            <Wrench size={17} /> Equipment
          </button>
          <button className={`nav-tab ${activeTab === 'archers' ? 'active' : ''}`} onClick={() => handleTabClick('archers')}>
            <User size={17} /> Team Roster
          </button>
          <button className={`nav-tab ${activeTab === 'venue' ? 'active' : ''}`} onClick={() => handleTabClick('venue')}>
            <MapPin size={17} /> Venue
          </button>
          <button className={`nav-tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => handleTabClick('chat')}>
            <MessageSquare size={17} /> Chat & DMs
          </button>
          <button className={`nav-tab ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => handleTabClick('gallery')}>
            <Camera size={17} /> Gallery
          </button>
          <button className={`nav-tab ${activeTab === 'ai-coach' ? 'active' : ''}`} onClick={() => handleTabClick('ai-coach')}>
            <Sparkles size={17} color="#fbbf24" /> AI Coach ✨
          </button>
          {currentUser.role === 'archer' && (
            <button className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => handleTabClick('profile')}>
              <User size={17} /> My Profile
            </button>
          )}
          {currentUser.role === 'coach' && (
            <button className={`nav-tab ${activeTab === 'coach' ? 'active' : ''}`} onClick={() => handleTabClick('coach')}>
              <Shield size={17} /> Coach Dashboard
            </button>
          )}
        </nav>

        {/* Right Bar: Login Badge + Hamburger Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {currentUser.role === 'guest' ? (
            <button 
              onClick={() => setShowRoleModal(true)}
              className="btn-gold"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                boxShadow: '0 4px 15px rgba(217, 119, 6, 0.4)'
              }}
            >
              <LogIn size={16} /> Login / Sign Up
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                onClick={() => setShowRoleModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  background: currentUser.role === 'coach' ? 'rgba(217, 119, 6, 0.15)' : 'rgba(5, 150, 105, 0.15)',
                  border: `1px solid ${currentUser.role === 'coach' ? 'rgba(217, 119, 6, 0.4)' : 'rgba(5, 150, 105, 0.4)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {(() => {
                  const userPhoto = currentUser.role === 'coach' 
                    ? coach?.photo 
                    : (archers.find(a => a.id === currentUser.id)?.photo || currentUser.photo);
                  
                  return userPhoto ? (
                    <img 
                      src={userPhoto} 
                      alt={currentUser.name} 
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: `2px solid ${currentUser.role === 'coach' ? '#d97706' : '#059669'}`
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: currentUser.role === 'coach' ? '#d97706' : '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.78rem',
                      color: '#ffffff'
                    }}>
                      {currentUser.role === 'coach' ? 'C' : 'A'}
                    </div>
                  );
                })()}
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.1 }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: currentUser.role === 'coach' ? '#fbbf24' : '#34d399', fontWeight: 600 }}>
                    {currentUser.role === 'coach' ? 'Coach' : 'Archer'}
                  </div>
                </div>
                <ChevronDown size={14} color="#94a3b8" />
              </div>

              {/* Header Sign Out Quick Button */}
              <button
                onClick={handleSignOut}
                title="Sign Out to Guest Mode"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#ef4444',
                  padding: '7px 10px',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <LogOut size={15} />
              </button>
            </div>
          )}

          {/* Mobile Hamburger Menu Toggle Button */}
          <button 
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer (Visible on narrow screens when menu is open) */}
        {mobileMenuOpen && (
          <div className="mobile-menu-drawer">
            <button className={`mobile-nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => handleTabClick('home')}>
              <Target size={18} /> Home
            </button>
            <button className={`mobile-nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => handleTabClick('leaderboard')}>
              <Award size={18} /> Streak Leaderboard
            </button>
            <button className={`mobile-nav-item ${activeTab === 'scoring' ? 'active' : ''}`} onClick={() => handleTabClick('scoring')}>
              <Target size={18} /> Interactive Scoring
            </button>
            <button className={`mobile-nav-item ${activeTab === 'equipment' ? 'active' : ''}`} onClick={() => handleTabClick('equipment')}>
              <Wrench size={18} /> Equipment Tuner
            </button>
            <button className={`mobile-nav-item ${activeTab === 'archers' ? 'active' : ''}`} onClick={() => handleTabClick('archers')}>
              <User size={18} /> Team Roster & Performance
            </button>
            <button className={`mobile-nav-item ${activeTab === 'venue' ? 'active' : ''}`} onClick={() => handleTabClick('venue')}>
              <MapPin size={18} /> Practice Venue & Schedule
            </button>
            <button className={`mobile-nav-item ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => handleTabClick('chat')}>
              <MessageSquare size={18} /> Team Chat & Private DMs
            </button>
            <button className={`mobile-nav-item ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => handleTabClick('gallery')}>
              <Camera size={18} /> Photo Gallery
            </button>
            <button className={`mobile-nav-item ${activeTab === 'ai-coach' ? 'active' : ''}`} onClick={() => handleTabClick('ai-coach')}>
              <Sparkles size={18} color="#fbbf24" /> AI Performance Coach ✨
            </button>
            {currentUser.role === 'archer' && (
              <button className={`mobile-nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => handleTabClick('profile')}>
                <User size={18} /> My Archer Profile
              </button>
            )}
            {currentUser.role === 'coach' && (
              <button className={`mobile-nav-item ${activeTab === 'coach' ? 'active' : ''}`} onClick={() => handleTabClick('coach')}>
                <Shield size={18} /> Coach Dashboard
              </button>
            )}
          </div>
        )}

      </div>

      {/* Role Switch / Login / Sign Up / Sign Out Modal */}
      {showRoleModal && (
        <div className="modal-overlay" onClick={() => setShowRoleModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogIn size={20} color="#fbbf24" />
                {selectedRole === 'forgot_password' ? 'Forgot Password Recovery' : 'Login or Account Switch'}
              </h3>
              <button onClick={() => setShowRoleModal(false)} className="btn-ghost" style={{ padding: '4px 8px' }}>✕</button>
            </div>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {selectedRole !== 'forgot_password' && (
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
              )}

              {/* Mode A: Archer Login via Text Input (No Dropdown Exposed) */}
              {selectedRole === 'archer' && (
                <div>
                  <label style={{ fontSize: '0.82rem', color: '#38bdf8', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                    Archer Name / Username
                  </label>
                  <input 
                    type="text"
                    className="input-glass"
                    placeholder="Enter your registered name (e.g. Rishabh Kumar Sinha)"
                    value={inputArcherName}
                    onChange={(e) => { setInputArcherName(e.target.value); setPasswordError(''); }}
                  />
                </div>
              )}

              {/* Mode B: New Archer Sign Up Form */}
              {selectedRole === 'new_archer' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>Your Full Name / Username</label>
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
                    <label style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>Set Login Password</label>
                    <input
                      type="password"
                      className="input-glass"
                      placeholder="Create your login password..."
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      required
                    />
                  </div>

                  {/* Backup Security Question */}
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <HelpCircle size={14} /> Security Question for Forgot Password
                    </label>
                    <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '4px' }}>
                      "What is your highest score?"
                    </div>
                    <input
                      type="text"
                      className="input-glass"
                      placeholder="e.g. 342 or 330/360..."
                      value={regHighestScoreAnswer}
                      onChange={(e) => setRegHighestScoreAnswer(e.target.value)}
                      required
                    />
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>🔒 Private: This answer will never be shown in your profile section.</span>
                  </div>
                </div>
              )}

              {/* Mode C: Forgot Password Recovery */}
              {selectedRole === 'forgot_password' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: '#fbbf24', fontWeight: 700 }}>Select Archer Username</label>
                    <select
                      className="select-glass"
                      value={forgotArcherId}
                      onChange={(e) => { setForgotArcherId(e.target.value); setForgotVerified(false); setPasswordError(''); }}
                    >
                      {archers.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>

                  {!forgotVerified ? (
                    <div>
                      <label style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <HelpCircle size={15} /> Security Question:
                      </label>
                      <p style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600, margin: '4px 0 8px 0' }}>
                        "What is your highest score?"
                      </p>
                      <input
                        type="text"
                        className="input-glass"
                        placeholder="Enter your security answer..."
                        value={forgotAnswerInput}
                        onChange={(e) => setForgotAnswerInput(e.target.value)}
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <div style={{ color: '#34d399', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={16} /> Security Question Verified!
                      </div>
                      <label style={{ fontSize: '0.82rem', color: '#fbbf24', fontWeight: 700 }}>Enter New Password</label>
                      <input
                        type="password"
                        className="input-glass"
                        placeholder="Enter new password..."
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => { setSelectedRole('archer'); setPasswordError(''); }}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.78rem', cursor: 'pointer', textAlign: 'left' }}
                  >
                    ← Back to Login
                  </button>
                </div>
              )}

              {/* Password Input for Coach & Existing Archer */}
              {selectedRole !== 'new_archer' && selectedRole !== 'forgot_password' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                      Enter Account Password
                    </label>

                    {selectedRole === 'archer' && archers.length > 0 && (
                      <button
                        type="button"
                        onClick={() => { setSelectedRole('forgot_password'); setPasswordError(''); setForgotVerified(false); }}
                        style={{ background: 'none', border: 'none', color: '#fbbf24', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>

                  <input
                    type="password"
                    className="input-glass"
                    placeholder="Enter your account password..."
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

                <button type="submit" className={selectedRole === 'coach' ? 'btn-gold' : 'btn-emerald'} style={{ flex: 1, justifyContent: 'center' }}>
                  {selectedRole === 'new_archer'
                    ? 'Register & Login'
                    : selectedRole === 'forgot_password'
                    ? (forgotVerified ? 'Update Password & Login' : 'Verify Answer')
                    : 'Login to Account'}
                </button>
              </div>

              {/* Sign Out Option for Logged-In User */}
              {currentUser.role !== 'guest' && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 700 }}>Logged in as: {currentUser.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{currentUser.role === 'coach' ? 'Head Coach' : 'Archer Account'}</div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      color: '#ef4444',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <LogOut size={15} /> Sign Out (Guest Mode)
                  </button>
                </div>
              )}

            </form>
          </div>
        </div>
      )}
    </header>
  );
}
