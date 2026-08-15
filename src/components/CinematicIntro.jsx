import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Sparkles } from 'lucide-react';

export default function CinematicIntro({ onComplete }) {
  // Phase 1: Text 'WELCOME' (0.6s - 3.2s)
  // Phase 2: Text 'to the official portal of' (3.4s - 6.0s)
  // Phase 3: Text 'THE HERITAGE ARCHERY' + Golden Vintage Metallic Arrow with Electric Shock flies in from left (6.2s - end)
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

    // Phase 3: 'THE HERITAGE ARCHERY' + Electric Arrow Flight from Left
    const t3 = setTimeout(() => {
      setPhase(3);
      playElectricSound();
    }, 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Web Audio Synthesizer for Electric Shock + Metallic Flight Sound
  const playElectricSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Electric buzz / zap sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.1);
      osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
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

      {/* Ambient Lighting Glow */}
      <div style={{
        position: 'absolute',
        width: '750px',
        height: '750px',
        background: phase === 3
          ? 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(251, 191, 36, 0.2) 35%, transparent 70%)'
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

        {/* Phase 3: THE HERITAGE ARCHERY + Electric Golden Vintage Metallic Arrow */}
        {phase === 3 && (
          <div className="intro-full-reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', zIndex: 20 }}>
            
            {/* VINTAGE GOLDEN METALLIC ARROW WITH ELECTRIC SHOCK FLYING IN FROM LEFT AND STOPPING ABOVE TEXT */}
            <div className="electric-arrow-fly-left" style={{ position: 'relative', width: '420px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* Electric Shock Aura Glow */}
              <div style={{
                position: 'absolute',
                inset: '-10px',
                background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.4) 0%, rgba(251, 191, 36, 0.3) 50%, transparent 80%)',
                borderRadius: '9999px',
                filter: 'blur(8px)',
                animation: 'electricPulse 0.15s infinite alternate'
              }} />

              {/* Electric Spark / Lightning Bolts SVG Overlays */}
              <div className="electric-arcs-overlay">
                <Zap size={24} color="#38bdf8" style={{ position: 'absolute', top: '-12px', left: '25%', filter: 'drop-shadow(0 0 8px #38bdf8)' }} />
                <Zap size={20} color="#fde047" style={{ position: 'absolute', bottom: '-10px', left: '55%', filter: 'drop-shadow(0 0 8px #fde047)' }} />
                <Zap size={26} color="#38bdf8" style={{ position: 'absolute', top: '-14px', right: '20%', filter: 'drop-shadow(0 0 10px #38bdf8)' }} />
              </div>

              {/* SVG HIGH-DETAIL GOLDEN METALLIC ARCHERY ARROW (matching user image) */}
              <svg width="420" height="60" viewBox="0 0 420 60" style={{ filter: 'drop-shadow(0 10px 25px rgba(217, 119, 6, 0.6))' }}>
                <defs>
                  {/* Metallic Gold Gradient */}
                  <linearGradient id="goldMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="35%" stopColor="#f59e0b" />
                    <stop offset="70%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#78350f" />
                  </linearGradient>

                  {/* High Specular Highlight Gradient */}
                  <linearGradient id="goldHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="40%" stopColor="#fbbf24" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#b45309" stopOpacity="1" />
                  </linearGradient>

                  {/* Cross-Hatch Grip Pattern */}
                  <pattern id="crossHatch" width="8" height="8" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="8" y2="8" stroke="#78350f" strokeWidth="1.2" />
                    <line x1="8" y1="0" x2="0" y2="8" stroke="#78350f" strokeWidth="1.2" />
                  </pattern>
                </defs>

                {/* 1. Feather Fletchings at Tail (Golden Detailed Vanes) */}
                <g transform="translate(10, 10)">
                  {/* Upper Feather Vane */}
                  <path 
                    d="M 0 20 C 15 2, 70 0, 100 20 L 95 24 C 65 10, 15 12, 0 20 Z" 
                    fill="url(#goldHighlight)" 
                    stroke="#78350f" 
                    strokeWidth="1"
                  />
                  {/* Feather Ribs Texture */}
                  {[...Array(12)].map((_, i) => (
                    <line 
                      key={i} 
                      x1={10 + i * 7} 
                      y1={18 - (i > 6 ? 12 - i : i * 1.5)} 
                      x2={14 + i * 7} 
                      y2={20} 
                      stroke="#92400e" 
                      strokeWidth="1" 
                    />
                  ))}

                  {/* Lower Feather Vane */}
                  <path 
                    d="M 0 20 C 15 38, 70 40, 100 20 L 95 16 C 65 30, 15 28, 0 20 Z" 
                    fill="url(#goldHighlight)" 
                    stroke="#78350f" 
                    strokeWidth="1"
                  />
                  {/* Lower Feather Ribs Texture */}
                  {[...Array(12)].map((_, i) => (
                    <line 
                      key={i} 
                      x1={10 + i * 7} 
                      y1={22 + (i > 6 ? 12 - i : i * 1.5)} 
                      x2={14 + i * 7} 
                      y2={20} 
                      stroke="#92400e" 
                      strokeWidth="1" 
                    />
                  ))}
                </g>

                {/* 2. Main Solid Golden Shaft */}
                <rect x="90" y="27" width="240" height="6" rx="3" fill="url(#goldHighlight)" stroke="#78350f" strokeWidth="0.8" />
                <line x1="90" y1="29" x2="330" y2="29" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.8" />

                {/* 3. Decorative Metallic Collar with Cross-Hatch Ornamentation */}
                <g transform="translate(180, 22)">
                  <rect x="0" y="0" width="35" height="16" rx="3" fill="url(#goldMetal)" stroke="#78350f" strokeWidth="1" />
                  <rect x="2" y="2" width="31" height="12" fill="url(#crossHatch)" opacity="0.8" />
                  <line x1="0" y1="0" x2="0" y2="16" stroke="#fef08a" strokeWidth="2" />
                  <line x1="35" y1="0" x2="35" y2="16" stroke="#fef08a" strokeWidth="2" />
                </g>

                {/* 4. Collar Neck Rings near Arrowhead */}
                <g transform="translate(325, 23)">
                  <rect x="0" y="0" width="4" height="14" rx="1" fill="#fde047" stroke="#78350f" strokeWidth="0.8" />
                  <rect x="6" y="0" width="4" height="14" rx="1" fill="#fde047" stroke="#78350f" strokeWidth="0.8" />
                  <rect x="12" y="0" width="4" height="14" rx="1" fill="#fde047" stroke="#78350f" strokeWidth="0.8" />
                </g>

                {/* 5. Broadhead Arrowhead Spear Tip (Pointing Right) */}
                <g transform="translate(345, 10)">
                  <path 
                    d="M 0 20 L 20 0 L 65 20 L 20 40 Z" 
                    fill="url(#goldHighlight)" 
                    stroke="#78350f" 
                    strokeWidth="1.5"
                  />
                  {/* Arrowhead Center Ridge Line */}
                  <line x1="0" y1="20" x2="65" y2="20" stroke="#ffffff" strokeWidth="1.5" />
                  {/* Arrowhead Bevel Side Highlights */}
                  <path d="M 20 0 L 65 20 L 20 20 Z" fill="rgba(255, 255, 255, 0.25)" />
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

      {/* Keyframes for Electric Arrow Flight from Left & Electric Shock Pulse */}
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

        @keyframes electricArrowFlyLeft {
          0% {
            opacity: 0;
            transform: translateX(-120vw) scale(0.8);
          }
          70% {
            opacity: 1;
            transform: translateX(18px) scale(1.06);
          }
          100% {
            opacity: 1;
            transform: translateX(0px) scale(1);
          }
        }

        .electric-arrow-fly-left {
          animation: electricArrowFlyLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes electricPulse {
          0% { opacity: 0.6; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1.04); }
        }

        .electric-arcs-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          animation: electricPulse 0.12s infinite alternate;
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
