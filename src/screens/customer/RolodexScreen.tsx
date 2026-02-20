import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Avatar, StarRating, Badge, EmptyState } from '../../components/common';
import { RolodexEntry } from '../../types';
import { RootStackParamList } from '../../navigation';

type Nav = StackNavigationProp<RootStackParamList>;

const MOCK_ROLODEX: RolodexEntry[] = [
  {
    id: 're1',
    customer_id: 'cu1',
    provider_id: '1',
    notes: 'Ask for extra toner next time. Loves the balayage formula I used in Jan.',
    privacy: 'friends',
    last_visit_date: '2025-01-15',
    visit_count: 6,
    added_at: '2023-05-01',
    provider: {
      id: '1', user_id: 'u1', full_name: 'Jessica Williams', avatar_url: undefined,
      specialty_tags: ['Balayage', 'Color Specialist'], service_categories: ['hair'],
      certifications: [], follower_count: 187,
      locations: [{ id: 'l1', provider_id: '1', name: 'Luxe Loft Suites', address: '456 Oak St', city: 'Chicago', state: 'IL', zip: '60601', is_primary: true, effective_date: '2024-01-01' }],
      services: [{ id: 's1', provider_id: '1', name: 'Balayage', description: '', duration_minutes: 150, price_cents: 25000, category: 'hair', is_active: true }],
      weighted_rating: { weighted_score: 4.9, unweighted_score: 4.7, total_ratings: 52, dimensions: {}, confidence: 'high' },
    },
  },
  {
    id: 're2',
    customer_id: 'cu1',
    provider_id: '2',
    notes: '',
    privacy: 'friends',
    last_visit_date: '2025-01-05',
    visit_count: 12,
    added_at: '2022-11-01',
    provider: {
      id: '2', user_id: 'u2', full_name: 'Marcus Thompson', avatar_url: undefined,
      specialty_tags: ['Deep Tissue', 'Sports Massage'], service_categories: ['massage'],
      certifications: ['LMT Certified'], follower_count: 145,
      locations: [{ id: 'l2', provider_id: '2', name: 'Wellness Studio', address: '123 Main St', city: 'Chicago', state: 'IL', zip: '60602', is_primary: true, effective_date: '2024-01-01' }],
      services: [{ id: 's4', provider_id: '2', name: '60-min Deep Tissue', description: '', duration_minutes: 60, price_cents: 9500, category: 'massage', is_active: true }],
      weighted_rating: { weighted_score: 4.8, unweighted_score: 4.5, total_ratings: 38, dimensions: {}, confidence: 'high' },
    },
  },
  {
    id: 're3',
    customer_id: 'cu1',
    provider_id: '3',
    notes: 'Always does the chrome powder on ring finger.',
    privacy: 'private',
    last_visit_date: '2024-12-20',
    visit_count: 4,
    added_at: '2024-06-01',
    provider: {
      id: '3', user_id: 'u3', full_name: 'Nina Patel', avatar_url: undefined,
      specialty_tags: ['Nail Art', 'Gel Nails'], service_categories: ['nails'],
      certifications: [], follower_count: 93,
      locations: [{ id: 'l3', provider_id: '3', name: 'Studio Glow', address: '789 Elm Ave', city: 'Chicago', state: 'IL', zip: '60603', is_primary: true, effective_date: '2024-01-01' }],
      services: [{ id: 's6', provider_id: '3', name: 'Gel Manicure', description: '', duration_minutes: 60, price_cents: 6500, category: 'nails', is_active: true }],
      weighted_rating: { weighted_score: 4.7, unweighted_score: 4.6, total_ratings: 29, dimensions: {}, confidence: 'medium' },
    },
  },
];

export function RolodexScreen() {
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState(MOCK_ROLODEX);

  const filtered = entries.filter((e) =>
    e.provider?.full_name.toLowerCase().includes(search.toLowerCase()) ||
    e.provider?.specialty_tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  function handleRemove(entryId: string, name: string) {
    Alert.alert(
      `Remove ${name}?`,
      'They will be removed from your Rolodex but you can re-add them later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setEntries((prev) => prev.filter((e) => e.id !== entryId)),
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Rolodex</Text>
        <Text style={styles.subtitle}>{entries.length} providers</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.search}
          placeholder="Search your providers..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          title={entries.length === 0 ? 'Your Rolodex is empty' : 'No results'}
          message={
            entries.length === 0
              ? 'Add your trusted providers to your Rolodex so friends can discover them.'
              : 'Try a different search term.'
          }
          action={entries.length === 0 ? 'Discover Providers' : undefined}
          onAction={() => navigation.navigate('CustomerTabs')}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const p = item.provider!;
            const loc = p.locations[0];
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate('ProviderProfile', { providerId: p.id })
                }
                activeOpacity={0.85}
              >
                <Avatar uri={p.avatar_url} name={p.full_name} size={56} />

                <View style={styles.cardContent}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.name}>{p.full_name}</Text>
                    <PrivacyBadge privacy={item.privacy} />
                  </View>

                  {loc && (
                    <Text style={styles.location}>📍 {loc.name}</Text>
                  )}

                  <View style={styles.tags}>
                    {p.specialty_tags.slice(0, 2).map((t) => (
                      <Badge key={t} label={t} variant="neutral" />
                    ))}
                  </View>

                  <View style={styles.metaRow}>
                    {p.weighted_rating && (
                      <StarRating score={p.weighted_rating.weighted_score} size={12} showScore />
                    )}
                    <Text style={styles.visits}>
                      {item.visit_count} visit{item.visit_count !== 1 ? 's' : ''}
                    </Text>
                    {item.last_visit_date && (
                      <Text style={styles.lastVisit}>
                        Last: {new Date(item.last_visit_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                    )}
                  </View>

                  {item.notes ? (
                    <Text style={styles.notes} numberOfLines={1}>
                      📝 {item.notes}
                    </Text>
                  ) : null}
                </View>

                {/* Quick actions */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() =>
                      navigation.navigate('BookingFlow', { providerId: p.id })
                    }
                  >
                    <Text style={styles.actionEmoji}>📅</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleRemove(item.id, p.full_name)}
                  >
                    <Text style={styles.actionEmoji}>✕</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

function PrivacyBadge({ privacy }: { privacy: string }) {
  const map: Record<string, { label: string; variant: any }> = {
    public: { label: '🌐 Public', variant: 'success' },
    friends: { label: '👥 Friends', variant: 'primary' },
    private: { label: '🔒 Private', variant: 'neutral' },
  };
  const config = map[privacy] || map.friends;
  return <Badge label={config.label} variant={config.variant} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.extrabold,
    color: Colors.textPrimary,
  },
  subtitle: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.base,
    paddingHorizontal: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: { fontSize: 16, marginRight: Spacing.sm },
  search: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
  },
  list: { paddingHorizontal: Spacing.base, paddingBottom: Spacing['3xl'], gap: Spacing.md },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'flex-start',
  },
  cardContent: { flex: 1, gap: Spacing.xs },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    flex: 1,
  },
  location: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  tags: { flexDirection: 'row', gap: Spacing.xs },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  visits: { fontSize: Typography.sizes.xs, color: Colors.textMuted },
  lastVisit: { fontSize: Typography.sizes.xs, color: Colors.textMuted },
  notes: { fontSize: Typography.sizes.xs, color: Colors.textSecondary, fontStyle: 'italic' },
  actions: { gap: Spacing.sm },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionEmoji: { fontSize: 14 },
});
