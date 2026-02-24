import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, Modal, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { RootStackParamList } from '../../navigation';
import { CrowndLogo } from '../../components/brand/CrowndLogo';
import {
  IconBell,
  IconMenu2,
  IconHeart,
  IconHeartFilled,
  IconUser,
  IconSettings,
  IconHelp,
  IconLogout,
  IconChevronRight,
  IconChevronLeft,
  IconMapPin,
} from '@tabler/icons-react-native';

type Nav = StackNavigationProp<RootStackParamList>;

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_POSTS = [
  {
    id: '1',
    customer: { name: 'LoLinda', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    provider: { name: 'Josephine', location: 'Costa Mesa, CA', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', id: 'p1', service: '💇‍♀️' },
    photo: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80',
    tags: ['Goddess Braids', 'Shampoo', 'Color'],
    review: "Josephine did amazing with these braids! Best, hands-down. I think the best thing about all of this is that my hair has never been more healthy! Carmela knows how to take care of hair and keep it nice and healthy.",
    likes: 16,
    liked: false,
  },
  {
    id: '2',
    customer: { name: 'LoLinda', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    provider: { name: 'Josephine', location: 'Costa Mesa, CA', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', id: 'p1', service: '💇‍♀️' },
    photo: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80',
    tags: ['Cornrows', 'Design'],
    review: "Another amazing session. The cornrows are flawless as always.",
    likes: 21,
    liked: false,
  },
];

const MOCK_APPOINTMENTS = [
  { id: 'b1', time: '2:45 PM', name: 'Nerissa',  services: ['Wash', 'Style', 'Silk Press'], balance: '$240' },
  { id: 'b2', time: '5:00 PM', name: 'Martina',  services: ['Wash', 'Style'], balance: '$240' },
  { id: 'b3', time: '6:00 PM', name: 'Alberta',  services: ['Wash'], balance: '$240' },
  { id: 'b4', time: '6:30 PM', name: 'Kim',       services: ['Wash'], balance: '$240' },
];

const MOCK_REVIEWS = [
  {
    id: 'r1',
    name: 'LoLinda',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    score: 4.6,
    text: "Carmela did amazing with these braids! Best, hands-down. I think the best thing about all of this is that my hair has never been more healthy! Carmela knows how to take care of hair and keep it nice and healthy.",
    date: 'Feb 2, 2026',
  },
  {
    id: 'r2',
    name: 'Sarah K.',
    avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    score: 5.0,
    text: "She always delivers perfection. My go-to for any hair occasion.",
    date: 'Jan 28, 2026',
  },
];

const MOCK_PROVIDERS_FRIENDS = [
  {
    id: 'p1', name: 'Carmela', location: 'Costa Mesa, CA',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    specialty: 'Hair Stylist',
    providerEmojis: ['💇‍♀️', '💈', '💪', '🐉', '💆‍♀️', '💅', '👁', '💄'],
  },
  {
    id: 'p3', name: 'Jasmine', location: 'Irvine, CA',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    specialty: 'Nail Artist',
    providerEmojis: ['💇‍♀️', '💈', '💪', '🐉', '💆‍♀️', '💅', '👁', '💄'],
  },
  {
    id: 'p4', name: 'Marcus', location: 'Anaheim, CA',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    specialty: 'Massage Therapist',
    providerEmojis: ['💇‍♀️', '💈', '💪', '🐉', '💆‍♀️', '💅', '👁', '💄'],
  },
  {
    id: 'p5', name: 'Aisha', location: 'Long Beach, CA',
    avatar: 'https://randomuser.me/api/portraits/women/91.jpg',
    specialty: 'Esthetician',
    providerEmojis: ['💇‍♀️', '💈', '💪', '🐉', '💆‍♀️', '💅', '👁', '💄'],
  },
  {
    id: 'p6', name: 'Tyler', location: 'Torrance, CA',
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
    specialty: 'Personal Trainer',
    providerEmojis: ['💇‍♀️', '💈', '💪', '🐉', '💆‍♀️', '💅', '👁', '💄'],
  },
  {
    id: 'p7', name: 'Brianna', location: 'Compton, CA',
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    specialty: 'Makeup Artist',
    providerEmojis: ['💇‍♀️', '💈', '💪', '🐉', '💆‍♀️', '💅', '👁', '💄'],
  },
];

// ─── Tabs ───────────────────────────────────────────────────────────────────────

const TABS = ['Dashboard', 'Posts', 'Friends', 'Go-tos'] as const;
type Tab = typeof TABS[number];

// ─── Screen ────────────────────────────────────────────────────────────────────

export function ProviderDashboardScreen() {
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [hamburgerVisible, setHamburgerVisible] = useState(false);

  function toggleLike(id: string) {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <CrowndLogo size={36} />
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('Notifications')}>
            <IconBell size={24} color={Colors.textPrimary} strokeWidth={1.75} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setHamburgerVisible(true)}>
            <IconMenu2 size={24} color={Colors.textPrimary} strokeWidth={1.75} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Upper Tab Bar */}
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarInner}>
          {TABS.map(tab => (
            <TouchableOpacity key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              {activeTab === tab && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      {activeTab === 'Dashboard' && <DashboardTab navigation={navigation} />}

      {activeTab === 'Posts' && (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <Text style={styles.feedLabel}>POSTS FROM YOUR FRIENDS & GO-TOS</Text>
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
      {activeTab === 'Go-tos' && <GoTosTab navigation={navigation} />}

      {/* Hamburger Menu Drawer */}
      <ProviderHamburgerMenu
        visible={hamburgerVisible}
        onClose={() => setHamburgerVisible(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}

// ─── Dashboard Tab ─────────────────────────────────────────────────────────────

function DashboardTab({ navigation }: { navigation: Nav }) {
  const [dateLabel] = useState('Friday Feb 6');

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={dashStyles.scroll}>

      {/* Greeting */}
      <Text style={dashStyles.greeting}>Good afternoon, Simone!</Text>
      <Text style={dashStyles.greetingSub}>Let's see where we're at</Text>

      {/* Stat cards */}
      <View style={dashStyles.statsRow}>
        <View style={[dashStyles.statCard, { backgroundColor: '#F2C4AE' }]}>
          <Text style={dashStyles.statValue}>189</Text>
          <Text style={dashStyles.statLabel}>Followers</Text>
          <Text style={dashStyles.statTrend}>-30 this week</Text>
        </View>
        <View style={[dashStyles.statCard, { backgroundColor: '#B8DDD6' }]}>
          <Text style={dashStyles.statValue}>34</Text>
          <Text style={dashStyles.statLabel}>Bookings</Text>
          <Text style={dashStyles.statSub}>this month</Text>
        </View>
        <View style={[dashStyles.statCard, { backgroundColor: '#F5E6C8' }]}>
          <Text style={dashStyles.statValue}>4.9</Text>
          <Text style={dashStyles.statLabel}>Rating</Text>
          <Text style={dashStyles.statSub}>-0.1 points</Text>
          <Text style={dashStyles.statSub}>+ 3 reviews</Text>
        </View>
      </View>

      {/* Today's Earnings */}
      <View style={dashStyles.earningsSection}>
        <Text style={dashStyles.earningsLabel}>Today's Earnings</Text>
        <Text style={dashStyles.earningsAmount}>$845.00</Text>
        <Text style={dashStyles.earningsSub}>This week: $5640.00</Text>
        <Text style={dashStyles.earningsSub}>This month: $24,500.00</Text>
      </View>

      {/* Action buttons */}
      <View style={dashStyles.actionRow}>
        <TouchableOpacity style={dashStyles.actionBtn} activeOpacity={0.8}>
          <Text style={dashStyles.actionBtnText}>Add Appointment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dashStyles.actionBtn} activeOpacity={0.8}>
          <Text style={dashStyles.actionBtnText}>Collect</Text>
        </TouchableOpacity>
      </View>

      {/* Date Navigator */}
      <View style={dashStyles.dateNav}>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <IconChevronLeft size={22} color={Colors.textPrimary} strokeWidth={1.75} />
        </TouchableOpacity>
        <View style={dashStyles.dateCenter}>
          <Text style={dashStyles.dateToday}>Today</Text>
          <Text style={dashStyles.dateLabel}>{dateLabel}</Text>
        </View>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <IconChevronRight size={22} color={Colors.textPrimary} strokeWidth={1.75} />
        </TouchableOpacity>
      </View>
      <Text style={dashStyles.apptSummary}>3 down, 4 to go!</Text>

      {/* Appointment List */}
      {MOCK_APPOINTMENTS.map(appt => (
        <View key={appt.id} style={dashStyles.apptRow}>
          <View style={dashStyles.apptLeft}>
            <Text style={dashStyles.apptTime}>{appt.time}</Text>
            <Text style={dashStyles.apptName}>{appt.name}</Text>
            <View style={dashStyles.apptTags}>
              {appt.services.map(s => (
                <View key={s} style={dashStyles.apptTag}>
                  <Text style={dashStyles.apptTagText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={dashStyles.apptRight}>
            <Text style={dashStyles.balanceLabel}>Balance Due</Text>
            <Text style={dashStyles.balanceAmount}>{appt.balance}</Text>
          </View>
        </View>
      ))}

      {/* Ratings Grid */}
      <View style={dashStyles.ratingsGrid}>
        {[
          { label: 'Quality', score: 4.9 },
          { label: 'Friendliness', score: 4.5 },
          { label: 'Expertise', score: 4.9 },
          { label: 'Location', score: 3.5 },
        ].map(r => (
          <View key={r.label} style={dashStyles.ratingCell}>
            <Text style={dashStyles.ratingScore}>{r.score.toFixed(1)}</Text>
            <Text style={dashStyles.ratingLabel}>{r.label}</Text>
          </View>
        ))}
      </View>

      {/* Latest Reviews */}
      <Text style={dashStyles.reviewsTitle}>Latest reviews</Text>
      {MOCK_REVIEWS.map(review => (
        <View key={review.id} style={dashStyles.reviewCard}>
          <View style={dashStyles.reviewHeader}>
            <Image source={{ uri: review.avatar }} style={dashStyles.reviewAvatar} />
            <Text style={dashStyles.reviewName}>{review.name}</Text>
            <Text style={dashStyles.reviewScore}>{review.score.toFixed(1)}</Text>
          </View>
          <Text style={dashStyles.reviewText}>{review.text}</Text>
          <Text style={dashStyles.reviewDate}>{review.date}</Text>
        </View>
      ))}

      <View style={{ height: 110 }} />
    </ScrollView>
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
      {/* Poster row */}
      <View style={postStyles.header}>
        <View style={postStyles.headerLeft}>
          <Image source={{ uri: post.customer.avatar }} style={postStyles.customerAvatar} />
          <Text style={postStyles.customerName}>{post.customer.name}</Text>
        </View>
        <Text style={postStyles.serviceEmoji}>{post.provider.service}</Text>
      </View>

      {/* Full-width photo */}
      <Image source={{ uri: post.photo }} style={postStyles.photo} />

      {/* Tags + provider mini info */}
      <TouchableOpacity style={postStyles.metaRow} onPress={onProviderPress} activeOpacity={0.7}>
        <View style={postStyles.tagsWrap}>
          {post.tags.map(tag => (
            <View key={tag} style={postStyles.tag}>
              <Text style={postStyles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={postStyles.providerMini}>
          <Image source={{ uri: post.provider.avatar }} style={postStyles.providerAvatar} />
          <View>
            <Text style={postStyles.providerName}>{post.provider.name}</Text>
            <Text style={postStyles.providerLocation}>{post.provider.location}</Text>
          </View>
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
      <View style={listStyles.sectionRow}>
        <Text style={listStyles.sectionLabel}>YOUR FRIENDS</Text>
        <TouchableOpacity style={listStyles.addBtn} activeOpacity={0.8}>
          <Text style={listStyles.addBtnText}>Add friend</Text>
        </TouchableOpacity>
      </View>
      {MOCK_PROVIDERS_FRIENDS.map(provider => (
        <TouchableOpacity
          key={provider.id}
          style={listStyles.row}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('ProviderProfile', { providerId: provider.id })}
        >
          <Image source={{ uri: provider.avatar }} style={listStyles.avatar} />
          <View style={listStyles.info}>
            <Text style={listStyles.name}>{provider.name}</Text>
            <View style={listStyles.locationRow}>
              <IconMapPin size={12} color={Colors.textMuted} strokeWidth={1.75} />
              <Text style={listStyles.location}>{provider.location}</Text>
            </View>
            <View style={listStyles.emojis}>
              {provider.providerEmojis.map((emoji, i) => (
                <Text key={i} style={listStyles.emojiText}>{emoji}</Text>
              ))}
            </View>
          </View>
          <IconChevronRight size={18} color={Colors.textMuted} strokeWidth={1.75} />
        </TouchableOpacity>
      ))}
      <View style={{ height: 110 }} />
    </ScrollView>
  );
}

// ─── Go-tos Tab ────────────────────────────────────────────────────────────────

function GoTosTab({ navigation }: { navigation: Nav }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      <View style={listStyles.sectionRow}>
        <Text style={listStyles.sectionLabel}>YOUR GO-TOS</Text>
        <TouchableOpacity style={listStyles.addBtn} activeOpacity={0.8}>
          <Text style={listStyles.addBtnText}>Add Go-to</Text>
        </TouchableOpacity>
      </View>
      {MOCK_PROVIDERS_FRIENDS.map(provider => (
        <TouchableOpacity
          key={provider.id}
          style={listStyles.row}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('ProviderProfile', { providerId: provider.id })}
        >
          <Image source={{ uri: provider.avatar }} style={listStyles.avatar} />
          <View style={listStyles.info}>
            <Text style={listStyles.name}>{provider.name}</Text>
            <Text style={listStyles.specialty}>{provider.specialty}</Text>
            <View style={listStyles.locationRow}>
              <IconMapPin size={12} color={Colors.textMuted} strokeWidth={1.75} />
              <Text style={listStyles.location}>{provider.location}</Text>
            </View>
            <Text style={listStyles.friendOverlap}>Friend 1, Friend 2 and Friend 3 go here</Text>
          </View>
          <View style={listStyles.rightCol}>
            <Text style={listStyles.emoji}>👩‍🦱</Text>
            <IconChevronRight size={18} color={Colors.textMuted} strokeWidth={1.75} />
          </View>
        </TouchableOpacity>
      ))}
      <View style={{ height: 110 }} />
    </ScrollView>
  );
}

// ─── Provider Hamburger Menu ────────────────────────────────────────────────────

function ProviderHamburgerMenu({ visible, onClose, navigation }: {
  visible: boolean;
  onClose: () => void;
  navigation: Nav;
}) {
  function handleNavigate(screen: keyof RootStackParamList) {
    onClose();
    setTimeout(() => navigation.navigate(screen as any), 200);
  }

  function handleLogout() {
    onClose();
    setTimeout(() => {
      Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out', style: 'destructive',
          onPress: async () => {
            const { authService } = require('../../services/supabase');
            await authService.signOut();
          },
        },
      ]);
    }, 200);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <View style={hamburgerStyles.overlay}>
        <TouchableOpacity style={hamburgerStyles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={hamburgerStyles.drawer}>
          <View style={hamburgerStyles.handle} />
          <View style={hamburgerStyles.brand}>
            <CrowndLogo size={32} />
            <Text style={hamburgerStyles.brandName}>CROWND</Text>
          </View>
          <View style={hamburgerStyles.menu}>
            <HamburgerItem
              icon={<IconUser size={22} color={Colors.textPrimary} strokeWidth={1.75} />}
              label="My Profile"
              sublabel="View and edit your provider profile"
              onPress={() => handleNavigate('ProviderProfileEdit')}
            />
            <View style={hamburgerStyles.divider} />
            <HamburgerItem
              icon={<IconSettings size={22} color={Colors.textPrimary} strokeWidth={1.75} />}
              label="Settings"
              sublabel="App preferences & privacy"
              onPress={() => handleNavigate('Settings')}
            />
            <View style={hamburgerStyles.divider} />
            <HamburgerItem
              icon={<IconHelp size={22} color={Colors.textPrimary} strokeWidth={1.75} />}
              label="Help & Support"
              sublabel="FAQs, contact, and feedback"
              onPress={() => handleNavigate('HelpSupport')}
            />
          </View>
          <TouchableOpacity style={hamburgerStyles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
            <IconLogout size={20} color={Colors.error} strokeWidth={1.75} />
            <Text style={hamburgerStyles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
          <View style={{ height: Spacing.xl }} />
        </View>
      </View>
    </Modal>
  );
}

function HamburgerItem({ icon, label, sublabel, onPress }: {
  icon: React.ReactNode; label: string; sublabel: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={hamburgerStyles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={hamburgerStyles.itemIcon}>{icon}</View>
      <View style={hamburgerStyles.itemText}>
        <Text style={hamburgerStyles.itemLabel}>{label}</Text>
        <Text style={hamburgerStyles.itemSublabel}>{sublabel}</Text>
      </View>
      <IconChevronRight size={18} color={Colors.textMuted} strokeWidth={1.75} />
    </TouchableOpacity>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
  },
  headerRight: { flexDirection: 'row', gap: Spacing.base, alignItems: 'center' },
  headerBtn: { padding: Spacing.xs },
  tabBar: { borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.background },
  tabBarInner: { paddingHorizontal: Spacing.base, flexDirection: 'row' },
  tab: { marginRight: Spacing.xl, paddingBottom: Spacing.sm, position: 'relative', paddingTop: Spacing.xs },
  tabText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.medium, color: Colors.textMuted },
  tabTextActive: { color: Colors.textPrimary, fontWeight: Typography.weights.bold },
  tabUnderline: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.textPrimary, borderRadius: 1 },
  feedLabel: {
    fontSize: Typography.sizes.xs, color: Colors.textMuted,
    fontWeight: Typography.weights.semibold,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, letterSpacing: 0.8,
  },
});

const dashStyles = StyleSheet.create({
  scroll: { paddingBottom: 110 },

  greeting: {
    fontSize: Typography.sizes.xl, fontWeight: Typography.weights.extrabold,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.base, paddingTop: Spacing.base,
  },
  greetingSub: {
    fontSize: Typography.sizes.sm, color: Colors.textSecondary,
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.base,
  },

  // Stat cards
  statsRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.base, marginBottom: Spacing.base },
  statCard: {
    flex: 1, borderRadius: Radius.xl, padding: Spacing.md,
    alignItems: 'center', gap: 2,
  },
  statValue: { fontSize: Typography.sizes['2xl'], fontWeight: Typography.weights.extrabold, color: Colors.textPrimary },
  statLabel: { fontSize: Typography.sizes.xs, color: Colors.textPrimary, fontWeight: Typography.weights.medium, textAlign: 'center' },
  statTrend: { fontSize: Typography.sizes.xs, color: Colors.textPrimary, textAlign: 'center' },
  statSub: { fontSize: Typography.sizes.xs, color: Colors.textPrimary, textAlign: 'center' },

  // Earnings
  earningsSection: { paddingHorizontal: Spacing.base, marginBottom: Spacing.base },
  earningsLabel: { fontSize: Typography.sizes.base, color: Colors.textSecondary, marginBottom: 4 },
  earningsAmount: { fontSize: 40, fontWeight: Typography.weights.extrabold, color: Colors.textPrimary, marginBottom: 4 },
  earningsSub: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },

  // Action buttons
  actionRow: { flexDirection: 'row', gap: Spacing.base, paddingHorizontal: Spacing.base, marginBottom: Spacing.lg },
  actionBtn: {
    flex: 1, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.lg, paddingVertical: Spacing.md,
    alignItems: 'center', backgroundColor: Colors.surface,
  },
  actionBtnText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },

  // Date navigator
  dateNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, marginBottom: Spacing.xs,
  },
  dateCenter: { alignItems: 'center' },
  dateToday: { fontSize: Typography.sizes.sm, color: Colors.textMuted },
  dateLabel: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  apptSummary: {
    textAlign: 'center', fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold, color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  // Appointment rows
  apptRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.surface,
  },
  apptLeft: { flex: 1 },
  apptTime: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, marginBottom: 2 },
  apptName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary, marginBottom: 4 },
  apptTags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  apptTag: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 2,
  },
  apptTagText: { fontSize: Typography.sizes.xs, color: Colors.textSecondary },
  apptRight: { alignItems: 'flex-end', justifyContent: 'flex-start', gap: 2 },
  balanceLabel: { fontSize: Typography.sizes.xs, color: Colors.textMuted },
  balanceAmount: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },

  // Ratings grid
  ratingsGrid: {
    flexDirection: 'row', gap: Spacing.sm,
    paddingHorizontal: Spacing.base, marginTop: Spacing.base, marginBottom: Spacing.base,
  },
  ratingCell: {
    flex: 1, backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg, padding: Spacing.md,
    alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: Colors.border,
  },
  ratingScore: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  ratingLabel: { fontSize: Typography.sizes.xs, color: Colors.textSecondary, textAlign: 'center' },

  // Reviews
  reviewsTitle: {
    fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold,
    color: Colors.textPrimary, paddingHorizontal: Spacing.base, marginBottom: Spacing.sm,
  },
  reviewCard: {
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceAlt },
  reviewName: { flex: 1, fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },
  reviewScore: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  reviewText: { fontSize: Typography.sizes.base, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.sm },
  reviewDate: { fontSize: Typography.sizes.sm, color: Colors.textMuted },
});

const postStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface, marginBottom: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  customerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceAlt },
  customerName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },
  serviceEmoji: { fontSize: 32 },
  photo: { width: '100%', height: 300, backgroundColor: Colors.surfaceAlt },
  metaRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingTop: Spacing.md, paddingBottom: Spacing.sm, gap: Spacing.sm,
  },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, flex: 1 },
  tag: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  tagText: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  providerMini: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexShrink: 0 },
  providerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceAlt },
  providerName: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  providerLocation: { fontSize: Typography.sizes.xs, color: Colors.textSecondary },
  review: { fontSize: Typography.sizes.base, color: Colors.textSecondary, lineHeight: 24, paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm },
  likeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.base, paddingBottom: Spacing.base },
  likeCount: { fontSize: Typography.sizes.base, color: Colors.textSecondary, fontWeight: Typography.weights.medium },
});

const listStyles = StyleSheet.create({
  sectionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingTop: Spacing.base, paddingBottom: Spacing.sm,
  },
  sectionLabel: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.semibold, color: Colors.textMuted, letterSpacing: 0.8 },
  addBtn: {
    borderWidth: 1, borderColor: Colors.textPrimary, borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, paddingVertical: 6,
  },
  addBtnText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.medium, color: Colors.textPrimary },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    gap: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.surfaceAlt },
  info: { flex: 1 },
  rightCol: { alignItems: 'center', gap: 6 },
  emoji: { fontSize: 28 },
  name: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  specialty: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, marginTop: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  location: { fontSize: Typography.sizes.sm, color: Colors.textMuted },
  emojis: { flexDirection: 'row', gap: 4, marginTop: 6, flexWrap: 'wrap' },
  emojiText: { fontSize: 22 },
  friendOverlap: {
    fontSize: Typography.sizes.sm, color: Colors.primary,
    fontWeight: Typography.weights.bold, marginTop: 4, fontStyle: 'italic',
  },
});

const hamburgerStyles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  drawer: { backgroundColor: Colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: Spacing.base, paddingTop: Spacing.sm },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: Spacing.lg },
  brand: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.xs, marginBottom: Spacing.xl },
  brandName: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.extrabold, color: Colors.textPrimary, letterSpacing: 1 },
  menu: { backgroundColor: Colors.surface, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 60 },
  item: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.base },
  itemIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  itemText: { flex: 1 },
  itemLabel: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },
  itemSublabel: { fontSize: Typography.sizes.xs, color: Colors.textSecondary, marginTop: 2 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.base, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.error + '40', backgroundColor: Colors.error + '0A',
  },
  logoutText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.error },
});
