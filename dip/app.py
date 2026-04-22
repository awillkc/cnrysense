#!/usr/bin/env python3
"""
CNRY Diagnostic Intelligence Platform — Web Demo
FastAPI app with embedded HTML frontend. Runs locally or deploys to Railway.

Setup:
  pip install -r requirements.txt
  export ANTHROPIC_API_KEY=your_key_here
  python3 app.py

Deploy to Railway:
  Connect repo, set ANTHROPIC_API_KEY in env vars, deploy.
"""

import json
import os
import sys
from pathlib import Path
import anthropic
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
import uvicorn

# ── Config ─────────────────────────────────────────────────────────────────
PORT = int(os.environ.get("PORT", 8080))
KB_PATH = Path(__file__).parent / "knowledge_base.json"
MODEL   = "claude-opus-4-5"

app = FastAPI(title="CNRY DIP Demo")

# ── Load knowledge base once at startup ────────────────────────────────────
with open(KB_PATH) as f:
    KB = json.load(f)

def format_kb():
    lines = []
    for entry in KB["entries"]:
        lines.append(f"\n[ENTRY {entry['id']}]")
        lines.append(f"SYMPTOM: {entry['symptom']}")
        lines.append(f"COMPONENT: {entry['component']}")
        if entry.get("frequency_signature"):
            lines.append(f"FREQUENCY SIGNATURE: {entry['frequency_signature']}")
        lines.append(f"ENGINE TYPES: {', '.join(entry['engine_types'])}")
        lines.append(f"ONSET: {entry['onset']}")
        lines.append("REMEDIES:")
        for r in entry["remedies"]:
            lines.append(
                f"  {r['rank']}. {r['action']} | Difficulty: {r['difficulty']}/5 | "
                f"Cost: £{r['cost_gbp']} | Verified fixes: {r['verified_fixes']} | "
                f"Notes: {r['notes']}"
            )
    return "\n".join(lines)

KB_TEXT = format_kb()

# ── System prompt ───────────────────────────────────────────────────────────
SYSTEM_PROMPT = """You are the CNRY Diagnostic Intelligence — a specialist marine engine diagnostic assistant for recreational inboard diesel and petrol engines on boats under 50ft.

You are given a knowledge base of symptom-remedy pairs sourced from experienced boat owners and mechanics.

Your job: read the user's query (written description OR sensor signal like "280Hz vibration at idle"), identify the 1-3 most relevant knowledge base entries, and return a JSON response.

IMPORTANT: Return ONLY valid JSON. No markdown fences, no preamble.

JSON schema:
{
  "safety_alert": null or "string — only for fuel in bilge, no oil pressure, severe knock etc",
  "likely_cause": "1–2 sentence plain English summary of what is probably going on",
  "confidence": "high" | "medium" | "low",
  "remedies": [
    {
      "rank": 1,
      "action": "What to do",
      "why": "Brief reason why this fixes it",
      "difficulty": 1,
      "difficulty_label": "DIY easy" | "Straightforward" | "Intermediate" | "Advanced" | "Specialist only",
      "cost_gbp": "£20–40",
      "verified_fixes": 89,
      "notes": "Extra context or tips"
    }
  ],
  "mechanics_take": "2–4 sentences in the voice of a knowledgeable mate. Specific. Reference community evidence. End with a single start-here sentence.",
  "matched_components": ["list", "of", "components"]
}

VOICE RULES (critical):
- Sound like a mate who knows engines, not a manual
- Use "worth a look", "usually", "in most cases"
- Reference evidence: "fixes this in over half of cases", "89 boat owners found..."
- Give honest difficulty — don't downplay specialist work
- The mechanics_take must end with exactly one "Start here:" or "Start with..." sentence

If the query is too vague to match well, set confidence to "low" and still return the most likely causes with a mechanics_take that asks for more detail."""


# ── Query endpoint ──────────────────────────────────────────────────────────
@app.post("/query")
async def query(request: Request):
    body = await request.json()
    user_query = body.get("query", "").strip()
    if not user_query:
        return JSONResponse({"error": "Empty query"}, status_code=400)

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return JSONResponse({"error": "ANTHROPIC_API_KEY not set on server"}, status_code=500)

    client = anthropic.Anthropic(api_key=api_key)

    prompt = f"""KNOWLEDGE BASE:
{KB_TEXT}

---
QUERY: {user_query}

Return your diagnosis as JSON only."""

    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=1200,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}]
        )
        raw = response.content[0].text.strip()
        # Strip any accidental markdown fences
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        result = json.loads(raw)
        return JSONResponse(result)
    except json.JSONDecodeError as e:
        return JSONResponse({"error": f"JSON parse error: {e}", "raw": raw}, status_code=500)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


# ── Frontend HTML ───────────────────────────────────────────────────────────
HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CNRY — Diagnostic Intelligence</title>
<style>
  :root {
    --yellow: #F5C518;
    --navy:   #1A2E4A;
    --navy2:  #243d60;
    --grey:   #F2F4F7;
    --mid:    #CDD4DE;
    --text:   #1A2E4A;
    --muted:  #6B7E96;
    --green:  #22c55e;
    --amber:  #f59e0b;
    --red:    #ef4444;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: var(--grey);
    color: var(--text);
    min-height: 100vh;
  }

  /* Header */
  header {
    background: var(--navy);
    padding: 0 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    height: 60px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  .logo { font-size: 22px; font-weight: 800; color: var(--yellow); letter-spacing: 0.08em; }
  .logo-sub { font-size: 13px; color: #8dafc8; font-weight: 400; margin-left: 4px; }
  .badge {
    margin-left: auto;
    font-size: 11px;
    background: rgba(245,197,24,0.15);
    color: var(--yellow);
    border: 1px solid rgba(245,197,24,0.3);
    padding: 3px 10px;
    border-radius: 20px;
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  /* Main layout */
  main { max-width: 820px; margin: 0 auto; padding: 40px 24px 80px; }

  /* Hero */
  .hero { text-align: center; margin-bottom: 36px; }
  .hero h1 { font-size: 26px; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
  .hero p { color: var(--muted); font-size: 15px; line-height: 1.6; max-width: 520px; margin: 0 auto; }

  /* Search box */
  .search-wrap {
    background: white;
    border-radius: 14px;
    box-shadow: 0 2px 16px rgba(26,46,74,0.08);
    padding: 20px;
    margin-bottom: 32px;
  }
  .search-label { font-size: 13px; font-weight: 600; color: var(--muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.06em; }
  .search-row { display: flex; gap: 10px; }
  textarea {
    flex: 1;
    border: 1.5px solid var(--mid);
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 15px;
    font-family: inherit;
    color: var(--text);
    resize: none;
    height: 80px;
    transition: border-color 0.15s;
    outline: none;
  }
  textarea:focus { border-color: var(--yellow); }
  textarea::placeholder { color: #a0adb8; }
  button.ask {
    background: var(--yellow);
    color: var(--navy);
    border: none;
    border-radius: 10px;
    padding: 0 24px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    white-space: nowrap;
    align-self: flex-end;
    height: 48px;
  }
  button.ask:hover { background: #f0bc00; }
  button.ask:active { transform: scale(0.97); }
  button.ask:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* Example queries */
  .examples { margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; }
  .ex-label { font-size: 12px; color: var(--muted); align-self: center; }
  .example {
    font-size: 12px;
    background: var(--grey);
    border: 1px solid var(--mid);
    border-radius: 20px;
    padding: 4px 12px;
    cursor: pointer;
    color: var(--navy2);
    transition: background 0.12s;
  }
  .example:hover { background: #e4e8ee; }

  /* Loading */
  .loading {
    display: none;
    text-align: center;
    padding: 40px;
    color: var(--muted);
    font-size: 15px;
  }
  .loading.visible { display: block; }
  .spinner {
    width: 32px; height: 32px;
    border: 3px solid var(--mid);
    border-top-color: var(--yellow);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 16px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Safety alert */
  .safety {
    background: #fef2f2;
    border: 1.5px solid #fca5a5;
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 20px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  .safety-icon { font-size: 22px; flex-shrink: 0; }
  .safety-text { font-size: 14px; color: #991b1b; line-height: 1.5; }

  /* Result card */
  .result { display: none; }
  .result.visible { display: block; }

  .cause-card {
    background: white;
    border-radius: 14px;
    box-shadow: 0 2px 12px rgba(26,46,74,0.07);
    padding: 24px;
    margin-bottom: 16px;
  }
  .cause-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
  }
  .cause-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
  }
  .confidence-pill {
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .conf-high   { background: #dcfce7; color: #15803d; }
  .conf-medium { background: #fef9c3; color: #a16207; }
  .conf-low    { background: #fee2e2; color: #b91c1c; }
  .cause-text { font-size: 17px; font-weight: 600; color: var(--navy); line-height: 1.5; }
  .components { margin-top: 12px; display: flex; gap: 6px; flex-wrap: wrap; }
  .component-tag {
    font-size: 11px;
    background: var(--grey);
    border: 1px solid var(--mid);
    color: var(--muted);
    padding: 3px 10px;
    border-radius: 20px;
  }

  /* Remedy cards */
  .remedies-section h2 {
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--muted);
    margin-bottom: 10px;
  }
  .remedy-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(26,46,74,0.06);
    padding: 18px 20px;
    margin-bottom: 10px;
    border-left: 4px solid var(--mid);
    transition: box-shadow 0.15s;
  }
  .remedy-card:hover { box-shadow: 0 4px 16px rgba(26,46,74,0.1); }
  .remedy-card.rank-1 { border-left-color: var(--yellow); }
  .remedy-card.rank-2 { border-left-color: var(--navy2); }
  .remedy-card.rank-3 { border-left-color: var(--mid); }

  .remedy-top { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
  .rank-badge {
    width: 28px; height: 28px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 800;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .rank-1 .rank-badge { background: var(--yellow); color: var(--navy); }
  .rank-2 .rank-badge { background: var(--navy); color: white; }
  .rank-3 .rank-badge { background: var(--mid); color: var(--navy); }
  .remedy-action { font-size: 15px; font-weight: 600; color: var(--navy); line-height: 1.4; }
  .remedy-why { font-size: 13px; color: var(--muted); margin-top: 3px; line-height: 1.5; }

  .remedy-meta {
    display: flex; gap: 12px; flex-wrap: wrap;
    margin-top: 10px; padding-top: 10px;
    border-top: 1px solid var(--grey);
  }
  .meta-item { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--muted); }
  .meta-item strong { color: var(--navy); }

  .diff-dots { display: flex; gap: 3px; }
  .dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--mid);
  }
  .dot.filled { background: var(--navy); }
  .diff-1 .dot:nth-child(-n+1) { background: #22c55e; }
  .diff-2 .dot:nth-child(-n+2) { background: #84cc16; }
  .diff-3 .dot:nth-child(-n+3) { background: #f59e0b; }
  .diff-4 .dot:nth-child(-n+4) { background: #f97316; }
  .diff-5 .dot:nth-child(-n+5) { background: #ef4444; }

  .verified-count { color: var(--green); font-weight: 600; }

  .remedy-notes {
    font-size: 12.5px;
    color: var(--muted);
    background: var(--grey);
    border-radius: 8px;
    padding: 8px 12px;
    margin-top: 10px;
    line-height: 1.5;
  }

  /* Mechanic's take */
  .mechanics-card {
    background: var(--navy);
    border-radius: 14px;
    padding: 24px;
    margin-top: 16px;
    color: white;
  }
  .mechanics-header {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 12px;
  }
  .mechanics-icon {
    width: 32px; height: 32px;
    background: var(--yellow);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }
  .mechanics-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #8dafc8; }
  .mechanics-text { font-size: 15px; line-height: 1.65; color: #dde6f0; }

  /* Footer note */
  .footer-note {
    text-align: center;
    font-size: 12px;
    color: var(--muted);
    margin-top: 32px;
    line-height: 1.6;
  }

  @media (max-width: 600px) {
    main { padding: 24px 16px 60px; }
    .search-row { flex-direction: column; }
    button.ask { height: 44px; }
    .remedy-meta { gap: 8px; }
  }
</style>
</head>
<body>

<header>
  <span class="logo">CNRY</span>
  <span class="logo-sub">Diagnostic Intelligence</span>
  <span class="badge">TEAM PREVIEW</span>
</header>

<main>
  <div class="hero">
    <h1>Ask the engine what's wrong</h1>
    <p>Describe a symptom, noise, or sensor reading. Get ranked remedies from community-sourced knowledge — in plain English.</p>
  </div>

  <div class="search-wrap">
    <div class="search-label">Describe what you're hearing, seeing, or measuring</div>
    <div class="search-row">
      <textarea id="q" placeholder="e.g. Low rumbling from gearbox area that gets worse in reverse… or 260Hz vibration signature building over the last 3 trips…"></textarea>
      <button class="ask" id="askBtn" onclick="runQuery()">Diagnose →</button>
    </div>
    <div class="examples">
      <span class="ex-label">Try:</span>
      <span class="example" onclick="setQuery(this)">Gearbox rumble in reverse</span>
      <span class="example" onclick="setQuery(this)">260Hz vibration building over 3 trips</span>
      <span class="example" onclick="setQuery(this)">Engine overheating intermittently</span>
      <span class="example" onclick="setQuery(this)">Diesel won't start, cranks fine</span>
      <span class="example" onclick="setQuery(this)">Loss of power, fine at idle</span>
      <span class="example" onclick="setQuery(this)">Burning smell, no smoke</span>
    </div>
  </div>

  <div class="loading" id="loading">
    <div class="spinner"></div>
    Analysing against 50 community knowledge entries…
  </div>

  <div class="result" id="result"></div>

  <div class="footer-note">
    Prototype · Synthetic knowledge base · 50 entries · For team review only<br>
    Built by CNRY — <a href="https://cnrysense.com" style="color:var(--navy)">cnrysense.com</a>
  </div>
</main>

<script>
function setQuery(el) {
  document.getElementById('q').value = el.textContent;
  document.getElementById('q').focus();
}

async function runQuery() {
  const q = document.getElementById('q').value.trim();
  if (!q) return;

  const btn = document.getElementById('askBtn');
  const loading = document.getElementById('loading');
  const result = document.getElementById('result');

  btn.disabled = true;
  loading.classList.add('visible');
  result.classList.remove('visible');
  result.innerHTML = '';

  try {
    const res = await fetch('/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q })
    });
    const data = await res.json();

    if (data.error) {
      result.innerHTML = `<div style="background:white;border-radius:14px;padding:24px;color:#b91c1c;">${data.error}</div>`;
    } else {
      result.innerHTML = renderResult(data);
    }
    result.classList.add('visible');
  } catch (e) {
    result.innerHTML = `<div style="background:white;border-radius:14px;padding:24px;color:#b91c1c;">Network error: ${e.message}</div>`;
    result.classList.add('visible');
  } finally {
    btn.disabled = false;
    loading.classList.remove('visible');
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function diffDots(n) {
  let html = `<div class="diff-dots diff-${n}">`;
  for (let i = 1; i <= 5; i++) html += `<div class="dot ${i <= n ? 'filled' : ''}"></div>`;
  html += '</div>';
  return html;
}

function renderResult(d) {
  let html = '';

  // Safety alert
  if (d.safety_alert) {
    html += `<div class="safety">
      <div class="safety-icon">⚠️</div>
      <div class="safety-text"><strong>Safety note:</strong> ${d.safety_alert}</div>
    </div>`;
  }

  // Cause card
  const confClass = { high: 'conf-high', medium: 'conf-medium', low: 'conf-low' }[d.confidence] || 'conf-medium';
  const confLabel = { high: 'High confidence', medium: 'Likely match', low: 'Low confidence — needs more info' }[d.confidence] || '';
  const tags = (d.matched_components || []).map(c => `<span class="component-tag">${c}</span>`).join('');

  html += `<div class="cause-card">
    <div class="cause-header">
      <div class="cause-label">Likely cause</div>
      <div class="confidence-pill ${confClass}">${confLabel}</div>
    </div>
    <div class="cause-text">${d.likely_cause}</div>
    ${tags ? `<div class="components">${tags}</div>` : ''}
  </div>`;

  // Remedies
  html += `<div class="remedies-section"><h2>Ranked remedies</h2>`;
  (d.remedies || []).forEach((r, i) => {
    const rankClass = ['rank-1','rank-2','rank-3'][i] || 'rank-3';
    html += `<div class="remedy-card ${rankClass}">
      <div class="remedy-top">
        <div class="rank-badge">${r.rank}</div>
        <div>
          <div class="remedy-action">${r.action}</div>
          <div class="remedy-why">${r.why}</div>
        </div>
      </div>
      <div class="remedy-meta">
        <div class="meta-item">
          ${diffDots(r.difficulty)}
          <span><strong>${r.difficulty_label}</strong></span>
        </div>
        <div class="meta-item">💷 <strong>${r.cost_gbp}</strong></div>
        <div class="meta-item">✓ <span class="verified-count">${r.verified_fixes}</span> verified fixes</div>
      </div>
      ${r.notes ? `<div class="remedy-notes">${r.notes}</div>` : ''}
    </div>`;
  });
  html += '</div>';

  // Mechanic's take
  if (d.mechanics_take) {
    html += `<div class="mechanics-card">
      <div class="mechanics-header">
        <div class="mechanics-icon">🔧</div>
        <div class="mechanics-label">Mechanic's take</div>
      </div>
      <div class="mechanics-text">${d.mechanics_take}</div>
    </div>`;
  }

  return html;
}

// Allow Ctrl+Enter to submit
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('q').addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) runQuery();
  });
});
</script>
</body>
</html>"""


@app.get("/", response_class=HTMLResponse)
async def index():
    return HTML


if __name__ == "__main__":
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("\n⚠  ANTHROPIC_API_KEY not set.")
        print("   Run: export ANTHROPIC_API_KEY=your_key_here\n")
        sys.exit(1)
    print(f"\n  CNRY DIP — running on http://localhost:{PORT}\n")
    uvicorn.run(app, host="0.0.0.0", port=PORT)
