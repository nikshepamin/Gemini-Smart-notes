import { supabase } from './supabaseClient';
import { User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No user returned');

    return {
      id: data.user.id,
      email: data.user.email || '',
      name: data.user.user_metadata?.full_name || email.split('@')[0],
    };
  },

  async signup(email: string, password: string, name: string): Promise<{ user: User; session: any }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No user returned');

    const user = {
      id: data.user.id,
      email: data.user.email || '',
      name: name,
    };

    return { user, session: data.session };
  },

  async verifyOtp(email: string, token: string): Promise<User> {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });

    if (error) throw new Error(error.message);
    if (!data.user || !data.session) throw new Error('Verification failed');

    return {
      id: data.user.id,
      email: data.user.email || '',
      name: data.user.user_metadata?.full_name || email.split('@')[0],
    };
  },

  async resendConfirmation(email: string): Promise<void> {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    if (error) throw new Error(error.message);
  },

  async logout() {
    await supabase.auth.signOut();
  },

  async getCurrentUser(): Promise<User | null> {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) return null;

    const user = data.session.user;
    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    };
  }
};