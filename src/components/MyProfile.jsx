import React, { useState } from 'react';
import { User, Edit3, Lock, Plus, Trash2, Award, Calendar, Briefcase, Camera, Save, CheckCircle2, Shield, Eye, EyeOff, Upload } from 'lucide-react';

export default function MyProfile({ currentUser, archers, onUpdateArcher }) {
  const currentArcher = (archers && archers.find(a => 
    a.id === currentUser.id || 
    (a.altId && a.altId === currentUser.id) || 
    (a.name && currentUser.name && a.name.trim().toLowerCase() === currentUser.name.trim().toLowerCase())
  )) || {
    id: currentUser.id,
    name: currentUser.name,
    password: '',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    category: 'Junior',
    occupation: 'Student',
    currentlyPracticing: 'Yes',
    dob: '',
    aim: '',
    summary: '',
    statesPlayed: [],
    photos: []
  };

  const [formData, setFormData] = useState({ ...currentArcher });

  React.useEffect(() => {
    setFormData({ ...currentArcher });
  }, [currentArcher.id, currentArcher.photo, currentArcher.summary, currentArcher.aim, currentArcher.password, currentArcher.dob, currentArcher.category, currentArcher.occupation, currentArcher.currentlyPracticing]);
  const [newState, setNewState] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Read image from user device as Base64 Data URL
  const handleProfileImageFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImageFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photos: [...(prev.photos || []), reader.result]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddState = (stateName) => {
    if (!stateName.trim()) return;
    setFormData(prev => ({
      ...prev,
      statesPlayed: [...(prev.statesPlayed || []), stateName.trim()]
    }));
    setNewState('');
  };

  const handleRemoveState = (index) => {
    setFormData(prev => ({
      ...prev,
      statesPlayed: prev.statesPlayed.filter((_, i) => i !== index)
    }));
  };

  const handleAddPhotoUrl = () => {
    if (!newPhotoUrl.trim()) return;
    setFormData(prev => ({
      ...prev,
      photos: [...(prev.photos || []), newPhotoUrl.trim()]
    }));
    setNewPhotoUrl('');
  };

  const handleRemovePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateArcher(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-emerald">
              <User size={13} /> Archer Personal Dashboard
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
            My Archer Profile Settings 👤
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Manage your personal profile, private DOB, state tournament history, aim, and photo gallery.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="profile-responsive-grid">
        
        {/* Left Column: Account Details & Demographics */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#34d399', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} /> Basic Profile & Credentials
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Profile Photo Uploader from Device or URL */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img
                src={formData.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                alt={formData.name}
                style={{ width: '76px', height: '76px', borderRadius: '18px', objectFit: 'cover', border: '2px solid #059669' }}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Profile Photo</label>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="file"
                    accept="image/*"
                    id="profile-device-picker"
                    style={{ display: 'none' }}
                    onChange={handleProfileImageFile}
                  />
                  <label htmlFor="profile-device-picker" className="btn-emerald" style={{ cursor: 'pointer', fontSize: '0.78rem', padding: '6px 12px' }}>
                    <Upload size={14} /> Choose from Device
                  </label>
                </div>

                <input
                  type="text"
                  className="input-glass"
                  placeholder="Or paste image URL (https://...)"
                  value={formData.photo || ''}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  style={{ fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Full Name</label>
                <input
                  type="text"
                  className="input-glass"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Login Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input-glass"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Archer Category</label>
                <select
                  className="select-glass"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Junior">Junior Archer</option>
                  <option value="Senior">Senior Archer</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Current Occupation</label>
                <select
                  className="select-glass"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
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
                  value={formData.currentlyPracticing}
                  onChange={(e) => setFormData({ ...formData, currentlyPracticing: e.target.value })}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={12} /> Date of Birth (Private)
                </label>
                <input
                  type="date"
                  className="input-glass"
                  value={formData.dob || ''}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Aim / Target Goal</label>
              <input
                type="text"
                className="input-glass"
                placeholder="e.g. Gold Medal in State Championship 2026"
                value={formData.aim || ''}
                onChange={(e) => setFormData({ ...formData, aim: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Summary / Bio</label>
              <textarea
                className="input-glass"
                rows={3}
                placeholder="Share your archery journey, bow specs, or training routine..."
                value={formData.summary || ''}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              />
            </div>

          </div>
        </div>

        {/* Right Column: Tournaments Played & Photo Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* State Tournaments Played Section */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fbbf24', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} /> Number of States / Tournaments Played
            </h3>

            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '12px' }}>
              Click quick state buttons or mention custom state tournaments played:
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <button type="button" onClick={() => handleAddState("Bolpur State Championship")} className="btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                + Bolpur
              </button>
              <button type="button" onClick={() => handleAddState("Rajgunj Archery Meet")} className="btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                + Rajgunj
              </button>
              <button type="button" onClick={() => handleAddState("Kalimpong Open")} className="btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                + Kalimpong
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                type="text"
                className="input-glass"
                placeholder="Others mention (custom tournament name)..."
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
              />
              <button type="button" onClick={() => handleAddState(newState)} className="btn-ghost" style={{ padding: '0 14px' }}>
                <Plus size={16} /> Mention
              </button>
            </div>

            {/* List of Added States */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {formData.statesPlayed && formData.statesPlayed.length > 0 ? (
                formData.statesPlayed.map((st, index) => (
                  <span key={index} style={{ background: 'rgba(217,119,6,0.2)', color: '#fbbf24', border: '1px solid rgba(217,119,6,0.4)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🏆 {st}
                    <Trash2 size={13} style={{ cursor: 'pointer' }} onClick={() => handleRemoveState(index)} />
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>No tournament entries added yet.</span>
              )}
            </div>
          </div>

          {/* Personal Photo Gallery Section */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#34d399', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Camera size={18} /> My Personal Photos Gallery
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  id="gallery-device-picker"
                  style={{ display: 'none' }}
                  onChange={handleGalleryImageFile}
                />
                <label htmlFor="gallery-device-picker" className="btn-emerald" style={{ cursor: 'pointer', padding: '8px 16px', fontSize: '0.85rem' }}>
                  <Upload size={16} /> Choose Photo from Device
                </label>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="Or paste photo URL (https://...)"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                />
                <button type="button" onClick={handleAddPhotoUrl} className="btn-ghost">
                  <Plus size={16} /> Add URL
                </button>
              </div>
            </div>

            {/* Photo Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '10px' }}>
              {formData.photos && formData.photos.map((pUrl, index) => (
                <div key={index} style={{ position: 'relative', width: '100%', height: '90px', borderRadius: '10px', overflow: 'hidden' }}>
                  <img src={pUrl} alt="Archer gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.85)', border: 'none', color: '#ef4444', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {saveSuccess ? (
              <span style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={16} /> Profile changes saved successfully!
              </span>
            ) : <div />}

            <button type="submit" className="btn-emerald" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
              <Save size={18} /> Save Profile Changes
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}
