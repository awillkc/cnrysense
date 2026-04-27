// CNRY penumbra — one continuous value (0–100) derives everything downstream.
// 100 = running beautifully, 0 = let's sort this out.
// No bands, no thresholds. All outputs interpolate smoothly.

(function () {

  // ─── Palette stops along the penumbra ─────────────────────────
  // Left-to-right in the gradient bar (high score → low score).
  // Deep ocean teal → green → canary → warm amber → soft coral.
  const STOPS = [
    { at: 100, hex: '#0A6E88', bright: '#18A9C8' }, // deep ocean teal
    { at:  85, hex: '#0E8A6B', bright: '#14C79F' }, // green (healthy)
    { at:  70, hex: '#8B7A0E', bright: '#D4B020' }, // olive → canary warming
    { at:  55, hex: '#B88A10', bright: '#F5C526' }, // canary
    { at:  40, hex: '#C77A1C', bright: '#E89A38' }, // warm amber
    { at:  25, hex: '#C55935', bright: '#E87A4A' }, // coral
    { at:   0, hex: '#A73A1A', bright: '#D85C2C' }, // deep coral
  ];

  // ─── Phrase gradient (penumbra language) ──────────────────────
  // Soft, drifting, no thresholds.
  const PHRASES = [
    { at: 100, verdict: 'Running beautifully',   context: 'Every channel sitting sweetly on its baseline.' },
    { at:  90, verdict: 'Running well',          context: 'A touch above baseline. Normal variation.' },
    { at:  80, verdict: 'Running well',          context: 'Sitting a little below your usual. Nothing of concern.' },
    { at:  70, verdict: 'Running fine',          context: 'A gentle drift over recent trips. Keeping an eye on it.' },
    { at:  60, verdict: 'Worth keeping an eye on', context: 'Drift is starting to settle in. Not urgent.' },
    { at:  50, verdict: 'Worth watching',        context: 'A channel has moved from its baseline. Worth a glance.' },
    { at:  40, verdict: 'Changing a bit',        context: 'The shift is becoming consistent. Worth investigating soon.' },
    { at:  30, verdict: 'Needs some attention',  context: 'Something has moved far enough to want a look.' },
    { at:  20, verdict: 'Needs attention',       context: "Worth a mechanic's eye before your next longer trip." },
    { at:  10, verdict: "Let's sort this out",   context: 'Strong signal across more than one channel.' },
    { at:   0, verdict: "Let's sort this out",   context: "Don't head out without seeing to this." },
  ];

  function lerp(a, b, t) { return a + (b - a) * t; }
  function hexToRgb(h) {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgbToHex(r, g, b) {
    const toHex = v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');
    return '#' + toHex(r) + toHex(g) + toHex(b);
  }
  function lerpHex(a, b, t) {
    const ra = hexToRgb(a), rb = hexToRgb(b);
    return rgbToHex(lerp(ra[0], rb[0], t), lerp(ra[1], rb[1], t), lerp(ra[2], rb[2], t));
  }

  function colorAt(p) {
    // find bracketing stops
    for (let i = 0; i < STOPS.length - 1; i++) {
      const a = STOPS[i], b = STOPS[i + 1];
      if (p <= a.at && p >= b.at) {
        const t = (a.at - p) / (a.at - b.at);
        return { hex: lerpHex(a.hex, b.hex, t), bright: lerpHex(a.bright, b.bright, t) };
      }
    }
    return { hex: STOPS[STOPS.length - 1].hex, bright: STOPS[STOPS.length - 1].bright };
  }

  function phraseAt(p) {
    for (let i = 0; i < PHRASES.length - 1; i++) {
      const a = PHRASES[i], b = PHRASES[i + 1];
      if (p <= a.at && p >= b.at) {
        // pick the closer one
        return (a.at - p) < (p - b.at) ? a : b;
      }
    }
    return PHRASES[PHRASES.length - 1];
  }

  // smooth ramp 0→1 as p drops from hi to lo
  function drift(p, hi, lo) {
    if (p >= hi) return 0;
    if (p <= lo) return 1;
    return (hi - p) / (hi - lo);
  }

  // ─── Channel readings (continuous) ────────────────────────────
  // Each channel has its own drift curve so they don't move together.
  // Rhythm starts drifting earliest, sound middle, stress latest.
  function channelsAt(p) {
    const rd = drift(p, 90, 10);
    const sd = drift(p, 85, 5);
    const td = drift(p, 80, 0);

    const rhythmVal = +(0.17 + rd * 0.16).toFixed(2);         // 0.17 → 0.33 mm/s
    const soundVal  = Math.round(61 + sd * 17);                // 61 → 78 dB
    const stressVal = Math.round(74 + td * 20);                // 74 → 94 °C

    return {
      rhythm: {
        state: rd < 0.15 ? 'Smooth'
             : rd < 0.45 ? 'A little off'
             : rd < 0.75 ? 'Rougher than usual'
             : 'Notably rough',
        detail: rd < 0.15 ? 'Vibration matches baseline'
             : rd < 0.45 ? 'Small shift in vibration pattern'
             : rd < 0.75 ? `Vibration ${Math.round(rd * 60)}% above baseline`
             : 'Noticeable change in balance',
        value: rhythmVal, unit: 'mm/s', baseline: 0.17,
      },
      sound: {
        state: sd < 0.15 ? 'Sounds right'
             : sd < 0.45 ? 'Tone has nudged'
             : sd < 0.75 ? 'Tone has shifted'
             : 'Unusual sounds',
        detail: sd < 0.15 ? 'Acoustic profile consistent'
             : sd < 0.45 ? 'Minor shift in exhaust note'
             : sd < 0.75 ? 'Exhaust note changed in recent trips'
             : 'New pattern detected near fuel pump',
        value: soundVal, unit: 'dB', baseline: 61,
      },
      stress: {
        state: td < 0.15 ? 'Normal load'
             : td < 0.45 ? 'Slightly warmer'
             : td < 0.75 ? 'Working harder'
             : 'Under strain',
        detail: td < 0.15 ? 'Typical usage pattern'
             : td < 0.45 ? 'Running a touch warmer'
             : td < 0.75 ? 'Running warmer than typical usage'
             : 'Consider scheduling service',
        value: stressVal, unit: '°C', baseline: 76,
      },
    };
  }

  // ─── Spark series (last 12 weeks trending toward current p) ──
  function sparkAt(p) {
    const start = 90; // started well
    const pts = [];
    for (let i = 0; i < 12; i++) {
      const t = i / 11; // 0 → 1
      // ease-in so drop accelerates toward current
      const eased = t * t;
      const v = start + (p - start) * eased;
      // add a tiny jitter for realism
      const jit = (Math.sin(i * 1.7) + Math.cos(i * 0.9)) * 1.2;
      pts.push(Math.round(v + jit));
    }
    pts[pts.length - 1] = Math.round(p);
    return pts;
  }

  // ─── Rhythm timeline (for metric detail) ─────────────────────
  function rhythmTimelineAt(p) {
    const end = 0.17 + drift(p, 90, 10) * 0.16;
    const pts = [];
    for (let i = 0; i < 20; i++) {
      const t = i / 19;
      const eased = t * t;
      const v = 0.17 + (end - 0.17) * eased;
      const jit = (Math.sin(i * 2.1) + Math.cos(i * 1.3)) * 0.008;
      pts.push(+(v + jit).toFixed(3));
    }
    return pts;
  }

  // ─── Banner (only when the message actually warrants it) ─────
  function bannerAt(p) {
    if (p >= 45) return null;
    if (p >= 25) return { text: 'A hypothesis is worth a look', cta: 'View details' };
    return { text: 'Time to see your mechanic', cta: 'View details' };
  }

  // ─── Derive full state shape (drop-in for ENGINE_STATES[key]) ─
  function derive(p) {
    p = Math.max(0, Math.min(100, p));
    const col = colorAt(p);
    const ph = phraseAt(p);
    const ch = channelsAt(p);
    const band = p >= 75 ? 'healthy' : p >= 40 ? 'watching' : 'action'; // internal only — never surfaced
    return {
      id: 'penumbra',
      band,                          // legacy: some screens still switch data shape on this
      score: Math.round(p),
      p,
      verdict: ph.verdict,
      context: ph.context,
      rhythm: ch.rhythm,
      sound: ch.sound,
      stress: ch.stress,
      trendLabel: p >= 80 ? 'Steady over 4 weeks'
                : p >= 55 ? 'Gentle drift over 4 weeks'
                : 'Drifting over 4 weeks',
      trendDirection: p >= 82 ? 'steady' : 'declining',
      spark: sparkAt(p),
      washColors: [col.hex, col.bright],
      glow: col.bright,
      accent: col.bright,
      banner: bannerAt(p),
    };
  }

  // Full gradient CSS string for the slider rail
  function gradientCSS() {
    // high p on LEFT (100) → low p on RIGHT (0), so reverse
    const stops = [...STOPS].sort((a, b) => b.at - a.at);
    return 'linear-gradient(to right, ' +
      stops.map(s => `${s.bright} ${100 - s.at}%`).join(', ') + ')';
  }

  window.Penumbra = { derive, colorAt, phraseAt, gradientCSS, rhythmTimelineAt, STOPS, PHRASES };
})();
