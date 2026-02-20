// ─── User Types ───────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'provider' | 'both';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

export interface CustomerProfile {
  id: string;
  user_id: string;
  style_preferences: StylePreferences;
  priority_rankings: PriorityRanking[];
  service_categories: ServiceCategory[];
  location_lat?: number;
  location_lng?: number;
  location_text?: string;
  age_range?: string;
  rating_weight_opt_out: boolean;
}

export interface StylePreferences {
  hair?: string; // 'classic' | 'edgy' | 'natural' | 'trendy' | 'vibrant'
  nails?: string;
  fitness?: string;
  wellness?: string;
}

export type PriorityRanking = {
  key: 'reliability' | 'price' | 'trendiness' | 'convenience' | 'quality';
  rank: number;
  weight: number; // 0-100
};

// ─── Provider Types ────────────────────────────────────────────────────────────

export type ServiceCategory =
  | 'hair'
  | 'nails'
  | 'massage'
  | 'fitness'
  | 'esthetics'
  | 'wellness'
  | 'other';

export interface ProviderProfile {
  id: string;
  user_id: string;
  bio?: string;
  years_experience?: number;
  certifications: string[];
  specialty_tags: string[];
  service_categories: ServiceCategory[];
  instagram_handle?: string;
  website_url?: string;
  auto_accept_bookings: boolean;
  advance_notice_hours: number;
  max_advance_days: number;
  cancellation_policy_hours: number;
  is_verified: boolean;
  follower_count: number;
}

export interface ProviderLocation {
  id: string;
  provider_id: string;
  name: string; // e.g. "Style Suites Downtown"
  address: string;
  city: string;
  state: string;
  zip: string;
  lat?: number;
  lng?: number;
  is_primary: boolean;
  effective_date: string;
}

export interface Service {
  id: string;
  provider_id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price_cents: number;
  category: ServiceCategory;
  is_active: boolean;
}

export interface AvailabilitySlot {
  id: string;
  provider_id: string;
  location_id: string;
  day_of_week?: number; // 0-6
  date?: string; // for specific date overrides
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  is_blocked: boolean;
}

// ─── Social Types ──────────────────────────────────────────────────────────────

export type FriendshipStatus = 'pending' | 'accepted' | 'declined' | 'blocked';

export interface Friendship {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: FriendshipStatus;
  created_at: string;
}

export interface FriendGroup {
  id: string;
  owner_id: string;
  name: string;
  member_count: number;
  created_at: string;
}

export type RolodexPrivacy = 'public' | 'friends' | 'private';

export interface RolodexEntry {
  id: string;
  customer_id: string;
  provider_id: string;
  notes?: string;
  privacy: RolodexPrivacy;
  last_visit_date?: string;
  visit_count: number;
  added_at: string;
  provider?: ProviderWithDetails;
}

// ─── Booking Types ─────────────────────────────────────────────────────────────

export type BookingStatus =
  | 'requested'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface Booking {
  id: string;
  customer_id: string;
  provider_id: string;
  service_id: string;
  location_id: string;
  status: BookingStatus;
  start_time: string;
  end_time: string;
  notes?: string;
  price_cents: number;
  referral_friend_id?: string;
  created_at: string;
  service?: Service;
  provider?: ProviderWithDetails;
  location?: ProviderLocation;
}

// ─── Rating Types ──────────────────────────────────────────────────────────────

export interface RatingDimension {
  key:
    | 'quality'
    | 'service'
    | 'value'
    | 'timeliness'
    | 'atmosphere'
    | 'expertise';
  label: string;
  icon: string;
  score: number; // 1-5
  comment?: string;
}

export interface Rating {
  id: string;
  booking_id: string;
  customer_id: string;
  provider_id: string;
  overall_score: number; // 1-5
  dimensions: RatingDimension[];
  review_text?: string;
  photo_urls: string[];
  privacy: 'public' | 'friends' | 'private';
  weight_multiplier: number; // calculated
  would_recommend: boolean;
  best_for_tags: string[];
  created_at: string;
}

export interface WeightedRating {
  weighted_score: number;
  unweighted_score: number;
  total_ratings: number;
  dimensions: Record<string, number>;
  confidence: 'low' | 'medium' | 'high';
}

// ─── Notification Types ────────────────────────────────────────────────────────

export type NotificationType =
  | 'booking_confirmed'
  | 'booking_reminder_24h'
  | 'booking_reminder_1h'
  | 'booking_cancelled'
  | 'provider_location_changed'
  | 'friend_request'
  | 'friend_accepted'
  | 'friend_added_provider'
  | 'friend_reviewed_provider'
  | 'rating_prompt'
  | 'trending_alert';

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
  read: boolean;
  created_at: string;
}

// ─── Composite / View Types ────────────────────────────────────────────────────

export interface ProviderWithDetails {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  specialty_tags: string[];
  service_categories: ServiceCategory[];
  certifications: string[];
  years_experience?: number;
  instagram_handle?: string;
  locations: ProviderLocation[];
  services: Service[];
  weighted_rating?: WeightedRating;
  follower_count: number;
  is_following?: boolean;
  friend_followers?: { id: string; full_name: string; avatar_url?: string }[];
  portfolio_photos?: string[];
}

export interface DiscoveryProvider extends ProviderWithDetails {
  distance_miles?: number;
  friend_count: number;
  recommendation_score: number;
  match_reason?: string;
}
