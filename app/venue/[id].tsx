import { Image } from 'expo-image';
import Head from 'expo-router/head';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, F } from '@/constants/theme';
import { venues } from '@/data/venues';

export default function VenueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const venue = venues.find((v) => v.id === id);

  if (!venue) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.notFound}>Venue not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Head>
        <title>{venue.name} — {venue.category}, {venue.area} | Queer London</title>
        <meta name="description" content={venue.description} />
        <meta property="og:title" content={`${venue.name} — ${venue.category}, ${venue.area} | Queer London`} />
        <meta property="og:description" content={venue.description} />
        <meta property="og:image" content={venue.imageUrl} />
        <meta property="og:url" content={`https://queerlondon.app/venue/${id}`} />
        <meta property="og:type" content="website" />
      </Head>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: venue.imageUrl }} style={styles.heroImage} contentFit="cover" transition={400} />
          <View style={styles.heroGrade} />
          <View style={[styles.heroOverlay, { paddingTop: insets.top + 12 }]}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{venue.category}</Text>
            </View>
          </View>
        </View>

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.name}>{venue.name.toUpperCase()}</Text>
          <Text style={styles.area}>{venue.area}</Text>

          <View style={styles.accentLine} />

          <Text style={styles.desc}>{venue.description}</Text>

          {venue.openingHours && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>HOURS</Text>
              <Text style={styles.infoValue}>{venue.openingHours}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ADDRESS</Text>
            <Text style={styles.infoValue}>{venue.address}</Text>
          </View>

          <View style={styles.tags}>
            {venue.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.directionsBtn}
              onPress={() =>
                Linking.openURL(
                  `https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`
                )
              }>
              <Text style={styles.directionsBtnText}>GET DIRECTIONS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.igBtn}
              onPress={() =>
                Linking.openURL(`https://www.instagram.com/${venue.instagram}/`)
              }>
              <Text style={styles.igBtnText}>@{venue.instagram}</Text>
            </TouchableOpacity>

            {venue.website && (
              <TouchableOpacity
                style={styles.webBtn}
                onPress={() => Linking.openURL(venue.website!)}>
                <Text style={styles.webBtnText}>Website →</Text>
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
    height: 320,
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
    height: 160,
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
  categoryBadge: {
    backgroundColor: 'rgba(13,9,5,0.65)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(242,235,217,0.15)',
  },
  categoryBadgeText: {
    fontFamily: F.semibold,
    fontSize: 10,
    color: C.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 14,
  },
  name: {
    fontFamily: F.heading,
    fontSize: 36,
    color: C.text,
    letterSpacing: 2,
    lineHeight: 38,
  },
  area: {
    fontFamily: F.semibold,
    fontSize: 13,
    color: C.pink,
    letterSpacing: 0.5,
    marginTop: -6,
  },
  accentLine: {
    height: 2,
    width: 40,
    backgroundColor: C.orange,
    borderRadius: 1,
  },
  desc: {
    fontFamily: F.body,
    fontSize: 14,
    color: 'rgba(242,235,217,0.8)',
    lineHeight: 22,
  },
  infoRow: {
    gap: 4,
  },
  infoLabel: {
    fontFamily: F.heading,
    fontSize: 11,
    color: C.textMuted,
    letterSpacing: 2.5,
  },
  infoValue: {
    fontFamily: F.body,
    fontSize: 13,
    color: C.text,
    lineHeight: 20,
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
  directionsBtn: {
    backgroundColor: C.orange,
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
  },
  directionsBtnText: {
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
  webBtn: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.borderLight,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  webBtnText: {
    fontFamily: F.semibold,
    fontSize: 13,
    color: C.textMuted,
  },
});
