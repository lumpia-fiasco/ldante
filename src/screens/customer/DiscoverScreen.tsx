import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Avatar } from '../../components/common';
import { RootStackParamList } from '../../navigation';
import { IconBell, IconMenu2, IconHeart, IconHeartFilled } from '@tabler/icons-react-native';
import { CrowndLogo } from '../../components/brand/CrowndLogo';

type Nav = StackNavigationProp<RootStackParamList>;

// ─── Mock Friends ──────────────────────────────────────────────────────────────
// These are the logged-in user's actual friends. The Friends tab shows this list.

const MOCK_FRIENDS = [
  {
    id: 'f1',
    name: 'Sarah Kim',
    avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    providerCount: 4,
    mutualCount: 2,
  },
  {
    id: 'f2',
    name: 'Emily Rodriguez',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    providerCount: 2,
    mutualCount: 1,
  },
  {
    id: 'f3',
    name: 'Lisa Morgan',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    providerCount: 3,
    mutualCount: 3,
  },
  {
    id: 'f4',
    name: 'Amanda Chen',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    providerCount: 1,
    mutualCount: 0,
  },
  {
    id: 'f5',
    name: 'Martina Garcia',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    providerCount: 5,
    mutualCount: 1,
  },
];

// ─── Mock Feed Posts ───────────────────────────────────────────────────────────
// Only posts from friends and providers the user follows.
// customer.id links to MOCK_FRIENDS so the name/avatar taps open FriendProfile.

const MOCK_POSTS = [
  {
    id: '1',
    customer: {
      id: 'f1',
      name: 'Sarah Kim',
      avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    },
    provider: {
      id: 'p1',
      name: 'Carmela',
      location: 'Costa Mesa, CA',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      service: '💇‍♀️',
    },
    photo: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80',
    tags: ['Goddess Braids', 'Shampoo', 'Color'],
    review: "Carmela did amazing with these braids! Best, hands-down. My hair has never been more healthy — she really knows how to take care of it.",
    likes: 16,
    liked: false,
  },
  {
    id: '2',
    customer: {
      id: 'f3',
      name: 'Lisa Morgan',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    },
    provider: {
      id: 'p5',
      name: 'Aisha',
      location: 'Long Beach, CA',
      avatar: 'https://randomuser.me/api/portraits/women/91.jpg',
      service: '🧖‍♀️',
    },
    photo: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
    tags: ['HydraFacial', 'Glow'],
    review: "Aisha is the skin whisperer. Left glowing like never before. I'm a forever client.",
    likes: 31,
    liked: false,
  },
  {
    id: '3',
    customer: {
      id: 'f5',
      name: 'Martina Garcia',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    },
    provider: {
      id: 'p2',
      name: 'Devon',
      location: 'Santa Ana, CA',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      service: '💈',
    },
    photo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
    tags: ['Fade', 'Lineup'],
    review: "Devon is hands down the best barber in OC. Got my husband going and now he won't go anywhere else.",
    likes: 24,
    liked: true,
  },
  {
    id: '4',
    customer: {
      id: 'f2',
      name: 'Emily Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    },
    provider: {
      id: 'p6',
      name: 'Tyler',
      location: 'Torrance, CA',
      avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
      service: '💪',
    },
    photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    tags: ['HIIT', 'Personal Training'],
    review: "Tyler is the real deal. He pushes you just enough and the results speak for themselves. Month 3 and I'm a different person.",
    likes: 19,
    liked: false,
  },
  {
    id: '5',
    customer: {
      id: 'f1',
      name: 'Sarah Kim',
      avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    },
    provider: {
      id: 'p3',
      name: 'Jasmine',
      location: 'Irvine, CA',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      service: '💅',
    },
    photo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
    tags: ['Gel Manicure', 'Nail Art'],
    review: "Jasmine did the most beautiful set — clean, precise, and so cute. Already booked my next appointment.",
    likes: 8,
    liked: false,
  },
];

const TABS = ['Feed', 'Friends', 'Services'];

// ─── Screen ────────────────────────────────────────────────────────────────────

export function DiscoverScreen() {
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState('Feed');
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
          <TouchableOpacity style={styles.headerBtn}>
            <IconMenu2 size={24} color={Colors.textPrimary} strokeWidth={1.75} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'Feed' && (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.feed}>
          <Text style={styles.feedLabel}>Posts from your friends & providers</Text>
          {posts.map(post => (
            <FeedPost
              key={post.id}
              post={post}
              onFriendPress={() => navigation.navigate('FriendProfile', { friendId: post.customer.id })}
              onProviderPress={() => navigation.navigate('ProviderProfile', { providerId: post.provider.id })}
              onLike={() => toggleLike(post.id)}
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

// ─── Feed Post ─────────────────────────────────────────────────────────────────

function FeedPost({ post, onFriendPress, onProviderPress, onLike }: {
  post: typeof MOCK_POSTS[0];
  onFriendPress: () => void;
  onProviderPress: () => void;
  onLike: () => void;
}) {
  return (
    <View style={postStyles.card}>
      {/* Post Header — friend name/avatar taps to their profile */}
      <View style={postStyles.header}>
        <TouchableOpacity style={postStyles.headerLeft} onPress={onFriendPress} activeOpacity={0.7}>
          <Image source={{ uri: post.customer.avatar }} style={postStyles.customerAvatar} />
          <Text style={postStyles.customerName}>{post.customer.name}</Text>
        </TouchableOpacity>
        {/* Service emoji taps to provider profile */}
        <TouchableOpacity onPress={onProviderPress} activeOpacity={0.7}>
          <Text style={postStyles.serviceEmoji}>{post.provider.service}</Text>
        </TouchableOpacity>
      </View>

      {/* Photo */}
      <Image source={{ uri: post.photo }} style={postStyles.photo} />

      {/* Tags */}
      <View style={postStyles.tags}>
        {post.tags.map(tag => (
          <View key={tag} style={postStyles.tag}>
            <Text style={postStyles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Provider Info — taps to provider profile */}
      <TouchableOpacity style={postStyles.providerRow} onPress={onProviderPress} activeOpacity={0.7}>
        <Image source={{ uri: post.provider.avatar }} style={postStyles.providerAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={postStyles.providerName}>{post.provider.name}</Text>
          <Text style={postStyles.providerLocation}>{post.provider.location}</Text>
        </View>
        <Text style={postStyles.viewProfile}>View →</Text>
      </TouchableOpacity>

      {/* Review Text */}
      <Text style={postStyles.review}>{post.review}</Text>

      {/* Like */}
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

const postStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.sm,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    marginHorizontal: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  customerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceAlt },
  customerName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },
  serviceEmoji: { fontSize: 32 },
  photo: { width: '100%', height: 280, backgroundColor: Colors.surfaceAlt },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, padding: Spacing.base, paddingBottom: Spacing.sm },
  tag: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  tagText: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  providerRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm,
  },
  providerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surfaceAlt },
  providerName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  providerLocation: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  viewProfile: { fontSize: Typography.sizes.sm, color: Colors.primary, fontWeight: Typography.weights.medium },
  review: { fontSize: Typography.sizes.base, color: Colors.textSecondary, lineHeight: 22, paddingHorizontal: Spacing.base, paddingBottom: Spacing.base },
  likeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.base, paddingBottom: Spacing.base },
  likeCount: { fontSize: Typography.sizes.base, color: Colors.textSecondary, fontWeight: Typography.weights.medium },
});

// ─── Friends Tab ───────────────────────────────────────────────────────────────
// Shows your actual friends — no occupations, just name, mutual count, provider count.
// Tapping navigates to FriendProfile.

function FriendsTab({ navigation }: { navigation: Nav }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      <Text style={friendStyles.sectionLabel}>Your Friends</Text>
      {MOCK_FRIENDS.map(friend => (
        <TouchableOpacity
          key={friend.id}
          style={friendStyles.row}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('FriendProfile', { friendId: friend.id })}
        >
          <Image source={{ uri: friend.avatar }} style={friendStyles.avatar} />
          <View style={friendStyles.info}>
            <Text style={friendStyles.name}>{friend.name}</Text>
            <Text style={friendStyles.sub}>
              {friend.providerCount} provider{friend.providerCount !== 1 ? 's' : ''} · {friend.mutualCount} mutual
            </Text>
          </View>
          <Text style={friendStyles.chevron}>View →</Text>
        </TouchableOpacity>
      ))}
      <View style={{ height: 110 }} />
    </ScrollView>
  );
}

const friendStyles = StyleSheet.create({
  sectionLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.surfaceAlt },
  info: { flex: 1 },
  name: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  sub: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, marginTop: 2 },
  chevron: { fontSize: Typography.sizes.sm, color: Colors.primary, fontWeight: Typography.weights.medium },
});

// ─── Services Tab ──────────────────────────────────────────────────────────────

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
    </ScrollView>
  );
}

const servicesStyles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  cell: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emoji: { fontSize: 40 },
  label: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },
});

// ─── Main Styles ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerRight: { flexDirection: 'row', gap: Spacing.base, alignItems: 'center' },
  headerBtn: { padding: Spacing.xs },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  tab: { marginRight: Spacing.xl, paddingBottom: Spacing.sm, position: 'relative' },
  tabText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.medium, color: Colors.textMuted },
  tabTextActive: { color: Colors.textPrimary, fontWeight: Typography.weights.bold },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.textPrimary,
    borderRadius: 1,
  },
  feed: { flex: 1, paddingTop: Spacing.sm },
  feedLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
    paddingBottom: Spacing.md,
    letterSpacing: 0.3,
  },
});
