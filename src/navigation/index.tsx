import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme';

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
import { RolodexScreen } from '../screens/customer/RolodexScreen';
import { BookingsScreen } from '../screens/customer/BookingsScreen';
import { NotificationsScreen } from '../screens/shared/NotificationsScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';

// Detail Screens
import { ProviderProfileScreen } from '../screens/shared/ProviderProfileScreen';
import { BookingFlowScreen } from '../screens/customer/BookingFlowScreen';
import { LeaveReviewScreen } from '../screens/customer/LeaveReviewScreen';
import { FriendsScreen } from '../screens/customer/FriendsScreen';
import { FriendRolodexScreen } from '../screens/customer/FriendRolodexScreen';
import { SearchScreen } from '../screens/customer/SearchScreen';

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

// ─── Tab Icon ──────────────────────────────────────────────────────────────────

function HomeIcon({ focused }: { focused: boolean }) {
  return (
    <View style={tabStyles.iconWrap}>
      <Text style={[tabStyles.iconSvg, { color: focused ? Colors.tabActive : Colors.tabInactive }]}>⌂</Text>
    </View>
  );
}

function CalendarIcon({ focused }: { focused: boolean }) {
  return (
    <View style={tabStyles.iconWrap}>
      <Text style={[tabStyles.iconSvg, { color: focused ? Colors.tabActive : Colors.tabInactive }]}>📅</Text>
    </View>
  );
}

function PlusIcon() {
  return (
    <View style={tabStyles.plusBtn}>
      <Text style={tabStyles.plusText}>+</Text>
    </View>
  );
}

function SparkleIcon({ focused }: { focused: boolean }) {
  return (
    <View style={tabStyles.iconWrap}>
      <Text style={[tabStyles.iconSvg, { color: focused ? Colors.tabActive : Colors.tabInactive }]}>✦</Text>
    </View>
  );
}

function SearchIcon({ focused }: { focused: boolean }) {
  return (
    <View style={tabStyles.iconWrap}>
      <Text style={[tabStyles.iconSvg, { color: focused ? Colors.tabActive : Colors.tabInactive }]}>⌕</Text>
    </View>
  );
}

// ─── Customer Tabs ─────────────────────────────────────────────────────────────

function CustomerTabs() {
  return (
    <CustomerTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: tabStyles.bar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
      }}
    >
      <CustomerTab.Screen
        name="Feed"
        component={DiscoverScreen}
        options={{ tabBarIcon: ({ focused }) => <HomeIcon focused={focused} /> }}
      />
      <CustomerTab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{ tabBarIcon: ({ focused }) => <CalendarIcon focused={focused} /> }}
      />
      <CustomerTab.Screen
        name="Create"
        component={DiscoverScreen}
        options={{ tabBarIcon: () => <PlusIcon /> }}
      />
      <CustomerTab.Screen
        name="Jonathan"
        component={NotificationsScreen}
        options={{ tabBarIcon: ({ focused }) => <SparkleIcon focused={focused} /> }}
      />
      <CustomerTab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarIcon: ({ focused }) => <SearchIcon focused={focused} /> }}
      />
    </CustomerTab.Navigator>
  );
}

// ─── Provider Tabs ─────────────────────────────────────────────────────────────

function ProviderTabs() {
  return (
    <ProviderTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: tabStyles.bar,
        tabBarShowLabel: false,
      }}
    >
      <ProviderTab.Screen
        name="Dashboard"
        component={ProviderDashboardScreen}
        options={{ tabBarIcon: ({ focused }) => <HomeIcon focused={focused} /> }}
      />
      <ProviderTab.Screen
        name="Schedule"
        component={ProviderScheduleScreen}
        options={{ tabBarIcon: ({ focused }) => <CalendarIcon focused={focused} /> }}
      />
      <ProviderTab.Screen
        name="Create"
        component={ProviderDashboardScreen}
        options={{ tabBarIcon: () => <PlusIcon /> }}
      />
      <ProviderTab.Screen
        name="Jonathan"
        component={NotificationsScreen}
        options={{ tabBarIcon: ({ focused }) => <SparkleIcon focused={focused} /> }}
      />
      <ProviderTab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarIcon: ({ focused }) => <SearchIcon focused={focused} /> }}
      />
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

const tabStyles = StyleSheet.create({
  bar: {
    backgroundColor: Colors.tabBarBg,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 84,
    paddingBottom: 20,
    paddingTop: 8,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  iconSvg: {
    fontSize: 22,
    lineHeight: 28,
  },
  plusBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.plusButton,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  plusText: {
    fontSize: 28,
    color: Colors.white,
    lineHeight: 32,
    fontWeight: '300' as const,
  },
});
