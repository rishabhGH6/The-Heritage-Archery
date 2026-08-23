import React from 'react';
import { Target, Award, Shield, Users, Trophy, Wrench, Sparkles, MapPin, Calendar, Heart, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';

export default function AboutUs({ setActiveTab, coach }) {
  return (
    <div className="fade-in-up" style={{ marginBottom: '36px' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{
        padding: '32px 28px',
        marginBottom: '28px',
        border: '1px solid rgba(251, 191, 36, 0.35)',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(5, 150, 105, 0.2), rgba(217, 119, 6, 0.2))',
        borderRadius: '24px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <span className="badge-gold">
            <Trophy size={13} /> College Team Legacy
          </span>
          <span className="badge-emerald">
            <Target size={13} /> World Archery Aligned 🎯
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.5rem)', fontWeight: 900, color: '#f8fafc', margin: '0 0 12px 0', lineHeight: 1.2 }}>
          About <span className="metallic-text-shine">The Heritage Archery</span>
        </h1>

        <p style={{ fontSize: 'clamp(0.95rem, 2.2vw, 1.1rem)', color: '#cbd5e1', lineHeight: 1.65, maxWidth: '900px', margin: 0 }}>
          The Heritage Archery Team Portal is the official digital performance center for The Heritage College Archery Team in Kolkata. Built by archers for archers, our ecosystem unites World Archery tournament standards with cutting-edge digital tracking—fueling competitive excellence from daily 70m/50m practice ends to university nationals.
        </p>
      </div>

      {/* Core Mission & Pillars Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        <div className="glass-card hover-lift" style={{ padding: '24px', borderLeft: '4px solid #fbbf24' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Target size={24} color="#fbbf24" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
            World Archery Standards
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
            Strictly adhering to World Archery rules for Recurve and Compound disciplines. Standardized 70m Olympic and 50m Target line metrics for realistic competition preparation.
          </p>
        </div>

        <div className="glass-card hover-lift" style={{ padding: '24px', borderLeft: '4px solid #059669' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(5, 150, 105, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Shield size={24} color="#34d399" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
            Unshakable Team Discipline
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
            Under the mentorship of Head Coach Jayanta Chakraborty, our archers train daily to build mental resilience, form consistency, and high-pressure matchplay focus.
          </p>
        </div>

        <div className="glass-card hover-lift" style={{ padding: '24px', borderLeft: '4px solid #38bdf8' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Sparkles size={24} color="#38bdf8" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
            Data-Driven Performance
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
            From arrow-by-arrow scoring and automated target grouping analysis to bow spec tuning, our platform turns raw arrow logs into actionable scoring gains.
          </p>
        </div>

      </div>

      {/* Leadership Spotlight: Head Coach Jayanta */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '32px', border: '1px solid rgba(217, 119, 6, 0.3)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', alignItems: 'center' }} className="hero-responsive-grid">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '3px solid #d97706',
              boxShadow: '0 8px 25px rgba(217, 119, 6, 0.35)',
              position: 'relative',
              background: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {coach?.photo ? (
                <img src={coach.photo} alt={coach.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Shield size={48} color="#fbbf24" />
              )}
            </div>
            <span style={{ marginTop: '8px', background: '#d97706', color: '#090d16', fontSize: '0.68rem', fontWeight: 800, padding: '3px 10px', borderRadius: '9999px', textTransform: 'uppercase' }}>
              Head Coach
            </span>
          </div>

          <div>
            <span className="badge-gold" style={{ marginBottom: '6px' }}>Team Leadership</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0 6px 0' }}>
              Coach Jayanta Chakraborty
            </h2>
            <p style={{ fontSize: '0.98rem', color: '#fbbf24', fontStyle: 'italic', fontWeight: 600, marginBottom: '10px' }}>
              "{coach?.tagline || 'Precision, Discipline, and Unshakable Focus.'}"
            </p>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
              Leading The Heritage College Archery Team with decades of archery expertise, Coach Jayanta instills technical mastery in stance alignment, anchor point stability, and tournament readiness for every archer on the target line.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Capabilities Breakdown */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wrench size={20} color="#fbbf24" /> Comprehensive Portal Capabilities for Archers
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ color: '#fbbf24', fontSize: '1rem', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🎯 Interactive 360-pt Scoring
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
              Record 6-round ends with arrow-by-arrow 10s & Xs, automatic total calculations, and PDF scorecard exports.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ color: '#34d399', fontSize: '1rem', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🔧 Bow Tuning & Specs
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
              Maintain precise records for tiller, brace height, sight elevation/windage, draw weight, and arrow spine setup.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ color: '#38bdf8', fontSize: '1rem', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ⏱️ Official Range Timer
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
              Practice under competition pressure with audio whistle signals (10s prep, 120s shoot, 2 whistles retrieve).
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ color: '#a7f3d0', fontSize: '1rem', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ✨ AI Performance Coach
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
              Receive instant AI feedback on grouping bias, release stance, stabilizer balance, and tuning troubleshooting.
            </p>
          </div>

        </div>
      </div>

      {/* CTA Footer */}
      <div className="glass-card" style={{ padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.2), rgba(5, 150, 105, 0.2))' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
          Ready to Train with The Heritage College Archery Team?
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '16px' }}>
          Explore target schedules, log your scorecards, or contact our team leadership today!
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('scoring')} className="btn-gold" style={{ padding: '10px 24px', fontSize: '0.88rem' }}>
            Start Interactive Scoring <ArrowRight size={16} />
          </button>
          <button onClick={() => setActiveTab('contact')} className="btn-emerald" style={{ padding: '10px 24px', fontSize: '0.88rem' }}>
            Contact Team Leadership 📞
          </button>
        </div>
      </div>

    </div>
  );
}
