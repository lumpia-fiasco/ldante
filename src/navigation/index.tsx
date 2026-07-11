import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, TouchableOpacity, Platform, useColorScheme, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useAuth } from '../context/AuthContext';

import {
  HomeTabIcon,
  CalendarTabIcon,
  SparklesTabIcon,
  PersonTabIcon,
  PlusTabIcon,
} from '../components/brand/TabIcons';

// Auth Screens
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RoleSelectScreen } from '../screens/auth/RoleSelectScreen';

// Onboarding Screens
import { CustomerOnboardingScreen } from '../screens/customer/CustomerOnboardingScreen';
import { ProviderOnboardingScreen } from '../screens/provider/ProviderOnboardingScreen';

// Customer Tabs
import { DiscoverScreen } from '../screens/customer/DiscoverScreen';
import { BookingsScreen } from '../screens/customer/BookingsScreen';
import { NotificationsScreen } from '../screens/shared/NotificationsScreen';
import { JonathanAIScreen } from '../screens/shared/JonathanAIScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';

// Detail Screens
import { ProviderProfileScreen } from '../screens/shared/ProviderProfileScreen';
import { BookingFlowScreen } from '../screens/customer/BookingFlowScreen';
import { LeaveReviewScreen } from '../screens/customer/LeaveReviewScreen';
import { FriendsScreen } from '../screens/customer/FriendsScreen';
import { FriendRolodexScreen } from '../screens/customer/FriendRolodexScreen';
import { FriendProfileScreen } from '../screens/customer/FriendProfileScreen';
import { CreatePostScreen } from '../screens/customer/CreatePostScreen';

// Provider Screens
import { ProviderDashboardScreen } from '../screens/provider/ProviderDashboardScreen';
import { ProviderScheduleScreen } from '../screens/provider/ProviderScheduleScreen';
import { ProviderBookingsScreen } from '../screens/provider/ProviderBookingsScreen';
import { ManageServicesScreen } from '../screens/provider/ManageServicesScreen';
import { ProviderProfileEditScreen } from '../screens/provider/ProviderProfileEditScreen';
import { SettingsScreen } from '../screens/shared/SettingsScreen';
import { HelpSupportScreen } from '../screens/shared/HelpSupportScreen';
import { ProfileEditScreen } from '../screens/shared/ProfileEditScreen';

// ─── Route Types ───────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  Login: undefined;
  RoleSelect: undefined;
  CustomerOnboarding: undefined;
  ProviderOnboarding: undefined;
  CustomerTabs: undefined;
  ProviderTabs: undefined;
  ProviderProfile: { providerId: string; referralFriendId?: string };
  BookingFlow: { providerId: string; serviceId?: string };
  LeaveReview: { bookingId: string };
  Friends: undefined;
  FriendProfile: { friendId: string };
  FriendRolodex: { friendId: string; friendName: string };
  Search: { initialQuery?: string; category?: string };
  Notifications: undefined;
  Profile: undefined;
  ProfileEdit: undefined;
  Settings: undefined;
  HelpSupport: undefined;
  ManageServices: undefined;
  ProviderProfileEdit: undefined;
  CreatePost: { role?: 'customer' | 'provider' } | undefined;
  JonathanAI: undefined;
};

export type CustomerTabParamList = {
  Feed: undefined;
  Bookings: undefined;
  Create: undefined;
  Jonathan: undefined;  // placeholder tab — tapping navigates to JonathanAI stack screen
  MyProfile: undefined;
};

export type ProviderTabParamList = {
  Dashboard: undefined;
  Schedule: undefined;
  Create: undefined;
  Jonathan: undefined;  // placeholder tab — tapping navigates to JonathanAI stack screen
  MyProfile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const CustomerTab = createBottomTabNavigator<CustomerTabParamList>();
const ProviderTab = createBottomTabNavigator<ProviderTabParamList>();

// ─── Full-Bleed Tab Bar ────────────────────────────────────────────────────────
// Anchored to the bottom of the screen, full width, frosted glass background.

function FloatingTabBar({ state, descriptors, navigation, isProviderTab = false }: any) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const ICON_ACTIVE   = isDark ? '#FFFFFF'                : '#654D24';
  const ICON_INACTIVE = isDark ? 'rgba(255,255,255,0.40)' : 'rgba(101,77,36,0.40)';
  const blurTint      = isDark ? 'dark'                   : 'light';

  return (
    <BlurView
      tint={blurTint}
      intensity={80}
      style={[
        navStyles.tabBar,
        {
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          backgroundColor: Platform.OS === 'android'
            ? (isDark ? 'rgba(30,20,10,0.95)' : 'rgba(255,255,255,0.95)')
            : 'transparent',
        },
      ]}
    >
      {/* Top border line */}
      <View style={navStyles.topBorder} />

      <View style={navStyles.iconRow}>
        {state.routes.map((route: any, index: number) => {
          const focused = state.index === index;
          const isCenter = index === 2; // Plus

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // ── Plus / Create button ─────────────────────────────────────────
          if (isCenter) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => navigation.navigate('CreatePost', { role: isProviderTab ? 'provider' : 'customer' })}
                style={navStyles.tabTap}
                activeOpacity={0.8}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <PlusTabIcon size={40} color={ICON_ACTIVE} />
              </TouchableOpacity>
            );
          }

          // ── Jonathan / Sparkles — push full-screen stack (no tab bar) ───
          if (route.name === 'Jonathan') {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => navigation.navigate('JonathanAI')}
                style={navStyles.tabTap}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <SparklesTabIcon size={24} color={ICON_INACTIVE} strokeWidth={1.5} />
              </TouchableOpacity>
            );
          }

          // ── MyProfile — push Profile stack screen ────────────────────────
          if (route.name === 'MyProfile') {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => navigation.navigate('Profile')}
                style={navStyles.tabTap}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <PersonTabIcon size={24} color={ICON_INACTIVE} strokeWidth={1.5} />
              </TouchableOpacity>
            );
          }

          // ── Regular tab ──────────────────────────────────────────────────
          const color = focused ? ICON_ACTIVE : ICON_INACTIVE;
          const strokeWidth = focused ? 2 : 1.5;

          const icons: Record<string, React.ReactNode> = {
            Feed:      <HomeTabIcon     size={24} color={color} strokeWidth={strokeWidth} />,
            Dashboard: <HomeTabIcon     size={24} color={color} strokeWidth={strokeWidth} />,
            Bookings:  <CalendarTabIcon size={24} color={color} strokeWidth={strokeWidth} />,
            Schedule:  <CalendarTabIcon size={24} color={color} strokeWidth={strokeWidth} />,
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={navStyles.tabTap}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {icons[route.name] ?? null}
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
}

// ─── Customer Tabs ─────────────────────────────────────────────────────────────

function CustomerTabs() {
  return (
    <CustomerTab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <CustomerTab.Screen name="Feed"      component={DiscoverScreen} />
      <CustomerTab.Screen name="Bookings"  component={BookingsScreen} />
      <CustomerTab.Screen name="Create"    component={DiscoverScreen} />
      <CustomerTab.Screen name="Jonathan"  component={JonathanAIScreen} />
      <CustomerTab.Screen name="MyProfile" component={ProfileScreen} />
    </CustomerTab.Navigator>
  );
}

// ─── Provider Tabs ─────────────────────────────────────────────────────────────

function ProviderTabs() {
  return (
    <ProviderTab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} isProviderTab={true} />}
      screenOptions={{ headerShown: false }}
    >
      <ProviderTab.Screen name="Dashboard" component={ProviderDashboardScreen} />
      <ProviderTab.Screen name="Schedule"  component={ProviderScheduleScreen} />
      <ProviderTab.Screen name="Create"    component={ProviderDashboardScreen} />
      <ProviderTab.Screen name="Jonathan"  component={JonathanAIScreen} />
      <ProviderTab.Screen name="MyProfile" component={ProfileScreen} />
    </ProviderTab.Navigator>
  );
}

// ─── App Navigator ─────────────────────────────────────────────────────────────

export function AppNavigator() {
  const { session, user, loading } = useAuth();

  // Determine the correct initial route based on session + role
  const initialRoute = (): keyof RootStackParamList => {
    if (!session) return 'Welcome';
    if (!user?.role) return 'RoleSelect';
    return user.role === 'provider' ? 'ProviderTabs' : 'CustomerTabs';
  };

  // Show a blank screen while we restore the session from AsyncStorage
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5EFE6' }}>
        <ActivityIndicator size="large" color="#654D24" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFFFFF' },
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
        initialRouteName={initialRoute()}
      >
        <Stack.Screen name="Welcome"          component={WelcomeScreen} />
        <Stack.Screen name="SignUp"           component={SignUpScreen} />
        <Stack.Screen name="Login"            component={LoginScreen} />
        <Stack.Screen name="RoleSelect"       component={RoleSelectScreen} />
        <Stack.Screen name="CustomerOnboarding" component={CustomerOnboardingScreen} />
        <Stack.Screen name="ProviderOnboarding" component={ProviderOnboardingScreen} />
        <Stack.Screen name="CustomerTabs"     component={CustomerTabs} />
        <Stack.Screen name="ProviderTabs"     component={ProviderTabs} />
        <Stack.Screen name="ProviderProfile"  component={ProviderProfileScreen} />
        <Stack.Screen name="BookingFlow"      component={BookingFlowScreen} />
        <Stack.Screen name="LeaveReview"      component={LeaveReviewScreen} />
        <Stack.Screen name="Friends"          component={FriendsScreen} />
        <Stack.Screen name="FriendProfile"    component={FriendProfileScreen} />
        <Stack.Screen name="FriendRolodex"    component={FriendRolodexScreen} />
        <Stack.Screen name="Notifications"    component={NotificationsScreen} />
        <Stack.Screen name="Profile"          component={ProfileScreen} />
        <Stack.Screen name="ManageServices"   component={ManageServicesScreen} />
        <Stack.Screen name="ProviderProfileEdit" component={ProviderProfileEditScreen} />
        <Stack.Screen name="ProfileEdit"      component={ProfileEditScreen} />
        <Stack.Screen name="Settings"         component={SettingsScreen} />
        <Stack.Screen name="HelpSupport"      component={HelpSupportScreen} />
        {/* Removed routes — redirect to Login so dead links never no-op */}
        <Stack.Screen name="Search"           component={LoginScreen} />
        <Stack.Screen name="CreatePost"       component={CreatePostScreen} options={{ gestureEnabled: false }} />
        {/* Jonathan AI — full-screen stack: no tab bar, swipe-right supported, back button in screen */}
        <Stack.Screen name="JonathanAI"       component={JonathanAIScreen} options={{ gestureEnabled: true, gestureDirection: 'horizontal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const navStyles = StyleSheet.create({
  // Full-bleed bar anchored to bottom of screen
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },

  // Hairline top border
  topBorder: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(101,77,36,0.15)',
  },

  // Row of icons, evenly spaced
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingHorizontal: 8,
  },

  // Each tab tap target — 44px minimum
  tabTap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingVertical: 4,
  },
});
