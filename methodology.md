# Methodology: NarroVue Interstate Compacts Research Pipeline

This document describes the data collection, processing, and output architecture used across NarroVue's two operational monitors — the **Public Health Compacts Monitor** and the **ICE & Immigration Law Monitor** — both built as Jupyter Notebook pipelines and exported as self-contained interactive HTML dashboards.

---

## Overview

Both monitors share a common architecture: a structured reference layer seeded with hand-curated domain data, an automated RSS ingestion layer that aggregates and filters live feeds, and an export layer that renders analysis-ready outputs. The monitors are designed to run incrementally — analysts update tracker DataFrames with curated entries each cycle, while the feed layer refreshes automatically.

---

## 1. Reference Data Layer

Each monitor begins with a static structured dataset defining the core entities or compacts under observation. This reference layer is encoded directly in the notebook as a list of Python dicts and loaded into a pandas DataFrame.

**Public Health Compacts Monitor** tracks four interstate alliances:
- Governors Public Health Alliance (GPHA)
- West Coast Health Alliance (WCHA)
- Northeast Public Health Collaborative (NEPHC)
- Association of State and Territorial Health Officials (ASTHO)

Fields include member states, founding context, primary goals, cross-collaboration networks, governance notes, and official websites.

**ICE & Immigration Law Monitor** tracks six enforcement entity categories:
- ICE, CBP, EOIR, ORR, DOJ National Security, and Sanctuary Jurisdictions

Fields include parent agency, primary role, documented overreach flags, key legal constraints (statutory and constitutional), and active litigation dockets.

This reference layer is the analytical backbone of each monitor. It defines what is being watched and why, and it anchors downstream filtering and network construction.

---

## 2. RSS Feed Ingestion

### Feed Inventory

Each monitor pulls from a curated set of RSS/Atom feeds across multiple source categories. Feed lists are maintained as structured dicts with `url`, `label`, and `category` fields.

**Public Health Compacts Monitor** draws from approximately 80 feeds across:
- Federal health agencies (CDC, NIH, FDA, CMS, HHS, ASPR, SAMHSA, HRSA)
- Public health law and governance (NCSL, KFF, Network for Public Health Law, Health Affairs)
- Interstate governance bodies (NGA, ASTHO, NACCHO, Council of State Governments)
- Epidemiology and outbreak intelligence (ProMED, HealthMap, CIDRAP, WHO, ECDC)
- Pandemic preparedness and biosecurity (Johns Hopkins Center for Health Security, NTI, CEPI)
- Reproductive health and abortion policy (Guttmacher, Center for Reproductive Rights, Rewire News)
- Environmental and climate-health governance (EPA, NOAA, Yale Climate Connections, NRDC)
- Healthcare system and insurance policy (Modern Healthcare, KFF Health News, AJMC)
- Peer-reviewed journals (JAMA, NEJM, The Lancet, AJPH, BMJ, Nature)
- State health departments (CA, CO, NJ, NY, WA, MA, OR)
- Investigative media (ProPublica, NYT Health, Guardian Health, Reuters Healthcare)

**ICE & Immigration Law Monitor** draws from approximately 43 feeds across:
- Federal agencies (ICE, CBP, DOJ, DHS, Federal Register)
- Legal watchdogs (ACLU, CLINIC, NILC, Human Rights First, Brennan Center, Lawfare)
- Courts (SCOTUSblog, 9th Circuit, 2nd Circuit)
- Policy research (Migration Policy Institute, Cato, Vera Institute, TRAC, CAP)
- Investigative journalism (ProPublica, NYT, Guardian, AP, The Intercept, Texas Tribune, Documented NY)
- Detention monitoring (Detention Watch Network, National Immigrant Justice Center, PHR)
- State attorneys general (NY, CA, NJ) and NGA/NCSL

### Fetch Architecture

Feed fetching is handled by a resilient HTTP session built on `requests` with the following properties:

- **Retry logic**: 3 retries with exponential backoff on 429, 500, 502, 503, 504 status codes
- **SSL tolerance**: certificate verification disabled where necessary for government and nonprofit feeds with known SSL irregularities
- **User-agent spoofing**: browser-mimicking headers to avoid bot-blocking on legitimate news sources
- **Malformed XML recovery**: `lxml`'s `XMLParser(recover=True)` parses and re-serializes broken XML before handing off to `feedparser`
- **HTML fallback and feed autodiscovery**: if a feed URL returns HTML rather than XML, the fetcher scans `<link>` tags with RSS/Atom types and attempts to discover the actual feed endpoint
- **Per-feed item cap**: `MAX_ENTRIES_PER_FEED = 15` limits ingest volume while ensuring broad source coverage

### Relevance Filtering

Each notebook defines a domain keyword list. Before a feed entry is written to the output DataFrame, its title and summary text are checked against this list using case-insensitive substring matching. Only entries containing at least one matching keyword are retained.

The Immigration Monitor uses a 42-term keyword set spanning enforcement terminology, legal proceedings, constitutional provisions, agency names, and policy instruments (e.g., `"habeas"`, `"Alien Enemies Act"`, `"non-refoulement"`, `"APA"`, `"sanctuary"`).

The Public Health Monitor uses a 16-term keyword set focused on epidemiological and governance vocabulary (e.g., `"surveillance"`, `"compact"`, `"preparedness"`, `"GPHA"`, `"NEPHC"`).

### Date Parsing

Feed entries use RFC 2822 (`email.utils.parsedate_to_datetime`) as the primary parsing method, with fallback to four additional `strptime` format strings covering ISO 8601 variants and common non-standard timestamps. Entries with unparseable dates are retained but sorted to the bottom of the output DataFrame.

### Deduplication and Sorting

After all feeds are fetched, the combined entry list is deduplicated on `link` (keeping the first occurrence) and sorted by `published` descending, so the most recent items surface first.

---

## 3. Manual Tracker DataFrames

Automated feed ingestion surfaces signal; manual trackers provide verified ground truth. Each monitor includes empty or partially seeded pandas DataFrames for hand-curated entries that analysts update on a recurring basis.

**Public Health Monitor** tracker categories:
- `meetings_df` — compact and alliance meeting records
- `research_df` — peer-reviewed findings and policy research relevant to monitored compacts
- `policy_df` — state and federal policy actions affecting monitored alliances

**Immigration Monitor** tracker categories:
- `court_df` — individual case records with date, court, subject, ruling, overreach tags, outcome, and source URL
- `incidents_df` — enforcement incidents with location, entities involved, overreach categories, and documentation links
- `policy_df` — administrative and executive policy actions

### Overreach Taxonomy (Immigration Monitor)

Court and incident records in the Immigration Monitor are tagged with one or more overreach categories from a controlled vocabulary:

| Tag | Definition |
|---|---|
| `DUE_PROCESS` | Denial of hearing, counsel, or notice |
| `4TH_AMEND` | Warrantless searches, unlawful seizure |
| `1ST_AMEND` | Retaliation for speech, press suppression |
| `SEPARATION_OF_POWERS` | Court order defiance, unilateral executive action |
| `TREATY_VIOLATION` | Convention Against Torture, non-refoulement |
| `STATUTORY` | Violations of INA, APA, or 14th Amendment |
| `STATE_PREEMPTION` | Unlawful federal pressure on state/local governments |

This taxonomy enables cross-case pattern analysis and overreach frequency visualization.

---

## 4. Network Graph Construction

Both monitors use `networkx` to build bipartite relationship graphs rendered with `matplotlib` in headless (`Agg`) mode.

**Public Health Monitor**: nodes represent alliances and member states; edges encode membership relationships, colored by alliance.

**Immigration Monitor**: nodes represent enforcement entities and overreach categories; edges encode documented relationships derived from the entity reference data, weighted or colored by connection type.

Graphs are rendered to `.png` at 200 DPI for dashboard embedding and standalone archival use.

---

## 5. Overreach Heatmap (Immigration Monitor)

A bar chart visualization aggregates overreach tag frequency across all curated court and incident records. Tags are ranked by occurrence count and rendered using matplotlib's horizontal bar format. This provides an at-a-glance view of which constitutional and statutory categories are most actively contested in the current enforcement environment.

---

## 6. HTML Dashboard Export

The final pipeline cell renders a self-contained HTML dashboard using Python's `string.Template` or equivalent f-string templating. The output file embeds:

- All DataFrames as styled HTML tables
- Network graph and heatmap as base64-encoded inline images
- A generation timestamp and run metadata

The resulting file (`ice_immigration_dashboard.html`, `public_health_dashboard.html`) has zero external dependencies and can be opened in any browser, shared by email, or hosted as a static file — no server required.

---

## 7. Weekly Brief Integration (Immigration Monitor)

The Immigration Monitor includes an additional export step: `weekly_brief_input.txt`, a plain-text structured summary written to disk for use as input to NarroVue's Weekly Brief Generator. This file contains a formatted digest of recent court rulings, enforcement incidents, and policy actions suitable for LLM-assisted narrative generation.

---

## 8. Technical Stack

| Library | Role |
|---|---|
| `pandas` | Structured data handling, DataFrame construction and display |
| `feedparser` | RSS/Atom parsing |
| `requests` | HTTP session management with retry/backoff |
| `urllib3` | SSL control and connection pooling |
| `lxml` | Malformed XML recovery |
| `beautifulsoup4` | HTML parsing for feed autodiscovery |
| `networkx` | Graph construction |
| `matplotlib` | Graph and chart rendering (headless Agg backend) |

All dependencies are installable via `pip` and are explicitly listed in each notebook's first cell.

---

## 9. Versioning

Notebooks are versioned using a suffix convention (`v1`, `v1.1`, `v1.3` for the Immigration Monitor; `v3`, `v3.1`, `v3_2` for the Public Health Monitor). Version increments reflect architectural changes — resilient fetching, malformed XML handling, HTML fallback, overreach taxonomy additions — rather than data updates.

---

## Limitations

- Feed availability is not guaranteed. Government and nonprofit RSS endpoints occasionally go offline, change URL structure, or return malformed XML. The resilient fetch architecture mitigates but does not eliminate data gaps.
- Keyword filtering is a precision-recall tradeoff. The current keyword sets are tuned for broad recall; high-volume feeds may surface tangentially relevant items requiring analyst triage.
- Manual tracker DataFrames require ongoing human input. The automated layer surfaces candidate items; analyst judgment determines what enters the curated record.
- Network graphs reflect the reference data layer as defined at notebook authorship time. Structural changes to compact membership or enforcement entity jurisdiction require manual updates to the reference dicts.
