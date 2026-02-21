import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { ScreenHeader } from '../../components/common';
import { RootStackParamList } from '../../navigation';
import {
  IconArrowLeft, IconBell, IconLock, IconEye, IconMapPin,
  IconMoon, IconChevronRight, IconDeviceMobile, IconLanguage,
} from '@tabler/icons-react-native';

type Nav = StackNavigationProp<RootStackParamList>;

export function SettingsScreen() {
  const navigation = useNavigation<Nav>();

  // Toggle states — UI only, no persistence yet
  const [pushNotifs, setPushNotifs] = useState(true);
  const [bookingReminders, setBookingReminders] = useState(true);
  const [friendActivity, setFriendActivity] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Settings"
        leftIcon={<IconArrowLeft size={24} color={Colors.textPrimary} strokeWidth={1.75} />}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Notifications */}
        <SettingsSection title="Notifications" icon={<IconBell size={18} color={Colors.textMuted} strokeWidth={1.75} />}>
          <ToggleRow
            label="Push Notifications"
            sublabel="Receive alerts on your device"
            value={pushNotifs}
            onToggle={setPushNotifs}
          />
          <Divider />
          <ToggleRow
            label="Booking Reminders"
            sublabel="24-hour and 1-hour reminders"
            value={bookingReminders}
            onToggle={setBookingReminders}
          />
          <Divider />
          <ToggleRow
            label="Friend Activity"
            sublabel="When friends post or book"
            value={friendActivity}
            onToggle={setFriendActivity}
          />
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection title="Appearance" icon={<IconMoon size={18} color={Colors.textMuted} strokeWidth={1.75} />}>
          <ToggleRow
            label="Dark Mode"
            sublabel="Use dark theme throughout the app"
            value={darkMode}
            onToggle={setDarkMode}
          />
        </SettingsSection>

        {/* Privacy & Location */}
        <SettingsSection title="Privacy" icon={<IconLock size={18} color={Colors.textMuted} strokeWidth={1.75} />}>
          <ToggleRow
            label="Private Profile"
            sublabel="Only friends can see your activity"
            value={privateProfile}
            onToggle={setPrivateProfile}
          />
          <Divider />
          <ToggleRow
            label="Location Services"
            sublabel="Help find providers near you"
            value={locationServices}
            onToggle={setLocationServices}
          />
          <Divider />
          <LinkRow
            label="Data & Privacy"
            sublabel="Manage your personal data"
            icon={<IconEye size={20} color={Colors.textSecondary} strokeWidth={1.75} />}
            onPress={() => {}}
          />
        </SettingsSection>

        {/* App Info */}
        <SettingsSection title="About" icon={<IconDeviceMobile size={18} color={Colors.textMuted} strokeWidth={1.75} />}>
          <LinkRow
            label="Language"
            sublabel="English (US)"
            icon={<IconLanguage size={20} color={Colors.textSecondary} strokeWidth={1.75} />}
            onPress={() => {}}
          />
          <Divider />
          <LinkRow
            label="Location"
            sublabel="Southern California"
            icon={<IconMapPin size={20} color={Colors.textSecondary} strokeWidth={1.75} />}
            onPress={() => {}}
          />
        </SettingsSection>

        <Text style={styles.version}>CROWND v1.0.0 · Settings are saved automatically</Text>
        <View style={{ height: Spacing['3xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SettingsSection({ title, icon, children }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionCard}>
        {children}
      </View>
    </View>
  );
}

function ToggleRow({ label, sublabel, value, onToggle }: {
  label: string;
  sublabel: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowSublabel}>{sublabel}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.border, true: Colors.primary }}
        thumbColor={Colors.white}
      />
    </View>
  );
}

function LinkRow({ label, sublabel, icon, onPress }: {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.rowIcon}>{icon}</View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowSublabel}>{sublabel}</Text>
      </View>
      <IconChevronRight size={18} color={Colors.textMuted} strokeWidth={1.75} />
    </TouchableOpacity>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, gap: Spacing.xl, paddingBottom: Spacing['3xl'] },
  section: { gap: Spacing.sm },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingLeft: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold,
    color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border,
  },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: Spacing.base },
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.base, gap: Spacing.md,
  },
  rowIcon: { width: 28, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 },
  rowLabel: { fontSize: Typography.sizes.base, color: Colors.textPrimary, fontWeight: Typography.weights.medium },
  rowSublabel: { fontSize: Typography.sizes.xs, color: Colors.textSecondary, marginTop: 2 },
  version: {
    fontSize: Typography.sizes.xs, color: Colors.textMuted,
    textAlign: 'center', marginTop: Spacing.lg,
  },
});
