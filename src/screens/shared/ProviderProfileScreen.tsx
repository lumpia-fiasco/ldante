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
import { RootStackParamList } from '../../navigation';
import { IconArrowLeft, IconMapPin, IconHeart, IconHeartFilled } from '@tabler/icons-react-native';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ProviderProfile'>;
  route: RouteProp<RootStackParamList, 'ProviderProfile'>;
};

// ─── Types ─────────────────────────────────────────────────────────────────────

type ProviderPost = {
  id: string;
  friendName: string;
  friendAvatar: string;
  friendId: string;
  photo: string;
  tags: string[];
  review: string;
  service: string;
  likes: number;
  liked: boolean;
};

type ProviderFriend = {
  id: string;
  name: string;
  avatar: string;
  visits: number;
};

type ProviderData = {
  id: string;
  name: string;
  specialty: string;
  location: string;
  avatar: string;
  bio: string;
  emoji: string;
  ratings: { label: string; score: number }[];
  nextAvailable: string;
  serviceList: { category: string; items: { name: string; price: string }[] }[];
  friends: ProviderFriend[];
  posts: ProviderPost[];
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_PROVIDERS: Record<string, ProviderData> = {
  p1: {
    id: 'p1', name: 'Carmela', specialty: 'Hair Braider', location: 'Costa Mesa, CA',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    emoji: '💇‍♀️',
    bio: "I specialize in hair health, using styling methods that are best for YOUR hair's health. Everyone is different, so I tailor my services and the products I use to fit your hair's needs.",
    ratings: [
      { label: 'Quality', score: 4.9 },
      { label: 'Friendliness', score: 4.5 },
      { label: 'Expertise', score: 4.9 },
      { label: 'Location', score: 3.5 },
    ],
    nextAvailable: 'Friday, November 7 (2 slots)',
    friends: [
      { id: 'f1', name: 'Sarah Kim', avatar: 'https://randomuser.me/api/portraits/women/55.jpg', visits: 6 },
      { id: 'f5', name: 'Martina Garcia', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', visits: 2 },
    ],
    posts: [
      {
        id: 'c_post1', friendName: 'Sarah Kim', friendId: 'f1',
        friendAvatar: 'https://randomuser.me/api/portraits/women/55.jpg',
        photo: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80',
        tags: ['Goddess Braids', 'Shampoo', 'Color'], service: '💇‍♀️',
        review: "Carmela did amazing with these braids! Best, hands-down. My hair has never been more healthy.",
        likes: 16, liked: false,
      },
      {
        id: 'c_post2', friendName: 'Martina Garcia', friendId: 'f5',
        friendAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
        photo: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80',
        tags: ['Cornrows', 'Design'], service: '💇‍♀️',
        review: "Carmela's cornrow game is unmatched. I get compliments every single time.",
        likes: 21, liked: false,
      },
    ],
    serviceList: [
      { category: 'Braids', items: [{ name: 'Box Braids', price: '$250.00' }, { name: 'Goddess Braids', price: '$350.00' }] },
      { category: 'Cornrows', items: [{ name: '4', price: '$200.00' }, { name: '6', price: '$500.00' }, { name: '12', price: '$250.00' }, { name: '+ Design', price: 'Inquire' }] },
      { category: 'Style', items: [{ name: 'Silk Press', price: '$250.00' }, { name: 'Shampoo & Style', price: '$250.00' }, { name: 'Conditioning', price: '$350.00' }] },
    ],
  },
  p2: {
    id: 'p2', name: 'Devon', specialty: 'Barber', location: 'Santa Ana, CA',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    emoji: '💈',
    bio: 'Precision cuts and clean fades are my specialty. 8 years behind the chair, I believe every client deserves a fresh look tailored to their face shape and lifestyle.',
    ratings: [{ label: 'Quality', score: 4.8 }, { label: 'Friendliness', score: 4.9 }, { label: 'Expertise', score: 4.8 }, { label: 'Wait Time', score: 4.2 }],
    nextAvailable: 'Tomorrow (3 slots)',
    friends: [{ id: 'f5', name: 'Martina Garcia', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', visits: 10 }],
    posts: [{ id: 'd_post1', friendName: 'Martina Garcia', friendId: 'f5', friendAvatar: 'https://randomuser.me/api/portraits/women/32.jpg', photo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80', tags: ['Fade', 'Lineup'], service: '💈', review: "Devon is hands down the best barber in OC.", likes: 24, liked: true }],
    serviceList: [
      { category: 'Cuts', items: [{ name: 'Fade', price: '$35.00' }, { name: 'Taper', price: '$30.00' }, { name: 'Shape-Up', price: '$20.00' }, { name: 'Full Cut & Style', price: '$50.00' }] },
      { category: 'Beard', items: [{ name: 'Beard Trim', price: '$15.00' }, { name: 'Beard Line-Up', price: '$20.00' }, { name: 'Hot Towel Shave', price: '$35.00' }] },
      { category: 'Add-Ons', items: [{ name: 'Lineup', price: '$10.00' }, { name: 'Scalp Massage', price: '$15.00' }, { name: 'Hair Design', price: 'Inquire' }] },
    ],
  },
  p3: {
    id: 'p3', name: 'Jasmine', specialty: 'Nail Artist', location: 'Irvine, CA',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    emoji: '💅',
    bio: 'Nail art is my passion — from minimalist clean girl nails to bold statement sets. I use only non-toxic, premium gel products.',
    ratings: [{ label: 'Quality', score: 4.7 }, { label: 'Friendliness', score: 5.0 }, { label: 'Expertise', score: 4.8 }, { label: 'Value', score: 4.4 }],
    nextAvailable: 'Saturday (1 slot)',
    friends: [
      { id: 'f1', name: 'Sarah Kim', avatar: 'https://randomuser.me/api/portraits/women/55.jpg', visits: 4 },
      { id: 'f5', name: 'Martina Garcia', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', visits: 4 },
      { id: 'f3', name: 'Lisa Morgan', avatar: 'https://randomuser.me/api/portraits/women/12.jpg', visits: 3 },
    ],
    posts: [{ id: 'j_post1', friendName: 'Sarah Kim', friendId: 'f1', friendAvatar: 'https://randomuser.me/api/portraits/women/55.jpg', photo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80', tags: ['Gel Manicure', 'Nail Art'], service: '💅', review: "Jasmine did the most beautiful set — clean, precise, and so cute.", likes: 8, liked: false }],
    serviceList: [
      { category: 'Manicure', items: [{ name: 'Classic Manicure', price: '$35.00' }, { name: 'Gel Manicure', price: '$55.00' }, { name: 'Soft Gel Extensions', price: '$75.00' }, { name: 'Acrylic Full Set', price: '$65.00' }] },
      { category: 'Pedicure', items: [{ name: 'Classic Pedicure', price: '$45.00' }, { name: 'Gel Pedicure', price: '$65.00' }, { name: 'Spa Pedicure', price: '$75.00' }] },
      { category: 'Nail Art', items: [{ name: 'Simple Design (per nail)', price: '$5.00' }, { name: 'Complex Art (per nail)', price: '$10.00' }, { name: 'Full Custom Set', price: 'Inquire' }] },
    ],
  },
  p4: {
    id: 'p4', name: 'Marcus', specialty: 'Massage Therapist', location: 'Anaheim, CA',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    emoji: '💆',
    bio: "Licensed massage therapist with 10 years of experience in therapeutic and relaxation massage.",
    ratings: [{ label: 'Quality', score: 4.8 }, { label: 'Friendliness', score: 4.7 }, { label: 'Expertise', score: 4.9 }, { label: 'Atmosphere', score: 4.6 }],
    nextAvailable: 'Wednesday (2 slots)',
    friends: [
      { id: 'f1', name: 'Sarah Kim', avatar: 'https://randomuser.me/api/portraits/women/55.jpg', visits: 3 },
      { id: 'f2', name: 'Emily Rodriguez', avatar: 'https://randomuser.me/api/portraits/women/33.jpg', visits: 5 },
    ],
    posts: [{ id: 'm_post1', friendName: 'Emily Rodriguez', friendId: 'f2', friendAvatar: 'https://randomuser.me/api/portraits/women/33.jpg', photo: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', tags: ['Deep Tissue', 'Sports'], service: '💆', review: "Marcus has healing hands. Every session feels tailored exactly to where I'm holding tension.", likes: 14, liked: false }],
    serviceList: [
      { category: 'Therapeutic', items: [{ name: 'Deep Tissue (60 min)', price: '$95.00' }, { name: 'Deep Tissue (90 min)', price: '$135.00' }, { name: 'Sports Massage (60 min)', price: '$100.00' }, { name: 'Trigger Point Therapy', price: '$110.00' }] },
      { category: 'Relaxation', items: [{ name: 'Swedish (60 min)', price: '$85.00' }, { name: 'Swedish (90 min)', price: '$120.00' }, { name: 'Hot Stone (75 min)', price: '$115.00' }, { name: 'Aromatherapy Add-On', price: '$20.00' }] },
    ],
  },
  p5: {
    id: 'p5', name: 'Aisha', specialty: 'Esthetician', location: 'Long Beach, CA',
    avatar: 'https://randomuser.me/api/portraits/women/91.jpg',
    emoji: '🧖‍♀️',
    bio: "Board-certified esthetician specializing in advanced skin treatments. I believe healthy skin is a lifelong journey.",
    ratings: [{ label: 'Quality', score: 4.6 }, { label: 'Friendliness', score: 4.8 }, { label: 'Expertise', score: 4.7 }, { label: 'Cleanliness', score: 5.0 }],
    nextAvailable: 'Thursday (2 slots)',
    friends: [
      { id: 'f3', name: 'Lisa Morgan', avatar: 'https://randomuser.me/api/portraits/women/12.jpg', visits: 7 },
      { id: 'f5', name: 'Martina Garcia', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', visits: 5 },
    ],
    posts: [{ id: 'a_post1', friendName: 'Lisa Morgan', friendId: 'f3', friendAvatar: 'https://randomuser.me/api/portraits/women/12.jpg', photo: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80', tags: ['HydraFacial', 'Glow'], service: '🧖‍♀️', review: "Aisha is the skin whisperer. Left glowing like never before.", likes: 31, liked: false }],
    serviceList: [
      { category: 'Facials', items: [{ name: 'HydraFacial (60 min)', price: '$145.00' }, { name: 'Classic Facial (50 min)', price: '$85.00' }, { name: 'Chemical Peel', price: '$120.00' }, { name: 'Microdermabrasion', price: '$100.00' }] },
      { category: 'Brow & Lash', items: [{ name: 'Brow Shaping', price: '$30.00' }, { name: 'Brow Tint', price: '$25.00' }, { name: 'Lash Tint', price: '$35.00' }, { name: 'Brow + Lash Combo', price: '$50.00' }] },
    ],
  },
  p6: {
    id: 'p6', name: 'Tyler', specialty: 'Personal Trainer', location: 'Torrance, CA',
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
    emoji: '💪',
    bio: 'NASM-certified personal trainer with a focus on functional fitness. My approach is science-backed but human-first.',
    ratings: [{ label: 'Quality', score: 4.9 }, { label: 'Friendliness', score: 4.9 }, { label: 'Expertise', score: 4.8 }, { label: 'Punctuality', score: 4.7 }],
    nextAvailable: 'Monday (4 slots)',
    friends: [{ id: 'f2', name: 'Emily Rodriguez', avatar: 'https://randomuser.me/api/portraits/women/33.jpg', visits: 8 }],
    posts: [{ id: 't_post1', friendName: 'Emily Rodriguez', friendId: 'f2', friendAvatar: 'https://randomuser.me/api/portraits/women/33.jpg', photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', tags: ['HIIT', 'Personal Training'], service: '💪', review: "Tyler is the real deal. He pushes you just enough and the results speak for themselves.", likes: 19, liked: false }],
    serviceList: [
      { category: 'Training', items: [{ name: 'HIIT Session (45 min)', price: '$80.00' }, { name: 'Strength Training (60 min)', price: '$85.00' }, { name: 'Mobility & Recovery (45 min)', price: '$70.00' }, { name: '10-Session Package', price: '$750.00' }] },
      { category: 'Coaching', items: [{ name: 'Nutrition Coaching (monthly)', price: '$150.00' }, { name: 'Online Programming', price: '$99.00/mo' }, { name: 'Initial Assessment', price: '$60.00' }] },
    ],
  },
  p7: {
    id: 'p7', name: 'Brianna', specialty: 'Makeup Artist', location: 'Compton, CA',
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    emoji: '💄',
    bio: 'Makeup artist with 6 years in editorial, bridal, and commercial work. I love celebrating natural beauty.',
    ratings: [{ label: 'Quality', score: 4.7 }, { label: 'Friendliness', score: 4.9 }, { label: 'Expertise', score: 4.6 }, { label: 'Value', score: 4.8 }],
    nextAvailable: 'Friday (2 slots)',
    friends: [
      { id: 'f4', name: 'Amanda Chen', avatar: 'https://randomuser.me/api/portraits/women/28.jpg', visits: 3 },
      { id: 'f3', name: 'Lisa Morgan', avatar: 'https://randomuser.me/api/portraits/women/12.jpg', visits: 2 },
    ],
    posts: [{ id: 'b_post1', friendName: 'Amanda Chen', friendId: 'f4', friendAvatar: 'https://randomuser.me/api/portraits/women/28.jpg', photo: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80', tags: ['Full Glam', 'Editorial'], service: '💄', review: "Brianna is an artist. She understood my vision immediately and delivered something even better than I imagined.", likes: 22, liked: false }],
    serviceList: [
      { category: 'Glam', items: [{ name: 'Full Glam', price: '$150.00' }, { name: 'Natural Glam', price: '$100.00' }, { name: 'Editorial Look', price: 'Inquire' }] },
      { category: 'Bridal', items: [{ name: 'Bridal Makeup', price: '$250.00' }, { name: 'Bridal Trial', price: '$150.00' }, { name: 'Bridesmaid (per person)', price: '$95.00' }] },
      { category: 'Lesson', items: [{ name: 'Makeup Lesson (90 min)', price: '$120.00' }, { name: 'Mini Lesson (45 min)', price: '$75.00' }] },
    ],
  },
};

const DEFAULT_PROVIDER = MOCK_PROVIDERS['p1'];

// ─── Screen ────────────────────────────────────────────────────────────────────

export function ProviderProfileScreen({ navigation, route }: Props) {
  const { providerId } = route.params;
  const provider = MOCK_PROVIDERS[providerId] ?? DEFAULT_PROVIDER;

  const [activeTab, setActiveTab] = useState<'profile' | 'posts' | 'gotos'>('profile');
  const [posts, setPosts] = useState(provider.posts);
  const [saved, setSaved] = useState(false);

  function handleBook() {
    navigation.navigate('BookingFlow', { providerId: provider.id });
  }

  function handleSave() {
    setSaved(!saved);
    Alert.alert(
      saved ? 'Removed' : 'Added!',
      saved ? `${provider.name} removed from your Go-tos` : `${provider.name} added to your Go-tos 👑`
    );
  }

  function toggleLike(postId: string) {
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar: back (left) + provider emoji (right) */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <IconArrowLeft size={24} color={Colors.textPrimary} strokeWidth={1.75} />
        </TouchableOpacity>
        <Text style={styles.topEmoji}>{provider.emoji}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero: avatar + name + specialty + location */}
        <View style={styles.heroSection}>
          <Image source={{ uri: provider.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{provider.name}</Text>
          <Text style={styles.specialty}>{provider.specialty}</Text>
          <View style={styles.locationRow}>
            <IconMapPin size={14} color={Colors.textMuted} strokeWidth={1.75} />
            <Text style={styles.location}>{provider.location}</Text>
          </View>
        </View>

        {/* Tab Bar: Profile | Posts | Go-tos */}
        <View style={styles.tabBar}>
          {[
            { key: 'profile', label: 'Profile' },
            { key: 'posts', label: 'Posts' },
            { key: 'gotos', label: 'Go-tos' },
          ].map(t => (
            <TouchableOpacity
              key={t.key}
              style={styles.tab}
              onPress={() => setActiveTab(t.key as any)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>
                {t.label}
              </Text>
              {activeTab === t.key && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── PROFILE tab ── */}
        {activeTab === 'profile' && (
          <View>
            {/* Ratings Grid - 4 cells in a row */}
            <View style={styles.ratingsGrid}>
              {provider.ratings.map((r) => (
                <View key={r.label} style={styles.ratingCell}>
                  <Text style={styles.ratingScore}>{r.score.toFixed(1)}</Text>
                  <Text style={styles.ratingLabel}>{r.label}</Text>
                </View>
              ))}
            </View>

            {/* Bio */}
            <Text style={styles.bio}>{provider.bio}</Text>

            {/* Friends who are patrons */}
            {provider.friends.length > 0 && (
              <Text style={styles.friendsPatrons}>
                {provider.friends.length} of your friends are patrons
              </Text>
            )}

            {/* Add to Go-tos full-width button */}
            <TouchableOpacity
              style={[styles.saveBtn, saved && styles.saveBtnActive]}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={[styles.saveBtnText, saved && styles.saveBtnTextActive]}>
                {saved ? '✓ In My Go-tos' : 'Add to Go-tos'}
              </Text>
            </TouchableOpacity>

            {/* Service List */}
            <View style={styles.serviceListSection}>
              <Text style={styles.serviceListTitle}>Service List</Text>
              {provider.serviceList.map((group, gi) => (
                <View key={group.category}>
                  <Text style={styles.serviceCategory}>{group.category}</Text>
                  {group.items.map((item, i) => (
                    <View key={i} style={styles.serviceRow}>
                      <Text style={styles.serviceName}>{item.name}</Text>
                      <Text style={[
                        styles.servicePrice,
                        item.price === 'Inquire' && styles.servicePriceInquire,
                      ]}>{item.price}</Text>
                    </View>
                  ))}
                  {gi < provider.serviceList.length - 1 && (
                    <View style={styles.serviceDivider} />
                  )}
                </View>
              ))}
            </View>

            {/* Book now sticky footer area */}
            <View style={styles.bookRow}>
              <View style={styles.availSection}>
                <Text style={styles.availLabel}>Next available:</Text>
                <Text style={styles.availDate}>{provider.nextAvailable}</Text>
              </View>
              <TouchableOpacity style={styles.bookBtn} onPress={handleBook} activeOpacity={0.8}>
                <Text style={styles.bookBtnText}>Book now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── POSTS tab ── */}
        {activeTab === 'posts' && (
          <View>
            <Text style={styles.sectionLabel}>{provider.name.toUpperCase()}'S POSTS</Text>
            {posts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No posts yet</Text>
              </View>
            ) : (
              posts.map(post => (
                <ProviderPostCard
                  key={post.id}
                  post={post}
                  providerName={provider.name}
                  providerAvatar={provider.avatar}
                  providerLocation={provider.location}
                  onFriendPress={() => navigation.navigate('FriendProfile', { friendId: post.friendId })}
                  onLike={() => toggleLike(post.id)}
                />
              ))
            )}
          </View>
        )}

        {/* ── GO-TOS tab (friends who go here) ── */}
        {activeTab === 'gotos' && (
          <View>
            <Text style={styles.sectionLabel}>FRIENDS WHO GO HERE</Text>
            {provider.friends.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>None of your friends go here yet</Text>
              </View>
            ) : (
              provider.friends.map(friend => (
                <TouchableOpacity
                  key={friend.id}
                  style={styles.friendRow}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('FriendProfile', { friendId: friend.id })}
                >
                  <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    <Text style={styles.friendVisits}>Visited {friend.visits}×</Text>
                  </View>
                  <Text style={styles.viewChevron}>View →</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Post Card ─────────────────────────────────────────────────────────────────

function ProviderPostCard({
  post,
  providerName,
  providerAvatar,
  providerLocation,
  onFriendPress,
  onLike,
}: {
  post: ProviderPost;
  providerName: string;
  providerAvatar: string;
  providerLocation: string;
  onFriendPress: () => void;
  onLike: () => void;
}) {
  return (
    <View style={postStyles.card}>
      {/* Friend header */}
      <TouchableOpacity style={postStyles.header} onPress={onFriendPress} activeOpacity={0.7}>
        <View style={postStyles.headerLeft}>
          <Image source={{ uri: post.friendAvatar }} style={postStyles.friendAvatar} />
          <Text style={postStyles.friendName}>{post.friendName}</Text>
        </View>
        <Text style={postStyles.serviceEmoji}>{post.service}</Text>
      </TouchableOpacity>

      {/* Full-width photo */}
      <Image source={{ uri: post.photo }} style={postStyles.photo} />

      {/* Tags + provider mini info */}
      <View style={postStyles.metaRow}>
        <View style={postStyles.tagsWrap}>
          {post.tags.map(tag => (
            <View key={tag} style={postStyles.tag}>
              <Text style={postStyles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={postStyles.providerMini}>
          <Image source={{ uri: providerAvatar }} style={postStyles.providerAvatar} />
          <View>
            <Text style={postStyles.providerName}>{providerName}</Text>
            <Text style={postStyles.providerLocation}>{providerLocation}</Text>
          </View>
        </View>
      </View>

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
  topEmoji: { fontSize: 32 },

  heroSection: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    gap: Spacing.xs,
    backgroundColor: Colors.surfaceAlt,
  },
  avatar: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 3, borderColor: Colors.surface,
    ...Shadows.md,
    marginBottom: Spacing.sm,
  },
  name: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  specialty: { fontSize: Typography.sizes.base, color: Colors.textSecondary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  location: { fontSize: Typography.sizes.sm, color: Colors.textMuted },

  // Tab Bar
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

  // Profile tab
  ratingsGrid: {
    flexDirection: 'row',
    marginHorizontal: Spacing.base,
    gap: Spacing.sm,
    marginTop: Spacing.base,
    marginBottom: Spacing.base,
  },
  ratingCell: {
    flex: 1, backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg, padding: Spacing.md,
    alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: Colors.border,
  },
  ratingScore: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  ratingLabel: { fontSize: Typography.sizes.xs, color: Colors.textSecondary, textAlign: 'center' },

  bio: {
    fontSize: Typography.sizes.base, color: Colors.textSecondary, lineHeight: 24,
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm,
  },
  friendsPatrons: {
    fontSize: Typography.sizes.sm, color: Colors.primary,
    fontWeight: Typography.weights.bold,
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.base,
  },

  // Add to Go-tos button
  saveBtn: {
    marginHorizontal: Spacing.base,
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg,
    paddingVertical: Spacing.md, alignItems: 'center',
    backgroundColor: Colors.surface,
    marginBottom: Spacing.base,
  },
  saveBtnActive: { backgroundColor: Colors.surfaceAlt, borderColor: Colors.primary },
  saveBtnText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },
  saveBtnTextActive: { color: Colors.primary },

  // Service list
  serviceListSection: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.base,
  },
  serviceListTitle: {
    fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold,
    color: Colors.textPrimary, marginBottom: Spacing.md,
  },
  serviceCategory: {
    fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold,
    color: Colors.textPrimary, paddingVertical: Spacing.sm,
  },
  serviceRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  serviceName: { fontSize: Typography.sizes.base, color: Colors.textSecondary },
  servicePrice: { fontSize: Typography.sizes.base, color: Colors.textSecondary, fontWeight: Typography.weights.medium },
  servicePriceInquire: { color: Colors.textMuted },
  serviceDivider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },

  // Book row
  bookRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, marginBottom: Spacing.base, gap: Spacing.base,
  },
  availSection: { flex: 1 },
  availLabel: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  availDate: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  bookBtn: {
    backgroundColor: Colors.surfaceAlt, borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  bookBtnText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },

  // Section label
  sectionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },

  // Friends list
  friendRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  friendAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.surfaceAlt },
  friendInfo: { flex: 1 },
  friendName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  friendVisits: { fontSize: Typography.sizes.sm, color: Colors.primary, fontWeight: Typography.weights.medium, marginTop: 2 },
  viewChevron: { fontSize: Typography.sizes.sm, color: Colors.primary, fontWeight: Typography.weights.medium },

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
