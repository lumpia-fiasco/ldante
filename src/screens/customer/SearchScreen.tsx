import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  FlatList, TouchableOpacity, ScrollView, Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { StarRating, Badge, Chip, ScreenHeader } from '../../components/common';
import { SERVICE_CATEGORIES } from '../../constants';
import { RootStackParamList } from '../../navigation';
import { IconArrowLeft } from '@tabler/icons-react-native';

type Nav = StackNavigationProp<RootStackParamList>;
type SearchRoute = RouteProp<RootStackParamList, 'Search'>;

// ─── Mock Providers ────────────────────────────────────────────────────────────
// IDs match ProviderProfileScreen: p1=Carmela, p2=Devon, p3=Jasmine,
// p4=Marcus, p5=Aisha, p6=Tyler, p7=Brianna.
// Additional providers for search results use p8+ so they can be added later.

const ALL_PROVIDERS = [
  {
    id: 'p1',
    name: 'Carmela',
    category: 'hair',
    tags: ['Braids', 'Cornrows', 'Silk Press'],
    score: 4.9, ratings: 52,
    location: 'Costa Mesa, CA',
    price: 250, distance: 2.1, friends: 2,
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 'p2',
    name: 'Devon',
    category: 'barber',
    tags: ['Fade', 'Lineup', 'Beard Trim'],
    score: 4.8, ratings: 60,
    location: 'Santa Ana, CA',
    price: 35, distance: 1.6, friends: 1,
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
  },
  {
    id: 'p3',
    name: 'Jasmine',
    category: 'nails',
    tags: ['Gel Manicure', 'Nail Art', 'Acrylics'],
    score: 4.7, ratings: 29,
    location: 'Irvine, CA',
    price: 55, distance: 3.1, friends: 3,
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
  },
  {
    id: 'p4',
    name: 'Marcus',
    category: 'massage',
    tags: ['Deep Tissue', 'Sports', 'Swedish'],
    score: 4.8, ratings: 38,
    location: 'Anaheim, CA',
    price: 95, distance: 4.0, friends: 3,
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
  },
  {
    id: 'p5',
    name: 'Aisha',
    category: 'esthetics',
    tags: ['HydraFacial', 'Chemical Peel', 'Brow Shaping'],
    score: 4.6, ratings: 22,
    location: 'Long Beach, CA',
    price: 85, distance: 5.2, friends: 3,
    avatar: 'https://randomuser.me/api/portraits/women/91.jpg',
  },
  {
    id: 'p6',
    name: 'Tyler',
    category: 'fitness',
    tags: ['HIIT', 'Strength Training', 'Mobility'],
    score: 4.9, ratings: 41,
    location: 'Torrance, CA',
    price: 80, distance: 6.3, friends: 1,
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
  },
  {
    id: 'p7',
    name: 'Brianna',
    category: 'makeup',
    tags: ['Full Glam', 'Bridal', 'Editorial'],
    score: 4.7, ratings: 34,
    location: 'Compton, CA',
    price: 100, distance: 3.8, friends: 2,
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
  },
  {
    id: 'p8',
    name: 'Zara',
    category: 'lashes',
    tags: ['Classic Lashes', 'Volume', 'Hybrid'],
    score: 4.8, ratings: 45,
    location: 'Fullerton, CA',
    price: 90, distance: 2.9, friends: 0,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 'p9',
    name: 'Dominic',
    category: 'tattoo',
    tags: ['Fine Line', 'Black & Grey', 'Color'],
    score: 4.9, ratings: 67,
    location: 'Inglewood, CA',
    price: 200, distance: 4.5, friends: 1,
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
  {
    id: 'p10',
    name: 'Keisha',
    category: 'hair',
    tags: ['Balayage', 'Color', 'Natural Hair'],
    score: 4.8, ratings: 33,
    location: 'Carson, CA',
    price: 120, distance: 5.1, friends: 0,
    avatar: 'https://randomuser.me/api/portraits/women/36.jpg',
  },
];

export function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<SearchRoute>();

  const [query, setQuery] = useState(route.params?.initialQuery ?? '');
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category ?? '');
  const [friendsOnly, setFriendsOnly] = useState(false);

  // If we navigate here with a new category param (e.g. from Services tile), update the filter
  useEffect(() => {
    if (route.params?.category !== undefined) {
      setSelectedCategory(route.params.category);
    }
  }, [route.params?.category]);

  const filtered = ALL_PROVIDERS.filter((p) => {
    const matchQuery =
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
    const matchCat = !selectedCategory || p.category === selectedCategory;
    const matchFriends = !friendsOnly || p.friends > 0;
    return matchQuery && matchCat && matchFriends;
  });

  const activeCategoryLabel = SERVICE_CATEGORIES.find((c) => c.key === selectedCategory)?.label;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={activeCategoryLabel ? `${activeCategoryLabel}` : 'Search'}
        leftIcon={<IconArrowLeft size={24} color={Colors.textPrimary} strokeWidth={1.75} />}
        onLeftPress={() => navigation.goBack()}
      />

      {/* Search Input */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search providers, specialties..."
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category + Friends filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        <Chip
          label="👥 Friends Only"
          selected={friendsOnly}
          onPress={() => setFriendsOnly(!friendsOnly)}
        />
        {SERVICE_CATEGORIES.map((cat) => (
          <Chip
            key={cat.key}
            label={`${cat.icon} ${cat.label}`}
            selected={selectedCategory === cat.key}
            onPress={() =>
              setSelectedCategory(selectedCategory === cat.key ? '' : cat.key)
            }
          />
        ))}
      </ScrollView>

      {/* Results count */}
      <Text style={styles.resultCount}>
        {filtered.length} provider{filtered.length !== 1 ? 's' : ''}
        {activeCategoryLabel ? ` in ${activeCategoryLabel}` : ''}
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProviderProfile', { providerId: item.id })}
            activeOpacity={0.85}
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.info}>
              <View style={styles.titleRow}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.distance}>{item.distance}mi</Text>
              </View>
              <Text style={styles.location}>📍 {item.location}</Text>
              <View style={styles.tags}>
                {item.tags.map((t) => (
                  <Badge key={t} label={t} variant="neutral" />
                ))}
              </View>
              <View style={styles.meta}>
                <StarRating score={item.score} size={12} showScore count={item.ratings} />
                {item.friends > 0 && (
                  <Badge label={`👥 ${item.friends} friend${item.friends > 1 ? 's' : ''}`} variant="primary" />
                )}
                <Text style={styles.price}>From ${item.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    marginHorizontal: Spacing.base, marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.base, borderWidth: 1, borderColor: Colors.primary,
  },
  searchIcon: { fontSize: 16, marginRight: Spacing.sm },
  searchInput: {
    flex: 1, paddingVertical: Spacing.md,
    fontSize: Typography.sizes.base, color: Colors.textPrimary,
  },
  clearIcon: { fontSize: 14, color: Colors.textMuted, padding: Spacing.xs },
  filters: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm, gap: Spacing.sm },
  resultCount: {
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm,
    fontSize: Typography.sizes.sm, color: Colors.textMuted,
  },
  list: { paddingHorizontal: Spacing.base, gap: Spacing.md, paddingBottom: 110 },
  card: {
    flexDirection: 'row', gap: Spacing.md, backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.base,
    borderWidth: 1, borderColor: Colors.border,
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.surfaceAlt,
  },
  info: { flex: 1, gap: Spacing.xs },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  distance: { fontSize: Typography.sizes.xs, color: Colors.textMuted },
  location: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  tags: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap' },
  price: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
});
