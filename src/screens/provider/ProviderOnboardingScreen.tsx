import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Button, Input, Chip, ScreenHeader } from '../../components/common';
import { SERVICE_CATEGORIES, SPECIALTY_TAGS } from '../../constants';
import { RootStackParamList } from '../../navigation';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ProviderOnboarding'>;
};

export function ProviderOnboardingScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const [bio, setBio] = useState('');
  const [yearsExp, setYearsExp] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [instagram, setInstagram] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [locationState, setLocationState] = useState('');
  const [autoAccept, setAutoAccept] = useState(true);

  const steps = [
    { title: 'Tell Us About You', subtitle: 'Build your professional profile' },
    { title: 'Your Services', subtitle: 'What do you specialize in?' },
    { title: 'Your Location', subtitle: 'Where do you work?' },
    { title: 'Booking Settings', subtitle: 'How do you prefer to manage appointments?' },
  ];

  const progress = ((step + 1) / steps.length) * 100;

  function toggleCategory(key: string) {
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  }

  function toggleSpecialty(tag: string) {
    setSelectedSpecialties((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleFinish() {
    navigation.reset({ index: 0, routes: [{ name: 'ProviderTabs' }] });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={`Step ${step + 1} of ${steps.length}`}
        leftIcon={step > 0 ? <Text style={styles.back}>←</Text> : undefined}
        onLeftPress={step > 0 ? () => setStep((s) => s - 1) : undefined}
      />
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.headline}>{steps[step].title}</Text>
        <Text style={styles.subheadline}>{steps[step].subtitle}</Text>

        {step === 0 && (
          <View style={styles.section}>
            <Input
              label="Bio (500 chars)"
              placeholder="Tell clients about your experience, style, and what makes you unique..."
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Input
              label="Years of Experience"
              placeholder="e.g. 8"
              value={yearsExp}
              onChangeText={setYearsExp}
              keyboardType="number-pad"
            />
            <Input
              label="Instagram Handle (Optional)"
              placeholder="@yourusername"
              value={instagram}
              onChangeText={setInstagram}
              autoCapitalize="none"
            />
          </View>
        )}

        {step === 1 && (
          <View style={styles.section}>
            <Text style={styles.label}>Service Categories *</Text>
            <View style={styles.grid}>
              {SERVICE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[styles.catCard, selectedCategories.includes(cat.key) && styles.catCard_selected]}
                  onPress={() => toggleCategory(cat.key)}
                >
                  <Text style={styles.catEmoji}>{cat.icon}</Text>
                  <Text style={[styles.catLabel, selectedCategories.includes(cat.key) && styles.catLabel_selected]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Specialty Tags</Text>
            <View style={styles.tags}>
              {SPECIALTY_TAGS.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  selected={selectedSpecialties.includes(tag)}
                  onPress={() => toggleSpecialty(tag)}
                />
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.section}>
            <Input label="Establishment Name" placeholder="e.g. Luxe Loft Suites" value={locationName} onChangeText={setLocationName} />
            <Input label="Street Address" placeholder="123 Main Street, Suite 5" value={locationAddress} onChangeText={setLocationAddress} />
            <Input label="City" placeholder="Chicago" value={locationCity} onChangeText={setLocationCity} />
            <Input label="State" placeholder="IL" value={locationState} onChangeText={setLocationState} />
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                📍 You can add multiple locations and update them anytime. Followers will be notified when you move.
              </Text>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.section}>
            <Text style={styles.label}>Booking Approval</Text>
            {[
              { value: true, title: 'Auto-Accept', desc: 'Bookings are automatically confirmed (Recommended)' },
              { value: false, title: 'Manual Approval', desc: 'Review and approve each booking request individually' },
            ].map((opt) => (
              <TouchableOpacity
                key={String(opt.value)}
                style={[styles.optCard, autoAccept === opt.value && styles.optCard_selected]}
                onPress={() => setAutoAccept(opt.value)}
              >
                <View style={[styles.optRadio, autoAccept === opt.value && styles.optRadio_active]}>
                  {autoAccept === opt.value && <View style={styles.optRadioInner} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optTitle}>{opt.title}</Text>
                  <Text style={styles.optDesc}>{opt.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                💡 You can always adjust these settings from your provider dashboard.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={step === steps.length - 1 ? 'Launch My Profile' : 'Continue'}
          onPress={() => {
            if (step === 1 && selectedCategories.length === 0) {
              Alert.alert('Please select at least one service category');
              return;
            }
            if (step < steps.length - 1) setStep((s) => s + 1);
            else handleFinish();
          }}
          size="lg"
        />
        <Button label="Skip" onPress={() => {
          if (step < steps.length - 1) setStep((s) => s + 1);
          else handleFinish();
        }} variant="ghost" size="sm" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  progressBar: { height: 3, backgroundColor: Colors.border },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: Radius.full },
  back: { fontSize: 22, color: Colors.textPrimary },
  scroll: { padding: Spacing['2xl'], gap: Spacing.xl },
  headline: { fontSize: Typography.sizes['2xl'], fontWeight: Typography.weights.extrabold, color: Colors.textPrimary },
  subheadline: { fontSize: Typography.sizes.base, color: Colors.textSecondary, marginTop: -Spacing.md },
  section: { gap: Spacing.base },
  label: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  catCard: {
    width: '30%', aspectRatio: 1, backgroundColor: Colors.surface,
    borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, borderWidth: 2, borderColor: Colors.border,
  },
  catCard_selected: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}15` },
  catEmoji: { fontSize: 28 },
  catLabel: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, textAlign: 'center' },
  catLabel_selected: { color: Colors.primary },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  infoBox: { backgroundColor: `${Colors.info}15`, borderRadius: Radius.md, padding: Spacing.md },
  infoText: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, lineHeight: 20 },
  optCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base,
    borderWidth: 2, borderColor: Colors.border,
  },
  optCard_selected: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}08` },
  optRadio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  optRadio_active: { borderColor: Colors.primary },
  optRadioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  optTitle: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  optDesc: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, marginTop: 2 },
  footer: { padding: Spacing['2xl'], paddingTop: Spacing.sm, gap: Spacing.sm },
});
