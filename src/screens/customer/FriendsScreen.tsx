import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Avatar, Badge, Button, ScreenHeader, EmptyState } from '../../components/common';
import { RootStackParamList } from '../../navigation';

type Nav = StackNavigationProp<RootStackParamList>;

const MOCK_FRIENDS = [
  { id: 'f1', full_name: 'Sarah Kim', avatar_url: undefined, stylist_count: 4, mutual: 2, status: 'friend' },
  { id: 'f2', full_name: 'Emily Rodriguez', avatar_url: undefined, stylist_count: 2, mutual: 1, status: 'friend' },
  { id: 'f3', full_name: 'Lisa Morgan', avatar_url: undefined, stylist_count: 3, mutual: 3, status: 'friend' },
  { id: 'f4', full_name: 'Amanda Chen', avatar_url: undefined, stylist_count: 1, mutual: 0, status: 'pending' },
  { id: 'f5', full_name: 'Rachel Davis', avatar_url: undefined, stylist_count: 5, mutual: 1, status: 'suggestion' },
];

const MOCK_REQUESTS = [
  { id: 'req1', full_name: 'Julia Nguyen', avatar_url: undefined, mutual: 2 },
];

type TabKey = 'friends' | 'requests' | 'suggestions';

export function FriendsScreen() {
  const navigation = useNavigation<Nav>();
  const [tab, setTab] = useState<TabKey>('friends');
  const [search, setSearch] = useState('');

  const friends = MOCK_FRIENDS.filter((f) => f.status === 'friend');
  const pending = MOCK_FRIENDS.filter((f) => f.status === 'pending');
  const suggestions = MOCK_FRIENDS.filter((f) => f.status === 'suggestion');

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Friends"
        leftIcon={<Text style={styles.backIcon}>←</Text>}
        onLeftPress={() => navigation.goBack()}
        rightIcon={<Text style={styles.addIcon}>+</Text>}
        onRightPress={() => Alert.alert('Invite Friends', 'Share your invite link to bring friends to CROWND!')}
      />

      {/* Tabs */}
      <View style={styles.tabs}>
        {([
          { key: 'friends', label: `Friends (${friends.length})` },
          { key: 'requests', label: `Requests (${MOCK_REQUESTS.length})` },
          { key: 'suggestions', label: 'Suggestions' },
        ] as { key: TabKey; label: string }[]).map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tab_active]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabText_active]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'requests' && MOCK_REQUESTS.length > 0 && (
        <View style={styles.requestsSection}>
          {MOCK_REQUESTS.map((req) => (
            <View key={req.id} style={styles.requestCard}>
              <Avatar name={req.full_name} size={44} />
              <View style={styles.requestInfo}>
                <Text style={styles.requestName}>{req.full_name}</Text>
                <Text style={styles.requestMutual}>{req.mutual} mutual friends</Text>
              </View>
              <View style={styles.requestActions}>
                <Button label="Accept" onPress={() => {}} size="sm" fullWidth={false} style={styles.acceptBtn} />
                <Button label="Decline" onPress={() => {}} size="sm" variant="ghost" fullWidth={false} />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.search}
          placeholder="Search friends..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={tab === 'friends' ? friends : suggestions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState icon="👥" title="No friends yet" message="Invite your friends to discover great providers together." />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.friendCard}
            onPress={() =>
              tab === 'friends'
                ? navigation.navigate('FriendRolodex', {
                    friendId: item.id,
                    friendName: item.full_name,
                  })
                : undefined
            }
            activeOpacity={tab === 'friends' ? 0.8 : 1}
          >
            <Avatar name={item.full_name} size={48} />
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{item.full_name}</Text>
              {tab === 'friends' ? (
                <Text style={styles.friendSub}>
                  {item.stylist_count} provider{item.stylist_count !== 1 ? 's' : ''} · {item.mutual} mutual
                </Text>
              ) : (
                <Text style={styles.friendSub}>{item.mutual} mutual friends</Text>
              )}
            </View>
            {tab === 'friends' ? (
              <Text style={styles.viewRolodex}>View →</Text>
            ) : (
              <Button label="Add" onPress={() => {}} size="sm" fullWidth={false} style={styles.addBtn} />
            )}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  backIcon: { fontSize: 22, color: Colors.textPrimary },
  addIcon: { fontSize: 26, color: Colors.primary, fontWeight: '700' },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.md, borderBottomWidth: 2, borderBottomColor: Colors.transparent },
  tab_active: { borderBottomColor: Colors.primary },
  tabText: { fontSize: Typography.sizes.sm, color: Colors.textMuted, fontWeight: Typography.weights.medium },
  tabText_active: { color: Colors.primary },
  requestsSection: { padding: Spacing.base, gap: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  requestCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  requestInfo: { flex: 1 },
  requestName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },
  requestMutual: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  requestActions: { flexDirection: 'row', gap: Spacing.sm },
  acceptBtn: { backgroundColor: Colors.primary },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    marginHorizontal: Spacing.base, marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.base, borderWidth: 1, borderColor: Colors.border,
  },
  searchIcon: { fontSize: 16, marginRight: Spacing.sm },
  search: { flex: 1, paddingVertical: Spacing.md, fontSize: Typography.sizes.base, color: Colors.textPrimary },
  list: { paddingHorizontal: Spacing.base, paddingBottom: Spacing['3xl'], gap: Spacing.sm },
  friendCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.border,
  },
  friendInfo: { flex: 1 },
  friendName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  friendSub: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  viewRolodex: { fontSize: Typography.sizes.sm, color: Colors.primary, fontWeight: Typography.weights.medium },
  addBtn: {},
});
