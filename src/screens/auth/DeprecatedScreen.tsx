import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IconLinkOff } from '@tabler/icons-react-native';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Button } from '../../components/common';
import { RootStackParamList } from '../../navigation';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Deprecated'>;
};

export function DeprecatedScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.iconWrap}>
          <IconLinkOff size={36} color={Colors.textMuted} strokeWidth={1.5} />
        </View>

        <View style={styles.header}>
          <Text style={styles.headline}>This link has expired</Text>
          <Text style={styles.subheadline}>
            The shortcut you used has been retired. Your account is still here — sign in to get back to your beauty network.
          </Text>
        </View>

        <Button
          label="Sign In"
          onPress={() => navigation.replace('Login')}
          size="lg"
        />

        <Text style={styles.helpText}>
          Need a hand? Reach out to our team and we'll get you sorted.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing['2xl'],
    gap: Spacing.xl,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceWarm,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  header: { gap: Spacing.sm },
  headline: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.extrabold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subheadline: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    lineHeight: Typography.sizes.base * Typography.lineHeights.body,
    textAlign: 'center',
  },
  helpText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
