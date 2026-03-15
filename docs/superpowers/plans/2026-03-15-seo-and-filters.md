# SEO Meta Tags + Venue/Event Filters Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-page SEO meta tags to all public routes and area/category filter pills to the Venues and Events tabs before Vercel deployment.

**Architecture:** `expo-router/head`'s `Head` default export injects `<title>`, `<meta>`, and Open Graph tags into the HTML `<head>` on web (ignored on native). Filters are pure client-side `useState` — no backend, no URL params. The Venues tab preserves its existing two-section layout (NIGHTLIFE / SAUNAS) and applies filters per-section.

**Tech Stack:** Expo Router v6, React Native Web, TypeScript. No test framework — verification is done via `npm run build:web` + inspecting generated HTML and browser testing.

**Spec:** `docs/superpowers/specs/2026-03-15-seo-and-filters-design.md`

---

## File Map

| File | Change |
|------|--------|
| `data/events.ts` | Fix `venueId: ''` for `mighty-hoopla` and `pride-in-london` |
| `app/(tabs)/index.tsx` | Add static `<Head>` block |
| `app/(tabs)/venues.tsx` | Add static `<Head>` block + filter state + pill rows + filtered lists + empty states |
| `app/(tabs)/events.tsx` | Add static `<Head>` block + filter state + pill row + filtered list + empty state |
| `app/(tabs)/map.tsx` | Add static `<Head>` block |
| `app/venue/[id].tsx` | Add dynamic `<Head>` block (after `!venue` guard) |
| `app/sauna/[id].tsx` | Add dynamic `<Head>` block (after `!sauna` guard) |
| `app/event/[id].tsx` | Add dynamic `<Head>` block (after `!event` guard) |

---

## Chunk 1: Data Fix + Static SEO (Tab Pages)

### Task 1: Fix event venueIds

**Files:**
- Modify: `data/events.ts`

Context: Two events have incorrect `venueId` values that would cause them to appear under wrong area filters. Setting `venueId: ''` is the intended sentinel for "city-wide event with no fixed venue". The empty string is safe at runtime — `app/event/[id].tsx` already resolves `venue` via `venues.find(v => v.id === event.venueId)`, which will return `undefined` for `''`, and the screen already handles `undefined` venue gracefully (the "View Venue" link simply does not render).

- [ ] **Step 1: Fix mighty-hoopla venueId**

In `data/events.ts`, find the `mighty-hoopla` event object and change:
```ts
venueId: 'bethnal-green-wmc',
```
to:
```ts
venueId: '',
```

- [ ] **Step 2: Fix pride-in-london venueId**

In `data/events.ts`, find the `pride-in-london` event object and change:
```ts
venueId: 'heaven',
```
to:
```ts
venueId: '',
```

- [ ] **Step 3: Verify TypeScript accepts empty string**

Run:
```bash
npx tsc --noEmit
```
Expected: no errors (empty string satisfies `string` type).

- [ ] **Step 4: Commit**

```bash
git add data/events.ts
git commit -m "fix: set venueId to empty string for city-wide festival events"
```

---

### Task 2: Add Head to Home screen

**Files:**
- Modify: `app/(tabs)/index.tsx`

Context: `expo-router/head` exports `Head` as a default export. `<Head>` wraps standard HTML `<meta>` and `<title>` tags. It is a no-op on native. Place the `<Head>` block as the first child inside the root `<View>` in the component's return statement.

- [ ] **Step 1: Add import**

At the top of `app/(tabs)/index.tsx`, add:
```ts
import Head from 'expo-router/head';
```

- [ ] **Step 2: Add Head block**

Inside the return statement, as the **first child of the root `<View>`, placed as a sibling immediately before the `<ScrollView>`** (not inside the ScrollView):

```tsx
<Head>
  <title>Queer London — LGBTQ+ Bars, Clubs & Events</title>
  <meta name="description" content="Discover the best gay bars, clubs, saunas and events in London." />
  <meta property="og:title" content="Queer London — LGBTQ+ Bars, Clubs & Events" />
  <meta property="og:description" content="Discover the best gay bars, clubs, saunas and events in London." />
  <meta property="og:image" content="https://dalstonsuperstore.com/wp-content/uploads/2022/02/6ec149c3-7a3c-49b4-8e36-8e01fda6ec2b.jpeg" />
  <meta property="og:url" content="https://queerlondon.app" />
  <meta property="og:type" content="website" />
</Head>
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/(tabs)/index.tsx
git commit -m "feat: add SEO meta tags to home screen"
```

---

### Task 3: Add Head to Map screen

**Files:**
- Modify: `app/(tabs)/map.tsx`

- [ ] **Step 1: Add import and Head block**

Add `import Head from 'expo-router/head';` at top of file.

Inside the return, as the first child of the root `<View>`:
```tsx
<Head>
  <title>LGBTQ+ London Map | Queer London</title>
  <meta name="description" content="Find gay bars, clubs and saunas near you on the Queer London map." />
  <meta property="og:title" content="LGBTQ+ London Map | Queer London" />
  <meta property="og:description" content="Find gay bars, clubs and saunas near you on the Queer London map." />
  <meta property="og:image" content="https://dalstonsuperstore.com/wp-content/uploads/2022/02/6ec149c3-7a3c-49b4-8e36-8e01fda6ec2b.jpeg" />
  <meta property="og:url" content="https://queerlondon.app/map" />
  <meta property="og:type" content="website" />
</Head>
```

- [ ] **Step 2: Compile check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/(tabs)/map.tsx
git commit -m "feat: add SEO meta tags to map screen"
```

---

### Task 4: Add Head to Venues screen

**Files:**
- Modify: `app/(tabs)/venues.tsx`

Note: This file will also get filters in Chunk 2. Add only the Head block here.

- [ ] **Step 1: Add import and Head block**

Add `import Head from 'expo-router/head';` at top of file.

Inside the return, as the first child of the root `<View>` (before the `<ScrollView>`):
```tsx
<Head>
  <title>LGBTQ+ Venues in London | Queer London</title>
  <meta name="description" content="Bars, clubs, pubs and saunas for the queer community across London." />
  <meta property="og:title" content="LGBTQ+ Venues in London | Queer London" />
  <meta property="og:description" content="Bars, clubs, pubs and saunas for the queer community across London." />
  <meta property="og:image" content="https://dalstonsuperstore.com/wp-content/uploads/2022/02/6ec149c3-7a3c-49b4-8e36-8e01fda6ec2b.jpeg" />
  <meta property="og:url" content="https://queerlondon.app/venues" />
  <meta property="og:type" content="website" />
</Head>
```

- [ ] **Step 2: Compile check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/(tabs)/venues.tsx
git commit -m "feat: add SEO meta tags to venues screen"
```

---

### Task 5: Add Head to Events screen

**Files:**
- Modify: `app/(tabs)/events.tsx`

Note: This file will also get filters in Chunk 3. Add only the Head block here.

- [ ] **Step 1: Add import and Head block**

Add `import Head from 'expo-router/head';` at top of file.

Inside the return, as the first child of the root `<View>` (before the `<ScrollView>`):
```tsx
<Head>
  <title>LGBTQ+ Events in London | Queer London</title>
  <meta name="description" content="Gay club nights, drag shows, Pride events and more in London." />
  <meta property="og:title" content="LGBTQ+ Events in London | Queer London" />
  <meta property="og:description" content="Gay club nights, drag shows, Pride events and more in London." />
  <meta property="og:image" content="https://dalstonsuperstore.com/wp-content/uploads/2022/02/6ec149c3-7a3c-49b4-8e36-8e01fda6ec2b.jpeg" />
  <meta property="og:url" content="https://queerlondon.app/events" />
  <meta property="og:type" content="website" />
</Head>
```

- [ ] **Step 2: Compile check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/(tabs)/events.tsx
git commit -m "feat: add SEO meta tags to events screen"
```

---

### Task 6: Verify Chunk 1 in browser

- [ ] **Step 1: Run web build**

```bash
npm run build:web
```
Expected: exits with code 0, `dist/` directory produced, no TypeScript or build errors.

- [ ] **Step 2: Serve and check meta tags via DevTools**

```bash
npx serve dist -p 3001
```

Open `http://localhost:3001` in Chrome/Firefox.

**Important:** `expo export --platform web` generates a shell `index.html` with client-side routing — "View Source" will NOT show the dynamic `<title>` set by `<Head>`. Instead, use **browser DevTools**:

1. Open DevTools → Elements tab
2. Expand the `<head>` element in the DOM tree
3. Confirm `<title>Queer London — LGBTQ+ Bars, Clubs & Events</title>` is present
4. Confirm `<meta name="description" ...>` and all `og:*` meta tags are present

- [ ] **Step 3: Commit if build passes cleanly**

No code changes needed. Move on if verified.

---

## Chunk 2: Dynamic SEO (Detail Pages)

### Task 7: Add Head to venue detail page

**Files:**
- Modify: `app/venue/[id].tsx`

Context: The existing file structure is:
```tsx
const venue = venues.find((v) => v.id === id);
if (!venue) { return <View>...</View>; }  // not-found branch
return (
  <View style={styles.container}>         // root View
    <ScrollView ...>                       // only child
      ...
    </ScrollView>
  </View>
);
```
Place `<Head>` **as a sibling immediately before `<ScrollView>`, inside the root `<View>`, in the main return only** (not the not-found branch). This ensures Head only renders when venue data is available.

- [ ] **Step 1: Add import**

```ts
import Head from 'expo-router/head';
```

- [ ] **Step 2: Add Head block inside main return**

As the first child of the root `<View>`, immediately before `<ScrollView>`:
```tsx
<Head>
  <title>{venue.name} — {venue.category}, {venue.area} | Queer London</title>
  <meta name="description" content={venue.description} />
  <meta property="og:title" content={`${venue.name} — ${venue.category}, ${venue.area} | Queer London`} />
  <meta property="og:description" content={venue.description} />
  <meta property="og:image" content={venue.imageUrl} />
  <meta property="og:url" content={`https://queerlondon.app/venue/${id}`} />
  <meta property="og:type" content="website" />
</Head>
```

- [ ] **Step 3: Compile check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add app/venue/[id].tsx
git commit -m "feat: add dynamic SEO meta tags to venue detail page"
```

---

### Task 8: Add Head to sauna detail page

**Files:**
- Modify: `app/sauna/[id].tsx`

Same structure as venue detail. Add after the `!sauna` guard, as a sibling immediately before `<ScrollView>` in the root `<View>`. Note: `Sauna` has no `category` field — use the hardcoded string `"Gay Sauna"` in the title.

- [ ] **Step 1: Add import and Head block**

```ts
import Head from 'expo-router/head';
```

Inside main return, as first child of root `<View>`, immediately before `<ScrollView>`:
```tsx
<Head>
  <title>{sauna.name} — Gay Sauna, {sauna.area} | Queer London</title>
  <meta name="description" content={sauna.description} />
  <meta property="og:title" content={`${sauna.name} — Gay Sauna, ${sauna.area} | Queer London`} />
  <meta property="og:description" content={sauna.description} />
  <meta property="og:image" content={sauna.imageUrl} />
  <meta property="og:url" content={`https://queerlondon.app/sauna/${id}`} />
  <meta property="og:type" content="website" />
</Head>
```

- [ ] **Step 2: Compile check + commit**

```bash
npx tsc --noEmit
git add app/sauna/[id].tsx
git commit -m "feat: add dynamic SEO meta tags to sauna detail page"
```

---

### Task 9: Add Head to event detail page

**Files:**
- Modify: `app/event/[id].tsx`

Same structure. Add after the `!event` guard, as a sibling immediately before `<ScrollView>` in the root `<View>`. Note: `Event` has no `area` field — use `event.venueName` and `event.date` in the title (matching the spec).

- [ ] **Step 1: Add import and Head block**

```ts
import Head from 'expo-router/head';
```

Inside main return, as first child of root `<View>`, immediately before `<ScrollView>`:
```tsx
<Head>
  <title>{event.title} at {event.venueName} — {event.date} | Queer London</title>
  <meta name="description" content={event.description} />
  <meta property="og:title" content={`${event.title} at ${event.venueName} — ${event.date} | Queer London`} />
  <meta property="og:description" content={event.description} />
  <meta property="og:image" content={event.imageUrl} />
  <meta property="og:url" content={`https://queerlondon.app/event/${id}`} />
  <meta property="og:type" content="website" />
</Head>
```

- [ ] **Step 2: Compile check + commit**

```bash
npx tsc --noEmit
git add app/event/[id].tsx
git commit -m "feat: add dynamic SEO meta tags to event detail page"
```

---

### Task 10: Verify Chunk 2 in browser

- [ ] **Step 1: Build and serve**

```bash
npm run build:web && npx serve dist -p 3001
```

- [ ] **Step 2: Check a venue detail page via DevTools**

Open `http://localhost:3001/venue/eagle-london` in browser.

**Use DevTools → Elements → `<head>`** (not View Source — the title is set dynamically at runtime by `<Head>`).

Confirm in the live DOM:
```html
<title>Eagle London — Bar, Vauxhall | Queer London</title>
<meta name="description" content="...">
<meta property="og:title" content="Eagle London — Bar, Vauxhall | Queer London">
<meta property="og:image" content="https://...">
<meta property="og:url" content="https://queerlondon.app/venue/eagle-london">
```

- [ ] **Step 3: Check a sauna and event page the same way**

Open `http://localhost:3001/sauna/sweatbox-soho` and `http://localhost:3001/event/duckie-rvt`.
Use DevTools → Elements → `<head>` to confirm unique `<title>` and `og:*` tags in each.

---

## Chunk 3: Venue Filters

### Task 11: Add filter state and pill component to Venues screen

**Files:**
- Modify: `app/(tabs)/venues.tsx`

Context: The current screen renders two sections in a `<ScrollView>`: NIGHTLIFE (all `venues`) and SAUNAS (all `saunas`). We add two horizontally scrollable pill rows above the content, then filter each section independently.

- [ ] **Step 1: Add useState import**

`venues.tsx` does not currently import `useState`. Add this as a new import at the top of the file:
```ts
import { useState } from 'react';
```

- [ ] **Step 2: Add filter state in the screen component**

Inside `VenuesScreen`, before the return:
```ts
const [areaFilter, setAreaFilter] = useState<string>('All');
const [categoryFilter, setCategoryFilter] = useState<string>('All');
```

- [ ] **Step 3: Add filter arrays**

Add these constants just above the `VenuesScreen` component (outside, not re-created on render):
```ts
const AREA_FILTERS = ['All', 'Soho', 'Vauxhall', 'East London', 'North London', 'South London', 'West End'];
const CATEGORY_FILTERS = ['All', 'Bar', 'Nightclub', 'Club', 'Pub'];
```

- [ ] **Step 4: Add FilterPills component**

Add this component above `VenuesScreen` in the file:
```tsx
function FilterPills({
  options,
  active,
  onSelect,
}: {
  options: string[];
  active: string;
  onSelect: (v: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.pillRow}
      contentContainerStyle={styles.pillRowContent}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.pill, active === opt && styles.pillActive]}
          onPress={() => onSelect(opt)}
          activeOpacity={0.8}>
          <Text style={[styles.pillText, active === opt && styles.pillTextActive]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
```

- [ ] **Step 5: Add pill styles**

In the `StyleSheet.create({...})` at the bottom of the file, add:
```ts
pillRow: {
  marginBottom: 4,
},
pillRowContent: {
  paddingHorizontal: 16,
  gap: 8,
  flexDirection: 'row',
},
pill: {
  backgroundColor: C.surface,
  borderRadius: 20,
  paddingHorizontal: 12,
  paddingVertical: 6,
},
pillActive: {
  backgroundColor: C.orange,
},
pillText: {
  fontFamily: F.semibold,
  fontSize: 11,
  letterSpacing: 0.5,
  color: C.textMuted,
},
pillTextActive: {
  color: C.bg,
},
```

Note: `F` is already imported from `@/constants/theme` in this file. Use `F.semibold` (not the raw string `'Inter_600SemiBold'`) to stay consistent with the rest of the file.

- [ ] **Step 6: Compile check**

```bash
npx tsc --noEmit
```

- [ ] **Step 7: Commit**

```bash
git add app/(tabs)/venues.tsx
git commit -m "feat: add FilterPills component and state to venues screen"
```

---

### Task 12: Wire filters to venue/sauna lists

**Files:**
- Modify: `app/(tabs)/venues.tsx`

- [ ] **Step 1: Add filtered lists inside the component**

Inside `VenuesScreen`, before the return, add derived filtered arrays:
```ts
const filteredVenues = venues.filter((v) => {
  const areaMatch = areaFilter === 'All' || v.area === areaFilter;
  const catMatch = categoryFilter === 'All' || v.category === categoryFilter;
  return areaMatch && catMatch;
});

const filteredSaunas = saunas.filter((s) =>
  areaFilter === 'All' || s.area === areaFilter
);
```

- [ ] **Step 2: Replace the ScrollView content**

In the `<ScrollView>` content, insert the two pill rows between the page subtitle and the `<SectionHeading title="NIGHTLIFE" ...>` line:
```tsx
<FilterPills options={AREA_FILTERS} active={areaFilter} onSelect={setAreaFilter} />
{/* Category filter applies to NIGHTLIFE section only — saunas are filtered by area above */}
<FilterPills options={CATEGORY_FILTERS} active={categoryFilter} onSelect={setCategoryFilter} />
```

Both rows appear above the NIGHTLIFE section. The area pill (row 1) filters both sections. The category pill (row 2) filters the NIGHTLIFE section only — this is intentional per spec. Saunas don't have a `category` field, so selecting e.g. "Bar" hides bar-type nightlife venues while saunas remain (area-filtered).

Replace `{venues.map((v) => <VenueCard key={v.id} venue={v} />)}` with:
```tsx
{filteredVenues.length === 0
  ? <Text style={styles.emptyState}>No nightlife venues in this area</Text>
  : filteredVenues.map((v) => <VenueCard key={v.id} venue={v} />)
}
```

Replace `{saunas.map((s) => <SaunaCard key={s.id} sauna={s} />)}` with:
```tsx
{filteredSaunas.length === 0
  ? <Text style={styles.emptyState}>No saunas in this area</Text>
  : filteredSaunas.map((s) => <SaunaCard key={s.id} sauna={s} />)
}
```

- [ ] **Step 3: Add emptyState style**

```ts
emptyState: {
  fontFamily: F.body,
  fontSize: 14,
  color: C.textMuted,
  paddingHorizontal: 16,
  paddingVertical: 12,
},
```

- [ ] **Step 4: Compile check**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add app/(tabs)/venues.tsx
git commit -m "feat: wire venue and sauna filters with empty states"
```

---

### Task 13: Verify venue filters in browser

- [ ] **Step 1: Start dev server**

```bash
npm run web
```

Open `http://localhost:8081` in browser.

- [ ] **Step 2: Navigate to Venues tab and test**

Test these scenarios manually:

| Action | Expected result |
|--------|----------------|
| Select "Vauxhall" area pill | Only Vauxhall venues in NIGHTLIFE; Vauxhall saunas in SAUNAS |
| Select "North London" area pill | Egg London appears in NIGHTLIFE |
| Select "Bar" category pill with "All" area | Only Bar-category venues shown; all area saunas still shown |
| Select "Vauxhall" + "Nightclub" | Only Vauxhall nightclubs in NIGHTLIFE |
| Select an area with no saunas | "No saunas in this area" text appears |
| Tap "All" on area row | All venues and saunas return |

---

## Chunk 4: Event Filters

### Task 14: Add area filter to Events screen

**Files:**
- Modify: `app/(tabs)/events.tsx`

**Prerequisite:** Task 1 must be complete — `mighty-hoopla` and `pride-in-london` must have `venueId: ''` before this task runs. With that fix in place, `venueAreaMap['']` resolves to `undefined`, so those events only appear under "All".

Context: The current screen renders `events.map(...)` in a `<ScrollView>`. Events have no `area` field — area is resolved by looking up `event.venueId` in the `venues` array. Events with `venueId: ''` only appear under "All".

- [ ] **Step 1: Add imports**

```ts
import { useState } from 'react';
import Head from 'expo-router/head';
import { venues } from '@/data/venues';
```

(Note: if `useState` is already imported, just add to the existing import.)

- [ ] **Step 2: Add venue area lookup map (outside component)**

Just above the `EventsScreen` component:
```ts
const AREA_FILTERS = ['All', 'Soho', 'Vauxhall', 'East London', 'North London', 'South London', 'West End'];
const venueAreaMap = Object.fromEntries(venues.map((v) => [v.id, v.area]));
```

- [ ] **Step 3: Add state and filtered list inside component**

```ts
const [areaFilter, setAreaFilter] = useState<string>('All');

const filteredEvents = events.filter((e) => {
  if (areaFilter === 'All') return true;
  const area = venueAreaMap[e.venueId];
  return area === areaFilter;
});
```

- [ ] **Step 4: Add FilterPills component**

Copy the `FilterPills` component from `app/(tabs)/venues.tsx` into this file (same exact implementation — it is a local component used only in this file, not worth extracting to a shared location for two usages).

- [ ] **Step 5: Render pill row and filtered list**

In the `<ScrollView>` content, below the page subtitle/accent line and above the event cards:
```tsx
<FilterPills options={AREA_FILTERS} active={areaFilter} onSelect={setAreaFilter} />
```

Replace `{events.map((event) => <EventCard key={event.id} event={event} />)}` with:
```tsx
{filteredEvents.length === 0
  ? <Text style={styles.emptyState}>No events in this area</Text>
  : filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
}
```

- [ ] **Step 6: Add pill styles and emptyState style**

Copy the pill styles from `venues.tsx` into the `StyleSheet.create({...})` in `events.tsx`:
```ts
pillRow: { marginBottom: 4 },
pillRowContent: { paddingHorizontal: 16, gap: 8, flexDirection: 'row' },
pill: { backgroundColor: C.surface, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
pillActive: { backgroundColor: C.orange },
pillText: { fontFamily: F.semibold, fontSize: 11, letterSpacing: 0.5, color: C.textMuted },
pillTextActive: { color: C.bg },
emptyState: { fontFamily: F.body, fontSize: 14, color: C.textMuted, paddingHorizontal: 16, paddingVertical: 12 },
```

Note: `F` is already imported from `@/constants/theme` in `events.tsx`. Use `F.semibold` and `F.body` (not raw font name strings).

- [ ] **Step 7: Compile check**

```bash
npx tsc --noEmit
```

- [ ] **Step 8: Commit**

```bash
git add app/(tabs)/events.tsx
git commit -m "feat: add area filter to events screen"
```

---

### Task 15: Verify event filters in browser

- [ ] **Step 1: In dev server, navigate to Events tab**

```bash
npm run web
```

- [ ] **Step 2: Test filter scenarios**

| Action | Expected result |
|--------|----------------|
| Select "Vauxhall" | Shows Duckie (RVT), Horse Meat Disco (Eagle), etc. — Vauxhall venue events only |
| Select "East London" | Shows Dalston Superstore events etc. |
| Select "Soho" | Shows Soho venue events |
| Select "All" | All 21 events return |
| "Mighty Hoopla" visibility | Only visible under "All", not under any area pill |
| "Pride in London" visibility | Only visible under "All", not under any area pill |
| Select area with no events | "No events in this area" text shown |

---

### Task 16: Final build verification

- [ ] **Step 1: Full production build**

```bash
npm run build:web
```
Expected: exits 0, no TypeScript errors, no webpack/metro errors.

- [ ] **Step 2: Serve and spot-check SEO + filters together**

```bash
npx serve dist -p 3001
```

Check:
1. `http://localhost:3001` → View Source → `<title>Queer London — LGBTQ+ Bars, Clubs & Events</title>` present
2. `http://localhost:3001/venue/eagle-london` → View Source → `<title>Eagle London — Bar, Vauxhall | Queer London</title>` present
3. `http://localhost:3001/venues` → Venues tab renders with pill rows visible
4. `http://localhost:3001/events` → Events tab renders with pill row visible

- [ ] **Step 3: Commit any final clean-up**

If all passes with no issues, the feature is complete and ready for Vercel deployment.
