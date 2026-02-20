import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Button, ScreenHeader, Badge } from '../../components/common';
import { Service } from '../../types';
import { IconArrowLeft, IconPlus } from '@tabler/icons-react-native';

type Nav = { goBack: () => void };

const INITIAL_SERVICES: Service[] = [
  { id: 's1', provider_id: 'p1', name: 'Full Color', description: 'Single process from roots to ends', duration_minutes: 120, price_cents: 18000, category: 'hair', is_active: true },
  { id: 's2', provider_id: 'p1', name: 'Balayage', description: 'Hand-painted highlights', duration_minutes: 150, price_cents: 25000, category: 'hair', is_active: true },
  { id: 's3', provider_id: 'p1', name: 'Cut & Blowout', description: 'Precision cut with blowout', duration_minutes: 60, price_cents: 8500, category: 'hair', is_active: true },
  { id: 's4', provider_id: 'p1', name: 'Toner', description: 'Color toning treatment', duration_minutes: 45, price_cents: 6500, category: 'hair', is_active: false },
];

export function ManageServicesScreen() {
  const navigation = useNavigation<Nav>();
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newPrice, setNewPrice] = useState('');

  function toggleActive(serviceId: string) {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, is_active: !s.is_active } : s))
    );
  }

  function deleteService(serviceId: string, name: string) {
    Alert.alert(`Remove "${name}"?`, 'This service will no longer be bookable.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => setServices((prev) => prev.filter((s) => s.id !== serviceId)),
      },
    ]);
  }

  function addService() {
    if (!newName || !newDuration || !newPrice) {
      Alert.alert('Fill in all required fields');
      return;
    }
    const newService: Service = {
      id: `s${Date.now()}`,
      provider_id: 'p1',
      name: newName,
      description: newDesc,
      duration_minutes: parseInt(newDuration),
      price_cents: parseFloat(newPrice) * 100,
      category: 'hair',
      is_active: true,
    };
    setServices((prev) => [...prev, newService]);
    setNewName(''); setNewDesc(''); setNewDuration(''); setNewPrice('');
    setShowAddForm(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Manage Services"
        leftIcon={<IconArrowLeft size={24} color={Colors.textPrimary} strokeWidth={1.75} />}
        onLeftPress={() => navigation.goBack()}
        rightIcon={<IconPlus size={24} color={Colors.textPrimary} strokeWidth={1.75} />}
        onRightPress={() => setShowAddForm(true)}
      />

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          showAddForm ? (
            <View style={styles.addForm}>
              <Text style={styles.addFormTitle}>Add New Service</Text>
              <TextInput style={styles.input} placeholder="Service name *" placeholderTextColor={Colors.textMuted} value={newName} onChangeText={setNewName} />
              <TextInput style={styles.input} placeholder="Description" placeholderTextColor={Colors.textMuted} value={newDesc} onChangeText={setNewDesc} />
              <View style={styles.row}>
                <TextInput style={[styles.input, styles.halfInput]} placeholder="Duration (min) *" placeholderTextColor={Colors.textMuted} value={newDuration} onChangeText={setNewDuration} keyboardType="number-pad" />
                <TextInput style={[styles.input, styles.halfInput]} placeholder="Price ($) *" placeholderTextColor={Colors.textMuted} value={newPrice} onChangeText={setNewPrice} keyboardType="decimal-pad" />
              </View>
              <View style={styles.addFormActions}>
                <Button label="Add Service" onPress={addService} size="sm" style={{ flex: 1 }} />
                <Button label="Cancel" onPress={() => setShowAddForm(false)} variant="ghost" size="sm" style={{ flex: 1 }} />
              </View>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={[styles.card, !item.is_active && styles.card_inactive]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardInfo}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.serviceName}>{item.name}</Text>
                  {!item.is_active && <Badge label="Inactive" variant="neutral" />}
                </View>
                {item.description ? (
                  <Text style={styles.serviceDesc}>{item.description}</Text>
                ) : null}
                <View style={styles.serviceMeta}>
                  <Text style={styles.metaText}>⏱ {item.duration_minutes} min</Text>
                  <Text style={styles.metaText}>💰 ${(item.price_cents / 100).toFixed(0)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionBtn, item.is_active && styles.actionBtn_active]}
                onPress={() => toggleActive(item.id)}
              >
                <Text style={styles.actionText}>
                  {item.is_active ? '✓ Active' : 'Inactive'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteService(item.id, item.name)}
              >
                <Text style={styles.deleteText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing.base, gap: Spacing.md, paddingBottom: Spacing['3xl'] },
  addForm: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base,
    borderWidth: 1, borderColor: Colors.primary, gap: Spacing.md, marginBottom: Spacing.md,
  },
  addFormTitle: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  input: {
    backgroundColor: Colors.surfaceAlt, borderRadius: Radius.md, borderWidth: 1,
    borderColor: Colors.border, padding: Spacing.md,
    fontSize: Typography.sizes.base, color: Colors.textPrimary,
  },
  row: { flexDirection: 'row', gap: Spacing.md },
  halfInput: { flex: 1 },
  addFormActions: { flexDirection: 'row', gap: Spacing.md },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base,
    borderWidth: 1, borderColor: Colors.border, gap: Spacing.md,
  },
  card_inactive: { opacity: 0.6 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  cardInfo: { flex: 1, gap: Spacing.xs },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  serviceName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary, flex: 1 },
  serviceDesc: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  serviceMeta: { flexDirection: 'row', gap: Spacing.md },
  metaText: { fontSize: Typography.sizes.sm, color: Colors.textMuted },
  actions: { flexDirection: 'row', gap: Spacing.md },
  actionBtn: {
    flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.md,
    backgroundColor: Colors.surfaceAlt, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  actionBtn_active: { borderColor: Colors.success, backgroundColor: `${Colors.success}15` },
  actionText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.medium, color: Colors.textPrimary },
  deleteBtn: {
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
    borderRadius: Radius.md, backgroundColor: `${Colors.error}15`,
    borderWidth: 1, borderColor: `${Colors.error}40`, alignItems: 'center',
  },
  deleteText: { fontSize: Typography.sizes.sm, color: Colors.error, fontWeight: Typography.weights.medium },
});
