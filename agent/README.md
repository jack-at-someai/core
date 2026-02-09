# Agent — SomeAI Lab Guide

Conversational AI that knows the entire SomeAI research lab. Ask about Charlotte, the team, papers, competitive landscape, validation domains, or any of the 37 projects.

## Run

```bash
cd agent
python server.py
```

Open http://localhost:3456

## Claude API (optional)

Set `ANTHROPIC_API_KEY` for full conversational responses via Claude Haiku 4.5:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
python server.py
```

Without the key, the agent falls back to keyword-based search across its knowledge sections.

## Architecture

Zero dependencies. Python stdlib HTTP server + static HTML/CSS/JS. Same pattern as constellation.

```
agent/
├── server.py          # HTTP server + /api/chat proxy
├── public/
│   ├── index.html     # Chat UI
│   ├── style.css      # Dark theme styles
│   └── app.js         # Chat logic
└── README.md
```
