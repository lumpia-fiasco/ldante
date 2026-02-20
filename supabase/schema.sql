-- ─── CROWND Database Schema ─────────────────────────────────────────────────
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── USERS ───────────────────────────────────────────────────────────────────
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique,
  phone text unique,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'provider', 'both')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create user on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── CUSTOMER PROFILES ───────────────────────────────────────────────────────
create table customer_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null references users(id) on delete cascade,
  style_preferences jsonb default '{}',
  priority_rankings jsonb default '[]',
  service_categories text[] default '{}',
  location_lat decimal(10, 8),
  location_lng decimal(11, 8),
  location_text text,
  age_range text,
  rating_weight_opt_out boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── PROVIDER PROFILES ───────────────────────────────────────────────────────
create table provider_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null references users(id) on delete cascade,
  bio text check (length(bio) <= 500),
  years_experience int,
  certifications text[] default '{}',
  specialty_tags text[] default '{}',
  service_categories text[] default '{}',
  instagram_handle text,
  website_url text,
  auto_accept_bookings boolean default true,
  advance_notice_hours int default 2,
  max_advance_days int default 90,
  cancellation_policy_hours int default 24,
  is_verified boolean default false,
  follower_count int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── PROVIDER LOCATIONS ──────────────────────────────────────────────────────
create table provider_locations (
  id uuid primary key default uuid_generate_v4(),
  provider_id uuid not null references provider_profiles(id) on delete cascade,
  name text not null,
  address text not null,
  city text not null,
  state text not null,
  zip text not null,
  lat decimal(10, 8),
  lng decimal(11, 8),
  is_primary boolean default false,
  effective_date date default current_date,
  created_at timestamptz not null default now()
);

-- ─── SERVICES ─────────────────────────────────────────────────────────────────
create table services (
  id uuid primary key default uuid_generate_v4(),
  provider_id uuid not null references provider_profiles(id) on delete cascade,
  name text not null,
  description text,
  duration_minutes int not null,
  price_cents int not null,
  category text not null,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

-- ─── AVAILABILITY SLOTS ───────────────────────────────────────────────────────
create table availability_slots (
  id uuid primary key default uuid_generate_v4(),
  provider_id uuid not null references provider_profiles(id) on delete cascade,
  location_id uuid references provider_locations(id),
  day_of_week int check (day_of_week between 0 and 6),
  date date,
  start_time time not null,
  end_time time not null,
  is_blocked boolean default false,
  created_at timestamptz not null default now()
);

-- ─── FRIENDSHIPS ─────────────────────────────────────────────────────────────
create table friendships (
  id uuid primary key default uuid_generate_v4(),
  requester_id uuid not null references users(id) on delete cascade,
  recipient_id uuid not null references users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'blocked')),
  created_at timestamptz not null default now(),
  unique(requester_id, recipient_id)
);

-- ─── FRIEND GROUPS ────────────────────────────────────────────────────────────
create table friend_groups (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table friend_group_members (
  group_id uuid not null references friend_groups(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

-- ─── ROLODEX ENTRIES ─────────────────────────────────────────────────────────
create table rolodex_entries (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references users(id) on delete cascade,
  provider_id uuid not null references provider_profiles(id) on delete cascade,
  notes text check (length(notes) <= 500),
  privacy text not null default 'friends' check (privacy in ('public', 'friends', 'private')),
  last_visit_date date,
  visit_count int default 0,
  added_at timestamptz not null default now(),
  unique(customer_id, provider_id)
);

-- ─── PROVIDER FOLLOWS ────────────────────────────────────────────────────────
create table provider_follows (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references users(id) on delete cascade,
  provider_id uuid not null references provider_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(customer_id, provider_id)
);

-- Update follower count trigger
create or replace function update_follower_count()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update provider_profiles set follower_count = follower_count + 1 where id = new.provider_id;
  elsif TG_OP = 'DELETE' then
    update provider_profiles set follower_count = follower_count - 1 where id = old.provider_id;
  end if;
  return null;
end;
$$;

create trigger on_follow_change
  after insert or delete on provider_follows
  for each row execute procedure update_follower_count();

-- ─── BOOKINGS ─────────────────────────────────────────────────────────────────
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references users(id) on delete cascade,
  provider_id uuid not null references provider_profiles(id),
  service_id uuid not null references services(id),
  location_id uuid references provider_locations(id),
  status text not null default 'requested' check (status in ('requested', 'confirmed', 'completed', 'cancelled', 'no_show')),
  start_time timestamptz not null,
  end_time timestamptz not null,
  notes text,
  price_cents int not null,
  referral_friend_id uuid references users(id),
  created_at timestamptz not null default now()
);

-- ─── RATINGS ──────────────────────────────────────────────────────────────────
create table ratings (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid unique not null references bookings(id),
  customer_id uuid not null references users(id) on delete cascade,
  provider_id uuid not null references provider_profiles(id),
  overall_score decimal(3,2) not null check (overall_score between 1 and 5),
  dimensions jsonb default '[]',
  review_text text check (length(review_text) <= 500),
  photo_urls text[] default '{}',
  privacy text default 'friends' check (privacy in ('public', 'friends', 'private')),
  weight_multiplier decimal(4,2) default 1.0,
  would_recommend boolean default true,
  best_for_tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  data jsonb default '{}',
  read boolean default false,
  created_at timestamptz not null default now()
);

create index idx_notifications_user_unread on notifications(user_id, read);
create index idx_bookings_customer on bookings(customer_id);
create index idx_bookings_provider on bookings(provider_id);
create index idx_rolodex_customer on rolodex_entries(customer_id);
create index idx_ratings_provider on ratings(provider_id);
create index idx_friendships_status on friendships(recipient_id, status);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
alter table users enable row level security;
alter table customer_profiles enable row level security;
alter table provider_profiles enable row level security;
alter table provider_locations enable row level security;
alter table services enable row level security;
alter table bookings enable row level security;
alter table ratings enable row level security;
alter table notifications enable row level security;
alter table rolodex_entries enable row level security;
alter table friendships enable row level security;
alter table provider_follows enable row level security;

-- Users: read public, write own
create policy "Users are publicly readable" on users for select using (true);
create policy "Users can update own profile" on users for update using (auth.uid() = id);

-- Customer profiles: read own
create policy "Customers read own profile" on customer_profiles for all using (auth.uid() = user_id);

-- Provider profiles: public read
create policy "Provider profiles public" on provider_profiles for select using (true);
create policy "Providers manage own" on provider_profiles for all using (
  auth.uid() = user_id
);

-- Services: public read
create policy "Services public read" on services for select using (true);
create policy "Providers manage services" on services for all using (
  auth.uid() = (select user_id from provider_profiles where id = provider_id)
);

-- Locations: public read
create policy "Locations public read" on provider_locations for select using (true);
create policy "Providers manage locations" on provider_locations for all using (
  auth.uid() = (select user_id from provider_profiles where id = provider_id)
);

-- Bookings: customer or provider
create policy "Bookings access" on bookings for select using (
  auth.uid() = customer_id or
  auth.uid() = (select user_id from provider_profiles where id = provider_id)
);
create policy "Customers create bookings" on bookings for insert with check (auth.uid() = customer_id);
create policy "Provider update booking status" on bookings for update using (
  auth.uid() = (select user_id from provider_profiles where id = provider_id) or
  auth.uid() = customer_id
);

-- Ratings: privacy-aware
create policy "Ratings visibility" on ratings for select using (
  privacy = 'public' or
  auth.uid() = customer_id or
  auth.uid() = (select user_id from provider_profiles where id = provider_id) or
  (privacy = 'friends' and auth.uid() in (
    select case when requester_id = auth.uid() then recipient_id else requester_id end
    from friendships where (requester_id = auth.uid() or recipient_id = auth.uid()) and status = 'accepted'
  ))
);
create policy "Customers submit ratings" on ratings for insert with check (auth.uid() = customer_id);

-- Notifications: own only
create policy "Own notifications" on notifications for all using (auth.uid() = user_id);

-- Friendships
create policy "Friendships visible" on friendships for select using (
  auth.uid() = requester_id or auth.uid() = recipient_id
);
create policy "Send friend requests" on friendships for insert with check (auth.uid() = requester_id);
create policy "Update friend status" on friendships for update using (
  auth.uid() = recipient_id or auth.uid() = requester_id
);

-- Rolodex
create policy "Own rolodex" on rolodex_entries for all using (auth.uid() = customer_id);
create policy "Friends see rolodex" on rolodex_entries for select using (
  privacy = 'public' or
  (privacy = 'friends' and auth.uid() in (
    select case when requester_id = customer_id then recipient_id else requester_id end
    from friendships
    where (requester_id = customer_id or recipient_id = customer_id)
    and status = 'accepted'
  ))
);

-- Provider follows
create policy "Follows visible" on provider_follows for select using (true);
create policy "Manage own follows" on provider_follows for all using (auth.uid() = customer_id);

-- ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

-- Get friends for a user
create or replace function get_friends(p_user_id uuid)
returns table (
  id uuid, full_name text, avatar_url text, role text
) language sql security definer as $$
  select u.id, u.full_name, u.avatar_url, u.role
  from users u
  join friendships f on (
    (f.requester_id = p_user_id and f.recipient_id = u.id) or
    (f.recipient_id = p_user_id and f.requester_id = u.id)
  )
  where f.status = 'accepted';
$$;

-- Get friends using a provider
create or replace function get_friends_using_provider(p_provider_id uuid, p_user_id uuid)
returns table (id uuid, full_name text, avatar_url text, visit_count int)
language sql security definer as $$
  select u.id, u.full_name, u.avatar_url, re.visit_count
  from users u
  join rolodex_entries re on re.customer_id = u.id
  join friendships f on (
    (f.requester_id = p_user_id and f.recipient_id = u.id) or
    (f.recipient_id = p_user_id and f.requester_id = u.id)
  )
  where re.provider_id = p_provider_id
  and f.status = 'accepted'
  and re.privacy != 'private';
$$;

-- Calculate weighted rating for a provider/viewer pair
create or replace function calculate_weighted_rating(p_provider_id uuid, p_user_id uuid)
returns jsonb language plpgsql security definer as $$
declare
  v_result jsonb;
  v_weighted_sum decimal := 0;
  v_weight_total decimal := 0;
  v_unweighted_sum decimal := 0;
  v_count int := 0;
  r record;
begin
  for r in
    select
      rt.overall_score,
      rt.weight_multiplier,
      rt.customer_id,
      rt.dimensions
    from ratings rt
    where rt.provider_id = p_provider_id
    and rt.privacy != 'private'
  loop
    v_weighted_sum := v_weighted_sum + (r.overall_score * r.weight_multiplier);
    v_weight_total := v_weight_total + r.weight_multiplier;
    v_unweighted_sum := v_unweighted_sum + r.overall_score;
    v_count := v_count + 1;
  end loop;

  if v_count = 0 then
    return jsonb_build_object('weighted_score', 0, 'unweighted_score', 0, 'total_ratings', 0);
  end if;

  v_result := jsonb_build_object(
    'weighted_score', round((v_weighted_sum / v_weight_total)::numeric, 2),
    'unweighted_score', round((v_unweighted_sum / v_count)::numeric, 2),
    'total_ratings', v_count,
    'confidence', case when v_count >= 20 then 'high' when v_count >= 5 then 'medium' else 'low' end
  );

  return v_result;
end;
$$;

-- Get unrated completed bookings for a customer
create or replace function get_unrated_bookings(p_customer_id uuid)
returns table (booking_id uuid, provider_name text, service_name text, completed_at timestamptz)
language sql security definer as $$
  select b.id, u.full_name, s.name, b.end_time
  from bookings b
  join provider_profiles pp on pp.id = b.provider_id
  join users u on u.id = pp.user_id
  join services s on s.id = b.service_id
  where b.customer_id = p_customer_id
  and b.status = 'completed'
  and not exists (select 1 from ratings r where r.booking_id = b.id)
  and b.end_time > now() - interval '30 days'
  order by b.end_time desc;
$$;
