import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing } from '../../theme';
import { Button, Input, ScreenHeader, Chip } from '../../components/common';
import { SPECIALTY_TAGS } from '../../constants';
import { IconArrowLeft } from '@tabler/icons-react-native';

type Nav = { goBack: () => void };

export function ProviderProfileEditScreen() {
  const navigation = useNavigation<Nav>();
  const [bio, setBio] = useState('Color specialist with 8+ years of experience. Known for transformative balayage, vibrant hues, and precision cuts.');
  const [yearsExp, setYearsExp] = useState('8');
  const [instagram, setInstagram] = useState('jessicahair');
  const [website, setWebsite] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState(['Balayage', 'Color Specialist', 'Highlights']);
  const [saving, setSaving] = useState(false);

  function toggleSpecialty(tag: string) {
    setSelectedSpecialties((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    Alert.alert('Profile Updated', 'Your profile changes have been saved.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Edit Profile"
        leftIcon={<IconArrowLeft size={24} color={Colors.textPrimary} strokeWidth={1.75} />}
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Input
          label="Bio"
          placeholder="Tell clients about yourself..."
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          maxLength={500}
          hint={`${bio.length}/500 characters`}
        />
        <Input
          label="Years of Experience"
          value={yearsExp}
          onChangeText={setYearsExp}
          keyboardType="number-pad"
        />
        <Input
          label="Instagram Handle"
          placeholder="@yourusername"
          value={instagram}
          onChangeText={setInstagram}
          autoCapitalize="none"
        />
        <Input
          label="Website (Optional)"
          placeholder="https://yourwebsite.com"
          value={website}
          onChangeText={setWebsite}
          keyboardType="url"
          autoCapitalize="none"
        />

        <View style={styles.specialties}>
          <Text style={styles.sectionLabel}>Specialty Tags</Text>
          <Text style={styles.sectionHint}>Select all that apply</Text>
          <View style={styles.tags}>
            {SPECIALTY_TAGS.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                selected={selectedSpecialties.includes(tag)}
                onPress={() => toggleSpecialty(tag)}
              />
            ))}
          </View>
        </View>

        <Button label="Save Changes" onPress={handleSave} loading={saving} size="lg" />
        <View style={{ height: Spacing['2xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, gap: Spacing.xl, paddingBottom: Spacing['3xl'] },
  specialties: { gap: Spacing.sm },
  sectionLabel: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  sectionHint: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
});
