# NarroVue Monitors · Immigration Law & Public Health Compacts

Two live monitoring notebooks for tracking enforcement overreach (ICE, DOJ, courts, sanctuary policy) and interstate public‑health alliances (GPHA, WCHA, NEPHC, ASTHO).  
Each monitor: RSS/feed ingestion → structured trackers → network graphs → self‑contained HTML dashboard → weekly brief generator (Claude Sonnet) → copy‑ready Reddit/Bluesky posts.

---

## 📁 Repository structure

Both notebooks follow the same architecture – only the domain data (feeds, entities, trackers, overreach framework) changes.

---

## 🔍 What each monitor does

| Monitor | Tracks | Overreach / focus framework | Outputs |
|---------|--------|-----------------------------|---------|
| **ICE & Immigration Law** | ICE, CBP, EOIR, DOJ‑NS, ORR, sanctuary jurisdictions | 7 categories: `DUE_PROCESS`, `4TH_AMEND`, `1ST_AMEND`, `SEPARATION_OF_POWERS`, `TREATY_VIOLATION`, `STATUTORY`, `STATE_PREEMPTION` | Court rulings, enforcement incidents, policy actions, entity network graph, overreach heatmap, weekly brief |
| **Public Health Compacts** | GPHA, WCHA, NEPHC, ASTHO | Policy coordination, data sharing, emergency preparedness, workforce, federal‑state interaction | Meetings, research findings, policy actions, alliance‑state network graph, membership bar chart, weekly brief |

---

## 🚀 Quick start

### 1. Clone & install dependencies

```bash
git clone https://github.com/yourusername/narrovue-monitors.git
cd narrovue-monitors
pip install -r requirements.txt   # see below

feedparser beautifulsoup4 lxml requests urllib3 pandas networkx matplotlib
jupyter notebook

neo4j

jupyter notebook ice_immigration_monitor_v1.3.ipynb
# or
jupyter notebook public_health_compacts_monitor_v3_2.ipynb

# Set your Anthropic API key
export ANTHROPIC_API_KEY="sk-ant-..."
# or create a .env file with ANTHROPIC_API_KEY=sk-ant-...

node proxy.js

feedparser>=6.0.10
beautifulsoup4>=4.12.0
lxml>=4.9.0
requests>=2.31.0
urllib3>=2.0.0
pandas>=2.0.0
networkx>=3.0
matplotlib>=3.7.0
jupyter>=1.0.0
neo4j>=5.14.0   # optional – only for immigration monitor graph DB

