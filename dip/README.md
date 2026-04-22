# CNRY Diagnostic Intelligence Platform — Team Preview

A working proof of concept. Type a symptom or sensor reading, get ranked remedies from community knowledge.

## Run locally (2 minutes)

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...
python3 app.py
```
Open http://localhost:8000

## Deploy to Railway (5 minutes, free tier)

1. Push this folder to a GitHub repo
2. Go to railway.app → New Project → Deploy from GitHub
3. Add environment variable: `ANTHROPIC_API_KEY = sk-ant-...`
4. Deploy — Railway auto-detects the Procfile

## What's in the box

- `app.py` — FastAPI backend + embedded HTML/CSS/JS frontend
- `knowledge_base.json` — 50 synthetic symptom-remedy entries covering common inboard diesel/petrol problems
- `query.py` — original CLI version for terminal testing

## Current state

- **Synthetic data only** — 50 hand-crafted entries, not yet scraped from real forums
- **Proof of concept** — validates the query → ranked remedy loop before building infrastructure
- **Next step** — ingest real forum data (The Hull Truth, YBW, iBoats), add pgvector for semantic search

## Notes for team

The sensor-query use case (e.g. "260Hz vibration building over 3 trips") returns the most specific results — that's the cnrysense integration at work. Vague queries return broader answers with a prompt for more detail.
