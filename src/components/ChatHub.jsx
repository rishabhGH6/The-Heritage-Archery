import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, User, Shield, Lock, Hash, Search, Smile, Sparkles, LogIn, Circle } from 'lucide-react';

export default function ChatHub({ currentUser, archers = [], coach, chatMessages = [], onSendMessage, onSwitchUser }) {
  const [activeChannel, setActiveChannel] = useState('general'); // 'general', 'coach', or archerId
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [reactionsMap, setReactionsMap] = useState({}); // { [msgId]: { [emoji]: count } }
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat on new message or channel change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeChannel]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (currentUser.role === 'guest') {
      alert("🔒 Guest Mode: Please log in or register your archer account to send messages!");
      return;
    }

    const now = new Date();
    const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    onSendMessage({
      id: "c_" + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      recipientId: activeChannel === 'general' ? 'all' : activeChannel,
      text: inputText.trim(),
      timestamp: timestampStr,
      channel: activeChannel
    });

    setInputText('');
  };

  const handleAddReaction = (msgId, emoji) => {
    setReactionsMap(prev => {
      const msgReactions = prev[msgId] || {};
      const currentCount = msgReactions[emoji] || 0;
      return {
        ...prev,
        [msgId]: {
          ...msgReactions,
          [emoji]: currentCount + 1
        }
      };
    });
  };

  // Filter messages for current channel with strict privacy logic
  const filteredMessages = chatMessages.filter(m => {
    if (activeChannel === 'general') {
      return m.channel === 'general' || m.recipientId === 'all';
    }

    // Private DM Filtering: Message must be strictly between currentUser and activeChannel contact
    const isSentByMeToContact = (m.senderId === currentUser.id) && (m.channel === activeChannel || m.recipientId === activeChannel);
    const isSentByContactToMe = (m.senderId === activeChannel) && (m.channel === currentUser.id || m.recipientId === currentUser.id);

    return isSentByMeToContact || isSentByContactToMe;
  });

  // Filter archer list based on search query
  const filteredArchers = archers.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.category && a.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeContactName = activeChannel === 'general' 
    ? '#general-team' 
    : activeChannel === 'coach' 
      ? coach?.name || 'Coach Jayanta' 
      : archers.find(a => a.id === activeChannel)?.name || 'Teammate';

  const isGuest = currentUser.role === 'guest';

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
            Connect with Heritage Archery teammates and send direct messages to Head Coach Jayanta.
          </p>
        </div>
      </div>

      {/* GUEST MODE LOCKED BANNER (If Guest, do NOT show any messages or message input options!) */}
      {isGuest ? (
        <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px', maxWidth: '640px', margin: '20px auto' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(217, 119, 6, 0.15)',
            border: '1px solid rgba(217, 119, 6, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24',
            boxShadow: '0 8px 25px rgba(217, 119, 6, 0.3)'
          }}>
            <Lock size={32} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px 0' }}>
              Direct Messaging & Team Chat Locked
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '480px', lineHeight: 1.5, margin: 0 }}>
              You are currently viewing in <strong>Guest Mode</strong>. Messages, announcements, and direct messaging with players and Coach Jayanta are restricted to registered team members.
            </p>
          </div>

          <button
            onClick={() => onSwitchUser && onSwitchUser({ role: 'guest', id: 'guest', name: 'Guest' })}
            className="btn-gold"
            style={{
              padding: '12px 32px',
              fontSize: '0.95rem',
              borderRadius: '9999px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '8px'
            }}
          >
            <LogIn size={18} /> Log In / Sign Up to Join Team Chat
          </button>
        </div>
      ) : (
        /* MAIN CHAT CONTAINER (For Logged In Archer / Coach) */
        <div className="glass-card chat-responsive-grid" style={{ display: 'grid', gridTemplateColumns: '290px 1fr', height: '620px', overflow: 'hidden' }}>
          
          {/* LEFT SIDEBAR: Players List & Channels (Scrollable Up and Down) */}
          <div style={{ borderRight: '1px solid var(--border-glass)', background: 'rgba(15, 23, 42, 0.85)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', height: '100%', overflow: 'hidden' }}>
            
            {/* Search Input for Players */}
            <div style={{ position: 'relative' }}>
              <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="input-glass"
                placeholder="Search players & coach..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '36px', fontSize: '0.82rem', height: '38px', borderRadius: '10px' }}
              />
            </div>

            {/* Group Channel Tab */}
            <div>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Team Channel
              </span>
              <div style={{ marginTop: '6px' }}>
                <button
                  onClick={() => setActiveChannel('general')}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: activeChannel === 'general' ? '1px solid #34d399' : '1px solid transparent',
                    background: activeChannel === 'general' ? 'rgba(5, 150, 105, 0.2)' : 'rgba(255,255,255,0.03)',
                    color: activeChannel === 'general' ? '#34d399' : '#cbd5e1',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Hash size={16} /> #general-team
                  </div>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(5, 150, 105, 0.3)', color: '#34d399', padding: '2px 8px', borderRadius: '9999px', fontWeight: 800 }}>
                    Team
                  </span>
                </button>
              </div>
            </div>

            {/* SCROLLABLE PLAYERS LIST (Scrolls Up & Down smoothly) */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Direct Messages ({filteredArchers.length + (currentUser.role !== 'coach' ? 1 : 0)})
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Circle size={7} fill="#34d399" color="#34d399" /> Online
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  
                  {/* Coach Jayanta (Pinned at Top of DM List) */}
                  {currentUser.role !== 'coach' && (!searchQuery || 'coach jayanta'.includes(searchQuery.toLowerCase())) && (
                    <button
                      onClick={() => setActiveChannel('coach')}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: activeChannel === 'coach' ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.04)',
                        background: activeChannel === 'coach' ? 'rgba(217, 119, 6, 0.22)' : 'rgba(255,255,255,0.02)',
                        color: activeChannel === 'coach' ? '#fbbf24' : '#f8fafc',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ position: 'relative' }}>
                          <img 
                            src={coach?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"} 
                            alt="Coach" 
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #d97706' }} 
                          />
                          <span style={{ position: 'absolute', bottom: 0, right: 0, width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', border: '1.5px solid #0f172a' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.1 }}>
                            Coach Jayanta
                          </div>
                          <span style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 600 }}>
                            Head Coach 🛡️
                          </span>
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Archer DM List */}
                  {filteredArchers.filter(a => a.id !== currentUser.id).map(a => {
                    const isSelected = activeChannel === a.id;

                    return (
                      <button
                        key={a.id}
                        onClick={() => setActiveChannel(a.id)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: isSelected ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.04)',
                          background: isSelected ? 'rgba(5, 150, 105, 0.18)' : 'rgba(255,255,255,0.02)',
                          color: isSelected ? '#34d399' : '#cbd5e1',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ position: 'relative' }}>
                            <img 
                              src={a.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"} 
                              alt={a.name} 
                              style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #059669' }} 
                            />
                            <span style={{ position: 'absolute', bottom: 0, right: 0, width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', border: '1.5px solid #0f172a' }} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.1 }}>
                              {a.name}
                            </div>
                            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                              {a.category || 'Archer'}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {filteredArchers.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px 10px', color: '#64748b', fontSize: '0.8rem' }}>
                      No players found.
                    </div>
                  )}

                </div>
              </div>

            </div>

          </div>

          {/* RIGHT PANEL: CHAT HISTORY & PINNED ALWAYS-VISIBLE INPUT SLOT */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            
            {/* Header Bar */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-glass)', background: 'rgba(15,23,42,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={18} color="#fbbf24" />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: 0, lineHeight: 1.2 }}>
                    {activeContactName}
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {activeChannel === 'general' ? 'Public Team Channel • All Members' : 'Encrypted Direct Message'}
                  </span>
                </div>
              </div>

              <span className="badge-gold" style={{ fontSize: '0.7rem' }}>
                {activeChannel === 'general' ? 'Group Chat' : 'Private DM'}
              </span>
            </div>

            {/* MESSAGES SCROLL FEED */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredMessages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b', fontSize: '0.9rem' }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>💬</div>
                  No messages yet in <strong>{activeContactName}</strong>. Type a message below to start chatting!
                </div>
              ) : (
                filteredMessages.map(msg => {
                  const isSelf = msg.senderId === currentUser.id;
                  const isCoachMsg = msg.senderRole === 'coach';
                  const msgReactions = reactionsMap[msg.id] || {};

                  return (
                    <div
                      key={msg.id}
                      className="fade-in-up"
                      style={{
                        alignSelf: isSelf ? 'flex-end' : 'flex-start',
                        maxWidth: '75%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isSelf ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div style={{
                        background: isSelf 
                          ? 'linear-gradient(135deg, #059669, #047857)' 
                          : isCoachMsg 
                            ? 'rgba(217, 119, 6, 0.22)' 
                            : 'rgba(15, 23, 42, 0.9)',
                        border: isSelf 
                          ? '1px solid #34d399' 
                          : isCoachMsg 
                            ? '1px solid #fbbf24' 
                            : '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '12px 16px',
                        borderRadius: isSelf ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
                        position: 'relative'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isCoachMsg ? '#fbbf24' : '#f8fafc' }}>
                            {msg.senderName} {isCoachMsg && '🛡️ (Coach)'}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: isSelf ? '#a7f3d0' : '#94a3b8' }}>
                            {msg.timestamp}
                          </span>
                        </div>

                        <p style={{ fontSize: '0.92rem', color: '#f8fafc', lineHeight: 1.45, margin: 0, wordBreak: 'break-word' }}>
                          {msg.text}
                        </p>

                        {/* Interactive Quick Reactions Hover Bar */}
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          {['👍', '🎯', '🔥', '🏆', '❤️'].map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => handleAddReaction(msg.id, emoji)}
                              style={{
                                background: (msgReactions[emoji] || 0) > 0 ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255,255,255,0.06)',
                                border: (msgReactions[emoji] || 0) > 0 ? '1px solid rgba(251, 191, 36, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '9999px',
                                padding: '2px 8px',
                                fontSize: '0.75rem',
                                color: '#f8fafc',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <span>{emoji}</span>
                              {(msgReactions[emoji] || 0) > 0 && (
                                <span style={{ fontWeight: 800, color: '#fbbf24', fontSize: '0.7rem' }}>
                                  {msgReactions[emoji]}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ALWAYS VISIBLE PINNED MESSAGE INPUT SLOT AT BOTTOM */}
            <form 
              onSubmit={handleSend} 
              style={{ 
                padding: '16px 20px', 
                borderTop: '1px solid var(--border-glass)', 
                background: 'rgba(15, 23, 42, 0.95)', 
                backdropFilter: 'blur(12px)',
                display: 'flex', 
                gap: '12px',
                flexShrink: 0,
                position: 'sticky',
                bottom: 0,
                zIndex: 10
              }}
            >
              <input
                type="text"
                className="input-glass"
                placeholder={`Message ${activeContactName}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ height: '46px', fontSize: '0.92rem', borderRadius: '12px' }}
              />
              <button 
                type="submit" 
                className="btn-emerald" 
                style={{ 
                  padding: '0 26px', 
                  height: '46px', 
                  borderRadius: '12px', 
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(5, 150, 105, 0.4)'
                }}
              >
                <Send size={18} /> Send
              </button>
            </form>

          </div>

        </div>
      )}

    </div>
  );
}
