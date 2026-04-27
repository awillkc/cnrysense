// CNRY diagnostics — mechanical hypotheses per channel / state

const DIAGNOSTICS = {
  rhythm: {
    healthy: [],
    watching: [
      { title: "Prop shaft imbalance", confidence: "likely",
        body: "Vibration pattern peaks at low RPM and eases off above 2,000 — consistent with prop shaft or coupling movement.",
        action: "Have your prop shaft checked at next haul-out." },
      { title: "Engine mount wear", confidence: "possible",
        body: "Vibration is transmitting more to the hull than your baseline — soft mounts can harden over time.",
        action: "Worth inspecting engine mounts." },
      { title: "Propeller fouling", confidence: "rule-out",
        body: "Slight imbalance may clear if the prop is cleaned. Try antifouling or a dive inspection first.",
        action: null },
    ],
    action: [
      { title: "Prop shaft imbalance", confidence: "likely",
        body: "Strong low-RPM vibration peak — classic shaft or coupling signature. This has grown over the last fortnight.",
        action: "Book a haul-out to inspect shaft alignment and coupling." },
      { title: "Engine mount failure", confidence: "possible",
        body: "Hull-borne vibration is well outside your usual range. One or more mounts may have collapsed.",
        action: "Have mounts inspected before your next longer trip." },
    ],
  },
  sound: {
    healthy: [],
    watching: [
      { title: "Worn alternator bearing", confidence: "likely",
        body: "A consistent high-frequency tone has appeared at idle, separate from combustion noise — characteristic of a bearing starting to wear.",
        action: "Worth having the alternator checked at your next service." },
      { title: "Injector irregularity", confidence: "possible",
        body: "Combustion tone has become slightly uneven across cylinders — could indicate a partially blocked injector.",
        action: "A fuel-system inspection will confirm." },
      { title: "Exhaust riser build-up", confidence: "rule-out",
        body: "Exhaust tone has deepened slightly — carbon build-up in the riser is common at this engine age.",
        action: null },
    ],
    action: [
      { title: "Fuel pump irregularity", confidence: "likely",
        body: "New repeating low-frequency pulse near the fuel system — often indicates a failing pump or blocked line.",
        action: "Book a mechanic before your next trip." },
      { title: "Worn alternator bearing", confidence: "possible",
        body: "The high-frequency tone has grown louder and more persistent — bearing wear has likely progressed.",
        action: "Replace as part of your next service." },
    ],
  },
  stress: {
    healthy: [],
    watching: [
      { title: "Running above optimal RPM range", confidence: "likely",
        body: "Your recent usage shows extended periods above 3,200 RPM — your engine's sweet spot is 2,400–2,800. Higher revs increase wear rate.",
        action: "Cruise at 2,600 RPM where possible." },
      { title: "Cold-start acceleration", confidence: "possible",
        body: "Several short-run sessions detected — engines benefit from warming up before loading. Consider idling 2–3 minutes before throttling up.",
        action: null },
      { title: "Prop pitch mismatch", confidence: "rule-out",
        body: "Load profile suggests the engine is working harder than expected for your hull type — a prop pitch assessment could improve efficiency and reduce stress.",
        action: null },
    ],
    action: [
      { title: "Cooling system under-performing", confidence: "likely",
        body: "Running temperature has crept up across the last six trips. Raw-water flow may be restricted.",
        action: "Check raw-water intake, impeller, and strainer." },
      { title: "Running above optimal RPM range", confidence: "possible",
        body: "Sustained high-RPM trips are compounding the thermal load. Short-term: ease off. Long-term: consider a prop pitch review.",
        action: null },
    ],
  },
};

// 30-day channel series for sparkline
const CHANNEL_SERIES = {
  rhythm: {
    healthy:  Array.from({length: 30}, (_, i) => 86 + Math.sin(i * 0.7) * 3 + Math.cos(i * 1.1) * 1.5),
    watching: Array.from({length: 30}, (_, i) => 86 - (i / 30) * 14 + Math.sin(i * 0.9) * 2.5),
    action:   Array.from({length: 30}, (_, i) => 84 - (i / 30) * 38 + Math.sin(i * 0.8) * 2),
  },
  sound: {
    healthy:  Array.from({length: 30}, (_, i) => 88 + Math.sin(i * 0.5) * 2.5 + Math.cos(i * 1.3) * 1.2),
    watching: Array.from({length: 30}, (_, i) => 85 - (i / 30) * 12 + Math.sin(i * 0.6) * 2),
    action:   Array.from({length: 30}, (_, i) => 83 - (i / 30) * 35 + Math.sin(i * 0.7) * 2),
  },
  stress: {
    healthy:  Array.from({length: 30}, (_, i) => 84 + Math.sin(i * 0.8) * 2.5),
    watching: Array.from({length: 30}, (_, i) => 84 - (i / 30) * 16 + Math.sin(i * 0.6) * 2.5),
    action:   Array.from({length: 30}, (_, i) => 82 - (i / 30) * 36 + Math.sin(i * 0.9) * 2),
  },
};

const CHANNEL_SCORES = {
  rhythm: { healthy: 88, watching: 72, action: 46 },
  sound:  { healthy: 90, watching: 73, action: 49 },
  stress: { healthy: 84, watching: 62, action: 50 },
};

const CHANNEL_BASELINES = {
  rhythm: 86, sound: 88, stress: 82,
};

// Service history
const SERVICE_HISTORY = {
  lastServiceDate: "Aug 12, 2025",
  monthsAgo: 8,
  documents: [
    { name: "Annual_service_2025.pdf", added: "Aug 14, 2025", size: "2.4 MB" },
    { name: "Impeller_receipt.jpg",     added: "Apr 3, 2026",  size: "0.9 MB" },
  ],
  notes: [
    { date: "Apr 3, 2026",  text: "Replaced impeller — marina said it was due." },
    { date: "Aug 12, 2025", text: "Annual service at Hamble Point. Oil, filters, anodes." },
    { date: "Jun 4, 2025",  text: "New alternator belt fitted. Minor tension adjustment." },
    { date: "Mar 18, 2025", text: "Winter recommissioning — battery replaced." },
  ],
};

const BOAT_EXTENDED = {
  name: "Pugwash",
  make: "Beneteau Antares 8",
  engine: "Volvo Penta D3-220",
  hours: 847,
  year: 2019,
  length: 8.2,
  lengthUnit: "m",
  hullType: "Semi-displacement",
  homePort: "Hamble Point Marina",
  sensor: {
    name: "CNRY Sense · CN-4221-A",
    signal: 4, // 0-4
    lastSync: "4 minutes ago",
  },
};

Object.assign(window, { DIAGNOSTICS, CHANNEL_SERIES, CHANNEL_SCORES, CHANNEL_BASELINES, SERVICE_HISTORY, BOAT_EXTENDED });
