import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function CinematicIntro({ onComplete }) {
  // Phase 1: Text 'WELCOME' (0.4s - 2.8s) with Fade In & Fade Out
  // Phase 2: Text 'to the official portal of' (3.0s - 5.4s) with Fade In & Fade Out
  // Phase 3: Archer with Bow Crest + 'THE HERITAGE ARCHERY' + 'College Team Portal' + ENTER PORTAL (5.6s - end)
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

    // Phase 3: Title + Archer with Bow Emblem
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

        {/* Phase 3: HERO ARCHER WITH BOW CREST + THE HERITAGE ARCHERY */}
        {phase === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', zIndex: 20 }}>
            
            {/* HERO ARCHER WITH BOW SILHOUETTE CREST (Matching user image) */}
            <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="180" height="180" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 10px 30px rgba(217, 119, 6, 0.65))' }}>
                <defs>
                  {/* Rich Metallic Gold Gradient */}
                  <linearGradient id="archerGoldMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="35%" stopColor="#fbbf24" />
                    <stop offset="70%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#78350f" />
                  </linearGradient>

                  <linearGradient id="bowGleam" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
                    <stop offset="100%" stopColor="#b45309" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Archer Body & Bow Silhouette Emblem Group */}
                <g fill="url(#archerGoldMetal)">
                  
                  {/* 1. Recurve Bow Curve Limbs */}
                  <path 
                    d="M 95 20 Q 40 45, 45 140 Q 42 148, 48 145 C 55 100, 75 55, 95 20 Z" 
                    fill="url(#bowGleam)" 
                  />
                  <path 
                    d="M 45 145 Q 60 110, 120 70 L 115 65 Q 55 105, 45 145 Z" 
                    fill="url(#archerGoldMetal)" 
                  />

                  {/* 2. Taut Bowstring */}
                  <line x1="95" y1="20" x2="120" y2="70" stroke="#fde047" strokeWidth="2.5" />
                  <line x1="45" y1="145" x2="120" y2="70" stroke="#fde047" strokeWidth="2.5" />

                  {/* 3. Nocked Arrow (Pointing Upwards-Left along Bow Aim) */}
                  <path d="M 22 25 L 34 37 L 28 41 Z" fill="#ffffff" />
                  <line x1="28" y1="31" x2="135" y2="85" stroke="#ffffff" strokeWidth="3" />

                  {/* 4. Archer Head & Neck */}
                  <circle cx="125" cy="62" r="16" />

                  {/* 5. Archer Torso, Shoulder & Arms in Full Draw Stance */}
                  {/* Bow Arm extending to bow handle */}
                  <path d="M 115 72 C 90 60, 65 50, 50 45 C 45 43, 40 48, 45 52 C 60 58, 85 70, 110 82 Z" />
                  
                  {/* Drawing Arm pulling back string to anchor point */}
                  <path d="M 135 68 C 150 78, 165 92, 175 98 C 178 100, 182 95, 178 90 C 168 82, 150 70, 132 60 Z" />

                  {/* Muscular Back & Torso contours */}
                  <path d="M 110 78 Q 115 105, 100 135 C 95 145, 90 160, 80 170 C 85 168, 95 150, 105 130 C 115 110, 128 90, 125 75 Z" />
                  <path d="M 125 75 C 138 90, 155 115, 145 135 C 135 155, 120 175, 110 180 C 122 170, 145 145, 155 120 C 165 98, 145 78, 125 75 Z" />

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
