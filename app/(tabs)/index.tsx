import Head from 'expo-router/head';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, F } from '@/constants/theme';
import { venues } from '@/data/venues';
import { events } from '@/data/events';

const HERO_VENUE = venues[0]; // Dalston Superstore
const HOT_NOW = venues.filter((v) => v.featured);
const EAST_LONDON = venues.filter((v) => v.area === 'East London');
const SOHO = venues.filter((v) => v.area === 'Soho');
const VAUXHALL = venues.filter((v) => v.area === 'Vauxhall');
const FEATURED_EVENTS = events.slice(0, 8);

// ─── Venue card (140 × 200) ──────────────────────────────────────────────────
function VenueCard({ venue }: { venue: (typeof venues)[0] }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/venue/${venue.id}`)}
      activeOpacity={0.85}>
      <Image source={{ uri: venue.imageUrl }} style={styles.cardImage} contentFit="cover" transition={400} />
      <View style={styles.cardGradient} />
      <View style={styles.cardMeta}>
        <Text style={styles.cardArea}>{venue.area}</Text>
        <Text style={styles.cardName} numberOfLines={2}>{venue.name.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Event card (160 × 100) ──────────────────────────────────────────────────
function EventCard({ event }: { event: (typeof events)[0] }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => router.push(`/event/${event.id}`)}
      activeOpacity={0.85}>
      <Image source={{ uri: event.imageUrl }} style={styles.eventCardImage} contentFit="cover" transition={400} />
      <View style={styles.cardGradient} />
      <View style={styles.eventCardMeta}>
        <Text style={styles.eventCardDate}>{event.date}</Text>
        <Text style={styles.eventCardTitle} numberOfLines={2}>{event.title.toUpperCase()}</Text>
        <Text style={styles.eventCardVenue} numberOfLines={1}>{event.venueName}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Horizontal row ──────────────────────────────────────────────────────────
function Row({
  title,
  children,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <Text style={styles.rowTitle}>{title}</Text>
        <View style={[styles.rowAccent, { backgroundColor: accent ?? C.teal }]} />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rowScroll}>
        {children}
      </ScrollView>
    </View>
  );
}

// ─── Home screen ─────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const heroHeight = Math.round(height * 0.55);

  return (
    <View style={styles.container}>
      <Head>
        <title>Queer London — LGBTQ+ Bars, Clubs & Events</title>
        <meta name="description" content="Discover the best gay bars, clubs, saunas and events in London." />
        <meta property="og:title" content="Queer London — LGBTQ+ Bars, Clubs & Events" />
        <meta property="og:description" content="Discover the best gay bars, clubs, saunas and events in London." />
        <meta property="og:image" content="https://dalstonsuperstore.com/wp-content/uploads/2022/02/6ec149c3-7a3c-49b4-8e36-8e01fda6ec2b.jpeg" />
        <meta property="og:url" content="https://queerlondon.app" />
        <meta property="og:type" content="website" />
      </Head>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── Hero banner ── */}
        <View style={[styles.hero, { height: heroHeight }]}>
          <Image
            source={{ uri: HERO_VENUE.imageUrl }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            transition={600}
          />

          {/* warm colour grade overlay */}
          <View style={styles.heroGrade} />

          {/* bottom fade */}
          <View style={styles.heroFade} />

          {/* light leak */}
          <View style={styles.lightLeak} />

          {/* wordmark — top left */}
          <View style={[styles.heroTop, { paddingTop: insets.top + 12 }]}>
            <Text style={styles.wordmark}>Queer London</Text>
          </View>

          {/* CTA — bottom */}
          <View style={styles.heroBottom}>
            <Text style={styles.heroArea}>{HERO_VENUE.area}</Text>
            <Text style={styles.heroTitle}>{HERO_VENUE.name.toUpperCase()}</Text>
            <Text style={styles.heroDesc} numberOfLines={2}>{HERO_VENUE.description}</Text>
            <View style={styles.heroCtas}>
              <TouchableOpacity
                style={styles.ctaFilled}
                onPress={() => router.push(`/venue/${HERO_VENUE.id}`)}>
                <Text style={styles.ctaFilledText}>Explore</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ctaOutline}
                onPress={() => HERO_VENUE.website && Linking.openURL(HERO_VENUE.website)}>
                <Text style={styles.ctaOutlineText}>♡  Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Rows ── */}
        <View style={{ gap: 32, paddingTop: 28 }}>
          <Row title="HOT RIGHT NOW" accent={C.orange}>
            {HOT_NOW.map((v) => <VenueCard key={v.id} venue={v} />)}
          </Row>

          <Row title="EAST LONDON" accent={C.teal}>
            {EAST_LONDON.map((v) => <VenueCard key={v.id} venue={v} />)}
          </Row>

          <Row title="SOHO" accent={C.red}>
            {SOHO.map((v) => <VenueCard key={v.id} venue={v} />)}
          </Row>

          <Row title="VAUXHALL" accent={C.orange}>
            {VAUXHALL.map((v) => <VenueCard key={v.id} venue={v} />)}
          </Row>

          <Row title="EVENTS" accent={C.pink}>
            {FEATURED_EVENTS.map((e) => <EventCard key={e.id} event={e} />)}
          </Row>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // ── Hero ──
  hero: {
    position: 'relative',
    overflow: 'hidden',
  },
  heroGrade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(139, 26, 14, 0.08)', // warm sepia grade
  },
  heroFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    // simulated gradient: stacked semi-transparent views
    backgroundColor: 'transparent',
    // We use a View overlay with gradient-like opacity
  },
  lightLeak: {
    position: 'absolute',
    top: '-20%',
    right: '-10%',
    width: '60%',
    height: '80%',
    borderRadius: 999,
    backgroundColor: 'rgba(196, 88, 26, 0.12)',
    transform: [{ scaleX: 1.8 }],
  },
  heroTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  wordmark: {
    fontFamily: F.script,
    fontSize: 32,
    color: C.text,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 28,
    backgroundColor: 'rgba(13,9,5,0.6)',
  },
  heroArea: {
    fontFamily: F.semibold,
    fontSize: 11,
    color: C.pink,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  heroTitle: {
    fontFamily: F.heading,
    fontSize: 42,
    color: C.text,
    letterSpacing: 2,
    lineHeight: 44,
    marginBottom: 6,
  },
  heroDesc: {
    fontFamily: F.body,
    fontSize: 13,
    color: 'rgba(242,235,217,0.75)',
    lineHeight: 18,
    marginBottom: 16,
  },
  heroCtas: {
    flexDirection: 'row',
    gap: 12,
  },
  ctaFilled: {
    backgroundColor: C.red,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 4,
  },
  ctaFilledText: {
    fontFamily: F.semibold,
    fontSize: 13,
    color: C.text,
    letterSpacing: 0.5,
  },
  ctaOutline: {
    borderWidth: 1,
    borderColor: C.borderLight,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  ctaOutlineText: {
    fontFamily: F.semibold,
    fontSize: 13,
    color: C.text,
    letterSpacing: 0.5,
  },

  // ── Row ──
  row: {
    gap: 12,
  },
  rowHeader: {
    paddingHorizontal: 16,
    gap: 6,
  },
  rowTitle: {
    fontFamily: F.heading,
    fontSize: 20,
    color: C.text,
    letterSpacing: 3,
  },
  rowAccent: {
    height: 2,
    width: 32,
    borderRadius: 1,
  },
  rowScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },

  // ── Venue card ──
  card: {
    width: 140,
    height: 200,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
    position: 'relative',
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(13,9,5,0.85)',
  },
  cardMeta: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  cardArea: {
    fontFamily: F.semibold,
    fontSize: 9,
    color: C.pink,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cardName: {
    fontFamily: F.heading,
    fontSize: 14,
    color: C.text,
    letterSpacing: 1,
    lineHeight: 16,
  },

  // ── Event card ──
  eventCard: {
    width: 200,
    height: 130,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
    position: 'relative',
  },
  eventCardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  eventCardMeta: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  eventCardDate: {
    fontFamily: F.semibold,
    fontSize: 9,
    color: C.orange,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  eventCardTitle: {
    fontFamily: F.heading,
    fontSize: 13,
    color: C.text,
    letterSpacing: 1,
    lineHeight: 15,
  },
  eventCardVenue: {
    fontFamily: F.body,
    fontSize: 10,
    color: C.textMuted,
    marginTop: 2,
  },
});
