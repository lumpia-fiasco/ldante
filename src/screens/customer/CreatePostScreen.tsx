import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../theme';
import { RootStackParamList } from '../../navigation';
import {
  IconArrowLeft,
  IconCamera,
  IconPhoto,
  IconX,
  IconChevronRight,
  IconChevronDown,
  IconCheck,
  IconSearch,
} from '@tabler/icons-react-native';
import * as ImagePicker from 'expo-image-picker';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'CreatePost'>;
};

// ─── Types ─────────────────────────────────────────────────────────────────────

type Step = 'media' | 'details' | 'rating';

type RatingCategory = { key: string; label: string };

const RATING_CATEGORIES: RatingCategory[] = [
  { key: 'quality',      label: 'Quality' },
  { key: 'friendliness', label: 'Friendliness' },
  { key: 'expertise',    label: 'Expertise' },
  { key: 'location',     label: 'Location' },
];

// ─── Mock providers the user follows / has been to ─────────────────────────────
// In production these come from the user's Rolodex

type Provider = {
  id: string;
  name: string;
  specialty: string;
  location: string;
  avatar: string;
};

const MY_PROVIDERS: Provider[] = [
  { id: 'p1', name: 'Carmela',  specialty: 'Hair Braider',      location: 'Costa Mesa, CA',  avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 'p2', name: 'Devon',    specialty: 'Barber',            location: 'Santa Ana, CA',   avatar: 'https://randomuser.me/api/portraits/men/42.jpg' },
  { id: 'p3', name: 'Jasmine',  specialty: 'Nail Artist',       location: 'Irvine, CA',      avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
  { id: 'p4', name: 'Marcus',   specialty: 'Massage Therapist', location: 'Anaheim, CA',     avatar: 'https://randomuser.me/api/portraits/men/55.jpg' },
  { id: 'p5', name: 'Aisha',    specialty: 'Esthetician',       location: 'Long Beach, CA',  avatar: 'https://randomuser.me/api/portraits/women/91.jpg' },
  { id: 'p6', name: 'Tyler',    specialty: 'Personal Trainer',  location: 'Torrance, CA',    avatar: 'https://randomuser.me/api/portraits/men/33.jpg' },
  { id: 'p7', name: 'Brianna',  specialty: 'Makeup Artist',     location: 'Compton, CA',     avatar: 'https://randomuser.me/api/portraits/women/17.jpg' },
];

// ─── Star Picker ───────────────────────────────────────────────────────────────

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View style={starStyles.row}>
      {[1, 2, 3, 4, 5].map(n => (
        <TouchableOpacity
          key={n}
          onPress={() => onChange(n)}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          activeOpacity={0.7}
        >
          <Text style={[starStyles.star, n <= value && starStyles.starFilled]}>★</Text>
        </TouchableOpacity>
      ))}
      {value > 0 && (
        <Text style={starStyles.label}>{value.toFixed(1)}</Text>
      )}
    </View>
  );
}

const starStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  star: { fontSize: 28, color: Colors.starEmpty },
  starFilled: { color: Colors.star },
  label: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary, marginLeft: Spacing.xs },
});

// ─── Screen ────────────────────────────────────────────────────────────────────

export function CreatePostScreen({ navigation }: Props) {
  const [step, setStep] = useState<Step>('media');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [providerSearch, setProviderSearch] = useState('');
  const [providerPickerOpen, setProviderPickerOpen] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [ratingOpen, setRatingOpen] = useState(false);
  const [posting, setPosting] = useState(false);

  const filteredProviders = MY_PROVIDERS.filter(p =>
    providerSearch.trim().length === 0 ||
    p.name.toLowerCase().includes(providerSearch.toLowerCase()) ||
    p.specialty.toLowerCase().includes(providerSearch.toLowerCase())
  );

  const ratedCount = Object.values(ratings).filter(v => v > 0).length;

  // ── Media picker ─────────────────────────────────────────────────────────────

  async function pickFromLibrary() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access in Settings to choose from your library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 0.9,
      allowsEditing: true,
      aspect: [4, 5],
    });
    if (!result.canceled && result.assets[0]) {
      setMediaUri(result.assets[0].uri);
      setMediaType(result.assets[0].type === 'video' ? 'video' : 'photo');
    }
  }

  async function openCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow camera access in Settings to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images', 'videos'],
      quality: 0.9,
      allowsEditing: true,
      aspect: [4, 5],
    });
    if (!result.canceled && result.assets[0]) {
      setMediaUri(result.assets[0].uri);
      setMediaType(result.assets[0].type === 'video' ? 'video' : 'photo');
    }
  }

  // ── Tag handling ─────────────────────────────────────────────────────────────

  function addTag() {
    const t = tagInput.trim().replace(/^#/, '');
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  }

  function removeTag(t: string) {
    setTags(prev => prev.filter(x => x !== t));
  }

  // ── Post submission ──────────────────────────────────────────────────────────

  async function handlePost() {
    if (!mediaUri) return;
    if (!selectedProvider) {
      Alert.alert('Tag a provider', 'Please tag the provider who did the work.');
      return;
    }
    setPosting(true);
    // Simulate upload
    await new Promise(r => setTimeout(r, 1500));
    setPosting(false);
    Alert.alert('Posted! 👑', 'Your post is live on your friends\' feeds.', [
      { text: 'Done', onPress: () => navigation.goBack() },
    ]);
  }

  // ── Step: Media ──────────────────────────────────────────────────────────────

  if (step === 'media') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <IconX size={24} color={Colors.textPrimary} strokeWidth={1.75} />
          </TouchableOpacity>
          <Text style={styles.stepTitle}>New Post</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Preview or placeholder */}
        {mediaUri ? (
          <View style={styles.previewWrap}>
            <Image source={{ uri: mediaUri }} style={styles.preview} resizeMode="cover" />
            <TouchableOpacity style={styles.clearMedia} onPress={() => setMediaUri(null)}>
              <IconX size={16} color={Colors.white} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderEmoji}>📷</Text>
            <Text style={styles.placeholderText}>Add a photo or video</Text>
            <Text style={styles.placeholderSub}>Show off the work</Text>
          </View>
        )}

        {/* Source buttons */}
        <View style={styles.mediaButtons}>
          <TouchableOpacity style={styles.mediaBtn} onPress={openCamera} activeOpacity={0.8}>
            <IconCamera size={22} color={Colors.textPrimary} strokeWidth={1.75} />
            <Text style={styles.mediaBtnText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mediaBtn, styles.mediaBtnPrimary]} onPress={pickFromLibrary} activeOpacity={0.8}>
            <IconPhoto size={22} color={Colors.white} strokeWidth={1.75} />
            <Text style={[styles.mediaBtnText, { color: Colors.white }]}>Library</Text>
          </TouchableOpacity>
        </View>

        {/* Next */}
        <TouchableOpacity
          style={[styles.nextBtn, !mediaUri && styles.nextBtnDisabled]}
          onPress={() => setStep('details')}
          disabled={!mediaUri}
          activeOpacity={0.8}
        >
          <Text style={styles.nextBtnText}>Next</Text>
          <IconChevronRight size={18} color={Colors.white} strokeWidth={2} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Step: Details ────────────────────────────────────────────────────────────

  if (step === 'details') {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => setStep('media')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <IconArrowLeft size={24} color={Colors.textPrimary} strokeWidth={1.75} />
            </TouchableOpacity>
            <Text style={styles.stepTitle}>Details</Text>
            <TouchableOpacity
              onPress={() => setStep('rating')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.skipText}>Next</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Thumbnail + Caption side by side */}
            <View style={styles.captionRow}>
              {mediaUri && (
                <Image source={{ uri: mediaUri }} style={styles.thumb} resizeMode="cover" />
              )}
              <TextInput
                style={styles.captionInput}
                placeholder="Write a caption… what did you get done? How was the experience?"
                placeholderTextColor={Colors.textMuted}
                multiline
                value={caption}
                onChangeText={setCaption}
                maxLength={500}
              />
            </View>
            <Text style={styles.charCount}>{caption.length}/500</Text>

            {/* Tag provider — REQUIRED */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                Tag Provider <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.sectionSub}>Who did the work?</Text>

              {selectedProvider ? (
                <View style={styles.selectedProvider}>
                  <Image source={{ uri: selectedProvider.avatar }} style={styles.selectedAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.selectedName}>{selectedProvider.name}</Text>
                    <Text style={styles.selectedSpecialty}>{selectedProvider.specialty} · {selectedProvider.location}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedProvider(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <IconX size={18} color={Colors.textMuted} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.providerPickerBtn}
                  onPress={() => setProviderPickerOpen(true)}
                  activeOpacity={0.8}
                >
                  <IconSearch size={16} color={Colors.textMuted} strokeWidth={1.75} />
                  <Text style={styles.providerPickerBtnText}>Search your providers...</Text>
                  <IconChevronRight size={16} color={Colors.textMuted} strokeWidth={1.75} />
                </TouchableOpacity>
              )}
            </View>

            {/* Service tags */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Tags</Text>
              <Text style={styles.sectionSub}>Services you got, techniques used, etc.</Text>

              <View style={styles.tagInputRow}>
                <TextInput
                  style={styles.tagInput}
                  placeholder="e.g. Braids, Color, Fade..."
                  placeholderTextColor={Colors.textMuted}
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={addTag}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={[styles.tagAddBtn, !tagInput.trim() && styles.tagAddBtnDisabled]}
                  onPress={addTag}
                  disabled={!tagInput.trim()}
                  activeOpacity={0.8}
                >
                  <Text style={styles.tagAddBtnText}>Add</Text>
                </TouchableOpacity>
              </View>

              {tags.length > 0 && (
                <View style={styles.tagsList}>
                  {tags.map(t => (
                    <View key={t} style={styles.tagChip}>
                      <Text style={styles.tagChipText}>#{t}</Text>
                      <TouchableOpacity onPress={() => removeTag(t)} hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}>
                        <IconX size={12} color={Colors.textSecondary} strokeWidth={2.5} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={{ height: 120 }} />
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Provider picker modal */}
        {providerPickerOpen && (
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerSheet}>
              <View style={styles.pickerHandle} />
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Tag a Provider</Text>
                <TouchableOpacity onPress={() => { setProviderPickerOpen(false); setProviderSearch(''); }}>
                  <IconX size={20} color={Colors.textMuted} strokeWidth={2} />
                </TouchableOpacity>
              </View>
              <View style={styles.pickerSearchRow}>
                <IconSearch size={16} color={Colors.textMuted} strokeWidth={1.75} />
                <TextInput
                  style={styles.pickerSearch}
                  placeholder="Search providers..."
                  placeholderTextColor={Colors.textMuted}
                  value={providerSearch}
                  onChangeText={setProviderSearch}
                  autoFocus
                />
              </View>
              <FlatList
                data={filteredProviders}
                keyExtractor={p => p.id}
                style={{ maxHeight: 320 }}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pickerRow}
                    onPress={() => {
                      setSelectedProvider(item);
                      setProviderPickerOpen(false);
                      setProviderSearch('');
                    }}
                    activeOpacity={0.7}
                  >
                    <Image source={{ uri: item.avatar }} style={styles.pickerAvatar} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.pickerName}>{item.name}</Text>
                      <Text style={styles.pickerSub}>{item.specialty} · {item.location}</Text>
                    </View>
                    {selectedProvider?.id === item.id && (
                      <IconCheck size={18} color={Colors.primary} strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.pickerEmpty}>No providers found</Text>
                }
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // ── Step: Rating ─────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setStep('details')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <IconArrowLeft size={24} color={Colors.textPrimary} strokeWidth={1.75} />
        </TouchableOpacity>
        <Text style={styles.stepTitle}>Rate the Experience</Text>
        <TouchableOpacity onPress={handlePost} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.ratingContent}>
        {/* Preview card */}
        {selectedProvider && (
          <View style={styles.ratingProviderCard}>
            <Image source={{ uri: selectedProvider.avatar }} style={styles.ratingProviderAvatar} />
            <View>
              <Text style={styles.ratingProviderName}>{selectedProvider.name}</Text>
              <Text style={styles.ratingProviderSub}>{selectedProvider.specialty}</Text>
            </View>
          </View>
        )}

        <Text style={styles.ratingIntro}>
          Your rating helps your friends know what to expect. All categories are optional.
        </Text>

        {/* Rating rows */}
        {RATING_CATEGORIES.map(cat => (
          <View key={cat.key} style={styles.ratingRow}>
            <Text style={styles.ratingLabel}>{cat.label}</Text>
            <StarPicker
              value={ratings[cat.key] ?? 0}
              onChange={v => setRatings(prev => ({ ...prev, [cat.key]: v }))}
            />
          </View>
        ))}

        {/* Overall */}
        {ratedCount > 0 && (
          <View style={styles.overallRow}>
            <Text style={styles.overallLabel}>Overall</Text>
            <Text style={styles.overallScore}>
              {(Object.values(ratings).filter(v => v > 0).reduce((a, b) => a + b, 0) / ratedCount).toFixed(1)}
            </Text>
            <Text style={styles.overallStar}>★</Text>
          </View>
        )}

        <View style={{ height: 40 }} />

        {/* Post button */}
        <TouchableOpacity
          style={[styles.postBtn, posting && styles.postBtnDisabled]}
          onPress={handlePost}
          disabled={posting}
          activeOpacity={0.85}
        >
          {posting ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.postBtnText}>
              {ratedCount > 0 ? 'Post with Rating 👑' : 'Post without Rating'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  stepTitle: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  skipText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.primary },

  // Media step
  previewWrap: { flex: 1, margin: Spacing.base, borderRadius: Radius.xl, overflow: 'hidden', position: 'relative' },
  preview: { width: '100%', height: '100%' },
  clearMedia: {
    position: 'absolute', top: Spacing.sm, right: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 20,
    width: 32, height: 32, alignItems: 'center', justifyContent: 'center',
  },
  placeholder: {
    flex: 1, margin: Spacing.base, borderRadius: Radius.xl,
    backgroundColor: Colors.surfaceAlt, borderWidth: 2,
    borderColor: Colors.border, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
  },
  placeholderEmoji: { fontSize: 52 },
  placeholderText: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },
  placeholderSub: { fontSize: Typography.sizes.sm, color: Colors.textMuted },

  mediaButtons: {
    flexDirection: 'row', gap: Spacing.md,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
  },
  mediaBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, paddingVertical: Spacing.md, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface,
  },
  mediaBtnPrimary: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  mediaBtnText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },

  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.primary, marginHorizontal: Spacing.base,
    marginBottom: Spacing.lg, borderRadius: Radius.lg, paddingVertical: Spacing.md,
  },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.white },

  // Details step
  captionRow: {
    flexDirection: 'row', gap: Spacing.md,
    padding: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  thumb: { width: 80, height: 80, borderRadius: Radius.lg, backgroundColor: Colors.surfaceAlt },
  captionInput: {
    flex: 1, fontSize: Typography.sizes.base, color: Colors.textPrimary,
    lineHeight: 22, maxHeight: 120,
  },
  charCount: {
    fontSize: Typography.sizes.xs, color: Colors.textMuted,
    textAlign: 'right', paddingRight: Spacing.base, paddingBottom: Spacing.sm,
  },

  section: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  sectionLabel: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary, marginBottom: 2 },
  sectionSub: { fontSize: Typography.sizes.sm, color: Colors.textMuted, marginBottom: Spacing.md },
  required: { color: Colors.error },

  // Provider picker button
  providerPickerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
  },
  providerPickerBtnText: { flex: 1, fontSize: Typography.sizes.base, color: Colors.textMuted },

  // Selected provider
  selectedProvider: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.primary, borderRadius: Radius.lg,
    padding: Spacing.md, backgroundColor: Colors.surface,
  },
  selectedAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surfaceAlt },
  selectedName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  selectedSpecialty: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },

  // Tags
  tagInputRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  tagInput: {
    flex: 1, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    fontSize: Typography.sizes.base, color: Colors.textPrimary, backgroundColor: Colors.surface,
  },
  tagAddBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
  },
  tagAddBtnDisabled: { opacity: 0.4 },
  tagAddBtnText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.white },
  tagsList: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.md },
  tagChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, paddingVertical: 5,
    backgroundColor: Colors.surfaceAlt,
  },
  tagChipText: { fontSize: Typography.sizes.sm, color: Colors.textPrimary },

  // Provider picker overlay
  pickerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: Spacing.base, paddingTop: Spacing.sm, paddingBottom: Spacing.xl,
    maxHeight: '70%',
  },
  pickerHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: Spacing.md,
  },
  pickerHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  pickerTitle: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  pickerSearchRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface, marginBottom: Spacing.sm,
  },
  pickerSearch: { flex: 1, fontSize: Typography.sizes.base, color: Colors.textPrimary },
  pickerRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  pickerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surfaceAlt },
  pickerName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  pickerSub: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  pickerEmpty: { textAlign: 'center', color: Colors.textMuted, padding: Spacing.xl, fontSize: Typography.sizes.sm },

  // Rating step
  ratingContent: { paddingHorizontal: Spacing.base, paddingTop: Spacing.md },
  ratingProviderCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surfaceAlt, borderRadius: Radius.xl,
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  ratingProviderAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.surface },
  ratingProviderName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  ratingProviderSub: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  ratingIntro: { fontSize: Typography.sizes.sm, color: Colors.textMuted, lineHeight: 20, marginBottom: Spacing.lg },

  ratingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  ratingLabel: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },

  overallRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
    gap: Spacing.sm, paddingTop: Spacing.md,
  },
  overallLabel: { fontSize: Typography.sizes.sm, color: Colors.textMuted, flex: 1 },
  overallScore: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.extrabold, color: Colors.textPrimary },
  overallStar: { fontSize: Typography.sizes.xl, color: Colors.star },

  postBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.lg,
    paddingVertical: Spacing.md, alignItems: 'center',
    marginHorizontal: 0,
  },
  postBtnDisabled: { opacity: 0.6 },
  postBtnText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.white },
});
