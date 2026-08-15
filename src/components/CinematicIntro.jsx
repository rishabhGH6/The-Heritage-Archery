import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function CinematicIntro({ onComplete }) {
  // Phase 1: Text 'WELCOME' (0.4s - 2.8s)
  // Phase 2: Text 'to the official portal of' (3.0s - 5.4s)
  // Phase 3: Simple Arrow + 'THE HERITAGE ARCHERY' + 'College Team Portal' + ENTER PORTAL (5.6s - end)
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    // Phase 1: WELCOME
    const t1 = setTimeout(() => {
      setPhase(1);
    }, 400);

    // Phase 2: 'to the official portal of'
    const t2 = setTimeout(() => {
      setPhase(2);
    }, 2800);

    // Phase 3: Title + Simple Arrow
    const t3 = setTimeout(() => {
      setPhase(3);
    }, 5400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: 'radial-gradient(circle at 50% 45%, #0f172a 0%, #060b13 70%, #030712 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      overflow: 'hidden',
      color: '#f8fafc',
      userSelect: 'none'
    }}>

      {/* Skip Button */}
      <button
        onClick={onComplete}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#cbd5e1',
          padding: '8px 18px',
          borderRadius: '9999px',
          fontSize: '0.82rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 100,
          backdropFilter: 'blur(10px)'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(217, 119, 6, 0.2)';
          e.target.style.borderColor = 'rgba(217, 119, 6, 0.5)';
          e.target.style.color = '#fbbf24';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.06)';
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          e.target.style.color = '#cbd5e1';
        }}
      >
        Skip Intro ✕
      </button>

      {/* Ambient Radial Glow */}
      <div style={{
        position: 'absolute',
        width: '700px',
        height: '700px',
        background: phase === 3
          ? 'radial-gradient(circle, rgba(5, 150, 105, 0.15) 0%, rgba(217, 119, 6, 0.12) 40%, transparent 70%)'
          : 'radial-gradient(circle, rgba(5, 150, 105, 0.1) 0%, rgba(217, 119, 6, 0.06) 45%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }} />

      {/* STAGE CONTAINER */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '750px',
        minHeight: '360px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>

        {/* Phase 1: WELCOME */}
        {phase === 1 && (
          <div>
            <h1 style={{
              fontSize: '3.6rem',
              fontWeight: 900,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              filter: 'drop-shadow(0 6px 20px rgba(255, 255, 255, 0.25))'
            }}>
              WELCOME
            </h1>
          </div>
        )}

        {/* Phase 2: to the official portal of */}
        {phase === 2 && (
          <div>
            <p style={{
              fontSize: '2rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              color: '#fbbf24',
              fontStyle: 'italic',
              margin: 0,
              filter: 'drop-shadow(0 4px 15px rgba(251, 191, 36, 0.35))'
            }}>
              to the official portal of
            </p>
          </div>
        )}

        {/* Phase 3: SIMPLE ARROW + THE HERITAGE ARCHERY */}
        {phase === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', zIndex: 20 }}>
            
            {/* SIMPLE DARK SLATE FORGED BODKIN ARROW (STATIC - NO ANIMATIONS) */}
            <div style={{ position: 'relative', width: '420px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="420" height="60" viewBox="0 0 440 70" style={{ filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.8))' }}>
                <defs>
                  {/* Dark Slate Forged Iron Gradient */}
                  <linearGradient id="simpleSlateMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="35%" stopColor="#334155" />
                    <stop offset="70%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>

                  {/* Steel Highlight Edge */}
                  <linearGradient id="simpleSlateEdge" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#475569" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
                  </linearGradient>
                </defs>

                {/* 1. Angular Dark Feather Fletchings at Tail */}
                <g transform="translate(10, 10)">
                  <polygon points="0,25 90,0 80,25" fill="url(#simpleSlateMetal)" stroke="#64748b" strokeWidth="1" />
                  <polygon points="0,25 90,50 80,25" fill="url(#simpleSlateMetal)" stroke="#64748b" strokeWidth="1" />
                  
                  {[...Array(14)].map((_, i) => (
                    <line 
                      key={i} 
                      x1={10 + i * 5} 
                      y1={i < 7 ? 22 - i * 2.5 : 22 - (14 - i) * 2.5} 
                      x2={14 + i * 5} 
                      y2={25} 
                      stroke="#94a3b8" 
                      strokeWidth="0.8" 
                      opacity="0.7"
                    />
                  ))}
                  {[...Array(14)].map((_, i) => (
                    <line 
                      key={`b-${i}`} 
                      x1={10 + i * 5} 
                      y1={i < 7 ? 28 + i * 2.5 : 28 + (14 - i) * 2.5} 
                      x2={14 + i * 5} 
                      y2={25} 
                      stroke="#94a3b8" 
                      strokeWidth="0.8" 
                      opacity="0.7"
                    />
                  ))}
                </g>

                {/* 2. Double-Ridged Collar Rings */}
                <g transform="translate(100, 27)">
                  <rect x="0" y="0" width="6" height="16" rx="2" fill="url(#simpleSlateEdge)" stroke="#0f172a" strokeWidth="0.8" />
                  <rect x="9" y="0" width="6" height="16" rx="2" fill="url(#simpleSlateEdge)" stroke="#0f172a" strokeWidth="0.8" />
                  <rect x="18" y="0" width="6" height="16" rx="2" fill="url(#simpleSlateEdge)" stroke="#0f172a" strokeWidth="0.8" />
                </g>

                {/* 3. Dark Matte Forged Iron Shaft */}
                <rect x="130" y="32" width="230" height="6" rx="2" fill="url(#simpleSlateMetal)" stroke="#0f172a" strokeWidth="1" />
                <line x1="130" y1="33" x2="360" y2="33" stroke="#cbd5e1" strokeWidth="1" opacity="0.6" />

                {/* 4. Conical Steel Armor-Piercing Bodkin Point */}
                <g transform="translate(360, 28)">
                  <path d="M 0 0 L 22 7 L 0 14 Z" fill="url(#simpleSlateEdge)" stroke="#0f172a" strokeWidth="1" />
                  <polygon points="22,2 50,7 22,12" fill="url(#simpleSlateEdge)" stroke="#ffffff" strokeWidth="0.8" />
                  <line x1="22" y1="7" x2="50" y2="7" stroke="#ffffff" strokeWidth="1" />
                </g>
              </svg>
            </div>

            {/* Title: THE HERITAGE ARCHERY */}
            <h1 className="metallic-text-shine" style={{
              fontSize: '3.3rem',
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              margin: 0,
              lineHeight: 1.1
            }}>
              THE HERITAGE ARCHERY
            </h1>

            {/* Subtitle: College Team Portal */}
            <div style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#34d399',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              background: 'rgba(5, 150, 105, 0.15)',
              border: '1px solid rgba(5, 150, 105, 0.4)',
              padding: '5px 20px',
              borderRadius: '9999px',
              boxShadow: '0 4px 20px rgba(5, 150, 105, 0.25)'
            }}>
              College Team Portal
            </div>

            {/* Tagline: Made by Archers for Archers */}
            <p style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#fbbf24',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}>
              <span style={{ height: '1px', width: '36px', background: 'rgba(251, 191, 36, 0.4)' }} />
              Made by Archers for Archers
              <span style={{ height: '1px', width: '36px', background: 'rgba(251, 191, 36, 0.4)' }} />
            </p>

            {/* ENTER PORTAL Button */}
            <button
              onClick={onComplete}
              className="btn-gold"
              style={{
                marginTop: '10px',
                padding: '14px 44px',
                fontSize: '1.05rem',
                borderRadius: '9999px',
                boxShadow: '0 10px 35px rgba(217, 119, 6, 0.5)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: 800
              }}
            >
              ENTER PORTAL <ArrowRight size={20} />
            </button>

          </div>
        )}

      </div>

    </div>
  );
}
