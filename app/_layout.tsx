import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { FallingPattern } from '@/components/ui/falling-pattern';

export const unstable_settings = {
  anchor: '(tabs)',
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0D0905',
  },
});

// Force DarkTheme to use our warm palette
const QueerTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0D0905',
    card: '#1A1108',
    text: '#F2EBD9',
    border: 'rgba(242,235,217,0.08)',
    primary: '#C4581A',
    notification: '#8B1A0E',
  },
};

function injectFilmGrain() {
  if (Platform.OS !== 'web') return;
  const id = 'queer-film-grain';
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    body { background-color: #0D0905; margin: 0; }
    body::after {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.04;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    }
    * { box-sizing: border-box; }
    ::-webkit-scrollbar { display: none; }
  `;
  document.head.appendChild(style);
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    DancingScript_700Bold,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    injectFilmGrain();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={QueerTheme}>
      <View style={styles.root}>
        {/* subtle falling streaks behind everything */}
        <FallingPattern />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="venue/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="sauna/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="event/[id]" options={{ headerShown: false }} />
        </Stack>
      </View>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
