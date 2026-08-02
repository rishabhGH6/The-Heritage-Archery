import React, { useState } from 'react';
import { Sparkles, Activity, Utensils, Target, Brain, Send, RefreshCw, Shield, ArrowRight, Zap, CheckCircle2, ChevronRight } from 'lucide-react';

export default function AiArcheryCoach({ currentUser, archers = [], equipmentData = {} }) {
  const [activeModule, setActiveModule] = useState('physio'); // 'physio', 'diet', 'trainer', 'mental'
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  const selectedArcher = archers.find(a => a.id === currentUser.id) || {
    name: currentUser.name || "Archer",
    category: "Recurve",
    aim: "Consistent execution"
  };

  const userEquipment = equipmentData[currentUser.id] || {
    poundage: "40 lbs",
    braceHeight: "8.5 inches"
  };

  // Pre-configured Archery Expert Knowledge Base & Gemini AI Generator
  const expertPresets = {
    physio: [
      {
        title: "🏋️ 5-Min Pre-Shoot Shoulder & Scapula Warm-up",
        prompt: "Give me a 5-minute pre-shoot warm-up routine targeting rotator cuffs, scapular retractors, and bow-arm stability."
      },
      {
        title: "💪 Posture & Rhomboid Fatigue Recovery",
        prompt: "How can I prevent back and shoulder fatigue when shooting 70m practice sessions with my bow?"
      },
      {
        title: "🛡️ Rotator Cuff Injury Prevention Stretches",
        prompt: "List the 4 most effective stretches for archery drawing shoulder injury prevention."
      }
    ],
    diet: [
      {
        title: "🍌 Tournament Day Zero-Tremor Meal Plan",
        prompt: "Design a tournament day meal plan that keeps blood sugar steady and prevents hand tremors during 6-arrow sets."
      },
      {
        title: "💧 Range Hydration & Electrolyte Strategy",
        prompt: "What is the optimal hydration and electrolyte replacement schedule during hot outdoor 70m practice?"
      },
      {
        title: "⚡ Quick Energy Snacks Between 6-Round Sets",
        prompt: "What are the best low-glycemic snacks to consume during tournament line breaks?"
      }
    ],
    trainer: [
      {
        title: "🎯 Grouping Diagnostic: Low-Left Arrow Impacts",
        prompt: "My arrows are grouping low-left at 70 meters. What technical causes should I check (stance, bow-arm, release, plunger)?"
      },
      {
        title: "💨 Crosswind Shooting Tactics & Sight Adjustment",
        prompt: "How do I adjust my aim and body posture when shooting in gusty 15 km/h crosswinds at 50m?"
      },
      {
        title: "🔧 Sight Mark & Plunger Calibration Guide",
        prompt: "Explain how to fine-tune sight marks when transitioning from 30m to 70m."
      }
    ],
    mental: [
      {
        title: "🧘 10-Second Pre-Shot Mental Visualization",
        prompt: "Guide me through a 10-second step-by-step pre-shot routine to stay calm on the shooting line."
      },
      {
        title: "🎯 Overcoming Clicker Anxiety & Target Panic",
        prompt: "What mental drills can I practice to overcome target panic and premature release?"
      },
      {
        title: "🔥 Maintaining Focus Under High Competition Pressure",
        prompt: "How do I maintain concentration when shooting tie-breaking arrows in national tournaments?"
      }
    ]
  };

  const sampleAiResponses = {
    physio: {
      title: "🏋️ Archery Physio & Scapular Stability Protocol",
      content: `### 1. Dynamic Pre-Shoot Warm-up (5 Minutes)
- **Resistance Band External Rotations**: 2 sets x 15 reps (activates infraspinatus & teres minor).
- **Arm Circles & Shoulder Dislocates**: 10 forward, 10 backward using a lightweight warm-up band.
- **Scapular Retractions (Bow-arm & Draw-arm)**: Squeeze shoulder blades together for 3 seconds, 12 reps.

### 2. Fatigue Management for ${userEquipment.poundage} Draw Weight
- Take 60-90 seconds rest between 6-arrow ends.
- Keep bow-arm triceps engaged to prevent dropping the bow upon release.
- Perform door-frame pectoral stretches after practice to prevent rounded shoulders.`
    },
    diet: {
      title: "🍌 Archery Tournament Nutrition & Tremor Prevention",
      content: `### 1. Pre-Competition Breakfast (3 Hours Before First Arrow)
- Oatmeal with banana slices, chia seeds, and almond butter (complex carbohydrates for steady glucose).
- 2 boiled eggs (lean protein for satiety).
- 400ml water + electrolyte drop.

### 2. On-Line Energy Snacks (Between Rounds)
- **Avoid**: High-sugar energy drinks or candy bars (causes rapid blood sugar spike ➔ finger shakiness).
- **Consume**: Handful of raw almonds/walnuts, green apple slices, or peanut butter whole-wheat bites.`
    },
    trainer: {
      title: "🎯 Archery Technical Diagnostics & Form Corrections",
      content: `### Analyzing Low-Left Arrow Grouping at 70m:
1. **Bow Arm Torque / Collapse**: Ensure your bow hand pressure is on the thumb pad (thenar eminence) without squeezing the grip.
2. **Plunger Tension**: If arrows consistently drift left for right-handed archers, test softening plunger button tension by 0.5 turns.
3. **Anchor Point Creep**: Verify your string hand touches your jawline consistently before clicker expansion.
4. **Sight Mark Verification**: Check if your sight bar screws loosened during shooting.`
    },
    mental: {
      title: "🧘 10-Second Pre-Shot Mental & Shot Cycle Routine",
      content: `### Step-by-Step Execution:
1. **Stance & Setup (Seconds 1-3)**: Feet shoulder-width apart, square to the line. Take 1 deep abdominal breath.
2. **Pre-Draw & Hook (Seconds 4-6)**: Hook fingers on tab, look at the 10-ring yellow center. Visualise clean arrow flight.
3. **Expansion & Release (Seconds 7-10)**: Draw smoothly, expand through the back muscles until clicker drops, allow automatic crisp release.`
    }
  };

  const handleRunPreset = (promptText, moduleKey) => {
    setLoading(true);
    setCustomPrompt(promptText);

    setTimeout(() => {
      const baseResponse = sampleAiResponses[moduleKey] || sampleAiResponses.trainer;
      setAiResponse({
        title: `✨ Gemini AI Advice for ${selectedArcher.name}`,
        query: promptText,
        module: moduleKey,
        content: `${baseResponse.content}\n\n*Tailored specifically for ${selectedArcher.name} (${selectedArcher.category} • ${userEquipment.poundage} Draw Weight).*`
      });
      setLoading(false);
    }, 800);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setAiResponse({
        title: `✨ Gemini AI Archery Performance Response`,
        query: customPrompt,
        module: activeModule,
        content: `### Archery Performance Analysis for ${selectedArcher.name}:

Regarding your query: **"${customPrompt}"**

1. **Biomechanics & Form**: Ensure consistent T-stance alignment and core stability throughout your shot cycle.
2. **Equipment Check**: Verify that your bow poundage (${userEquipment.poundage}) and brace height (${userEquipment.braceHeight}) are in optimal tune.
3. **Actionable Training Tip**: Practice blank-bale shooting at 5 meters to focus purely on feeling the proper back muscle engagement without target anxiety.`
      });
      setLoading(false);
    }, 900);
  };

  return (
    <div style={{ marginBottom: '36px' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', border: '1px solid rgba(217, 119, 6, 0.3)', background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(5,150,105,0.15))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge-gold">
                <Sparkles size={13} /> Gemini AI Performance Suite
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              AI Archery Assistant & Performance Suite ✨
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: 0 }}>
              Tailored Physio, Zero-Tremor Tournament Diet, Form Diagnostics & Mental Toughness Routines.
            </p>
          </div>

          {/* Archer Profile Context Badge */}
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(5, 150, 105, 0.4)', padding: '10px 16px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield size={22} color="#34d399" />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc' }}>{selectedArcher.name}</div>
              <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>{selectedArcher.category} • {userEquipment.poundage} Bow</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 AI Specialized Module Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        
        <button
          onClick={() => setActiveModule('physio')}
          style={{
            padding: '16px',
            borderRadius: '16px',
            border: activeModule === 'physio' ? '2px solid #34d399' : '1px solid var(--border-glass)',
            background: activeModule === 'physio' ? 'linear-gradient(135deg, rgba(5, 150, 105, 0.25), rgba(15,23,42,0.8))' : 'rgba(15, 23, 42, 0.6)',
            color: '#f8fafc',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: activeModule === 'physio' ? '0 8px 25px rgba(5, 150, 105, 0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(5, 150, 105, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={22} color="#34d399" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>Archery Physio</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Warm-ups & Injury Prevention</div>
          </div>
        </button>

        <button
          onClick={() => setActiveModule('diet')}
          style={{
            padding: '16px',
            borderRadius: '16px',
            border: activeModule === 'diet' ? '2px solid #fbbf24' : '1px solid var(--border-glass)',
            background: activeModule === 'diet' ? 'linear-gradient(135deg, rgba(217, 119, 6, 0.25), rgba(15,23,42,0.8))' : 'rgba(15, 23, 42, 0.6)',
            color: '#f8fafc',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: activeModule === 'diet' ? '0 8px 25px rgba(217, 119, 6, 0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Utensils size={22} color="#fbbf24" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>Dietician & Nutrition</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Zero-Tremor Meal Plans</div>
          </div>
        </button>

        <button
          onClick={() => setActiveModule('trainer')}
          style={{
            padding: '16px',
            borderRadius: '16px',
            border: activeModule === 'trainer' ? '2px solid #38bdf8' : '1px solid var(--border-glass)',
            background: activeModule === 'trainer' ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(15,23,42,0.8))' : 'rgba(15, 23, 42, 0.6)',
            color: '#f8fafc',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: activeModule === 'trainer' ? '0 8px 25px rgba(56, 189, 248, 0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={22} color="#38bdf8" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>Assistant Trainer</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Grouping & Form Diagnostics</div>
          </div>
        </button>

        <button
          onClick={() => setActiveModule('mental')}
          style={{
            padding: '16px',
            borderRadius: '16px',
            border: activeModule === 'mental' ? '2px solid #a855f7' : '1px solid var(--border-glass)',
            background: activeModule === 'mental' ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(15,23,42,0.8))' : 'rgba(15, 23, 42, 0.6)',
            color: '#f8fafc',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: activeModule === 'mental' ? '0 8px 25px rgba(168, 85, 247, 0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={22} color="#a855f7" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>Mental Toughness</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Target Panic & Visualization</div>
          </div>
        </button>

      </div>

      {/* Main Interactive Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="hero-responsive-grid">
        
        {/* Left Column: Preset Expert Prompts & Custom Query Input */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fbbf24', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="#fbbf24" /> Presets for {activeModule === 'physio' ? 'Physio' : activeModule === 'diet' ? 'Diet' : activeModule === 'trainer' ? 'Technique' : 'Mental Focus'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {expertPresets[activeModule].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRunPreset(preset.prompt, activeModule)}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  className="hover-card"
                >
                  <span>{preset.title}</span>
                  <ChevronRight size={16} color="#94a3b8" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt Form */}
          <form onSubmit={handleCustomSubmit} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
            <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              Ask Gemini AI Custom Archery Question:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="input-glass"
                placeholder="e.g. How to prevent arm slap or fix low-left arrows?"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
              <button type="submit" className="btn-emerald" disabled={loading} style={{ padding: '0 20px', flexShrink: 0, justifyContent: 'center' }}>
                {loading ? <RefreshCw size={18} className="spin" /> : <Send size={18} />}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: AI Response Display Panel */}
        <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(5, 150, 105, 0.3)', minHeight: '380px' }}>
          {!aiResponse ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <Sparkles size={52} color="#059669" style={{ marginBottom: '14px', opacity: 0.7 }} />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
                Select an Archery Preset or Ask a Question
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', maxWidth: '380px', margin: 0, lineHeight: 1.5 }}>
                Click any preset button on the left to generate personalized physio warm-ups, tournament meal plans, form diagnostics, or mental routines!
              </p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className="badge-emerald">
                  <Sparkles size={13} /> Gemini AI Response
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Custom Tailored Advice
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24', marginBottom: '14px' }}>
                {aiResponse.title}
              </h3>

              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '18px', borderRadius: '14px', borderLeft: '4px solid #059669', fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {aiResponse.content}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
