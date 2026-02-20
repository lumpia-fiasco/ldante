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
import { RootStackParamList } from '../../navigation';

type Nav = StackNavigationProp<RootStackParamList>;

// ─── Mock Data ─────────────────────────────────────────────────────────────────

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
    review: "Carmela did amazing with these braids! Best, hands-down. I think the best thing about all of this is that my hair has never been more healthy! Carmela knows how to take care of hair and keep it nice and healthy.",
    likes: 16,
    liked: false,
  },
  {
    id: '2',
    customer: { name: 'LoLinda', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    provider: { name: 'Carmela', location: 'Costa Mesa, CA', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', id: 'p1', service: '💇‍♀️' },
    photo: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&q=80',
    tags: ['Box Braids', 'Shampoo'],
    review: "She's so talented. Every time I leave feeling like a brand new person. 10/10 recommend!",
    likes: 9,
    liked: false,
  },
  {
    id: '3',
    customer: { name: 'Martina', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
    provider: { name: 'Devon', location: 'Santa Ana, CA', avatar: 'https://randomuser.me/api/portraits/men/42.jpg', id: 'p2', service: '💈' },
    photo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
    tags: ['Fade', 'Lineup'],
    review: "Devon is hands down the best barber I've found. Clean fade every time.",
    likes: 24,
    liked: true,
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
          <Text style={styles.crownLogo}>♛</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('Notifications')}>
            <Text style={styles.headerIcon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Text style={styles.headerIcon}>☰</Text>
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
          {posts.map(post => (
            <FeedPost
              key={post.id}
              post={post}
              onLike={() => toggleLike(post.id)}
              onProviderPress={() => navigation.navigate('ProviderProfile', { providerId: post.provider.id })}
            />
          ))}
          <View style={{ height: 24 }} />
        </ScrollView>
      )}

      {activeTab === 'Friends' && <FriendsTab navigation={navigation} />}
      {activeTab === 'Services' && <ServicesTab navigation={navigation} />}
    </SafeAreaView>
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
      {/* Post Header */}
      <View style={postStyles.header}>
        <View style={postStyles.headerLeft}>
          <Image source={{ uri: post.customer.avatar }} style={postStyles.customerAvatar} />
          <Text style={postStyles.customerName}>{post.customer.name}</Text>
        </View>
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

      {/* Provider Info */}
      <TouchableOpacity style={postStyles.providerRow} onPress={onProviderPress} activeOpacity={0.7}>
        <Image source={{ uri: post.provider.avatar }} style={postStyles.providerAvatar} />
        <View>
          <Text style={postStyles.providerName}>{post.provider.name}</Text>
          <Text style={postStyles.providerLocation}>{post.provider.location}</Text>
        </View>
      </TouchableOpacity>

      {/* Review Text */}
      <Text style={postStyles.review}>{post.review}</Text>

      {/* Like */}
      <TouchableOpacity style={postStyles.likeRow} onPress={onLike} activeOpacity={0.7}>
        <Text style={[postStyles.heartIcon, post.liked && postStyles.heartIconActive]}>
          {post.liked ? '♥' : '♡'}
        </Text>
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
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm },
  providerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surfaceAlt },
  providerName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  providerLocation: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  review: { fontSize: Typography.sizes.base, color: Colors.textSecondary, lineHeight: 22, paddingHorizontal: Spacing.base, paddingBottom: Spacing.base },
  likeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.base, paddingBottom: Spacing.base },
  heartIcon: { fontSize: 22, color: Colors.textMuted },
  heartIconActive: { color: Colors.like },
  likeCount: { fontSize: Typography.sizes.base, color: Colors.textSecondary, fontWeight: Typography.weights.medium },
});

// ─── Friends Tab (Provider List) ───────────────────────────────────────────────

const MOCK_PROVIDERS_FRIENDS = [
  { id: 'p1', name: 'Carmela', location: 'Costa Mesa, CA', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', services: ['💇‍♀️', '💈', '💪', '🐉', '🧖‍♀️', '👁', '💄'] },
  { id: 'p2', name: 'Devon', location: 'Santa Ana, CA', avatar: 'https://randomuser.me/api/portraits/men/42.jpg', services: ['💇‍♀️', '💈', '💪', '🐉', '🧖‍♀️', '👁'] },
  { id: 'p3', name: 'Jasmine', location: 'Irvine, CA', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', services: ['💇‍♀️', '💈', '💪', '🐉', '🧖‍♀️', '💅', '👁', '💄'] },
  { id: 'p4', name: 'Marcus', location: 'Anaheim, CA', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', services: ['💇‍♀️', '💈', '💪', '🐉', '🧖‍♀️', '💅', '👁', '💄'] },
  { id: 'p5', name: 'Aisha', location: 'Long Beach, CA', avatar: 'https://randomuser.me/api/portraits/women/91.jpg', services: ['💇‍♀️', '💈', '💪', '🐉', '🧖‍♀️', '💅', '👁', '💄'] },
  { id: 'p6', name: 'Tyler', location: 'Torrance, CA', avatar: 'https://randomuser.me/api/portraits/men/33.jpg', services: ['💇‍♀️', '💈', '💪', '🐉', '🧖‍♀️', '💅', '👁', '💄'] },
  { id: 'p7', name: 'Brianna', location: 'Compton, CA', avatar: 'https://randomuser.me/api/portraits/women/17.jpg', services: ['💇‍♀️', '🐉', '🧖‍♀️', '💅', '💄'] },
];

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
            <Text style={friendStyles.location}>{provider.location}</Text>
            <View style={friendStyles.services}>
              {provider.services.map((emoji, i) => (
                <Text key={i} style={friendStyles.serviceEmoji}>{emoji}</Text>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      ))}
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const friendStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.surfaceAlt },
  info: { flex: 1, gap: 4 },
  name: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  location: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  services: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  serviceEmoji: { fontSize: 22 },
});

// ─── Services Tab ──────────────────────────────────────────────────────────────

const SERVICE_CATEGORIES = [
  { key: 'hair', label: 'Hair', emoji: '💇‍♀️' },
  { key: 'barber', label: 'Barber', emoji: '💈' },
  { key: 'fitness', label: 'Fitness', emoji: '💪' },
  { key: 'massage', label: 'Massage', emoji: '🐉' },
  { key: 'esthetics', label: 'Esthetics', emoji: '🧖‍♀️' },
  { key: 'nails', label: 'Nails', emoji: '💅' },
  { key: 'lashes', label: 'Lashes', emoji: '👁' },
  { key: 'makeup', label: 'Makeup', emoji: '💄' },
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
  crownLogo: { fontSize: 32, color: Colors.primary },
  headerRight: { flexDirection: 'row', gap: Spacing.base, alignItems: 'center' },
  headerBtn: { padding: Spacing.xs },
  headerIcon: { fontSize: 22, color: Colors.textPrimary },
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
  feed: { flex: 1, paddingTop: Spacing.md },
});
