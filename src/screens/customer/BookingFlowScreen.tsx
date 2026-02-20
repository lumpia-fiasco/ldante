import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Button, Avatar, ScreenHeader, Card } from '../../components/common';
import { RootStackParamList } from '../../navigation';
import { Service } from '../../types';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'BookingFlow'>;
  route: RouteProp<RootStackParamList, 'BookingFlow'>;
};

type Step = 'service' | 'date' | 'time' | 'confirm';

// Mock data
const MOCK_SERVICES: Service[] = [
  { id: 's1', provider_id: '1', name: 'Full Color', description: 'Single process color from roots to ends', duration_minutes: 120, price_cents: 18000, category: 'hair', is_active: true },
  { id: 's2', provider_id: '1', name: 'Balayage', description: 'Hand-painted highlights for natural sun-kissed look', duration_minutes: 150, price_cents: 25000, category: 'hair', is_active: true },
  { id: 's3', provider_id: '1', name: 'Cut & Blowout', description: 'Precision haircut with blowout styling', duration_minutes: 60, price_cents: 8500, category: 'hair', is_active: true },
];

const MOCK_TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '11:00 AM', '11:30 AM',
  '1:00 PM', '1:30 PM', '2:00 PM', '3:00 PM', '4:00 PM',
];

function generateCalendar() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export function BookingFlowScreen({ navigation, route }: Props) {
  const { providerId, serviceId } = route.params;
  const [step, setStep] = useState<Step>(serviceId ? 'date' : 'service');
  const [selectedService, setSelectedService] = useState<Service | null>(
    serviceId ? MOCK_SERVICES.find((s) => s.id === serviceId) || null : null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const calendarDates = generateCalendar();

  async function handleConfirm() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    Alert.alert(
      'Booking Requested! 🎉',
      `Your appointment with Jessica Williams has been requested for ${selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${selectedTime}. You'll be notified when it's confirmed.`,
      [
        {
          text: 'View Bookings',
          onPress: () => navigation.reset({ index: 0, routes: [{ name: 'CustomerTabs' }] }),
        },
      ]
    );
  }

  const stepIndex = ['service', 'date', 'time', 'confirm'].indexOf(step);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Book Appointment"
        leftIcon={<Text style={styles.closeIcon}>✕</Text>}
        onLeftPress={() => navigation.goBack()}
      />

      {/* Step indicator */}
      <View style={styles.steps}>
        {(['service', 'date', 'time', 'confirm'] as Step[]).map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepDot, i <= stepIndex && styles.stepDot_active]}>
              <Text style={[styles.stepNum, i <= stepIndex && styles.stepNum_active]}>
                {i + 1}
              </Text>
            </View>
            {i < 3 && (
              <View style={[styles.stepLine, i < stepIndex && styles.stepLine_active]} />
            )}
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Step 1: Service Selection */}
        {step === 'service' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Choose a Service</Text>
            <View style={styles.services}>
              {MOCK_SERVICES.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceCard,
                    selectedService?.id === service.id && styles.serviceCard_selected,
                  ]}
                  onPress={() => setSelectedService(service)}
                  activeOpacity={0.8}
                >
                  <View style={styles.serviceLeft}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceDesc}>{service.description}</Text>
                    <Text style={styles.serviceDuration}>⏱ {service.duration_minutes} min</Text>
                  </View>
                  <View style={styles.serviceRight}>
                    <Text style={styles.servicePrice}>
                      ${(service.price_cents / 100).toFixed(0)}
                    </Text>
                    <View
                      style={[
                        styles.radio,
                        selectedService?.id === service.id && styles.radio_active,
                      ]}
                    >
                      {selectedService?.id === service.id && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 2: Date Selection */}
        {step === 'date' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Choose a Date</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.calendarScroll}
            >
              {calendarDates.map((date, i) => {
                const isSelected =
                  selectedDate?.toDateString() === date.toDateString();
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = date.getDate();
                const isToday = i === 0;
                return (
                  <TouchableOpacity
                    key={date.toISOString()}
                    style={[styles.dateCard, isSelected && styles.dateCard_selected]}
                    onPress={() => setSelectedDate(date)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.dayName, isSelected && styles.dayName_selected]}>
                      {isToday ? 'Today' : dayName}
                    </Text>
                    <Text style={[styles.dayNum, isSelected && styles.dayNum_selected]}>
                      {dayNum}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Step 3: Time Selection */}
        {step === 'time' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>
              Available Times — {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
            <View style={styles.timeGrid}>
              {MOCK_TIME_SLOTS.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.timeSlot_selected,
                  ]}
                  onPress={() => setSelectedTime(time)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.timeText,
                      selectedTime === time && styles.timeText_selected,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 4: Confirm */}
        {step === 'confirm' && selectedService && selectedDate && selectedTime && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Review & Confirm</Text>

            <Card style={styles.confirmCard}>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Provider</Text>
                <View style={styles.confirmProvider}>
                  <Avatar name="Jessica Williams" size={28} />
                  <Text style={styles.confirmValue}>Jessica Williams</Text>
                </View>
              </View>

              <View style={styles.confirmDivider} />

              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Service</Text>
                <Text style={styles.confirmValue}>{selectedService.name}</Text>
              </View>

              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Duration</Text>
                <Text style={styles.confirmValue}>{selectedService.duration_minutes} min</Text>
              </View>

              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Date</Text>
                <Text style={styles.confirmValue}>
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>

              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Time</Text>
                <Text style={styles.confirmValue}>{selectedTime}</Text>
              </View>

              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Location</Text>
                <Text style={styles.confirmValue}>Luxe Loft Suites, Suite 8</Text>
              </View>

              <View style={styles.confirmDivider} />

              <View style={styles.confirmRow}>
                <Text style={[styles.confirmLabel, styles.totalLabel]}>Total</Text>
                <Text style={styles.totalValue}>
                  ${(selectedService.price_cents / 100).toFixed(2)}
                </Text>
              </View>
            </Card>

            {/* Notes */}
            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Notes for Jessica (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="e.g. First time visit, interested in balayage..."
                placeholderTextColor={Colors.textMuted}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                maxLength={300}
              />
              <Text style={styles.notesCount}>{notes.length}/300</Text>
            </View>

            <View style={styles.policyNote}>
              <Text style={styles.policyText}>
                ℹ️ Cancellation must be made 24+ hours in advance. Late cancellations may be flagged on your account.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          label={
            step === 'service'
              ? 'Choose Date'
              : step === 'date'
              ? 'Choose Time'
              : step === 'time'
              ? 'Review Booking'
              : 'Confirm Booking'
          }
          onPress={() => {
            if (step === 'service') {
              if (!selectedService) {
                Alert.alert('Please select a service');
                return;
              }
              setStep('date');
            } else if (step === 'date') {
              if (!selectedDate) {
                Alert.alert('Please select a date');
                return;
              }
              setStep('time');
            } else if (step === 'time') {
              if (!selectedTime) {
                Alert.alert('Please select a time');
                return;
              }
              setStep('confirm');
            } else {
              handleConfirm();
            }
          }}
          loading={loading}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  closeIcon: { fontSize: 20, color: Colors.textPrimary },
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.base,
  },
  stepItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDot_active: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepNum: { fontSize: Typography.sizes.sm, color: Colors.textMuted, fontWeight: Typography.weights.semibold },
  stepNum_active: { color: Colors.white },
  stepLine: { flex: 1, height: 2, backgroundColor: Colors.border, marginHorizontal: 4 },
  stepLine_active: { backgroundColor: Colors.primary },
  scroll: { padding: Spacing.base, paddingBottom: Spacing['3xl'] },
  stepContent: { gap: Spacing.xl },
  stepTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.textPrimary,
  },
  // Services
  services: { gap: Spacing.md },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: Spacing.base,
    alignItems: 'center',
  },
  serviceCard_selected: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}0D` },
  serviceLeft: { flex: 1, gap: 4 },
  serviceName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  serviceDesc: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  serviceDuration: { fontSize: Typography.sizes.xs, color: Colors.textMuted },
  serviceRight: { alignItems: 'flex-end', gap: Spacing.sm },
  servicePrice: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radio_active: { borderColor: Colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  // Calendar
  calendarScroll: { paddingVertical: Spacing.sm, gap: Spacing.sm },
  dateCard: {
    width: 60,
    height: 72,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dateCard_selected: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  dayName: { fontSize: Typography.sizes.xs, color: Colors.textMuted, fontWeight: Typography.weights.medium },
  dayName_selected: { color: Colors.white },
  dayNum: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  dayNum_selected: { color: Colors.white },
  // Time
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  timeSlot: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minWidth: 100,
    alignItems: 'center',
  },
  timeSlot_selected: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}15` },
  timeText: { fontSize: Typography.sizes.base, color: Colors.textSecondary, fontWeight: Typography.weights.medium },
  timeText_selected: { color: Colors.primary },
  // Confirm
  confirmCard: { gap: Spacing.md },
  confirmRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  confirmLabel: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  confirmProvider: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  confirmValue: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.medium, color: Colors.textPrimary },
  confirmDivider: { height: 1, backgroundColor: Colors.border },
  totalLabel: { fontWeight: Typography.weights.bold, color: Colors.textPrimary, fontSize: Typography.sizes.base },
  totalValue: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.extrabold, color: Colors.primary },
  notesSection: { gap: Spacing.sm },
  notesLabel: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.medium, color: Colors.textSecondary },
  notesInput: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  notesCount: { fontSize: Typography.sizes.xs, color: Colors.textMuted, textAlign: 'right' },
  policyNote: {
    backgroundColor: `${Colors.warning}15`,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  policyText: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, lineHeight: 20 },
  footer: { padding: Spacing.base, paddingBottom: Spacing.xl },
});
