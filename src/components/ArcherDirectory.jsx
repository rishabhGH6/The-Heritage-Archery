import React, { useState } from 'react';
import { User, Edit3, Lock, Plus, Trash2, Award, Calendar, Briefcase, Camera, Check, Shield, UserPlus, TrendingUp, BarChart2, FileText, ChevronRight } from 'lucide-react';

export default function ArcherDirectory({ archers, currentUser, coach, onUpdateArcher, onAddArcher, scoreLogs = [] }) {
  const [selectedGraphArcher, setSelectedGraphArcher] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New archer registration state
  const [newArcherName, setNewArcherName] = useState('');
  const [newArcherPass, setNewArcherPass] = useState('');
  const [newArcherCategory, setNewArcherCategory] = useState('Junior');
  const [newArcherOccupation, setNewArcherOccupation] = useState('Student');
  const [newArcherPracticing, setNewArcherPracticing] = useState('Yes');
  const [newArcherDob, setNewArcherDob] = useState('');
  const [newArcherAim, setNewArcherAim] = useState('');
  const [newArcherSummary, setNewArcherSummary] = useState('');

  const isCoach = currentUser.role === 'coach';

  const handleCreateArcher = (e) => {
    e.preventDefault();
    if (!newArcherName.trim()) return;

    const newObj = {
      id: "archer_" + Date.now(),
      name: newArcherName.trim(),
      password: newArcherPass || 'archer',
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      category: newArcherCategory,
      occupation: newArcherOccupation,
      currentlyPracticing: newArcherPracticing,
      dob: newArcherDob,
      aim: newArcherAim.trim(),
      summary: newArcherSummary.trim(),
      statesPlayed: [],
      photos: []
    };

    onAddArcher(newObj);
    setShowAddModal(false);
    setNewArcherName('');
    setNewArcherAim('');
    setNewArcherSummary('');
    setNewArcherDob('');
    alert(`Archer profile created for ${newObj.name}!`);
  };

  // Extract last 10 scores for selected graph archer
  const graphLogs = selectedGraphArcher ? (
    scoreLogs
      .filter(log => log.archerId === selectedGraphArcher.id || log.archerName === selectedGraphArcher.name)
      .slice(0, 10)
      .reverse()
  ) : [];

  const maxScore = graphLogs.length > 0 ? Math.max(...graphLogs.map(l => l.totalScore)) : 0;
  const avgScore = graphLogs.length > 0 ? (graphLogs.reduce((a, b) => a + b.totalScore, 0) / graphLogs.length).toFixed(1) : 0;

  // Requirement 1: Graph visibility permissions
  const handleOpenGraph = (targetArcher) => {
    if (currentUser.role === 'coach') {
      setSelectedGraphArcher(targetArcher);
    } else if (currentUser.role === 'archer' && currentUser.id === targetArcher.id) {
      setSelectedGraphArcher(targetArcher);
    } else if (currentUser.role === 'archer') {
      alert("🔒 You can only view your own score graph. Coach Jayanta can view all team score graphs.");
    } else {
      alert("🔒 Please log in to view score graphs!");
    }
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-gold">
              <User size={13} /> Heritage Team Roster
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
            Archer Profiles & Performance Directory 🎯
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Tap any archer to view their <strong>previous 10 scorecard trends & performance graph</strong>.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn-emerald" style={{ padding: '12px 20px' }}>
          <UserPlus size={18} /> Register New Archer
        </button>
      </div>

      {/* Archers Cards Grid */}
      {archers.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          <User size={40} color="#059669" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', fontWeight: 700 }}>No Archers Registered Yet</h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '8px 0 16px 0' }}>
            Click "Register New Archer" above to create the first archer profile for the team.
          </p>
          <button onClick={() => setShowAddModal(true)} className="btn-emerald">
            <UserPlus size={18} /> Register First Archer
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {archers.map(archer => {
            const isOwnProfile = currentUser.id === archer.id;
            const canViewDob = isCoach || isOwnProfile;

            // Get count of saved score logs for this archer
            const archerScoreCount = scoreLogs.filter(l => l.archerId === archer.id || l.archerName === archer.name).length;

            return (
              <div 
                key={archer.id} 
                className="glass-card glass-card-hover" 
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => handleOpenGraph(archer)}
              >
                
                <div>
                  {/* Header: Photo + Name + View Graph Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img 
                        src={archer.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"} 
                        alt={archer.name} 
                        style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover', border: '2px solid #059669' }}
                      />
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                          {archer.name}
                        </h3>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                          <span className="badge-emerald">{archer.category}</span>
                          <span style={{ background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '9999px', fontWeight: 600 }}>
                            {archer.occupation}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); handleOpenGraph(archer); }} 
                      className="btn-gold" 
                      style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <TrendingUp size={14} /> View Graph
                    </button>
                  </div>

                  {/* Practicing & Private DOB Row */}
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    fontSize: '0.82rem'
                  }}>
                    <div>
                      <span style={{ color: '#94a3b8' }}>Practicing: </span>
                      <strong style={{ color: archer.currentlyPracticing === 'Yes' ? '#34d399' : '#ef4444' }}>
                        {archer.currentlyPracticing}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: canViewDob ? '#fbbf24' : '#64748b' }}>
                      <Lock size={13} />
                      <span>DOB: <strong>{canViewDob ? (archer.dob || 'Not set') : '••• Private •••'}</strong></span>
                    </div>
                  </div>

                  {/* Aim & Target Goal */}
                  {archer.aim && (
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase' }}>Aim / Target Goal</span>
                      <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '2px 0 0 0', fontStyle: 'italic' }}>
                        "{archer.aim}"
                      </p>
                    </div>
                  )}

                  {/* Summary / Bio */}
                  {archer.summary && (
                    <div style={{ marginBottom: '14px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Summary</span>
                      <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0 0', lineHeight: 1.4 }}>
                        {archer.summary}
                      </p>
                    </div>
                  )}

                  {/* Tournaments Played List */}
                  <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Award size={13} /> State Tournaments Played ({archer.statesPlayed ? archer.statesPlayed.length : 0})
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                      {archer.statesPlayed && archer.statesPlayed.length > 0 ? (
                        archer.statesPlayed.map((st, sIdx) => (
                          <span key={sIdx} style={{ background: 'rgba(5, 150, 105, 0.15)', color: '#34d399', border: '1px solid rgba(5,150,105,0.3)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                            🏆 {st}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>No state entries added yet.</span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Score Graph Quick Trigger Bar */}
                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '12px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <BarChart2 size={14} /> {archerScoreCount} Scorecards Logged
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                    Tap to view 10-score graph <ChevronRight size={14} />
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Archer Performance & Last 10 Score Trend Graph */}
      {selectedGraphArcher && (
        <div className="modal-overlay" onClick={() => setSelectedGraphArcher(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={selectedGraphArcher.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"} 
                  alt={selectedGraphArcher.name}
                  style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #34d399' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    {selectedGraphArcher.name}'s Score Trend Graph 📈
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                    Previous 10 Practice Scorecard Data
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(15,23,42,0.6)', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(251,191,36,0.3)' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Peak Score</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>
                  {maxScore} <span style={{ fontSize: '0.7rem' }}>/ 360</span>
                </div>
              </div>

              <div style={{ background: 'rgba(15,23,42,0.6)', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(52,211,153,0.3)' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>10-Session Avg</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>
                  {avgScore} <span style={{ fontSize: '0.7rem' }}>pts</span>
                </div>
              </div>

              <div style={{ background: 'rgba(15,23,42,0.6)', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total Logged</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                  {graphLogs.length} <span style={{ fontSize: '0.7rem' }}>sessions</span>
                </div>
              </div>
            </div>

            {/* SVG Interactive Line Chart Graph */}
            {graphLogs.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', background: 'rgba(15,23,42,0.4)', borderRadius: '12px' }}>
                No scorecards logged yet for {selectedGraphArcher.name}. Record target practice in the <strong>Scoring Tab</strong> to populate graph data!
              </div>
            ) : (
              <div style={{ background: 'rgba(15,23,42,0.8)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                  Score Trend Line (Last {graphLogs.length} Sessions)
                </span>

                <svg width="100%" height="220" viewBox="0 0 460 220" style={{ overflow: 'visible' }}>
                  {/* Grid Lines */}
                  <line x1="40" y1="30" x2="440" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <line x1="40" y1="80" x2="440" y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <line x1="40" y1="130" x2="440" y2="130" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <line x1="40" y1="180" x2="440" y2="180" stroke="rgba(255,255,255,0.1)" />

                  {/* Y Axis Labels */}
                  <text x="32" y="34" fill="#94a3b8" fontSize="10" textAnchor="end">360</text>
                  <text x="32" y="84" fill="#94a3b8" fontSize="10" textAnchor="end">300</text>
                  <text x="32" y="134" fill="#94a3b8" fontSize="10" textAnchor="end">240</text>
                  <text x="32" y="184" fill="#94a3b8" fontSize="10" textAnchor="end">180</text>

                  {/* Graph Line & Points */}
                  {(() => {
                    const totalPoints = graphLogs.length;
                    const stepX = totalPoints > 1 ? (400 / (totalPoints - 1)) : 0;
                    
                    const pointsCoords = graphLogs.map((log, idx) => {
                      const x = totalPoints === 1 ? 240 : 40 + idx * stepX;
                      // Scale y: 180 pts -> y=180, 360 pts -> y=30
                      const scoreClamped = Math.max(180, Math.min(360, log.totalScore));
                      const y = 180 - ((scoreClamped - 180) / 180) * 150;
                      return { x, y, score: log.totalScore, date: log.date, distance: log.distance };
                    });

                    const polylinePoints = pointsCoords.map(pt => `${pt.x},${pt.y}`).join(' ');

                    return (
                      <g>
                        {/* Connecting Trend Line */}
                        <polyline
                          fill="none"
                          stroke="#34d399"
                          strokeWidth="3"
                          points={polylinePoints}
                          filter="drop-shadow(0 4px 8px rgba(52, 211, 153, 0.4))"
                        />

                        {/* Data Points */}
                        {pointsCoords.map((pt, pIdx) => (
                          <g key={pIdx}>
                            <circle cx={pt.x} cy={pt.y} r="6" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                            <text
                              x={pt.x}
                              y={pt.y - 10}
                              fill="#fbbf24"
                              fontSize="11"
                              fontWeight="800"
                              textAnchor="middle"
                            >
                              {pt.score}
                            </text>
                            <text
                              x={pt.x}
                              y="198"
                              fill="#64748b"
                              fontSize="9"
                              textAnchor="middle"
                            >
                              {pt.date.slice(5)}
                            </text>
                          </g>
                        ))}
                      </g>
                    );
                  })()}
                </svg>

              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => setSelectedGraphArcher(null)} className="btn-emerald">
                Close Graph
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: Register New Archer */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={20} color="#34d399" /> Register New Archer Profile
              </h3>
              <button onClick={() => setShowAddModal(false)} className="btn-ghost" style={{ padding: '4px 8px' }}>✕</button>
            </div>

            <form onSubmit={handleCreateArcher} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Full Name</label>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="e.g. Rahul Sharma"
                  value={newArcherName}
                  onChange={(e) => setNewArcherName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Login Password</label>
                <input
                  type="password"
                  className="input-glass"
                  placeholder="Create account password..."
                  value={newArcherPass}
                  onChange={(e) => setNewArcherPass(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Category</label>
                  <select className="select-glass" value={newArcherCategory} onChange={(e) => setNewArcherCategory(e.target.value)}>
                    <option value="Junior">Junior Archer</option>
                    <option value="Senior">Senior Archer</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Occupation</label>
                  <select className="select-glass" value={newArcherOccupation} onChange={(e) => setNewArcherOccupation(e.target.value)}>
                    <option value="Student">Student</option>
                    <option value="Higher Studies">Higher Studies</option>
                    <option value="Working Professional">Working Professional</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Practicing Now?</label>
                  <select className="select-glass" value={newArcherPracticing} onChange={(e) => setNewArcherPracticing(e.target.value)}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600 }}>DOB (Private) 🔒</label>
                  <input
                    type="date"
                    className="input-glass"
                    value={newArcherDob}
                    onChange={(e) => setNewArcherDob(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Aim / Target Goal</label>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="e.g., Gold Medal 70m Target"
                  value={newArcherAim}
                  onChange={(e) => setNewArcherAim(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Summary / Bio</label>
                <textarea
                  className="input-glass"
                  rows={2}
                  placeholder="Short archery bio..."
                  value={newArcherSummary}
                  onChange={(e) => setNewArcherSummary(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-emerald">Create Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
