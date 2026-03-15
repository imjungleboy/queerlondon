import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Head from 'expo-router/head';

import { C, F } from '@/constants/theme';
import MapDisplay from '@/components/map-display';

export default function MapScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Head>
        <title>LGBTQ+ London Map | Queer London</title>
        <meta name="description" content="Find gay bars, clubs and saunas near you on the Queer London map." />
        <meta property="og:title" content="LGBTQ+ London Map | Queer London" />
        <meta property="og:description" content="Find gay bars, clubs and saunas near you on the Queer London map." />
        <meta property="og:image" content="https://dalstonsuperstore.com/wp-content/uploads/2022/02/6ec149c3-7a3c-49b4-8e36-8e01fda6ec2b.jpeg" />
        <meta property="og:url" content="https://queerlondon.app/map" />
        <meta property="og:type" content="website" />
      </Head>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.pageTitle}>MAP</Text>
        <Text style={styles.pageSubtitle}>All queer venues & saunas across London</Text>
      </View>
      <View style={[styles.content, { paddingTop: insets.top + 72 }]}>
        <MapDisplay />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: C.bg,
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
    marginTop: -4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
