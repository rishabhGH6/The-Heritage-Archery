import React, { useState } from 'react';
import { Wrench, CheckCircle, AlertTriangle, Save, Compass, Target, ArrowRight } from 'lucide-react';

export default function EquipmentTuner({ currentUser, archers, equipmentData, onSaveEquipment }) {
  const [selectedArcherId, setSelectedArcherId] = useState(
    currentUser.role === 'archer' 
      ? currentUser.id 
      : currentUser.role === 'coach' 
        ? 'coach' 
        : (archers[0]?.id || '')
  );

  const currentEq = equipmentData[selectedArcherId] || {
    poundage: "40 lbs",
    braceHeight: "8.5 inches",
    sightMarks: { "30m": "4.0", "50m": "6.0", "60m": "7.5", "70m": "9.0" },
    goodArrows: [1, 2, 3, 4, 5, 6]
  };

  const [poundage, setPoundage] = useState(currentEq.poundage);
  const [braceHeight, setBraceHeight] = useState(currentEq.braceHeight);
  const [sightMarks, setSightMarks] = useState(currentEq.sightMarks);
  const [goodArrows, setGoodArrows] = useState(currentEq.goodArrows || []);

  const selectedArcher = selectedArcherId === 'coach'
    ? { id: 'coach', name: 'Coach Jayanta Chakraborty', category: 'Head Coach' }
    : (archers.find(a => a.id === selectedArcherId) || archers[0] || { name: 'Archer' });

  const handleArcherChange = (newId) => {
    setSelectedArcherId(newId);
    const eq = equipmentData[newId] || {
      poundage: "42 lbs",
      braceHeight: "8.5 inches",
      sightMarks: { "30m": "4.0", "50m": "6.0", "60m": "7.5", "70m": "9.0" },
      goodArrows: [1, 2, 3, 4, 5, 6]
    };
    setPoundage(eq.poundage);
    setBraceHeight(eq.braceHeight);
    setSightMarks(eq.sightMarks);
    setGoodArrows(eq.goodArrows || []);
  };

  const handleToggleArrow = (arrowNum) => {
    if (goodArrows.includes(arrowNum)) {
      setGoodArrows(goodArrows.filter(n => n !== arrowNum));
    } else {
      setGoodArrows([...goodArrows, arrowNum].sort((a, b) => a - b));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentUser.role === 'guest') {
      alert("🔒 Guest Mode: Please log in or register your archer account to save equipment tuning specs!");
      return;
    }
    onSaveEquipment(selectedArcherId, {
      poundage,
      braceHeight,
      sightMarks,
      goodArrows
    });
    alert(`Equipment tuning profile saved for ${selectedArcher?.name || 'Archer'}!`);
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-emerald">
              <Wrench size={13} /> Bow Tuning & Arrow Marking Log
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
            Equipment Log & Good Arrows Matrix 🏹
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Record sight marks across 30m-70m, poundage, brace height, and flag competition-ready "Good Arrows".
          </p>
        </div>

        {/* Pre-locked Archer / Profile Badge Banner */}
        <div style={{ background: 'rgba(5, 150, 105, 0.15)', border: '1px solid rgba(5, 150, 105, 0.3)', padding: '10px 18px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Wrench size={20} color="#34d399" />
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc' }}>
              {selectedArcher.name}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>
              🔒 Pre-Locked Bow Profile
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="equipment-responsive-grid">
        
        {/* Left Column: Bow Specs & Sight Marks */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fbbf24', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={18} /> Bow Setup & Sight Position Marks
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Draw Weight (Poundage)
              </label>
              <input
                type="text"
                className="input-glass"
                value={poundage}
                onChange={(e) => setPoundage(e.target.value)}
                placeholder="e.g. 42 lbs"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Brace Height
              </label>
              <input
                type="text"
                className="input-glass"
                value={braceHeight}
                onChange={(e) => setBraceHeight(e.target.value)}
                placeholder="e.g. 8.75 inches"
              />
            </div>
          </div>

          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Target size={16} color="#34d399" /> Sight Position Marks by Distance
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {["30m", "50m", "60m", "70m"].map(dist => (
              <div key={dist} style={{ background: 'rgba(15,23,42,0.7)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <label style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  {dist} Sight Setting
                </label>
                <input
                  type="text"
                  className="input-glass"
                  value={sightMarks[dist] || ''}
                  onChange={(e) => setSightMarks({ ...sightMarks, [dist]: e.target.value })}
                  placeholder="e.g. 6.8"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Good Arrows Tracker */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#34d399', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🎯 Good Arrows Tracker (Arrows #1 to #12)
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px' }}>
              Click arrow numbers to mark which arrows in your quiver are straight, tuned, and competition-ready.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => {
                const isGood = goodArrows.includes(num);
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleToggleArrow(num)}
                    style={{
                      padding: '16px 8px',
                      borderRadius: '12px',
                      border: isGood ? '2px solid #34d399' : '1px solid rgba(255,255,255,0.1)',
                      background: isGood ? 'rgba(5,150,105,0.25)' : 'rgba(15,23,42,0.8)',
                      color: isGood ? '#34d399' : '#64748b',
                      fontWeight: 800,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>Arrow #{num}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: isGood ? '#fbbf24' : '#64748b' }}>
                      {isGood ? '🎯 Good' : '❌ Reserve'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ background: 'rgba(217, 119, 6, 0.15)', border: '1px solid rgba(217,119,6,0.3)', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600 }}>
              Competition Ready Arrows: <strong style={{ color: '#fbbf24' }}>{goodArrows.length} / 12</strong>
            </span>
            <button type="submit" className="btn-emerald">
              <Save size={16} /> Save Bow Tuning Profile
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}
