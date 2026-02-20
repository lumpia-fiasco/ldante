import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Avatar, Button, Card, Divider } from '../../components/common';
import { authService } from '../../services/supabase';

const MOCK_USER = {
  full_name: 'Alex Johnson',
  email: 'alex@example.com',
  role: 'customer',
  location: 'Chicago, IL',
  joined: 'January 2026',
  friends: 5,
  providers: 3,
  bookings: 8,
};

export function ProfileScreen() {
  const [user] = useState(MOCK_USER);

  async function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await authService.signOut();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.hero}>
          <Avatar name={user.full_name} size={80} />
          <Text style={styles.name}>{user.full_name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.location}>📍 {user.location}</Text>
          <Text style={styles.joined}>Member since {user.joined}</Text>

          {/* Stats */}
          <View style={styles.stats}>
            <StatItem value={user.friends} label="Friends" />
            <View style={styles.statDivider} />
            <StatItem value={user.providers} label="Providers" />
            <View style={styles.statDivider} />
            <StatItem value={user.bookings} label="Bookings" />
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.sections}>
          <MenuSection title="Account">
            <MenuItem icon="👤" label="Edit Profile" onPress={() => {}} />
            <MenuItem icon="🔒" label="Privacy Settings" onPress={() => {}} />
            <MenuItem icon="🔔" label="Notification Preferences" onPress={() => {}} />
            <MenuItem icon="💳" label="Payment Methods" onPress={() => {}} last />
          </MenuSection>

          <MenuSection title="My Network">
            <MenuItem icon="👥" label="Friends" badge="5" onPress={() => {}} />
            <MenuItem icon="📋" label="My Rolodex" badge="3" onPress={() => {}} />
            <MenuItem icon="⭐" label="Rating Preferences" onPress={() => {}} last />
          </MenuSection>

          <MenuSection title="Provider">
            <MenuItem icon="✂️" label="Switch to Provider View" onPress={() => {}} last />
          </MenuSection>

          <MenuSection title="Support">
            <MenuItem icon="❓" label="Help & FAQ" onPress={() => {}} />
            <MenuItem icon="💬" label="Contact Support" onPress={() => {}} />
            <MenuItem icon="⭐" label="Rate the App" onPress={() => {}} />
            <MenuItem icon="📜" label="Terms & Privacy" onPress={() => {}} last />
          </MenuSection>

          <Button
            label="Sign Out"
            onPress={handleSignOut}
            variant="outline"
            size="lg"
            style={styles.signOutBtn}
          />

          <Text style={styles.version}>CROWND v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.menuSection}>
      <Text style={styles.menuSectionTitle}>{title}</Text>
      <View style={styles.menuCard}>
        {children}
      </View>
    </View>
  );
}

function MenuItem({
  icon, label, badge, onPress, last = false,
}: {
  icon: string; label: string; badge?: string; onPress: () => void; last?: boolean;
}) {
  return (
    <>
      <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.menuIcon}>{icon}</Text>
        <Text style={styles.menuLabel}>{label}</Text>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <Text style={styles.menuChevron}>›</Text>
      </TouchableOpacity>
      {!last && <View style={styles.menuDivider} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: Spacing['3xl'] },
  hero: {
    alignItems: 'center', padding: Spacing['2xl'],
    gap: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  name: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.extrabold, color: Colors.textPrimary },
  email: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  location: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  joined: { fontSize: Typography.sizes.xs, color: Colors.textMuted },
  stats: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.border,
    width: '100%', marginTop: Spacing.md,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.extrabold, color: Colors.textPrimary },
  statLabel: { fontSize: Typography.sizes.xs, color: Colors.textMuted },
  statDivider: { width: 1, height: 36, backgroundColor: Colors.border },
  sections: { padding: Spacing.base, gap: Spacing.xl },
  menuSection: { gap: Spacing.sm },
  menuSectionTitle: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.textMuted, paddingLeft: Spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  menuCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.base },
  menuIcon: { fontSize: 20, width: 28 },
  menuLabel: { flex: 1, fontSize: Typography.sizes.base, color: Colors.textPrimary },
  menuChevron: { fontSize: 20, color: Colors.textMuted },
  menuDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 52 },
  badge: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  badgeText: { fontSize: Typography.sizes.xs, color: Colors.white, fontWeight: Typography.weights.bold },
  signOutBtn: { marginTop: Spacing.sm },
  version: { fontSize: Typography.sizes.xs, color: Colors.textMuted, textAlign: 'center' },
});
