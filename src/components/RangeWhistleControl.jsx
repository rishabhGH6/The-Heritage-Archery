import React, { useState, useEffect, useRef } from 'react';
import { Volume2, AlertOctagon, ShieldAlert, Play, Square, RefreshCw, Clock, Flame, Zap } from 'lucide-react';

export default function RangeWhistleControl() {
  const [timerMax, setTimerMax] = useState(90); // Default 90s for 3-arrow end, 180s for 6-arrow end
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [phase, setPhase] = useState('IDLE'); // 'IDLE', 'LINE_ACCESS' (10s), 'SHOOTING' (90s/180s), 'COLLECT', 'EMERGENCY'
  const [activeSignal, setActiveSignal] = useState(null);
  const [emergencyAlert, setEmergencyAlert] = useState(false);

  const [audioSource, setAudioSource] = useState('real_audio'); // 'real_audio' (sports-whistle.mp3) or 'synth'

  // Play real sports whistle audio file (public/whistle.mp3) with Web Audio 350% Volume Boost
  const playRealAudioWhistle = (blastCount, isEmergency = false) => {
    let playCount = 0;
    const gapMs = isEmergency ? 120 : 220;

    const playNext = async () => {
      if (playCount >= blastCount) return;
      playCount++;

      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();

          // 3.5x (350%) High-Power Volume Boost
          const gainNode = ctx.createGain();
          gainNode.gain.setValueAtTime(3.5, ctx.currentTime);

          // Dynamics Compressor to punch maximum loudness without distortion
          const compressor = ctx.createDynamicsCompressor();
          compressor.threshold.setValueAtTime(-6, ctx.currentTime);
          compressor.knee.setValueAtTime(30, ctx.currentTime);
          compressor.ratio.setValueAtTime(12, ctx.currentTime);
          compressor.attack.setValueAtTime(0, ctx.currentTime);
          compressor.release.setValueAtTime(0.25, ctx.currentTime);

          const response = await fetch('/whistle.mp3');
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;

          source.connect(gainNode);
          gainNode.connect(compressor);
          compressor.connect(ctx.destination);

          source.start(0);
        } else {
          const audio = new Audio('/whistle.mp3');
          audio.volume = 1.0;
          audio.play();
        }
      } catch (err) {
        console.warn("Web Audio boost error, playing standard audio:", err);
        const audio = new Audio('/whistle.mp3');
        audio.volume = 1.0;
        audio.play().catch(e => console.warn(e));
      }

      if (playCount < blastCount) {
        // Schedule next blast in sequence after current whistle finishes (~450ms + gapMs)
        setTimeout(playNext, 450 + gapMs);
      }
    };

    playNext();
  };

  const triggerWhistleSignal = (blastCount, isEmergency = false) => {
    if (audioSource === 'real_audio') {
      playRealAudioWhistle(blastCount, isEmergency);
    } else {
      playWhistleSound(blastCount, isEmergency);
    }
  };

  // Web Audio API Whistle Sound Synthesizer with High-Power Volume Boost & Harmonic Resonance
  const playWhistleSound = (blastCount, isEmergency = false) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Master Gain for maximum loudness boost (220% volume)
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(2.2, ctx.currentTime);

      // Dynamics Compressor to punch volume without distortion
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-10, ctx.currentTime);
      compressor.knee.setValueAtTime(40, ctx.currentTime);
      compressor.ratio.setValueAtTime(12, ctx.currentTime);
      compressor.attack.setValueAtTime(0, ctx.currentTime);
      compressor.release.setValueAtTime(0.25, ctx.currentTime);

      masterGain.connect(compressor);
      compressor.connect(ctx.destination);

      const blastDuration = isEmergency ? 0.22 : 0.48;
      const gap = isEmergency ? 0.12 : 0.22;

      for (let i = 0; i < blastCount; i++) {
        const startTime = ctx.currentTime + i * (blastDuration + gap);

        // Primary Whistle Frequency (2850 Hz - World Archery standard)
        const osc1 = ctx.createOscillator();
        // Secondary Overtone (5700 Hz - High pitch piercing harmonic for outdoor range clarity)
        const osc2 = ctx.createOscillator();

        const gain = ctx.createGain();

        osc1.type = isEmergency ? 'sawtooth' : 'sine';
        osc1.frequency.setValueAtTime(isEmergency ? 3400 : 2850, startTime);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(isEmergency ? 6800 : 5700, startTime);

        // 35 Hz Referee Whistle Tremolo Trill
        const trill = ctx.createOscillator();
        trill.frequency.value = 35;
        const trillGain = ctx.createGain();
        trillGain.gain.value = 350;
        trill.connect(osc1.frequency);
        trill.start(startTime);
        trill.stop(startTime + blastDuration);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(1.0, startTime + 0.03);
        gain.gain.linearRampToValueAtTime(1.0, startTime + blastDuration - 0.03);
        gain.gain.linearRampToValueAtTime(0, startTime + blastDuration);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(masterGain);

        osc1.start(startTime);
        osc2.start(startTime);
        osc1.stop(startTime + blastDuration);
        osc2.stop(startTime + blastDuration);
      }
    } catch (e) {
      console.warn("Web Audio API warning:", e);
    }
  };

  // Timer Machine Effect
  useEffect(() => {
    let interval = null;

    if ((phase === 'LINE_ACCESS' || phase === 'SHOOTING') && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      if (phase === 'LINE_ACCESS') {
        // 10s Line Access countdown complete! Automatically sound 1 whistle and start shooting timer (90s or 180s)!
        setPhase('SHOOTING');
        setTimerSeconds(timerMax);
        setActiveSignal({
          code: "1 WHISTLE (🔊)",
          label: "COMMENCE SHOOTING 🏹",
          description: `Shooting active! ${timerMax}s countdown running.`,
          color: "#34d399"
        });
        triggerWhistleSignal(1);
      } else if (phase === 'SHOOTING') {
        // Shooting timer complete! Automatically sound 3 whistles (Collect & Score Arrows)!
        setPhase('COLLECT');
        setActiveSignal({
          code: "3 WHISTLES (🔊🔊🔊)",
          label: "CEASE FIRE & COLLECT ARROWS 🎯",
          description: "Shooting end complete! Step forward to targets to score & retrieve arrows.",
          color: "#38bdf8"
        });
        triggerWhistleSignal(3);
      }
    }

    return () => clearInterval(interval);
  }, [phase, timerSeconds, timerMax]);

  // 1. Archers to Line (2 Whistles + 10s Pre-Shoot Countdown)
  const handleTwoWhistles = () => {
    setEmergencyAlert(false);
    setPhase('LINE_ACCESS');
    setTimerSeconds(10); // 10 seconds pre-shoot line access timer
    setActiveSignal({
      code: "2 WHISTLES (🔊🔊)",
      label: "ARCHERS TO THE SHOOTING LINE",
      description: "10s line access timer running! Step to shooting line & hook bow string. 1 whistle will sound automatically when timer reaches 0.",
      color: "#fbbf24"
    });
    triggerWhistleSignal(2);
  };

  // 2. Begin Shooting Manually (1 Whistle + 90s/180s Countdown)
  const handleOneWhistle = () => {
    setEmergencyAlert(false);
    setPhase('SHOOTING');
    setTimerSeconds(timerMax);
    setActiveSignal({
      code: "1 WHISTLE (🔊)",
      label: "COMMENCE SHOOTING 🏹",
      description: `Shooting active! ${timerMax}s countdown running. 3 whistles will sound automatically at 0.`,
      color: "#34d399"
    });
    triggerWhistleSignal(1);
  };

  // 3. Cease Fire & Collect Arrows Manually (3 Whistles)
  const handleThreeWhistles = () => {
    setEmergencyAlert(false);
    setPhase('COLLECT');
    setActiveSignal({
      code: "3 WHISTLES (🔊🔊🔊)",
      label: "CEASE FIRE & COLLECT ARROWS 🎯",
      description: "Shooting end complete! Step forward to targets to score & retrieve arrows.",
      color: "#38bdf8"
    });
    triggerWhistleSignal(3);
  };

  // 4. Emergency Cease Fire (Continuous Whistles)
  const handleEmergencyCeasefire = () => {
    setPhase('EMERGENCY');
    setEmergencyAlert(true);
    setActiveSignal({
      code: "4+ CONTINUOUS WHISTLES (🚨🚨🚨)",
      label: "EMERGENCY CEASE FIRE!",
      description: "STOP SHOOTING IMMEDIATELY! Un-draw bow, replace arrows, step back behind waiting line.",
      color: "#ef4444"
    });
    triggerWhistleSignal(5, true);
  };

  const handleSelectTimerMax = (secs) => {
    setTimerMax(secs);
    setTimerSeconds(secs);
    if (phase !== 'LINE_ACCESS' && phase !== 'SHOOTING') {
      setPhase('IDLE');
    }
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
              <Volume2 size={13} /> Official World Archery Line Signals
            </span>
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Automated Range Whistle & Timer System 🔊
          </h3>
        </div>

        {/* Shooting End Duration & Audio Engine Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: 'rgba(15,23,42,0.6)', padding: '3px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => setAudioSource('real_audio')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: audioSource === 'real_audio' ? '#38bdf8' : 'transparent',
                color: audioSource === 'real_audio' ? '#0f172a' : '#94a3b8',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
              title="Use authentic MyInstants Sports Whistle audio recording"
            >
              🔊 Real Sports Whistle
            </button>
            <button
              onClick={() => setAudioSource('synth')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: audioSource === 'synth' ? '#fbbf24' : 'transparent',
                color: audioSource === 'synth' ? '#0f172a' : '#94a3b8',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
              title="Use synthesized range whistle frequency"
            >
              ⚡ Synth Tone
            </button>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => handleSelectTimerMax(90)}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                border: timerMax === 90 ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
                background: timerMax === 90 ? 'rgba(217, 119, 6, 0.3)' : 'rgba(15,23,42,0.6)',
                color: timerMax === 90 ? '#fbbf24' : '#94a3b8',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              90s (3-Arrow)
            </button>

            <button
              onClick={() => handleSelectTimerMax(180)}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                border: timerMax === 180 ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
                background: timerMax === 180 ? 'rgba(217, 119, 6, 0.3)' : 'rgba(15,23,42,0.6)',
                color: timerMax === 180 ? '#fbbf24' : '#94a3b8',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              180s (6-Arrow)
            </button>
          </div>
        </div>
      </div>

      {/* Main Signal Command Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        
        {/* 2 Whistles (Archers to Line + 10s Countdown) */}
        <button
          onClick={handleTwoWhistles}
          style={{
            background: phase === 'LINE_ACCESS' ? 'rgba(245, 158, 11, 0.4)' : 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(15, 23, 42, 0.8))',
            border: phase === 'LINE_ACCESS' ? '2px solid #fbbf24' : '1px solid rgba(245, 158, 11, 0.4)',
            padding: '14px',
            borderRadius: '12px',
            color: '#f8fafc',
            cursor: 'pointer',
            textAlign: 'left'
          }}
          className="hover-card"
        >
          <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 800 }}>🔊 2 WHISTLES (AUTO 10S)</div>
          <div style={{ fontSize: '0.98rem', fontWeight: 800, margin: '2px 0' }}>Archers to Line</div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>10s pre-shoot timer + Auto 1 whistle</div>
        </button>

        {/* 1 Whistle (Commence Shooting) */}
        <button
          onClick={handleOneWhistle}
          style={{
            background: phase === 'SHOOTING' ? 'rgba(5, 150, 105, 0.4)' : 'linear-gradient(135deg, rgba(5, 150, 105, 0.25), rgba(15, 23, 42, 0.8))',
            border: phase === 'SHOOTING' ? '2px solid #34d399' : '1px solid rgba(5, 150, 105, 0.4)',
            padding: '14px',
            borderRadius: '12px',
            color: '#f8fafc',
            cursor: 'pointer',
            textAlign: 'left'
          }}
          className="hover-card"
        >
          <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 800 }}>🔊 1 WHISTLE</div>
          <div style={{ fontSize: '0.98rem', fontWeight: 800, margin: '2px 0' }}>Begin Shooting 🏹</div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Starts {timerMax}s timer + Auto 3 whistles</div>
        </button>

        {/* 3 Whistles (Cease Fire & Collect) */}
        <button
          onClick={handleThreeWhistles}
          style={{
            background: phase === 'COLLECT' ? 'rgba(56, 189, 248, 0.4)' : 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(15, 23, 42, 0.8))',
            border: phase === 'COLLECT' ? '2px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.4)',
            padding: '14px',
            borderRadius: '12px',
            color: '#f8fafc',
            cursor: 'pointer',
            textAlign: 'left'
          }}
          className="hover-card"
        >
          <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>🔊 3 WHISTLES</div>
          <div style={{ fontSize: '0.98rem', fontWeight: 800, margin: '2px 0' }}>Collect & Score 🎯</div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Step forward to target</div>
        </button>

        {/* Emergency Ceasefire */}
        <button
          onClick={handleEmergencyCeasefire}
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.45), rgba(15, 23, 42, 0.9))',
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
          <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fca5a5', margin: '2px 0' }}>EMERGENCY STOP</div>
          <div style={{ fontSize: '0.7rem', color: '#fca5a5' }}>Cease fire immediately!</div>
        </button>

      </div>

      {/* Active Signal Banner & Timer Display */}
      <div style={{ background: 'rgba(15,23,42,0.85)', padding: '18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        
        <div style={{ flex: 1, minWidth: '260px' }}>
          {activeSignal ? (
            <div>
              <div style={{ fontSize: '0.8rem', color: activeSignal.color, fontWeight: 800 }}>
                ACTIVE RANGE SIGNAL: {activeSignal.code}
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: '3px 0' }}>
                {activeSignal.label}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                {activeSignal.description}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>
                OFFICIAL WORLD ARCHERY COMMAND CENTER
              </div>
              <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc' }}>
                Click <strong>2 Whistles (Archers to Line)</strong> to start the automated 10s line access ➔ shooting sequence!
              </div>
            </div>
          )}
        </div>

        {/* Range Clock Display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: phase === 'LINE_ACCESS' ? 'rgba(217,119,6,0.3)' : 'rgba(9,13,22,0.95)',
            padding: '10px 22px',
            borderRadius: '14px',
            border: phase === 'LINE_ACCESS' ? '2px solid #fbbf24' : '1px solid rgba(217, 119, 6, 0.4)',
            textAlign: 'center',
            minWidth: '130px'
          }}>
            <div style={{ fontSize: '0.7rem', color: phase === 'LINE_ACCESS' ? '#fbbf24' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
              {phase === 'LINE_ACCESS' ? 'LINE ACCESS (10s)' : phase === 'SHOOTING' ? 'SHOOTING CLOCK' : 'RANGE CLOCK'}
            </div>
            <div style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              color: phase === 'LINE_ACCESS' ? '#fbbf24' : timerSeconds <= 30 ? '#ef4444' : '#34d399',
              fontFamily: 'monospace'
            }}>
              {formatTime(timerSeconds)}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
