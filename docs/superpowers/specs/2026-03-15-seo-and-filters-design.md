# SEO Meta Tags + Venue/Event Filters — Design Spec

**Date:** 2026-03-15
**App:** Queer London (Expo Router v6 / Expo SDK 54, deployed to Vercel)
**Goal:** Maximise organic discovery for LGBTQ+ people searching for queer venues and events in London

---

## Context

The app is pre-deployment. Primary audience is LGBTQ+ people visiting or moving to London, arriving primarily via organic Google search. Two gaps must be closed before launch:

1. No SEO meta tags — pages are invisible to search engines
2. No filtering — users who land on Venues or Events can't narrow down by area or category

---

## Part 1: SEO Meta Tags

### Approach

Use `expo-router/head`'s `Head` default export to inject per-page `<title>`, `<meta name="description">`, and Open Graph tags into the HTML `<head>`. This works on web builds and is ignored on native.

**Correct import (default export, not named):**
```ts
import Head from 'expo-router/head';
```

`expo-router/head` is confirmed to exist in the installed package (`node_modules/expo-router/head.js` exports `Head` as a default export). This is the correct API for this version.

### Per-Page Tag Definitions

| Route | `<title>` | `<meta description>` |
|-------|-----------|----------------------|
| `/(tabs)/index` | `Queer London — LGBTQ+ Bars, Clubs & Events` | `Discover the best gay bars, clubs, saunas and events in London.` |
| `/(tabs)/venues` | `LGBTQ+ Venues in London \| Queer London` | `Bars, clubs, pubs and saunas for the queer community across London.` |
| `/(tabs)/events` | `LGBTQ+ Events in London \| Queer London` | `Gay club nights, drag shows, Pride events and more in London.` |
| `/(tabs)/map` | `LGBTQ+ London Map \| Queer London` | `Find gay bars, clubs and saunas near you on the Queer London map.` |
| `/venue/[id]` | `{venue.name} — {venue.category}, {venue.area} \| Queer London` | `{venue.description}` |
| `/sauna/[id]` | `{sauna.name} — Gay Sauna, {sauna.area} \| Queer London` | `{sauna.description}` |
| `/event/[id]` | `{event.title} at {event.venueName} — {event.date} \| Queer London` | `{event.description}` |

**Excluded routes:**
- `/(tabs)/claim` — visible tab but a form page with no SEO landing value. Deliberate decision: no `<Head>` block added. The page will inherit the app's default document title. This is acceptable because the claim page is not a search landing target.
- `/(tabs)/explore` — hidden tab (`href: null` in layout), never rendered to users

### Open Graph Tags (all pages)

Each page also gets:
- `og:title` — same as `<title>`
- `og:description` — same as `<meta description>`
- `og:image` — venue/sauna/event `imageUrl` on detail pages; Dalston Superstore `imageUrl` on tab pages (externally hosted WordPress CDN URL — accepted for now, revisit if URL breaks)
- `og:url` — constructed as `https://queerlondon.app` + route path (see below)
- `og:type` — `website`

**`og:url` construction:** There is no server-side `window.location` in Expo's static web export. Construct the URL by hard-coding the base domain and appending the known route:
- Tab pages: static string, e.g. `https://queerlondon.app/venues`
- Venue detail: `https://queerlondon.app/venue/${id}` using `id` from `useLocalSearchParams()`
- Sauna detail: `https://queerlondon.app/sauna/${id}` using `id` from `useLocalSearchParams()`
- Event detail: `https://queerlondon.app/event/${id}` using `id` from `useLocalSearchParams()`

The canonical domain is `https://queerlondon.app`. If the actual deployment domain differs, update all `og:url` values accordingly.

### Files Changed

- `app/(tabs)/index.tsx` — static Head block
- `app/(tabs)/venues.tsx` — static Head block
- `app/(tabs)/events.tsx` — static Head block
- `app/(tabs)/map.tsx` — static Head block
- `app/venue/[id].tsx` — dynamic Head block using venue data
- `app/sauna/[id].tsx` — dynamic Head block using sauna data
- `app/event/[id].tsx` — dynamic Head block using event data

---

## Part 2: Venue & Event Filters

### Data Fix Required Before Filter Implementation

Two events have mismatched `venueId` values that would produce incorrect area filter results:

- `mighty-hoopla`: `venueId: 'bethnal-green-wmc'` but venue is Brockwell Park (South London). Fix: set `venueId: ''`
- `pride-in-london`: `venueId: 'heaven'` but it is a city-wide route march, not a Heaven event. Fix: set `venueId: ''`

Events with `venueId: ''` are treated as city-wide and appear only under "All" in the area filter.

The `venueName` fields for these events are already correct in the data (`'Brockwell Park'` and `'Central London'`). Only `venueId` needs updating.

**File changed:** `data/events.ts` — update `venueId` for these two events.

### Venues Tab

The existing venues tab renders two named sections: **NIGHTLIFE** (venues) and **SAUNAS** (saunas). This two-section layout is preserved. Filters apply per-section:

- The **NIGHTLIFE section** filters by both area AND category (AND logic)
- The **SAUNAS section** filters by area only (`Sauna` has no `category` field)

When a category filter is active, the SAUNAS section remains visible (filtered by area only) — saunas are never hidden by category selection.

**Filter bar — two horizontally scrollable pill rows above the content:**

**Row 1 — Area:**
`All · Soho · Vauxhall · East London · North London · South London · West End`

**Row 2 — Category (applies to NIGHTLIFE section only):**
`All · Bar · Nightclub · Club · Pub`

Note: the full set of `Venue.category` values in the data is `'Bar' | 'Nightclub' | 'Club' | 'Pub'`. All four must appear as pills.

**Filter independence:** The area and category filters are independent. Switching area does NOT auto-reset the category filter (and vice versa). If the combination yields no results, the empty state is shown. Users must manually tap "All" to reset a filter row.

**State:**
```ts
const [areaFilter, setAreaFilter] = useState<string>('All');
const [categoryFilter, setCategoryFilter] = useState<string>('All');
```

**Filtering logic:**
```ts
// NIGHTLIFE section
const filteredVenues = venues.filter((v) => {
  const areaMatch = areaFilter === 'All' || v.area === areaFilter;
  const catMatch = categoryFilter === 'All' || v.category === categoryFilter;
  return areaMatch && catMatch;
});

// SAUNAS section — area only
const filteredSaunas = saunas.filter((s) =>
  areaFilter === 'All' || s.area === areaFilter
);
```

**Empty states:**
- If `filteredVenues.length === 0`: render `<Text>"No nightlife venues in this area"</Text>` **instead of** the venue card list, between the NIGHTLIFE heading and the SAUNAS section
- If `filteredSaunas.length === 0`: render `<Text>"No saunas in this area"</Text>` **instead of** the sauna card list, below the SAUNAS heading

### Events Tab

**Filter bar — one horizontally scrollable pill row:**

**Area:** `All · Soho · Vauxhall · East London · North London · South London · West End`

**Area resolution:** The `Event` type has no `area` field. Resolve area at filter time via `venueId` lookup:

```ts
import { venues } from '@/data/venues';

// Build lookup map once outside the component
const venueAreaMap = Object.fromEntries(venues.map((v) => [v.id, v.area]));

// Inside component, derived from state:
const filteredEvents = events.filter((e) => {
  if (areaFilter === 'All') return true;
  const area = venueAreaMap[e.venueId]; // undefined for venueId: ''
  return area === areaFilter;
});
```

Events with `venueId: ''` (city-wide festivals) return `undefined` from the map lookup, never equal any area filter value, and therefore only appear under "All".

**Empty state:** If `filteredEvents.length === 0`: render `<Text>"No events in this area"</Text>` **instead of** the event card list, centered in the scroll view.

**State:**
```ts
const [areaFilter, setAreaFilter] = useState<string>('All');
```

### Pill Styling (both tabs)

Each pill is a `<TouchableOpacity>` containing a `<Text>`. Styles:

- **Pill `<View>`/`<TouchableOpacity>` background:** `C.orange` when active, `C.surface` when inactive
- **Pill `<Text>` color:** `C.bg` (#0D0905, near-black) when active, `C.textMuted` when inactive
- Font: `Inter_600SemiBold`, `fontSize: 11`, `letterSpacing: 0.5`
- Pill padding: `paddingHorizontal: 12`, `paddingVertical: 6`, `borderRadius: 20`
- Row: `<ScrollView horizontal showsHorizontalScrollIndicator={false}>` with `gap: 8` between pills, `paddingHorizontal: 16`

### Head Rendering in Not-Found State

The existing detail pages have a `!venue` (or `!sauna`, `!event`) guard that renders an error view when the id param does not match any data record. The `<Head>` block must be placed **inside the main return path, after this guard** — not before it. This ensures Head only renders when data is available, and the not-found branch correctly has no Head block (inheriting the app default title).

### Files Changed

- `data/events.ts` — fix `venueId` for `mighty-hoopla` and `pride-in-london`
- `app/(tabs)/venues.tsx` — add filter state, pill rows, filtered venue/sauna lists, empty states
- `app/(tabs)/events.tsx` — add filter state, pill row, filtered event list, empty state

---

## Out of Scope

- Search bar / full-text search (post-launch)
- Claim form backend (post-launch)
- URL-based filter params (post-launch)
- Native app store submission (post-launch)

---

## Success Criteria

- Every venue, sauna, and event detail page has a unique `<title>` and `<meta description>` visible in rendered HTML `<head>` on the Vercel deployment
- Open Graph tags render correctly when a URL is pasted into iMessage, Twitter, or Slack (title, description, image preview all populate)
- `og:url` is present and matches the canonical page URL (base domain + route path) on all tagged routes
- Venue filter: selecting "Vauxhall" + "Bar" returns only Bar-category venues in Vauxhall; saunas in Vauxhall still appear in the SAUNAS section
- Venue filter: selecting "North London" shows Egg London (the only North London venue) in the NIGHTLIFE section
- Venue filter: `filteredVenues.length === 0` renders the text "No nightlife venues in this area" instead of the card list
- Event filter: selecting "Vauxhall" returns only events whose `venueId` resolves to a Vauxhall venue
- Event filter: `mighty-hoopla` and `pride-in-london` (both with `venueId: ''`) appear only under "All" and under no area pill
- Selecting "All" on any filter row resets that row and shows all items in that section
- Empty states display the exact specified text strings (not blank space)
