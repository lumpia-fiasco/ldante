import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Avatar, StarRating, Badge, Button, ScreenHeader } from '../../components/common';
import { IconArrowLeft } from '@tabler/icons-react-native';
import { RootStackParamList } from '../../navigation';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'FriendRolodex'>;
  route: RouteProp<RootStackParamList, 'FriendRolodex'>;
};

const MOCK_FRIEND_PROVIDERS = [
  {
    id: '1', name: 'Jessica Williams', category: 'Hair', tags: ['Balayage', 'Color Specialist'],
    score: 4.9, ratings: 52, location: 'Luxe Loft Suites', price: 85,
    friendVisits: 6, friendNote: 'THE BEST for color! She is a magician with highlights 🎨',
    inMyRolodex: false,
  },
  {
    id: '2', name: 'Marcus Thompson', category: 'Massage', tags: ['Deep Tissue', 'Sports'],
    score: 4.8, ratings: 38, location: 'Wellness Studio', price: 95,
    friendVisits: 12, friendNote: undefined,
    inMyRolodex: true,
  },
];

export function FriendRolodexScreen({ navigation, route }: Props) {
  const { friendId, friendName } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={`${friendName}'s Rolodex`}
        leftIcon={<IconArrowLeft size={24} color={Colors.textPrimary} strokeWidth={1.75} />}
        onLeftPress={() => navigation.goBack()}
      />

      <View style={styles.friendHeader}>
        <Avatar name={friendName} size={40} />
        <Text style={styles.friendDesc}>
          {MOCK_FRIEND_PROVIDERS.length} providers {friendName.split(' ')[0]} trusts
        </Text>
      </View>

      <FlatList
        data={MOCK_FRIEND_PROVIDERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardMain}
              onPress={() =>
                navigation.navigate('ProviderProfile', {
                  providerId: item.id,
                  referralFriendId: friendId,
                })
              }
              activeOpacity={0.85}
            >
              <Avatar name={item.name} size={52} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.location}>📍 {item.location}</Text>
                <View style={styles.tags}>
                  {item.tags.map((t) => (
                    <Badge key={t} label={t} variant="neutral" />
                  ))}
                </View>
                <View style={styles.meta}>
                  <StarRating score={item.score} size={12} showScore count={item.ratings} />
                  <Text style={styles.visits}>
                    {friendName.split(' ')[0]} visited {item.friendVisits}×
                  </Text>
                </View>
                {item.friendNote && (
                  <View style={styles.noteBox}>
                    <Text style={styles.noteText}>"{item.friendNote}"</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.cardActions}>
              <Button
                label={item.inMyRolodex ? '✓ In My Rolodex' : 'Add to Rolodex'}
                onPress={() => {
                  if (!item.inMyRolodex) {
                    Alert.alert('Added!', `${item.name} added to your Rolodex.`);
                  }
                }}
                variant={item.inMyRolodex ? 'secondary' : 'outline'}
                size="sm"
                style={{ flex: 1 }}
              />
              <Button
                label="Book"
                onPress={() =>
                  navigation.navigate('BookingFlow', { providerId: item.id })
                }
                size="sm"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  friendHeader: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.base,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  friendDesc: { fontSize: Typography.sizes.base, color: Colors.textSecondary },
  list: { padding: Spacing.base, gap: Spacing.md, paddingBottom: Spacing['3xl'] },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  cardMain: { flexDirection: 'row', gap: Spacing.md, padding: Spacing.base },
  info: { flex: 1, gap: Spacing.xs },
  name: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  location: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  tags: { flexDirection: 'row', gap: Spacing.xs },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  visits: { fontSize: Typography.sizes.xs, color: Colors.primary, fontWeight: Typography.weights.medium },
  noteBox: {
    backgroundColor: `${Colors.primary}12`, borderRadius: Radius.sm,
    padding: Spacing.sm, borderLeftWidth: 2, borderLeftColor: Colors.primary,
  },
  noteText: { fontSize: Typography.sizes.xs, color: Colors.textSecondary, fontStyle: 'italic' },
  cardActions: {
    flexDirection: 'row', gap: Spacing.sm, padding: Spacing.base, paddingTop: 0,
  },
});
