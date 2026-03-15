import { Image } from 'expo-image';
import Head from 'expo-router/head';
import { useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, F } from '@/constants/theme';
import { venues, type Venue } from '@/data/venues';
import { saunas, type Sauna } from '@/data/saunas';

// ─── Venue card ───────────────────────────────────────────────────────────────
function VenueCard({ venue }: { venue: Venue }) {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/venue/${venue.id}`)} activeOpacity={0.9}>
      <Image
        source={{ uri: venue.imageUrl }}
        style={styles.cardImage}
        contentFit="cover"
        transition={400}
      />
      <View style={styles.cardImageGrade} />

      <View style={styles.cardBody}>
        <View style={styles.cardRow}>
          <Text style={styles.cardName}>{venue.name.toUpperCase()}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{venue.category}</Text>
          </View>
        </View>

        <Text style={styles.cardArea}>{venue.area}  ·  {venue.address.split(',')[1]?.trim() ?? ''}</Text>

        <Text style={styles.cardDesc} numberOfLines={2}>{venue.description}</Text>

        {venue.openingHours && (
          <Text style={styles.hours}>⏱  {venue.openingHours}</Text>
        )}

        <View style={styles.tags}>
          {venue.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.links}>
          <TouchableOpacity
            style={styles.igBtn}
            onPress={() => Linking.openURL(`https://www.instagram.com/${venue.instagram}/`)}>
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
    </TouchableOpacity>
  );
}

// ─── Sauna card ───────────────────────────────────────────────────────────────
function SaunaCard({ sauna }: { sauna: Sauna }) {
  const router = useRouter();
  return (
    <TouchableOpacity style={[styles.card, styles.saunaCard]} onPress={() => router.push(`/sauna/${sauna.id}`)} activeOpacity={0.9}>
      <Image
        source={{ uri: sauna.imageUrl }}
        style={styles.cardImage}
        contentFit="cover"
        transition={400}
      />
      <View style={styles.cardImageGrade} />
      <View style={[styles.saunaBadge]}>
        <Text style={styles.saunaBadgeText}>SAUNA</Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{sauna.name.toUpperCase()}</Text>
        <Text style={styles.cardArea}>{sauna.area}  ·  {sauna.address.split(',')[0]}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{sauna.description}</Text>

        {sauna.openingHours && (
          <Text style={styles.hours}>⏱  {sauna.openingHours}</Text>
        )}

        <View style={styles.tags}>
          {sauna.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.links}>
          {sauna.instagram && (
            <TouchableOpacity
              style={styles.igBtn}
              onPress={() => Linking.openURL(`https://www.instagram.com/${sauna.instagram}/`)}>
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
    </TouchableOpacity>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeading({ title, accent }: { title: string; accent: string }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={[styles.sectionAccent, { backgroundColor: accent }]} />
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function VenuesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Head>
        <title>LGBTQ+ Venues in London | Queer London</title>
        <meta name="description" content="Bars, clubs, pubs and saunas for the queer community across London." />
        <meta property="og:title" content="LGBTQ+ Venues in London | Queer London" />
        <meta property="og:description" content="Bars, clubs, pubs and saunas for the queer community across London." />
        <meta property="og:image" content="https://dalstonsuperstore.com/wp-content/uploads/2022/02/6ec149c3-7a3c-49b4-8e36-8e01fda6ec2b.jpeg" />
        <meta property="og:url" content="https://queerlondon.app/venues" />
        <meta property="og:type" content="website" />
      </Head>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20 }]}>

        <Text style={styles.pageTitle}>VENUES</Text>
        <Text style={styles.pageSubtitle}>LGBTQ+ bars, clubs & spaces across London</Text>

        <SectionHeading title="NIGHTLIFE" accent={C.orange} />
        {venues.map((v) => <VenueCard key={v.id} venue={v} />)}

        <SectionHeading title="SAUNAS" accent={C.teal} />
        <View style={styles.ageWarning}>
          <Text style={styles.ageWarningText}>18+  ·  Adult venues — please visit responsibly</Text>
        </View>
        {saunas.map((s) => <SaunaCard key={s.id} sauna={s} />)}

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
    marginBottom: 8,
  },

  sectionHeading: {
    marginTop: 12,
    gap: 6,
  },
  sectionTitle: {
    fontFamily: F.heading,
    fontSize: 18,
    color: C.text,
    letterSpacing: 4,
  },
  sectionAccent: {
    height: 2,
    width: 28,
    borderRadius: 1,
  },

  // ── Card ──
  card: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    backgroundColor: C.surface,
  },
  saunaCard: {
    borderColor: C.teal,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardImageGrade: {
    position: 'absolute',
    top: 130,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(13,9,5,0.7)',
  },
  saunaBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: C.teal,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
  },
  saunaBadgeText: {
    fontFamily: F.heading,
    fontSize: 11,
    color: C.text,
    letterSpacing: 2,
  },
  cardBody: {
    padding: 14,
    gap: 6,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardName: {
    fontFamily: F.heading,
    fontSize: 22,
    color: C.text,
    letterSpacing: 1.5,
    flex: 1,
    lineHeight: 24,
  },
  categoryBadge: {
    backgroundColor: C.surface2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  categoryBadgeText: {
    fontFamily: F.semibold,
    fontSize: 9,
    color: C.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cardArea: {
    fontFamily: F.semibold,
    fontSize: 11,
    color: C.pink,
    letterSpacing: 0.5,
  },
  cardDesc: {
    fontFamily: F.body,
    fontSize: 13,
    color: 'rgba(242,235,217,0.75)',
    lineHeight: 18,
  },
  hours: {
    fontFamily: F.body,
    fontSize: 12,
    color: C.textMuted,
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
  webBtn: {
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
  },
  webBtnText: {
    fontFamily: F.semibold,
    fontSize: 12,
    color: C.textMuted,
  },

  ageWarning: {
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: 'rgba(196,88,26,0.3)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 4,
  },
  ageWarningText: {
    fontFamily: F.semibold,
    fontSize: 12,
    color: C.orange,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
