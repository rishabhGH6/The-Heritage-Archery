import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 1 }) {
  const items = Array.from({ length: count });

  if (type === 'hero') {
    return (
      <div className="glass-card" style={{ padding: '28px', marginBottom: '24px', animation: 'pulse 1.5s infinite' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', alignItems: 'center' }}>
          <div style={{ width: '130px', height: '130px', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.08)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '30%', height: '20px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.1)' }} />
            <div style={{ width: '60%', height: '36px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.12)' }} />
            <div style={{ width: '80%', height: '24px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.08)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="glass-card" style={{ padding: '24px', animation: 'pulse 1.5s infinite' }}>
        <div style={{ width: '40%', height: '28px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.12)', marginBottom: '20px' }} />
        {items.map((_, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: '35%', height: '20px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.08)' }} />
            <div style={{ width: '20%', height: '20px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.08)' }} />
            <div style={{ width: '15%', height: '20px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.08)' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
      {items.map((_, i) => (
        <div key={i} className="glass-card" style={{ padding: '20px', animation: 'pulse 1.5s infinite', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.12)' }} />
          <div style={{ width: '70%', height: '22px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.1)' }} />
          <div style={{ width: '90%', height: '16px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.06)' }} />
          <div style={{ width: '50%', height: '16px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.06)' }} />
        </div>
      ))}
    </div>
  );
}
