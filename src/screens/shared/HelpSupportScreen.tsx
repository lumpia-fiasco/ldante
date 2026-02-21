import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert, Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { ScreenHeader } from '../../components/common';
import { RootStackParamList } from '../../navigation';
import {
  IconArrowLeft, IconChevronDown, IconChevronUp,
  IconMail, IconMessageCircle, IconStar,
} from '@tabler/icons-react-native';

type Nav = StackNavigationProp<RootStackParamList>;

const FAQ_ITEMS = [
  {
    q: 'How do I find providers through friends?',
    a: 'Go to the Friends tab on the Discover screen, tap on a friend\'s profile, and browse their provider list. Providers endorsed by your network appear highlighted in search results.',
  },
  {
    q: 'How do ratings work?',
    a: 'After each completed appointment you can rate your provider on Quality, Friendliness, Expertise, and Location. CROWND uses advanced weighting to ensure ratings reflect genuine experiences — accounts with unusual rating patterns are weighted accordingly.',
  },
  {
    q: 'Can I connect my calendar?',
    a: 'Yes! In the Bookings tab, tap "Connect Calendar" to link your device calendar. CROWND uses your free/busy times to suggest the best appointment slots, without reading the content of your events.',
  },
  {
    q: 'How do I add a provider to my Rolodex?',
    a: 'In the Services tab, tap "Add Provider" and search by name or phone number. You can also tap "Pick from Contacts" to find providers in your address book. If they\'re not on CROWND yet, you can send them an invite.',
  },
  {
    q: 'How do I cancel a booking?',
    a: 'Go to My Bookings, find the upcoming appointment, and tap "Cancel". Note that cancellations within 24 hours may be subject to provider cancellation policies.',
  },
  {
    q: 'Is my personal data safe?',
    a: 'CROWND never shares your personal information with third parties without your consent. Your calendar is accessed read-only for free/busy times only — event titles and details are never read. You can revoke any permission in Settings.',
  },
  {
    q: 'How do I switch between Customer and Provider views?',
    a: 'Go to your Profile and tap "Switch to Provider View" under the Provider section. If you\'re not registered as a provider, you\'ll be guided through the provider onboarding.',
  },
];

export function HelpSupportScreen() {
  const navigation = useNavigation<Nav>();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  function toggleFaq(i: number) {
    setExpandedIndex(expandedIndex === i ? null : i);
  }

  function handleSendFeedback() {
    if (!feedbackText.trim()) {
      Alert.alert('Empty message', 'Please write something before sending.');
      return;
    }
    Alert.alert('Thanks!', 'Your feedback has been sent. We\'ll get back to you within 1–2 business days.', [
      { text: 'OK', onPress: () => setFeedbackText('') },
    ]);
  }

  function handleEmail() {
    Linking.openURL('mailto:support@getcrownd.app?subject=CROWND%20Support%20Request');
  }

  function handleRateApp() {
    // Placeholder — would link to App Store listing
    Alert.alert('Rate CROWND', 'This will open the App Store to rate us. Thanks for the support! 👑');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Help & Support"
        leftIcon={<IconArrowLeft size={24} color={Colors.textPrimary} strokeWidth={1.75} />}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.card}>
            {FAQ_ITEMS.map((item, i) => (
              <View key={i}>
                <TouchableOpacity
                  style={styles.faqRow}
                  onPress={() => toggleFaq(i)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQ}>{item.q}</Text>
                  {expandedIndex === i
                    ? <IconChevronUp size={18} color={Colors.textMuted} strokeWidth={1.75} />
                    : <IconChevronDown size={18} color={Colors.textMuted} strokeWidth={1.75} />
                  }
                </TouchableOpacity>
                {expandedIndex === i && (
                  <Text style={styles.faqA}>{item.a}</Text>
                )}
                {i < FAQ_ITEMS.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Send Feedback */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send Feedback</Text>
          <View style={styles.card}>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Describe your question or issue..."
              placeholderTextColor={Colors.textMuted}
              value={feedbackText}
              onChangeText={setFeedbackText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSendFeedback} activeOpacity={0.8}>
              <IconMessageCircle size={18} color={Colors.white} strokeWidth={1.75} />
              <Text style={styles.sendBtnText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact & Rate */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.contactRow} onPress={handleEmail} activeOpacity={0.7}>
              <View style={styles.contactIcon}>
                <IconMail size={20} color={Colors.primary} strokeWidth={1.75} />
              </View>
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>Email Support</Text>
                <Text style={styles.contactSub}>support@getcrownd.app</Text>
              </View>
              <IconChevronDown size={16} color={Colors.textMuted} strokeWidth={1.75} style={{ transform: [{ rotate: '-90deg' }] }} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.contactRow} onPress={handleRateApp} activeOpacity={0.7}>
              <View style={styles.contactIcon}>
                <IconStar size={20} color={Colors.primary} strokeWidth={1.75} />
              </View>
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>Rate the App</Text>
                <Text style={styles.contactSub}>Let us know how we're doing</Text>
              </View>
              <IconChevronDown size={16} color={Colors.textMuted} strokeWidth={1.75} style={{ transform: [{ rotate: '-90deg' }] }} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>CROWND v1.0.0 · We typically respond within 1–2 business days</Text>
        <View style={{ height: Spacing['3xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, gap: Spacing.xl },
  section: { gap: Spacing.sm },
  sectionTitle: {
    fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold,
    color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5,
    paddingLeft: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border,
  },
  divider: { height: 1, backgroundColor: Colors.border },

  // FAQ
  faqRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    padding: Spacing.base,
  },
  faqQ: {
    flex: 1, fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary, lineHeight: 22,
  },
  faqA: {
    fontSize: Typography.sizes.sm, color: Colors.textSecondary, lineHeight: 20,
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.base,
  },

  // Feedback
  feedbackInput: {
    padding: Spacing.base, fontSize: Typography.sizes.base,
    color: Colors.textPrimary, minHeight: 100,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  sendBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, padding: Spacing.md,
    backgroundColor: Colors.primary, borderBottomLeftRadius: Radius.xl, borderBottomRightRadius: Radius.xl,
  },
  sendBtnText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.white },

  // Contact
  contactRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.base,
  },
  contactIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  contactText: { flex: 1 },
  contactLabel: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },
  contactSub: { fontSize: Typography.sizes.xs, color: Colors.textSecondary, marginTop: 2 },

  footer: {
    fontSize: Typography.sizes.xs, color: Colors.textMuted,
    textAlign: 'center', marginTop: Spacing.sm,
  },
});
