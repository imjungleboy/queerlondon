import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';

import { C, F } from '@/constants/theme';
import { venues } from '@/data/venues';
import { saunas } from '@/data/saunas';

const MAP_SRC =
  'https://maps.google.com/maps?q=soho+london+gay+venues&t=&z=13&ie=UTF8&iwloc=&output=embed';

function LocationRow({
  name,
  area,
  lat,
  lng,
  tint,
}: {
  name: string;
  area: string;
  lat: number;
  lng: number;
  tint: string;
}) {
  return (
    <TouchableOpacity
      style={styles.locationRow}
      onPress={() =>
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`)
      }>
      <View style={[styles.dot, { backgroundColor: tint }]} />
      <View style={{ flex: 1 }}>
        <Text style={styles.locName}>{name}</Text>
        <Text style={styles.locArea}>{area}</Text>
      </View>
      <Text style={styles.locArrow}>↗</Text>
    </TouchableOpacity>
  );
}

export default function MapDisplay() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      {/* OpenStreetMap iframe */}
      <View style={styles.mapWrap}>
        {/* @ts-ignore — valid HTML on web */}
        <iframe
          src={MAP_SRC}
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: 6 }}
          title="Queer London Map"
        />
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: C.orange }]} />
          <Text style={styles.legendText}>Venues</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: C.teal }]} />
          <Text style={styles.legendText}>Saunas</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>NIGHTLIFE</Text>
      {venues.map((v) => (
        <LocationRow key={v.id} name={v.name} area={v.area} lat={v.lat} lng={v.lng} tint={C.orange} />
      ))}

      <Text style={[styles.sectionLabel, { marginTop: 12 }]}>SAUNAS</Text>
      {saunas.map((s) => (
        <LocationRow key={s.id} name={s.name} area={s.area} lat={s.lat} lng={s.lng} tint={C.teal} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: 12,
    paddingBottom: 40,
  },
  mapWrap: {
    height: 320,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontFamily: F.semibold,
    fontSize: 12,
    color: C.textMuted,
  },
  sectionLabel: {
    fontFamily: F.heading,
    fontSize: 14,
    color: C.textMuted,
    letterSpacing: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: C.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  locName: {
    fontFamily: F.semibold,
    fontSize: 14,
    color: C.text,
  },
  locArea: {
    fontFamily: F.body,
    fontSize: 11,
    color: C.textMuted,
    marginTop: 1,
  },
  locArrow: {
    fontFamily: F.body,
    fontSize: 16,
    color: C.textMuted,
  },
});
