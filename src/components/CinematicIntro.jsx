import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function CinematicIntro({ onComplete }) {
  // Phase 1: Text 'WELCOME' (0.6s - 3.2s)
  // Phase 2: Text 'to the official portal of' (3.4s - 6.0s)
  // Phase 3: Text 'THE HERITAGE ARCHERY' + Dark Slate Metallic Bodkin Arrow Hypersonic Flight (6.2s - end)
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    // Phase 1: WELCOME
    const t1 = setTimeout(() => {
      setPhase(1);
    }, 400);

    // Phase 2: 'to the official portal of'
    const t2 = setTimeout(() => {
      setPhase(2);
    }, 3200);

    // Phase 3: 'THE HERITAGE ARCHERY' + Dark Slate Hypersonic Arrow
    const t3 = setTimeout(() => {
      setPhase(3);
      playSonicBoomSound();
    }, 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Web Audio Synthesizer for Hypersonic Sonic Snap / Friction Swoosh
  const playSonicBoomSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Atmospheric friction hypersonic swoosh
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Ignore if muted
    }
  };

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

      {/* Ambient Hypersonic Friction Glow */}
      <div style={{
        position: 'absolute',
        width: '750px',
        height: '750px',
        background: phase === 3
          ? 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(251, 191, 36, 0.15) 35%, transparent 70%)'
          : 'radial-gradient(circle, rgba(5, 150, 105, 0.12) 0%, rgba(217, 119, 6, 0.08) 45%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(70px)',
        transition: 'all 0.8s ease',
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

        {/* Phase 1: WELCOME */}
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

        {/* Phase 2: to the official portal of */}
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

        {/* Phase 3: THE HERITAGE ARCHERY + HYPERSONIC ESCAPE-VELOCITY DARK SLATE ARROW */}
        {phase === 3 && (
          <div className="intro-full-reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', zIndex: 20 }}>
            
            {/* HYPERSONIC ESCAPE-VELOCITY SLATE ARROW CONTAINER */}
            <div className="hypersonic-arrow-fly-in" style={{ position: 'relative', width: '440px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* Atmospheric Plasma Friction Heat Streak (Escape Velocity Trail) */}
              <div style={{
                position: 'absolute',
                left: '-80px',
                width: '320px',
                height: '6px',
                background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.9), rgba(251, 191, 36, 0.95), #ffffff)',
                borderRadius: '9999px',
                filter: 'blur(4px)',
                opacity: 0.9
              }} />

              {/* Mach Mach-Speed Lines */}
              <div style={{
                position: 'absolute',
                left: '-60px',
                width: '280px',
                height: '24px',
                background: 'repeating-linear-gradient(90deg, transparent, transparent 15px, rgba(255,255,255,0.4) 15px, rgba(255,255,255,0.4) 25px)',
                filter: 'blur(2px)',
                opacity: 0.7,
                animation: 'machLinesPulse 0.1s infinite alternate'
              }} />

              {/* SVG DARK SLATE FORGED IRON BODKIN ARROW (Matching user image) */}
              <svg width="440" height="70" viewBox="0 0 440 70" style={{ filter: 'drop-shadow(0 12px 30px rgba(0, 0, 0, 0.9))' }}>
                <defs>
                  {/* Dark Slate Forged Iron Gradient */}
                  <linearGradient id="slateMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="35%" stopColor="#334155" />
                    <stop offset="70%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>

                  {/* Steel Highlight Edge */}
                  <linearGradient id="slateEdge" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#475569" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
                  </linearGradient>
                </defs>

                {/* 1. Angular Dark Feather Fletchings at Tail (Matching user image) */}
                <g transform="translate(10, 10)">
                  {/* Upper Dark Vane */}
                  <polygon points="0,25 90,0 80,25" fill="url(#slateMetal)" stroke="#64748b" strokeWidth="1" />
                  {/* Lower Dark Vane */}
                  <polygon points="0,25 90,50 80,25" fill="url(#slateMetal)" stroke="#64748b" strokeWidth="1" />
                  
                  {/* Feather Ribs Texture */}
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

                {/* 2. Double-Ridged Collar Rings near Fletching */}
                <g transform="translate(100, 27)">
                  <rect x="0" y="0" width="6" height="16" rx="2" fill="url(#slateEdge)" stroke="#0f172a" strokeWidth="0.8" />
                  <rect x="9" y="0" width="6" height="16" rx="2" fill="url(#slateEdge)" stroke="#0f172a" strokeWidth="0.8" />
                  <rect x="18" y="0" width="6" height="16" rx="2" fill="url(#slateEdge)" stroke="#0f172a" strokeWidth="0.8" />
                </g>

                {/* 3. Dark Matte Forged Iron Shaft */}
                <rect x="130" y="32" width="230" height="6" rx="2" fill="url(#slateMetal)" stroke="#0f172a" strokeWidth="1" />
                <line x1="130" y1="33" x2="360" y2="33" stroke="#cbd5e1" strokeWidth="1" opacity="0.6" />

                {/* 4. Conical Steel Armor-Piercing Bodkin Point */}
                <g transform="translate(360, 28)">
                  <path d="M 0 0 L 22 7 L 0 14 Z" fill="url(#slateEdge)" stroke="#0f172a" strokeWidth="1" />
                  {/* Conical Bodkin Tip */}
                  <polygon points="22,2 50,7 22,12" fill="url(#slateEdge)" stroke="#ffffff" strokeWidth="0.8" />
                  <line x1="22" y1="7" x2="50" y2="7" stroke="#ffffff" strokeWidth="1" />
                </g>

                {/* Hypersonic Plasma Friction Cone at Arrowhead Tip */}
                <path d="M 410 35 L 435 20 L 440 35 L 435 50 Z" fill="rgba(56, 189, 248, 0.8)" filter="blur(2px)" />
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

      {/* CSS Keyframes for Hypersonic Flight & Deceleration */}
      <style>{`
        @keyframes textFadeInOut {
          0% { opacity: 0; transform: translateY(12px) scale(0.96); }
          25% { opacity: 1; transform: translateY(0px) scale(1); }
          75% { opacity: 1; transform: translateY(0px) scale(1); }
          100% { opacity: 0; transform: translateY(-12px) scale(1.02); }
        }

        .intro-text-fade {
          animation: textFadeInOut 2.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes hypersonicArrowFlyIn {
          0% {
            opacity: 0;
            transform: translateX(-150vw) scale(0.7);
          }
          75% {
            opacity: 1;
            transform: translateX(20px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateX(0px) scale(1);
          }
        }

        .hypersonic-arrow-fly-in {
          animation: hypersonicArrowFlyIn 0.65s cubic-bezier(0.12, 1, 0.25, 1) forwards;
        }

        @keyframes machLinesPulse {
          0% { opacity: 0.4; }
          100% { opacity: 0.95; }
        }

        @keyframes fullRevealFadeIn {
          0% { opacity: 0; transform: translateY(24px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .intro-full-reveal {
          animation: fullRevealFadeIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </div>
  );
}
