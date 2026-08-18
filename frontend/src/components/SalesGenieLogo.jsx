import React from 'react';

/**
 * SaaS-SalesGenie AI - The AI Brain Spark Logo
 * Pixel-perfect SVG vector recreation of the neural constellation brain spark emblem
 * with dynamic glow, multi-stage radial gradients, and animated pulse effects.
 */
export const SalesGenieBrainSparkIcon = ({ size = 50, className = '', animated = true, style = {} }) => {
  return (
    <div
      className={`salesgenie-logo-wrapper ${animated ? 'logo-pulse-glow' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
        ...style
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          borderRadius: size > 40 ? '14px' : '10px',
          boxShadow: '0 8px 24px -4px rgba(79, 70, 229, 0.45), 0 0 16px rgba(6, 182, 212, 0.3)',
          overflow: 'hidden'
        }}
      >
        <defs>
          <linearGradient id="sg-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a0f1d" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="sg-spark-line" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <radialGradient id="sg-center-glow" cx="50%" cy="62%" r="45%">
            <stop offset="0%" stopColor="rgba(244, 63, 94, 0.4)" />
            <stop offset="50%" stopColor="rgba(99, 102, 241, 0.2)" />
            <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
          </radialGradient>
        </defs>

        {/* Background Plate */}
        <rect width="240" height="240" rx="30" fill="url(#sg-bg-grad)" />
        
        {/* Subtle Ambient Radial Center Light */}
        <circle cx="120" cy="140" r="85" fill="url(#sg-center-glow)" />

        {/* Outer Dotted Orbit Circle */}
        <circle
          cx="120"
          cy="105"
          r="88"
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeDasharray="4 5"
          opacity="0.45"
        />

        {/* Network Edges (Constellation Structure) */}
        <g stroke="#3b82f6" strokeWidth="2.2" opacity="0.9">
          {/* Outer Polygon Perimeter */}
          <line x1="120" y1="42" x2="80" y2="66" />
          <line x1="120" y1="42" x2="160" y2="66" />
          <line x1="80" y1="66" x2="56" y2="114" />
          <line x1="160" y1="66" x2="184" y2="114" />
          <line x1="56" y1="114" x2="68" y2="162" />
          <line x1="184" y1="114" x2="172" y2="162" />
          <line x1="68" y1="162" x2="92" y2="198" />
          <line x1="172" y1="162" x2="148" y2="198" />

          {/* Inner Brain Facets */}
          <line x1="120" y1="42" x2="98" y2="105" stroke="#60a5fa" />
          <line x1="120" y1="42" x2="142" y2="105" stroke="#60a5fa" />
          <line x1="80" y1="66" x2="98" y2="105" />
          <line x1="160" y1="66" x2="142" y2="105" />
          <line x1="56" y1="114" x2="98" y2="105" />
          <line x1="184" y1="114" x2="142" y2="105" />
          <line x1="98" y1="105" x2="142" y2="105" stroke="#a855f7" strokeWidth="2" />

          {/* Connections to Central Neural Spark */}
          <line x1="98" y1="105" x2="120" y2="150" stroke="#f43f5e" strokeWidth="1.8" />
          <line x1="142" y1="105" x2="120" y2="150" stroke="#f43f5e" strokeWidth="1.8" />
          <line x1="56" y1="114" x2="120" y2="150" opacity="0.6" />
          <line x1="184" y1="114" x2="120" y2="150" opacity="0.6" />
          <line x1="68" y1="162" x2="120" y2="150" stroke="#ec4899" />
          <line x1="172" y1="162" x2="120" y2="150" stroke="#ec4899" />
          <line x1="92" y1="198" x2="120" y2="150" opacity="0.7" />
          <line x1="148" y1="198" x2="120" y2="150" opacity="0.7" />
        </g>

        {/* Central Vertical Red Dashed Spark Line */}
        <line
          x1="120"
          y1="46"
          x2="120"
          y2="146"
          stroke="url(#sg-spark-line)"
          strokeWidth="3"
          strokeDasharray="5 3"
        />

        {/* Constellation Cyan/White Nodes */}
        {[
          { cx: 120, cy: 42 },
          { cx: 80, cy: 66 },
          { cx: 160, cy: 66 },
          { cx: 98, cy: 105 },
          { cx: 142, cy: 105 },
          { cx: 56, cy: 114 },
          { cx: 184, cy: 114 },
          { cx: 68, cy: 162 },
          { cx: 172, cy: 162 },
          { cx: 92, cy: 198 },
          { cx: 148, cy: 198 },
        ].map((node, i) => (
          <g key={i}>
            <circle cx={node.cx} cy={node.cy} r="6" fill="#06b6d4" opacity="0.9" />
            <circle cx={node.cx} cy={node.cy} r="3.2" fill="#ffffff" />
          </g>
        ))}

        {/* Central Glowing Spark Core */}
        <circle cx="120" cy="150" r="12" fill="#f43f5e" opacity="0.3" />
        <circle cx="120" cy="150" r="9" fill="#ef4444" />
        <circle cx="120" cy="150" r="6" fill="#f43f5e" />
        <circle cx="120" cy="150" r="2.8" fill="#ffffff" />
      </svg>
    </div>
  );
};

/**
 * Full SaaS-SalesGenie AI Brand Lockup
 */
export const SalesGenieFullLogo = ({ size = 52, showSubtitle = true, className = '' }) => {
  return (
    <div className={`salesgenie-full-logo ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <SalesGenieBrainSparkIcon size={size} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: size > 44 ? '1.35rem' : '1.15rem',
          fontWeight: 900,
          color: 'var(--text-main)',
          letterSpacing: '-0.025em',
          lineHeight: '1.15',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            fontSize: size > 44 ? '0.72rem' : '0.65rem',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            color: '#ffffff',
            padding: '2px 7px',
            borderRadius: '5px',
            fontWeight: 800,
            letterSpacing: '0.05em',
            boxShadow: '0 2px 8px rgba(6, 182, 212, 0.35)'
          }}>
            SaaS
          </span>
          <span style={{
            background: 'linear-gradient(135deg, var(--text-main) 30%, var(--brand-400) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
          }}>
            SalesGenie
          </span>
          <span style={{
            fontSize: size > 44 ? '0.75rem' : '0.68rem',
            background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
            color: '#ffffff',
            padding: '2px 8px',
            borderRadius: '5px',
            fontWeight: 800,
            letterSpacing: '0.04em',
            boxShadow: '0 2px 10px rgba(79, 70, 229, 0.4)'
          }}>
            AI
          </span>
        </div>
        {showSubtitle && (
          <div style={{
            fontSize: '0.68rem',
            color: 'var(--brand-400)',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginTop: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand-400)', display: 'inline-block' }} />
            The AI Brain Spark
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesGenieBrainSparkIcon;
