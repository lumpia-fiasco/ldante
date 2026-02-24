import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { RootStackParamList } from '../../navigation';
import {
  IconBell, IconMenu2, IconHeart, IconHeartFilled,
  IconX, IconPhone, IconAddressBook, IconUserPlus, IconPlus,
  IconUser, IconSettings, IconHelp, IconLogout, IconChevronRight,
  IconMapPin,
} from '@tabler/icons-react-native';
import { CrowndLogo } from '../../components/brand/CrowndLogo';
import * as SMS from 'expo-sms';
import * as Contacts from 'expo-contacts';
import { getPosts, subscribe, toggleLike as storeToggleLike, FeedPost } from '../../utils/postsStore';

type Nav = StackNavigationProp<RootStackParamList>;

// ─── Mock Friends ──────────────────────────────────────────────────────────────

const MOCK_FRIENDS = [
  { id: 'f1', name: 'Sarah Kim',      avatar: 'https://randomuser.me/api/portraits/women/55.jpg', providerCount: 4, mutualCount: 2, providerEmojis: ['💇‍♀️', '💅', '🧖‍♀️', '💄'] },
  { id: 'f2', name: 'Emily Rodriguez',avatar: 'https://randomuser.me/api/portraits/women/33.jpg', providerCount: 2, mutualCount: 1, providerEmojis: ['💪', '💈'] },
  { id: 'f3', name: 'Lisa Morgan',    avatar: 'https://randomuser.me/api/portraits/women/12.jpg', providerCount: 3, mutualCount: 3, providerEmojis: ['🧖‍♀️', '💅', '💇‍♀️'] },
  { id: 'f4', name: 'Amanda Chen',    avatar: 'https://randomuser.me/api/portraits/women/28.jpg', providerCount: 1, mutualCount: 0, providerEmojis: ['💆'] },
  { id: 'f5', name: 'Martina Garcia', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', providerCount: 5, mutualCount: 1, providerEmojis: ['💇‍♀️', '💈', '💅', '💪', '🐉'] },
];

// ─── Mock "CROWND users" lookup by phone ───────────────────────────────────────
// Simulates a server-side check: if someone's phone is in the system,
// return their profile so the user can add them directly.

type CrowndUser = { id: string; name: string; avatar: string; type: 'friend' | 'provider'; specialty?: string; location?: string };

const CROWND_USERS_BY_PHONE: Record<string, CrowndUser> = {
  '5550001111': { id: 'f6', name: 'Priya Nair',   avatar: 'https://randomuser.me/api/portraits/women/61.jpg', type: 'friend' },
  '5550002222': { id: 'f7', name: 'Tanya Brooks',  avatar: 'https://randomuser.me/api/portraits/women/72.jpg', type: 'friend' },
  '5550003333': { id: 'p1', name: 'Carmela',       avatar: 'https://randomuser.me/api/portraits/women/68.jpg', type: 'provider', specialty: 'Hair Braider',  location: 'Costa Mesa, CA' },
  '5550004444': { id: 'p2', name: 'Devon',          avatar: 'https://randomuser.me/api/portraits/men/42.jpg',   type: 'provider', specialty: 'Barber',         location: 'Santa Ana, CA' },
  '5550005555': { id: 'p3', name: 'Jasmine',        avatar: 'https://randomuser.me/api/portraits/women/22.jpg', type: 'provider', specialty: 'Nail Artist',    location: 'Irvine, CA' },
  '5550006666': { id: 'p5', name: 'Aisha',          avatar: 'https://randomuser.me/api/portraits/women/91.jpg', type: 'provider', specialty: 'Esthetician',    location: 'Long Beach, CA' },
};

// ─── Mock providers (the user's followed / "Rolodex" providers) ────────────────

const MOCK_PROVIDERS = [
  { id: 'p1', name: 'Carmela',  specialty: 'Hair Braider',      location: 'Costa Mesa, CA', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', category: 'hair',      score: 4.9, ratings: 52 },
  { id: 'p2', name: 'Devon',    specialty: 'Barber',            location: 'Santa Ana, CA',  avatar: 'https://randomuser.me/api/portraits/men/42.jpg',   category: 'barber',    score: 4.8, ratings: 60 },
  { id: 'p3', name: 'Jasmine',  specialty: 'Nail Artist',       location: 'Irvine, CA',     avatar: 'https://randomuser.me/api/portraits/women/22.jpg', category: 'nails',     score: 4.7, ratings: 29 },
  { id: 'p4', name: 'Marcus',   specialty: 'Massage Therapist', location: 'Anaheim, CA',    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',   category: 'massage',   score: 4.8, ratings: 38 },
  { id: 'p5', name: 'Aisha',    specialty: 'Esthetician',       location: 'Long Beach, CA', avatar: 'https://randomuser.me/api/portraits/women/91.jpg', category: 'esthetics', score: 4.6, ratings: 22 },
  { id: 'p6', name: 'Tyler',    specialty: 'Personal Trainer',  location: 'Torrance, CA',   avatar: 'https://randomuser.me/api/portraits/men/33.jpg',   category: 'fitness',   score: 4.9, ratings: 41 },
  { id: 'p7', name: 'Brianna',  specialty: 'Makeup Artist',     location: 'Compton, CA',    avatar: 'https://randomuser.me/api/portraits/women/17.jpg', category: 'makeup',    score: 4.7, ratings: 34 },
];

// Feed posts are now managed by src/utils/postsStore.ts
// The store is seeded with the same mock data and updated when new posts are created.

const SERVICE_CATEGORIES = [
  { key: 'hair',      label: 'Hair',      emoji: '💇‍♀️' },
  { key: 'barber',    label: 'Barber',    emoji: '💈' },
  { key: 'fitness',   label: 'Fitness',   emoji: '💪' },
  { key: 'massage',   label: 'Massage',   emoji: '💆' },
  { key: 'esthetics', label: 'Esthetics', emoji: '🧖‍♀️' },
  { key: 'nails',     label: 'Nails',     emoji: '💅' },
  { key: 'lashes',    label: 'Lashes',    emoji: '👁' },
  { key: 'makeup',    label: 'Makeup',    emoji: '💄' },
  { key: 'tattoo',    label: 'Tattoo',    emoji: '🐉' },
];

const TABS = ['Feed', 'Friends', 'Go-tos'];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, '');
}

// ─── Screen ────────────────────────────────────────────────────────────────────

export function DiscoverScreen() {
  const navigation = useNavigation<Nav>();
  const isFocused = useIsFocused();
  const [activeTab, setActiveTab] = useState('Feed');
  // Posts come from the shared store so new posts from CreatePostScreen appear here
  const [posts, setPosts] = useState<FeedPost[]>(() => getPosts());
  const [addFriendVisible, setAddFriendVisible] = useState(false);
  const [addServiceVisible, setAddServiceVisible] = useState(false);
  const [hamburgerVisible, setHamburgerVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Subscribe to store updates so new posts appear immediately after creation
  useEffect(() => {
    const unsubscribe = subscribe(() => setPosts(getPosts()));
    return unsubscribe;
  }, []);

  // Also refresh when navigating back to this screen
  useEffect(() => {
    if (isFocused) setPosts(getPosts());
  }, [isFocused]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate network fetch — in production this would re-query Supabase
    setTimeout(() => {
      setPosts(getPosts());
      setRefreshing(false);
    }, 900);
  }, []);

  function toggleLike(id: string) {
    storeToggleLike(id);
    // Store notifies listener above, but call setPosts immediately for snappy UI
    setPosts(getPosts());
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <CrowndLogo size={36} />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('Notifications')}>
            <IconBell size={24} color={Colors.textPrimary} strokeWidth={1.75} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setHamburgerVisible(true)}>
            <IconMenu2 size={24} color={Colors.textPrimary} strokeWidth={1.75} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'Feed' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.feed}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        >
          <Text style={styles.feedLabel}>POSTS FROM YOUR FRIENDS & GO-TOS</Text>
          {posts.map(post => (
            <FeedPostCard
              key={post.id}
              post={post}
              onFriendPress={() => navigation.navigate('FriendProfile', { friendId: post.customer.id })}
              onProviderPress={() => navigation.navigate('ProviderProfile', { providerId: post.provider.id })}
              onLike={() => toggleLike(post.id)}
            />
          ))}
          <View style={{ height: 110 }} />
        </ScrollView>
      )}

      {activeTab === 'Friends' && (
        <FriendsTab
          navigation={navigation}
          onAddFriend={() => setAddFriendVisible(true)}
        />
      )}

      {activeTab === 'Go-tos' && (
        <ServicesTab
          navigation={navigation}
          onAddService={() => setAddServiceVisible(true)}
        />
      )}

      {/* Add Friend Modal */}
      <AddFriendModal
        visible={addFriendVisible}
        onClose={() => setAddFriendVisible(false)}
        navigation={navigation}
      />

      {/* Add Service Modal */}
      <AddServiceModal
        visible={addServiceVisible}
        onClose={() => setAddServiceVisible(false)}
        navigation={navigation}
      />

      {/* Hamburger Menu Drawer */}
      <HamburgerMenu
        visible={hamburgerVisible}
        onClose={() => setHamburgerVisible(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}

// ─── Hamburger Menu ────────────────────────────────────────────────────────────

function HamburgerMenu({ visible, onClose, navigation }: {
  visible: boolean;
  onClose: () => void;
  navigation: Nav;
}) {
  function handleNavigate(screen: keyof RootStackParamList) {
    onClose();
    // Small delay so the modal has time to close before navigating
    setTimeout(() => navigation.navigate(screen as any), 200);
  }

  function handleLogout() {
    onClose();
    setTimeout(() => {
      Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const { authService } = require('../../services/supabase');
            await authService.signOut();
          },
        },
      ]);
    }, 200);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <View style={hamburgerStyles.overlay}>
        <TouchableOpacity style={hamburgerStyles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={hamburgerStyles.drawer}>
          {/* Handle */}
          <View style={hamburgerStyles.handle} />

          {/* Branding */}
          <View style={hamburgerStyles.brand}>
            <CrowndLogo size={32} />
            <Text style={hamburgerStyles.brandName}>CROWND</Text>
          </View>

          {/* Menu Items */}
          <View style={hamburgerStyles.menu}>
            <HamburgerItem
              icon={<IconUser size={22} color={Colors.textPrimary} strokeWidth={1.75} />}
              label="My Profile"
              sublabel="View and edit your profile"
              onPress={() => handleNavigate('Profile')}
            />
            <View style={hamburgerStyles.divider} />
            <HamburgerItem
              icon={<IconSettings size={22} color={Colors.textPrimary} strokeWidth={1.75} />}
              label="Settings"
              sublabel="App preferences & privacy"
              onPress={() => handleNavigate('Settings')}
            />
            <View style={hamburgerStyles.divider} />
            <HamburgerItem
              icon={<IconHelp size={22} color={Colors.textPrimary} strokeWidth={1.75} />}
              label="Help & Support"
              sublabel="FAQs, contact, and feedback"
              onPress={() => handleNavigate('HelpSupport')}
            />
          </View>

          {/* Logout */}
          <TouchableOpacity style={hamburgerStyles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
            <IconLogout size={20} color={Colors.error} strokeWidth={1.75} />
            <Text style={hamburgerStyles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          <View style={{ height: Spacing.xl }} />
        </View>
      </View>
    </Modal>
  );
}

function HamburgerItem({ icon, label, sublabel, onPress }: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={hamburgerStyles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={hamburgerStyles.itemIcon}>{icon}</View>
      <View style={hamburgerStyles.itemText}>
        <Text style={hamburgerStyles.itemLabel}>{label}</Text>
        <Text style={hamburgerStyles.itemSublabel}>{sublabel}</Text>
      </View>
      <IconChevronRight size={18} color={Colors.textMuted} strokeWidth={1.75} />
    </TouchableOpacity>
  );
}

const hamburgerStyles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  drawer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  brand: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.xs, marginBottom: Spacing.xl,
  },
  brandName: {
    fontSize: Typography.sizes.xl, fontWeight: Typography.weights.extrabold,
    color: Colors.textPrimary, letterSpacing: 1,
  },
  menu: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 60 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.base,
  },
  itemIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  itemText: { flex: 1 },
  itemLabel: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },
  itemSublabel: { fontSize: Typography.sizes.xs, color: Colors.textSecondary, marginTop: 2 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.base, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.error + '40',
    backgroundColor: Colors.error + '0A',
  },
  logoutText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.error },
});

// ─── Add Friend Modal ──────────────────────────────────────────────────────────

function AddFriendModal({ visible, onClose, navigation }: {
  visible: boolean;
  onClose: () => void;
  navigation: Nav;
}) {
  const [phone, setPhone] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<CrowndUser | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [added, setAdded] = useState(false);

  function reset() {
    setPhone('');
    setFoundUser(null);
    setNotFound(false);
    setAdded(false);
    setSearching(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleLookup() {
    const digits = normalizePhone(phone);
    if (digits.length < 10) {
      Alert.alert('Invalid number', 'Please enter a 10-digit phone number.');
      return;
    }
    setSearching(true);
    setFoundUser(null);
    setNotFound(false);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    const user = CROWND_USERS_BY_PHONE[digits] ?? null;
    setSearching(false);
    if (user) {
      setFoundUser(user);
    } else {
      setNotFound(true);
    }
  }

  async function handleSendInvite() {
    const digits = normalizePhone(phone);
    const available = await SMS.isAvailableAsync();
    if (!available) {
      Alert.alert('SMS not available', 'Your device cannot send text messages.');
      return;
    }
    await SMS.sendSMSAsync(
      [digits],
      "Hey! I'm using CROWND to find and share the best local service providers. Join me — download the app at https://getcrownd.app 👑"
    );
  }

  async function handlePickContact() {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Allow contacts access in Settings to pick from your address book.');
      return;
    }
    // On device this opens the native contact picker; for simulator we show the full list
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
    });
    if (data.length === 0) {
      Alert.alert('No contacts', 'No contacts found on your device.');
      return;
    }
    // Show a simple alert-based picker (native contact picker requires expo-contact-picker)
    const choices = data.slice(0, 10).map(c => ({
      text: c.name ?? 'Unknown',
      onPress: () => {
        const num = c.phoneNumbers?.[0]?.number ?? '';
        setPhone(num);
      },
    }));
    choices.push({ text: 'Cancel', onPress: () => {} });
    Alert.alert('Pick a contact', 'Select who you want to add', choices);
  }

  function handleAddProfile() {
    if (!foundUser) return;
    setAdded(true);
    // In production this would call an API; here we just confirm
  }

  function handleViewProfile() {
    if (!foundUser) return;
    handleClose();
    if (foundUser.type === 'friend') {
      navigation.navigate('FriendProfile', { friendId: foundUser.id });
    } else {
      navigation.navigate('ProviderProfile', { providerId: foundUser.id });
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <KeyboardAvoidingView
        style={modalStyles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={modalStyles.backdrop} activeOpacity={1} onPress={handleClose} />
        <View style={modalStyles.sheet}>
          {/* Handle */}
          <View style={modalStyles.handle} />

          {/* Title row */}
          <View style={modalStyles.titleRow}>
            <Text style={modalStyles.title}>Add a Friend</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <IconX size={20} color={Colors.textMuted} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <Text style={modalStyles.subtitle}>
            Enter their phone number to see if they're on CROWND, or send them an invite.
          </Text>

          {/* Phone input */}
          <View style={modalStyles.inputRow}>
            <IconPhone size={18} color={Colors.textMuted} strokeWidth={1.75} />
            <TextInput
              style={modalStyles.input}
              placeholder="Phone number"
              placeholderTextColor={Colors.textMuted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={t => { setPhone(t); setFoundUser(null); setNotFound(false); setAdded(false); }}
              maxLength={14}
            />
            {phone.length > 0 && (
              <TouchableOpacity onPress={() => { setPhone(''); setFoundUser(null); setNotFound(false); }}>
                <IconX size={16} color={Colors.textMuted} strokeWidth={2} />
              </TouchableOpacity>
            )}
          </View>

          {/* Action buttons */}
          <View style={modalStyles.buttonRow}>
            <TouchableOpacity
              style={[modalStyles.btn, modalStyles.btnPrimary, (!phone || searching) && modalStyles.btnDisabled]}
              onPress={handleLookup}
              disabled={!phone || searching}
              activeOpacity={0.8}
            >
              {searching
                ? <ActivityIndicator size="small" color={Colors.white} />
                : <Text style={modalStyles.btnTextPrimary}>Search CROWND</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={[modalStyles.btn, modalStyles.btnOutline]}
              onPress={handlePickContact}
              activeOpacity={0.8}
            >
              <IconAddressBook size={16} color={Colors.primary} strokeWidth={1.75} />
              <Text style={modalStyles.btnTextOutline}>From Contacts</Text>
            </TouchableOpacity>
          </View>

          {/* Found a CROWND user */}
          {foundUser && (
            <View style={modalStyles.resultCard}>
              <Image source={{ uri: foundUser.avatar }} style={modalStyles.resultAvatar} />
              <View style={modalStyles.resultInfo}>
                <Text style={modalStyles.resultName}>{foundUser.name}</Text>
                <Text style={modalStyles.resultSub}>
                  {foundUser.type === 'provider'
                    ? `${foundUser.specialty} · ${foundUser.location}`
                    : 'On CROWND'}
                </Text>
              </View>
              <View style={modalStyles.resultActions}>
                {!added ? (
                  <TouchableOpacity style={modalStyles.addBtn} onPress={handleAddProfile} activeOpacity={0.8}>
                    <IconUserPlus size={14} color={Colors.white} strokeWidth={2} />
                    <Text style={modalStyles.addBtnText}>Add</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={modalStyles.addedText}>✓ Added</Text>
                )}
                <TouchableOpacity onPress={handleViewProfile} activeOpacity={0.7}>
                  <Text style={modalStyles.viewBtn}>View →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Not on CROWND — offer to send invite */}
          {notFound && (
            <View style={modalStyles.notFoundBox}>
              <Text style={modalStyles.notFoundText}>
                This number isn't on CROWND yet.
              </Text>
              <TouchableOpacity
                style={[modalStyles.btn, modalStyles.btnPrimary, { marginTop: Spacing.sm }]}
                onPress={handleSendInvite}
                activeOpacity={0.8}
              >
                <Text style={modalStyles.btnTextPrimary}>Send Invite via Text 📲</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: Spacing.xl }} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Add Service Modal ─────────────────────────────────────────────────────────

function AddServiceModal({ visible, onClose, navigation }: {
  visible: boolean;
  onClose: () => void;
  navigation: Nav;
}) {
  const [query, setQuery] = useState('');
  const [phone, setPhone] = useState('');
  const [mode, setMode] = useState<'search' | 'phone'>('search');
  const [searching, setSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<CrowndUser | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [added, setAdded] = useState(false);

  function reset() {
    setQuery('');
    setPhone('');
    setFoundUser(null);
    setNotFound(false);
    setAdded(false);
    setSearching(false);
    setMode('search');
  }

  function handleClose() {
    reset();
    onClose();
  }

  // Name search — filter local MOCK_PROVIDERS
  const nameResults = query.trim().length > 1
    ? MOCK_PROVIDERS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.specialty.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Phone lookup
  async function handlePhoneLookup() {
    const digits = normalizePhone(phone);
    if (digits.length < 10) {
      Alert.alert('Invalid number', 'Please enter a 10-digit phone number.');
      return;
    }
    setSearching(true);
    setFoundUser(null);
    setNotFound(false);
    await new Promise(r => setTimeout(r, 800));
    const user = CROWND_USERS_BY_PHONE[digits] ?? null;
    setSearching(false);
    if (user && user.type === 'provider') {
      setFoundUser(user);
    } else if (user && user.type === 'friend') {
      // Found a user but they're a customer, not a provider
      setNotFound(true);
    } else {
      setNotFound(true);
    }
  }

  async function handleSendProviderInvite() {
    const digits = normalizePhone(phone);
    const available = await SMS.isAvailableAsync();
    if (!available) {
      Alert.alert('SMS not available', 'Your device cannot send text messages.');
      return;
    }
    await SMS.sendSMSAsync(
      [digits],
      "Hey! I use CROWND to manage my bookings and connect with clients. You should join — it's free for service providers: https://getcrownd.app 👑"
    );
  }

  async function handlePickContact() {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Allow contacts access in Settings to pick from your address book.');
      return;
    }
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
    });
    if (data.length === 0) {
      Alert.alert('No contacts', 'No contacts found.');
      return;
    }
    const choices = data.slice(0, 10).map(c => ({
      text: c.name ?? 'Unknown',
      onPress: () => {
        const num = c.phoneNumbers?.[0]?.number ?? '';
        setPhone(num);
        setMode('phone');
      },
    }));
    choices.push({ text: 'Cancel', onPress: () => {} });
    Alert.alert('Pick a contact', 'Select a provider to invite', choices);
  }

  function handleAddProvider(providerId: string) {
    setAdded(true);
    Alert.alert('Added!', 'Added to your Go-tos! 👑');
  }

  function handleViewProvider(providerId: string) {
    handleClose();
    navigation.navigate('ProviderProfile', { providerId });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <KeyboardAvoidingView
        style={modalStyles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={modalStyles.backdrop} activeOpacity={1} onPress={handleClose} />
        <View style={modalStyles.sheet}>
          <View style={modalStyles.handle} />

          <View style={modalStyles.titleRow}>
            <Text style={modalStyles.title}>Add a Go-to</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <IconX size={20} color={Colors.textMuted} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <Text style={modalStyles.subtitle}>
            Search by name or look up by phone number to add them to your Go-tos. If they're not on CROWND yet, send them an invite.
          </Text>

          {/* Mode toggle */}
          <View style={modalStyles.modeToggle}>
            <TouchableOpacity
              style={[modalStyles.modeBtn, mode === 'search' && modalStyles.modeBtnActive]}
              onPress={() => setMode('search')}
            >
              <Text style={[modalStyles.modeBtnText, mode === 'search' && modalStyles.modeBtnTextActive]}>
                Search by name
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.modeBtn, mode === 'phone' && modalStyles.modeBtnActive]}
              onPress={() => setMode('phone')}
            >
              <Text style={[modalStyles.modeBtnText, mode === 'phone' && modalStyles.modeBtnTextActive]}>
                By phone
              </Text>
            </TouchableOpacity>
          </View>

          {/* Name search mode */}
          {mode === 'search' && (
            <>
              <View style={modalStyles.inputRow}>
                <Text style={{ fontSize: 16 }}>🔍</Text>
                <TextInput
                  style={modalStyles.input}
                  placeholder="Provider name or specialty..."
                  placeholderTextColor={Colors.textMuted}
                  value={query}
                  onChangeText={setQuery}
                  autoFocus
                />
                {query.length > 0 && (
                  <TouchableOpacity onPress={() => setQuery('')}>
                    <IconX size={16} color={Colors.textMuted} strokeWidth={2} />
                  </TouchableOpacity>
                )}
              </View>

              {nameResults.length > 0 && (
                <View style={modalStyles.nameResults}>
                  {nameResults.map(p => (
                    <View key={p.id} style={modalStyles.resultCard}>
                      <Image source={{ uri: p.avatar }} style={modalStyles.resultAvatar} />
                      <View style={modalStyles.resultInfo}>
                        <Text style={modalStyles.resultName}>{p.name}</Text>
                        <Text style={modalStyles.resultSub}>{p.specialty} · {p.location}</Text>
                      </View>
                      <View style={modalStyles.resultActions}>
                        <TouchableOpacity style={modalStyles.addBtn} onPress={() => handleAddProvider(p.id)} activeOpacity={0.8}>
                          <IconPlus size={14} color={Colors.white} strokeWidth={2} />
                          <Text style={modalStyles.addBtnText}>Add</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleViewProvider(p.id)} activeOpacity={0.7}>
                          <Text style={modalStyles.viewBtn}>View →</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {query.trim().length > 1 && nameResults.length === 0 && (
                <Text style={modalStyles.noResultsText}>No Go-tos found for "{query}"</Text>
              )}

              <TouchableOpacity
                style={[modalStyles.btn, modalStyles.btnOutline, { marginTop: Spacing.md }]}
                onPress={handlePickContact}
                activeOpacity={0.8}
              >
                <IconAddressBook size={16} color={Colors.primary} strokeWidth={1.75} />
                <Text style={modalStyles.btnTextOutline}>Pick from Contacts</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Phone mode */}
          {mode === 'phone' && (
            <>
              <View style={modalStyles.inputRow}>
                <IconPhone size={18} color={Colors.textMuted} strokeWidth={1.75} />
                <TextInput
                  style={modalStyles.input}
                  placeholder="Provider's phone number"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={t => { setPhone(t); setFoundUser(null); setNotFound(false); }}
                  maxLength={14}
                />
                {phone.length > 0 && (
                  <TouchableOpacity onPress={() => { setPhone(''); setFoundUser(null); setNotFound(false); }}>
                    <IconX size={16} color={Colors.textMuted} strokeWidth={2} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={modalStyles.buttonRow}>
                <TouchableOpacity
                  style={[modalStyles.btn, modalStyles.btnPrimary, (!phone || searching) && modalStyles.btnDisabled]}
                  onPress={handlePhoneLookup}
                  disabled={!phone || searching}
                  activeOpacity={0.8}
                >
                  {searching
                    ? <ActivityIndicator size="small" color={Colors.white} />
                    : <Text style={modalStyles.btnTextPrimary}>Search CROWND</Text>
                  }
                </TouchableOpacity>

                <TouchableOpacity
                  style={[modalStyles.btn, modalStyles.btnOutline]}
                  onPress={handlePickContact}
                  activeOpacity={0.8}
                >
                  <IconAddressBook size={16} color={Colors.primary} strokeWidth={1.75} />
                  <Text style={modalStyles.btnTextOutline}>From Contacts</Text>
                </TouchableOpacity>
              </View>

              {foundUser && (
                <View style={modalStyles.resultCard}>
                  <Image source={{ uri: foundUser.avatar }} style={modalStyles.resultAvatar} />
                  <View style={modalStyles.resultInfo}>
                    <Text style={modalStyles.resultName}>{foundUser.name}</Text>
                    <Text style={modalStyles.resultSub}>{foundUser.specialty} · {foundUser.location}</Text>
                  </View>
                  <View style={modalStyles.resultActions}>
                    {!added ? (
                      <TouchableOpacity style={modalStyles.addBtn} onPress={() => handleAddProvider(foundUser.id)} activeOpacity={0.8}>
                        <IconPlus size={14} color={Colors.white} strokeWidth={2} />
                        <Text style={modalStyles.addBtnText}>Add</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={modalStyles.addedText}>✓ Added</Text>
                    )}
                    <TouchableOpacity onPress={() => handleViewProvider(foundUser.id)} activeOpacity={0.7}>
                      <Text style={modalStyles.viewBtn}>View →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {notFound && (
                <View style={modalStyles.notFoundBox}>
                  <Text style={modalStyles.notFoundText}>
                    This Go-to isn't on CROWND yet.
                  </Text>
                  <TouchableOpacity
                    style={[modalStyles.btn, modalStyles.btnPrimary, { marginTop: Spacing.sm }]}
                    onPress={handleSendProviderInvite}
                    activeOpacity={0.8}
                  >
                    <Text style={modalStyles.btnTextPrimary}>Invite them to CROWND 📲</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          <View style={{ height: Spacing.xl }} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Feed Post ─────────────────────────────────────────────────────────────────

function FeedPostCard({ post, onFriendPress, onProviderPress, onLike }: {
  post: FeedPost;
  onFriendPress: () => void;
  onProviderPress: () => void;
  onLike: () => void;
}) {
  return (
    <View style={postStyles.card}>
      {/* Poster row: avatar + name on left, service emoji on right */}
      <TouchableOpacity style={postStyles.header} onPress={onFriendPress} activeOpacity={0.7}>
        <View style={postStyles.headerLeft}>
          <Image source={{ uri: post.customer.avatar }} style={postStyles.customerAvatar} />
          <Text style={postStyles.customerName}>{post.customer.name}</Text>
        </View>
        <TouchableOpacity onPress={onProviderPress} activeOpacity={0.7}>
          <Text style={postStyles.serviceEmoji}>{post.provider.service}</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Full-width photo */}
      <Image source={{ uri: post.photo }} style={postStyles.photo} />

      {/* Tags (left) + Provider mini info (right) */}
      <TouchableOpacity style={postStyles.metaRow} onPress={onProviderPress} activeOpacity={0.7}>
        <View style={postStyles.tagsWrap}>
          {post.tags.map(tag => (
            <View key={tag} style={postStyles.tag}>
              <Text style={postStyles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={postStyles.providerMini}>
          <Image source={{ uri: post.provider.avatar }} style={postStyles.providerAvatar} />
          <View>
            <Text style={postStyles.providerName}>{post.provider.name}</Text>
            <Text style={postStyles.providerLocation}>{post.provider.location}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Review text */}
      <Text style={postStyles.review}>{post.review}</Text>

      {/* Like row */}
      <TouchableOpacity style={postStyles.likeRow} onPress={onLike} activeOpacity={0.7}>
        {post.liked
          ? <IconHeartFilled size={22} color={Colors.like} />
          : <IconHeart size={22} color={Colors.textMuted} strokeWidth={1.75} />
        }
        <Text style={postStyles.likeCount}>{post.likes}</Text>
      </TouchableOpacity>
    </View>
  );
}

const postStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  customerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceAlt },
  customerName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.textPrimary },
  serviceEmoji: { fontSize: 32 },
  photo: { width: '100%', height: 300, backgroundColor: Colors.surfaceAlt },

  // Row below photo: tags left, provider info right
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, flex: 1 },
  tag: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  tagText: { fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  providerMini: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexShrink: 0 },
  providerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceAlt },
  providerName: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  providerLocation: { fontSize: Typography.sizes.xs, color: Colors.textSecondary },

  review: { fontSize: Typography.sizes.base, color: Colors.textSecondary, lineHeight: 24, paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm },
  likeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.base, paddingBottom: Spacing.base },
  likeCount: { fontSize: Typography.sizes.base, color: Colors.textSecondary, fontWeight: Typography.weights.medium },
});

// ─── Friends Tab ───────────────────────────────────────────────────────────────

// Mock location data for friends
const MOCK_FRIEND_LOCATIONS: Record<string, string> = {
  f1: 'Irvine, CA',
  f2: 'Santa Ana, CA',
  f3: 'Long Beach, CA',
  f4: 'Newport Beach, CA',
  f5: 'Compton, CA',
};

function FriendsTab({ navigation, onAddFriend }: { navigation: Nav; onAddFriend: () => void }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      {/* Section header row with Add Friend button */}
      <View style={friendStyles.sectionRow}>
        <Text style={friendStyles.sectionLabel}>YOUR FRIENDS</Text>
        <TouchableOpacity style={friendStyles.addBtn} onPress={onAddFriend} activeOpacity={0.8}>
          <IconUserPlus size={13} color={Colors.primary} strokeWidth={2} />
          <Text style={friendStyles.addBtnText}>Add friend</Text>
        </TouchableOpacity>
      </View>

      {MOCK_FRIENDS.map(friend => (
        <TouchableOpacity
          key={friend.id}
          style={friendStyles.row}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('FriendProfile', { friendId: friend.id })}
        >
          <Image source={{ uri: friend.avatar }} style={friendStyles.avatar} />
          <View style={friendStyles.info}>
            <Text style={friendStyles.name}>{friend.name}</Text>
            <View style={friendStyles.locationRow}>
              <IconMapPin size={12} color={Colors.textMuted} strokeWidth={1.75} />
              <Text style={friendStyles.location}>{MOCK_FRIEND_LOCATIONS[friend.id] ?? 'Nearby'}</Text>
            </View>
            {/* Provider-type emoji badges */}
            <View style={friendStyles.emojis}>
              {friend.providerEmojis.map((emoji, i) => (
                <Text key={i} style={friendStyles.emojiText}>{emoji}</Text>
              ))}
            </View>
          </View>
          <IconChevronRight size={18} color={Colors.textMuted} strokeWidth={1.75} />
        </TouchableOpacity>
      ))}
      <View style={{ height: 110 }} />
    </ScrollView>
  );
}

const friendStyles = StyleSheet.create({
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  sectionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.textPrimary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  addBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    gap: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.surfaceAlt },
  info: { flex: 1 },
  name: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  location: { fontSize: Typography.sizes.sm, color: Colors.textMuted },
  emojis: { flexDirection: 'row', gap: 4, marginTop: 6, flexWrap: 'wrap' },
  emojiText: { fontSize: 22 },
});

// Mock "friends who share this provider" for the Go-tos tab
const PROVIDER_FRIEND_OVERLAP: Record<string, string[]> = {
  p1: ['Sarah', 'Martina'],
  p2: ['Martina'],
  p3: ['Sarah', 'Martina', 'Lisa'],
  p4: ['Sarah', 'Emily', 'Martina'],
  p5: ['Lisa', 'Martina', 'Sarah'],
  p6: ['Emily'],
  p7: ['Amanda', 'Lisa'],
};

function formatFriendOverlap(names: string[]): string {
  if (names.length === 0) return '';
  if (names.length === 1) return `${names[0]} goes here`;
  if (names.length === 2) return `${names[0]} and ${names[1]} go here`;
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]} go here`;
}

// ─── Services Tab (Followed Providers List) ────────────────────────────────────

function ServicesTab({ navigation, onAddService }: { navigation: Nav; onAddService: () => void }) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 110 }}
    >
      {/* Section header row */}
      <View style={friendStyles.sectionRow}>
        <Text style={friendStyles.sectionLabel}>YOUR GO-TOS</Text>
        <TouchableOpacity style={friendStyles.addBtn} onPress={onAddService} activeOpacity={0.8}>
          <IconUserPlus size={13} color={Colors.textPrimary} strokeWidth={2} />
          <Text style={friendStyles.addBtnText}>Add Go-to</Text>
        </TouchableOpacity>
      </View>

      {/* Provider rows matching Friends tab layout */}
      {MOCK_PROVIDERS.map(item => {
        const cat = SERVICE_CATEGORIES.find(c => c.key === item.category);
        const emoji = cat?.emoji ?? '✂️';
        const overlap = PROVIDER_FRIEND_OVERLAP[item.id] ?? [];
        const overlapText = formatFriendOverlap(overlap);

        return (
          <TouchableOpacity
            key={item.id}
            style={servicesStyles.row}
            onPress={() => navigation.navigate('ProviderProfile', { providerId: item.id })}
            activeOpacity={0.7}
          >
            <Image source={{ uri: item.avatar }} style={servicesStyles.avatar} />
            <View style={servicesStyles.info}>
              <Text style={servicesStyles.providerName}>{item.name}</Text>
              <Text style={servicesStyles.providerSpecialty}>{item.specialty}</Text>
              <View style={servicesStyles.locationRow}>
                <IconMapPin size={12} color={Colors.textMuted} strokeWidth={1.75} />
                <Text style={servicesStyles.providerLocation}>{item.location}</Text>
              </View>
              {overlapText ? (
                <Text style={servicesStyles.friendOverlap}>{overlapText}</Text>
              ) : null}
            </View>
            <View style={servicesStyles.rightCol}>
              <Text style={servicesStyles.emoji}>{emoji}</Text>
              <IconChevronRight size={18} color={Colors.textMuted} strokeWidth={1.75} />
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const servicesStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    gap: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.surfaceAlt },
  info: { flex: 1 },
  rightCol: { alignItems: 'center', gap: 6 },
  emoji: { fontSize: 28 },
  providerName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  providerSpecialty: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, marginTop: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  providerLocation: { fontSize: Typography.sizes.sm, color: Colors.textMuted },
  friendOverlap: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

// ─── Modal Styles ──────────────────────────────────────────────────────────────

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    maxHeight: '85%',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.base,
  },
  titleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  title: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  subtitle: {
    fontSize: Typography.sizes.sm, color: Colors.textSecondary,
    lineHeight: 20, marginBottom: Spacing.lg,
  },

  // Mode toggle
  modeToggle: {
    flexDirection: 'row', borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceAlt,
    padding: 3, marginBottom: Spacing.md,
  },
  modeBtn: {
    flex: 1, paddingVertical: Spacing.sm,
    borderRadius: Radius.md, alignItems: 'center',
  },
  modeBtnActive: { backgroundColor: Colors.surface, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
  modeBtnText: { fontSize: Typography.sizes.sm, color: Colors.textMuted, fontWeight: Typography.weights.medium },
  modeBtnTextActive: { color: Colors.textPrimary, fontWeight: Typography.weights.semibold },

  // Input
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  input: {
    flex: 1, fontSize: Typography.sizes.base,
    color: Colors.textPrimary, paddingVertical: Spacing.xs,
  },

  // Buttons
  buttonRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  btn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.xs, paddingVertical: Spacing.md, borderRadius: Radius.lg,
  },
  btnPrimary: { backgroundColor: Colors.primary },
  btnOutline: { borderWidth: 1, borderColor: Colors.primary, backgroundColor: 'transparent' },
  btnDisabled: { opacity: 0.5 },
  btnTextPrimary: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.white },
  btnTextOutline: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.primary },

  // Result card
  nameResults: { marginBottom: Spacing.md, gap: Spacing.sm },
  resultCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  resultAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.surfaceAlt },
  resultInfo: { flex: 1 },
  resultName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.textPrimary },
  resultSub: { fontSize: Typography.sizes.xs, color: Colors.textSecondary, marginTop: 2 },
  resultActions: { alignItems: 'flex-end', gap: Spacing.xs },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, paddingVertical: 5,
  },
  addBtnText: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.semibold, color: Colors.white },
  addedText: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.semibold, color: Colors.primary },
  viewBtn: { fontSize: Typography.sizes.xs, color: Colors.primary, fontWeight: Typography.weights.medium },

  // Not found
  notFoundBox: {
    backgroundColor: Colors.surfaceAlt, borderRadius: Radius.xl,
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  notFoundText: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, textAlign: 'center' },
  noResultsText: { fontSize: Typography.sizes.sm, color: Colors.textMuted, textAlign: 'center', paddingVertical: Spacing.md },
});

// ─── Main Styles ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerRight: { flexDirection: 'row', gap: Spacing.base, alignItems: 'center' },
  headerBtn: { padding: Spacing.xs },
  tabBar: {
    flexDirection: 'row', paddingHorizontal: Spacing.base,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  tab: { marginRight: Spacing.xl, paddingBottom: Spacing.sm, position: 'relative' },
  tabText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.medium, color: Colors.textMuted },
  tabTextActive: { color: Colors.textPrimary, fontWeight: Typography.weights.bold },
  tabUnderline: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 2, backgroundColor: Colors.textPrimary, borderRadius: 1,
  },
  feed: { flex: 1, paddingTop: Spacing.sm },
  feedLabel: {
    fontSize: Typography.sizes.xs, color: Colors.textMuted,
    fontWeight: Typography.weights.semibold,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
    paddingTop: Spacing.sm,
    letterSpacing: 0.8,
  },
});
