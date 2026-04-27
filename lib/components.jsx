// CNRY components — bird mark, score displays, cards, icons

const BIRD_PATH = "M217.161,66.369 C216.096,68.197 215.13,70.071 214.22,71.97 C210.054,61.378 203.747,51.653 195.568,43.474 L194.719,42.625 C201.974,37.297 210.65,34.204 219.778,33.874 C229.531,33.539 237.463,36.38 243.081,39.444 C234.318,45.062 224.583,53.617 217.161,66.369 Z M199.037,135.577 L183.216,119.755 C189.908,101.702 185.553,81.128 171.734,67.31 L170.525,66.101 L175.198,61.427 L175.157,61.386 L185.29,51.252 L186.539,52.501 C198.505,64.468 205.784,80.321 207.051,97.16 L207.06,99.654 L207.204,99.792 C207.658,112.255 204.808,124.654 199.037,135.577 Z M101.378,137.662 C115.18,151.466 135.738,155.824 153.787,149.154 L169.618,164.985 C142.534,179.36 108.708,174.603 86.572,152.469 L85.331,151.228 L91.043,145.501 L91.084,145.541 L100.171,136.455 L101.378,137.662 Z M259.328,35.215 C254.156,30.73 239.888,20.356 219.316,21.121 C204.632,21.649 190.827,27.665 180.437,38.055 L20.819,197.673 L38.869,197.673 L76.295,160.248 L77.543,161.497 C93.682,177.636 115.083,185.948 136.626,185.947 C152.901,185.947 169.26,181.201 183.486,171.503 L189.853,167.163 L156.583,133.894 L152.508,135.847 C138.398,142.602 121.479,139.704 110.407,128.635 L109.198,127.427 L161.497,75.129 L162.705,76.337 C173.791,87.423 176.686,104.354 169.907,118.465 L167.948,122.544 L201.22,155.816 L205.561,149.451 C215.926,134.255 220.979,115.755 219.851,97.275 C221.032,88.524 223.833,80.294 228.189,72.785 C236.76,58.053 249.065,49.993 257.875,45.812 L266.718,41.631 L259.328,35.215 Z";

function Bird({ size = 24, color, gradientId = 'birdGrad', useGradient = true, tilt = 0, style = {} }) {
  const id = gradientId + Math.random().toString(36).slice(2, 6);
  return (
    <svg width={size} height={size * (218/287)} viewBox="0 0 287 218"
      style={{ display: 'inline-block', verticalAlign: 'middle', transform: `rotate(${tilt}deg)`, transformOrigin: '50% 65%', transition: 'transform 1.2s ease', ...style }}>
      <defs>
        <linearGradient id={id} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4960E"/>
          <stop offset="100%" stopColor="#F5C526"/>
        </linearGradient>
      </defs>
      <path fillRule="evenodd" fill={useGradient ? `url(#${id})` : color} d={BIRD_PATH}/>
    </svg>
  );
}

// --- State Wash — the colored gradient top ---
function StateWash({ state, treatment, coverage = 1 }) {
  const s = ENGINE_STATES[state];
  const isFullBleed = treatment === 'full-bleed';
  const isHybrid = treatment === 'hybrid';
  const isDarkAccent = treatment === 'dark-accent';

  // height of wash depends on treatment
  const h = isFullBleed ? '100%' : isHybrid ? '58%' : '28%';
  const fadeTo = '#0A0A0A';
  const fadeEnd = isFullBleed ? '100%' : isHybrid ? '92%' : '80%';

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: h, overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      {/* base wash */}
      <div className="slow wash-anim" style={{
        position: 'absolute', inset: '-10% -10% 0 -10%',
        background: `radial-gradient(ellipse 120% 90% at 50% 10%, ${s.glow}cc 0%, ${s.washColors[1]} 28%, ${s.washColors[0]} 60%, ${fadeTo} ${fadeEnd})`,
      }}/>
      {/* soft grain */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.35, mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>")`,
      }}/>
      {/* bottom fade to ink (for hybrid) */}
      {!isFullBleed && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
          background: `linear-gradient(to bottom, transparent 0%, #0A0A0A 95%)`,
        }}/>
      )}
    </div>
  );
}

// --- Header bar (bird + wordmark + menu) ---
function HeaderBar({ onMenu }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 22px', position: 'relative', zIndex: 4,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="breathe"><Bird size={26}/></div>
        <span style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 20,
          letterSpacing: '-0.04em', color: '#F5C526', textTransform: 'lowercase', lineHeight: 1,
        }}>cnry</span>
      </div>
      <button onClick={onMenu} style={{
        width: 36, height: 36, borderRadius: 18, border: 'none',
        background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="3" cy="8" r="1.5" fill="#fff"/><circle cx="8" cy="8" r="1.5" fill="#fff"/><circle cx="13" cy="8" r="1.5" fill="#fff"/></svg>
      </button>
    </div>
  );
}

// --- Score displays (3 variants) ---
function ScoreNumeral({ score, typeTone }) {
  const family = typeTone === 'instrument' ? "'Fraunces', serif" : "'Inter', sans-serif";
  const weight = typeTone === 'instrument' ? 300 : 200;
  return (
    <div className="digit-in" style={{
      fontFamily: family, fontWeight: weight, fontSize: 118, lineHeight: 1,
      color: '#fff', letterSpacing: typeTone === 'instrument' ? '-0.02em' : '-0.04em',
      fontVariantNumeric: 'tabular-nums',
    }}>{score}</div>
  );
}

function ScoreRing({ score, glow }) {
  const r = 56, c = 2 * Math.PI * r;
  const pct = score / 100;
  const offset = c * (1 - pct);
  return (
    <div style={{ position: 'relative', width: 148, height: 148 }} className="digit-in">
      <svg width="148" height="148" viewBox="0 0 148 148" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="74" cy="74" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2"/>
        <circle cx="74" cy="74" r={r} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.6,.05,.3,1)', filter: `drop-shadow(0 0 10px ${glow}88)` }}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Inter', sans-serif", fontWeight: 200, fontSize: 58, color: '#fff', letterSpacing: '-0.04em',
      }}>{score}</div>
    </div>
  );
}

function ScoreBirdOnGradient({ score, state }) {
  const s = ENGINE_STATES[state];
  const pct = score / 100;
  // position bird along the gradient
  return (
    <div className="digit-in" style={{ width: '100%', position: 'relative', paddingTop: 6 }}>
      <div style={{ position: 'relative', height: 90, marginBottom: 10 }}>
        {/* gradient strip */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 42, height: 4, borderRadius: 2,
          background: `linear-gradient(to right, #A73A1A 0%, #D4A015 50%, #14A888 100%)`,
          opacity: 0.9,
        }}/>
        {/* ticks */}
        {[0, 50, 100].map(v => (
          <div key={v} style={{
            position: 'absolute', left: `${v}%`, top: 40, width: 1, height: 8,
            background: 'rgba(255,255,255,0.35)', transform: 'translateX(-0.5px)',
          }}/>
        ))}
        {/* bird marker */}
        <div style={{
          position: 'absolute', left: `${pct * 100}%`, top: 0, transform: 'translateX(-50%)',
          transition: 'left 1.4s cubic-bezier(.6,.05,.3,1)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 200, fontSize: 44, color: '#fff', lineHeight: 1 }}>{score}</div>
            <div style={{ marginTop: 4 }}><Bird size={28}/></div>
            <div style={{ width: 1, height: 10, background: '#fff', margin: '2px auto 0', opacity: 0.7 }}/>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter', fontWeight: 600, letterSpacing: '0.14em' }}>
        <span>ATTN</span><span>WATCH</span><span>HEALTHY</span>
      </div>
    </div>
  );
}

// --- Metric card (frosted glass) ---
function MetricIcon({ kind, color }) {
  if (kind === 'rhythm') return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M1 10 L4 10 L5.5 5 L8 15 L11 7 L13 12 L15 10 L19 10"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  if (kind === 'sound') return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 8 L3 12 L6 12 L10 15 L10 5 L6 8 Z" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <path d="M13 7 C14.5 8.5 14.5 11.5 13 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M15.5 5 C18 7.5 18 12.5 15.5 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
  if (kind === 'stress') return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2 C10 2 5 8 5 12 C5 14.76 7.24 17 10 17 C12.76 17 15 14.76 15 12 C15 8 10 2 10 2 Z"
        stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
    </svg>
  );
  return null;
}

function MetricCard({ kind, data, accent, onClick, riseClass }) {
  return (
    <button onClick={onClick} className={riseClass} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
      padding: '14px 16px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      cursor: 'pointer', color: 'inherit', fontFamily: 'inherit',
      transition: 'all 0.18s ease',
    }}
    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
    onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: `${accent}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        border: `1px solid ${accent}33`,
      }}>
        <MetricIcon kind={kind} color={accent}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 2 }}>
          {kind === 'rhythm' ? 'Rhythm' : kind === 'sound' ? 'Sound' : 'Stress'}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.35 }}>
          {data.state} — {data.detail}
        </div>
      </div>
      <svg width="7" height="12" viewBox="0 0 7 12" style={{ opacity: 0.35, flexShrink: 0 }}>
        <path d="M1 1l5 5-5 5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

// --- Sparkline variants ---
function Sparkline({ points, color, variant = 'line', width = 320, height = 52 }) {
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const xs = points.map((_, i) => (i / (points.length - 1)) * width);
  const ys = points.map(p => height - ((p - min) / range) * (height - 8) - 4);
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  const area = `${d} L${width},${height} L0,${height} Z`;

  if (variant === 'area') {
    return (
      <svg width={width} height={height} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="sparkArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={area} fill="url(#sparkArea)"/>
        <path d={d} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" className="spark"/>
      </svg>
    );
  }
  if (variant === 'dots') {
    return (
      <svg width={width} height={height} style={{ display: 'block' }}>
        <path d={d} stroke={color} strokeOpacity="0.25" strokeWidth="1" fill="none" strokeDasharray="2 3"/>
        {xs.map((x, i) => <circle key={i} cx={x} cy={ys[i]} r="2" fill={color} opacity={0.4 + (i / xs.length) * 0.6}/>)}
      </svg>
    );
  }
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <path d={d} stroke={color} strokeWidth="1.25" fill="none" strokeLinecap="round" strokeLinejoin="round" className="spark" opacity="0.75"/>
      {/* endpoint dot */}
      <circle cx={xs[xs.length-1]} cy={ys[ys.length-1]} r="3" fill={color}/>
      <circle cx={xs[xs.length-1]} cy={ys[ys.length-1]} r="6" fill={color} opacity="0.25"/>
    </svg>
  );
}

// --- Bottom nav ---
function BottomNav({ active, onNav, alertBadge, style: navStyle = 'labels' }) {
  const items = [
    { id: 'home', label: 'Home', icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 10l8-7 8 7v9a1 1 0 01-1 1h-4v-6H8v6H4a1 1 0 01-1-1v-9z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>
    )},
    { id: 'history', label: 'History', icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 16l4-6 4 3 4-7 4 4" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )},
    { id: 'alerts', label: 'Alerts', icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 15v-4a6 6 0 1112 0v4l2 2H3l2-2z M9 18a2 2 0 004 0" stroke={c} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" fill="none"/></svg>
    )},
    { id: 'settings', label: 'Profile', icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="8" r="4" stroke={c} strokeWidth="1.5"/><path d="M3 19c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>
    )},
  ];

  const isPill = navStyle === 'pill';
  const hideLabels = navStyle === 'icons';

  // Layout owner (IOSDevice's bottomBar slot) is responsible for positioning.
  // We render as a plain block so it can be pinned, sticky, or in-flow as needed.
  return (
    <div style={{
      padding: isPill ? '0 20px 22px' : '0',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: isPill ? '8px 8px' : '10px 0 30px',
        background: isPill ? 'rgba(16,16,16,0.88)' : 'rgba(10,10,10,0.82)',
        backdropFilter: 'blur(22px) saturate(180%)', WebkitBackdropFilter: 'blur(22px) saturate(180%)',
        borderRadius: isPill ? 28 : 0,
        border: isPill ? '1px solid rgba(255,255,255,0.08)' : 'none',
        borderTop: !isPill ? '1px solid rgba(255,255,255,0.06)' : undefined,
      }}>
        {items.map(it => {
          const isActive = active === it.id;
          const c = isActive ? '#F5C526' : 'rgba(255,255,255,0.5)';
          return (
            <button key={it.id} onClick={() => onNav(it.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: isPill ? '8px 14px' : '6px 16px', position: 'relative',
              borderRadius: isPill ? 20 : 0,
            }}>
              <div style={{ position: 'relative' }}>
                {it.icon(c)}
                {it.id === 'alerts' && alertBadge && (
                  <div style={{ position: 'absolute', top: -2, right: -4, width: 8, height: 8, borderRadius: 4, background: '#F5C526', border: '2px solid #0A0A0A' }}/>
                )}
              </div>
              {!hideLabels && (
                <div style={{ fontSize: 10, fontWeight: 500, color: c, letterSpacing: 0.2 }}>{it.label}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, {
  Bird, StateWash, HeaderBar,
  ScoreNumeral, ScoreRing, ScoreBirdOnGradient,
  MetricCard, MetricIcon, Sparkline, BottomNav,
});
