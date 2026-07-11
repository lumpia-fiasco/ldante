import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { authService, userService, supabase } from '../services/supabase';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface AppUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: 'customer' | 'provider' | null;
  location: string | null;
  bio: string | null;
  phone: string | null;
}

interface AuthContextValue {
  session: Session | null;
  user: AppUser | null;
  loading: boolean;             // true while checking initial session
  refreshUser: () => Promise<void>;
  updateUser: (data: Partial<AppUser>) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

// ─── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
  refreshUser: async () => {},
  updateUser: async () => ({ error: null }),
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

// ─── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the full user row from the `users` table
  const fetchUser = useCallback(async (uid: string, email: string) => {
    try {
      const { data, error } = await userService.getUser(uid);
      if (error || !data) {
        // Row may not exist yet (e.g. immediately after sign-up before trigger fires)
        // Fall back to minimal data from the auth session
        setUser({
          id: uid,
          email,
          full_name: '',
          avatar_url: null,
          role: null,
          location: null,
          bio: null,
          phone: null,
        });
        return;
      }
      setUser({
        id: data.id,
        email: data.email ?? email,
        full_name: data.full_name ?? '',
        avatar_url: data.avatar_url ?? null,
        role: data.role ?? null,
        location: data.location ?? null,
        bio: data.bio ?? null,
        phone: data.phone ?? null,
      });
    } catch {
      // Network error — keep previous user state
    }
  }, []);

  // Re-fetch user from Supabase (call this after saving edits)
  const refreshUser = useCallback(async () => {
    if (!session?.user) return;
    await fetchUser(session.user.id, session.user.email ?? '');
  }, [session, fetchUser]);

  // Update user in Supabase and refresh local state
  const updateUser = useCallback(async (data: Partial<AppUser>) => {
    if (!session?.user) return { error: new Error('Not authenticated') };
    const { error } = await supabase
      .from('users')
      .update({
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        role: data.role,
        location: data.location,
        bio: data.bio,
        phone: data.phone,
      })
      .eq('id', session.user.id);
    if (!error) {
      // Optimistically update local state immediately
      setUser(prev => prev ? { ...prev, ...data } : prev);
    }
    return { error };
  }, [session]);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
  }, []);

  // Subscribe to auth state changes on mount
  useEffect(() => {
    // Get the current session immediately (handles app resume / restart)
    authService.getSession().then(async ({ data }) => {
      const s = data.session;

      // Invalidate sessions issued before removed routes were deployed.
      // Users with stale cached sessions are signed out and land on Welcome.
      const ROUTES_CUTOFF = new Date('2026-07-11T00:00:00Z');
      const lastSignIn = s?.user?.last_sign_in_at
        ? new Date(s.user.last_sign_in_at)
        : null;

      if (s && lastSignIn && lastSignIn < ROUTES_CUTOFF) {
        await authService.signOut();
        setLoading(false);
        return;
      }

      setSession(s);
      if (s?.user) {
        fetchUser(s.user.id, s.user.email ?? '').finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for sign-in / sign-out events
    const { data: listener } = authService.onAuthStateChange((event, s) => {
      setSession(s);
      if (s?.user) {
        fetchUser(s.user.id, s.user.email ?? '');
      } else {
        setUser(null);
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ session, user, loading, refreshUser, updateUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
