import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function CinematicIntro({ onComplete }) {
  // Phase 1: Text 'WELCOME' (0.4s - 2.8s) with Fade In & Fade Out
  // Phase 2: Text 'to the official portal of' (3.0s - 5.4s) with Fade In & Fade Out
  // Phase 3: Golden Shiny Arrow (Straight Feather Lines) + 'THE HERITAGE ARCHERY' + 'College Team Portal' + ENTER PORTAL (5.6s - end)
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    // Phase 1: WELCOME
    const t1 = setTimeout(() => {
      setPhase(1);
    }, 400);

    // Phase 2: 'to the official portal of'
    const t2 = setTimeout(() => {
      setPhase(2);
    }, 2900);

    // Phase 3: Title + Golden Arrow
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

      {/* Ambient Gold Radial Glow */}
      <div style={{
        position: 'absolute',
        width: '750px',
        height: '750px',
        background: phase === 3
          ? 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, rgba(5, 150, 105, 0.12) 40%, transparent 70%)'
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

        {/* Phase 1: WELCOME (with Fade In & Fade Out) */}
        {phase === 1 && (
          <div className="intro-text-fade">
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

        {/* Phase 2: to the official portal of (with Fade In & Fade Out) */}
        {phase === 2 && (
          <div className="intro-text-fade">
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

        {/* Phase 3: GOLDEN SHINY ARROW (Straight Feather Lines) + THE HERITAGE ARCHERY */}
        {phase === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', zIndex: 20 }}>
            
            {/* ELEGANT STUNNING GOLDEN SHINY ARCHERY ARROW (STRAIGHT LINE FEATHERS ON LEFT, POINT ON RIGHT) */}
            <div style={{ position: 'relative', width: '420px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="420" height="60" viewBox="0 0 440 70" style={{ filter: 'drop-shadow(0 10px 25px rgba(217, 119, 6, 0.6))' }}>
                <defs>
                  {/* Rich Metallic Gold Gradient */}
                  <linearGradient id="goldShineMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="30%" stopColor="#f59e0b" />
                    <stop offset="65%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#78350f" />
                  </linearGradient>

                  {/* Specular Highlight Sheen Gradient */}
                  <linearGradient id="goldHighlightShine" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="45%" stopColor="#fbbf24" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#b45309" stopOpacity="1" />
                  </linearGradient>

                  {/* Cross-Hatch Grip Pattern */}
                  <pattern id="goldCrossHatch" width="8" height="8" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="8" y2="8" stroke="#78350f" strokeWidth="1.2" />
                    <line x1="8" y1="0" x2="0" y2="8" stroke="#78350f" strokeWidth="1.2" />
                  </pattern>
                </defs>

                {/* 1. Golden Feather Fletchings in STRAIGHT LINES at Tail (Left Side) */}
                <g transform="translate(10, 10)">
                  {/* Upper Straight Vane */}
                  <polygon points="0,25 90,0 80,25" fill="url(#goldHighlightShine)" stroke="#78350f" strokeWidth="1" />
                  {/* Lower Straight Vane */}
                  <polygon points="0,25 90,50 80,25" fill="url(#goldHighlightShine)" stroke="#78350f" strokeWidth="1" />
                  
                  {/* Straight Feather Ribs Texture Lines */}
                  {[...Array(14)].map((_, i) => (
                    <line 
                      key={i} 
                      x1={10 + i * 5} 
                      y1={i < 7 ? 22 - i * 2.5 : 22 - (14 - i) * 2.5} 
                      x2={14 + i * 5} 
                      y2={25} 
                      stroke="#92400e" 
                      strokeWidth="0.8" 
                    />
                  ))}
                  {[...Array(14)].map((_, i) => (
                    <line 
                      key={`b-${i}`} 
                      x1={10 + i * 5} 
                      y1={i < 7 ? 28 + i * 2.5 : 28 + (14 - i) * 2.5} 
                      x2={14 + i * 5} 
                      y2={25} 
                      stroke="#92400e" 
                      strokeWidth="0.8" 
                    />
                  ))}
                </g>

                {/* 2. Golden Metallic Shaft (Middle) */}
                <rect x="95" y="32" width="240" height="6" rx="3" fill="url(#goldHighlightShine)" stroke="#78350f" strokeWidth="0.8" />
                <line x1="95" y1="33" x2="335" y2="33" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.9" />

                {/* 3. Ornamental Cross-Hatched Collar Ring */}
                <g transform="translate(185, 27)">
                  <rect x="0" y="0" width="35" height="16" rx="3" fill="url(#goldShineMetal)" stroke="#78350f" strokeWidth="1" />
                  <rect x="2" y="2" width="31" height="12" fill="url(#goldCrossHatch)" opacity="0.85" />
                  <line x1="0" y1="0" x2="0" y2="16" stroke="#fef08a" strokeWidth="2" />
                  <line x1="35" y1="0" x2="35" y2="16" stroke="#fef08a" strokeWidth="2" />
                </g>

                {/* 4. Collar Neck Rings near Arrowhead */}
                <g transform="translate(330, 28)">
                  <rect x="0" y="0" width="4" height="14" rx="1" fill="#fde047" stroke="#78350f" strokeWidth="0.8" />
                  <rect x="6" y="0" width="4" height="14" rx="1" fill="#fde047" stroke="#78350f" strokeWidth="0.8" />
                  <rect x="12" y="0" width="4" height="14" rx="1" fill="#fde047" stroke="#78350f" strokeWidth="0.8" />
                </g>

                {/* 5. Broadhead Arrowhead Tip (Right Side Head) */}
                <g transform="translate(350, 15)">
                  <path 
                    d="M 0 20 L 22 0 L 70 20 L 22 40 Z" 
                    fill="url(#goldHighlightShine)" 
                    stroke="#78350f" 
                    strokeWidth="1.5"
                  />
                  {/* Arrowhead Center Ridge Line & Specular Highlight */}
                  <line x1="0" y1="20" x2="70" y2="20" stroke="#ffffff" strokeWidth="1.8" />
                  <path d="M 22 0 L 70 20 L 22 20 Z" fill="rgba(255, 255, 255, 0.35)" />
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

      {/* Text Fade In & Fade Out Keyframe Animations */}
      <style>{`
        @keyframes textFadeInOut {
          0% { opacity: 0; transform: translateY(10px) scale(0.96); }
          25% { opacity: 1; transform: translateY(0px) scale(1); }
          75% { opacity: 1; transform: translateY(0px) scale(1); }
          100% { opacity: 0; transform: translateY(-10px) scale(1.02); }
        }

        .intro-text-fade {
          animation: textFadeInOut 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

    </div>
  );
}
