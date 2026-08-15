import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CinematicIntro({ onComplete }) {
  // Phase 1: Text 'WELCOME' (0.6s - 3.2s)
  // Phase 2: Text 'to the official portal of' (3.4s - 6.0s)
  // Phase 3: Text 'THE HERITAGE ARCHERY' + Stunning Metallic Shiny Arrow flight entrance (6.2s - end)
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

    // Phase 3: 'THE HERITAGE ARCHERY' + Stunning Metallic Arrow Flight
    const t3 = setTimeout(() => {
      setPhase(3);
      playSwooshSound();
    }, 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Web Audio Synthesizer for Crisp Metallic Arrow Swoosh & Release
  const playSwooshSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Metallic swoosh oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
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
          ? 'radial-gradient(circle, rgba(251, 191, 36, 0.22) 0%, rgba(5, 150, 105, 0.18) 35%, transparent 70%)'
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

        {/* Phase 3: THE HERITAGE ARCHERY + Stunning Metallic Shiny Arrow */}
        {phase === 3 && (
          <div className="intro-full-reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px', zIndex: 20 }}>
            
            {/* STUNNING METALLIC SHINY ARROW (Flies into position when title appears) */}
            <div className="metallic-arrow-entrance" style={{ position: 'relative', width: '380px', height: '24px', display: 'flex', alignItems: 'center' }}>
              
              {/* Arrow Speed Sparkle Trail */}
              <div style={{
                position: 'absolute',
                left: '-40px',
                width: '260px',
                height: '4px',
                background: 'linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.8), rgba(251, 191, 36, 0.95))',
                borderRadius: '9999px',
                filter: 'blur(3px)',
                opacity: 0.8
              }} />

              {/* Metallic Gold & Emerald Fletchings / Feathers */}
              <div style={{ display: 'flex', gap: '3px', position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: '36px',
                  height: '16px',
                  background: 'linear-gradient(135deg, #d97706, #fbbf24, #fef08a)',
                  clipPath: 'polygon(0 0, 100% 30%, 80% 100%, 0 100%)',
                  boxShadow: '0 0 12px rgba(251, 191, 36, 0.8)'
                }} />
                <div style={{
                  width: '36px',
                  height: '16px',
                  background: 'linear-gradient(135deg, #059669, #34d399, #6ee7b7)',
                  clipPath: 'polygon(0 30%, 100% 0, 80% 100%, 0 100%)',
                  boxShadow: '0 0 12px rgba(52, 211, 153, 0.8)',
                  transform: 'translateY(-3px)'
                }} />
              </div>

              {/* High-Gloss Chrome Carbon Shaft with Metallic Shimmer */}
              <div style={{
                flex: 1,
                height: '6px',
                background: 'linear-gradient(90deg, #1e293b 0%, #cbd5e1 30%, #ffffff 50%, #64748b 75%, #0f172a 100%)',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
                borderRadius: '2px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div className="arrow-shaft-shimmer" />
              </div>

              {/* Razor Steel Chrome Bullet Arrowhead Tip */}
              <div style={{
                width: '24px',
                height: '10px',
                background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 40%, #64748b 80%, #334155 100%)',
                clipPath: 'polygon(0 15%, 100% 50%, 0 85%)',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.9), 0 0 8px #fbbf24'
              }} />

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

      {/* Keyframes for Metallic Arrow Entrance & Shimmer */}
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

        @keyframes metallicArrowEntrance {
          0% {
            opacity: 0;
            transform: translateX(-240px) scale(0.8);
          }
          70% {
            opacity: 1;
            transform: translateX(15px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateX(0px) scale(1);
          }
        }

        .metallic-arrow-entrance {
          animation: metallicArrowEntrance 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes arrowShaftShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .arrow-shaft-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
          animation: arrowShaftShimmer 2s infinite ease-in-out;
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
