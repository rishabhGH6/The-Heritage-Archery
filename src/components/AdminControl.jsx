import React from 'react';
import { Shield, UserCheck, Trash2, CheckCircle2, Users, Key, Calendar, Briefcase, Award } from 'lucide-react';

export default function AdminControl({ archers = [], pendingArchers = [], onApproveArcher, onRejectArcher }) {
  return (
    <div style={{ marginBottom: '36px' }}>
      
      {/* Admin Command Center Banner */}
      <div className="glass-card glass-card-gold" style={{ padding: '28px', marginBottom: '24px', border: '1px solid rgba(239, 68, 68, 0.4)', background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(239, 68, 68, 0.15))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge-gold" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                <Shield size={13} /> System Administrator & Team Captain Hub
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              Rishabh Kumar Sinha's Admin Control Panel 🛡️
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: 0 }}>
              Verify and approve new team member account requests, manage active team roster credentials, and enforce team access policies.
            </p>
          </div>

          {/* Admin Stats Pill */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Pending Requests</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: pendingArchers.length > 0 ? '#ef4444' : '#38bdf8' }}>
                {pendingArchers.length} Request{pendingArchers.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(5, 150, 105, 0.3)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Active Archers</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
                {archers.length} Team Members
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Management Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Section 1: Pending New Archer Registration Requests */}
        <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(15, 23, 42, 0.7)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f87171', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserCheck size={22} color="#f87171" /> Pending New Archer Registration Requests
              {pendingArchers.length > 0 && (
                <span style={{ background: '#ef4444', color: '#ffffff', fontSize: '0.8rem', padding: '3px 12px', borderRadius: '12px', fontWeight: 800 }}>
                  {pendingArchers.length} Pending
                </span>
              )}
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>🔒 Exclusive Admin Control (Rishabh Kumar Sinha)</span>
          </div>

          {pendingArchers.length === 0 ? (
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '24px', borderRadius: '12px', border: '1px border-dashed rgba(148, 163, 184, 0.2)', textAlign: 'center', color: '#94a3b8', fontSize: '0.92rem' }}>
              ✅ All new archer registration requests have been reviewed. No pending requests at this moment.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pendingArchers.map(pa => (
                <div key={pa.id} style={{ background: 'rgba(15, 23, 42, 0.85)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>{pa.name}</span>
                      <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '6px', fontWeight: 700, border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                        {pa.category}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                      <span>💼 <strong>Occupation:</strong> {pa.occupation}</span>
                      <span>🎂 <strong>DOB:</strong> {pa.dob || 'Not specified'}</span>
                      <span>🎯 <strong>Practicing:</strong> {pa.currentlyPracticing}</span>
                      <span>🔑 <strong>Requested Password:</strong> <code style={{ color: '#fbbf24', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>{pa.password}</code></span>
                      <span>🔒 <strong>Security Answer:</strong> {pa.securityAnswer}</span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
                      Submitted on {pa.requestDate || 'Recently'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Approve registration request for "${pa.name}"? They will become an official active archer on the team.`)) {
                          onApproveArcher && onApproveArcher(pa);
                        }
                      }}
                      className="btn-gold"
                      style={{ background: 'linear-gradient(135deg, #059669, #10b981)', border: 'none', color: '#ffffff', gap: '8px', padding: '10px 18px', fontSize: '0.9rem', fontWeight: 700 }}
                    >
                      <CheckCircle2 size={18} /> Approve Archer
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Reject registration request for "${pa.name}"?`)) {
                          onRejectArcher && onRejectArcher(pa.id);
                        }
                      }}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', borderRadius: '10px', cursor: 'pointer', padding: '10px 16px', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Trash2 size={16} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Active Team Members Management */}
        <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h4 style={{ fontSize: '1.15rem', color: '#38bdf8', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} /> Active Team Roster ({archers.length} Members)
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {archers.map(a => (
              <div key={a.id} style={{ background: 'rgba(15,23,42,0.6)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={a.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"} 
                  alt={a.name} 
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{a.category} • {a.occupation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
