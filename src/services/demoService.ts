import { nowIso } from '../lib/utils';
import { agreementService } from './agreementService';
import { localStore } from './localStore';
import type { UserProfile } from '../types';

export function ensureDemoData() {
  if (localStorage.getItem('agri.demoSeeded') === 'true') return;

  const users = localStore.getUsers();
  const demoUsers: UserProfile[] = [
    { id: 'demo-farmer-1', phone: '9000000001', name: 'Ramesh Patil', role: 'farmer', language: 'mr', createdAt: nowIso() },
    { id: 'demo-farmer-2', phone: '9000000002', name: 'Suresh Lal', role: 'farmer', language: 'hi', createdAt: nowIso() },
    { id: 'demo-farmer-3', phone: '9000000003', name: 'Kavita Mondal', role: 'farmer', language: 'bn', createdAt: nowIso() },
    { id: 'demo-agg-1', phone: '9000000011', name: 'Shree Agro Traders', role: 'aggregator', language: 'en', createdAt: nowIso() },
    { id: 'demo-agg-2', phone: '9000000012', name: 'Ravi Traders', role: 'aggregator', language: 'gu', createdAt: nowIso() },
  ];
  demoUsers.forEach((user) => {
    if (!users.find((entry) => entry.id === user.id)) users.push(user);
  });
  localStore.setUsers(users);

  const agreements = localStore.getAgreements();
  if (agreements.length < 5) {
    const base = {
      createdBy: 'demo-farmer-1',
      farmerId: 'demo-farmer-1',
      aggregatorId: 'demo-agg-1',
      otherPartyName: 'Shree Agro Traders',
      crop: 'Soybean',
      quantity: 50,
      unit: 'quintal',
      price: 5200,
      priceBasis: 'Per quintal',
      deliveryDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      paymentMethod: 'UPI',
      status: 'active' as const,
      quality: 'A Grade',
      lockedAt: nowIso(),
    };
    agreementService.create(base);
    agreementService.create({ ...base, crop: 'Wheat', quantity: 30, status: 'delivery_pending' });
    agreementService.create({ ...base, crop: 'Tomato', status: 'delivered' });
    agreementService.create({ ...base, crop: 'Cotton', status: 'completed' });
    agreementService.create({ ...base, crop: 'Onion', status: 'disputed' });
  }

  localStorage.setItem('agri.demoSeeded', 'true');
}
