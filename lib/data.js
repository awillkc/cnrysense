// CNRY data — realistic engine readings, trip log, alerts

const ENGINE_STATES = {
  healthy: {
    id: 'healthy',
    score: 88,
    verdict: 'Running well',
    context: 'Shifted slightly from your usual 90 — normal variation.',
    rhythm: { state: 'Smooth', detail: 'Vibration matches baseline', value: 0.18, unit: 'mm/s', baseline: 0.17 },
    sound:  { state: 'Sounds right', detail: 'Acoustic profile consistent', value: 62, unit: 'dB', baseline: 61 },
    stress: { state: 'Normal load', detail: 'Typical usage pattern', value: 74, unit: '°C', baseline: 76 },
    trendLabel: '4-week trend',
    trendDirection: 'steady',
    spark: [85, 89, 87, 90, 88, 91, 88, 87, 90, 88, 89, 88],
    washColors: ['#0E7A6B', '#14A888'],
    glow: '#1DC79F',
    accent: '#14A888',
    banner: null,
  },
  watching: {
    id: 'watching',
    score: 68,
    verdict: 'Worth keeping an eye on',
    context: 'Down 20 points from your baseline of 88. Monitoring the trend.',
    rhythm: { state: 'Rougher than usual', detail: 'Vibration shifted — 14% above baseline', value: 0.22, unit: 'mm/s', baseline: 0.17 },
    sound:  { state: 'Tone has shifted', detail: 'Exhaust note changed in last 3 trips', value: 68, unit: 'dB', baseline: 61 },
    stress: { state: 'Working harder', detail: 'Running warmer than typical usage', value: 82, unit: '°C', baseline: 76 },
    trendLabel: '4-week trend · watching',
    trendDirection: 'declining',
    spark: [88, 87, 85, 84, 82, 79, 77, 75, 72, 70, 68, 68],
    washColors: ['#9A7510', '#D4A015'],
    glow: '#F5C526',
    accent: '#D4A015',
    banner: null,
  },
  action: {
    id: 'action',
    score: 48,
    verdict: 'Needs some attention',
    context: 'Significant change from your usual 85. Worth looking into.',
    rhythm: { state: 'Getting rough', detail: 'Noticeable change in balance', value: 0.31, unit: 'mm/s', baseline: 0.17 },
    sound:  { state: 'Unusual sounds', detail: 'New pattern detected near fuel pump', value: 76, unit: 'dB', baseline: 61 },
    stress: { state: 'Under strain', detail: 'Consider scheduling service', value: 91, unit: '°C', baseline: 76 },
    trendLabel: '4-week trend · declining',
    trendDirection: 'declining',
    spark: [85, 82, 78, 74, 70, 65, 60, 56, 52, 50, 48, 48],
    washColors: ['#A73A1A', '#D75B2C'],
    glow: '#F07A3A',
    accent: '#D75B2C',
    banner: { text: 'Time to call your marina', cta: 'View details' },
  },
};

// trips — history data
const TRIPS = [
  { id: 't1', date: 'Today',       label: 'Short run — Hamble to Cowes',          hours: 2.1, score: 68, delta: -4, state: 'watching' },
  { id: 't2', date: 'Wed, Apr 15', label: 'Evening cruise — Solent loop',         hours: 3.4, score: 72, delta: -3, state: 'watching' },
  { id: 't3', date: 'Sun, Apr 13', label: 'Weekend trip — Yarmouth & back',       hours: 5.2, score: 75, delta: -6, state: 'watching' },
  { id: 't4', date: 'Sat, Apr 5',  label: 'Day out — Lymington',                  hours: 4.0, score: 86, delta: +1, state: 'healthy' },
  { id: 't5', date: 'Sun, Mar 30', label: 'Fishing — Nab Tower',                  hours: 6.1, score: 89, delta:  0, state: 'healthy' },
  { id: 't6', date: 'Sat, Mar 22', label: 'First trip of season — shakedown',     hours: 1.8, score: 87, delta: -2, state: 'healthy' },
];

// alerts
const ALERTS = [
  {
    id: 'a1', severity: 'watch', state: 'watching',
    title: 'Exhaust note has changed',
    time: '2h ago',
    body: 'Acoustic signature shifted across your last three trips. Often points to a loose clamp or gasket, but worth a listen on your next start-up.',
  },
  {
    id: 'a2', severity: 'info', state: 'healthy',
    title: 'Monthly check-in',
    time: 'Yesterday',
    body: 'Your engine has logged 23 hours this month. All three signals are within your normal range. No action needed.',
  },
  {
    id: 'a3', severity: 'resolved', state: 'healthy',
    title: 'Cold-start warmth resolved',
    time: 'Apr 2',
    body: 'Running temperature returned to baseline after the marina service. Nice one.',
  },
];

// metric detail readings — rhythm timeline
const RHYTHM_READINGS = {
  healthy: [0.17, 0.18, 0.17, 0.18, 0.19, 0.18, 0.17, 0.18, 0.18, 0.17, 0.19, 0.18, 0.18, 0.17, 0.18, 0.18, 0.17, 0.18, 0.18, 0.18],
  watching:[0.17, 0.17, 0.18, 0.18, 0.19, 0.20, 0.20, 0.21, 0.21, 0.22, 0.22, 0.21, 0.22, 0.22, 0.23, 0.22, 0.22, 0.21, 0.22, 0.22],
  action:  [0.17, 0.18, 0.18, 0.19, 0.21, 0.22, 0.24, 0.25, 0.26, 0.27, 0.28, 0.29, 0.29, 0.30, 0.30, 0.31, 0.31, 0.30, 0.31, 0.31],
};

// boat profile
const BOAT = {
  name: 'Pugwash',
  make: 'Beneteau Antares 8',
  engine: 'Volvo Penta D3-220',
  hours: 847,
  homePort: 'Hamble Point Marina',
  sensorSerial: 'CN-4221-A',
};

Object.assign(window, { ENGINE_STATES, TRIPS, ALERTS, RHYTHM_READINGS, BOAT });
