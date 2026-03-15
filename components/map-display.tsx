import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { C, F } from '@/constants/theme';
import { venues } from '@/data/venues';
import { saunas } from '@/data/saunas';

const INITIAL_REGION = {
  latitude: 51.510,
  longitude: -0.118,
  latitudeDelta: 0.12,
  longitudeDelta: 0.10,
};

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1a1108' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8a7a65' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d0905' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a1f12' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3d2a14' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#1a3a3a' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1a1108' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2a1f12' }] },
];

export default function MapDisplay() {
  const router = useRouter();
  return (
    <>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
        customMapStyle={darkMapStyle}>
        {venues.map((v) => (
          <Marker
            key={v.id}
            coordinate={{ latitude: v.lat, longitude: v.lng }}
            pinColor={C.orange}>
            <Callout onPress={() => router.push(`/venue/${v.id}`)}>
              <View style={styles.callout}>
                <Text style={styles.calloutName}>{v.name}</Text>
                <Text style={styles.calloutArea}>{v.area}  ·  {v.category}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
        {saunas.map((s) => (
          <Marker
            key={s.id}
            coordinate={{ latitude: s.lat, longitude: s.lng }}
            pinColor={C.teal}>
            <Callout onPress={() => router.push(`/sauna/${s.id}`)}>
              <View style={styles.callout}>
                <Text style={styles.calloutName}>{s.name}</Text>
                <Text style={styles.calloutArea}>{s.area}  ·  Sauna</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: C.orange }]} />
          <Text style={styles.legendText}>Venues</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: C.teal }]} />
          <Text style={styles.legendText}>Saunas</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  callout: {
    padding: 8,
    minWidth: 140,
  },
  calloutName: {
    fontFamily: F.semibold,
    fontSize: 13,
    color: '#1a1108',
  },
  calloutArea: {
    fontFamily: F.body,
    fontSize: 11,
    color: '#8a7a65',
    marginTop: 2,
  },
  legend: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(13,9,5,0.9)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(242,235,217,0.1)',
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
    color: C.text,
  },
});
