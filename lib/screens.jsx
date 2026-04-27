// CNRY screens — Home, Metric Detail, History, Alerts, Profile

// ─── HOME ─────────────────────────────────────────────────────
function HomeScreen({ state, treatment, scoreDisplay, sparkVariant, typeTone, navStyle, onNav, onMetric }) {
  const s = ENGINE_STATES[state];
  return (
    <div style={{ position: 'relative', minHeight: '100%', background: '#0A0A0A' }} className="grain slow">
      <StateWash state={state} treatment={treatment}/>
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 58 }}/>
        <div style={{ paddingTop: 4 }}><HeaderBar/></div>
        <div style={{ padding: '28px 22px 0', position: 'relative' }}>
          <div className="label-caps rise-1" style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 14 }}>YOUR ENGINE</div>
          <div className="rise-2">
            {scoreDisplay === 'ring' && <ScoreRing score={s.score} glow={s.glow}/>}
            {scoreDisplay === 'bird' && <ScoreBirdOnGradient score={s.score} state={state}/>}
            {scoreDisplay === 'numeral' && <ScoreNumeral score={s.score} typeTone={typeTone}/>}
          </div>
          <div className="rise-3" style={{
            marginTop: scoreDisplay === 'bird' ? 18 : 14,
            fontFamily: typeTone === 'instrument' ? "'Fraunces', serif" : "'Inter', sans-serif",
            fontWeight: typeTone === 'instrument' ? 400 : 500,
            fontSize: 26, lineHeight: 1.15, color: '#fff', letterSpacing: '-0.01em', textWrap: 'pretty',
          }}>{s.verdict}</div>
          <div className="rise-4" style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.45, color: 'rgba(255,255,255,0.7)', maxWidth: 300, textWrap: 'pretty' }}>{s.context}</div>
        </div>
        <div style={{ padding: '24px 22px 8px' }} className="rise-4">
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{s.trendLabel.toUpperCase()}</div>
          <Sparkline points={s.spark} color={s.glow} variant={sparkVariant} width={330} height={44}/>
        </div>
        <div style={{ padding: '6px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <MetricCard kind="rhythm" data={s.rhythm} accent={s.glow} onClick={() => onMetric('rhythm')} riseClass="rise-3"/>
          <MetricCard kind="sound"  data={s.sound}  accent={s.glow} onClick={() => onMetric('sound')}  riseClass="rise-4"/>
          <MetricCard kind="stress" data={s.stress} accent={s.glow} onClick={() => onMetric('stress')} riseClass="rise-5"/>
        </div>
        {s.banner && (
          <div className="rise-5" style={{ padding: '14px 16px 0' }}>
            <button onClick={() => onNav('alerts')} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px', borderRadius: 14, border: '1px solid rgba(245,197,38,0.35)',
              background: 'linear-gradient(90deg, rgba(245,197,38,0.12), rgba(245,197,38,0.04))',
              color: '#F5C526', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Bird size={18}/>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{s.banner.text}</span>
              </div>
              <span style={{ fontSize: 13, opacity: 0.85 }}>{s.banner.cta} →</span>
            </button>
          </div>
        )}
        <div style={{ height: navStyle === 'pill' ? 110 : 96 }}/>
      </div>
    </div>
  );
}

// ─── METRIC DETAIL (redesigned with diagnostics) ─────────────
function ScorePill({ score }) {
  // interpolate along attention→watch→healthy gradient
  const pct = Math.max(0, Math.min(100, score)) / 100;
  // color mapping mirroring the app's gradient
  let bg;
  if (pct > 0.78) bg = '#14A888';
  else if (pct > 0.6) bg = '#D4A015';
  else bg = '#D75B2C';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px 4px 8px',
      borderRadius: 999, background: `${bg}22`, border: `1px solid ${bg}55`,
      fontSize: 12, fontWeight: 600, color: bg, fontFamily: 'Inter', fontVariantNumeric: 'tabular-nums',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 3, background: bg }}/>
      {score}
    </span>
  );
}

function ConfidencePill({ level }) {
  const map = {
    likely:     { label: 'Likely',            fg: '#F5C526', bg: 'rgba(245,197,38,0.14)', bd: 'rgba(245,197,38,0.4)' },
    possible:   { label: 'Possible',          fg: '#E1E1E1', bg: 'rgba(255,255,255,0.08)', bd: 'rgba(255,255,255,0.18)' },
    'rule-out': { label: 'Worth ruling out',  fg: 'rgba(255,255,255,0.7)', bg: 'rgba(255,255,255,0.04)', bd: 'rgba(255,255,255,0.12)' },
  };
  const m = map[level];
  return (
    <span style={{
      padding: '3px 9px', borderRadius: 999, background: m.bg, border: `1px solid ${m.bd}`,
      fontSize: 10.5, fontWeight: 600, color: m.fg, letterSpacing: '0.04em',
    }}>{m.label}</span>
  );
}

function DiagnosticCard({ dx, accent, riseClass }) {
  return (
    <div className={riseClass} style={{
      padding: '16px 18px', borderRadius: 16,
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', lineHeight: 1.3, textWrap: 'pretty' }}>{dx.title}</div>
        <ConfidencePill level={dx.confidence}/>
      </div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, textWrap: 'pretty' }}>
        {dx.body}
      </div>
      {dx.action && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: accent, lineHeight: 1.45 }}>
          <svg width="12" height="12" viewBox="0 0 12 12" style={{ marginTop: 3, flexShrink: 0 }}>
            <path d="M2 6 L5 9 L10 3" stroke={accent} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ textWrap: 'pretty' }}>{dx.action}</span>
        </div>
      )}
    </div>
  );
}

function MetricDetailScreen({ state, kind, onBack, navStyle, onNav }) {
  const s = ENGINE_STATES[state];
  // In penumbra mode `state` is 'penumbra' — fall back to the derived band for legacy lookups.
  const bandKey = s.band || state;
  const baseline = CHANNEL_BASELINES[kind];
  // Channel score drifts from baseline toward the legacy band score, proportional to s.p.
  const bandScore = CHANNEL_SCORES[kind][bandKey];
  const channelScore = Math.round(s.p !== undefined
    ? baseline + (bandScore - baseline) * (1 - Math.max(0, Math.min(1, s.p / 100)))
    : bandScore);
  const delta = channelScore - baseline;
  const data = s[kind];
  const series = CHANNEL_SERIES[kind][bandKey];
  const dxs = DIAGNOSTICS[kind][bandKey];
  const kindMeta = {
    rhythm: { title: 'Rhythm', sub: 'How smoothly your engine is running' },
    sound:  { title: 'Sound',  sub: 'The acoustic signature of your engine' },
    stress: { title: 'Stress', sub: 'How hard your engine is working' },
  }[kind];

  // sparkline
  const w = 330, h = 100;
  const min = Math.min(...series), max = Math.max(...series);
  const xs = series.map((_, i) => (i / (series.length - 1)) * w);
  const ys = series.map(v => h - ((v - min) / (max - min || 1)) * (h - 14) - 7);
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');

  return (
    <div style={{ position: 'relative', minHeight: '100%', background: '#0A0A0A' }} className="scroll-hidden slow">
      <StateWash state={state} treatment="dark-accent"/>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ height: 58 }}/>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 0 12px' }}>
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '8px 14px 8px 10px',
            display: 'flex', alignItems: 'center', gap: 6, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M8 2 L3 6 L8 10" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>
            Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="breathe"><Bird size={18}/></div>
            <span className="wordmark" style={{ fontSize: 12, color: '#fff' }}>CNRY</span>
          </div>
        </div>

        {/* Title + channel score pill */}
        <div style={{ padding: '28px 22px 0' }} className="rise-1">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <span className="wordmark" style={{ fontSize: 22, color: '#fff', letterSpacing: '0.1em' }}>{kindMeta.title.toUpperCase()}</span>
            <ScorePill score={channelScore}/>
          </div>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>{kindMeta.sub}</div>
        </div>

        {/* Sub-score chart */}
        <div style={{ margin: '22px 16px 0', padding: '18px 14px 12px', borderRadius: 20,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }} className="rise-2">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8, padding: '0 6px' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>30-day trend</div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
                {delta === 0 ? `In line with your usual ${baseline}` : (delta < 0 ? `Down ${Math.abs(delta)} from your usual ${baseline}` : `Up ${delta} from your usual ${baseline}`)}
              </div>
            </div>
            <div style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: 32, color: '#fff', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {channelScore}
            </div>
          </div>
          <svg width={w} height={h} style={{ display: 'block' }}>
            <defs>
              <linearGradient id={`dxArea-${kind}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.glow} stopOpacity="0.32"/>
                <stop offset="100%" stopColor={s.glow} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={`${d} L${w},${h} L0,${h} Z`} fill={`url(#dxArea-${kind})`}/>
            <path d={d} stroke={s.glow} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" className="spark"/>
            <circle cx={xs[xs.length-1]} cy={ys[ys.length-1]} r="3.5" fill={s.glow}/>
            <circle cx={xs[xs.length-1]} cy={ys[ys.length-1]} r="8" fill={s.glow} opacity="0.25"/>
          </svg>
        </div>

        {/* Raw reading strip */}
        <div style={{ padding: '18px 22px 0', display: 'flex', gap: 28 }} className="rise-2">
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 4 }}>NOW</div>
            <div style={{ fontSize: 22, fontWeight: 300, color: '#fff', letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>
              {data.value}<span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginLeft: 3 }}>{data.unit}</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 4 }}>BASELINE</div>
            <div style={{ fontSize: 22, fontWeight: 300, color: 'rgba(255,255,255,0.6)', letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>
              {data.baseline}<span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginLeft: 3 }}>{data.unit}</span>
            </div>
          </div>
        </div>

        {/* Diagnostic cards */}
        {dxs.length > 0 && (
          <>
            <div style={{ padding: '28px 22px 12px' }} className="rise-3">
              <div className="label-caps" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>WHAT CNRY IS SEEING</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, maxWidth: 320 }}>
                Hypotheses ranked by confidence. None of these are certainties — they're starting points for a conversation with your mechanic.
              </div>
            </div>
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {dxs.map((dx, i) => (
                <DiagnosticCard key={i} dx={dx} accent={s.glow} riseClass={`rise-${Math.min(5, 3 + i)}`}/>
              ))}
            </div>
            {/* Send to marina (outlined) */}
            <div style={{ padding: '20px 16px 0' }} className="rise-5">
              <button style={{
                width: '100%', padding: '15px', borderRadius: 14,
                border: '1px solid rgba(245,197,38,0.45)', background: 'transparent',
                color: '#F5C526', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 7 L13 1 L9 13 L7 8 L1 7 Z" stroke="#F5C526" strokeWidth="1.4" fill="none" strokeLinejoin="round"/></svg>
                Send to my marina
              </button>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 8, lineHeight: 1.4 }}>
                We'll compose a summary of these readings for your mechanic. Nothing sends without your confirmation.
              </div>
            </div>
          </>
        )}

        {/* Healthy empty state */}
        {dxs.length === 0 && (
          <div style={{ padding: '32px 22px 0' }} className="rise-3">
            <div style={{ padding: '22px', borderRadius: 18,
              background: `linear-gradient(135deg, ${s.glow}14, transparent)`, border: `1px solid ${s.glow}26`,
              display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div className="breathe" style={{ flexShrink: 0, marginTop: 2 }}><Bird size={38}/></div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 6 }}>Nothing to flag</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                  This channel is tracking comfortably within your baseline. We'll surface anything worth a look.
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ height: navStyle === 'pill' ? 110 : 100 }}/>
      </div>
    </div>
  );
}

// ─── HISTORY ──────────────────────────────────────────────────
function HistoryScreen({ state, onNav, navStyle }) {
  const s = ENGINE_STATES[state];
  // Start high, ease toward current score. Works for any penumbra value.
  const target = s.p !== undefined ? s.p : s.score;
  const start = Math.min(92, Math.max(target + 8, 82));
  const days = Array.from({ length: 28 }, (_, i) => {
    const t = i / 27;
    const eased = t * t;
    const base = start + (target - start) * eased;
    const jitter = Math.sin(i * 1.3) * 2.5 + Math.cos(i * 0.7) * 1.8;
    return Math.round(Math.max(10, Math.min(100, base + jitter)));
  });
  const w = 334, h = 180;
  const xs = days.map((_, i) => (i / (days.length - 1)) * w);
  const ys = days.map(v => h - ((v - 30) / 70) * (h - 20) - 10);
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');

  return (
    <div style={{ position: 'relative', minHeight: '100%', background: '#0A0A0A' }} className="scroll-hidden slow">
      <StateWash state={state} treatment="dark-accent"/>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ height: 58 }}/>
        <div style={{ padding: '4px 22px 0' }}><HeaderBar/></div>
        <div style={{ padding: '28px 22px 0' }} className="rise-1">
          <div className="label-caps" style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 10 }}>HISTORY</div>
          <div style={{ fontSize: 30, fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15 }}>4 weeks at a glance</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 6, maxWidth: 300 }}>
            {s.p >= 80 && 'Your engine has been steady. No meaningful changes to flag.'}
            {s.p < 80 && s.p >= 55 && 'A gentle drift over the last fortnight. Nothing urgent, but worth watching.'}
            {s.p < 55 && s.p >= 30 && 'A steady drift over the past two weeks. Worth a closer look.'}
            {s.p < 30 && 'Clear decline over the past two weeks. Time to get eyes on it.'}
          </div>
        </div>
        <div style={{ margin: '22px 16px 0', padding: '18px 14px 10px', borderRadius: 20,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }} className="rise-2">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.5)', padding: '0 6px 8px' }}>
            <span>Engine score</span>
            <span className="mono" style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{s.score}<span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginLeft: 3 }}>now</span></span>
          </div>
          <svg width={w} height={h} style={{ display: 'block' }}>
            {[25, 50, 75].map(p => (
              <line key={p} x1="0" y1={h - (p / 100) * (h - 20) - 10} x2={w} y2={h - (p / 100) * (h - 20) - 10} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            ))}
            <defs>
              <linearGradient id="histArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.glow} stopOpacity="0.3"/>
                <stop offset="100%" stopColor={s.glow} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={`${d} L${w},${h} L0,${h} Z`} fill="url(#histArea)"/>
            <path d={d} stroke={s.glow} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" className="spark"/>
            <circle cx={xs[xs.length-1]} cy={ys[ys.length-1]} r="4" fill={s.glow}/>
            <circle cx={xs[xs.length-1]} cy={ys[ys.length-1]} r="9" fill={s.glow} opacity="0.25"/>
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px 0', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
            <span>28d ago</span><span>21d</span><span>14d</span><span>7d</span><span>today</span>
          </div>
        </div>
        <div style={{ padding: '26px 22px 10px' }} className="rise-3">
          <div className="label-caps" style={{ color: 'rgba(255,255,255,0.5)' }}>RECENT TRIPS</div>
        </div>
        <div style={{ padding: '0 16px' }}>
          {TRIPS.map((t, i) => {
            const ts = ENGINE_STATES[t.state];
            return (
              <div key={t.id} className={`rise-${Math.min(5, 3 + Math.floor(i / 2))}`} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '16px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                  background: `${ts.glow}22`, border: `1px solid ${ts.glow}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: ts.glow }}>{t.score}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', marginBottom: 2 }}>{t.label}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{t.date} · {t.hours}h underway</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: t.delta < 0 ? '#F5C526' : t.delta > 0 ? '#2ECC71' : 'rgba(255,255,255,0.4)', fontVariantNumeric: 'tabular-nums' }}>
                  {t.delta > 0 ? '+' : ''}{t.delta}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ height: navStyle === 'pill' ? 110 : 100 }}/>
      </div>
    </div>
  );
}

// ─── ALERTS ───────────────────────────────────────────────────
function AlertsScreen({ state, onNav, navStyle }) {
  const sevMap = {
    watch:    { label: 'Worth a look', color: '#F5C526' },
    info:     { label: 'For your info', color: 'rgba(255,255,255,0.55)' },
    resolved: { label: 'Resolved',     color: '#2ECC71' },
  };
  return (
    <div style={{ position: 'relative', minHeight: '100%', background: '#0A0A0A' }} className="scroll-hidden slow">
      <StateWash state={state} treatment="dark-accent"/>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ height: 58 }}/>
        <div style={{ padding: '4px 22px 0' }}><HeaderBar/></div>
        <div style={{ padding: '28px 22px 0' }} className="rise-1">
          <div className="label-caps" style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 10 }}>ALERTS</div>
          <div style={{ fontSize: 30, fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15 }}>Nothing urgent</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 6, maxWidth: 300 }}>
            We only shout when it matters. Here's what's worth knowing.
          </div>
        </div>
        <div style={{ padding: '22px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ALERTS.map((a, i) => {
            const sev = sevMap[a.severity];
            return (
              <div key={a.id} className={`rise-${Math.min(5, 2 + i)}`} style={{
                padding: '16px 18px', borderRadius: 18,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 7, height: 7, borderRadius: 4, background: sev.color }}/>
                    <span style={{ fontSize: 11, fontWeight: 600, color: sev.color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{sev.label}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{a.time}</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#fff', marginBottom: 6 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, textWrap: 'pretty' }}>{a.body}</div>
              </div>
            );
          })}
        </div>
        <div style={{ height: navStyle === 'pill' ? 110 : 100 }}/>
      </div>
    </div>
  );
}

// ─── PROFILE (logbook) ────────────────────────────────────────
function LogRow({ label, value, editable, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 16px', borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.06)',
    }}>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        {editable && (
          <svg width="12" height="12" viewBox="0 0 12 12" style={{ opacity: 0.35 }}>
            <path d="M8 1 L11 4 L4 11 L1 11 L1 8 Z" stroke="#fff" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
    </div>
  );
}

function ProfileScreen({ state, onNav, navStyle }) {
  const b = BOAT_EXTENDED;
  const sh = SERVICE_HISTORY;
  return (
    <div style={{ position: 'relative', minHeight: '100%', background: '#0A0A0A' }} className="scroll-hidden slow">
      <StateWash state={state} treatment="dark-accent"/>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ height: 58 }}/>
        <div style={{ padding: '4px 22px 0' }}><HeaderBar/></div>

        {/* Boat name hero */}
        <div style={{ padding: '28px 22px 0' }} className="rise-1">
          <div className="label-caps" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>SHIP'S LOG</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span className="wordmark" style={{ fontSize: 32, color: '#fff', letterSpacing: '0.04em' }}>{b.name.toUpperCase()}</span>
                <svg width="14" height="14" viewBox="0 0 12 12" style={{ opacity: 0.4 }}>
                  <path d="M8 1 L11 4 L4 11 L1 11 L1 8 Z" stroke="#fff" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{b.homePort}</div>
            </div>
            <div className="breathe"><Bird size={48}/></div>
          </div>
        </div>

        {/* My Boat card */}
        <div style={{ padding: '22px 16px 0' }} className="rise-2">
          <div className="label-caps" style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 10, paddingLeft: 6 }}>MY BOAT</div>
          <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, overflow: 'hidden' }}>
            <LogRow label="Engine" value={b.engine}/>
            <LogRow label="Engine hours" value={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span>{b.hours} h</span>
                <span style={{ fontSize: 11, color: '#F5C526', fontWeight: 500 }}>Update</span>
              </span>
            }/>
            <LogRow label="Year built" value={b.year} editable/>
            <LogRow label="Length" value={`${b.length} ${b.lengthUnit}`} editable/>
            <LogRow label="Hull type" value={b.hullType} editable last/>
          </div>
        </div>

        {/* Service History */}
        <div style={{ padding: '26px 16px 0' }} className="rise-3">
          <div className="label-caps" style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 10, paddingLeft: 6 }}>SERVICE HISTORY</div>
          <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: '16px 16px' }}>
            {/* Last service */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Last service</div>
                <div style={{ fontSize: 15, color: '#fff' }}>{sh.lastServiceDate}</div>
              </div>
              <span style={{ padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>
                {sh.monthsAgo} months ago
              </span>
            </div>

            {/* Upload target */}
            <div style={{ marginTop: 14 }}>
              <button style={{
                width: '100%', padding: '18px', borderRadius: 14,
                border: '1.5px dashed rgba(255,255,255,0.18)', background: 'transparent',
                color: 'rgba(255,255,255,0.75)', cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16"><path d="M10 1 L3 8 C2 9 2 11 3 12 C4 13 6 13 7 12 L13 6 C14 5 14 3 13 2 C12 1 10 1 10 1 Z L5 9" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span style={{ fontSize: 13, fontWeight: 500 }}>Upload service documents</span>
              </button>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginTop: 6 }}>PDF or image</div>
            </div>

            {/* Uploaded docs */}
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sh.documents.map((doc, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                  background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ width: 32, height: 40, borderRadius: 4, background: 'rgba(245,197,38,0.12)', border: '1px solid rgba(245,197,38,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5C526', fontSize: 9, fontWeight: 700 }}>
                    {doc.name.endsWith('.pdf') ? 'PDF' : 'IMG'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{doc.added} · {doc.size}</div>
                  </div>
                  <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 4 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 4 L11 4 M5 4 L5 2 L9 2 L9 4 M4 4 L5 12 L9 12 L10 4" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Add note */}
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <input type="text" placeholder="Add a service note…" style={{
                width: '100%', padding: '12px 14px', borderRadius: 12,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none',
              }}/>
            </div>

            {/* Notes list */}
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column' }}>
              {sh.notes.map((n, i) => (
                <div key={i} style={{
                  padding: '12px 0', borderBottom: i === sh.notes.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 4, letterSpacing: '0.04em' }}>{n.date}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.45, textWrap: 'pretty' }}>{n.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sensor */}
        <div style={{ padding: '26px 16px 0' }} className="rise-4">
          <div className="label-caps" style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 10, paddingLeft: 6 }}>SENSOR DEVICE</div>
          <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{b.sensor.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Last sync · {b.sensor.lastSync}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                {[1,2,3,4].map(n => (
                  <div key={n} style={{
                    width: 4, height: 4 + n * 3, borderRadius: 1,
                    background: n <= b.sensor.signal ? '#2ECC71' : 'rgba(255,255,255,0.15)',
                  }}/>
                ))}
              </div>
            </div>
            <button style={{
              fontSize: 12, color: 'rgba(232,69,42,0.8)', background: 'none', border: 'none',
              padding: '4px 0', cursor: 'pointer', fontFamily: 'inherit',
            }}>Forget device</button>
          </div>
        </div>

        <div style={{ height: navStyle === 'pill' ? 120 : 110 }}/>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, MetricDetailScreen, HistoryScreen, AlertsScreen, ProfileScreen });
