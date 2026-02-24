import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Button } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'RoleSelect'>;
};

type Role = 'customer' | 'provider';

export function RoleSelectScreen({ navigation }: Props) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();

  async function handleContinue() {
    if (!selectedRole) return;
    setLoading(true);
    try {
      // Persist role to Supabase so it's remembered on next app launch
      await updateUser({ role: selectedRole });
    } catch {
      // Non-fatal — continue anyway
    } finally {
      setLoading(false);
    }
    if (selectedRole === 'customer') {
      navigation.navigate('CustomerOnboarding');
    } else {
      navigation.navigate('ProviderOnboarding');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headline}>How will you use CROWND?</Text>
          <Text style={styles.subheadline}>
            Choose your role — you can always add the other later
          </Text>
        </View>

        <View style={styles.options}>
          <RoleCard
            emoji="💅"
            title="I'm a Customer"
            description="Discover trusted providers through your network and book appointments"
            features={[
              "Browse your friends' trusted providers",
              'Follow providers across locations',
              'Get personalized weighted ratings',
              'Book appointments directly',
            ]}
            selected={selectedRole === 'customer'}
            onPress={() => setSelectedRole('customer')}
          />

          <RoleCard
            emoji="✂️"
            title="I'm a Provider"
            description="Build your portable reputation and grow your independent client base"
            features={[
              'Create your professional profile',
              'Manage bookings & availability',
              'Get discovered through social networks',
              'Keep customers when you move',
            ]}
            selected={selectedRole === 'provider'}
            onPress={() => setSelectedRole('provider')}
          />
        </View>

        <Button
          label="Continue"
          onPress={handleContinue}
          disabled={!selectedRole}
          loading={loading}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

function RoleCard({
  emoji,
  title,
  description,
  features,
  selected,
  onPress,
}: {
  emoji: string;
  title: string;
  description: string;
  features: string[];
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.card_selected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.card_header}>
        <View style={[styles.card_iconWrap, selected && styles.card_iconWrap_selected]}>
          <Text style={styles.card_emoji}>{emoji}</Text>
        </View>
        <View style={styles.card_titles}>
          <Text style={[styles.card_title, selected && styles.card_title_selected]}>
            {title}
          </Text>
          <Text style={styles.card_desc}>{description}</Text>
        </View>
        <View style={[styles.radio, selected && styles.radio_selected]}>
          {selected && <View style={styles.radio_inner} />}
        </View>
      </View>

      <View style={styles.card_features}>
        {features.map((f, i) => (
          <View key={i} style={styles.feature}>
            <Text style={[styles.feature_dot, selected && styles.feature_dot_selected]}>
              ●
            </Text>
            <Text style={styles.feature_text}>{f}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    flex: 1,
    padding: Spacing['2xl'],
    gap: Spacing.xl,
    justifyContent: 'center',
  },
  header: { gap: Spacing.sm },
  headline: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.extrabold,
    color: Colors.textPrimary,
  },
  subheadline: { fontSize: Typography.sizes.base, color: Colors.textSecondary },
  options: { gap: Spacing.base },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  card_selected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}0D`,
  },
  card_header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  card_iconWrap: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card_iconWrap_selected: { backgroundColor: `${Colors.primary}22` },
  card_emoji: { fontSize: 28 },
  card_titles: { flex: 1, gap: 2 },
  card_title: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  card_title_selected: { color: Colors.primary },
  card_desc: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radio_selected: { borderColor: Colors.primary },
  radio_inner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  card_features: { gap: Spacing.xs, paddingLeft: Spacing.xs },
  feature: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  feature_dot: { fontSize: 6, color: Colors.textMuted },
  feature_dot_selected: { color: Colors.primary },
  feature_text: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
});
