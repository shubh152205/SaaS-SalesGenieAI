import React from 'react';

/**
 * SalesGenie AI - The AI Brain Spark Logo
 * Pixel-perfect SVG vector recreation of the neural constellation brain spark emblem.
 */
export const SalesGenieBrainSparkIcon = ({ size = 40, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle', borderRadius: '12px' }}
    >
      {/* Background */}
      <rect width="240" height="240" rx="28" fill="#0b1120" />
      
      {/* Outer Dotted Orbit Circle */}
      <circle
        cx="120"
        cy="105"
        r="88"
        stroke="#38bdf8"
        strokeWidth="1.2"
        strokeDasharray="3 4"
        opacity="0.35"
      />

      {/* Network Edges (Constellation Structure) */}
      <g stroke="#1e40af" strokeWidth="2" opacity="0.95">
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
        <line x1="120" y1="42" x2="98" y2="105" />
        <line x1="120" y1="42" x2="142" y2="105" />
        <line x1="80" y1="66" x2="98" y2="105" />
        <line x1="160" y1="66" x2="142" y2="105" />
        <line x1="56" y1="114" x2="98" y2="105" />
        <line x1="184" y1="114" x2="142" y2="105" />
        <line x1="98" y1="105" x2="142" y2="105" />

        {/* Connections to Central Red Spark */}
        <line x1="98" y1="105" x2="120" y2="150" />
        <line x1="142" y1="105" x2="120" y2="150" />
        <line x1="56" y1="114" x2="120" y2="150" />
        <line x1="184" y1="114" x2="120" y2="150" />
        <line x1="68" y1="162" x2="120" y2="150" />
        <line x1="172" y1="162" x2="120" y2="150" />
        <line x1="92" y1="198" x2="120" y2="150" />
        <line x1="148" y1="198" x2="120" y2="150" />
      </g>

      {/* Central Vertical Red Dashed Spark Line */}
      <line
        x1="120"
        y1="46"
        x2="120"
        y2="146"
        stroke="#ef4444"
        strokeWidth="2.5"
        strokeDasharray="4 3"
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
          <circle cx={node.cx} cy={node.cy} r="5" fill="#38bdf8" />
          <circle cx={node.cx} cy={node.cy} r="2.8" fill="#ffffff" />
        </g>
      ))}

      {/* Central Red Heart Spark Node */}
      <circle cx="120" cy="150" r="9" fill="#ef4444" />
      <circle cx="120" cy="150" r="7" fill="#f43f5e" />
      <circle cx="120" cy="150" r="3" fill="#ffffff" />
    </svg>
  );
};

/**
 * Full Self-Contained Emblem (Image with Integrated Brain Constellation + Text)
 */
export const SalesGenieEmblem = ({ width = 200, height = 200, className = '' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', maxWidth: '100%' }}
    >
      {/* Background Plate */}
      <rect width="300" height="300" rx="36" fill="#0b1120" />
      
      {/* Outer Dotted Orbit */}
      <circle
        cx="150"
        cy="120"
        r="100"
        stroke="#38bdf8"
        strokeWidth="1.2"
        strokeDasharray="4 5"
        opacity="0.35"
      />

      {/* Network Edges */}
      <g stroke="#1d4ed8" strokeWidth="2.2" opacity="0.9">
        <line x1="150" y1="48" x2="105" y2="76" />
        <line x1="150" y1="48" x2="195" y2="76" />
        <line x1="105" y1="76" x2="78" y2="130" />
        <line x1="195" y1="76" x2="222" y2="130" />
        <line x1="78" y1="130" x2="92" y2="184" />
        <line x1="222" y1="130" x2="208" y2="184" />
        <line x1="92" y1="184" x2="118" y2="224" />
        <line x1="208" y1="184" x2="182" y2="224" />

        <line x1="150" y1="48" x2="125" y2="120" />
        <line x1="150" y1="48" x2="175" y2="120" />
        <line x1="105" y1="76" x2="125" y2="120" />
        <line x1="195" y1="76" x2="175" y2="120" />
        <line x1="78" y1="130" x2="125" y2="120" />
        <line x1="222" y1="130" x2="175" y2="120" />
        <line x1="125" y1="120" x2="175" y2="120" />

        <line x1="125" y1="120" x2="150" y2="170" />
        <line x1="175" y1="120" x2="150" y2="170" />
        <line x1="78" y1="130" x2="150" y2="170" />
        <line x1="222" y1="130" x2="150" y2="170" />
        <line x1="92" y1="184" x2="150" y2="170" />
        <line x1="208" y1="184" x2="150" y2="170" />
        <line x1="118" y1="224" x2="150" y2="170" />
        <line x1="182" y1="224" x2="150" y2="170" />
      </g>

      {/* Axis Red Dashed Spark Line */}
      <line
        x1="150"
        y1="52"
        x2="150"
        y2="166"
        stroke="#ef4444"
        strokeWidth="2.8"
        strokeDasharray="4 3"
      />

      {/* Nodes */}
      {[
        { cx: 150, cy: 48 },
        { cx: 105, cy: 76 },
        { cx: 195, cy: 76 },
        { cx: 125, cy: 120 },
        { cx: 175, cy: 120 },
        { cx: 78, cy: 130 },
        { cx: 222, cy: 130 },
        { cx: 92, cy: 184 },
        { cx: 208, cy: 184 },
        { cx: 118, cy: 224 },
        { cx: 182, cy: 224 },
      ].map((node, i) => (
        <g key={i}>
          <circle cx={node.cx} cy={node.cy} r="5.5" fill="#38bdf8" />
          <circle cx={node.cx} cy={node.cy} r="3" fill="#ffffff" />
        </g>
      ))}

      {/* Central Red Heart Node */}
      <circle cx="150" cy="170" r="9.5" fill="#ef4444" />
      <circle cx="150" cy="170" r="7" fill="#f43f5e" />
      <circle cx="150" cy="170" r="3" fill="#ffffff" />

      {/* Integrated Typography */}
      <text
        x="150"
        y="262"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="'Outfit', sans-serif"
        fontWeight="800"
        fontSize="19"
        letterSpacing="-0.3"
      >
        SalesGenie AI
      </text>

      <text
        x="150"
        y="280"
        textAnchor="middle"
        fill="#38bdf8"
        fontFamily="'Outfit', sans-serif"
        fontWeight="700"
        fontSize="8.5"
        letterSpacing="2.5"
      >
        THE AI BRAIN SPARK
      </text>
    </svg>
  );
};

export const SalesGenieFullLogo = ({ size = 46, showSubtitle = true }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <SalesGenieBrainSparkIcon size={size} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          color: 'var(--text-main)',
          letterSpacing: '-0.02em',
          lineHeight: '1.15',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>SalesGenie</span>
          <span style={{
            fontSize: '0.68rem',
            background: 'linear-gradient(135deg, #465fff 0%, #38bdf8 100%)',
            color: '#ffffff',
            padding: '2px 7px',
            borderRadius: '4px',
            fontWeight: 800
          }}>
            AI
          </span>
        </div>
        {showSubtitle && (
          <div style={{
            fontSize: '0.65rem',
            color: 'var(--brand-400)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginTop: '3px'
          }}>
            The AI Brain Spark
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesGenieBrainSparkIcon;
