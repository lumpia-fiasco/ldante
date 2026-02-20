import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Avatar, Button, EmptyState } from '../../components/common';
import { AppNotification, NotificationType } from '../../types';
import {
  IconCircleCheck,
  IconClock,
  IconBell,
  IconX,
  IconMapPin,
  IconUsers,
  IconHeartHandshake,
  IconSparkles,
  IconStar,
  IconFlame,
  IconAlertCircle,
} from '@tabler/icons-react-native';

const NOTIFICATION_CONFIG: Record<NotificationType, { icon: React.ReactNode; color: string }> = {
  booking_confirmed: { icon: <IconCircleCheck size={22} color={Colors.success} strokeWidth={1.75} />, color: Colors.success },
  booking_reminder_24h: { icon: <IconClock size={22} color={Colors.warning} strokeWidth={1.75} />, color: Colors.warning },
  booking_reminder_1h: { icon: <IconBell size={22} color={Colors.warning} strokeWidth={1.75} />, color: Colors.warning },
  booking_cancelled: { icon: <IconX size={22} color={Colors.error} strokeWidth={1.75} />, color: Colors.error },
  provider_location_changed: { icon: <IconMapPin size={22} color={Colors.primary} strokeWidth={1.75} />, color: Colors.primary },
  friend_request: { icon: <IconUsers size={22} color={Colors.info} strokeWidth={1.75} />, color: Colors.info },
  friend_accepted: { icon: <IconHeartHandshake size={22} color={Colors.success} strokeWidth={1.75} />, color: Colors.success },
  friend_added_provider: { icon: <IconSparkles size={22} color={Colors.primary} strokeWidth={1.75} />, color: Colors.primary },
  friend_reviewed_provider: { icon: <IconStar size={22} color={Colors.star} strokeWidth={1.75} />, color: Colors.star },
  rating_prompt: { icon: <IconStar size={22} color={Colors.star} strokeWidth={1.75} />, color: Colors.star },
  trending_alert: { icon: <IconFlame size={22} color={Colors.accent} strokeWidth={1.75} />, color: Colors.accent },
};

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1', user_id: 'u1', type: 'booking_confirmed', read: false,
    title: 'Booking Confirmed!',
    body: 'Jessica Williams confirmed your Balayage appointment for Feb 25 at 2:00 PM.',
    created_at: '2026-02-19T14:30:00',
  },
  {
    id: 'n2', user_id: 'u1', type: 'provider_location_changed', read: false,
    title: 'Provider Moved',
    body: 'Jessica Williams has moved to Luxe Loft Suites, Suite 8. Tap to view new location.',
    created_at: '2026-02-18T10:00:00',
  },
  {
    id: 'n3', user_id: 'u1', type: 'friend_added_provider', read: false,
    title: 'Sarah added a new provider',
    body: 'Sarah Kim added Marcus Thompson to her Rolodex. 3 of your friends now use him.',
    created_at: '2026-02-17T16:00:00',
  },
  {
    id: 'n4', user_id: 'u1', type: 'rating_prompt', read: true,
    title: 'How was Nina Patel?',
    body: 'You visited Nina Patel on Jan 15. Share your experience to help friends.',
    created_at: '2026-02-16T09:00:00',
  },
  {
    id: 'n5', user_id: 'u1', type: 'friend_request', read: true,
    title: 'New friend request',
    body: 'Julia Nguyen sent you a friend request. You have 2 mutual friends.',
    created_at: '2026-02-14T12:00:00',
  },
  {
    id: 'n6', user_id: 'u1', type: 'booking_reminder_24h', read: true,
    title: 'Appointment Tomorrow',
    body: 'Reminder: Balayage with Jessica Williams tomorrow at 2:00 PM at Luxe Loft Suites.',
    created_at: '2026-02-13T09:00:00',
  },
];

export function NotificationsScreen() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.unreadCount}>{unreadCount} unread</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllBtn}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <EmptyState
          icon="bell"
          title="No notifications yet"
          message="We'll notify you about bookings, provider updates, and friend activity."
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const config = NOTIFICATION_CONFIG[item.type];
            return (
              <TouchableOpacity
                style={[styles.card, !item.read && styles.card_unread]}
                onPress={() => markRead(item.id)}
                activeOpacity={0.85}
              >
                <View style={[styles.iconWrap, { backgroundColor: `${config.color}20` }]}>
                  <View style={styles.notifIconInner}>{config.icon}</View>
                </View>
                <View style={styles.content}>
                  <View style={styles.contentHeader}>
                    <Text style={styles.notifTitle}>{item.title}</Text>
                    <Text style={styles.notifTime}>{formatTime(item.created_at)}</Text>
                  </View>
                  <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
                </View>
                {!item.read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: Spacing.base,
  },
  title: { fontSize: Typography.sizes['2xl'], fontWeight: Typography.weights.extrabold, color: Colors.textPrimary },
  unreadCount: { fontSize: Typography.sizes.sm, color: Colors.primary },
  markAllBtn: { fontSize: Typography.sizes.sm, color: Colors.primary, fontWeight: Typography.weights.medium, paddingTop: Spacing.sm },
  list: { padding: Spacing.base, gap: Spacing.sm, paddingBottom: Spacing['3xl'] },
  card: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.border,
  },
  card_unread: { borderColor: `${Colors.primary}50`, backgroundColor: `${Colors.primary}08` },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  notifIconInner: { alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: Spacing.xs },
  contentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  notifTitle: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary, flex: 1 },
  notifTime: { fontSize: Typography.sizes.xs, color: Colors.textMuted, marginLeft: Spacing.sm },
  notifBody: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, lineHeight: 20 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginTop: Spacing.sm },
});
