import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function CinematicIntro({ onComplete }) {
  // Phase 1: Text 'WELCOME' (0.4s - 2.8s) with Fade In & Fade Out
  // Phase 2: Text 'to the official portal of' (3.0s - 5.4s) with Fade In & Fade Out
  // Phase 3: Perfect Heritage Archery Logo + 'THE HERITAGE ARCHERY' + 'College Team Portal' + ENTER PORTAL (5.6s - end)
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

    // Phase 3: Title + Perfect Logo
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
          ? 'radial-gradient(circle, rgba(251, 191, 36, 0.22) 0%, rgba(5, 150, 105, 0.15) 40%, transparent 70%)'
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
        minHeight: '380px',
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

        {/* Phase 3: PERFECT HIGH-PRECISION OFFICIAL HERITAGE ARCHERY LOGO + TITLE */}
        {phase === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', zIndex: 20 }}>
            
            {/* PERFECT HIGH-PRECISION 3D GOLDEN ARCHER LOGO */}
            <div style={{ position: 'relative', width: '190px', height: '190px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="190" height="190" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 12px 35px rgba(251, 191, 36, 0.55))' }}>
                <defs>
                  {/* 3D Sphere Head Radial Gradient */}
                  <radialGradient id="logoHeadSphere" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="35%" stopColor="#f59e0b" />
                    <stop offset="70%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#78350f" />
                  </radialGradient>

                  {/* Metallic Golden Body Linear Gradient */}
                  <linearGradient id="logoBodyGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="30%" stopColor="#fbbf24" />
                    <stop offset="70%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#92400e" />
                  </linearGradient>

                  {/* Pure Crisp White Arrow & String Gradient */}
                  <linearGradient id="whiteArrowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </linearGradient>
                </defs>

                {/* Ambient Soft Gold Background Glow Circle */}
                <circle cx="100" cy="100" r="85" fill="rgba(251, 191, 36, 0.08)" filter="blur(15px)" />

                {/* 1. Glossy 3D Golden Spherical Head (Top Right) */}
                <circle cx="130" cy="50" r="16" fill="url(#logoHeadSphere)" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.4))" />

                {/* 2. Golden Torso / Chest Shell */}
                <path 
                  d="M 115 65 C 130 68, 145 80, 140 92 C 125 90, 100 82, 90 75 C 95 68, 105 65, 115 65 Z" 
                  fill="url(#logoBodyGold)" 
                />

                {/* 3. Golden Curved Recurve Bow Limb (Left Side Crescent) */}
                <path 
                  d="M 100 25 C 55 55, 50 120, 85 165 C 75 125, 70 65, 100 25 Z" 
                  fill="url(#logoBodyGold)" 
                />

                {/* 4. White Taut Bowstring (Connecting Top Bow Tip to Bottom Bow Tip) */}
                <line x1="100" y1="25" x2="85" y2="165" stroke="url(#whiteArrowGrad)" strokeWidth="3" strokeLinecap="round" />

                {/* 5. White Arrow Resting on Bow (Pointing Top-Left) */}
                <polygon points="50,60 66,50 64,68" fill="#ffffff" />
                <line x1="58" y1="58" x2="135" y2="92" stroke="url(#whiteArrowGrad)" strokeWidth="3.5" strokeLinecap="round" />

                {/* 6. Two Tapered Flowing Golden Legs (Lower Body) */}
                <path 
                  d="M 105 85 C 98 120, 92 155, 88 190 C 94 182, 104 140, 112 92 Z" 
                  fill="url(#logoBodyGold)" 
                />
                <path 
                  d="M 116 88 C 122 120, 130 155, 126 195 C 132 175, 136 130, 122 86 Z" 
                  fill="url(#logoBodyGold)" 
                />
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
                marginTop: '6px',
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
