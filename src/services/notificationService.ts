import { nowIso } from '../lib/utils';
import { localStore } from './localStore';

export const notificationService = {
  notify(userId: string, title: string, body: string) {
    const rows = localStore.getNotifications();
    rows.unshift({ id: crypto.randomUUID(), userId, title, body, read: false, createdAt: nowIso() });
    localStore.setNotifications(rows);
  },
  byUser(userId: string) {
    return localStore.getNotifications().filter((n) => n.userId === userId);
  },
  markRead(id: string) {
    const rows = localStore.getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
    localStore.setNotifications(rows);
  },
};
