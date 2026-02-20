import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Avatar, Badge, Button } from '../../components/common';

const MOCK_PROVIDER_BOOKINGS = [
  { id: 'pb1', customerName: 'Emily Rodriguez', service: 'Balayage', date: 'Feb 25, 2026', time: '2:00 PM', duration: 150, price: 250, status: 'confirmed', note: 'First timer, nervous about color' },
  { id: 'pb2', customerName: 'Sarah Kim', service: 'Cut & Blowout', date: 'Feb 25, 2026', time: '4:30 PM', duration: 60, price: 85, status: 'confirmed', note: '' },
  { id: 'pb3', customerName: 'Amanda Chen', service: 'Full Color', date: 'Feb 26, 2026', time: '10:00 AM', duration: 120, price: 180, status: 'requested', note: 'Bring formula from October' },
  { id: 'pb4', customerName: 'Lisa Morgan', service: 'Toner', date: 'Feb 28, 2026', time: '1:00 PM', duration: 45, price: 65, status: 'requested', note: '' },
];

const STATUS_CONFIG: Record<string, { label: string; variant: any }> = {
  requested: { label: 'Pending', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'success' },
  completed: { label: 'Completed', variant: 'neutral' },
  cancelled: { label: 'Cancelled', variant: 'error' },
};

export function ProviderBookingsScreen() {
  const [bookings, setBookings] = useState(MOCK_PROVIDER_BOOKINGS);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  function handleAccept(bookingId: string) {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'confirmed' } : b))
    );
  }

  function handleDecline(bookingId: string, customerName: string) {
    Alert.alert(
      'Decline Booking',
      `Decline ${customerName}'s request? They'll be notified and the slot will reopen.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () =>
            setBookings((prev) =>
              prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
            ),
        },
      ]
    );
  }

  const upcoming = bookings.filter((b) => b.status === 'requested' || b.status === 'confirmed');
  const past = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');
  const displayed = tab === 'upcoming' ? upcoming : past;

  // Group by date
  const grouped = displayed.reduce<Record<string, typeof displayed>>((acc, b) => {
    if (!acc[b.date]) acc[b.date] = [];
    acc[b.date].push(b);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Client Bookings</Text>
        <Text style={styles.subtitle}>{upcoming.length} upcoming</Text>
      </View>

      <View style={styles.tabs}>
        {(['upcoming', 'past'] as const).map((t) => (
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

      <FlatList
        data={Object.entries(grouped)}
        keyExtractor={([date]) => date}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: [date, dayBookings] }) => (
          <View>
            <Text style={styles.dateLabel}>{date}</Text>
            {dayBookings.map((booking) => {
              const config = STATUS_CONFIG[booking.status];
              return (
                <View key={booking.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Avatar name={booking.customerName} size={44} />
                    <View style={styles.cardInfo}>
                      <Text style={styles.customerName}>{booking.customerName}</Text>
                      <Text style={styles.service}>{booking.service}</Text>
                    </View>
                    <Badge label={config.label} variant={config.variant} />
                  </View>

                  <View style={styles.details}>
                    <Text style={styles.detail}>⏰ {booking.time} · {booking.duration} min</Text>
                    <Text style={styles.detail}>💰 ${booking.price}</Text>
                    {booking.note ? (
                      <Text style={styles.note}>📝 "{booking.note}"</Text>
                    ) : null}
                  </View>

                  {booking.status === 'requested' && (
                    <View style={styles.actions}>
                      <Button
                        label="Accept"
                        onPress={() => handleAccept(booking.id)}
                        size="sm"
                        style={styles.acceptBtn}
                      />
                      <Button
                        label="Decline"
                        onPress={() => handleDecline(booking.id, booking.customerName)}
                        variant="outline"
                        size="sm"
                        style={styles.declineBtn}
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.base },
  title: { fontSize: Typography.sizes['2xl'], fontWeight: Typography.weights.extrabold, color: Colors.textPrimary },
  subtitle: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  tabs: {
    flexDirection: 'row', marginHorizontal: Spacing.base,
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: 4, marginBottom: Spacing.base,
  },
  tab: { flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.md, alignItems: 'center' },
  tab_active: { backgroundColor: Colors.primary },
  tabText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.medium, color: Colors.textMuted },
  tabText_active: { color: Colors.white },
  list: { paddingHorizontal: Spacing.base, paddingBottom: Spacing['3xl'], gap: Spacing.sm },
  dateLabel: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.textSecondary, marginBottom: Spacing.sm, marginTop: Spacing.sm },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.border, gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  cardInfo: { flex: 1 },
  customerName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  service: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  details: { gap: Spacing.xs },
  detail: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  note: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, fontStyle: 'italic', backgroundColor: `${Colors.primary}10`, borderRadius: Radius.sm, padding: Spacing.sm },
  actions: { flexDirection: 'row', gap: Spacing.md },
  acceptBtn: { flex: 1 },
  declineBtn: { flex: 1 },
});
