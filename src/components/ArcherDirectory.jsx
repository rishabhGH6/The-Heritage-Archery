import React, { useState } from 'react';
import { User, Edit3, Lock, Plus, Trash2, Award, Calendar, Briefcase, Camera, Check, Shield, UserPlus } from 'lucide-react';

export default function ArcherDirectory({ archers, currentUser, coach, onUpdateArcher, onAddArcher }) {
  const [editingArcher, setEditingArcher] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newState, setNewState] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // New archer registration state
  const [newArcherName, setNewArcherName] = useState('');
  const [newArcherPass, setNewArcherPass] = useState('archer');
  const [newArcherCategory, setNewArcherCategory] = useState('Junior');
  const [newArcherOccupation, setNewArcherOccupation] = useState('Student');
  const [newArcherPracticing, setNewArcherPracticing] = useState('Yes');
  const [newArcherDob, setNewArcherDob] = useState('');
  const [newArcherAim, setNewArcherAim] = useState('');
  const [newArcherSummary, setNewArcherSummary] = useState('');

  const isCoach = currentUser.role === 'coach';

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editingArcher) return;
    onUpdateArcher(editingArcher);
    setEditingArcher(null);
  };

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

  const handleAddState = (tournamentName) => {
    if (!tournamentName.trim()) return;
    setEditingArcher(prev => ({
      ...prev,
      statesPlayed: [...(prev.statesPlayed || []), tournamentName.trim()]
    }));
    setNewState('');
  };

  const handleRemoveState = (index) => {
    setEditingArcher(prev => ({
      ...prev,
      statesPlayed: prev.statesPlayed.filter((_, i) => i !== index)
    }));
  };

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    setEditingArcher(prev => ({
      ...prev,
      photos: [...(prev.photos || []), newPhotoUrl.trim()]
    }));
    setNewPhotoUrl('');
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
            Archer Profiles & Tournaments Directory 🎯
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Explore team archer profiles, category, occupation, state tournaments played, and personal photo showcases.
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
            const canEdit = isCoach || isOwnProfile;

            return (
              <div key={archer.id} className="glass-card glass-card-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                
                <div>
                  {/* Header: Photo + Name + Edit Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img 
                        src={archer.photo} 
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

                    {canEdit && (
                      <button onClick={() => setEditingArcher(JSON.parse(JSON.stringify(archer)))} className="btn-ghost" style={{ padding: '6px' }}>
                        <Edit3 size={16} color="#fbbf24" />
                      </button>
                    )}
                  </div>

                  {/* Practicing & Private DOB Row */}
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    display: 'flex',
                    justify: 'space-between',
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

                  {/* Aim / Goal */}
                  <div style={{ marginBottom: '14px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Aim / Target Goal</span>
                    <p style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600, marginTop: '2px' }}>
                      🎯 "{archer.aim || 'Focusing on consistent release'}"
                    </p>
                  </div>

                  {/* Summary */}
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Archer Bio & Summary</span>
                    <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, marginTop: '2px' }}>
                      {archer.summary}
                    </p>
                  </div>

                  {/* State Tournaments Played */}
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
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

                {/* Photos Showcase Thumbnail Bar */}
                {archer.photos && archer.photos.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '12px', marginTop: '10px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                      <Camera size={12} /> Personal Photos ({archer.photos.length})
                    </span>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                      {archer.photos.map((pUrl, pIdx) => (
                        <img key={pIdx} src={pUrl} alt="Archer photo" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Register New Archer Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={20} color="#34d399" /> Register New Archer Profile
              </h3>
              <button onClick={() => setShowAddModal(false)} className="btn-ghost" style={{ padding: '4px 8px' }}>✕</button>
            </div>

            <form onSubmit={handleCreateArcher} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Archer Full Name</label>
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
                    placeholder="Set password (default: archer)"
                    value={newArcherPass}
                    onChange={(e) => setNewArcherPass(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Category</label>
                  <select
                    className="select-glass"
                    value={newArcherCategory}
                    onChange={(e) => setNewArcherCategory(e.target.value)}
                  >
                    <option value="Junior">Junior Archer</option>
                    <option value="Senior">Senior Archer</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Occupation</label>
                  <select
                    className="select-glass"
                    value={newArcherOccupation}
                    onChange={(e) => setNewArcherOccupation(e.target.value)}
                  >
                    <option value="Student">Student</option>
                    <option value="Higher Studies">Higher Studies</option>
                    <option value="Working Professional">Working Professional</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Currently Practicing?</label>
                  <select
                    className="select-glass"
                    value={newArcherPracticing}
                    onChange={(e) => setNewArcherPracticing(e.target.value)}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Date of Birth (Private) 🔒</label>
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
                  placeholder="e.g. Represent Heritage Archery in State Championship"
                  value={newArcherAim}
                  onChange={(e) => setNewArcherAim(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Archer Bio / Summary</label>
                <textarea
                  className="input-glass"
                  rows={3}
                  placeholder="Short bio about archery experience..."
                  value={newArcherSummary}
                  onChange={(e) => setNewArcherSummary(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-emerald">Create Archer Profile</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Edit Archer Profile Modal */}
      {editingArcher && (
        <div className="modal-overlay" onClick={() => setEditingArcher(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={20} color="#34d399" /> Edit Profile: {editingArcher.name}
              </h3>
              <button onClick={() => setEditingArcher(null)} className="btn-ghost" style={{ padding: '4px 8px' }}>✕</button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Category</label>
                  <select
                    className="select-glass"
                    value={editingArcher.category}
                    onChange={(e) => setEditingArcher({ ...editingArcher, category: e.target.value })}
                  >
                    <option value="Junior">Junior Archer</option>
                    <option value="Senior">Senior Archer</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Occupation</label>
                  <select
                    className="select-glass"
                    value={editingArcher.occupation}
                    onChange={(e) => setEditingArcher({ ...editingArcher, occupation: e.target.value })}
                  >
                    <option value="Student">Student</option>
                    <option value="Higher Studies">Higher Studies</option>
                    <option value="Working Professional">Working Professional</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Currently Practicing?</label>
                  <select
                    className="select-glass"
                    value={editingArcher.currentlyPracticing}
                    onChange={(e) => setEditingArcher({ ...editingArcher, currentlyPracticing: e.target.value })}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                    Date of Birth (Private) 🔒
                  </label>
                  <input
                    type="date"
                    className="input-glass"
                    value={editingArcher.dob || ''}
                    onChange={(e) => setEditingArcher({ ...editingArcher, dob: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Profile Photo URL</label>
                <input
                  type="text"
                  className="input-glass"
                  value={editingArcher.photo}
                  onChange={(e) => setEditingArcher({ ...editingArcher, photo: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Aim / Goal</label>
                <input
                  type="text"
                  className="input-glass"
                  value={editingArcher.aim}
                  onChange={(e) => setEditingArcher({ ...editingArcher, aim: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Bio / Summary</label>
                <textarea
                  className="input-glass"
                  rows={3}
                  value={editingArcher.summary}
                  onChange={(e) => setEditingArcher({ ...editingArcher, summary: e.target.value })}
                />
              </div>

              {/* State Tournaments Played Add/Remove Section */}
              <div>
                <label style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700 }}>
                  State Tournaments Played (Bolpur, Rajgunj, Kalimpong, etc.)
                </label>
                
                <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
                  <button type="button" onClick={() => handleAddState("Bolpur State Championship")} className="btn-ghost" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>+ Bolpur</button>
                  <button type="button" onClick={() => handleAddState("Rajgunj Archery Meet")} className="btn-ghost" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>+ Rajgunj</button>
                  <button type="button" onClick={() => handleAddState("Kalimpong Open")} className="btn-ghost" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>+ Kalimpong</button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="input-glass"
                    placeholder="Mention custom tournament name..."
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                  />
                  <button type="button" onClick={() => handleAddState(newState)} className="btn-ghost" style={{ padding: '0 12px' }}>
                    <Plus size={16} /> Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {editingArcher.statesPlayed?.map((st, index) => (
                    <span key={index} style={{ background: 'rgba(217,119,6,0.2)', color: '#fbbf24', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {st}
                      <Trash2 size={12} style={{ cursor: 'pointer' }} onClick={() => handleRemoveState(index)} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Photos Gallery Add Section */}
              <div>
                <label style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}>
                  Add Personal Photo URL
                </label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <input
                    type="text"
                    className="input-glass"
                    placeholder="https://..."
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                  />
                  <button type="button" onClick={handleAddPhoto} className="btn-ghost">Add Photo</button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setEditingArcher(null)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-emerald">Save Profile Updates</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
