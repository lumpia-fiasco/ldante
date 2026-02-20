import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TextInputProps,
  ViewStyle,
  TextStyle,
  Image,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../theme';

// ─── Button ────────────────────────────────────────────────────────────────────

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  fullWidth = true,
}: ButtonProps) {
  const containerStyle = [
    styles.btn,
    styles[`btn_${variant}`],
    styles[`btn_size_${size}`],
    fullWidth && styles.btn_fullWidth,
    (disabled || loading) && styles.btn_disabled,
    style,
  ];

  const labelStyle = [
    styles.btn_label,
    styles[`btn_label_${variant}`],
    styles[`btn_label_${size}`],
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? Colors.white : Colors.primary}
          size={20}
        />
      ) : (
        <View style={styles.btn_inner}>
          {icon && <View style={styles.btn_icon}>{icon}</View>}
          <Text style={labelStyle}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Input ─────────────────────────────────────────────────────────────────────

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  ...props
}: InputProps) {
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View style={[styles.inputWrapper, error ? styles.inputWrapper_error : null]}>
        {leftIcon && <View style={styles.inputIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.input_withLeft : null,
            rightIcon ? styles.input_withRight : null,
            style as any,
          ]}
          placeholderTextColor={Colors.textMuted}
          {...props}
        />
        {rightIcon && <View style={styles.inputIconRight}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.inputError}>{error}</Text>}
      {hint && !error && <Text style={styles.inputHint}>{hint}</Text>}
    </View>
  );
}

// ─── Avatar ────────────────────────────────────────────────────────────────────

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  style?: ViewStyle;
  badge?: string;
}

export function Avatar({ uri, name, size = 40, style, badge }: AvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <View style={[styles.avatarContainer, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.avatarImage,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      ) : (
        <View
          style={[
            styles.avatarFallback,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={[styles.avatarInitials, { fontSize: size * 0.38 }]}>
            {initials}
          </Text>
        </View>
      )}
      {badge && (
        <View style={styles.avatarBadge}>
          <Text style={styles.avatarBadgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'flat';
}

export function Card({ children, style, onPress, variant = 'default' }: CardProps) {
  const cardStyle = [
    styles.card,
    variant === 'elevated' && styles.card_elevated,
    variant === 'flat' && styles.card_flat,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

// ─── Badge ─────────────────────────────────────────────────────────────────────

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({ label, variant = 'primary', size = 'sm', style }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[`badge_${variant}`], style]}>
      <Text style={[styles.badge_label, styles[`badge_label_${size}`]]}>{label}</Text>
    </View>
  );
}

// ─── StarRating ────────────────────────────────────────────────────────────────

interface StarRatingProps {
  score: number; // 0-5
  size?: number;
  showScore?: boolean;
  count?: number;
  interactive?: boolean;
  onRate?: (score: number) => void;
  style?: ViewStyle;
}

export function StarRating({
  score,
  size = 16,
  showScore = false,
  count,
  interactive = false,
  onRate,
  style,
}: StarRatingProps) {
  return (
    <View style={[styles.stars, style]}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => interactive && onRate && onRate(star)}
          disabled={!interactive}
          activeOpacity={interactive ? 0.7 : 1}
        >
          <Text
            style={{
              fontSize: size,
              color: star <= Math.round(score) ? Colors.star : Colors.starEmpty,
            }}
          >
            ★
          </Text>
        </TouchableOpacity>
      ))}
      {showScore && (
        <Text style={[styles.starScore, { fontSize: size * 0.85 }]}>
          {score.toFixed(1)}
          {count !== undefined && (
            <Text style={styles.starCount}> ({count})</Text>
          )}
        </Text>
      )}
    </View>
  );
}

// ─── SectionHeader ─────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function SectionHeader({ title, action, onAction, style }: SectionHeaderProps) {
  return (
    <View style={[styles.sectionHeader, style]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Divider ───────────────────────────────────────────────────────────────────

export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

// ─── EmptyState ────────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  action?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, message, action, onAction }: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      {icon && <Text style={styles.emptyIcon}>{icon}</Text>}
      <Text style={styles.emptyTitle}>{title}</Text>
      {message && <Text style={styles.emptyMessage}>{message}</Text>}
      {action && (
        <Button label={action} onPress={onAction!} variant="primary" style={styles.emptyAction} fullWidth={false} />
      )}
    </View>
  );
}

// ─── LoadingScreen ─────────────────────────────────────────────────────────────

export function LoadingScreen({ message }: { message?: string }) {
  return (
    <View style={styles.loadingScreen}>
      <ActivityIndicator size={36} color={Colors.primary} />
      {message && <Text style={styles.loadingMessage}>{message}</Text>}
    </View>
  );
}

// ─── Chip ──────────────────────────────────────────────────────────────────────

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Chip({ label, selected = false, onPress, style }: ChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chip_selected, style]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chip_label, selected && styles.chip_label_selected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── ScreenHeader ──────────────────────────────────────────────────────────────

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  style?: ViewStyle;
}

export function ScreenHeader({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  style,
}: ScreenHeaderProps) {
  return (
    <View style={[styles.screenHeader, style]}>
      <TouchableOpacity
        style={styles.screenHeader_left}
        onPress={onLeftPress}
        disabled={!onLeftPress}
      >
        {leftIcon}
      </TouchableOpacity>
      <View style={styles.screenHeader_center}>
        <Text style={styles.screenHeader_title}>{title}</Text>
        {subtitle && <Text style={styles.screenHeader_subtitle}>{subtitle}</Text>}
      </View>
      <TouchableOpacity
        style={styles.screenHeader_right}
        onPress={onRightPress}
        disabled={!onRightPress}
      >
        {rightIcon}
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Button
  btn: {
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  btn_fullWidth: { width: '100%' },
  btn_primary: { backgroundColor: Colors.primary },
  btn_secondary: { backgroundColor: Colors.surface },
  btn_outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  btn_ghost: { backgroundColor: Colors.transparent },
  btn_danger: { backgroundColor: Colors.error },
  btn_disabled: { opacity: 0.45 },
  btn_size_sm: { paddingVertical: Spacing.sm, minHeight: 36 },
  btn_size_md: { paddingVertical: Spacing.md, minHeight: 48 },
  btn_size_lg: { paddingVertical: Spacing.base, minHeight: 56 },
  btn_label: {
    fontWeight: Typography.weights.semibold,
    letterSpacing: 0.2,
  },
  btn_label_primary: { color: Colors.white },
  btn_label_secondary: { color: Colors.textPrimary },
  btn_label_outline: { color: Colors.primary },
  btn_label_ghost: { color: Colors.primary },
  btn_label_danger: { color: Colors.white },
  btn_label_sm: { fontSize: Typography.sizes.sm },
  btn_label_md: { fontSize: Typography.sizes.base },
  btn_label_lg: { fontSize: Typography.sizes.md },
  btn_inner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  btn_icon: { marginRight: 2 },

  // Input
  inputContainer: { gap: Spacing.xs },
  inputLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputWrapper_error: { borderColor: Colors.error },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
    minHeight: 48,
  },
  input_withLeft: { paddingLeft: Spacing.sm },
  input_withRight: { paddingRight: Spacing.sm },
  inputIcon: { paddingLeft: Spacing.base },
  inputIconRight: { paddingRight: Spacing.base },
  inputError: {
    fontSize: Typography.sizes.xs,
    color: Colors.error,
  },
  inputHint: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },

  // Avatar
  avatarContainer: { position: 'relative' },
  avatarImage: { resizeMode: 'cover' },
  avatarFallback: {
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: Colors.white,
    fontWeight: Typography.weights.bold,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  avatarBadgeText: {
    fontSize: 8,
    color: Colors.white,
    fontWeight: Typography.weights.bold,
  },

  // Card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  card_elevated: {
    ...Shadows.md,
    borderWidth: 0,
  },
  card_flat: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 0,
  },

  // Badge
  badge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badge_primary: { backgroundColor: `${Colors.primary}22` },
  badge_secondary: { backgroundColor: `${Colors.secondary}22` },
  badge_success: { backgroundColor: `${Colors.success}22` },
  badge_warning: { backgroundColor: `${Colors.warning}22` },
  badge_error: { backgroundColor: `${Colors.error}22` },
  badge_neutral: { backgroundColor: Colors.surfaceAlt },
  badge_label: { fontWeight: Typography.weights.semibold },
  badge_label_sm: { fontSize: Typography.sizes.xs, color: Colors.textPrimary },
  badge_label_md: { fontSize: Typography.sizes.sm, color: Colors.textPrimary },

  // Stars
  stars: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  starScore: {
    color: Colors.textPrimary,
    fontWeight: Typography.weights.semibold,
    marginLeft: Spacing.xs,
  },
  starCount: { color: Colors.textMuted, fontWeight: Typography.weights.regular },

  // SectionHeader
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  sectionAction: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.base,
  },

  // EmptyState
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['3xl'],
    gap: Spacing.md,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyAction: { marginTop: Spacing.md },

  // Loading
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    gap: Spacing.base,
  },
  loadingMessage: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
  },

  // Chip
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chip_selected: {
    backgroundColor: `${Colors.primary}22`,
    borderColor: Colors.primary,
  },
  chip_label: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  chip_label_selected: { color: Colors.primary },

  // ScreenHeader
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  screenHeader_left: { width: 40, alignItems: 'flex-start' },
  screenHeader_right: { width: 40, alignItems: 'flex-end' },
  screenHeader_center: { flex: 1, alignItems: 'center' },
  screenHeader_title: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  screenHeader_subtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
});
