import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from './supabase/server';
import { UserRole, Profile } from '../types';

/**
 * Get the currently authenticated user from Supabase Auth.
 */
export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the full Profile row for the currently authenticated user.
 */
export async function getUserProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !data) return null;
  return data as Profile;
}

/**
 * Get the user role for the currently authenticated user.
 */
export async function getUserRole(): Promise<UserRole | null> {
  const profile = await getUserProfile();
  return profile?.role ?? null;
}

/**
 * Ensure the current user has one of the allowed roles.
 * If not, redirects to /unauthorized.
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const role = await getUserRole();
  if (!role || !allowedRoles.includes(role)) {
    redirect('/unauthorized');
  }
}
