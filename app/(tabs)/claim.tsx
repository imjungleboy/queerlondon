import { useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, F } from '@/constants/theme';

type FormData = {
  venueName: string;
  ownerName: string;
  email: string;
  phone: string;
  instagram: string;
  website: string;
  address: string;
  message: string;
};

const EMPTY: FormData = {
  venueName: '',
  ownerName: '',
  email: '',
  phone: '',
  instagram: '',
  website: '',
  address: '',
  message: '',
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'url';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMulti]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={C.textMuted}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize="none"
        autoCorrect={false}
        cursorColor={C.orange}
        selectionColor={C.orange}
      />
    </View>
  );
}

export default function ClaimScreen() {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  function set(key: keyof FormData) {
    return (v: string) => setForm((f) => ({ ...f, [key]: v }));
  }

  function handleSubmit() {
    if (!form.venueName || !form.email || !form.ownerName) {
      Alert.alert('Missing fields', 'Please fill in venue name, your name and email address.');
      return;
    }

    // Build a mailto link with all form data
    const subject = encodeURIComponent(`Venue Claim: ${form.venueName}`);
    const body = encodeURIComponent(
      `Venue Name: ${form.venueName}\n` +
        `Owner / Manager: ${form.ownerName}\n` +
        `Email: ${form.email}\n` +
        `Phone: ${form.phone}\n` +
        `Instagram: ${form.instagram}\n` +
        `Website: ${form.website}\n` +
        `Address: ${form.address}\n\n` +
        `Additional info:\n${form.message}`
    );
    Linking.openURL(`mailto:hello@queerlondon.app?subject=${subject}&body=${body}`);
    setSubmitted(true);
  }

  function handleReset() {
    setForm(EMPTY);
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <View style={[styles.container, styles.successWrap]}>
        <Text style={styles.successIcon}>✦</Text>
        <Text style={styles.successTitle}>CLAIM SUBMITTED</Text>
        <Text style={styles.successBody}>
          Your email client should have opened with the details pre-filled. Send it to complete
          your claim. We'll review it and get back to you within 3–5 working days.
        </Text>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Text style={styles.resetBtnText}>Submit another claim</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20 }]}>

        <Text style={styles.pageTitle}>CLAIM YOUR VENUE</Text>
        <Text style={styles.pageSubtitle}>
          Are you the owner or manager of a queer venue in London? Get your space listed, add
          photos, update opening hours and manage your profile.
        </Text>

        <View style={styles.accentLine} />

        {/* What you get */}
        <View style={styles.benefits}>
          {[
            'Verified listing badge',
            'Upload venue photos',
            'Control opening hours & description',
            'Pin your Instagram & website',
            'Feature in curated collections',
          ].map((b) => (
            <View key={b} style={styles.benefit}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.formSection}>VENUE DETAILS</Text>

          <Field label="Venue name *" value={form.venueName} onChange={set('venueName')} placeholder="e.g. The Glory" />
          <Field label="Address" value={form.address} onChange={set('address')} placeholder="Full address incl. postcode" />
          <Field label="Instagram handle" value={form.instagram} onChange={set('instagram')} placeholder="@yourhandle" />
          <Field label="Website" value={form.website} onChange={set('website')} placeholder="https://" keyboardType="url" />

          <Text style={[styles.formSection, { marginTop: 16 }]}>YOUR DETAILS</Text>

          <Field label="Your name *" value={form.ownerName} onChange={set('ownerName')} placeholder="Full name" />
          <Field label="Email address *" value={form.email} onChange={set('email')} placeholder="your@email.com" keyboardType="email-address" />
          <Field label="Phone (optional)" value={form.phone} onChange={set('phone')} placeholder="+44..." keyboardType="phone-pad" />

          <Field
            label="Anything else?"
            value={form.message}
            onChange={set('message')}
            placeholder="Tell us about your venue, any special requirements..."
            multiline
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>SUBMIT CLAIM</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            By submitting you confirm you are authorised to represent this venue. We verify all
            claims before granting access.
          </Text>
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
    paddingHorizontal: 16,
    paddingBottom: 60,
    gap: 16,
  },

  pageTitle: {
    fontFamily: F.heading,
    fontSize: 36,
    color: C.text,
    letterSpacing: 3,
    lineHeight: 38,
  },
  pageSubtitle: {
    fontFamily: F.body,
    fontSize: 13,
    color: C.textMuted,
    lineHeight: 20,
    marginTop: -4,
  },
  accentLine: {
    height: 2,
    width: 40,
    backgroundColor: C.red,
    borderRadius: 1,
  },

  benefits: {
    backgroundColor: C.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    gap: 10,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.orange,
  },
  benefitText: {
    fontFamily: F.body,
    fontSize: 13,
    color: C.text,
  },

  form: {
    gap: 12,
  },
  formSection: {
    fontFamily: F.heading,
    fontSize: 13,
    color: C.textMuted,
    letterSpacing: 3,
    marginBottom: -4,
  },

  field: {
    gap: 6,
  },
  label: {
    fontFamily: F.semibold,
    fontSize: 12,
    color: C.textMuted,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: F.body,
    fontSize: 14,
    color: C.text,
  },
  inputMulti: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },

  submitBtn: {
    backgroundColor: C.red,
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    fontFamily: F.heading,
    fontSize: 18,
    color: C.text,
    letterSpacing: 3,
  },

  disclaimer: {
    fontFamily: F.body,
    fontSize: 11,
    color: C.textMuted,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: -4,
  },

  // ── Success ──
  successWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  successIcon: {
    fontSize: 48,
    color: C.orange,
  },
  successTitle: {
    fontFamily: F.heading,
    fontSize: 32,
    color: C.text,
    letterSpacing: 4,
    textAlign: 'center',
  },
  successBody: {
    fontFamily: F.body,
    fontSize: 14,
    color: C.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  resetBtn: {
    borderWidth: 1,
    borderColor: C.borderLight,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
    marginTop: 8,
  },
  resetBtnText: {
    fontFamily: F.semibold,
    fontSize: 13,
    color: C.textMuted,
  },
});
