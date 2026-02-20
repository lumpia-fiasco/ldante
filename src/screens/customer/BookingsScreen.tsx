import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  
  FlatList,
  TouchableOpacity,
  Alert,
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
} from '@tabler/icons-react-native';

type Nav = StackNavigationProp<RootStackParamList>;

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

export function BookingsScreen() {
  const navigation = useNavigation<Nav>();
  const [tab, setTab] = useState<TabKey>('upcoming');

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

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

function DetailRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIconWrap}>{icon}</View>
      <Text style={styles.detailText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.base },
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
  details: { gap: Spacing.sm, paddingHorizontal: Spacing.xs },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  detailIconWrap: { width: 20, alignItems: 'center' },
  detailText: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, flex: 1 },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  cancelBtn: { flex: 1 },
  directionsBtn: { flex: 1 },
});
