import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  FlatList, TouchableOpacity, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Avatar, StarRating, Badge, Chip, ScreenHeader } from '../../components/common';
import { SERVICE_CATEGORIES } from '../../constants';
import { RootStackParamList } from '../../navigation';

type Nav = StackNavigationProp<RootStackParamList>;

const ALL_PROVIDERS = [
  { id: '1', name: 'Jessica Williams', category: 'hair', tags: ['Balayage', 'Color Specialist'], score: 4.9, ratings: 52, location: 'Luxe Loft Suites', price: 85, distance: 2.1, friends: 3 },
  { id: '2', name: 'Marcus Thompson', category: 'massage', tags: ['Deep Tissue', 'Sports'], score: 4.8, ratings: 38, location: 'Wellness Studio', price: 95, distance: 3.4, friends: 1 },
  { id: '3', name: 'Nina Patel', category: 'nails', tags: ['Nail Art', 'Gel'], score: 4.7, ratings: 29, location: 'Studio Glow', price: 65, distance: 1.8, friends: 2 },
  { id: '4', name: 'David Chen', category: 'fitness', tags: ['Strength Training', 'HIIT'], score: 4.9, ratings: 41, location: 'FitLife Gym', price: 80, distance: 4.2, friends: 0 },
  { id: '5', name: 'Amara Okonkwo', category: 'esthetics', tags: ['Facials', 'Brow Design'], score: 4.6, ratings: 22, location: 'Glow Studio', price: 75, distance: 2.8, friends: 1 },
];

export function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [friendsOnly, setFriendsOnly] = useState(false);

  const filtered = ALL_PROVIDERS.filter((p) => {
    const matchQuery =
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
    const matchCat = !selectedCategory || p.category === selectedCategory;
    const matchFriends = !friendsOnly || p.friends > 0;
    return matchQuery && matchCat && matchFriends;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Search"
        leftIcon={<Text style={styles.backIcon}>←</Text>}
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
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
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
        {selectedCategory ? ` in ${SERVICE_CATEGORIES.find((c) => c.key === selectedCategory)?.label}` : ''}
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
            <Avatar name={item.name} size={52} />
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
  backIcon: { fontSize: 22, color: Colors.textPrimary },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    marginHorizontal: Spacing.base, marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.base, borderWidth: 1, borderColor: Colors.primary,
  },
  searchIcon: { fontSize: 16, marginRight: Spacing.sm },
  searchInput: { flex: 1, paddingVertical: Spacing.md, fontSize: Typography.sizes.base, color: Colors.textPrimary },
  clearIcon: { fontSize: 14, color: Colors.textMuted, padding: Spacing.xs },
  filters: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm, gap: Spacing.sm },
  resultCount: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm, fontSize: Typography.sizes.sm, color: Colors.textMuted },
  list: { paddingHorizontal: Spacing.base, gap: Spacing.md, paddingBottom: Spacing['3xl'] },
  card: {
    flexDirection: 'row', gap: Spacing.md, backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.base,
    borderWidth: 1, borderColor: Colors.border,
  },
  info: { flex: 1, gap: Spacing.xs },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  distance: { fontSize: Typography.sizes.xs, color: Colors.textMuted },
  location: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  tags: { flexDirection: 'row', gap: Spacing.xs },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap' },
  price: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
});
