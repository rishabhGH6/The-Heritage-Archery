import React, { useState, useRef } from 'react';
import { Target, Save, Download, RefreshCw, CheckCircle, AlertCircle, FileText, ChevronRight, BarChart2, Shield } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function InteractiveScoring({ currentUser, archers = [], scoreLogs = [], onSaveScorecard }) {
  const [selectedArcherId, setSelectedArcherId] = useState(
    currentUser.role === 'archer' ? currentUser.id : (archers[0]?.id || '')
  );
  const [distance, setDistance] = useState("70m");
  const [targetType, setTargetType] = useState("10-ring"); // "10-ring" or "6-ring-center"
  const [currentRound, setCurrentRound] = useState(1);
  const [roundsData, setRoundsData] = useState([
    { roundNumber: 1, arrows: [] },
    { roundNumber: 2, arrows: [] },
    { roundNumber: 3, arrows: [] },
    { roundNumber: 4, arrows: [] },
    { roundNumber: 5, arrows: [] },
    { roundNumber: 6, arrows: [] }
  ]);

  // Selected arrow state for bullet tagging
  const [activeArrowIndex, setActiveArrowIndex] = useState(null);
  const [tempTags, setTempTags] = useState([]);
  const [tempComment, setTempComment] = useState("");

  const scorecardRef = useRef(null);

  // SVG Target Center & Size
  const svgRef = useRef(null);
  const TARGET_SIZE = 380;
  const CENTER = TARGET_SIZE / 2;
  const MAX_RADIUS = 175; // Boundary of ring 1 (or 5 for 6-ring center)

  // 6-Ring Spot Target Face Radius Fractions (Rings 5 to 10: Blue, Red, Yellow only)
  // X: 0.083, 10: 0.167, 9: 0.333, 8: 0.500, 7: 0.667, 6: 0.833, 5: 1.000
  const getScoreFromRadius = (rRatio) => {
    if (rRatio <= 0.083) return { score: 10, isX: true, ringName: 'X' };
    if (rRatio <= 0.167) return { score: 10, isX: false, ringName: '10' };
    if (rRatio <= 0.333) return { score: 9, isX: false, ringName: '9' };
    if (rRatio <= 0.500) return { score: 8, isX: false, ringName: '8' };
    if (rRatio <= 0.667) return { score: 7, isX: false, ringName: '7' };
    if (rRatio <= 0.833) return { score: 6, isX: false, ringName: '6' };
    if (rRatio <= 1.000) return { score: 5, isX: false, ringName: '5' };
    return { score: 0, isX: false, ringName: 'M' };
  };

  // Handle clicking on SVG target face
  const handleTargetClick = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert to relative ratio coordinates (-1 to 1)
    const xRatio = (clickX - CENTER) / MAX_RADIUS;
    const yRatio = (clickY - CENTER) / MAX_RADIUS;
    const dist = Math.sqrt(xRatio * xRatio + yRatio * yRatio);

    const { score, isX, ringName } = getScoreFromRadius(dist);

    const currentArrows = roundsData[currentRound - 1].arrows;
    if (currentArrows.length >= 6) {
      alert("Current round already has 6 arrows logged! Switch to next round or reset.");
      return;
    }

    const newArrow = {
      score,
      isX,
      ringName,
      xRatio,
      yRatio,
      tags: [],
      comment: ""
    };

    const updatedRounds = [...roundsData];
    updatedRounds[currentRound - 1].arrows.push(newArrow);
    setRoundsData(updatedRounds);

    // Open bullet tag modal for this newly placed arrow
    setActiveArrowIndex(updatedRounds[currentRound - 1].arrows.length - 1);
    setTempTags([]);
    setTempComment("");
  };

  // Remove last arrow from current round
  const handleUndoArrow = () => {
    const updatedRounds = [...roundsData];
    updatedRounds[currentRound - 1].arrows.pop();
    setRoundsData(updatedRounds);
    setActiveArrowIndex(null);
  };



  // Calculate totals
  const getRoundTotal = (roundObj) => {
    return roundObj.arrows.reduce((sum, a) => sum + a.score, 0);
  };

  const getGrandTotal = () => {
    return roundsData.reduce((sum, r) => sum + getRoundTotal(r), 0);
  };

  const getTotalXCount = () => {
    let count = 0;
    roundsData.forEach(r => r.arrows.forEach(a => { if (a.isX) count++; }));
    return count;
  };

  // Calculate Grouping Analysis for active round or overall session
  const calculateGrouping = (arrows) => {
    if (!arrows || arrows.length === 0) return null;
    let sumX = 0;
    let sumY = 0;
    arrows.forEach(a => {
      sumX += a.xRatio;
      sumY += a.yRatio;
    });
    const meanX = sumX / arrows.length;
    const meanY = sumY / arrows.length;

    // Radius variance
    let sumDistSq = 0;
    arrows.forEach(a => {
      const dx = a.xRatio - meanX;
      const dy = a.yRatio - meanY;
      sumDistSq += (dx * dx + dy * dy);
    });
    const spreadVal = Math.sqrt(sumDistSq / arrows.length);

    let tightness = "Super Tight 10-Ring Grouping 🎯";
    if (spreadVal > 0.4) tightness = "Scattered Shot Pattern 💨";
    else if (spreadVal > 0.25) tightness = "Moderate Grouping";

    let biasX = meanX > 0.12 ? "Right" : meanX < -0.12 ? "Left" : "";
    let biasY = meanY > 0.12 ? "Bottom" : meanY < -0.12 ? "Top" : "";
    let biasStr = [biasY, biasX].filter(Boolean).join("-") || "Center Centered";

    return {
      tightness,
      spreadRadius: `${(spreadVal * 12).toFixed(1)} cm`,
      bias: biasStr === "Center Centered" ? "Perfect Center Alignment" : `${biasStr} Drift`
    };
  };

  const activeRoundArrows = roundsData[currentRound - 1].arrows;
  const activeRoundGrouping = calculateGrouping(activeRoundArrows);
  const selectedArcher = archers.find(a => a.id === selectedArcherId) || archers[0];

  // Save current bullet tags to arrow
  const handleSaveArrowTags = () => {
    if (activeArrowIndex === null) return;
    const updatedRounds = [...roundsData];
    updatedRounds[currentRound - 1].arrows[activeArrowIndex].tags = tempTags;
    updatedRounds[currentRound - 1].arrows[activeArrowIndex].comment = tempComment;
    setRoundsData(updatedRounds);
    setActiveArrowIndex(null);
  };

  // Save whole scorecard
  const handleSaveSession = () => {
    if (currentUser.role === 'guest') {
      alert("🔒 Guest Mode: Please log in or register your archer account to save scorecards!");
      return;
    }
    const grandTotal = getGrandTotal();
    const allArrows = roundsData.flatMap(r => r.arrows);
    const sessionGrouping = calculateGrouping(allArrows);

    const newLog = {
      id: "score_" + Date.now(),
      archerId: selectedArcherId,
      archerName: selectedArcher?.name || "Archer",
      date: new Date().toISOString().split('T')[0],
      distance,
      rounds: roundsData.map((r, idx) => ({
        roundNumber: idx + 1,
        arrows: r.arrows,
        total: getRoundTotal(r)
      })),
      totalScore: grandTotal,
      groupingAnalysis: sessionGrouping || { tightness: "Standard Practice", spreadRadius: "4.0 cm", bias: "Center" }
    };

    onSaveScorecard(newLog);
    alert(`Scorecard saved successfully! Grand Total: ${grandTotal}/360 points.`);
  };

  // PDF Export
  const handleExportPDF = async () => {
    if (!scorecardRef.current) return;
    try {
      const canvas = await html2canvas(scorecardRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Heritage_Archery_Scorecard_${selectedArcher?.name}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error("PDF Export error:", err);
    }
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-emerald">
              <Target size={13} /> Official Target Tap Engine
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
            6-Round Target Face Practice & Scoring 🏹
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Authentic World Archery Target Face! Tap exact impact points to log scores & round grouping analytics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={handleExportPDF} className="btn-ghost" style={{ border: '1px solid rgba(217,119,6,0.4)', color: '#fbbf24' }}>
            <Download size={16} /> Export PDF Scorecard
          </button>
          <button onClick={handleSaveSession} className="btn-emerald">
            <Save size={16} /> Save Scorecard
          </button>
        </div>
      </div>

      {/* Target Setup Configuration Controls */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
              Archer Name
            </label>
            <select 
              className="select-glass" 
              value={selectedArcherId}
              onChange={(e) => setSelectedArcherId(e.target.value)}
              disabled={currentUser.role === 'archer'}
              style={{ minWidth: '180px' }}
            >
              {archers.length === 0 ? (
                <option value="">Guest Archer (Register to save)</option>
              ) : (
                archers.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))
              )}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
              Target Distance
            </label>
            <select className="select-glass" value={distance} onChange={(e) => setDistance(e.target.value)}>
              <option value="70m">70 Meters (Recurve Olympic)</option>
              <option value="50m">50 Meters (Compound / World Archery)</option>
              <option value="60m">60 Meters</option>
              <option value="30m">30 Meters</option>
            </select>
          </div>
        </div>

        {/* Grand Score Display Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Cumulative Total (36 Arrows)
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fbbf24', lineHeight: 1 }}>
              {getGrandTotal()} <span style={{ fontSize: '1rem', color: '#64748b' }}>/ 360</span>
            </div>
          </div>
          <div style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', padding: '10px 16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>{getTotalXCount()}</div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>X COUNTS</div>
          </div>
        </div>

      </div>

      {/* Round Selection Tabs (1 to 6) */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[1, 2, 3, 4, 5, 6].map(rNum => {
          const rObj = roundsData[rNum - 1];
          const rTotal = getRoundTotal(rObj);
          const isDone = rObj.arrows.length === 6;

          return (
            <button
              key={rNum}
              onClick={() => setCurrentRound(rNum)}
              style={{
                flex: 1,
                minWidth: '100px',
                padding: '12px',
                borderRadius: '14px',
                background: currentRound === rNum ? 'rgba(5, 150, 105, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                border: currentRound === rNum ? '2px solid #34d399' : '1px solid var(--border-glass)',
                color: '#f8fafc',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: currentRound === rNum ? '#34d399' : '#94a3b8', fontWeight: 700 }}>
                ROUND {rNum}
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, margin: '2px 0' }}>
                {rTotal} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>pts</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: isDone ? '#34d399' : '#94a3b8' }}>
                {rObj.arrows.length}/6 Arrows {isDone && '✓'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px' }} className="scoring-responsive-grid" ref={scorecardRef}>
        
        {/* Left Column: Authentic World Archery Target Face SVG */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', background: '#f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
              🎯 World Archery Target Face (Tap to Plot)
            </span>
            <button onClick={handleUndoArrow} className="btn-ghost" style={{ padding: '2px 8px', fontSize: '0.75rem', background: '#e2e8f0', color: '#0f172a' }}>
              Undo Last Shot ↩
            </button>
          </div>

          {/* Target Face SVG - Exact World Archery Replica */}
          <div style={{ position: 'relative', cursor: 'crosshair', userSelect: 'none' }}>
            <svg
              ref={svgRef}
              width={TARGET_SIZE}
              height={TARGET_SIZE}
              onClick={handleTargetClick}
              style={{
                borderRadius: '8px',
                boxShadow: '0 12px 35px rgba(0,0,0,0.25)',
                background: '#ffffff',
                border: '1px solid #cbd5e1'
              }}
            >
              {/* Target Registration Crosses on Edges */}
              <circle cx={10} cy={CENTER} r={4} fill="none" stroke="#000000" strokeWidth="1" />
              <line x1={4} y1={CENTER} x2={16} y2={CENTER} stroke="#000000" strokeWidth="1" />
              <line x1={10} y1={CENTER - 6} x2={10} y2={CENTER + 6} stroke="#000000" strokeWidth="1" />

              <circle cx={TARGET_SIZE - 10} cy={CENTER} r={4} fill="none" stroke="#000000" strokeWidth="1" />
              <line x1={TARGET_SIZE - 16} y1={CENTER} x2={TARGET_SIZE - 4} y2={CENTER} stroke="#000000" strokeWidth="1" />
              <line x1={TARGET_SIZE - 10} y1={CENTER - 6} x2={TARGET_SIZE - 10} y2={CENTER + 6} stroke="#000000" strokeWidth="1" />

              {/* 6 Concentric Scoring Rings (5 to 10: Blue, Red, Yellow ONLY) */}
              {/* Ring 5: Outer Blue */}
              <circle cx={CENTER} cy={CENTER} r={MAX_RADIUS * 1.000} fill="#0072ce" stroke="#111111" strokeWidth="1.2" />
              {/* Ring 6: Inner Blue */}
              <circle cx={CENTER} cy={CENTER} r={MAX_RADIUS * 0.833} fill="#0072ce" stroke="#111111" strokeWidth="1.2" />
              
              {/* Ring 7: Outer Red */}
              <circle cx={CENTER} cy={CENTER} r={MAX_RADIUS * 0.667} fill="#e4002b" stroke="#111111" strokeWidth="1.2" />
              {/* Ring 8: Inner Red */}
              <circle cx={CENTER} cy={CENTER} r={MAX_RADIUS * 0.500} fill="#e4002b" stroke="#111111" strokeWidth="1.2" />
              
              {/* Ring 9: Outer Yellow */}
              <circle cx={CENTER} cy={CENTER} r={MAX_RADIUS * 0.333} fill="#ffd100" stroke="#111111" strokeWidth="1.2" />
              {/* Ring 10: Inner Yellow */}
              <circle cx={CENTER} cy={CENTER} r={MAX_RADIUS * 0.167} fill="#ffd100" stroke="#111111" strokeWidth="1.2" />
              {/* Ring X: Center Yellow */}
              <circle cx={CENTER} cy={CENTER} r={MAX_RADIUS * 0.083} fill="#ffd100" stroke="#111111" strokeWidth="1.2" />

              {/* Center Crosshair + */}
              <line x1={CENTER - 8} y1={CENTER} x2={CENTER + 8} y2={CENTER} stroke="#111111" strokeWidth="1.5" />
              <line x1={CENTER} y1={CENTER - 8} x2={CENTER} y2={CENTER + 8} stroke="#111111" strokeWidth="1.5" />

              {/* Printed Ring Number Labels across horizontal axis */}
              <text x={CENTER + MAX_RADIUS * 0.11} y={CENTER + 4} fill="#111111" fontSize="11" fontWeight="bold" fontFamily="sans-serif">10</text>
              <text x={CENTER + MAX_RADIUS * 0.23} y={CENTER + 4} fill="#111111" fontSize="12" fontWeight="bold" fontFamily="sans-serif">9</text>
              <text x={CENTER + MAX_RADIUS * 0.40} y={CENTER + 4} fill="#111111" fontSize="12" fontWeight="bold" fontFamily="sans-serif">8</text>
              <text x={CENTER + MAX_RADIUS * 0.57} y={CENTER + 4} fill="#111111" fontSize="12" fontWeight="bold" fontFamily="sans-serif">7</text>
              <text x={CENTER + MAX_RADIUS * 0.73} y={CENTER + 4} fill="#111111" fontSize="12" fontWeight="bold" fontFamily="sans-serif">6</text>
              <text x={CENTER + MAX_RADIUS * 0.90} y={CENTER + 4} fill="#111111" fontSize="12" fontWeight="bold" fontFamily="sans-serif">5</text>

              {/* Plotted Arrow Markers */}
              {activeRoundArrows.map((arr, idx) => {
                const px = CENTER + arr.xRatio * MAX_RADIUS;
                const py = CENTER + arr.yRatio * MAX_RADIUS;
                return (
                  <g key={idx}>
                    {/* Arrow nock / impact point glow */}
                    <circle
                      cx={px}
                      cy={py}
                      r="7"
                      fill="#ef4444"
                      stroke="#ffffff"
                      strokeWidth="2"
                      filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.5))"
                    />
                    <text
                      x={px + 9}
                      y={py - 7}
                      fill="#0f172a"
                      fontSize="11"
                      fontWeight="800"
                      style={{ textShadow: '0 0 3px #ffffff' }}
                    >
                      #{idx + 1} ({arr.isX ? 'X' : arr.score})
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div style={{ marginTop: '14px', fontSize: '0.82rem', color: '#0f172a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Round {currentRound}: {activeRoundArrows.length} / 6 Arrows Logged
          </div>
        </div>

        {/* Right Column: Arrow Breakdown & Grouping Analytics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Arrow List Card for Round */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Round {currentRound} Arrow Scores</span>
              <span style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600 }}>
                Total: {getRoundTotal(roundsData[currentRound - 1])} pts
              </span>
            </h3>

            {activeRoundArrows.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                👈 Click on the target face to log Arrow #1 for Round {currentRound}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                {activeRoundArrows.map((arr, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setActiveArrowIndex(idx);
                      setTempTags(arr.tags || []);
                      setTempComment(arr.comment || "");
                    }}
                    style={{
                      background: activeArrowIndex === idx ? 'rgba(5,150,105,0.2)' : 'rgba(15,23,42,0.8)',
                      border: activeArrowIndex === idx ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.08)',
                      padding: '10px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Arrow #{idx + 1}</span>
                      <span style={{
                        background: arr.isX ? '#d97706' : arr.score >= 9 ? '#059669' : arr.score >= 7 ? '#e4002b' : '#0072ce',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        {arr.isX ? 'X' : arr.score}
                      </span>
                    </div>

                    {/* Bullet Tags Preview */}
                    {arr.tags && arr.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                        {arr.tags.map((tag, tIdx) => (
                          <span key={tIdx} style={{ fontSize: '0.65rem', background: 'rgba(217,119,6,0.2)', color: '#fbbf24', padding: '1px 5px', borderRadius: '4px' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* End of Round Shot Grouping Analysis Card */}
          <div className="glass-card" style={{ padding: '20px', border: '1px solid rgba(217, 119, 6, 0.3)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fbbf24', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={18} /> Round {currentRound} Grouping Analysis
            </h3>

            {activeRoundGrouping ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'rgba(15,23,42,0.7)', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Grouping Pattern</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginTop: '2px' }}>
                    {activeRoundGrouping.tightness}
                  </div>
                </div>

                <div style={{ background: 'rgba(15,23,42,0.7)', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Cluster Radius</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24', marginTop: '2px' }}>
                    {activeRoundGrouping.spreadRadius}
                  </div>
                </div>

                <div style={{ background: 'rgba(15,23,42,0.7)', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Directional Bias</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#cbd5e1', marginTop: '2px' }}>
                    {activeRoundGrouping.bias}
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Shot grouping analysis will generate automatically once you plot arrows for this round.
              </p>
            )}
          </div>

        </div>

      </div>

      {/* Arrow Bullet Tagging Modal */}
      {activeArrowIndex !== null && (
        <div className="modal-overlay" onClick={() => setActiveArrowIndex(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
              🏷️ Bullet Tags for Arrow #{activeArrowIndex + 1}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>Quick Tags</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Good shot', 'Bad release', 'New arrow', 'Wind drift', 'Clicker premature'].map(tag => {
                  const isSelected = tempTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (isSelected) setTempTags(tempTags.filter(t => t !== tag));
                        else setTempTags([...tempTags, tag]);
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        border: isSelected ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.1)',
                        background: isSelected ? 'rgba(5,150,105,0.25)' : 'rgba(15,23,42,0.6)',
                        color: isSelected ? '#34d399' : '#94a3b8',
                        cursor: 'pointer'
                      }}
                    >
                      {tag} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>

              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, marginTop: '8px' }}>
                Comment / Note for this Bullet
              </label>
              <input
                type="text"
                className="input-glass"
                placeholder="e.g., Felt smooth back tension release..."
                value={tempComment}
                onChange={(e) => setTempComment(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setActiveArrowIndex(null)} className="btn-ghost">Done</button>
              <button onClick={handleSaveArrowTags} className="btn-emerald">Save Tags</button>
            </div>
          </div>
        </div>
      )}

      {/* Historical Scorecard Log Table */}
      <div className="glass-card" style={{ padding: '24px', marginTop: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={20} color="#fbbf24" /> Saved Score History Log
        </h3>

        {scoreLogs.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No scorecards saved yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                  <th style={{ padding: '10px' }}>Date</th>
                  <th style={{ padding: '10px' }}>Archer</th>
                  <th style={{ padding: '10px' }}>Distance</th>
                  <th style={{ padding: '10px' }}>Total Score</th>
                  <th style={{ padding: '10px' }}>Grouping</th>
                </tr>
              </thead>
              <tbody>
                {scoreLogs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#f8fafc' }}>
                    <td style={{ padding: '10px' }}>{log.date}</td>
                    <td style={{ padding: '10px', fontWeight: 600 }}>{log.archerName}</td>
                    <td style={{ padding: '10px' }}>{log.distance}</td>
                    <td style={{ padding: '10px', fontWeight: 800, color: '#fbbf24' }}>
                      {log.totalScore} / 360
                    </td>
                    <td style={{ padding: '10px', color: '#34d399' }}>
                      {log.groupingAnalysis?.tightness} ({log.groupingAnalysis?.bias})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
