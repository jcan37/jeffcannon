# D&D Campaign Content Format

This directory contains D&D campaign content structured for the jeffcannon.dev/dnd campaign hub.

## Directory Structure

Each campaign lives in its own directory under `content/dnd/<campaign-slug>/`:

```
content/dnd/
├── README.md (this file)
├── slut-dragons/
│   ├── campaign.json
│   ├── glossary.yml
│   ├── 2026-08-30.md
│   ├── 2026-08-30.log.md
│   ├── 2026-09-06.md
│   ├── 2026-09-06.log.md
│   └── ...
└── riccardos-avernus/
    ├── campaign.json
    ├── glossary.yml
    ├── 2026-09-01.md
    ├── 2026-09-01.log.md
    └── ...
```

## Campaign Metadata (`campaign.json`)

Each campaign directory must contain a `campaign.json` file and optionally a `glossary.yml` file.

### campaign.json

Metadata about the campaign:

```json
{
  "name": "Campaign Display Name",
  "role": "DM" | "Player",
  "character": "Character Name (optional, for player campaigns)",
  "system": "D&D 5e",
  "module": "Module/Adventure Name",
  "blurb": "Short description of the campaign",
  "plaudPrefix": "Prefix used in Plaud note titles for this campaign",
  "dm": "DM Name (for player campaigns)",
  "status": "active" | "idle" | "future" | "past",
  "theme": "avernus" | "icespire",
  "coverPosition": "55% 45% (optional CSS object-position for cover.jpg)"
}
```

- `status` shows on the campaign card as Cooking, On the back burner, Being prepped or Served.
- `theme` picks the card gradient defined in `src/components/dnd/themes.js`. A new campaign needs a new theme there.
- Put the module's art next to `campaign.json` as `cover.jpg` (about 1200px wide). `coverPosition` keeps its focal point in the card banner.

### glossary.yml

A glossary of canonical names for PCs, NPCs, places, and items, with aliases to handle speech-to-text mishearings:

```yaml
pcs:
  - name: Character Name
    player: Player Name
    description: Brief description
    aliases:
      - Common mishearing 1
      - Common mishearing 2
    notes: Optional additional context

npcs:
  - name: NPC Name
    description: Brief description
    aliases:
      - Alias 1
      - Alias 2

places:
  - name: Place Name
    description: Brief description
    aliases:
      - Alias 1

items:
  - name: Item Name
    description: Brief description
    aliases:
      - Alias 1
```

The glossary is used by the AI assistant to:
- Resolve questions using aliases to canonical names
- Ensure answers use canonical spellings
- Provide context about characters, places, and items

## Session Notes (`YYYY-MM-DD.md`)

Each session is recorded in a markdown file named by session date (`YYYY-MM-DD.md`):

Each session is recorded in a markdown file named by session date (`YYYY-MM-DD.md`):

```markdown
---
date: "2024-03-15"
title: "Session Title"
---

## Recap

The main events and story beats of the session.

## Loot

- Item 1
- Item 2

## Open Threads

- Thread 1
- Thread 2

## DM Only

[This section is only visible to users with DM access]

Secret information, plot hooks, etc.
```

### Frontmatter Fields

- `date` (required): ISO date string matching the filename
- `title` (required): Session title/summary

### Content Sections

- **Recap**: Main session summary (required)
- **Loot**: Items acquired (optional)
- **Open Threads**: Unresolved plot threads, questions, next steps (optional)
- **DM Only**: Content only visible to authenticated users with DM role (optional)

## Campaign Summary (`summary.md`)

A running "story so far" that the ask-box sends with **every** question, so it can answer about the whole campaign without loading every log. Keep it short (under about 1,000 words) and update it each time a session is added:

- **Where things stand** at the end of the latest session
- **The party**: each PC, their player and anything that changed (levels, losses, choices)
- **Key people**: NPCs that matter now
- **Sessions**: one or two lines per session, with its date
- **Open threads**: what's unresolved now (drop threads once they're resolved)

Write it from the **player-facing recaps only**. It is never filtered, so nothing from a `## DM Only` section may go in it. Set `updated` and `through` (the date of the latest session it covers) in the frontmatter:

```markdown
---
updated: "2026-10-13"
through: "2026-10-13"
---

# Campaign Name: the story so far
```

How the ask-box builds its context: the glossary and `summary.md` always; every session recap (up to 12, newest first); and the full logs of the 2 sessions that best match the question. Questions like "what happened last session?" use the newest logs.

## Session Logs (`YYYY-MM-DD.log.md`)

Detailed session logs provide extended context for the AI assistant. These files:
- Are **NEVER rendered on any page or served to the browser**
- Are used as retrieval sources by the ask-box function: the logs of the 2 best-matching sessions are sent with each question
- Must have the same date as their corresponding session file
- May contain `(uncertain)` markers for unclear information

### Format

```markdown
# Campaign Name — Session Log, YYYY-MM-DD

**Campaign:** Campaign details
**Party:** Player and character list
**Source:** Recording info, transcription notes

---

## Recap
Brief summary of where the session started

---

## Scene 1: Title
Detailed scene-by-scene breakdown with:
- Actions and dice rolls
- Dialogue and table banter
- Rulings and mechanics
- NPC interactions

---

## Loot and resources
Table format showing who has what

## NPCs
List of NPCs encountered

## Rulings summary
Mechanical rulings from this session

## Notable quotes
Memorable in-character and out-of-character moments

## Open threads
Unresolved plot points

---

## DM only
Secret information, prep notes, hidden hooks
(This section is excluded from player-facing retrieval)
```

### Important Notes

- Lines marked `(uncertain)` indicate unclear information; the AI will hedge appropriately
- The `## DM only` section (case-insensitive) is automatically excluded from player campaign retrieval
- Logs enhance the ask-box by providing detailed context not in the recap
- Multiple sessions may share the same log if they were part of one recording session

### DM-Only Content Policy

**DM-only sections contain ONLY Jeff's private prep and planning that was never spoken at the table:**
- Next-session prep lists
- Questions to ask the other DM
- Hidden stat blocks or tactics not revealed yet
- Private notes about story hooks not yet introduced

**Everything derived from the session recording is player-visible:**
- Out-of-character table talk and banter
- Post-session commentary from Jeff or the other DM
- Rulings and mechanics explanations spoken at the table
- Level-up announcements and evil-point tracking
- Hints and information the DM said aloud (even if cryptic)
- "The guard looks like Brendan" and other Easter-egg reveals

If it was on the tape (or Zoom recording), it goes in the main body, not DM-only.

## Session Notes (`YYYY-MM-DD.md`)

Each session also has a player-facing markdown file with frontmatter and summary content:

```markdown
---
date: "2024-03-15"
title: "Session Title"
---

## Recap

The main events and story beats of the session.

## Loot

- Item 1
- Item 2

## Open Threads

- Thread 1
- Thread 2

## DM Only

[This section is only visible to users with DM access]

Secret information, plot hooks, etc.
```

### Frontmatter Fields

To add a new campaign:

1. Create a new directory: `content/dnd/<campaign-slug>/`
2. Add `campaign.json` with campaign metadata
3. Add `glossary.yml` with canonical names (optional but recommended)
4. Add session markdown files as they happen

The campaign will automatically appear on the /dnd index after the next build.

## Password Protection

Campaign content is password-protected via Netlify Functions. Passwords are set via environment variables:

- `DND_PASSWORD_<CAMPAIGN_SLUG_UPPERCASE>` (e.g., `DND_PASSWORD_SLUT_DRAGONS`)
- `DND_SESSION_SECRET` (for signing authentication cookies)

## Automated Session Writing

This format is designed for automated writers to add session content:

1. Determine the campaign from the Plaud prefix
2. Create a new `YYYY-MM-DD.md` file with today's date
3. Add frontmatter with `date` and `title`
4. Add sections: Recap, Loot, Open Threads
5. Optionally include a "DM Only" section for sensitive content

Example automation pseudocode:

```javascript
const campaign = getCampaignByPlaudPrefix(plaudTitle)
const sessionDate = new Date().toISOString().split('T')[0]
const sessionFile = `content/dnd/${campaign.slug}/${sessionDate}.md`

writeSessionFile(sessionFile, {
  frontmatter: {
    date: sessionDate,
    title: deriveTitle(content)
  },
  sections: {
    recap: content.recap,
    loot: content.loot,
    openThreads: content.threads
  }
})
```
