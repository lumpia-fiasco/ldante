import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Avatar, Button, Card, Divider } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation';
import {
  IconUser,
  IconLock,
  IconBell,
  IconCreditCard,
  IconUsers,
  IconClipboardList,
  IconStar,
  IconScissors,
  IconHelp,
  IconMessageCircle,
  IconFileText,
  IconChevronRight,
} from '@tabler/icons-react-native';

type Nav = StackNavigationProp<RootStackParamList>;

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { user, signOut, loading } = useAuth();

  async function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          // Navigate back to Welcome after sign-out
          navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        },
      },
    ]);
  }

  if (loading || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ flex: 1 }} color={Colors.primary} />
      </SafeAreaView>
    );
  }

  const displayName = user.full_name || user.email || 'You';
  const isProvider = user.role === 'provider';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.hero}>
          <Avatar name={displayName} size={80} />
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.location ? (
            <Text style={styles.location}>📍 {user.location}</Text>
          ) : null}
        </View>

        {/* Menu Sections */}
        <View style={styles.sections}>
          <MenuSection title="Account">
            <MenuItem
              icon={<IconUser size={24} color={Colors.textSecondary} strokeWidth={1.75} />}
              label="Edit Profile"
              onPress={() => navigation.navigate('ProfileEdit')}
            />
            <MenuItem
              icon={<IconLock size={24} color={Colors.textSecondary} strokeWidth={1.75} />}
              label="Privacy Settings"
              onPress={() => {}}
            />
            <MenuItem
              icon={<IconBell size={24} color={Colors.textSecondary} strokeWidth={1.75} />}
              label="Notification Preferences"
              onPress={() => {}}
            />
            <MenuItem
              icon={<IconCreditCard size={24} color={Colors.textSecondary} strokeWidth={1.75} />}
              label="Payment Methods"
              onPress={() => {}}
              last
            />
          </MenuSection>

          <MenuSection title="My Network">
            <MenuItem
              icon={<IconUsers size={24} color={Colors.textSecondary} strokeWidth={1.75} />}
              label="Friends"
              onPress={() => {}}
            />
            <MenuItem
              icon={<IconClipboardList size={24} color={Colors.textSecondary} strokeWidth={1.75} />}
              label="My Go-tos"
              onPress={() => {}}
            />
            <MenuItem
              icon={<IconStar size={24} color={Colors.textSecondary} strokeWidth={1.75} />}
              label="Rating Preferences"
              onPress={() => {}}
              last
            />
          </MenuSection>

          {isProvider ? (
            <MenuSection title="Provider">
              <MenuItem
                icon={<IconScissors size={24} color={Colors.textSecondary} strokeWidth={1.75} />}
                label="Manage Services"
                onPress={() => navigation.navigate('ManageServices')}
              />
              <MenuItem
                icon={<IconUser size={24} color={Colors.textSecondary} strokeWidth={1.75} />}
                label="Edit Provider Profile"
                onPress={() => navigation.navigate('ProviderProfileEdit')}
                last
              />
            </MenuSection>
          ) : (
            <MenuSection title="Provider">
              <MenuItem
                icon={<Text style={{ fontSize: 22 }}>✂️</Text>}
                label="Switch to Provider View"
                onPress={() => navigation.navigate('ProviderTabs')}
                last
              />
            </MenuSection>
          )}

          <MenuSection title="Support">
            <MenuItem
              icon={<IconHelp size={24} color={Colors.textSecondary} strokeWidth={1.75} />}
              label="Help & FAQ"
              onPress={() => navigation.navigate('HelpSupport')}
            />
            <MenuItem
              icon={<IconMessageCircle size={24} color={Colors.textSecondary} strokeWidth={1.75} />}
              label="Contact Support"
              onPress={() => {}}
            />
            <MenuItem
              icon={<IconStar size={24} color={Colors.textSecondary} strokeWidth={1.75} />}
              label="Rate the App"
              onPress={() => {}}
            />
            <MenuItem
              icon={<IconFileText size={24} color={Colors.textSecondary} strokeWidth={1.75} />}
              label="Terms & Privacy"
              onPress={() => {}}
              last
            />
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
  icon: React.ReactNode; label: string; badge?: string; onPress: () => void; last?: boolean;
}) {
  return (
    <>
      <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.menuIcon}>{icon}</View>
        <Text style={styles.menuLabel}>{label}</Text>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <IconChevronRight size={20} color={Colors.textMuted} strokeWidth={1.75} />
      </TouchableOpacity>
      {!last && <View style={styles.menuDivider} />}
    </>
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
  sections: { padding: Spacing.base, gap: Spacing.xl },
  menuSection: { gap: Spacing.sm },
  menuSectionTitle: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.textMuted, paddingLeft: Spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  menuCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.base },
  menuIcon: { width: 28, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: Typography.sizes.base, color: Colors.textPrimary },
  menuDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 52 },
  badge: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  badgeText: { fontSize: Typography.sizes.xs, color: Colors.white, fontWeight: Typography.weights.bold },
  signOutBtn: { marginTop: Spacing.sm },
  version: { fontSize: Typography.sizes.xs, color: Colors.textMuted, textAlign: 'center' },
});
