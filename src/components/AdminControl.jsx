import React, { useState } from 'react';
import { Shield, UserCheck, Trash2, CheckCircle2, Users, Key, Calendar, Briefcase, Award, MessageSquare, Mail, Phone, Copy, Check, ExternalLink, Filter, HelpCircle } from 'lucide-react';

export default function AdminControl({ 
  archers = [], 
  pendingArchers = [], 
  inquiries = [], 
  onApproveArcher, 
  onRejectArcher,
  onDeleteInquiry,
  onToggleInquiryStatus,
  setActiveTab
}) {
  const [inquiryFilter, setInquiryFilter] = useState('all'); // 'all', 'new', 'resolved'
  const [copiedId, setCopiedId] = useState(null);

  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  const filteredInquiries = inquiries.filter(inq => {
    if (inquiryFilter === 'new') return inq.status === 'new';
    if (inquiryFilter === 'resolved') return inq.status === 'resolved';
    return true;
  });

  const handleCopyContact = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
              Manage team registration requests, review public & student inquiries, manage active team roster credentials, and enforce team access policies.
            </p>
          </div>

          {/* Admin Stats Pills */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Pending Requests</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: pendingArchers.length > 0 ? '#ef4444' : '#38bdf8' }}>
                {pendingArchers.length} Request{pendingArchers.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Received Inquiries</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: newInquiriesCount > 0 ? '#fbbf24' : '#34d399' }}>
                {inquiries.length} ({newInquiriesCount} New)
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

        {/* Section 2: Received Public & Student Inquiries Hub */}
        <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(251, 191, 36, 0.35)', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(217, 119, 6, 0.08))' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fbbf24', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={22} color="#fbbf24" /> Received Team & Public Inquiries
                {newInquiriesCount > 0 && (
                  <span style={{ background: '#d97706', color: '#ffffff', fontSize: '0.8rem', padding: '3px 12px', borderRadius: '12px', fontWeight: 800 }}>
                    {newInquiriesCount} New
                  </span>
                )}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                All questions, range inquiries, and registration help messages submitted by students, parents, or guests from the Contact Us form.
              </p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <button
                type="button"
                onClick={() => setInquiryFilter('all')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: inquiryFilter === 'all' ? '#fbbf24' : 'transparent',
                  color: inquiryFilter === 'all' ? '#090d16' : '#94a3b8'
                }}
              >
                All ({inquiries.length})
              </button>
              <button
                type="button"
                onClick={() => setInquiryFilter('new')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: inquiryFilter === 'new' ? '#f59e0b' : 'transparent',
                  color: inquiryFilter === 'new' ? '#ffffff' : '#94a3b8'
                }}
              >
                New ({newInquiriesCount})
              </button>
              <button
                type="button"
                onClick={() => setInquiryFilter('resolved')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: inquiryFilter === 'resolved' ? '#10b981' : 'transparent',
                  color: inquiryFilter === 'resolved' ? '#ffffff' : '#94a3b8'
                }}
              >
                Resolved ({inquiries.length - newInquiriesCount})
              </button>
            </div>
          </div>

          {filteredInquiries.length === 0 ? (
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '32px', borderRadius: '14px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center', color: '#94a3b8' }}>
              <HelpCircle size={32} color="#64748b" style={{ marginBottom: '8px' }} />
              <p style={{ margin: 0, fontSize: '0.94rem' }}>No inquiries found in this category.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredInquiries.map(inq => {
                const isEmail = inq.emailOrPhone && inq.emailOrPhone.includes('@');
                const isNew = inq.status === 'new';

                return (
                  <div 
                    key={inq.id} 
                    style={{ 
                      background: 'rgba(15, 23, 42, 0.85)', 
                      padding: '20px', 
                      borderRadius: '16px', 
                      border: isNew ? '1px solid rgba(251, 191, 36, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)', 
                      boxShadow: isNew ? '0 4px 20px rgba(251, 191, 36, 0.15)' : 'none'
                    }}
                  >
                    {/* Header Row: Name, Category, Status, Date */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>{inq.name}</span>
                        <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '6px', fontWeight: 700, border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                          {inq.userType || 'Student / Guest'}
                        </span>
                        <span style={{ 
                          background: isNew ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)', 
                          color: isNew ? '#fbbf24' : '#34d399', 
                          fontSize: '0.75rem', 
                          padding: '3px 10px', 
                          borderRadius: '6px', 
                          fontWeight: 700, 
                          border: isNew ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)' 
                        }}>
                          {isNew ? '⚡ New Inquiry' : '✅ Resolved'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        📅 {inq.date || 'Recently'}
                      </div>
                    </div>

                    {/* Subject & Contact Details Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                      <span style={{ background: 'rgba(217, 119, 6, 0.2)', color: '#fde68a', fontSize: '0.8rem', padding: '4px 12px', borderRadius: '8px', fontWeight: 700, border: '1px solid rgba(217, 119, 6, 0.3)' }}>
                        Subject: {inq.subject || 'General Inquiry'}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.4)', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.84rem', color: '#cbd5e1' }}>
                        {isEmail ? <Mail size={14} color="#38bdf8" /> : <Phone size={14} color="#34d399" />}
                        <strong style={{ color: '#ffffff' }}>{inq.emailOrPhone}</strong>
                        <button
                          type="button"
                          onClick={() => handleCopyContact(inq.id, inq.emailOrPhone)}
                          style={{ background: 'transparent', border: 'none', color: copiedId === inq.id ? '#34d399' : '#94a3b8', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                          title="Copy Contact Info"
                        >
                          {copiedId === inq.id ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>

                      {/* Quick Contact Action Button */}
                      {isEmail ? (
                        <a
                          href={`mailto:${inq.emailOrPhone}?subject=Re: ${encodeURIComponent(inq.subject || 'Heritage Archery Inquiry')}`}
                          style={{ fontSize: '0.78rem', color: '#38bdf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
                        >
                          Send Email <ExternalLink size={12} />
                        </a>
                      ) : (
                        <a
                          href={`https://wa.me/${inq.emailOrPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '0.78rem', color: '#34d399', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
                        >
                          WhatsApp / Call <ExternalLink size={12} />
                        </a>
                      )}
                    </div>

                    {/* Inquiry Content Box */}
                    <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '14px 16px', borderRadius: '12px', color: '#f1f5f9', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '16px' }}>
                      "{inq.message}"
                    </div>

                    {/* Action Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => onToggleInquiryStatus && onToggleInquiryStatus(inq.id)}
                          className={isNew ? "btn-emerald" : "btn-ghost"}
                          style={{ padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700, gap: '6px' }}
                        >
                          <CheckCircle2 size={16} /> {isNew ? 'Mark as Resolved' : 'Mark as New'}
                        </button>

                        {setActiveTab && (
                          <button
                            type="button"
                            onClick={() => setActiveTab('chat')}
                            className="btn-ghost"
                            style={{ padding: '8px 14px', fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)', gap: '6px' }}
                          >
                            <MessageSquare size={16} /> DM in Team Chat
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete inquiry from "${inq.name}"?`)) {
                            onDeleteInquiry && onDeleteInquiry(inq.id);
                          }
                        }}
                        style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', padding: '8px 14px', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Trash2 size={15} /> Delete Inquiry
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 3: Active Team Members Management */}
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

