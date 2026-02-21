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

type ProviderData = {
  id: string;
  name: string;
  location: string;
  avatar: string;
  patrons: string[];
  bio: string;
  ratings: { label: string; score: number }[];
  nextAvailable: string;
  serviceList: { category: string; items: { name: string; price: string }[] }[];
};

const MOCK_PROVIDERS: Record<string, ProviderData> = {
  p1: {
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
        category: '💇‍♀️ Braids',
        items: [
          { name: 'Box Braids', price: '$250.00' },
          { name: 'Goddess Braids', price: '$350.00' },
        ],
      },
      {
        category: '💇‍♀️ Cornrows',
        items: [
          { name: '4 Cornrows', price: '$200.00' },
          { name: '6 Cornrows', price: '$500.00' },
          { name: '12 Cornrows', price: '$250.00' },
          { name: '+ Design', price: 'Inquire' },
        ],
      },
      {
        category: '💇‍♀️ Style',
        items: [
          { name: 'Silk Press', price: '$250.00' },
          { name: 'Shampoo & Style', price: '$250.00' },
          { name: 'Conditioning Treatment', price: '$350.00' },
          { name: 'Trim', price: '$50.00' },
        ],
      },
    ],
  },

  p2: {
    id: 'p2',
    name: 'Devon',
    location: 'Santa Ana, CA',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    patrons: ['Marcus', 'Jaylen', 'Dre'],
    bio: 'Precision cuts and clean fades are my specialty. 8 years behind the chair, I believe every client deserves a fresh look tailored to their face shape and lifestyle.',
    ratings: [
      { label: 'Quality', score: 4.8 },
      { label: 'Friendliness', score: 4.9 },
      { label: 'Expertise', score: 4.8 },
      { label: 'Wait Time', score: 4.2 },
    ],
    nextAvailable: 'Tomorrow (3 slots)',
    serviceList: [
      {
        category: '💈 Cuts',
        items: [
          { name: 'Fade', price: '$35.00' },
          { name: 'Taper', price: '$30.00' },
          { name: 'Shape-Up', price: '$20.00' },
          { name: 'Full Cut & Style', price: '$50.00' },
        ],
      },
      {
        category: '💈 Beard',
        items: [
          { name: 'Beard Trim', price: '$15.00' },
          { name: 'Beard Line-Up', price: '$20.00' },
          { name: 'Hot Towel Shave', price: '$35.00' },
        ],
      },
      {
        category: '💈 Add-Ons',
        items: [
          { name: 'Lineup', price: '$10.00' },
          { name: 'Scalp Massage', price: '$15.00' },
          { name: 'Hair Design', price: 'Inquire' },
        ],
      },
    ],
  },

  p3: {
    id: 'p3',
    name: 'Jasmine',
    location: 'Irvine, CA',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    patrons: ['Tanya', 'Bria', 'Keisha'],
    bio: 'Nail art is my passion — from minimalist clean girl nails to bold statement sets. I use only non-toxic, premium gel products. Every set is a custom piece of wearable art.',
    ratings: [
      { label: 'Quality', score: 4.7 },
      { label: 'Friendliness', score: 5.0 },
      { label: 'Expertise', score: 4.8 },
      { label: 'Value', score: 4.4 },
    ],
    nextAvailable: 'Saturday (1 slot)',
    serviceList: [
      {
        category: '💅 Manicure',
        items: [
          { name: 'Classic Manicure', price: '$35.00' },
          { name: 'Gel Manicure', price: '$55.00' },
          { name: 'Soft Gel Extensions', price: '$75.00' },
          { name: 'Acrylic Full Set', price: '$65.00' },
        ],
      },
      {
        category: '💅 Pedicure',
        items: [
          { name: 'Classic Pedicure', price: '$45.00' },
          { name: 'Gel Pedicure', price: '$65.00' },
          { name: 'Spa Pedicure', price: '$75.00' },
        ],
      },
      {
        category: '💅 Nail Art',
        items: [
          { name: 'Simple Design (per nail)', price: '$5.00' },
          { name: 'Complex Art (per nail)', price: '$10.00' },
          { name: 'Full Custom Set', price: 'Inquire' },
        ],
      },
    ],
  },

  p4: {
    id: 'p4',
    name: 'Marcus',
    location: 'Anaheim, CA',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    patrons: ['Renee', 'Simone', 'Layla'],
    bio: 'Licensed massage therapist with 10 years of experience in therapeutic and relaxation massage. I combine techniques to address your body\'s specific needs and help you leave feeling restored.',
    ratings: [
      { label: 'Quality', score: 4.8 },
      { label: 'Friendliness', score: 4.7 },
      { label: 'Expertise', score: 4.9 },
      { label: 'Atmosphere', score: 4.6 },
    ],
    nextAvailable: 'Wednesday (2 slots)',
    serviceList: [
      {
        category: '💆 Therapeutic',
        items: [
          { name: 'Deep Tissue (60 min)', price: '$95.00' },
          { name: 'Deep Tissue (90 min)', price: '$135.00' },
          { name: 'Sports Massage (60 min)', price: '$100.00' },
          { name: 'Trigger Point Therapy', price: '$110.00' },
        ],
      },
      {
        category: '💆 Relaxation',
        items: [
          { name: 'Swedish (60 min)', price: '$85.00' },
          { name: 'Swedish (90 min)', price: '$120.00' },
          { name: 'Hot Stone (75 min)', price: '$115.00' },
          { name: 'Aromatherapy Add-On', price: '$20.00' },
        ],
      },
    ],
  },

  p5: {
    id: 'p5',
    name: 'Aisha',
    location: 'Long Beach, CA',
    avatar: 'https://randomuser.me/api/portraits/women/91.jpg',
    patrons: ['Dani', 'Priya', 'Morgan'],
    bio: 'Board-certified esthetician specializing in advanced skin treatments. I believe healthy skin is a lifelong journey — let me help you find a routine that works for your unique skin.',
    ratings: [
      { label: 'Quality', score: 4.6 },
      { label: 'Friendliness', score: 4.8 },
      { label: 'Expertise', score: 4.7 },
      { label: 'Cleanliness', score: 5.0 },
    ],
    nextAvailable: 'Thursday (2 slots)',
    serviceList: [
      {
        category: '🧖‍♀️ Facials',
        items: [
          { name: 'HydraFacial (60 min)', price: '$145.00' },
          { name: 'Classic Facial (50 min)', price: '$85.00' },
          { name: 'Chemical Peel', price: '$120.00' },
          { name: 'Microdermabrasion', price: '$100.00' },
        ],
      },
      {
        category: '🧖‍♀️ Brow & Lash',
        items: [
          { name: 'Brow Shaping', price: '$30.00' },
          { name: 'Brow Tint', price: '$25.00' },
          { name: 'Lash Tint', price: '$35.00' },
          { name: 'Brow + Lash Combo', price: '$50.00' },
        ],
      },
    ],
  },

  p6: {
    id: 'p6',
    name: 'Tyler',
    location: 'Torrance, CA',
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
    patrons: ['Chris', 'Kevin', 'Jordan'],
    bio: 'NASM-certified personal trainer with a focus on functional fitness. My approach is science-backed but human-first — we move well, build strength, and have fun doing it.',
    ratings: [
      { label: 'Quality', score: 4.9 },
      { label: 'Friendliness', score: 4.9 },
      { label: 'Expertise', score: 4.8 },
      { label: 'Punctuality', score: 4.7 },
    ],
    nextAvailable: 'Monday (4 slots)',
    serviceList: [
      {
        category: '💪 Training',
        items: [
          { name: 'HIIT Session (45 min)', price: '$80.00' },
          { name: 'Strength Training (60 min)', price: '$85.00' },
          { name: 'Mobility & Recovery (45 min)', price: '$70.00' },
          { name: '10-Session Package', price: '$750.00' },
        ],
      },
      {
        category: '💪 Coaching',
        items: [
          { name: 'Nutrition Coaching (monthly)', price: '$150.00' },
          { name: 'Online Programming', price: '$99.00/mo' },
          { name: 'Initial Assessment', price: '$60.00' },
        ],
      },
    ],
  },

  p7: {
    id: 'p7',
    name: 'Brianna',
    location: 'Compton, CA',
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    patrons: ['Nia', 'Alexis', 'Chanelle'],
    bio: 'Makeup artist with 6 years in editorial, bridal, and commercial work. I love celebrating natural beauty while creating looks that make you feel confident and radiant.',
    ratings: [
      { label: 'Quality', score: 4.7 },
      { label: 'Friendliness', score: 4.9 },
      { label: 'Expertise', score: 4.6 },
      { label: 'Value', score: 4.8 },
    ],
    nextAvailable: 'Friday (2 slots)',
    serviceList: [
      {
        category: '💄 Glam',
        items: [
          { name: 'Full Glam', price: '$150.00' },
          { name: 'Natural Glam', price: '$100.00' },
          { name: 'Editorial Look', price: 'Inquire' },
        ],
      },
      {
        category: '💄 Bridal',
        items: [
          { name: 'Bridal Makeup', price: '$250.00' },
          { name: 'Bridal Trial', price: '$150.00' },
          { name: 'Bridesmaid (per person)', price: '$95.00' },
        ],
      },
      {
        category: '💄 Lesson',
        items: [
          { name: 'Makeup Lesson (90 min)', price: '$120.00' },
          { name: 'Mini Lesson (45 min)', price: '$75.00' },
        ],
      },
    ],
  },
};

// Fallback for unknown provider IDs
const DEFAULT_PROVIDER = MOCK_PROVIDERS['p1'];

// ─── Screen ────────────────────────────────────────────────────────────────────

export function ProviderProfileScreen({ navigation, route }: Props) {
  const [saved, setSaved] = useState(false);

  const { providerId } = route.params;
  const provider = MOCK_PROVIDERS[providerId] ?? DEFAULT_PROVIDER;

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
