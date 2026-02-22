import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, TouchableOpacity, Platform, useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';

import {
  HomeTabIcon,
  CalendarTabIcon,
  SparklesTabIcon,
  SearchTabIcon,
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
import { SearchScreen } from '../screens/customer/SearchScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { RolodexScreen } from '../screens/customer/RolodexScreen';

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
};

export type CustomerTabParamList = {
  Feed: undefined;
  Bookings: undefined;
  Create: undefined;
  Jonathan: undefined;
  Search: undefined;
};

export type ProviderTabParamList = {
  Dashboard: undefined;
  Schedule: undefined;
  Create: undefined;
  Jonathan: undefined;
  Search: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const CustomerTab = createBottomTabNavigator<CustomerTabParamList>();
const ProviderTab = createBottomTabNavigator<ProviderTabParamList>();

// ─── Floating Tab Bar ──────────────────────────────────────────────────────────
// Figma spec:
//   display: inline-flex; padding: 8px 16px; gap: 24px; align-items: center
//   border-radius: 8px
//   background: rgba(255,255,255,0.80)
//   box-shadow: 0 1px 3px 0 rgba(0,0,0,0.25)

function FloatingTabBar({ state, descriptors, navigation, isProviderTab = false }: any) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const ICON_ACTIVE   = isDark ? '#FFFFFF'              : '#654D24';
  const ICON_INACTIVE = isDark ? 'rgba(255,255,255,0.40)' : 'rgba(101,77,36,0.40)';
  const blurTint      = isDark ? 'dark'                 : 'light';

  return (
    <View style={navStyles.safeArea} pointerEvents="box-none">
      <BlurView
        tint={blurTint}
        intensity={60}
        style={navStyles.pill}
      >
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

          // ── Plus / Create button — navigates to CreatePost screen ────────
          if (isCenter) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => navigation.navigate('CreatePost', { role: isProviderTab ? 'provider' : 'customer' })}
                style={navStyles.plusTap}
                activeOpacity={0.8}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <PlusTabIcon size={40} color={ICON_ACTIVE} />
              </TouchableOpacity>
            );
          }

          // ── Regular tab ──────────────────────────────────────────────────
          const color = focused ? ICON_ACTIVE : ICON_INACTIVE;
          const strokeWidth = focused ? 2 : 1.5;

          const icons: Record<string, React.ReactNode> = {
            Feed:      <HomeTabIcon      size={24} color={color} strokeWidth={strokeWidth} />,
            Dashboard: <HomeTabIcon      size={24} color={color} strokeWidth={strokeWidth} />,
            Bookings:  <CalendarTabIcon  size={24} color={color} strokeWidth={strokeWidth} />,
            Schedule:  <CalendarTabIcon  size={24} color={color} strokeWidth={strokeWidth} />,
            Jonathan:  <SparklesTabIcon  size={24} color={color} strokeWidth={strokeWidth} />,
            Search:    <SearchTabIcon    size={24} color={color} strokeWidth={strokeWidth} />,
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
      </BlurView>
    </View>
  );
}

// ─── Customer Tabs ─────────────────────────────────────────────────────────────

function CustomerTabs() {
  return (
    <CustomerTab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <CustomerTab.Screen name="Feed"     component={DiscoverScreen} />
      <CustomerTab.Screen name="Bookings" component={BookingsScreen} />
      <CustomerTab.Screen name="Create"   component={DiscoverScreen} />
      <CustomerTab.Screen name="Jonathan" component={JonathanAIScreen} />
      <CustomerTab.Screen name="Search"   component={SearchScreen} />
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
      <ProviderTab.Screen name="Search"    component={SearchScreen} />
    </ProviderTab.Navigator>
  );
}

// ─── App Navigator ─────────────────────────────────────────────────────────────

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFFFFF' },
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
        initialRouteName="Welcome"
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
        <Stack.Screen name="CreatePost"       component={CreatePostScreen} options={{ gestureEnabled: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const navStyles = StyleSheet.create({
  // Positioned absolutely above the home indicator
  safeArea: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'box-none',
  } as any,

  // The pill — exact Figma spec + frosted glass
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 24,
    borderRadius: 8,
    overflow: 'hidden',         // clips blur to rounded corners
    // BlurView handles the background; keep a subtle tint on Android fallback
    // (dark mode Android handled via blurTint on BlurView on iOS; Android uses this)
    backgroundColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.88)' : 'transparent',
    // shadow: 0 1px 3px 0 rgba(0,0,0,0.25)
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 6,
  },

  // Each regular tab — 44px min tap target
  tabTap: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },

  // Center plus button tap area
  plusTap: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
});
