import React, { useState, useEffect } from 'react';
import { Volume2, AlertOctagon, ShieldAlert, Play, Square, RefreshCw, Clock, Flame } from 'lucide-react';

export default function RangeWhistleControl() {
  const [activeSignal, setActiveSignal] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(120); // 120s for 3 arrows, 240s for 6 arrows
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMax, setTimerMax] = useState(120);
  const [emergencyAlert, setEmergencyAlert] = useState(false);

  // Web Audio API Whistle Sound Synthesizer (2850 Hz Archery Range Pitch)
  const playWhistleSound = (blastCount, isEmergency = false) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const blastDuration = isEmergency ? 0.2 : 0.45;
      const gap = isEmergency ? 0.15 : 0.25;

      for (let i = 0; i < blastCount; i++) {
        const startTime = ctx.currentTime + i * (blastDuration + gap);

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // 2850 Hz is standard World Archery referee whistle pitch
        osc.type = isEmergency ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(isEmergency ? 3400 : 2850, startTime);
        
        // Tremolo trill for realistic referee whistle sound
        const trill = ctx.createOscillator();
        trill.frequency.value = 35;
        const trillGain = ctx.createGain();
        trillGain.gain.value = 300;
        trill.connect(osc.frequency);
        trill.start(startTime);
        trill.stop(startTime + blastDuration);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.8, startTime + 0.04);
        gain.gain.linearRampToValueAtTime(0.8, startTime + blastDuration - 0.04);
        gain.gain.linearRampToValueAtTime(0, startTime + blastDuration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + blastDuration);
      }
    } catch (e) {
      console.warn("Web Audio API not supported:", e);
    }
  };

  // Timer Countdown Effect
  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      // Automatically blast 3 whistles when 120s timer expires (Collect Arrows & Score)
      handleThreeWhistles();
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const handleTwoWhistles = () => {
    setEmergencyAlert(false);
    setActiveSignal({
      code: "2 WHISTLES (🔊🔊)",
      label: "ARCHERS TO THE SHOOTING LINE",
      description: "Archers step from waiting line to shooting line with bow & quiver.",
      color: "#fbbf24"
    });
    playWhistleSound(2);
  };

  const handleOneWhistle = () => {
    setEmergencyAlert(false);
    setActiveSignal({
      code: "1 WHISTLE (🔊)",
      label: "COMMENCE SHOOTING",
      description: "Shooting line is active. 120s countdown running.",
      color: "#34d399"
    });
    playWhistleSound(1);
    setTimerSeconds(timerMax);
    setTimerRunning(true);
  };

  const handleThreeWhistles = () => {
    setEmergencyAlert(false);
    setTimerRunning(false);
    setActiveSignal({
      code: "3 WHISTLES (🔊🔊🔊)",
      label: "CEASE FIRE & COLLECT ARROWS",
      description: "Shooting end complete. Step forward to targets to score & retrieve arrows.",
      color: "#38bdf8"
    });
    playWhistleSound(3);
  };

  const handleEmergencyCeasefire = () => {
    setTimerRunning(false);
    setEmergencyAlert(true);
    setActiveSignal({
      code: "4+ CONTINUOUS WHISTLES (🚨🚨🚨)",
      label: "EMERGENCY CEASE FIRE!",
      description: "STOP SHOOTING IMMEDIATELY! Un-draw bow, replace arrows, step back to waiting line.",
      color: "#ef4444"
    });
    playWhistleSound(5, true);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={`glass-card ${emergencyAlert ? 'pulse-glow' : ''}`} style={{
      padding: '20px',
      marginBottom: '24px',
      border: emergencyAlert ? '2px solid #ef4444' : '1px solid rgba(217, 119, 6, 0.4)',
      background: emergencyAlert ? 'rgba(239, 68, 68, 0.2)' : 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(217,119,6,0.1))'
    }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-gold">
              <Volume2 size={13} /> World Archery Official Line Signals
            </span>
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Tournament Range Whistle & Timer System 🔊
          </h3>
        </div>

        {/* Timer Mode Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => { setTimerMax(120); setTimerSeconds(120); setTimerRunning(false); }}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: timerMax === 120 ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
              background: timerMax === 120 ? 'rgba(217, 119, 6, 0.25)' : 'rgba(15,23,42,0.6)',
              color: timerMax === 120 ? '#fbbf24' : '#94a3b8',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            120s (3-Arrow End)
          </button>

          <button
            onClick={() => { setTimerMax(240); setTimerSeconds(240); setTimerRunning(false); }}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: timerMax === 240 ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
              background: timerMax === 240 ? 'rgba(217, 119, 6, 0.25)' : 'rgba(15,23,42,0.6)',
              color: timerMax === 240 ? '#fbbf24' : '#94a3b8',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            240s (6-Arrow End)
          </button>
        </div>
      </div>

      {/* Main Signal Command Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        
        {/* 2 Whistles */}
        <button
          onClick={handleTwoWhistles}
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(15, 23, 42, 0.8))',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            padding: '14px',
            borderRadius: '12px',
            color: '#f8fafc',
            cursor: 'pointer',
            textAlign: 'left'
          }}
          className="hover-card"
        >
          <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 800 }}>🔊 2 WHISTLES</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, margin: '2px 0' }}>Archers to Line</div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Step to shooting line</div>
        </button>

        {/* 1 Whistle */}
        <button
          onClick={handleOneWhistle}
          style={{
            background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.25), rgba(15, 23, 42, 0.8))',
            border: '1px solid rgba(5, 150, 105, 0.4)',
            padding: '14px',
            borderRadius: '12px',
            color: '#f8fafc',
            cursor: 'pointer',
            textAlign: 'left'
          }}
          className="hover-card"
        >
          <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 800 }}>🔊 1 WHISTLE</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, margin: '2px 0' }}>Begin Shooting 🏹</div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Starts {timerMax}s timer</div>
        </button>

        {/* 3 Whistles */}
        <button
          onClick={handleThreeWhistles}
          style={{
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(15, 23, 42, 0.8))',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            padding: '14px',
            borderRadius: '12px',
            color: '#f8fafc',
            cursor: 'pointer',
            textAlign: 'left'
          }}
          className="hover-card"
        >
          <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>🔊 3 WHISTLES</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, margin: '2px 0' }}>Collect & Score 🎯</div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Step forward to target</div>
        </button>

        {/* Emergency Ceasefire */}
        <button
          onClick={handleEmergencyCeasefire}
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(15, 23, 42, 0.9))',
            border: '2px solid #ef4444',
            padding: '14px',
            borderRadius: '12px',
            color: '#f8fafc',
            cursor: 'pointer',
            textAlign: 'left'
          }}
          className="hover-card"
        >
          <div style={{ fontSize: '0.72rem', color: '#fca5a5', fontWeight: 800 }}>🚨 4+ CONTINUOUS</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fca5a5', margin: '2px 0' }}>EMERGENCY STOP</div>
          <div style={{ fontSize: '0.7rem', color: '#fca5a5' }}>Cease fire immediately!</div>
        </button>

      </div>

      {/* Active Signal Banner & Timer Display */}
      <div style={{ background: 'rgba(15,23,42,0.8)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        
        <div>
          {activeSignal ? (
            <div>
              <div style={{ fontSize: '0.8rem', color: activeSignal.color, fontWeight: 800 }}>
                ACTIVE LINE SIGNAL: {activeSignal.code}
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: '2px 0' }}>
                {activeSignal.label}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                {activeSignal.description}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>
                OFFICIAL RANGE COMMAND CENTER
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                Click any whistle signal above to command the practice range.
              </div>
            </div>
          )}
        </div>

        {/* Range Timer Display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(9,13,22,0.9)', padding: '10px 18px', borderRadius: '12px', border: '1px solid rgba(217, 119, 6, 0.4)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Range Clock</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: timerSeconds <= 30 ? '#ef4444' : '#34d399', fontFamily: 'monospace' }}>
              {formatTime(timerSeconds)}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
