import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Button, Avatar, ScreenHeader, StarRating, Chip } from '../../components/common';
import { RATING_DIMENSIONS, BEST_FOR_TAGS } from '../../constants';
import { RootStackParamList } from '../../navigation';
import { IconX } from '@tabler/icons-react-native';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'LeaveReview'>;
  route: RouteProp<RootStackParamList, 'LeaveReview'>;
};

export function LeaveReviewScreen({ navigation, route }: Props) {
  const { bookingId } = route.params;

  const [overallScore, setOverallScore] = useState(0);
  const [dimensionScores, setDimensionScores] = useState<Record<string, number>>({});
  const [reviewText, setReviewText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('friends');
  const [loading, setLoading] = useState(false);

  function setDimensionScore(key: string, score: number) {
    setDimensionScores((prev) => ({ ...prev, [key]: score }));
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function validate() {
    if (overallScore === 0) {
      Alert.alert('Please give an overall rating');
      return false;
    }
    const ratedDimensions = Object.keys(dimensionScores).filter(
      (k) => dimensionScores[k] > 0
    );
    if (ratedDimensions.length < 3) {
      Alert.alert('Please rate at least 3 dimensions');
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    Alert.alert(
      'Review Submitted! ⭐',
      'Thank you! Your review helps others in your network find great providers.',
      [{ text: 'Done', onPress: () => navigation.goBack() }]
    );
  }

  const ratedCount = Object.values(dimensionScores).filter((s) => s > 0).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Leave a Review"
        leftIcon={<IconX size={24} color={Colors.textPrimary} strokeWidth={1.75} />}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Provider Info */}
        <View style={styles.providerInfo}>
          <Avatar name="Nina Patel" size={56} />
          <View>
            <Text style={styles.providerName}>Nina Patel</Text>
            <Text style={styles.serviceLabel}>Gel Manicure · Jan 15, 2026</Text>
          </View>
        </View>

        {/* Overall Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Rating *</Text>
          <View style={styles.overallStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setOverallScore(star)}>
                <Text
                  style={[
                    styles.bigStar,
                    { color: star <= overallScore ? Colors.star : Colors.starEmpty },
                  ]}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {overallScore > 0 && (
            <Text style={styles.scoreLabel}>
              {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][overallScore]}
            </Text>
          )}
        </View>

        {/* Dimension Ratings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Rate Each Aspect *{' '}
            <Text style={styles.sectionHint}>({ratedCount}/6 rated, 3+ required)</Text>
          </Text>
          <View style={styles.dimensions}>
            {RATING_DIMENSIONS.map((dim) => {
              const score = dimensionScores[dim.key] || 0;
              return (
                <View key={dim.key} style={styles.dimensionRow}>
                  <View style={styles.dimLabel}>
                    <Text style={styles.dimIcon}>{dim.icon}</Text>
                    <Text style={styles.dimName}>{dim.label}</Text>
                  </View>
                  <View style={styles.dimStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => setDimensionScore(dim.key, star)}
                      >
                        <Text
                          style={[
                            styles.smallStar,
                            { color: star <= score ? Colors.star : Colors.starEmpty },
                          ]}
                        >
                          ★
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {score > 0 && (
                    <Text style={styles.dimScore}>{score}/5</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Would Recommend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Would you recommend?</Text>
          <View style={styles.recommendRow}>
            <TouchableOpacity
              style={[
                styles.recommendBtn,
                wouldRecommend === true && styles.recommendBtn_yes,
              ]}
              onPress={() => setWouldRecommend(true)}
            >
              <Text style={styles.recommendEmoji}>👍</Text>
              <Text
                style={[
                  styles.recommendText,
                  wouldRecommend === true && styles.recommendText_active,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.recommendBtn,
                wouldRecommend === false && styles.recommendBtn_no,
              ]}
              onPress={() => setWouldRecommend(false)}
            >
              <Text style={styles.recommendEmoji}>👎</Text>
              <Text
                style={[
                  styles.recommendText,
                  wouldRecommend === false && styles.recommendText_no,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Written Review */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Write a Review (Optional)</Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your experience..."
            placeholderTextColor={Colors.textMuted}
            value={reviewText}
            onChangeText={setReviewText}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.charCount}>{reviewText.length}/500</Text>
        </View>

        {/* Best For Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best For (Optional)</Text>
          <View style={styles.tags}>
            {BEST_FOR_TAGS.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                selected={selectedTags.includes(tag)}
                onPress={() => toggleTag(tag)}
              />
            ))}
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Review Visibility</Text>
          <View style={styles.privacyRow}>
            {([
              { key: 'public', label: '🌐 Public', desc: 'Everyone' },
              { key: 'friends', label: '👥 Friends', desc: 'Friends only' },
              { key: 'private', label: '🔒 Private', desc: 'Only me' },
            ] as const).map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.privacyCard,
                  privacy === opt.key && styles.privacyCard_active,
                ]}
                onPress={() => setPrivacy(opt.key)}
              >
                <Text style={styles.privacyLabel}>{opt.label}</Text>
                <Text style={styles.privacyDesc}>{opt.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weight explanation */}
        <View style={styles.weightInfo}>
          <Text style={styles.weightInfoText}>
            ⚡ Your review will be weighted based on your similarity with other users — helping
            people like you find providers that match their style.
          </Text>
        </View>

        <Button
          label="Submit Review"
          onPress={handleSubmit}
          loading={loading}
          size="lg"
        />

        <View style={{ height: Spacing['2xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, gap: Spacing.xl, paddingBottom: Spacing['3xl'] },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  providerName: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  serviceLabel: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  section: { gap: Spacing.md },
  sectionTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  sectionHint: { fontSize: Typography.sizes.sm, color: Colors.textMuted, fontWeight: Typography.weights.regular },
  overallStars: { flexDirection: 'row', gap: Spacing.sm, justifyContent: 'center' },
  bigStar: { fontSize: 44 },
  scoreLabel: {
    textAlign: 'center',
    fontSize: Typography.sizes.base,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  dimensions: { gap: Spacing.md },
  dimensionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dimLabel: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  dimIcon: { fontSize: 16, width: 22 },
  dimName: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, flex: 1 },
  dimStars: { flexDirection: 'row', gap: 4 },
  smallStar: { fontSize: 24 },
  dimScore: { fontSize: Typography.sizes.sm, color: Colors.primary, fontWeight: Typography.weights.semibold, width: 28, textAlign: 'right' },
  recommendRow: { flexDirection: 'row', gap: Spacing.md },
  recommendBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  recommendBtn_yes: { borderColor: Colors.success, backgroundColor: `${Colors.success}15` },
  recommendBtn_no: { borderColor: Colors.error, backgroundColor: `${Colors.error}15` },
  recommendEmoji: { fontSize: 22 },
  recommendText: { fontSize: Typography.sizes.base, color: Colors.textSecondary, fontWeight: Typography.weights.medium },
  recommendText_active: { color: Colors.success },
  recommendText_no: { color: Colors.error },
  reviewInput: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: { fontSize: Typography.sizes.xs, color: Colors.textMuted, textAlign: 'right' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  privacyRow: { flexDirection: 'row', gap: Spacing.sm },
  privacyCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: 4,
  },
  privacyCard_active: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}12` },
  privacyLabel: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },
  privacyDesc: { fontSize: Typography.sizes.xs, color: Colors.textMuted },
  weightInfo: {
    backgroundColor: `${Colors.primary}12`,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  weightInfoText: { fontSize: Typography.sizes.sm, color: Colors.primary, lineHeight: 20 },
});
