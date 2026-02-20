import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Button, Chip, ScreenHeader } from '../../components/common';
import { SERVICE_CATEGORIES, STYLE_PREFERENCES, PRIORITY_FACTORS, AGE_RANGES } from '../../constants';
import { RootStackParamList } from '../../navigation';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'CustomerOnboarding'>;
};

export function CustomerOnboardingScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [stylePrefs, setStylePrefs] = useState<Record<string, string>>({});
  const [priorities, setPriorities] = useState<Record<string, number>>(
    Object.fromEntries(PRIORITY_FACTORS.map((f) => [f.key, f.defaultWeight]))
  );
  const [ageRange, setAgeRange] = useState('');

  const steps = [
    { title: 'Services You Use', subtitle: 'Select all that apply' },
    { title: 'Your Style Preferences', subtitle: 'Help us find your perfect match' },
    { title: 'What Matters Most?', subtitle: 'Drag to set your priorities' },
    { title: 'About You', subtitle: 'Optional — improves recommendations' },
  ];

  function toggleCategory(key: string) {
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  }

  function setStylePref(category: string, style: string) {
    setStylePrefs((prev) => ({ ...prev, [category]: style }));
  }

  function handlePriorityChange(key: string, value: number) {
    setPriorities((prev) => ({ ...prev, [key]: value }));
  }

  function handleNext() {
    if (step === 0 && selectedCategories.length === 0) {
      Alert.alert('Select at least one service');
      return;
    }
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleFinish();
    }
  }

  async function handleFinish() {
    navigation.reset({ index: 0, routes: [{ name: 'CustomerTabs' }] });
  }

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={`Step ${step + 1} of ${steps.length}`}
        leftIcon={
          step > 0 ? (
            <Text style={styles.backIcon}>←</Text>
          ) : undefined
        }
        onLeftPress={step > 0 ? () => setStep((s) => s - 1) : undefined}
      />

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.headline}>{steps[step].title}</Text>
        <Text style={styles.subheadline}>{steps[step].subtitle}</Text>

        {step === 0 && (
          <View style={styles.grid}>
            {SERVICE_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryCard,
                  selectedCategories.includes(cat.key) && styles.categoryCard_selected,
                ]}
                onPress={() => toggleCategory(cat.key)}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryLabel,
                    selectedCategories.includes(cat.key) && styles.categoryLabel_selected,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 1 && (
          <View style={styles.stylePrefs}>
            {selectedCategories
              .filter((c) => STYLE_PREFERENCES[c as keyof typeof STYLE_PREFERENCES])
              .map((cat) => (
                <View key={cat} style={styles.stylePrefGroup}>
                  <Text style={styles.stylePrefCategory}>
                    {SERVICE_CATEGORIES.find((c) => c.key === cat)?.icon}{' '}
                    {SERVICE_CATEGORIES.find((c) => c.key === cat)?.label}
                  </Text>
                  <View style={styles.chips}>
                    {(STYLE_PREFERENCES[cat as keyof typeof STYLE_PREFERENCES] || []).map(
                      (pref) => (
                        <Chip
                          key={pref.key}
                          label={pref.label}
                          selected={stylePrefs[cat] === pref.key}
                          onPress={() => setStylePref(cat, pref.key)}
                        />
                      )
                    )}
                  </View>
                </View>
              ))}
            {selectedCategories.filter(
              (c) => STYLE_PREFERENCES[c as keyof typeof STYLE_PREFERENCES]
            ).length === 0 && (
              <Text style={styles.noPrefs}>
                No specific style preferences for your selected services.
              </Text>
            )}
          </View>
        )}

        {step === 2 && (
          <View style={styles.priorities}>
            {PRIORITY_FACTORS.map((factor) => (
              <View key={factor.key} style={styles.priorityRow}>
                <View style={styles.priorityHeader}>
                  <Text style={styles.priorityIcon}>{factor.icon}</Text>
                  <Text style={styles.priorityLabel}>{factor.label}</Text>
                  <Text style={styles.priorityValue}>{priorities[factor.key]}%</Text>
                </View>
                <View style={styles.sliderTrack}>
                  <TouchableOpacity
                    style={[
                      styles.sliderFill,
                      { width: `${priorities[factor.key]}%` },
                    ]}
                    activeOpacity={1}
                  />
                  {/* Simple tap-to-set buttons */}
                  <View style={styles.sliderButtons}>
                    {[0, 25, 50, 75, 100].map((v) => (
                      <TouchableOpacity
                        key={v}
                        onPress={() => handlePriorityChange(factor.key, v)}
                        style={styles.sliderBtn}
                      />
                    ))}
                  </View>
                </View>
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>0%</Text>
                  <Text style={styles.sliderLabel}>50%</Text>
                  <Text style={styles.sliderLabel}>100%</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {step === 3 && (
          <View style={styles.aboutYou}>
            <Text style={styles.sectionLabel}>Age Range (Optional)</Text>
            <View style={styles.chips}>
              {AGE_RANGES.map((range) => (
                <Chip
                  key={range.key}
                  label={range.label}
                  selected={ageRange === range.key}
                  onPress={() => setAgeRange(range.key === ageRange ? '' : range.key)}
                />
              ))}
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <Text style={styles.infoText}>
                This information is used only to improve your rating recommendations. It's
                never shared publicly. You can skip this step.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={step === steps.length - 1 ? 'Start Discovering' : 'Continue'}
          onPress={handleNext}
          size="lg"
        />
        {step > 0 && (
          <Button
            label="Skip this step"
            onPress={handleNext}
            variant="ghost"
            size="sm"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  progressBar: {
    height: 3,
    backgroundColor: Colors.border,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  scroll: {
    padding: Spacing['2xl'],
    paddingBottom: Spacing.xl,
    gap: Spacing.xl,
  },
  headline: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.extrabold,
    color: Colors.textPrimary,
  },
  subheadline: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    marginTop: -Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  categoryCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  categoryCard_selected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}15`,
  },
  categoryEmoji: { fontSize: 32 },
  categoryLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
  },
  categoryLabel_selected: { color: Colors.primary },
  stylePrefs: { gap: Spacing.xl },
  stylePrefGroup: { gap: Spacing.md },
  stylePrefCategory: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  noPrefs: { color: Colors.textMuted, fontSize: Typography.sizes.base },
  priorities: { gap: Spacing.lg },
  priorityRow: { gap: Spacing.sm },
  priorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  priorityIcon: { fontSize: 18 },
  priorityLabel: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weights.medium,
  },
  priorityValue: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
    minWidth: 36,
    textAlign: 'right',
  },
  sliderTrack: {
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    overflow: 'hidden',
    position: 'relative',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  sliderButtons: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderBtn: { flex: 1, height: '100%' },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: { fontSize: Typography.sizes.xs, color: Colors.textMuted },
  aboutYou: { gap: Spacing.xl },
  sectionLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: `${Colors.info}15`,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  infoIcon: { fontSize: 20 },
  infoText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    padding: Spacing['2xl'],
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  backIcon: { fontSize: 22, color: Colors.textPrimary },
});
