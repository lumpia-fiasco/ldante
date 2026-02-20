import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Button } from '../../components/common';
import { RootStackParamList } from '../../navigation';
import { IconHeartHandshake, IconMapPin, IconStar } from '@tabler/icons-react-native';
import { CrowndLogo } from '../../components/brand/CrowndLogo';

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Welcome'>;
};

export function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Background gradient blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <View style={styles.hero}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoRing}>
            <CrowndLogo size={56} />
          </View>
          <Text style={styles.logoText}>CROWND</Text>
          <Text style={styles.logoTagline}>Your beauty network</Text>
        </View>

        {/* Value props */}
        <View style={styles.valueProps}>
          <ValueProp icon={<IconHeartHandshake size={24} color={Colors.primary} strokeWidth={1.75} />} title="Trusted Referrals" desc="Discover providers your friends actually love" />
          <ValueProp icon={<IconMapPin size={24} color={Colors.primary} strokeWidth={1.75} />} title="Follow Your Favorites" desc="Stay connected when they move salons" />
          <ValueProp icon={<IconStar size={24} color={Colors.primary} strokeWidth={1.75} />} title="Personalized Ratings" desc="Ratings that match what you care about" />
        </View>
      </View>

      {/* CTA */}
      <View style={styles.cta}>
        <Button
          label="Get Started"
          onPress={() => navigation.navigate('SignUp')}
          variant="primary"
          size="lg"
        />
        <Button
          label="I already have an account"
          onPress={() => navigation.navigate('Login')}
          variant="ghost"
          size="md"
        />
        <Text style={styles.disclaimer}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function ValueProp({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <View style={styles.valueProp}>
      <View style={styles.valuePropIcon}>
        <View>{icon}</View>
      </View>
      <View style={styles.valuePropText}>
        <Text style={styles.valuePropTitle}>{title}</Text>
        <Text style={styles.valuePropDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  blob1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: `${Colors.primary}18`,
    top: -80,
    right: -80,
  },
  blob2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: `${Colors.accent}12`,
    bottom: 200,
    left: -60,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    gap: Spacing['3xl'],
  },
  logoContainer: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: `${Colors.primary}22`,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  logoText: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.extrabold,
    color: Colors.textPrimary,
    letterSpacing: 4,
  },
  logoTagline: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  valueProps: {
    width: '100%',
    gap: Spacing.base,
  },
  valueProp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  valuePropIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: `${Colors.primary}18`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valuePropText: { flex: 1, gap: 2 },
  valuePropTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  valuePropDesc: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  cta: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['2xl'],
    gap: Spacing.sm,
  },
  disclaimer: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    paddingTop: Spacing.xs,
  },
});
