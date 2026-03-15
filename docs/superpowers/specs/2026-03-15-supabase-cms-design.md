# Supabase CMS & Dynamic Data Design

**Goal:** Replace static TypeScript data files with Supabase as a live database, add client-side data fetching, and build a password-protected admin page for managing venues, saunas, and events.

**Architecture:** The app stays as a static Expo web export. Data is fetched client-side from Supabase on every page load using the public anon key. Supabase Auth protects write access. An `/admin` route provides a non-technical UI for managing content.

**Tech Stack:** Supabase (PostgreSQL + Auth + JS client v2), `@supabase/supabase-js@^2`, Expo Router v6, React Native Web.

---

## Section 0: Prerequisites

Before starting:

1. Verify `.env.local` is in `.gitignore`. If not, add it before proceeding.
2. Install the Supabase client:
   ```bash
   npm install @supabase/supabase-js
   ```
   No `--legacy-peer-deps` needed — Supabase JS v2 is compatible with React 19.
3. Create a new Supabase project at supabase.com. Copy the **Project URL** and **anon/public key** from Settings → API.
4. Add to `.env.local`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Add the same two variables to Vercel's Environment Variables (Settings → Environment Variables) for production deployments.

---

## Section 1: Supabase Database Setup

### Table: `venues`

```sql
CREATE TABLE venues (
  id            text PRIMARY KEY,           -- human-readable slug, e.g. 'dalston-superstore'
  name          text NOT NULL,
  description   text NOT NULL DEFAULT '',
  address       text NOT NULL DEFAULT '',
  area          text NOT NULL DEFAULT '',
  image_url     text NOT NULL DEFAULT '',
  instagram     text NOT NULL DEFAULT '',
  website       text,
  tags          text[] NOT NULL DEFAULT '{}',
  opening_hours text,
  featured      boolean NOT NULL DEFAULT false,
  lat           numeric(10,6) NOT NULL DEFAULT 0,
  lng           numeric(10,6) NOT NULL DEFAULT 0,
  category      text NOT NULL CHECK (category IN ('Nightclub','Bar','Pub','Club'))
);
```

### Table: `saunas`

```sql
CREATE TABLE saunas (
  id            text PRIMARY KEY,
  name          text NOT NULL,
  description   text NOT NULL DEFAULT '',
  address       text NOT NULL DEFAULT '',
  area          text NOT NULL DEFAULT '',
  image_url     text NOT NULL DEFAULT '',
  instagram     text,
  website       text,
  tags          text[] NOT NULL DEFAULT '{}',
  opening_hours text,
  lat           numeric(10,6) NOT NULL DEFAULT 0,
  lng           numeric(10,6) NOT NULL DEFAULT 0
);
```

### Table: `events`

```sql
CREATE TABLE events (
  id          text PRIMARY KEY,
  title       text NOT NULL,
  venue_id    text NOT NULL DEFAULT '',   -- '' for city-wide events
  venue_name  text NOT NULL DEFAULT '',
  venue_area  text NOT NULL DEFAULT '',   -- denormalised from venues for fast area filtering
  date        text NOT NULL DEFAULT '',
  time        text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url   text NOT NULL DEFAULT '',
  instagram   text,
  website     text,
  tags        text[] NOT NULL DEFAULT '{}',
  price       text,
  ticket_url  text
);
```

> **Note on `venue_area` in events:** The events screen filters events by area using `venueAreaMap` built from the static venues array. With dynamic data, that approach no longer works. Instead, `venue_area` is stored directly on each event row. On write, the admin form looks up and fills `venue_area` automatically from `venue_id` (or leaves it empty for city-wide events). On read, filtering uses `event.venue_area` directly.

### Row Level Security

Run for all three tables:

```sql
-- venues
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON venues FOR SELECT USING (true);
CREATE POLICY "admin write" ON venues FOR ALL USING (auth.role() = 'authenticated');

-- saunas
ALTER TABLE saunas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON saunas FOR SELECT USING (true);
CREATE POLICY "admin write" ON saunas FOR ALL USING (auth.role() = 'authenticated');

-- events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON events FOR SELECT USING (true);
CREATE POLICY "admin write" ON events FOR ALL USING (auth.role() = 'authenticated');
```

---

## Section 2: Data Layer

### `lib/supabase.ts`

```ts
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Web-only export: default localStorage persistence is correct.
// Do NOT add AsyncStorage adapter — this is not a native app.
export const supabase = createClient(url, key, {
  auth: { persistSession: true },
});
```

### TypeScript interfaces

The `Venue`, `Sauna`, and `Event` interfaces remain in their respective `data/` files, unchanged. The files' exported arrays are set to `[]` — they exist only to export types. No existing import paths break.

The `Event` interface gains one new optional field to match the DB:
```ts
venueArea?: string;  // denormalised, used for area filtering
```

### `lib/useData.ts` — list hooks

Three hooks for list screens:

```ts
export function useVenues(): { venues: Venue[]; loading: boolean; error: string | null }
export function useSaunas(): { saunas: Sauna[]; loading: boolean; error: string | null }
export function useEvents(): { events: Event[]; loading: boolean; error: string | null }
```

Each uses `useState` + `useEffect`. Column names are mapped snake_case → camelCase (e.g. `image_url` → `imageUrl`, `opening_hours` → `openingHours`, `ticket_url` → `ticketUrl`, `venue_id` → `venueId`, `venue_name` → `venueName`, `venue_area` → `venueArea`).

### `lib/useData.ts` — single-record hooks

Three additional hooks for detail pages:

```ts
export function useVenue(id: string): { venue: Venue | null; loading: boolean; error: string | null }
export function useSauna(id: string): { sauna: Sauna | null; loading: boolean; error: string | null }
export function useEvent(id: string): { event: Event | null; loading: boolean; error: string | null }
```

Each calls `.select().eq('id', id).single()`. Used in `app/venue/[id].tsx`, `app/sauna/[id].tsx`, `app/event/[id].tsx` to replace the `find()` call on the static array.

### Files updated

| File | Change |
|------|--------|
| `app/(tabs)/index.tsx` | Call `useVenues()` and `useEvents()`. Hero = first item from `venues.filter(v => v.featured)`. All derived constants (HOT_NOW, EAST_LONDON, SOHO, VAUXHALL, FEATURED_EVENTS) become computed values inside the component body, not module-level constants. Show loading state while `loading === true` (see below). |
| `app/(tabs)/venues.tsx` | Replace static imports with `useVenues()` + `useSaunas()`. |
| `app/(tabs)/events.tsx` | Replace static imports with `useEvents()`. Remove `venueAreaMap` — filter on `event.venueArea` directly. |
| `app/(tabs)/map.tsx` | Call `useVenues()` and `useSaunas()`. Pass results as props to `<MapDisplay venues={venues} saunas={saunas} />`. |
| `components/map-display.tsx` | Add props interface: `type Props = { venues: Venue[]; saunas: Sauna[] }`. Remove static imports. Receive data via props. |
| `components/map-display.web.tsx` | Same prop interface as above: `type Props = { venues: Venue[]; saunas: Sauna[] }`. Remove static imports. |
| `app/venue/[id].tsx` | Use `useVenue(id)` hook. |
| `app/sauna/[id].tsx` | Use `useSauna(id)` hook. |
| `app/event/[id].tsx` | Use `useEvent(id)` hook. |

### Loading & error states

**List screens** (Venues, Events): `ActivityIndicator` centred, colour `C.orange`, while `loading === true`. On error, show: `<Text style={{ color: C.textMuted }}>Couldn't load data — please try again</Text>`.

**Hero section** (Home screen): While loading (`loading === true` from `useVenues()`), render the hero `View` at its normal height with `backgroundColor: C.surface` and no image — a simple dark placeholder. The hero title and button are not rendered during loading (they depend on `heroVenue` which is `undefined`). Guard: `const heroVenue = venues.find(v => v.featured) ?? venues[0] ?? null`. If `heroVenue` is `null` after loading (empty DB), render the dark placeholder permanently — no crash. Once venues load, render normally. No spinner in the hero slot.

**Detail pages**: Show `ActivityIndicator` centred while loading. Show "Venue not found" / "Event not found" on null result. Keep the existing `if (!venue) return null` guard for type safety.

**Map screen**: Pass `venues={venues}` and `saunas={saunas}` to `MapDisplay`. While loading, show `ActivityIndicator` over the map container.

---

## Section 3: Data Migration (One-time Seed)

A script `scripts/seed-supabase.ts` reads the existing static arrays and inserts all records.

Prerequisites:
1. Add `SUPABASE_SERVICE_ROLE_KEY=your-service-role-key` to `.env.local` temporarily.
2. Verify `.env.local` is gitignored before doing this.
3. After seeding, remove `SUPABASE_SERVICE_ROLE_KEY` from `.env.local`.
4. If the key is accidentally committed, rotate it immediately via Supabase dashboard → Settings → API → Regenerate.

The script uses the service role key (bypasses RLS for bulk insert). Run with:
```bash
npx ts-node --project tsconfig.json scripts/seed-supabase.ts
```

After seeding is verified in the Supabase dashboard, set static arrays to `[]` in all three data files.

The `venue_area` field on events must be populated during seeding: for each event, look up `venues.find(v => v.id === event.venueId)?.area ?? ''`.

---

## Section 4: Admin Route Setup

### Register in `app/_layout.tsx`

Add `admin` as a top-level Stack screen so it does not appear in the tab bar and has no header:

```tsx
<Stack.Screen name="admin" options={{ headerShown: false }} />
```

This must sit alongside the existing `venue/[id]`, `sauna/[id]`, `event/[id]` screens in the root Stack.

> **Note:** In Expo Router v6, `app/admin/index.tsx` is automatically registered as a route by the file system. The `Stack.Screen` entry in `_layout.tsx` only controls presentation options (headerShown, etc.) — it does not create the route. No other registration is needed.

---

## Section 5: Admin Page

### Route

`app/admin/index.tsx` — accessible at `/admin`. Not linked from main navigation. Web-only; the component can be wrapped with `Platform.OS === 'web'` guard if needed to prevent accidental native inclusion.

### Authentication

On mount, the component:
1. Sets `loading = true`, `session = null`.
2. Calls `supabase.auth.getUser()` (not `getSession()` — `getUser()` validates the JWT with Supabase's server, preventing stale/forged session bypass).
3. On resolve, sets `session` to the result and `loading = false`.
4. While `loading === true`, renders nothing (prevents auth flicker — login form appearing briefly for logged-in admins).

On login form submit:
- Calls `supabase.auth.signInWithPassword({ email, password })`.
- On `AuthApiError` with status 429, shows: "Too many attempts — please wait before trying again."
- On other error, shows the error message inline.
- On success, re-calls `getUser()` to set session.

Admin users are created manually via Supabase dashboard → Authentication → Users → Invite user. No self-registration.

On sign out: button calls `supabase.auth.signOut()`, clears session state.

### Admin UI structure

Three tabs — **Venues**, **Saunas**, **Events** — rendered as `TouchableOpacity` pill buttons at the top, matching the existing `FilterPills` style.

Each tab:
1. Fetches the full list from Supabase using the authenticated client on tab focus.
2. Shows a flat list of records: name/title + area/date as a subtitle.
3. Each row has **Edit** (opens inline form) and **Delete** (confirmation dialog before `.delete()`).
4. **+ Add** button at top opens a blank inline form.

### ID / slug for new records

When adding a new record, the admin types the `id` field manually (e.g. `'new-venue-name'`). The form validates that the ID is non-empty and contains only lowercase letters, numbers, and hyphens before saving. The upsert uses `{ onConflict: 'id' }` explicitly.

### Tags field

Tags are stored as `text[]` in Postgres. In the admin form, tags display as a comma-separated string (joined on load: `tags.join(', ')`). On save, the string is split and trimmed: `value.split(',').map(t => t.trim()).filter(Boolean)`.

### Form fields per table

**Venue form:** id, name, description, address, area (dropdown: Soho / Vauxhall / East London / North London / South London / West End), imageUrl, instagram, website, tags, openingHours, featured (toggle), lat, lng, category (dropdown: Nightclub / Bar / Pub / Club).

**Sauna form:** id, name, description, address, area (dropdown), imageUrl, instagram, website, tags, openingHours, lat, lng.

**Event form:** id, title, venueId (text input), venueName (text input), venueArea (text input — manually typed; admin can look up and copy the area from the venue; no auto-fill to avoid needing a separate venues fetch in the events admin tab), date, time, description, imageUrl, instagram, website, tags, price, ticketUrl.

### Styling

Uses existing `C` and `F` theme constants. No new design system needed — functional over decorative.

---

## Out of Scope

- Image upload (images remain external URLs typed manually)
- Public user accounts or venue owner self-service submissions
- Email notifications
- Audit log / change history
- Native mobile admin UI
- Webhook-triggered Vercel rebuild (data updates appear in real-time via client-side fetch)
