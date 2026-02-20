import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Button, Card, SectionHeader } from '../../components/common';
import { DAYS_OF_WEEK, TIME_SLOTS } from '../../constants';

type DaySchedule = {
  enabled: boolean;
  start: string;
  end: string;
};

const DEFAULT_SCHEDULE: Record<string, DaySchedule> = {
  Sunday: { enabled: false, start: '09:00', end: '18:00' },
  Monday: { enabled: true, start: '09:00', end: '18:00' },
  Tuesday: { enabled: true, start: '09:00', end: '18:00' },
  Wednesday: { enabled: true, start: '09:00', end: '18:00' },
  Thursday: { enabled: true, start: '09:00', end: '20:00' },
  Friday: { enabled: true, start: '09:00', end: '18:00' },
  Saturday: { enabled: true, start: '09:00', end: '16:00' },
};

export function ProviderScheduleScreen() {
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [bufferMins, setBufferMins] = useState(15);
  const [advanceNotice, setAdvanceNotice] = useState(2);

  function toggleDay(day: string) {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
  }

  function setDayTime(day: string, field: 'start' | 'end', value: string) {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  }

  function formatTime(time: string) {
    const slot = TIME_SLOTS.find((s) => s.value === time);
    return slot?.label || time;
  }

  function handleSave() {
    Alert.alert('Schedule Saved', 'Your availability has been updated. Clients can now book during these hours.');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Schedule</Text>
        <Text style={styles.subtitle}>Set your weekly availability</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Weekly Availability" />
        <Card style={styles.scheduleCard}>
          {DAYS_OF_WEEK.map((day) => {
            const slot = schedule[day];
            return (
              <View key={day} style={styles.dayRow}>
                <TouchableOpacity
                  style={styles.dayToggle}
                  onPress={() => toggleDay(day)}
                >
                  <View style={[styles.toggle, slot.enabled && styles.toggle_on]}>
                    <View style={[styles.toggleKnob, slot.enabled && styles.toggleKnob_on]} />
                  </View>
                  <Text style={[styles.dayName, !slot.enabled && styles.dayName_off]}>
                    {day.slice(0, 3)}
                  </Text>
                </TouchableOpacity>

                {slot.enabled ? (
                  <View style={styles.timeRange}>
                    <TouchableOpacity
                      style={styles.timeBtn}
                      onPress={() =>
                        Alert.alert(
                          'Set Start Time',
                          undefined,
                          TIME_SLOTS.slice(0, 12).map((t) => ({
                            text: t.label,
                            onPress: () => setDayTime(day, 'start', t.value),
                          }))
                        )
                      }
                    >
                      <Text style={styles.timeBtnText}>{formatTime(slot.start)}</Text>
                    </TouchableOpacity>
                    <Text style={styles.timeSep}>—</Text>
                    <TouchableOpacity
                      style={styles.timeBtn}
                      onPress={() =>
                        Alert.alert(
                          'Set End Time',
                          undefined,
                          TIME_SLOTS.slice(8).map((t) => ({
                            text: t.label,
                            onPress: () => setDayTime(day, 'end', t.value),
                          }))
                        )
                      }
                    >
                      <Text style={styles.timeBtnText}>{formatTime(slot.end)}</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.offText}>Off</Text>
                )}
              </View>
            );
          })}
        </Card>

        <SectionHeader title="Buffer & Advance Notice" style={styles.sectionGap} />
        <Card>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Buffer Between Appointments</Text>
              <Text style={styles.settingDesc}>Time between back-to-back bookings</Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity style={styles.stepBtn} onPress={() => setBufferMins((b) => Math.max(0, b - 15))}>
                <Text style={styles.stepBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.stepValue}>{bufferMins}m</Text>
              <TouchableOpacity style={styles.stepBtn} onPress={() => setBufferMins((b) => Math.min(60, b + 15))}>
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Advance Notice Required</Text>
              <Text style={styles.settingDesc}>Minimum notice before same-day bookings</Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity style={styles.stepBtn} onPress={() => setAdvanceNotice((a) => Math.max(1, a - 1))}>
                <Text style={styles.stepBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.stepValue}>{advanceNotice}h</Text>
              <TouchableOpacity style={styles.stepBtn} onPress={() => setAdvanceNotice((a) => Math.min(48, a + 1))}>
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        <Button label="Save Schedule" onPress={handleSave} size="lg" style={styles.saveBtn} />

        <View style={{ height: Spacing['2xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.base, paddingBottom: Spacing.sm },
  title: { fontSize: Typography.sizes['2xl'], fontWeight: Typography.weights.extrabold, color: Colors.textPrimary },
  subtitle: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  scroll: { padding: Spacing.base, gap: Spacing.base, paddingBottom: Spacing['3xl'] },
  scheduleCard: { gap: 0, padding: 0, overflow: 'hidden' },
  dayRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  dayToggle: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, width: 80 },
  toggle: {
    width: 40, height: 22, borderRadius: 11,
    backgroundColor: Colors.surfaceAlt, padding: 2,
    justifyContent: 'center',
  },
  toggle_on: { backgroundColor: Colors.primary },
  toggleKnob: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.textMuted,
  },
  toggleKnob_on: { backgroundColor: Colors.white, alignSelf: 'flex-end' },
  dayName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },
  dayName_off: { color: Colors.textMuted },
  timeRange: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  timeBtn: {
    backgroundColor: Colors.surfaceAlt, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
  },
  timeBtnText: { fontSize: Typography.sizes.sm, color: Colors.textPrimary, fontWeight: Typography.weights.medium },
  timeSep: { color: Colors.textMuted },
  offText: { fontSize: Typography.sizes.sm, color: Colors.textMuted },
  sectionGap: { marginTop: Spacing.md },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.md },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.medium, color: Colors.textPrimary },
  settingDesc: { fontSize: Typography.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  stepBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  stepBtnText: { fontSize: 20, color: Colors.textPrimary },
  stepValue: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary, minWidth: 40, textAlign: 'center' },
  settingDivider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  saveBtn: { marginTop: Spacing.md },
});
