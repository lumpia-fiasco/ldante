import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { ScreenHeader, Avatar } from '../../components/common';
import { RootStackParamList } from '../../navigation';
import {
  IconArrowLeft, IconCamera, IconCheck,
} from '@tabler/icons-react-native';
import * as ImagePicker from 'expo-image-picker';

type Nav = StackNavigationProp<RootStackParamList>;

// Pre-populated with mock user data — in production these would come from the
// auth/user context or a Supabase query.
const INITIAL_USER = {
  full_name: 'Alex Johnson',
  email: 'alex@example.com',
  phone: '(310) 555-0147',
  location: 'Chicago, IL',
  bio: '',
};

export function ProfileEditScreen() {
  const navigation = useNavigation<Nav>();

  const [fullName, setFullName] = useState(INITIAL_USER.full_name);
  const [email, setEmail] = useState(INITIAL_USER.email);
  const [phone, setPhone] = useState(INITIAL_USER.phone);
  const [location, setLocation] = useState(INITIAL_USER.location);
  const [bio, setBio] = useState(INITIAL_USER.bio);
  const [saving, setSaving] = useState(false);

  const hasChanges =
    fullName !== INITIAL_USER.full_name ||
    email !== INITIAL_USER.email ||
    phone !== INITIAL_USER.phone ||
    location !== INITIAL_USER.location ||
    bio !== INITIAL_USER.bio;

  async function handlePickPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Allow photo access in Settings to change your profile photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      // In production: upload result.assets[0].uri to Supabase Storage
      Alert.alert('Photo selected', 'Profile photo upload would happen here in production.');
    }
  }

  async function handleSave() {
    if (!fullName.trim()) {
      Alert.alert('Required', 'Your name cannot be empty.');
      return;
    }
    setSaving(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    Alert.alert('Saved!', 'Your profile has been updated.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Edit Profile"
        leftIcon={<IconArrowLeft size={24} color={Colors.textPrimary} strokeWidth={1.75} />}
        onLeftPress={() => {
          if (hasChanges) {
            Alert.alert(
              'Discard changes?',
              'You have unsaved changes. Are you sure you want to go back?',
              [
                { text: 'Keep editing', style: 'cancel' },
                { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
              ]
            );
          } else {
            navigation.goBack();
          }
        }}
        rightIcon={
          saving
            ? <ActivityIndicator size="small" color={Colors.primary} />
            : hasChanges
              ? <IconCheck size={24} color={Colors.primary} strokeWidth={2} />
              : undefined
        }
        onRightPress={hasChanges && !saving ? handleSave : undefined}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Avatar picker */}
        <View style={styles.avatarSection}>
          <View>
            <Avatar name={fullName || 'A'} size={90} />
            <TouchableOpacity style={styles.cameraBtn} onPress={handlePickPhoto} activeOpacity={0.8}>
              <IconCamera size={16} color={Colors.white} strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarHint}>Tap the camera icon to change your photo</Text>
        </View>

        {/* Fields */}
        <View style={styles.fields}>
          <FieldGroup label="Full Name">
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your full name"
              placeholderTextColor={Colors.textMuted}
              returnKeyType="next"
              autoCapitalize="words"
            />
          </FieldGroup>

          <FieldGroup label="Email" hint="Used for login and notifications">
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </FieldGroup>

          <FieldGroup label="Phone Number">
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="(555) 000-0000"
              placeholderTextColor={Colors.textMuted}
              keyboardType="phone-pad"
              returnKeyType="next"
            />
          </FieldGroup>

          <FieldGroup label="Location" hint="City or neighborhood shown to providers">
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="City, State"
              placeholderTextColor={Colors.textMuted}
              returnKeyType="next"
            />
          </FieldGroup>

          <FieldGroup label="Bio" hint="Optional — tell providers a bit about yourself">
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="E.g. I love trying new styles and supporting local businesses..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </FieldGroup>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, (!hasChanges || saving) && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!hasChanges || saving}
          activeOpacity={0.85}
        >
          {saving
            ? <ActivityIndicator size="small" color={Colors.white} />
            : <Text style={styles.saveBtnText}>Save Changes</Text>
          }
        </TouchableOpacity>

        <View style={{ height: Spacing['3xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function FieldGroup({ label, hint, children }: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {hint && <Text style={styles.fieldHint}>{hint}</Text>}
      <View style={styles.fieldCard}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, gap: Spacing.xl },

  avatarSection: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.md },
  cameraBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.background,
  },
  avatarHint: { fontSize: Typography.sizes.xs, color: Colors.textMuted },

  fields: { gap: Spacing.lg },
  fieldGroup: { gap: 4 },
  fieldLabel: {
    fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary, paddingLeft: Spacing.xs,
  },
  fieldHint: {
    fontSize: Typography.sizes.xs, color: Colors.textMuted, paddingLeft: Spacing.xs,
  },
  fieldCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border, marginTop: 4,
  },
  input: {
    padding: Spacing.base, fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
  },
  bioInput: { minHeight: 100 },

  saveBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.xl,
    paddingVertical: Spacing.md, alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.white },
});
