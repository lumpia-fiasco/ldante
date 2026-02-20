import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import {
  IconHome, IconCalendar, IconPlus, IconSparkles, IconSearch,
} from '@tabler/icons-react-native';
import { Colors, Spacing, Radius } from '../theme';
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

// ─── Tab Icons ─────────────────────────────────────────────────────────────────

function TabIconWrap({ children }: { children: React.ReactNode }) {
  return <View style={tabStyles.iconWrap}>{children}</View>;
}

function PlusTabIcon() {
  return (
    <View style={tabStyles.plusBtn}>
      <IconPlus size={26} color={Colors.white} stroke={2} />
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
        options={{
          tabBarIcon: ({ color }) => (
            <TabIconWrap><IconHome size={24} color={color} stroke={1.75} /></TabIconWrap>
          ),
        }}
      />
      <CustomerTab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabIconWrap><IconCalendar size={24} color={color} stroke={1.75} /></TabIconWrap>
          ),
        }}
      />
      <CustomerTab.Screen
        name="Create"
        component={DiscoverScreen}
        options={{ tabBarIcon: () => <PlusTabIcon /> }}
      />
      <CustomerTab.Screen
        name="Jonathan"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabIconWrap><IconSparkles size={24} color={color} stroke={1.75} /></TabIconWrap>
          ),
        }}
      />
      <CustomerTab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabIconWrap><IconSearch size={24} color={color} stroke={1.75} /></TabIconWrap>
          ),
        }}
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
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
      }}
    >
      <ProviderTab.Screen
        name="Dashboard"
        component={ProviderDashboardScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabIconWrap><IconHome size={24} color={color} stroke={1.75} /></TabIconWrap>
          ),
        }}
      />
      <ProviderTab.Screen
        name="Schedule"
        component={ProviderScheduleScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabIconWrap><IconCalendar size={24} color={color} stroke={1.75} /></TabIconWrap>
          ),
        }}
      />
      <ProviderTab.Screen
        name="Create"
        component={ProviderDashboardScreen}
        options={{ tabBarIcon: () => <PlusTabIcon /> }}
      />
      <ProviderTab.Screen
        name="Jonathan"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabIconWrap><IconSparkles size={24} color={color} stroke={1.75} /></TabIconWrap>
          ),
        }}
      />
      <ProviderTab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabIconWrap><IconSearch size={24} color={color} stroke={1.75} /></TabIconWrap>
          ),
        }}
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
  plusBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.plusButton,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
});
