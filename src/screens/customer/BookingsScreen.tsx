import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Avatar, Badge, Button, EmptyState } from '../../components/common';
import { Booking, BookingStatus } from '../../types';
import { RootStackParamList } from '../../navigation';
import {
  IconCalendar,
  IconClock,
  IconMapPin,
  IconCurrencyDollar,
  IconHourglass,
  IconCheck,
  IconCircleCheck,
  IconX,
  IconAlertTriangle,
  IconCalendarPlus,
  IconCalendarCheck,
  IconBolt,
} from '@tabler/icons-react-native';
import * as Calendar from 'expo-calendar';

type Nav = StackNavigationProp<RootStackParamList>;

// ─── Rating Guardrail Note ─────────────────────────────────────────────────────
// Scoring uses a weighted model to protect providers from malicious reviewers.
// See: src/utils/ratingGuardrail.ts for the full algorithm.
// High-level: if a user's average submitted rating is >1.5σ below the
// population mean AND they have submitted >10 ratings, their ratings receive a
// reduced weight (min 0.2). This is applied server-side when computing provider
// displayed scores so individual users are unaware of any downweighting.

// ─── Mock Bookings ─────────────────────────────────────────────────────────────

const MOCK_BOOKINGS: (Booking & { providerName: string; serviceName: string; locationName: string })[] = [
  {
    id: 'b1', customer_id: 'cu1', provider_id: '1', service_id: 's2', location_id: 'l1',
    status: 'confirmed', start_time: '2026-02-25T14:00:00', end_time: '2026-02-25T16:30:00',
    price_cents: 25000, created_at: '2026-02-19',
    providerName: 'Jessica Williams', serviceName: 'Balayage', locationName: 'Luxe Loft Suites',
  },
  {
    id: 'b2', customer_id: 'cu1', provider_id: '2', service_id: 's4', location_id: 'l2',
    status: 'confirmed', start_time: '2026-03-02T10:00:00', end_time: '2026-03-02T11:00:00',
    price_cents: 9500, created_at: '2026-02-15',
    providerName: 'Marcus Thompson', serviceName: '60-min Deep Tissue', locationName: 'Wellness Studio',
  },
  {
    id: 'b3', customer_id: 'cu1', provider_id: '3', service_id: 's6', location_id: 'l3',
    status: 'completed', start_time: '2026-01-15T13:00:00', end_time: '2026-01-15T14:00:00',
    price_cents: 6500, created_at: '2026-01-10',
    providerName: 'Nina Patel', serviceName: 'Gel Manicure', locationName: 'Studio Glow',
  },
  {
    id: 'b4', customer_id: 'cu1', provider_id: '1', service_id: 's1', location_id: 'l1',
    status: 'cancelled', start_time: '2026-01-05T11:00:00', end_time: '2026-01-05T13:00:00',
    price_cents: 18000, created_at: '2025-12-20',
    providerName: 'Jessica Williams', serviceName: 'Full Color', locationName: 'Luxe Loft Suites',
  },
];

const STATUS_CONFIG: Record<BookingStatus, { label: string; variant: any; icon: React.ReactNode }> = {
  requested: { label: 'Pending', variant: 'warning', icon: <IconHourglass size={14} color={Colors.textPrimary} strokeWidth={1.75} /> },
  confirmed: { label: 'Confirmed', variant: 'success', icon: <IconCheck size={14} color={Colors.textPrimary} strokeWidth={2} /> },
  completed: { label: 'Completed', variant: 'neutral', icon: <IconCircleCheck size={14} color={Colors.textPrimary} strokeWidth={1.75} /> },
  cancelled: { label: 'Cancelled', variant: 'error', icon: <IconX size={14} color={Colors.textPrimary} strokeWidth={2} /> },
  no_show: { label: 'No Show', variant: 'error', icon: <IconAlertTriangle size={14} color={Colors.textPrimary} strokeWidth={1.75} /> },
};

type TabKey = 'upcoming' | 'past';

// ─── Calendar State Types ──────────────────────────────────────────────────────

type CalendarStatus = 'idle' | 'connecting' | 'connected' | 'denied';

interface BusySlot {
  start: Date;
  end: Date;
  title: string; // 'Busy' — we never show actual event titles for privacy
}

// ─── Main Screen ───────────────────────────────────────────────────────────────

export function BookingsScreen() {
  const navigation = useNavigation<Nav>();
  const [tab, setTab] = useState<TabKey>('upcoming');

  // Calendar state
  const [calStatus, setCalStatus] = useState<CalendarStatus>('idle');
  const [busySlots, setBusySlots] = useState<BusySlot[]>([]);
  const [freeSuggestions, setFreeSuggestions] = useState<Date[]>([]);

  const now = new Date();
  const upcoming = MOCK_BOOKINGS.filter(
    (b) => new Date(b.start_time) >= now && b.status !== 'cancelled'
  );
  const past = MOCK_BOOKINGS.filter(
    (b) => new Date(b.start_time) < now || b.status === 'cancelled' || b.status === 'completed'
  );

  const displayed = tab === 'upcoming' ? upcoming : past;

  function handleCancel(bookingId: string, name: string) {
    Alert.alert(
      'Cancel Appointment',
      `Are you sure you want to cancel your appointment with ${name}? Cancellations within 24 hours may affect your account.`,
      [
        { text: 'Keep Appointment', style: 'cancel' },
        { text: 'Cancel Appointment', style: 'destructive', onPress: () => {} },
      ]
    );
  }

  // ─── Smart Scheduling: Calendar Integration ──────────────────────────────────

  async function connectCalendar() {
    setCalStatus('connecting');
    try {
      // Request permission
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        setCalStatus('denied');
        Alert.alert(
          'Calendar Access Denied',
          'To use smart scheduling, allow CROWND to access your calendar in Settings → Privacy → Calendars.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get all calendars (read-only)
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

      // Fetch events for the next 30 days
      const rangeStart = new Date();
      const rangeEnd = new Date();
      rangeEnd.setDate(rangeEnd.getDate() + 30);

      const calendarIds = calendars.map(c => c.id);
      const events = await Calendar.getEventsAsync(calendarIds, rangeStart, rangeEnd);

      // Map to anonymous busy slots — we never store or display event titles
      const slots: BusySlot[] = events
        .filter(e => !e.allDay) // skip all-day events for scheduling purposes
        .map(e => ({
          start: new Date(e.startDate),
          end: new Date(e.endDate),
          title: 'Busy', // privacy: never show actual title
        }));

      setBusySlots(slots);

      // Generate free time suggestions (2-hour windows) in next 14 days
      const suggestions = findFreeSlots(slots, rangeStart, 14, 120);
      setFreeSuggestions(suggestions);

      setCalStatus('connected');
    } catch (err) {
      console.warn('Calendar connection error:', err);
      setCalStatus('idle');
      Alert.alert('Connection Error', 'Could not read your calendar. Please try again.');
    }
  }

  // Find N free 2-hour windows in the next `days` days avoiding busy slots and
  // outside typical appointment hours (8am–8pm). Returns suggested start times.
  function findFreeSlots(
    busy: BusySlot[],
    from: Date,
    days: number,
    windowMinutes: number,
    maxSuggestions = 5
  ): Date[] {
    const suggestions: Date[] = [];
    const cursor = new Date(from);
    // Start from the next half-hour
    cursor.setMinutes(cursor.getMinutes() < 30 ? 30 : 0);
    if (cursor.getMinutes() === 0) cursor.setHours(cursor.getHours() + 1);

    const endSearch = new Date(from);
    endSearch.setDate(endSearch.getDate() + days);

    while (cursor < endSearch && suggestions.length < maxSuggestions) {
      const h = cursor.getHours();
      // Only suggest slots between 8am and 6pm
      if (h >= 8 && h < 18) {
        const windowEnd = new Date(cursor.getTime() + windowMinutes * 60 * 1000);
        const overlaps = busy.some(
          slot => slot.start < windowEnd && slot.end > cursor
        );
        if (!overlaps) {
          suggestions.push(new Date(cursor));
        }
      }
      // Advance by 30 minutes
      cursor.setMinutes(cursor.getMinutes() + 30);
    }
    return suggestions;
  }

  function formatSuggestion(d: Date): string {
    return d.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
    }) + ' · ' + d.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      {/* ── Smart Scheduling Banner ── */}
      <SmartSchedulingBanner
        status={calStatus}
        freeSuggestions={freeSuggestions}
        busyCount={busySlots.length}
        onConnect={connectCalendar}
        formatSuggestion={formatSuggestion}
      />

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['upcoming', 'past'] as TabKey[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tab_active]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabText_active]}>
              {t === 'upcoming' ? `Upcoming (${upcoming.length})` : 'Past'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {displayed.length === 0 ? (
        <EmptyState
          icon={tab === 'upcoming' ? 'calendar' : 'clipboardList'}
          title={tab === 'upcoming' ? 'No upcoming appointments' : 'No past appointments'}
          message={
            tab === 'upcoming'
              ? 'Book an appointment with one of your trusted providers.'
              : 'Your completed appointments will appear here.'
          }
          action={tab === 'upcoming' ? 'Discover Providers' : undefined}
          onAction={() => navigation.navigate('CustomerTabs')}
        />
      ) : (
        <FlatList
          data={displayed}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const config = STATUS_CONFIG[item.status];
            const date = new Date(item.start_time);
            const isUpcoming = date >= now && item.status !== 'cancelled';
            const isCompleted = item.status === 'completed';

            // Check if this booking overlaps with a busy calendar slot
            const bookingEnd = new Date(item.end_time);
            const conflict = calStatus === 'connected'
              ? busySlots.some(s => s.start < bookingEnd && s.end > date)
              : false;

            return (
              <View style={styles.card}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <Avatar name={item.providerName} size={44} />
                  <View style={styles.cardHeaderInfo}>
                    <Text style={styles.providerName}>{item.providerName}</Text>
                    <Text style={styles.serviceName}>{item.serviceName}</Text>
                  </View>
                  <Badge label={config.label} variant={config.variant} icon={config.icon} />
                </View>

                {/* Calendar conflict warning */}
                {conflict && (
                  <View style={styles.conflictBanner}>
                    <IconAlertTriangle size={14} color={Colors.warning} strokeWidth={2} />
                    <Text style={styles.conflictText}>
                      Potential conflict with another calendar event
                    </Text>
                  </View>
                )}

                {/* Details */}
                <View style={styles.details}>
                  <DetailRow
                    icon={<IconCalendar size={16} color={Colors.textMuted} strokeWidth={1.75} />}
                    text={date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  />
                  <DetailRow
                    icon={<IconClock size={16} color={Colors.textMuted} strokeWidth={1.75} />}
                    text={date.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  />
                  <DetailRow icon={<IconMapPin size={16} color={Colors.textMuted} strokeWidth={1.75} />} text={item.locationName} />
                  <DetailRow
                    icon={<IconCurrencyDollar size={16} color={Colors.textMuted} strokeWidth={1.75} />}
                    text={`$${(item.price_cents / 100).toFixed(2)}`}
                  />
                </View>

                {/* Actions */}
                {isUpcoming && (
                  <View style={styles.actions}>
                    <Button
                      label="Cancel"
                      onPress={() => handleCancel(item.id, item.providerName)}
                      variant="outline"
                      size="sm"
                      style={styles.cancelBtn}
                      fullWidth={false}
                    />
                    <Button
                      label="Get Directions"
                      onPress={() => {}}
                      variant="secondary"
                      size="sm"
                      style={styles.directionsBtn}
                      fullWidth={false}
                    />
                  </View>
                )}

                {isCompleted && (
                  <Button
                    label="Leave Review"
                    onPress={() =>
                      navigation.navigate('LeaveReview', { bookingId: item.id })
                    }
                    variant="primary"
                    size="sm"
                  />
                )}
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Smart Scheduling Banner ───────────────────────────────────────────────────

function SmartSchedulingBanner({ status, freeSuggestions, busyCount, onConnect, formatSuggestion }: {
  status: CalendarStatus;
  freeSuggestions: Date[];
  busyCount: number;
  onConnect: () => void;
  formatSuggestion: (d: Date) => string;
}) {
  const [expanded, setExpanded] = useState(false);

  if (status === 'idle') {
    return (
      <TouchableOpacity style={calStyles.banner} onPress={onConnect} activeOpacity={0.85}>
        <View style={calStyles.bannerIcon}>
          <IconBolt size={20} color={Colors.primary} strokeWidth={2} />
        </View>
        <View style={calStyles.bannerText}>
          <Text style={calStyles.bannerTitle}>Smart Scheduling</Text>
          <Text style={calStyles.bannerSub}>Connect your calendar to find the best appointment times</Text>
        </View>
        <View style={calStyles.bannerCta}>
          <IconCalendarPlus size={18} color={Colors.primary} strokeWidth={1.75} />
        </View>
      </TouchableOpacity>
    );
  }

  if (status === 'connecting') {
    return (
      <View style={[calStyles.banner, calStyles.bannerConnecting]}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={calStyles.connectingText}>Reading your calendar…</Text>
      </View>
    );
  }

  if (status === 'denied') {
    return (
      <View style={[calStyles.banner, calStyles.bannerDenied]}>
        <View style={calStyles.bannerIcon}>
          <IconCalendar size={20} color={Colors.textMuted} strokeWidth={1.75} />
        </View>
        <View style={calStyles.bannerText}>
          <Text style={calStyles.bannerTitle}>Calendar Access Needed</Text>
          <Text style={calStyles.bannerSub}>Enable in Settings → Privacy → Calendars</Text>
        </View>
      </View>
    );
  }

  // Connected
  return (
    <View style={[calStyles.banner, calStyles.bannerConnected]}>
      <View style={calStyles.bannerIcon}>
        <IconCalendarCheck size={20} color={Colors.success} strokeWidth={1.75} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={calStyles.connectedHeader}>
          <Text style={calStyles.bannerTitle}>
            Smart Scheduling Active
          </Text>
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={calStyles.expandBtn}>{expanded ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={calStyles.bannerSub}>
          {busyCount} event{busyCount !== 1 ? 's' : ''} found · {freeSuggestions.length} open slots
        </Text>

        {expanded && freeSuggestions.length > 0 && (
          <View style={calStyles.suggestions}>
            <Text style={calStyles.suggestionsLabel}>Best times to book this week:</Text>
            {freeSuggestions.slice(0, 4).map((d, i) => (
              <View key={i} style={calStyles.suggestionRow}>
                <View style={calStyles.suggestionDot} />
                <Text style={calStyles.suggestionText}>{formatSuggestion(d)}</Text>
              </View>
            ))}
            <Text style={calStyles.privacyNote}>
              🔒 CROWND only sees free/busy times — never your event details
            </Text>
          </View>
        )}

        {expanded && freeSuggestions.length === 0 && (
          <Text style={calStyles.noSlotsText}>
            Your calendar is quite full! Consider booking further out.
          </Text>
        )}
      </View>
    </View>
  );
}

// ─── Detail Row ────────────────────────────────────────────────────────────────

function DetailRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIconWrap}>{icon}</View>
      <Text style={styles.detailText}>{text}</Text>
    </View>
  );
}

// ─── Calendar Banner Styles ────────────────────────────────────────────────────

const calStyles = StyleSheet.create({
  banner: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginHorizontal: Spacing.base, marginBottom: Spacing.base,
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, gap: Spacing.md,
  },
  bannerConnecting: { alignItems: 'center', gap: Spacing.md },
  bannerDenied: { borderColor: Colors.border, opacity: 0.75 },
  bannerConnected: { borderColor: Colors.success + '40', backgroundColor: Colors.success + '08' },
  bannerIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  bannerSub: { fontSize: Typography.sizes.xs, color: Colors.textSecondary, marginTop: 2 },
  bannerCta: { alignSelf: 'center' },
  connectingText: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  connectedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expandBtn: { fontSize: Typography.sizes.xs, color: Colors.primary, fontWeight: Typography.weights.semibold },
  suggestions: { marginTop: Spacing.sm, gap: Spacing.xs },
  suggestionsLabel: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.semibold, color: Colors.textSecondary, marginBottom: 4 },
  suggestionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  suggestionDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  suggestionText: { fontSize: Typography.sizes.xs, color: Colors.textSecondary },
  privacyNote: { fontSize: Typography.sizes.xs, color: Colors.textMuted, marginTop: Spacing.sm, fontStyle: 'italic' },
  noSlotsText: { fontSize: Typography.sizes.xs, color: Colors.textMuted, marginTop: Spacing.sm },
});

// ─── Main Styles ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.base, paddingBottom: Spacing.sm },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.extrabold,
    color: Colors.textPrimary,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 4,
    marginBottom: Spacing.base,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  tab_active: { backgroundColor: Colors.primary },
  tabText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textMuted,
  },
  tabText_active: { color: Colors.white },
  list: { padding: Spacing.base, gap: Spacing.md, paddingBottom: 110 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cardHeaderInfo: { flex: 1 },
  providerName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  serviceName: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  conflictBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.warning + '15', borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
  },
  conflictText: { fontSize: Typography.sizes.xs, color: Colors.warning, fontWeight: Typography.weights.medium, flex: 1 },
  details: { gap: Spacing.sm, paddingHorizontal: Spacing.xs },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  detailIconWrap: { width: 20, alignItems: 'center' },
  detailText: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, flex: 1 },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  cancelBtn: { flex: 1 },
  directionsBtn: { flex: 1 },
});
