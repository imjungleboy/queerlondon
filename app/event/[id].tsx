import { Image } from 'expo-image';
import Head from 'expo-router/head';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, F } from '@/constants/theme';
import { events } from '@/data/events';
import { venues } from '@/data/venues';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const event = events.find((e) => e.id === id);
  const venue = event ? venues.find((v) => v.id === event.venueId) : undefined;

  if (!event) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.notFound}>Event not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Head>
        <title>{event.title} at {event.venueName} — {event.date} | Queer London</title>
        <meta name="description" content={event.description} />
        <meta property="og:title" content={`${event.title} at ${event.venueName} — ${event.date} | Queer London`} />
        <meta property="og:description" content={event.description} />
        <meta property="og:image" content={event.imageUrl} />
        <meta property="og:url" content={`https://queerlondon.app/event/${id}`} />
        <meta property="og:type" content="website" />
      </Head>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: event.imageUrl }} style={styles.heroImage} contentFit="cover" transition={400} />
          <View style={styles.heroGrade} />
          <View style={[styles.heroOverlay, { paddingTop: insets.top + 12 }]}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            {event.price && (
              <View style={styles.priceBadge}>
                <Text style={styles.priceBadgeText}>{event.price}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.title}>{event.title.toUpperCase()}</Text>

          <TouchableOpacity
            onPress={() => venue && router.push(`/venue/${venue.id}`)}
            disabled={!venue}>
            <Text style={styles.venueName}>
              {event.venueName}{venue ? '  →' : ''}
            </Text>
          </TouchableOpacity>

          <View style={styles.accentLine} />

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>DATE</Text>
              <Text style={styles.metaValue}>{event.date}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>TIME</Text>
              <Text style={styles.metaValue}>{event.time}</Text>
            </View>
          </View>

          <Text style={styles.desc}>{event.description}</Text>

          <View style={styles.tags}>
            {event.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            {event.ticketUrl && (
              <TouchableOpacity
                style={styles.ticketBtn}
                onPress={() => Linking.openURL(event.ticketUrl!)}>
                <Text style={styles.ticketBtnText}>GET TICKETS</Text>
              </TouchableOpacity>
            )}

            {event.instagram && (
              <TouchableOpacity
                style={styles.igBtn}
                onPress={() =>
                  Linking.openURL(`https://www.instagram.com/${event.instagram}/`)
                }>
                <Text style={styles.igBtnText}>@{event.instagram}</Text>
              </TouchableOpacity>
            )}

            {venue && (
              <TouchableOpacity
                style={styles.venueBtn}
                onPress={() => router.push(`/venue/${venue.id}`)}>
                <Text style={styles.venueBtnText}>View Venue →</Text>
              </TouchableOpacity>
            )}
          </View>
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
  scroll: {
    paddingBottom: 60,
  },
  notFound: {
    fontFamily: F.body,
    color: C.textMuted,
    fontSize: 16,
  },

  heroWrap: {
    height: 280,
    position: 'relative',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroGrade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(13,9,5,0)',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backBtn: {
    backgroundColor: 'rgba(13,9,5,0.65)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(242,235,217,0.15)',
  },
  backBtnText: {
    fontFamily: F.semibold,
    fontSize: 13,
    color: C.text,
  },
  priceBadge: {
    backgroundColor: C.red,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  priceBadgeText: {
    fontFamily: F.semibold,
    fontSize: 11,
    color: C.text,
    letterSpacing: 0.3,
  },

  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 14,
  },
  title: {
    fontFamily: F.heading,
    fontSize: 34,
    color: C.text,
    letterSpacing: 2,
    lineHeight: 36,
  },
  venueName: {
    fontFamily: F.semibold,
    fontSize: 14,
    color: C.pink,
    letterSpacing: 0.3,
    marginTop: -6,
  },
  accentLine: {
    height: 2,
    width: 40,
    backgroundColor: C.red,
    borderRadius: 1,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 32,
  },
  metaItem: {
    gap: 4,
  },
  metaLabel: {
    fontFamily: F.heading,
    fontSize: 11,
    color: C.textMuted,
    letterSpacing: 2.5,
  },
  metaValue: {
    fontFamily: F.semibold,
    fontSize: 13,
    color: C.orange,
  },
  desc: {
    fontFamily: F.body,
    fontSize: 14,
    color: 'rgba(242,235,217,0.8)',
    lineHeight: 22,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: C.surface2,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: C.border,
  },
  tagText: {
    fontFamily: F.semibold,
    fontSize: 11,
    color: C.textMuted,
    letterSpacing: 0.5,
  },

  actions: {
    gap: 10,
    marginTop: 4,
  },
  ticketBtn: {
    backgroundColor: C.red,
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
  },
  ticketBtnText: {
    fontFamily: F.heading,
    fontSize: 16,
    color: C.text,
    letterSpacing: 3,
  },
  igBtn: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: 'rgba(212,80,106,0.4)',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  igBtnText: {
    fontFamily: F.semibold,
    fontSize: 13,
    color: C.pink,
  },
  venueBtn: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.borderLight,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  venueBtnText: {
    fontFamily: F.semibold,
    fontSize: 13,
    color: C.textMuted,
  },
});
