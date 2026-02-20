import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Avatar, StarRating, Card, SectionHeader, Badge } from '../../components/common';
import { RootStackParamList } from '../../navigation';
import {
  IconScissors,
  IconMapPin,
  IconCalendarEvent,
  IconChartBar,
  IconMessageCircle,
  IconUsers,
  IconCalendar,
  IconStar,
} from '@tabler/icons-react-native';

type Nav = StackNavigationProp<RootStackParamList>;

const MOCK_UPCOMING = [
  { id: 'b1', customerName: 'Emily Rodriguez', service: 'Balayage', time: '2:00 PM', date: 'Today', status: 'confirmed' },
  { id: 'b2', customerName: 'Sarah Kim', service: 'Cut & Blowout', time: '4:30 PM', date: 'Today', status: 'confirmed' },
  { id: 'b3', customerName: 'Amanda Chen', service: 'Full Color', time: '10:00 AM', date: 'Tomorrow', status: 'confirmed' },
];

const MOCK_RECENT_REVIEWS = [
  { id: 'r1', name: 'Emily R.', score: 5, text: 'Best balayage ever!', date: '2 days ago' },
  { id: 'r2', name: 'Sarah K.', score: 5, text: 'She always delivers perfection.', date: '5 days ago' },
];

export function ProviderDashboardScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good afternoon, Jessica!</Text>
            <Text style={styles.subtitle}>Your business at a glance</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('ProviderProfileEdit')}>
            <Avatar name="Jessica Williams" size={44} />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard icon={<IconUsers size={22} color={Colors.textSecondary} strokeWidth={1.75} />} value="187" label="Followers" trend="+12 this week" />
          <StatCard icon={<IconCalendar size={22} color={Colors.textSecondary} strokeWidth={1.75} />} value="24" label="Bookings" sub="this month" />
          <StatCard icon={<IconStar size={22} color={Colors.textSecondary} strokeWidth={1.75} />} value="4.9" label="Rating" sub="(52 reviews)" />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('ManageServices')}
          >
            <View><Text style={styles.qaServiceEmoji}>✂️</Text></View>
            <Text style={styles.qaLabel}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => {}}>
            <View><IconMapPin size={24} color={Colors.textSecondary} strokeWidth={1.75} /></View>
            <Text style={styles.qaLabel}>Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => {}}>
            <View><IconCalendarEvent size={24} color={Colors.textSecondary} strokeWidth={1.75} /></View>
            <Text style={styles.qaLabel}>Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => {}}>
            <View><IconChartBar size={24} color={Colors.textSecondary} strokeWidth={1.75} /></View>
            <Text style={styles.qaLabel}>Analytics</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Appointments */}
        <View>
          <SectionHeader
            title="Upcoming Appointments"
            action="View all"
            onAction={() => {}}
          />
          {MOCK_UPCOMING.map((booking) => (
            <View key={booking.id} style={styles.appointmentCard}>
              <Avatar name={booking.customerName} size={44} />
              <View style={styles.apptInfo}>
                <Text style={styles.apptName}>{booking.customerName}</Text>
                <Text style={styles.apptService}>{booking.service}</Text>
                <Text style={styles.apptTime}>
                  {booking.date} · {booking.time}
                </Text>
              </View>
              <View style={styles.apptActions}>
                <Badge
                  label={booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                  variant={booking.status === 'confirmed' ? 'success' : 'warning'}
                />
                <TouchableOpacity>
                  <View><IconMessageCircle size={20} color={Colors.textSecondary} strokeWidth={1.75} /></View>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Rating Summary */}
        <Card>
          <Text style={styles.cardTitle}>Your Ratings</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.bigScore}>4.9</Text>
            <View>
              <StarRating score={4.9} size={20} />
              <Text style={styles.ratingCount}>52 total ratings</Text>
            </View>
          </View>

          <View style={styles.dimensionMini}>
            {[
              { label: 'Quality', score: 4.9 },
              { label: 'Expertise', score: 4.9 },
              { label: 'Service', score: 4.3 },
              { label: 'Value', score: 4.2 },
            ].map((d) => (
              <View key={d.label} style={styles.dimRow}>
                <Text style={styles.dimLabel}>{d.label}</Text>
                <View style={styles.dimBar}>
                  <View style={[styles.dimFill, { width: `${(d.score / 5) * 100}%` }]} />
                </View>
                <Text style={styles.dimScore}>{d.score}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Recent Reviews */}
        <View>
          <SectionHeader title="Recent Reviews" action="See all" />
          {MOCK_RECENT_REVIEWS.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Avatar name={review.name} size={32} />
                <Text style={styles.reviewName}>{review.name}</Text>
                <StarRating score={review.score} size={12} />
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <Text style={styles.reviewText}>"{review.text}"</Text>
            </View>
          ))}
        </View>

        {/* Location Alert (if recently moved) */}
        <View style={styles.locationAlert}>
          <View><IconMapPin size={28} color={Colors.primary} strokeWidth={1.75} /></View>
          <View style={styles.locationAlertText}>
            <Text style={styles.locationAlertTitle}>Notify Followers of Your Location</Text>
            <Text style={styles.locationAlertSub}>187 followers will be notified instantly</Text>
          </View>
          <TouchableOpacity style={styles.notifyBtn}>
            <Text style={styles.notifyBtnText}>Notify</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: Spacing['2xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, value, label, trend, sub }: { icon: React.ReactNode; value: string; label: string; trend?: string; sub?: string }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {trend && <Text style={styles.statTrend}>{trend}</Text>}
      {sub && <Text style={styles.statSub}>{sub}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, gap: Spacing.xl, paddingBottom: 110 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.extrabold, color: Colors.textPrimary },
  subtitle: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  statsRow: { flexDirection: 'row', gap: Spacing.md },
  statCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.md, alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: Colors.border,
  },
  statIcon: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.extrabold, color: Colors.textPrimary },
  statLabel: { fontSize: Typography.sizes.xs, color: Colors.textMuted, fontWeight: Typography.weights.medium },
  statTrend: { fontSize: Typography.sizes.xs, color: Colors.success },
  statSub: { fontSize: Typography.sizes.xs, color: Colors.textMuted },
  quickActions: {
    flexDirection: 'row', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.border,
  },
  quickAction: { flex: 1, alignItems: 'center', gap: Spacing.xs },
  qaServiceEmoji: { fontSize: 24 },
  qaLabel: { fontSize: Typography.sizes.xs, color: Colors.textSecondary, fontWeight: Typography.weights.medium },
  appointmentCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.base, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  apptInfo: { flex: 1 },
  apptName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  apptService: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  apptTime: { fontSize: Typography.sizes.xs, color: Colors.textMuted },
  apptActions: { alignItems: 'flex-end', gap: Spacing.sm },
  cardTitle: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary, marginBottom: Spacing.md },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.base, marginBottom: Spacing.base },
  bigScore: { fontSize: Typography.sizes['3xl'], fontWeight: Typography.weights.extrabold, color: Colors.textPrimary },
  ratingCount: { fontSize: Typography.sizes.xs, color: Colors.textMuted, marginTop: 4 },
  dimensionMini: { gap: Spacing.sm },
  dimRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dimLabel: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, width: 70 },
  dimBar: { flex: 1, height: 6, backgroundColor: Colors.surfaceAlt, borderRadius: Radius.full, overflow: 'hidden' },
  dimFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: Radius.full },
  dimScore: { fontSize: Typography.sizes.sm, color: Colors.textPrimary, fontWeight: Typography.weights.semibold, width: 28, textAlign: 'right' },
  reviewCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm, gap: Spacing.sm,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  reviewName: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.textPrimary, flex: 1 },
  reviewDate: { fontSize: Typography.sizes.xs, color: Colors.textMuted },
  reviewText: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, fontStyle: 'italic' },
  locationAlert: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: `${Colors.primary}15`, borderRadius: Radius.xl, padding: Spacing.base,
    borderWidth: 1, borderColor: `${Colors.primary}30`,
  },
  locationAlertText: { flex: 1 },
  locationAlertTitle: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  locationAlertSub: { fontSize: Typography.sizes.xs, color: Colors.textSecondary },
  notifyBtn: { backgroundColor: Colors.primary, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  notifyBtnText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.white },
});
