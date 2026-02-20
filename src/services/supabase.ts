import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ─── Auth Service ──────────────────────────────────────────────────────────────

export const authService = {
  async signUpWithEmail(email: string, password: string) {
    return supabase.auth.signUp({ email, password });
  },

  async signInWithEmail(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  },

  async signOut() {
    return supabase.auth.signOut();
  },

  async getSession() {
    return supabase.auth.getSession();
  },

  async resetPassword(email: string) {
    return supabase.auth.resetPasswordForEmail(email);
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// ─── User / Profile Service ────────────────────────────────────────────────────

export const userService = {
  async getUser(userId: string) {
    return supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
  },

  async updateUser(userId: string, data: Partial<{ full_name: string; avatar_url: string; role: string }>) {
    return supabase.from('users').update(data).eq('id', userId);
  },

  async createCustomerProfile(profile: any) {
    return supabase.from('customer_profiles').insert(profile);
  },

  async getCustomerProfile(userId: string) {
    return supabase
      .from('customer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
  },

  async updateCustomerProfile(userId: string, data: any) {
    return supabase
      .from('customer_profiles')
      .update(data)
      .eq('user_id', userId);
  },

  async createProviderProfile(profile: any) {
    return supabase.from('provider_profiles').insert(profile);
  },

  async getProviderProfile(userId: string) {
    return supabase
      .from('provider_profiles')
      .select('*, provider_locations(*), services(*)')
      .eq('user_id', userId)
      .single();
  },

  async updateProviderProfile(userId: string, data: any) {
    return supabase
      .from('provider_profiles')
      .update(data)
      .eq('user_id', userId);
  },
};

// ─── Provider Service ──────────────────────────────────────────────────────────

export const providerService = {
  async getProviderById(providerId: string) {
    return supabase
      .from('provider_profiles')
      .select(`
        *,
        users!provider_profiles_user_id_fkey(id, full_name, avatar_url),
        provider_locations(*),
        services(*)
      `)
      .eq('id', providerId)
      .single();
  },

  async searchProviders(query: string, filters: {
    category?: string;
    maxDistanceMiles?: number;
    friendsOnly?: boolean;
    userId?: string;
  }) {
    let q = supabase
      .from('provider_profiles')
      .select(`
        *,
        users!provider_profiles_user_id_fkey(id, full_name, avatar_url),
        provider_locations(*),
        services(*)
      `);

    if (query) {
      q = q.ilike('specialty_tags', `%${query}%`);
    }
    if (filters.category) {
      q = q.contains('service_categories', [filters.category]);
    }

    return q.limit(20);
  },

  async getDiscoveryFeed(userId: string) {
    // Get providers followed by friends
    return supabase
      .rpc('get_discovery_feed', { p_user_id: userId })
      .limit(30);
  },

  async getTrendingProviders(userId: string) {
    return supabase
      .rpc('get_trending_providers', { p_user_id: userId })
      .limit(10);
  },

  async addLocation(location: any) {
    return supabase.from('provider_locations').insert(location);
  },

  async updateLocation(locationId: string, data: any) {
    return supabase
      .from('provider_locations')
      .update(data)
      .eq('id', locationId);
  },

  async addService(service: any) {
    return supabase.from('services').insert(service);
  },

  async updateService(serviceId: string, data: any) {
    return supabase.from('services').update(data).eq('id', serviceId);
  },

  async deleteService(serviceId: string) {
    return supabase.from('services').delete().eq('id', serviceId);
  },

  async getAvailability(providerId: string) {
    return supabase
      .from('availability_slots')
      .select('*')
      .eq('provider_id', providerId)
      .eq('is_blocked', false);
  },

  async setAvailability(slots: any[]) {
    return supabase.from('availability_slots').upsert(slots);
  },
};

// ─── Social / Friend Service ───────────────────────────────────────────────────

export const socialService = {
  async sendFriendRequest(requesterId: string, recipientId: string) {
    return supabase.from('friendships').insert({
      requester_id: requesterId,
      recipient_id: recipientId,
      status: 'pending',
    });
  },

  async respondToFriendRequest(friendshipId: string, status: 'accepted' | 'declined') {
    return supabase
      .from('friendships')
      .update({ status })
      .eq('id', friendshipId);
  },

  async getFriends(userId: string) {
    return supabase
      .rpc('get_friends', { p_user_id: userId });
  },

  async getPendingRequests(userId: string) {
    return supabase
      .from('friendships')
      .select(`
        *,
        requester:users!friendships_requester_id_fkey(id, full_name, avatar_url)
      `)
      .eq('recipient_id', userId)
      .eq('status', 'pending');
  },

  async searchUsers(query: string, currentUserId: string) {
    return supabase
      .from('users')
      .select('id, full_name, avatar_url, role')
      .ilike('full_name', `%${query}%`)
      .neq('id', currentUserId)
      .limit(20);
  },

  async getFriendsUsingProvider(providerId: string, userId: string) {
    return supabase
      .rpc('get_friends_using_provider', {
        p_provider_id: providerId,
        p_user_id: userId,
      });
  },
};

// ─── Rolodex Service ───────────────────────────────────────────────────────────

export const rolodexService = {
  async getMyRolodex(userId: string) {
    return supabase
      .from('rolodex_entries')
      .select(`
        *,
        provider_profiles!rolodex_entries_provider_id_fkey(
          *,
          users!provider_profiles_user_id_fkey(id, full_name, avatar_url),
          provider_locations(*),
          services(*)
        )
      `)
      .eq('customer_id', userId)
      .order('last_visit_date', { ascending: false });
  },

  async getFriendRolodex(friendId: string, requesterId: string) {
    return supabase
      .rpc('get_friend_rolodex', {
        p_friend_id: friendId,
        p_requester_id: requesterId,
      });
  },

  async addToRolodex(entry: {
    customer_id: string;
    provider_id: string;
    privacy?: string;
    notes?: string;
  }) {
    return supabase.from('rolodex_entries').insert({
      ...entry,
      privacy: entry.privacy || 'friends',
      visit_count: 0,
    });
  },

  async removeFromRolodex(customerId: string, providerId: string) {
    return supabase
      .from('rolodex_entries')
      .delete()
      .eq('customer_id', customerId)
      .eq('provider_id', providerId);
  },

  async updateNotes(entryId: string, notes: string) {
    return supabase
      .from('rolodex_entries')
      .update({ notes })
      .eq('id', entryId);
  },

  async updatePrivacy(entryId: string, privacy: string) {
    return supabase
      .from('rolodex_entries')
      .update({ privacy })
      .eq('id', entryId);
  },

  async followProvider(customerId: string, providerId: string) {
    return supabase
      .from('provider_follows')
      .insert({ customer_id: customerId, provider_id: providerId });
  },

  async unfollowProvider(customerId: string, providerId: string) {
    return supabase
      .from('provider_follows')
      .delete()
      .eq('customer_id', customerId)
      .eq('provider_id', providerId);
  },

  async isFollowing(customerId: string, providerId: string) {
    const { data } = await supabase
      .from('provider_follows')
      .select('id')
      .eq('customer_id', customerId)
      .eq('provider_id', providerId)
      .single();
    return !!data;
  },
};

// ─── Booking Service ───────────────────────────────────────────────────────────

export const bookingService = {
  async getAvailableSlots(providerId: string, date: string, serviceId: string) {
    return supabase
      .rpc('get_available_slots', {
        p_provider_id: providerId,
        p_date: date,
        p_service_id: serviceId,
      });
  },

  async createBooking(booking: {
    customer_id: string;
    provider_id: string;
    service_id: string;
    location_id: string;
    start_time: string;
    end_time: string;
    notes?: string;
    price_cents: number;
    referral_friend_id?: string;
  }) {
    return supabase.from('bookings').insert({
      ...booking,
      status: 'requested',
    });
  },

  async getCustomerBookings(customerId: string) {
    return supabase
      .from('bookings')
      .select(`
        *,
        services(*),
        provider_profiles!bookings_provider_id_fkey(
          *,
          users!provider_profiles_user_id_fkey(id, full_name, avatar_url)
        ),
        provider_locations(*)
      `)
      .eq('customer_id', customerId)
      .order('start_time', { ascending: false });
  },

  async getProviderBookings(providerId: string) {
    return supabase
      .from('bookings')
      .select(`
        *,
        services(*),
        users!bookings_customer_id_fkey(id, full_name, avatar_url, phone, email)
      `)
      .eq('provider_id', providerId)
      .order('start_time', { ascending: true });
  },

  async updateBookingStatus(bookingId: string, status: string) {
    return supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId);
  },

  async cancelBooking(bookingId: string) {
    return supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);
  },
};

// ─── Rating Service ────────────────────────────────────────────────────────────

export const ratingService = {
  async submitRating(rating: {
    booking_id: string;
    customer_id: string;
    provider_id: string;
    overall_score: number;
    dimensions: any[];
    review_text?: string;
    photo_urls?: string[];
    privacy?: string;
    would_recommend: boolean;
    best_for_tags?: string[];
  }) {
    return supabase.from('ratings').insert({
      ...rating,
      privacy: rating.privacy || 'friends',
      photo_urls: rating.photo_urls || [],
      best_for_tags: rating.best_for_tags || [],
    });
  },

  async getProviderRatings(providerId: string, requesterId?: string) {
    return supabase
      .rpc('get_provider_ratings', {
        p_provider_id: providerId,
        p_requester_id: requesterId,
      });
  },

  async getWeightedRating(providerId: string, userId: string) {
    return supabase
      .rpc('calculate_weighted_rating', {
        p_provider_id: providerId,
        p_user_id: userId,
      });
  },

  async hasRatedBooking(bookingId: string) {
    const { data } = await supabase
      .from('ratings')
      .select('id')
      .eq('booking_id', bookingId)
      .single();
    return !!data;
  },

  async getUnratedCompletedBookings(customerId: string) {
    return supabase
      .rpc('get_unrated_bookings', { p_customer_id: customerId });
  },
};

// ─── Notification Service ──────────────────────────────────────────────────────

export const notificationService = {
  async getNotifications(userId: string) {
    return supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
  },

  async markAsRead(notificationId: string) {
    return supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
  },

  async markAllAsRead(userId: string) {
    return supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
  },

  async getUnreadCount(userId: string) {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);
    return count || 0;
  },
};
