import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../theme';
import { Avatar, StarRating, Badge, Button } from '../../components/common';
import { RootStackParamList } from '../../navigation';
import {
  IconArrowLeft,
  IconHeart,
  IconHeartFilled,
  IconMapPin,
  IconUserMinus,
} from '@tabler/icons-react-native';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'FriendProfile'>;
  route: RouteProp<RootStackParamList, 'FriendProfile'>;
};

// ─── Types ─────────────────────────────────────────────────────────────────────

type FriendData = {
  id: string;
  name: string;
  location: string;
  avatar?: string;
  bio: string;
  mutualFriends: number;
  posts: FriendPost[];
  providers: FriendProvider[];
};

type FriendPost = {
  id: string;
  photo: string;
  tags: string[];
  review: string;
  provider: { name: string; location: string; avatar: string; id: string; service: string };
  likes: number;
  liked: boolean;
};

type FriendProvider = {
  id: string;
  name: string;
  specialty: string;
  location: string;
  avatar: string;
  score: number;
  ratings: number;
  tags: string[];
  visits: number;
  inMyRolodex: boolean;
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_FRIENDS: Record<string, FriendData> = {
  f1: {
    id: 'f1',
    name: 'Sarah Kim',
    location: 'Irvine, CA',
    avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    bio: 'Beauty enthusiast & wellness junkie. Always on the hunt for the best kept secrets in OC. 💇‍♀️💅',
    mutualFriends: 2,
    posts: [
      {
        id: 'sp1',
        photo: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80',
        tags: ['Goddess Braids', 'Shampoo', 'Color'],
        review: "Carmela did amazing with these braids! Best, hands-down. My hair has never been more healthy.",
        provider: { name: 'Carmela', location: 'Costa Mesa, CA', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', id: 'p1', service: '💇‍♀️' },
        likes: 16,
        liked: false,
      },
      {
        id: 'sp2',
        photo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
        tags: ['Gel Manicure', 'Nail Art'],
        review: "Jasmine did the most beautiful set — clean, precise, and so cute. Already booked my next appointment.",
        provider: { name: 'Jasmine', location: 'Irvine, CA', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', id: 'p3', service: '💅' },
        likes: 8,
        liked: true,
      },
    ],
    providers: [
      { id: 'p1', name: 'Carmela', specialty: 'Hair Braider', location: 'Costa Mesa, CA', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', score: 4.9, ratings: 52, tags: ['Braids', 'Color'], visits: 6, inMyRolodex: false },
      { id: 'p3', name: 'Jasmine', specialty: 'Nail Artist', location: 'Irvine, CA', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', score: 4.7, ratings: 29, tags: ['Gel Manicure', 'Nail Art'], visits: 4, inMyRolodex: true },
      { id: 'p5', name: 'Aisha', specialty: 'Esthetician', location: 'Long Beach, CA', avatar: 'https://randomuser.me/api/portraits/women/91.jpg', score: 4.6, ratings: 22, tags: ['HydraFacial', 'Brow Shaping'], visits: 2, inMyRolodex: false },
      { id: 'p4', name: 'Marcus', specialty: 'Massage Therapist', location: 'Anaheim, CA', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', score: 4.8, ratings: 38, tags: ['Deep Tissue', 'Sports'], visits: 3, inMyRolodex: true },
    ],
  },
  f2: {
    id: 'f2',
    name: 'Emily Rodriguez',
    location: 'Santa Ana, CA',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    bio: 'Fitness lover & self-care advocate. Finding the best trainers and massage therapists in SoCal 💪🧖‍♀️',
    mutualFriends: 1,
    posts: [
      {
        id: 'ep1',
        photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
        tags: ['HIIT', 'Personal Training'],
        review: "Tyler is the real deal. He pushes you just enough and the results speak for themselves. Month 3 and I'm a different person.",
        provider: { name: 'Tyler', location: 'Torrance, CA', avatar: 'https://randomuser.me/api/portraits/men/33.jpg', id: 'p6', service: '💪' },
        likes: 19,
        liked: false,
      },
    ],
    providers: [
      { id: 'p6', name: 'Tyler', specialty: 'Personal Trainer', location: 'Torrance, CA', avatar: 'https://randomuser.me/api/portraits/men/33.jpg', score: 4.9, ratings: 41, tags: ['HIIT', 'Strength Training'], visits: 8, inMyRolodex: false },
      { id: 'p4', name: 'Marcus', specialty: 'Massage Therapist', location: 'Anaheim, CA', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', score: 4.8, ratings: 38, tags: ['Deep Tissue', 'Sports'], visits: 5, inMyRolodex: false },
    ],
  },
  f3: {
    id: 'f3',
    name: 'Lisa Morgan',
    location: 'Long Beach, CA',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    bio: 'Skincare obsessed. If it glows, I know who did it ✨',
    mutualFriends: 3,
    posts: [
      {
        id: 'lp1',
        photo: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
        tags: ['HydraFacial', 'Glow'],
        review: "Aisha is the skin whisperer. Left glowing like never before. I'm a forever client.",
        provider: { name: 'Aisha', location: 'Long Beach, CA', avatar: 'https://randomuser.me/api/portraits/women/91.jpg', id: 'p5', service: '🧖‍♀️' },
        likes: 31,
        liked: false,
      },
    ],
    providers: [
      { id: 'p5', name: 'Aisha', specialty: 'Esthetician', location: 'Long Beach, CA', avatar: 'https://randomuser.me/api/portraits/women/91.jpg', score: 4.6, ratings: 22, tags: ['HydraFacial', 'Chemical Peel'], visits: 7, inMyRolodex: false },
      { id: 'p7', name: 'Brianna', specialty: 'Makeup Artist', location: 'Compton, CA', avatar: 'https://randomuser.me/api/portraits/women/17.jpg', score: 4.7, ratings: 34, tags: ['Full Glam', 'Bridal'], visits: 2, inMyRolodex: false },
      { id: 'p3', name: 'Jasmine', specialty: 'Nail Artist', location: 'Irvine, CA', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', score: 4.7, ratings: 29, tags: ['Gel Manicure', 'Nail Art'], visits: 3, inMyRolodex: false },
    ],
  },
  f4: {
    id: 'f4',
    name: 'Amanda Chen',
    location: 'Newport Beach, CA',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    bio: 'Minimalist beauty. One great provider at a time. 💄',
    mutualFriends: 0,
    posts: [
      {
        id: 'ap1',
        photo: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80',
        tags: ['Full Glam', 'Editorial'],
        review: "Brianna is an artist. She understood my vision immediately and delivered something even better than I imagined.",
        provider: { name: 'Brianna', location: 'Compton, CA', avatar: 'https://randomuser.me/api/portraits/women/17.jpg', id: 'p7', service: '💄' },
        likes: 22,
        liked: false,
      },
    ],
    providers: [
      { id: 'p7', name: 'Brianna', specialty: 'Makeup Artist', location: 'Compton, CA', avatar: 'https://randomuser.me/api/portraits/women/17.jpg', score: 4.7, ratings: 34, tags: ['Full Glam', 'Bridal'], visits: 3, inMyRolodex: false },
    ],
  },
  f5: {
    id: 'f5',
    name: 'Martina Garcia',
    location: 'Compton, CA',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    bio: 'Booked and blessed. I stay fresh and I know who to credit. 💈✨',
    mutualFriends: 1,
    posts: [
      {
        id: 'mgp1',
        photo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
        tags: ['Fade', 'Lineup'],
        review: "Devon is hands down the best barber in OC. Got my husband going and now he won't go anywhere else.",
        provider: { name: 'Devon', location: 'Santa Ana, CA', avatar: 'https://randomuser.me/api/portraits/men/42.jpg', id: 'p2', service: '💈' },
        likes: 24,
        liked: true,
      },
      {
        id: 'mgp2',
        photo: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
        tags: ['HydraFacial', 'Brow'],
        review: "Aisha keeps my skin glowing year round. She's booked out but worth every wait.",
        provider: { name: 'Aisha', location: 'Long Beach, CA', avatar: 'https://randomuser.me/api/portraits/women/91.jpg', id: 'p5', service: '🧖‍♀️' },
        likes: 14,
        liked: false,
      },
    ],
    providers: [
      { id: 'p2', name: 'Devon', specialty: 'Barber', location: 'Santa Ana, CA', avatar: 'https://randomuser.me/api/portraits/men/42.jpg', score: 4.8, ratings: 60, tags: ['Fade', 'Lineup'], visits: 10, inMyRolodex: true },
      { id: 'p5', name: 'Aisha', specialty: 'Esthetician', location: 'Long Beach, CA', avatar: 'https://randomuser.me/api/portraits/women/91.jpg', score: 4.6, ratings: 22, tags: ['HydraFacial', 'Brow Shaping'], visits: 5, inMyRolodex: false },
      { id: 'p3', name: 'Jasmine', specialty: 'Nail Artist', location: 'Irvine, CA', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', score: 4.7, ratings: 29, tags: ['Gel Manicure', 'Chrome'], visits: 4, inMyRolodex: false },
      { id: 'p1', name: 'Carmela', specialty: 'Hair Braider', location: 'Costa Mesa, CA', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', score: 4.9, ratings: 52, tags: ['Braids', 'Cornrows'], visits: 2, inMyRolodex: false },
      { id: 'p4', name: 'Marcus', specialty: 'Massage Therapist', location: 'Anaheim, CA', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', score: 4.8, ratings: 38, tags: ['Deep Tissue'], visits: 1, inMyRolodex: false },
    ],
  },
};

// Provider emoji map
const PROVIDER_EMOJI: Record<string, string> = {
  p1: '💇‍♀️', p2: '💈', p3: '💅', p4: '💆', p5: '🧖‍♀️', p6: '💪', p7: '💄',
};

// ─── Screen ────────────────────────────────────────────────────────────────────

export function FriendProfileScreen({ navigation, route }: Props) {
  const { friendId } = route.params;
  const friend = MOCK_FRIENDS[friendId] ?? MOCK_FRIENDS['f1'];

  const [activeTab, setActiveTab] = useState<'posts' | 'gotos'>('posts');
  const [posts, setPosts] = useState(friend.posts);
  const [following, setFollowing] = useState(true);

  function toggleLike(postId: string) {
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  }

  function handleUnfollow() {
    Alert.alert(
      `Unfollow ${friend.name.split(' ')[0]}?`,
      "You'll no longer see their posts or Go-tos.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unfollow', style: 'destructive',
          onPress: () => { setFollowing(false); navigation.goBack(); },
        },
      ]
    );
  }

  const firstName = friend.name.split(' ')[0];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <IconArrowLeft size={24} color={Colors.textPrimary} strokeWidth={1.75} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={[styles.avatarWrap, Shadows.md]}>
            {friend.avatar
              ? <Image source={{ uri: friend.avatar }} style={styles.avatar} />
              : <Avatar name={friend.name} size={100} />
            }
          </View>
          <Text style={styles.name}>{friend.name}</Text>
          <View style={styles.locationRow}>
            <IconMapPin size={14} color={Colors.textMuted} strokeWidth={1.75} />
            <Text style={styles.location}>{friend.location}</Text>
          </View>
        </View>

        {/* Tab Bar: Posts | Go-tos */}
        <View style={styles.tabBar}>
          {[{ key: 'posts', label: 'Posts' }, { key: 'gotos', label: 'Go-tos' }].map(t => (
            <TouchableOpacity
              key={t.key}
              style={styles.tab}
              onPress={() => setActiveTab(t.key as 'posts' | 'gotos')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>
                {t.label}
              </Text>
              {activeTab === t.key && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <View>
            {/* Bio + mutual friends shown in posts tab */}
            {friend.bio ? (
              <Text style={styles.bio}>{friend.bio}</Text>
            ) : null}
            {friend.mutualFriends > 0 && (
              <Text style={styles.mutualFriends}>{friend.mutualFriends} mutual friends</Text>
            )}

            {/* Section label */}
            <Text style={styles.sectionLabel}>{firstName}'s Posts</Text>

            {/* Post cards */}
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                friendName={friend.name}
                friendAvatar={friend.avatar}
                onLike={() => toggleLike(post.id)}
                onProviderPress={() => navigation.navigate('ProviderProfile', { providerId: post.provider.id })}
              />
            ))}
            {posts.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No posts yet</Text>
              </View>
            )}
          </View>
        )}

        {/* Go-tos Tab */}
        {activeTab === 'gotos' && (
          <View>
            {/* Section label */}
            <Text style={styles.sectionLabel}>{firstName.toUpperCase()}'S GO-TOS</Text>

            {friend.providers.map(provider => {
              const emoji = PROVIDER_EMOJI[provider.id] ?? '✂️';
              return (
                <TouchableOpacity
                  key={provider.id}
                  style={styles.providerRow}
                  onPress={() => navigation.navigate('ProviderProfile', { providerId: provider.id })}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: provider.avatar }} style={styles.providerAvatar} />
                  <View style={styles.providerInfo}>
                    <Text style={styles.providerName}>{provider.name}</Text>
                    <Text style={styles.providerSpecialty}>{provider.specialty}</Text>
                    <View style={styles.providerLocationRow}>
                      <IconMapPin size={12} color={Colors.textMuted} strokeWidth={1.75} />
                      <Text style={styles.providerLocation}>{provider.location}</Text>
                    </View>
                    <Text style={styles.friendOverlap}>
                      {firstName} visited {provider.visits}×
                    </Text>
                  </View>
                  <View style={styles.rightCol}>
                    <Text style={styles.providerEmoji}>{emoji}</Text>
                    <Text style={styles.chevron}>›</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            {friend.providers.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No Go-tos yet</Text>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Post Card ─────────────────────────────────────────────────────────────────

function PostCard({
  post,
  friendName,
  friendAvatar,
  onLike,
  onProviderPress,
}: {
  post: FriendPost;
  friendName: string;
  friendAvatar?: string;
  onLike: () => void;
  onProviderPress: () => void;
}) {
  return (
    <View style={postStyles.card}>
      {/* Poster row */}
      <View style={postStyles.header}>
        <View style={postStyles.headerLeft}>
          {friendAvatar
            ? <Image source={{ uri: friendAvatar }} style={postStyles.friendAvatar} />
            : null
          }
          <Text style={postStyles.friendName}>{friendName}</Text>
        </View>
        <Text style={postStyles.serviceEmoji}>{post.provider.service}</Text>
      </View>

      {/* Full-width photo */}
      <Image source={{ uri: post.photo }} style={postStyles.photo} />

      {/* Tags (left) + Provider mini info (right) */}
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

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  topBar: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },

  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: Spacing.xs,
    backgroundColor: Colors.surfaceAlt,
    paddingTop: Spacing.sm,
  },
  avatarWrap: { marginBottom: Spacing.sm },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 3, borderColor: Colors.surface,
  },
  name: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  location: { fontSize: Typography.sizes.sm, color: Colors.textMuted },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    gap: Spacing['3xl'],
  },
  tab: { paddingBottom: Spacing.sm, paddingTop: Spacing.md, position: 'relative' },
  tabText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.medium, color: Colors.textMuted },
  tabTextActive: { color: Colors.textPrimary, fontWeight: Typography.weights.bold },
  tabUnderline: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 2, backgroundColor: Colors.textPrimary, borderRadius: 1,
  },

  // Posts tab content
  bio: {
    fontSize: Typography.sizes.base, color: Colors.textSecondary,
    lineHeight: 22, paddingHorizontal: Spacing.base, paddingTop: Spacing.base,
  },
  mutualFriends: {
    fontSize: Typography.sizes.sm, color: Colors.primary,
    fontWeight: Typography.weights.bold,
    paddingHorizontal: Spacing.base, paddingTop: Spacing.xs, paddingBottom: Spacing.sm,
  },

  sectionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },

  // Go-tos tab provider rows
  providerRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    gap: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  providerAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.surfaceAlt },
  providerInfo: { flex: 1 },
  rightCol: { alignItems: 'center', gap: 4 },
  providerEmoji: { fontSize: 28 },
  chevron: { fontSize: 20, color: Colors.textMuted },
  providerName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  providerSpecialty: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, marginTop: 1 },
  providerLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  providerLocation: { fontSize: Typography.sizes.sm, color: Colors.textMuted },
  friendOverlap: {
    fontSize: Typography.sizes.sm, color: Colors.primary,
    fontWeight: Typography.weights.bold, marginTop: 4, fontStyle: 'italic',
  },

  emptyState: { padding: Spacing['3xl'], alignItems: 'center' },
  emptyText: { fontSize: Typography.sizes.base, color: Colors.textMuted },
});

const postStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  friendAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceAlt },
  friendName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },
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
