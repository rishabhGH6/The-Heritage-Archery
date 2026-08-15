import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CinematicIntro({ onComplete }) {
  // Phase 0: Target face fixed in center
  // Phase 1: Text 'WELCOME' fades in and fades out
  // Phase 2: Text 'to the official portal of' fades in and fades out
  // Phase 3: Arrow shot at 90° perpendicular straight into target face X-ring
  // Phase 4: 'THE HERITAGE ARCHERY', 'College Team Portal', 'Made by Archers for Archers' + ENTER PORTAL
  const [phase, setPhase] = useState(0);
  const [isHit, setIsHit] = useState(false);

  useEffect(() => {
    // Phase 1: WELCOME (at 0.8s)
    const t1 = setTimeout(() => {
      setPhase(1);
    }, 800);

    // Phase 2: 'to the official portal of' (at 3.6s)
    const t2 = setTimeout(() => {
      setPhase(2);
    }, 3600);

    // Phase 3: 90° Arrow Shot (at 6.4s)
    const t3 = setTimeout(() => {
      setPhase(3);
    }, 6400);

    // 90° Impact at center X-ring (at 7.1s)
    const tImpact = setTimeout(() => {
      setIsHit(true);
      playHitSound();
    }, 7100);

    // Phase 4: Full Title & CTA Reveal (at 7.8s)
    const t4 = setTimeout(() => {
      setPhase(4);
    }, 7800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tImpact);
      clearTimeout(t4);
    };
  }, []);

  // Web Audio Synthesizer for Bow Release + Crisp Impact Sound
  const playHitSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Impact thump sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Ignore audio failure if muted
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
        width: '650px',
        height: '650px',
        background: isHit
          ? 'radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, rgba(5, 150, 105, 0.15) 40%, transparent 70%)'
          : 'radial-gradient(circle, rgba(5, 150, 105, 0.15) 0%, rgba(217, 119, 6, 0.1) 45%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        transition: 'all 0.6s ease',
        pointerEvents: 'none'
      }} />

      {/* MAIN CONTAINER WITH FIXED TARGET POSITION */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '650px',
        minHeight: '480px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>

        {/* Text Container Above Fixed Target (Phase 1 & Phase 2) */}
        <div style={{
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {phase === 1 && (
            <h1 className="intro-text-fade" style={{
              fontSize: '3.2rem',
              fontWeight: 900,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              filter: 'drop-shadow(0 6px 20px rgba(255, 255, 255, 0.25))'
            }}>
              WELCOME
            </h1>
          )}

          {phase === 2 && (
            <p className="intro-text-fade" style={{
              fontSize: '1.8rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              color: '#fbbf24',
              fontStyle: 'italic',
              margin: 0,
              filter: 'drop-shadow(0 4px 15px rgba(251, 191, 36, 0.3))'
            }}>
              to the official portal of
            </p>
          )}
        </div>

        {/* FIXED POSITION TARGET FACE BOARD (Never shifts or moves) */}
        <div style={{
          position: 'relative',
          width: '260px',
          height: '260px',
          perspective: '1200px',
          perspectiveOrigin: '50% 50%'
        }}>
          <div 
            className={isHit ? 'target-impact-shake' : ''}
            style={{
              position: 'relative',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(5, 150, 105, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* SVG Target Face (Yellow 10/X, Red 8/7, Blue 6/5, Black 4/3, White 2/1) */}
            <svg width="260" height="260" viewBox="0 0 200 200" style={{ borderRadius: '50%' }}>
              <circle cx="100" cy="100" r="98" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="100" cy="100" r="88" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="78" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="68" fill="#334155" stroke="#475569" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="58" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="48" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="38" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="28" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="18" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="10" fill="#fde047" stroke="#854d0e" strokeWidth="1.5" />
              
              {/* Center X Crosshair */}
              <line x1="94" y1="100" x2="106" y2="100" stroke="#854d0e" strokeWidth="1" />
              <line x1="100" y1="94" x2="100" y2="106" stroke="#854d0e" strokeWidth="1" />
              <text x="100" y="103" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#854d0e">X</text>
            </svg>

            {/* Impact Shockwave Rings */}
            {isHit && (
              <>
                <div className="shockwave-ring-1" />
                <div className="shockwave-ring-2" />
              </>
            )}

            {/* Particle Spark Burst on Hit */}
            {isHit && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className="intro-particle"
                    style={{
                      '--angle': `${i * 15}deg`,
                      '--distance': `${45 + (i % 5) * 22}px`,
                      '--delay': `${(i % 3) * 0.04}s`,
                      background: i % 2 === 0 ? '#fbbf24' : '#34d399'
                    }}
                  />
                ))}
              </div>
            )}

            {/* 90° PERPENDICULAR ARROW SHOT STRAIGHT INTO TARGET FACE */}
            {(phase === 3 || phase === 4) && (
              <div 
                className={isHit ? 'arrow-90deg-stuck' : 'arrow-90deg-flight'}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transformStyle: 'preserve-3d',
                  pointerEvents: 'none',
                  zIndex: 20
                }}
              >
                {/* 3D Arrow Head-On Perpendicular Structure at 90 degrees */}
                <div style={{
                  position: 'relative',
                  width: '60px',
                  height: '60px',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Arrow Tail & 3 Fletchings (Feathers) at 90° perpendicular center */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #fbbf24 20%, #d97706 60%, transparent 80%)',
                    boxShadow: '0 0 25px rgba(251, 191, 36, 0.9), 0 0 10px rgba(52, 211, 153, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #ffffff'
                  }}>
                    {/* Nock & 3 Vanes Feather Fins extending outwards at 90 degrees */}
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 8px #ffffff' }} />
                    
                    {/* 3 Vanes Feathers */}
                    <div style={{ position: 'absolute', top: '-10px', width: '4px', height: '14px', background: '#fbbf24', borderRadius: '2px' }} />
                    <div style={{ position: 'absolute', bottom: '-10px', width: '4px', height: '14px', background: '#34d399', borderRadius: '2px' }} />
                    <div style={{ position: 'absolute', right: '-10px', width: '14px', height: '4px', background: '#fbbf24', borderRadius: '2px' }} />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Text Container Below Fixed Target (Phase 4 Title & CTA Reveal) */}
        <div style={{
          minHeight: '160px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '20px',
          textAlign: 'center'
        }}>
          {phase === 4 && (
            <div className="intro-full-reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              
              {/* THE HERITAGE ARCHERY */}
              <h1 className="metallic-text-shine" style={{
                fontSize: '2.7rem',
                fontWeight: 900,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                margin: 0,
                lineHeight: 1.1
              }}>
                THE HERITAGE ARCHERY
              </h1>

              {/* College Team Portal */}
              <div style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#34d399',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                background: 'rgba(5, 150, 105, 0.15)',
                border: '1px solid rgba(5, 150, 105, 0.35)',
                padding: '4px 16px',
                borderRadius: '9999px'
              }}>
                College Team Portal
              </div>

              {/* Made by Archers for Archers */}
              <p style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#fbbf24',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                margin: '2px 0 0 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ height: '1px', width: '28px', background: 'rgba(251, 191, 36, 0.4)' }} />
                Made by Archers for Archers
                <span style={{ height: '1px', width: '28px', background: 'rgba(251, 191, 36, 0.4)' }} />
              </p>

              {/* ENTER PORTAL Button */}
              <button
                onClick={onComplete}
                className="btn-gold"
                style={{
                  marginTop: '10px',
                  padding: '14px 42px',
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

      {/* CSS Keyframes for Smooth Fade In/Out & 90° Perpendicular Flight */}
      <style>{`
        @keyframes textFadeInOut {
          0% { opacity: 0; transform: translateY(8px) scale(0.96); }
          25% { opacity: 1; transform: translateY(0px) scale(1); }
          75% { opacity: 1; transform: translateY(0px) scale(1); }
          100% { opacity: 0; transform: translateY(-8px) scale(1.02); }
        }

        .intro-text-fade {
          animation: textFadeInOut 2.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes arrowFlight90deg {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) translateZ(900px) scale(4.5);
          }
          70% {
            opacity: 1;
            transform: translate(-50%, -50%) translateZ(80px) scale(1.2);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) translateZ(0px) scale(1);
          }
        }

        .arrow-90deg-flight {
          animation: arrowFlight90deg 0.7s cubic-bezier(0.5, 0, 0.75, 0) forwards;
        }

        .arrow-90deg-stuck {
          transform: translate(-50%, -50%) translateZ(0px) scale(1);
        }

        @keyframes targetImpactShake {
          0% { transform: scale(1); }
          20% { transform: scale(1.05); }
          40% { transform: scale(0.97); }
          60% { transform: scale(1.02); }
          80% { transform: scale(0.99); }
          100% { transform: scale(1); }
        }

        .target-impact-shake {
          animation: targetImpactShake 0.4s ease-out forwards;
        }

        @keyframes shockwaveExpand {
          0% {
            width: 20px;
            height: 20px;
            opacity: 1;
            border: 4px solid #fde047;
            box-shadow: 0 0 20px #fde047;
          }
          100% {
            width: 340px;
            height: 340px;
            opacity: 0;
            border: 2px solid #34d399;
            box-shadow: 0 0 50px rgba(52, 211, 153, 0.5);
          }
        }

        .shockwave-ring-1 {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          animation: shockwaveExpand 0.8s cubic-bezier(0, 0, 0.2, 1) forwards;
          pointer-events: none;
        }

        .shockwave-ring-2 {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          animation: shockwaveExpand 0.8s cubic-bezier(0, 0, 0.2, 1) 0.15s forwards;
          pointer-events: none;
        }

        @keyframes particleBurst {
          0% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(-1 * var(--distance))) scale(0.2);
            opacity: 0;
          }
        }

        .intro-particle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(251, 191, 36, 0.8);
          animation: particleBurst 0.75s ease-out var(--delay) forwards;
        }

        @keyframes fullRevealFadeIn {
          0% { opacity: 0; transform: translateY(20px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .intro-full-reveal {
          animation: fullRevealFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </div>
  );
}
