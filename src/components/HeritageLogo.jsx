import React from 'react';

export default function HeritageLogo({ size = 180, className = '' }) {
  return (
    <div 
      className={className}
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 12px 35px rgba(251, 191, 36, 0.55))'
      }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 3D Sphere Head Radial Gradient */}
          <radialGradient id="hlHeadSphere" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="35%" stopColor="#fbbf24" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>

          {/* Rich Metallic Golden Body Gradient */}
          <linearGradient id="hlBodyGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="30%" stopColor="#fbbf24" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          {/* Crisp Pure White Specular Highlight */}
          <linearGradient id="hlWhiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
        </defs>

        {/* Ambient Gold Radial Glow Circle */}
        <circle cx="100" cy="100" r="85" fill="#fbbf24" fillOpacity="0.08" />

        {/* 1. Glossy 3D Golden Spherical Head */}
        <circle cx="132" cy="48" r="16" fill="url(#hlHeadSphere)" />

        {/* 2. Golden Upper Chest & Drawing Arm */}
        <path 
          d="M 115 65 C 135 68, 150 82, 142 95 C 122 92, 100 82, 90 75 C 98 68, 105 65, 115 65 Z" 
          fill="url(#hlBodyGold)" 
        />

        {/* 3. Golden Curved Recurve Bow Limb (Left Side Arc) */}
        <path 
          d="M 100 22 C 52 50, 48 125, 88 170 C 72 125, 68 62, 100 22 Z" 
          fill="url(#hlBodyGold)" 
        />

        {/* 4. Crisp White Taut Bowstring */}
        <line x1="100" y1="22" x2="88" y2="170" stroke="url(#hlWhiteGrad)" strokeWidth="3" strokeLinecap="round" />

        {/* 5. Crisp White Arrow Resting on Bow (Pointing Top-Left) */}
        <polygon points="44,60 60,50 58,68" fill="#ffffff" />
        <line x1="52" y1="58" x2="138" y2="92" stroke="url(#hlWhiteGrad)" strokeWidth="3.5" strokeLinecap="round" />

        {/* 6. Two Flowing Tapered Golden Legs (Lower Body) */}
        <path 
          d="M 105 88 C 98 125, 90 160, 85 192 C 92 182, 104 140, 112 92 Z" 
          fill="url(#hlBodyGold)" 
        />
        <path 
          d="M 116 92 C 122 125, 130 160, 126 198 C 132 178, 138 130, 122 90 Z" 
          fill="url(#hlBodyGold)" 
        />
      </svg>
    </div>
  );
}
