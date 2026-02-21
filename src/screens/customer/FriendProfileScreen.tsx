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

// ─── Mock Data ─────────────────────────────────────────────────────────────────

type FriendData = {
  id: string;
  name: string;
  location: string;
  avatar?: string;
  bio: string;
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

const MOCK_FRIENDS: Record<string, FriendData> = {
  f1: {
    id: 'f1',
    name: 'Sarah Kim',
    location: 'Irvine, CA',
    avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    bio: 'Beauty enthusiast & wellness junkie. Always on the hunt for the best kept secrets in OC. 💇‍♀️💅',
    posts: [
      {
        id: 'p1',
        photo: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80',
        tags: ['Balayage', 'Color'],
        review: "Jessica is honestly a magician. My hair has never looked this good. 10/10 would recommend to everyone.",
        provider: { name: 'Jessica Williams', location: 'Costa Mesa, CA', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', id: 'p1', service: '💇‍♀️' },
        likes: 12,
        liked: false,
      },
      {
        id: 'p2',
        photo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
        tags: ['Gel Manicure', 'Nail Art'],
        review: "Jasmine did the most beautiful set — clean, precise, and so cute. Already booked my next appointment.",
        provider: { name: 'Jasmine', location: 'Irvine, CA', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', id: 'p3', service: '💅' },
        likes: 8,
        liked: true,
      },
    ],
    providers: [
      {
        id: 'p1', name: 'Jessica Williams', specialty: 'Hair Stylist',
        location: 'Luxe Loft Suites, Costa Mesa',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        score: 4.9, ratings: 52, tags: ['Balayage', 'Color Specialist'],
        visits: 6, inMyRolodex: false,
      },
      {
        id: 'p3', name: 'Jasmine', specialty: 'Nail Artist',
        location: 'Irvine, CA',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
        score: 4.7, ratings: 29, tags: ['Gel Manicure', 'Nail Art'],
        visits: 4, inMyRolodex: true,
      },
      {
        id: 'p5', name: 'Aisha', specialty: 'Esthetician',
        location: 'Long Beach, CA',
        avatar: 'https://randomuser.me/api/portraits/women/91.jpg',
        score: 4.6, ratings: 22, tags: ['HydraFacial', 'Brow Shaping'],
        visits: 2, inMyRolodex: false,
      },
      {
        id: 'p4', name: 'Marcus Thompson', specialty: 'Massage Therapist',
        location: 'Wellness Studio, Anaheim',
        avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
        score: 4.8, ratings: 38, tags: ['Deep Tissue', 'Sports'],
        visits: 3, inMyRolodex: true,
      },
    ],
  },
  f2: {
    id: 'f2',
    name: 'Emily Rodriguez',
    location: 'Santa Ana, CA',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    bio: 'Fitness lover & self-care advocate. Finding the best trainers and massage therapists in SoCal 💪🧖‍♀️',
    posts: [
      {
        id: 'p3',
        photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
        tags: ['HIIT', 'Personal Training'],
        review: "Tyler is the real deal. He pushes you just enough and the results speak for themselves. Highly recommend.",
        provider: { name: 'Tyler', location: 'Torrance, CA', avatar: 'https://randomuser.me/api/portraits/men/33.jpg', id: 'p6', service: '💪' },
        likes: 19,
        liked: false,
      },
    ],
    providers: [
      {
        id: 'p6', name: 'Tyler', specialty: 'Personal Trainer',
        location: 'Torrance, CA',
        avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
        score: 4.9, ratings: 41, tags: ['HIIT', 'Strength Training'],
        visits: 8, inMyRolodex: false,
      },
      {
        id: 'p4', name: 'Marcus Thompson', specialty: 'Massage Therapist',
        location: 'Wellness Studio, Anaheim',
        avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
        score: 4.8, ratings: 38, tags: ['Deep Tissue', 'Sports'],
        visits: 5, inMyRolodex: false,
      },
    ],
  },
  f3: {
    id: 'f3',
    name: 'Lisa Morgan',
    location: 'Long Beach, CA',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    bio: 'Skincare obsessed. If it glows, I know who did it ✨',
    posts: [
      {
        id: 'p4',
        photo: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
        tags: ['HydraFacial', 'Glow'],
        review: "Aisha is the skin whisperer. Left glowing like never before. I'm a forever client.",
        provider: { name: 'Aisha', location: 'Long Beach, CA', avatar: 'https://randomuser.me/api/portraits/women/91.jpg', id: 'p5', service: '🧖‍♀️' },
        likes: 31,
        liked: false,
      },
    ],
    providers: [
      {
        id: 'p5', name: 'Aisha', specialty: 'Esthetician',
        location: 'Long Beach, CA',
        avatar: 'https://randomuser.me/api/portraits/women/91.jpg',
        score: 4.6, ratings: 22, tags: ['HydraFacial', 'Chemical Peel'],
        visits: 7, inMyRolodex: false,
      },
    ],
  },
};

const DEFAULT_FRIEND: FriendData = MOCK_FRIENDS['f1'];

// ─── Screen ────────────────────────────────────────────────────────────────────

export function FriendProfileScreen({ navigation, route }: Props) {
  const { friendId } = route.params;
  const friend = MOCK_FRIENDS[friendId] ?? DEFAULT_FRIEND;

  const [activeTab, setActiveTab] = useState<'Posts' | 'Services'>('Posts');
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
      "You'll no longer see their posts or rolodex.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unfollow', style: 'destructive',
          onPress: () => { setFollowing(false); navigation.goBack(); },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <IconArrowLeft size={24} color={Colors.textPrimary} strokeWidth={1.75} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.unfollowBtn}
          onPress={handleUnfollow}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <IconUserMinus size={16} color={Colors.textSecondary} strokeWidth={1.75} />
          <Text style={styles.unfollowText}>Unfollow</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {/* Avatar */}
          <View style={styles.avatarWrap}>
            {friend.avatar ? (
              <Image source={{ uri: friend.avatar }} style={styles.avatar} />
            ) : (
              <Avatar name={friend.name} size={100} />
            )}
          </View>

          {/* Name, location, bio */}
          <Text style={styles.name}>{friend.name}</Text>
          <View style={styles.locationRow}>
            <IconMapPin size={14} color={Colors.textMuted} strokeWidth={1.75} />
            <Text style={styles.location}>{friend.location}</Text>
          </View>
          <Text style={styles.bio}>{friend.bio}</Text>

          {/* Quick stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{friend.providers.length}</Text>
              <Text style={styles.statLabel}>Providers</Text>
            </View>
          </View>
        </View>

        {/* Sticky Tab Bar */}
        <View style={styles.tabBar}>
          {(['Posts', 'Services'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={styles.tab}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Posts Tab */}
        {activeTab === 'Posts' && (
          <View style={styles.postsContainer}>
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                friendFirstName={friend.name.split(' ')[0]}
                onLike={() => toggleLike(post.id)}
                onProviderPress={() =>
                  navigation.navigate('ProviderProfile', { providerId: post.provider.id })
                }
              />
            ))}
            {posts.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No posts yet</Text>
              </View>
            )}
          </View>
        )}

        {/* Services Tab */}
        {activeTab === 'Services' && (
          <View style={styles.servicesContainer}>
            <Text style={styles.servicesTitle}>
              {friend.name.split(' ')[0]}'s Providers
            </Text>
            {friend.providers.map(provider => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                friendFirstName={friend.name.split(' ')[0]}
                onPress={() =>
                  navigation.navigate('ProviderProfile', { providerId: provider.id, referralFriendId: friendId })
                }
                onBook={() =>
                  navigation.navigate('BookingFlow', { providerId: provider.id })
                }
              />
            ))}
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
  friendFirstName,
  onLike,
  onProviderPress,
}: {
  post: FriendPost;
  friendFirstName: string;
  onLike: () => void;
  onProviderPress: () => void;
}) {
  return (
    <View style={postStyles.card}>
      {/* Post header: friend + service emoji */}
      <View style={postStyles.header}>
        <Text style={postStyles.postedBy}>{friendFirstName} tried</Text>
        <Text style={postStyles.serviceEmoji}>{post.provider.service}</Text>
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

      {/* Provider row */}
      <TouchableOpacity style={postStyles.providerRow} onPress={onProviderPress} activeOpacity={0.7}>
        <Image source={{ uri: post.provider.avatar }} style={postStyles.providerAvatar} />
        <View>
          <Text style={postStyles.providerName}>{post.provider.name}</Text>
          <Text style={postStyles.providerLocation}>{post.provider.location}</Text>
        </View>
      </TouchableOpacity>

      {/* Review */}
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

// ─── Provider Card ─────────────────────────────────────────────────────────────

function ProviderCard({
  provider,
  friendFirstName,
  onPress,
  onBook,
}: {
  provider: FriendProvider;
  friendFirstName: string;
  onPress: () => void;
  onBook: () => void;
}) {
  const [inRolodex, setInRolodex] = useState(provider.inMyRolodex);

  return (
    <View style={providerCardStyles.card}>
      <TouchableOpacity style={providerCardStyles.main} onPress={onPress} activeOpacity={0.85}>
        <Image source={{ uri: provider.avatar }} style={providerCardStyles.avatar} />
        <View style={providerCardStyles.info}>
          <Text style={providerCardStyles.name}>{provider.name}</Text>
          <Text style={providerCardStyles.specialty}>{provider.specialty}</Text>
          <View style={providerCardStyles.locationRow}>
            <IconMapPin size={12} color={Colors.textMuted} strokeWidth={1.75} />
            <Text style={providerCardStyles.location}>{provider.location}</Text>
          </View>
          <View style={providerCardStyles.tags}>
            {provider.tags.map(t => (
              <Badge key={t} label={t} variant="neutral" />
            ))}
          </View>
          <View style={providerCardStyles.meta}>
            <StarRating score={provider.score} size={12} showScore count={provider.ratings} />
            <Text style={providerCardStyles.visits}>
              {friendFirstName} visited {provider.visits}×
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={providerCardStyles.actions}>
        <Button
          label={inRolodex ? '✓ In My Rolodex' : 'Add to Rolodex'}
          onPress={() => {
            if (!inRolodex) {
              setInRolodex(true);
              Alert.alert('Added!', `${provider.name} added to your Rolodex.`);
            }
          }}
          variant={inRolodex ? 'secondary' : 'outline'}
          size="sm"
          style={{ flex: 1 }}
        />
        <Button
          label="Book"
          onPress={onBook}
          size="sm"
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  unfollowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.surface,
  },
  unfollowText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },

  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  avatarWrap: {
    marginBottom: Spacing.sm,
    ...Shadows.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  name: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  bio: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: Spacing.xs,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
    gap: Spacing.xl,
    marginTop: Spacing.sm,
  },
  statItem: { alignItems: 'center', gap: 2 },
  statValue: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.extrabold, color: Colors.textPrimary },
  statLabel: { fontSize: Typography.sizes.xs, color: Colors.textMuted },
  statDivider: { width: 1, height: 28, backgroundColor: Colors.border },

  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  tab: { marginRight: Spacing.xl, paddingBottom: Spacing.sm, paddingTop: Spacing.sm, position: 'relative' },
  tabText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.medium, color: Colors.textMuted },
  tabTextActive: { color: Colors.textPrimary, fontWeight: Typography.weights.bold },
  tabUnderline: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 2, backgroundColor: Colors.textPrimary, borderRadius: 1,
  },

  postsContainer: { paddingTop: Spacing.md },
  emptyState: { padding: Spacing['3xl'], alignItems: 'center' },
  emptyText: { fontSize: Typography.sizes.base, color: Colors.textMuted },

  servicesContainer: { padding: Spacing.base, gap: Spacing.md },
  servicesTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
});

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
  postedBy: { fontSize: Typography.sizes.sm, color: Colors.textMuted, fontStyle: 'italic' },
  serviceEmoji: { fontSize: 28 },
  photo: { width: '100%', height: 260, backgroundColor: Colors.surfaceAlt },
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

const providerCardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  main: { flexDirection: 'row', gap: Spacing.md, padding: Spacing.base },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.surfaceAlt },
  info: { flex: 1, gap: Spacing.xs },
  name: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  specialty: { fontSize: Typography.sizes.sm, color: Colors.secondary, fontWeight: Typography.weights.medium },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  location: { fontSize: Typography.sizes.xs, color: Colors.textMuted },
  tags: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  visits: { fontSize: Typography.sizes.xs, color: Colors.primary, fontWeight: Typography.weights.medium },
  actions: { flexDirection: 'row', gap: Spacing.sm, padding: Spacing.base, paddingTop: 0 },
});
