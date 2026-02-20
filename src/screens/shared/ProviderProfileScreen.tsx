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

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ProviderProfile'>;
  route: RouteProp<RootStackParamList, 'ProviderProfile'>;
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_PROVIDER = {
  id: 'p1',
  name: 'Carmela',
  location: 'Costa Mesa, CA',
  avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  patrons: ['Candice', 'Martina', 'Ebony'],
  bio: 'I specialize in hair health, using styling methods that are best for YOUR hair\'s health. Everyone is different, so I tailor my services and the products I use to fit your hair\'s needs.',
  ratings: [
    { label: 'Quality', score: 4.9 },
    { label: 'Friendliness', score: 4.5 },
    { label: 'Expertise', score: 4.9 },
    { label: 'Location', score: 3.5 },
  ],
  nextAvailable: 'Friday, November 7 (2 slots)',
  serviceList: [
    {
      category: 'Braids',
      items: [
        { name: 'Box Braids', price: '$250.00' },
        { name: 'Goddess Braids', price: '$350.00' },
      ],
    },
    {
      category: 'Cornrows',
      items: [
        { name: '4', price: '$200.00' },
        { name: '6', price: '$500.00' },
        { name: '12', price: '$250.00' },
        { name: '+ Design', price: 'Inquire' },
      ],
    },
    {
      category: 'Style',
      items: [
        { name: 'Silk Press', price: '$250.00' },
        { name: 'Shampoo & Style', price: '$250.00' },
        { name: 'Conditioning', price: '$350.00' },
        { name: 'Trim', price: '$50.00' },
      ],
    },
  ],
};

// ─── Screen ────────────────────────────────────────────────────────────────────

export function ProviderProfileScreen({ navigation, route }: Props) {
  const [saved, setSaved] = useState(false);

  const provider = MOCK_PROVIDER;

  function handleBook() {
    navigation.navigate('BookingFlow', { providerId: provider.id });
  }

  function handleSave() {
    setSaved(!saved);
    Alert.alert(
      saved ? 'Removed' : 'Saved!',
      saved ? `${provider.name} removed from your Rolodex` : `${provider.name} added to your Rolodex`
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Back */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <Image source={{ uri: provider.avatar }} style={styles.avatar} />
        </View>

        {/* Name & Location */}
        <View style={styles.heroSection}>
          <Text style={styles.name}>{provider.name}</Text>
          <Text style={styles.location}>{provider.location}</Text>

          {/* Patrons */}
          {provider.patrons.length > 0 && (
            <Text style={styles.patrons}>
              {provider.patrons.slice(0, 3).join(', ')} {provider.patrons.length === 1 ? 'is a patron' : 'are patrons'}
            </Text>
          )}
        </View>

        {/* Ratings Grid */}
        <View style={styles.ratingsGrid}>
          {provider.ratings.map((r) => (
            <View key={r.label} style={styles.ratingCell}>
              <Text style={styles.ratingScore}>{r.score.toFixed(1)}</Text>
              <Text style={styles.ratingLabel}>{r.label}</Text>
            </View>
          ))}
        </View>

        {/* Bio */}
        <View style={styles.bioSection}>
          <Text style={styles.bio}>{provider.bio}</Text>
        </View>

        {/* Next Available + Book */}
        <View style={styles.bookRow}>
          <View style={styles.availSection}>
            <Text style={styles.availLabel}>Next available:</Text>
            <Text style={styles.availDate}>{provider.nextAvailable}</Text>
          </View>
          <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
            <Text style={styles.bookBtnText}>Book now</Text>
          </TouchableOpacity>
        </View>

        {/* Service List */}
        <View style={styles.serviceListCard}>
          <Text style={styles.serviceListTitle}>Service List</Text>
          {provider.serviceList.map((group) => (
            <View key={group.category} style={styles.serviceGroup}>
              <Text style={styles.serviceCategory}>{group.category}</Text>
              {group.items.map((item, i) => (
                <View key={i} style={styles.serviceRow}>
                  <Text style={styles.serviceName}>{item.name}</Text>
                  <Text style={[
                    styles.servicePrice,
                    item.price === 'Inquire' && styles.servicePriceInquire
                  ]}>{item.price}</Text>
                </View>
              ))}
              <View style={styles.serviceDivider} />
            </View>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Bottom Tab Bar — same as mockup */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBtn}>
          <Text style={styles.bottomIcon}>⌂</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn}>
          <Text style={styles.bottomIcon}>📅</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.plusBtn} onPress={handleBook}>
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn}>
          <Text style={styles.bottomIcon}>✦</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn}>
          <Text style={styles.bottomIcon}>⌕</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  backBtn: {
    position: 'absolute',
    top: 56,
    left: Spacing.base,
    zIndex: 10,
    padding: Spacing.sm,
  },
  backIcon: { fontSize: 24, color: Colors.textPrimary },

  avatarSection: {
    alignItems: 'center',
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing.base,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 3,
    borderColor: Colors.surface,
    ...Shadows.md,
  },

  heroSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    gap: 4,
    marginBottom: Spacing.base,
  },
  name: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  location: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
  },
  patrons: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.semibold,
    marginTop: 4,
    textAlign: 'center',
  },

  ratingsGrid: {
    flexDirection: 'row',
    marginHorizontal: Spacing.base,
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  ratingCell: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  ratingScore: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  ratingLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  bioSection: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.base,
  },
  bio: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    lineHeight: 24,
  },

  bookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.base,
    gap: Spacing.base,
  },
  availSection: { flex: 1 },
  availLabel: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  availDate: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  bookBtn: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bookBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },

  serviceListCard: {
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  serviceListTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  serviceGroup: { marginBottom: Spacing.sm },
  serviceCategory: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  serviceName: { fontSize: Typography.sizes.base, color: Colors.textSecondary },
  servicePrice: { fontSize: Typography.sizes.base, color: Colors.textSecondary, fontWeight: Typography.weights.medium },
  servicePriceInquire: { color: Colors.textMuted },
  serviceDivider: { height: 1, backgroundColor: Colors.border, marginTop: Spacing.sm },

  // Bottom bar (mirrors main tab bar style on this screen)
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 20,
    paddingTop: 8,
    height: 84,
  },
  bottomBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  bottomIcon: { fontSize: 22, color: Colors.textSecondary },
  plusBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.plusButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: { fontSize: 28, color: Colors.white, fontWeight: '300' as const, lineHeight: 32 },
});
