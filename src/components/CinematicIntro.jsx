import React, { useState, useEffect } from 'react';
import { Target, ArrowRight } from 'lucide-react';

export default function CinematicIntro({ onComplete }) {
  const [phase, setPhase] = useState(1); // 1: WELCOME, 2: to official portal of..., 3: THE HERITAGE ARCHERY

  useEffect(() => {
    // Step 1: WELCOME (0ms - 1800ms)
    const t1 = setTimeout(() => {
      setPhase(2);
    }, 1800);

    // Step 2: to the official team portal of (1800ms - 3600ms)
    const t2 = setTimeout(() => {
      setPhase(3);
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: '#070a12',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      overflow: 'hidden',
      color: '#f8fafc',
      userSelect: 'none'
    }}>
      
      {/* Subtle Background Radial Gold & Emerald Glow */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(5, 150, 105, 0.12) 0%, rgba(217, 119, 6, 0.12) 40%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      {/* Skip Button */}
      <button
        onClick={onComplete}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#94a3b8',
          padding: '8px 16px',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 100
        }}
        onMouseEnter={(e) => e.target.style.color = '#f8fafc'}
        onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
      >
        Skip Intro ✕
      </button>

      {/* Phase 1: WELCOME */}
      {phase === 1 && (
        <div className="intro-fade-in-out" style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            background: 'linear-gradient(180deg, #ffffff 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 20px rgba(255,255,255,0.2))'
          }}>
            WELCOME
          </h1>
        </div>
      )}

      {/* Phase 2: to the official team portal of */}
      {phase === 2 && (
        <div className="intro-fade-in-out" style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '1.6rem',
            fontWeight: 400,
            letterSpacing: '0.12em',
            color: '#cbd5e1',
            fontStyle: 'italic'
          }}>
            to the official team portal of
          </p>
        </div>
      )}

      {/* Phase 3: THE HERITAGE ARCHERY + Made by Archers for Archers */}
      {phase === 3 && (
        <div className="intro-fade-in-stay" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          
          <div style={{
            background: 'linear-gradient(135deg, #059669, #d97706)',
            padding: '16px',
            borderRadius: '20px',
            boxShadow: '0 0 40px rgba(5, 150, 105, 0.4)',
            marginBottom: '8px'
          }}>
            <Target size={48} color="#ffffff" />
          </div>

          <h1 style={{
            fontSize: '3.2rem',
            fontWeight: 900,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            background: 'linear-gradient(90deg, #f8fafc 0%, #fbbf24 50%, #34d399 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            lineHeight: 1.1,
            filter: 'drop-shadow(0 10px 30px rgba(217,119,6,0.3))'
          }}>
            THE HERITAGE ARCHERY
          </h1>

          <p style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#fbbf24',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ height: '1px', width: '40px', background: 'rgba(251, 191, 36, 0.4)' }} />
            Made by Archers for Archers
            <span style={{ height: '1px', width: '40px', background: 'rgba(251, 191, 36, 0.4)' }} />
          </p>

          <button
            onClick={onComplete}
            className="btn-gold"
            style={{
              marginTop: '24px',
              padding: '14px 36px',
              fontSize: '1.05rem',
              borderRadius: '9999px',
              boxShadow: '0 10px 30px rgba(217, 119, 6, 0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            ENTER PORTAL <ArrowRight size={18} />
          </button>

        </div>
      )}

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: scale(0.96); }
          30% { opacity: 1; transform: scale(1); }
          70% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.04); }
        }

        @keyframes fadeInStay {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .intro-fade-in-out {
          animation: fadeInOut 1.8s ease-in-out forwards;
        }

        .intro-fade-in-stay {
          animation: fadeInStay 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </div>
  );
}
