# SEO Meta Tags + Venue/Event Filters — Design Spec

**Date:** 2026-03-15
**App:** Queer London (Expo Router, deployed to Vercel)
**Goal:** Maximise organic discovery for LGBTQ+ people searching for queer venues and events in London

---

## Context

The app is pre-deployment. Primary audience is LGBTQ+ people visiting or moving to London, arriving primarily via organic Google search. Two gaps must be closed before launch:

1. No SEO meta tags — pages are invisible to search engines
2. No filtering — users who land on Venues or Events can't narrow down by area or category

---

## Part 1: SEO Meta Tags

### Approach

Use `expo-router/head`'s `<Head>` component to inject per-page `<title>`, `<meta name="description">`, and Open Graph tags into the HTML `<head>`. This works on web builds and is ignored on native.

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

### Open Graph Tags (all pages)

Each page also gets:
- `og:title` — same as `<title>`
- `og:description` — same as `<meta description>`
- `og:image` — venue/sauna/event `imageUrl` on detail pages; app hero image on tab pages
- `og:type` — `website`

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

### Approach

Client-side only. `useState` per tab screen. No URL params, no backend. Filters the existing in-memory data arrays.

### Venues Tab

Two horizontally scrollable pill rows rendered above the venue list:

**Row 1 — Area**
`All · Soho · Vauxhall · East London · South London · West End`

**Row 2 — Category**
`All · Bar · Club · Pub · Sauna`

- Both filters apply simultaneously (AND logic)
- Selecting "All" on a row resets that filter
- Saunas remain in the same unified list (already mixed in)
- Active pill: `C.orange` background, dark text
- Inactive pill: `C.surface` background, `C.textMuted` text
- Font: `Inter_600SemiBold`, 11px, letter-spaced

### Events Tab

One horizontally scrollable pill row:

**Area**: `All · Soho · Vauxhall · East London · South London · West End`

Events don't need a category filter — date context is sufficient.

### State Shape

```ts
// venues.tsx
const [areaFilter, setAreaFilter] = useState<string>('All');
const [categoryFilter, setCategoryFilter] = useState<string>('All');

// events.tsx
const [areaFilter, setAreaFilter] = useState<string>('All');
```

### Filtering Logic

```ts
// venues.tsx — combined venues + saunas list
const allItems = [...venues, ...saunas];
const filtered = allItems.filter((item) => {
  const areaMatch = areaFilter === 'All' || item.area === areaFilter;
  const catMatch = categoryFilter === 'All' || item.category === categoryFilter;
  return areaMatch && catMatch;
});

// events.tsx
const filtered = events.filter((e) =>
  areaFilter === 'All' || e.area === areaFilter
);
```

### Files Changed

- `app/(tabs)/venues.tsx` — add filter state + pill rows + filtered list
- `app/(tabs)/events.tsx` — add filter state + pill row + filtered list

---

## Out of Scope

- Search bar / full-text search (post-launch)
- Claim form backend (post-launch)
- URL-based filter params (post-launch)
- Native app store submission (post-launch)

---

## Success Criteria

- Every venue, sauna, and event detail page has a unique `<title>` and `<meta description>` visible in page source
- Open Graph tags render correctly when a link is pasted into iMessage / Twitter / Slack
- Venue filter by area + category returns correct results with no false positives
- Event filter by area returns correct results
- Selecting "All" resets each filter row independently
- Empty state shown when no results match the active filters
