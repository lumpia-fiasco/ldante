import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SectionList,
  TouchableOpacity, Alert, TextInput, ScrollView, Modal,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { Button, ScreenHeader, Badge } from '../../components/common';
import { Service } from '../../types';
import {
  IconArrowLeft, IconPlus, IconX, IconChevronDown, IconChevronRight,
  IconPackage, IconScissors, IconTag,
} from '@tabler/icons-react-native';

type Nav = { goBack: () => void };

// ─── Types ─────────────────────────────────────────────────────────────────────

type ServiceItem = Service & { kind: 'service' };
type PackageItem = {
  kind: 'package';
  id: string;
  provider_id: string;
  name: string;
  description: string;
  included_service_ids: string[];
  price_cents: number;
  is_active: boolean;
  category: string;
};
type ListItem = ServiceItem | PackageItem;

type Category = {
  id: string;
  name: string;
  emoji: string;
  items: ListItem[];
};

// ─── Seed Data ─────────────────────────────────────────────────────────────────

const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-hair',
    name: 'Hair Services',
    emoji: '💇‍♀️',
    items: [
      { kind: 'service', id: 's1', provider_id: 'p1', name: 'Full Color', description: 'Single process from roots to ends', duration_minutes: 120, price_cents: 18000, category: 'cat-hair', is_active: true },
      { kind: 'service', id: 's2', provider_id: 'p1', name: 'Balayage', description: 'Hand-painted highlights', duration_minutes: 150, price_cents: 25000, category: 'cat-hair', is_active: true },
      { kind: 'service', id: 's3', provider_id: 'p1', name: 'Cut & Blowout', description: 'Precision cut with blowout', duration_minutes: 60, price_cents: 8500, category: 'cat-hair', is_active: true },
      { kind: 'service', id: 's4', provider_id: 'p1', name: 'Toner', description: 'Color toning treatment', duration_minutes: 45, price_cents: 6500, category: 'cat-hair', is_active: false },
    ],
  },
  {
    id: 'cat-care',
    name: 'Hair Care',
    emoji: '🧴',
    items: [
      { kind: 'service', id: 's5', provider_id: 'p1', name: 'Deep Conditioning', description: 'Intensive moisture treatment', duration_minutes: 30, price_cents: 4500, category: 'cat-care', is_active: true },
      {
        kind: 'package',
        id: 'pkg1',
        provider_id: 'p1',
        name: 'Glow-Up Bundle',
        description: 'Cut & Blowout + Deep Conditioning + Toner',
        included_service_ids: ['s3', 's5', 's4'],
        price_cents: 17000,
        is_active: true,
        category: 'cat-care',
      },
    ],
  },
];

// ─── Screen ────────────────────────────────────────────────────────────────────

export function ManageServicesScreen() {
  const navigation = useNavigation<Nav>();
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // ── Add category modal state
  const [catModalVisible, setCatModalVisible] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('✂️');

  // ── Add service/package modal state
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [itemCategoryId, setItemCategoryId] = useState('');
  const [itemKind, setItemKind] = useState<'service' | 'package'>('service');
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemDuration, setItemDuration] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  // ── Helpers
  function toggleCollapse(catId: string) {
    setCollapsed(prev => ({ ...prev, [catId]: !prev[catId] }));
  }

  function toggleActive(catId: string, itemId: string) {
    setCategories(prev => prev.map(cat =>
      cat.id === catId
        ? { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, is_active: !item.is_active } : item) }
        : cat
    ));
  }

  function deleteItem(catId: string, itemId: string, itemName: string) {
    Alert.alert(`Remove "${itemName}"?`, 'This will no longer be bookable.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () =>
          setCategories(prev => prev.map(cat =>
            cat.id === catId
              ? { ...cat, items: cat.items.filter(i => i.id !== itemId) }
              : cat
          )),
      },
    ]);
  }

  function deleteCategory(catId: string, catName: string) {
    Alert.alert(`Remove "${catName}"?`, 'All services in this category will also be removed.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => setCategories(prev => prev.filter(c => c.id !== catId)),
      },
    ]);
  }

  // ── Add category
  function addCategory() {
    if (!newCatName.trim()) { Alert.alert('Enter a category name'); return; }
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      emoji: newCatEmoji,
      items: [],
    };
    setCategories(prev => [...prev, newCat]);
    setNewCatName('');
    setNewCatEmoji('✂️');
    setCatModalVisible(false);
  }

  // ── Open add-item modal for a specific category
  function openItemModal(catId: string) {
    setItemCategoryId(catId);
    setItemKind('service');
    setItemName('');
    setItemDesc('');
    setItemDuration('');
    setItemPrice('');
    setItemModalVisible(true);
  }

  // ── Add service or package
  function addItem() {
    if (!itemName.trim() || !itemPrice.trim()) {
      Alert.alert('Fill in name and price at minimum');
      return;
    }
    const id = `item-${Date.now()}`;
    let newItem: ListItem;

    if (itemKind === 'service') {
      if (!itemDuration.trim()) { Alert.alert('Enter a duration'); return; }
      newItem = {
        kind: 'service',
        id,
        provider_id: 'p1',
        name: itemName.trim(),
        description: itemDesc.trim(),
        duration_minutes: parseInt(itemDuration, 10) || 60,
        price_cents: parseFloat(itemPrice) * 100,
        category: itemCategoryId,
        is_active: true,
      };
    } else {
      newItem = {
        kind: 'package',
        id,
        provider_id: 'p1',
        name: itemName.trim(),
        description: itemDesc.trim(),
        included_service_ids: [],
        price_cents: parseFloat(itemPrice) * 100,
        category: itemCategoryId,
        is_active: true,
      };
    }

    setCategories(prev => prev.map(cat =>
      cat.id === itemCategoryId
        ? { ...cat, items: [...cat.items, newItem] }
        : cat
    ));
    setItemModalVisible(false);
  }

  // ── Prepare SectionList data
  const sections = categories.map(cat => ({
    catId: cat.id,
    catName: cat.name,
    catEmoji: cat.emoji,
    data: collapsed[cat.id] ? [] : cat.items,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Services & Packages"
        leftIcon={<IconArrowLeft size={24} color={Colors.textPrimary} strokeWidth={1.75} />}
        onLeftPress={() => navigation.goBack()}
        rightIcon={<IconPlus size={24} color={Colors.textPrimary} strokeWidth={1.75} />}
        onRightPress={() => setCatModalVisible(true)}
      />

      {/* Hint */}
      <Text style={styles.hint}>
        Organize your offerings into categories. Tap <Text style={styles.hintBold}>+</Text> in a category to add services or packages.
      </Text>

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
        // ── Section header: category row
        renderSectionHeader={({ section }) => (
          <View style={styles.catHeader}>
            <TouchableOpacity
              style={styles.catLeft}
              onPress={() => toggleCollapse(section.catId)}
              activeOpacity={0.7}
            >
              <Text style={styles.catEmoji}>{section.catEmoji}</Text>
              <Text style={styles.catName}>{section.catName}</Text>
              {collapsed[section.catId]
                ? <IconChevronRight size={16} color={Colors.textMuted} strokeWidth={2} />
                : <IconChevronDown  size={16} color={Colors.textMuted} strokeWidth={2} />
              }
            </TouchableOpacity>
            <View style={styles.catActions}>
              <TouchableOpacity
                style={styles.catAddBtn}
                onPress={() => openItemModal(section.catId)}
                activeOpacity={0.8}
              >
                <IconPlus size={14} color={Colors.primary} strokeWidth={2} />
                <Text style={styles.catAddText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteCategory(section.catId, section.catName)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <IconX size={14} color={Colors.textMuted} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        // ── Item row: service or package card
        renderItem={({ item, section }) => (
          <ItemCard
            item={item}
            onToggle={() => toggleActive(section.catId, item.id)}
            onDelete={() => deleteItem(section.catId, item.id, item.name)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No categories yet. Tap the + button above to create your first category.
          </Text>
        }
        ListFooterComponent={<View style={{ height: 110 }} />}
      />

      {/* ── Add Category Modal ── */}
      <Modal visible={catModalVisible} animationType="slide" transparent presentationStyle="overFullScreen">
        <KeyboardAvoidingView
          style={modalStyles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity style={modalStyles.backdrop} activeOpacity={1} onPress={() => setCatModalVisible(false)} />
          <View style={modalStyles.sheet}>
            <View style={modalStyles.handle} />
            <View style={modalStyles.titleRow}>
              <Text style={modalStyles.title}>New Category</Text>
              <TouchableOpacity onPress={() => setCatModalVisible(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <IconX size={20} color={Colors.textMuted} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Emoji picker row */}
            <Text style={modalStyles.fieldLabel}>Pick an emoji</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={modalStyles.emojiRow}>
              {['✂️','💇‍♀️','💈','💅','🧴','🧖‍♀️','💪','🏋️','👁','💄','🐉','🌿','🫧','🧼','💆','🌸'].map(e => (
                <TouchableOpacity
                  key={e}
                  style={[modalStyles.emojiBtn, newCatEmoji === e && modalStyles.emojiBtnActive]}
                  onPress={() => setNewCatEmoji(e)}
                >
                  <Text style={modalStyles.emojiChar}>{e}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={modalStyles.fieldLabel}>Category name *</Text>
            <TextInput
              style={modalStyles.input}
              placeholder="e.g. Hair Services, Nail Art, Body Care…"
              placeholderTextColor={Colors.textMuted}
              value={newCatName}
              onChangeText={setNewCatName}
            />

            <View style={modalStyles.actions}>
              <Button label="Create Category" onPress={addCategory} style={{ flex: 1 }} />
              <Button label="Cancel" onPress={() => setCatModalVisible(false)} variant="ghost" style={{ flex: 1 }} />
            </View>
            <View style={{ height: Spacing.xl }} />
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Add Service / Package Modal ── */}
      <Modal visible={itemModalVisible} animationType="slide" transparent presentationStyle="overFullScreen">
        <KeyboardAvoidingView
          style={modalStyles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity style={modalStyles.backdrop} activeOpacity={1} onPress={() => setItemModalVisible(false)} />
          <View style={modalStyles.sheet}>
            <View style={modalStyles.handle} />
            <View style={modalStyles.titleRow}>
              <Text style={modalStyles.title}>Add to Category</Text>
              <TouchableOpacity onPress={() => setItemModalVisible(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <IconX size={20} color={Colors.textMuted} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Kind toggle */}
            <View style={modalStyles.kindToggle}>
              <TouchableOpacity
                style={[modalStyles.kindBtn, itemKind === 'service' && modalStyles.kindBtnActive]}
                onPress={() => setItemKind('service')}
              >
                <IconScissors size={14} color={itemKind === 'service' ? Colors.white : Colors.textSecondary} strokeWidth={2} />
                <Text style={[modalStyles.kindBtnText, itemKind === 'service' && modalStyles.kindBtnTextActive]}>
                  Service
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.kindBtn, itemKind === 'package' && modalStyles.kindBtnActive]}
                onPress={() => setItemKind('package')}
              >
                <IconPackage size={14} color={itemKind === 'package' ? Colors.white : Colors.textSecondary} strokeWidth={2} />
                <Text style={[modalStyles.kindBtnText, itemKind === 'package' && modalStyles.kindBtnTextActive]}>
                  Package
                </Text>
              </TouchableOpacity>
            </View>

            {itemKind === 'package' && (
              <View style={modalStyles.packageNote}>
                <IconTag size={14} color={Colors.secondary} strokeWidth={1.75} />
                <Text style={modalStyles.packageNoteText}>
                  A package bundles multiple services at a special price.
                </Text>
              </View>
            )}

            <TextInput
              style={modalStyles.input}
              placeholder={itemKind === 'service' ? 'Service name *' : 'Package name *'}
              placeholderTextColor={Colors.textMuted}
              value={itemName}
              onChangeText={setItemName}
            />
            <TextInput
              style={[modalStyles.input, modalStyles.inputMulti]}
              placeholder={itemKind === 'service' ? 'Description (optional)' : 'What\'s included? (e.g. Cut + Color + Toner)'}
              placeholderTextColor={Colors.textMuted}
              value={itemDesc}
              onChangeText={setItemDesc}
              multiline
              numberOfLines={2}
            />

            {itemKind === 'service' && (
              <View style={modalStyles.twoCol}>
                <TextInput
                  style={[modalStyles.input, { flex: 1 }]}
                  placeholder="Duration (min) *"
                  placeholderTextColor={Colors.textMuted}
                  value={itemDuration}
                  onChangeText={setItemDuration}
                  keyboardType="number-pad"
                />
                <TextInput
                  style={[modalStyles.input, { flex: 1 }]}
                  placeholder="Price ($) *"
                  placeholderTextColor={Colors.textMuted}
                  value={itemPrice}
                  onChangeText={setItemPrice}
                  keyboardType="decimal-pad"
                />
              </View>
            )}

            {itemKind === 'package' && (
              <TextInput
                style={modalStyles.input}
                placeholder="Package price ($) *"
                placeholderTextColor={Colors.textMuted}
                value={itemPrice}
                onChangeText={setItemPrice}
                keyboardType="decimal-pad"
              />
            )}

            <View style={modalStyles.actions}>
              <Button
                label={itemKind === 'service' ? 'Add Service' : 'Add Package'}
                onPress={addItem}
                style={{ flex: 1 }}
              />
              <Button label="Cancel" onPress={() => setItemModalVisible(false)} variant="ghost" style={{ flex: 1 }} />
            </View>
            <View style={{ height: Spacing.xl }} />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Item Card ─────────────────────────────────────────────────────────────────

function ItemCard({
  item,
  onToggle,
  onDelete,
}: {
  item: ListItem;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const isPackage = item.kind === 'package';
  const price = (item.price_cents / 100).toFixed(0);

  return (
    <View style={[cardStyles.card, !item.is_active && cardStyles.card_inactive]}>
      {/* Kind badge */}
      <View style={cardStyles.topRow}>
        <View style={[cardStyles.kindBadge, isPackage && cardStyles.kindBadgePkg]}>
          {isPackage
            ? <IconPackage size={11} color={Colors.secondary} strokeWidth={2} />
            : <IconScissors size={11} color={Colors.accent} strokeWidth={2} />
          }
          <Text style={[cardStyles.kindBadgeText, isPackage && cardStyles.kindBadgeTextPkg]}>
            {isPackage ? 'Package' : 'Service'}
          </Text>
        </View>
        {!item.is_active && <Badge label="Inactive" variant="neutral" />}
      </View>

      {/* Name + desc */}
      <Text style={cardStyles.name}>{item.name}</Text>
      {item.description ? <Text style={cardStyles.desc}>{item.description}</Text> : null}

      {/* Meta row */}
      <View style={cardStyles.meta}>
        {!isPackage && (
          <Text style={cardStyles.metaText}>⏱ {(item as ServiceItem).duration_minutes} min</Text>
        )}
        <Text style={cardStyles.price}>${price}</Text>
      </View>

      {/* Actions */}
      <View style={cardStyles.actions}>
        <TouchableOpacity
          style={[cardStyles.toggleBtn, item.is_active && cardStyles.toggleBtn_active]}
          onPress={onToggle}
        >
          <Text style={[cardStyles.toggleText, item.is_active && cardStyles.toggleText_active]}>
            {item.is_active ? '✓ Active' : 'Inactive'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={cardStyles.deleteBtn} onPress={onDelete}>
          <Text style={cardStyles.deleteText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  hint: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  hintBold: { fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  list: { paddingHorizontal: Spacing.base, paddingBottom: 110, gap: Spacing.xs },
  emptyText: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: Typography.sizes.sm,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },

  // Category header
  catHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Spacing.lg, paddingBottom: Spacing.sm,
  },
  catLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  catEmoji: { fontSize: 20 },
  catName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary, flex: 1 },
  catActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  catAddBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: Colors.primary, borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, paddingVertical: 4,
  },
  catAddText: { fontSize: Typography.sizes.xs, color: Colors.primary, fontWeight: Typography.weights.semibold },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.border,
    gap: Spacing.sm, marginBottom: Spacing.sm,
  },
  card_inactive: { opacity: 0.55 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  kindBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: `${Colors.accent}18`, borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
  },
  kindBadgePkg: { backgroundColor: `${Colors.secondary}18` },
  kindBadgeText: { fontSize: Typography.sizes.xs, color: Colors.accent, fontWeight: Typography.weights.semibold },
  kindBadgeTextPkg: { color: Colors.secondary },
  name: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  desc: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  metaText: { fontSize: Typography.sizes.sm, color: Colors.textMuted },
  price: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.success },
  actions: { flexDirection: 'row', gap: Spacing.md },
  toggleBtn: {
    flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.md,
    backgroundColor: Colors.surfaceAlt, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  toggleBtn_active: { borderColor: Colors.success, backgroundColor: `${Colors.success}15` },
  toggleText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.medium, color: Colors.textSecondary },
  toggleText_active: { color: Colors.success },
  deleteBtn: {
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
    borderRadius: Radius.md, backgroundColor: `${Colors.error}15`,
    borderWidth: 1, borderColor: `${Colors.error}40`, alignItems: 'center',
  },
  deleteText: { fontSize: Typography.sizes.sm, color: Colors.error, fontWeight: Typography.weights.medium },
});

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: Spacing.base, paddingTop: Spacing.sm,
    maxHeight: '85%',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.border, alignSelf: 'center', marginBottom: Spacing.base,
  },
  titleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  title: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  fieldLabel: { fontSize: Typography.sizes.xs, color: Colors.textMuted, fontWeight: Typography.weights.semibold, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  emojiRow: { flexDirection: 'row', gap: Spacing.sm, paddingBottom: Spacing.md },
  emojiBtn: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.borderLight, backgroundColor: Colors.surfaceAlt,
  },
  emojiBtnActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}15` },
  emojiChar: { fontSize: 22 },
  input: {
    backgroundColor: Colors.surfaceAlt, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, fontSize: Typography.sizes.base, color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  inputMulti: { minHeight: 60, textAlignVertical: 'top' },
  twoCol: { flexDirection: 'row', gap: Spacing.md },

  // Kind toggle (Service | Package)
  kindToggle: {
    flexDirection: 'row', backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg, padding: 3, marginBottom: Spacing.md, gap: 3,
  },
  kindBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing.sm, borderRadius: Radius.md, gap: 6,
  },
  kindBtnActive: { backgroundColor: Colors.primary },
  kindBtnText: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, fontWeight: Typography.weights.medium },
  kindBtnTextActive: { color: Colors.white, fontWeight: Typography.weights.semibold },

  // Package note
  packageNote: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: `${Colors.secondary}15`, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  packageNoteText: { fontSize: Typography.sizes.xs, color: Colors.textSecondary, flex: 1 },

  actions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
});
