import React, { useState, useEffect } from 'react';
import { Target, ArrowRight, Sparkles } from 'lucide-react';

export default function CinematicIntro({ onComplete }) {
  const [stage, setStage] = useState('aiming'); // 'aiming', 'flying', 'hit', 'revealed'
  const [showHitText, setShowHitText] = useState(false);

  useEffect(() => {
    // Audio synthesizer for bow release & crisp target impact sound effect
    const playHitSound = () => {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();

        // 1. Bow string release sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);

        // 2. Thump impact sound on X-ring (at 1.2s)
        setTimeout(() => {
          const impactOsc = ctx.createOscillator();
          const impactGain = ctx.createGain();
          impactOsc.type = 'sine';
          impactOsc.frequency.setValueAtTime(240, ctx.currentTime);
          impactOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.25);
          impactGain.gain.setValueAtTime(0.6, ctx.currentTime);
          impactGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
          impactOsc.connect(impactGain);
          impactGain.connect(ctx.destination);
          impactOsc.start();
          impactOsc.stop(ctx.currentTime + 0.25);
        }, 1200);
      } catch (e) {
        // Audio fallback ignore if muted
      }
    };

    playHitSound();

    // Flight transition
    const t1 = setTimeout(() => {
      setStage('flying');
    }, 400);

    // Impact hit transition at 1.2s
    const t2 = setTimeout(() => {
      setStage('hit');
      setShowHitText(true);
    }, 1300);

    // Title reveal transition at 2.1s
    const t3 = setTimeout(() => {
      setStage('revealed');
    }, 2100);

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
      background: 'radial-gradient(circle at 50% 40%, #0f172a 0%, #060b13 70%, #030712 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
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

      {/* Ambient Radial Lighting Glow */}
      <div style={{
        position: 'absolute',
        width: '700px',
        height: '700px',
        background: stage === 'hit' || stage === 'revealed'
          ? 'radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, rgba(5, 150, 105, 0.15) 35%, transparent 70%)'
          : 'radial-gradient(circle, rgba(5, 150, 105, 0.15) 0%, rgba(217, 119, 6, 0.1) 40%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(70px)',
        transition: 'all 0.6s ease',
        pointerEvents: 'none'
      }} />

      {/* 3D Perspective Stage Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '700px',
        height: '380px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1200px',
        perspectiveOrigin: '50% 50%'
      }}>

        {/* 3D Archery Target Board */}
        <div 
          className={stage === 'hit' ? 'target-impact-shake' : ''}
          style={{
            position: 'relative',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            transformStyle: 'preserve-3d',
            transform: stage === 'aiming' 
              ? 'scale(0.85) rotateX(15deg) translateZ(-100px)' 
              : 'scale(1) rotateX(0deg) translateZ(0px)',
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(5, 150, 105, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* SVG Target Rings (10X Center Bullseye down to 1 Outer Ring) */}
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
            
            {/* Center X Crosshairs */}
            <line x1="94" y1="100" x2="106" y2="100" stroke="#854d0e" strokeWidth="1" />
            <line x1="100" y1="94" x2="100" y2="106" stroke="#854d0e" strokeWidth="1" />
            <text x="100" y="103" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#854d0e">X</text>
          </svg>

          {/* Shockwave Burst Rings on Hit */}
          {(stage === 'hit' || stage === 'revealed') && (
            <>
              <div className="shockwave-ring-1" />
              <div className="shockwave-ring-2" />
            </>
          )}

          {/* Particles Burst from X-ring */}
          {(stage === 'hit' || stage === 'revealed') && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className="intro-particle"
                  style={{
                    '--angle': `${i * 15}deg`,
                    '--distance': `${40 + (i % 5) * 20}px`,
                    '--delay': `${(i % 3) * 0.05}s`,
                    background: i % 2 === 0 ? '#fbbf24' : '#34d399'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 3D Flying Archery Arrow */}
        <div 
          style={{
            position: 'absolute',
            transformStyle: 'preserve-3d',
            transform: stage === 'aiming'
              ? 'translate3d(-240px, -180px, 900px) rotateX(25deg) rotateY(-35deg) scale(2.2)'
              : stage === 'flying'
              ? 'translate3d(-80px, -60px, 400px) rotateX(10deg) rotateY(-15deg) scale(1.5)'
              : 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(1)',
            transition: stage === 'hit' || stage === 'revealed'
              ? 'transform 0.25s cubic-bezier(0, 0, 0.2, 1)'
              : 'transform 0.8s cubic-bezier(0.5, 0, 0.75, 0)',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          {/* Visual 3D Arrow Structure */}
          <div style={{ position: 'relative', width: '220px', height: '14px', display: 'flex', alignItems: 'center' }}>
            
            {/* Speed Fire Trail (during flight) */}
            {stage === 'flying' && (
              <div style={{
                position: 'absolute',
                right: '40px',
                width: '180px',
                height: '8px',
                background: 'linear-gradient(90deg, transparent, rgba(5, 150, 105, 0.6), rgba(251, 191, 36, 0.9))',
                borderRadius: '9999px',
                filter: 'blur(4px)',
                animation: 'pulse 0.1s infinite alternate'
              }} />
            )}

            {/* Fletching (Vanes / Feathers) at Back of Arrow */}
            <div style={{ display: 'flex', gap: '3px', position: 'relative', zIndex: 2 }}>
              <div style={{
                width: '32px',
                height: '14px',
                background: 'linear-gradient(135deg, #d97706, #fbbf24)',
                clipPath: 'polygon(0 0, 100% 40%, 80% 100%, 0 100%)',
                boxShadow: '0 0 10px rgba(251, 191, 36, 0.6)'
              }} />
              <div style={{
                width: '32px',
                height: '14px',
                background: 'linear-gradient(135deg, #059669, #34d399)',
                clipPath: 'polygon(0 40%, 100% 0, 80% 100%, 0 100%)',
                boxShadow: '0 0 10px rgba(52, 211, 153, 0.6)',
                transform: 'translateY(-3px)'
              }} />
            </div>

            {/* Carbon Fiber Arrow Shaft */}
            <div style={{
              flex: 1,
              height: '5px',
              background: 'linear-gradient(90deg, #1e293b 0%, #475569 50%, #0f172a 100%)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
              borderRadius: '1px'
            }} />

            {/* Silver Steel Bullet Target Tip (Striking X-ring) */}
            <div style={{
              width: '18px',
              height: '8px',
              background: 'linear-gradient(135deg, #f8fafc, #94a3b8, #475569)',
              clipPath: 'polygon(0 20%, 100% 50%, 0 80%)',
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)'
            }} />

          </div>
        </div>

      </div>

      {/* Hit Notification Badge ("BULLSEYE 10X!") */}
      {showHitText && (
        <div className="hit-badge-pop" style={{ marginTop: '-20px', zIndex: 20 }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.95), rgba(5, 150, 105, 0.95))',
            color: '#ffffff',
            padding: '6px 22px',
            borderRadius: '9999px',
            fontWeight: 900,
            fontSize: '0.95rem',
            letterSpacing: '0.12em',
            boxShadow: '0 10px 30px rgba(217, 119, 6, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '2px solid #fde047'
          }}>
            <Sparkles size={18} color="#fde047" /> PERFECT X-RING 10X HIT! <Sparkles size={18} color="#fde047" />
          </div>
        </div>
      )}

      {/* Main Title & CTA Reveal (Phase 4) */}
      {stage === 'revealed' && (
        <div className="intro-title-reveal" style={{ textAlign: 'center', marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', zIndex: 20 }}>
          
          <h1 className="metallic-text-shine" style={{
            fontSize: '3rem',
            fontWeight: 900,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
            lineHeight: 1.1
          }}>
            THE HERITAGE ARCHERY
          </h1>

          <p style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#fbbf24',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ height: '1px', width: '36px', background: 'rgba(251, 191, 36, 0.4)' }} />
            College Team Portal • Made by Archers for Archers
            <span style={{ height: '1px', width: '36px', background: 'rgba(251, 191, 36, 0.4)' }} />
          </p>

          <button
            onClick={onComplete}
            className="btn-gold"
            style={{
              marginTop: '16px',
              padding: '14px 40px',
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

      {/* Embedded 3D Keyframe Animations & Spark FX */}
      <style>{`
        @keyframes targetImpactShake {
          0% { transform: scale(1) translate(0, 0); }
          20% { transform: scale(1.04) translate(-4px, 3px); }
          40% { transform: scale(0.98) translate(4px, -3px); }
          60% { transform: scale(1.02) translate(-2px, 2px); }
          80% { transform: scale(0.99) translate(1px, -1px); }
          100% { transform: scale(1) translate(0, 0); }
        }

        .target-impact-shake {
          animation: targetImpactShake 0.45s ease-out forwards;
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
            width: 320px;
            height: 320px;
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

        @keyframes hitBadgePop {
          0% { opacity: 0; transform: scale(0.5) translateY(20px); }
          60% { opacity: 1; transform: scale(1.1) translateY(-5px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .hit-badge-pop {
          animation: hitBadgePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes introTitleReveal {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .intro-title-reveal {
          animation: introTitleReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </div>
  );
}
