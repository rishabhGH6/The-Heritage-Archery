import React, { useState } from 'react';
import { MessageSquare, Send, User, Shield, Lock, Hash } from 'lucide-react';

export default function ChatHub({ currentUser, archers, coach, chatMessages, onSendMessage }) {
  const [activeChannel, setActiveChannel] = useState('general'); // 'general' or archerId
  const [inputText, setInputText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const now = new Date();
    const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    onSendMessage({
      id: "c_" + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text: inputText.trim(),
      timestamp: timestampStr,
      channel: activeChannel
    });

    setInputText('');
  };

  // Filter messages for current selected channel/DM
  const filteredMessages = chatMessages.filter(m => {
    if (activeChannel === 'general') return m.channel === 'general';
    // DM logic: channel is target id or sender/recipient combo
    return m.channel === activeChannel || (m.senderId === activeChannel && m.channel === currentUser.id);
  });

  return (
    <div style={{ marginBottom: '32px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-emerald">
              <MessageSquare size={13} /> Team Communication Portal
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
            Group Chat & Direct Messaging (DM) 💬
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Chat with the entire Heritage team or send private direct messages to Coach Jayanta and teammates.
          </p>
        </div>
      </div>

      {/* Main Chat Layout: Sidebar + Messages Box */}
      <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', height: '560px', overflow: 'hidden' }} className="chat-responsive-grid">
        
        {/* Left Sidebar: Channels & DM Contacts */}
        <div style={{ borderRight: '1px solid var(--border-glass)', background: 'rgba(15, 23, 42, 0.8)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Group Channels
            </span>
            <div style={{ marginTop: '8px' }}>
              <button
                onClick={() => setActiveChannel('general')}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: activeChannel === 'general' ? '1px solid #34d399' : '1px solid transparent',
                  background: activeChannel === 'general' ? 'rgba(5, 150, 105, 0.2)' : 'transparent',
                  color: activeChannel === 'general' ? '#34d399' : '#cbd5e1',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Hash size={16} /> #general-team
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Direct Messages (DMs)
            </span>

            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              
              {/* Coach Jayanta DM */}
              {currentUser.role !== 'coach' && (
                <button
                  onClick={() => setActiveChannel('coach')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: activeChannel === 'coach' ? '1px solid #fbbf24' : '1px solid transparent',
                    background: activeChannel === 'coach' ? 'rgba(217, 119, 6, 0.2)' : 'transparent',
                    color: activeChannel === 'coach' ? '#fbbf24' : '#cbd5e1',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Shield size={16} color="#fbbf24" /> Coach Jayanta (DM)
                </button>
              )}

              {/* Archer DM list */}
              {archers.filter(a => a.id !== currentUser.id).map(a => (
                <button
                  key={a.id}
                  onClick={() => setActiveChannel(a.id)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: activeChannel === a.id ? '1px solid #34d399' : '1px solid transparent',
                    background: activeChannel === a.id ? 'rgba(5, 150, 105, 0.15)' : 'transparent',
                    color: activeChannel === a.id ? '#34d399' : '#cbd5e1',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <User size={15} color="#94a3b8" /> {a.name}
                </button>
              ))}

            </div>
          </div>

        </div>

        {/* Right Messages Area */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Channel Header Bar */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-glass)', background: 'rgba(15,23,42,0.9)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="#fbbf24" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
              {activeChannel === 'general' ? '#general-team Chat' : `Direct Message with ${activeChannel === 'coach' ? 'Coach Jayanta Chakraborty' : archers.find(a => a.id === activeChannel)?.name || 'Teammate'}`}
            </h3>
          </div>

          {/* Messages Feed */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredMessages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '0.9rem' }}>
                No messages yet in this channel. Say hello to start the conversation! 👋
              </div>
            ) : (
              filteredMessages.map(msg => {
                const isSelf = msg.senderId === currentUser.id;
                const isCoachMsg = msg.senderRole === 'coach';

                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isSelf ? 'flex-end' : 'flex-start',
                      maxWidth: '75%',
                      background: isSelf ? 'linear-gradient(135deg, #059669, #047857)' : isCoachMsg ? 'rgba(217,119,6,0.25)' : 'rgba(15,23,42,0.85)',
                      border: isSelf ? '1px solid #34d399' : isCoachMsg ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.08)',
                      padding: '10px 14px',
                      borderRadius: isSelf ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isCoachMsg ? '#fbbf24' : '#f8fafc' }}>
                        {msg.senderName} {isCoachMsg && '🛡️ (Coach)'}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: isSelf ? '#a7f3d0' : '#94a3b8' }}>
                        {msg.timestamp}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: '#f8fafc', lineHeight: 1.4, wordBreak: 'break-word' }}>
                      {msg.text}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} style={{ padding: '16px', borderTop: '1px solid var(--border-glass)', background: 'rgba(15,23,42,0.9)', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="input-glass"
              placeholder={`Message ${activeChannel === 'general' ? '#general-team' : 'directly'}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="btn-emerald" style={{ padding: '0 20px' }}>
              <Send size={18} />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
