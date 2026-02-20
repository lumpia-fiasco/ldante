import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import {
  IconHome, IconCalendar, IconPlus, IconSparkles, IconSearch,
} from '@tabler/icons-react-native';
import { Colors, Shadows } from '../theme';
import { CrowndLogo } from '../components/brand/CrowndLogo';

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
import { SearchScreen } from '../screens/customer/SearchScreen';

// Detail Screens
import { ProviderProfileScreen } from '../screens/shared/ProviderProfileScreen';
import { BookingFlowScreen } from '../screens/customer/BookingFlowScreen';
import { LeaveReviewScreen } from '../screens/customer/LeaveReviewScreen';
import { FriendsScreen } from '../screens/customer/FriendsScreen';
import { FriendRolodexScreen } from '../screens/customer/FriendRolodexScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { RolodexScreen } from '../screens/customer/RolodexScreen';

// Provider Screens
import { ProviderDashboardScreen } from '../screens/provider/ProviderDashboardScreen';
import { ProviderScheduleScreen } from '../screens/provider/ProviderScheduleScreen';
import { ProviderBookingsScreen } from '../screens/provider/ProviderBookingsScreen';
import { ManageServicesScreen } from '../screens/provider/ManageServicesScreen';
import { ProviderProfileEditScreen } from '../screens/provider/ProviderProfileEditScreen';

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
  FriendRolodex: { friendId: string; friendName: string };
  Search: { initialQuery?: string; category?: string };
  Notifications: undefined;
  Profile: undefined;
  ManageServices: undefined;
  ProviderProfileEdit: undefined;
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

function FloatingTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={navStyles.wrapper} pointerEvents="box-none">
      <View style={navStyles.pill}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const isCenter = index === 2; // Plus button

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

          if (isCenter) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={navStyles.plusWrap}
                activeOpacity={0.85}
              >
                <View style={navStyles.plusBtn}>
                  <IconPlus size={28} color={Colors.white} strokeWidth={2} />
                </View>
              </TouchableOpacity>
            );
          }

          const color = focused ? Colors.tabActive : Colors.tabInactive;
          const strokeWidth = focused ? 2.5 : 1.75;

          const iconMap: Record<string, React.ReactNode> = {
            Feed:     <IconHome size={24} color={color} strokeWidth={strokeWidth} />,
            Dashboard: <IconHome size={24} color={color} strokeWidth={strokeWidth} />,
            Bookings: <IconCalendar size={24} color={color} strokeWidth={strokeWidth} />,
            Schedule: <IconCalendar size={24} color={color} strokeWidth={strokeWidth} />,
            Jonathan: <IconSparkles size={24} color={color} strokeWidth={strokeWidth} />,
            Search:   <IconSearch size={24} color={color} strokeWidth={strokeWidth} />,
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={navStyles.tabItem}
              activeOpacity={0.7}
            >
              {iconMap[route.name] ?? null}
            </TouchableOpacity>
          );
        })}
      </View>
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
      <CustomerTab.Screen name="Feed" component={DiscoverScreen} />
      <CustomerTab.Screen name="Bookings" component={BookingsScreen} />
      <CustomerTab.Screen name="Create" component={DiscoverScreen} />
      <CustomerTab.Screen name="Jonathan" component={NotificationsScreen} />
      <CustomerTab.Screen name="Search" component={SearchScreen} />
    </CustomerTab.Navigator>
  );
}

// ─── Provider Tabs ─────────────────────────────────────────────────────────────

function ProviderTabs() {
  return (
    <ProviderTab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <ProviderTab.Screen name="Dashboard" component={ProviderDashboardScreen} />
      <ProviderTab.Screen name="Schedule" component={ProviderScheduleScreen} />
      <ProviderTab.Screen name="Create" component={ProviderDashboardScreen} />
      <ProviderTab.Screen name="Jonathan" component={NotificationsScreen} />
      <ProviderTab.Screen name="Search" component={SearchScreen} />
    </ProviderTab.Navigator>
  );
}

// ─── App Navigator ─────────────────────────────────────────────────────────────

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, cardStyle: { backgroundColor: Colors.background } }}
        initialRouteName="Welcome"
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
        <Stack.Screen name="CustomerOnboarding" component={CustomerOnboardingScreen} />
        <Stack.Screen name="ProviderOnboarding" component={ProviderOnboardingScreen} />
        <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
        <Stack.Screen name="ProviderTabs" component={ProviderTabs} />
        <Stack.Screen name="ProviderProfile" component={ProviderProfileScreen} />
        <Stack.Screen name="BookingFlow" component={BookingFlowScreen} />
        <Stack.Screen name="LeaveReview" component={LeaveReviewScreen} />
        <Stack.Screen name="Friends" component={FriendsScreen} />
        <Stack.Screen name="FriendRolodex" component={FriendRolodexScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ManageServices" component={ManageServicesScreen} />
        <Stack.Screen name="ProviderProfileEdit" component={ProviderProfileEditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─── Floating Nav Styles ───────────────────────────────────────────────────────

const navStyles = StyleSheet.create({
  // Outer container — sits above content, doesn't block touches outside the pill
  wrapper: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  // The floating pill
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tabBarBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    maxWidth: 400,
    ...Shadows.nav,
  },
  // Regular tab item — flex 1 so they distribute evenly
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  // Center plus button wrapper — sits above the bar
  plusWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28, // floats above the pill
  },
  plusBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.plusButton,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
    // Spec teal shadow
    shadowColor: Colors.plusButton,
    shadowOpacity: 0.3,
  },
});
