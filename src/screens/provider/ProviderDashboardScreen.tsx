import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Avatar, StarRating, Card, SectionHeader, Badge } from '../../components/common';
import { RootStackParamList } from '../../navigation';
import { CrowndLogo } from '../../components/brand/CrowndLogo';
import {
  IconScissors,
  IconMapPin,
  IconCalendarEvent,
  IconChartBar,
  IconMessageCircle,
  IconUsers,
  IconCalendar,
  IconStar,
  IconBell,
  IconMenu2,
  IconHeart,
  IconHeartFilled,
} from '@tabler/icons-react-native';

type Nav = StackNavigationProp<RootStackParamList>;

// ─── Shared Mock Data (mirrors DiscoverScreen) ─────────────────────────────────

const SERVICE_EMOJI: Record<string, string> = {
  hair: '💇‍♀️',
  barber: '💈',
  fitness: '💪',
  massage: '🐉',
  esthetics: '🧖‍♀️',
  nails: '💅',
  lashes: '👁',
  makeup: '💄',
};

const MOCK_POSTS = [
  {
    id: '1',
    customer: { name: 'LoLinda', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    provider: { name: 'Carmela', location: 'Costa Mesa, CA', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', id: 'p1', service: '💇‍♀️' },
    photo: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80',
    tags: ['Goddess Braids', 'Shampoo', 'Color'],
    review: "Carmela did amazing with these braids! Best, hands-down. My hair has never been more healthy!",
    likes: 16,
    liked: false,
  },
  {
    id: '2',
    customer: { name: 'Martina', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
    provider: { name: 'Devon', location: 'Santa Ana, CA', avatar: 'https://randomuser.me/api/portraits/men/42.jpg', id: 'p2', service: '💈' },
    photo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
    tags: ['Fade', 'Lineup'],
    review: "Devon is hands down the best barber I've found. Clean fade every time.",
    likes: 24,
    liked: false,
  },
];

const MOCK_PROVIDERS_FRIENDS = [
  {
    id: 'p1', name: 'Carmela', location: 'Costa Mesa, CA',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    specialty: 'Hair Stylist',
    services: ['💇‍♀️ Braids', '💇‍♀️ Silk Press', '💇‍♀️ Cornrows', '💇‍♀️ Conditioning'],
  },
  {
    id: 'p3', name: 'Jasmine', location: 'Irvine, CA',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    specialty: 'Nail Artist',
    services: ['💅 Gel Manicure', '💅 Nail Art', '💅 Acrylics', '💅 Pedicure'],
  },
  {
    id: 'p4', name: 'Marcus', location: 'Anaheim, CA',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    specialty: 'Massage Therapist',
    services: ['💆 Deep Tissue', '💆 Swedish', '💆 Hot Stone', '💆 Sports Massage'],
  },
  {
    id: 'p5', name: 'Aisha', location: 'Long Beach, CA',
    avatar: 'https://randomuser.me/api/portraits/women/91.jpg',
    specialty: 'Esthetician',
    services: ['🧖‍♀️ HydraFacial', '🧖‍♀️ Chemical Peel', '🧖‍♀️ Microdermabrasion', '🧖‍♀️ Brow Shaping'],
  },
  {
    id: 'p6', name: 'Tyler', location: 'Torrance, CA',
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
    specialty: 'Personal Trainer',
    services: ['💪 HIIT', '💪 Strength Training', '💪 Mobility', '💪 Nutrition Coaching'],
  },
  {
    id: 'p7', name: 'Brianna', location: 'Compton, CA',
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    specialty: 'Makeup Artist',
    services: ['💄 Bridal Makeup', '💄 Editorial', '💄 Glam', '💄 Natural Look'],
  },
];

const SERVICE_CATEGORIES = [
  { key: 'hair', label: 'Hair', emoji: '💇‍♀️' },
  { key: 'barber', label: 'Barber', emoji: '💈' },
  { key: 'fitness', label: 'Fitness', emoji: '💪' },
  { key: 'massage', label: 'Massage', emoji: '💆' },
  { key: 'esthetics', label: 'Esthetics', emoji: '🧖‍♀️' },
  { key: 'nails', label: 'Nails', emoji: '💅' },
  { key: 'lashes', label: 'Lashes', emoji: '👁' },
  { key: 'makeup', label: 'Makeup', emoji: '💄' },
  { key: 'tattoo', label: 'Tattoo', emoji: '🐉' },
];

// ─── Provider Dashboard Mock Data ──────────────────────────────────────────────

const MOCK_UPCOMING = [
  { id: 'b1', customerName: 'Emily Rodriguez', service: 'Balayage', time: '2:00 PM', date: 'Today', status: 'confirmed' },
  { id: 'b2', customerName: 'Sarah Kim', service: 'Cut & Blowout', time: '4:30 PM', date: 'Today', status: 'confirmed' },
  { id: 'b3', customerName: 'Amanda Chen', service: 'Full Color', time: '10:00 AM', date: 'Tomorrow', status: 'confirmed' },
];

const MOCK_RECENT_REVIEWS = [
  { id: 'r1', name: 'Emily R.', score: 5, text: 'Best balayage ever!', date: '2 days ago' },
  { id: 'r2', name: 'Sarah K.', score: 5, text: 'She always delivers perfection.', date: '5 days ago' },
];

// ─── Upper Tab Bar ─────────────────────────────────────────────────────────────

const TABS = ['Dashboard', 'Feed', 'Friends', 'Services'] as const;
type Tab = typeof TABS[number];

// ─── Screen ────────────────────────────────────────────────────────────────────

export function ProviderDashboardScreen() {
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [posts, setPosts] = useState(MOCK_POSTS);

  function toggleLike(id: string) {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <CrowndLogo size={36} />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('Notifications')}>
            <IconBell size={24} color={Colors.textPrimary} strokeWidth={1.75} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.navigate('ProviderProfileEdit')}
          >
            <IconMenu2 size={24} color={Colors.textPrimary} strokeWidth={1.75} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Upper Tab Bar */}
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarInner}>
          {TABS.map(tab => (
            <TouchableOpacity key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      {activeTab === 'Dashboard' && (
        <DashboardTab navigation={navigation} />
      )}

      {activeTab === 'Feed' && (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.feed}>
          {posts.map(post => (
            <FeedPost
              key={post.id}
              post={post}
              onLike={() => toggleLike(post.id)}
              onProviderPress={() => navigation.navigate('ProviderProfile', { providerId: post.provider.id })}
            />
          ))}
          <View style={{ height: 110 }} />
        </ScrollView>
      )}

      {activeTab === 'Friends' && <FriendsTab navigation={navigation} />}
      {activeTab === 'Services' && <ServicesTab navigation={navigation} />}
    </SafeAreaView>
  );
}

// ─── Dashboard Tab ─────────────────────────────────────────────────────────────

function DashboardTab({ navigation }: { navigation: Nav }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={dashStyles.scroll}>

      {/* Provider Greeting */}
      <View style={dashStyles.greeting}>
        <View>
          <Text style={dashStyles.greetingName}>Good afternoon, Jessica!</Text>
          <Text style={dashStyles.greetingSub}>Your business at a glance</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ProviderProfileEdit')}>
          <Avatar name="Jessica Williams" size={44} />
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={dashStyles.statsRow}>
        <StatCard icon={<IconUsers size={22} color={Colors.textSecondary} strokeWidth={1.75} />} value="187" label="Followers" trend="+12 this week" />
        <StatCard icon={<IconCalendar size={22} color={Colors.textSecondary} strokeWidth={1.75} />} value="24" label="Bookings" sub="this month" />
        <StatCard icon={<IconStar size={22} color={Colors.textSecondary} strokeWidth={1.75} />} value="4.9" label="Rating" sub="(52 reviews)" />
      </View>

      {/* Quick Actions */}
      <View style={dashStyles.quickActions}>
        <TouchableOpacity style={dashStyles.quickAction} onPress={() => navigation.navigate('ManageServices')}>
          <Text style={dashStyles.qaEmoji}>✂️</Text>
          <Text style={dashStyles.qaLabel}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dashStyles.quickAction}>
          <IconMapPin size={24} color={Colors.textSecondary} strokeWidth={1.75} />
          <Text style={dashStyles.qaLabel}>Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dashStyles.quickAction}>
          <IconCalendarEvent size={24} color={Colors.textSecondary} strokeWidth={1.75} />
          <Text style={dashStyles.qaLabel}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dashStyles.quickAction}>
          <IconChartBar size={24} color={Colors.textSecondary} strokeWidth={1.75} />
          <Text style={dashStyles.qaLabel}>Analytics</Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Appointments */}
      <View>
        <SectionHeader title="Upcoming Appointments" action="View all" onAction={() => {}} />
        {MOCK_UPCOMING.map((booking) => (
          <View key={booking.id} style={dashStyles.appointmentCard}>
            <Avatar name={booking.customerName} size={44} />
            <View style={dashStyles.apptInfo}>
              <Text style={dashStyles.apptName}>{booking.customerName}</Text>
              <Text style={dashStyles.apptService}>{booking.service}</Text>
              <Text style={dashStyles.apptTime}>{booking.date} · {booking.time}</Text>
            </View>
            <View style={dashStyles.apptActions}>
              <Badge
                label={booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                variant={booking.status === 'confirmed' ? 'success' : 'warning'}
              />
              <TouchableOpacity>
                <IconMessageCircle size={20} color={Colors.textSecondary} strokeWidth={1.75} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Rating Summary */}
      <Card>
        <Text style={dashStyles.cardTitle}>Your Ratings</Text>
        <View style={dashStyles.ratingRow}>
          <Text style={dashStyles.bigScore}>4.9</Text>
          <View>
            <StarRating score={4.9} size={20} />
            <Text style={dashStyles.ratingCount}>52 total ratings</Text>
          </View>
        </View>
        <View style={dashStyles.dimensionMini}>
          {[
            { label: 'Quality', score: 4.9 },
            { label: 'Expertise', score: 4.9 },
            { label: 'Service', score: 4.3 },
            { label: 'Value', score: 4.2 },
          ].map((d) => (
            <View key={d.label} style={dashStyles.dimRow}>
              <Text style={dashStyles.dimLabel}>{d.label}</Text>
              <View style={dashStyles.dimBar}>
                <View style={[dashStyles.dimFill, { width: `${(d.score / 5) * 100}%` as any }]} />
              </View>
              <Text style={dashStyles.dimScore}>{d.score}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Recent Reviews */}
      <View>
        <SectionHeader title="Recent Reviews" action="See all" />
        {MOCK_RECENT_REVIEWS.map((review) => (
          <View key={review.id} style={dashStyles.reviewCard}>
            <View style={dashStyles.reviewHeader}>
              <Avatar name={review.name} size={32} />
              <Text style={dashStyles.reviewName}>{review.name}</Text>
              <StarRating score={review.score} size={12} />
              <Text style={dashStyles.reviewDate}>{review.date}</Text>
            </View>
            <Text style={dashStyles.reviewText}>"{review.text}"</Text>
          </View>
        ))}
      </View>

      {/* Location Alert */}
      <View style={dashStyles.locationAlert}>
        <IconMapPin size={28} color={Colors.primary} strokeWidth={1.75} />
        <View style={dashStyles.locationAlertText}>
          <Text style={dashStyles.locationAlertTitle}>Notify Followers of Your Location</Text>
          <Text style={dashStyles.locationAlertSub}>187 followers will be notified instantly</Text>
        </View>
        <TouchableOpacity style={dashStyles.notifyBtn}>
          <Text style={dashStyles.notifyBtnText}>Notify</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

function StatCard({ icon, value, label, trend, sub }: { icon: React.ReactNode; value: string; label: string; trend?: string; sub?: string }) {
  return (
    <View style={dashStyles.statCard}>
      <View style={dashStyles.statIcon}>{icon}</View>
      <Text style={dashStyles.statValue}>{value}</Text>
      <Text style={dashStyles.statLabel}>{label}</Text>
      {trend && <Text style={dashStyles.statTrend}>{trend}</Text>}
      {sub && <Text style={dashStyles.statSub}>{sub}</Text>}
    </View>
  );
}

// ─── Feed Post ─────────────────────────────────────────────────────────────────

function FeedPost({ post, onLike, onProviderPress }: {
  post: typeof MOCK_POSTS[0];
  onLike: () => void;
  onProviderPress: () => void;
}) {
  return (
    <View style={postStyles.card}>
      <View style={postStyles.header}>
        <View style={postStyles.headerLeft}>
          <Image source={{ uri: post.customer.avatar }} style={postStyles.customerAvatar} />
          <Text style={postStyles.customerName}>{post.customer.name}</Text>
        </View>
        <Text style={postStyles.serviceEmoji}>{post.provider.service}</Text>
      </View>
      <Image source={{ uri: post.photo }} style={postStyles.photo} />
      <View style={postStyles.tags}>
        {post.tags.map(tag => (
          <View key={tag} style={postStyles.tag}>
            <Text style={postStyles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={postStyles.providerRow} onPress={onProviderPress} activeOpacity={0.7}>
        <Image source={{ uri: post.provider.avatar }} style={postStyles.providerAvatar} />
        <View>
          <Text style={postStyles.providerName}>{post.provider.name}</Text>
          <Text style={postStyles.providerLocation}>{post.provider.location}</Text>
        </View>
      </TouchableOpacity>
      <Text style={postStyles.review}>{post.review}</Text>
      <TouchableOpacity style={postStyles.likeRow} onPress={onLike} activeOpacity={0.7}>
        {post.liked
          ? <IconHeartFilled size={22} color={Colors.like} />
          : <IconHeart size={22} color={Colors.textMuted} strokeWidth={1.75} />
        }
        <Text style={postStyles.likeCount}>{post.likes}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Friends Tab ───────────────────────────────────────────────────────────────

function FriendsTab({ navigation }: { navigation: Nav }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      {MOCK_PROVIDERS_FRIENDS.map(provider => (
        <TouchableOpacity
          key={provider.id}
          style={friendStyles.row}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('ProviderProfile', { providerId: provider.id })}
        >
          <Image source={{ uri: provider.avatar }} style={friendStyles.avatar} />
          <View style={friendStyles.info}>
            <Text style={friendStyles.name}>{provider.name}</Text>
            <Text style={friendStyles.specialty}>{provider.specialty}</Text>
            <Text style={friendStyles.location}>{provider.location}</Text>
            <View style={friendStyles.services}>
              {provider.services.map((service, i) => (
                <View key={i} style={friendStyles.serviceTag}>
                  <Text style={friendStyles.serviceText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      ))}
      <View style={{ height: 110 }} />
    </ScrollView>
  );
}

// ─── Services Tab ──────────────────────────────────────────────────────────────

function ServicesTab({ navigation }: { navigation: Nav }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, padding: Spacing.base }}>
      <View style={servicesStyles.grid}>
        {SERVICE_CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.key}
            style={servicesStyles.cell}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Search', { category: cat.key })}
          >
            <Text style={servicesStyles.emoji}>{cat.emoji}</Text>
            <Text style={servicesStyles.label}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ height: 110 }} />
    </ScrollView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerRight: { flexDirection: 'row', gap: Spacing.base, alignItems: 'center' },
  headerBtn: { padding: Spacing.xs },
  tabBar: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  tabBarInner: {
    paddingHorizontal: Spacing.base,
    flexDirection: 'row',
  },
  tab: { marginRight: Spacing.xl, paddingBottom: Spacing.sm, position: 'relative', paddingTop: Spacing.xs },
  tabText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.medium, color: Colors.textMuted },
  tabTextActive: { color: Colors.textPrimary, fontWeight: Typography.weights.bold },
  tabUnderline: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 2, backgroundColor: Colors.textPrimary, borderRadius: 1,
  },
  feed: { flex: 1, paddingTop: Spacing.md },
});

// Dashboard tab inner styles
const dashStyles = StyleSheet.create({
  scroll: { padding: Spacing.base, gap: Spacing.xl, paddingBottom: 110 },
  greeting: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greetingName: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.extrabold, color: Colors.textPrimary },
  greetingSub: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
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
  qaEmoji: { fontSize: 24 },
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
  notifyBtnText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: '#FFFFFF' },
});

// Feed post styles
const postStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface, marginBottom: Spacing.sm,
    borderRadius: Radius.xl, overflow: 'hidden',
    marginHorizontal: Spacing.base,
    borderWidth: 1, borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  customerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceAlt },
  customerName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },
  serviceEmoji: { fontSize: 32 },
  photo: { width: '100%', height: 280, backgroundColor: Colors.surfaceAlt },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, padding: Spacing.base, paddingBottom: Spacing.sm },
  tag: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  tagText: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm },
  providerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surfaceAlt },
  providerName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  providerLocation: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  review: { fontSize: Typography.sizes.base, color: Colors.textSecondary, lineHeight: 22, paddingHorizontal: Spacing.base, paddingBottom: Spacing.base },
  likeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.base, paddingBottom: Spacing.base },
  likeCount: { fontSize: Typography.sizes.base, color: Colors.textSecondary, fontWeight: Typography.weights.medium },
});

// Friends tab styles
const friendStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    gap: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.surfaceAlt },
  info: { flex: 1, gap: 2 },
  name: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  specialty: { fontSize: Typography.sizes.sm, color: Colors.secondary, fontWeight: Typography.weights.medium },
  location: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, marginBottom: 6 },
  services: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  serviceTag: { backgroundColor: Colors.surfaceAlt, borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  serviceText: { fontSize: Typography.sizes.xs, color: Colors.textSecondary },
});

// Services tab styles
const servicesStyles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, padding: Spacing.base },
  cell: {
    width: '47%', backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  emoji: { fontSize: 40 },
  label: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },
});
