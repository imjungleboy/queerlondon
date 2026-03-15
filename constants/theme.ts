// A24 "Queer" film poster colour palette
export const C = {
  bg:          '#0D0905',   // near-black with warm brown undertone
  surface:     '#1A1108',   // deep warm dark — card backgrounds
  surface2:    '#2A1F12',   // elevated surfaces
  red:         '#8B1A0E',   // deep cinematic red — primary accent
  orange:      '#C4581A',   // burnt orange — secondary accent
  teal:        '#1A3A3A',   // muted teal — used sparingly
  text:        '#F2EBD9',   // warm off-white
  textMuted:   '#8A7A65',   // warm grey — secondary text
  pink:        '#D4506A',   // desaturated dusty rose
  border:      'rgba(242,235,217,0.08)',
  borderLight: 'rgba(242,235,217,0.14)',
};

// Font family names (loaded via @expo-google-fonts)
export const F = {
  heading:   'BebasNeue_400Regular',     // structural headings, all-caps
  script:    'DancingScript_700Bold',    // logo/wordmark only
  body:      'Inter_400Regular',         // all body copy
  semibold:  'Inter_600SemiBold',        // buttons, labels
  bold:      'Inter_700Bold',            // emphasis
};

// Keep legacy export shape so existing imports don't break
export const Colors = {
  light: {
    text: C.text,
    background: C.bg,
    tint: C.orange,
    icon: C.textMuted,
    tabIconDefault: C.textMuted,
    tabIconSelected: C.orange,
  },
  dark: {
    text: C.text,
    background: C.bg,
    tint: C.orange,
    icon: C.textMuted,
    tabIconDefault: C.textMuted,
    tabIconSelected: C.orange,
  },
};

export const Fonts = {
  sans: F.body,
  serif: F.script,
  rounded: F.heading,
  mono: 'monospace',
};
