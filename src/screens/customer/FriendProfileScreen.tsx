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
// Provider IDs must match ProviderProfileScreen: p1=Carmela, p2=Devon, p3=Jasmine,
// p4=Marcus, p5=Aisha, p6=Tyler, p7=Brianna.
// Provider IDs in posts/providers must be consistent with DiscoverScreen feed.

const MOCK_FRIENDS: Record<string, FriendData> = {
  f1: {
    id: 'f1',
    name: 'Sarah Kim',
    location: 'Irvine, CA',
    avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    bio: 'Beauty enthusiast & wellness junkie. Always on the hunt for the best kept secrets in OC. 💇‍♀️💅',
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
      {
        id: 'p1', name: 'Carmela', specialty: 'Hair Braider',
        location: 'Costa Mesa, CA',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        score: 4.9, ratings: 52, tags: ['Braids', 'Color'],
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
        id: 'p4', name: 'Marcus', specialty: 'Massage Therapist',
        location: 'Anaheim, CA',
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
      {
        id: 'p6', name: 'Tyler', specialty: 'Personal Trainer',
        location: 'Torrance, CA',
        avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
        score: 4.9, ratings: 41, tags: ['HIIT', 'Strength Training'],
        visits: 8, inMyRolodex: false,
      },
      {
        id: 'p4', name: 'Marcus', specialty: 'Massage Therapist',
        location: 'Anaheim, CA',
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
      {
        id: 'p5', name: 'Aisha', specialty: 'Esthetician',
        location: 'Long Beach, CA',
        avatar: 'https://randomuser.me/api/portraits/women/91.jpg',
        score: 4.6, ratings: 22, tags: ['HydraFacial', 'Chemical Peel'],
        visits: 7, inMyRolodex: false,
      },
      {
        id: 'p7', name: 'Brianna', specialty: 'Makeup Artist',
        location: 'Compton, CA',
        avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
        score: 4.7, ratings: 34, tags: ['Full Glam', 'Bridal'],
        visits: 2, inMyRolodex: false,
      },
      {
        id: 'p3', name: 'Jasmine', specialty: 'Nail Artist',
        location: 'Irvine, CA',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
        score: 4.7, ratings: 29, tags: ['Gel Manicure', 'Nail Art'],
        visits: 3, inMyRolodex: false,
      },
    ],
  },

  f4: {
    id: 'f4',
    name: 'Amanda Chen',
    location: 'Newport Beach, CA',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    bio: 'Minimalist beauty. One great provider at a time. 💄',
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
      {
        id: 'p7', name: 'Brianna', specialty: 'Makeup Artist',
        location: 'Compton, CA',
        avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
        score: 4.7, ratings: 34, tags: ['Full Glam', 'Bridal'],
        visits: 3, inMyRolodex: false,
      },
    ],
  },

  f5: {
    id: 'f5',
    name: 'Martina Garcia',
    location: 'Compton, CA',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    bio: 'Booked and blessed. I stay fresh and I know who to credit. 💈✨',
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
      {
        id: 'mgp3',
        photo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
        tags: ['Gel Manicure', 'Chrome'],
        review: "Jasmine never misses. My nails stay perfect for weeks.",
        provider: { name: 'Jasmine', location: 'Irvine, CA', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', id: 'p3', service: '💅' },
        likes: 11,
        liked: false,
      },
    ],
    providers: [
      {
        id: 'p2', name: 'Devon', specialty: 'Barber',
        location: 'Santa Ana, CA',
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
        score: 4.8, ratings: 60, tags: ['Fade', 'Lineup'],
        visits: 10, inMyRolodex: true,
      },
      {
        id: 'p5', name: 'Aisha', specialty: 'Esthetician',
        location: 'Long Beach, CA',
        avatar: 'https://randomuser.me/api/portraits/women/91.jpg',
        score: 4.6, ratings: 22, tags: ['HydraFacial', 'Brow Shaping'],
        visits: 5, inMyRolodex: false,
      },
      {
        id: 'p3', name: 'Jasmine', specialty: 'Nail Artist',
        location: 'Irvine, CA',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
        score: 4.7, ratings: 29, tags: ['Gel Manicure', 'Chrome'],
        visits: 4, inMyRolodex: false,
      },
      {
        id: 'p1', name: 'Carmela', specialty: 'Hair Braider',
        location: 'Costa Mesa, CA',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        score: 4.9, ratings: 52, tags: ['Braids', 'Cornrows'],
        visits: 2, inMyRolodex: false,
      },
      {
        id: 'p4', name: 'Marcus', specialty: 'Massage Therapist',
        location: 'Anaheim, CA',
        avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
        score: 4.8, ratings: 38, tags: ['Deep Tissue'],
        visits: 1, inMyRolodex: false,
      },
    ],
  },
};

// ─── Screen ────────────────────────────────────────────────────────────────────

export function FriendProfileScreen({ navigation, route }: Props) {
  const { friendId } = route.params;
  const friend = MOCK_FRIENDS[friendId] ?? MOCK_FRIENDS['f1'];

  // 'profile' | 'posts' | 'providers'
  const [activeSection, setActiveSection] = useState<'posts' | 'providers'>('posts');
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
      {/* Top bar */}
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
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
          <Text style={styles.bio}>{friend.bio}</Text>

          {/* Stats — tapping switches the section shown below */}
          <View style={styles.statsRow}>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => setActiveSection('posts')}
              activeOpacity={0.7}
            >
              <Text style={[styles.statValue, activeSection === 'posts' && styles.statValueActive]}>
                {posts.length}
              </Text>
              <Text style={[styles.statLabel, activeSection === 'posts' && styles.statLabelActive]}>
                Posts
              </Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => setActiveSection('providers')}
              activeOpacity={0.7}
            >
              <Text style={[styles.statValue, activeSection === 'providers' && styles.statValueActive]}>
                {friend.providers.length}
              </Text>
              <Text style={[styles.statLabel, activeSection === 'providers' && styles.statLabelActive]}>
                Providers
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section indicator */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeSection === 'posts'
              ? `${friend.name.split(' ')[0]}'s Posts`
              : `${friend.name.split(' ')[0]}'s Providers`
            }
          </Text>
        </View>

        {/* Posts */}
        {activeSection === 'posts' && (
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

        {/* Providers */}
        {activeSection === 'providers' && (
          <View style={styles.providersContainer}>
            {friend.providers.map(provider => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                friendFirstName={friend.name.split(' ')[0]}
                onPress={() =>
                  navigation.navigate('ProviderProfile', { providerId: provider.id })
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
      <View style={postStyles.header}>
        <Text style={postStyles.postedBy}>{friendFirstName} tried</Text>
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
        <View style={{ flex: 1 }}>
          <Text style={postStyles.providerName}>{post.provider.name}</Text>
          <Text style={postStyles.providerLocation}>{post.provider.location}</Text>
        </View>
        <Text style={postStyles.viewProfile}>View →</Text>
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
  avatarWrap: { marginBottom: Spacing.sm, ...Shadows.md },
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
  statItem: { alignItems: 'center', gap: 2, paddingHorizontal: Spacing.lg },
  statValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: Colors.textSecondary,
  },
  statValueActive: { color: Colors.textPrimary },
  statLabel: { fontSize: Typography.sizes.xs, color: Colors.textMuted },
  statLabelActive: { color: Colors.primary, fontWeight: Typography.weights.semibold },
  statDivider: { width: 1, height: 28, backgroundColor: Colors.border },

  sectionHeader: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  sectionTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  postsContainer: { paddingTop: Spacing.md },
  providersContainer: { padding: Spacing.base, gap: Spacing.md },
  emptyState: { padding: Spacing['3xl'], alignItems: 'center' },
  emptyText: { fontSize: Typography.sizes.base, color: Colors.textMuted },
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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
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
  viewProfile: { fontSize: Typography.sizes.sm, color: Colors.primary, fontWeight: Typography.weights.medium },
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
