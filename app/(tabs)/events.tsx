import { Image } from 'expo-image';
import Head from 'expo-router/head';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, F } from '@/constants/theme';
import { events, type Event } from '@/data/events';
import { venues } from '@/data/venues';

// ─── Area filter constants ────────────────────────────────────────────────────
const AREA_FILTERS = ['All', 'Soho', 'Vauxhall', 'East London', 'North London', 'South London', 'West End'];
const venueAreaMap: Record<string, string | undefined> = Object.fromEntries(venues.map((v) => [v.id, v.area]));

// ─── Event card ───────────────────────────────────────────────────────────────
function EventCard({ event }: { event: Event }) {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/event/${event.id}`)} activeOpacity={0.9}>
      <View style={styles.cardImageWrap}>
        <Image
          source={{ uri: event.imageUrl }}
          style={styles.cardImage}
          contentFit="cover"
          transition={400}
        />
        <View style={styles.cardImageGrade} />
        {event.price && (
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>{event.price}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.eventTitle}>{event.title.toUpperCase()}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.venueName}>{event.venueName}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.area}>{event.date}</Text>
        </View>

        <Text style={styles.time}>{event.time}</Text>

        <Text style={styles.desc} numberOfLines={3}>{event.description}</Text>

        <View style={styles.tags}>
          {event.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.links}>
          {event.instagram && (
            <TouchableOpacity
              style={styles.igBtn}
              onPress={() => Linking.openURL(`https://www.instagram.com/${event.instagram}/`)}>
              <Text style={styles.igBtnText}>@{event.instagram}</Text>
            </TouchableOpacity>
          )}
          {event.ticketUrl && (
            <TouchableOpacity
              style={styles.ticketBtn}
              onPress={() => Linking.openURL(event.ticketUrl!)}>
              <Text style={styles.ticketBtnText}>Tickets →</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Filter pills ──────────────────────────────────────────────────────────────
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

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const [areaFilter, setAreaFilter] = useState<string>('All');

  const filteredEvents = events.filter((e) => {
    if (areaFilter === 'All') return true;
    const area = venueAreaMap[e.venueId];
    return area === areaFilter;
  });

  return (
    <View style={styles.container}>
      <Head>
        <title>LGBTQ+ Events in London | Queer London</title>
        <meta name="description" content="Gay club nights, drag shows, Pride events and more in London." />
        <meta property="og:title" content="LGBTQ+ Events in London | Queer London" />
        <meta property="og:description" content="Gay club nights, drag shows, Pride events and more in London." />
        <meta property="og:image" content="https://dalstonsuperstore.com/wp-content/uploads/2022/02/6ec149c3-7a3c-49b4-8e36-8e01fda6ec2b.jpeg" />
        <meta property="og:url" content="https://queerlondon.app/events" />
        <meta property="og:type" content="website" />
      </Head>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20 }]}>

        <Text style={styles.pageTitle}>WHAT'S ON</Text>
        <Text style={styles.pageSubtitle}>Nights out, drag shows & queer events</Text>

        <View style={styles.accentLine} />

        <FilterPills options={AREA_FILTERS} active={areaFilter} onSelect={setAreaFilter} />

        {filteredEvents.length === 0
          ? <Text style={styles.emptyState}>No events in this area</Text>
          : filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
        }

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 48,
    gap: 16,
  },

  pageTitle: {
    fontFamily: F.heading,
    fontSize: 40,
    color: C.text,
    letterSpacing: 4,
  },
  pageSubtitle: {
    fontFamily: F.body,
    fontSize: 13,
    color: C.textMuted,
    marginTop: -6,
  },
  accentLine: {
    height: 2,
    width: 40,
    backgroundColor: C.orange,
    borderRadius: 1,
    marginBottom: 4,
  },

  pillRow: { marginBottom: 4 },
  pillRowContent: { paddingHorizontal: 16, gap: 8, flexDirection: 'row' },
  pill: { backgroundColor: C.surface, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  pillActive: { backgroundColor: C.orange },
  pillText: { fontFamily: F.semibold, fontSize: 11, letterSpacing: 0.5, color: C.textMuted },
  pillTextActive: { color: C.bg },
  emptyState: { fontFamily: F.body, fontSize: 14, color: C.textMuted, paddingHorizontal: 16, paddingVertical: 12 },

  card: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    backgroundColor: C.surface,
  },
  cardImageWrap: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardImageGrade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 63,
    backgroundColor: 'rgba(13,9,5,0.6)',
  },
  priceBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: C.red,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
  },
  priceBadgeText: {
    fontFamily: F.semibold,
    fontSize: 10,
    color: C.text,
    letterSpacing: 0.3,
  },
  cardBody: {
    padding: 14,
    gap: 6,
  },
  eventTitle: {
    fontFamily: F.heading,
    fontSize: 26,
    color: C.text,
    letterSpacing: 2,
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  venueName: {
    fontFamily: F.semibold,
    fontSize: 12,
    color: C.pink,
  },
  dot: {
    fontFamily: F.body,
    fontSize: 12,
    color: C.textMuted,
  },
  area: {
    fontFamily: F.body,
    fontSize: 12,
    color: C.textMuted,
  },
  time: {
    fontFamily: F.semibold,
    fontSize: 12,
    color: C.orange,
    letterSpacing: 0.3,
  },
  desc: {
    fontFamily: F.body,
    fontSize: 13,
    color: 'rgba(242,235,217,0.75)',
    lineHeight: 18,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  tag: {
    backgroundColor: C.surface2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: C.border,
  },
  tagText: {
    fontFamily: F.semibold,
    fontSize: 10,
    color: C.textMuted,
    letterSpacing: 0.5,
  },
  links: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  igBtn: {
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: 'rgba(212,80,106,0.4)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
  },
  igBtnText: {
    fontFamily: F.semibold,
    fontSize: 12,
    color: C.pink,
  },
  ticketBtn: {
    backgroundColor: C.red,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
  },
  ticketBtnText: {
    fontFamily: F.semibold,
    fontSize: 12,
    color: C.text,
  },
});
