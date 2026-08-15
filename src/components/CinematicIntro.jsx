import React, { useState, useEffect } from 'react';
import { Target, ArrowRight, Sparkles } from 'lucide-react';

export default function CinematicIntro({ onComplete }) {
  // Phase 0: Target face appears
  // Phase 1: Text 'WELCOME'
  // Phase 2: Text 'to the official portal of'
  // Phase 3: Vertical Arrow flight & impact on X-ring
  // Phase 4: Title 'THE HERITAGE ARCHERY', 'College Team Portal', 'Made by Archers for Archers' + ENTER PORTAL
  const [phase, setPhase] = useState(0);
  const [isHit, setIsHit] = useState(false);

  useEffect(() => {
    // Phase 1: WELCOME (at 0.6s)
    const t1 = setTimeout(() => {
      setPhase(1);
    }, 600);

    // Phase 2: 'to the official portal of' (at 2.2s)
    const t2 = setTimeout(() => {
      setPhase(2);
    }, 2200);

    // Phase 3: Arrow flight & Vertical Impact (at 3.8s)
    const t3 = setTimeout(() => {
      setPhase(3);
    }, 3800);

    // Trigger Impact FX & Sound (at 4.4s)
    const tImpact = setTimeout(() => {
      setIsHit(true);
      playHitSound();
    }, 4400);

    // Phase 4: Full reveal with 'THE HERITAGE ARCHERY', 'College Team Portal', 'Made by Archers for Archers' (at 5.1s)
    const t4 = setTimeout(() => {
      setPhase(4);
    }, 5100);

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

      {/* Dynamic Background Glow */}
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

      {/* Target Face Stage */}
      <div style={{
        position: 'relative',
        width: '280px',
        height: '280px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px auto'
      }}>

        {/* Archery Target Board */}
        <div 
          className={isHit ? 'target-impact-shake' : ''}
          style={{
            position: 'relative',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(5, 150, 105, 0.35)',
            transform: 'scale(1)',
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
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

          {/* Vertical Arrow (Flight & Direct Head-On Vertical Impact) */}
          {(phase === 3 || phase === 4) && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
                pointerEvents: 'none',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Vertical Archery Arrow aligned directly with the Target Center X */}
              <div
                className={isHit ? 'arrow-vertical-stuck' : 'arrow-vertical-flight'}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.7))'
                }}
              >
                {/* Gold & Emerald Fletching Feathers at Top/Tail of Arrow */}
                <div style={{ display: 'flex', gap: '3px', marginBottom: '-2px' }}>
                  <div style={{
                    width: '8px',
                    height: '28px',
                    background: 'linear-gradient(180deg, #fbbf24, #d97706)',
                    clipPath: 'polygon(0 0, 100% 20%, 60% 100%, 0 100%)'
                  }} />
                  <div style={{
                    width: '8px',
                    height: '28px',
                    background: 'linear-gradient(180deg, #34d399, #059669)',
                    clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 40% 100%)'
                  }} />
                </div>

                {/* Vertical Carbon Shaft */}
                <div style={{
                  width: '5px',
                  height: '110px',
                  background: 'linear-gradient(180deg, #1e293b 0%, #475569 50%, #0f172a 100%)',
                  boxShadow: 'inset 1px 0 2px rgba(255, 255, 255, 0.4)'
                }} />

                {/* Steel Bullet Target Tip piercing the X-ring */}
                <div style={{
                  width: '7px',
                  height: '14px',
                  background: 'linear-gradient(180deg, #ffffff, #94a3b8, #334155)',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  marginTop: '-1px'
                }} />
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Phase 1 Text: 'WELCOME' */}
      {phase === 1 && (
        <div className="intro-text-pop" style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '3.5rem',
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

      {/* Phase 2 Text: 'to the official portal of' */}
      {phase === 2 && (
        <div className="intro-text-pop" style={{ textAlign: 'center' }}>
          <p style={{
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
        </div>
      )}

      {/* Phase 4 Full Reveal: 'THE HERITAGE ARCHERY', 'College Team Portal', 'Made by Archers for Archers' + ENTER PORTAL */}
      {phase === 4 && (
        <div className="intro-full-reveal" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', zIndex: 30 }}>
          
          <h1 className="metallic-text-shine" style={{
            fontSize: '2.8rem',
            fontWeight: 900,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
            lineHeight: 1.1
          }}>
            THE HERITAGE ARCHERY
          </h1>

          <div style={{
            fontSize: '1rem',
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

          <p style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#fbbf24',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            margin: '4px 0 0 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ height: '1px', width: '32px', background: 'rgba(251, 191, 36, 0.4)' }} />
            Made by Archers for Archers
            <span style={{ height: '1px', width: '32px', background: 'rgba(251, 191, 36, 0.4)' }} />
          </p>

          <button
            onClick={onComplete}
            className="btn-gold"
            style={{
              marginTop: '12px',
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

      {/* Embedded Animations & FX */}
      <style>{`
        @keyframes textPopIn {
          0% { opacity: 0; transform: scale(0.92) translateY(12px); }
          20% { opacity: 1; transform: scale(1) translateY(0); }
          80% { opacity: 1; transform: scale(1) translateY(0); }
          100% { opacity: 0; transform: scale(1.05) translateY(-12px); }
        }

        .intro-text-pop {
          animation: textPopIn 1.6s ease-in-out forwards;
        }

        @keyframes verticalArrowFlight {
          0% { opacity: 0; transform: translateY(-300px) scale(1.8); }
          70% { opacity: 1; transform: translateY(-30px) scale(1.1); }
          100% { opacity: 1; transform: translateY(0px) scale(1); }
        }

        .arrow-vertical-flight {
          animation: verticalArrowFlight 0.6s cubic-bezier(0.5, 0, 0.75, 0) forwards;
        }

        .arrow-vertical-stuck {
          transform: translateY(0px) scale(1);
        }

        @keyframes targetImpactShake {
          0% { transform: scale(1) translate(0, 0); }
          20% { transform: scale(1.05) translate(0, 4px); }
          40% { transform: scale(0.97) translate(0, -3px); }
          60% { transform: scale(1.02) translate(0, 2px); }
          80% { transform: scale(0.99) translate(0, -1px); }
          100% { transform: scale(1) translate(0, 0); }
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
          0% { opacity: 0; transform: translateY(24px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .intro-full-reveal {
          animation: fullRevealFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </div>
  );
}
