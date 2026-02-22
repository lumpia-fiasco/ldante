/**
 * postsStore.ts
 * ─────────────
 * Lightweight in-memory store for feed posts.
 * Serves as the single source of truth shared between CreatePostScreen
 * and DiscoverScreen's Feed tab for the duration of the app session.
 *
 * In production this would be replaced with a Supabase real-time subscription
 * or React Query / Zustand store backed by the database.
 */

export type FeedPost = {
  id: string;
  customer: { id: string; name: string; avatar: string };
  provider: { id: string; name: string; location: string; avatar: string; service: string };
  photo: string;
  tags: string[];
  review: string;
  likes: number;
  liked: boolean;
  // Optional ratings included when the poster rated the provider
  ratings?: {
    quality?: number;
    friendliness?: number;
    expertise?: number;
    location?: number;
  };
  createdAt: number; // Unix ms — used for sort order
};

// ─── Seed data (mirrors the mock posts already in DiscoverScreen) ──────────────

const SEED_POSTS: FeedPost[] = [
  {
    id: 'seed-1',
    customer: { id: 'f1', name: 'Sarah Kim',      avatar: 'https://randomuser.me/api/portraits/women/55.jpg' },
    provider:  { id: 'p1', name: 'Carmela',        location: 'Costa Mesa, CA', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', service: '💇‍♀️' },
    photo: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80',
    tags: ['Goddess Braids', 'Shampoo', 'Color'],
    review: "Carmela did amazing with these braids! Best, hands-down. My hair has never been more healthy — she really knows how to take care of it.",
    likes: 16, liked: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago
  },
  {
    id: 'seed-2',
    customer: { id: 'f3', name: 'Lisa Morgan',    avatar: 'https://randomuser.me/api/portraits/women/12.jpg' },
    provider:  { id: 'p5', name: 'Aisha',          location: 'Long Beach, CA', avatar: 'https://randomuser.me/api/portraits/women/91.jpg', service: '🧖‍♀️' },
    photo: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
    tags: ['HydraFacial', 'Glow'],
    review: "Aisha is the skin whisperer. Left glowing like never before. I'm a forever client.",
    likes: 31, liked: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
  },
  {
    id: 'seed-3',
    customer: { id: 'f5', name: 'Martina Garcia', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
    provider:  { id: 'p2', name: 'Devon',          location: 'Santa Ana, CA',  avatar: 'https://randomuser.me/api/portraits/men/42.jpg',   service: '💈' },
    photo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
    tags: ['Fade', 'Lineup'],
    review: "Devon is hands down the best barber in OC. Got my husband going and now he won't go anywhere else.",
    likes: 24, liked: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
  },
  {
    id: 'seed-4',
    customer: { id: 'f2', name: 'Emily Rodriguez', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
    provider:  { id: 'p6', name: 'Tyler',          location: 'Torrance, CA',   avatar: 'https://randomuser.me/api/portraits/men/33.jpg',   service: '💪' },
    photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    tags: ['HIIT', 'Personal Training'],
    review: "Tyler is the real deal. He pushes you just enough and the results speak for themselves. Month 3 and I'm a different person.",
    likes: 19, liked: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
  },
  {
    id: 'seed-5',
    customer: { id: 'f1', name: 'Sarah Kim',      avatar: 'https://randomuser.me/api/portraits/women/55.jpg' },
    provider:  { id: 'p3', name: 'Jasmine',        location: 'Irvine, CA',     avatar: 'https://randomuser.me/api/portraits/women/22.jpg', service: '💅' },
    photo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
    tags: ['Gel Manicure', 'Nail Art'],
    review: "Jasmine did the most beautiful set — clean, precise, and so cute. Already booked my next appointment.",
    likes: 8, liked: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 28,
  },
];

// ─── Store ────────────────────────────────────────────────────────────────────

type Listener = () => void;

let _posts: FeedPost[] = [...SEED_POSTS];
const _listeners = new Set<Listener>();

function notify() {
  _listeners.forEach(fn => fn());
}

/** Subscribe to store changes. Returns an unsubscribe function. */
export function subscribe(listener: Listener): () => void {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

/** Get the current posts, sorted newest-first. */
export function getPosts(): FeedPost[] {
  return [..._posts].sort((a, b) => b.createdAt - a.createdAt);
}

/** Add a new post to the top of the feed and notify all listeners. */
export function addPost(post: FeedPost): void {
  _posts = [post, ..._posts];
  notify();
}

/** Toggle like on a post. */
export function toggleLike(id: string): void {
  _posts = _posts.map(p =>
    p.id === id
      ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
      : p
  );
  notify();
}

/** Generate a unique post ID. */
export function newPostId(): string {
  return `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Service emoji map keyed by provider category */
export const SERVICE_EMOJI: Record<string, string> = {
  hair:      '💇‍♀️',
  barber:    '💈',
  fitness:   '💪',
  massage:   '💆',
  esthetics: '🧖‍♀️',
  nails:     '💅',
  lashes:    '👁',
  makeup:    '💄',
  tattoo:    '🐉',
};
