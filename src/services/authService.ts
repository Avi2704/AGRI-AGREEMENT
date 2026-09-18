import { nowIso } from '../lib/utils';
import { localStore } from './localStore';
import type { UserProfile, UserRole } from '../types';

export const authService = {
  sendOtp: async (_phone: string) => ({ success: true, otp: '123456' }),

  verifyOtp: async (phone: string, otp: string, role: UserRole, name: string, language = 'en') => {
    if (otp !== '123456') throw new Error('Invalid OTP');
    const users = localStore.getUsers();
    let user = users.find((item) => item.phone === phone);
    if (!user) {
      user = {
        id: crypto.randomUUID(),
        phone,
        name,
        role,
        language,
        createdAt: nowIso(),
      };
      users.push(user);
      localStore.setUsers(users);
    }
    localStorage.setItem('agri.currentUserId', user.id);
    return user;
  },

  currentUser: () => {
    const id = localStorage.getItem('agri.currentUserId');
    if (!id) return null;
    return localStore.getUsers().find((user) => user.id === id) ?? null;
  },

  logout: () => {
    localStorage.removeItem('agri.currentUserId');
  },

  updateUser: (profile: UserProfile) => {
    const users = localStore.getUsers().map((user) => (user.id === profile.id ? profile : user));
    localStore.setUsers(users);
  },
};
