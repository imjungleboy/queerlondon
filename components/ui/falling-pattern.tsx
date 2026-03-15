/**
 * FallingPattern — subtle animated vertical streaks for React Native.
 * Renders behind all content via StyleSheet.absoluteFillObject.
 * pointerEvents="none" so it never blocks taps.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

interface StreakConfig {
  id: number;
  x: number;
  w: number;
  h: number;
  dur: number;
  delay: number;
  opacity: number;
  color: string;
}

// Distributed across screen width — warm off-white + rare red/orange hints
const STREAKS: StreakConfig[] = [
  { id: 0,  x: W * 0.04,  w: 1,   h: 80,  dur: 7200,  delay: 0,    opacity: 0.055, color: '#F2EBD9' },
  { id: 1,  x: W * 0.11,  w: 1.5, h: 50,  dur: 5600,  delay: 1300, opacity: 0.035, color: '#C4581A' },
  { id: 2,  x: W * 0.19,  w: 1,   h: 110, dur: 9200,  delay: 800,  opacity: 0.045, color: '#F2EBD9' },
  { id: 3,  x: W * 0.27,  w: 1,   h: 60,  dur: 6600,  delay: 3100, opacity: 0.06,  color: '#F2EBD9' },
  { id: 4,  x: W * 0.35,  w: 1.5, h: 40,  dur: 4900,  delay: 600,  opacity: 0.035, color: '#8B1A0E' },
  { id: 5,  x: W * 0.43,  w: 1,   h: 90,  dur: 8400,  delay: 2500, opacity: 0.05,  color: '#F2EBD9' },
  { id: 6,  x: W * 0.50,  w: 1,   h: 70,  dur: 7500,  delay: 1700, opacity: 0.04,  color: '#F2EBD9' },
  { id: 7,  x: W * 0.58,  w: 1.5, h: 45,  dur: 5300,  delay: 700,  opacity: 0.035, color: '#C4581A' },
  { id: 8,  x: W * 0.65,  w: 1,   h: 100, dur: 8900,  delay: 2100, opacity: 0.05,  color: '#F2EBD9' },
  { id: 9,  x: W * 0.73,  w: 1,   h: 55,  dur: 6100,  delay: 3600, opacity: 0.045, color: '#F2EBD9' },
  { id: 10, x: W * 0.80,  w: 1.5, h: 85,  dur: 7700,  delay: 1200, opacity: 0.035, color: '#8B1A0E' },
  { id: 11, x: W * 0.88,  w: 1,   h: 65,  dur: 5900,  delay: 2900, opacity: 0.055, color: '#F2EBD9' },
  { id: 12, x: W * 0.15,  w: 1,   h: 45,  dur: 6300,  delay: 4100, opacity: 0.03,  color: '#F2EBD9' },
  { id: 13, x: W * 0.54,  w: 1,   h: 120, dur: 10200, delay: 550,  opacity: 0.035, color: '#F2EBD9' },
  { id: 14, x: W * 0.71,  w: 1,   h: 35,  dur: 4600,  delay: 1900, opacity: 0.03,  color: '#C4581A' },
  { id: 15, x: W * 0.95,  w: 1,   h: 75,  dur: 8100,  delay: 3300, opacity: 0.04,  color: '#F2EBD9' },
];

function Streak({ cfg }: { cfg: StreakConfig }) {
  const y = useRef(new Animated.Value(-cfg.h)).current;
  const first = useRef(true);

  useEffect(() => {
    const run = () => {
      y.setValue(-cfg.h);
      Animated.timing(y, {
        toValue: H + cfg.h,
        duration: cfg.dur,
        delay: first.current ? cfg.delay : 0,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          first.current = false;
          run();
        }
      });
    };
    run();
  }, []);

  return (
    <Animated.View
      style={[
        s.streak,
        {
          left: cfg.x,
          width: cfg.w,
          height: cfg.h,
          opacity: cfg.opacity,
          backgroundColor: cfg.color,
          borderRadius: cfg.w,
          transform: [{ translateY: y }],
        },
      ]}
    />
  );
}

export function FallingPattern() {
  return (
    <View style={s.container} pointerEvents="none">
      {STREAKS.map((cfg) => (
        <Streak key={cfg.id} cfg={cfg} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  streak: {
    position: 'absolute',
    top: 0,
  },
});
