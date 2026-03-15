import { Image } from 'expo-image';
import Head from 'expo-router/head';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, F } from '@/constants/theme';
import { saunas } from '@/data/saunas';

export default function SaunaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const sauna = saunas.find((s) => s.id === id);

  if (!sauna) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.notFound}>Sauna not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Head>
        <title>{sauna.name} — Gay Sauna, {sauna.area} | Queer London</title>
        <meta name="description" content={sauna.description} />
        <meta property="og:title" content={`${sauna.name} — Gay Sauna, ${sauna.area} | Queer London`} />
        <meta property="og:description" content={sauna.description} />
        <meta property="og:image" content={sauna.imageUrl} />
        <meta property="og:url" content={`https://queerlondon.app/sauna/${id}`} />
        <meta property="og:type" content="website" />
      </Head>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: sauna.imageUrl }} style={styles.heroImage} contentFit="cover" transition={400} />
          <View style={styles.heroGrade} />
          <View style={[styles.heroOverlay, { paddingTop: insets.top + 12 }]}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <View style={styles.saunaBadge}>
              <Text style={styles.saunaBadgeText}>SAUNA · 18+</Text>
            </View>
          </View>
        </View>

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.name}>{sauna.name.toUpperCase()}</Text>
          <Text style={styles.area}>{sauna.area}</Text>

          <View style={styles.accentLine} />

          <Text style={styles.desc}>{sauna.description}</Text>

          {sauna.openingHours && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>HOURS</Text>
              <Text style={styles.infoValue}>{sauna.openingHours}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ADDRESS</Text>
            <Text style={styles.infoValue}>{sauna.address}</Text>
          </View>

          <View style={styles.tags}>
            {sauna.tags.map((tag) => (
              <View key={tag} style={[styles.tag, styles.tealTag]}>
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
                  `https://www.google.com/maps/search/?api=1&query=${sauna.lat},${sauna.lng}`
                )
              }>
              <Text style={styles.directionsBtnText}>GET DIRECTIONS</Text>
            </TouchableOpacity>

            {sauna.instagram && (
              <TouchableOpacity
                style={styles.igBtn}
                onPress={() =>
                  Linking.openURL(`https://www.instagram.com/${sauna.instagram}/`)
                }>
                <Text style={styles.igBtnText}>@{sauna.instagram}</Text>
              </TouchableOpacity>
            )}

            {sauna.website && (
              <TouchableOpacity
                style={styles.webBtn}
                onPress={() => Linking.openURL(sauna.website!)}>
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
  saunaBadge: {
    backgroundColor: C.teal,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  saunaBadgeText: {
    fontFamily: F.heading,
    fontSize: 11,
    color: C.text,
    letterSpacing: 2,
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
    backgroundColor: C.teal,
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
  tealTag: {
    borderColor: 'rgba(26,58,58,0.6)',
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
    backgroundColor: C.teal,
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
